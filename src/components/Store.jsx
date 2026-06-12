import {useState} from 'react';
import {STORE_ITEMS,STORE_AVATARS} from '../data';

export default function Store({students,addPoints,updateStudent,showToast,showModal,closeModal}){
  const[tab,setTab]=useState('teacher');
  const[kioskStu,setKioskStu]=useState(null); // null = show roster picker
  const[kioskTab,setKioskTab]=useState('shop'); // 'shop' | 'avatar'

  const stu=students.find(s=>s.id===kioskStu);

  function teacherBuy(item){
    showModal(
      <div>
        <h2 style={{fontFamily:"'Fredoka One',cursive",color:'#fdb927',marginBottom:8}}>{item.icon} {item.name}</h2>
        <p style={{color:'rgba(255,255,255,0.7)',marginBottom:12}}>{item.desc}</p>
        <p style={{color:'rgba(255,255,255,0.6)',marginBottom:14}}>Cost: <strong style={{color:'#fdb927'}}>{item.cost} pts</strong> — Pick a student:</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:16}}>
          {students.map(s=>(
            <button key={s.id} onClick={()=>{addPoints(s.id,-item.cost,null);showToast(`${item.icon} ${item.name} redeemed for ${s.first||s.name}!`);closeModal();}}
              disabled={s.points<item.cost}
              style={{background:s.points>=item.cost?'rgba(253,185,39,0.15)':'rgba(255,255,255,0.04)',border:`1px solid ${s.points>=item.cost?'rgba(253,185,39,0.4)':'rgba(255,255,255,0.1)'}`,color:s.points>=item.cost?'white':'rgba(255,255,255,0.3)',borderRadius:10,padding:'10px 6px',cursor:s.points>=item.cost?'pointer':'not-allowed',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:'0.85rem'}}>
              <div style={{fontSize:'1.4rem'}}>{s.avatar}</div>
              <div>{s.first||s.name}</div>
              <div style={{fontSize:'0.75rem',color:s.points>=item.cost?'#fdb927':'rgba(255,255,255,0.3)'}}>{s.points} pts</div>
            </button>
          ))}
        </div>
        <div className="m-btns"><button className="btn btn-navy" onClick={closeModal}>Cancel</button></div>
      </div>
    );
  }

  function kioskBuy(item){
    if(!stu||stu.points<item.cost){showToast('❌ Not enough points!');return;}
    showModal(
      <div>
        <h2 style={{fontFamily:"'Fredoka One',cursive",color:'#fdb927',marginBottom:8}}>{item.icon} {item.name}</h2>
        <p style={{color:'rgba(255,255,255,0.7)',marginBottom:12}}>{item.desc}</p>
        <p style={{marginBottom:16}}>
          Spend <strong style={{color:'#fdb927'}}>{item.cost} pts</strong>?<br/>
          <span style={{color:'rgba(255,255,255,0.5)',fontSize:'0.9rem'}}>You have {stu.points} pts — {stu.points-item.cost} left after.</span>
        </p>
        <div className="m-btns">
          <button className="btn btn-gold" onClick={()=>{addPoints(stu.id,-item.cost,null);showToast(`${item.icon} ${stu.first||stu.name} bought ${item.name}!`);closeModal();}}>✅ Buy It!</button>
          <button className="btn btn-navy" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    );
  }

  function RosterPicker(){
    return(
      <div>
        <div style={{textAlign:'center',marginBottom:18}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.5rem',color:'#fdb927',marginBottom:4}}>Who's shopping? 🛒</div>
          <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.9rem'}}>Tap your card to enter the store!</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:10}}>
          {students.map(s=>(
            <button key={s.id} onClick={()=>setKioskStu(s.id)}
              style={{
                background:'linear-gradient(145deg,rgba(13,32,72,0.9),rgba(4,10,28,0.95))',
                border:'2px solid rgba(253,185,39,0.25)',
                borderRadius:14,padding:'14px 8px',cursor:'pointer',
                display:'flex',flexDirection:'column',alignItems:'center',gap:5,
                transition:'transform 0.15s,border-color 0.15s',
                fontFamily:"'Nunito',sans-serif",color:'white',
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.07)';e.currentTarget.style.borderColor='rgba(253,185,39,0.7)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.borderColor='rgba(253,185,39,0.25)';}}
            >
              <div style={{fontSize:'2rem'}}>{s.avatar}</div>
              <div style={{fontWeight:800,fontSize:'0.85rem',lineHeight:1.2,textAlign:'center'}}>{s.first||s.name}</div>
              <div style={{fontSize:'0.8rem',color:'#fdb927',fontWeight:700}}>{s.points} pts</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function ShoppingView(){
    return(
      <>
        {/* Student banner */}
        <div style={{
          background:'linear-gradient(135deg,rgba(253,185,39,0.1),rgba(13,32,72,0.7))',
          border:'2px solid rgba(253,185,39,0.35)',
          borderRadius:16,padding:'12px 16px',marginBottom:14,
          display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,
        }}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:'2.4rem',filter:'drop-shadow(0 0 8px rgba(253,185,39,0.5))'}}>{stu.avatar}</div>
            <div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.2rem',color:'white'}}>{stu.first||stu.name}</div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.1rem',color:'#fdb927'}}>{stu.points} pts to spend</div>
            </div>
          </div>
          <button onClick={()=>{setKioskStu(null);setKioskTab('shop');}}
            style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.7)',borderRadius:10,padding:'8px 14px',cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:'0.85rem'}}>
            ← Switch Student
          </button>
        </div>

        {/* Shop / Avatar tabs */}
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <button onClick={()=>setKioskTab('shop')}
            className={`btn ${kioskTab==='shop'?'btn-gold':'btn-navy'}`}>🛒 Shop</button>
          <button onClick={()=>setKioskTab('avatar')}
            className={`btn ${kioskTab==='avatar'?'btn-gold':'btn-navy'}`}>🎨 Change Avatar</button>
        </div>

        {kioskTab==='shop'&&(
          <div className="game-grid">
            {STORE_ITEMS.map((item,i)=>{
              const canBuy=stu.points>=item.cost;
              return(
                <div key={i} className="game-card" onClick={()=>kioskBuy(item)}
                  style={{opacity:canBuy?1:0.45,cursor:canBuy?'pointer':'not-allowed',position:'relative'}}>
                  {!canBuy&&<div style={{position:'absolute',top:6,right:8,fontSize:'0.65rem',color:'#ff6b6b',fontWeight:800,fontFamily:"'Nunito',sans-serif",letterSpacing:'0.03em'}}>NEED MORE</div>}
                  <div className="gc-icon">{item.icon}</div>
                  <div className="gc-name">{item.name}</div>
                  <div className="gc-desc">{item.desc}</div>
                  <div className="gc-pts" style={{color:canBuy?'#fdb927':'#ff6b6b'}}>{item.cost} pts</div>
                </div>
              );
            })}
          </div>
        )}

        {kioskTab==='avatar'&&(
          <div>
            <div style={{fontFamily:"'Nunito',sans-serif",color:'rgba(255,255,255,0.55)',fontSize:'0.88rem',marginBottom:14,textAlign:'center'}}>
              Tap any avatar to make it yours — FREE! 🎉
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))',gap:10}}>
              {STORE_AVATARS.map((av,i)=>{
                const isCurrent=stu.avatar===av;
                return(
                  <button key={i} onClick={()=>{
                    if(isCurrent)return;
                    updateStudent(stu.id,{avatar:av});
                    showToast(`${av} — ${stu.first||stu.name}'s new look!`);
                  }}
                    style={{
                      background:isCurrent?'rgba(253,185,39,0.18)':'rgba(255,255,255,0.05)',
                      border:`2px solid ${isCurrent?'#fdb927':'rgba(255,255,255,0.1)'}`,
                      borderRadius:14,padding:'14px 8px',cursor:isCurrent?'default':'pointer',
                      display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                      transition:'transform 0.12s,border-color 0.12s',
                      boxShadow:isCurrent?'0 0 10px rgba(253,185,39,0.3)':'none',
                    }}
                    onMouseEnter={e=>{if(!isCurrent){e.currentTarget.style.transform='scale(1.1)';e.currentTarget.style.borderColor='rgba(253,185,39,0.5)';}}}
                    onMouseLeave={e=>{if(!isCurrent){e.currentTarget.style.transform='scale(1)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';}}}
                  >
                    <div style={{fontSize:'2rem'}}>{av}</div>
                    {isCurrent&&<div style={{fontSize:'0.6rem',color:'#fdb927',fontFamily:"'Fredoka One',cursive",letterSpacing:'0.04em'}}>MINE</div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  }

  return(
    <>
      <div className="sec-head">🛍️ Dojo Store</div>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        <button className={`btn ${tab==='teacher'?'btn-gold':'btn-navy'}`} onClick={()=>setTab('teacher')}>🏫 Teacher View</button>
        <button className={`btn ${tab==='kiosk'?'btn-gold':'btn-navy'}`} onClick={()=>{setTab('kiosk');setKioskStu(null);}}>🧒 Student Kiosk</button>
      </div>

      {tab==='teacher'&&(
        <div className="game-grid">
          {STORE_ITEMS.map((item,i)=>(
            <div key={i} className="game-card" onClick={()=>teacherBuy(item)}>
              <div className="gc-icon">{item.icon}</div>
              <div className="gc-name">{item.name}</div>
              <div className="gc-desc">{item.desc}</div>
              <div className="gc-pts" style={{color:'#fdb927'}}>{item.cost} pts</div>
            </div>
          ))}
        </div>
      )}

      {tab==='kiosk'&&(
        kioskStu===null ? <RosterPicker/> : <ShoppingView/>
      )}
    </>
  );
}
