import {useEffect,useRef} from 'react';
export default function Toast({msg,onClear}){
  const ref=useRef();
  useEffect(()=>{
    if(!msg)return;
    const el=ref.current;
    if(el){el.classList.add('on');}
    const t=setTimeout(()=>{if(el)el.classList.remove('on');onClear&&setTimeout(onClear,350);},3000);
    return()=>clearTimeout(t);
  },[msg]);
  return <div className="toast" ref={ref}>{msg}</div>;
}
