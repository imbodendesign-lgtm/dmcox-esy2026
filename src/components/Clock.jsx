import {useState,useEffect} from 'react';
export default function Clock(){
  const [now,setNow]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);
  const t=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const d=now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  return(
    <div className="clock-box">
      <div className="clock-time">{t}</div>
      <div className="clock-date">{d}</div>
    </div>
  );
}
