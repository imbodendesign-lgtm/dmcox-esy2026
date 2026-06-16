import BearSVG from './BearSVG';
export default function About({students,resetAll,addStudent,showToast,showModal,closeModal}){
  function confirmReset(){
    showModal(
      <div>
        <h2>⚠️ Reset All Points?</h2>
        <p>This will set ALL student points back to 0. This cannot be undone.</p>
        <div className="m-btns">
          <button className="btn" style={{background:'rgba(255,80,80,0.2)',border:'1px solid #ff5050',color:'#ff5050'}} onClick={()=>{resetAll();showToast('🔄 All points reset!');closeModal();}}>Reset All</button>
          <button className="btn btn-navy" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    );
  }
  function addStu(){
    let name='';
    showModal(
      <div>
        <h2>➕ Add Student</h2>
        <input id="stu-inp" autoFocus placeholder="Student first name..." style={{background:'#0d2048',border:'2px solid rgba(253,185,39,0.4)',color:'white',borderRadius:10,padding:'10px 16px',fontSize:'1.1rem',width:'100%',fontFamily:"'Nunito',sans-serif",boxSizing:'border-box',marginBottom:16}}
          onChange={e=>name=e.target.value} onKeyDown={e=>{if(e.key==='Enter'&&name.trim()){addStudent(name.trim());showToast(`➕ ${name.trim()} added!`);closeModal();}}}/>
        <div className="m-btns">
          <button className="btn btn-gold" onClick={()=>{if(name.trim()){addStudent(name.trim());showToast(`➕ ${name.trim()} added!`);closeModal();}else document.getElementById('stu-inp').focus();}}>Add</button>
          <button className="btn btn-navy" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    );
  }
  return(
    <>
      <div className="sec-head">ℹ️ About</div>
      <div style={{textAlign:'center',marginBottom:32}}>
        <BearSVG size={100}/>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.8rem',color:'#fdb927',margin:'12px 0'}}>DMCox ESY 2026</div>
        <div style={{color:'rgba(255,255,255,0.6)'}}>David M. Cox Elementary • Henderson, NV</div>
        <div style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem',marginTop:4}}>Bear Cubs Classroom Manager</div>
      </div>
      <div style={{display:'grid',gap:12,maxWidth:500,margin:'0 auto'}}>
        <div style={{background:'rgba(13,32,72,0.6)',border:'1px solid rgba(253,185,39,0.2)',borderRadius:16,padding:20}}>
          <div style={{fontFamily:"'Fredoka One',cursive",color:'#fdb927',marginBottom:12}}>📊 Quick Stats</div>
          <div style={{color:'rgba(255,255,255,0.7)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:'0.9rem'}}>
            <div>Students: <strong style={{color:'white'}}>{students.length}</strong></div>
            <div>Total pts: <strong style={{color:'white'}}>{students.reduce((s,st)=>s+st.points,0)}</strong></div>
            <div>Avg pts: <strong style={{color:'white'}}>{students.length?Math.round(students.reduce((s,st)=>s+st.points,0)/students.length):0}</strong></div>
            <div>Top: <strong style={{color:'white'}}>{[...students].sort((a,b)=>b.points-a.points)[0]?.first||'—'}</strong></div>
          </div>
        </div>
        <button className="btn btn-gold" onClick={addStu} style={{padding:'14px'}}>➕ Add Student</button>
        <button className="btn" onClick={confirmReset} style={{padding:'14px',background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.3)',color:'#ff8a8a'}}>🔄 Reset All Points</button>
        <div style={{textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:'0.75rem',marginTop:8}}>Data saved locally in browser</div>
      </div>
    </>
  );
}
