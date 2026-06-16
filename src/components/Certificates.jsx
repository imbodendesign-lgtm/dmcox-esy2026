import { useState } from 'react';

const CERT_TYPES = [
  { id: 'star_day',      icon: '⭐', name: 'Star of the Day',     subtitle: 'showed outstanding effort and attitude!',                  color: '#fdb927' },
  { id: 'most_improved', icon: '📈', name: 'Most Improved',        subtitle: 'demonstrated incredible growth and progress!',             color: '#4d96ff' },
  { id: 'mvp',           icon: '🏆', name: 'Bear Cub MVP',         subtitle: 'went above and beyond for our class community!',           color: '#cc5de8' },
  { id: 'great_effort',  icon: '💪', name: 'Great Effort',         subtitle: 'never gave up and kept trying their best!',               color: '#6bcb77' },
  { id: 'reading_star',  icon: '📖', name: 'Reading Star',         subtitle: 'showed amazing reading skills today!',                    color: '#ff922b' },
  { id: 'math_whiz',     icon: '🔢', name: 'Math Whiz',            subtitle: 'solved math challenges like a champion!',                 color: '#20c997' },
  { id: 'kind_heart',    icon: '💛', name: 'Kind Heart Award',     subtitle: 'showed exceptional kindness to classmates!',              color: '#f06595' },
  { id: 'roar_award',    icon: '🐻', name: 'ROAR Award',           subtitle: 'Responsible, Outstanding, Awesome, Respectful!',          color: '#ff6b6b' },
];

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function niceDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
  @page { size: landscape; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: 'Nunito', sans-serif; margin: 0; padding: 0; width: 11in; height: 8.5in; overflow: hidden; }
  .cert-page {
    width: 11in; height: 8.5in;
    display: flex; align-items: center; justify-content: center;
    background: VAR_BG;
  }
  .cert-inner {
    width: 9.8in; height: 7.3in;
    border: 6px double VAR_COLOR;
    border-radius: 24px;
    background: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 0.3in 0.5in;
    position: relative;
    box-shadow: 0 0 0 10px rgba(VAR_RGB, 0.08);
  }
  .cert-deco-tl, .cert-deco-tr, .cert-deco-bl, .cert-deco-br {
    position: absolute; font-size: 1.4rem; opacity: 0.35;
  }
  .cert-deco-tl { top: 14px; left: 18px; }
  .cert-deco-tr { top: 14px; right: 18px; }
  .cert-deco-bl { bottom: 14px; left: 18px; }
  .cert-deco-br { bottom: 14px; right: 18px; }
  .cert-school {
    font-family: 'Fredoka One', cursive;
    font-size: 0.85rem;
    color: #555;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 4px;
    text-align: center;
  }
  .cert-headline {
    font-family: 'Fredoka One', cursive;
    font-size: 1.9rem;
    color: #0d2048;
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .cert-divider {
    width: 6in;
    height: 3px;
    background: linear-gradient(90deg, transparent, VAR_COLOR, transparent);
    margin: 6px 0 10px;
  }
  .cert-type-icon { font-size: 3.5rem; line-height: 1; margin-bottom: 2px; }
  .cert-type-name {
    font-family: 'Fredoka One', cursive;
    font-size: 2.2rem;
    color: VAR_COLOR;
    text-align: center;
    margin-bottom: 12px;
    text-shadow: 0 2px 8px rgba(VAR_RGB, 0.18);
  }
  .cert-presented {
    font-size: 0.9rem;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    margin-bottom: 4px;
    text-align: center;
  }
  .cert-avatar { font-size: 3.2rem; line-height: 1; margin-bottom: 4px; }
  .cert-student-name {
    font-family: 'Fredoka One', cursive;
    font-size: 3rem;
    color: #0d2048;
    text-align: center;
    line-height: 1.1;
    margin-bottom: 8px;
  }
  .cert-subtitle {
    font-size: 1rem;
    color: #444;
    font-style: italic;
    font-weight: 600;
    text-align: center;
    max-width: 7in;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  .cert-roar-line {
    font-size: 0.82rem;
    color: #777;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }
  .cert-bottom-row {
    display: flex;
    align-items: flex-end;
    gap: 0.6in;
    margin-top: 4px;
  }
  .cert-sig-block {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .cert-date-val {
    font-family: 'Fredoka One', cursive;
    font-size: 0.95rem;
    color: #0d2048;
  }
  .cert-sig-line {
    width: 1.8in;
    border-top: 1.5px solid #0d2048;
    margin-bottom: 2px;
  }
  .cert-sig-label { font-size: 0.72rem; color: #888; font-weight: 700; text-align: center; }
  .cert-stars {
    font-size: 1.2rem;
    letter-spacing: 6px;
    opacity: 0.4;
    margin-top: 4px;
  }
`;

export default function Certificates({ students }) {
  const [step,       setStep]       = useState(1); // 1=pick cert, 2=pick student, 3=preview
  const [certId,     setCertId]     = useState(null);
  const [studentId,  setStudentId]  = useState(null);
  const [date,       setDate]       = useState(isoToday());
  const [customMsg,  setCustomMsg]  = useState('');

  const cert    = CERT_TYPES.find(c => c.id === certId);
  const student = students.find(s => s.id === studentId);

  function handleCertPick(c) {
    setCertId(c.id);
    setStep(2);
  }

  function handleStudentPick(s) {
    setStudentId(s.id);
    setStep(3);
  }

  function handleStartOver() {
    setCertId(null);
    setStudentId(null);
    setCustomMsg('');
    setStep(1);
  }

  function handlePrint() {
    if (!cert || !student) return;
    const subtitle = customMsg.trim() || cert.subtitle;
    const rgb      = hexToRgb(cert.color);
    const bgColor  = cert.color + '18';

    const css = PRINT_CSS
      .replace(/VAR_COLOR/g, cert.color)
      .replace(/VAR_RGB/g, rgb)
      .replace(/VAR_BG/g, bgColor);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Certificate – ${student.name}</title>
<style>${css}</style></head><body>
<div class="cert-page">
  <div class="cert-inner">
    <div class="cert-deco-tl">⭐🐻</div>
    <div class="cert-deco-tr">🐻⭐</div>
    <div class="cert-deco-bl">✨🌟</div>
    <div class="cert-deco-br">🌟✨</div>

    <div class="cert-school">🐻 David M. Cox Elementary · ESY 2026 Bear Cubs · Henderson, NV</div>
    <div class="cert-headline">Certificate of Achievement</div>
    <div class="cert-divider"></div>

    <div class="cert-type-icon">${cert.icon}</div>
    <div class="cert-type-name">${cert.name}</div>

    <div class="cert-presented">Presented to:</div>
    <div class="cert-avatar">${student.avatar}</div>
    <div class="cert-student-name">${student.name}</div>
    <div class="cert-subtitle">${subtitle}</div>
    <div class="cert-roar-line">For demonstrating the ROAR values of our Bear Cubs community!</div>

    <div class="cert-stars">⭐ ⭐ ⭐ ⭐ ⭐</div>

    <div class="cert-bottom-row">
      <div class="cert-sig-block">
        <div class="cert-date-val">${niceDate(date)}</div>
        <div class="cert-sig-line"></div>
        <div class="cert-sig-label">Date</div>
      </div>
      <div class="cert-sig-block">
        <div class="cert-sig-line"></div>
        <div class="cert-sig-label">Teacher Signature</div>
      </div>
    </div>
  </div>
</div>
</body></html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 700);
  }

  // ── shared styles ────────────────────────────────────────────
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

  const secHead = {
    fontFamily: "'Fredoka One',cursive",
    color: '#fdb927',
    fontSize: '1rem',
    marginBottom: 14,
  };

  return (
    <div style={wrap}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: 'clamp(1.4rem,4vw,2rem)',
          color: '#fdb927',
        }}>🏅 Achievement Certificates</div>
        <div style={{ color: '#7fa0cc', fontSize: '0.9rem', marginTop: 4 }}>
          Bear Cubs · ESY 2026
        </div>
        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: step >= n ? '#fdb927' : '#1a3060',
              color: step >= n ? '#071428' : '#445',
              fontFamily: "'Fredoka One',cursive",
              fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: step === n ? '2px solid #fff' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>{n}</div>
          ))}
        </div>
      </div>

      {/* STEP 1: Pick Cert Type */}
      <div style={card}>
        <div style={secHead}>
          {step === 1 ? '👇 ' : '✓ '}Step 1 — Choose Certificate Type
          {cert && step > 1 && (
            <span style={{
              color: '#c5d8ff', fontFamily: "'Nunito',sans-serif",
              fontWeight: 700, fontSize: '0.85rem', marginLeft: 10,
            }}>
              {cert.icon} {cert.name}
              <button onClick={() => { setCertId(null); setStudentId(null); setStep(1); }} style={{
                background: 'none', border: 'none', color: '#fdb927',
                cursor: 'pointer', fontSize: '0.8rem', marginLeft: 6,
              }}>change</button>
            </span>
          )}
        </div>
        {step === 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
            gap: 12,
          }}>
            {CERT_TYPES.map(c => (
              <button
                key={c.id}
                onClick={() => handleCertPick(c)}
                style={{
                  background: `${c.color}22`,
                  border: `2px solid ${c.color}66`,
                  borderRadius: 16,
                  padding: '14px 10px',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${c.color}44`;
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.borderColor = c.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${c.color}22`;
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = `${c.color}66`;
                }}
              >
                <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{c.icon}</span>
                <span style={{
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: '0.9rem', color: '#fff',
                  textAlign: 'center', lineHeight: 1.2,
                }}>{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* STEP 2: Pick Student */}
      {step >= 2 && (
        <div style={card}>
          <div style={secHead}>
            {step === 2 ? '👇 ' : '✓ '}Step 2 — Select Student
            {student && step > 2 && (
              <span style={{
                color: '#c5d8ff', fontFamily: "'Nunito',sans-serif",
                fontWeight: 700, fontSize: '0.85rem', marginLeft: 10,
              }}>
                {student.avatar} {student.name}
                <button onClick={() => { setStudentId(null); setStep(2); }} style={{
                  background: 'none', border: 'none', color: '#fdb927',
                  cursor: 'pointer', fontSize: '0.8rem', marginLeft: 6,
                }}>change</button>
              </span>
            )}
          </div>
          {step === 2 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))',
              gap: 10,
            }}>
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleStudentPick(s)}
                  style={{
                    background: 'rgba(13,32,72,0.8)',
                    border: '2px solid rgba(253,185,39,0.3)',
                    borderRadius: 14,
                    padding: '12px 8px',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 5,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#fdb927';
                    e.currentTarget.style.transform = 'scale(1.04)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(253,185,39,0.3)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{s.avatar}</span>
                  <span style={{
                    fontFamily: "'Fredoka One',cursive",
                    fontSize: '0.82rem', color: '#fff',
                    textAlign: 'center',
                  }}>{s.first || s.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Preview + Print */}
      {step === 3 && cert && student && (
        <div style={card}>
          <div style={secHead}>Step 3 — Preview &amp; Print</div>

          {/* Mini preview */}
          <div style={{
            background: `linear-gradient(135deg, ${cert.color}15, ${cert.color}05)`,
            border: `3px double ${cert.color}`,
            borderRadius: 16,
            padding: '20px 24px',
            textAlign: 'center',
            marginBottom: 18,
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 8, left: 12, fontSize: '1rem', opacity: 0.3 }}>⭐🐻</div>
            <div style={{ position: 'absolute', top: 8, right: 12, fontSize: '1rem', opacity: 0.3 }}>🐻⭐</div>

            <div style={{
              fontFamily: "'Nunito',sans-serif",
              fontSize: '0.7rem', color: '#7fa0cc',
              textTransform: 'uppercase', letterSpacing: 1.5,
              marginBottom: 4,
            }}>🐻 David M. Cox Elementary · ESY 2026 Bear Cubs</div>

            <div style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: '1.2rem', color: '#c5d8ff',
              letterSpacing: 1.5, textTransform: 'uppercase',
              marginBottom: 6,
            }}>Certificate of Achievement</div>

            <div style={{
              width: '80%', height: 2, margin: '0 auto 10px',
              background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)`,
            }}></div>

            <div style={{ fontSize: '2.2rem', lineHeight: 1, marginBottom: 2 }}>{cert.icon}</div>
            <div style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: '1.5rem', color: cert.color,
              marginBottom: 10,
            }}>{cert.name}</div>

            <div style={{ color: '#7fa0cc', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>
              PRESENTED TO:
            </div>
            <div style={{ fontSize: '2rem', lineHeight: 1, marginBottom: 4 }}>{student.avatar}</div>
            <div style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: '1.8rem', color: '#fff',
              marginBottom: 8, lineHeight: 1.1,
            }}>{student.name}</div>
            <div style={{
              color: '#aac', fontSize: '0.82rem', fontStyle: 'italic',
              fontWeight: 600, maxWidth: 380, margin: '0 auto 6px',
              lineHeight: 1.4,
            }}>{customMsg.trim() || cert.subtitle}</div>
            <div style={{ color: '#7fa0cc', fontSize: '0.72rem', marginBottom: 10 }}>
              For demonstrating the ROAR values of our Bear Cubs community!
            </div>
            <div style={{ color: cert.color, fontSize: '0.9rem', letterSpacing: 6, opacity: 0.5 }}>
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 32,
              marginTop: 10, paddingTop: 10,
              borderTop: `1px solid ${cert.color}40`,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Fredoka One',cursive",
                  color: '#fff', fontSize: '0.8rem',
                }}>{niceDate(date)}</div>
                <div style={{ color: '#7fa0cc', fontSize: '0.65rem', fontWeight: 700 }}>Date</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 120, borderTop: `1.5px solid ${cert.color}80`,
                  marginBottom: 2,
                }}></div>
                <div style={{ color: '#7fa0cc', fontSize: '0.65rem', fontWeight: 700 }}>Teacher Signature</div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div style={{ flex: '1 1 180px' }}>
              <div style={{
                fontFamily: "'Fredoka One',cursive",
                color: '#fdb927', fontSize: '0.85rem', marginBottom: 6,
              }}>Date</div>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  background: '#071428', color: '#fff',
                  border: '1.5px solid rgba(253,185,39,0.4)',
                  borderRadius: 10, padding: '7px 12px',
                  fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem',
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ flex: '2 1 240px' }}>
              <div style={{
                fontFamily: "'Fredoka One',cursive",
                color: '#fdb927', fontSize: '0.85rem', marginBottom: 6,
              }}>Custom Message (optional)</div>
              <input
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder={cert.subtitle}
                style={{
                  background: '#071428', color: '#fff',
                  border: '1.5px solid rgba(253,185,39,0.3)',
                  borderRadius: 10, padding: '7px 12px',
                  fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem',
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#fdb927', color: '#071428',
                border: 'none', borderRadius: 14,
                padding: '12px 30px',
                fontFamily: "'Fredoka One',cursive",
                fontSize: '1.1rem', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(253,185,39,0.4)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >🖨️ Print Certificate</button>

            <button
              onClick={handleStartOver}
              style={{
                background: 'none',
                border: '1.5px solid rgba(253,185,39,0.4)',
                borderRadius: 14,
                padding: '12px 22px',
                fontFamily: "'Fredoka One',cursive",
                fontSize: '1rem', cursor: 'pointer',
                color: '#fdb927',
              }}
            >← Start Over</button>
          </div>
        </div>
      )}
    </div>
  );
}
