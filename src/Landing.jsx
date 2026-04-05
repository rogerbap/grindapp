import { useState } from "react";

const S = {
  app: { minHeight:"100dvh", background:"#080808", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif", display:"flex", flexDirection:"column", maxWidth:"430px", margin:"0 auto", padding:"0 24px" },
};

export default function Landing({ onSignIn, onSignUp }) {
  const [hovering, setHovering] = useState(null);

  return (
    <div style={S.app}>
      {/* Hero */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", paddingTop:"calc(env(safe-area-inset-top,0px) + 60px)" }}>
        {/* Logo */}
        <div style={{ marginBottom:"48px" }}>
          <div style={{ fontSize:"80px", fontWeight:900, letterSpacing:"-4px", lineHeight:1, color:"#f0f0f0" }}>WRK</div>
          <div style={{ fontSize:"16px", color:"#444", marginTop:"8px", letterSpacing:"2px", fontWeight:700 }}>TRAIN WITH PURPOSE</div>
        </div>

        {/* Value props */}
        <div style={{ marginBottom:"48px" }}>
          {[
            { icon:"⚡", text:"AI-generated plans built around your goals, schedule, and equipment" },
            { icon:"📈", text:"Track every lift. See progression, stagnation, and PRs in real time" },
            { icon:"🔄", text:"Swap exercises, customize workouts, build your own program" },
            { icon:"☁", text:"Syncs across all your devices automatically" },
          ].map((item,i)=>(
            <div key={i} style={{ display:"flex", gap:"14px", alignItems:"flex-start", marginBottom:"20px" }}>
              <div style={{ fontSize:"20px", flexShrink:0, width:"28px" }}>{item.icon}</div>
              <div style={{ fontSize:"14px", color:"#555", lineHeight:1.5 }}>{item.text}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"32px" }}>
          <button
            onClick={onSignUp}
            onMouseEnter={()=>setHovering("signup")}
            onMouseLeave={()=>setHovering(null)}
            style={{ padding:"16px", background:"#e8a838", border:"none", borderRadius:"12px", color:"#000", fontSize:"16px", fontWeight:900, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"1px", transition:"opacity 0.15s", opacity:hovering==="signup"?0.85:1 }}>
            GET STARTED — IT'S FREE
          </button>
          <button
            onClick={onSignIn}
            onMouseEnter={()=>setHovering("signin")}
            onMouseLeave={()=>setHovering(null)}
            style={{ padding:"16px", background:"transparent", border:"1px solid #252525", borderRadius:"12px", color:"#666", fontSize:"16px", fontWeight:800, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"1px", transition:"all 0.15s", opacity:hovering==="signin"?1:0.8 }}>
            SIGN IN
          </button>
        </div>

        <div style={{ fontSize:"11px", color:"#2a2a2a", textAlign:"center", lineHeight:1.6, paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 24px)" }}>
          No subscription. No ads. Your data stays yours.
        </div>
      </div>
    </div>
  );
}
