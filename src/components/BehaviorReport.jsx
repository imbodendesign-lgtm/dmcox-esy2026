import { useState } from 'react';

const DEFAULT_BEHAVIORS = [
  'Stayed on Task',
  'Followed Directions',
  'Used Kind Words',
  'Kept Hands to Myself',
  'Participated in Activities',
  'Completed Work',
];

const PERIODS = ['Morning', 'After Lunch', 'Afternoon'];
const RATINGS  = ['✓', '~', '✗'];
const RATING_COLORS = { '✓': '#2e7d32', '~': '#f9a825', '✗': '#c62828' };
const RATING_BG     = { '✓': '#e8f5e9', '~': '#fffde7', '✗': '#ffebee' };
const RATING_LABELS = { '✓': 'Great', '~': 'Okay', '✗': 'Needs Work' };

function todayFormatted() {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
  @page { size: letter portrait; margin: 0.5in; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Nunito', sans-serif; margin: 0; padding: 0; background: #fff; color: #111; }
  .cert-header { text-align: center; border-bottom: 3px solid #0d2048; padding-bottom: 12px; margin-bottom: 16px; }
  .school-name { font-family: 'Fredoka One', cursive; font-size: 1.05rem; color: #0d2048; margin: 0 0 2px; }
  .report-title { font-family: 'Fredoka One', cursive; font-size: 1.6rem; color: #fdb927; margin: 0; }
  .student-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; background: #f0f4ff; border-radius: 10px; padding: 10px 14px; }
  .student-avatar { font-size: 2.4rem; }
  .student-name { font-family: 'Fredoka One', cursive; font-size: 1.5rem; color: #0d2048; }
  .student-date { font-size: 0.85rem; color: #555; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { background: #0d2048; color: #fdb927; font-family: 'Fredoka One', cursive; font-size: 0.9rem; padding: 8px 10px; text-align: center; }
  th.beh-col { text-align: left; }
  td { padding: 7px 10px; border: 1px solid #dde; font-size: 0.85rem; vertical-align: middle; }
  td.beh-label { font-weight: 700; color: #0d2048; background: #f8f9ff; }
  td.rating { text-align: center; font-size: 1.1rem; font-weight: 700; }
  td.great { background: #e8f5e9; color: #2e7d32; }
  td.okay  { background: #fffde7; color: #f57f17; }
  td.needs { background: #ffebee; color: #c62828; }
  .notes-section { margin-bottom: 16px; }
  .notes-label { font-family: 'Fredoka One', cursive; color: #0d2048; font-size: 1rem; margin-bottom: 6px; }
  .notes-box { border: 1.5px solid #ccd; border-radius: 8px; min-height: 72px; padding: 8px 12px; font-size: 0.85rem; color: #222; white-space: pre-wrap; }
  .sig-row { display: flex; gap: 24px; margin-top: 10px; }
  .sig-block { flex: 1; border-top: 1.5px solid #0d2048; padding-top: 6px; }
  .sig-label { font-size: 0.8rem; color: #444; font-weight: 700; }
  .footer-bar { text-align: center; margin-top: 18px; font-size: 0.75rem; color: #888; border-top: 1px solid #eee; padding-top: 8px; }
  .legend { display: flex; gap: 14px; margin-bottom: 12px; }
  .leg-item { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; font-weight: 700; }
  .leg-dot { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
`;

function ratingClass(r) {
  if (r === '✓') return 'great';
  if (r === '~')  return 'okay';
  if (r === '✗')  return 'needs';
  return '';
}

export default function BehaviorReport({ students }) {
  const [selectedId,  setSelectedId]  = useState(null);
  const [mode,        setMode]        = useState('daily'); // 'daily'|'weekly'
  const [date,        setDate]        = useState(isoToday());
  const [behaviors,   setBehaviors]   = useState([...DEFAULT_BEHAVIORS]);
  const [newBeh,      setNewBeh]      = useState('');
  // ratings[behavior][period] = '✓'|'~'|'✗'|''
  const [ratings,     setRatings]     = useState({});
  const [notes,       setNotes]       = useState('');

  const student = students.find(s => s.id === selectedId);

  function cycleRating(beh, period) {
    const key  = `${beh}||${period}`;
    const cur  = ratings[key] || '';
    const next = cur === '' ? '✓' : cur === '✓' ? '~' : cur === '~' ? '✗' : '';
    setRatings(r => ({ ...r, [key]: next }));
  }

  function getRating(beh, period) {
    return ratings[`${beh}||${period}`] || '';
  }

  function addBehavior() {
    if (newBeh.trim()) {
      setBehaviors(b => [...b, newBeh.trim()]);
      setNewBeh('');
    }
  }

  function removeBehavior(i) {
    setBehaviors(b => b.filter((_, idx) => idx !== i));
  }

  function handlePrint() {
    if (!student) return;
    const displayDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    const tableRows = behaviors.map(beh => {
      const cells = PERIODS.map(p => {
        const r = getRating(beh, p);
        const cls = ratingClass(r);
        const lbl = r ? `${r} ${RATING_LABELS[r] || ''}` : '—';
        return `<td class="rating ${cls}">${lbl}</td>`;
      }).join('');
      return `<tr><td class="beh-label">${beh}</td>${cells}</tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Behavior Report – ${student.name}</title>
<style>${PRINT_CSS}</style></head><body>
<div class="cert-header">
  <div class="school-name">🐻 David M. Cox Elementary · ESY 2026 Bear Cubs · Henderson, NV</div>
  <div class="report-title">Daily Behavior Report</div>
</div>
<div class="student-row">
  <div class="student-avatar">${student.avatar}</div>
  <div>
    <div class="student-name">${student.name}</div>
    <div class="student-date">${displayDate}</div>
  </div>
</div>
<div class="legend">
  <div class="leg-item"><div class="leg-dot" style="background:#e8f5e9;color:#2e7d32">✓</div> Great</div>
  <div class="leg-item"><div class="leg-dot" style="background:#fffde7;color:#f57f17">~</div> Okay</div>
  <div class="leg-item"><div class="leg-dot" style="background:#ffebee;color:#c62828">✗</div> Needs Work</div>
</div>
<table>
  <thead>
    <tr>
      <th class="beh-col" style="width:38%">Behavior Goal</th>
      ${PERIODS.map(p => `<th>${p}</th>`).join('')}
    </tr>
  </thead>
  <tbody>${tableRows}</tbody>
</table>
<div class="notes-section">
  <div class="notes-label">📝 Teacher Notes</div>
  <div class="notes-box">${notes || ' '}</div>
</div>
<div class="sig-row">
  <div class="sig-block"><div class="sig-label">Teacher Signature &amp; Date</div></div>
  <div class="sig-block"><div class="sig-label">Parent/Guardian Signature &amp; Date</div></div>
  <div class="sig-block"><div class="sig-label">Parent Initials (Received)</div></div>
</div>
<div class="footer-bar">David M. Cox Elementary School · ESY Summer 2026 · Bear Cubs Class</div>
</body></html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 600);
  }

  // ── styles ──────────────────────────────────────────────────
  const wrap = {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #071428 0%, #0d2048 100%)',
    padding: '28px 20px 60px',
    fontFamily: "'Nunito',sans-serif",
  };

  const card = {
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid rgba(253,185,39,0.2)',
    borderRadius: 18,
    padding: '18px 20px',
    marginBottom: 18,
  };

  return (
    <div style={wrap}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: 'clamp(1.4rem,4vw,2rem)',
          color: '#fdb927',
        }}>🖨️ Behavior Report</div>
        <div style={{ color: '#7fa0cc', fontSize: '0.9rem', marginTop: 4 }}>
          David M. Cox Elementary · ESY 2026 Bear Cubs
        </div>
      </div>

      {/* Step 1: Pick Student */}
      <div style={card}>
        <div style={{
          fontFamily: "'Fredoka One',cursive", color: '#fdb927',
          fontSize: '1rem', marginBottom: 12,
        }}>Step 1 — Select Student</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))',
          gap: 10,
        }}>
          {students.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id === selectedId ? null : s.id)}
              style={{
                background: selectedId === s.id ? '#fdb927' : 'rgba(13,32,72,0.8)',
                border: selectedId === s.id ? '2px solid #fdb927' : '2px solid rgba(253,185,39,0.3)',
                borderRadius: 14,
                padding: '12px 8px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 5,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '2rem' }}>{s.avatar}</span>
              <span style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: '0.82rem',
                color: selectedId === s.id ? '#071428' : '#fff',
                textAlign: 'center',
              }}>{s.first || s.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Date + Mode */}
      <div style={card}>
        <div style={{
          fontFamily: "'Fredoka One',cursive", color: '#fdb927',
          fontSize: '1rem', marginBottom: 12,
        }}>Step 2 — Date</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              background: '#071428', color: '#fff',
              border: '1.5px solid #fdb927', borderRadius: 10,
              padding: '7px 12px',
              fontFamily: "'Nunito',sans-serif", fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Step 3: Behavior Ratings */}
      <div style={card}>
        <div style={{
          fontFamily: "'Fredoka One',cursive", color: '#fdb927',
          fontSize: '1rem', marginBottom: 14,
        }}>Step 3 — Rate Behaviors</div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
          {RATINGS.map(r => (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                background: RATING_BG[r], color: RATING_COLORS[r],
                borderRadius: 8, width: 28, height: 28,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1rem',
              }}>{r}</span>
              <span style={{ color: '#aac', fontSize: '0.8rem', fontWeight: 700 }}>
                {RATING_LABELS[r]}
              </span>
            </div>
          ))}
          <span style={{ color: '#666', fontSize: '0.78rem', alignSelf: 'center' }}>
            (Tap cell to cycle)
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{
                  background: '#0d2048', color: '#fdb927',
                  fontFamily: "'Fredoka One',cursive", fontSize: '0.85rem',
                  padding: '8px 10px', textAlign: 'left',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>Behavior</th>
                {PERIODS.map(p => (
                  <th key={p} style={{
                    background: '#0d2048', color: '#fdb927',
                    fontFamily: "'Fredoka One',cursive", fontSize: '0.85rem',
                    padding: '8px 10px', textAlign: 'center', minWidth: 90,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>{p}</th>
                ))}
                <th style={{
                  background: '#0d2048', color: '#555',
                  fontSize: '0.75rem', padding: '8px 6px', textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}></th>
              </tr>
            </thead>
            <tbody>
              {behaviors.map((beh, i) => (
                <tr key={i}>
                  <td style={{
                    padding: '8px 10px',
                    color: '#dde',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(13,32,72,0.5)',
                  }}>{beh}</td>
                  {PERIODS.map(p => {
                    const r = getRating(beh, p);
                    return (
                      <td key={p}
                        onClick={() => cycleRating(beh, p)}
                        style={{
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: r ? RATING_BG[r] + '33' : 'rgba(255,255,255,0.03)',
                          color: r ? RATING_COLORS[r] : '#445',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          border: '1px solid rgba(255,255,255,0.08)',
                          transition: 'background 0.15s',
                          userSelect: 'none',
                        }}
                      >{r || '—'}</td>
                    );
                  })}
                  <td style={{
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <button
                      onClick={() => removeBehavior(i)}
                      title="Remove"
                      style={{
                        background: 'none', border: 'none',
                        color: '#553', cursor: 'pointer', fontSize: '0.9rem',
                        padding: '0 4px',
                      }}
                    >✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add behavior */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <input
            value={newBeh}
            onChange={e => setNewBeh(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addBehavior()}
            placeholder="Add behavior goal..."
            style={{
              flex: 1, background: '#071428', color: '#fff',
              border: '1.5px solid rgba(253,185,39,0.3)',
              borderRadius: 10, padding: '7px 12px',
              fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            onClick={addBehavior}
            style={{
              background: '#fdb927', color: '#071428',
              border: 'none', borderRadius: 10,
              padding: '7px 16px',
              fontFamily: "'Fredoka One',cursive",
              fontSize: '0.9rem', cursor: 'pointer',
            }}
          >+ Add</button>
        </div>
      </div>

      {/* Step 4: Notes */}
      <div style={card}>
        <div style={{
          fontFamily: "'Fredoka One',cursive", color: '#fdb927',
          fontSize: '1rem', marginBottom: 10,
        }}>Step 4 — Notes</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional teacher notes..."
          rows={3}
          style={{
            width: '100%', background: '#071428', color: '#dde',
            border: '1.5px solid rgba(253,185,39,0.3)',
            borderRadius: 12, padding: '10px 14px',
            fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem',
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Print Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handlePrint}
          disabled={!student}
          style={{
            background: student ? '#fdb927' : '#333',
            color: student ? '#071428' : '#666',
            border: 'none', borderRadius: 16,
            padding: '13px 36px',
            fontFamily: "'Fredoka One',cursive",
            fontSize: '1.15rem', cursor: student ? 'pointer' : 'not-allowed',
            boxShadow: student ? '0 4px 16px rgba(253,185,39,0.4)' : 'none',
            transition: 'all 0.2s',
          }}
        >🖨️ Print Report</button>
        {!student && (
          <div style={{ color: '#666', fontSize: '0.8rem', marginTop: 8 }}>
            Select a student first
          </div>
        )}
      </div>
    </div>
  );
}
