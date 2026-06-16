import {useEffect,useState} from 'react';

function wmoLabel(c){
  if(c===0)return['☀️','Clear'];
  if(c<=2)return['🌤️','Partly Cloudy'];
  if(c<=3)return['☁️','Overcast'];
  if(c<=48)return['🌫️','Foggy'];
  if(c<=67)return['🌧️','Rainy'];
  if(c<=77)return['❄️','Snowy'];
  if(c<=82)return['🌦️','Showers'];
  return['⛈️','Stormy'];
}

const STARS=Array.from({length:22},(_,i)=>({
  id:i,
  x:Math.random()*100,
  y:Math.random()*100,
  size:Math.random()*18+8,
  delay:Math.random()*3,
  dur:2+Math.random()*2,
}));

export default function WelcomeScreen({students,visible,onClose}){
  const[show,setShow]=useState(false);
  const[weather,setWeather]=useState(null);

  useEffect(()=>{if(visible)setTimeout(()=>setShow(true),40);},[visible]);

  useEffect(()=>{
    if(!visible)return;
    fetch('https://api.open-meteo.com/v1/forecast?latitude=36.04&longitude=-114.98&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles&forecast_days=1')
      .then(r=>r.json())
      .then(d=>{
        setWeather({
          temp:Math.round(d.current.temperature_2m),
          feels:Math.round(d.current.apparent_temperature),
          humidity:d.current.relative_humidity_2m,
          code:d.current.weather_code,
          hi:Math.round(d.daily.temperature_2m_max[0]),
          lo:Math.round(d.daily.temperature_2m_min[0]),
        });
      }).catch(()=>{});
  },[visible]);

  if(!visible)return null;

  return(
    <div onClick={onClose} style={{
      position:'fixed',inset:0,zIndex:9999,
      background:'radial-gradient(ellipse at 50% 30%,#0d2a5e 0%,#071428 60%,#03080f 100%)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',
      overflowY:'auto',padding:'40px 20px 60px',
      opacity:show?1:0,transition:'opacity 0.5s ease',
    }}>
      {/* Floating stars */}
      {STARS.map(s=>(
        <div key={s.id} style={{
          position:'fixed',left:`${s.x}%`,top:`${s.y}%`,
          fontSize:s.size,pointerEvents:'none',
          animation:`starFloat ${s.dur}s ${s.delay}s infinite alternate ease-in-out`,
          opacity:0.5,
        }}>⭐</div>
      ))}

      {/* Bear mascot */}
      <div style={{position:'relative',marginBottom:24}}>
        <div style={{
          width:160,height:160,borderRadius:'50%',
          background:'linear-gradient(135deg,#0d2048,#1a3a6e)',
          border:'5px solid rgba(253,185,39,0.6)',
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 0 80px rgba(253,185,39,0.4),0 0 40px rgba(253,185,39,0.2)',
          animation:'bearPulse 2.5s infinite ease-in-out',
          overflow:'hidden',
        }}>
          <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="140" height="140">
            <defs>
              <radialGradient id="wG1" cx="50%" cy="40%"><stop offset="0%" stopColor="#fdd76a"/><stop offset="100%" stopColor="#e8970a"/></radialGradient>
              <radialGradient id="wG2" cx="50%" cy="40%"><stop offset="0%" stopColor="#a0713a"/><stop offset="100%" stopColor="#6b4220"/></radialGradient>
              <radialGradient id="wG3" cx="50%" cy="35%"><stop offset="0%" stopColor="#c49a6c"/><stop offset="100%" stopColor="#a0713a"/></radialGradient>
              <radialGradient id="wG4" cx="50%" cy="30%"><stop offset="0%" stopColor="#d4aa7d"/><stop offset="100%" stopColor="#b8865a"/></radialGradient>
            </defs>
            <circle cx="60" cy="60" r="58" fill="url(#wG1)"/>
            <circle cx="26" cy="30" r="18" fill="#6b4220"/><circle cx="26" cy="30" r="11" fill="#a0713a"/>
            <circle cx="94" cy="30" r="18" fill="#6b4220"/><circle cx="94" cy="30" r="11" fill="#a0713a"/>
            <ellipse cx="60" cy="68" rx="38" ry="35" fill="url(#wG2)"/>
            <ellipse cx="60" cy="60" rx="34" ry="30" fill="url(#wG3)"/>
            <ellipse cx="60" cy="82" rx="17" ry="12" fill="url(#wG4)"/>
            <ellipse cx="60" cy="76" rx="6.5" ry="4.5" fill="#2d1a0a"/>
            <circle cx="44" cy="62" r="7" fill="#1a0a00"/><circle cx="76" cy="62" r="7" fill="#1a0a00"/>
            <circle cx="46" cy="60" r="2.5" fill="white"/><circle cx="78" cy="60" r="2.5" fill="white"/>
            <path d="M53 87 Q60 93 67 87" stroke="#2d1a0a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{
          position:'absolute',bottom:-8,left:'50%',transform:'translateX(-50%)',
          background:'linear-gradient(135deg,#fdb927,#e8970a)',
          color:'#071428',fontFamily:"'Fredoka One',cursive",
          fontSize:'0.75rem',fontWeight:900,padding:'3px 14px',borderRadius:50,
          whiteSpace:'nowrap',boxShadow:'0 2px 12px rgba(253,185,39,0.4)',
        }}>GO CUBS! 🐾</div>
      </div>

      {/* Welcome title */}
      <div style={{
        fontFamily:"'Fredoka One',cursive",
        fontSize:'clamp(2rem,5vw,3.8rem)',
        color:'#fdb927',
        textAlign:'center',
        textShadow:'0 0 40px rgba(253,185,39,0.5)',
        lineHeight:1.1,
        marginBottom:10,
        animation:'slideDown 0.6s ease',
      }}>Welcome to ESY 2026! 🌟</div>

      <div style={{
        fontFamily:"'Fredoka One',cursive",
        fontSize:'clamp(1.2rem,3vw,2rem)',
        color:'white',
        textAlign:'center',
        marginBottom:6,
        animation:'slideDown 0.7s ease',
      }}>David M. Cox Elementary School</div>

      <div style={{
        fontFamily:"'Nunito',sans-serif",
        fontSize:'1rem',
        color:'rgba(255,255,255,0.55)',
        letterSpacing:'0.12em',
        textTransform:'uppercase',
        marginBottom:24,
        animation:'slideDown 0.8s ease',
      }}>Henderson, Nevada · CCSD · Bear Cubs 🐻</div>

      {/* Weather card */}
      {weather&&(()=>{
        const[icon,label]=wmoLabel(weather.code);
        return(
          <div onClick={e=>e.stopPropagation()} style={{
            display:'flex',alignItems:'center',gap:20,
            background:'linear-gradient(135deg,rgba(13,32,80,0.75),rgba(4,10,36,0.85))',
            border:'1px solid rgba(253,185,39,0.22)',
            borderRadius:22,padding:'18px 32px',
            marginBottom:28,
            backdropFilter:'blur(16px)',
            boxShadow:'0 8px 32px rgba(0,0,0,0.4),0 0 40px rgba(253,185,39,0.04)',
            animation:'slideDown 0.9s ease',
            flexWrap:'wrap',justifyContent:'center',
          }}>
            {/* Big icon + temp */}
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{fontSize:'4rem',lineHeight:1,filter:'drop-shadow(0 0 16px rgba(253,185,39,0.3))'}}>{icon}</div>
              <div>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'3.5rem',color:'#fdb927',lineHeight:1,textShadow:'0 0 24px rgba(253,185,39,0.5)'}}>{weather.temp}°</div>
                <div style={{fontFamily:"'Nunito',sans-serif",fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',letterSpacing:'0.04em'}}>Feels like {weather.feels}°F</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{width:1,height:60,background:'rgba(255,255,255,0.1)',flexShrink:0}}/>

            {/* Details */}
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.3rem',color:'white'}}>{label}</div>
              <div style={{display:'flex',gap:16}}>
                <div style={{fontFamily:"'Nunito',sans-serif",fontSize:'0.82rem',color:'rgba(255,255,255,0.5)'}}>
                  <span style={{color:'#ff8a8a'}}>↑ {weather.hi}°</span>&nbsp; <span style={{color:'#74c0fc'}}>↓ {weather.lo}°</span>
                </div>
              </div>
              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:'0.78rem',color:'rgba(255,255,255,0.38)',letterSpacing:'0.06em'}}>
                💧 {weather.humidity}% humidity · 📍 Henderson, NV
              </div>
            </div>
          </div>
        );
      })()}

      {/* Divider */}
      <div style={{
        width:'min(500px,80%)',height:2,
        background:'linear-gradient(90deg,transparent,rgba(253,185,39,0.5),transparent)',
        marginBottom:30,
      }}/>

      {/* Student roster */}
      <div style={{
        fontFamily:"'Fredoka One',cursive",fontSize:'1.2rem',color:'rgba(255,255,255,0.6)',
        marginBottom:16,letterSpacing:'0.08em',textTransform:'uppercase',
      }}>Class Roster</div>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))',
        gap:12,
        width:'min(900px,95%)',
        marginBottom:40,
      }} onClick={e=>e.stopPropagation()}>
        {students.map((s,i)=>(
          <div key={s.id} style={{
            background:'linear-gradient(145deg,rgba(13,32,72,0.9),rgba(4,10,28,0.95))',
            border:'2px solid rgba(253,185,39,0.25)',
            borderRadius:16,padding:'16px 10px',
            display:'flex',flexDirection:'column',alignItems:'center',gap:6,
            animation:`cardPop 0.4s ${i*0.04}s both ease-out`,
          }}>
            <div style={{
              fontSize:'2rem',
              background:s.color+'22',
              border:`2px solid ${s.color}`,
              borderRadius:'50%',width:52,height:52,
              display:'flex',alignItems:'center',justifyContent:'center',
            }}>{s.avatar}</div>
            <div style={{
              fontFamily:"'Fredoka One',cursive",
              fontSize:'0.95rem',color:'white',
              textAlign:'center',lineHeight:1.2,
            }}>{s.first||s.name}</div>
          </div>
        ))}
      </div>

      {/* Click to dismiss */}
      <div style={{
        color:'rgba(255,255,255,0.3)',
        fontFamily:"'Nunito',sans-serif",
        fontSize:'0.9rem',
        animation:'pulse 2s infinite',
      }}>✨ Click anywhere to enter the classroom ✨</div>

      <style>{`
        @keyframes starFloat{from{transform:translateY(0) scale(1);}to{transform:translateY(-18px) scale(1.15);}}
        @keyframes bearPulse{0%,100%{box-shadow:0 0 60px rgba(253,185,39,0.3);}50%{box-shadow:0 0 100px rgba(253,185,39,0.55);}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes cardPop{from{opacity:0;transform:scale(0.8);}to{opacity:1;transform:scale(1);}}
        @keyframes pulse{0%,100%{opacity:0.3;}50%{opacity:0.7;}}
      `}</style>
    </div>
  );
}
