import {useState,useEffect,useRef,useCallback} from 'react';
import {GAMES,TRIVIA_QUESTIONS,VOCAB_WORDS,NEVADA_QUESTIONS} from '../data';

/* ── helpers ── */
function shuffle(a){return [...a].sort(()=>Math.random()-0.5);}
function rnd(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

/* ══════════════════════════════════════════════
   SPIN THE WHEEL
══════════════════════════════════════════════ */
const PRIZES=['⭐ +3 pts','🎲 +5 pts','🍬 +1 pt','🔥 +7 pts','💤 No pts','🌟 +10 pts','🎉 +4 pts','🎁 +2 pts'];
function SpinWheel({students,addPoints,addToAll,showToast}){
  const cv=useRef();const[spinning,setSpinning]=useState(false);const[result,setResult]=useState('');
  const[sel,setSel]=useState(students[0]?.id||null);
  function spin(){
    if(spinning)return;
    setSpinning(true);setResult('');
    const idx=rnd(0,PRIZES.length-1);
    const prize=PRIZES[idx];
    const canvas=cv.current;const ctx=canvas.getContext('2d');
    const arc=2*Math.PI/PRIZES.length;
    const colors=['#fdb927','#e8970a','#0d2048','#071428','#fdb927','#e8970a','#0d2048','#071428'];
    let angle=0;let totalRot=rnd(4,8)*2*Math.PI+idx*(2*Math.PI/PRIZES.length);
    let start=null;
    function step(ts){
      if(!start)start=ts;
      const elapsed=(ts-start)/3000;
      if(elapsed>=1){
        // draw final
        draw(totalRot);
        setSpinning(false);
        const pts=prize.match(/\+(\d+)/)?.[1];
        if(pts){const p=parseInt(pts);addPoints(sel,p,null);showToast(`${prize} — awarded to ${students.find(s=>s.id===sel)?.first||'class'}!`);}
        else showToast(`${prize} — spin again!`);
        setResult(prize);
        return;
      }
      const ease=1-Math.pow(1-elapsed,3);
      draw(totalRot*ease);
      requestAnimationFrame(step);
    }
    function draw(rot){
      ctx.clearRect(0,0,300,300);
      PRIZES.forEach((p,i)=>{
        ctx.beginPath();
        ctx.moveTo(150,150);
        ctx.arc(150,150,140,rot+i*arc,rot+(i+1)*arc);
        ctx.fillStyle=colors[i%colors.length];
        ctx.fill();
        ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
        ctx.save();ctx.translate(150,150);ctx.rotate(rot+(i+0.5)*arc);
        ctx.textAlign='right';ctx.fillStyle='#fff';ctx.font='bold 11px Nunito';
        ctx.fillText(p,130,5);ctx.restore();
      });
      // needle
      ctx.beginPath();ctx.moveTo(150,10);ctx.lineTo(142,30);ctx.lineTo(158,30);ctx.closePath();
      ctx.fillStyle='#ff4444';ctx.fill();
    }
    draw(0);requestAnimationFrame(step);
  }
  // initial draw
  useEffect(()=>{
    const canvas=cv.current;const ctx=canvas.getContext('2d');
    const arc=2*Math.PI/PRIZES.length;
    const colors=['#fdb927','#e8970a','#0d2048','#071428','#fdb927','#e8970a','#0d2048','#071428'];
    PRIZES.forEach((p,i)=>{
      ctx.beginPath();ctx.moveTo(150,150);ctx.arc(150,150,140,i*arc,(i+1)*arc);
      ctx.fillStyle=colors[i%colors.length];ctx.fill();
      ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
      ctx.save();ctx.translate(150,150);ctx.rotate((i+0.5)*arc);
      ctx.textAlign='right';ctx.fillStyle='#fff';ctx.font='bold 11px Nunito';
      ctx.fillText(p,130,5);ctx.restore();
    });
    ctx.beginPath();ctx.moveTo(150,10);ctx.lineTo(142,30);ctx.lineTo(158,30);ctx.closePath();
    ctx.fillStyle='#ff4444';ctx.fill();
  },[]);
  return(
    <div style={{textAlign:'center'}}>
      <canvas ref={cv} width={300} height={300} style={{borderRadius:'50%',boxShadow:'0 0 30px rgba(253,185,39,0.4)'}}/>
      <div style={{margin:'16px 0'}}>
        <label style={{color:'rgba(255,255,255,0.7)',marginRight:8}}>Award to:</label>
        <select value={sel||''} onChange={e=>setSel(parseInt(e.target.value))} style={{background:'#0d2048',color:'white',border:'1px solid rgba(253,185,39,0.3)',borderRadius:8,padding:'6px 12px',fontFamily:"'Nunito',sans-serif"}}>
          {students.map(s=><option key={s.id} value={s.id}>{s.first||s.name}</option>)}
        </select>
      </div>
      <button className="btn btn-gold" onClick={spin} disabled={spinning} style={{fontSize:'1.1rem',padding:'12px 32px'}}>
        {spinning?'Spinning…':'🎡 SPIN!'}
      </button>
      {result&&<div style={{marginTop:12,fontSize:'1.4rem',fontFamily:"'Fredoka One',cursive",color:'#fdb927'}}>{result}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MEMORY MATCH
══════════════════════════════════════════════ */
const EMOJIS=['🦁','🐯','🐻','🦊','🐺','🦝','🐸','🦋','🐬','🦅','🦄','🐲'];
function MemoryGame({addPoints,sel,showToast}){
  const[cards,setCards]=useState(()=>shuffle([...EMOJIS,...EMOJIS].map((e,i)=>({id:i,emoji:e,flipped:false,matched:false}))));
  const[flipped,setFlipped]=useState([]);const[moves,setMoves]=useState(0);const[won,setWon]=useState(false);
  const[locked,setLocked]=useState(false);
  function flip(i){
    if(locked||cards[i].flipped||cards[i].matched)return;
    const next=cards.map((c,idx)=>idx===i?{...c,flipped:true}:c);
    const nf=[...flipped,i];
    setCards(next);setFlipped(nf);
    if(nf.length===2){
      setLocked(true);setMoves(m=>m+1);
      if(next[nf[0]].emoji===next[nf[1]].emoji){
        const matched=next.map((c,idx)=>nf.includes(idx)?{...c,matched:true}:c);
        setTimeout(()=>{setCards(matched);setFlipped([]);setLocked(false);
          if(matched.every(c=>c.matched)){setWon(true);addPoints(sel,5,null);showToast('🃏 Memory Master! +5 pts!');}
        },400);
      } else {
        setTimeout(()=>{setCards(c=>c.map((cc,idx)=>nf.includes(idx)?{...cc,flipped:false}:cc));setFlipped([]);setLocked(false);},900);
      }
    } else setFlipped(nf);
  }
  function reset(){setCards(shuffle([...EMOJIS,...EMOJIS].map((e,i)=>({id:i,emoji:e,flipped:false,matched:false}))));setFlipped([]);setMoves(0);setWon(false);setLocked(false);}
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
        <span style={{color:'rgba(255,255,255,0.6)'}}>Moves: {moves}</span>
        <button className="btn btn-navy" onClick={reset} style={{padding:'4px 12px',fontSize:'0.85rem'}}>🔄 Reset</button>
      </div>
      {won&&<div style={{textAlign:'center',color:'#fdb927',fontSize:'1.4rem',fontFamily:"'Fredoka One',cursive",marginBottom:12}}>🎉 You Won in {moves} moves! +5 pts!</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
        {cards.map((c,i)=>(
          <div key={c.id} onClick={()=>flip(i)} style={{width:'100%',paddingBottom:'100%',position:'relative',cursor:'pointer'}}>
            <div style={{position:'absolute',inset:0,background:c.flipped||c.matched?'rgba(253,185,39,0.2)':'#0d2048',border:`2px solid ${c.matched?'#fdb927':c.flipped?'rgba(253,185,39,0.5)':'rgba(255,255,255,0.1)'}`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',transition:'all 0.2s'}}>
              {(c.flipped||c.matched)?c.emoji:'❓'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TRIVIA
══════════════════════════════════════════════ */
function TriviaGame({addPoints,sel,showToast}){
  const[qs]=useState(()=>shuffle(TRIVIA_QUESTIONS).slice(0,5));
  const[qi,setQi]=useState(0);const[score,setScore]=useState(0);const[done,setDone]=useState(false);
  const[chosen,setChosen]=useState(null);const[opts,setOpts]=useState([]);
  useEffect(()=>{if(qs[qi])setOpts(shuffle(qs[qi].o));setChosen(null);},[qi]);
  function pick(o){
    if(chosen)return;
    setChosen(o);
    if(o===qs[qi].a){setScore(s=>s+1);}
    setTimeout(()=>{
      if(qi+1>=qs.length){setDone(true);const earned=score+(o===qs[qi].a?1:0);addPoints(sel,earned,null);showToast(`🎓 Trivia done! +${earned} pts!`);}
      else setQi(i=>i+1);
    },1000);
  }
  if(done)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'3rem'}}>🎓</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>{score}/5 correct!</div><div style={{color:'rgba(255,255,255,0.7)'}}>+{score} Dojo Points awarded!</div></div>;
  const q=qs[qi];
  return(
    <div>
      <div style={{marginBottom:12,color:'rgba(255,255,255,0.5)',fontSize:'0.85rem'}}>Question {qi+1} of {qs.length} • Score: {score}</div>
      <div style={{fontSize:'1.2rem',fontFamily:"'Fredoka One',cursive",color:'white',marginBottom:20,lineHeight:1.4}}>{q.q}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {opts.map(o=>{
          let bg='rgba(13,32,72,0.8)';let border='rgba(253,185,39,0.2)';
          if(chosen){if(o===q.a){bg='rgba(107,203,119,0.2)';border='#6bcb77';}else if(o===chosen){bg='rgba(255,80,80,0.2)';border='#ff5050';}}
          return <button key={o} onClick={()=>pick(o)} disabled={!!chosen} style={{background:bg,border:`2px solid ${border}`,color:'white',borderRadius:12,padding:'14px 10px',cursor:chosen?'default':'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:'1rem',transition:'all 0.3s'}}>{o}</button>;
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FRACTION SMASH
══════════════════════════════════════════════ */
function genFraction(){
  const ops=['+','-'];const op=ops[rnd(0,1)];
  const d=rnd(2,8);const n1=rnd(1,d-1);const n2=rnd(1,d-1);
  let ansN,ansD;
  if(op==='+'){ansN=n1+n2;ansD=d;}
  else{const big=Math.max(n1,n2);const small=Math.min(n1,n2);ansN=big-small;ansD=d;}
  const g=(a,b)=>b===0?a:g(b,a%b);
  const gcd=g(ansN,ansD);
  return{q:`${n1}/${d} ${op} ${n2}/${d} = ?`,a:`${ansN/gcd}/${ansD/gcd}`};
}
function FractionGame({addPoints,sel,showToast}){
  const[frac,setFrac]=useState(genFraction);const[input,setInput]=useState('');
  const[score,setScore]=useState(0);const[total,setTotal]=useState(0);const[msg,setMsg]=useState('');
  const[done,setDone]=useState(false);const[timeLeft,setTimeLeft]=useState(30);
  useEffect(()=>{
    if(done)return;
    const t=setInterval(()=>setTimeLeft(tl=>{if(tl<=1){setDone(true);clearInterval(t);addPoints(sel,score,null);showToast(`⏱️ Time's up! +${score} pts!`);return 0;}return tl-1;}),1000);
    return()=>clearInterval(t);
  },[done]);
  function check(){
    const correct=input.trim()===frac.a;
    if(correct){setScore(s=>s+1);setMsg('✅ Correct!');}else{setMsg(`❌ Answer: ${frac.a}`);}
    setTotal(t=>t+1);setInput('');
    setTimeout(()=>{setFrac(genFraction());setMsg('');},700);
  }
  if(done)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'3rem'}}>🔢</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>{score}/{total} correct!</div><div style={{color:'rgba(255,255,255,0.7)'}}>+{score} Dojo Points!</div></div>;
  return(
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:'1.1rem',color:timeLeft<10?'#ff5050':'#fdb927',marginBottom:8,fontFamily:"'Orbitron',monospace"}}>⏱ {timeLeft}s</div>
      <div style={{fontSize:'2rem',fontFamily:"'Fredoka One',cursive",color:'white',margin:'20px 0'}}>{frac.q}</div>
      {msg&&<div style={{fontSize:'1.2rem',margin:'8px 0'}}>{msg}</div>}
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&check()}
        placeholder="e.g. 3/4" style={{background:'#0d2048',border:'2px solid rgba(253,185,39,0.4)',color:'white',borderRadius:10,padding:'10px 16px',fontSize:'1.2rem',width:140,textAlign:'center',fontFamily:"'Nunito',sans-serif"}}/>
      <br/><button className="btn btn-gold" onClick={check} style={{marginTop:12}}>Check ✓</button>
      <div style={{marginTop:16,color:'rgba(255,255,255,0.5)'}}>Score: {score}/{total}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   VOCAB LIGHTNING
══════════════════════════════════════════════ */
function VocabGame({addPoints,sel,showToast}){
  const[qs]=useState(()=>shuffle(VOCAB_WORDS).slice(0,5));
  const[qi,setQi]=useState(0);const[score,setScore]=useState(0);const[input,setInput]=useState('');
  const[msg,setMsg]=useState('');const[done,setDone]=useState(false);const[timeLeft,setTimeLeft]=useState(20);
  useEffect(()=>{
    if(done)return;
    setTimeLeft(20);setInput('');setMsg('');
    const t=setInterval(()=>setTimeLeft(tl=>{if(tl<=1){clearInterval(t);skip();return 0;}return tl-1;}),1000);
    return()=>clearInterval(t);
  },[qi,done]);
  function skip(){setMsg(`⏰ "${qs[qi].word}" = ${qs[qi].def}`);setTimeout(next,1200);}
  function next(){if(qi+1>=qs.length){setDone(true);addPoints(sel,score,null);showToast(`📝 Vocab done! +${score} pts!`);}else setQi(i=>i+1);}
  function check(){
    const ok=input.toLowerCase().includes(qs[qi].word.toLowerCase().slice(0,4));
    if(ok){setScore(s=>s+1);setMsg('✅ Nice!');}else setMsg(`❌ Was: ${qs[qi].def}`);
    setTimeout(next,900);
  }
  if(done)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'3rem'}}>📝</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>{score}/5 correct!</div></div>;
  const q=qs[qi];
  return(
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:'1rem',color:timeLeft<8?'#ff5050':'#fdb927',marginBottom:8,fontFamily:"'Orbitron',monospace"}}>⏱ {timeLeft}s</div>
      <div style={{fontSize:'1rem',color:'rgba(255,255,255,0.5)',marginBottom:4}}>Question {qi+1}/5</div>
      <div style={{background:'rgba(253,185,39,0.1)',border:'1px solid rgba(253,185,39,0.3)',borderRadius:16,padding:'20px',margin:'12px 0'}}>
        <div style={{color:'rgba(255,255,255,0.6)',marginBottom:8}}>What word means:</div>
        <div style={{fontSize:'1.3rem',color:'white',fontFamily:"'Fredoka One',cursive"}}>{q.def}</div>
      </div>
      {msg&&<div style={{margin:'8px 0',fontSize:'1.1rem'}}>{msg}</div>}
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&check()}
        placeholder="Type the word..." style={{background:'#0d2048',border:'2px solid rgba(253,185,39,0.4)',color:'white',borderRadius:10,padding:'10px 16px',fontSize:'1.1rem',width:220,textAlign:'center',fontFamily:"'Nunito',sans-serif"}}/>
      <br/><button className="btn btn-gold" onClick={check} style={{marginTop:10}}>Submit</button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEVADA EXPLORER
══════════════════════════════════════════════ */
function NevadaGame({addPoints,sel,showToast}){
  const[qs]=useState(()=>shuffle(NEVADA_QUESTIONS));
  const[qi,setQi]=useState(0);const[score,setScore]=useState(0);const[chosen,setChosen]=useState(null);const[done,setDone]=useState(false);const[opts,setOpts]=useState([]);
  useEffect(()=>{if(qs[qi])setOpts(shuffle(qs[qi].o));setChosen(null);},[qi]);
  function pick(o){
    if(chosen)return;setChosen(o);
    if(o===qs[qi].a)setScore(s=>s+1);
    setTimeout(()=>{if(qi+1>=qs.length){setDone(true);const s2=score+(o===qs[qi].a?1:0);addPoints(sel,s2,null);showToast(`🗺️ Explorer! +${s2} pts!`);}else setQi(i=>i+1);},1000);
  }
  if(done)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'3rem'}}>🗺️</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>{score}/{qs.length} correct!</div></div>;
  const q=qs[qi];
  return(
    <div>
      <div style={{marginBottom:12,color:'rgba(255,255,255,0.5)',fontSize:'0.85rem'}}>Nevada Q {qi+1}/{qs.length} • Score: {score}</div>
      <div style={{fontSize:'1.2rem',fontFamily:"'Fredoka One',cursive",color:'white',marginBottom:20}}>{q.q}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {opts.map(o=>{let bg='rgba(13,32,72,0.8)';let border='rgba(253,185,39,0.2)';
          if(chosen){if(o===q.a){bg='rgba(107,203,119,0.2)';border='#6bcb77';}else if(o===chosen){bg='rgba(255,80,80,0.2)';border='#ff5050';}}
          return <button key={o} onClick={()=>pick(o)} disabled={!!chosen} style={{background:bg,border:`2px solid ${border}`,color:'white',borderRadius:12,padding:'14px 10px',cursor:chosen?'default':'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:'1rem',transition:'all 0.3s'}}>{o}</button>;
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   POINT ROLL
══════════════════════════════════════════════ */
function DiceGame({addPoints,sel,students,showToast}){
  const[face,setFace]=useState(null);const[rolling,setRolling]=useState(false);
  const FACES=['⚀','⚁','⚂','⚃','⚄','⚅'];
  function roll(){
    if(rolling)return;setRolling(true);
    let count=0;const iv=setInterval(()=>{setFace(FACES[rnd(0,5)]);count++;if(count>12){clearInterval(iv);const f=rnd(0,5);setFace(FACES[f]);setRolling(false);const pts=f+1;addPoints(sel,pts,null);showToast(`🎲 Rolled ${f+1}! +${pts} pts to ${students.find(s=>s.id===sel)?.first||'student'}!`);}},80);
  }
  const selStudent=students.find(s=>s.id===sel);
  return(
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:'6rem',height:120,lineHeight:'120px',filter:'drop-shadow(0 0 20px rgba(253,185,39,0.5))'}}>
        {face||'🎲'}
      </div>
      <div style={{margin:'16px 0'}}>
        <label style={{color:'rgba(255,255,255,0.7)',marginRight:8}}>Roll for:</label>
        <select value={sel||''} onChange={()=>{}} style={{background:'#0d2048',color:'white',border:'1px solid rgba(253,185,39,0.3)',borderRadius:8,padding:'6px 12px',fontFamily:"'Nunito',sans-serif"}}>
          {students.map(s=><option key={s.id} value={s.id}>{s.first||s.name}</option>)}
        </select>
      </div>
      <button className="btn btn-gold" onClick={roll} disabled={rolling} style={{fontSize:'1.1rem',padding:'12px 32px'}}>
        {rolling?'Rolling…':'🎲 Roll the Dice!'}
      </button>
      <p style={{color:'rgba(255,255,255,0.4)',marginTop:12,fontSize:'0.85rem'}}>Roll 1–6 for bonus points</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   WHACK-A-BEAR
══════════════════════════════════════════════ */
function WhackGame({addPoints,sel,showToast}){
  const[holes]=useState(Array(9).fill(false));const[active,setActive]=useState([...holes]);
  const[score,setScore]=useState(0);const[timeLeft,setTimeLeft]=useState(30);const[started,setStarted]=useState(false);const[done,setDone]=useState(false);
  const timers=useRef([]);
  function start(){setStarted(true);}
  useEffect(()=>{
    if(!started||done)return;
    const ticking=setInterval(()=>setTimeLeft(t=>{if(t<=1){setDone(true);clearInterval(ticking);timers.current.forEach(clearTimeout);addPoints(sel,Math.min(score+0,6),null);showToast(`🐻 Whack done! +${Math.min(score,6)} pts!`);return 0;}return t-1;}),1000);
    const spawner=setInterval(()=>{
      const i=rnd(0,8);
      setActive(a=>{const n=[...a];n[i]=true;return n;});
      const t=setTimeout(()=>setActive(a=>{const n=[...a];n[i]=false;return n;}),700);
      timers.current.push(t);
    },500);
    return()=>{clearInterval(ticking);clearInterval(spawner);}
  },[started,done]);
  function whack(i){if(!active[i])return;setActive(a=>{const n=[...a];n[i]=false;return n;});setScore(s=>s+1);}
  if(!started)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'4rem',marginBottom:16}}>🐻</div><button className="btn btn-gold" onClick={start} style={{fontSize:'1.2rem',padding:'16px 40px'}}>Start Whackin'!</button><p style={{color:'rgba(255,255,255,0.5)',marginTop:12}}>Bop the bears as fast as you can for 30 seconds!</p></div>;
  if(done)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'3rem'}}>🐻</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>You whacked {score} bears!</div><div style={{color:'rgba(255,255,255,0.6)'}}>+{Math.min(score,6)} Dojo Points!</div></div>;
  return(
    <div style={{textAlign:'center'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
        <span style={{color:'#fdb927',fontFamily:"'Fredoka One',cursive",fontSize:'1.2rem'}}>Score: {score}</span>
        <span style={{color:timeLeft<10?'#ff5050':'rgba(255,255,255,0.7)',fontFamily:"'Orbitron',monospace"}}>⏱ {timeLeft}s</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,maxWidth:280,margin:'0 auto'}}>
        {active.map((a,i)=>(
          <div key={i} onClick={()=>whack(i)} style={{height:80,background:a?'rgba(253,185,39,0.2)':'rgba(13,32,72,0.8)',border:`3px solid ${a?'#fdb927':'rgba(255,255,255,0.1)'}`,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:a?'2rem':'0.5rem',cursor:'pointer',transition:'all 0.1s',userSelect:'none'}}>
            {a?'🐻':'・'}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SNAKE
══════════════════════════════════════════════ */
const CELL=20;const COLS=18;const ROWS=14;
function SnakeGame({addPoints,sel,showToast}){
  const cv=useRef();const[started,setStarted]=useState(false);const[dead,setDead]=useState(false);const[score,setScore]=useState(0);
  const state=useRef({snake:[{x:9,y:7}],dir:{x:1,y:0},food:{x:5,y:5},alive:true,score:0});
  useEffect(()=>{
    if(!started)return;
    const canvas=cv.current;const ctx=canvas.getContext('2d');
    function placeFood(){return{x:rnd(0,COLS-1),y:rnd(0,ROWS-1)};}
    function draw(){
      ctx.fillStyle='#071428';ctx.fillRect(0,0,COLS*CELL,ROWS*CELL);
      // food
      ctx.fillStyle='#ff5050';ctx.fillRect(state.current.food.x*CELL+2,state.current.food.y*CELL+2,CELL-4,CELL-4);
      // snake
      state.current.snake.forEach((s,i)=>{
        ctx.fillStyle=i===0?'#fdb927':'#6bcb77';
        ctx.fillRect(s.x*CELL+1,s.y*CELL+1,CELL-2,CELL-2);
      });
    }
    const loop=setInterval(()=>{
      if(!state.current.alive)return;
      const head={x:state.current.snake[0].x+state.current.dir.x,y:state.current.snake[0].y+state.current.dir.y};
      if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||state.current.snake.some(s=>s.x===head.x&&s.y===head.y)){
        state.current.alive=false;setDead(true);
        const pts=Math.min(8,Math.floor(state.current.score/3));addPoints(sel,pts,null);showToast(`🐍 Snake! Score ${state.current.score}! +${pts} pts!`);return;
      }
      state.current.snake.unshift(head);
      if(head.x===state.current.food.x&&head.y===state.current.food.y){
        state.current.score++;setScore(s=>s+1);state.current.food=placeFood();
      } else state.current.snake.pop();
      draw();
    },120);
    const keyh=(e)=>{
      const d=state.current.dir;
      if(e.key==='ArrowUp'&&d.y!==1)state.current.dir={x:0,y:-1};
      if(e.key==='ArrowDown'&&d.y!==-1)state.current.dir={x:0,y:1};
      if(e.key==='ArrowLeft'&&d.x!==1)state.current.dir={x:-1,y:0};
      if(e.key==='ArrowRight'&&d.x!==-1)state.current.dir={x:1,y:0};
      e.preventDefault();
    };
    window.addEventListener('keydown',keyh);draw();
    return()=>{clearInterval(loop);window.removeEventListener('keydown',keyh);}
  },[started]);
  function reset(){state.current={snake:[{x:9,y:7}],dir:{x:1,y:0},food:{x:5,y:5},alive:true,score:0};setScore(0);setDead(false);setStarted(false);}
  if(!started&&!dead)return(
    <div style={{textAlign:'center',padding:32}}>
      <div style={{fontSize:'4rem'}}>🐍</div>
      <div style={{color:'rgba(255,255,255,0.6)',margin:'12px 0'}}>Use arrow keys to control the snake!<br/>Eat food to grow. Don't hit the walls!</div>
      <button className="btn btn-gold" onClick={()=>setStarted(true)} style={{fontSize:'1.2rem',padding:'16px 40px'}}>Play Snake!</button>
    </div>
  );
  return(
    <div style={{textAlign:'center'}}>
      <div style={{display:'flex',justifyContent:'space-between',maxWidth:COLS*CELL,margin:'0 auto 8px'}}>
        <span style={{color:'#fdb927',fontFamily:"'Fredoka One',cursive"}}>Score: {score}</span>
        {dead&&<span style={{color:'#ff5050'}}>💀 Game Over!</span>}
      </div>
      <canvas ref={cv} width={COLS*CELL} height={ROWS*CELL} style={{border:'2px solid rgba(253,185,39,0.3)',borderRadius:8,display:'block',margin:'0 auto'}}/>
      {dead&&<button className="btn btn-gold" onClick={reset} style={{marginTop:16}}>🔄 Play Again</button>}
      {!dead&&<p style={{color:'rgba(255,255,255,0.4)',marginTop:8,fontSize:'0.8rem'}}>Use arrow keys • Click game area first</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   REACTION BLITZ
══════════════════════════════════════════════ */
function ReactionGame({addPoints,sel,showToast}){
  const[phase,setPhase]=useState('idle');const[color,setColor]=useState('#0d2048');
  const[times,setTimes]=useState([]);const[waiting,setWaiting]=useState(false);
  const start=useRef(null);const timer=useRef(null);
  function begin(){setPhase('wait');setColor('#0d2048');
    timer.current=setTimeout(()=>{setColor('#fdb927');setPhase('go');start.current=Date.now();},rnd(1500,4000));
  }
  function tap(){
    if(phase==='wait'){clearTimeout(timer.current);setPhase('idle');setColor('#ff5050');setTimes(t=>[...t,'Too early! ⚡']);return;}
    if(phase==='go'){const ms=Date.now()-start.current;setTimes(t=>[...t,ms]);setPhase('idle');setColor('#6bcb77');
      if(times.length>=4){const all=[...times,ms].filter(t=>typeof t==='number');const avg=Math.round(all.reduce((a,b)=>a+b,0)/all.length);const pts=avg<300?5:avg<500?4:avg<800?3:avg<1200?2:1;addPoints(sel,pts,null);showToast(`⚡ Avg ${avg}ms! +${pts} pts!`);setPhase('done');}
    }
  }
  if(phase==='done'){const valid=times.filter(t=>typeof t==='number');const avg=Math.round(valid.reduce((a,b)=>a+b,0)/valid.length);
    return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'3rem'}}>⚡</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>Avg: {avg}ms!</div><div style={{color:'rgba(255,255,255,0.6)'}}>{avg<300?'LIGHTNING fast! ⚡':avg<500?'Super Quick! 🔥':avg<800?'Pretty fast! 👍':'Keep practicing!'}</div></div>;
  }
  return(
    <div style={{textAlign:'center'}}>
      <div onClick={phase==='go'||phase==='wait'?tap:()=>{}} style={{width:240,height:240,borderRadius:'50%',background:color,border:'4px solid rgba(253,185,39,0.3)',margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center',cursor:phase==='idle'?'default':'pointer',transition:'background 0.1s',fontSize:'1.4rem',color:'white',fontFamily:"'Fredoka One',cursive",userSelect:'none'}}>
        {phase==='idle'&&'Ready?'}{phase==='wait'&&'Wait...'}{phase==='go'&&'TAP NOW! ⚡'}
      </div>
      {phase==='idle'&&<button className="btn btn-gold" onClick={begin} style={{fontSize:'1.1rem',padding:'12px 32px'}}>{times.length===0?'Start!':'Next Round'} ({times.length}/5)</button>}
      {times.length>0&&<div style={{marginTop:12}}>{times.map((t,i)=><div key={i} style={{color:typeof t==='number'?'#6bcb77':'#ff5050',fontSize:'0.9rem'}}>{typeof t==='number'?`Round ${i+1}: ${t}ms`:t}</div>)}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   BALLOON POP
══════════════════════════════════════════════ */
function BalloonGame({addPoints,sel,showToast}){
  const[balloons,setBalloons]=useState([]);const[score,setScore]=useState(0);const[timeLeft,setTimeLeft]=useState(30);const[started,setStarted]=useState(false);const[done,setDone]=useState(false);
  const scoreRef=useRef(0);
  useEffect(()=>{if(!started)return;
    const spawner=setInterval(()=>{setBalloons(b=>[...b,{id:Date.now()+Math.random(),x:rnd(5,85),color:['#ff6b6b','#fdb927','#6bcb77','#4d96ff','#cc5de8'][rnd(0,4)],pts:rnd(1,3)}].slice(-15));},400);
    const ticker=setInterval(()=>setTimeLeft(t=>{if(t<=1){setDone(true);clearInterval(spawner);clearInterval(ticker);const pts=Math.min(6,Math.floor(scoreRef.current/2));addPoints(sel,pts,null);showToast(`🎯 Popped ${scoreRef.current}! +${pts} pts!`);return 0;}return t-1;}),1000);
    return()=>{clearInterval(spawner);clearInterval(ticker);};
  },[started]);
  function pop(id,pts){setBalloons(b=>b.filter(b=>b.id!==id));setScore(s=>{const n=s+pts;scoreRef.current=n;return n;});}
  if(!started)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'4rem'}}>🎈</div><p style={{color:'rgba(255,255,255,0.6)',margin:'12px 0'}}>Pop as many balloons as you can in 30 seconds!</p><button className="btn btn-gold" onClick={()=>setStarted(true)} style={{fontSize:'1.2rem',padding:'16px 40px'}}>Pop Balloons!</button></div>;
  if(done)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'3rem'}}>🎈</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>Popped {score} balloons!</div><div style={{color:'rgba(255,255,255,0.6)'}}>+{Math.min(6,Math.floor(score/2))} Dojo Points!</div></div>;
  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
        <span style={{color:'#fdb927',fontFamily:"'Fredoka One',cursive"}}>Popped: {score}</span>
        <span style={{color:timeLeft<10?'#ff5050':'rgba(255,255,255,0.7)',fontFamily:"'Orbitron',monospace"}}>⏱ {timeLeft}s</span>
      </div>
      <div style={{position:'relative',height:320,background:'rgba(13,32,72,0.4)',borderRadius:16,overflow:'hidden',border:'2px solid rgba(253,185,39,0.2)'}}>
        {balloons.map(b=>(
          <div key={b.id} onClick={()=>pop(b.id,b.pts)} style={{position:'absolute',bottom:0,left:`${b.x}%`,transform:'translateX(-50%)',cursor:'pointer',userSelect:'none',animation:'floatUp 4s linear forwards'}}
          >
            <div style={{fontSize:'2.5rem',filter:`drop-shadow(0 0 8px ${b.color})`,userSelect:'none'}}>🎈</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes floatUp{0%{bottom:0;opacity:1}100%{bottom:100%;opacity:0}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   COLOR MATCH
══════════════════════════════════════════════ */
const CLRS=[{name:'Red',hex:'#ff5050'},{name:'Blue',hex:'#4d96ff'},{name:'Green',hex:'#6bcb77'},{name:'Yellow',hex:'#fdb927'},{name:'Purple',hex:'#cc5de8'},{name:'Orange',hex:'#ff922b'}];
function ColorGame({addPoints,sel,showToast}){
  const[round,setRound]=useState(0);const[score,setScore]=useState(0);const[target,setTarget]=useState(null);const[opts,setOpts]=useState([]);const[msg,setMsg]=useState('');const[done,setDone]=useState(false);const[timeLeft,setTimeLeft]=useState(5);
  const TOTAL=8;
  function newRound(sc){
    const t=CLRS[rnd(0,CLRS.length-1)];const wrong=shuffle(CLRS.filter(c=>c.name!==t.name)).slice(0,3);
    setTarget(t);setOpts(shuffle([t,...wrong]));setMsg('');setTimeLeft(5);
  }
  useEffect(()=>{newRound(0);},[]);
  useEffect(()=>{
    if(done||!target)return;
    const t=setInterval(()=>setTimeLeft(tl=>{if(tl<=1){clearInterval(t);setMsg('⏰ Too slow!');const nr=round+1;setRound(nr);if(nr>=TOTAL){setDone(true);addPoints(sel,score,null);showToast(`🌈 Color Master! +${score} pts!`);}else setTimeout(()=>newRound(score),700);return 0;}return tl-1;}),1000);
    return()=>clearInterval(t);
  },[round,done,target]);
  function pick(c){
    const ok=c.name===target.name;if(ok)setScore(s=>s+1);
    setMsg(ok?'✅ Match!':'❌ Wrong!');
    clearTimeout(undefined);
    const nr=round+1;setRound(nr);
    if(nr>=TOTAL){setTimeout(()=>{setDone(true);addPoints(sel,ok?score+1:score,null);showToast(`🌈 Done! +${ok?score+1:score} pts!`);},600);}
    else setTimeout(()=>newRound(ok?score+1:score),600);
  }
  if(!target)return null;
  if(done)return <div style={{textAlign:'center',padding:32}}><div style={{fontSize:'3rem'}}>🌈</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>{score}/{TOTAL} correct!</div></div>;
  return(
    <div style={{textAlign:'center'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
        <span style={{color:'rgba(255,255,255,0.5)'}}>Round {round+1}/{TOTAL} • Score: {score}</span>
        <span style={{color:timeLeft<3?'#ff5050':'rgba(255,255,255,0.7)',fontFamily:"'Orbitron',monospace"}}>⏱ {timeLeft}s</span>
      </div>
      <div style={{fontSize:'1.2rem',color:'rgba(255,255,255,0.7)',marginBottom:8}}>Tap the color:</div>
      <div style={{fontSize:'3rem',fontFamily:"'Fredoka One',cursive",color:target.hex,marginBottom:20,textShadow:`0 0 30px ${target.hex}`}}>{target.name}</div>
      {msg&&<div style={{fontSize:'1.2rem',margin:'0 0 12px'}}>{msg}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,maxWidth:320,margin:'0 auto'}}>
        {opts.map(c=>(
          <button key={c.name} onClick={()=>pick(c)} style={{background:c.hex,border:'none',borderRadius:16,height:80,cursor:'pointer',fontSize:'1.1rem',fontFamily:"'Fredoka One',cursive",color:'white',textShadow:'0 1px 3px rgba(0,0,0,0.5)',transition:'transform 0.1s',userSelect:'none'}}
            onMouseDown={e=>e.currentTarget.style.transform='scale(0.95)'}
            onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
          >{c.name}</button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GAMES PANEL
══════════════════════════════════════════════ */
export default function Games({students,addPoints,addToAll,showToast,showModal,closeModal}){
  const[selStudent,setSelStudent]=useState(students[0]?.id||null);
  function open(g){
    const sel=selStudent;
    const header=(
      <div style={{marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2 style={{margin:0}}>{g.icon} {g.name}</h2>
          <div>
            <label style={{color:'rgba(255,255,255,0.6)',marginRight:8,fontSize:'0.85rem'}}>Player:</label>
            <select defaultValue={sel} onChange={e=>setSelStudent(parseInt(e.target.value))} style={{background:'#0d2048',color:'white',border:'1px solid rgba(253,185,39,0.3)',borderRadius:8,padding:'4px 10px',fontSize:'0.85rem'}}>
              {students.map(s=><option key={s.id} value={s.id}>{s.first||s.name}</option>)}
            </select>
          </div>
        </div>
        <p style={{color:'rgba(255,255,255,0.5)',margin:0,fontSize:'0.9rem'}}>{g.desc} {typeof g.pts==='number'?`• Up to +${g.pts} pts`:''}</p>
      </div>
    );
    let game=null;
    if(g.id==='spin') game=<SpinWheel students={students} addPoints={addPoints} addToAll={addToAll} showToast={showToast}/>;
    else if(g.id==='memory') game=<MemoryGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='trivia') game=<TriviaGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='fraction') game=<FractionGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='vocab') game=<VocabGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='nevada') game=<NevadaGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='dice') game=<DiceGame addPoints={addPoints} sel={sel} students={students} showToast={showToast}/>;
    else if(g.id==='whack') game=<WhackGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='snake') game=<SnakeGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='reaction') game=<ReactionGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='balloon') game=<BalloonGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    else if(g.id==='colormatch') game=<ColorGame addPoints={addPoints} sel={sel} showToast={showToast}/>;
    showModal(<div>{header}{game}<div className="m-btns" style={{marginTop:20}}><button className="btn btn-navy" onClick={closeModal}>Close</button></div></div>);
  }
  return(
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,marginBottom:16}}>
        <div className="sec-head" style={{marginBottom:0}}>🎮 Games <span className="sec-pill">{GAMES.length} Games</span></div>
        <div>
          <label style={{color:'rgba(255,255,255,0.6)',marginRight:8,fontSize:'0.85rem'}}>Default Player:</label>
          <select value={selStudent||''} onChange={e=>setSelStudent(parseInt(e.target.value))} style={{background:'#0d2048',color:'white',border:'1px solid rgba(253,185,39,0.3)',borderRadius:8,padding:'6px 12px'}}>
            {students.map(s=><option key={s.id} value={s.id}>{s.first||s.name}</option>)}
          </select>
        </div>
      </div>
      <div className="game-grid">
        {GAMES.map(g=>(
          <div key={g.id} className="game-card" onClick={()=>open(g)}>
            <div className="gc-icon">{g.icon}</div>
            <div className="gc-name">{g.name}</div>
            <div className="gc-desc">{g.desc}</div>
            <div className="gc-pts">{typeof g.pts==='number'?`+${g.pts} pts max`:g.pts==='varies'?'Varies':g.pts}</div>
          </div>
        ))}
      </div>
    </>
  );
}
