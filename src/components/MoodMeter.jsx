import { useState, useEffect } from 'react';

const MOODS = [
  { key: 'amazing',    emoji: '😄', label: 'Amazing',    bg: '#2e7d32', text: '#fff' },
  { key: 'good',       emoji: '🙂', label: 'Good',       bg: '#00695c', text: '#fff' },
  { key: 'okay',       emoji: '😐', label: 'Okay',       bg: '#f9a825', text: '#071428' },
  { key: 'worried',    emoji: '😟', label: 'Worried',    bg: '#e65100', text: '#fff' },
  { key: 'frustrated', emoji: '😠', label: 'Frustrated', bg: '#c62828', text: '#fff' },
  { key: 'sleepy',     emoji: '😴', label: 'Sleepy',     bg: '#6a1b9a', text: '#fff' },
];

const STORAGE_KEY = 'dmcox26_mood_v1';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadCheckins() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayStr()) return {};
    return parsed.data || {};
  } catch { return {}; }
}

function saveCheckins(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayStr(), data }));
}

export default function MoodMeter({ students }) {
  const [phase, setPhase]           = useState('roster');
  const [selectedId, setSelectedId] = useState(null);
  const [checkins, setCheckins]     = useState(() => loadCheckins());
  // tick not needed — checkins object reference changes on every update

  function handleStudentClick(s) {
    if (checkins[s.id]) return; // already checked in
    setSelectedId(s.id);
    setPhase('mood');
  }

  function handleMoodSelect(moodKey) {
    const next = { ...checkins, [selectedId]: moodKey };
    setCheckins(next);
    saveCheckins(next);
    setSelectedId(null);
    const allDone = students.every(s => next[s.id]);
    setPhase(allDone ? 'done' : 'roster');
  }

  function handleReset() {
    setCheckins({});
    saveCheckins({});
    setPhase('roster');
    setSelectedId(null);
  }

  const selectedStudent = students.find(s => s.id === selectedId);
  const checkedCount = students.filter(s => checkins[s.id]).length;

  const wrap = {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #071428 0%, #0d2048 100%)',
    padding: '28px 20px 80px',
    fontFamily: "'Nunito',sans-serif",
  };

  const card = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    border: '1.5px solid rgba(253,185,39,0.25)',
    padding: '20px 22px',
    marginBottom: 20,
  };

  // ── ROSTER PHASE ──────────────────────────────────────────────
  if (phase === 'roster') return (
    <div style={wrap}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: 'clamp(1.5rem,4vw,2.2rem)',
          color: '#fdb927',
          marginBottom: 6,
        }}>Good Morning! 🌟</div>
        <div style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: 'clamp(1rem,3vw,1.4rem)',
          color: '#c5d8ff',
        }}>How are you feeling today?</div>
        <div style={{
          marginTop: 8,
          fontFamily: "'Nunito',sans-serif",
          color: '#7fa0cc',
          fontSize: '0.9rem',
        }}>{checkedCount} of {students.length} checked in</div>
      </div>

      {/* Student grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))',
        gap: 14,
        marginBottom: 28,
      }}>
        {students.map(s => {
          const moodKey = checkins[s.id];
          const mood    = MOODS.find(m => m.key === moodKey);
          const done    = !!moodKey;
          return (
            <button
              key={s.id}
              onClick={() => handleStudentClick(s)}
              disabled={done}
              style={{
                background: done ? 'rgba(255,255,255,0.04)' : 'rgba(13,32,72,0.9)',
                border: done
                  ? `2px solid ${mood?.bg || '#444'}`
                  : '2px solid rgba(253,185,39,0.4)',
                borderRadius: 18,
                padding: '14px 10px 12px',
                cursor: done ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6,
                opacity: done ? 0.7 : 1,
                transition: 'transform 0.15s, border-color 0.15s',
                transform: done ? 'none' : undefined,
              }}
              onMouseEnter={e => { if (!done) e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{s.avatar}</span>
              <span style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: '0.95rem',
                color: done ? '#aaa' : '#fff',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>{s.first || s.name}</span>
              {done && mood && (
                <span style={{ fontSize: '1.3rem' }}>{mood.emoji}</span>
              )}
              {!done && (
                <span style={{
                  fontSize: '0.7rem', color: '#fdb927',
                  fontWeight: 700,
                }}>Tap me!</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Summary chips */}
      <SummaryPanel students={students} checkins={checkins} />

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={handleReset}
          className="btn btn-navy"
          style={{
            fontFamily: "'Fredoka One',cursive",
            fontSize: '0.95rem',
            padding: '8px 22px',
            borderRadius: 12,
            border: '1.5px solid #fdb927',
            background: '#071428',
            color: '#fdb927',
            cursor: 'pointer',
          }}
        >↺ Reset Check-In</button>
      </div>
    </div>
  );

  // ── MOOD PHASE ────────────────────────────────────────────────
  if (phase === 'mood' && selectedStudent) return (
    <div style={wrap}>
      <button
        onClick={() => { setPhase('roster'); setSelectedId(null); }}
        style={{
          background: 'none', border: 'none', color: '#fdb927',
          fontFamily: "'Fredoka One',cursive", fontSize: '1rem',
          cursor: 'pointer', marginBottom: 18, display: 'flex',
          alignItems: 'center', gap: 6,
        }}
      >← Back</button>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: '4rem', lineHeight: 1, marginBottom: 8 }}>
          {selectedStudent.avatar}
        </div>
        <div style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: '1.8rem', color: '#fdb927',
        }}>{selectedStudent.first || selectedStudent.name}</div>
        <div style={{
          fontFamily: "'Nunito',sans-serif",
          color: '#c5d8ff', fontSize: '1rem', marginTop: 4,
        }}>How are you feeling right now?</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
        maxWidth: 420,
        margin: '0 auto 32px',
      }}>
        {MOODS.map(m => (
          <button
            key={m.key}
            onClick={() => handleMoodSelect(m.key)}
            style={{
              background: m.bg,
              color: m.text,
              border: 'none',
              borderRadius: 20,
              padding: '18px 12px',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
              boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>{m.emoji}</span>
            <span style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: '1.1rem',
            }}>{m.label}</span>
          </button>
        ))}
      </div>

      <SummaryPanel students={students} checkins={checkins} />
    </div>
  );

  // ── DONE PHASE ────────────────────────────────────────────────
  if (phase === 'done') return (
    <div style={wrap}>
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        ...card,
        maxWidth: 500,
        margin: '0 auto 28px',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>🎉</div>
        <div style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: '2rem', color: '#fdb927',
          marginBottom: 10,
        }}>Everyone Checked In!</div>
        <div style={{
          fontFamily: "'Nunito',sans-serif",
          color: '#c5d8ff', fontSize: '1.05rem',
          marginBottom: 24, lineHeight: 1.5,
        }}>Great job, Bear Cubs! 🐻<br/>Let's have an amazing day!</div>
        <button
          onClick={handleReset}
          style={{
            background: '#fdb927', color: '#071428',
            border: 'none', borderRadius: 14,
            padding: '10px 28px',
            fontFamily: "'Fredoka One',cursive",
            fontSize: '1.05rem', cursor: 'pointer',
          }}
        >↺ Start New Check-In</button>
      </div>
      <SummaryPanel students={students} checkins={checkins} />
    </div>
  );

  return null;
}

function SummaryPanel({ students, checkins }) {
  return (
    <div style={{
      background: 'rgba(7,20,40,0.8)',
      borderRadius: 16,
      border: '1px solid rgba(253,185,39,0.2)',
      padding: '14px 16px',
      maxWidth: 640,
      margin: '0 auto',
    }}>
      <div style={{
        fontFamily: "'Fredoka One',cursive",
        color: '#fdb927', fontSize: '0.9rem',
        marginBottom: 10, letterSpacing: 0.5,
      }}>TEACHER SUMMARY</div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
      }}>
        {students.map(s => {
          const moodKey = checkins[s.id];
          const mood    = MOODS.find(m => m.key === moodKey);
          return (
            <div key={s.id} style={{
              background: mood ? mood.bg + '33' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${mood ? mood.bg : '#334'}`,
              borderRadius: 20,
              padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ fontSize: '0.9rem' }}>{s.avatar}</span>
              <span style={{
                fontFamily: "'Nunito',sans-serif",
                fontSize: '0.78rem', color: '#ddd',
                fontWeight: 700,
              }}>{s.first || s.name.split(' ')[0]}</span>
              <span style={{ fontSize: '0.9rem' }}>
                {mood ? mood.emoji : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
