import {useState,useEffect} from 'react';
import Clock from './Clock';
import BearSVG from './BearSVG';

function wmoIcon(code){
  if(code===0)return'☀️';
  if(code<=3)return'⛅';
  if(code<=48)return'🌫️';
  if(code<=67)return'🌧️';
  if(code<=77)return'❄️';
  if(code<=82)return'🌦️';
  return'⛈️';
}

const CASH_TIMES=[{h:11,m:0},{h:13,m:0}];

function useCashTime(){
  const[state,setState]=useState({label:'',countdown:'',isNow:false,soon:false});
  useEffect(()=>{
    function tick(){
      const now=new Date();
      const mins=now.getHours()*60+now.getMinutes();
      const secs=now.getSeconds();
      let nearest=null,nearestDiff=Infinity;
      for(const t of CASH_TIMES){
        const tm=t.h*60+t.m;
        const diff=tm*60-(mins*60+secs);
        if(Math.abs(diff)<nearestDiff){nearestDiff=Math.abs(diff);nearest={...t,diff};}
      }
      const isNow=Math.abs(nearestDiff)<=300; // within 5 min = "NOW"
      const soon=nearestDiff>0&&nearestDiff<=900; // 15 min warning
      let countdown='';
      if(nearest&&nearest.diff>0){
        const totalSec=nearest.diff;
        const h=Math.floor(totalSec/3600);
        const m=Math.floor((totalSec%3600)/60);
        const s=totalSec%60;
        if(h>0)countdown=`${h}h ${m}m`;
        else if(m>0)countdown=`${m}m ${s}s`;
        else countdown=`${s}s`;
      }else if(nearest&&nearest.diff<=0&&nearest.diff>-300){
        countdown='NOW!';
      }
      const label=isNow&&nearest?.diff<=0?'💰 CASH TIME NOW!'
        :soon?`💰 Cash Time in ${countdown}`
        :`💰 Cash Time: 11 AM & 1 PM`;
      setState({label,countdown,isNow:isNow&&(nearest?.diff??1)<=0,soon});
    }
    tick();
    const id=setInterval(tick,1000);
    return()=>clearInterval(id);
  },[]);
  return state;
}

export default function TopBar({onWelcome,onPause,paused,addToAll,showToast,onTimer}){
  const[weather,setWeather]=useState(null);
  const cashTime=useCashTime();

  useEffect(()=>{
    async function fetchW(){
      try{
        const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=36.04&longitude=-114.98&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles');
        const d=await r.json();
        setWeather({temp:Math.round(d.current.temperature_2m),code:d.current.weather_code});
      }catch(e){}
    }
    fetchW();
    const id=setInterval(fetchW,30*60*1000);
    return()=>clearInterval(id);
  },[]);

  function doAddAll(){addToAll(1);showToast('⭐ +1 to all students!');}

  return(
    <div className="topbar">
      <div className="tb-logo">
        <BearSVG size={48}/>
        <div>
          <div className="tb-title">DMCox ESY 2026</div>
          <div className="tb-sub">🐻 Bear Cubs</div>
        </div>
      </div>
      <div className="tb-ticker" aria-label="announcements">
        <span className="tb-ticker-inner">
          🎉 Welcome to ESY 2026 at David M. Cox Elementary!&nbsp;&nbsp;🐻 Go Bear Cubs!&nbsp;&nbsp;⭐ Keep earning Dojo Points!&nbsp;&nbsp;💛 Be Responsible · Outstanding · Awesome · Respectful!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          🎉 Welcome to ESY 2026 at David M. Cox Elementary!&nbsp;&nbsp;🐻 Go Bear Cubs!&nbsp;&nbsp;⭐ Keep earning Dojo Points!&nbsp;&nbsp;💛 Be Responsible · Outstanding · Awesome · Respectful!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
      {/* Cash Time Badge — always visible */}
      <div style={{
        flexShrink:0,display:'flex',alignItems:'center',gap:6,
        background:cashTime.isNow
          ?'linear-gradient(135deg,#ff6b00,#fdb927)'
          :cashTime.soon
          ?'linear-gradient(135deg,rgba(253,185,39,0.25),rgba(232,151,10,0.18))'
          :'linear-gradient(135deg,rgba(253,185,39,0.12),rgba(232,151,10,0.08))',
        border:cashTime.isNow
          ?'2px solid #ffd000'
          :cashTime.soon
          ?'1.5px solid rgba(253,185,39,0.6)'
          :'1.5px solid rgba(253,185,39,0.28)',
        borderRadius:14,
        padding:cashTime.isNow?'8px 16px':'6px 14px',
        boxShadow:cashTime.isNow
          ?'0 0 28px rgba(255,180,0,0.7),0 0 8px rgba(255,180,0,0.4)'
          :cashTime.soon
          ?'0 0 12px rgba(253,185,39,0.25)'
          :'none',
        animation:cashTime.isNow?'cashPulse 0.8s infinite alternate':'none',
        transition:'all 0.4s ease',
        cursor:'default',
      }}>
        <span style={{fontSize:cashTime.isNow?'1.5rem':'1.2rem',lineHeight:1}}>💰</span>
        <div>
          <div style={{
            fontFamily:"'Fredoka One',cursive",
            fontSize:cashTime.isNow?'1rem':'0.8rem',
            color:cashTime.isNow?'#071428':cashTime.soon?'#fdb927':'rgba(253,185,39,0.85)',
            lineHeight:1,
            textShadow:cashTime.isNow?'none':'0 0 8px rgba(253,185,39,0.3)',
            whiteSpace:'nowrap',
          }}>{cashTime.isNow?'CASH TIME NOW!':cashTime.soon?cashTime.label.replace('💰 ',''):'Cash Time'}</div>
          <div style={{
            fontSize:'0.6rem',
            color:cashTime.isNow?'rgba(7,20,40,0.8)':cashTime.soon?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.35)',
            letterSpacing:'0.04em',
            whiteSpace:'nowrap',
          }}>{cashTime.isNow?'Open the Store! 🛒':cashTime.soon?'Get ready!':'11:00 AM · 1:00 PM'}</div>
        </div>
      </div>

      {weather&&(
        <div style={{
          display:'flex',alignItems:'center',gap:7,flexShrink:0,
          background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:12,padding:'6px 12px',
        }}>
          <span style={{fontSize:'1.4rem',lineHeight:1}}>{wmoIcon(weather.code)}</span>
          <div>
            <div style={{fontFamily:"'Fredoka One',cursive",color:'#fdb927',fontSize:'1rem',lineHeight:1,textShadow:'0 0 10px rgba(253,185,39,0.4)'}}>{weather.temp}°F</div>
            <div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.36)',letterSpacing:'0.03em'}}>Henderson, NV</div>
          </div>
        </div>
      )}
      <div className="tb-actions">
        <Clock/>
        <button className="btn btn-navy tb-btn" onClick={onTimer} title="Countdown Timer" style={{background:'rgba(77,150,255,0.12)',borderColor:'rgba(77,150,255,0.3)',color:'#74c0fc'}}>⏱️ Timer</button>
        <button className="btn btn-navy tb-btn" onClick={doAddAll} title="+1 to all">⭐ +All</button>
        <button className="btn btn-navy tb-btn" onClick={onPause} title="Pause">{paused?'▶ Resume':'⏸ Pause'}</button>
        <button className="btn btn-gold tb-btn" onClick={onWelcome} title="Welcome Screen">🏠</button>
      </div>
    </div>
  );
}
