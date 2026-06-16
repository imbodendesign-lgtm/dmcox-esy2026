import {useState,useEffect} from 'react';
import {STORE_AVATARS} from '../data';

const SCHED_KEY='dmcox26_schedule_v2';
const DEFAULT_SCHEDULE=[
  {id:1, time:'8:30 AM', icon:'🚌',label:'Bus Arrival',               color:'#4d96ff'},
  {id:2, time:'9:00 AM', icon:'🔥',label:'Morning Hype + Goal Check', color:'#fdb927'},
  {id:3, time:'9:15 AM', icon:'📖',label:'Reading / Phonics Block',   color:'#ff922b'},
  {id:4, time:'10:00 AM',icon:'✏️',label:'Writing Block',             color:'#cc5de8'},
  {id:5, time:'10:45 AM',icon:'🔢',label:'Math Block',                color:'#6bcb77'},
  {id:6, time:'11:30 AM',icon:'🍕',label:'Lunch + Recess',            color:'#ff6b6b'},
  {id:7, time:'12:15 PM',icon:'🎭',label:'Group Activity + SEL',      color:'#4d96ff'},
  {id:8, time:'1:00 PM', icon:'📋',label:'1-on-1 + Independent Work', color:'#20c997'},
  {id:9, time:'1:45 PM', icon:'🎯',label:'Skill Station Wrap-Up',     color:'#a9e34b'},
  {id:10,time:'2:00 PM', icon:'📦',label:'Dismissal Prep',            color:'#fdb927'},
  {id:11,time:'2:20 PM', icon:'🚌',label:'Dismissal',                 color:'#ff6b6b'},
];

function parseTime(str){
  if(!str)return null;
  const m=str.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if(!m)return null;
  let h=parseInt(m[1]);const min=parseInt(m[2]);const ampm=m[3].toUpperCase();
  if(ampm==='PM'&&h!==12)h+=12;if(ampm==='AM'&&h===12)h=0;
  return h*60+min;
}

function ScheduleSidebar(){
  const[items,setItems]=useState(()=>{
    try{const s=localStorage.getItem(SCHED_KEY);if(s)return JSON.parse(s);}catch{}
    return DEFAULT_SCHEDULE;
  });
  const[tick,setTick]=useState(0);
  useEffect(()=>{
    const id=setInterval(()=>setTick(t=>t+1),30000);return()=>clearInterval(id);
  },[]);

  const now=new Date();
  const nowMins=now.getHours()*60+now.getMinutes();
  let activeIdx=-1;
  for(let i=items.length-1;i>=0;i--){
    if(parseTime(items[i].time)<=nowMins){activeIdx=i;break;}
  }
  const nextIdx=activeIdx<items.length-1?activeIdx+1:-1;

  return(
    <div style={{
      width:210,flexShrink:0,
      background:'linear-gradient(180deg,rgba(7,20,40,0.95),rgba(4,10,28,0.98))',
      border:'1px solid rgba(253,185,39,0.15)',
      borderRadius:16,padding:'12px 10px',
      display:'flex',flexDirection:'column',gap:0,
      maxHeight:'100%',overflowY:'auto',
      alignSelf:'flex-start',
    }}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'0.95rem',color:'#fdb927',marginBottom:10,textAlign:'center',letterSpacing:'0.05em'}}>
        📅 Today's Schedule
      </div>
      {items.map((item,i)=>{
        const isActive=i===activeIdx;
        const isPast=i<activeIdx;
        const isNext=i===nextIdx;
        return(
          <div key={item.id} style={{
            display:'flex',alignItems:'center',gap:7,
            padding:'6px 6px',
            borderRadius:9,
            marginBottom:2,
            background:isActive?`${item.color}20`:'transparent',
            border:`1px solid ${isActive?item.color+'60':isNext?'rgba(255,255,255,0.08)':'transparent'}`,
            opacity:isPast?0.38:1,
            transition:'all 0.3s',
          }}>
            {/* Active left bar */}
            <div style={{
              width:3,height:28,borderRadius:2,flexShrink:0,
              background:isActive?item.color:isNext?'rgba(255,255,255,0.15)':'transparent',
              boxShadow:isActive?`0 0 6px ${item.color}`:'none',
            }}/>
            {/* Icon */}
            <div style={{
              fontSize:'1rem',width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',
              flexShrink:0,
            }}>{item.icon}</div>
            {/* Text */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{
                fontFamily:"'Nunito',sans-serif",fontWeight:800,
                fontSize:'0.75rem',
                color:isActive?'white':isNext?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.45)',
                whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                lineHeight:1.2,
              }}>{item.label}</div>
              <div style={{
                fontSize:'0.65rem',
                color:isActive?item.color:'rgba(255,255,255,0.28)',
                fontFamily:"'Nunito',sans-serif",fontWeight:700,
              }}>{item.time}</div>
            </div>
            {/* NOW badge */}
            {isActive&&(
              <div style={{
                background:item.color,color:'#071428',
                fontFamily:"'Fredoka One',cursive",fontSize:'0.55rem',
                padding:'2px 5px',borderRadius:50,flexShrink:0,letterSpacing:'0.04em',
                animation:'nowPulse 1.5s infinite',
              }}>NOW</div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes nowPulse{0%,100%{opacity:1;}50%{opacity:0.6;}}`}</style>
    </div>
  );
}

function StudentCard({s,rank,onPlus,onMinus,onModal}){
  const medals=['🥇','🥈','🥉'];
  const medal=rank<3?medals[rank]:`#${rank+1}`;
  const pips=Array.from({length:10},(_,i)=>i<s.points%10);
  return(
    <div className="student-card" style={{'--stu-color':s.color}}>
      <div className="stu-rank">{medal}</div>
      <div className="stu-avatar" style={{background:s.color+'18'}}>{s.avatar}</div>
      <div className="stu-name">{s.first||s.name}</div>
      <div className="pip-row">{pips.map((f,i)=><div key={i} className={`pip${f?'':' empty'}`}/>)}</div>
      <div className="pts-big">{s.points}</div>
      <div className="pts-lbl">Dojo Points</div>
      <div className="card-btns">
        <button className="btn-plus" onClick={()=>onPlus(s.id,1)}>+1</button>
        <button className="btn-minus" onClick={()=>onMinus(s.id,-1)}>−1</button>
        <button className="btn-give" onClick={()=>onModal(s)}>🎁</button>
      </div>
    </div>
  );
}

function RosterFS({students,visible,onClose,onPlus,onMinus}){
  const sorted=[...students].sort((a,b)=>b.points-a.points);
  const medals=['🥇','🥈','🥉'];
  if(!visible)return null;
  return(
    <div className="roster-fs on">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927'}}>🐻 Cubs Roster — Full View</div>
        <button className="btn btn-gold" onClick={onClose}>✕ Close</button>
      </div>
      <div className="roster-fs-grid">
        {sorted.map((s,i)=>{
          const pct=Math.min(100,s.points*2);
          return(
            <div key={s.id} style={{background:'linear-gradient(145deg,rgba(13,32,72,0.9),rgba(4,10,28,0.95))',border:`2px solid ${i===0?'#fdb927':i===1?'#c0c0c0':i===2?'#cd7f32':'rgba(253,185,39,0.2)'}`,borderRadius:20,padding:'22px 16px',textAlign:'center',position:'relative'}}>
              {i<3&&<div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',fontSize:'1.7rem'}}>{medals[i]}</div>}
              <div style={{fontSize:'2rem',background:s.color+'22',border:`2px solid ${s.color}`,borderRadius:'50%',width:60,height:60,display:'flex',alignItems:'center',justifyContent:'center',margin:`${i<3?'20px':'4px'} auto 8px`}}>{s.avatar}</div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.3rem',color:'white'}}>{s.first||s.name}</div>
              <div style={{fontSize:'1.8rem',fontFamily:"'Fredoka One',cursive",color:'#fdb927',margin:'5px 0'}}>{s.points}</div>
              <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.4)',marginBottom:9}}>Dojo Points</div>
              <div style={{background:'rgba(255,255,255,0.06)',borderRadius:8,height:9,overflow:'hidden',marginBottom:11}}>
                <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#fdb927,#e8970a)',borderRadius:8,transition:'width 0.8s'}}/>
              </div>
              <div style={{display:'flex',gap:6}}>
                <button onClick={()=>onPlus(s.id,1)} style={{flex:1,background:'rgba(253,185,39,0.15)',border:'1px solid rgba(253,185,39,0.3)',color:'#fdb927',padding:'7px 0',borderRadius:9,cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:800}}>+1</button>
                <button onClick={()=>onMinus(s.id,-1)} style={{flex:1,background:'rgba(255,80,80,0.12)',border:'1px solid rgba(255,80,80,0.25)',color:'#ff8a8a',padding:'7px 0',borderRadius:9,cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:800}}>−1</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Students({students,addPoints,updateStudent,showToast,showModal,closeModal}){
  const[fsOpen,setFsOpen]=useState(false);
  const sorted=[...students].sort((a,b)=>b.points-a.points);
  const top3=sorted.slice(0,3);

  function openGift(s){
    const opts=[1,2,3,5,10];
    showModal(
      <div>
        <h2>🎁 Give Points to {s.first||s.name}</h2>
        <p>Select how many Dojo Points to award:</p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}>
          {opts.map(n=>(
            <button key={n} className="btn btn-gold" style={{flex:1}} onClick={()=>{addPoints(s.id,n,null);showToast(`⭐ +${n} pts to ${s.first||s.name}!`);closeModal();}}>+{n}</button>
          ))}
        </div>
        <div className="m-btns"><button className="btn btn-navy" onClick={closeModal}>Cancel</button></div>
      </div>
    );
  }

  return(
    <>
      <RosterFS students={students} visible={fsOpen} onClose={()=>setFsOpen(false)} onPlus={addPoints} onMinus={addPoints}/>

      {/* Two-column layout: main content + schedule sidebar */}
      <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>

        {/* Left: students */}
        <div style={{flex:1,minWidth:0}}>
          {/* Podium */}
          {sorted.length>=3&&(
            <div className="podium">
              {[top3[1],top3[0],top3[2]].map((s,pi)=>{
                const realRank=pi===0?1:pi===1?0:2;
                const medals=['🥇','🥈','🥉'];
                const cls=pi===1?'p1':pi===0?'p2':'p3';
                return s?(
                  <div key={s.id} className={`podium-slot ${cls}`} style={{marginBottom:pi===1?0:pi===0?20:30}}>
                    <div style={{fontSize:'1.8rem'}}>{medals[realRank]}</div>
                    <div className="pod-avatar">{s.avatar}</div>
                    <div className="pod-name">{s.first||s.name}</div>
                    <div className="pod-pts">{s.points}</div>
                    <div className="pod-bar"><div className="pod-bar-fill" style={{width:`${Math.min(100,s.points)}%`}}/></div>
                  </div>
                ):null;
              })}
            </div>
          )}
          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,marginBottom:12}}>
            <div className="sec-head" style={{marginBottom:0}}>🌟 All Cubs <span className="sec-pill">{students.length} Students</span></div>
            <button className="btn btn-gold" onClick={()=>setFsOpen(true)}>⛶ Full Screen Roster</button>
          </div>
          <div className="student-grid">
            {sorted.map((s,i)=>(
              <StudentCard key={s.id} s={s} rank={i}
                onPlus={addPoints} onMinus={addPoints}
                onModal={openGift}/>
            ))}
          </div>
        </div>

        {/* Right: schedule sidebar */}
        <ScheduleSidebar/>
      </div>
    </>
  );
}
