import { useState, useEffect, useRef } from "react";
import { WORKOUTS, PHASE_COLORS, DAY_ORDER, JS_TO_DAY, PHASE_INFO, TEMPO, SWAPS } from "./workouts.js";

function getTodayId() { return JS_TO_DAY[new Date().getDay()]; }
function formatDate(d) { return d.toISOString().split("T")[0]; }
function fmtDur(secs) { const m = Math.floor(secs/60), s = secs%60; return `${m}:${s.toString().padStart(2,"0")}`; }
function today() { return formatDate(new Date()); }

const LS = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

const S = {
  app: { display:"flex", flexDirection:"column", height:"100dvh", maxWidth:"430px", margin:"0 auto", background:"#080808", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif", overflow:"hidden", position:"relative" },
  hdr: { padding:"calc(env(safe-area-inset-top,0px) + 14px) 20px 12px", background:"#0a0a0a", borderBottom:"1px solid #1a1a1a", flexShrink:0 },
  body: { flex:1, overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 62px)", WebkitOverflowScrolling:"touch" },
  nav: { position:"absolute", bottom:0, left:0, right:0, display:"flex", background:"#0a0a0a", borderTop:"1px solid #1a1a1a", height:"calc(env(safe-area-inset-bottom,0px) + 60px)", paddingBottom:"env(safe-area-inset-bottom,0px)" },
  navBtn: (a) => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"3px", background:"none", border:"none", cursor:"pointer", color: a?"#e8a838":"#333", fontFamily:"'Barlow Condensed',sans-serif" }),
  card: { margin:"10px 16px 0", background:"#111", border:"1px solid #1e1e1e", borderRadius:"12px", overflow:"hidden" },
  secHd: (c) => ({ padding:"9px 16px", background:`${c}15`, borderBottom:"1px solid #1e1e1e", fontSize:"10px", fontWeight:800, letterSpacing:"2px", color:c }),
  tag: (bg,c) => ({ fontSize:"9px", fontWeight:700, padding:"3px 7px", borderRadius:"4px", background:bg, color:c, letterSpacing:"1px", flexShrink:0 }),
  btn: (c,o) => ({ padding:"14px", borderRadius:"10px", border: o?`1px solid ${c}`:"none", background: o?"transparent":c, color: o?c:"#000", fontSize:"14px", fontWeight:800, cursor:"pointer", width:"100%", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.5px" }),
  inp: { background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"8px", color:"#fff", fontSize:"24px", fontWeight:700, textAlign:"center", padding:"12px 8px", width:"100%", outline:"none", fontFamily:"'Barlow Condensed',sans-serif" },
  chip: (done, cur, editing) => ({
    width:"42px", height:"42px", borderRadius:"50%",
    border: editing ? "2px solid #e05c2a" : done ? "none" : cur ? "2px solid #e8a838" : "1px solid #252525",
    background: editing ? "#1e0e00" : done ? "#112211" : cur ? "#1e1800" : "#111",
    display:"flex", alignItems:"center", justifyContent:"center",
    cursor:"pointer", flexShrink:0, flexDirection:"column", gap:"1px"
  }),
};

export default function App() {
  const [tab, setTab] = useState("today");
  const [phase, setPhase] = useState(1);
  const [week, setWeek] = useState(1);
  const [activeDay, setActiveDay] = useState(null);
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [setInput, setSetInput] = useState(null); // { exName, idx, isEdit }
  const [wt, setWt] = useState("");
  const [rp, setRp] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState(null);
  // Notes: { [exName]: string } — persisted globally across sessions
  const [notes, setNotes] = useState({});
  // Note editor state
  const [noteEditor, setNoteEditor] = useState(null); // { exName, value }
  // Swap modal state
  const [swapModal, setSwapModal] = useState(null); // { originalName, currentName }
  const sessionTimerRef = useRef(null);
  const restTimerRef = useRef(null);
  const todayId = getTodayId();

  // ── LOAD FROM STORAGE ──────────────────────────────────────────────────
  useEffect(() => {
    const s = LS.get("grind_settings");
    if (s) { setPhase(s.phase||1); setWeek(s.week||1); }
    const h = LS.get("grind_history");
    if (h) setHistory(h);
    const n = LS.get("grind_notes");
    if (n) setNotes(n);
    // Restore in-progress session
    const saved = LS.get("grind_active_session");
    if (saved) {
      setSession(saved.session);
      setElapsed(saved.elapsed||0);
      setActiveDay(saved.session.dayId);
      setTab("session");
    }
  }, []);

  useEffect(() => { LS.set("grind_settings", { phase, week }); }, [phase, week]);

  // Auto-save session state on every change
  useEffect(() => {
    if (session) {
      LS.set("grind_active_session", { session, elapsed });
    }
  }, [session, elapsed]);

  // Session timer
  useEffect(() => {
    if (session) {
      sessionTimerRef.current = setInterval(() => setElapsed(e => e+1), 1000);
    } else {
      clearInterval(sessionTimerRef.current);
    }
    return () => clearInterval(sessionTimerRef.current);
  }, [!!session]);

  // Rest timer
  useEffect(() => {
    if (restTimer && restTimer.remaining > 0) {
      restTimerRef.current = setTimeout(() => {
        setRestTimer(prev => {
          if (!prev) return null;
          if (prev.remaining <= 1) {
            try { navigator.vibrate([200,100,200,100,200]); } catch {}
            return null;
          }
          return { ...prev, remaining: prev.remaining - 1 };
        });
      }, 1000);
    }
    return () => clearTimeout(restTimerRef.current);
  }, [restTimer]);

  function saveHistory(h) { setHistory(h); LS.set("grind_history", h); }
  function saveNotes(n) { setNotes(n); LS.set("grind_notes", n); }

  function startSession(dayId) {
    const w = WORKOUTS[dayId];
    const sets = {};
    w.sections.forEach(sec => sec.exercises.forEach(ex => {
      sets[ex.name] = Array.from({ length: ex.sets }, () => ({ weight:"", reps:"", done:false }));
    }));
    const newSession = { dayId, sets };
    setSession(newSession);
    setActiveDay(dayId);
    setRestTimer(null);
    setTab("session");
  }

  function logSet(exName, idx, weight, reps, isEdit) {
    const w = WORKOUTS[session.dayId];
    let restSecs = 90;
    w.sections.forEach(sec => sec.exercises.forEach(ex => {
      if (ex.name === exName) restSecs = ex.rest || 90;
    }));
    const exSets = session.sets[exName];
    const isLastSet = idx >= exSets.length - 1;

    setSession(prev => {
      const updated = {
        ...prev,
        sets: { ...prev.sets, [exName]: prev.sets[exName].map((s,i) => i===idx ? { weight, reps, done:true } : s) }
      };
      LS.set("grind_active_session", { session: updated, elapsed });
      return updated;
    });
    setSetInput(null); setWt(""); setRp("");
    // Only start rest timer on new logs, not edits
    if (!isEdit && !isLastSet && restSecs > 0) {
      setRestTimer({ remaining: restSecs, total: restSecs, exName, nextSetIdx: idx + 1 });
    }
  }

  function skipSet(exName, idx) {
    setSession(prev => {
      const updated = {
        ...prev,
        sets: { ...prev.sets, [exName]: prev.sets[exName].map((s,i) => i===idx ? { ...s, done:true } : s) }
      };
      LS.set("grind_active_session", { session: updated, elapsed });
      return updated;
    });
    setSetInput(null); setWt(""); setRp(""); setRestTimer(null);
  }

  function openSetInput(exName, idx, isEdit) {
    const set = session.sets[exName]?.[idx];
    if (restTimer && !isEdit) setRestTimer(null);
    setSetInput({ exName, idx, isEdit: !!isEdit });
    setWt(set?.weight || "");
    setRp(set?.reps || "");
  }

  function finishSession() {
    const entry = { date: today(), dayId: session.dayId, sets: session.sets, duration: elapsed, phase };
    const newH = [entry, ...history].slice(0, 120);
    saveHistory(newH);
    LS.del("grind_active_session");
    setSession(null); setActiveDay(null); setRestTimer(null);
    setElapsed(0); setTab("today");
  }

  function abandonSession() {
    if (window.confirm("Abandon session? Progress won't be saved.")) {
      LS.del("grind_active_session");
      setSession(null); setActiveDay(null); setRestTimer(null);
      setElapsed(0); setTab("today");
    }
  }

  function saveNote(exName, value) {
    const updated = { ...notes, [exName]: value };
    saveNotes(updated);
    setNoteEditor(null);
  }

  function applySwap(originalName, newEx) {
    // Re-initialize sets for the new exercise, keep the swap mapping
    setSession(prev => {
      const newSets = { ...prev.sets };
      // Remove old sets (both original and any previous swap)
      const currentName = prev.swaps?.[originalName] || originalName;
      delete newSets[currentName];
      // Add new sets
      newSets[newEx.name] = Array.from({ length: newEx.sets }, () => ({ weight:"", reps:"", done:false }));
      const updated = {
        ...prev,
        sets: newSets,
        swaps: { ...(prev.swaps||{}), [originalName]: newEx.name },
        swapData: { ...(prev.swapData||{}), [originalName]: newEx },
      };
      LS.set("grind_active_session", { session: updated, elapsed });
      return updated;
    });
    setSwapModal(null);
    setSetInput(null);
    setRestTimer(null);
  }

  function revertSwap(originalName) {
    const origEx = (() => {
      let found = null;
      const w = WORKOUTS[session.dayId];
      w.sections.forEach(sec => sec.exercises.forEach(ex => { if (ex.name === originalName) found = ex; }));
      return found;
    })();
    if (!origEx) return;
    setSession(prev => {
      const newSets = { ...prev.sets };
      const currentName = prev.swaps?.[originalName] || originalName;
      delete newSets[currentName];
      newSets[originalName] = Array.from({ length: origEx.sets }, () => ({ weight:"", reps:"", done:false }));
      const newSwaps = { ...(prev.swaps||{}) };
      delete newSwaps[originalName];
      const newSwapData = { ...(prev.swapData||{}) };
      delete newSwapData[originalName];
      const updated = { ...prev, sets: newSets, swaps: newSwaps, swapData: newSwapData };
      LS.set("grind_active_session", { session: updated, elapsed });
      return updated;
    });
    setSwapModal(null);
  }

  // Helper: get the current exercise name and data (accounting for any swap)
  function getEffectiveEx(originalEx) {
    if (!session) return originalEx;
    const swappedName = session.swaps?.[originalEx.name];
    if (!swappedName) return originalEx;
    return session.swapData?.[originalEx.name] || { ...originalEx, name: swappedName };
  }

  function getLastLog(exName) {
    for (const h of history) {
      if (h.sets?.[exName]) {
        const done = h.sets[exName].filter(s => s.done && s.weight && !isNaN(Number(s.weight)));
        if (done.length) return done[done.length-1];
      }
    }
    return null;
  }

  function sessionProg() {
    if (!session) return 0;
    const all = Object.values(session.sets).flat();
    return all.length ? Math.round(all.filter(s=>s.done).length / all.length * 100) : 0;
  }

  function getBestForLift(exName) {
    const bests = [];
    [...history].reverse().forEach(h => {
      if (h.sets?.[exName]) {
        const valid = h.sets[exName].filter(s => s.weight && !isNaN(Number(s.weight)));
        const best = valid.reduce((m,s) => Math.max(m, Number(s.weight)), 0);
        if (best > 0) bests.push({ date: h.date, weight: best });
      }
    });
    return bests;
  }

  // ── NOTE EDITOR MODAL ────────────────────────────────────────────────────
  function NoteEditorModal() {
    if (!noteEditor) return null;
    const [val, setVal] = useState(noteEditor.value);
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div style={{ width:"100%", maxWidth:"430px", background:"#111", borderRadius:"16px 16px 0 0", padding:"20px 16px calc(env(safe-area-inset-bottom,0px) + 20px)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
            <div>
              <div style={{ fontSize:"10px", color:"#555", letterSpacing:"2px" }}>NOTE FOR</div>
              <div style={{ fontSize:"16px", fontWeight:800, color:"#ddd" }}>{noteEditor.exName}</div>
            </div>
            <button onClick={() => setNoteEditor(null)} style={{ background:"none", border:"none", color:"#444", fontSize:"22px", cursor:"pointer" }}>✕</button>
          </div>
          <textarea
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder="Add coaching notes, cues, weight targets, form reminders, how it felt..."
            autoFocus
            style={{ width:"100%", minHeight:"120px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"10px", color:"#ddd", fontSize:"14px", padding:"12px", outline:"none", resize:"none", fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1.5 }}
          />
          <div style={{ display:"flex", gap:"8px", marginTop:"10px" }}>
            <button style={{ ...S.btn("#e8a838",false), flex:2, padding:"12px" }} onClick={() => saveNote(noteEditor.exName, val)}>SAVE NOTE</button>
            {noteEditor.value && (
              <button style={{ ...S.btn("#c0392b",true), flex:1, padding:"12px" }} onClick={() => { saveNote(noteEditor.exName, ""); }}>CLEAR</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── SWAP MODAL ───────────────────────────────────────────────────────────
  function SwapModal() {
    if (!swapModal) return null;
    const { originalName } = swapModal;
    const options = SWAPS[originalName] || [];
    const isSwapped = !!(session?.swaps?.[originalName]);
    const currentSwapName = session?.swaps?.[originalName];
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div style={{ width:"100%", maxWidth:"430px", background:"#111", borderRadius:"16px 16px 0 0", padding:"20px 16px calc(env(safe-area-inset-bottom,0px) + 20px)", maxHeight:"80vh", overflowY:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
            <div>
              <div style={{ fontSize:"10px", color:"#555", letterSpacing:"2px" }}>SWAPPING</div>
              <div style={{ fontSize:"16px", fontWeight:800, color:"#ddd", lineHeight:1.2 }}>{originalName}</div>
              {isSwapped && <div style={{ fontSize:"10px", color:"#e05c2a", marginTop:"3px" }}>Currently: {currentSwapName}</div>}
            </div>
            <button onClick={() => setSwapModal(null)} style={{ background:"none", border:"none", color:"#444", fontSize:"22px", cursor:"pointer" }}>✕</button>
          </div>
          {isSwapped && (
            <button onClick={() => revertSwap(originalName)}
              style={{ width:"100%", padding:"12px", background:"#1a0a00", border:"1px solid #e05c2a40", borderRadius:"10px", color:"#e05c2a", fontSize:"13px", fontWeight:800, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", marginBottom:"10px", letterSpacing:"0.5px" }}>
              ↩ REVERT TO ORIGINAL
            </button>
          )}
          <div style={{ fontSize:"9px", color:"#333", letterSpacing:"2px", marginBottom:"8px" }}>SWAP FOR</div>
          {options.length === 0 ? (
            <div style={{ padding:"20px", textAlign:"center", color:"#333", fontSize:"13px" }}>No swap options defined for this exercise yet.</div>
          ) : options.map((opt, i) => {
            const isActive = currentSwapName === opt.name;
            return (
              <div key={i} onClick={() => applySwap(originalName, opt)}
                style={{ padding:"14px 16px", background: isActive ? "#0e1a0e" : "#161616", border:`1px solid ${isActive ? "#27ae60" : "#222"}`, borderRadius:"10px", marginBottom:"8px", cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
                  <div style={{ fontSize:"14px", fontWeight:800, color: isActive ? "#27ae60" : "#ccc" }}>{opt.name}</div>
                  <div style={{ display:"flex", gap:"6px" }}>
                    <span style={{ fontSize:"9px", padding:"2px 7px", borderRadius:"4px", background:"#1a1a1a", color:"#444" }}>{opt.sets}×</span>
                    <span style={{ fontSize:"9px", padding:"2px 7px", borderRadius:"4px", background:"#1a1a1a", color:"#444" }}>{opt.target}</span>
                  </div>
                </div>
                <div style={{ fontSize:"11px", color:"#3a3a3a", lineHeight:1.4 }}>{opt.note}</div>
                {isActive && <div style={{ fontSize:"9px", color:"#27ae60", fontWeight:800, marginTop:"6px", letterSpacing:"1px" }}>ACTIVE SWAP ✓</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  function RestOverlay() {
    if (!restTimer) return null;
    const pct = restTimer.remaining / restTimer.total;
    const isAlmost = restTimer.remaining <= 10;
    const color = isAlmost ? "#27ae60" : "#e8a838";
    const R = 22, circ = 2 * Math.PI * R;
    return (
      <div style={{ margin:"10px 16px 0" }}>
        <div style={{ background:"#0e0e0e", border:`1px solid ${color}40`, borderLeft:`3px solid ${color}`, borderRadius:"12px", padding:"12px 14px", display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{ position:"relative", flexShrink:0, width:"52px", height:"52px" }}>
            <svg width="52" height="52" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="26" cy="26" r={R} fill="none" stroke="#1a1a1a" strokeWidth="4" />
              <circle cx="26" cy="26" r={R} fill="none" stroke={color} strokeWidth="4"
                strokeDasharray={`${circ} ${circ}`}
                strokeDashoffset={(circ * (1-pct)).toFixed(1)}
                strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.9s linear, stroke 0.3s" }} />
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:"14px", fontWeight:900, color, fontVariantNumeric:"tabular-nums" }}>{restTimer.remaining}</span>
            </div>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:"9px", color:"#444", letterSpacing:"2px" }}>RESTING</div>
            <div style={{ fontSize:"13px", fontWeight:800, color:"#bbb", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{restTimer.exName}</div>
            <div style={{ fontSize:"10px", color:"#333", marginTop:"2px" }}>Set {restTimer.nextSetIdx+1} next · {fmtDur(restTimer.total)} total</div>
          </div>
          <button onClick={() => setRestTimer(null)} style={{ background:"#1a1a1a", border:"1px solid #252525", borderRadius:"8px", color:"#555", fontSize:"10px", fontWeight:700, padding:"8px 10px", cursor:"pointer", flexShrink:0, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"1px" }}>SKIP</button>
        </div>
        {isAlmost && <div style={{ textAlign:"center", padding:"5px 0 0", fontSize:"10px", color:"#27ae60", fontWeight:800, letterSpacing:"2px" }}>GET READY</div>}
      </div>
    );
  }

  // ── SESSION SCREEN ───────────────────────────────────────────────────────
  if (tab === "session" && session) {
    const w = WORKOUTS[session.dayId];
    const prog = sessionProg();
    return (
      <div style={S.app}>
        <NoteEditorModal />
        <SwapModal />
        <div style={{ flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch", paddingBottom:"24px" }}>

          {/* Header */}
          <div style={{ padding:"calc(env(safe-area-inset-top,0px) + 12px) 20px 10px", background:"#0a0a0a", borderBottom:"1px solid #1a1a1a", position:"sticky", top:0, zIndex:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
              <div>
                <div style={{ fontSize:"10px", color:w.color, letterSpacing:"3px", fontWeight:700 }}>{w.label.toUpperCase()}</div>
                <div style={{ fontSize:"20px", fontWeight:900, lineHeight:1 }}>{w.name.toUpperCase()}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:"24px", fontWeight:900, color:"#555", fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{fmtDur(elapsed)}</div>
                <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"2px" }}>ELAPSED</div>
              </div>
            </div>
            <div style={{ height:"3px", background:"#1a1a1a", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{ height:"3px", background:w.color, width:`${prog}%`, transition:"width 0.4s", borderRadius:"2px" }} />
            </div>
            <div style={{ fontSize:"9px", color:"#2a2a2a", marginTop:"3px", letterSpacing:"1px" }}>{prog}% COMPLETE</div>
          </div>

          {/* Rest timer */}
          <RestOverlay />

          {/* Set input panel */}
          {setInput && (
            <div style={{ margin:"10px 16px 0", background:"#161616", border:`1px solid ${setInput.isEdit ? "#e05c2a" : w.color}40`, borderRadius:"12px", padding:"14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2px" }}>
                <div>
                  <div style={{ fontSize:"10px", color: setInput.isEdit ? "#e05c2a" : w.color, fontWeight:800, letterSpacing:"2px" }}>
                    {setInput.isEdit ? "EDITING" : "LOGGING"} SET {setInput.idx+1}
                  </div>
                  <div style={{ fontSize:"12px", color:"#888", marginTop:"1px" }}>{setInput.exName}</div>
                </div>
                <button onClick={() => setNoteEditor({ exName: setInput.exName, value: notes[setInput.exName]||"" })}
                  style={{ background:"#1a1a1a", border:"1px solid #252525", borderRadius:"7px", color:"#555", fontSize:"10px", fontWeight:700, padding:"6px 10px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif" }}>
                  + NOTE
                </button>
              </div>
              {/* Show existing note if any */}
              {notes[setInput.exName] && (
                <div style={{ padding:"7px 10px", background:"#0e1a0e", border:"1px solid #1a3a1a", borderRadius:"7px", marginBottom:"10px", marginTop:"6px" }}>
                  <div style={{ fontSize:"9px", color:"#27ae60", letterSpacing:"2px", marginBottom:"3px" }}>YOUR NOTE</div>
                  <div style={{ fontSize:"12px", color:"#4a8a4a", lineHeight:1.4 }}>{notes[setInput.exName]}</div>
                </div>
              )}
              {/* Last log */}
              {(() => { const l = getLastLog(setInput.exName); return (
                <div style={{ fontSize:"10px", color:"#3a3a3a", marginBottom:"10px" }}>
                  {l ? `Last logged: ${l.weight} lbs × ${l.reps} reps` : "No previous log"}
                </div>
              );})()}
              <div style={{ display:"flex", gap:"10px", marginBottom:"10px" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"9px", color:"#3a3a3a", letterSpacing:"2px", marginBottom:"5px" }}>WEIGHT (lbs)</div>
                  <input style={S.inp} type="number" inputMode="decimal" value={wt} onChange={e=>setWt(e.target.value)} placeholder="135" autoFocus />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"9px", color:"#3a3a3a", letterSpacing:"2px", marginBottom:"5px" }}>REPS</div>
                  <input style={S.inp} type="number" inputMode="numeric" value={rp} onChange={e=>setRp(e.target.value)} placeholder="8" />
                </div>
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <button style={{ ...S.btn(setInput.isEdit ? "#e05c2a" : "#e8a838", false), flex:2, padding:"12px" }}
                  onClick={() => logSet(setInput.exName, setInput.idx, wt||"BW", rp||"—", setInput.isEdit)}>
                  {setInput.isEdit ? "UPDATE ✓" : "LOG ✓"}
                </button>
                {!setInput.isEdit && <button style={{ ...S.btn("#333",true), flex:1, padding:"12px" }} onClick={() => skipSet(setInput.exName, setInput.idx)}>SKIP</button>}
                <button style={{ ...S.btn("#333",true), flex:1, padding:"12px" }} onClick={() => { setSetInput(null); setWt(""); setRp(""); }}>✕</button>
              </div>
            </div>
          )}

          {/* Exercises */}
          {w.sections.map((sec, si) => (
            <div key={si} style={S.card}>
              <div style={S.secHd(w.color)}>{sec.title.toUpperCase()}</div>
              {sec.exercises.map((originalEx, ei) => {
                const ex = getEffectiveEx(originalEx);
                const isSwapped = ex.name !== originalEx.name;
                const exSets = session.sets[ex.name] || [];
                const allDone = exSets.every(s => s.done);
                const hasNote = !!notes[ex.name] || !!notes[originalEx.name];
                const noteText = notes[ex.name] || notes[originalEx.name];
                const hasSwapOptions = !!(SWAPS[originalEx.name]?.length);
                return (
                  <div key={ei} style={{ padding:"13px 16px", borderBottom:"1px solid #0f0f0f", background: allDone ? "#0c130c" : "transparent" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px", marginBottom:"8px" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
                          <div style={{ fontSize:"14px", fontWeight:700, color: allDone ? "#27ae60" : "#ccc", lineHeight:1.2 }}>{ex.name}</div>
                          {isSwapped && <span style={{ fontSize:"9px", padding:"2px 6px", borderRadius:"4px", background:"#1a0800", color:"#e05c2a", fontWeight:700, border:"1px solid #e05c2a30" }}>SWAPPED</span>}
                        </div>
                        {isSwapped && <div style={{ fontSize:"9px", color:"#3a2a1a", marginTop:"1px" }}>Original: {originalEx.name}</div>}
                        <div style={{ fontSize:"10px", color:"#333", marginTop:"2px" }}>{ex.sets} sets · {ex.target}</div>
                        {ex.note ? <div style={{ fontSize:"9px", color:"#272727", marginTop:"2px", fontStyle:"italic", lineHeight:1.4 }}>{ex.note}</div> : null}
                        {ex.rest > 0 && <div style={{ fontSize:"9px", color:"#1e3020", marginTop:"2px" }}>⏱ {fmtDur(ex.rest)} rest</div>}
                        {hasNote && (
                          <div style={{ marginTop:"6px", padding:"5px 8px", background:"#0e1a0e", border:"1px solid #1a3a1a", borderRadius:"6px", display:"flex", alignItems:"flex-start", gap:"6px" }}>
                            <span style={{ fontSize:"9px", color:"#27ae60", fontWeight:700, letterSpacing:"1px", flexShrink:0 }}>NOTE</span>
                            <span style={{ fontSize:"10px", color:"#3a6a3a", lineHeight:1.4 }}>{noteText}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"5px", alignItems:"flex-end" }}>
                        {allDone && <div style={{ fontSize:"16px", color:"#27ae60" }}>✓</div>}
                        <button onClick={() => setNoteEditor({ exName: ex.name, value: notes[ex.name]||"" })}
                          style={{ background: hasNote?"#0e1a0e":"#1a1a1a", border:`1px solid ${hasNote?"#1a3a1a":"#252525"}`, borderRadius:"6px", color: hasNote?"#27ae60":"#333", fontSize:"9px", fontWeight:700, padding:"4px 8px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"1px" }}>
                          {hasNote ? "NOTE ✓" : "+ NOTE"}
                        </button>
                        {hasSwapOptions && (
                          <button onClick={() => setSwapModal({ originalName: originalEx.name, currentName: ex.name })}
                            style={{ background: isSwapped?"#1a0800":"#1a1a1a", border:`1px solid ${isSwapped?"#e05c2a40":"#252525"}`, borderRadius:"6px", color: isSwapped?"#e05c2a":"#444", fontSize:"9px", fontWeight:700, padding:"4px 8px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"1px" }}>
                            ⇄ SWAP
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Set chips */}
                    <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                      {exSets.map((set, si2) => {
                        const isCurr = setInput?.exName===ex.name && setInput?.idx===si2 && !setInput?.isEdit;
                        const isEditing = setInput?.exName===ex.name && setInput?.idx===si2 && setInput?.isEdit;
                        const isRestNext = restTimer?.exName===ex.name && restTimer?.nextSetIdx===si2;
                        return (
                          <div key={si2}
                            onClick={() => {
                              if (set.done) { openSetInput(ex.name, si2, true); }
                              else { openSetInput(ex.name, si2, false); }
                            }}
                            style={{
                              ...S.chip(set.done, isCurr || isRestNext, isEditing),
                              border: isRestNext && !set.done ? "2px solid #27ae60" : S.chip(set.done, isCurr, isEditing).border
                            }}>
                            {set.done ? (
                              <>
                                {set.weight ? <span style={{ fontSize:"9px", fontWeight:800, color: isEditing?"#e05c2a":"#27ae60" }}>{set.weight}</span>
                                  : <span style={{ fontSize:"13px", color:"#27ae60" }}>✓</span>}
                                {set.reps ? <span style={{ fontSize:"8px", color: isEditing?"#6a3010":"#2a5a2a" }}>{set.reps}</span> : null}
                              </>
                            ) : isRestNext ? (
                              <span style={{ fontSize:"9px", fontWeight:800, color:"#27ae60" }}>GO</span>
                            ) : (
                              <span style={{ fontSize:"12px", fontWeight:700, color: isCurr?"#e8a838":"#333" }}>{si2+1}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {allDone && <div style={{ fontSize:"9px", color:"#1e2e1e", marginTop:"6px", letterSpacing:"1px" }}>TAP ANY SET TO EDIT</div>}
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{ padding:"20px 16px 8px" }}>
            <button style={S.btn(w.color,false)} onClick={finishSession}>FINISH SESSION →</button>
            <button style={{ ...S.btn("#1a1a1a",true), marginTop:"8px", fontSize:"12px", color:"#333", border:"1px solid #1a1a1a" }} onClick={abandonSession}>ABANDON</button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN APP ─────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      <NoteEditorModal />
      <SwapModal />

      <div style={S.hdr}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"4px", color:"#e8a838", fontWeight:700 }}>ROGER'S</div>
            <div style={{ fontSize:"24px", fontWeight:900, lineHeight:1 }}>SUMMER GRIND</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"2px" }}>PHASE · WEEK</div>
            <div style={{ fontSize:"26px", fontWeight:900, color:PHASE_COLORS[phase], lineHeight:1 }}>{phase} · {week}</div>
          </div>
        </div>
        {/* Resume banner */}
        {LS.get("grind_active_session") && tab !== "session" && (
          <div onClick={() => {
            const saved = LS.get("grind_active_session");
            if (saved) { setSession(saved.session); setElapsed(saved.elapsed||0); setActiveDay(saved.session.dayId); setTab("session"); }
          }} style={{ marginTop:"10px", padding:"9px 12px", background:"#1a1200", border:"1px solid #e8a83840", borderRadius:"8px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:"11px", color:"#e8a838", fontWeight:700 }}>SESSION IN PROGRESS — RESUME →</div>
          </div>
        )}
      </div>

      <div style={S.body}>

        {/* ── TODAY TAB ── */}
        {tab === "today" && (
          <>
            <div style={{ padding:"14px 16px 0" }}>
              <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"3px", marginBottom:"8px" }}>TODAY</div>
              {(() => {
                const w = WORKOUTS[todayId];
                const logged = history.find(h => h.date===today());
                return (
                  <div style={{ background:w.color, borderRadius:"14px", padding:"20px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", right:"-30px", top:"-30px", width:"120px", height:"120px", borderRadius:"50%", background:"rgba(0,0,0,0.08)" }} />
                    <div style={{ fontSize:"10px", fontWeight:800, color:"rgba(0,0,0,0.4)", letterSpacing:"2px" }}>{w.label.toUpperCase()}</div>
                    <div style={{ fontSize:"32px", fontWeight:900, color:"#000", lineHeight:1, marginTop:"2px" }}>{w.name.toUpperCase()}</div>
                    <div style={{ fontSize:"13px", color:"rgba(0,0,0,0.5)", marginTop:"4px" }}>{w.subtitle}</div>
                    {logged ? (
                      <div style={{ marginTop:"14px", padding:"10px 14px", background:"rgba(0,0,0,0.12)", borderRadius:"8px" }}>
                        <div style={{ fontSize:"12px", color:"rgba(0,0,0,0.6)", fontWeight:700 }}>✓ COMPLETED · {fmtDur(logged.duration||0)}</div>
                      </div>
                    ) : (
                      <button onClick={() => startSession(todayId)}
                        style={{ marginTop:"14px", width:"100%", padding:"13px", background:"rgba(0,0,0,0.88)", color:w.color, border:"none", borderRadius:"10px", fontSize:"14px", fontWeight:900, cursor:"pointer", letterSpacing:"1px", fontFamily:"'Barlow Condensed',sans-serif" }}>
                        START SESSION →
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>

            <div style={{ padding:"14px 16px 0" }}>
              <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"3px", marginBottom:"8px" }}>PHASE</div>
              <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                {[1,2,3].map(p => (
                  <button key={p} onClick={() => setPhase(p)}
                    style={{ flex:1, padding:"11px 8px", background: phase===p ? PHASE_COLORS[p] : "#111", border:`1px solid ${phase===p ? PHASE_COLORS[p] : "#1e1e1e"}`, borderRadius:"10px", cursor:"pointer", color: phase===p ? "#000" : "#3a3a3a", fontFamily:"'Barlow Condensed',sans-serif" }}>
                    <div style={{ fontSize:"8px", fontWeight:700, letterSpacing:"1px" }}>PHASE</div>
                    <div style={{ fontSize:"22px", fontWeight:900 }}>{p}</div>
                    <div style={{ fontSize:"9px", marginTop:"1px" }}>{PHASE_INFO[p].weeks}</div>
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"11px 14px", background:"#111", border:"1px solid #1e1e1e", borderRadius:"10px", marginBottom:"8px" }}>
                <div style={{ flex:1, fontSize:"10px", color:"#444", letterSpacing:"2px" }}>WEEK</div>
                <button onClick={() => setWeek(w => Math.max(1,w-1))} style={{ width:"34px", height:"34px", background:"#1a1a1a", border:"1px solid #252525", borderRadius:"7px", color:"#ccc", fontSize:"20px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>−</button>
                <div style={{ fontSize:"26px", fontWeight:900, minWidth:"28px", textAlign:"center" }}>{week}</div>
                <button onClick={() => setWeek(w => Math.min(12,w+1))} style={{ width:"34px", height:"34px", background:"#1a1a1a", border:"1px solid #252525", borderRadius:"7px", color:"#ccc", fontSize:"20px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>+</button>
              </div>
              <div style={{ padding:"11px 14px", background:"#111", border:`1px solid ${PHASE_COLORS[phase]}20`, borderLeft:`3px solid ${PHASE_COLORS[phase]}`, borderRadius:"0 8px 8px 0" }}>
                <div style={{ fontSize:"11px", color:PHASE_COLORS[phase], fontWeight:700, letterSpacing:"1px", marginBottom:"3px" }}>{PHASE_INFO[phase].name.toUpperCase()}</div>
                <div style={{ fontSize:"10px", color:"#333", lineHeight:1.5 }}>{PHASE_INFO[phase].desc}</div>
                <div style={{ fontSize:"9px", color:"#252525", marginTop:"5px" }}>Tempo: {TEMPO[phase]}</div>
              </div>
            </div>

            <div style={{ padding:"14px 16px 0" }}>
              <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"3px", marginBottom:"8px" }}>WEEK SCHEDULE</div>
              {DAY_ORDER.map(dayId => {
                const w = WORKOUTS[dayId];
                const isToday = dayId === todayId;
                const logged = history.find(h => h.dayId===dayId && h.date===today());
                return (
                  <div key={dayId} onClick={() => { setActiveDay(dayId); setTab("day"); }}
                    style={{ display:"flex", alignItems:"center", gap:"12px", padding:"11px 14px", marginBottom:"5px", background: isToday ? `${w.color}12` : "#111", border:`1px solid ${isToday ? w.color+"30" : "#1a1a1a"}`, borderRadius:"10px", cursor:"pointer" }}>
                    <div style={{ width:"42px", height:"42px", borderRadius:"8px", background: isToday ? w.color : "#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:"10px", fontWeight:900, color: isToday ? "#000" : "#333" }}>{w.label.slice(0,3).toUpperCase()}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"14px", fontWeight:800, color: isToday ? w.color : "#777" }}>{w.name}</div>
                      <div style={{ fontSize:"10px", color:"#2a2a2a" }}>{w.subtitle}</div>
                    </div>
                    {logged && <span style={{ fontSize:"13px", color:"#27ae60" }}>✓</span>}
                    {isToday && !logged && <span style={{ fontSize:"9px", color:w.color, fontWeight:800, letterSpacing:"1px" }}>TODAY</span>}
                    <span style={{ color:"#1e1e1e", fontSize:"16px" }}>›</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── DAY DETAIL TAB ── */}
        {tab === "day" && activeDay && (() => {
          const w = WORKOUTS[activeDay];
          const logged = history.find(h => h.date===today() && h.dayId===activeDay);
          return (
            <>
              <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", gap:"10px" }}>
                <button onClick={() => setTab("today")} style={{ background:"none", border:"none", color:"#444", fontSize:"26px", cursor:"pointer", padding:"4px", lineHeight:1 }}>‹</button>
                <div>
                  <div style={{ fontSize:"9px", color:w.color, letterSpacing:"3px", fontWeight:700 }}>{w.label.toUpperCase()}</div>
                  <div style={{ fontSize:"20px", fontWeight:900 }}>{w.name}</div>
                </div>
              </div>
              <div style={{ padding:"10px 16px 0" }}>
                {logged ? (
                  <div style={{ padding:"12px 16px", background:"#0c130c", border:"1px solid #1a2e1a", borderRadius:"10px", display:"flex", justifyContent:"space-between" }}>
                    <div style={{ fontSize:"13px", color:"#27ae60", fontWeight:700 }}>✓ SESSION COMPLETE</div>
                    <div style={{ fontSize:"11px", color:"#2a4a2a" }}>{fmtDur(logged.duration||0)}</div>
                  </div>
                ) : (
                  <button style={S.btn(w.color,false)} onClick={() => startSession(activeDay)}>START SESSION →</button>
                )}
              </div>
              {w.sections.map((sec, si) => (
                <div key={si} style={S.card}>
                  <div style={S.secHd(w.color)}>{sec.title.toUpperCase()}</div>
                  {sec.exercises.map((ex, ei) => {
                    const last = getLastLog(ex.name);
                    const hasNote = !!notes[ex.name];
                    return (
                      <div key={ei} style={{ padding:"12px 16px", borderBottom:"1px solid #0f0f0f" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", gap:"8px", alignItems:"flex-start" }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"14px", fontWeight:700, color:"#bbb" }}>{ex.name}</div>
                            <div style={{ fontSize:"10px", color:"#2a2a2a", marginTop:"2px" }}>{ex.target}</div>
                            {ex.note ? <div style={{ fontSize:"9px", color:"#222", fontStyle:"italic", marginTop:"2px", lineHeight:1.4 }}>{ex.note}</div> : null}
                            {ex.rest > 0 && <div style={{ fontSize:"9px", color:"#1e3020", marginTop:"2px" }}>⏱ {fmtDur(ex.rest)} rest</div>}
                            {last && <div style={{ fontSize:"9px", color:`${w.color}70`, marginTop:"3px" }}>Last: {last.weight} lbs × {last.reps} reps</div>}
                            {hasNote && (
                              <div style={{ marginTop:"6px", padding:"5px 8px", background:"#0e1a0e", border:"1px solid #1a3a1a", borderRadius:"6px" }}>
                                <div style={{ fontSize:"9px", color:"#27ae60", letterSpacing:"1px", marginBottom:"2px" }}>NOTE</div>
                                <div style={{ fontSize:"10px", color:"#3a6a3a", lineHeight:1.4 }}>{notes[ex.name]}</div>
                              </div>
                            )}
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:"5px", alignItems:"flex-end", flexShrink:0 }}>
                            <span style={S.tag("#1a1a1a","#2a2a2a")}>{ex.sets}×</span>
                            <button onClick={() => setNoteEditor({ exName: ex.name, value: notes[ex.name]||"" })}
                              style={{ background: hasNote?"#0e1a0e":"#1a1a1a", border:`1px solid ${hasNote?"#1a3a1a":"#252525"}`, borderRadius:"6px", color: hasNote?"#27ae60":"#333", fontSize:"9px", fontWeight:700, padding:"4px 8px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif" }}>
                              {hasNote ? "NOTE ✓" : "+ NOTE"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div style={{ height:"20px" }} />
            </>
          );
        })()}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div style={{ padding:"14px 16px 0" }}>
            <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"3px", marginBottom:"12px" }}>SESSION HISTORY</div>
            {history.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0", color:"#222" }}>
                <div style={{ fontSize:"44px", marginBottom:"10px" }}>○</div>
                <div style={{ fontSize:"15px", fontWeight:700 }}>NO SESSIONS YET</div>
                <div style={{ fontSize:"11px", marginTop:"6px" }}>Complete your first workout to start tracking</div>
              </div>
            ) : history.map((h, i) => {
              const w = WORKOUTS[h.dayId];
              if (!w) return null;
              const allSets = Object.values(h.sets||{}).flat();
              const done = allSets.filter(s => s.done && s.weight && !isNaN(Number(s.weight))).length;
              const maxWt = allSets.filter(s => s.weight && !isNaN(Number(s.weight))).reduce((m,s) => Math.max(m,Number(s.weight)), 0);
              return (
                <div key={i} style={{ ...S.card, marginBottom:"6px" }}>
                  <div style={{ padding:"13px 16px", display:"flex", gap:"12px", alignItems:"center" }}>
                    <div style={{ width:"46px", height:"46px", borderRadius:"10px", background:`${w.color}15`, border:`1px solid ${w.color}20`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <div style={{ fontSize:"10px", color:w.color, fontWeight:800, lineHeight:1.3 }}>{h.date?.slice(5,7)}/{h.date?.slice(8,10)}</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"14px", fontWeight:800, color:"#bbb" }}>{w.name}</div>
                      <div style={{ fontSize:"10px", color:"#2a2a2a", marginTop:"2px" }}>Phase {h.phase||1} · {fmtDur(h.duration||0)}</div>
                      <div style={{ display:"flex", gap:"6px", marginTop:"5px", flexWrap:"wrap" }}>
                        {done > 0 && <span style={S.tag("#112211","#27ae60")}>{done} SETS</span>}
                        {maxWt > 0 && <span style={S.tag("#111822","#4a9eda")}>MAX {maxWt}lbs</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PROGRESS TAB ── */}
        {tab === "progress" && (() => {
          const KEY_LIFTS = ["Barbell back squat","Flat barbell bench press","Weighted pull-ups","Romanian deadlift","Barbell hip thrust","Overhead press","Incline barbell press","Trap bar deadlift","Barbell bent-over row"];
          // match case-insensitively
          function getBest(lift) {
            const bests = [];
            [...history].reverse().forEach(h => {
              const key = Object.keys(h.sets||{}).find(k => k.toLowerCase()===lift.toLowerCase());
              if (key && h.sets[key]) {
                const valid = h.sets[key].filter(s => s.weight && !isNaN(Number(s.weight)));
                const best = valid.reduce((m,s) => Math.max(m,Number(s.weight)), 0);
                if (best > 0) bests.push({ date: h.date, weight: best });
              }
            });
            return bests;
          }
          return (
            <div style={{ padding:"14px 16px 0" }}>
              <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"3px", marginBottom:"12px" }}>LIFT PROGRESS</div>
              {KEY_LIFTS.map(lift => {
                const data = getBest(lift);
                if (!data.length) return null;
                const max = Math.max(...data.map(d=>d.weight));
                const min = Math.min(...data.map(d=>d.weight));
                const latest = data[data.length-1];
                const gained = latest.weight - data[0].weight;
                return (
                  <div key={lift} style={{ ...S.card, marginBottom:"8px" }}>
                    <div style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"13px", fontWeight:700, color:"#bbb" }}>{lift}</div>
                          <div style={{ fontSize:"10px", color:"#2a2a2a", marginTop:"2px" }}>{data.length} sessions</div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontSize:"24px", fontWeight:900, color:"#e8a838", lineHeight:1 }}>{latest.weight}<span style={{ fontSize:"10px", color:"#333" }}> lbs</span></div>
                          {data.length > 1 && gained !== 0 && (
                            <div style={{ fontSize:"10px", color: gained>0?"#27ae60":"#c0392b", fontWeight:700 }}>{gained>0?"+":""}{gained} lbs</div>
                          )}
                        </div>
                      </div>
                      {data.length > 1 && (
                        <div style={{ display:"flex", alignItems:"flex-end", gap:"3px", height:"32px" }}>
                          {data.map((d,i) => {
                            const range = max-min||1;
                            const h = Math.max(4, ((d.weight-min)/range)*26+6);
                            return <div key={i} style={{ flex:1, height:`${h}px`, background: i===data.length-1?"#e8a838":"#1e1e1e", borderRadius:"2px 2px 0 0", minWidth:"4px" }} />;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {KEY_LIFTS.every(l=>getBest(l).length===0) && (
                <div style={{ textAlign:"center", padding:"60px 0", color:"#222" }}>
                  <div style={{ fontSize:"44px", marginBottom:"10px" }}>↑</div>
                  <div style={{ fontSize:"15px", fontWeight:700 }}>NO DATA YET</div>
                  <div style={{ fontSize:"11px", marginTop:"6px" }}>Log sessions to track your progress</div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

      <div style={S.nav}>
        {[
          { id:"today", icon:"◎", label:"TODAY" },
          { id:"day",   icon:"≡", label:"WORKOUT" },
          { id:"history", icon:"⊞", label:"LOG" },
          { id:"progress", icon:"↑", label:"GAINS" },
        ].map(t => (
          <button key={t.id} style={S.navBtn(tab===t.id)}
            onClick={() => { if (t.id==="day") setActiveDay(todayId); setTab(t.id); }}>
            <span style={{ fontSize:"18px", lineHeight:1 }}>{t.icon}</span>
            <span style={{ fontSize:"8px", fontWeight:800, letterSpacing:"1px" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
