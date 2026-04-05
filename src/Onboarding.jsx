import { useState } from "react";

const S = {
  app: { minHeight:"100dvh", background:"#080808", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif", display:"flex", flexDirection:"column", maxWidth:"430px", margin:"0 auto" },
  body: { flex:1, overflowY:"auto", padding:"24px 24px calc(env(safe-area-inset-bottom,0px) + 110px)", WebkitOverflowScrolling:"touch" },
  footer: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:"430px", padding:"12px 24px calc(env(safe-area-inset-bottom,0px) + 12px)", background:"linear-gradient(to top, #080808 80%, transparent)" },
  btn: (active) => ({ flex:1, padding:"14px 10px", background:active?"#e8a838":"#111", border:`1px solid ${active?"#e8a838":"#1e1e1e"}`, borderRadius:"10px", color:active?"#000":"#555", fontSize:"14px", fontWeight:800, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.5px", textAlign:"center", opacity:active?1:1 }),
  inp: { background:"#111", border:"1px solid #1e1e1e", borderRadius:"10px", color:"#f0f0f0", fontSize:"20px", fontWeight:700, padding:"16px", width:"100%", outline:"none", fontFamily:"'Barlow Condensed',sans-serif" },
  chip: (active) => ({ padding:"10px 16px", background:active?"#e8a838":"#111", border:`1px solid ${active?"#e8a838":"#1e1e1e"}`, borderRadius:"10px", color:active?"#000":"#555", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.1s" }),
};

const GOALS = [
  { id:"muscle",    label:"Build Muscle",         icon:"💪", desc:"Hypertrophy-focused — progressive overload, volume, isolation",
    preview:["Mon: Upper Body Push","Tue: Rest","Wed: Lower Body","Thu: Rest","Fri: Upper Body Pull","Sat: Full Body","Sun: Rest"] },
  { id:"fat_loss",  label:"Burn Fat",             icon:"🔥", desc:"High intensity, shorter rest, conditioning built in",
    preview:["Mon: Full Body Circuit","Tue: Cardio + Core","Wed: Lower Body","Thu: Rest","Fri: Full Body Circuit","Sat: Upper Body","Sun: Rest"] },
  { id:"athletic",  label:"Athletic Performance", icon:"⚡", desc:"Power, explosiveness, speed — sport-ready training",
    preview:["Mon: Sprints + Power","Tue: Rest","Wed: Lower A — Quad + Explosive","Thu: Upper A — Chest + Back","Fri: Lower B — Posterior","Sat: Upper B — Shoulders + Arms","Sun: Rest"] },
  { id:"strength",  label:"Get Stronger",         icon:"🏋", desc:"Strength-first — heavy compounds, low reps, long rest",
    preview:["Mon: Squat Day","Tue: Rest","Wed: Press Day","Thu: Rest","Fri: Deadlift Day","Sat: Accessory","Sun: Rest"] },
  { id:"general",   label:"General Fitness",      icon:"✅", desc:"Balanced training — feel good, stay active, build a base",
    preview:["Mon: Full Body A","Tue: Rest","Wed: Cardio","Thu: Full Body B","Fri: Rest","Sat: Full Body C","Sun: Rest"] },
];

const EXPERIENCE = [
  { id:"beginner",     label:"Beginner",     desc:"Under 1 year of consistent training. Learning movement patterns." },
  { id:"intermediate", label:"Intermediate", desc:"1–3 years. Comfortable with main compound lifts." },
  { id:"advanced",     label:"Advanced",     desc:"3+ years. Training with structure and progressive intent." },
];

const DAYS_OF_WEEK = ["mon","tue","wed","thu","fri","sat","sun"];
const DAY_LABELS = { mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun" };

const DURATIONS = [
  { id:45, label:"45 min", desc:"Quick, efficient" },
  { id:60, label:"60 min", desc:"Standard" },
  { id:75, label:"75 min", desc:"Full session" },
  { id:90, label:"90+ min", desc:"Maximum volume" },
];

const EQUIPMENT_OPTIONS = [
  { id:"barbell", label:"Barbell + Rack", icon:"🏋" },
  { id:"dumbbells", label:"Dumbbells", icon:"💪" },
  { id:"cables", label:"Cable Machine", icon:"🔄" },
  { id:"machines", label:"Weight Machines", icon:"⚙" },
  { id:"kettlebells", label:"Kettlebells", icon:"🪃" },
  { id:"bands", label:"Resistance Bands", icon:"🎗" },
  { id:"pull_up_bar", label:"Pull-Up Bar", icon:"⬆" },
  { id:"bodyweight", label:"Bodyweight Only", icon:"🤸" },
];

const COMPOUND_LIFTS = [
  { id:"bench",    label:"Bench Press",        icon:"🏋", muscles:"Chest, Triceps, Shoulders" },
  { id:"squat",    label:"Back Squat",         icon:"🦵", muscles:"Quads, Glutes, Core" },
  { id:"deadlift", label:"Deadlift",           icon:"⚡", muscles:"Hamstrings, Glutes, Back" },
  { id:"row",      label:"Barbell Row",        icon:"💪", muscles:"Back, Biceps, Rear Delts" },
  { id:"ohp",      label:"Overhead Press",     icon:"🔝", muscles:"Shoulders, Triceps, Core" },
  { id:"pullup",   label:"Pull-Ups / Chin-Ups",icon:"⬆", muscles:"Back, Biceps, Core" },
  { id:"rdl",      label:"Romanian Deadlift",  icon:"🔙", muscles:"Hamstrings, Glutes, Back" },
  { id:"hip",      label:"Hip Thrust",         icon:"🍑", muscles:"Glutes, Hamstrings" },
  { id:"lunge",    label:"Lunges / Split Squat",icon:"🚶", muscles:"Quads, Glutes, Balance" },
  { id:"dip",      label:"Dips",               icon:"⬇", muscles:"Chest, Triceps, Shoulders" },
  { id:"clean",    label:"Hang Clean / Power Clean",icon:"🥇", muscles:"Full Body, Power" },
  { id:"kb_swing", label:"Kettlebell Swing",   icon:"🪃", muscles:"Posterior Chain, Conditioning" },
];

const SPORTS = ["Basketball","Boxing","Soccer","Football","Tennis","Swimming","Running","Cycling","Golf","Baseball","Volleyball","MMA / Martial Arts","General Fitness","Other"];

const TOTAL_STEPS = 10;

// Preset plan generator
function generatePresetPlan(profile) {
  const { goal, experience, days, duration, equipment, name, favLifts } = profile;
  const hasBarbell = equipment.includes("barbell");
  const hasDumbbells = equipment.includes("dumbbells");
  const hasCables = equipment.includes("cables");
  const hasMachines = equipment.includes("machines");
  const hasKB = equipment.includes("kettlebells");
  const hasPullBar = equipment.includes("pull_up_bar");
  const isBeginner = experience === "beginner";
  const shortSesh = duration <= 45;

  const color = goal==="athletic"?"#e05c2a":goal==="muscle"?"#8e44ad":goal==="fat_loss"?"#c0392b":goal==="strength"?"#e8a838":"#27ae60";

  const liftingDays = days.slice(0, Math.min(days.length, 5));
  const workoutTypes = liftingDays.length <= 2 ? ["Full Body A","Full Body B"]
    : liftingDays.length === 3 ? ["Push","Pull","Legs"]
    : liftingDays.length === 4 ? ["Upper A","Lower A","Upper B","Lower B"]
    : ["Push","Pull","Legs","Upper","Lower"];

  const planDays = {};
  DAYS_OF_WEEK.forEach(day => {
    const idx = liftingDays.indexOf(day);
    if (idx === -1) {
      planDays[day] = { name:"Rest", subtitle:"Recovery", color:"#2c3e50", label:DAY_LABELS[day], sections:[] };
    } else {
      const type = workoutTypes[idx % workoutTypes.length];
      planDays[day] = buildDay(type, { hasBarbell, hasDumbbells, hasCables, hasMachines, hasKB, hasPullBar, shortSesh, isBeginner, goal, favLifts: favLifts||[], label: DAY_LABELS[day] });
    }
  });

  return {
    planName: `${name ? name + "'s" : "My"} WRK Plan`,
    planSubtitle: `${goal.replace("_"," ")} · ${days.length}x/week`,
    color,
    isUserPlan: true,
    weeks: [{ weekLabel:"Weeks 1–4", focus:"Foundation", days: planDays }]
  };
}

function ex(name, sets, target, rest, note, tags) {
  return { name, sets, target, rest, note, tags, id:`${name.slice(0,4)}_${Math.random().toString(36).slice(2,6)}` };
}

function buildDay(type, opts) {
  const { hasBarbell, hasDumbbells, hasCables, hasMachines, hasPullBar, shortSesh, isBeginner, goal, favLifts, label } = opts;
  const colors = { Push:"#2980b9", Pull:"#8e44ad", Legs:"#e8a838", "Upper A":"#2980b9", "Upper B":"#8e44ad", "Lower A":"#e8a838", "Lower B":"#c0392b", "Full Body A":"#27ae60", "Full Body B":"#16a085", Upper:"#2980b9", Lower:"#e8a838" };
  const color = colors[type] || "#27ae60";

  const pickPress = () => hasBarbell ? ex("Flat Barbell Bench Press",4,"8 reps",180,"Pause at bottom, explosive up.",["chest","barbell","push","compound","bilateral"])
    : hasDumbbells ? ex("DB Bench Press",4,"10 reps",150,"Deeper stretch than barbell.",["chest","dumbbell","push","compound","bilateral"])
    : ex("Push-Ups",4,"15 reps",60,"Full depth, body straight.",["chest","bodyweight","push","compound","bilateral"]);

  const pickRow = () => (hasBarbell&&(favLifts.includes("row")||!favLifts.length)) ? ex("Barbell Bent-Over Row",4,"10 reps",180,"Hinge to 45°, drive elbows past torso.",["back","barbell","pull","compound","bilateral"])
    : hasDumbbells ? ex("DB Row",4,"10 reps/arm",120,"Full stretch at bottom.",["back","dumbbell","pull","compound","unilateral"])
    : ex("Inverted Row",4,"10 reps",90,"Chest to bar, body straight.",["back","bodyweight","pull","compound","bilateral"]);

  const pickPull = () => hasPullBar ? ex("Pull-Ups",3,"6-8 reps",150,"Dead hang at bottom every rep.",["back","bodyweight","pull","compound","bilateral"])
    : hasCables ? ex("Lat Pulldown — Wide Grip",3,"10 reps",120,"Full stretch at top.",["back","cable","pull","compound","bilateral"])
    : ex("DB Pullover",3,"12 reps",90,"Full lat stretch behind head.",["back","dumbbell","pull","isolation","bilateral"]);

  const pickSquat = () => (hasBarbell&&(favLifts.includes("squat")||!favLifts.length)) ? ex("Barbell Back Squat",4,"8 reps",180,"Below parallel, drive through heels.",["quad","glute","barbell","squat","compound","bilateral"])
    : hasDumbbells ? ex("Goblet Squat",4,"12 reps",120,"DB at chest, full depth.",["quad","glute","dumbbell","squat","compound","bilateral"])
    : ex("Bodyweight Squat",4,"20 reps",60,"Full depth, controlled.",["quad","glute","bodyweight","squat","compound","bilateral"]);

  const pickHinge = () => (hasBarbell&&(favLifts.includes("deadlift")||favLifts.includes("rdl")||!favLifts.length)) ? ex("Romanian Deadlift",3,"10 reps",150,"Full hamstring stretch at bottom.",["hamstring","glute","barbell","hinge","compound","bilateral"])
    : hasDumbbells ? ex("DB Romanian Deadlift",3,"12 reps",120,"Push hips back, flat back.",["hamstring","glute","dumbbell","hinge","compound","bilateral"])
    : ex("Good Mornings",3,"12 reps",90,"Hinge forward, feel the stretch.",["hamstring","bodyweight","hinge","compound","bilateral"]);

  const pickOHP = () => (hasBarbell&&(favLifts.includes("ohp")||!favLifts.length)) ? ex("Overhead Press",4,"10 reps",150,"Core braced, drive overhead.",["shoulder","barbell","push","compound","bilateral"])
    : hasDumbbells ? ex("DB Shoulder Press",4,"10 reps",120,"Control the descent.",["shoulder","dumbbell","push","compound","bilateral"])
    : ex("Pike Push-Ups",4,"10 reps",90,"Hips high — shoulders do the work.",["shoulder","bodyweight","push","compound","bilateral"]);

  const pickHipThrust = () => hasBarbell ? ex("Barbell Hip Thrust",4,"12 reps",120,"Squeeze + hold 1 sec at top.",["glute","hamstring","barbell","compound","bilateral"])
    : hasDumbbells ? ex("DB Hip Thrust",4,"12 reps",120,"Drive and squeeze at top.",["glute","hamstring","dumbbell","compound","bilateral"])
    : ex("Glute Bridge",4,"15 reps",90,"Drive hips up, hold at top.",["glute","hamstring","bodyweight","compound","bilateral"]);

  const coreBlock = { title:"Core", exercises:[
    ex("Plank","3","40 sec",45,"Full body tension — don't let hips sag.",["core","bodyweight","iso","bilateral"]),
    ex("Lying Leg Raise",3,"12 reps",60,"Lower back pressed to floor.",["core","bodyweight","compound","bilateral"]),
  ]};

  const configs = {
    Push: { subtitle:"Chest + Shoulders + Triceps", sections:[
      { title:"Compound Push", exercises:[ pickPress(), pickOHP() ]},
      !shortSesh && { title:"Isolation", exercises:[
        hasDumbbells ? ex("DB Lateral Raise",3,"15 reps",60,"2 sec up, 3 sec down. Lead with elbow.",["shoulder","dumbbell","push","isolation","bilateral"]) : null,
        hasCables ? ex("Tricep Pushdown",3,"15 reps",60,"Full extension every rep.",["tricep","cable","push","isolation","bilateral"])
          : hasDumbbells ? ex("Overhead Tricep Extension",3,"12 reps",60,"Long head — keep elbows tucked.",["tricep","dumbbell","push","isolation","bilateral"])
          : ex("Diamond Push-Ups",3,"10 reps",60,"Hands close, elbows in.",["tricep","bodyweight","push","compound","bilateral"]),
      ].filter(Boolean)},
      !shortSesh && coreBlock,
    ].filter(Boolean)},
    Pull: { subtitle:"Back + Biceps", sections:[
      { title:"Compound Pull", exercises:[ pickRow(), pickPull() ]},
      !shortSesh && { title:"Biceps", exercises:[
        hasBarbell ? ex("Barbell Curl",3,"10 reps",90,"4 sec eccentric, no swinging.",["bicep","barbell","pull","isolation","bilateral"])
          : hasDumbbells ? ex("Hammer Curl",3,"12 reps",60,"Neutral grip, brachialis thickness.",["bicep","dumbbell","pull","isolation","bilateral"])
          : ex("Chin-Ups",3,"6 reps",120,"Underhand grip, chin over bar.",["bicep","bodyweight","pull","compound","bilateral"]),
      ]},
    ].filter(Boolean)},
    Legs: { subtitle:"Quad + Hamstring + Glute", sections:[
      { title:"Compound Lower", exercises:[ pickSquat(), pickHinge() ]},
      { title:"Glute + Unilateral", exercises:[
        pickHipThrust(),
        hasDumbbells ? ex("DB Reverse Lunge",3,"10 reps/leg",90,"Step back, drive front heel.",["quad","glute","dumbbell","lunge","compound","unilateral"])
          : ex("Split Squat",3,"10 reps/leg",90,"Both feet planted, vertical torso.",["quad","glute","bodyweight","lunge","compound","unilateral"]),
      ]},
      !shortSesh && coreBlock,
    ].filter(Boolean)},
    "Full Body A": { subtitle:"Balanced Strength", sections:[
      { title:"Strength", exercises:[ pickSquat(), pickPress(), pickRow() ]},
      !shortSesh && coreBlock,
    ].filter(Boolean)},
    "Full Body B": { subtitle:"Balanced Strength", sections:[
      { title:"Strength", exercises:[ pickHinge(), pickOHP(), pickPull() ]},
      !shortSesh && { title:"Core + Glute", exercises:[ pickHipThrust(), ex("Dead Bug",2,"10 reps/side",45,"Back flat, opposite arm-leg.",["core","bodyweight","compound","unilateral"]) ]},
    ].filter(Boolean)},
    "Upper A": { subtitle:"Chest + Back Heavy", sections:[
      { title:"Heavy Compounds", exercises:[ pickPress(), pickRow() ]},
      !shortSesh && { title:"Accessories", exercises:[
        hasDumbbells ? ex("DB Lateral Raise",3,"15 reps",60,"Lead with elbow.",["shoulder","dumbbell","push","isolation","bilateral"]) : null,
        hasDumbbells ? ex("Hammer Curl",3,"12 reps",60,"Controlled eccentric.",["bicep","dumbbell","pull","isolation","bilateral"]) : null,
      ].filter(Boolean)},
      !shortSesh && coreBlock,
    ].filter(Boolean)},
    "Lower A": { subtitle:"Quad Dominant", sections:[
      { title:"Quad Strength", exercises:[ pickSquat(), hasDumbbells ? ex("DB Reverse Lunge",3,"10 reps/leg",120,"Drive through front heel.",["quad","glute","dumbbell","lunge","compound","unilateral"]) : ex("Split Squat",3,"10 reps/leg",90,"Vertical torso.",["quad","glute","bodyweight","lunge","compound","unilateral"]) ]},
      !shortSesh && coreBlock,
    ].filter(Boolean)},
    "Upper B": { subtitle:"Shoulders + Arms", sections:[
      { title:"Shoulder + Pull", exercises:[ pickOHP(), pickPull() ]},
      !shortSesh && { title:"Arms", exercises:[
        hasDumbbells ? ex("DB Lateral Raise",3,"15 reps",60,"No swinging.",["shoulder","dumbbell","push","isolation","bilateral"]) : null,
        hasDumbbells ? ex("Incline DB Curl",3,"12 reps",90,"Max long head stretch.",["bicep","dumbbell","pull","isolation","unilateral"]) : null,
        hasDumbbells ? ex("Overhead Tricep Extension",3,"12 reps",90,"Long head stretched.",["tricep","dumbbell","push","isolation","bilateral"]) : null,
      ].filter(Boolean)},
    ].filter(Boolean)},
    "Lower B": { subtitle:"Posterior Chain", sections:[
      { title:"Hinge + Glute", exercises:[
        hasBarbell ? ex("Trap Bar Deadlift",4,"5 reps",180,"Explosive hip drive.",["hamstring","glute","barbell","hinge","compound","bilateral"]) : pickHinge(),
        pickHipThrust(),
      ]},
      !shortSesh && { title:"Hamstring + Core", exercises:[
        hasMachines ? ex("Seated Leg Curl",3,"12 reps",90,"3 sec eccentric.",["hamstring","machine","isolation","bilateral"])
          : hasDumbbells ? ex("DB Romanian Deadlift",3,"10 reps",90,"Full stretch.",["hamstring","glute","dumbbell","hinge","compound","bilateral"])
          : null,
        ex("Dead Bug",2,"10 reps/side",45,"Opposite arm-leg, back flat.",["core","bodyweight","compound","unilateral"]),
      ].filter(Boolean)},
    ].filter(Boolean)},
    Upper: { subtitle:"Full Upper Body", sections:[
      { title:"Compounds", exercises:[ pickPress(), pickRow(), pickOHP() ]},
      !shortSesh && coreBlock,
    ].filter(Boolean)},
    Lower: { subtitle:"Full Lower Body", sections:[
      { title:"Compounds", exercises:[ pickSquat(), pickHinge(), pickHipThrust() ]},
      !shortSesh && coreBlock,
    ].filter(Boolean)},
  };

  const cfg = configs[type] || configs["Full Body A"];
  return { name:type, label, subtitle:cfg.subtitle, color, sections:cfg.sections };
}

export default function Onboarding({ user, existingPRs, onComplete, onSkip }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewGoal, setPreviewGoal] = useState(null);
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || "",
    goal: "", experience: "", days: [], duration: 60,
    equipment: [], favLifts: [], injuries: "", sport: "", weight: "",
    prs: existingPRs || {},
  });

  function update(key, val) { setProfile(p => ({ ...p, [key]: val })); }
  function toggleArr(key, val) {
    setProfile(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val] }));
  }

  function canProceed() {
    if (step === 1) return profile.name.trim().length >= 2;
    if (step === 2) return !!profile.goal;
    if (step === 3) return !!profile.experience;
    if (step === 4) return profile.days.length >= 2;
    if (step === 5) return !!profile.duration;
    if (step === 6) return profile.equipment.length > 0;
    return true;
  }

  async function handleGenerate() {
    setLoading(true); setError("");
    try {
      let plan = null;
      try {
        const res = await fetch("/api/generate-plan", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ profile }),
        });
        const data = await res.json();
        if (data.plan) plan = data.plan;
      } catch {}
      if (!plan) plan = generatePresetPlan(profile);
      onComplete({ profile, plan });
    } catch (e) { setError("Something went wrong — please try again."); }
    setLoading(false);
  }

  const progress = (step / TOTAL_STEPS) * 100;

  const stepTitle = ["", "What's your name?", "What's your main goal?", "Experience level?", "Which days can you train?", "Session length?", "What equipment do you have?", "Favorite compound lifts?", "Primary sport or activity?", "Any injuries?", "Your starting PRs (optional)"][step];
  const stepSub = ["", "We'll personalize your plan to you.", "We'll build your program around this.", "Determines movement complexity and volume.", "Pick at least 2 — these become your training days.", "How long can you commit each session?", "We'll only program exercises you can actually do.", "These will anchor your program. Pick what you're comfortable with.", "We'll emphasize movements that carry over directly.", "We'll avoid movements that could aggravate them.", "Helps us calibrate your starting weights."][step];

  return (
    <div style={S.app}>
      {/* Progress */}
      <div style={{ height:"3px", background:"#1a1a1a", flexShrink:0 }}>
        <div style={{ height:"3px", background:"#e8a838", width:`${progress}%`, transition:"width 0.3s" }}/>
      </div>

      <div style={S.body}>
        {/* Header */}
        <div style={{ marginBottom:"28px" }}>
          <div style={{ fontSize:"10px", color:"#e8a838", letterSpacing:"3px", marginBottom:"8px", fontWeight:700 }}>STEP {step} OF {TOTAL_STEPS}</div>
          <div style={{ fontSize:"26px", fontWeight:900, lineHeight:1.1, marginBottom:"6px" }}>{stepTitle}</div>
          <div style={{ fontSize:"13px", color:"#444", lineHeight:1.4 }}>{stepSub}</div>
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <input style={S.inp} value={profile.name} onChange={e => update("name", e.target.value)}
            placeholder="Your first name" autoFocus maxLength={30}/>
        )}

        {/* Step 2 — Goal with preview */}
        {step === 2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {GOALS.map(g => (
              <div key={g.id}>
                <button onClick={() => { update("goal", g.id); setPreviewGoal(previewGoal===g.id?null:g.id); }}
                  style={{ width:"100%", padding:"16px", background:profile.goal===g.id?"#1a1400":"#111", border:`1px solid ${profile.goal===g.id?"#e8a838":"#1e1e1e"}`, borderRadius:"12px", cursor:"pointer", textAlign:"left", display:"flex", gap:"14px", alignItems:"center" }}>
                  <span style={{ fontSize:"24px", flexShrink:0 }}>{g.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"16px", fontWeight:800, color:profile.goal===g.id?"#e8a838":"#ccc" }}>{g.label}</div>
                    <div style={{ fontSize:"12px", color:"#3a3a3a", marginTop:"2px" }}>{g.desc}</div>
                  </div>
                  <div style={{ fontSize:"12px", color:"#2a2a2a" }}>{previewGoal===g.id?"▲":"▼"}</div>
                </button>
                {/* Preview panel */}
                {previewGoal === g.id && (
                  <div style={{ background:"#0e0e0e", border:"1px solid #1a1a1a", borderTop:"none", borderRadius:"0 0 10px 10px", padding:"12px 16px", marginTop:"-4px" }}>
                    <div style={{ fontSize:"9px", color:"#444", letterSpacing:"2px", marginBottom:"8px" }}>SAMPLE WEEK STRUCTURE</div>
                    {g.preview.map((day, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"5px" }}>
                        <div style={{ width:"32px", fontSize:"9px", color:"#2a2a2a", fontWeight:700 }}>{["MON","TUE","WED","THU","FRI","SAT","SUN"][i]}</div>
                        <div style={{ fontSize:"12px", color:day.toLowerCase().includes("rest")?"#2a2a2a":"#888", fontStyle:day.toLowerCase().includes("rest")?"italic":"normal" }}>{day}</div>
                      </div>
                    ))}
                    <div style={{ fontSize:"10px", color:"#1a3a1a", marginTop:"8px" }}>This adapts to your specific days, equipment, and experience.</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 3 — Experience */}
        {step === 3 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {EXPERIENCE.map(e => (
              <button key={e.id} onClick={() => update("experience", e.id)}
                style={{ padding:"18px", background:profile.experience===e.id?"#1a1400":"#111", border:`1px solid ${profile.experience===e.id?"#e8a838":"#1e1e1e"}`, borderRadius:"12px", cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:"18px", fontWeight:900, color:profile.experience===e.id?"#e8a838":"#ccc", marginBottom:"4px" }}>{e.label}</div>
                <div style={{ fontSize:"12px", color:"#3a3a3a" }}>{e.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 4 — Days */}
        {step === 4 && (
          <>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"16px" }}>
              {DAYS_OF_WEEK.map(d => (
                <button key={d} onClick={() => toggleArr("days", d)} style={S.chip(profile.days.includes(d))}>
                  {DAY_LABELS[d]}
                </button>
              ))}
            </div>
            {profile.days.length > 0 && (
              <div style={{ padding:"12px 16px", background:"#111", border:"1px solid #1e1e1e", borderRadius:"10px", fontSize:"13px", color:"#555" }}>
                {profile.days.length} training day{profile.days.length!==1?"s":""} · {7-profile.days.length} rest day{7-profile.days.length!==1?"s":""}
              </div>
            )}
          </>
        )}

        {/* Step 5 — Duration */}
        {step === 5 && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {DURATIONS.map(d => (
              <button key={d.id} onClick={() => update("duration", d.id)}
                style={{ padding:"20px 14px", background:profile.duration===d.id?"#1a1400":"#111", border:`1px solid ${profile.duration===d.id?"#e8a838":"#1e1e1e"}`, borderRadius:"12px", cursor:"pointer", textAlign:"center" }}>
                <div style={{ fontSize:"22px", fontWeight:900, color:profile.duration===d.id?"#e8a838":"#ccc" }}>{d.label}</div>
                <div style={{ fontSize:"11px", color:"#3a3a3a", marginTop:"4px" }}>{d.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 6 — Equipment */}
        {step === 6 && (
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {EQUIPMENT_OPTIONS.map(e => (
              <button key={e.id} onClick={() => toggleArr("equipment", e.id)} style={S.chip(profile.equipment.includes(e.id))}>
                {e.icon} {e.label}
              </button>
            ))}
          </div>
        )}

        {/* Step 7 — Favorite compound lifts */}
        {step === 7 && (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {COMPOUND_LIFTS.filter(l => {
                // Filter to lifts available with their equipment
                if (l.id==="bench"||l.id==="squat"||l.id==="deadlift"||l.id==="row"||l.id==="ohp"||l.id==="rdl") return profile.equipment.includes("barbell")||profile.equipment.includes("dumbbells");
                if (l.id==="pullup") return profile.equipment.includes("pull_up_bar")||profile.equipment.includes("cables");
                if (l.id==="hip") return profile.equipment.includes("barbell")||profile.equipment.includes("dumbbells");
                if (l.id==="dip") return true;
                if (l.id==="clean") return profile.equipment.includes("barbell");
                if (l.id==="kb_swing") return profile.equipment.includes("kettlebells");
                return true;
              }).map(l => (
                <button key={l.id} onClick={() => toggleArr("favLifts", l.id)}
                  style={{ padding:"14px 16px", background:profile.favLifts.includes(l.id)?"#1a1400":"#111", border:`1px solid ${profile.favLifts.includes(l.id)?"#e8a838":"#1e1e1e"}`, borderRadius:"12px", cursor:"pointer", textAlign:"left", display:"flex", gap:"12px", alignItems:"center" }}>
                  <span style={{ fontSize:"20px" }}>{l.icon}</span>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:800, color:profile.favLifts.includes(l.id)?"#e8a838":"#ccc" }}>{l.label}</div>
                    <div style={{ fontSize:"11px", color:"#3a3a3a", marginTop:"2px" }}>{l.muscles}</div>
                  </div>
                  {profile.favLifts.includes(l.id) && <div style={{ marginLeft:"auto", fontSize:"16px", color:"#e8a838" }}>✓</div>}
                </button>
              ))}
            </div>
            <div style={{ fontSize:"11px", color:"#2a2a2a", marginTop:"10px" }}>Skip if you're open to anything.</div>
          </>
        )}

        {/* Step 8 — Sport */}
        {step === 8 && (
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {SPORTS.map(s => (
              <button key={s} onClick={() => update("sport", profile.sport===s?"":s)} style={S.chip(profile.sport===s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Step 9 — Injuries */}
        {step === 9 && (
          <textarea value={profile.injuries} onChange={e => update("injuries", e.target.value)}
            placeholder="e.g. Left knee — avoid deep knee flexion&#10;Lower back — no heavy deadlifts&#10;&#10;Leave blank if none."
            style={{ ...S.inp, minHeight:"140px", resize:"none", lineHeight:1.5, fontSize:"15px" }}/>
        )}

        {/* Step 10 — PRs */}
        {step === 10 && (
          <>
            {[
              { key:"bench",    label:"Bench Press",      placeholder:"lbs" },
              { key:"squat",    label:"Squat",            placeholder:"lbs" },
              { key:"deadlift", label:"Deadlift",         placeholder:"lbs" },
              { key:"ohp",      label:"Overhead Press",   placeholder:"lbs" },
              { key:"row",      label:"Barbell Row",      placeholder:"lbs" },
            ].map(lift => {
              const pr = profile.prs[lift.key] || { weight:"", reps:"" };
              return (
                <div key={lift.key} style={{ marginBottom:"14px" }}>
                  <div style={{ fontSize:"10px", color:"#444", letterSpacing:"2px", marginBottom:"6px" }}>{lift.label.toUpperCase()}</div>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                    <input style={{ ...S.inp, flex:1, fontSize:"18px", padding:"12px" }} type="number" inputMode="decimal"
                      value={pr.weight} placeholder="lbs"
                      onChange={e => update("prs", { ...profile.prs, [lift.key]: { ...pr, weight:e.target.value } })}/>
                    <div style={{ color:"#2a2a2a", fontSize:"16px", flexShrink:0 }}>×</div>
                    <input style={{ ...S.inp, flex:1, fontSize:"18px", padding:"12px" }} type="number" inputMode="numeric"
                      value={pr.reps} placeholder="reps"
                      onChange={e => update("prs", { ...profile.prs, [lift.key]: { ...pr, reps:e.target.value } })}/>
                  </div>
                </div>
              );
            })}
            {error && <div style={{ fontSize:"12px", color:"#e05c2a", marginTop:"8px" }}>{error}</div>}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={S.footer}>
        {step === TOTAL_STEPS ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <button onClick={handleGenerate} disabled={loading}
              style={{ ...S.btn(true), padding:"16px", fontSize:"16px", opacity:loading?0.7:1 }}>
              {loading ? `BUILDING ${profile.name ? profile.name.toUpperCase() + "'S" : "YOUR"} PLAN...` : "BUILD MY PLAN →"}
            </button>
            <button onClick={onSkip} style={{ padding:"10px", background:"none", border:"none", color:"#2a2a2a", fontSize:"12px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif" }}>
              Skip for now — I'll set up manually
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
            <div style={{ display:"flex", gap:"10px" }}>
              {step > 1 && (
                <button onClick={() => setStep(s => s-1)}
                  style={{ width:"46px", height:"46px", background:"#111", border:"1px solid #1e1e1e", borderRadius:"10px", color:"#555", fontSize:"22px", cursor:"pointer", flexShrink:0 }}>
                  ‹
                </button>
              )}
              <button onClick={() => setStep(s => s+1)} disabled={!canProceed()}
                style={{ ...S.btn(canProceed()), flex:1, padding:"14px", opacity:canProceed()?1:0.35, cursor:canProceed()?"pointer":"not-allowed" }}>
                CONTINUE →
              </button>
            </div>
            {step > 3 && (
              <button onClick={() => setStep(s => s+1)}
                style={{ padding:"8px", background:"none", border:"none", color:"#2a2a2a", fontSize:"11px", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", textAlign:"center" }}>
                Skip this step
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { generatePresetPlan, DAYS_OF_WEEK, DAY_LABELS };
