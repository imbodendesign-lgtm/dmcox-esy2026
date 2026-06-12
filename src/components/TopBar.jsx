import Clock from './Clock';
import BearSVG from './BearSVG';
export default function TopBar({onWelcome,onPause,paused,addToAll,showToast}){
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
      <div className="tb-ticker">🎉 Welcome to ESY 2026 at David M. Cox Elementary! 🐻 Go Bear Cubs! Keep earning Dojo Points! 🌟</div>
      <div className="tb-actions">
        <Clock/>
        <button className="btn btn-navy tb-btn" onClick={doAddAll} title="+1 to all">⭐ +All</button>
        <button className="btn btn-navy tb-btn" onClick={onPause} title="Pause">{paused?'▶':'⏸'}</button>
        <button className="btn btn-gold tb-btn" onClick={onWelcome} title="Welcome Screen">🏠 Welcome</button>
      </div>
    </div>
  );
}
