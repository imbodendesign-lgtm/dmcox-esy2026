export function fireConfetti(n=20){
  const cols=['#FFD600','#1340A0','#1a7a30','#C62828','#7B1FA2','#F9A825','#00BCD4','#FFCA28'];
  for(let i=0;i<n;i++){
    const el=document.createElement('div');
    el.className='conf';
    const sz=5+Math.random()*10;
    el.style.cssText=`left:${Math.random()*100}vw;top:0;width:${sz}px;height:${sz}px;
      background:${cols[Math.floor(Math.random()*cols.length)]};
      animation-duration:${1.4+Math.random()*2}s;
      animation-delay:${Math.random()*0.4}s;
      border-radius:${Math.random()>.5?'50%':'3px'};`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),3500);
  }
}
