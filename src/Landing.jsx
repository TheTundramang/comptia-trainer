import { useState, Suspense, lazy } from "react";

const NetworkPlusApp  = lazy(() => import("./network-plus/App.jsx"));
const APlusApp        = lazy(() => import("./a-plus/App.jsx"));
const SecurityPlusApp = lazy(() => import("./security-plus/App.jsx"));

const C = {
  bg:"#08090f", surface:"#0d1120", border:"#1a2540", muted:"#2a3a55",
  text:"#c8d8f0", dim:"#4a6080", d1:"#00b4d8", d2:"#f77f00", d3:"#4cc9f0",
  d4:"#e63946", d5:"#06d6a0", gold:"#ffd166", purple:"#9b5de5",
};
function hexRgb(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `${r},${g},${b}`;}

const CERTS = [
  {
    id:"aplus", name:"CompTIA A+", code:"220-1101 / 220-1102", icon:"🖥️",
    color:C.d2, desc:"Core 1 & Core 2 · Hardware, OS, Security, Troubleshooting",
    domains:"9 domains · Core 1 + Core 2", status:"available",
  },
  {
    id:"netplus", name:"CompTIA Network+", code:"N10-009", icon:"🌐",
    color:C.d1, desc:"All 5 domains · Professor Messer aligned",
    domains:"5 domains · 60+ questions", status:"available",
  },
  {
    id:"secplus", name:"CompTIA Security+", code:"SY0-701", icon:"🔒",
    color:C.d4, desc:"Threats, Cryptography, Identity, Architecture & more",
    domains:"5 domains · 90+ questions", status:"available",
  },
];

function Loading() {
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Courier New',monospace",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:C.dim,letterSpacing:4,fontSize:12}}>LOADING...</div>
    </div>
  );
}

export default function Landing() {
  const [selected, setSelected] = useState(null);
  if (selected === "netplus") return <Suspense fallback={<Loading/>}><NetworkPlusApp onExit={() => setSelected(null)} /></Suspense>;
  if (selected === "aplus")   return <Suspense fallback={<Loading/>}><APlusApp onExit={() => setSelected(null)} /></Suspense>;
  if (selected === "secplus") return <Suspense fallback={<Loading/>}><SecurityPlusApp onExit={() => setSelected(null)} /></Suspense>;
  return <LandingScreen onSelect={setSelected} />;
}

function LandingScreen({ onSelect }) {
  const scan = {position:"fixed",top:0,left:0,right:0,bottom:0,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,180,216,0.012) 2px,rgba(0,180,216,0.012) 4px)",pointerEvents:"none",zIndex:1};
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Courier New',monospace",color:C.text,overflowX:"hidden"}}>
      <div style={scan}/>
      <div style={{maxWidth:600,margin:"0 auto",padding:"40px 16px",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:11,color:C.dim,letterSpacing:5,marginBottom:10}}>CERTIFICATION STUDY PLATFORM</div>
          <div style={{fontSize:30,fontWeight:"bold",letterSpacing:4,color:C.d1,textShadow:`0 0 28px rgba(${hexRgb(C.d1)},0.5)`,marginBottom:6}}>COMPTIA TRAINER</div>
          <div style={{fontSize:11,color:C.dim,letterSpacing:3}}>SELECT YOUR CERTIFICATION</div>
        </div>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.d1},transparent)`,margin:"0 0 32px"}}/>
        {CERTS.map(cert => (
          <div
            key={cert.id}
            onClick={() => cert.status === "available" && onSelect(cert.id)}
            style={{
              border:`1px solid ${cert.status==="available"?cert.color:C.border}`,
              borderRadius:12, padding:"22px 24px", background:C.surface,
              marginBottom:16, cursor:cert.status==="available"?"pointer":"not-allowed",
              opacity:cert.status==="soon"?0.45:1, transition:"all 0.15s",
              display:"flex", alignItems:"center", gap:18,
            }}
          >
            <div style={{fontSize:36,minWidth:44,textAlign:"center"}}>{cert.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <div style={{fontSize:16,fontWeight:"bold",color:cert.color,letterSpacing:1}}>{cert.name}</div>
                <div style={{fontSize:10,padding:"2px 8px",border:`1px solid ${cert.color}`,borderRadius:10,color:cert.color,letterSpacing:1}}>{cert.code}</div>
                {cert.status==="soon"&&<div style={{fontSize:10,padding:"2px 8px",border:`1px solid ${C.muted}`,borderRadius:10,color:C.dim,letterSpacing:1}}>COMING SOON</div>}
              </div>
              <div style={{fontSize:12,color:C.dim,marginBottom:3}}>{cert.desc}</div>
              <div style={{fontSize:11,color:cert.status==="available"?cert.color:C.muted,letterSpacing:1}}>{cert.domains}</div>
            </div>
            {cert.status==="available"&&<div style={{color:cert.color,fontSize:20}}>›</div>}
          </div>
        ))}
        <div style={{marginTop:32,padding:"14px 16px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:11,color:C.dim,lineHeight:1.8,textAlign:"center"}}>
          Each cert is self-contained with flashcards, domain quizzes, daily practice, and a full practice test.
        </div>
      </div>
    </div>
  );
}
