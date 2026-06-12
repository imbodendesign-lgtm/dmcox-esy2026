import {REWARDS} from '../data';
export default function Rewards({students,addToAll,showToast,showModal,closeModal}){
  const total=students.reduce((s,st)=>s+st.points,0);
  function redeem(r){
    showModal(
      <div>
        <h2>{r.icon} {r.name}</h2>
        <p>{r.desc}</p>
        <p style={{color:'rgba(255,255,255,0.6)'}}>Class total: <strong style={{color:'#fdb927'}}>{total} pts</strong> needed: {r.cost} pts</p>
        {total>=r.cost
          ?<><p style={{color:'#6bcb77'}}>✅ You have enough points!</p>
            <div className="m-btns">
              <button className="btn btn-gold" onClick={()=>{addToAll(-Math.floor(r.cost/students.length));showToast(`🎉 ${r.name} unlocked! Enjoy!`);closeModal();}}>🎉 Unlock!</button>
              <button className="btn btn-navy" onClick={closeModal}>Cancel</button>
            </div></>
          :<><p style={{color:'#ff5050'}}>Need {r.cost-total} more points as a class.</p>
            <div className="m-btns"><button className="btn btn-navy" onClick={closeModal}>OK</button></div></>
        }
      </div>
    );
  }
  return(
    <>
      <div className="sec-head">🏆 Class Rewards</div>
      <div style={{background:'linear-gradient(135deg,rgba(253,185,39,0.1),rgba(13,32,72,0.4))',border:'1px solid rgba(253,185,39,0.3)',borderRadius:16,padding:'16px',marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{color:'rgba(255,255,255,0.6)',fontSize:'0.85rem'}}>Class Total Points</div>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'2rem',color:'#fdb927'}}>{total} pts</div>
        </div>
        <div style={{fontSize:'3rem'}}>🌟</div>
      </div>
      <div className="reward-grid">
        {REWARDS.map((r,i)=>{
          const pct=Math.min(100,(total/r.cost)*100);
          return(
            <div key={i} className="reward-card" onClick={()=>redeem(r)}>
              <div style={{fontSize:'2.5rem',marginBottom:8}}>{r.icon}</div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.1rem',color:'white'}}>{r.name}</div>
              <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.8rem',marginBottom:10}}>{r.desc}</div>
              <div style={{background:'rgba(255,255,255,0.06)',borderRadius:8,height:8,overflow:'hidden',marginBottom:6}}>
                <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#fdb927,#e8970a)',borderRadius:8,transition:'width 0.8s'}}/>
              </div>
              <div style={{fontSize:'0.85rem',color:total>=r.cost?'#6bcb77':'#fdb927'}}>{total>=r.cost?'✅ UNLOCKED!':r.cost+' pts needed'}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
