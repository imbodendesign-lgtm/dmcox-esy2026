export default function Monitor({students}){
  const sorted=[...students].sort((a,b)=>b.points-a.points);
  const avg=students.length?Math.round(students.reduce((s,st)=>s+st.points,0)/students.length):0;
  const top=sorted[0];const low=sorted[sorted.length-1];
  return(
    <>
      <div className="sec-head">📊 Class Monitor</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
        {[{label:'Class Avg',val:avg+' pts',icon:'📊'},{label:'Top Student',val:top?.first||'—',icon:'🏆'},{label:'Total Points',val:students.reduce((s,st)=>s+st.points,0)+' pts',icon:'💎'}].map((stat,i)=>(
          <div key={i} style={{background:'linear-gradient(135deg,rgba(13,32,72,0.8),rgba(4,10,28,0.9))',border:'1px solid rgba(253,185,39,0.2)',borderRadius:16,padding:'16px',textAlign:'center'}}>
            <div style={{fontSize:'2rem'}}>{stat.icon}</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.4rem',color:'#fdb927',margin:'8px 0'}}>{stat.val}</div>
            <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.8rem'}}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="mon-table">
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'1px solid rgba(253,185,39,0.2)'}}>
              {['Rank','Student','Points','Progress'].map(h=>(
                <th key={h} style={{padding:'10px 12px',color:'rgba(255,255,255,0.5)',fontFamily:"'Fredoka One',cursive",textAlign:'left',fontSize:'0.85rem'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s,i)=>{
              const pct=Math.min(100,s.points*2);
              const medals=['🥇','🥈','🥉'];
              return(
                <tr key={s.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <td style={{padding:'12px',color:'#fdb927',fontFamily:"'Fredoka One',cursive"}}>{i<3?medals[i]:`#${i+1}`}</td>
                  <td style={{padding:'12px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:'1.3rem'}}>{s.avatar}</span>
                      <div><div style={{color:'white',fontWeight:700}}>{s.first||s.name}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:'0.75rem'}}>{s.last}</div></div>
                    </div>
                  </td>
                  <td style={{padding:'12px',fontFamily:"'Fredoka One',cursive",color:'#fdb927',fontSize:'1.1rem'}}>{s.points}</td>
                  <td style={{padding:'12px',minWidth:120}}>
                    <div style={{background:'rgba(255,255,255,0.06)',borderRadius:6,height:8,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#fdb927,#e8970a)',borderRadius:6}}/>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
