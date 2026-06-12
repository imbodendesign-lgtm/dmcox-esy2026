export default function PauseOverlay({on,onClose}){
  if(!on)return null;
  return(
    <div onClick={onClose} style={{
      position:'fixed',inset:0,
      background:'rgba(7,20,40,0.95)',
      zIndex:9999,
      display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',
    }}>
      <div style={{animation:'bearBounce 0.6s infinite alternate',fontSize:'7rem'}}>🐻</div>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'3rem',color:'#fdb927',marginTop:'1rem'}}>⏸ Paused</div>
      <div style={{color:'rgba(255,255,255,0.5)',marginTop:'0.5rem',fontSize:'1.1rem'}}>Click anywhere to resume</div>
    </div>
  );
}
