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
            <button key={s.id} onClick={()=>{addPoints(s.id,-item.cost,null,item);showToast(`${item.icon} ${item.name} redeemed for ${s.first||s.name}!`);closeModal();}}
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
          <button className="btn btn-gold" onClick={()=>{addPoints(stu.id,-item.cost,null,item);showToast(`${item.icon} ${stu.first||stu.name} bought ${item.name}!`);closeModal();}}>✅ Buy It!</button>
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
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        <button className={`btn ${tab==='teacher'?'btn-gold':'btn-navy'}`} onClick={()=>setTab('teacher')}>🏫 Teacher View</button>
        <button className={`btn ${tab==='cashout'?'btn-gold':'btn-navy'}`} onClick={()=>setTab('cashout')}>💰 Cash Out Preview</button>
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

      {tab==='cashout'&&(()=>{
        const sorted=[...students].sort((a,b)=>b.points-a.points);
        const maxCost=Math.max(...STORE_ITEMS.map(i=>i.cost));
        return(
          <div>
            <div style={{fontFamily:"'Nunito',sans-serif",color:'rgba(255,255,255,0.45)',fontSize:'0.82rem',marginBottom:18,textAlign:'center',letterSpacing:'0.04em'}}>
              Click any green item to instantly redeem it for that student
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {sorted.map(s=>{
                const purchases=s.purchases||[];
                const canBuy=STORE_ITEMS.filter(i=>s.points>=i.cost);
                const cantBuy=STORE_ITEMS.filter(i=>s.points<i.cost);
                const pct=Math.min(s.points/maxCost,1);
                return(
                  <div key={s.id} style={{
                    background:'linear-gradient(135deg,rgba(13,32,72,0.85),rgba(4,10,28,0.9))',
                    border:`1.5px solid ${purchases.length>0?'rgba(253,185,39,0.4)':'rgba(253,185,39,0.2)'}`,
                    borderRadius:16,padding:'14px 18px',
                  }}>
                    {/* Student header */}
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                      <div style={{fontSize:'2.2rem',lineHeight:1}}>{s.avatar}</div>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.1rem',color:'white',lineHeight:1}}>{s.first||s.name}</div>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:5}}>
                          <div style={{flex:1,height:7,background:'rgba(255,255,255,0.08)',borderRadius:4,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${pct*100}%`,background:'linear-gradient(90deg,#fdb927,#e8970a)',borderRadius:4}}/>
                          </div>
                          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.05rem',color:'#fdb927',whiteSpace:'nowrap'}}>{s.points} pts</div>
                        </div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                        <div style={{
                          fontFamily:"'Fredoka One',cursive",fontSize:'0.78rem',
                          background:canBuy.length>0?'rgba(107,203,119,0.15)':'rgba(255,107,107,0.12)',
                          border:`1px solid ${canBuy.length>0?'rgba(107,203,119,0.35)':'rgba(255,107,107,0.3)'}`,
                          color:canBuy.length>0?'#6bcb77':'#ff6b6b',
                          borderRadius:20,padding:'3px 10px',whiteSpace:'nowrap',
                        }}>{canBuy.length} can buy</div>
                        {purchases.length>0&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:'0.72rem',color:'#fdb927',whiteSpace:'nowrap'}}>{purchases.length} purchased</div>}
                      </div>
                    </div>

                    {/* PURCHASE HISTORY — big and prominent */}
                    {purchases.length>0&&(
                      <div style={{
                        background:'linear-gradient(135deg,rgba(253,185,39,0.1),rgba(253,185,39,0.04))',
                        border:'1.5px solid rgba(253,185,39,0.35)',
                        borderRadius:12,padding:'12px 14px',marginBottom:12,
                      }}>
                        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'0.9rem',color:'#fdb927',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
                          🧾 Purchased Today
                          <span style={{fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:'0.72rem',background:'rgba(253,185,39,0.2)',borderRadius:20,padding:'1px 8px',color:'rgba(253,185,39,0.8)'}}>{purchases.length} item{purchases.length!==1?'s':''}</span>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:6}}>
                          {[...purchases].reverse().map((p,i)=>(
                            <div key={i} style={{
                              display:'flex',alignItems:'center',justifyContent:'space-between',
                              background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'6px 10px',
                            }}>
                              <div style={{display:'flex',alignItems:'center',gap:8}}>
                                <span style={{fontSize:'1.3rem'}}>{p.icon}</span>
                                <span style={{fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:'0.9rem',color:'white'}}>{p.name}</span>
                              </div>
                              <div style={{display:'flex',alignItems:'center',gap:10}}>
                                <span style={{fontFamily:"'Fredoka One',cursive",fontSize:'0.85rem',color:'#ff6b6b'}}>−{p.cost} pts</span>
                                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:'0.7rem',color:'rgba(255,255,255,0.3)'}}>{new Date(p.at).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {purchases.length===0&&(
                      <div style={{fontFamily:"'Nunito',sans-serif",fontSize:'0.78rem',color:'rgba(255,255,255,0.2)',marginBottom:10,fontStyle:'italic'}}>No purchases yet today</div>
                    )}

                    {/* Can buy */}
                    {canBuy.length>0&&(
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:'0.68rem',color:'rgba(107,203,119,0.7)',fontFamily:"'Nunito',sans-serif",fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:5}}>✅ Can buy now — tap to redeem</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                          {canBuy.map((item,i)=>(
                            <button key={i} onClick={()=>{addPoints(s.id,-item.cost,null,item);showToast(`${item.icon} ${item.name} redeemed for ${s.first||s.name}!`);}}
                              title={item.desc}
                              style={{
                                background:'rgba(107,203,119,0.14)',border:'1px solid rgba(107,203,119,0.35)',
                                borderRadius:20,padding:'5px 12px',cursor:'pointer',
                                fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:'0.82rem',
                                color:'white',display:'flex',alignItems:'center',gap:5,transition:'all 0.12s',
                              }}
                              onMouseEnter={e=>{e.currentTarget.style.background='rgba(107,203,119,0.3)';e.currentTarget.style.transform='scale(1.05)';}}
                              onMouseLeave={e=>{e.currentTarget.style.background='rgba(107,203,119,0.14)';e.currentTarget.style.transform='scale(1)';}}
                            >
                              <span style={{fontSize:'1rem'}}>{item.icon}</span>
                              <span>{item.name}</span>
                              <span style={{color:'#6bcb77',fontSize:'0.74rem'}}>({item.cost} pts)</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Can't afford */}
                    {cantBuy.length>0&&(
                      <div>
                        <div style={{fontSize:'0.65rem',color:'rgba(255,107,107,0.4)',fontFamily:"'Nunito',sans-serif",fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>❌ Needs more pts</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                          {cantBuy.map((item,i)=>(
                            <div key={i} style={{
                              background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',
                              borderRadius:20,padding:'3px 8px',
                              fontFamily:"'Nunito',sans-serif",fontSize:'0.72rem',
                              color:'rgba(255,255,255,0.22)',display:'flex',alignItems:'center',gap:3,
                            }}>
                              <span style={{opacity:0.4}}>{item.icon}</span><span>{item.name}</span>
                              <span style={{color:'#ff6b6b',opacity:0.5}}>({item.cost})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {tab==='kiosk'&&(
        kioskStu===null ? <RosterPicker/> : <ShoppingView/>
      )}
    </>
  );
}
