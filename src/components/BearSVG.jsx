export default function BearSVG({size=64}){
  return(
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      <defs>
        <radialGradient id="bG1" cx="50%" cy="40%"><stop offset="0%" stopColor="#fdd76a"/><stop offset="100%" stopColor="#e8970a"/></radialGradient>
        <radialGradient id="bG2" cx="50%" cy="40%"><stop offset="0%" stopColor="#a0713a"/><stop offset="100%" stopColor="#6b4220"/></radialGradient>
        <radialGradient id="bG3" cx="50%" cy="35%"><stop offset="0%" stopColor="#c49a6c"/><stop offset="100%" stopColor="#a0713a"/></radialGradient>
        <radialGradient id="bG4" cx="50%" cy="30%"><stop offset="0%" stopColor="#d4aa7d"/><stop offset="100%" stopColor="#b8865a"/></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#bG1)"/>
      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <circle cx="26" cy="30" r="18" fill="#6b4220"/>
      <circle cx="26" cy="30" r="11" fill="#a0713a"/>
      <circle cx="94" cy="30" r="18" fill="#6b4220"/>
      <circle cx="94" cy="30" r="11" fill="#a0713a"/>
      <ellipse cx="60" cy="68" rx="38" ry="35" fill="url(#bG2)"/>
      <ellipse cx="60" cy="60" rx="34" ry="30" fill="url(#bG3)"/>
      <ellipse cx="60" cy="82" rx="17" ry="12" fill="url(#bG4)"/>
      <ellipse cx="60" cy="76" rx="6.5" ry="4.5" fill="#2d1a0a"/>
      <ellipse cx="59" cy="75" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.25)"/>
      <circle cx="44" cy="62" r="7" fill="#1a0a00"/>
      <circle cx="76" cy="62" r="7" fill="#1a0a00"/>
      <circle cx="46" cy="60" r="2.5" fill="white"/>
      <circle cx="78" cy="60" r="2.5" fill="white"/>
      <path d="M53 87 Q60 93 67 87" stroke="#2d1a0a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="36" cy="72" rx="7" ry="4" fill="rgba(200,100,80,0.25)"/>
      <ellipse cx="84" cy="72" rx="7" ry="4" fill="rgba(200,100,80,0.25)"/>
    </svg>
  );
}
