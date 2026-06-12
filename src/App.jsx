import {useState} from 'react';
import {useStudents} from './data/useStudents';
import TopBar from './components/TopBar';
import Students from './components/Students';
import Store from './components/Store';
import Rewards from './components/Rewards';
import Games from './components/Games';
import Activities from './components/Activities';
import Monitor from './components/Monitor';
import About from './components/About';
import PrintCards from './components/PrintCards';
import Toast from './components/Toast';
import WelcomeScreen from './components/WelcomeScreen';
import RandomPicker from './components/RandomPicker';
import Schedule from './components/Schedule';

const TABS=[
  {id:'students',label:'🐻 Students'},
  {id:'schedule',label:'📅 Schedule'},
  {id:'random',label:'🎲 Random Pick'},
  {id:'store',label:'🛒 Store'},
  {id:'rewards',label:'🏆 Rewards'},
  {id:'games',label:'🎮 Games'},
  {id:'activities',label:'📚 Activities'},
  {id:'print',label:'🖨️ Name Tags'},
  {id:'monitor',label:'📊 Monitor'},
  {id:'about',label:'⚙️ About'},
];

function FullscreenBtn(){
  const[fs,setFs]=useState(false);
  function toggle(){
    if(!document.fullscreenElement){
      document.documentElement.requestFullscreen().catch(()=>{});
      setFs(true);
    }else{
      document.exitFullscreen().catch(()=>{});
      setFs(false);
    }
  }
  return(
    <button onClick={toggle} style={{
      background:'rgba(253,185,39,0.12)',border:'1px solid rgba(253,185,39,0.3)',
      color:'#fdb927',borderRadius:10,padding:'6px 12px',cursor:'pointer',
      fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:'0.85rem',flexShrink:0,
    }}>{fs?'⊠ Exit Full':'⛶ Fullscreen'}</button>
  );
}

export default function App(){
  const{students,addPoints,addToAll,updateStudent,resetAll,addStudent}=useStudents();
  const[tab,setTab]=useState('students');
  const[modal,setModal]=useState(null);
  const[toast,setToast]=useState('');
  const[welcome,setWelcome]=useState(true);
  const[paused,setPaused]=useState(false);

  function showToast(msg){setToast(msg);}
  function showModal(content){setModal(content);}
  function closeModal(){setModal(null);}

  const shared={students,addPoints,addToAll,updateStudent,resetAll,addStudent,showToast,showModal,closeModal};

  return(
    <div className="app">
      <WelcomeScreen students={students} visible={welcome} onClose={()=>setWelcome(false)}/>
      <TopBar {...shared} onWelcome={()=>setWelcome(true)} onPause={()=>setPaused(p=>!p)} paused={paused}/>
      <div className="tab-bar" style={{justifyContent:'space-between'}}>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {TABS.map(t=>(
            <button key={t.id} className={`tab-btn${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <FullscreenBtn/>
      </div>
      <div className="content">
        {tab==='students'&&<Students {...shared}/>}
        {tab==='schedule'&&<Schedule/>}
        {tab==='random'&&<RandomPicker students={students}/>}
        {tab==='store'&&<Store {...shared}/>}
        {tab==='rewards'&&<Rewards {...shared}/>}
        {tab==='games'&&<Games {...shared}/>}
        {tab==='activities'&&<Activities {...shared}/>}
        {tab==='print'&&<PrintCards students={students}/>}
        {tab==='monitor'&&<Monitor {...shared}/>}
        {tab==='about'&&<About {...shared}/>}
      </div>
      {modal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={closeModal}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#0d2048',border:'2px solid rgba(253,185,39,0.3)',borderRadius:20,padding:'2rem',minWidth:320,maxWidth:'90vw',maxHeight:'85vh',overflowY:'auto'}}>
            {modal}
          </div>
        </div>
      )}
      {toast&&<Toast msg={toast} onClear={()=>setToast('')}/>}
    </div>
  );
}
