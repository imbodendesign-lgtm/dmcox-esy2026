export default function Modal({content,onClose}){
  if(!content)return null;
  return(
    <div className={`modal-bg${content?' on':''}`} onClick={e=>{if(e.target.classList.contains('modal-bg'))onClose();}}>
      <div className="modal-box">
        {content}
      </div>
    </div>
  );
}
