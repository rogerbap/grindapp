export const PHASE_COLORS = { 1: "#e8a838", 2: "#e05c2a", 3: "#c0392b" };
export const DAY_ORDER = ["sun","mon","tue","wed","thu","fri","sat"];
export const JS_TO_DAY = { 0:"sun",1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat" };

export const WORKOUTS = {
  sun: {
    label:"Sunday", name:"Lower A", subtitle:"Quad Focus + Adductors", color:"#e8a838",
    sections:[
      {
        // FIX: Replaced Clap Push-Ups (upper body) with Broad Jumps (lower body hip extension).
        // Broad Jumps first (bodyweight), Trap Bar Jumps second (loaded) — correct progression.
        title:"Power Primer", exercises:[
          { name:"Broad Jumps", sets:3, target:"5 reps", note:"Max horizontal power — full reset between reps, hips drive back", rest:120 },
          { name:"Trap Bar Jumps", sets:3, target:"3 reps", note:"Light load, CNS activation — direct prep for squat", rest:120 },
        ]
      },
      {
        title:"Isometrics", exercises:[
          { name:"Spanish Squat Hold", sets:3, target:"45 sec", note:"Band around post — quad + patellar tendon loading", rest:60 },
          { name:"Adductor Squeeze Hold", sets:3, target:"30 sec", note:"Ball between knees, max effort", rest:60 },
          { name:"Single-Leg Wall Sit", sets:3, target:"20 sec/leg", note:"Ph3: go deeper for greater patellar tendon stress", rest:45 },
        ]
      },
      {
        title:"Quad Strength", exercises:[
          { name:"Barbell Back Squat", sets:4, target:"6 reps", note:"RPE 7–8, tempo applies — full depth", rest:180 },
          { name:"Bulgarian Split Squat", sets:3, target:"10 reps/leg", note:"Tempo applies — significant quad + glute loading", rest:120 },
          { name:"Leg Extension", sets:3, target:"15 reps", note:"4 sec eccentric, squeeze at top — patellar tendon health", rest:90 },
        ]
      },
      {
        title:"Secondary Posterior", exercises:[
          { name:"Trap Bar Deadlift", sets:4, target:"5 reps", note:"Controlled descent, explosive hip drive", rest:180 },
          { name:"Barbell Hip Thrust", sets:3, target:"8 reps", note:"Squeeze + 1 sec hold at top every rep", rest:120 },
        ]
      },
      {
        // FIX: Removed Sumo Squat — another squat pattern after 17 sets of lower body is junk volume.
        // Replaced with Side-Lying Hip Adduction — pure adductor isolation, no additional leg fatigue.
        title:"Adductor Work", exercises:[
          { name:"Cable Hip Adduction", sets:3, target:"15 reps/leg", note:"Full ROM, controlled — low pulley, constant tension", rest:60 },
          { name:"Side-Lying Hip Adduction", sets:3, target:"20 reps/leg", note:"Pure adductor isolation — no squat fatigue involved", rest:45 },
          { name:"Copenhagen Side Plank", sets:3, target:"25 sec/side", note:"Evidence-backed groin injury prevention", rest:60 },
        ]
      },
      {
        title:"Calves + Tibialis", exercises:[
          { name:"Standing Calf Raise", sets:4, target:"20 reps", note:"3 sec eccentric, 1 sec stretch at bottom", rest:60 },
          { name:"Seated Calf Raise", sets:3, target:"20 reps", note:"Soleus emphasis — bent knee changes the muscle", rest:60 },
          { name:"Tibialis Raise", sets:3, target:"20 reps", note:"Shin splint prevention — non-negotiable with sprints", rest:45 },
        ]
      },
      {
        // FIX: Trimmed from 4 exercises to 3 — V-Ups removed, hollow body covers similar territory
        // and you're already spent after a full lower day.
        title:"Core", exercises:[
          { name:"Dead Bug", sets:3, target:"10 reps/side", note:"Deep core, anti-extension — quality over speed", rest:45 },
          { name:"Hollow Body Hold", sets:3, target:"30 sec", note:"Full body tension throughout", rest:45 },
          { name:"Bicycle Crunches", sets:3, target:"20 reps", note:"Obliques — controlled rotation", rest:45 },
        ]
      },
    ]
  },

  mon: {
    label:"Monday", name:"Upper A", subtitle:"Chest + Back Heavy", color:"#2980b9",
    sections:[
      {
        // FIX: Replaced Band Resisted Push-Ups with Band Pull-Aparts.
        // It's a push AND pull day — the primer should activate both patterns, not just pressing twice.
        title:"Power Primer", exercises:[
          { name:"Clap Push-Ups", sets:4, target:"6 reps", note:"Upper body CNS activation — primes pressing pattern", rest:60 },
          { name:"Band Pull-Aparts", sets:3, target:"15 reps", note:"Activates rear delts + mid traps — primes pulling pattern for back work", rest:45 },
        ]
      },
      {
        title:"Isometrics", exercises:[
          { name:"Wall Chest Push", sets:3, target:"30 sec", note:"Arms at 90°, max effort — chest tendon loading", rest:60 },
          { name:"Dead Hang", sets:3, target:"30 sec", note:"Lat + bicep tendon loading", rest:60 },
          { name:"Bent-Over Row Hold", sets:3, target:"20 sec", note:"Bar at waist, 50% load", rest:60 },
        ]
      },
      {
        title:"Chest — Heavy Compounds", exercises:[
          { name:"Incline Barbell Press", sets:4, target:"8 reps", note:"30–45° incline, upper chest, tempo applies", rest:180 },
          { name:"Flat Barbell Bench Press", sets:4, target:"8 reps", note:"Primary chest mass builder — tempo applies", rest:180 },
        ]
      },
      {
        title:"Back — Heavy Compounds", exercises:[
          { name:"Weighted Pull-Ups", sets:4, target:"8 reps", note:"Full dead hang every rep — no half reps, no kipping", rest:180 },
          { name:"Barbell Bent-Over Row", sets:4, target:"10 reps", note:"Elbows drive back, not flared — tempo applies", rest:180 },
        ]
      },
      {
        // FIX: Split accessories into separate chest and back blocks — cleaner, easier to track.
        title:"Chest Accessories", exercises:[
          { name:"Incline DB Fly", sets:3, target:"12 reps", note:"Feel full pec stretch at bottom — slow eccentric, don't rush", rest:90 },
        ]
      },
      {
        title:"Back Accessories", exercises:[
          { name:"Barbell Shrug", sets:3, target:"15 reps", note:"Hold 1 sec at top — trap fullness", rest:90 },
          { name:"Back Extension", sets:3, target:"15 reps", note:"Erectors — controlled, don't hyperextend at top", rest:60 },
          { name:"Prone Trap Raise", sets:2, target:"15 reps", note:"Face down on bench, Y position, thumbs up, hold 2 sec at top", rest:60 },
        ]
      },
      {
        title:"Rotator Cuff", exercises:[
          { name:"Band External Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side — non-negotiable for shoulder health", rest:45 },
          { name:"Band Internal Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side", rest:45 },
        ]
      },
    ]
  },

  tue: {
    label:"Tuesday", name:"Sprints", subtitle:"Dedicated Speed Day", color:"#27ae60",
    sections:[
      {
        title:"Phase 1 Protocol", exercises:[
          { name:"100m Sprint @ 75%", sets:6, target:"1 rep", note:"Walk back between — don't jog the rest", rest:90 },
          { name:"40m Acceleration @ 85%", sets:4, target:"1 rep", note:"Focus on arm drive and shin angle", rest:60 },
        ]
      },
      {
        title:"Phase 2 Protocol", exercises:[
          { name:"100m Sprint @ 85%", sets:8, target:"1 rep", note:"75 sec rest", rest:75 },
          { name:"50m Fly Sprint", sets:4, target:"1 rep", note:"Rolling start, max velocity", rest:90 },
          { name:"40m Sprint @ 95%", sets:4, target:"1 rep", note:"Standing start", rest:90 },
        ]
      },
      {
        title:"Phase 3 Protocol", exercises:[
          { name:"100m Sprint @ 90%", sets:10, target:"1 rep", note:"60 sec rest", rest:60 },
          { name:"50m Fly @ 100%", sets:6, target:"1 rep", note:"Absolute max velocity", rest:120 },
          { name:"20m Max Acceleration", sets:4, target:"1 rep", note:"100% effort every rep", rest:120 },
          { name:"150m Build-Up Run", sets:2, target:"1 rep", note:"60% → 100% over full distance", rest:120 },
        ]
      },
    ]
  },

  wed: {
    label:"Wednesday", name:"Lower B", subtitle:"Posterior + Vertical", color:"#c0392b",
    sections:[
      {
        title:"Power Primer", exercises:[
          { name:"Depth Jump + Lateral Bound", sets:3, target:"3 reps/side", note:"Most specific plyo for basketball athleticism", rest:120 },
          { name:"Single-Arm DB Snatch", sets:3, target:"5 reps/side", note:"Light — full hip extension, primes hip hinge pattern", rest:90 },
        ]
      },
      {
        title:"Vertical Jump Protocol", exercises:[
          { name:"Approach Jump Practice", sets:4, target:"5 reps", note:"Gather, hinge, arm swing, max explosion — full reset between reps", rest:120 },
          { name:"Single-Leg Squat Jump", sets:3, target:"5 reps/leg", note:"Full reset between reps", rest:90 },
          { name:"Ankle Hops", sets:3, target:"15 reps", note:"Rapid, low amplitude — Achilles elasticity key for jump height", rest:60 },
          { name:"Depth Jump to Max Reach", sets:3, target:"5 reps", note:"Ph2–3 only — ground contact must be under 0.2 sec", rest:120 },
        ]
      },
      {
        title:"Isometrics", exercises:[
          { name:"RDL Hold at Mid-Shin", sets:3, target:"30 sec", note:"50% load — hamstring tendon loading before heavy work", rest:60 },
          { name:"Hip Thrust Hold at Top", sets:3, target:"30 sec", note:"Glute max isometric", rest:60 },
          { name:"Standing Plate Adductor Squeeze", sets:3, target:"30 sec", note:"Max effort", rest:60 },
        ]
      },
      {
        // FIX: Nordic Curls moved HERE — before RDL, as the first posterior strength exercise.
        // Nordic Curls are a strength/tendon exercise, not a hypertrophy finisher.
        // Doing them after 12 sets of posterior work is injury risk, not stimulus.
        title:"Posterior Chain Strength", exercises:[
          { name:"Nordic Curl", sets:3, target:"6 reps", note:"Ph2–3 only — do these FIRST while hamstrings are fresh, hardest exercise", rest:120 },
          { name:"Romanian Deadlift", sets:4, target:"10 reps", note:"Feel full hamstring stretch at bottom — don't rush the eccentric", rest:180 },
          { name:"Barbell Hip Thrust", sets:4, target:"12 reps", note:"Squeeze + 1 sec hold every rep — glute max fully contracted", rest:120 },
          { name:"Seated Leg Curl", sets:4, target:"12 reps", note:"3 sec eccentric — primary hamstring hypertrophy driver", rest:90 },
        ]
      },
      {
        title:"Adductor Detail", exercises:[
          { name:"Adductor Machine", sets:3, target:"15 reps", note:"3 sec eccentric opening — the lengthening is the stimulus", rest:90 },
          { name:"Copenhagen Plank", sets:3, target:"25 sec/side", note:"Groin injury prevention", rest:60 },
        ]
      },
      {
        title:"Calves + Core", exercises:[
          { name:"Single-Leg Calf Raise", sets:3, target:"20 reps/leg", note:"Full stretch at bottom every rep", rest:60 },
          { name:"Back Extension", sets:3, target:"15 reps", note:"Erectors — lower back health across both leg days", rest:60 },
          { name:"Plank", sets:2, target:"60 sec", note:"Full body tension", rest:45 },
        ]
      },
    ]
  },

  thu: {
    label:"Thursday", name:"Upper B", subtitle:"Shoulders + Arms + Detail", color:"#8e44ad",
    sections:[
      {
        title:"Power Primer", exercises:[
          { name:"Med Ball Overhead Slam", sets:3, target:"6 reps", note:"Full body explosion — posterior chain activation", rest:60 },
          { name:"Plyo Push-Ups", sets:3, target:"6 reps", note:"Upper body rate of force development", rest:60 },
        ]
      },
      {
        title:"Isometrics", exercises:[
          { name:"DB Fly Hold", sets:3, target:"20 sec", note:"Arms wide, mid-range — second chest stimulus", rest:60 },
          { name:"OHP Lockout Hold", sets:3, target:"20 sec", note:"60% load — shoulder tendon loading", rest:60 },
          { name:"Rear Delt Fly Hold", sets:3, target:"20 sec", note:"Arms extended fully out", rest:60 },
        ]
      },
      {
        title:"Shoulder — Compound", exercises:[
          { name:"Overhead Press", sets:4, target:"10 reps", note:"Tempo applies — front delt primary", rest:180 },
          { name:"Face Pulls", sets:3, target:"15 reps", note:"Before lateral raises — primes rear delt + rotator cuff joint", rest:60 },
        ]
      },
      {
        // FIX: Interleaved lateral and rear delt work instead of two lateral raises back to back.
        // DB Lateral → Rear Delt Fly → Cable Lateral → Reverse Pec Deck
        // Alternates stimulus angle so lateral delt isn't pre-exhausted before the second lateral movement.
        title:"Shoulder — Lateral + Rear Isolation", exercises:[
          { name:"DB Lateral Raise", sets:3, target:"15 reps", note:"2 sec up, 3 sec down — lead with elbow, no swinging", rest:60 },
          { name:"Rear Delt DB Fly", sets:4, target:"15 reps", note:"Chest parallel to floor, slow eccentric, zero momentum", rest:60 },
          { name:"Cable Lateral Raise", sets:3, target:"15 reps/side", note:"Constant tension — removes dead spot at bottom of DB raise", rest:60 },
          { name:"Reverse Pec Deck", sets:3, target:"15 reps", note:"Squeeze hard at full extension", rest:60 },
        ]
      },
      {
        title:"Second Chest Stimulus", exercises:[
          { name:"Pec Deck / Machine Fly", sets:3, target:"12 reps", note:"Constant tension, mid chest squeeze", rest:90 },
          { name:"Decline Push-Ups", sets:2, target:"To failure", note:"Feet on bench — lower chest burnout, bodyweight so recovery cost is low", rest:60 },
        ]
      },
      {
        title:"Back Detail", exercises:[
          { name:"Seated Cable Row", sets:3, target:"12 reps", note:"Full forward lean for stretch, drive elbows past torso", rest:90 },
        ]
      },
      {
        title:"Triceps", exercises:[
          { name:"Close-Grip Bench Press", sets:3, target:"10 reps", note:"All 3 heads — best tricep mass builder", rest:120 },
          { name:"Overhead Tricep Extension", sets:3, target:"12 reps", note:"Long head stretch — the biggest head, don't skip", rest:90 },
          { name:"Rope Pushdown", sets:3, target:"15 reps", note:"Flare wrists apart at bottom for full lateral head contraction", rest:60 },
        ]
      },
      {
        title:"Biceps", exercises:[
          { name:"Barbell Curl", sets:3, target:"10 reps", note:"Full hang at bottom every rep — long head loading", rest:90 },
          { name:"Incline DB Curl", sets:3, target:"12 reps", note:"45° seat, arm hangs behind body — maximum long head stretch", rest:90 },
          { name:"Hammer Curl", sets:3, target:"12 reps", note:"Brachialis + forearm thickness", rest:60 },
        ]
      },
      {
        title:"Forearms + Grip", exercises:[
          { name:"Wrist Curl (supinated)", sets:3, target:"20 reps", note:"Flexors — underside of forearm", rest:45 },
          { name:"Wrist Curl (pronated)", sets:3, target:"20 reps", note:"Extensors — top of forearm", rest:45 },
          { name:"Reverse Curl (EZ bar)", sets:3, target:"12 reps", note:"Brachioradialis — thickness above the wrist", rest:60 },
          { name:"Farmer Carry", sets:3, target:"30 sec", note:"Grip strength for the court — heavy", rest:60 },
        ]
      },
      {
        title:"Rotator Cuff", exercises:[
          { name:"Band External Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side", rest:45 },
          { name:"Band Internal Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side", rest:45 },
        ]
      },
    ]
  },

  fri: {
    label:"Friday", name:"Basketball / Rest", subtitle:"Active Recovery", color:"#576574",
    sections:[
      {
        title:"Options", exercises:[
          { name:"Pickup Basketball", sets:1, target:"Full game", note:"Enjoy it — don't track, just play", rest:0 },
          { name:"Light Walk", sets:1, target:"20 min", note:"Promotes blood flow, aids recovery", rest:0 },
          { name:"Foam Roll", sets:1, target:"20 min", note:"Quads, hamstrings, adductors, calves, upper back", rest:0 },
        ]
      },
    ]
  },

  sat: {
    label:"Saturday", name:"Full Rest", subtitle:"Recovery Day", color:"#444",
    sections:[
      {
        title:"Recovery Protocol", exercises:[
          { name:"Sleep 8–9 hrs", sets:1, target:"Non-negotiable", note:"Growth hormone peaks during deep sleep", rest:0 },
          { name:"1 Gallon Water", sets:1, target:"Minimum", note:"More if yesterday was intense", rest:0 },
          { name:"Light Walk", sets:1, target:"10–20 min", note:"Optional — promotes circulation", rest:0 },
          { name:"Meal Prep", sets:1, target:"Week ahead", note:"Set yourself up for nutrition success", rest:0 },
          { name:"Foam Roll", sets:1, target:"20 min", note:"Optional full body", rest:0 },
          { name:"Review Week", sets:1, target:"5 min", note:"What moved up? What felt heavy? Adjust loads next week", rest:0 },
        ]
      },
    ]
  },
};

export const TEMPO = {
  1: "3-1-3 (3 sec down, 1 sec pause, 3 sec up)",
  2: "3-1-1 (3 sec down, 1 sec pause, 1 sec up)",
  3: "3-0-1 (3 sec down, no pause, 1 sec up)",
};

export const PHASE_INFO = {
  1: { name:"Reactivation", weeks:"Weeks 1–2", desc:"60–65% intensity. Isometrics at shortened position. Tendons lag behind muscles — build the foundation.", color:"#e8a838" },
  2: { name:"Build", weeks:"Weeks 3–6", desc:"Progressive overload every session. All plyos active. Isometrics at mid-range. This is where the physique gets built.", color:"#e05c2a" },
  3: { name:"Shred & Peak", weeks:"Weeks 7–12", desc:"Deficit nutrition. Isometrics at full length. Max conditioning. Tempo 3-0-1. This is game day you.", color:"#c0392b" },
};
