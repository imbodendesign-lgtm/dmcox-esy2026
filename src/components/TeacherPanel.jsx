import {useState} from 'react';
import Students from './Students';
import Store from './Store';
import Rewards from './Rewards';
import Games from './Games';
import Activities from './Activities';
import Monitor from './Monitor';
import About from './About';
import TopBar from './TopBar';

const TABS=[
  {id:'students',label:'🐻 Students'},
  {id:'store',label:'🛒 Store'},
  {id:'rewards',label:'🏆 Rewards'},
  {id:'games',label:'🎮 Games'},
  {id:'activities',label:'📚 Activities'},
  {id:'monitor',label:'📊 Monitor'},
  {id:'about',label:'⚙️ About'},
];

function FullscreenBtn(){
  function toggle(){
    if(!document.fullscreenElement){
      document.documentElement.requestFullscreen().catch(()=>{});
    } else {
      document.exitFullscreen().catch(()=>{});
    }
  }
  return(
    <button onClick={toggle} style={{
      background:'rgba(253,185,39,0.15)',border:'1px solid rgba(253,185,39,0.3)',
      color:'#fdb927',borderRadius:8,padding:'4px 12px',cursor:'pointer',
      fontFamily:"'Fredoka One',cursive",fontSize:'0.85rem',
    }} title="Toggle fullscreen">
      ⛶ Fullscreen
    </button>
  );
}

export default function TeacherPanel({students,addPoints,addToAll,updateStudent,resetAll,addStudent,showToast,showModal,closeModal,onExitTeacher}){
  const[tab,setTab]=useState('students');
  const shared={students,addPoints,addToAll,updateStudent,resetAll,addStudent,showToast,showModal,closeModal};

  return(
    <div className="app">
      <TopBar {...shared}/>
      {/* Teacher mode banner */}
      <div style={{background:'#e8970a',padding:'5px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <span style={{fontFamily:"'Fredoka One',cursive",color:'#071428',fontSize:'0.9rem'}}>🔐 Teacher Mode</span>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <FullscreenBtn/>
          <button onClick={onExitTeacher} style={{background:'#071428',color:'#fdb927',border:'none',borderRadius:8,padding:'4px 14px',cursor:'pointer',fontFamily:"'Fredoka One',cursive",fontSize:'0.85rem',fontWeight:700}}>📺 Return to Display</button>
        </div>
      </div>
      <div className="tab-bar">
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="content">
        {tab==='students'&&<Students {...shared}/>}
        {tab==='store'&&<Store {...shared}/>}
        {tab==='rewards'&&<Rewards {...shared}/>}
        {tab==='games'&&<Games {...shared}/>}
        {tab==='activities'&&<Activities {...shared}/>}
        {tab==='monitor'&&<Monitor {...shared}/>}
        {tab==='about'&&<About {...shared}/>}
      </div>
    </div>
  );
}
