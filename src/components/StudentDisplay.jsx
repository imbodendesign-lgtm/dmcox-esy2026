import {useState,useEffect} from 'react';

const MSGS=[
  '🐻 Go Bear Cubs! Keep earning Dojo Points!',
  '🌟 ESY 2026 — You\'ve got this, Cubs!',
  '🔥 Every point counts — stay focused!',
  '💪 David M. Cox Elementary — Bear Pride!',
  '⭐ Top earners get to visit the Dojo Store!',
  '🎉 Class rewards unlock when you hit your goal!',
  '🦁 Be kind, work hard, earn big!',
];

// Indexed by place: 0=1st(gold), 1=2nd(silver), 2=3rd(bronze)
const PC=['#FFD700','#C0C0C0','#CD7F32'];
const PM=['🥇','🥈','🥉'];
const PL=['1ST','2ND','3RD'];

// Fixed column heights (vh) — creates staircase even when scores are equal
const COL_H=['100%','77%','59%']; // 1st=tallest, 2nd=medium, 3rd=shortest
// Platform block heights inside each column
const PLAT_H=['22vh','15vh','11vh'];

function Clock(){
  const[now,setNow]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);
  return(
    <div style={{textAlign:'right',lineHeight:1.1}}>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:'1.5rem',color:'#fdb927'}}>
        {now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
      </div>
      <div style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.45)',marginTop:1}}>
        {now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
      </div>
    </div>
  );
}

function BearLogo({onClick,n}){
  return(
    <svg onClick={onClick} width={46} height={46} viewBox="0 0 100 100"
      style={{cursor:'pointer',flexShrink:0,filter:n>0?`drop-shadow(0 0 ${n*10}px #fdb927)`:'none',transition:'filter 0.2s'}}>
      <circle cx={50} cy={50} r={50} fill="#fdb927"/>
      <circle cx={28} cy={28} r={14} fill="#8B5E3C"/>
      <circle cx={72} cy={28} r={14} fill="#8B5E3C"/>
      <ellipse cx={50} cy={56} rx={28} ry={26} fill="#8B5E3C"/>
      <ellipse cx={50} cy={54} rx={22} ry={20} fill="#C4956A"/>
      <circle cx={40} cy={48} r={5} fill="#2c1810"/>
      <circle cx={60} cy={48} r={5} fill="#2c1810"/>
      <ellipse cx={50} cy={60} rx={8} ry={6} fill="#5a2d0c"/>
      <ellipse cx={50} cy={58} rx={5} ry={3.5} fill="#ff7f7f"/>
      <circle cx={42} cy={46} r={1.5} fill="white"/>
      <circle cx={62} cy={46} r={1.5} fill="white"/>
    </svg>
  );
}

function Ticker(){
  const[idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%MSGS.length),4500);return()=>clearInterval(t);},[]);
  return(
    <div style={{background:'rgba(253,185,39,0.1)',borderTop:'1px solid rgba(253,185,39,0.2)',
      padding:'8px 20px',textAlign:'center',fontSize:'0.9rem',
      color:'rgba(255,255,255,0.65)',fontFamily:"'Fredoka One',cursive",flexShrink:0}}>
      {MSGS[idx]}
    </div>
  );
}

function PodCol({s,place}){
  if(!s)return null;
  const c=PC[place];
  const big=place===0;
  return(
    /* Column grows from the BOTTOM — aligned via parent's alignItems:'flex-end' */
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',
      height:COL_H[place], // fixed vh height = staircase even when scores equal
      flex:big?1.4:place===1?1.1:1,
      flexShrink:0,
    }}>
      {/* Avatar info — fills space above platform, centered */}
      <div style={{
        flex:1,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',
        gap:3,width:'100%',padding:'4px 4px 0',
      }}>
        <div style={{fontSize:big?'1.8rem':'1.3rem'}}>{PM[place]}</div>
        <div style={{
          fontSize:big?'3rem':'2.2rem',
          background:s.color+'22',
          border:`3px solid ${c}`,borderRadius:'50%',
          width:big?84:66,height:big?84:66,
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:`0 0 18px ${c}77`,
        }}>{s.avatar}</div>
        <div style={{
          fontFamily:"'Fredoka One',cursive",
          fontSize:big?'1.3rem':'1.05rem',color:'white',
          textAlign:'center',width:'100%',
          padding:'0 6px',wordBreak:'break-word',lineHeight:1.1,marginTop:4,
        }}>{s.first||s.name}</div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:big?'2.2rem':'1.7rem',color:'#fdb927',lineHeight:1}}>
          {s.points}
        </div>
        <div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.35)',letterSpacing:'0.06em'}}>DOJO PTS</div>
      </div>
      {/* Platform block */}
      <div style={{
        width:'90%',height:PLAT_H[place],flexShrink:0,
        background:`linear-gradient(180deg,${c}44,${c}11)`,
        border:`1px solid ${c}77`,borderRadius:'12px 12px 0 0',
        display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:7,
      }}>
        <span style={{fontFamily:"'Fredoka One',cursive",color:`${c}cc`,fontSize:'0.9rem'}}>{PL[place]}</span>
      </div>
    </div>
  );
}

export default function StudentDisplay({students,addPoints,onTeacherClick}){
  const[clicks,setClicks]=useState(0);
  function handleBearClick(){
    const n=clicks+1; setClicks(n);
    if(n>=3){setClicks(0);onTeacherClick();}
    else setTimeout(()=>setClicks(c=>c===n?0:c),1500);
  }

  const sorted=[...students].sort((a,b)=>b.points-a.points);
  const top3=sorted.slice(0,3);
  const rest=sorted.slice(3);
  const totalPts=students.reduce((s,st)=>s+st.points,0);
  const cols=Math.ceil(rest.length/2)||5;

  return(
    <div style={{
      display:'flex',flexDirection:'column',
      height:'100vh',width:'100vw',
      background:'linear-gradient(160deg,#071428 0%,#0e2550 55%,#071428 100%)',
      overflow:'hidden',fontFamily:"'Nunito',sans-serif",
    }}>
      {/* TOP BAR */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'8px 20px',background:'rgba(0,0,0,0.35)',
        borderBottom:'2px solid rgba(253,185,39,0.2)',flexShrink:0,gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <BearLogo onClick={handleBearClick} n={clicks}/>
          <div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.35rem',color:'#fdb927',lineHeight:1}}>DMCox ESY 2026</div>
            <div style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.4)'}}>🐻 Bear Cubs Dojo Board</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:22}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.6rem',color:'#fdb927',lineHeight:1}}>{totalPts}</div>
            <div style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.35)',letterSpacing:'0.05em'}}>CLASS TOTAL</div>
          </div>
          <Clock/>
        </div>
      </div>

      {/* PODIUM AREA — columns align to bottom, heights create staircase */}
      {top3.length>0&&(
        <div style={{
          flex:1,
          display:'flex',justifyContent:'center',alignItems:'flex-end',
          gap:10,padding:'0 30px',overflow:'hidden',minHeight:0,
        }}>
          <PodCol s={top3[1]} place={1}/>{/* 2nd — left */}
          <PodCol s={top3[0]} place={0}/>{/* 1st — center */}
          <PodCol s={top3[2]} place={2}/>{/* 3rd — right */}
        </div>
      )}

      {/* STUDENT GRID */}
      <div style={{
        display:'grid',
        gridTemplateColumns:`repeat(${cols},1fr)`,
        gridAutoRows:'72px',
        gap:6,padding:'8px 12px 10px',flexShrink:0,
      }}>
        {rest.map((s)=>{
          const pct=Math.min(100,s.points*2);
          return(
            <div key={s.id} style={{
              background:'linear-gradient(135deg,rgba(15,36,82,0.97),rgba(5,12,32,0.99))',
              border:'1px solid rgba(253,185,39,0.15)',borderRadius:10,
              padding:'0 10px',display:'flex',alignItems:'center',gap:8,
            }}>
              <div style={{fontSize:'1.3rem',background:s.color+'22',border:`2px solid ${s.color}`,
                borderRadius:'50%',width:38,height:38,flexShrink:0,
                display:'flex',alignItems:'center',justifyContent:'center'}}>{s.avatar}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'0.82rem',color:'white',
                  whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.first||s.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1rem',color:'#fdb927',
                    lineHeight:1,flexShrink:0}}>{s.points}</div>
                  <div style={{flex:1,background:'rgba(255,255,255,0.07)',borderRadius:4,height:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#fdb927,#e8970a)',borderRadius:4}}/>
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:4,flexShrink:0}}>
                <button onClick={()=>addPoints(s.id,1,null)} style={{background:'rgba(107,203,119,0.2)',border:'1px solid rgba(107,203,119,0.4)',color:'#6bcb77',borderRadius:6,cursor:'pointer',fontSize:'0.72rem',fontWeight:800,padding:'4px 8px'}}>+1</button>
                <button onClick={()=>addPoints(s.id,-1,null)} style={{background:'rgba(255,80,80,0.15)',border:'1px solid rgba(255,80,80,0.3)',color:'#ff8a8a',borderRadius:6,cursor:'pointer',fontSize:'0.72rem',fontWeight:800,padding:'4px 8px'}}>−1</button>
              </div>
            </div>
          );
        })}
      </div>

      <Ticker/>
    </div>
  );
}
