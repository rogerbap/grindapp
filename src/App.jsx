import { useState, useEffect, useRef } from "react";
import { WORKOUTS, PHASE_COLORS, DAY_ORDER, JS_TO_DAY, PHASE_INFO, TEMPO, SWAPS, EXERCISE_LIBRARY, MOBILITY_SESSION, PR_GROUPS } from "./workouts.js";
import { supabase, isConfigured } from "./supabase.js";
import Landing from "./Landing.jsx";
import Onboarding from "./Onboarding.jsx";
import Search from "./Search.jsx";

// ── HELPERS ───────────────────────────────────────────────────────────────
function getTodayId() { return JS_TO_DAY[new Date().getDay()]; }
function fmtDur(s) { const m=Math.floor(s/60),sec=s%60; return `${m}:${sec.toString().padStart(2,"0")}`; }
function today() { return new Date().toISOString().split("T")[0]; }
function uid() { return Math.random().toString(36).slice(2,9); }
function calc1RM(w,r) { if(!w||!r||r<=0)return 0; if(r===1)return w; return Math.round(w*(1+r/30)); }
function calcWt(orm,pct) { return Math.round((orm*pct/100)/2.5)*2.5; }

function calcWeekFromStart(startDate) {
  if(!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(12, Math.max(1, Math.ceil((days + 1) / 7)));
}

function calcPhaseFromWeek(w) {
  if(w <= 2) return 1;
  if(w <= 6) return 2;
  return 3;
}

const PHASE_PCT = { 1:[0.60,0.65], 2:[0.70,0.80], 3:[0.80,0.87] };

const TAG_MUSCLES = ["quad","hamstring","glute","chest","back","shoulder","tricep","bicep","core","calf","adductor","forearm","trap"];
const DAY_COLORS = ["#e8a838","#2980b9","#c0392b","#8e44ad","#27ae60","#16a085","#e05c2a","#576574","#d35400","#1a5276"];

const LS = {
  get:(k)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
  del:(k)=>{try{localStorage.removeItem(k);}catch{}},
};

function getSuggestedSwaps(ex, n=6) {
  if(!ex?.tags?.length) return [];
  const mt=ex.tags.filter(t=>TAG_MUSCLES.includes(t));
  return EXERCISE_LIBRARY
    .filter(e=>e.name!==ex.name)
    .map(e=>{const et=e.tags||[];return{...e,score:mt.filter(t=>et.includes(t)).length*3+ex.tags.filter(t=>et.includes(t)&&!TAG_MUSCLES.includes(t)).length};})
    .filter(e=>e.score>0).sort((a,b)=>b.score-a.score).slice(0,n);
}

// ── STYLES ────────────────────────────────────────────────────────────────
const S = {
  app:{display:"flex",flexDirection:"column",height:"100dvh",maxWidth:"430px",margin:"0 auto",background:"#080808",color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",overflow:"hidden",position:"relative"},
  body:{flex:1,overflowY:"auto",paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 62px)",WebkitOverflowScrolling:"touch"},
  nav:{position:"absolute",bottom:0,left:0,right:0,display:"flex",background:"#0a0a0a",borderTop:"1px solid #1a1a1a",height:"calc(env(safe-area-inset-bottom,0px) + 60px)",paddingBottom:"env(safe-area-inset-bottom,0px)"},
  navBtn:(a)=>({flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"3px",background:"none",border:"none",cursor:"pointer",color:a?"#e8a838":"#333",fontFamily:"'Barlow Condensed',sans-serif"}),
  card:{margin:"10px 16px 0",background:"#111",border:"1px solid #1e1e1e",borderRadius:"12px",overflow:"hidden"},
  secHd:(c)=>({padding:"9px 16px",background:`${c}15`,borderBottom:"1px solid #1e1e1e",fontSize:"10px",fontWeight:800,letterSpacing:"2px",color:c}),
  tag:(bg,c)=>({fontSize:"9px",fontWeight:700,padding:"3px 7px",borderRadius:"4px",background:bg,color:c,letterSpacing:"1px",flexShrink:0}),
  btn:(c,o)=>({padding:"14px",borderRadius:"10px",border:o?`1px solid ${c}`:"none",background:o?"transparent":c,color:o?c:"#000",fontSize:"14px",fontWeight:800,cursor:"pointer",width:"100%",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}),
  inp:{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"8px",color:"#fff",fontSize:"24px",fontWeight:700,textAlign:"center",padding:"12px 8px",width:"100%",outline:"none",fontFamily:"'Barlow Condensed',sans-serif"},
  textInp:{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"8px",color:"#ddd",fontSize:"14px",padding:"10px 12px",width:"100%",outline:"none",fontFamily:"'Barlow Condensed',sans-serif"},
  chip:(done,cur,editing)=>({width:"42px",height:"42px",borderRadius:"50%",border:editing?"2px solid #e05c2a":done?"none":cur?"2px solid #e8a838":"1px solid #252525",background:editing?"#1e0e00":done?"#112211":cur?"#1e1800":"#111",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,flexDirection:"column",gap:"1px"}),
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"},
  sheet:{width:"100%",maxWidth:"430px",background:"#111",borderRadius:"16px 16px 0 0",padding:"20px 16px calc(env(safe-area-inset-bottom,0px) + 20px)"},
};

// ── MODAL COMPONENTS (outside App — prevents remount on re-render) ─────────

function NoteEditorModal({ noteEditor, noteVal, setNoteVal, onSave, onClear, onClose }) {
  if (!noteEditor) return null;
  return (
    <div style={S.overlay}>
      <div style={S.sheet}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
          <div>
            <div style={{fontSize:"10px",color:"#555",letterSpacing:"2px"}}>NOTE FOR</div>
            <div style={{fontSize:"16px",fontWeight:800,color:"#ddd"}}>{noteEditor.exName}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
        </div>
        <textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)}
          placeholder="Form cues, weight targets, how it felt..."
          autoFocus
          style={{width:"100%",minHeight:"110px",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"10px",color:"#ddd",fontSize:"14px",padding:"12px",outline:"none",resize:"none",fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1.5}}/>
        <div style={{display:"flex",gap:"8px",marginTop:"10px"}}>
          <button style={{...S.btn("#e8a838",false),flex:2,padding:"12px"}} onClick={()=>onSave(noteVal)}>SAVE NOTE</button>
          {noteEditor.value && <button style={{...S.btn("#c0392b",true),flex:1,padding:"12px"}} onClick={onClear}>CLEAR</button>}
        </div>
      </div>
    </div>
  );
}

function SwapModal({ swapModal, swapTab, setSwapTab, swapSearch, setSwapSearch, session, onApply, onRevert, onClose }) {
  if (!swapModal) return null;
  const { originalKey, originalEx, fromBuilder } = swapModal;
  const presetSwaps = SWAPS[originalEx?.name] || [];
  const suggested = getSuggestedSwaps(originalEx);
  const isSwapped = !fromBuilder && !!(session?.swaps?.[originalKey]);
  const libFiltered = EXERCISE_LIBRARY.filter(e =>
    e.name !== originalEx?.name && e.name.toLowerCase().includes(swapSearch.toLowerCase())
  );

  function Card({ opt, i }) {
    const isActive = !fromBuilder && session?.swaps?.[originalKey] === (opt.id || opt.name);
    return (
      <div key={i} onClick={() => onApply(originalKey, opt, fromBuilder)}
        style={{padding:"12px 14px",background:isActive?"#0e1a0e":"#161616",border:`1px solid ${isActive?"#27ae60":"#222"}`,borderRadius:"10px",marginBottom:"7px",cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
          <div style={{fontSize:"14px",fontWeight:800,color:isActive?"#27ae60":"#ccc"}}>{opt.name}</div>
          <div style={{display:"flex",gap:"4px"}}>
            <span style={S.tag("#1a1a1a","#444")}>{opt.sets||3}×</span>
            <span style={S.tag("#1a1a1a","#444")}>{opt.target||"10 reps"}</span>
          </div>
        </div>
        {opt.note && <div style={{fontSize:"10px",color:"#3a3a3a",lineHeight:1.4,marginBottom:"4px"}}>{opt.note}</div>}
        <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
          {(opt.tags||[]).slice(0,5).map(t=><span key={t} style={S.tag("#1a1a1a","#2a5a2a")}>{t}</span>)}
        </div>
        {isActive && <div style={{fontSize:"9px",color:"#27ae60",fontWeight:800,marginTop:"4px",letterSpacing:"1px"}}>ACTIVE ✓</div>}
      </div>
    );
  }

  return (
    <div style={S.overlay}>
      <div style={{...S.sheet,padding:"20px 16px calc(env(safe-area-inset-bottom,0px) + 16px)",maxHeight:"88vh",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px",flexShrink:0}}>
          <div>
            <div style={{fontSize:"10px",color:"#555",letterSpacing:"2px"}}>SWAP</div>
            <div style={{fontSize:"16px",fontWeight:800,color:"#ddd"}}>{originalEx?.name}</div>
            {originalEx?.tags?.length > 0 && (
              <div style={{display:"flex",gap:"4px",marginTop:"4px",flexWrap:"wrap"}}>
                {originalEx.tags.slice(0,5).map(t=><span key={t} style={S.tag("#1a1a1a","#3a5a3a")}>{t}</span>)}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
        </div>
        {isSwapped && (
          <button onClick={()=>onRevert(originalKey,originalEx)}
            style={{width:"100%",padding:"11px",background:"#1a0800",border:"1px solid #e05c2a40",borderRadius:"10px",color:"#e05c2a",fontSize:"13px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",marginBottom:"10px",flexShrink:0}}>
            ↩ REVERT TO ORIGINAL
          </button>
        )}
        <div style={{display:"flex",gap:"6px",marginBottom:"10px",flexShrink:0}}>
          {["suggested","presets","library"].map(t=>(
            <button key={t} onClick={()=>setSwapTab(t)}
              style={{flex:1,padding:"8px",background:swapTab===t?"#e8a838":"#1a1a1a",border:`1px solid ${swapTab===t?"#e8a838":"#252525"}`,borderRadius:"8px",color:swapTab===t?"#000":"#555",fontSize:"10px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        {swapTab === "library" && (
          <input style={{...S.textInp,marginBottom:"10px",flexShrink:0}}
            value={swapSearch} onChange={e=>setSwapSearch(e.target.value)}
            placeholder="Search exercises..." autoFocus/>
        )}
        <div style={{flex:1,overflowY:"auto"}}>
          {swapTab==="suggested" && (suggested.length > 0 ? suggested.map((o,i)=><Card opt={o} i={i} key={i}/>) : <div style={{textAlign:"center",padding:"30px 0",color:"#333",fontSize:"12px"}}>No tag matches found</div>)}
          {swapTab==="presets" && (presetSwaps.length > 0 ? presetSwaps.map((o,i)=><Card opt={o} i={i} key={i}/>) : <div style={{textAlign:"center",padding:"30px 0",color:"#333",fontSize:"12px"}}>No preset swaps defined</div>)}
          {swapTab==="library" && libFiltered.map((o,i)=><Card opt={o} i={i} key={i}/>)}
        </div>
      </div>
    </div>
  );
}

function AddExModal({ addExModal, onAdd, onClose }) {
  const [mode, setMode] = useState("library");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [target, setTarget] = useState("10 reps");
  const [rest, setRest] = useState("90");
  const [note, setNote] = useState("");

  if (!addExModal) return null;

  const filtered = EXERCISE_LIBRARY.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) &&
    (!tagFilter || (e.tags||[]).includes(tagFilter))
  );

  function submitCustom() {
    if (!name.trim()) return;
    onAdd({ id:uid(), name:name.trim(), sets:parseInt(sets)||3, target, rest:parseInt(rest)||90, note, tags:[] });
  }

  return (
    <div style={S.overlay}>
      <div style={{...S.sheet,padding:"16px 16px calc(env(safe-area-inset-bottom,0px) + 16px)",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexShrink:0}}>
          <div style={{fontSize:"16px",fontWeight:800,color:"#ddd"}}>ADD EXERCISE</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:"6px",marginBottom:"12px",flexShrink:0}}>
          {["library","custom"].map(m=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{flex:1,padding:"9px",background:mode===m?"#e8a838":"#1a1a1a",border:`1px solid ${mode===m?"#e8a838":"#252525"}`,borderRadius:"8px",color:mode===m?"#000":"#555",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
              {m==="library"?"LIBRARY":"CUSTOM"}
            </button>
          ))}
        </div>
        {mode==="library" && (
          <>
            <input style={{...S.textInp,marginBottom:"8px",flexShrink:0}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search exercises..." autoFocus/>
            <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"10px",flexShrink:0}}>
              {["","quad","hamstring","glute","chest","back","shoulder","tricep","bicep"].map(t=>(
                <button key={t} onClick={()=>setTagFilter(t)}
                  style={{padding:"4px 9px",background:tagFilter===t?"#e8a838":"#1a1a1a",border:`1px solid ${tagFilter===t?"#e8a838":"#252525"}`,borderRadius:"6px",color:tagFilter===t?"#000":"#555",fontSize:"9px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                  {t||"ALL"}
                </button>
              ))}
            </div>
            <div style={{flex:1,overflowY:"auto"}}>
              {filtered.map((ex,i)=>(
                <div key={i} onClick={()=>onAdd({...ex,id:uid()})}
                  style={{padding:"11px 14px",background:"#161616",border:"1px solid #1e1e1e",borderRadius:"10px",marginBottom:"6px",cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:"14px",fontWeight:700,color:"#ccc"}}>{ex.name}</div>
                    <span style={S.tag("#1a1a1a","#444")}>{ex.sets||3}×</span>
                  </div>
                  <div style={{display:"flex",gap:"4px",marginTop:"5px",flexWrap:"wrap"}}>
                    {(ex.tags||[]).slice(0,5).map(t=><span key={t} style={S.tag("#1a1a1a","#2a5a2a")}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {mode==="custom" && (
          <div style={{flex:1,overflowY:"auto"}}>
            <div style={{marginBottom:"10px"}}>
              <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>EXERCISE NAME</div>
              <input style={S.textInp} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Walking Lunges" autoFocus/>
            </div>
            <div style={{display:"flex",gap:"10px",marginBottom:"10px"}}>
              <div style={{flex:1}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>SETS</div><input style={{...S.inp,fontSize:"18px",padding:"10px"}} type="number" inputMode="numeric" value={sets} onChange={e=>setSets(e.target.value)}/></div>
              <div style={{flex:2}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>TARGET</div><input style={S.textInp} value={target} onChange={e=>setTarget(e.target.value)} placeholder="10 reps"/></div>
              <div style={{flex:1}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>REST (sec)</div><input style={{...S.inp,fontSize:"18px",padding:"10px"}} type="number" inputMode="numeric" value={rest} onChange={e=>setRest(e.target.value)}/></div>
            </div>
            <div style={{marginBottom:"12px"}}>
              <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>NOTE (optional)</div>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Form cues..." style={{...S.textInp,minHeight:"70px",resize:"none",lineHeight:1.5}}/>
            </div>
            <button style={{...S.btn("#e8a838",false),padding:"13px"}} onClick={submitCustom}>ADD EXERCISE →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PREditorModal({ prEditor, prs, phase, onSave, onClose }) {
  const [prWt, setPrWt] = useState("");
  const [prRp, setPrRp] = useState("");
  if (!prEditor) return null;
  const existing = prs[prEditor];
  const pct = PHASE_PCT[phase];
  const previewRM = prWt && prRp ? calc1RM(parseFloat(prWt), parseInt(prRp)) : existing?.estimated1rm || 0;
  return (
    <div style={{...S.overlay,zIndex:150}}>
      <div style={S.sheet}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px"}}>
          <div>
            <div style={{fontSize:"10px",color:"#555",letterSpacing:"2px"}}>LOG PR FOR</div>
            <div style={{fontSize:"15px",fontWeight:800,color:"#ddd",lineHeight:1.2}}>{prEditor}</div>
            {existing && <div style={{fontSize:"10px",color:"#3a3a3a",marginTop:"3px"}}>Current: {existing.weight} lbs × {existing.reps} reps → {existing.estimated1rm} lbs 1RM</div>}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:"10px",marginBottom:"14px"}}>
          <div style={{flex:1}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>WEIGHT (lbs)</div><input style={S.inp} type="number" inputMode="decimal" value={prWt} onChange={e=>setPrWt(e.target.value)} placeholder="185" autoFocus/></div>
          <div style={{flex:1}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>REPS</div><input style={S.inp} type="number" inputMode="numeric" value={prRp} onChange={e=>setPrRp(e.target.value)} placeholder="5"/></div>
        </div>
        {previewRM > 0 && (
          <div style={{padding:"12px 14px",background:"#0e1a0e",border:"1px solid #1a3a1a",borderRadius:"10px",marginBottom:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
              <div style={{fontSize:"11px",color:"#27ae60",fontWeight:700}}>ESTIMATED 1RM</div>
              <div style={{fontSize:"24px",fontWeight:900,color:"#e8a838"}}>{previewRM} <span style={{fontSize:"11px",color:"#444"}}>lbs</span></div>
            </div>
            <div style={{fontSize:"10px",color:"#2a2a2a",marginBottom:"6px",letterSpacing:"1px"}}>PHASE {phase} TARGETS ({Math.round(pct[0]*100)}–{Math.round(pct[1]*100)}%)</div>
            <div style={{display:"flex",gap:"8px"}}>
              {[["LOW",pct[0]],["TARGET",(pct[0]+pct[1])/2],["HIGH",pct[1]]].map(([label,p])=>(
                <div key={label} style={{flex:1,padding:"8px",background:"#111",borderRadius:"8px",textAlign:"center"}}>
                  <div style={{fontSize:"9px",color:"#333",letterSpacing:"1px"}}>{label}</div>
                  <div style={{fontSize:"18px",fontWeight:800,color:label==="TARGET"?"#e8a838":"#ccc"}}>{calcWt(previewRM,p*100)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button style={{...S.btn("#e8a838",false),padding:"13px"}} onClick={()=>onSave(prEditor,prWt,prRp)}>SAVE PR →</button>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
// ── PR GROUP MODAL ────────────────────────────────────────────────────────────
function PRGroupModal({ onAdd, onClose }) {
  const [label, setLabel] = useState("");
  const [variants, setVariants] = useState("");
  function submit() {
    if (!label.trim()) return;
    const variantList = variants.split(",").map(v => v.trim()).filter(Boolean);
    onAdd(label.trim(), variantList);
    onClose();
  }
  return (
    <div style={{...S.overlay, zIndex:150}}>
      <div style={S.sheet}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <div style={{fontSize:"18px",fontWeight:900}}>ADD PR LIFT</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{marginBottom:"12px"}}>
          <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>MOVEMENT NAME</div>
          <input style={S.textInp} value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. Hip Thrust" autoFocus/>
        </div>
        <div style={{marginBottom:"6px"}}>
          <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>EXERCISE VARIANTS (comma separated)</div>
          <textarea value={variants} onChange={e=>setVariants(e.target.value)}
            placeholder="e.g. Barbell Hip Thrust, DB Hip Thrust, Cable Hip Extension"
            style={{...S.textInp,minHeight:"80px",resize:"none",lineHeight:1.5}}/>
        </div>
        <div style={{fontSize:"9px",color:"#2a2a2a",marginBottom:"12px"}}>Separate multiple variants with commas. Leave blank to track just the movement name.</div>
        <button style={{...S.btn("#e8a838",false),padding:"13px"}} onClick={submit}>ADD LIFT →</button>
      </div>
    </div>
  );
}

// ── AUTH MODALS (outside App — prevents keyboard dismiss on re-render) ────────

function AuthModal({ showAuth, authMode, setAuthMode, authName, setAuthName, authEmail, setAuthEmail, authPwd, setAuthPwd, authErr, authLoading, onAuth, onClose }) {
  if (!showAuth) return null;
  return (
    <div style={{...S.overlay, zIndex:200}}>
      <div style={S.sheet}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <div style={{fontSize:"20px",fontWeight:900}}>{authMode==="login"?"SIGN IN":"CREATE ACCOUNT"}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
        </div>
        {!isConfigured&&<div style={{padding:"10px 14px",background:"#1a0a00",border:"1px solid #e8a83840",borderRadius:"8px",marginBottom:"14px",fontSize:"11px",color:"#e8a838",lineHeight:1.5}}>Open src/supabase.js and follow setup instructions to enable cloud sync.</div>}
        {authMode==="signup"&&<div style={{marginBottom:"10px"}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>NAME</div><input style={S.textInp} value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Roger"/></div>}
        <div style={{marginBottom:"10px"}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>EMAIL</div><input style={S.textInp} type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="you@example.com"/></div>
        <div style={{marginBottom:"16px"}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>PASSWORD</div><input style={S.textInp} type="password" value={authPwd} onChange={e=>setAuthPwd(e.target.value)} placeholder="••••••••"/></div>
        {authErr&&<div style={{fontSize:"11px",color:"#e05c2a",marginBottom:"12px",lineHeight:1.4}}>{authErr}</div>}
        <button style={{...S.btn("#e8a838",false),padding:"13px",opacity:authLoading?0.6:1}} onClick={onAuth} disabled={authLoading}>
          {authLoading?"...":(authMode==="login"?"SIGN IN →":"CREATE ACCOUNT →")}
        </button>
        <button onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");}} style={{width:"100%",marginTop:"10px",padding:"10px",background:"none",border:"none",color:"#444",fontSize:"12px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
          {authMode==="login"?"Don't have an account? Sign up":"Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

function ProfileModal({ showProfile, user, syncing, migratePrompt, onSync, onMigrate, onSignOut, onClose }) {
  if (!showProfile) return null;
  return (
    <div style={{...S.overlay, zIndex:200}}>
      <div style={S.sheet}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <div style={{fontSize:"20px",fontWeight:900}}>PROFILE</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:"12px 14px",background:"#161616",borderRadius:"10px",marginBottom:"14px"}}>
          <div style={{fontSize:"11px",color:"#555",marginBottom:"2px"}}>SIGNED IN AS</div>
          <div style={{fontSize:"14px",fontWeight:700,color:"#ccc"}}>{user?.user_metadata?.name||user?.email}</div>
          <div style={{fontSize:"11px",color:"#333",marginTop:"2px"}}>{user?.email}</div>
        </div>
        {migratePrompt&&<div style={{padding:"12px 14px",background:"#1a1200",border:"1px solid #e8a83840",borderRadius:"10px",marginBottom:"12px"}}>
          <div style={{fontSize:"12px",color:"#e8a838",fontWeight:700,marginBottom:"6px"}}>LOCAL DATA FOUND</div>
          <div style={{fontSize:"11px",color:"#7a6030",lineHeight:1.5,marginBottom:"10px"}}>Upload your existing workout history to your account.</div>
          <button onClick={onMigrate} style={{...S.btn("#e8a838",false),padding:"10px",fontSize:"12px"}}>UPLOAD LOCAL DATA →</button>
        </div>}
        {syncing&&<div style={{fontSize:"10px",color:"#e8a838",marginBottom:"10px",letterSpacing:"1px"}}>SYNCING...</div>}
        <button onClick={onSync} style={{...S.btn("#1a2a3a",true),padding:"11px",fontSize:"12px",color:"#4a9eda",border:"1px solid #1a3a5a",marginBottom:"8px"}}>SYNC TO CLOUD</button>
        <button onClick={onSignOut} style={{...S.btn("#c0392b",true),padding:"11px",fontSize:"12px"}}>SIGN OUT</button>
      </div>
    </div>
  );
}

export default function App() {
  // App flow state
  const [appState, setAppState] = useState("loading");
  const [authInitialMode, setAuthInitialMode] = useState("signup");
  const [userProfile, setUserProfile] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const [tab, setTab] = useState("today");
  const [planStartDate, setPlanStartDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phase, setPhase] = useState(1);
  const [week, setWeek] = useState(1);
  const [activeDay, setActiveDay] = useState(null);
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [setInput, setSetInput] = useState(null);
  const [wt, setWt] = useState("");
  const [rp, setRp] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState(null);
  const [notes, setNotes] = useState({});
  const [prs, setPrs] = useState({});
  const [newPR, setNewPR] = useState(null);
  const [customPRGroups, setCustomPRGroups] = useState([]); // user-added PR groups
  const [removedPRGroups, setRemovedPRGroups] = useState([]); // user-removed default groups
  const [prGroupModal, setPrGroupModal] = useState(false); // add custom PR group modal // { exKey, weight } — triggers badge
  const [customWorkouts, setCustomWorkouts] = useState([]);
  const [presetOverrides, setPresetOverrides] = useState({});
  const [builder, setBuilder] = useState(null);
  const [builderEx, setBuilderEx] = useState(null);

  // Modal state — lifted to App to prevent remount-on-rerender bug
  const [noteEditor, setNoteEditor] = useState(null);
  const [noteVal, setNoteVal] = useState("");
  const [swapModal, setSwapModal] = useState(null);
  const [swapTab, setSwapTab] = useState("suggested");
  const [swapSearch, setSwapSearch] = useState("");
  const [addExModal, setAddExModal] = useState(null);
  const [prEditor, setPrEditor] = useState(null);

  // Auth
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPwd, setAuthPwd] = useState("");
  const [authName, setAuthName] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [migratePrompt, setMigratePrompt] = useState(false);

  // Refs
  const sessionStartRef = useRef(null); // wall-clock start for elapsed timer
  const restTimerRef = useRef(null);
  const todayId = getTodayId();

  // ── LOAD ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const s=LS.get("grind_settings");
    const startDate=s?.planStartDate||null;
    if(startDate){
      setPlanStartDate(startDate);
      const w=calcWeekFromStart(startDate);
      const p=calcPhaseFromWeek(w);
      setWeek(w);setPhase(p);
    } else if(s){
      setPhase(s.phase||1);setWeek(s.week||1);
    }
    const h=LS.get("grind_history"); if(h)setHistory(h);
    const n=LS.get("grind_notes"); if(n)setNotes(n);
    const cw=LS.get("grind_custom_workouts"); if(cw)setCustomWorkouts(cw);
    const po=LS.get("grind_preset_overrides"); if(po)setPresetOverrides(po);
    const pr=LS.get("grind_prs"); if(pr)setPrs(pr);
    const cpg=LS.get("grind_custom_pr_groups"); if(cpg)setCustomPRGroups(cpg);
    const rpg=LS.get("grind_removed_pr_groups"); if(rpg)setRemovedPRGroups(rpg);
    const saved=LS.get("grind_active_session");
    if(saved){
      const e=saved.elapsed||0;
      setSession(saved.session);setElapsed(e);setActiveDay(saved.session.dayId);setTab("session");
      sessionStartRef.current = saved.startedAt || (Date.now()-e*1000);
    }
    if(isConfigured && supabase){
      supabase.auth.getSession().then(({data:{session:s}})=>{
        if(s){
          setUser(s.user);
          loadCloud(s.user.id);
          // Check if they've completed onboarding
          const done=LS.get("grind_onboarding_complete");
          setAppState(done?"app":"onboarding");
        } else {
          setAppState("landing");
        }
      });
      const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>{
        if(s?.user){
          setUser(s.user);
          loadCloud(s.user.id);
          // Only redirect to app if we're not already mid-onboarding
          setAppState(prev=>{
            if(prev==="onboarding")return prev; // don't interrupt onboarding
            const done=LS.get("grind_onboarding_complete");
            return done?"app":"onboarding";
          });
        } else {
          setUser(null);
          setAppState("landing");
        }
      });
      return()=>subscription.unsubscribe();
    } else {
      // No Supabase — go straight to app
      setAppState("app");
    }
  }, []);

  // Sync noteVal when noteEditor opens
  useEffect(()=>{ if(noteEditor) setNoteVal(noteEditor.value||""); }, [noteEditor?.exName]);
  // Reset swap state when swap modal opens
  useEffect(()=>{ if(swapModal){setSwapTab("suggested");setSwapSearch("");} }, [swapModal?.originalKey]);

  // Persist settings
  useEffect(()=>{LS.set("grind_settings",{phase,week});},[phase,week]);
  useEffect(()=>{LS.set("grind_notes",notes);},[notes]);
  useEffect(()=>{LS.set("grind_custom_workouts",customWorkouts);},[customWorkouts]);
  useEffect(()=>{LS.set("grind_preset_overrides",presetOverrides);},[presetOverrides]);
  useEffect(()=>{LS.set("grind_custom_pr_groups",customPRGroups);},[customPRGroups]);
  useEffect(()=>{LS.set("grind_removed_pr_groups",removedPRGroups);},[removedPRGroups]);

  // Persist session (include startedAt for timer restoration)
  useEffect(()=>{
    if(session) LS.set("grind_active_session",{session,elapsed,startedAt:sessionStartRef.current});
  },[session,elapsed]);

  // History → also cloud sync
  useEffect(()=>{
    LS.set("grind_history",history);
    if(user&&isConfigured){const t=setTimeout(()=>syncCloud(),3000);return()=>clearTimeout(t);}
  },[history]);

  // ── WALL-CLOCK SESSION TIMER ───────────────────────────────────────────────
  useEffect(()=>{
    if(!session) return;
    // Set start ref once per session
    if(!sessionStartRef.current) sessionStartRef.current = Date.now() - elapsed*1000;
    const interval = setInterval(()=>{
      setElapsed(Math.floor((Date.now()-sessionStartRef.current)/1000));
    }, 1000);
    return ()=>clearInterval(interval);
  }, [!!session]);

  // Catch up immediately when coming back from background
  useEffect(()=>{
    function onVis(){
      if(!document.hidden && session && sessionStartRef.current){
        setElapsed(Math.floor((Date.now()-sessionStartRef.current)/1000));
      }
    }
    document.addEventListener("visibilitychange", onVis);
    return()=>document.removeEventListener("visibilitychange", onVis);
  }, [!!session]);

  // ── REST TIMER ────────────────────────────────────────────────────────────
  useEffect(()=>{
    if(restTimer&&restTimer.remaining>0){
      restTimerRef.current=setTimeout(()=>{
        setRestTimer(prev=>{
          if(!prev)return null;
          if(prev.remaining<=1){try{navigator.vibrate([200,100,200,100,200]);}catch{}return null;}
          return{...prev,remaining:prev.remaining-1};
        });
      },1000);
    }
    return()=>clearTimeout(restTimerRef.current);
  },[restTimer]);

  // ── CLOUD ────────────────────────────────────────────────────────────────
  async function loadCloud(userId){
    try{
      const[{data:ud},{data:prData}]=await Promise.all([
        supabase.from("user_data").select("*").eq("id",userId).single(),
        supabase.from("user_prs").select("*").eq("user_id",userId).order("logged_at",{ascending:false}),
      ]);
      if(ud){
        if(ud.history?.length)setHistory(ud.history);
        if(ud.notes)setNotes(ud.notes);
        if(ud.custom_workouts?.length)setCustomWorkouts(ud.custom_workouts);
        if(ud.preset_overrides&&Object.keys(ud.preset_overrides).length){
          setPresetOverrides(ud.preset_overrides);
          LS.set("grind_preset_overrides",ud.preset_overrides);
        }
        if(ud.settings){
      if(ud.settings.planStartDate){
        const sd=ud.settings.planStartDate;
        setPlanStartDate(sd);
        const w=calcWeekFromStart(sd);
        const p=calcPhaseFromWeek(w);
        setWeek(w);setPhase(p);
      } else {
        if(ud.settings.phase)setPhase(ud.settings.phase);
        if(ud.settings.week)setWeek(ud.settings.week);
      }
    }
        // Mark onboarding complete locally if done in cloud
        if(ud.onboarding_complete)LS.set("grind_onboarding_complete",true);
      }
      if(prData?.length){
        const pm={};
        prData.forEach(p=>{if(!pm[p.lift_name])pm[p.lift_name]={weight:p.weight,reps:p.reps,estimated1rm:p.estimated_1rm,date:p.logged_at?.slice(0,10)};});
        setPrs(pm);LS.set("grind_prs",pm);
      }
      const lh=LS.get("grind_history");
      if(lh?.length&&!ud?.history?.length)setMigratePrompt(true);
    }catch(e){console.error(e);}
  }

  async function completeOnboarding({ profile, plan }) {
    setUserProfile(profile);
    setGeneratedPlan(plan);

    // Convert generated plan days into preset overrides
    // This replaces Roger's WORKOUTS with the user's generated plan
    const overrides={};
    if(plan?.weeks?.[0]?.days){
      Object.entries(plan.weeks[0].days).forEach(([dayId,dayPlan])=>{
        overrides[dayId]=dayPlan;
      });
    }
    setPresetOverrides(overrides);
    LS.set("grind_preset_overrides",overrides);
    const startDate=today();
    setPlanStartDate(startDate);
    const w=calcWeekFromStart(startDate);
    const p=calcPhaseFromWeek(w);
    setWeek(w);setPhase(p);
    LS.set("grind_user_profile",profile);
    LS.set("grind_onboarding_complete",true);
    LS.set("grind_settings",{planStartDate:startDate,phase:p,week:w});

    // Save PRs from onboarding answers
    if(profile.prs){
      const prMap={...prs};
      Object.entries(profile.prs).forEach(([key,val])=>{
        if(val.weight&&val.reps){
          const w=parseFloat(val.weight),r=parseInt(val.reps);
          if(w&&r)prMap[key]={weight:w,reps:r,estimated1rm:calc1RM(w,r),date:today()};
        }
      });
      if(Object.keys(prMap).length>0){setPrs(prMap);LS.set("grind_prs",prMap);}
    }

    // Sync to Supabase
    if(user&&isConfigured&&supabase){
      try{
        await supabase.from("user_data").upsert({
          id:user.id,history:[],notes:{},
          custom_workouts:[],
          preset_overrides:overrides,
          settings:{phase:1,week:1},
          user_profile:profile,
          onboarding_complete:true,
          updated_at:new Date().toISOString()
        });
      }catch(e){console.error("Supabase sync error",e);}
    }

    setAppState("app");
  }

  async function syncCloud(){
    if(!user||!isConfigured)return;
    setSyncing(true);
    try{
      await supabase.from("user_data").upsert({id:user.id,history,notes,custom_workouts:customWorkouts,preset_overrides:presetOverrides,settings:{phase,week,planStartDate},updated_at:new Date().toISOString()});
    }catch(e){console.error(e);}
    setSyncing(false);
  }

  async function handleAuth(){
    if(!isConfigured){setAuthErr("Open src/supabase.js and follow the setup instructions.");return;}
    setAuthLoading(true);setAuthErr("");
    try{
      if(authMode==="signup"){
        const{data,error}=await supabase.auth.signUp({email:authEmail,password:authPwd,options:{data:{name:authName}}});
        if(error)throw error;
        if(data.user){
          try{await supabase.from("user_profiles").insert({id:data.user.id,name:authName});}catch(e){}
          setUser(data.user);
          setShowAuth(false);
          if(data.session){
            // Email confirmations disabled — go straight to onboarding
            setAppState("onboarding");
          } else {
            // Email confirmation required
            setAuthErr("Check your email to confirm your account, then sign back in.");
          }
        }
      } else {
        const{data,error}=await supabase.auth.signInWithPassword({email:authEmail,password:authPwd});
        if(error)throw error;
        setShowAuth(false);
        const done=LS.get("grind_onboarding_complete");
        // Don't set appState here — onAuthStateChange will fire and handle it
      }
    }catch(e){setAuthErr(e.message);}
    setAuthLoading(false);
  }

  async function handleSignOut(){await supabase.auth.signOut();setUser(null);setShowProfile(false);}

  // ── PRs ───────────────────────────────────────────────────────────────────
  function savePR(liftName, weight, reps){
    const w=parseFloat(weight),r=parseInt(reps);
    if(!w||!r)return;
    const est=calc1RM(w,r);
    const entry={weight:w,reps:r,estimated1rm:est,date:today(),implement:liftName};
    const updated={...prs,[liftName]:entry};
    setPrs(updated);LS.set("grind_prs",updated);
    if(user&&isConfigured&&supabase)supabase.from("user_prs").insert({user_id:user.id,lift_name:liftName,weight:w,reps:r,estimated_1rm:est});
    setPrEditor(null);
  }

  function getActivePRGroups(){
    const defaults=PR_GROUPS.filter(g=>!removedPRGroups.includes(g.id));
    return[...defaults,...customPRGroups];
  }

  function getGroupPR(group){
    if(!group?.variants)return prs[group.label]||null;
    let best=null;
    group.variants.forEach(v=>{
      const pr=prs[v];
      if(pr&&(!best||pr.weight>best.weight))best={...pr,implement:v};
    });
    const labelPR=prs[group.label];
    if(labelPR&&(!best||labelPR.weight>best.weight))best={...labelPR,implement:group.label};
    return best;
  }

  function removeDefaultPRGroup(groupId){
    const u=[...removedPRGroups,groupId];setRemovedPRGroups(u);LS.set("grind_removed_pr_groups",u);
  }
  function restoreDefaultPRGroup(groupId){
    const u=removedPRGroups.filter(id=>id!==groupId);setRemovedPRGroups(u);LS.set("grind_removed_pr_groups",u);
  }
  function addCustomPRGroup(label,variants){
    const g={id:`custom_${uid()}`,label,variants:variants.filter(v=>v.trim()),custom:true};
    const u=[...customPRGroups,g];setCustomPRGroups(u);LS.set("grind_custom_pr_groups",u);
  }
  function removeCustomPRGroup(id){
    const u=customPRGroups.filter(g=>g.id!==id);setCustomPRGroups(u);LS.set("grind_custom_pr_groups",u);
  }


  function getSuggestedWeight(exName){
    let pr=prs[exName];
    if(!pr){
      const lo=exName.toLowerCase();
      const k=Object.keys(prs).find(k=>k.toLowerCase().includes(lo.split(" ")[0])||lo.includes(k.toLowerCase().split(" ")[0]));
      if(k)pr=prs[k];
    }
    if(!pr?.estimated1rm)return null;
    const [lo,hi]=PHASE_PCT[phase];
    return{lo:calcWt(pr.estimated1rm,lo*100),hi:calcWt(pr.estimated1rm,hi*100),pct:`${Math.round(lo*100)}–${Math.round(hi*100)}%`,est1rm:pr.estimated1rm};
  }

  // ── SESSION ───────────────────────────────────────────────────────────────
  function getWorkout(dayId){ return presetOverrides[dayId]||WORKOUTS[dayId]; }

  function getSessionWorkout(){
    if(!session)return null;
    if(session.mobilitySession)return session._mobilityWorkout||MOBILITY_SESSION;
    if(session.isCustom)return customWorkouts.find(cw=>cw.id===session.customId)||getWorkout(session.dayId);
    return getWorkout(session.dayId);
  }

  function startSession(dayId, customWorkout){
    const workout=customWorkout||getWorkout(dayId);
    const sets={};
    workout.sections.forEach(sec=>sec.exercises.forEach(ex=>{
      if(ex.warmup){
        // Warmup exercises: single checkbox only
        sets[ex.id||ex.name]=[{weight:"",reps:"",done:false,warmup:true}];
      } else {
        sets[ex.id||ex.name]=Array.from({length:ex.sets},()=>({weight:"",reps:"",done:false}));
      }
    }));
    const isMob=dayId==="mobility_static";
    const ns={dayId,sets,isCustom:isMob||!!customWorkout,customId:isMob?"__mobility__":customWorkout?.id,mobilitySession:isMob};
    if(isMob)ns._mobilityWorkout=workout;
    sessionStartRef.current=Date.now(); // fresh start
    setSession(ns);setElapsed(0);setActiveDay(dayId);setRestTimer(null);setTab("session");
  }

  // Detect if an exercise is time-based from its target string
  function isTimeBased(exKey) {
    const w = getSessionWorkout();
    if (!w) return false;
    let target = "";
    w.sections.forEach(sec => sec.exercises.forEach(ex => {
      if ((ex.id || ex.name) === exKey) target = ex.target || "";
    }));
    return /sec|min|hold|time/i.test(target);
  }

  function logSet(exKey, idx, weight, reps, isEdit){
    const w=getSessionWorkout();
    let restSecs=90;
    w.sections.forEach(sec=>sec.exercises.forEach(ex=>{if((ex.id||ex.name)===exKey)restSecs=ex.rest||90;}));
    const exSets=session.sets[exKey];
    const isLast=idx>=(exSets?.length||0)-1;
    setSession(prev=>{
      const u={...prev,sets:{...prev.sets,[exKey]:prev.sets[exKey].map((s,i)=>i===idx?{weight,reps,done:true}:s)}};
      LS.set("grind_active_session",{session:u,elapsed,startedAt:sessionStartRef.current});return u;
    });
    setSetInput(null);setWt("");setRp("");
    if(!isEdit&&!isLast&&restSecs>0)setRestTimer({remaining:restSecs,total:restSecs,exKey,nextSetIdx:idx+1});
    // Auto-PR detection — checks group membership, updates best across all variants
    const numWeight=parseFloat(weight);
    const numReps=parseInt(reps);
    if(!isNaN(numWeight)&&numWeight>0&&!isNaN(numReps)&&numReps>0){
      // Find if this exercise belongs to a PR group
      const group=getActivePRGroups().find(g=>g.variants?.some(v=>v.toLowerCase()===exKey.toLowerCase()));
      if(group){
        // Check if this beats the group best
        const groupBest=getGroupPR(group);
        const isNewPR=!groupBest||numWeight>groupBest.weight;
        if(isNewPR){
          const est=calc1RM(numWeight,numReps);
          const entry={weight:numWeight,reps:numReps,estimated1rm:est,date:today(),implement:exKey};
          // Save under the exact exercise name for granular tracking
          const updated={...prs,[exKey]:entry};
          setPrs(updated);LS.set("grind_prs",updated);
          if(user&&isConfigured&&supabase)supabase.from("user_prs").insert({user_id:user.id,lift_name:exKey,weight:numWeight,reps:numReps,estimated_1rm:est});
          setNewPR({exKey,weight:numWeight});
          setTimeout(()=>setNewPR(null),3000);
        }
      }
    }
  }

  function skipSet(exKey, idx){
    setSession(prev=>{
      const u={...prev,sets:{...prev.sets,[exKey]:prev.sets[exKey].map((s,i)=>i===idx?{...s,done:true}:s)}};
      LS.set("grind_active_session",{session:u,elapsed,startedAt:sessionStartRef.current});return u;
    });
    setSetInput(null);setWt("");setRp("");setRestTimer(null);
  }

  function openSetInput(exKey, idx, isEdit){
    const set=session.sets[exKey]?.[idx];
    if(restTimer&&!isEdit)setRestTimer(null);
    setSetInput({exKey,idx,isEdit:!!isEdit});
    setWt(set?.weight||"");setRp(set?.reps||"");
  }

  function finishSession(){
    const entry={date:today(),dayId:session.dayId,sets:session.sets,duration:elapsed,phase,isCustom:session.isCustom};
    const newH=[entry,...history].slice(0,200);
    setHistory(newH);LS.del("grind_active_session");
    sessionStartRef.current=null;
    setSession(null);setActiveDay(null);setRestTimer(null);setElapsed(0);setTab("today");
  }

  function abandonSession(){
    if(!window.confirm("Abandon session? Progress won't be saved."))return;
    LS.del("grind_active_session");
    sessionStartRef.current=null;
    setSession(null);setActiveDay(null);setRestTimer(null);setElapsed(0);setTab("today");
  }

  function getSectionExercises(sec, si){
    return[...sec.exercises,...(session?.sessionExAdditions?.[si]||[])];
  }

  function addExToSession(si, newEx){
    const key=newEx.id||newEx.name;
    setSession(prev=>{
      const a={...(prev.sessionExAdditions||{})};
      a[si]=[...(a[si]||[]),newEx];
      const u={...prev,sets:{...prev.sets,[key]:Array.from({length:newEx.sets},()=>({weight:"",reps:"",done:false}))},sessionExAdditions:a};
      LS.set("grind_active_session",{session:u,elapsed,startedAt:sessionStartRef.current});return u;
    });
    setAddExModal(null);
  }

  function removeSessionEx(si, exKey){
    setSession(prev=>{
      const a={...(prev.sessionExAdditions||{})};
      if(a[si])a[si]=a[si].filter(e=>(e.id||e.name)!==exKey);
      const s={...prev.sets};delete s[exKey];
      const u={...prev,sets:s,sessionExAdditions:a};
      LS.set("grind_active_session",{session:u,elapsed,startedAt:sessionStartRef.current});return u;
    });
  }

  function getEffectiveEx(origEx){
    if(!session)return origEx;
    const key=origEx.id||origEx.name;
    const swapped=session.swaps?.[key];
    if(!swapped)return origEx;
    return session.swapData?.[key]||{...origEx,name:swapped};
  }

  function applySwap(originalKey, newEx, fromBuilder){
    if(fromBuilder){
      setBuilder(prev=>{
        const w={...prev.workout};let found=false;
        w.sections=w.sections.map(sec=>({...sec,exercises:sec.exercises.map(ex=>{
          if((ex.id||ex.name)===originalKey&&!found){found=true;return{...newEx,id:ex.id||uid(),superset:ex.superset};}
          return ex;
        })}));
        return{...prev,workout:w};
      });
      setSwapModal(null);return;
    }
    setSession(prev=>{
      const s={...prev.sets};const cur=prev.swaps?.[originalKey]||originalKey;
      delete s[cur];
      const nk=newEx.id||newEx.name;
      s[nk]=Array.from({length:newEx.sets},()=>({weight:"",reps:"",done:false}));
      const u={...prev,sets:s,swaps:{...(prev.swaps||{}),[originalKey]:nk},swapData:{...(prev.swapData||{}),[originalKey]:newEx}};
      LS.set("grind_active_session",{session:u,elapsed,startedAt:sessionStartRef.current});return u;
    });
    setSwapModal(null);
  }

  function revertSwap(originalKey, originalEx){
    setSession(prev=>{
      const s={...prev.sets};const cur=prev.swaps?.[originalKey]||originalKey;
      delete s[cur];s[originalKey]=Array.from({length:originalEx.sets},()=>({weight:"",reps:"",done:false}));
      const sw={...(prev.swaps||{})};delete sw[originalKey];
      const sd={...(prev.swapData||{})};delete sd[originalKey];
      const u={...prev,sets:s,swaps:sw,swapData:sd};
      LS.set("grind_active_session",{session:u,elapsed,startedAt:sessionStartRef.current});return u;
    });
    setSwapModal(null);
  }

  function saveNote(exName, value){ setNotes(n=>({...n,[exName]:value}));setNoteEditor(null); }

  function getLastLog(exKey){
    for(const h of history){
      if(h.sets?.[exKey]){
        const done=h.sets[exKey].filter(s=>s.done&&s.weight&&!isNaN(Number(s.weight)));
        if(done.length)return done[done.length-1];
      }
    }
    return null;
  }

  function sessionProg(){
    if(!session)return 0;
    // Exclude warmup sets from progress calculation
    const all=Object.values(session.sets).flat().filter(s=>!s.warmup);
    return all.length?Math.round(all.filter(s=>s.done).length/all.length*100):0;
  }

  // ── BUILDER ───────────────────────────────────────────────────────────────
  function newCustomWorkout(){setBuilder({mode:"new",workout:{id:uid(),name:"",subtitle:"",color:DAY_COLORS[customWorkouts.length%DAY_COLORS.length],sections:[{title:"Main",exercises:[]}]}});}
  function editCustomWorkout(cw){setBuilder({mode:"edit",workout:JSON.parse(JSON.stringify(cw))});}
  function editPresetWorkout(dayId){setBuilder({mode:"preset",presetDayId:dayId,workout:JSON.parse(JSON.stringify(getWorkout(dayId)))});}
  function deleteCustomWorkout(id){if(!window.confirm("Delete this workout?"))return;setCustomWorkouts(cw=>cw.filter(c=>c.id!==id));}
  function resetPresetWorkout(dayId){if(!window.confirm("Reset to original?"))return;setPresetOverrides(po=>{const n={...po};delete n[dayId];return n;});}
  function saveBuilderWorkout(){
    if(!builder.workout.name.trim()){alert("Give your workout a name first.");return;}
    if(builder.mode==="preset")setPresetOverrides(po=>({...po,[builder.presetDayId]:builder.workout}));
    else if(builder.mode==="new")setCustomWorkouts(cw=>[...cw,builder.workout]);
    else setCustomWorkouts(cw=>cw.map(c=>c.id===builder.workout.id?builder.workout:c));
    setBuilder(null);
  }
  function builderMutate(fn){ setBuilder(prev=>({...prev,workout:fn(JSON.parse(JSON.stringify(prev.workout)))})); }
  function builderAddEx(si,ex){ builderMutate(w=>{w.sections[si].exercises.push({...ex,id:uid()});return w;}); setBuilderEx(null); }
  function builderUpdateEx(si,ei,ex){ builderMutate(w=>{w.sections[si].exercises[ei]={...w.sections[si].exercises[ei],...ex};return w;}); setBuilderEx(null); }
  function builderDeleteEx(si,ei){ builderMutate(w=>{w.sections[si].exercises.splice(ei,1);return w;}); }
  function builderAddSection(){ builderMutate(w=>{w.sections.push({title:"New Section",exercises:[]});return w;}); }
  function builderDeleteSection(si){ builderMutate(w=>{w.sections.splice(si,1);return w;}); }
  function builderToggleSuperset(si,ei){
    builderMutate(w=>{
      const ex=w.sections[si].exercises[ei];
      const prev=w.sections[si].exercises[ei-1];
      if(ex.superset){delete w.sections[si].exercises[ei].superset;}
      else if(prev){
        const id=prev.superset||`ss_${uid()}`;
        w.sections[si].exercises[ei].superset=id;
        if(!prev.superset)w.sections[si].exercises[ei-1].superset=id;
      }
      return w;
    });
  }

  function groupBySupersets(exercises){
    const groups=[];const done=new Set();
    exercises.forEach((ex,i)=>{
      if(done.has(i))return;
      if(ex.superset){
        const g=exercises.map((e,j)=>({...e,_idx:j})).filter(e=>e.superset===ex.superset);
        g.forEach(e=>done.add(e._idx));
        groups.push({type:"superset",exercises:g});
      } else {done.add(i);groups.push({type:"single",exercises:[{...ex,_idx:i}]});}
    });
    return groups;
  }

  // ── REST OVERLAY ──────────────────────────────────────────────────────────
  function RestOverlay(){
    if(!restTimer)return null;
    const pct=restTimer.remaining/restTimer.total;
    const almost=restTimer.remaining<=10;
    const color=almost?"#27ae60":"#e8a838";
    const R=22,circ=2*Math.PI*R;
    return(
      <div style={{margin:"10px 16px 0"}}>
        <div style={{background:"#0e0e0e",border:`1px solid ${color}40`,borderLeft:`3px solid ${color}`,borderRadius:"12px",padding:"12px 14px",display:"flex",alignItems:"center",gap:"14px"}}>
          <div style={{position:"relative",flexShrink:0,width:"52px",height:"52px"}}>
            <svg width="52" height="52" style={{transform:"rotate(-90deg)"}}>
              <circle cx="26" cy="26" r={R} fill="none" stroke="#1a1a1a" strokeWidth="4"/>
              <circle cx="26" cy="26" r={R} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={(circ*(1-pct)).toFixed(1)} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.9s linear"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:"14px",fontWeight:900,color,fontVariantNumeric:"tabular-nums"}}>{restTimer.remaining}</span>
            </div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px"}}>RESTING</div>
            <div style={{fontSize:"13px",fontWeight:800,color:"#bbb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{restTimer.exKey}</div>
            <div style={{fontSize:"10px",color:"#333",marginTop:"2px"}}>Set {restTimer.nextSetIdx+1} next · {fmtDur(restTimer.total)}</div>
          </div>
          <button onClick={()=>setRestTimer(null)} style={{background:"#1a1a1a",border:"1px solid #252525",borderRadius:"8px",color:"#555",fontSize:"10px",fontWeight:700,padding:"8px 10px",cursor:"pointer",flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif"}}>SKIP</button>
        </div>
        {almost&&<div style={{textAlign:"center",padding:"4px 0 0",fontSize:"10px",color:"#27ae60",fontWeight:800,letterSpacing:"2px"}}>GET READY</div>}
      </div>
    );
  }

  // ── EXERCISE ROW (session) ────────────────────────────────────────────────
  function ExRow({originalEx, isAdded, si}){
    const ex=isAdded?originalEx:getEffectiveEx(originalEx);
    const exKey=ex.id||ex.name;
    const origKey=originalEx.id||originalEx.name;
    const isSwapped=!isAdded&&exKey!==origKey;
    const exSets=session.sets[exKey]||[];
    const allDone=exSets.every(s=>s.done);
    const hasNote=!!notes[exKey];
    const sg=getSuggestedWeight(ex.name);
    const isWarmup=ex.warmup||exSets[0]?.warmup;

    // Warmup exercises render as simple checkbox rows
    if(isWarmup){
      return(
        <div style={{padding:"10px 16px",borderBottom:"1px solid #0f0f0f",display:"flex",alignItems:"center",gap:"12px",background:allDone?"#0c130c":"transparent",opacity:allDone?0.7:1}}>
          <div onClick={()=>{
            setSession(prev=>{
              const u={...prev,sets:{...prev.sets,[exKey]:[{...prev.sets[exKey][0],done:!allDone}]}};
              LS.set("grind_active_session",{session:u,elapsed,startedAt:sessionStartRef.current});return u;
            });
          }}
            style={{width:"28px",height:"28px",borderRadius:"6px",border:`1.5px solid ${allDone?"#27ae60":"#252525"}`,background:allDone?"#112211":"#111",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            {allDone&&<span style={{color:"#27ae60",fontSize:"14px",lineHeight:1}}>✓</span>}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:"13px",fontWeight:700,color:allDone?"#27ae60":"#888"}}>{ex.name}</div>
            <div style={{fontSize:"10px",color:"#2a2a2a",marginTop:"1px"}}>{ex.sets} × {ex.target}</div>
            {ex.note&&<div style={{fontSize:"9px",color:"#222",marginTop:"2px",fontStyle:"italic",lineHeight:1.4}}>{ex.note}</div>}
          </div>
          <span style={{fontSize:"9px",fontWeight:700,padding:"2px 7px",borderRadius:"4px",background:"#1a1a0a",color:"#4a4a20",letterSpacing:"1px",flexShrink:0}}>WARMUP</span>
        </div>
      );
    }

    return(
      <div style={{padding:"13px 16px",borderBottom:"1px solid #0f0f0f",background:allDone?"#0c130c":"transparent"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"8px",marginBottom:"8px"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
              <div style={{fontSize:"14px",fontWeight:700,color:allDone?"#27ae60":"#ccc"}}>{ex.name}</div>
              {isSwapped&&<span style={S.tag("#1a0800","#e05c2a")}>SWAPPED</span>}
              {isAdded&&<span style={S.tag("#0a1a2a","#4a9eda")}>ADDED</span>}
            </div>
            {isSwapped&&<div style={{fontSize:"9px",color:"#3a2a1a",marginTop:"1px"}}>Original: {originalEx.name}</div>}
            <div style={{fontSize:"10px",color:"#333",marginTop:"2px"}}>{ex.sets} sets · {ex.target}</div>
            {ex.note&&<div style={{fontSize:"9px",color:"#272727",marginTop:"2px",fontStyle:"italic",lineHeight:1.4}}>{ex.note}</div>}
            {(ex.rest||0)>0&&<div style={{fontSize:"9px",color:"#1e3020",marginTop:"2px"}}>⏱ {fmtDur(ex.rest)} rest</div>}
            {sg&&<div style={{marginTop:"5px",padding:"4px 8px",background:"#0e1200",border:"1px solid #1a2a00",borderRadius:"6px",display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={{fontSize:"9px",color:"#6a8a20",fontWeight:700}}>PH{phase} TARGET</span>
              <span style={{fontSize:"11px",color:"#8aaa30",fontWeight:700}}>{sg.lo}–{sg.hi} lbs</span>
              <span style={{fontSize:"9px",color:"#3a4a10"}}>{sg.pct}</span>
            </div>}
            {hasNote&&<div style={{marginTop:"5px",padding:"5px 8px",background:"#0e1a0e",border:"1px solid #1a3a1a",borderRadius:"6px",display:"flex",gap:"6px"}}>
              <span style={{fontSize:"9px",color:"#27ae60",fontWeight:700,flexShrink:0}}>NOTE</span>
              <span style={{fontSize:"10px",color:"#3a6a3a",lineHeight:1.4}}>{notes[exKey]}</span>
            </div>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"5px",alignItems:"flex-end"}}>
            {allDone&&<div style={{fontSize:"16px",color:"#27ae60"}}>✓</div>}
            <button onClick={()=>setNoteEditor({exName:exKey,value:notes[exKey]||""})}
              style={{background:hasNote?"#0e1a0e":"#1a1a1a",border:`1px solid ${hasNote?"#1a3a1a":"#252525"}`,borderRadius:"6px",color:hasNote?"#27ae60":"#333",fontSize:"9px",fontWeight:700,padding:"4px 8px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
              {hasNote?"NOTE ✓":"+ NOTE"}
            </button>
            {!isAdded&&<button onClick={()=>setSwapModal({originalKey:origKey,originalEx,fromBuilder:false})}
              style={{background:isSwapped?"#1a0800":"#1a1a1a",border:`1px solid ${isSwapped?"#e05c2a40":"#252525"}`,borderRadius:"6px",color:isSwapped?"#e05c2a":"#444",fontSize:"9px",fontWeight:700,padding:"4px 8px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
              ⇄ SWAP
            </button>}
            {isAdded&&<button onClick={()=>removeSessionEx(si,exKey)}
              style={{background:"#1a0a0a",border:"1px solid #c0392b30",borderRadius:"6px",color:"#c0392b",fontSize:"9px",fontWeight:700,padding:"4px 8px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
              ✕ REMOVE
            </button>}
          </div>
        </div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          {exSets.map((set,si2)=>{
            const isCurr=setInput?.exKey===exKey&&setInput?.idx===si2&&!setInput?.isEdit;
            const isEdit=setInput?.exKey===exKey&&setInput?.idx===si2&&setInput?.isEdit;
            const isNext=restTimer?.exKey===exKey&&restTimer?.nextSetIdx===si2;
            return(
              <div key={si2} onClick={()=>set.done?openSetInput(exKey,si2,true):openSetInput(exKey,si2,false)}
                style={{...S.chip(set.done,isCurr||isNext,isEdit),border:isNext&&!set.done?"2px solid #27ae60":S.chip(set.done,isCurr,isEdit).border}}>
                {set.done?(
                  <>{set.weight?<span style={{fontSize:"9px",fontWeight:800,color:isEdit?"#e05c2a":"#27ae60"}}>{set.weight}</span>:<span style={{fontSize:"13px",color:"#27ae60"}}>✓</span>}
                  {set.reps&&<span style={{fontSize:"8px",color:isEdit?"#6a3010":"#2a5a2a"}}>{set.reps}</span>}
                  {newPR?.exKey===exKey&&newPR?.weight===parseFloat(set.weight)&&<span style={{fontSize:"7px",fontWeight:900,color:"#e8a838",letterSpacing:"0.5px"}}>PR!</span>}</>
                ):isNext?<span style={{fontSize:"9px",fontWeight:800,color:"#27ae60"}}>GO</span>
                :<span style={{fontSize:"12px",fontWeight:700,color:isCurr?"#e8a838":"#333"}}>{si2+1}</span>}
              </div>
            );
          })}
        </div>
        {allDone&&<div style={{fontSize:"9px",color:"#1e2e1e",marginTop:"6px",letterSpacing:"1px"}}>TAP ANY SET TO EDIT</div>}
      </div>
    );
  }

  // ── APP STATE GATES ───────────────────────────────────────────────────────
  if(appState==="loading") return(
    <div style={{height:"100dvh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif"}}>
      <div style={{fontSize:"48px",fontWeight:900,color:"#1a1a1a",letterSpacing:"-2px"}}>WRK</div>
    </div>
  );

  if(appState==="landing") return(
    <Landing
      onSignUp={()=>{setAuthInitialMode("signup");setShowAuth(true);setAppState("auth");}}
      onSignIn={()=>{setAuthInitialMode("login");setShowAuth(true);setAppState("auth");}}
    />
  );

  if(appState==="auth") return(
    <div style={{height:"100dvh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif"}}>
      <AuthModal showAuth={true} authMode={authInitialMode} setAuthMode={setAuthMode}
        authName={authName} setAuthName={setAuthName} authEmail={authEmail} setAuthEmail={setAuthEmail}
        authPwd={authPwd} setAuthPwd={setAuthPwd} authErr={authErr} authLoading={authLoading}
        onAuth={handleAuth}
        onClose={()=>setAppState("landing")}/>
    </div>
  );

  if(appState==="onboarding") return(
    <Onboarding
      user={user}
      existingPRs={prs}
      onComplete={completeOnboarding}
      onSkip={()=>setAppState("app")}
    />
  );

  // ── SESSION SCREEN ────────────────────────────────────────────────────────
  if(tab==="session"&&session){
    const w=getSessionWorkout();
    if(!w){setTab("today");return null;}
    const prog=sessionProg();
    const wColor=w.color||"#e8a838";
    return(
      <div style={S.app}>
        <NoteEditorModal noteEditor={noteEditor} noteVal={noteVal} setNoteVal={setNoteVal} onSave={(v)=>saveNote(noteEditor.exName,v)} onClear={()=>saveNote(noteEditor.exName,"")} onClose={()=>setNoteEditor(null)}/>
        <SwapModal swapModal={swapModal} swapTab={swapTab} setSwapTab={setSwapTab} swapSearch={swapSearch} setSwapSearch={setSwapSearch} session={session} onApply={applySwap} onRevert={revertSwap} onClose={()=>setSwapModal(null)}/>
        <AddExModal addExModal={addExModal} onAdd={(ex)=>addExToSession(addExModal?.sectionIdx,ex)} onClose={()=>setAddExModal(null)}/>
        <PREditorModal prEditor={prEditor} prs={prs} phase={phase} onSave={savePR} onClose={()=>setPrEditor(null)}/>
      {prGroupModal&&<PRGroupModal onAdd={addCustomPRGroup} onClose={()=>setPrGroupModal(false)}/>}

        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",paddingBottom:"24px"}}>
          {/* Header */}
          <div style={{padding:"calc(env(safe-area-inset-top,0px) + 12px) 20px 10px",background:"#0a0a0a",borderBottom:"1px solid #1a1a1a",position:"sticky",top:0,zIndex:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
              <div>
                <div style={{fontSize:"10px",color:wColor,letterSpacing:"3px",fontWeight:700}}>{w.label?.toUpperCase()||"CUSTOM"}</div>
                <div style={{fontSize:"20px",fontWeight:900,lineHeight:1}}>{w.name.toUpperCase()}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:"24px",fontWeight:900,color:"#555",fontVariantNumeric:"tabular-nums",lineHeight:1}}>{fmtDur(elapsed)}</div>
                <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"2px"}}>ELAPSED</div>
              </div>
            </div>
            <div style={{height:"3px",background:"#1a1a1a",borderRadius:"2px",overflow:"hidden"}}>
              <div style={{height:"3px",background:wColor,width:`${prog}%`,transition:"width 0.4s",borderRadius:"2px"}}/>
            </div>
            <div style={{fontSize:"9px",color:"#2a2a2a",marginTop:"3px",letterSpacing:"1px"}}>{prog}% COMPLETE</div>
          </div>

          <RestOverlay/>

          {/* Set input panel */}
          {setInput&&(()=>{const sg=getSuggestedWeight(setInput.exKey);return(
            <div style={{margin:"10px 16px 0",background:"#161616",border:`1px solid ${setInput.isEdit?"#e05c2a":wColor}40`,borderRadius:"12px",padding:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"4px"}}>
                <div>
                  <div style={{fontSize:"10px",color:setInput.isEdit?"#e05c2a":wColor,fontWeight:800,letterSpacing:"2px"}}>{setInput.isEdit?"EDITING":"LOGGING"} SET {setInput.idx+1}</div>
                  <div style={{fontSize:"12px",color:"#888",marginTop:"1px"}}>{setInput.exKey}</div>
                </div>
                <button onClick={()=>setNoteEditor({exName:setInput.exKey,value:notes[setInput.exKey]||""})}
                  style={{background:"#1a1a1a",border:"1px solid #252525",borderRadius:"7px",color:"#555",fontSize:"10px",fontWeight:700,padding:"6px 10px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                  + NOTE
                </button>
              </div>
              {sg&&<div style={{padding:"6px 10px",background:"#0e1200",border:"1px solid #1a2a00",borderRadius:"7px",marginBottom:"8px",display:"flex",gap:"8px",alignItems:"center"}}>
                <span style={{fontSize:"9px",color:"#6a8a20",fontWeight:700}}>PH{phase} TARGET</span>
                <span style={{fontSize:"13px",fontWeight:800,color:"#8aaa30"}}>{sg.lo}–{sg.hi} lbs</span>
                <span style={{fontSize:"9px",color:"#3a4a10"}}>{sg.pct} of {sg.est1rm}lb 1RM</span>
                <button onClick={()=>setPrEditor(setInput.exKey)} style={{marginLeft:"auto",background:"none",border:"none",color:"#4a6a10",fontSize:"9px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>UPDATE PR</button>
              </div>}
              {notes[setInput.exKey]&&<div style={{padding:"6px 10px",background:"#0e1a0e",border:"1px solid #1a3a1a",borderRadius:"7px",marginBottom:"8px"}}>
                <div style={{fontSize:"9px",color:"#27ae60",letterSpacing:"2px",marginBottom:"2px"}}>YOUR NOTE</div>
                <div style={{fontSize:"12px",color:"#4a8a4a",lineHeight:1.4}}>{notes[setInput.exKey]}</div>
              </div>}
              {(()=>{
                const timeBased = isTimeBased(setInput.exKey);
                // Allow toggle between reps and time
                const [useTime, setUseTime] = [
                  setInput.timeMode ?? timeBased,
                  (v) => setSetInput(prev => ({...prev, timeMode: v}))
                ];
                const lastLog = getLastLog(setInput.exKey);
                return (
                  <>
                    {/* Mode toggle */}
                    <div style={{display:"flex",gap:"6px",marginBottom:"10px"}}>
                      {["reps","time"].map(m=>(
                        <button key={m} onClick={()=>setUseTime(m==="time")}
                          style={{flex:1,padding:"7px",background:(m==="time"?useTime:!useTime)?"#1a1a2a":"#111",border:`1px solid ${(m==="time"?useTime:!useTime)?"#4a9eda":"#1e1e1e"}`,borderRadius:"7px",color:(m==="time"?useTime:!useTime)?"#4a9eda":"#444",fontSize:"10px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                          {m==="reps"?"REPS":"TIME (sec)"}
                        </button>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:"10px",marginBottom:"10px"}}>
                      {!useTime && (
                        <div style={{flex:1}}>
                          <div style={{fontSize:"9px",color:"#3a3a3a",letterSpacing:"2px",marginBottom:"5px"}}>WEIGHT (lbs)</div>
                          <input style={S.inp} type="number" inputMode="decimal" value={wt} onChange={e=>setWt(e.target.value)} placeholder="135" autoFocus/>
                        </div>
                      )}
                      <div style={{flex:1}}>
                        <div style={{fontSize:"9px",color:"#3a3a3a",letterSpacing:"2px",marginBottom:"5px"}}>{useTime?"SECONDS":"REPS"}</div>
                        <input style={S.inp} type="number" inputMode="numeric" value={rp} onChange={e=>setRp(e.target.value)} placeholder={useTime?"45":"8"} autoFocus={useTime}/>
                      </div>
                    </div>
                    {lastLog&&<div style={{fontSize:"10px",color:"#3a3a3a",marginBottom:"8px"}}>
                      Last: {lastLog.weight&&lastLog.weight!=="BW"?`${lastLog.weight} lbs × `:""}
                      {lastLog.reps&&lastLog.reps!=="—"?lastLog.reps:""}{useTime?" sec":""}
                    </div>}
                    <div style={{display:"flex",gap:"8px"}}>
                      <button style={{...S.btn(setInput.isEdit?"#e05c2a":"#e8a838",false),flex:2,padding:"12px"}}
                        onClick={()=>logSet(setInput.exKey,setInput.idx,useTime?"BW":wt||"BW",rp||"—",setInput.isEdit)}>
                        {setInput.isEdit?"UPDATE ✓":"LOG ✓"}
                      </button>
                      {!setInput.isEdit&&<button style={{...S.btn("#333",true),flex:1,padding:"12px"}} onClick={()=>skipSet(setInput.exKey,setInput.idx)}>SKIP</button>}
                      <button style={{...S.btn("#333",true),flex:1,padding:"12px"}} onClick={()=>{setSetInput(null);setWt("");setRp("");}}>✕</button>
                    </div>
                  </>
                );
              })()}
            </div>
          );})()}

          {/* Sections */}
          {w.sections.map((sec,si)=>{
            const allEx=getSectionExercises(sec,si);
            const groups=groupBySupersets(allEx);
            return(
              <div key={si} style={S.card}>
                <div style={S.secHd(wColor)}>{sec.title.toUpperCase()}</div>
                {groups.map((g,gi)=>{
                  if(g.type==="single"){
                    const ex=g.exercises[0];
                    return<ExRow key={gi} originalEx={ex} isAdded={ex._idx>=sec.exercises.length} si={si}/>;
                  }
                  return(
                    <div key={gi} style={{borderBottom:"1px solid #0f0f0f"}}>
                      <div style={{padding:"6px 16px",background:"#0a1a0a",display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{flex:1,height:"1px",background:"#1a3a1a"}}/>
                        <span style={{fontSize:"9px",color:"#27ae60",fontWeight:800,letterSpacing:"2px"}}>SUPERSET</span>
                        <div style={{flex:1,height:"1px",background:"#1a3a1a"}}/>
                      </div>
                      {g.exercises.map((ex,ei)=>(
                        <div key={ei} style={{borderLeft:"3px solid #27ae60"}}>
                          <ExRow originalEx={ex} isAdded={ex._idx>=sec.exercises.length} si={si}/>
                        </div>
                      ))}
                      <div style={{padding:"5px 16px",background:"#0a1a0a"}}>
                        <div style={{fontSize:"9px",color:"#1a4a1a",letterSpacing:"1px"}}>↑ DO BACK TO BACK — REST AFTER LAST EXERCISE</div>
                      </div>
                    </div>
                  );
                })}
                <button onClick={()=>setAddExModal({sectionIdx:si,fromBuilder:false})}
                  style={{width:"100%",padding:"11px",background:"transparent",border:"none",borderTop:"1px solid #0f0f0f",color:"#2a4a2a",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                  + ADD EXERCISE
                </button>
              </div>
            );
          })}

          <div style={{padding:"20px 16px 8px"}}>
            <button style={S.btn(wColor,false)} onClick={finishSession}>FINISH SESSION →</button>
            <button style={{...S.btn("#1a1a1a",true),marginTop:"8px",fontSize:"12px",color:"#333",border:"1px solid #1a1a1a"}} onClick={abandonSession}>ABANDON</button>
          </div>
        </div>
      </div>
    );
  }

  // ── BUILDER SCREEN ────────────────────────────────────────────────────────
  if(builder){
    const bw=builder.workout;
    // Builder-specific exercise editor (local state is fine here — no timer re-renders)
    function BuilderExModal(){
      if(!builderEx)return null;
      const{si,ei,ex}=builderEx;const isEdit=ei!==undefined;
      const[n,setN]=useState(ex?.name||"");const[s,setS]=useState(String(ex?.sets||3));
      const[t,setT]=useState(ex?.target||"10 reps");const[r,setR]=useState(String(ex?.rest||90));
      const[nt,setNt]=useState(ex?.note||"");
      function submit(){if(!n.trim())return;const nx={name:n.trim(),sets:parseInt(s)||3,target:t,rest:parseInt(r)||90,note:nt};if(isEdit)builderUpdateEx(si,ei,nx);else builderAddEx(si,nx);}
      return(
        <div style={{...S.overlay,zIndex:110}}>
          <div style={{...S.sheet,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
              <div style={{fontSize:"16px",fontWeight:800,color:"#ddd"}}>{isEdit?"EDIT":"ADD"} EXERCISE</div>
              <button onClick={()=>setBuilderEx(null)} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
            </div>
            {[{l:"EXERCISE NAME",v:n,fn:setN,ph:"e.g. Walking Lunges"},{l:"TARGET",v:t,fn:setT,ph:"10 reps"}].map(f=>(
              <div key={f.l} style={{marginBottom:"10px"}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>{f.l}</div><input style={S.textInp} value={f.v} onChange={e=>f.fn(e.target.value)} placeholder={f.ph}/></div>
            ))}
            <div style={{display:"flex",gap:"10px",marginBottom:"10px"}}>
              <div style={{flex:1}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>SETS</div><input style={{...S.inp,fontSize:"18px",padding:"10px"}} type="number" inputMode="numeric" value={s} onChange={e=>setS(e.target.value)}/></div>
              <div style={{flex:1}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>REST (sec)</div><input style={{...S.inp,fontSize:"18px",padding:"10px"}} type="number" inputMode="numeric" value={r} onChange={e=>setR(e.target.value)}/></div>
            </div>
            <div style={{marginBottom:"12px"}}><div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>NOTE (optional)</div><textarea value={nt} onChange={e=>setNt(e.target.value)} placeholder="Form cues..." style={{...S.textInp,minHeight:"70px",resize:"none",lineHeight:1.5}}/></div>
            <div style={{display:"flex",gap:"8px"}}>
              <button style={{...S.btn("#e8a838",false),flex:2,padding:"12px"}} onClick={submit}>{isEdit?"UPDATE":"ADD EXERCISE"}</button>
              {isEdit&&<button style={{...S.btn("#c0392b",true),flex:1,padding:"12px"}} onClick={()=>{builderDeleteEx(si,ei);setBuilderEx(null);}}>DELETE</button>}
            </div>
          </div>
        </div>
      );
    }
    return(
      <div style={S.app}>
        <BuilderExModal/>
        <AddExModal addExModal={addExModal} onAdd={(ex)=>{builderAddEx(addExModal?.sectionIdx,ex);}} onClose={()=>setAddExModal(null)}/>
        <SwapModal swapModal={swapModal} swapTab={swapTab} setSwapTab={setSwapTab} swapSearch={swapSearch} setSwapSearch={setSwapSearch} session={null} onApply={applySwap} onRevert={()=>{}} onClose={()=>setSwapModal(null)}/>

        <div style={{padding:"calc(env(safe-area-inset-top,0px) + 14px) 20px 12px",background:"#0a0a0a",borderBottom:"1px solid #1a1a1a",flexShrink:0,display:"flex",gap:"10px",alignItems:"center"}}>
          <button onClick={()=>setBuilder(null)} style={{background:"none",border:"none",color:"#555",fontSize:"26px",cursor:"pointer",lineHeight:1}}>‹</button>
          <div style={{flex:1,fontSize:"18px",fontWeight:900}}>{builder.mode==="new"?"NEW WORKOUT":builder.mode==="preset"?"EDIT PRESET":"EDIT WORKOUT"}</div>
          <div style={{display:"flex",gap:"6px"}}>
            {builder.mode==="preset"&&presetOverrides[builder.presetDayId]&&(
              <button onClick={()=>{resetPresetWorkout(builder.presetDayId);setBuilder(null);}} style={{padding:"9px 14px",background:"#1a0a0a",border:"1px solid #c0392b40",borderRadius:"8px",color:"#c0392b",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>RESET</button>
            )}
            <button onClick={saveBuilderWorkout} style={{padding:"9px 16px",background:"#e8a838",border:"none",borderRadius:"8px",color:"#000",fontSize:"13px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>SAVE</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",paddingBottom:"24px"}}>
          <div style={{padding:"14px 16px 0"}}>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"6px"}}>WORKOUT NAME</div>
            <input style={S.textInp} value={bw.name} onChange={e=>builderMutate(w=>{w.name=e.target.value;return w;})} placeholder="e.g. Upper Body Finisher"/>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",margin:"10px 0 6px"}}>SUBTITLE (optional)</div>
            <input style={S.textInp} value={bw.subtitle||""} onChange={e=>builderMutate(w=>{w.subtitle=e.target.value;return w;})} placeholder="Pump day, accessory work"/>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",margin:"10px 0 6px"}}>COLOR</div>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
              {DAY_COLORS.map(c=>(
                <div key={c} onClick={()=>builderMutate(w=>{w.color=c;return w;})}
                  style={{width:"32px",height:"32px",borderRadius:"50%",background:c,border:bw.color===c?"3px solid #fff":"2px solid transparent",cursor:"pointer"}}/>
              ))}
            </div>
          </div>
          {bw.sections.map((sec,si)=>(
            <div key={si} style={S.card}>
              <div style={{padding:"9px 16px",background:`${bw.color}15`,borderBottom:"1px solid #1e1e1e",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <input value={sec.title} onChange={e=>builderMutate(w=>{w.sections[si].title=e.target.value;return w;})}
                  style={{background:"none",border:"none",color:bw.color,fontSize:"10px",fontWeight:800,letterSpacing:"2px",outline:"none",fontFamily:"'Barlow Condensed',sans-serif",flex:1}}/>
                {bw.sections.length>1&&<button onClick={()=>builderDeleteSection(si)} style={{background:"none",border:"none",color:"#c0392b",fontSize:"14px",cursor:"pointer"}}>✕</button>}
              </div>
              {sec.exercises.map((ex,ei)=>{
                const exKey=ex.id||ex.name;const inSS=!!ex.superset;
                return(
                  <div key={ei} style={{padding:"11px 16px",borderBottom:"1px solid #0f0f0f",borderLeft:inSS?"3px solid #27ae60":"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                          <div style={{fontSize:"13px",fontWeight:700,color:"#ccc"}}>{ex.name}</div>
                          {inSS&&<span style={S.tag("#0a1a0a","#27ae60")}>SS</span>}
                        </div>
                        <div style={{fontSize:"10px",color:"#333",marginTop:"2px"}}>{ex.sets} sets · {ex.target} · {fmtDur(ex.rest||90)} rest</div>
                      </div>
                      <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                        {ei>0&&<button onClick={()=>builderToggleSuperset(si,ei)} style={{background:inSS?"#0a1a0a":"#1a1a1a",border:`1px solid ${inSS?"#27ae60":"#252525"}`,borderRadius:"6px",color:inSS?"#27ae60":"#444",fontSize:"9px",fontWeight:700,padding:"4px 7px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>SS</button>}
                        <button onClick={()=>setSwapModal({originalKey:exKey,originalEx:ex,fromBuilder:true})} style={{background:"#1a1a1a",border:"1px solid #252525",borderRadius:"6px",color:"#444",fontSize:"9px",fontWeight:700,padding:"4px 7px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>⇄</button>
                        <button onClick={()=>setBuilderEx({si,ei,ex})} style={{background:"#1a1a1a",border:"1px solid #252525",borderRadius:"6px",color:"#666",fontSize:"12px",cursor:"pointer",padding:"4px 8px"}}>✏</button>
                        <button onClick={()=>builderDeleteEx(si,ei)} style={{background:"none",border:"none",color:"#c0392b",fontSize:"14px",cursor:"pointer",padding:"4px"}}>✕</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={()=>setAddExModal({sectionIdx:si,fromBuilder:true})}
                style={{width:"100%",padding:"11px",background:"transparent",border:"none",borderTop:"1px solid #0f0f0f",color:`${bw.color}99`,fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                + ADD EXERCISE
              </button>
            </div>
          ))}
          <div style={{padding:"12px 16px 0"}}>
            <button onClick={builderAddSection} style={{...S.btn("#2a2a2a",true),fontSize:"12px",color:"#555",border:"1px solid #252525"}}>+ ADD SECTION</button>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTH MODALS ────────────────────────────────────────────────────────────
  // ── MAIN SCREENS ───────────────────────────────────────────────────────────
  return(
    <div style={S.app}>
      <AuthModal showAuth={showAuth} authMode={authMode} setAuthMode={setAuthMode} authName={authName} setAuthName={setAuthName} authEmail={authEmail} setAuthEmail={setAuthEmail} authPwd={authPwd} setAuthPwd={setAuthPwd} authErr={authErr} authLoading={authLoading} onAuth={handleAuth} onClose={()=>setShowAuth(false)}/>
      <ProfileModal showProfile={showProfile} user={user} syncing={syncing} migratePrompt={migratePrompt} onSync={syncCloud} onMigrate={async()=>{setSyncing(true);await syncCloud();setMigratePrompt(false);setSyncing(false);}} onSignOut={handleSignOut} onClose={()=>setShowProfile(false)}/>
      <NoteEditorModal noteEditor={noteEditor} noteVal={noteVal} setNoteVal={setNoteVal} onSave={(v)=>saveNote(noteEditor.exName,v)} onClear={()=>saveNote(noteEditor.exName,"")} onClose={()=>setNoteEditor(null)}/>
      <SwapModal swapModal={swapModal} swapTab={swapTab} setSwapTab={setSwapTab} swapSearch={swapSearch} setSwapSearch={setSwapSearch} session={session} onApply={applySwap} onRevert={revertSwap} onClose={()=>setSwapModal(null)}/>
      <PREditorModal prEditor={prEditor} prs={prs} phase={phase} onSave={savePR} onClose={()=>setPrEditor(null)}/>

      {/* Header */}
      <div style={{padding:"calc(env(safe-area-inset-top,0px) + 12px) 20px 10px",background:"#0a0a0a",borderBottom:"1px solid #1a1a1a",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"9px",letterSpacing:"4px",color:"#e8a838",fontWeight:700}}>ROGER'S</div>
            <div style={{fontSize:"24px",fontWeight:900,lineHeight:1}}>SUMMER GRIND</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            {syncing&&<div style={{fontSize:"9px",color:"#2a4a2a",letterSpacing:"1px"}}>SYNCING</div>}
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"2px"}}>PHASE · WEEK</div>
              <div style={{fontSize:"26px",fontWeight:900,color:PHASE_COLORS[phase],lineHeight:1}}>{phase} · {week}</div>
            </div>
            <button onClick={()=>user?setShowProfile(true):setShowAuth(true)}
              style={{width:"36px",height:"36px",borderRadius:"50%",background:user?"#1a2a1a":"#1a1a1a",border:`1px solid ${user?"#27ae60":"#252525"}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:user?"#27ae60":"#444",fontSize:"14px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>
              {user?"✓":"IN"}
            </button>
          </div>
        </div>
        {LS.get("grind_active_session")&&tab!=="session"&&(
          <div onClick={()=>{const sv=LS.get("grind_active_session");if(sv){const e=sv.elapsed||0;setSession(sv.session);setElapsed(e);sessionStartRef.current=sv.startedAt||(Date.now()-e*1000);setActiveDay(sv.session.dayId);setTab("session");}}}
            style={{marginTop:"8px",padding:"9px 12px",background:"#1a1200",border:"1px solid #e8a83840",borderRadius:"8px",cursor:"pointer"}}>
            <div style={{fontSize:"11px",color:"#e8a838",fontWeight:700}}>SESSION IN PROGRESS — RESUME →</div>
          </div>
        )}
      </div>

      <div style={S.body}>

        {/* ── TODAY ── */}
        {tab==="today"&&(()=>{
          const w=getWorkout(todayId);
          const logged=history.find(h=>h.date===today());
          const isRest=w.color==="#2c3e50";
          return(
            <>
              <div style={{padding:"14px 16px 0"}}>
                <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"8px"}}>TODAY</div>
                <div style={{background:w.color,borderRadius:"14px",padding:"20px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",right:"-30px",top:"-30px",width:"120px",height:"120px",borderRadius:"50%",background:"rgba(0,0,0,0.08)"}}/>
                  <div style={{fontSize:"10px",fontWeight:800,color:isRest?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.4)",letterSpacing:"2px"}}>{w.label.toUpperCase()}</div>
                  <div style={{fontSize:"32px",fontWeight:900,color:isRest?"#f0f0f0":"#000",lineHeight:1,marginTop:"2px"}}>{w.name.toUpperCase()}</div>
                  <div style={{fontSize:"13px",color:isRest?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.5)",marginTop:"4px"}}>{w.subtitle}</div>
                  {logged?(
                    <div style={{marginTop:"14px",padding:"10px 14px",background:"rgba(0,0,0,0.12)",borderRadius:"8px"}}>
                      <div style={{fontSize:"12px",color:isRest?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.6)",fontWeight:700}}>✓ COMPLETED · {fmtDur(logged.duration||0)}</div>
                    </div>
                  ):!isRest&&(
                    <button onClick={()=>startSession(todayId)} style={{marginTop:"14px",width:"100%",padding:"13px",background:"rgba(0,0,0,0.88)",color:w.color,border:"none",borderRadius:"10px",fontSize:"14px",fontWeight:900,cursor:"pointer",letterSpacing:"1px",fontFamily:"'Barlow Condensed',sans-serif"}}>
                      START SESSION →
                    </button>
                  )}
                </div>
              </div>
              <div style={{padding:"14px 16px 0"}}>
                <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"8px"}}>PROGRAM PROGRESS</div>
                {/* Auto week/phase display */}
                <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
                  <div style={{flex:1,padding:"14px",background:"#111",border:`1px solid ${PHASE_COLORS[phase]}30`,borderRadius:"10px",textAlign:"center"}}>
                    <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginBottom:"2px"}}>WEEK</div>
                    <div style={{fontSize:"32px",fontWeight:900,color:PHASE_COLORS[phase],lineHeight:1}}>{week}</div>
                    <div style={{fontSize:"9px",color:"#2a2a2a",marginTop:"2px"}}>of 12</div>
                  </div>
                  <div style={{flex:1,padding:"14px",background:"#111",border:`1px solid ${PHASE_COLORS[phase]}30`,borderRadius:"10px",textAlign:"center"}}>
                    <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginBottom:"2px"}}>PHASE</div>
                    <div style={{fontSize:"32px",fontWeight:900,color:PHASE_COLORS[phase],lineHeight:1}}>{phase}</div>
                    <div style={{fontSize:"9px",color:"#2a2a2a",marginTop:"2px"}}>{PHASE_INFO[phase].weeks}</div>
                  </div>
                  <div style={{flex:2,padding:"14px",background:"#111",border:`1px solid ${PHASE_COLORS[phase]}30`,borderRadius:"10px"}}>
                    <div style={{fontSize:"9px",color:"#333",letterSpacing:"2px",marginBottom:"3px"}}>INTENSITY</div>
                    <div style={{fontSize:"13px",fontWeight:700,color:PHASE_COLORS[phase],lineHeight:1.2}}>{PHASE_INFO[phase].name}</div>
                    <div style={{fontSize:"9px",color:"#2a2a2a",marginTop:"3px",lineHeight:1.4}}>{PHASE_PCT[phase].map(p=>Math.round(p*100)).join('–')}% 1RM</div>
                    <div style={{fontSize:"8px",color:"#1a1a1a",marginTop:"2px"}}>Tempo: {TEMPO[phase]}</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{padding:"10px 14px",background:"#111",border:"1px solid #1e1e1e",borderRadius:"10px",marginBottom:"6px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                    <span style={{fontSize:"9px",color:"#333",letterSpacing:"1px"}}>12-WEEK PROGRESS</span>
                    <span style={{fontSize:"9px",color:"#333"}}>{Math.round((week-1)/12*100)}%</span>
                  </div>
                  <div style={{height:"4px",background:"#1a1a1a",borderRadius:"2px",overflow:"hidden"}}>
                    <div style={{height:"4px",background:PHASE_COLORS[phase],width:`${Math.round((week-1)/12*100)}%`,borderRadius:"2px",transition:"width 0.4s"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:"5px"}}>
                    {[1,3,7].map((startWk,i)=>(
                      <span key={i} style={{fontSize:"8px",color:week>=startWk?"#3a3a3a":"#1e1e1e"}}>
                        {["Ph1","Ph2","Ph3"][i]}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Manual override — only show if no start date set */}
                {!planStartDate&&(
                  <div style={{display:"flex",gap:"8px"}}>
                    <button onClick={()=>{
                      const sd=today();
                      setPlanStartDate(sd);
                      const w=calcWeekFromStart(sd);
                      const p=calcPhaseFromWeek(w);
                      setWeek(w);setPhase(p);
                      LS.set("grind_settings",{planStartDate:sd,phase:p,week:w});
                    }} style={{flex:2,padding:"10px",background:"#1a1200",border:"1px solid #e8a83830",borderRadius:"8px",color:"#e8a838",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                      START TODAY →
                    </button>
                    <button onClick={()=>setShowDatePicker(true)}
                      style={{flex:1,padding:"10px",background:"#111",border:"1px solid #252525",borderRadius:"8px",color:"#555",fontSize:"11px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                      SET DATE
                    </button>
                  </div>
                )}
                {planStartDate&&(
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0"}}>
                    <span style={{fontSize:"9px",color:"#1e1e1e"}}>Started {planStartDate}</span>
                    <button onClick={()=>setShowDatePicker(true)}
                      style={{background:"none",border:"none",color:"#444",fontSize:"10px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}}>
                      CHANGE DATE
                    </button>
                  </div>
                )}
                {/* Date picker modal */}
                {showDatePicker&&(
                  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
                    <div style={{width:"100%",maxWidth:"430px",background:"#111",borderRadius:"16px 16px 0 0",padding:"20px 20px calc(env(safe-area-inset-bottom,0px) + 24px)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
                        <div>
                          <div style={{fontSize:"18px",fontWeight:900}}>SET START DATE</div>
                          <div style={{fontSize:"12px",color:"#444",marginTop:"3px"}}>When did you begin your 12-week program?</div>
                        </div>
                        <button onClick={()=>setShowDatePicker(false)} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
                      </div>
                      <input type="date" id="startDateInput" defaultValue={planStartDate||today()}
                        style={{width:"100%",padding:"14px",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"10px",color:"#f0f0f0",fontSize:"16px",outline:"none",fontFamily:"'Barlow Condensed',sans-serif",marginBottom:"14px"}}/>
                      <div style={{padding:"10px 14px",background:"#0e1200",border:"1px solid #1a2a00",borderRadius:"8px",marginBottom:"14px",fontSize:"11px",color:"#6a8a20",lineHeight:1.5}}>
                        The app will calculate your current week and phase automatically from this date.
                      </div>
                      <button onClick={()=>{
                        const input=document.getElementById("startDateInput");
                        const sd=input?.value||today();
                        setPlanStartDate(sd);
                        const w=calcWeekFromStart(sd);
                        const p=calcPhaseFromWeek(w);
                        setWeek(w);setPhase(p);
                        LS.set("grind_settings",{planStartDate:sd,phase:p,week:w});
                        setShowDatePicker(false);
                      }} style={{width:"100%",padding:"14px",background:"#e8a838",border:"none",borderRadius:"10px",color:"#000",fontSize:"15px",fontWeight:900,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                        CONFIRM →
                      </button>
                      <button onClick={()=>{
                        if(!window.confirm("Reset start date to today?"))return;
                        const sd=today();
                        setPlanStartDate(sd);
                        const w=calcWeekFromStart(sd);
                        const p=calcPhaseFromWeek(w);
                        setWeek(w);setPhase(p);
                        LS.set("grind_settings",{planStartDate:sd,phase:p,week:w});
                        setShowDatePicker(false);
                      }} style={{width:"100%",marginTop:"8px",padding:"11px",background:"transparent",border:"1px solid #252525",borderRadius:"10px",color:"#444",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                        USE TODAY AS START DATE
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div style={{padding:"14px 16px 0"}}>
                <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"8px"}}>WEEK SCHEDULE</div>
                {DAY_ORDER.map(dayId=>{
                  const dw=getWorkout(dayId);const isToday=dayId===todayId;
                  const logged=history.find(h=>h.dayId===dayId&&h.date===today());
                  const isRest=dw.color==="#2c3e50";
                  return(
                    <div key={dayId} onClick={()=>{if(!isRest){setActiveDay(dayId);setTab("day");}}}
                      style={{display:"flex",alignItems:"center",gap:"12px",padding:"11px 14px",marginBottom:"5px",background:isToday?`${dw.color}12`:"#111",border:`1px solid ${isToday?dw.color+"30":"#1a1a1a"}`,borderRadius:"10px",cursor:isRest?"default":"pointer",opacity:isRest?0.6:1}}>
                      <div style={{width:"42px",height:"42px",borderRadius:"8px",background:isToday&&!isRest?dw.color:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:"10px",fontWeight:900,color:isToday&&!isRest?"#000":"#333"}}>{dw.label.slice(0,3).toUpperCase()}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:"14px",fontWeight:800,color:isToday?dw.color:"#777"}}>{dw.name}</div>
                        <div style={{fontSize:"10px",color:"#2a2a2a"}}>{dw.subtitle}</div>
                      </div>
                      {logged&&<span style={{fontSize:"13px",color:"#27ae60"}}>✓</span>}
                      {isToday&&!logged&&!isRest&&<span style={{fontSize:"9px",color:dw.color,fontWeight:800,letterSpacing:"1px"}}>TODAY</span>}
                      {!isRest&&<span style={{color:"#1e1e1e",fontSize:"16px"}}>›</span>}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* ── DAY DETAIL ── */}
        {tab==="day"&&activeDay&&(()=>{
          const w=getWorkout(activeDay);
          const logged=history.find(h=>h.date===today()&&h.dayId===activeDay);
          const isEdited=!!presetOverrides[activeDay];
          return(
            <>
              <div style={{padding:"14px 16px 0",display:"flex",alignItems:"center",gap:"10px"}}>
                <button onClick={()=>setTab("today")} style={{background:"none",border:"none",color:"#444",fontSize:"26px",cursor:"pointer",lineHeight:1}}>‹</button>
                <div style={{flex:1}}>
                  <div style={{fontSize:"9px",color:w.color,letterSpacing:"3px",fontWeight:700}}>{w.label.toUpperCase()}</div>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <div style={{fontSize:"20px",fontWeight:900}}>{w.name}</div>
                    {isEdited&&<span style={S.tag("#0a1a2a","#4a9eda")}>EDITED</span>}
                  </div>
                </div>
                <button onClick={()=>editPresetWorkout(activeDay)} style={{padding:"8px 14px",background:"#1a1a1a",border:"1px solid #252525",borderRadius:"8px",color:"#888",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>EDIT</button>
              </div>
              <div style={{padding:"10px 16px 0"}}>
                {logged?(
                  <div style={{padding:"12px 16px",background:"#0c130c",border:"1px solid #1a2e1a",borderRadius:"10px",display:"flex",justifyContent:"space-between"}}>
                    <div style={{fontSize:"13px",color:"#27ae60",fontWeight:700}}>✓ SESSION COMPLETE</div>
                    <div style={{fontSize:"11px",color:"#2a4a2a"}}>{fmtDur(logged.duration||0)}</div>
                  </div>
                ):(
                  <button style={S.btn(w.color,false)} onClick={()=>startSession(activeDay)}>START SESSION →</button>
                )}
              </div>
              {w.sections.map((sec,si)=>(
                <div key={si} style={S.card}>
                  <div style={S.secHd(w.color)}>{sec.title.toUpperCase()}</div>
                  {sec.exercises.map((ex,ei)=>{
                    const last=getLastLog(ex.id||ex.name);
                    const hasNote=!!notes[ex.id||ex.name];
                    const sg=getSuggestedWeight(ex.name);
                    return(
                      <div key={ei} style={{padding:"12px 16px",borderBottom:"1px solid #0f0f0f"}}>
                        <div style={{display:"flex",justifyContent:"space-between",gap:"8px"}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:"14px",fontWeight:700,color:"#bbb"}}>{ex.name}</div>
                            <div style={{fontSize:"10px",color:"#2a2a2a",marginTop:"2px"}}>{ex.target} · {ex.sets} sets</div>
                            {ex.note&&<div style={{fontSize:"9px",color:"#222",fontStyle:"italic",marginTop:"2px",lineHeight:1.4}}>{ex.note}</div>}
                            {last&&<div style={{fontSize:"9px",color:`${w.color}70`,marginTop:"3px"}}>Last: {last.weight} lbs × {last.reps} reps</div>}
                            {sg&&<div style={{marginTop:"4px",padding:"3px 7px",background:"#0e1200",border:"1px solid #1a2a00",borderRadius:"5px",display:"inline-flex",gap:"6px",alignItems:"center"}}>
                              <span style={{fontSize:"9px",color:"#6a8a20",fontWeight:700}}>PH{phase}</span>
                              <span style={{fontSize:"11px",color:"#8aaa30",fontWeight:800}}>{sg.lo}–{sg.hi} lbs</span>
                            </div>}
                            {hasNote&&<div style={{marginTop:"5px",padding:"4px 8px",background:"#0e1a0e",border:"1px solid #1a3a1a",borderRadius:"5px",fontSize:"9px",color:"#3a6a3a"}}>{notes[ex.id||ex.name]}</div>}
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:"4px",alignItems:"flex-end"}}>
                            <span style={S.tag("#1a1a1a","#2a2a2a")}>{ex.sets}×</span>
                            <button onClick={()=>setPrEditor(ex.name)} style={{background:"#111",border:"1px solid #1a2a00",borderRadius:"6px",color:"#4a6a10",fontSize:"9px",fontWeight:700,padding:"3px 7px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>PR</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div style={{height:"20px"}}/>
            </>
          );
        })()}

        {/* ── HISTORY ── */}
        {tab==="history"&&(
          <div style={{padding:"14px 16px 0"}}>
            <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"12px"}}>SESSION HISTORY</div>
            {history.length===0?(
              <div style={{textAlign:"center",padding:"60px 0",color:"#222"}}>
                <div style={{fontSize:"44px",marginBottom:"10px"}}>○</div>
                <div style={{fontSize:"15px",fontWeight:700}}>NO SESSIONS YET</div>
              </div>
            ):history.map((h,i)=>{
              const w=h.isCustom?customWorkouts.find(cw=>cw.id===h.customId):getWorkout(h.dayId);
              if(!w)return null;
              const allSets=Object.values(h.sets||{}).flat();
              const done=allSets.filter(s=>s.done&&s.weight&&!isNaN(Number(s.weight))).length;
              const maxWt=allSets.filter(s=>s.weight&&!isNaN(Number(s.weight))).reduce((m,s)=>Math.max(m,Number(s.weight)),0);
              const wc=w.color||"#e8a838";
              return(
                <div key={i} style={{...S.card,marginBottom:"6px"}}>
                  <div style={{padding:"13px 16px",display:"flex",gap:"12px",alignItems:"center"}}>
                    <div style={{width:"46px",height:"46px",borderRadius:"10px",background:`${wc}15`,border:`1px solid ${wc}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <div style={{fontSize:"10px",color:wc,fontWeight:800}}>{h.date?.slice(5,7)}/{h.date?.slice(8,10)}</div>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:"14px",fontWeight:800,color:"#bbb"}}>{w.name}</div>
                      <div style={{fontSize:"10px",color:"#2a2a2a"}}>Phase {h.phase||1} · {fmtDur(h.duration||0)}</div>
                      <div style={{display:"flex",gap:"6px",marginTop:"5px",flexWrap:"wrap"}}>
                        {done>0&&<span style={S.tag("#112211","#27ae60")}>{done} SETS</span>}
                        {maxWt>0&&<span style={S.tag("#111822","#4a9eda")}>MAX {maxWt}lbs</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── BUILD ── */}
        {tab==="build"&&(
          <div style={{padding:"14px 16px 0"}}>
            {/* Mobility */}
            <div style={{...S.card,marginBottom:"16px",border:"1px solid #16a08540"}}>
              <div style={{padding:"14px 16px",display:"flex",gap:"12px",alignItems:"center"}}>
                <div style={{width:"46px",height:"46px",borderRadius:"10px",background:"#16a08520",border:"1px solid #16a08530",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"20px"}}>🧘</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"15px",fontWeight:800,color:"#16a085"}}>Mobility + Recovery</div>
                  <div style={{fontSize:"10px",color:"#2a2a2a"}}>Daily movement quality — anytime</div>
                </div>
                <button onClick={()=>startSession("mobility_static",MOBILITY_SESSION)} style={{padding:"8px 12px",background:"#16a085",border:"none",borderRadius:"8px",color:"#000",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",flexShrink:0}}>START</button>
              </div>
            </div>

            {/* Preset workouts */}
            <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"10px"}}>PRESET WORKOUTS</div>
            {DAY_ORDER.map(dayId=>{
              const w=getWorkout(dayId);const isEdited=!!presetOverrides[dayId];
              return(
                <div key={dayId} style={{...S.card,marginBottom:"8px"}}>
                  <div style={{padding:"13px 16px",display:"flex",gap:"12px",alignItems:"center"}}>
                    <div style={{width:"46px",height:"46px",borderRadius:"10px",background:`${w.color}20`,border:`1px solid ${w.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:"10px",fontWeight:900,color:w.color}}>{w.label.slice(0,3).toUpperCase()}</span>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                        <div style={{fontSize:"15px",fontWeight:800,color:"#ccc"}}>{w.name}</div>
                        {isEdited&&<span style={S.tag("#0a1a2a","#4a9eda")}>EDITED</span>}
                      </div>
                      <div style={{fontSize:"10px",color:"#2a2a2a"}}>{w.subtitle}</div>
                      <div style={{fontSize:"10px",color:"#333",marginTop:"2px"}}>{w.sections.reduce((t,s)=>t+s.exercises.length,0)} exercises</div>
                    </div>
                    <div style={{display:"flex",gap:"6px",flexShrink:0}}>
                      <button onClick={()=>startSession(dayId)} style={{padding:"8px 12px",background:w.color,border:"none",borderRadius:"8px",color:"#000",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>START</button>
                      <button onClick={()=>editPresetWorkout(dayId)} style={{padding:"8px 12px",background:"#1a1a1a",border:"1px solid #252525",borderRadius:"8px",color:"#666",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>EDIT</button>
                      {isEdited&&<button onClick={()=>resetPresetWorkout(dayId)} style={{padding:"8px 10px",background:"#1a0a0a",border:"1px solid #c0392b30",borderRadius:"8px",color:"#c0392b",fontSize:"11px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800}}>↩</button>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Custom workouts */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px",marginBottom:"10px"}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px"}}>CUSTOM WORKOUTS</div>
              <button onClick={newCustomWorkout} style={{padding:"8px 14px",background:"#e8a838",border:"none",borderRadius:"8px",color:"#000",fontSize:"12px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>+ NEW</button>
            </div>
            {customWorkouts.length===0?(
              <div style={{textAlign:"center",padding:"24px 0",color:"#2a2a2a"}}>
                <div style={{fontSize:"13px",fontWeight:700,marginBottom:"6px"}}>NO CUSTOM WORKOUTS YET</div>
                <div style={{fontSize:"11px",color:"#222"}}>Tap + NEW to build your first one</div>
              </div>
            ):customWorkouts.map(cw=>(
              <div key={cw.id} style={{...S.card,marginBottom:"8px"}}>
                <div style={{padding:"13px 16px",display:"flex",gap:"12px",alignItems:"center"}}>
                  <div style={{width:"46px",height:"46px",borderRadius:"10px",background:`${cw.color}20`,border:`1px solid ${cw.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <div style={{width:"16px",height:"16px",borderRadius:"50%",background:cw.color}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"15px",fontWeight:800,color:"#ccc"}}>{cw.name}</div>
                    {cw.subtitle&&<div style={{fontSize:"10px",color:"#2a2a2a"}}>{cw.subtitle}</div>}
                    <div style={{fontSize:"10px",color:"#333",marginTop:"2px"}}>{cw.sections.reduce((t,s)=>t+s.exercises.length,0)} exercises</div>
                  </div>
                  <div style={{display:"flex",gap:"6px"}}>
                    <button onClick={()=>startSession(null,cw)} style={{padding:"8px 12px",background:cw.color,border:"none",borderRadius:"8px",color:"#000",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>START</button>
                    <button onClick={()=>editCustomWorkout(cw)} style={{padding:"8px 12px",background:"#1a1a1a",border:"1px solid #252525",borderRadius:"8px",color:"#666",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>EDIT</button>
                    <button onClick={()=>deleteCustomWorkout(cw.id)} style={{padding:"8px 10px",background:"#1a0a0a",border:"1px solid #c0392b30",borderRadius:"8px",color:"#c0392b",fontSize:"13px",cursor:"pointer"}}>✕</button>
                  </div>
                </div>
              </div>
            ))}

            {/* PRs */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px",marginBottom:"10px"}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px"}}>PERSONAL RECORDS</div>
              <button onClick={()=>setPrGroupModal(true)} style={{padding:"7px 12px",background:"#1a1a1a",border:"1px solid #252525",borderRadius:"7px",color:"#555",fontSize:"10px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>+ ADD LIFT</button>
            </div>
            <div style={{fontSize:"9px",color:"#1a1a1a",marginBottom:"10px"}}>Tracks your best across all implements — barbell, dumbbell, trap bar. Phase {phase} targets shown.</div>
            {getActivePRGroups().map(group=>{
              const pr=getGroupPR(group);
              const [lo,hi]=PHASE_PCT[phase];
              return(
                <div key={group.id} style={{...S.card,marginBottom:"8px"}}>
                  <div style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:pr?"8px":"0"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:"14px",fontWeight:800,color:"#ccc"}}>{group.label}</div>
                        {pr?(
                          <div style={{marginTop:"3px"}}>
                            <div style={{fontSize:"10px",color:"#3a3a3a"}}>{pr.implement&&pr.implement!==group.label?<span style={{color:"#555"}}>{pr.implement} · </span>:null}{pr.weight} lbs × {pr.reps} reps → <span style={{color:"#e8a838",fontWeight:700}}>{pr.estimated1rm} lb 1RM</span></div>
                            <div style={{fontSize:"10px",color:"#2a4a10",marginTop:"1px"}}>Ph{phase}: {calcWt(pr.estimated1rm,lo*100)}–{calcWt(pr.estimated1rm,hi*100)} lbs ({Math.round(lo*100)}–{Math.round(hi*100)}%)</div>
                          </div>
                        ):(
                          <div style={{fontSize:"10px",color:"#2a2a2a",marginTop:"2px"}}>No PR logged — will auto-track from sessions</div>
                        )}
                      </div>
                      <div style={{display:"flex",gap:"6px",flexShrink:0}}>
                        <button onClick={()=>setPrEditor(pr?.implement||group.variants?.[0]||group.label)}
                          style={{padding:"8px 12px",background:pr?"#0e1200":"#1a1a1a",border:`1px solid ${pr?"#1a2a00":"#252525"}`,borderRadius:"8px",color:pr?"#6a8a20":"#555",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                          {pr?"UPDATE":"LOG PR"}
                        </button>
                        <button onClick={()=>group.custom?removeCustomPRGroup(group.id):removeDefaultPRGroup(group.id)}
                          style={{padding:"8px 10px",background:"#1a0a0a",border:"1px solid #c0392b20",borderRadius:"8px",color:"#c0392b",fontSize:"12px",cursor:"pointer"}}>
                          ✕
                        </button>
                      </div>
                    </div>
                    {/* Variant breakdown */}
                    {pr&&group.variants&&(
                      <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginTop:"6px"}}>
                        {group.variants.filter(v=>prs[v]).map(v=>(
                          <span key={v} onClick={()=>setPrEditor(v)}
                            style={{...S.tag(prs[v]?.weight>=pr.weight?"#0e1200":"#1a1a1a",prs[v]?.weight>=pr.weight?"#6a8a20":"#3a3a3a"),cursor:"pointer",padding:"4px 8px"}}>
                            {v.replace("Barbell","BB").replace("Dumbbell","DB").replace("Trap Bar","TB")} {prs[v]?.weight}lbs
                          </span>
                        ))}
                        {/* Add a variant */}
                        {group.variants?.filter(v=>!prs[v]).slice(0,2).map(v=>(
                          <span key={v} onClick={()=>setPrEditor(v)}
                            style={{...S.tag("#111","#2a2a2a"),cursor:"pointer",padding:"4px 8px",border:"1px dashed #2a2a2a"}}>
                            + {v.replace("Barbell","BB").replace("Dumbbell","DB").replace("Trap Bar","TB")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Removed defaults — show restore option */}
            {removedPRGroups.length>0&&(
              <div style={{marginTop:"10px"}}>
                <div style={{fontSize:"9px",color:"#1a1a1a",letterSpacing:"2px",marginBottom:"6px"}}>REMOVED</div>
                {PR_GROUPS.filter(g=>removedPRGroups.includes(g.id)).map(g=>(
                  <div key={g.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#0a0a0a",borderRadius:"8px",marginBottom:"5px"}}>
                    <span style={{fontSize:"12px",color:"#2a2a2a"}}>{g.label}</span>
                    <button onClick={()=>restoreDefaultPRGroup(g.id)} style={{background:"none",border:"none",color:"#27ae60",fontSize:"11px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>RESTORE</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SEARCH ── */}
        {tab==="search"&&(
          <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"14px 16px 0",flexShrink:0}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"10px"}}>EXERCISE SEARCH</div>
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              <Search
                userEquipment={userProfile?.equipment||[]}
                onAddToWorkout={null}
              />
            </div>
          </div>
        )}

        {/* ── PROGRESS ── */}
        {tab==="progress"&&(()=>{
          const KEY_LIFTS=["Flat Barbell Bench Press","Incline Barbell Press","Weighted Pull-Ups","Barbell Bent-Over Row","Overhead Press","Trap Bar Deadlift","Barbell Hip Thrust","Banded Box Squat","Front Squat — Heel Elevated"];
          function getBest(lift){
            const bests=[];
            [...history].reverse().forEach(h=>{
              const key=Object.keys(h.sets||{}).find(k=>k.toLowerCase()===lift.toLowerCase());
              if(key&&h.sets[key]){
                const valid=h.sets[key].filter(s=>s.weight&&!isNaN(Number(s.weight)));
                const best=valid.reduce((m,s)=>Math.max(m,Number(s.weight)),0);
                if(best>0)bests.push({date:h.date,weight:best});
              }
            });
            return bests;
          }
          return(
            <div style={{padding:"14px 16px 0"}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"12px"}}>LIFT PROGRESS</div>
              {KEY_LIFTS.map(lift=>{
                const data=getBest(lift);const pr=prs[lift];
                if(!data.length&&!pr)return null;
                const max=data.length?Math.max(...data.map(d=>d.weight)):0;
                const min=data.length?Math.min(...data.map(d=>d.weight)):0;
                const latest=data.length?data[data.length-1]:null;
                const gained=latest&&data.length>1?latest.weight-data[0].weight:0;
                const [lo,hi]=PHASE_PCT[phase];
                return(
                  <div key={lift} style={{...S.card,marginBottom:"8px"}}>
                    <div style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:"13px",fontWeight:700,color:"#bbb"}}>{lift}</div>
                          <div style={{fontSize:"10px",color:"#2a2a2a"}}>{data.length} sessions logged</div>
                          {pr&&<div style={{fontSize:"10px",color:"#4a6a10",marginTop:"2px"}}>Est. 1RM: {pr.estimated1rm} lbs · Ph{phase}: {calcWt(pr.estimated1rm,lo*100)}–{calcWt(pr.estimated1rm,hi*100)} lbs</div>}
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          {latest&&<div style={{fontSize:"24px",fontWeight:900,color:"#e8a838",lineHeight:1}}>{latest.weight}<span style={{fontSize:"10px",color:"#333"}}> lbs</span></div>}
                          {data.length>1&&gained!==0&&<div style={{fontSize:"10px",color:gained>0?"#27ae60":"#c0392b",fontWeight:700}}>{gained>0?"+":""}{gained} lbs</div>}
                        </div>
                      </div>
                      {data.length>1&&(
                        <div style={{display:"flex",alignItems:"flex-end",gap:"3px",height:"32px"}}>
                          {data.map((d,i)=>{const r=max-min||1,h=Math.max(4,((d.weight-min)/r)*26+6);return<div key={i} style={{flex:1,height:`${h}px`,background:i===data.length-1?"#e8a838":"#1e1e1e",borderRadius:"2px 2px 0 0",minWidth:"4px"}}/>;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {KEY_LIFTS.every(l=>getBest(l).length===0&&!prs[l])&&(
                <div style={{textAlign:"center",padding:"60px 0",color:"#222"}}>
                  <div style={{fontSize:"44px",marginBottom:"10px"}}>↑</div>
                  <div style={{fontSize:"15px",fontWeight:700}}>NO DATA YET</div>
                  <div style={{fontSize:"11px",marginTop:"6px",color:"#1a1a1a"}}>Log PRs in BUILD tab to see phase targets</div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

      <div style={S.nav}>
        {[
          {id:"today",   icon:"◎",label:"TODAY"},
          {id:"day",     icon:"≡",label:"WORKOUT"},
          {id:"search",  icon:"⊘",label:"SEARCH"},
          {id:"build",   icon:"⊕",label:"BUILD"},
          {id:"progress",icon:"↑",label:"GAINS"},
        ].map(t=>(
          <button key={t.id} style={S.navBtn(tab===t.id)} onClick={()=>{if(t.id==="day")setActiveDay(todayId);setTab(t.id);}}>
            <span style={{fontSize:"14px",lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:"7px",fontWeight:800,letterSpacing:"0.5px"}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
