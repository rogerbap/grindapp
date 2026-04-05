import { useState, useEffect, useRef } from "react";
import { EXERCISE_LIBRARY } from "./workouts.js";

const CACHE_KEY = "wrk_exercise_cache";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const MUSCLE_GROUPS = ["chest","back","shoulders","quads","hamstrings","glutes","biceps","triceps","core","calves"];
const MUSCLE_MAP = { chest:"chest",back:"back",shoulders:"shoulder",quads:"quad",hamstrings:"hamstring",glutes:"glute",biceps:"bicep",triceps:"tricep",core:"core",calves:"calf" };
const EQUIPMENT_FILTER = ["barbell","dumbbell","cable","machine","bodyweight","band","kettlebell"];

const S = {
  app: { display:"flex", flexDirection:"column", height:"100%", background:"#080808", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif" },
  inp: { background:"#111", border:"1px solid #1e1e1e", borderRadius:"10px", color:"#f0f0f0", fontSize:"16px", padding:"13px 16px", width:"100%", outline:"none", fontFamily:"'Barlow Condensed',sans-serif" },
  tag: (a) => ({ padding:"7px 12px", background:a?"#e8a838":"#111", border:`1px solid ${a?"#e8a838":"#1e1e1e"}`, borderRadius:"8px", color:a?"#000":"#555", fontSize:"11px", fontWeight:700, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", whiteSpace:"nowrap" }),
  card: { background:"#111", border:"1px solid #1e1e1e", borderRadius:"12px", overflow:"hidden", marginBottom:"8px" },
};

function getCache() {
  try {
    const c = localStorage.getItem(CACHE_KEY);
    if (!c) return {};
    const parsed = JSON.parse(c);
    // Clean expired entries
    const now = Date.now();
    Object.keys(parsed).forEach(k => { if (parsed[k].ts + CACHE_TTL < now) delete parsed[k]; });
    return parsed;
  } catch { return {}; }
}

function setCache(key, data) {
  try {
    const cache = getCache();
    cache[key] = { data, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

async function fetchExternalExercises(muscle, equipment) {
  const cacheKey = `ext_${muscle}_${equipment}`;
  const cache = getCache();
  if (cache[cacheKey]) return cache[cacheKey].data;

  try {
    const url = equipment
      ? `https://exercisedb.p.rapidapi.com/exercises/equipment/${encodeURIComponent(equipment)}?limit=30`
      : muscle
      ? `https://exercisedb.p.rapidapi.com/exercises/target/${encodeURIComponent(muscle)}?limit=30`
      : `https://exercisedb.p.rapidapi.com/exercises?limit=30`;

    // ExerciseDB free endpoint (no key needed for basic access)
    const res = await fetch(`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json`);
    if (!res.ok) throw new Error("Failed");
    const all = await res.json();

    // Filter by muscle/equipment
    let filtered = all;
    if (muscle) filtered = filtered.filter(e =>
      e.primaryMuscles?.some(m => m.toLowerCase().includes(muscle.toLowerCase())) ||
      e.secondaryMuscles?.some(m => m.toLowerCase().includes(muscle.toLowerCase()))
    );
    if (equipment) filtered = filtered.filter(e =>
      e.equipment?.toLowerCase().includes(equipment.toLowerCase())
    );

    const mapped = filtered.slice(0, 40).map(e => ({
      name: e.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      category: e.category || "Strength",
      primaryMuscles: e.primaryMuscles || [],
      secondaryMuscles: e.secondaryMuscles || [],
      equipment: e.equipment || "bodyweight",
      instructions: e.instructions || [],
      external: true,
    }));

    setCache(cacheKey, mapped);
    return mapped;
  } catch {
    return [];
  }
}

export default function Search({ onAddToWorkout, userEquipment }) {
  const [query, setQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("");
  const [equipFilter, setEquipFilter] = useState("");
  const [showExternal, setShowExternal] = useState(false);
  const [externalResults, setExternalResults] = useState([]);
  const [loadingExt, setLoadingExt] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("library"); // library | external
  const searchRef = useRef(null);

  // Filter internal library
  const libraryResults = EXERCISE_LIBRARY.filter(ex => {
    const nameMatch = !query || ex.name.toLowerCase().includes(query.toLowerCase());
    const muscleMatch = !muscleFilter || (ex.tags||[]).includes(MUSCLE_MAP[muscleFilter]||muscleFilter);
    const equipMatch = !equipFilter || (ex.tags||[]).includes(equipFilter);
    // Apply user's equipment filter if set
    const userEquipMatch = !userEquipment?.length || userEquipment.some(eq =>
      (ex.tags||[]).some(t => t.includes(eq.replace("_"," ").split("_")[0]))
    );
    return nameMatch && muscleMatch && equipMatch;
  });

  async function loadExternal() {
    setLoadingExt(true);
    const muscle = muscleFilter ? MUSCLE_MAP[muscleFilter] || muscleFilter : "";
    const equip = equipFilter || "";
    const results = await fetchExternalExercises(muscle, equip);
    // Filter by query
    const filtered = query
      ? results.filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
      : results;
    setExternalResults(filtered);
    setLoadingExt(false);
  }

  useEffect(() => {
    if (activeTab === "external") loadExternal();
  }, [activeTab, muscleFilter, equipFilter]);

  function ExCard({ ex, i }) {
    const isExpanded = expanded === i;
    const isInternal = !ex.external;
    return (
      <div style={S.card}>
        <div style={{ padding:"13px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"10px" }}>
            <div style={{ flex:1 }} onClick={() => setExpanded(isExpanded ? null : i)}>
              <div style={{ fontSize:"15px", fontWeight:700, color:"#ccc", marginBottom:"4px" }}>{ex.name}</div>
              <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                {isInternal
                  ? (ex.tags||[]).slice(0,4).map(t => <span key={t} style={{ fontSize:"9px", padding:"2px 6px", background:"#1a1a1a", color:"#3a3a3a", borderRadius:"4px" }}>{t}</span>)
                  : [...(ex.primaryMuscles||[]).slice(0,2), ex.equipment].filter(Boolean).map((t,i) => <span key={i} style={{ fontSize:"9px", padding:"2px 6px", background:"#1a1a1a", color:"#3a3a3a", borderRadius:"4px" }}>{t}</span>)
                }
              </div>
            </div>
            {onAddToWorkout && (
              <button onClick={() => onAddToWorkout(isInternal ? ex : {
                name: ex.name, sets:3, target:"10 reps", rest:90,
                note: ex.instructions?.[0] || "",
                tags: [...(ex.primaryMuscles||[]), ex.equipment].filter(Boolean),
              })}
                style={{ padding:"7px 12px", background:"#1a2a1a", border:"1px solid #1a3a1a", borderRadius:"8px", color:"#27ae60", fontSize:"11px", fontWeight:800, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", flexShrink:0 }}>
                + ADD
              </button>
            )}
          </div>
          {isExpanded && !isInternal && ex.instructions?.length > 0 && (
            <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:"1px solid #1a1a1a" }}>
              <div style={{ fontSize:"10px", color:"#444", letterSpacing:"2px", marginBottom:"8px" }}>INSTRUCTIONS</div>
              {ex.instructions.slice(0,3).map((ins,i) => (
                <div key={i} style={{ fontSize:"12px", color:"#3a3a3a", marginBottom:"6px", lineHeight:1.5 }}>
                  {i+1}. {ins}
                </div>
              ))}
            </div>
          )}
          {isExpanded && isInternal && ex.note && (
            <div style={{ marginTop:"10px", paddingTop:"10px", borderTop:"1px solid #1a1a1a", fontSize:"12px", color:"#3a3a3a", lineHeight:1.5 }}>
              {ex.note}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <div style={{ padding:"14px 16px 0", flexShrink:0 }}>
        {/* Search input */}
        <input ref={searchRef} style={S.inp} value={query} onChange={e => { setQuery(e.target.value); setExpanded(null); }}
          placeholder="Search exercises..." autoFocus/>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"6px", margin:"10px 0" }}>
          {["library","external"].map(t => (
            <button key={t} onClick={() => { setActiveTab(t); setExpanded(null); }}
              style={{ ...S.tag(activeTab===t), flex:1, justifyContent:"center" }}>
              {t==="library" ? `LIBRARY (${EXERCISE_LIBRARY.length})` : "EXERCISE DB"}
            </button>
          ))}
        </div>

        {/* Muscle filter */}
        <div style={{ overflowX:"auto", display:"flex", gap:"6px", paddingBottom:"8px", marginBottom:"8px" }}>
          <button onClick={() => { setMuscleFilter(""); setExpanded(null); }} style={S.tag(!muscleFilter)}>All Muscles</button>
          {MUSCLE_GROUPS.map(m => (
            <button key={m} onClick={() => { setMuscleFilter(muscleFilter===m?"":m); setExpanded(null); }} style={S.tag(muscleFilter===m)}>
              {m.charAt(0).toUpperCase()+m.slice(1)}
            </button>
          ))}
        </div>

        {/* Equipment filter */}
        <div style={{ overflowX:"auto", display:"flex", gap:"6px", paddingBottom:"8px", marginBottom:"4px" }}>
          <button onClick={() => { setEquipFilter(""); setExpanded(null); }} style={S.tag(!equipFilter)}>All Equip</button>
          {EQUIPMENT_FILTER.map(e => (
            <button key={e} onClick={() => { setEquipFilter(equipFilter===e?"":e); setExpanded(null); }} style={S.tag(equipFilter===e)}>
              {e.charAt(0).toUpperCase()+e.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ flex:1, overflowY:"auto", padding:"8px 16px 24px" }}>
        {activeTab==="library" && (
          <>
            <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"2px", marginBottom:"10px" }}>
              {libraryResults.length} EXERCISE{libraryResults.length!==1?"S":""}
            </div>
            {libraryResults.map((ex,i) => <ExCard key={i} ex={ex} i={`lib_${i}`}/>)}
            {libraryResults.length===0&&<div style={{ textAlign:"center", padding:"40px 0", color:"#2a2a2a", fontSize:"14px" }}>No matches found</div>}
          </>
        )}
        {activeTab==="external" && (
          <>
            {loadingExt ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:"#2a2a2a", fontSize:"14px" }}>Loading exercises...</div>
            ) : (
              <>
                <div style={{ fontSize:"9px", color:"#2a2a2a", letterSpacing:"2px", marginBottom:"10px" }}>
                  {externalResults.length} RESULTS · Cached for 7 days
                </div>
                {externalResults.map((ex,i) => <ExCard key={i} ex={ex} i={`ext_${i}`}/>)}
                {externalResults.length===0&&<div style={{ textAlign:"center", padding:"40px 0", color:"#2a2a2a", fontSize:"14px" }}>No results — try different filters</div>}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
