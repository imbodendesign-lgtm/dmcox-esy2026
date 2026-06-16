import {useState} from 'react';

const SCHOOL = 'David M. Cox Elementary';
const PROGRAM = 'ESY 2026 · Bear Cubs';

const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800;900&display=swap');
  @page { size: letter portrait; margin: 0.35in; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; padding: 0; background: white; font-family: 'Fredoka One', 'Segoe UI', Arial, sans-serif; }

  /* ── CUTE FLAT TAG (2 per row) ── */
  .flat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.22in;
  }
  .flat-card {
    height: 1.7in;
    border-radius: 18px;
    overflow: hidden;
    page-break-inside: avoid;
    break-inside: avoid;
    position: relative;
    display: flex;
    align-items: stretch;
  }
  .flat-inner {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.14in;
    padding: 0.14in 0.18in;
    position: relative;
    z-index: 1;
  }
  .flat-avatar-wrap {
    width: 0.9in;
    height: 0.9in;
    border-radius: 50%;
    background: rgba(255,255,255,0.18);
    border: 3px solid rgba(255,255,255,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }
  .flat-text { flex: 1; min-width: 0; }
  .flat-name {
    font-family: 'Fredoka One', cursive;
    font-size: 1.55rem;
    color: #ffffff;
    line-height: 1.05;
    text-shadow: 0 2px 6px rgba(0,0,0,0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .flat-school {
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 0.6rem;
    color: rgba(255,255,255,0.75);
    margin-top: 3px;
    white-space: nowrap;
  }
  .flat-program {
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.55rem;
    color: rgba(255,255,255,0.55);
    white-space: nowrap;
  }
  .flat-star-tl { position:absolute; top:8px; left:8px; font-size:1rem; opacity:0.35; }
  .flat-star-br { position:absolute; bottom:8px; right:10px; font-size:0.8rem; opacity:0.3; }
  .flat-dots {
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 0.55in;
    opacity: 0.12;
    background-image: radial-gradient(circle, white 1.5px, transparent 1.5px);
    background-size: 10px 10px;
  }

  /* ── CUTE TENT CARD (2 per row, fold on dashed line) ── */
  .tent-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.25in;
  }
  .tent-card {
    border-radius: 18px;
    overflow: hidden;
    page-break-inside: avoid;
    break-inside: avoid;
    border: 2.5px solid #e8e8f0;
  }
  .tent-back {
    height: 1.4in;
    background: linear-gradient(135deg, #f8f0ff, #fff0f8);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    border-bottom: 2px dashed #c8b0e0;
  }
  .tent-back-label {
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.6rem;
    color: #b090c8;
    letter-spacing: 0.08em;
  }
  .tent-back-school {
    font-family: 'Fredoka One', cursive;
    font-size: 0.75rem;
    color: #8060a8;
  }
  .tent-front {
    position: relative;
    overflow: hidden;
    padding: 0.2in 0.15in;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
  }
  .tent-bubble {
    width: 1.05in;
    height: 1.05in;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 3.5px solid rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.8rem;
    box-shadow: 0 6px 18px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.2);
    flex-shrink: 0;
  }
  .tent-name {
    font-family: 'Fredoka One', cursive;
    font-size: 1.9rem;
    color: white;
    text-align: center;
    line-height: 1.05;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .tent-sub {
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 0.62rem;
    color: rgba(255,255,255,0.7);
    text-align: center;
  }
  .tent-decor-tl { position:absolute; top:10px; left:12px; font-size:1.2rem; opacity:0.3; }
  .tent-decor-tr { position:absolute; top:10px; right:12px; font-size:0.9rem; opacity:0.3; }
  .tent-decor-br { position:absolute; bottom:8px; right:10px; font-size:1rem; opacity:0.25; }
  .tent-wave {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 0.35in;
    opacity: 0.12;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 12px,
      rgba(255,255,255,0.6) 12px,
      rgba(255,255,255,0.6) 13px
    );
  }

  /* ── CUTE STAR BADGE (4 per row) ── */
  .badge-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.18in;
  }
  .badge-outer {
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .badge-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #071428;
    border: 3px solid rgba(255,255,255,0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 8px;
    position: relative;
    overflow: hidden;
  }
  .badge-glow {
    position: absolute;
    top: -20%; left: -20%;
    width: 60%; height: 60%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%);
  }
  .badge-avatar { font-size: 2rem; line-height: 1; position: relative; z-index: 1; }
  .badge-name {
    font-family: 'Fredoka One', cursive;
    font-size: 0.65rem;
    color: white;
    text-align: center;
    line-height: 1.1;
    position: relative;
    z-index: 1;
  }
  .badge-star {
    font-size: 0.5rem;
    color: #fdb927;
    position: relative;
    z-index: 1;
  }
`;

function openPrintWindow(html){
  const w=window.open('','_blank','width=900,height=700');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Print Name Tags – ESY 2026 Bear Cubs</title><style>${PRINT_CSS}</style></head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(()=>w.print(),600);
}

// Gradient combos per student color
function gradientFor(color){
  const map={
    '#ff6b6b':'linear-gradient(135deg,#ff6b6b,#ee4444)',
    '#ffd93d':'linear-gradient(135deg,#ffb700,#ff8c00)',
    '#6bcb77':'linear-gradient(135deg,#6bcb77,#2ea84b)',
    '#4d96ff':'linear-gradient(135deg,#4d96ff,#1a5fcc)',
    '#ff922b':'linear-gradient(135deg,#ff922b,#e8630a)',
    '#cc5de8':'linear-gradient(135deg,#cc5de8,#9024b8)',
    '#20c997':'linear-gradient(135deg,#20c997,#0e9e78)',
    '#f06595':'linear-gradient(135deg,#f06595,#d63060)',
    '#74c0fc':'linear-gradient(135deg,#74c0fc,#228be6)',
    '#a9e34b':'linear-gradient(135deg,#a9e34b,#74c318)',
    '#ffa94d':'linear-gradient(135deg,#ffa94d,#e8630a)',
    '#da77f2':'linear-gradient(135deg,#da77f2,#ae3ec9)',
    '#63e6be':'linear-gradient(135deg,#63e6be,#12b886)',
    '#fdb927':'linear-gradient(135deg,#fdb927,#e8970a)',
  };
  return map[color]||`linear-gradient(135deg,${color},#071428)`;
}

function buildFlatHTML(students){
  const cards=students.map(s=>`
    <div class="flat-card" style="background:${gradientFor(s.color)};">
      <div class="flat-dots"></div>
      <div class="flat-star-tl">⭐</div>
      <div class="flat-star-br">✨</div>
      <div class="flat-inner">
        <div class="flat-avatar-wrap">${s.avatar}</div>
        <div class="flat-text">
          <div class="flat-name">${s.first||s.name}</div>
          <div class="flat-school">🐻 ${SCHOOL}</div>
          <div class="flat-program">📅 ${PROGRAM}</div>
        </div>
      </div>
    </div>`).join('');
  return `<div class="flat-grid">${cards}</div>`;
}

function buildTentHTML(students){
  const cards=students.map(s=>`
    <div class="tent-card">
      <div class="tent-back">
        <div class="tent-back-label">✂ FOLD HERE ✂</div>
        <div class="tent-back-school">🐻 ${SCHOOL}</div>
        <div class="tent-back-label">${PROGRAM}</div>
      </div>
      <div class="tent-front" style="background:${gradientFor(s.color)};">
        <div class="tent-decor-tl">⭐</div>
        <div class="tent-decor-tr">✨</div>
        <div class="tent-decor-br">🌟</div>
        <div class="tent-wave"></div>
        <div class="tent-bubble">${s.avatar}</div>
        <div class="tent-name">${s.first||s.name}</div>
        <div class="tent-sub">🐻 Bear Cub · ${SCHOOL}</div>
      </div>
    </div>`).join('');
  return `<div class="tent-grid">${cards}</div>`;
}

function buildBadgeHTML(students){
  const cards=students.map(s=>`
    <div class="badge-outer" style="background:${gradientFor(s.color)};">
      <div class="badge-inner">
        <div class="badge-glow"></div>
        <div class="badge-avatar">${s.avatar}</div>
        <div class="badge-name">${s.first||s.name}</div>
        <div class="badge-star">⭐ Bear Cub ⭐</div>
      </div>
    </div>`).join('');
  return `<div class="badge-grid">${cards}</div>`;
}

const STYLES={
  flat:{label:'📛 Flat Desk Tag',sub:'2 per row · laminate & tape to desk',fn:buildFlatHTML},
  tent:{label:'🗂️ Tent Card',sub:'2 per row · fold to stand up on desk',fn:buildTentHTML},
  badge:{label:'🔵 Round Badge',sub:'4 per row · sticker or cut-out style',fn:buildBadgeHTML},
};

// ── On-screen preview cards ──────────────────────────────────
function PreviewFlat({s}){
  return(
    <div style={{borderRadius:14,overflow:'hidden',height:72,display:'flex',background:gradientFor(s.color),position:'relative'}}>
      <div style={{position:'absolute',top:6,left:8,fontSize:'0.8rem',opacity:0.3}}>⭐</div>
      <div style={{position:'absolute',bottom:5,right:8,fontSize:'0.7rem',opacity:0.25}}>✨</div>
      <div style={{position:'absolute',right:0,top:0,bottom:0,width:44,opacity:0.1,backgroundImage:'radial-gradient(circle,white 1.5px,transparent 1.5px)',backgroundSize:'9px 9px'}}/>
      <div style={{flex:1,display:'flex',alignItems:'center',gap:10,padding:'10px 14px',zIndex:1}}>
        <div style={{width:50,height:50,borderRadius:'50%',background:'rgba(255,255,255,0.18)',border:'2.5px solid rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0,boxShadow:'0 3px 8px rgba(0,0,0,0.2)'}}>
          {s.avatar}
        </div>
        <div>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.05rem',color:'white',textShadow:'0 1px 4px rgba(0,0,0,0.3)',lineHeight:1.1}}>{s.first||s.name}</div>
          <div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.7)',fontFamily:"'Nunito',sans-serif",fontWeight:800,marginTop:2}}>🐻 {SCHOOL}</div>
        </div>
      </div>
    </div>
  );
}

function PreviewTent({s}){
  return(
    <div style={{borderRadius:12,overflow:'hidden',border:'2px solid rgba(255,255,255,0.1)'}}>
      <div style={{background:'linear-gradient(135deg,#f8f0ff,#fff0f8)',height:28,display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'2px dashed #c8b0e0'}}>
        <span style={{fontSize:'0.55rem',color:'#b090c8',fontFamily:"'Nunito',sans-serif",fontWeight:700,letterSpacing:'0.06em'}}>✂ FOLD HERE ✂</span>
      </div>
      <div style={{background:gradientFor(s.color),padding:'12px',display:'flex',flexDirection:'column',alignItems:'center',gap:5,position:'relative'}}>
        <div style={{position:'absolute',top:6,left:8,fontSize:'0.9rem',opacity:0.3}}>⭐</div>
        <div style={{position:'absolute',top:6,right:8,fontSize:'0.75rem',opacity:0.3}}>✨</div>
        <div style={{width:54,height:54,borderRadius:'50%',background:'rgba(255,255,255,0.2)',border:'3px solid rgba(255,255,255,0.45)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}>
          {s.avatar}
        </div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.05rem',color:'white',textShadow:'0 1px 5px rgba(0,0,0,0.3)'}}>{s.first||s.name}</div>
        <div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.65)',fontFamily:"'Nunito',sans-serif",fontWeight:800}}>🐻 Bear Cub · {SCHOOL}</div>
      </div>
    </div>
  );
}

function PreviewBadge({s}){
  return(
    <div style={{aspectRatio:'1',borderRadius:'50%',padding:4,background:gradientFor(s.color),display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:'100%',height:'100%',borderRadius:'50%',background:'#071428',border:'2.5px solid rgba(255,255,255,0.2)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,padding:6,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-10%',left:'-10%',width:'50%',height:'50%',borderRadius:'50%',background:'radial-gradient(circle,rgba(255,255,255,0.1),transparent 70%)'}}/>
        <div style={{fontSize:'1.5rem'}}>{s.avatar}</div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'0.6rem',color:'white',textAlign:'center',lineHeight:1.1}}>{s.first||s.name}</div>
        <div style={{fontSize:'0.45rem',color:'#fdb927'}}>⭐ Bear Cub ⭐</div>
      </div>
    </div>
  );
}

function PreviewCard({s,style}){
  if(style==='flat') return <PreviewFlat s={s}/>;
  if(style==='tent') return <PreviewTent s={s}/>;
  return <PreviewBadge s={s}/>;
}

export default function PrintCards({students}){
  const[style,setStyle]=useState('flat');
  const[selected,setSelected]=useState(()=>new Set(students.map(s=>s.id)));

  function toggleAll(){
    if(selected.size===students.length) setSelected(new Set());
    else setSelected(new Set(students.map(s=>s.id)));
  }
  function toggleOne(id){
    setSelected(prev=>{
      const next=new Set(prev);
      next.has(id)?next.delete(id):next.add(id);
      return next;
    });
  }

  function doPrint(){
    const subset=students.filter(s=>selected.has(s.id));
    if(!subset.length) return;
    openPrintWindow(STYLES[style].fn(subset));
  }

  const previewStudents=students.filter(s=>selected.has(s.id));

  return(
    <div style={{maxWidth:860,margin:'0 auto'}}>
      <div className="sec-head">🖨️ Print Name Tags</div>

      {/* Style picker */}
      <div style={{marginBottom:22}}>
        <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',fontFamily:"'Nunito',sans-serif",fontWeight:700,letterSpacing:'0.06em',marginBottom:10}}>CHOOSE A STYLE</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {Object.entries(STYLES).map(([key,val])=>(
            <button key={key} onClick={()=>setStyle(key)}
              style={{
                background:style===key?'rgba(253,185,39,0.14)':'rgba(255,255,255,0.05)',
                border:`2px solid ${style===key?'#fdb927':'rgba(255,255,255,0.12)'}`,
                borderRadius:14,padding:'12px 20px',cursor:'pointer',
                textAlign:'left',color:'white',fontFamily:"'Nunito',sans-serif",
                transition:'all 0.15s',
                boxShadow:style===key?'0 0 14px rgba(253,185,39,0.15)':'none',
              }}>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1rem',color:style===key?'#fdb927':'white'}}>{val.label}</div>
              <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.4)',marginTop:3}}>{val.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Student selector */}
      <div style={{marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',fontFamily:"'Nunito',sans-serif",fontWeight:700,letterSpacing:'0.06em'}}>
            SELECT STUDENTS <span style={{color:'rgba(255,255,255,0.6)',fontWeight:700}}>({selected.size} of {students.length})</span>
          </div>
          <button onClick={toggleAll} style={{background:'none',border:'none',color:'#fdb927',cursor:'pointer',fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:'0.82rem'}}>
            {selected.size===students.length?'Deselect All':'Select All'}
          </button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:8}}>
          {students.map(s=>{
            const on=selected.has(s.id);
            return(
              <button key={s.id} onClick={()=>toggleOne(s.id)}
                style={{
                  background:on?`${s.color}18`:'rgba(255,255,255,0.04)',
                  border:`2px solid ${on?s.color:'rgba(255,255,255,0.1)'}`,
                  borderRadius:12,padding:'10px 8px',cursor:'pointer',
                  display:'flex',alignItems:'center',gap:8,
                  fontFamily:"'Nunito',sans-serif",color:'white',
                  transition:'all 0.12s',
                  boxShadow:on?`0 0 10px ${s.color}30`:'none',
                }}>
                <div style={{fontSize:'1.5rem'}}>{s.avatar}</div>
                <div style={{flex:1,minWidth:0,textAlign:'left'}}>
                  <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'0.88rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.first||s.name}</div>
                  <div style={{fontSize:'0.65rem',color:on?s.color:'rgba(255,255,255,0.3)',marginTop:1}}>{on?'✓ selected':'tap to add'}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Print tips */}
      <div style={{background:'rgba(253,185,39,0.06)',border:'1px solid rgba(253,185,39,0.18)',borderRadius:14,padding:'14px 18px',marginBottom:22}}>
        <div style={{fontFamily:"'Fredoka One',cursive",color:'#fdb927',fontSize:'0.95rem',marginBottom:6}}>📋 Quick Tips</div>
        <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.78rem',fontFamily:"'Nunito',sans-serif",lineHeight:1.8}}>
          Print on <strong style={{color:'rgba(255,255,255,0.75)'}}>cardstock</strong> for best results &nbsp;·&nbsp;
          Enable <strong style={{color:'rgba(255,255,255,0.75)'}}>Background Graphics</strong> in your browser print settings &nbsp;·&nbsp;
          Tent cards: fold on the dotted line to stand up &nbsp;·&nbsp;
          Laminate flat tags so they last all summer!
        </div>
      </div>

      {/* Live preview */}
      {previewStudents.length>0&&(
        <div style={{marginBottom:22}}>
          <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',fontFamily:"'Nunito',sans-serif",fontWeight:700,letterSpacing:'0.06em',marginBottom:12}}>PREVIEW</div>
          <div style={{
            display:'grid',
            gridTemplateColumns:style==='badge'?'repeat(auto-fill,minmax(90px,1fr))':'repeat(auto-fill,minmax(260px,1fr))',
            gap:10,
          }}>
            {previewStudents.map(s=><PreviewCard key={s.id} s={s} style={style}/>)}
          </div>
        </div>
      )}

      <button onClick={doPrint} disabled={selected.size===0}
        style={{
          background:selected.size?'linear-gradient(135deg,#fdb927,#e8970a)':'rgba(255,255,255,0.08)',
          border:'none',borderRadius:14,
          padding:'15px 36px',cursor:selected.size?'pointer':'not-allowed',
          fontFamily:"'Fredoka One',cursive",fontSize:'1.15rem',
          color:selected.size?'#071428':'rgba(255,255,255,0.3)',
          boxShadow:selected.size?'0 4px 22px rgba(253,185,39,0.4)':'none',
          transition:'all 0.2s',
        }}>
        🖨️ Print {selected.size} Card{selected.size!==1?'s':''}
      </button>
    </div>
  );
}
