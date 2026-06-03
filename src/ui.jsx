// Shared UI components — owned by Avery (design) and Casey (structure)
// Single source of truth for components used across all cert trainers
// Reference: .claude/commands/avery-audit.md, .claude/commands/casey-structure.md

const CONFETTI_COLORS = ["#06d6a0","#ffd166","#00b4d8","#4cc9f0","#9b5de5","#f77f00","#06d6a0"];

export function ProgressBar({pct, color, height=4}){
  return(
    <div style={{height,background:"var(--c-border)",borderRadius:height/2,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:color,boxShadow:`0 0 6px ${color}`,transition:"width 0.4s"}}/>
    </div>
  );
}

export function MenuCard({icon, title, sub, color, onClick, locked, children}){
  return(
    <div onClick={onClick} style={{
      border:`1px solid ${locked?"var(--c-border)":color}`,
      borderRadius:16, padding:"20px 24px",
      background:"var(--c-surface)", marginBottom:16,
      boxShadow:"var(--c-shadow)",
      cursor:locked?"not-allowed":"pointer",
      opacity:locked?0.7:1,
      display:"flex", alignItems:"flex-start", gap:14,
    }}>
      <div style={{fontSize:28,minWidth:36,textAlign:"center",paddingTop:2}}>{icon}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:600,color:locked?"var(--c-dim)":color,marginBottom:4}}>{title}</div>
        {children||<div style={{fontSize:12,color:"var(--c-dim)"}}>{sub}</div>}
      </div>
      {!locked&&<div style={{color,fontSize:16,paddingTop:2}}>›</div>}
    </div>
  );
}

export function BackBtn({onClick, color}){
  return(
    <button onClick={onClick} style={{
      padding:"7px 16px", borderRadius:10,
      border:`1px solid ${color}`, background:"transparent",
      color, cursor:"pointer", fontSize:13, fontWeight:600,
      fontFamily:"inherit", transition:"all 0.15s", marginBottom:20,
    }}>← Back</button>
  );
}

export function ThemeToggle({isDark, toggleTheme, fixed=false, style={}}){
  return(
    <button
      onClick={toggleTheme}
      title={isDark?"Light mode":"Dark mode"}
      style={{
        width:42, height:42, borderRadius:21,
        border:"1px solid var(--c-border)",
        background:"var(--c-surface)",
        cursor:"pointer", fontSize:18,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"var(--c-shadow)", transition:"all 0.2s",
        flexShrink:0,
        ...(fixed?{position:"fixed",bottom:20,right:20,zIndex:999}:{}),
        ...style,
      }}
    >
      {isDark?"☀️":"🌙"}
    </button>
  );
}

export function Celebration(){
  const items=Array.from({length:28},(_,i)=>({
    left:`${(i*37+7)%100}%`,
    delay:`${((i*0.13)%0.9).toFixed(2)}s`,
    dur:`${(1.1+(i%5)*0.18).toFixed(2)}s`,
    color:CONFETTI_COLORS[i%7],
    size:5+(i%5),
  }));
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:50,overflow:"hidden"}}>
      <style>{`@keyframes floatUp{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-110vh) rotate(720deg);opacity:0}}`}</style>
      {items.map((p,i)=>(
        <div key={i} style={{position:"absolute",top:"-10px",left:p.left,width:p.size,height:p.size,borderRadius:"50%",background:p.color,animation:`floatUp ${p.dur} ${p.delay} ease-in forwards`}}/>
      ))}
    </div>
  );
}

export function Loading(){
  return(
    <div style={{minHeight:"100vh",background:"var(--c-bg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"var(--c-dim)",fontSize:15}}>Loading...</div>
    </div>
  );
}
