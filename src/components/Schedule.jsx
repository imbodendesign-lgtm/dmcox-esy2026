import {useState,useEffect} from 'react';

const STORAGE_KEY='dmcox26_schedule_v2';

const DEFAULT_SCHEDULE=[
  {id:1, time:'8:30 AM', icon:'🚌', label:'Bus Arrival',               desc:"Students arrive, unpack, settle in — in room by 9:00",                                                    color:'#4d96ff'},
  {id:2, time:'9:00 AM', icon:'🔥', label:'Morning Hype + Goal Check', desc:'Community circle, goal wall check-in, energy builder, ROAR!',                                            color:'#fdb927'},
  {id:3, time:'9:15 AM', icon:'📖', label:'Reading / Phonics Block',   desc:'IEP reading goals — Squad A: inference, Squad B: vowel teams/fluency, Squad C: CVC/blends',             color:'#ff922b'},
  {id:4, time:'10:00 AM',icon:'✏️', label:'Writing Block',             desc:'IEP writing goals — Squad A: 3-paragraph essay, Squad B: paragraph, Squad C: sentence frames',          color:'#cc5de8'},
  {id:5, time:'10:45 AM',icon:'🔢', label:'Math Block',                desc:'IEP math goals — Squad A: multiplication/division, Squad B: facts 0-10, Squad C: add/subtract within 20',color:'#6bcb77'},
  {id:6, time:'11:30 AM',icon:'🍕', label:'Lunch + Recess',            desc:'Eat, play, social skills in action',                                                                      color:'#ff6b6b'},
  {id:7, time:'12:15 PM',icon:'🎭', label:'Group Activity + SEL',      desc:'Whole-class games, gallery walks, community circles, goal wall updates',                                  color:'#4d96ff'},
  {id:8, time:'1:00 PM', icon:'📋', label:'1-on-1 + Independent Work', desc:'Teacher pulls 1-2 students; rest work independently on IEP tasks',                                       color:'#20c997'},
  {id:9, time:'1:45 PM', icon:'🎯', label:'Skill Station Wrap-Up',     desc:'Small group work, probe trials, data collection',                                                         color:'#a9e34b'},
  {id:10,time:'2:00 PM', icon:'📦', label:'Dismissal Prep',            desc:'Pack up, goal wins shoutout, ROAR!',                                                                      color:'#fdb927'},
  {id:11,time:'2:20 PM', icon:'🚌', label:'Dismissal',                 desc:'Bus or parent pickup — 2:20 PM sharp',                                                                   color:'#ff6b6b'},
];

function loadSchedule(){
  try{
    const s=localStorage.getItem(STORAGE_KEY);
    if(s)return JSON.parse(s);
  }catch{}
  return DEFAULT_SCHEDULE;
}
function saveSchedule(data){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch{}
}

const ICONS=['🚌','🌅','🔢','📚','☀️','🔬','🍕','🎮','✏️','🎵','🌟','📖','🎨','💻','🧠','🏃','🎭','🎤','🌿','🎲','⭐','🏆','📝','🎯'];
const COLORS=['#4d96ff','#fdb927','#6bcb77','#ff922b','#20c997','#cc5de8','#ff6b6b','#74c0fc','#a9e34b','#f06595','#ffa94d','#63e6be'];

export default function Schedule(){
  const[items,setItems]=useState(loadSchedule);
  const[editMode,setEditMode]=useState(false);
  const[editId,setEditId]=useState(null);
  const[editForm,setEditForm]=useState({});
  const[showIconPicker,setShowIconPicker]=useState(false);
  const[addForm,setAddForm]=useState(null); // null = not adding
  const[now,setNow]=useState(()=>new Date());

  // Tick every 30 seconds so the active block & clock stay current
  useEffect(()=>{
    const id=setInterval(()=>setNow(new Date()),30000);
    return()=>clearInterval(id);
  },[]);

  function currentBlockIdx(){
    // find the currently active block based on real clock
    const mins=now.getHours()*60+now.getMinutes();
    for(let i=items.length-1;i>=0;i--){
      const t=parseTime(items[i].time);
      if(t!==null&&mins>=t)return i;
    }
    return -1;
  }

  function parseTime(str){
    if(!str)return null;
    const m=str.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if(!m)return null;
    let h=parseInt(m[1]);
    const min=parseInt(m[2]);
    const ampm=m[3].toUpperCase();
    if(ampm==='PM'&&h!==12)h+=12;
    if(ampm==='AM'&&h===12)h=0;
    return h*60+min;
  }

  const activeIdx=currentBlockIdx();

  function startEdit(item){
    setEditId(item.id);
    setEditForm({...item});
    setShowIconPicker(false);
  }
  function cancelEdit(){setEditId(null);setEditForm({});}
  function saveEdit(){
    const next=items.map(it=>it.id===editId?{...it,...editForm}:it);
    setItems(next);saveSchedule(next);
    setEditId(null);setEditForm({});
  }
  function deleteItem(id){
    const next=items.filter(it=>it.id!==id);
    setItems(next);saveSchedule(next);
    setEditId(null);
  }
  function moveUp(id){
    const i=items.findIndex(it=>it.id===id);
    if(i<=0)return;
    const next=[...items];[next[i-1],next[i]]=[next[i],next[i-1]];
    setItems(next);saveSchedule(next);
  }
  function moveDown(id){
    const i=items.findIndex(it=>it.id===id);
    if(i>=items.length-1)return;
    const next=[...items];[next[i],next[i+1]]=[next[i+1],next[i]];
    setItems(next);saveSchedule(next);
  }
  function startAdd(){
    setAddForm({id:Date.now(),time:'',icon:'⭐',label:'',desc:'',color:COLORS[0]});
  }
  function saveAdd(){
    if(!addForm.time||!addForm.label)return;
    const next=[...items,addForm];
    setItems(next);saveSchedule(next);
    setAddForm(null);
  }
  function resetToDefault(){
    setItems(DEFAULT_SCHEDULE);saveSchedule(DEFAULT_SCHEDULE);
    setEditId(null);setAddForm(null);
  }

  return(
    <div style={{maxWidth:760,margin:'0 auto'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10,marginBottom:20}}>
        <div className="sec-head" style={{marginBottom:0}}>📅 Daily Schedule</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {editMode&&(
            <button className="btn btn-navy" onClick={resetToDefault} style={{fontSize:'0.8rem'}}>↺ Reset Default</button>
          )}
          {editMode&&!addForm&&(
            <button className="btn btn-gold" onClick={startAdd}>+ Add Block</button>
          )}
          <button className={`btn ${editMode?'btn-gold':'btn-navy'}`} onClick={()=>{setEditMode(e=>!e);setEditId(null);setAddForm(null);}}>
            {editMode?'✅ Done Editing':'✏️ Edit Schedule'}
          </button>
        </div>
      </div>

      {/* Current time badge */}
      <div style={{
        background:'rgba(253,185,39,0.08)',border:'1px solid rgba(253,185,39,0.2)',
        borderRadius:12,padding:'8px 16px',marginBottom:18,
        display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',
      }}>
        <span style={{fontFamily:"'Fredoka One',cursive",color:'#fdb927',fontSize:'1rem'}}>🕐 Right Now:</span>
        <span style={{color:'white',fontFamily:"'Nunito',sans-serif",fontWeight:700}}>
          {now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
        </span>
        {activeIdx>=0&&(
          <span style={{color:'rgba(255,255,255,0.6)',fontSize:'0.9rem'}}>
            — {items[activeIdx].icon} {items[activeIdx].label}
          </span>
        )}
      </div>

      {/* Schedule blocks */}
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {items.map((item,idx)=>{
          const isActive=idx===activeIdx;
          const isPast=idx<activeIdx;
          const isEditing=editId===item.id;

          if(isEditing){
            return(
              <div key={item.id} style={{
                background:'linear-gradient(145deg,rgba(13,32,72,0.98),rgba(4,10,28,0.98))',
                border:'2px solid rgba(253,185,39,0.6)',borderRadius:16,padding:'16px',
              }}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                  <div>
                    <label style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',display:'block',marginBottom:4}}>TIME</label>
                    <input value={editForm.time||''} onChange={e=>setEditForm(f=>({...f,time:e.target.value}))} placeholder="e.g. 9:00 AM"
                      style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(253,185,39,0.3)',color:'white',borderRadius:8,padding:'8px 10px',width:'100%',fontFamily:"'Nunito',sans-serif",fontSize:'0.95rem',boxSizing:'border-box'}}/>
                  </div>
                  <div>
                    <label style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',display:'block',marginBottom:4}}>ACTIVITY NAME</label>
                    <input value={editForm.label||''} onChange={e=>setEditForm(f=>({...f,label:e.target.value}))} placeholder="Activity name"
                      style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(253,185,39,0.3)',color:'white',borderRadius:8,padding:'8px 10px',width:'100%',fontFamily:"'Nunito',sans-serif",fontSize:'0.95rem',boxSizing:'border-box'}}/>
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <label style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',display:'block',marginBottom:4}}>DESCRIPTION</label>
                  <input value={editForm.desc||''} onChange={e=>setEditForm(f=>({...f,desc:e.target.value}))} placeholder="Short description"
                    style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(253,185,39,0.3)',color:'white',borderRadius:8,padding:'8px 10px',width:'100%',fontFamily:"'Nunito',sans-serif",fontSize:'0.95rem',boxSizing:'border-box'}}/>
                </div>
                <div style={{display:'flex',gap:10,alignItems:'flex-end',flexWrap:'wrap'}}>
                  <div>
                    <label style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',display:'block',marginBottom:4}}>ICON</label>
                    <button onClick={()=>setShowIconPicker(v=>!v)} style={{
                      background:'rgba(255,255,255,0.08)',border:'1px solid rgba(253,185,39,0.3)',
                      color:'white',borderRadius:8,padding:'8px 14px',cursor:'pointer',fontSize:'1.4rem',
                    }}>{editForm.icon}</button>
                    {showIconPicker&&(
                      <div style={{position:'absolute',zIndex:100,background:'#0d2048',border:'1px solid rgba(253,185,39,0.3)',borderRadius:12,padding:10,display:'flex',flexWrap:'wrap',gap:6,maxWidth:220,marginTop:4}}>
                        {ICONS.map(ic=>(
                          <span key={ic} onClick={()=>{setEditForm(f=>({...f,icon:ic}));setShowIconPicker(false);}}
                            style={{fontSize:'1.4rem',cursor:'pointer',padding:4,borderRadius:6,background:editForm.icon===ic?'rgba(253,185,39,0.2)':'transparent'}}>
                            {ic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',display:'block',marginBottom:4}}>COLOR</label>
                    <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                      {COLORS.map(c=>(
                        <div key={c} onClick={()=>setEditForm(f=>({...f,color:c}))}
                          style={{width:22,height:22,borderRadius:'50%',background:c,cursor:'pointer',border:editForm.color===c?'3px solid white':'2px solid transparent'}}/>
                      ))}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,marginLeft:'auto'}}>
                    <button className="btn btn-navy" onClick={cancelEdit}>Cancel</button>
                    <button className="btn" style={{background:'rgba(255,80,80,0.2)',border:'1px solid rgba(255,80,80,0.4)',color:'#ff8a8a',borderRadius:10,padding:'8px 14px',cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:800}} onClick={()=>deleteItem(item.id)}>🗑 Delete</button>
                    <button className="btn btn-gold" onClick={saveEdit}>✅ Save</button>
                  </div>
                </div>
              </div>
            );
          }

          return(
            <div key={item.id} style={{
              background:isActive
                ?`linear-gradient(135deg,${item.color}22,rgba(13,32,72,0.95))`
                :'linear-gradient(145deg,rgba(13,32,72,0.7),rgba(4,10,28,0.8))',
              border:`2px solid ${isActive?item.color:isPast?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.1)'}`,
              borderRadius:14,padding:'12px 16px',
              opacity:isPast&&!editMode?0.5:1,
              transition:'all 0.2s',
              display:'flex',alignItems:'center',gap:14,
            }}>
              {/* Active indicator */}
              {isActive&&(
                <div style={{width:4,height:40,background:item.color,borderRadius:4,flexShrink:0,boxShadow:`0 0 10px ${item.color}`}}/>
              )}

              {/* Time */}
              <div style={{
                fontFamily:"'Fredoka One',cursive",
                fontSize:'0.95rem',
                color:isActive?'#fdb927':'rgba(255,255,255,0.4)',
                minWidth:74,flexShrink:0,
              }}>{item.time}</div>

              {/* Icon bubble */}
              <div style={{
                width:44,height:44,borderRadius:12,flexShrink:0,
                background:`${item.color}22`,border:`2px solid ${item.color}55`,
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',
              }}>{item.icon}</div>

              {/* Text */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1rem',color:isActive?'white':'rgba(255,255,255,0.8)',lineHeight:1.2}}>{item.label}</div>
                <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.desc}</div>
              </div>

              {/* Active NOW badge */}
              {isActive&&(
                <div style={{
                  background:item.color,color:'#071428',
                  fontFamily:"'Fredoka One',cursive",fontSize:'0.7rem',
                  padding:'3px 10px',borderRadius:50,flexShrink:0,
                  animation:'nowPulse 1.5s infinite',
                }}>NOW</div>
              )}

              {/* Edit mode controls */}
              {editMode&&!isEditing&&(
                <div style={{display:'flex',gap:6,flexShrink:0}}>
                  <button onClick={()=>moveUp(item.id)} style={arrowBtn}>▲</button>
                  <button onClick={()=>moveDown(item.id)} style={arrowBtn}>▼</button>
                  <button onClick={()=>startEdit(item)} style={{
                    background:'rgba(253,185,39,0.15)',border:'1px solid rgba(253,185,39,0.4)',
                    color:'#fdb927',borderRadius:8,padding:'5px 12px',cursor:'pointer',
                    fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:'0.82rem',
                  }}>✏️ Edit</button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add new block form */}
        {addForm&&(
          <div style={{
            background:'linear-gradient(145deg,rgba(13,32,72,0.98),rgba(4,10,28,0.98))',
            border:'2px dashed rgba(253,185,39,0.4)',borderRadius:16,padding:'16px',marginTop:4,
          }}>
            <div style={{fontFamily:"'Fredoka One',cursive",color:'#fdb927',marginBottom:12}}>+ New Schedule Block</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div>
                <label style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',display:'block',marginBottom:4}}>TIME *</label>
                <input value={addForm.time} onChange={e=>setAddForm(f=>({...f,time:e.target.value}))} placeholder="e.g. 1:30 PM"
                  style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(253,185,39,0.3)',color:'white',borderRadius:8,padding:'8px 10px',width:'100%',fontFamily:"'Nunito',sans-serif",fontSize:'0.95rem',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',display:'block',marginBottom:4}}>ACTIVITY NAME *</label>
                <input value={addForm.label} onChange={e=>setAddForm(f=>({...f,label:e.target.value}))} placeholder="Activity name"
                  style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(253,185,39,0.3)',color:'white',borderRadius:8,padding:'8px 10px',width:'100%',fontFamily:"'Nunito',sans-serif",fontSize:'0.95rem',boxSizing:'border-box'}}/>
              </div>
            </div>
            <div style={{marginBottom:10}}>
              <label style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',display:'block',marginBottom:4}}>DESCRIPTION</label>
              <input value={addForm.desc} onChange={e=>setAddForm(f=>({...f,desc:e.target.value}))} placeholder="Optional description"
                style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(253,185,39,0.3)',color:'white',borderRadius:8,padding:'8px 10px',width:'100%',fontFamily:"'Nunito',sans-serif",fontSize:'0.95rem',boxSizing:'border-box'}}/>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
              <div style={{display:'flex',gap:5}}>
                {ICONS.slice(0,8).map(ic=>(
                  <span key={ic} onClick={()=>setAddForm(f=>({...f,icon:ic}))}
                    style={{fontSize:'1.3rem',cursor:'pointer',padding:4,borderRadius:6,background:addForm.icon===ic?'rgba(253,185,39,0.2)':'transparent'}}>
                    {ic}
                  </span>
                ))}
              </div>
              <div style={{display:'flex',gap:5}}>
                {COLORS.slice(0,6).map(c=>(
                  <div key={c} onClick={()=>setAddForm(f=>({...f,color:c}))}
                    style={{width:20,height:20,borderRadius:'50%',background:c,cursor:'pointer',border:addForm.color===c?'3px solid white':'2px solid transparent'}}/>
                ))}
              </div>
              <div style={{display:'flex',gap:8,marginLeft:'auto'}}>
                <button className="btn btn-navy" onClick={()=>setAddForm(null)}>Cancel</button>
                <button className="btn btn-gold" onClick={saveAdd} disabled={!addForm.time||!addForm.label}>✅ Add Block</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes nowPulse{0%,100%{opacity:1;}50%{opacity:0.6;}}`}</style>
    </div>
  );
}

const arrowBtn={
  background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.15)',
  color:'rgba(255,255,255,0.5)',borderRadius:7,padding:'4px 8px',cursor:'pointer',
  fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:'0.8rem',
};
