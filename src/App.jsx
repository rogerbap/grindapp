import { useState, useEffect, useRef } from "react";
import { WORKOUTS, PHASE_COLORS, DAY_ORDER, JS_TO_DAY, PHASE_INFO, TEMPO, SWAPS, EXERCISE_LIBRARY } from "./workouts.js";

function getTodayId() { return JS_TO_DAY[new Date().getDay()]; }
function formatDate(d) { return d.toISOString().split("T")[0]; }
function fmtDur(secs) { const m = Math.floor(secs/60), s = secs%60; return `${m}:${s.toString().padStart(2,"0")}`; }
function today() { return formatDate(new Date()); }
function uid() { return Math.random().toString(36).slice(2,9); }

const LS = {
  get:(k)=>{ try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;} },
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v));}catch{} },
  del:(k)=>{ try{localStorage.removeItem(k);}catch{} },
};

const DAY_COLORS=["#e8a838","#2980b9","#c0392b","#8e44ad","#27ae60","#16a085","#e05c2a","#576574","#d35400","#1a5276"];
const ALL_TAGS=["quad","hamstring","glute","chest","back","shoulder","tricep","bicep","core","calf","adductor","forearm","trap","barbell","dumbbell","cable","machine","bodyweight","band","kettlebell","sled","squat","hinge","push","pull","lunge","carry","plyo","sprint","iso","compound","isolation","unilateral","bilateral","explosive"];
const TAG_MUSCLES=["quad","hamstring","glute","chest","back","shoulder","tricep","bicep","core","calf","adductor","forearm","trap"];

// Find library exercises that match by tag overlap
function getSuggestedSwaps(ex, count=6) {
  if (!ex?.tags?.length) return [];
  const muscleTags = ex.tags.filter(t=>TAG_MUSCLES.includes(t));
  const allTags = ex.tags;
  return EXERCISE_LIBRARY
    .filter(e=>e.name!==ex.name)
    .map(e=>{
      const eTags=e.tags||[];
      const muscleScore=muscleTags.filter(t=>eTags.includes(t)).length*3;
      const patternScore=allTags.filter(t=>eTags.includes(t)&&!TAG_MUSCLES.includes(t)).length;
      return {...e, score:muscleScore+patternScore};
    })
    .filter(e=>e.score>0)
    .sort((a,b)=>b.score-a.score)
    .slice(0,count);
}

const S = {
  app:{display:"flex",flexDirection:"column",height:"100dvh",maxWidth:"430px",margin:"0 auto",background:"#080808",color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",overflow:"hidden",position:"relative"},
  hdr:{padding:"calc(env(safe-area-inset-top,0px) + 14px) 20px 12px",background:"#0a0a0a",borderBottom:"1px solid #1a1a1a",flexShrink:0},
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
  ssBar:{height:"2px",background:"#27ae60",margin:"0 0 2px",borderRadius:"1px"},
};

export default function App() {
  const [tab,setTab]=useState("today");
  const [phase,setPhase]=useState(1);
  const [week,setWeek]=useState(1);
  const [activeDay,setActiveDay]=useState(null);
  const [session,setSession]=useState(null);
  const [history,setHistory]=useState([]);
  const [setInput,setSetInput]=useState(null);
  const [wt,setWt]=useState("");
  const [rp,setRp]=useState("");
  const [elapsed,setElapsed]=useState(0);
  const [restTimer,setRestTimer]=useState(null);
  const [notes,setNotes]=useState({});
  const [noteEditor,setNoteEditor]=useState(null);
  const [swapModal,setSwapModal]=useState(null);
  const [customWorkouts,setCustomWorkouts]=useState([]);
  const [presetOverrides,setPresetOverrides]=useState({});
  const [builder,setBuilder]=useState(null);
  const [builderEx,setBuilderEx]=useState(null);
  const [addExModal,setAddExModal]=useState(null);
  const sessionTimerRef=useRef(null);
  const restTimerRef=useRef(null);
  const todayId=getTodayId();

  useEffect(()=>{
    const s=LS.get("grind_settings");if(s){setPhase(s.phase||1);setWeek(s.week||1);}
    const h=LS.get("grind_history");if(h)setHistory(h);
    const n=LS.get("grind_notes");if(n)setNotes(n);
    const cw=LS.get("grind_custom_workouts");if(cw)setCustomWorkouts(cw);
    const po=LS.get("grind_preset_overrides");if(po)setPresetOverrides(po);
    const saved=LS.get("grind_active_session");
    if(saved){setSession(saved.session);setElapsed(saved.elapsed||0);setActiveDay(saved.session.dayId);setTab("session");}
  },[]);

  useEffect(()=>{LS.set("grind_settings",{phase,week});},[phase,week]);
  useEffect(()=>{if(session)LS.set("grind_active_session",{session,elapsed});},[session,elapsed]);
  useEffect(()=>{
    if(session){sessionTimerRef.current=setInterval(()=>setElapsed(e=>e+1),1000);}
    else{clearInterval(sessionTimerRef.current);}
    return()=>clearInterval(sessionTimerRef.current);
  },[!!session]);
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

  function saveHistory(h){setHistory(h);LS.set("grind_history",h);}
  function saveNotes(n){setNotes(n);LS.set("grind_notes",n);}
  function saveCustomWorkouts(cw){setCustomWorkouts(cw);LS.set("grind_custom_workouts",cw);}
  function savePresetOverrides(po){setPresetOverrides(po);LS.set("grind_preset_overrides",po);}
  function getWorkout(dayId){return presetOverrides[dayId]||WORKOUTS[dayId];}

  function startSession(dayId,customWorkout){
    const workout=customWorkout||getWorkout(dayId);
    const sets={};
    workout.sections.forEach(sec=>sec.exercises.forEach(ex=>{
      sets[ex.id||ex.name]=Array.from({length:ex.sets},()=>({weight:"",reps:"",done:false}));
    }));
    const newSession={dayId,sets,isCustom:!!customWorkout,customId:customWorkout?.id};
    setSession(newSession);setActiveDay(dayId);setRestTimer(null);setTab("session");
  }

  function getSessionWorkout(){
    if(!session)return null;
    if(session.isCustom)return customWorkouts.find(cw=>cw.id===session.customId)||getWorkout(session.dayId);
    return getWorkout(session.dayId);
  }

  function logSet(exKey,idx,weight,reps,isEdit){
    const w=getSessionWorkout();
    let restSecs=90;
    w.sections.forEach(sec=>sec.exercises.forEach(ex=>{if((ex.id||ex.name)===exKey)restSecs=ex.rest||90;}));
    const exSets=session.sets[exKey];
    const isLastSet=idx>=(exSets?.length||0)-1;
    setSession(prev=>{
      const updated={...prev,sets:{...prev.sets,[exKey]:prev.sets[exKey].map((s,i)=>i===idx?{weight,reps,done:true}:s)}};
      LS.set("grind_active_session",{session:updated,elapsed});
      return updated;
    });
    setSetInput(null);setWt("");setRp("");
    if(!isEdit&&!isLastSet&&restSecs>0)setRestTimer({remaining:restSecs,total:restSecs,exKey,nextSetIdx:idx+1});
  }

  function skipSet(exKey,idx){
    setSession(prev=>{
      const updated={...prev,sets:{...prev.sets,[exKey]:prev.sets[exKey].map((s,i)=>i===idx?{...s,done:true}:s)}};
      LS.set("grind_active_session",{session:updated,elapsed});return updated;
    });
    setSetInput(null);setWt("");setRp("");setRestTimer(null);
  }

  function openSetInput(exKey,idx,isEdit){
    const set=session.sets[exKey]?.[idx];
    if(restTimer&&!isEdit)setRestTimer(null);
    setSetInput({exKey,idx,isEdit:!!isEdit});
    setWt(set?.weight||"");setRp(set?.reps||"");
  }

  function finishSession(){
    const entry={date:today(),dayId:session.dayId,sets:session.sets,duration:elapsed,phase,isCustom:session.isCustom};
    const newH=[entry,...history].slice(0,120);
    saveHistory(newH);LS.del("grind_active_session");
    setSession(null);setActiveDay(null);setRestTimer(null);setElapsed(0);setTab("today");
  }

  function abandonSession(){
    if(window.confirm("Abandon session? Progress won't be saved.")){
      LS.del("grind_active_session");
      setSession(null);setActiveDay(null);setRestTimer(null);setElapsed(0);setTab("today");
    }
  }

  function getSectionExercises(sec,sectionIdx){
    const additions=session?.sessionExAdditions?.[sectionIdx]||[];
    return[...sec.exercises,...additions];
  }

  function addExToSession(sectionIdx,newEx){
    const key=newEx.id||newEx.name;
    setSession(prev=>{
      const sessionExAdditions={...(prev.sessionExAdditions||{})};
      if(!sessionExAdditions[sectionIdx])sessionExAdditions[sectionIdx]=[];
      sessionExAdditions[sectionIdx]=[...sessionExAdditions[sectionIdx],newEx];
      const updated={...prev,sets:{...prev.sets,[key]:Array.from({length:newEx.sets},()=>({weight:"",reps:"",done:false}))},sessionExAdditions};
      LS.set("grind_active_session",{session:updated,elapsed});return updated;
    });
    setAddExModal(null);
  }

  function removeSessionEx(sectionIdx,exKey){
    setSession(prev=>{
      const newAdditions={...(prev.sessionExAdditions||{})};
      if(newAdditions[sectionIdx])newAdditions[sectionIdx]=newAdditions[sectionIdx].filter(e=>(e.id||e.name)!==exKey);
      const newSets={...prev.sets};delete newSets[exKey];
      const updated={...prev,sets:newSets,sessionExAdditions:newAdditions};
      LS.set("grind_active_session",{session:updated,elapsed});return updated;
    });
  }

  function getEffectiveEx(originalEx){
    if(!session)return originalEx;
    const key=originalEx.id||originalEx.name;
    const swappedName=session.swaps?.[key];
    if(!swappedName)return originalEx;
    return session.swapData?.[key]||{...originalEx,name:swappedName};
  }

  function applySwap(originalKey,newEx,fromBuilder){
    if(fromBuilder){
      // In builder mode, directly replace the exercise
      setBuilder(prev=>{
        const w={...prev.workout};
        let found=false;
        w.sections=w.sections.map(sec=>({
          ...sec,
          exercises:sec.exercises.map(ex=>{
            if((ex.id||ex.name)===originalKey&&!found){
              found=true;
              return{...newEx,id:ex.id||uid(),superset:ex.superset};
            }
            return ex;
          })
        }));
        return{...prev,workout:w};
      });
      setSwapModal(null);
      return;
    }
    setSession(prev=>{
      const newSets={...prev.sets};
      const currentKey=prev.swaps?.[originalKey]||originalKey;
      delete newSets[currentKey];
      const newKey=newEx.id||newEx.name;
      newSets[newKey]=Array.from({length:newEx.sets},()=>({weight:"",reps:"",done:false}));
      const updated={...prev,sets:newSets,swaps:{...(prev.swaps||{}),[originalKey]:newKey},swapData:{...(prev.swapData||{}),[originalKey]:newEx}};
      LS.set("grind_active_session",{session:updated,elapsed});return updated;
    });
    setSwapModal(null);
  }

  function revertSwap(originalKey,originalEx){
    setSession(prev=>{
      const newSets={...prev.sets};
      const currentKey=prev.swaps?.[originalKey]||originalKey;
      delete newSets[currentKey];
      newSets[originalKey]=Array.from({length:originalEx.sets},()=>({weight:"",reps:"",done:false}));
      const newSwaps={...(prev.swaps||{})};delete newSwaps[originalKey];
      const newSwapData={...(prev.swapData||{})};delete newSwapData[originalKey];
      const updated={...prev,sets:newSets,swaps:newSwaps,swapData:newSwapData};
      LS.set("grind_active_session",{session:updated,elapsed});return updated;
    });
    setSwapModal(null);
  }

  function saveNote(exName,value){const n={...notes,[exName]:value};saveNotes(n);setNoteEditor(null);}

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
    const all=Object.values(session.sets).flat();
    return all.length?Math.round(all.filter(s=>s.done).length/all.length*100):0;
  }

  // Builder functions
  function newCustomWorkout(){
    setBuilder({mode:"new",workout:{id:uid(),name:"",subtitle:"",color:DAY_COLORS[customWorkouts.length%DAY_COLORS.length],sections:[{title:"Main",exercises:[]}]}});
  }
  function editCustomWorkout(cw){setBuilder({mode:"edit",workout:JSON.parse(JSON.stringify(cw))});}
  function editPresetWorkout(dayId){
    const workout=getWorkout(dayId);
    setBuilder({mode:"preset",presetDayId:dayId,workout:JSON.parse(JSON.stringify(workout))});
  }
  function deleteCustomWorkout(id){
    if(!window.confirm("Delete this custom workout?"))return;
    saveCustomWorkouts(customWorkouts.filter(cw=>cw.id!==id));
  }
  function resetPresetWorkout(dayId){
    if(!window.confirm("Reset to original? Your edits will be lost."))return;
    const newOverrides={...presetOverrides};delete newOverrides[dayId];savePresetOverrides(newOverrides);
  }
  function saveBuilderWorkout(){
    if(!builder.workout.name.trim()){alert("Give your workout a name first.");return;}
    if(builder.mode==="preset"){
      savePresetOverrides({...presetOverrides,[builder.presetDayId]:builder.workout});
    } else if(builder.mode==="new"){
      saveCustomWorkouts([...customWorkouts,builder.workout]);
    } else {
      saveCustomWorkouts(customWorkouts.map(cw=>cw.id===builder.workout.id?builder.workout:cw));
    }
    setBuilder(null);
  }
  function builderAddEx(sectionIdx,ex){
    setBuilder(prev=>{
      const w={...prev.workout};
      w.sections=w.sections.map((sec,si)=>si!==sectionIdx?sec:{...sec,exercises:[...sec.exercises,{...ex,id:uid()}]});
      return{...prev,workout:w};
    });
    setBuilderEx(null);
  }
  function builderUpdateEx(sectionIdx,exIdx,ex){
    setBuilder(prev=>{
      const w={...prev.workout};
      w.sections=w.sections.map((sec,si)=>si!==sectionIdx?sec:{...sec,exercises:sec.exercises.map((e,ei)=>ei!==exIdx?e:{...e,...ex})});
      return{...prev,workout:w};
    });
    setBuilderEx(null);
  }
  function builderDeleteEx(sectionIdx,exIdx){
    setBuilder(prev=>{
      const w={...prev.workout};
      w.sections=w.sections.map((sec,si)=>si!==sectionIdx?sec:{...sec,exercises:sec.exercises.filter((_,ei)=>ei!==exIdx)});
      return{...prev,workout:w};
    });
  }
  function builderAddSection(){
    setBuilder(prev=>({...prev,workout:{...prev.workout,sections:[...prev.workout.sections,{title:"New Section",exercises:[]}]}}));
  }
  function builderDeleteSection(sectionIdx){
    setBuilder(prev=>({...prev,workout:{...prev.workout,sections:prev.workout.sections.filter((_,si)=>si!==sectionIdx)}}));
  }
  function builderToggleSuperset(sectionIdx,exIdx){
    setBuilder(prev=>{
      const w={...prev.workout};
      const sec=w.sections[sectionIdx];
      const ex=sec.exercises[exIdx];
      const prevEx=sec.exercises[exIdx-1];
      // If already in a superset, remove it
      if(ex.superset){
        w.sections=w.sections.map((s,si)=>si!==sectionIdx?s:{...s,exercises:s.exercises.map((e,ei)=>ei===exIdx?{...e,superset:undefined}:e)});
      } else if(prevEx){
        // Pair with previous exercise
        const ssId=prevEx.superset||`ss_${uid()}`;
        w.sections=w.sections.map((s,si)=>si!==sectionIdx?s:{...s,exercises:s.exercises.map((e,ei)=>{
          if(ei===exIdx)return{...e,superset:ssId};
          if(ei===exIdx-1&&!e.superset)return{...e,superset:ssId};
          return e;
        })});
      }
      return{...prev,workout:w};
    });
  }

  // Group exercises by superset for rendering
  function groupBySupersets(exercises){
    const groups=[];
    const processed=new Set();
    exercises.forEach((ex,idx)=>{
      if(processed.has(idx))return;
      if(ex.superset){
        const ssId=ex.superset;
        const ssExes=exercises.map((e,i)=>({...e,_idx:i})).filter(e=>e.superset===ssId);
        ssExes.forEach(e=>processed.add(e._idx));
        groups.push({type:"superset",ssId,exercises:ssExes});
      } else {
        processed.add(idx);
        groups.push({type:"single",exercises:[{...ex,_idx:idx}]});
      }
    });
    return groups;
  }

  // ── MODALS ───────────────────────────────────────────────────────────────

  function NoteEditorModal(){
    if(!noteEditor)return null;
    const[val,setVal]=useState(noteEditor.value);
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{width:"100%",maxWidth:"430px",background:"#111",borderRadius:"16px 16px 0 0",padding:"20px 16px calc(env(safe-area-inset-bottom,0px) + 20px)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
            <div>
              <div style={{fontSize:"10px",color:"#555",letterSpacing:"2px"}}>NOTE FOR</div>
              <div style={{fontSize:"16px",fontWeight:800,color:"#ddd"}}>{noteEditor.exName}</div>
            </div>
            <button onClick={()=>setNoteEditor(null)} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
          </div>
          <textarea value={val} onChange={e=>setVal(e.target.value)} placeholder="Form cues, weight targets, how it felt..."
            autoFocus style={{width:"100%",minHeight:"110px",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"10px",color:"#ddd",fontSize:"14px",padding:"12px",outline:"none",resize:"none",fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1.5}}/>
          <div style={{display:"flex",gap:"8px",marginTop:"10px"}}>
            <button style={{...S.btn("#e8a838",false),flex:2,padding:"12px"}} onClick={()=>saveNote(noteEditor.exName,val)}>SAVE NOTE</button>
            {noteEditor.value&&<button style={{...S.btn("#c0392b",true),flex:1,padding:"12px"}} onClick={()=>saveNote(noteEditor.exName,"")}>CLEAR</button>}
          </div>
        </div>
      </div>
    );
  }

  function SwapModal(){
    if(!swapModal)return null;
    const{originalKey,originalEx,fromBuilder}=swapModal;
    const[search,setSearch]=useState("");
    const[libTab,setLibTab]=useState("suggested");
    const presetSwaps=SWAPS[originalEx?.name]||[];
    const suggested=getSuggestedSwaps(originalEx);
    const isSwapped=!fromBuilder&&!!(session?.swaps?.[originalKey]);

    const libFiltered=EXERCISE_LIBRARY.filter(e=>e.name!==originalEx?.name&&e.name.toLowerCase().includes(search.toLowerCase()));

    function renderExCard(opt,i){
      const isActive=!fromBuilder&&session?.swaps?.[originalKey]===(opt.id||opt.name);
      return(
        <div key={i} onClick={()=>applySwap(originalKey,opt,fromBuilder)}
          style={{padding:"13px 16px",background:isActive?"#0e1a0e":"#161616",border:`1px solid ${isActive?"#27ae60":"#222"}`,borderRadius:"10px",marginBottom:"7px",cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
            <div style={{fontSize:"14px",fontWeight:800,color:isActive?"#27ae60":"#ccc"}}>{opt.name}</div>
            <div style={{display:"flex",gap:"5px"}}>
              <span style={S.tag("#1a1a1a","#444")}>{opt.sets||3}×</span>
              <span style={S.tag("#1a1a1a","#444")}>{opt.target||"10 reps"}</span>
            </div>
          </div>
          {opt.note&&<div style={{fontSize:"10px",color:"#3a3a3a",lineHeight:1.4,marginBottom:"5px"}}>{opt.note}</div>}
          <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
            {(opt.tags||[]).slice(0,5).map(t=><span key={t} style={S.tag("#1a1a1a","#2a5a2a")}>{t}</span>)}
          </div>
          {isActive&&<div style={{fontSize:"9px",color:"#27ae60",fontWeight:800,marginTop:"5px",letterSpacing:"1px"}}>ACTIVE ✓</div>}
        </div>
      );
    }

    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{width:"100%",maxWidth:"430px",background:"#111",borderRadius:"16px 16px 0 0",padding:"20px 16px calc(env(safe-area-inset-bottom,0px) + 16px)",maxHeight:"88vh",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"12px",flexShrink:0}}>
            <div>
              <div style={{fontSize:"10px",color:"#555",letterSpacing:"2px"}}>SWAP</div>
              <div style={{fontSize:"16px",fontWeight:800,color:"#ddd"}}>{originalEx?.name}</div>
              {originalEx?.tags?.length>0&&<div style={{display:"flex",gap:"4px",marginTop:"4px",flexWrap:"wrap"}}>
                {originalEx.tags.slice(0,5).map(t=><span key={t} style={S.tag("#1a1a1a","#3a5a3a")}>{t}</span>)}
              </div>}
            </div>
            <button onClick={()=>setSwapModal(null)} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
          </div>
          {isSwapped&&(
            <button onClick={()=>revertSwap(originalKey,originalEx)}
              style={{width:"100%",padding:"11px",background:"#1a0800",border:"1px solid #e05c2a40",borderRadius:"10px",color:"#e05c2a",fontSize:"13px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",marginBottom:"10px",flexShrink:0}}>
              ↩ REVERT TO ORIGINAL
            </button>
          )}
          {/* Tabs */}
          <div style={{display:"flex",gap:"6px",marginBottom:"10px",flexShrink:0}}>
            {["suggested","presets","library"].map(t=>(
              <button key={t} onClick={()=>setLibTab(t)}
                style={{flex:1,padding:"8px",background:libTab===t?"#e8a838":"#1a1a1a",border:`1px solid ${libTab===t?"#e8a838":"#252525"}`,borderRadius:"8px",color:libTab===t?"#000":"#555",fontSize:"10px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          {libTab==="library"&&(
            <input style={{...S.textInp,marginBottom:"10px",flexShrink:0}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search exercises..." autoFocus/>
          )}
          <div style={{flex:1,overflowY:"auto"}}>
            {libTab==="suggested"&&(suggested.length>0?suggested.map(renderExCard):<div style={{textAlign:"center",padding:"30px 0",color:"#333",fontSize:"12px"}}>No tag matches found</div>)}
            {libTab==="presets"&&(presetSwaps.length>0?presetSwaps.map(renderExCard):<div style={{textAlign:"center",padding:"30px 0",color:"#333",fontSize:"12px"}}>No preset swaps defined</div>)}
            {libTab==="library"&&libFiltered.map(renderExCard)}
          </div>
        </div>
      </div>
    );
  }

  // Combined add exercise modal — library picker + custom
  function AddExModal(){
    if(addExModal===null)return null;
    const{sectionIdx,fromBuilder}=addExModal;
    const[mode,setMode]=useState("library");
    const[search,setSearch]=useState("");
    const[tagFilter,setTagFilter]=useState("");
    const[name,setName]=useState("");
    const[sets,setSets]=useState("3");
    const[target,setTarget]=useState("10 reps");
    const[rest,setRest]=useState("90");
    const[note,setNote]=useState("");

    const filtered=EXERCISE_LIBRARY.filter(e=>{
      const matchSearch=e.name.toLowerCase().includes(search.toLowerCase());
      const matchTag=!tagFilter||(e.tags||[]).includes(tagFilter);
      return matchSearch&&matchTag;
    });

    function submitCustom(){
      if(!name.trim())return;
      const newEx={id:uid(),name:name.trim(),sets:parseInt(sets)||3,target,rest:parseInt(rest)||90,note,tags:[]};
      if(fromBuilder)builderAddEx(sectionIdx,newEx);
      else addExToSession(sectionIdx,newEx);
      setAddExModal(null);
    }

    function pickLibraryEx(ex){
      const newEx={...ex,id:uid()};
      if(fromBuilder)builderAddEx(sectionIdx,newEx);
      else addExToSession(sectionIdx,newEx);
      setAddExModal(null);
    }

    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{width:"100%",maxWidth:"430px",background:"#111",borderRadius:"16px 16px 0 0",padding:"16px 16px calc(env(safe-area-inset-bottom,0px) + 16px)",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexShrink:0}}>
            <div style={{fontSize:"16px",fontWeight:800,color:"#ddd"}}>ADD EXERCISE</div>
            <button onClick={()=>setAddExModal(null)} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
          </div>
          <div style={{display:"flex",gap:"6px",marginBottom:"12px",flexShrink:0}}>
            {["library","custom"].map(m=>(
              <button key={m} onClick={()=>setMode(m)}
                style={{flex:1,padding:"9px",background:mode===m?"#e8a838":"#1a1a1a",border:`1px solid ${mode===m?"#e8a838":"#252525"}`,borderRadius:"8px",color:mode===m?"#000":"#555",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                {m==="library"?"EXERCISE LIBRARY":"CUSTOM"}
              </button>
            ))}
          </div>
          {mode==="library"&&(
            <>
              <input style={{...S.textInp,marginBottom:"8px",flexShrink:0}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search exercises..." autoFocus/>
              <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"10px",flexShrink:0}}>
                {["",..."quad","hamstring","glute","chest","back","shoulder","tricep","bicep"].map(t=>(
                  <button key={t} onClick={()=>setTagFilter(t)}
                    style={{padding:"4px 9px",background:tagFilter===t?"#e8a838":"#1a1a1a",border:`1px solid ${tagFilter===t?"#e8a838":"#252525"}`,borderRadius:"6px",color:tagFilter===t?"#000":"#555",fontSize:"9px",fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                    {t||"ALL"}
                  </button>
                ))}
              </div>
              <div style={{flex:1,overflowY:"auto"}}>
                {filtered.map((ex,i)=>(
                  <div key={i} onClick={()=>pickLibraryEx(ex)}
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
          {mode==="custom"&&(
            <div style={{flex:1,overflowY:"auto"}}>
              <div style={{marginBottom:"10px"}}>
                <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>EXERCISE NAME</div>
                <input style={S.textInp} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Walking Lunges" autoFocus/>
              </div>
              <div style={{display:"flex",gap:"10px",marginBottom:"10px"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>SETS</div>
                  <input style={{...S.inp,fontSize:"18px",padding:"10px"}} type="number" inputMode="numeric" value={sets} onChange={e=>setSets(e.target.value)}/>
                </div>
                <div style={{flex:2}}>
                  <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>TARGET</div>
                  <input style={S.textInp} value={target} onChange={e=>setTarget(e.target.value)} placeholder="10 reps"/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>REST (sec)</div>
                  <input style={{...S.inp,fontSize:"18px",padding:"10px"}} type="number" inputMode="numeric" value={rest} onChange={e=>setRest(e.target.value)}/>
                </div>
              </div>
              <div style={{marginBottom:"12px"}}>
                <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>COACHING NOTE (optional)</div>
                <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Form cues, technique..."
                  style={{...S.textInp,minHeight:"70px",resize:"none",lineHeight:1.5}}/>
              </div>
              <button style={{...S.btn("#e8a838",false),padding:"13px"}} onClick={submitCustom}>ADD EXERCISE →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function BuilderExModal(){
    if(!builderEx)return null;
    const{sectionIdx,exIdx,ex}=builderEx;
    const isEdit=exIdx!==undefined;
    const[name,setName]=useState(ex?.name||"");
    const[sets,setSets]=useState(String(ex?.sets||3));
    const[target,setTarget]=useState(ex?.target||"10 reps");
    const[rest,setRest]=useState(String(ex?.rest||90));
    const[note,setNote]=useState(ex?.note||"");
    function submit(){
      if(!name.trim())return;
      const newEx={name:name.trim(),sets:parseInt(sets)||3,target,rest:parseInt(rest)||90,note};
      if(isEdit)builderUpdateEx(sectionIdx,exIdx,newEx);
      else builderAddEx(sectionIdx,newEx);
    }
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:110,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{width:"100%",maxWidth:"430px",background:"#111",borderRadius:"16px 16px 0 0",padding:"20px 16px calc(env(safe-area-inset-bottom,0px) + 20px)",maxHeight:"90vh",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
            <div style={{fontSize:"16px",fontWeight:800,color:"#ddd"}}>{isEdit?"EDIT":"ADD"} EXERCISE</div>
            <button onClick={()=>setBuilderEx(null)} style={{background:"none",border:"none",color:"#444",fontSize:"22px",cursor:"pointer"}}>✕</button>
          </div>
          {[{label:"EXERCISE NAME",val:name,set:setName,ph:"e.g. Walking Lunges",type:"text"},{label:"TARGET",val:target,set:setTarget,ph:"10 reps",type:"text"}].map(f=>(
            <div key={f.label} style={{marginBottom:"10px"}}>
              <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>{f.label}</div>
              <input style={S.textInp} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}/>
            </div>
          ))}
          <div style={{display:"flex",gap:"10px",marginBottom:"10px"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>SETS</div>
              <input style={{...S.inp,fontSize:"18px",padding:"10px"}} type="number" inputMode="numeric" value={sets} onChange={e=>setSets(e.target.value)}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>REST (sec)</div>
              <input style={{...S.inp,fontSize:"18px",padding:"10px"}} type="number" inputMode="numeric" value={rest} onChange={e=>setRest(e.target.value)}/>
            </div>
          </div>
          <div style={{marginBottom:"12px"}}>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px"}}>COACHING NOTE (optional)</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Form cues..."
              style={{...S.textInp,minHeight:"70px",resize:"none",lineHeight:1.5}}/>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <button style={{...S.btn("#e8a838",false),flex:2,padding:"12px"}} onClick={submit}>{isEdit?"UPDATE":"ADD EXERCISE"}</button>
            {isEdit&&<button style={{...S.btn("#c0392b",true),flex:1,padding:"12px"}} onClick={()=>{builderDeleteEx(sectionIdx,exIdx);setBuilderEx(null);}}>DELETE</button>}
          </div>
        </div>
      </div>
    );
  }

  function RestOverlay(){
    if(!restTimer)return null;
    const pct=restTimer.remaining/restTimer.total;
    const isAlmost=restTimer.remaining<=10;
    const color=isAlmost?"#27ae60":"#e8a838";
    const R=22,circ=2*Math.PI*R;
    return(
      <div style={{margin:"10px 16px 0"}}>
        <div style={{background:"#0e0e0e",border:`1px solid ${color}40`,borderLeft:`3px solid ${color}`,borderRadius:"12px",padding:"12px 14px",display:"flex",alignItems:"center",gap:"14px"}}>
          <div style={{position:"relative",flexShrink:0,width:"52px",height:"52px"}}>
            <svg width="52" height="52" style={{transform:"rotate(-90deg)"}}>
              <circle cx="26" cy="26" r={R} fill="none" stroke="#1a1a1a" strokeWidth="4"/>
              <circle cx="26" cy="26" r={R} fill="none" stroke={color} strokeWidth="4"
                strokeDasharray={`${circ} ${circ}`} strokeDashoffset={(circ*(1-pct)).toFixed(1)}
                strokeLinecap="round" style={{transition:"stroke-dashoffset 0.9s linear,stroke 0.3s"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:"14px",fontWeight:900,color,fontVariantNumeric:"tabular-nums"}}>{restTimer.remaining}</span>
            </div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px"}}>RESTING</div>
            <div style={{fontSize:"13px",fontWeight:800,color:"#bbb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{restTimer.exKey}</div>
            <div style={{fontSize:"10px",color:"#333",marginTop:"2px"}}>Set {restTimer.nextSetIdx+1} next · {fmtDur(restTimer.total)} total</div>
          </div>
          <button onClick={()=>setRestTimer(null)} style={{background:"#1a1a1a",border:"1px solid #252525",borderRadius:"8px",color:"#555",fontSize:"10px",fontWeight:700,padding:"8px 10px",cursor:"pointer",flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>SKIP</button>
        </div>
        {isAlmost&&<div style={{textAlign:"center",padding:"5px 0 0",fontSize:"10px",color:"#27ae60",fontWeight:800,letterSpacing:"2px"}}>GET READY</div>}
      </div>
    );
  }

  // Render a single exercise row (used in session)
  function ExerciseRow({originalEx,isSessionAdded,sectionIdx}){
    const ex=isSessionAdded?originalEx:getEffectiveEx(originalEx);
    const exKey=ex.id||ex.name;
    const originalKey=originalEx.id||originalEx.name;
    const isSwapped=!isSessionAdded&&exKey!==originalKey;
    const exSets=session.sets[exKey]||[];
    const allDone=exSets.every(s=>s.done);
    const hasNote=!!notes[exKey];
    const hasSwapOptions=!isSessionAdded;
    return(
      <div style={{padding:"13px 16px",borderBottom:"1px solid #0f0f0f",background:allDone?"#0c130c":"transparent"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"8px",marginBottom:"8px"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
              <div style={{fontSize:"14px",fontWeight:700,color:allDone?"#27ae60":"#ccc"}}>{ex.name}</div>
              {isSwapped&&<span style={S.tag("#1a0800","#e05c2a")}>SWAPPED</span>}
              {isSessionAdded&&<span style={S.tag("#0a1a2a","#4a9eda")}>ADDED</span>}
            </div>
            {isSwapped&&<div style={{fontSize:"9px",color:"#3a2a1a",marginTop:"1px"}}>Original: {originalEx.name}</div>}
            <div style={{fontSize:"10px",color:"#333",marginTop:"2px"}}>{ex.sets} sets · {ex.target}</div>
            {ex.note&&<div style={{fontSize:"9px",color:"#272727",marginTop:"2px",fontStyle:"italic",lineHeight:1.4}}>{ex.note}</div>}
            {(ex.rest||0)>0&&<div style={{fontSize:"9px",color:"#1e3020",marginTop:"2px"}}>⏱ {fmtDur(ex.rest)} rest</div>}
            {hasNote&&(
              <div style={{marginTop:"6px",padding:"5px 8px",background:"#0e1a0e",border:"1px solid #1a3a1a",borderRadius:"6px",display:"flex",gap:"6px"}}>
                <span style={{fontSize:"9px",color:"#27ae60",fontWeight:700,flexShrink:0}}>NOTE</span>
                <span style={{fontSize:"10px",color:"#3a6a3a",lineHeight:1.4}}>{notes[exKey]}</span>
              </div>
            )}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"5px",alignItems:"flex-end"}}>
            {allDone&&<div style={{fontSize:"16px",color:"#27ae60"}}>✓</div>}
            <button onClick={()=>setNoteEditor({exName:exKey,value:notes[exKey]||""})}
              style={{background:hasNote?"#0e1a0e":"#1a1a1a",border:`1px solid ${hasNote?"#1a3a1a":"#252525"}`,borderRadius:"6px",color:hasNote?"#27ae60":"#333",fontSize:"9px",fontWeight:700,padding:"4px 8px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
              {hasNote?"NOTE ✓":"+ NOTE"}
            </button>
            {hasSwapOptions&&(
              <button onClick={()=>setSwapModal({originalKey,originalEx,fromBuilder:false})}
                style={{background:isSwapped?"#1a0800":"#1a1a1a",border:`1px solid ${isSwapped?"#e05c2a40":"#252525"}`,borderRadius:"6px",color:isSwapped?"#e05c2a":"#444",fontSize:"9px",fontWeight:700,padding:"4px 8px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                ⇄ SWAP
              </button>
            )}
            {isSessionAdded&&(
              <button onClick={()=>removeSessionEx(sectionIdx,exKey)}
                style={{background:"#1a0a0a",border:"1px solid #c0392b30",borderRadius:"6px",color:"#c0392b",fontSize:"9px",fontWeight:700,padding:"4px 8px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                ✕ REMOVE
              </button>
            )}
          </div>
        </div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          {exSets.map((set,si2)=>{
            const isCurr=setInput?.exKey===exKey&&setInput?.idx===si2&&!setInput?.isEdit;
            const isEditing=setInput?.exKey===exKey&&setInput?.idx===si2&&setInput?.isEdit;
            const isRestNext=restTimer?.exKey===exKey&&restTimer?.nextSetIdx===si2;
            return(
              <div key={si2} onClick={()=>set.done?openSetInput(exKey,si2,true):openSetInput(exKey,si2,false)}
                style={{...S.chip(set.done,isCurr||isRestNext,isEditing),border:isRestNext&&!set.done?"2px solid #27ae60":S.chip(set.done,isCurr,isEditing).border}}>
                {set.done?(
                  <>{set.weight?<span style={{fontSize:"9px",fontWeight:800,color:isEditing?"#e05c2a":"#27ae60"}}>{set.weight}</span>:<span style={{fontSize:"13px",color:"#27ae60"}}>✓</span>}
                  {set.reps&&<span style={{fontSize:"8px",color:isEditing?"#6a3010":"#2a5a2a"}}>{set.reps}</span>}</>
                ):isRestNext?<span style={{fontSize:"9px",fontWeight:800,color:"#27ae60"}}>GO</span>
                :<span style={{fontSize:"12px",fontWeight:700,color:isCurr?"#e8a838":"#333"}}>{si2+1}</span>}
              </div>
            );
          })}
        </div>
        {allDone&&<div style={{fontSize:"9px",color:"#1e2e1e",marginTop:"6px",letterSpacing:"1px"}}>TAP ANY SET TO EDIT</div>}
      </div>
    );
  }

  // ── SESSION SCREEN ────────────────────────────────────────────────────────
  if(tab==="session"&&session){
    const w=getSessionWorkout();
    if(!w){setTab("today");return null;}
    const prog=sessionProg();
    const wColor=w.color||"#e8a838";

    return(
      <div style={S.app}>
        <NoteEditorModal/><SwapModal/><AddExModal/>
        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",paddingBottom:"24px"}}>

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

          {setInput&&(
            <div style={{margin:"10px 16px 0",background:"#161616",border:`1px solid ${setInput.isEdit?"#e05c2a":wColor}40`,borderRadius:"12px",padding:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"2px"}}>
                <div>
                  <div style={{fontSize:"10px",color:setInput.isEdit?"#e05c2a":wColor,fontWeight:800,letterSpacing:"2px"}}>{setInput.isEdit?"EDITING":"LOGGING"} SET {setInput.idx+1}</div>
                  <div style={{fontSize:"12px",color:"#888",marginTop:"1px"}}>{setInput.exKey}</div>
                </div>
                <button onClick={()=>setNoteEditor({exName:setInput.exKey,value:notes[setInput.exKey]||""})}
                  style={{background:"#1a1a1a",border:"1px solid #252525",borderRadius:"7px",color:"#555",fontSize:"10px",fontWeight:700,padding:"6px 10px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                  + NOTE
                </button>
              </div>
              {notes[setInput.exKey]&&(
                <div style={{padding:"7px 10px",background:"#0e1a0e",border:"1px solid #1a3a1a",borderRadius:"7px",marginBottom:"10px",marginTop:"6px"}}>
                  <div style={{fontSize:"9px",color:"#27ae60",letterSpacing:"2px",marginBottom:"3px"}}>YOUR NOTE</div>
                  <div style={{fontSize:"12px",color:"#4a8a4a",lineHeight:1.4}}>{notes[setInput.exKey]}</div>
                </div>
              )}
              {(()=>{const l=getLastLog(setInput.exKey);return(
                <div style={{fontSize:"10px",color:"#3a3a3a",marginBottom:"10px"}}>{l?`Last: ${l.weight} lbs × ${l.reps} reps`:"No previous log"}</div>
              );})()}
              <div style={{display:"flex",gap:"10px",marginBottom:"10px"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"9px",color:"#3a3a3a",letterSpacing:"2px",marginBottom:"5px"}}>WEIGHT (lbs)</div>
                  <input style={S.inp} type="number" inputMode="decimal" value={wt} onChange={e=>setWt(e.target.value)} placeholder="135" autoFocus/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"9px",color:"#3a3a3a",letterSpacing:"2px",marginBottom:"5px"}}>REPS</div>
                  <input style={S.inp} type="number" inputMode="numeric" value={rp} onChange={e=>setRp(e.target.value)} placeholder="8"/>
                </div>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <button style={{...S.btn(setInput.isEdit?"#e05c2a":"#e8a838",false),flex:2,padding:"12px"}} onClick={()=>logSet(setInput.exKey,setInput.idx,wt||"BW",rp||"—",setInput.isEdit)}>
                  {setInput.isEdit?"UPDATE ✓":"LOG ✓"}
                </button>
                {!setInput.isEdit&&<button style={{...S.btn("#333",true),flex:1,padding:"12px"}} onClick={()=>skipSet(setInput.exKey,setInput.idx)}>SKIP</button>}
                <button style={{...S.btn("#333",true),flex:1,padding:"12px"}} onClick={()=>{setSetInput(null);setWt("");setRp("");}}>✕</button>
              </div>
            </div>
          )}

          {w.sections.map((sec,si)=>{
            const allExercises=getSectionExercises(sec,si);
            const presetExes=sec.exercises;
            const addedExes=session?.sessionExAdditions?.[si]||[];
            const groups=groupBySupersets(allExercises);

            return(
              <div key={si} style={S.card}>
                <div style={S.secHd(wColor)}>{sec.title.toUpperCase()}</div>
                {groups.map((group,gi)=>{
                  if(group.type==="single"){
                    const exObj=group.exercises[0];
                    const isAdded=exObj._idx>=presetExes.length;
                    return<ExerciseRow key={gi} originalEx={exObj} isSessionAdded={isAdded} sectionIdx={si}/>;
                  }
                  // Superset group
                  return(
                    <div key={gi} style={{borderBottom:"1px solid #0f0f0f"}}>
                      <div style={{padding:"6px 16px",background:"#0a1a0a",display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{flex:1,height:"1px",background:"#1a3a1a"}}/>
                        <span style={{fontSize:"9px",color:"#27ae60",fontWeight:800,letterSpacing:"2px",whiteSpace:"nowrap"}}>SUPERSET</span>
                        <div style={{flex:1,height:"1px",background:"#1a3a1a"}}/>
                      </div>
                      {group.exercises.map((exObj,ei)=>{
                        const isAdded=exObj._idx>=presetExes.length;
                        return(
                          <div key={ei} style={{borderLeft:"3px solid #27ae60",marginLeft:"0"}}>
                            <ExerciseRow originalEx={exObj} isSessionAdded={isAdded} sectionIdx={si}/>
                          </div>
                        );
                      })}
                      <div style={{padding:"5px 16px",background:"#0a1a0a"}}>
                        <div style={{fontSize:"9px",color:"#1a4a1a",letterSpacing:"1px"}}>↑ DO BACK TO BACK — REST AFTER FINAL EXERCISE</div>
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
    return(
      <div style={S.app}>
        <BuilderExModal/>
        <AddExModal/>
        <SwapModal/>
        <div style={{padding:"calc(env(safe-area-inset-top,0px) + 14px) 20px 12px",background:"#0a0a0a",borderBottom:"1px solid #1a1a1a",flexShrink:0,display:"flex",gap:"10px",alignItems:"center"}}>
          <button onClick={()=>setBuilder(null)} style={{background:"none",border:"none",color:"#555",fontSize:"26px",cursor:"pointer",lineHeight:1}}>‹</button>
          <div style={{flex:1,fontSize:"18px",fontWeight:900}}>{builder.mode==="new"?"NEW WORKOUT":builder.mode==="preset"?"EDIT PRESET":"EDIT WORKOUT"}</div>
          <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
            {builder.mode==="preset"&&presetOverrides[builder.presetDayId]&&(
              <button onClick={()=>{resetPresetWorkout(builder.presetDayId);setBuilder(null);}}
                style={{padding:"9px 14px",background:"#1a0a0a",border:"1px solid #c0392b40",borderRadius:"8px",color:"#c0392b",fontSize:"11px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>RESET</button>
            )}
            <button onClick={saveBuilderWorkout} style={{padding:"9px 16px",background:"#e8a838",border:"none",borderRadius:"8px",color:"#000",fontSize:"13px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>SAVE</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",paddingBottom:"24px"}}>
          <div style={{padding:"14px 16px 0"}}>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"6px"}}>WORKOUT NAME</div>
            <input style={S.textInp} value={bw.name} onChange={e=>setBuilder(prev=>({...prev,workout:{...prev.workout,name:e.target.value}}))} placeholder="e.g. Upper Body Finisher"/>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",margin:"10px 0 6px"}}>SUBTITLE (optional)</div>
            <input style={S.textInp} value={bw.subtitle} onChange={e=>setBuilder(prev=>({...prev,workout:{...prev.workout,subtitle:e.target.value}}))} placeholder="e.g. Pump day, accessory work"/>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",margin:"10px 0 6px"}}>COLOR</div>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
              {DAY_COLORS.map(c=>(
                <div key={c} onClick={()=>setBuilder(prev=>({...prev,workout:{...prev.workout,color:c}}))}
                  style={{width:"32px",height:"32px",borderRadius:"50%",background:c,border:bw.color===c?"3px solid #fff":"2px solid transparent",cursor:"pointer"}}/>
              ))}
            </div>
          </div>

          {bw.sections.map((sec,si)=>(
            <div key={si} style={S.card}>
              <div style={{padding:"9px 16px",background:`${bw.color}15`,borderBottom:"1px solid #1e1e1e",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <input value={sec.title} onChange={e=>setBuilder(prev=>{
                  const w={...prev.workout};
                  w.sections=w.sections.map((s,i)=>i===si?{...s,title:e.target.value}:s);
                  return{...prev,workout:w};
                })} style={{background:"none",border:"none",color:bw.color,fontSize:"10px",fontWeight:800,letterSpacing:"2px",outline:"none",fontFamily:"'Barlow Condensed',sans-serif",flex:1}}/>
                {bw.sections.length>1&&<button onClick={()=>builderDeleteSection(si)} style={{background:"none",border:"none",color:"#c0392b",fontSize:"14px",cursor:"pointer"}}>✕</button>}
              </div>
              {sec.exercises.map((ex,ei)=>{
                const exKey=ex.id||ex.name;
                const isInSS=!!ex.superset;
                return(
                  <div key={ei} style={{padding:"11px 16px",borderBottom:"1px solid #0f0f0f",borderLeft:isInSS?"3px solid #27ae60":"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                          <div style={{fontSize:"13px",fontWeight:700,color:"#ccc"}}>{ex.name}</div>
                          {isInSS&&<span style={S.tag("#0a1a0a","#27ae60")}>SS</span>}
                        </div>
                        <div style={{fontSize:"10px",color:"#333",marginTop:"2px"}}>{ex.sets} sets · {ex.target} · {fmtDur(ex.rest||90)} rest</div>
                      </div>
                      <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                        {/* Superset toggle */}
                        {ei>0&&(
                          <button onClick={()=>builderToggleSuperset(si,ei)}
                            style={{background:isInSS?"#0a1a0a":"#1a1a1a",border:`1px solid ${isInSS?"#27ae60":"#252525"}`,borderRadius:"6px",color:isInSS?"#27ae60":"#444",fontSize:"9px",fontWeight:700,padding:"4px 7px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                            SS
                          </button>
                        )}
                        {/* Swap button */}
                        <button onClick={()=>setSwapModal({originalKey:exKey,originalEx:ex,fromBuilder:true})}
                          style={{background:"#1a1a1a",border:"1px solid #252525",borderRadius:"6px",color:"#444",fontSize:"9px",fontWeight:700,padding:"4px 7px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
                          ⇄
                        </button>
                        <button onClick={()=>setBuilderEx({sectionIdx:si,exIdx:ei,ex})}
                          style={{background:"#1a1a1a",border:"1px solid #252525",borderRadius:"6px",color:"#666",fontSize:"12px",cursor:"pointer",padding:"4px 8px"}}>✏</button>
                        <button onClick={e=>{e.stopPropagation();builderDeleteEx(si,ei);}}
                          style={{background:"none",border:"none",color:"#c0392b",fontSize:"14px",cursor:"pointer",padding:"4px"}}>✕</button>
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

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  return(
    <div style={S.app}>
      <NoteEditorModal/><SwapModal/>

      <div style={S.hdr}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"9px",letterSpacing:"4px",color:"#e8a838",fontWeight:700}}>ROGER'S</div>
            <div style={{fontSize:"24px",fontWeight:900,lineHeight:1}}>SUMMER GRIND</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"2px"}}>PHASE · WEEK</div>
            <div style={{fontSize:"26px",fontWeight:900,color:PHASE_COLORS[phase],lineHeight:1}}>{phase} · {week}</div>
          </div>
        </div>
        {LS.get("grind_active_session")&&tab!=="session"&&(
          <div onClick={()=>{const s=LS.get("grind_active_session");if(s){setSession(s.session);setElapsed(s.elapsed||0);setActiveDay(s.session.dayId);setTab("session");}}}
            style={{marginTop:"10px",padding:"9px 12px",background:"#1a1200",border:"1px solid #e8a83840",borderRadius:"8px",cursor:"pointer"}}>
            <div style={{fontSize:"11px",color:"#e8a838",fontWeight:700}}>SESSION IN PROGRESS — RESUME →</div>
          </div>
        )}
      </div>

      <div style={S.body}>

        {tab==="today"&&(
          <>
            <div style={{padding:"14px 16px 0"}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"8px"}}>TODAY</div>
              {(()=>{
                const w=getWorkout(todayId);
                const logged=history.find(h=>h.date===today());
                return(
                  <div style={{background:w.color,borderRadius:"14px",padding:"20px",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",right:"-30px",top:"-30px",width:"120px",height:"120px",borderRadius:"50%",background:"rgba(0,0,0,0.08)"}}/>
                    <div style={{fontSize:"10px",fontWeight:800,color:"rgba(0,0,0,0.4)",letterSpacing:"2px"}}>{w.label.toUpperCase()}</div>
                    <div style={{fontSize:"32px",fontWeight:900,color:"#000",lineHeight:1,marginTop:"2px"}}>{w.name.toUpperCase()}</div>
                    <div style={{fontSize:"13px",color:"rgba(0,0,0,0.5)",marginTop:"4px"}}>{w.subtitle}</div>
                    {logged?(
                      <div style={{marginTop:"14px",padding:"10px 14px",background:"rgba(0,0,0,0.12)",borderRadius:"8px"}}>
                        <div style={{fontSize:"12px",color:"rgba(0,0,0,0.6)",fontWeight:700}}>✓ COMPLETED · {fmtDur(logged.duration||0)}</div>
                      </div>
                    ):(
                      <button onClick={()=>startSession(todayId)} style={{marginTop:"14px",width:"100%",padding:"13px",background:"rgba(0,0,0,0.88)",color:w.color,border:"none",borderRadius:"10px",fontSize:"14px",fontWeight:900,cursor:"pointer",letterSpacing:"1px",fontFamily:"'Barlow Condensed',sans-serif"}}>
                        START SESSION →
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
            <div style={{padding:"14px 16px 0"}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"8px"}}>PHASE</div>
              <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
                {[1,2,3].map(p=>(
                  <button key={p} onClick={()=>setPhase(p)} style={{flex:1,padding:"11px 8px",background:phase===p?PHASE_COLORS[p]:"#111",border:`1px solid ${phase===p?PHASE_COLORS[p]:"#1e1e1e"}`,borderRadius:"10px",cursor:"pointer",color:phase===p?"#000":"#3a3a3a",fontFamily:"'Barlow Condensed',sans-serif"}}>
                    <div style={{fontSize:"8px",fontWeight:700,letterSpacing:"1px"}}>PHASE</div>
                    <div style={{fontSize:"22px",fontWeight:900}}>{p}</div>
                    <div style={{fontSize:"9px",marginTop:"1px"}}>{PHASE_INFO[p].weeks}</div>
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"11px 14px",background:"#111",border:"1px solid #1e1e1e",borderRadius:"10px",marginBottom:"8px"}}>
                <div style={{flex:1,fontSize:"10px",color:"#444",letterSpacing:"2px"}}>WEEK</div>
                <button onClick={()=>setWeek(w=>Math.max(1,w-1))} style={{width:"34px",height:"34px",background:"#1a1a1a",border:"1px solid #252525",borderRadius:"7px",color:"#ccc",fontSize:"20px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>−</button>
                <div style={{fontSize:"26px",fontWeight:900,minWidth:"28px",textAlign:"center"}}>{week}</div>
                <button onClick={()=>setWeek(w=>Math.min(12,w+1))} style={{width:"34px",height:"34px",background:"#1a1a1a",border:"1px solid #252525",borderRadius:"7px",color:"#ccc",fontSize:"20px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>+</button>
              </div>
              <div style={{padding:"11px 14px",background:"#111",border:`1px solid ${PHASE_COLORS[phase]}20`,borderLeft:`3px solid ${PHASE_COLORS[phase]}`,borderRadius:"0 8px 8px 0"}}>
                <div style={{fontSize:"11px",color:PHASE_COLORS[phase],fontWeight:700,letterSpacing:"1px",marginBottom:"3px"}}>{PHASE_INFO[phase].name.toUpperCase()}</div>
                <div style={{fontSize:"10px",color:"#333",lineHeight:1.5}}>{PHASE_INFO[phase].desc}</div>
                <div style={{fontSize:"9px",color:"#252525",marginTop:"5px"}}>Tempo: {TEMPO[phase]}</div>
              </div>
            </div>
            <div style={{padding:"14px 16px 0"}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"8px"}}>WEEK SCHEDULE</div>
              {DAY_ORDER.map(dayId=>{
                const w=getWorkout(dayId);
                const isToday=dayId===todayId;
                const logged=history.find(h=>h.dayId===dayId&&h.date===today());
                return(
                  <div key={dayId} onClick={()=>{setActiveDay(dayId);setTab("day");}} style={{display:"flex",alignItems:"center",gap:"12px",padding:"11px 14px",marginBottom:"5px",background:isToday?`${w.color}12`:"#111",border:`1px solid ${isToday?w.color+"30":"#1a1a1a"}`,borderRadius:"10px",cursor:"pointer"}}>
                    <div style={{width:"42px",height:"42px",borderRadius:"8px",background:isToday?w.color:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:"10px",fontWeight:900,color:isToday?"#000":"#333"}}>{w.label.slice(0,3).toUpperCase()}</span>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:"14px",fontWeight:800,color:isToday?w.color:"#777"}}>{w.name}</div>
                      <div style={{fontSize:"10px",color:"#2a2a2a"}}>{w.subtitle}</div>
                    </div>
                    {logged&&<span style={{fontSize:"13px",color:"#27ae60"}}>✓</span>}
                    {isToday&&!logged&&<span style={{fontSize:"9px",color:w.color,fontWeight:800,letterSpacing:"1px"}}>TODAY</span>}
                    <span style={{color:"#1e1e1e",fontSize:"16px"}}>›</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

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
              {w.sections.map((sec,si)=>{
                const groups=groupBySupersets(sec.exercises);
                return(
                  <div key={si} style={S.card}>
                    <div style={S.secHd(w.color)}>{sec.title.toUpperCase()}</div>
                    {groups.map((group,gi)=>{
                      if(group.type==="single"){
                        const ex=group.exercises[0];
                        const last=getLastLog(ex.id||ex.name);
                        const hasNote=!!notes[ex.id||ex.name];
                        return(
                          <div key={gi} style={{padding:"12px 16px",borderBottom:"1px solid #0f0f0f"}}>
                            <div style={{display:"flex",justifyContent:"space-between",gap:"8px"}}>
                              <div style={{flex:1}}>
                                <div style={{fontSize:"14px",fontWeight:700,color:"#bbb"}}>{ex.name}</div>
                                <div style={{fontSize:"10px",color:"#2a2a2a",marginTop:"2px"}}>{ex.target}</div>
                                {ex.note&&<div style={{fontSize:"9px",color:"#222",fontStyle:"italic",marginTop:"2px",lineHeight:1.4}}>{ex.note}</div>}
                                {(ex.rest||0)>0&&<div style={{fontSize:"9px",color:"#1e3020",marginTop:"2px"}}>⏱ {fmtDur(ex.rest)} rest</div>}
                                {last&&<div style={{fontSize:"9px",color:`${w.color}70`,marginTop:"3px"}}>Last: {last.weight} lbs × {last.reps} reps</div>}
                                {hasNote&&<div style={{marginTop:"5px",padding:"4px 8px",background:"#0e1a0e",border:"1px solid #1a3a1a",borderRadius:"5px",fontSize:"9px",color:"#3a6a3a"}}>{notes[ex.id||ex.name]}</div>}
                              </div>
                              <span style={S.tag("#1a1a1a","#2a2a2a")}>{ex.sets}×</span>
                            </div>
                          </div>
                        );
                      }
                      return(
                        <div key={gi} style={{borderBottom:"1px solid #0f0f0f"}}>
                          <div style={{padding:"5px 16px",background:"#0a1a0a",display:"flex",alignItems:"center",gap:"8px"}}>
                            <div style={{flex:1,height:"1px",background:"#1a3a1a"}}/>
                            <span style={{fontSize:"9px",color:"#27ae60",fontWeight:800,letterSpacing:"2px"}}>SUPERSET</span>
                            <div style={{flex:1,height:"1px",background:"#1a3a1a"}}/>
                          </div>
                          {group.exercises.map((ex,ei)=>(
                            <div key={ei} style={{padding:"11px 16px",borderLeft:"3px solid #27ae60",borderBottom:ei<group.exercises.length-1?"1px solid #0f0f0f":"none"}}>
                              <div style={{fontSize:"13px",fontWeight:700,color:"#bbb"}}>{ex.name}</div>
                              <div style={{fontSize:"10px",color:"#2a2a2a"}}>{ex.target} · {ex.sets} sets</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div style={{height:"20px"}}/>
            </>
          );
        })()}

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
              const wColor=w.color||"#e8a838";
              return(
                <div key={i} style={{...S.card,marginBottom:"6px"}}>
                  <div style={{padding:"13px 16px",display:"flex",gap:"12px",alignItems:"center"}}>
                    <div style={{width:"46px",height:"46px",borderRadius:"10px",background:`${wColor}15`,border:`1px solid ${wColor}20`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <div style={{fontSize:"10px",color:wColor,fontWeight:800}}>{h.date?.slice(5,7)}/{h.date?.slice(8,10)}</div>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:"14px",fontWeight:800,color:"#bbb"}}>{w.name}</div>
                      <div style={{fontSize:"10px",color:"#2a2a2a"}}>Phase {h.phase||1} · {fmtDur(h.duration||0)}</div>
                      <div style={{display:"flex",gap:"6px",marginTop:"5px",flexWrap:"wrap"}}>
                        {done>0&&<span style={S.tag("#112211","#27ae60")}>{done} SETS</span>}
                        {maxWt>0&&<span style={S.tag("#111822","#4a9eda")}>MAX {maxWt}lbs</span>}
                        {h.isCustom&&<span style={S.tag("#0a1a2a","#4a9eda")}>CUSTOM</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="build"&&(
          <div style={{padding:"14px 16px 0"}}>
            <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px",marginBottom:"10px"}}>PRESET WORKOUTS</div>
            {DAY_ORDER.map(dayId=>{
              const w=getWorkout(dayId);
              const isEdited=!!presetOverrides[dayId];
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
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px",marginBottom:"10px"}}>
              <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"3px"}}>CUSTOM WORKOUTS</div>
              <button onClick={newCustomWorkout} style={{padding:"8px 14px",background:"#e8a838",border:"none",borderRadius:"8px",color:"#000",fontSize:"12px",fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>+ NEW</button>
            </div>
            {customWorkouts.length===0?(
              <div style={{textAlign:"center",padding:"30px 0",color:"#2a2a2a"}}>
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
          </div>
        )}

        {tab==="progress"&&(()=>{
          const KEY_LIFTS=["Barbell Back Squat","Flat Barbell Bench Press","Weighted Pull-Ups","Romanian Deadlift","Barbell Hip Thrust","Overhead Press","Incline Barbell Press","Trap Bar Deadlift","Barbell Bent-Over Row"];
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
                const data=getBest(lift);
                if(!data.length)return null;
                const max=Math.max(...data.map(d=>d.weight)),min=Math.min(...data.map(d=>d.weight));
                const latest=data[data.length-1],gained=latest.weight-data[0].weight;
                return(
                  <div key={lift} style={{...S.card,marginBottom:"8px"}}>
                    <div style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:"13px",fontWeight:700,color:"#bbb"}}>{lift}</div>
                          <div style={{fontSize:"10px",color:"#2a2a2a"}}>{data.length} sessions</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:"24px",fontWeight:900,color:"#e8a838",lineHeight:1}}>{latest.weight}<span style={{fontSize:"10px",color:"#333"}}> lbs</span></div>
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
              {KEY_LIFTS.every(l=>getBest(l).length===0)&&(
                <div style={{textAlign:"center",padding:"60px 0",color:"#222"}}>
                  <div style={{fontSize:"44px",marginBottom:"10px"}}>↑</div>
                  <div style={{fontSize:"15px",fontWeight:700}}>NO DATA YET</div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

      <div style={S.nav}>
        {[
          {id:"today",icon:"◎",label:"TODAY"},
          {id:"day",icon:"≡",label:"WORKOUT"},
          {id:"build",icon:"⊕",label:"BUILD"},
          {id:"history",icon:"⊞",label:"LOG"},
          {id:"progress",icon:"↑",label:"GAINS"},
        ].map(t=>(
          <button key={t.id} style={S.navBtn(tab===t.id)} onClick={()=>{if(t.id==="day")setActiveDay(todayId);setTab(t.id);}}>
            <span style={{fontSize:"16px",lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:"7px",fontWeight:800,letterSpacing:"1px"}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
