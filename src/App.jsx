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
import Timer from './components/Timer';
import MoodMeter from './components/MoodMeter';
import BehaviorReport from './components/BehaviorReport';
import Certificates from './components/Certificates';

const TABS=[
  {id:'students',label:'🐻 Students'},
  {id:'schedule',label:'📅 Schedule'},
  {id:'random',label:'🎲 Random Pick'},
  {id:'store',label:'🛒 Store'},
  {id:'rewards',label:'🏆 Rewards'},
  {id:'games',label:'🎮 Games'},
  {id:'activities',label:'📚 Activities'},
  {id:'mood',label:'🌡️ Mood Check-In'},
  {id:'behavior',label:'📋 Behavior'},
  {id:'certs',label:'🏅 Certificates'},
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
      background:'rgba(253,185,39,0.1)',border:'1px solid rgba(253,185,39,0.28)',
      color:'#fdb927',borderRadius:10,padding:'6px 12px',cursor:'pointer',
      fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:'0.82rem',flexShrink:0,
      transition:'all 0.18s',
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
  const[showTimer,setShowTimer]=useState(false);

  function showToast(msg){setToast(msg);}
  function showModal(content){setModal(content);}
  function closeModal(){setModal(null);}

  const shared={students,addPoints,addToAll,updateStudent,resetAll,addStudent,showToast,showModal,closeModal};

  return(
    <div className="app">
      <WelcomeScreen students={students} visible={welcome} onClose={()=>setWelcome(false)}/>
      {showTimer&&<Timer onClose={()=>setShowTimer(false)}/>}
      <TopBar {...shared} onWelcome={()=>setWelcome(true)} onPause={()=>setPaused(p=>!p)} paused={paused} onTimer={()=>setShowTimer(t=>!t)}/>
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
        {tab==='mood'&&<MoodMeter students={students}/>}
        {tab==='behavior'&&<BehaviorReport students={students}/>}
        {tab==='certs'&&<Certificates students={students}/>}
        {tab==='print'&&<PrintCards students={students}/>}
        {tab==='monitor'&&<Monitor {...shared}/>}
        {tab==='about'&&<About {...shared}/>}
      </div>
      {modal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={closeModal}>
          <div onClick={e=>e.stopPropagation()} style={{background:'linear-gradient(135deg,#0a1a3c,#050d1f)',border:'1px solid rgba(253,185,39,0.28)',borderRadius:22,padding:'2rem',minWidth:320,maxWidth:'90vw',maxHeight:'85vh',overflowY:'auto',boxShadow:'0 28px 70px rgba(0,0,0,0.65)'}}>
            {modal}
          </div>
        </div>
      )}
      {toast&&<Toast msg={toast} onClear={()=>setToast('')}/>}
    </div>
  );
}
