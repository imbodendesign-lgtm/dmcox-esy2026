import { useState, useCallback } from 'react';
import { STUDENT_DATA, COLORS, AVATARS } from './index';

const STORAGE_KEY = 'dmcox26v4';

function initStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).map(s=>({purchases:[],...s}));
  } catch {}
  return STUDENT_DATA.map((s, i) => ({
    id: i + 1,
    first: s.first,
    last: s.last,
    sid: s.sid,
    grade: s.grade,
    name: s.first,
    points: 0,
    rewards: 0,
    avatar: AVATARS[i % AVATARS.length],
    color: COLORS[i % COLORS.length],
    purchases: [],
  }));
}

export function useStudents() {
  const [students, setStudents] = useState(initStudents);

  const save = useCallback((next) => {
    setStudents(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const addPoints = useCallback((id, delta, _emoji, item) => {
    setStudents(prev => {
      const next = prev.map(s => {
        if (s.id !== id) return s;
        const purchases = item && delta < 0
          ? [...(s.purchases||[]), {icon:item.icon,name:item.name,cost:item.cost,at:Date.now()}]
          : (s.purchases||[]);
        return { ...s, points: Math.max(0, s.points + delta), purchases };
      });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const addToAll = useCallback((delta) => {
    setStudents(prev => {
      const next = prev.map(s => ({ ...s, points: Math.max(0, s.points + delta) }));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const updateStudent = useCallback((id, patch) => {
    setStudents(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...patch } : s);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setStudents(prev => {
      const next = prev.map(s => ({ ...s, points: 0, rewards: 0 }));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const addStudent = useCallback((name) => {
    setStudents(prev => {
      const id = Date.now();
      const idx = prev.length;
      const next = [...prev, {
        id, name, first: name, last: '', sid: '', grade: 5,
        points: 0, rewards: 0,
        avatar: AVATARS[idx % AVATARS.length],
        color: COLORS[idx % COLORS.length],
      }];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { students, addPoints, addToAll, updateStudent, resetAll, addStudent };
}
