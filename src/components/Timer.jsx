import { useState, useEffect, useRef } from 'react';

const PRESETS = [
  { label: '1 Min',  secs: 60 },
  { label: '2 Min',  secs: 120 },
  { label: '5 Min',  secs: 300 },
  { label: '10 Min', secs: 600 },
  { label: '15 Min', secs: 900 },
  { label: '20 Min', secs: 1200 },
  { label: '30 Min', secs: 1800 },
];

function fmt(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Timer({ onClose }) {
  const [totalSecs, setTotalSecs]   = useState(300);
  const [remaining, setRemaining]   = useState(300);
  const [running, setRunning]       = useState(false);
  const [custom, setCustom]         = useState('');
  const [presetLabel, setPresetLabel] = useState('5 Min');
  const [flash, setFlash]           = useState(false);
  const [timesUp, setTimesUp]       = useState(false);
  const intervalRef = useRef(null);
  const flashRef    = useRef(null);

  // Tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setTimesUp(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  // Flash alarm when timesUp
  useEffect(() => {
    if (timesUp) {
      let count = 0;
      flashRef.current = setInterval(() => {
        setFlash(f => !f);
        count++;
        if (count > 12) clearInterval(flashRef.current);
      }, 400);
    }
    return () => clearInterval(flashRef.current);
  }, [timesUp]);

  const pct = totalSecs > 0 ? remaining / totalSecs : 0;
  const R = 90;
  const circ = 2 * Math.PI * R;
  const dash = circ * pct;

  let ringColor = '#4caf50';
  if (pct <= 0.5 && pct > 0.25) ringColor = '#fdb927';
  if (pct <= 0.25) ringColor = '#e53935';
  if (timesUp) ringColor = '#e53935';

  const pulse = remaining > 0 && remaining <= 60 && running;

  function applyPreset(p) {
    setTotalSecs(p.secs);
    setRemaining(p.secs);
    setRunning(false);
    setTimesUp(false);
    setPresetLabel(p.label);
    setFlash(false);
  }

  function handleReset() {
    setRemaining(totalSecs);
    setRunning(false);
    setTimesUp(false);
    setFlash(false);
  }

  function handleCustomSet() {
    const v = parseInt(custom, 10);
    if (!v || v < 1) return;
    const s = v * 60;
    setTotalSecs(s);
    setRemaining(s);
    setRunning(false);
    setTimesUp(false);
    setPresetLabel(`${v} Min`);
    setFlash(false);
    setCustom('');
  }

  const borderStyle = timesUp && flash
    ? '3px solid #e53935'
    : '3px solid #fdb927';

  const outerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(7,20,40,0.85)',
    backdropFilter: 'blur(4px)',
  };

  const cardStyle = {
    background: '#0d2048',
    border: borderStyle,
    borderRadius: 24,
    padding: '28px 32px 24px',
    minWidth: 340,
    maxWidth: 400,
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
    position: 'relative',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={outerStyle} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={cardStyle}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 14,
            background: 'none', border: 'none', color: '#fdb927',
            fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1,
            fontFamily: "'Fredoka One',cursive",
          }}
        >×</button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <span style={{
            fontFamily: "'Fredoka One',cursive",
            fontSize: '1.5rem', color: '#fdb927', letterSpacing: 1,
          }}>⏱ Timer</span>
        </div>

        {/* Preset buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
          {PRESETS.map(p => (
            <button
              key={p.secs}
              onClick={() => applyPreset(p)}
              style={{
                background: presetLabel === p.label ? '#fdb927' : '#1a3060',
                color: presetLabel === p.label ? '#071428' : '#e8d9a0',
                border: 'none', borderRadius: 20,
                padding: '4px 12px',
                fontFamily: "'Nunito',sans-serif",
                fontWeight: 700, fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >{p.label}</button>
          ))}
        </div>

        {/* SVG Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx="110" cy="110" r={R}
                fill="none" stroke="#1a3060" strokeWidth="12" />
              {/* Progress */}
              <circle cx="110" cy="110" r={R}
                fill="none"
                stroke={ringColor}
                strokeWidth="12"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dasharray 0.8s linear, stroke 0.5s',
                  filter: pulse ? `drop-shadow(0 0 8px ${ringColor})` : 'none',
                  animation: pulse ? 'none' : 'none',
                }}
              />
            </svg>
            {/* Center text */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {timesUp ? (
                <div style={{
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: '1.4rem',
                  color: flash ? '#ff5252' : '#fdb927',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  transition: 'color 0.2s',
                }}>⏰<br/>Time's<br/>Up!</div>
              ) : (
                <>
                  <div style={{
                    fontFamily: "'Fredoka One',cursive",
                    fontSize: '3rem', color: '#fff', lineHeight: 1,
                    textShadow: pulse ? `0 0 16px ${ringColor}` : 'none',
                  }}>{fmt(remaining)}</div>
                  <div style={{
                    fontFamily: "'Nunito',sans-serif",
                    fontSize: '0.85rem', color: '#fdb927', marginTop: 4,
                    fontWeight: 700,
                  }}>{presetLabel}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
          <button
            onClick={() => { if (!timesUp) setRunning(r => !r); }}
            style={{
              background: running ? '#fdb927' : '#1a6640',
              color: running ? '#071428' : '#fff',
              border: 'none', borderRadius: 12,
              padding: '10px 28px',
              fontFamily: "'Fredoka One',cursive",
              fontSize: '1.1rem', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              minWidth: 110,
              transition: 'background 0.2s',
            }}
          >{running ? '⏸ Pause' : '▶ Play'}</button>

          <button
            onClick={handleReset}
            style={{
              background: '#1a3060',
              color: '#fdb927',
              border: '2px solid #fdb927',
              borderRadius: 12,
              padding: '10px 20px',
              fontFamily: "'Fredoka One',cursive",
              fontSize: '1.1rem', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >↺ Reset</button>
        </div>

        {/* Custom input */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <input
            type="number"
            min="1" max="120"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="min"
            style={{
              width: 64, padding: '6px 10px',
              borderRadius: 10, border: '1.5px solid #fdb927',
              background: '#071428', color: '#fff',
              fontFamily: "'Nunito',sans-serif",
              fontSize: '0.95rem', textAlign: 'center',
              outline: 'none',
            }}
          />
          <span style={{ color: '#fdb927', fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>min</span>
          <button
            onClick={handleCustomSet}
            style={{
              background: '#fdb927', color: '#071428',
              border: 'none', borderRadius: 10,
              padding: '6px 16px',
              fontFamily: "'Fredoka One',cursive",
              fontSize: '0.95rem', cursor: 'pointer',
            }}
          >Set</button>
        </div>

      </div>
    </div>
  );
}
