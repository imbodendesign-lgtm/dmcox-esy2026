import {ACTIVITIES} from '../data';
export default function Activities({students,addPoints,showToast,showModal,closeModal}){
  function award(act){
    showModal(
      <div>
        <h2>{act.icon} {act.name}</h2>
        <p>{act.desc}</p>
        <p style={{color:'rgba(255,255,255,0.6)'}}>Award <strong style={{color:'#fdb927'}}>+{act.pts} pts</strong> to:</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:16}}>
          {students.map(s=>(
            <button key={s.id} onClick={()=>{addPoints(s.id,act.pts,null);showToast(`${act.icon} +${act.pts} to ${s.first||s.name}!`);closeModal();}}
              style={{background:'rgba(253,185,39,0.1)',border:'1px solid rgba(253,185,39,0.3)',color:'white',borderRadius:10,padding:'10px 6px',cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:'0.85rem'}}>
              <div>{s.avatar}</div><div>{s.first||s.name}</div>
            </button>
          ))}
          <button onClick={()=>{students.forEach(s=>addPoints(s.id,act.pts,null));showToast(`${act.icon} +${act.pts} to ALL!`);closeModal();}}
            style={{background:'rgba(107,203,119,0.1)',border:'1px solid rgba(107,203,119,0.3)',color:'#6bcb77',borderRadius:10,padding:'10px 6px',cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:800,gridColumn:'span 3'}}>
            🌟 Award to ALL Students
          </button>
        </div>
        <div className="m-btns"><button className="btn btn-navy" onClick={closeModal}>Cancel</button></div>
      </div>
    );
  }
  return(
    <>
      <div className="sec-head">📋 Activities</div>
      <div className="act-list">
        {ACTIVITIES.map((a,i)=>(
          <div key={i} className="act-item" onClick={()=>award(a)}>
            <div style={{fontSize:'2rem',marginRight:16}}>{a.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Fredoka One',cursive",color:'white'}}>{a.name}</div>
              <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.85rem'}}>{a.desc}</div>
              <div style={{fontSize:'0.75rem',color:'rgba(253,185,39,0.6)',marginTop:2}}>{a.sub}</div>
            </div>
            <div style={{fontFamily:"'Fredoka One',cursive",color:'#fdb927',fontSize:'1.3rem'}}>+{a.pts}</div>
          </div>
        ))}
      </div>
    </>
  );
}
