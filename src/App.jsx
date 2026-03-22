import { useState, useEffect, useRef } from "react";
import { WORKOUTS, PHASE_COLORS, DAY_ORDER, JS_TO_DAY, PHASE_INFO, TEMPO } from "./workouts.js";

function getTodayId() { return JS_TO_DAY[new Date().getDay()]; }
function formatDate(d) { return d.toISOString().split("T")[0]; }
function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const S = {
  app: { display:"flex", flexDirection:"column", height:"100dvh", maxWidth:"430px", margin:"0 auto", background:"#080808", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif", overflow:"hidden", position:"relative" },
  header: { padding:"env(safe-area-inset-top, 16px) 20px 12px", paddingTop:"calc(env(safe-area-inset-top, 0px) + 16px)", background:"#0a0a0a", borderBottom:"1px solid #1a1a1a", flexShrink:0 },
  content: { flex:1, overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 72px)", WebkitOverflowScrolling:"touch" },
  nav: { position:"absolute", bottom:0, left:0, right:0, display:"flex", background:"#0a0a0a", borderTop:"1px solid #1a1a1a", height:"calc(env(safe-area-inset-bottom, 0px) + 60px)", paddingBottom:"env(safe-area-inset-bottom, 0px)" },
  navBtn: (active) => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"3px", background:"none", border:"none", cursor:"pointer", color: active ? "#e8a838" : "#3a3a3a", transition:"color 0.15s", paddingBottom:"4px" }),
  card: { margin:"10px 16px 0", background:"#111", border:"1px solid #1e1e1e", borderRadius:"12px", overflow:"hidden" },
  sectionHead: (color) => ({ padding:"9px 16px", background:`${color}18`, borderBottom:"1px solid #1e1e1e", fontSize:"10px", fontWeight:800, letterSpacing:"2px", color }),
  exRow: { padding:"14px 16px", borderBottom:"1px solid #0f0f0f", display:"flex", alignItems:"flex-start", justifyContent:"space-between" },
  tag: (bg, color) => ({ fontSize:"9px", fontWeight:700, padding:"3px 7px", borderRadius:"4px", background:bg, color, letterSpacing:"1px", flexShrink:0 }),
  btn: (color, outline) => ({ padding:"14px 24px", borderRadius:"10px", border: outline ? `1px solid ${color}` : "none", background: outline ? "transparent" : color, color: outline ? color : "#000", fontSize:"14px", fontWeight:800, cursor:"pointer", letterSpacing:"0.5px", width:"100%" }),
  numInput: { background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"8px", color:"#fff", fontSize:"24px", fontWeight:700, textAlign:"center", padding:"12px 8px", width:"100%", outline:"none", fontFamily:"'Barlow Condensed',sans-serif" },
  setChip: (done, active) => ({ width:"42px", height:"42px", borderRadius:"50%", border: done ? "none" : active ? "2px solid #e8a838" : "1px solid #252525", background: done ? "#112211" : active ? "#1e1800" : "#111", display:"flex", alignItems:"center", justifyContent:"center", cursor: done ? "default" : "pointer", flexShrink:0, flexDirection:"column", gap:"1px" }),
};

export default function App() {
  const [tab, setTab] = useState("today");
  const [phase, setPhase] = useState(1);
  const [week, setWeek] = useState(1);
  const [activeDay, setActiveDay] = useState(null);
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [setInput, setSetInput] = useState(null);
  const [wt, setWt] = useState("");
  const [rp, setRp] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const todayId = getTodayId();

  useEffect(() => {
    try {
      const s = localStorage.getItem("grind_settings");
      if (s) { const d = JSON.parse(s); setPhase(d.phase||1); setWeek(d.week||1); }
      const h = localStorage.getItem("grind_history");
      if (h) setHistory(JSON.parse(h));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("grind_settings", JSON.stringify({ phase, week }));
  }, [phase, week]);

  useEffect(() => {
    if (session) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => clearInterval(timerRef.current);
  }, [!!session]);

  function saveHistory(newHistory) {
    setHistory(newHistory);
    try { localStorage.setItem("grind_history", JSON.stringify(newHistory)); } catch {}
  }

  function startSession(dayId) {
    const w = WORKOUTS[dayId];
    const sets = {};
    w.sections.forEach(sec => {
      sec.exercises.forEach(ex => {
        sets[ex.name] = Array.from({ length: ex.sets }, () => ({ weight:"", reps:"", done:false }));
      });
    });
    setSession({ dayId, sets });
    setActiveDay(dayId);
    setTab("session");
  }

  function logSet(exName, idx, weight, reps) {
    setSession(prev => ({
      ...prev,
      sets: {
        ...prev.sets,
        [exName]: prev.sets[exName].map((s,i) => i===idx ? { weight, reps, done:true } : s)
      }
    }));
    setSetInput(null); setWt(""); setRp("");
  }

  function skipSet(exName, idx) {
    setSession(prev => ({
      ...prev,
      sets: {
        ...prev.sets,
        [exName]: prev.sets[exName].map((s,i) => i===idx ? { ...s, done:true } : s)
      }
    }));
    setSetInput(null); setWt(""); setRp("");
  }

  function finishSession() {
    const entry = { date: formatDate(new Date()), dayId: session.dayId, sets: session.sets, duration: elapsed, phase };
    const newHistory = [entry, ...history].slice(0, 120);
    saveHistory(newHistory);
    setSession(null); setActiveDay(null); setTab("today");
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

  function sessionProgress() {
    if (!session) return 0;
    const all = Object.values(session.sets).flat();
    const done = all.filter(s => s.done).length;
    return all.length ? Math.round((done / all.length) * 100) : 0;
  }

  function getBestForLift(exName) {
    const bests = [];
    [...history].reverse().forEach(h => {
      if (h.sets?.[exName]) {
        const valid = h.sets[exName].filter(s => s.weight && !isNaN(Number(s.weight)));
        const best = valid.reduce((m, s) => Math.max(m, Number(s.weight)), 0);
        if (best > 0) bests.push({ date: h.date, weight: best });
      }
    });
    return bests;
  }

  // ── SESSION SCREEN ──────────────────────────────────────────────────────
  if (tab === "session" && session) {
    const w = WORKOUTS[session.dayId];
    const prog = sessionProgress();
    return (
      <div style={S.app}>
        <div style={{ flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch", paddingBottom:"24px" }}>
          {/* Sticky session header */}
          <div style={{ padding:"calc(env(safe-area-inset-top,0px) + 14px) 20px 12px", background:"#0a0a0a", borderBottom:"1px solid #1a1a1a", position:"sticky", top:0, zIndex:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
              <div>
                <div style={{ fontSize:"10px", color:w.color, letterSpacing:"3px", fontWeight:700 }}>{w.label.toUpperCase()}</div>
                <div style={{ fontSize:"22px", fontWeight:900 }}>{w.name.toUpperCase()}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:"26px", fontWeight:900, color:"#555", fontVariantNumeric:"tabular-nums" }}>{formatDuration(elapsed)}</div>
                <div style={{ fontSize:"9px", color:"#333", letterSpacing:"2px" }}>ELAPSED</div>
              </div>
            </div>
            <div style={{ height:"3px", background:"#1a1a1a", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{ height:"3px", background:w.color, width:`${prog}%`, transition:"width 0.4s", borderRadius:"2px" }} />
            </div>
            <div style={{ fontSize:"9px", color:"#333", marginTop:"4px", letterSpacing:"1px" }}>{prog}% COMPLETE</div>
          </div>

          {/* Set input panel */}
          {setInput && (
            <div style={{ margin:"12px 16px 0", background:"#161616", border:`1px solid ${w.color}50`, borderRadius:"12px", padding:"16px", position:"sticky", top:"94px", zIndex:10 }}>
              <div style={{ fontSize:"11px", color:w.color, fontWeight:800, letterSpacing:"2px", marginBottom:"2px" }}>SET {setInput.idx+1} — {setInput.exName.toUpperCase()}</div>
              {(() => { const last = getLastLog(setInput.exName); return (
                <div style={{ fontSize:"10px", color:"#444", marginBottom:"12px" }}>
                  {last ? `Last logged: ${last.weight} lbs × ${last.reps} reps` : "No previous log for this exercise"}
                </div>
              );})()}
              <div style={{ display:"flex", gap:"10px", marginBottom:"12px" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"9px", color:"#444", letterSpacing:"2px", marginBottom:"6px" }}>WEIGHT (lbs)</div>
                  <input style={S.numInput} type="number" inputMode="decimal" value={wt} onChange={e=>setWt(e.target.value)} placeholder="135" />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"9px", color:"#444", letterSpacing:"2px", marginBottom:"6px" }}>REPS</div>
                  <input style={S.numInput} type="number" inputMode="numeric" value={rp} onChange={e=>setRp(e.target.value)} placeholder="8" />
                </div>
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <button style={{ ...S.btn("#e8a838", false), flex:2, padding:"12px" }} onClick={() => logSet(setInput.exName, setInput.idx, wt||"BW", rp||"—")}>LOG ✓</button>
                <button style={{ ...S.btn("#333", true), flex:1, padding:"12px" }} onClick={() => skipSet(setInput.exName, setInput.idx)}>SKIP</button>
                <button style={{ ...S.btn("#333", true), flex:1, padding:"12px" }} onClick={() => { setSetInput(null); setWt(""); setRp(""); }}>✕</button>
              </div>
            </div>
          )}

          {/* Exercises */}
          {w.sections.map((sec, si) => (
            <div key={si} style={S.card}>
              <div style={S.sectionHead(w.color)}>{sec.title.toUpperCase()}</div>
              {sec.exercises.map((ex, ei) => {
                const exSets = session.sets[ex.name] || [];
                const allDone = exSets.every(s => s.done);
                return (
                  <div key={ei} style={{ ...S.exRow, flexDirection:"column", alignItems:"flex-start", gap:"10px", background: allDone ? "#0c130c" : "transparent" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", width:"100%", alignItems:"flex-start", gap:"8px" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"14px", fontWeight:700, color: allDone ? "#27ae60" : "#ddd", lineHeight:1.2 }}>{ex.name}</div>
                        <div style={{ fontSize:"11px", color:"#3a3a3a", marginTop:"2px" }}>{ex.sets} sets · {ex.target}</div>
                        {ex.note ? <div style={{ fontSize:"10px", color:"#2a2a2a", marginTop:"2px", fontStyle:"italic", lineHeight:1.4 }}>{ex.note}</div> : null}
                      </div>
                      {allDone && <div style={{ fontSize:"18px", color:"#27ae60", flexShrink:0 }}>✓</div>}
                    </div>
                    <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                      {exSets.map((set, si2) => {
                        const isCurr = setInput?.exName===ex.name && setInput?.idx===si2;
                        return (
                          <div key={si2}
                            onClick={() => { if (!set.done) { setSetInput({ exName:ex.name, idx:si2 }); setWt(set.weight||""); setRp(set.reps||""); }}}
                            style={S.setChip(set.done, isCurr)}>
                            {set.done ? (
                              <>
                                {set.weight ? <span style={{ fontSize:"9px", fontWeight:800, color:"#27ae60" }}>{set.weight}</span> : <span style={{ fontSize:"14px", color:"#27ae60" }}>✓</span>}
                                {set.reps ? <span style={{ fontSize:"8px", color:"#2a5a2a" }}>{set.reps}</span> : null}
                              </>
                            ) : (
                              <span style={{ fontSize:"12px", fontWeight:700, color: isCurr ? "#e8a838" : "#333" }}>{si2+1}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{ padding:"20px 16px 8px" }}>
            <button style={S.btn(w.color, false)} onClick={finishSession}>FINISH SESSION →</button>
            <button style={{ ...S.btn("#2a2a2a", true), marginTop:"10px", fontSize:"12px", color:"#444", border:"1px solid #1a1a1a" }}
              onClick={() => { if (window.confirm("Abandon this session? Progress won't be saved.")) { setSession(null); setActiveDay(null); setTab("today"); }}}>
              ABANDON SESSION
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN APP ─────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>

      {/* Header */}
      <div style={S.header}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"9px", letterSpacing:"4px", color:"#e8a838", fontWeight:700 }}>ROGER'S</div>
            <div style={{ fontSize:"24px", fontWeight:900, lineHeight:1 }}>SUMMER GRIND</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"9px", color:"#333", letterSpacing:"2px" }}>PHASE · WEEK</div>
            <div style={{ fontSize:"26px", fontWeight:900, color: PHASE_COLORS[phase], lineHeight:1 }}>{phase} · {week}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={S.content}>

        {/* ── TODAY TAB ── */}
        {tab === "today" && (
          <>
            {/* Today's card */}
            <div style={{ padding:"14px 16px 0" }}>
              <div style={{ fontSize:"9px", color:"#333", letterSpacing:"3px", marginBottom:"8px" }}>TODAY</div>
              {(() => {
                const w = WORKOUTS[todayId];
                const logged = history.find(h => h.date===formatDate(new Date()));
                return (
                  <div style={{ background:w.color, borderRadius:"14px", padding:"20px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", right:"-30px", top:"-30px", width:"120px", height:"120px", borderRadius:"50%", background:"rgba(0,0,0,0.08)" }} />
                    <div style={{ fontSize:"10px", fontWeight:800, color:"rgba(0,0,0,0.45)", letterSpacing:"2px" }}>{w.label.toUpperCase()}</div>
                    <div style={{ fontSize:"32px", fontWeight:900, color:"#000", lineHeight:1, marginTop:"2px" }}>{w.name.toUpperCase()}</div>
                    <div style={{ fontSize:"13px", color:"rgba(0,0,0,0.55)", marginTop:"4px" }}>{w.subtitle}</div>
                    {logged ? (
                      <div style={{ marginTop:"16px", padding:"10px 14px", background:"rgba(0,0,0,0.15)", borderRadius:"8px" }}>
                        <div style={{ fontSize:"12px", color:"rgba(0,0,0,0.65)", fontWeight:700 }}>✓ COMPLETED · {formatDuration(logged.duration||0)}</div>
                      </div>
                    ) : (
                      <button onClick={() => startSession(todayId)}
                        style={{ marginTop:"16px", width:"100%", padding:"14px", background:"rgba(0,0,0,0.88)", color:w.color, border:"none", borderRadius:"10px", fontSize:"15px", fontWeight:900, cursor:"pointer", letterSpacing:"1px", fontFamily:"'Barlow Condensed',sans-serif" }}>
                        START SESSION →
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Phase + Week controls */}
            <div style={{ padding:"14px 16px 0" }}>
              <div style={{ fontSize:"9px", color:"#333", letterSpacing:"3px", marginBottom:"8px" }}>PHASE</div>
              <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                {[1,2,3].map(p => (
                  <button key={p} onClick={() => setPhase(p)}
                    style={{ flex:1, padding:"11px 8px", background: phase===p ? PHASE_COLORS[p] : "#111", border:`1px solid ${phase===p ? PHASE_COLORS[p] : "#1e1e1e"}`, borderRadius:"10px", cursor:"pointer", color: phase===p ? "#000" : "#444", fontFamily:"'Barlow Condensed',sans-serif" }}>
                    <div style={{ fontSize:"8px", fontWeight:700, letterSpacing:"1px" }}>PHASE</div>
                    <div style={{ fontSize:"22px", fontWeight:900 }}>{p}</div>
                    <div style={{ fontSize:"9px", marginTop:"1px" }}>{PHASE_INFO[p].weeks}</div>
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", background:"#111", border:"1px solid #1e1e1e", borderRadius:"10px", marginBottom:"8px" }}>
                <div style={{ flex:1, fontSize:"10px", color:"#555", letterSpacing:"2px" }}>WEEK</div>
                <button onClick={() => setWeek(w => Math.max(1,w-1))} style={{ width:"36px", height:"36px", background:"#1a1a1a", border:"1px solid #252525", borderRadius:"8px", color:"#ccc", fontSize:"20px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif" }}>−</button>
                <div style={{ fontSize:"26px", fontWeight:900, minWidth:"30px", textAlign:"center" }}>{week}</div>
                <button onClick={() => setWeek(w => Math.min(12,w+1))} style={{ width:"36px", height:"36px", background:"#1a1a1a", border:"1px solid #252525", borderRadius:"8px", color:"#ccc", fontSize:"20px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif" }}>+</button>
              </div>
              <div style={{ padding:"12px 14px", background:"#111", border:`1px solid ${PHASE_COLORS[phase]}25`, borderLeft:`3px solid ${PHASE_COLORS[phase]}`, borderRadius:"0 8px 8px 0" }}>
                <div style={{ fontSize:"11px", color:PHASE_COLORS[phase], fontWeight:700, letterSpacing:"1px", marginBottom:"3px" }}>{PHASE_INFO[phase].name.toUpperCase()}</div>
                <div style={{ fontSize:"11px", color:"#3a3a3a", lineHeight:1.5 }}>{PHASE_INFO[phase].desc}</div>
                <div style={{ fontSize:"10px", color:"#2a2a2a", marginTop:"6px" }}>Tempo: {TEMPO[phase]}</div>
              </div>
            </div>

            {/* Week schedule */}
            <div style={{ padding:"14px 16px 0" }}>
              <div style={{ fontSize:"9px", color:"#333", letterSpacing:"3px", marginBottom:"8px" }}>WEEK SCHEDULE</div>
              {DAY_ORDER.map(dayId => {
                const w = WORKOUTS[dayId];
                const isToday = dayId === todayId;
                const logged = history.find(h => h.dayId===dayId && h.date===formatDate(new Date()));
                return (
                  <div key={dayId}
                    onClick={() => { setActiveDay(dayId); setTab("day"); }}
                    style={{ display:"flex", alignItems:"center", gap:"12px", padding:"11px 14px", marginBottom:"5px", background: isToday ? `${w.color}14` : "#111", border:`1px solid ${isToday ? w.color+"35" : "#1a1a1a"}`, borderRadius:"10px", cursor:"pointer" }}>
                    <div style={{ width:"42px", height:"42px", borderRadius:"8px", background: isToday ? w.color : "#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:"10px", fontWeight:900, color: isToday ? "#000" : "#444" }}>{w.label.slice(0,3).toUpperCase()}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"14px", fontWeight:800, color: isToday ? w.color : "#888" }}>{w.name}</div>
                      <div style={{ fontSize:"10px", color:"#333" }}>{w.subtitle}</div>
                    </div>
                    {logged && <span style={{ fontSize:"14px", color:"#27ae60" }}>✓</span>}
                    {isToday && !logged && <span style={{ fontSize:"9px", color:w.color, fontWeight:800, letterSpacing:"1px" }}>TODAY</span>}
                    <span style={{ fontSize:"14px", color:"#2a2a2a" }}>›</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── DAY DETAIL TAB ── */}
        {tab === "day" && activeDay && (() => {
          const w = WORKOUTS[activeDay];
          const isToday = activeDay === todayId;
          const logged = history.find(h => h.date===formatDate(new Date()) && h.dayId===activeDay);
          return (
            <>
              <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", gap:"12px" }}>
                <button onClick={() => setTab("today")} style={{ background:"none", border:"none", color:"#555", fontSize:"26px", cursor:"pointer", padding:"4px", lineHeight:1 }}>‹</button>
                <div>
                  <div style={{ fontSize:"9px", color:w.color, letterSpacing:"3px", fontWeight:700 }}>{w.label.toUpperCase()}</div>
                  <div style={{ fontSize:"22px", fontWeight:900 }}>{w.name}</div>
                </div>
              </div>
              <div style={{ padding:"10px 16px 0" }}>
                {logged ? (
                  <div style={{ padding:"13px 16px", background:"#0c130c", border:"1px solid #1a2e1a", borderRadius:"10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:"13px", color:"#27ae60", fontWeight:700 }}>✓ SESSION COMPLETE</div>
                    <div style={{ fontSize:"11px", color:"#3a5a3a" }}>{formatDuration(logged.duration||0)}</div>
                  </div>
                ) : isToday ? (
                  <button style={S.btn(w.color, false)} onClick={() => startSession(activeDay)}>START SESSION →</button>
                ) : (
                  <button style={{ ...S.btn(w.color, true) }} onClick={() => startSession(activeDay)}>START ANYWAY →</button>
                )}
              </div>
              {w.sections.map((sec, si) => (
                <div key={si} style={S.card}>
                  <div style={S.sectionHead(w.color)}>{sec.title.toUpperCase()}</div>
                  {sec.exercises.map((ex, ei) => {
                    const last = getLastLog(ex.name);
                    return (
                      <div key={ei} style={{ ...S.exRow, flexDirection:"column", alignItems:"flex-start", gap:"4px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", width:"100%", alignItems:"center", gap:"8px" }}>
                          <div style={{ fontSize:"14px", fontWeight:700, color:"#ccc", flex:1 }}>{ex.name}</div>
                          <span style={S.tag("#1a1a1a","#3a3a3a")}>{ex.sets}×</span>
                        </div>
                        <div style={{ fontSize:"11px", color:"#3a3a3a" }}>{ex.target}</div>
                        {ex.note ? <div style={{ fontSize:"10px", color:"#2a2a2a", fontStyle:"italic", lineHeight:1.4 }}>{ex.note}</div> : null}
                        {last && <div style={{ fontSize:"10px", color:`${w.color}80`, marginTop:"3px" }}>Last: {last.weight} lbs × {last.reps} reps</div>}
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
            <div style={{ fontSize:"9px", color:"#333", letterSpacing:"3px", marginBottom:"12px" }}>SESSION HISTORY</div>
            {history.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0", color:"#2a2a2a" }}>
                <div style={{ fontSize:"48px", marginBottom:"12px" }}>○</div>
                <div style={{ fontSize:"16px", fontWeight:700 }}>NO SESSIONS YET</div>
                <div style={{ fontSize:"12px", marginTop:"6px" }}>Complete your first workout to start tracking</div>
              </div>
            ) : history.map((h, i) => {
              const w = WORKOUTS[h.dayId];
              if (!w) return null;
              const allSets = Object.values(h.sets||{}).flat();
              const done = allSets.filter(s => s.done && s.weight && !isNaN(Number(s.weight))).length;
              const maxWt = allSets.filter(s => s.weight && !isNaN(Number(s.weight))).reduce((m,s) => Math.max(m, Number(s.weight)), 0);
              return (
                <div key={i} style={{ ...S.card, marginBottom:"6px" }}>
                  <div style={{ padding:"13px 16px", display:"flex", gap:"12px", alignItems:"center" }}>
                    <div style={{ width:"48px", height:"48px", borderRadius:"10px", background:`${w.color}18`, border:`1px solid ${w.color}25`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <div style={{ fontSize:"10px", color:w.color, fontWeight:800, lineHeight:1.2 }}>{h.date?.slice(5,7)}/{h.date?.slice(8,10)}</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"14px", fontWeight:800, color:"#ccc" }}>{w.name}</div>
                      <div style={{ fontSize:"10px", color:"#333", marginTop:"2px" }}>Phase {h.phase||1} · {formatDuration(h.duration||0)}</div>
                      <div style={{ display:"flex", gap:"8px", marginTop:"6px", flexWrap:"wrap" }}>
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
          const KEY_LIFTS = [
            "Barbell Back Squat","Flat Barbell Bench Press","Weighted Pull-Ups",
            "Romanian Deadlift","Barbell Hip Thrust","Overhead Press",
            "Incline Barbell Press","Trap Bar Deadlift","Barbell Bent-Over Row",
          ];
          return (
            <div style={{ padding:"14px 16px 0" }}>
              <div style={{ fontSize:"9px", color:"#333", letterSpacing:"3px", marginBottom:"12px" }}>LIFT PROGRESS</div>
              {KEY_LIFTS.map(lift => {
                const data = getBestForLift(lift);
                if (!data.length) return null;
                const max = Math.max(...data.map(d => d.weight));
                const min = Math.min(...data.map(d => d.weight));
                const latest = data[data.length-1];
                const gained = latest.weight - data[0].weight;
                return (
                  <div key={lift} style={{ ...S.card, marginBottom:"8px" }}>
                    <div style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"13px", fontWeight:700, color:"#ccc", lineHeight:1.2 }}>{lift}</div>
                          <div style={{ fontSize:"10px", color:"#333", marginTop:"2px" }}>{data.length} sessions logged</div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontSize:"24px", fontWeight:900, color:"#e8a838", lineHeight:1 }}>{latest.weight}<span style={{ fontSize:"10px", color:"#444" }}> lbs</span></div>
                          {data.length > 1 && gained !== 0 && (
                            <div style={{ fontSize:"10px", color: gained>0 ? "#27ae60" : "#c0392b", fontWeight:700 }}>{gained>0?"+":""}{gained} lbs</div>
                          )}
                        </div>
                      </div>
                      {data.length > 1 && (
                        <div style={{ display:"flex", alignItems:"flex-end", gap:"3px", height:"36px" }}>
                          {data.map((d, i) => {
                            const range = max-min || 1;
                            const h = Math.max(4, ((d.weight-min)/range)*30+6);
                            return (
                              <div key={i} style={{ flex:1, height:`${h}px`, background: i===data.length-1 ? "#e8a838" : "#222", borderRadius:"2px 2px 0 0", minWidth:"4px" }} />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {KEY_LIFTS.every(l => getBestForLift(l).length===0) && (
                <div style={{ textAlign:"center", padding:"60px 0", color:"#2a2a2a" }}>
                  <div style={{ fontSize:"48px", marginBottom:"12px" }}>↑</div>
                  <div style={{ fontSize:"16px", fontWeight:700 }}>NO DATA YET</div>
                  <div style={{ fontSize:"12px", marginTop:"6px" }}>Log sessions to track your lift progress</div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {/* Bottom nav */}
      <div style={S.nav}>
        {[
          { id:"today",    icon:"◎", label:"TODAY" },
          { id:"day",      icon:"≡", label:"WORKOUT" },
          { id:"history",  icon:"⊞", label:"LOG" },
          { id:"progress", icon:"↑", label:"PROGRESS" },
        ].map(t => (
          <button key={t.id}
            style={S.navBtn(tab===t.id)}
            onClick={() => {
              if (t.id==="day") { setActiveDay(todayId); }
              setTab(t.id);
            }}>
            <span style={{ fontSize:"18px", lineHeight:1 }}>{t.icon}</span>
            <span style={{ fontSize:"8px", fontWeight:800, letterSpacing:"1px" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
