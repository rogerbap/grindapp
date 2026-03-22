export const PHASE_COLORS = { 1: "#e8a838", 2: "#e05c2a", 3: "#c0392b" };
export const DAY_ORDER = ["sun","mon","tue","wed","thu","fri","sat"];
export const JS_TO_DAY = { 0:"sun",1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat" };

export const WORKOUTS = {
  sun: {
    label:"Sunday", name:"Lower A", subtitle:"Quad Focus + Adductors", color:"#e8a838",
    sections:[
      { title:"Power Primer", exercises:[
        { name:"Clap Push-Ups", sets:4, target:"5 reps", note:"Explosive — full extension, reset between reps" },
        { name:"Trap Bar Jumps", sets:3, target:"3 reps", note:"Light load, CNS activation before squats" },
      ]},
      { title:"Isometrics", exercises:[
        { name:"Spanish Squat Hold", sets:3, target:"45 sec", note:"Band around post, quad + patellar tendon" },
        { name:"Adductor Squeeze Hold", sets:3, target:"30 sec", note:"Ball between knees, max effort" },
        { name:"Single-Leg Wall Sit", sets:3, target:"20 sec/leg", note:"Ph3: go deeper" },
      ]},
      { title:"Strength Block", exercises:[
        { name:"Barbell Back Squat", sets:4, target:"6 reps", note:"RPE 7–8, tempo applies" },
        { name:"Trap Bar Deadlift", sets:4, target:"5 reps", note:"Controlled descent, explosive hip drive" },
        { name:"Barbell Hip Thrust", sets:3, target:"8 reps", note:"Squeeze + 1 sec hold at top" },
      ]},
      { title:"Hypertrophy Block", exercises:[
        { name:"Bulgarian Split Squat", sets:3, target:"10 reps/leg", note:"Tempo applies — embrace the difficulty" },
        { name:"Leg Extension", sets:3, target:"15 reps", note:"4 sec eccentric, squeeze at top" },
        { name:"Sumo Squat", sets:3, target:"12 reps", note:"Wide stance, adductor emphasis" },
        { name:"Cable Hip Adduction", sets:3, target:"15 reps/leg", note:"Full ROM, controlled" },
        { name:"Copenhagen Side Plank", sets:3, target:"25 sec/side", note:"Evidence-backed groin prevention" },
      ]},
      { title:"Calves + Core", exercises:[
        { name:"Standing Calf Raise", sets:4, target:"20 reps", note:"3 sec eccentric, 1 sec stretch at bottom" },
        { name:"Seated Calf Raise", sets:3, target:"20 reps", note:"Soleus emphasis" },
        { name:"Tibialis Raise", sets:3, target:"20 reps", note:"Shin splint prevention — non-negotiable" },
        { name:"Dead Bug", sets:3, target:"10 reps/side", note:"Deep core, anti-extension" },
        { name:"Hollow Body Hold", sets:3, target:"30 sec", note:"Full tension" },
        { name:"V-Ups", sets:3, target:"15 reps", note:"" },
        { name:"Bicycle Crunches", sets:3, target:"20 reps", note:"" },
      ]},
    ]
  },
  mon: {
    label:"Monday", name:"Upper A", subtitle:"Chest + Back Heavy", color:"#2980b9",
    sections:[
      { title:"Power Primer", exercises:[
        { name:"Clap Push-Ups", sets:4, target:"6 reps", note:"Upper body CNS activation before pressing" },
        { name:"Band Resisted Push-Ups", sets:3, target:"6 reps", note:"Primes pressing pattern" },
      ]},
      { title:"Isometrics", exercises:[
        { name:"Wall Chest Push", sets:3, target:"30 sec", note:"Arms at 90°, max effort" },
        { name:"Dead Hang", sets:3, target:"30 sec", note:"Lat + bicep tendon loading" },
        { name:"Bent-Over Row Hold", sets:3, target:"20 sec", note:"Bar at waist, 50% load" },
      ]},
      { title:"Chest — Heavy Compounds", exercises:[
        { name:"Incline Barbell Press", sets:4, target:"8 reps", note:"30–45° incline, upper chest, tempo" },
        { name:"Flat Barbell Bench Press", sets:4, target:"8 reps", note:"Primary mass builder, tempo" },
        { name:"Incline DB Fly", sets:3, target:"12 reps", note:"Feel full pec stretch at bottom — slow" },
      ]},
      { title:"Back — Heavy Compounds", exercises:[
        { name:"Weighted Pull-Ups", sets:4, target:"8 reps", note:"Full dead hang every rep, no half reps" },
        { name:"Barbell Bent-Over Row", sets:4, target:"10 reps", note:"Elbows drive back, tempo applies" },
        { name:"Barbell Shrug", sets:3, target:"15 reps", note:"Hold 1 sec at top, no rolling" },
        { name:"Back Extension", sets:3, target:"15 reps", note:"Erectors, controlled — don't hyperextend" },
        { name:"Prone Trap Raise", sets:2, target:"15 reps", note:"Face down on bench, Y position, thumbs up, hold 2 sec at top" },
      ]},
      { title:"Rotator Cuff", exercises:[
        { name:"Band External Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side" },
        { name:"Band Internal Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side" },
      ]},
    ]
  },
  tue: {
    label:"Tuesday", name:"Sprints", subtitle:"Dedicated Speed Day", color:"#27ae60",
    sections:[
      { title:"Phase 1 Protocol", exercises:[
        { name:"100m Sprint @ 75%", sets:6, target:"1 rep", note:"90 sec rest — walk back, don't jog" },
        { name:"40m Acceleration @ 85%", sets:4, target:"1 rep", note:"60 sec rest, focus on mechanics" },
      ]},
      { title:"Phase 2 Protocol", exercises:[
        { name:"100m Sprint @ 85%", sets:8, target:"1 rep", note:"75 sec rest" },
        { name:"50m Fly Sprint", sets:4, target:"1 rep", note:"Rolling start, max velocity, 90 sec rest" },
        { name:"40m Sprint @ 95%", sets:4, target:"1 rep", note:"Standing start, 90 sec rest" },
      ]},
      { title:"Phase 3 Protocol", exercises:[
        { name:"100m Sprint @ 90%", sets:10, target:"1 rep", note:"60 sec rest" },
        { name:"50m Fly @ 100%", sets:6, target:"1 rep", note:"2 min rest" },
        { name:"20m Max Acceleration", sets:4, target:"1 rep", note:"2 min rest — absolute max effort" },
        { name:"150m Build-Up Run", sets:2, target:"1 rep", note:"60% → 100% over full distance" },
      ]},
    ]
  },
  wed: {
    label:"Wednesday", name:"Lower B", subtitle:"Posterior + Vertical", color:"#c0392b",
    sections:[
      { title:"Power Primer", exercises:[
        { name:"Depth Jump + Lateral Bound", sets:3, target:"3 reps/side", note:"Most specific plyo for basketball" },
        { name:"Single-Arm DB Snatch", sets:3, target:"5 reps/side", note:"Light — full hip extension, explosive" },
      ]},
      { title:"Vertical Jump Protocol", exercises:[
        { name:"Approach Jump Practice", sets:4, target:"5 reps", note:"Gather, hinge, arm swing, max explosion" },
        { name:"Single-Leg Squat Jump", sets:3, target:"5 reps/leg", note:"Full reset between reps" },
        { name:"Ankle Hops", sets:3, target:"15 reps", note:"Rapid, low amplitude — Achilles elasticity" },
        { name:"Depth Jump to Max Reach", sets:3, target:"5 reps", note:"Ph2–3 only — ground contact under 0.2 sec" },
      ]},
      { title:"Isometrics", exercises:[
        { name:"RDL Hold at Mid-Shin", sets:3, target:"30 sec", note:"50% load, hamstring tendon loading" },
        { name:"Hip Thrust Hold at Top", sets:3, target:"30 sec", note:"Glute max isometric" },
        { name:"Standing Plate Adductor Squeeze", sets:3, target:"30 sec", note:"Max effort" },
      ]},
      { title:"Strength Block", exercises:[
        { name:"Romanian Deadlift", sets:4, target:"10 reps", note:"Feel full hamstring stretch at bottom — don't rush" },
        { name:"Barbell Hip Thrust", sets:4, target:"12 reps", note:"Squeeze + 1 sec hold every rep" },
        { name:"Seated Leg Curl", sets:4, target:"12 reps", note:"3 sec eccentric — key driver of hamstring hypertrophy" },
      ]},
      { title:"Hypertrophy Block", exercises:[
        { name:"Nordic Curl", sets:3, target:"6 reps", note:"Ph2–3 only — hardest hamstring exercise" },
        { name:"Adductor Machine", sets:3, target:"15 reps", note:"3 sec eccentric opening — adductor lengthening is the stimulus" },
        { name:"Walking Lunges", sets:3, target:"12 reps/leg", note:"Tempo applies" },
        { name:"Copenhagen Plank", sets:3, target:"25 sec/side", note:"Groin injury prevention" },
        { name:"Single-Leg Calf Raise", sets:3, target:"20 reps/leg", note:"Full stretch at bottom" },
        { name:"Back Extension", sets:3, target:"15 reps", note:"Erectors — lower back health across both leg days" },
      ]},
    ]
  },
  thu: {
    label:"Thursday", name:"Upper B", subtitle:"Shoulders + Arms + Detail", color:"#8e44ad",
    sections:[
      { title:"Power Primer", exercises:[
        { name:"Med Ball Overhead Slam", sets:3, target:"6 reps", note:"Full body explosion — posterior chain" },
        { name:"Plyo Push-Ups", sets:3, target:"6 reps", note:"Rate of force development, upper body" },
      ]},
      { title:"Isometrics", exercises:[
        { name:"DB Fly Hold", sets:3, target:"20 sec", note:"Arms wide, mid-range — second chest stimulus" },
        { name:"OHP Lockout Hold", sets:3, target:"20 sec", note:"60% load" },
        { name:"Rear Delt Fly Hold", sets:3, target:"20 sec", note:"Arms extended out" },
      ]},
      { title:"Shoulders — Full 3D", exercises:[
        { name:"Overhead Press", sets:4, target:"10 reps", note:"Tempo applies, front delt primary" },
        { name:"DB Lateral Raise", sets:3, target:"15 reps", note:"2 sec up, 3 sec down — no swinging" },
        { name:"Cable Lateral Raise", sets:3, target:"15 reps/side", note:"Constant tension, removes dead spot" },
        { name:"Rear Delt DB Fly", sets:4, target:"15 reps", note:"Slow eccentric, zero momentum, chest parallel" },
        { name:"Reverse Pec Deck", sets:3, target:"15 reps", note:"Squeeze hard at full extension" },
        { name:"Face Pulls", sets:3, target:"15 reps", note:"External rotation finish — rear delt + rotator cuff" },
      ]},
      { title:"Second Chest Stimulus", exercises:[
        { name:"Pec Deck / Machine Fly", sets:3, target:"12 reps", note:"Constant tension, mid chest squeeze" },
        { name:"Decline Push-Ups", sets:2, target:"To failure", note:"Feet on bench, lower chest burnout" },
      ]},
      { title:"Back Detail", exercises:[
        { name:"Seated Cable Row", sets:3, target:"12 reps", note:"Full forward lean, drive elbows past torso" },
      ]},
      { title:"Triceps", exercises:[
        { name:"Close-Grip Bench Press", sets:3, target:"10 reps", note:"All 3 heads — best mass builder" },
        { name:"Overhead Tricep Extension", sets:3, target:"12 reps", note:"Long head stretch — biggest head" },
        { name:"Rope Pushdown", sets:3, target:"15 reps", note:"Flare wrists apart at bottom" },
      ]},
      { title:"Biceps", exercises:[
        { name:"Barbell Curl", sets:3, target:"10 reps", note:"Full hang at bottom every rep, tempo" },
        { name:"Incline DB Curl", sets:3, target:"12 reps", note:"45° seat, arm hangs behind — max long head stretch" },
        { name:"Hammer Curl", sets:3, target:"12 reps", note:"Brachialis + forearm thickness" },
      ]},
      { title:"Forearms + Grip", exercises:[
        { name:"Wrist Curl (supinated)", sets:3, target:"20 reps", note:"Flexors — underside" },
        { name:"Wrist Curl (pronated)", sets:3, target:"20 reps", note:"Extensors — top" },
        { name:"Reverse Curl (EZ bar)", sets:3, target:"12 reps", note:"Brachioradialis" },
        { name:"Farmer Carry", sets:3, target:"30 sec", note:"Grip strength for the court" },
      ]},
      { title:"Rotator Cuff", exercises:[
        { name:"Band External Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side" },
        { name:"Band Internal Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side" },
      ]},
    ]
  },
  fri: {
    label:"Friday", name:"Basketball / Rest", subtitle:"Active Recovery", color:"#576574",
    sections:[
      { title:"Options", exercises:[
        { name:"Pickup Basketball", sets:1, target:"Full game", note:"Enjoy it — don't track reps, just play" },
        { name:"Light Walk", sets:1, target:"20 min", note:"Promotes blood flow, aids recovery" },
        { name:"Foam Roll", sets:1, target:"20 min", note:"Quads, hamstrings, adductors, calves, upper back" },
      ]},
    ]
  },
  sat: {
    label:"Saturday", name:"Full Rest", subtitle:"Recovery Day", color:"#444",
    sections:[
      { title:"Recovery Protocol", exercises:[
        { name:"Sleep 8–9 hrs", sets:1, target:"Non-negotiable", note:"Growth hormone peaks during deep sleep" },
        { name:"1 Gallon Water", sets:1, target:"Minimum", note:"More if yesterday was intense" },
        { name:"Light Walk", sets:1, target:"10–20 min", note:"Optional — promotes circulation" },
        { name:"Meal Prep", sets:1, target:"Week ahead", note:"Set yourself up for nutrition success" },
        { name:"Foam Roll", sets:1, target:"20 min", note:"Optional full body" },
        { name:"Review Week", sets:1, target:"5 min", note:"What moved up? What felt heavy? Adjust loads" },
      ]},
    ]
  },
};

export const TEMPO = {
  1: "3-1-3 (3 sec down, 1 sec pause, 3 sec up)",
  2: "3-1-1 (3 sec down, 1 sec pause, 1 sec up)",
  3: "3-0-1 (3 sec down, no pause, 1 sec up)",
};

export const PHASE_INFO = {
  1: { name:"Reactivation", weeks:"Weeks 1–2", desc:"60–65% intensity. Isometrics at shortened position. Tendons are 4–6 weeks behind muscles — no ego. Build the foundation.", color:"#e8a838" },
  2: { name:"Build", weeks:"Weeks 3–6", desc:"Progressive overload every session. All plyos fully active. Isometrics move to mid-range. This is where the physique gets built.", color:"#e05c2a" },
  3: { name:"Shred & Peak", weeks:"Weeks 7–12", desc:"Deficit nutrition. Isometrics at full length. Max conditioning. Tempo 3-0-1. This is game day you.", color:"#c0392b" },
};
