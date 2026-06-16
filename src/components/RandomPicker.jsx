import {useState,useRef,useEffect} from 'react';

export default function RandomPicker({students}){
  const[spinning,setSpinning]=useState(false);
  const[winner,setWinner]=useState(null);
  const[displayIdx,setDisplayIdx]=useState(0);
  const[celebrated,setCelebrated]=useState(false);
  const timerRef=useRef(null);
  const confRef=useRef([]);

  function spin(){
    if(spinning||students.length===0)return;
    setWinner(null);
    setCelebrated(false);
    setSpinning(true);

    const winnerIdx=Math.floor(Math.random()*students.length);
    let i=0;
    const totalSteps=28+Math.floor(Math.random()*14);

    function step(){
      const idx=Math.floor(Math.random()*students.length);
      setDisplayIdx(idx);
      i++;
      const delay=i<10?60:i<20?120:i<26?220:380;
      if(i<totalSteps){
        timerRef.current=setTimeout(step,delay);
      }else{
        setDisplayIdx(winnerIdx);
        setWinner(students[winnerIdx]);
        setSpinning(false);
        setCelebrated(true);
      }
    }
    step();
  }

  useEffect(()=>()=>{if(timerRef.current)clearTimeout(timerRef.current);},[]);

  const current=spinning?students[displayIdx]:winner;

  // build confetti pieces once
  if(confRef.current.length===0){
    confRef.current=Array.from({length:30},(_,i)=>({
      id:i,left:Math.random()*100,
      color:['#fdb927','#ff6b6b','#6bcb77','#4d96ff','#cc5de8','#ff922b'][i%6],
      size:8+Math.random()*10,
      delay:Math.random()*0.6,
      dur:1.2+Math.random()*0.8,
    }));
  }

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:24,paddingTop:10}}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.6rem',color:'#fdb927',textAlign:'center'}}>
        🎲 Random Student Picker
      </div>
      <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.9rem',marginTop:-18}}>
        Who gets called on next?
      </div>

      {/* Display card */}
      <div style={{
        width:220,height:220,
        background:'linear-gradient(145deg,rgba(13,32,72,0.95),rgba(4,10,28,0.98))',
        border:`3px solid ${current&&!spinning?'#fdb927':'rgba(253,185,39,0.25)'}`,
        borderRadius:28,
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        gap:10,position:'relative',overflow:'hidden',
        boxShadow:current&&!spinning?'0 0 60px rgba(253,185,39,0.35)':'none',
        transition:'border-color 0.3s,box-shadow 0.3s',
      }}>
        {/* Spin glow ring */}
        {spinning&&(
          <div style={{
            position:'absolute',inset:-3,borderRadius:30,
            border:'3px solid transparent',
            background:'linear-gradient(#071428,#071428) padding-box,linear-gradient(var(--a,0deg),#fdb927,#4d96ff,#fdb927) border-box',
            animation:'spinRing 0.6s linear infinite',
          }}/>
        )}

        {current?(
          <>
            <div style={{
              fontSize:'4rem',
              background:current.color+'22',
              border:`3px solid ${current.color}`,
              borderRadius:'50%',width:90,height:90,
              display:'flex',alignItems:'center',justifyContent:'center',
              animation:spinning?'cardFlicker 0.12s infinite alternate':'winnerPop 0.4s ease',
            }}>{current.avatar}</div>
            <div style={{
              fontFamily:"'Fredoka One',cursive",
              fontSize:'1.5rem',color:'white',textAlign:'center',
            }}>{current.first||current.name}</div>
            {!spinning&&winner&&(
              <div style={{
                background:'linear-gradient(135deg,#fdb927,#e8970a)',
                color:'#071428',fontFamily:"'Fredoka One',cursive",
                fontSize:'0.8rem',padding:'3px 14px',borderRadius:50,
                animation:'badgePop 0.3s 0.1s both ease',
              }}>🌟 Selected!</div>
            )}
          </>
        ):(
          <div style={{fontSize:'3rem',color:'rgba(255,255,255,0.15)'}}>?</div>
        )}
      </div>

      {/* Confetti burst on winner */}
      {celebrated&&!spinning&&(
        <div style={{position:'absolute',top:'35%',left:0,right:0,pointerEvents:'none'}}>
          {confRef.current.map(c=>(
            <div key={c.id} style={{
              position:'absolute',left:`${c.left}%`,
              width:c.size,height:c.size,
              background:c.color,borderRadius:3,
              animation:`confettiFall ${c.dur}s ${c.delay}s forwards ease-in`,
            }}/>
          ))}
        </div>
      )}

      {/* Spin button */}
      <button onClick={spin} disabled={spinning} style={{
        background:spinning
          ?'rgba(253,185,39,0.1)'
          :'linear-gradient(135deg,#fdb927,#e8970a)',
        color:spinning?'rgba(255,255,255,0.3)':'#071428',
        border:'none',borderRadius:16,
        padding:'16px 48px',
        fontFamily:"'Fredoka One',cursive",fontSize:'1.4rem',
        cursor:spinning?'not-allowed':'pointer',
        boxShadow:spinning?'none':'0 4px 24px rgba(253,185,39,0.4)',
        transition:'all 0.2s',
        transform:spinning?'scale(0.96)':'scale(1)',
      }}>{spinning?'🎲 Picking...':'🎲 Pick Someone!'}</button>

      {/* All students mini-roster */}
      <div style={{width:'100%',maxWidth:700}}>
        <div style={{
          fontFamily:"'Fredoka One',cursive",fontSize:'1rem',
          color:'rgba(255,255,255,0.4)',marginBottom:10,textAlign:'center',letterSpacing:'0.08em',
        }}>ALL STUDENTS</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
          {students.map(s=>(
            <div key={s.id} style={{
              background:winner?.id===s.id
                ?'linear-gradient(135deg,rgba(253,185,39,0.25),rgba(232,151,10,0.15))'
                :'rgba(255,255,255,0.05)',
              border:`1px solid ${winner?.id===s.id?'rgba(253,185,39,0.6)':'rgba(255,255,255,0.1)'}`,
              borderRadius:10,padding:'6px 14px',
              fontFamily:"'Nunito',sans-serif",fontWeight:700,
              fontSize:'0.85rem',color:winner?.id===s.id?'#fdb927':'rgba(255,255,255,0.6)',
              display:'flex',alignItems:'center',gap:6,
              transition:'all 0.3s',
            }}>
              <span>{s.avatar}</span>{s.first||s.name}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spinRing{to{transform:rotate(360deg);}}
        @keyframes cardFlicker{from{opacity:0.7;}to{opacity:1;}}
        @keyframes winnerPop{0%{transform:scale(0.7);}60%{transform:scale(1.15);}100%{transform:scale(1);}}
        @keyframes badgePop{from{opacity:0;transform:scale(0.5);}to{opacity:1;transform:scale(1);}}
        @keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(200px) rotate(360deg);opacity:0;}}
      `}</style>
    </div>
  );
}
