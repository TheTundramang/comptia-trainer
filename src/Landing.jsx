import { useState, Suspense, lazy } from "react";
import { useTheme } from "./useTheme.js";
import { ThemeToggle, Loading } from "./ui.jsx";

const NetworkPlusApp  = lazy(() => import("./network-plus/App.jsx"));
const APlusApp        = lazy(() => import("./a-plus/App.jsx"));
const SecurityPlusApp = lazy(() => import("./security-plus/App.jsx"));

const ACCENT = {
  d1:"#00b4d8", d2:"#f77f00", d3:"#4cc9f0",
  d4:"#e63946", d5:"#06d6a0", gold:"#ffd166", purple:"#9b5de5",
};

const CERTS = [
  {
    id:"aplus", name:"CompTIA A+", code:"220-1101 / 220-1102", icon:"🖥️",
    color:ACCENT.d2, desc:"Hardware, OS, Security & Troubleshooting",
    domains:"9 domains · 144 questions", status:"available",
  },
  {
    id:"netplus", name:"CompTIA Network+", code:"N10-009", icon:"🌐",
    color:ACCENT.d1, desc:"All 5 domains · Professor Messer aligned",
    domains:"5 domains · 60+ questions", status:"available",
  },
  {
    id:"secplus", name:"CompTIA Security+", code:"SY0-701", icon:"🔒",
    color:ACCENT.d4, desc:"Threats, Cryptography, Identity & Architecture",
    domains:"5 domains · 90+ questions", status:"available",
  },
];

export default function Landing() {
  const [selected, setSelected] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  if (selected === "netplus") return <Suspense fallback={<Loading/>}><NetworkPlusApp onExit={() => setSelected(null)} /></Suspense>;
  if (selected === "aplus")   return <Suspense fallback={<Loading/>}><APlusApp onExit={() => setSelected(null)} /></Suspense>;
  if (selected === "secplus") return <Suspense fallback={<Loading/>}><SecurityPlusApp onExit={() => setSelected(null)} /></Suspense>;
  return <LandingScreen onSelect={setSelected} isDark={isDark} toggleTheme={toggleTheme} />;
}

function LandingScreen({ onSelect, isDark, toggleTheme }) {
  return (
    <div style={{minHeight:"100vh",background:"var(--c-bg)",color:"var(--c-text)"}}>
      <div style={{maxWidth:620,margin:"0 auto",padding:"40px 20px 60px"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:36}}>
          <div>
            <div style={{fontSize:30,fontWeight:700,color:ACCENT.d1,marginBottom:6,letterSpacing:-0.5}}>
              CompTIA Trainer
            </div>
            <div style={{fontSize:15,color:"var(--c-dim)",fontWeight:400}}>
              Study smarter. Pass with confidence.
            </div>
          </div>
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} style={{marginTop:4}}/>
        </div>

        {/* Gradient rule */}
        <div style={{height:3,background:`linear-gradient(90deg,${ACCENT.d1},${ACCENT.d4},transparent)`,borderRadius:4,marginBottom:32}}/>

        <div style={{fontSize:12,fontWeight:600,color:"var(--c-dim)",letterSpacing:1,textTransform:"uppercase",marginBottom:16}}>
          Select your certification
        </div>

        {/* Cert cards */}
        {CERTS.map(cert => (
          <div
            key={cert.id}
            onClick={() => cert.status === "available" && onSelect(cert.id)}
            style={{
              border:`2px solid ${cert.status==="available" ? cert.color+"50" : "var(--c-border)"}`,
              borderRadius:20,
              padding:"22px 24px",
              background:"var(--c-surface)",
              marginBottom:16,
              cursor:cert.status==="available" ? "pointer" : "not-allowed",
              opacity:cert.status==="soon" ? 0.45 : 1,
              transition:"border-color 0.15s, box-shadow 0.15s",
              boxShadow:"var(--c-shadow)",
              display:"flex", alignItems:"center", gap:20,
            }}
          >
            <div style={{fontSize:46,minWidth:54,textAlign:"center",lineHeight:1}}>{cert.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:7,flexWrap:"wrap"}}>
                <span style={{fontSize:19,fontWeight:600,color:cert.color}}>{cert.name}</span>
                <span style={{
                  fontSize:11,fontWeight:600,
                  padding:"3px 10px",
                  background:cert.color+"18",
                  border:`1px solid ${cert.color}55`,
                  borderRadius:20,color:cert.color,
                }}>
                  {cert.code}
                </span>
                {cert.status==="soon" && (
                  <span style={{fontSize:11,padding:"3px 10px",background:"var(--c-muted)20",border:"1px solid var(--c-muted)",borderRadius:20,color:"var(--c-dim)"}}>
                    Coming Soon
                  </span>
                )}
              </div>
              <div style={{fontSize:14,color:"var(--c-dim)",marginBottom:5,lineHeight:1.5}}>{cert.desc}</div>
              <div style={{fontSize:13,fontWeight:600,color:cert.status==="available" ? cert.color : "var(--c-muted)"}}>{cert.domains}</div>
            </div>
            {cert.status==="available" && (
              <div style={{fontSize:26,color:cert.color,opacity:0.7,flexShrink:0}}>›</div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={{
          marginTop:12,padding:"16px 20px",
          border:"1px solid var(--c-border)",borderRadius:16,
          fontSize:14,color:"var(--c-dim)",lineHeight:1.7,
          textAlign:"center",background:"var(--c-surface)",
          boxShadow:"var(--c-shadow)",
        }}>
          Each cert includes flashcards, domain quizzes, daily practice, and a full timed practice test.
        </div>

      </div>
    </div>
  );
}
