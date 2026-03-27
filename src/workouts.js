export const PHASE_COLORS = { 1: "#e8a838", 2: "#e05c2a", 3: "#c0392b" };
export const DAY_ORDER = ["mon","tue","wed","thu","fri","sat","sun"];
export const JS_TO_DAY = { 1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat",0:"sun" };

export const WORKOUTS = {

  mon: {
    label:"Monday", name:"Boxing", subtitle:"Skill + Conditioning", color:"#576574",
    sections:[
      { title:"Session", exercises:[
        { name:"Boxing Training", sets:1, target:"Full session", note:"Combinations, footwork, bag work or sparring. Upper body and core dominant.", rest:0 },
        { name:"Post-Session Foam Roll", sets:1, target:"8 min", note:"Shoulders, forearms, lats, hips. Prioritize what's tight.", rest:0 },
      ]},
    ]
  },

  tue: {
    label:"Tuesday", name:"Sprints", subtitle:"Dedicated Speed Day", color:"#27ae60",
    sections:[
      { title:"Dynamic Warm-Up", exercises:[
        { name:"Easy Jog", sets:1, target:"3 min", note:"Get the legs warm — don't skip this.", rest:0 },
        { name:"A-Skips", sets:2, target:"20 yards", note:"Paw the ground back under the hip, arm drive matches the leg.", rest:30 },
        { name:"Build-Up Accelerations", sets:3, target:"20 yards @ 65%", note:"Each rep a little faster — mechanics before max effort.", rest:45 },
      ]},
      { title:"Phase 1 Protocol", exercises:[
        { name:"100m Sprint @ 75%", sets:6, target:"1 rep", note:"Walk back every rep — full recovery between reps is what makes these quality, not grinding through short rest.", rest:90 },
        { name:"40m Acceleration @ 85%", sets:4, target:"1 rep", note:"Drive the arms hard — 90° bend, drive back not across the body. Shin angle forward at the start.", rest:60 },
      ]},
      { title:"Phase 2 Protocol", exercises:[
        { name:"100m Sprint @ 85%", sets:8, target:"1 rep", note:"75 sec rest between reps.", rest:75 },
        { name:"50m Fly Sprint", sets:4, target:"1 rep", note:"Rolling start — hit max velocity at the 20m mark, hold it through the finish.", rest:90 },
        { name:"40m Sprint @ 95%", sets:4, target:"1 rep", note:"Standing start, maximum acceleration intent.", rest:90 },
      ]},
      { title:"Phase 3 Protocol", exercises:[
        { name:"100m Sprint @ 90%", sets:10, target:"1 rep", note:"60 sec rest. This is where conditioning meets speed.", rest:60 },
        { name:"50m Fly @ 100%", sets:6, target:"1 rep", note:"Absolute max velocity — 2 min rest, don't shortchange it.", rest:120 },
        { name:"20m Max Acceleration", sets:4, target:"1 rep", note:"Dead stop start, 100% effort — 2 min rest.", rest:120 },
        { name:"150m Build-Up Run", sets:2, target:"1 rep", note:"60% building to 100% over the full distance — trains speed endurance.", rest:120 },
      ]},
    ]
  },

  wed: {
    label:"Wednesday", name:"Boxing", subtitle:"Skill + Conditioning", color:"#576574",
    sections:[
      { title:"Session", exercises:[
        { name:"Boxing Training", sets:1, target:"Full session", note:"Combinations, defensive work, sparring or heavy bag. Mid-week conditioning focus.", rest:0 },
        { name:"Post-Session Foam Roll", sets:1, target:"8 min", note:"Shoulders, forearms, upper back, hips.", rest:0 },
      ]},
    ]
  },

  // TARGET: 75-80 min
  thu: {
    label:"Thursday", name:"Lower A", subtitle:"Quad Dominant + Athletic Power", color:"#e8a838",
    sections:[
      {
        title:"Activation",
        exercises:[
          { name:"Banded Lateral Walk", sets:2, target:"15 steps/side", note:"The most important direction — activates glute medius which stabilizes every single-leg movement. Keep the band taut, don't let knees cave.", rest:20 },
          { name:"Hip CARs", sets:2, target:"5 reps/side", note:"Full slow circle of the hip joint — forward 5 then backward 5 each side. Opens the joint capsule, improves ROM for deep squats.", rest:30 },
          { name:"Frog Stretch Hold", sets:2, target:"30 sec", note:"Groin and adductor prep before any lateral loading.", rest:20 },
        ]
      },
      {
        title:"Power Primer",
        exercises:[
          { name:"Kneeling to Tuck Jump", sets:4, target:"3 reps", note:"Tall kneeling — explode both feet to the floor landing in a squat, immediately drive both knees to chest at peak. Two-part movement: the floor transition is the power expression. Full reset between every rep — max CNS demand.", rest:120 },
          { name:"Split Stance Jump Switches", sets:3, target:"6 reps/side", note:"Start in a lunge, explode upward, switch legs in air, land in opposite lunge. Reactive hip flexor power. Land softly — the deceleration quality matters as much as the jump.", rest:90 },
        ]
      },
      {
        title:"Isometrics",
        exercises:[
          { name:"Spanish Squat Hold", sets:3, target:"45 sec", note:"Band around a fixed post. Lean back, squat to 90° — band pulls knees forward creating max quad and patellar tendon load. Ph3: go deeper and hold longer.", rest:60 },
          { name:"Split Stance Hold", sets:3, target:"20 sec/side", note:"Split squat position, hold at the bottom. Hip flexor and quad under simultaneous stretch and load — more specific to the single-leg work that follows than a wall sit. Lock in, no adjusting.", rest:45 },
        ]
      },
      {
        title:"Quad Strength",
        exercises:[
          { name:"Banded Box Squat", sets:4, target:"5 reps", note:"Bands anchored low, looped over the bar. Sit back to box, pause, EXPLODE against band resistance. Band deloads at the bottom, loads hardest at lockout — trains rate of force development for jumping. Ph1: light bands. Ph2–3: drive aggressively.", rest:180 },
          { name:"Front Squat — Heel Elevated", sets:3, target:"8 reps", note:"2–3 inch plates under heels. Upright torso, knee tracks over toe — maximum quad load with reduced lower back stress. Hits the quad from a different angle than box squat. Tempo applies.", rest:180 },
          { name:"Bulgarian Split Squat with Rotation", sets:3, target:"10 reps/leg", note:"Rear foot elevated. Hold a DB or plate at chest. At the bottom rotate torso AWAY from the front leg. Anti-rotation core plus quad plus glute in one movement. Tempo on the descent.", rest:120 },
        ]
      },
      {
        title:"Unilateral + Isolation",
        exercises:[
          { name:"Barbell Single-Leg Reverse Lunge", sets:3, target:"10 reps/leg", note:"Barbell on back, step back into lunge, drive through front heel. Unilateral leg strength and hip stability under axial load. Keep front shin vertical.", rest:120 },
          { name:"Leg Extension", sets:3, target:"15 reps", note:"4 sec eccentric, squeeze at full extension 1 sec. Patellar tendon under direct load — do not skip on Phase 1. Go near-failure on last set.", rest:90 },
        ]
      },
      {
        title:"Adductors",
        exercises:[
          { name:"Side Lunge", sets:3, target:"10 reps/side", note:"Push hips back as you step laterally — feel the inner thigh of the straight leg stretch. The only squat pattern that loads the adductors eccentrically.", rest:90 },
          { name:"Weighted Copenhagen Plank", sets:3, target:"20 sec/side", note:"Top leg on bench, bottom leg hanging, plate on hip. Adductor and oblique under simultaneous load. Build plate weight progressively week to week.", rest:60 },
        ]
      },
      {
        title:"Calves + Tibialis",
        exercises:[
          { name:"Standing Calf Raise", sets:4, target:"20 reps", note:"3 sec eccentric, 1 sec stretch at the bottom. Full range — heel drops as low as possible. Gastrocnemius.", rest:60 },
          { name:"Tibialis Raise", sets:3, target:"20 reps", note:"Heels on a step, pull toes up against resistance. Prevents shin splints — non-negotiable with sprinting and boxing footwork. Seated calf is on Lower B.", rest:45 },
        ]
      },
      {
        title:"Core",
        exercises:[
          { name:"Hanging Leg Raise", sets:3, target:"12 reps", note:"Dead hang. No momentum. Rotate each week: straight leg raises → toes to bar → oblique knee tucks → windshield wipers. Progress through these across the 12 weeks.", rest:60 },
          { name:"Plank Drags", sets:3, target:"10 reps/side", note:"Push-up plank, KB or plate on the floor beside you. Drag it across your body. Zero hip rotation — the anti-rotation demand is the entire point.", rest:60 },
        ]
      },
    ]
  },

  // TARGET: 75-80 min
  fri: {
    label:"Friday", name:"Upper A", subtitle:"Chest + Back Heavy", color:"#2980b9",
    sections:[
      {
        title:"Activation",
        exercises:[
          { name:"Band Pull-Aparts", sets:3, target:"15 reps", note:"Arms straight, pull band to chest level. Rear delt and mid-trap activation — the single most important pre-press movement.", rest:30 },
          { name:"Dead Hang", sets:2, target:"20 sec", note:"Full bodyweight hang. Decompresses the shoulder joint, activates lats passively. Creates proper shoulder positioning before pressing.", rest:30 },
          { name:"Slow Controlled Single-Arm DB Row", sets:3, target:"8 reps/side", note:"3 sec down, pause at stretch, 2 sec pull. Light weight. Activates the lat and mid-back with actual movement before loading them.", rest:45 },
        ]
      },
      {
        title:"Power Primer",
        exercises:[
          { name:"Hang Clean High Pull", sets:4, target:"4 reps", note:"Bar at mid-thigh. Aggressive hip extension — triple extension of ankle, knee, and hip simultaneously. Shrug hard, pull bar to sternum height with elbows high and wide. This is a hip power movement, not a bicep curl. Primes every pulling muscle before back work.", rest:120 },
          { name:"Plyo Push-Ups", sets:3, target:"6 reps", note:"Hands leave the floor. Lower under control, explode upward. Reset each rep. Upper body rate of force development.", rest:60 },
        ]
      },
      {
        title:"Isometrics",
        exercises:[
          { name:"Wall Chest Push", sets:3, target:"30 sec", note:"Arms at 90°, push maximally into wall. Chest and tricep tendon loading before pressing.", rest:60 },
          { name:"Dead Hang", sets:3, target:"30 sec", note:"Lat and bicep tendon loading before pulling.", rest:60 },
        ]
      },
      {
        title:"Chest — Heavy Compounds",
        exercises:[
          { name:"Incline Barbell Press", sets:4, target:"8 reps", note:"30–45° incline. Upper chest and front delt. Don't exceed 45° — steeper becomes shoulder press. Tempo applies.", rest:180 },
          { name:"Flat Barbell Bench Press", sets:4, target:"8 reps", note:"Primary chest mass builder. Pause at the bottom every rep — eliminates bounce, increases pec loading. Tempo applies.", rest:180 },
        ]
      },
      {
        title:"Back — Heavy Compounds",
        exercises:[
          { name:"Weighted Pull-Ups", sets:4, target:"8 reps", note:"Full dead hang at the bottom of every rep. No half reps, no kipping. Most complete lat and upper back exercise that exists.", rest:180 },
          { name:"Barbell Bent-Over Row", sets:4, target:"10 reps", note:"Hinge to 45° and hold it — no standing up between reps. Drive elbows back past the torso. Tempo applies.", rest:180 },
        ]
      },
      {
        title:"Accessories",
        exercises:[
          { name:"Incline DB Fly", sets:3, target:"12 reps", note:"Slow eccentric — feel every fiber of the upper pec lengthen. Don't let arms drop too low.", rest:90 },
          { name:"Lat Pullover", sets:3, target:"12 reps", note:"DB held in both hands, lower behind head with soft elbows — full lat stretch. Pull back over chest. Full lat range no other exercise provides.", rest:90 },
          { name:"Barbell Shrug", sets:3, target:"15 reps", note:"Hold 1 sec at top. Straight up, straight down — no rolling.", rest:90 },
        ]
      },
      {
        title:"Rotator Cuff",
        exercises:[
          { name:"Band External Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side. Critical with boxing twice a week — shoulder longevity depends on this.", rest:45 },
          { name:"Band Internal Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side. Balance both directions.", rest:45 },
        ]
      },
    ]
  },

  // TARGET: 80-85 min
  sat: {
    label:"Saturday", name:"Lower B", subtitle:"Posterior Chain + Vertical + Athletic", color:"#c0392b",
    sections:[
      {
        title:"Activation",
        exercises:[
          { name:"Banded Lateral Walk", sets:2, target:"15 steps/side", note:"Same as Lower A — glute medius activation is critical before any posterior chain loading.", rest:20 },
          { name:"Hip Flexor Stretch", sets:2, target:"45 sec/side", note:"Kneeling lunge. Opens hip extension range for deadlifts and jumps. Posterior pelvic tilt to deepen the stretch.", rest:20 },
          { name:"Glute Bridge Hold", sets:2, target:"10 reps + 5 sec hold", note:"Drive up and squeeze hard at the top for 5 seconds each rep. Glute activation before loading them.", rest:30 },
        ]
      },
      {
        title:"Power Primer",
        exercises:[
          { name:"Kettlebell Snatch", sets:4, target:"5 reps/side", note:"Hike KB back, drive hips forward explosively, punch overhead in one motion. Hip snap is everything — not a shoulder press. Develops the posterior chain power that transfers directly to sprinting and jumping. Ph1: nail the mechanics. Ph2–3: add load.", rest:120 },
          { name:"Lateral Hop Single-Leg Tuck Jump", sets:3, target:"4 reps/side", note:"Lateral hop landing on one foot — immediately jump vertically driving both knees to chest. Lateral reactive ability plus vertical power. The single-leg landing is where the athletic adaptation happens. Land soft, absorb, explode.", rest:120 },
        ]
      },
      {
        title:"Vertical Jump Protocol",
        exercises:[
          { name:"Approach Jump Practice", sets:4, target:"5 reps", note:"2–3 step approach. Gather step — hinge hips, load glutes. Arm swing generates 10–15% of jump height, drive it aggressively. Full reset between every rep — this is skill practice not conditioning.", rest:120 },
          { name:"Broad Jumps", sets:3, target:"5 reps", note:"Max horizontal distance. Full hip extension, aggressive arm drive, land and absorb. Same hip extension pattern as sprinting.", rest:120 },
          { name:"Depth Jump to Max Reach", sets:3, target:"5 reps", note:"Ph2–3 only. Step off box, land, explode immediately — ground contact under 0.2 seconds. Trains reactive strength.", rest:120 },
        ]
      },
      {
        title:"Isometrics",
        exercises:[
          { name:"RDL Hold at Mid-Shin", sets:3, target:"30 sec", note:"50% load — hold the hinge position at mid-shin. Hamstring and posterior knee tendon loading before heavy work. Uncomfortable — that's intentional.", rest:60 },
        ]
      },
      {
        title:"Posterior Chain Strength",
        exercises:[
          { name:"Nordic Curls", sets:3, target:"6 reps", note:"Ph2–3 only — do these FIRST while hamstrings are completely fresh. Kneel on pad, anchor feet, lower your body using hamstring eccentric control as slowly as possible. Most effective hamstring exercise for both strength and injury prevention.", rest:120 },
          { name:"Trap Bar Deadlift", sets:4, target:"5 reps", note:"Primary strength driver today. No squats on this day — spine is fully recovered from Thursday. Controlled descent, explosive hip drive.", rest:180 },
          { name:"Romanian Deadlift", sets:4, target:"10 reps", note:"Hamstring hypertrophy after the heavy hinge. Feel the full stretch at the bottom every rep. Tempo applies.", rest:180 },
          { name:"Barbell Hip Thrust", sets:4, target:"12 reps", note:"Squeeze plus 1 sec hold at the top every single rep. Primary glute hypertrophy exercise.", rest:120 },
          { name:"Seated Leg Curl", sets:4, target:"12 reps", note:"3 sec eccentric. The slow lowering is what drives hamstring hypertrophy — do not rush it.", rest:90 },
        ]
      },
      {
        title:"Adductors",
        exercises:[
          { name:"Adductor Machine", sets:3, target:"15 reps", note:"3 sec eccentric opening — the lengthening is where the adaptation happens. Full range of motion.", rest:90 },
          { name:"Copenhagen Plank", sets:3, target:"25 sec/side", note:"Top leg on bench, bottom leg hanging. Groin injury prevention — evidence-backed and non-negotiable.", rest:60 },
        ]
      },
      {
        title:"Conditioning Finisher",
        exercises:[
          { name:"Sled Sprint Carry", sets:4, target:"20 yards", note:"Lean in, drive the knees, big arm swing. Leg power plus conditioning simultaneously. Ph1: light load, mechanics. Ph2: moderate, controlled aggression. Ph3: heavy, max effort. 90 sec rest between sets.", rest:90 },
        ]
      },
    ]
  },

  // TARGET: 80-85 min
  sun: {
    label:"Sunday", name:"Upper B", subtitle:"Shoulders + Arms + Athletic Detail", color:"#8e44ad",
    sections:[
      {
        title:"Activation",
        exercises:[
          { name:"Band Pull-Aparts", sets:3, target:"15 reps", note:"Rear delt and rotator cuff activation. Four days since last boxing — shoulders still benefit from activation work before loading them.", rest:30 },
          { name:"Band External Rotation", sets:2, target:"15 reps/arm", note:"Elbow at side — rotator cuff warm-up before heavy overhead pressing.", rest:30 },
        ]
      },
      {
        title:"Power Primer",
        exercises:[
          { name:"Med Ball Overhead Slam", sets:3, target:"6 reps", note:"Full extension overhead, slam down through the floor. Posterior chain activation and shoulder prep in one.", rest:60 },
          { name:"Plyo Push-Ups", sets:3, target:"6 reps", note:"Upper body rate of force development. Hands leave the floor. Reset each rep.", rest:60 },
        ]
      },
      {
        title:"Isometrics",
        exercises:[
          { name:"OHP Lockout Hold", sets:3, target:"20 sec", note:"60% of working weight, pressed overhead, hold at lockout. Shoulder tendon loading before the heavy press.", rest:60 },
        ]
      },
      {
        title:"Shoulder — Compound",
        exercises:[
          { name:"Overhead Press", sets:4, target:"10 reps", note:"Tempo applies. Front delt primary, full shoulder stability. Brace the core hard — don't let the lower back extend.", rest:180 },
          { name:"Face Pulls", sets:3, target:"15 reps", note:"Rope at face height — pull to face with external rotation at the end, elbows finishing behind the bar. Done before lateral raises to prime the rear delt and rotator cuff.", rest:60 },
        ]
      },
      {
        title:"Shoulder — Isolation",
        exercises:[
          { name:"DB Lateral Raise", sets:3, target:"15 reps", note:"2 sec up, 3 sec down. Lead with the elbow. Pinky slightly higher than thumb at top. No swinging — if you're swinging it's too heavy.", rest:60 },
          { name:"Rear Delt DB Fly", sets:4, target:"15 reps", note:"Chest parallel to floor. Slow eccentric, zero momentum. Keep the weight light enough to feel the rear delt working — most people go too heavy.", rest:60 },
          { name:"Cable Lateral Raise", sets:3, target:"15 reps/side", note:"Low pulley — constant tension eliminates the dead spot of the DB version. Interleaved after rear delt work so the lateral head isn't pre-exhausted.", rest:60 },
          { name:"Reverse Pec Deck", sets:3, target:"15 reps", note:"Squeeze hard at full extension — rear delt peak contraction.", rest:60 },
        ]
      },
      {
        title:"Second Chest Stimulus",
        exercises:[
          { name:"Pec Deck / Machine Fly", sets:3, target:"12 reps", note:"Constant tension, mid-chest squeeze. Second chest hit this week — isolation work, not compound.", rest:90 },
          { name:"Chest Dips", sets:2, target:"To Failure", note:"Forward lean, elbows slightly flared. Full pec stretch at the bottom. Lower chest primary. Bodyweight so recovery cost is minimal.", rest:60 },
        ]
      },
      {
        title:"Back Detail",
        exercises:[
          { name:"Seated Cable Row", sets:3, target:"12 reps", note:"Full forward lean at the stretch, drive elbows past the torso on the pull. Mid-back and lat thickness.", rest:90 },
          { name:"Lat Pullover", sets:3, target:"12 reps", note:"Second hit this week. DB or cable — full lat lengthening behind the head, pull back over chest.", rest:90 },
        ]
      },
      {
        title:"Triceps",
        exercises:[
          { name:"Close-Grip Bench Press", sets:3, target:"10 reps", note:"Hands shoulder-width. Hits all three heads — best tricep mass builder.", rest:120 },
          { name:"Overhead Tricep Extension", sets:3, target:"12 reps", note:"Arms overhead — long head of tricep maximally stretched. The long head is the biggest head and this is its primary exercise.", rest:90 },
          { name:"Underhand Tricep Pushdown", sets:3, target:"15 reps", note:"Reverse grip on cable bar — medial head emphasis. Different angle from overhead extension.", rest:60 },
        ]
      },
      {
        title:"Biceps",
        exercises:[
          { name:"Slow Controlled Barbell Curl", sets:3, target:"10 reps", note:"4 sec eccentric, 1 sec pause at stretch, 2 sec concentric. No swinging. The slow eccentric is what drives hypertrophy — weight will be lighter than your normal curl.", rest:90 },
          { name:"Incline DB Curl", sets:3, target:"12 reps", note:"45° bench, arm hangs behind the body at full extension. Maximum long head stretch — the behind-the-body arm position is what separates this from a standard DB curl.", rest:90 },
          { name:"Hammer Curl", sets:3, target:"12 reps", note:"Neutral grip. Brachialis and forearm thickness — makes the arm look bigger from every angle.", rest:60 },
        ]
      },
      {
        title:"Forearms + Core",
        exercises:[
          { name:"Reverse Curl (EZ Bar)", sets:3, target:"12 reps", note:"Overhand grip — brachioradialis emphasis, thickness above the wrist.", rest:60 },
          { name:"Farmer Carry", sets:3, target:"30 sec", note:"Heavy DBs. Grip strength for boxing and court. Forearms, traps, and core all working simultaneously.", rest:60 },
          { name:"Hanging Leg Raise", sets:3, target:"12 reps", note:"Rotate weekly: straight raises → toes to bar → oblique knee tucks → windshield wipers.", rest:60 },
        ]
      },
      {
        title:"Rotator Cuff",
        exercises:[
          { name:"Band External Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side. Every upper day ends here — shoulder longevity with boxing in the program.", rest:45 },
          { name:"Band Internal Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side.", rest:45 },
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
  1: { name:"Reactivation", weeks:"Weeks 1–2", desc:"60–65% intensity. Isometrics at shortened position. Tendons lag behind muscles — build the foundation first.", color:"#e8a838" },
  2: { name:"Build", weeks:"Weeks 3–6", desc:"Progressive overload every session. All plyos active. Isometrics at mid-range. This is where everything gets built.", color:"#e05c2a" },
  3: { name:"Shred & Peak", weeks:"Weeks 7–12", desc:"Deficit nutrition. Isometrics at full length. Max conditioning. Tempo 3-0-1. This is game day you.", color:"#c0392b" },
};

// ── EXERCISE SWAPS ─────────────────────────────────────────────────────────
export const SWAPS = {
  "Banded Box Squat": [
    { name:"Pause Squat", sets:4, target:"5 reps", note:"Full pause at the bottom for 2 sec — removes stretch reflex, pure quad strength from a dead stop.", rest:180 },
    { name:"Goblet Squat", sets:4, target:"10 reps", note:"DB or KB held at chest. Upright torso, deep knee bend. Good when bands aren't available.", rest:120 },
    { name:"Hack Squat Machine", sets:4, target:"8 reps", note:"Machine removes the stability demand — pure quad loading. Good when lower back is fatigued.", rest:150 },
  ],
  "Front Squat — Heel Elevated": [
    { name:"Leg Press", sets:4, target:"12 reps", note:"High and narrow foot placement for quad emphasis. 3 sec eccentric. No lower back involvement.", rest:120 },
    { name:"Dumbbell Goblet Squat", sets:3, target:"12 reps", note:"Heavy DB at chest, heels elevated on plates. Good front squat substitute when the rack isn't available.", rest:120 },
  ],
  "Bulgarian Split Squat with Rotation": [
    { name:"Walking Lunges", sets:3, target:"12 reps/leg", note:"Step forward into lunge, drive back up and step through. Develops rhythm and coordination alongside strength.", rest:120 },
    { name:"Reverse Lunge", sets:3, target:"10 reps/leg", note:"Step backward — easier on the knees. Same quad and glute demand.", rest:120 },
    { name:"Step-Ups", sets:3, target:"10 reps/leg", note:"Box or bench, drive through the heel. Unilateral quad and glute without the balance challenge.", rest:120 },
    { name:"Bulgarian Split Squat", sets:3, target:"10 reps/leg", note:"Standard version without rotation. Heavy DBs in each hand.", rest:120 },
  ],
  "Barbell Single-Leg Reverse Lunge": [
    { name:"DB Reverse Lunge", sets:3, target:"10 reps/leg", note:"Same movement with DBs — easier to control, less spinal loading.", rest:120 },
    { name:"Step-Ups with Knee Drive", sets:3, target:"10 reps/leg", note:"Step up, drive the free knee to hip height at the top.", rest:120 },
    { name:"Split Squat", sets:3, target:"10 reps/leg", note:"Static — both feet stay planted. Simplest single-leg quad exercise.", rest:120 },
  ],
  "Leg Extension": [
    { name:"Sissy Squat", sets:3, target:"12 reps", note:"Extreme knee flexion — highest patellar tendon load you can create. 3 sec eccentric, hold at bottom 1 sec. Ph1: partial range.", rest:90 },
    { name:"Terminal Knee Extension (Band)", sets:3, target:"20 reps/leg", note:"Band around back of knee, drive knee forward against band. VMO loading with minimal joint stress.", rest:60 },
  ],
  "Side Lunge": [
    { name:"Cossack Squat", sets:3, target:"8 reps/side", note:"Deep lateral lunge — one leg straight, one in a deep squat. More range than side lunge.", rest:90 },
    { name:"Sumo Squat", sets:3, target:"12 reps", note:"Wide stance, toes out. Both adductors load simultaneously. Hold a heavy DB for resistance.", rest:90 },
  ],
  "Incline Barbell Press": [
    { name:"Incline DB Press", sets:4, target:"10 reps", note:"Deeper stretch at the bottom than barbell. Each arm works independently.", rest:150 },
    { name:"Machine Incline Press", sets:4, target:"12 reps", note:"Fixed path — good when shoulders are sensitive.", rest:120 },
  ],
  "Flat Barbell Bench Press": [
    { name:"DB Bench Press", sets:4, target:"10 reps", note:"Deeper stretch, independent arm movement exposes imbalances.", rest:150 },
    { name:"Machine Chest Press", sets:4, target:"12 reps", note:"Fixed path, joint-friendly.", rest:120 },
    { name:"Close-Grip Bench Press", sets:4, target:"10 reps", note:"More tricep involvement. Good pressing strength variation.", rest:180 },
  ],
  "Weighted Pull-Ups": [
    { name:"Lat Pulldown — Wide Grip", sets:4, target:"10 reps", note:"Same pulling pattern, easier to load and control. Full stretch at the top.", rest:150 },
    { name:"Assisted Pull-Ups", sets:4, target:"8 reps", note:"Machine assistance — maintains movement pattern at lower bodyweight.", rest:150 },
  ],
  "Barbell Bent-Over Row": [
    { name:"DB Bent-Over Row", sets:4, target:"10 reps/arm", note:"Greater range of motion, removes balance demand.", rest:120 },
    { name:"Pendlay Row", sets:4, target:"6 reps", note:"Dead stop on floor each rep, explosive pull. More power development than standard row.", rest:180 },
    { name:"Seated Cable Row", sets:4, target:"12 reps", note:"Full forward lean stretch. Constant tension. Lower back stays more neutral.", rest:120 },
  ],
  "Nordic Curls": [
    { name:"Leg Curl — Slow Eccentric", sets:4, target:"10 reps", note:"5 sec eccentric on every rep. Closest substitute to Nordic for hamstring lengthening demand.", rest:120 },
    { name:"Good Mornings", sets:3, target:"10 reps", note:"Bar on back, hinge forward keeping back flat — loads hamstrings and erectors under load.", rest:120 },
  ],
  "Trap Bar Deadlift": [
    { name:"Conventional Deadlift", sets:4, target:"5 reps", note:"Standard barbell. More hip hinge and posterior chain demand than trap bar.", rest:180 },
    { name:"Sumo Deadlift", sets:4, target:"5 reps", note:"Wide stance, hands inside legs. More adductor and quad involvement.", rest:180 },
  ],
  "Romanian Deadlift": [
    { name:"Cable Pull-Through", sets:4, target:"12 reps", note:"Low pulley, rope between legs — hip hinge with constant cable tension. No axial load.", rest:120 },
    { name:"Kettlebell Swing", sets:4, target:"15 reps", note:"Explosive RDL pattern. Develops hip extension power for jumping and sprinting.", rest:120 },
  ],
  "Barbell Hip Thrust": [
    { name:"DB Hip Thrust", sets:4, target:"12 reps", note:"Same movement, DBs on hips. Easier to set up, slightly less stable.", rest:120 },
    { name:"Cable Hip Extension", sets:4, target:"15 reps/leg", note:"Low cable, ankle attachment. Single-leg glute isolation.", rest:90 },
  ],
  "Seated Leg Curl": [
    { name:"Lying Leg Curl", sets:4, target:"12 reps", note:"Face down — slightly different hamstring angle. 3 sec eccentric.", rest:90 },
  ],
  "Overhead Press": [
    { name:"DB Shoulder Press", sets:4, target:"10 reps", note:"Independent arms — deeper range, exposes imbalances.", rest:180 },
    { name:"Arnold Press", sets:4, target:"10 reps", note:"Start palms facing you, rotate to palms forward as you press. Hits all three delt heads.", rest:150 },
  ],
  "DB Lateral Raise": [
    { name:"Cable Lateral Raise — Both Arms", sets:3, target:"15 reps", note:"Cross cables at low pulley, raise both simultaneously. Constant tension.", rest:60 },
    { name:"Machine Lateral Raise", sets:3, target:"15 reps", note:"Pad on wrist — removes momentum entirely.", rest:60 },
  ],
  "Rear Delt DB Fly": [
    { name:"Band Pull-Aparts", sets:4, target:"20 reps", note:"Bodyweight band — rear delt pump, no equipment needed beyond a band.", rest:45 },
    { name:"Face Pulls (Extra Sets)", sets:4, target:"15 reps", note:"Rope at face height, external rotation finish. Rear delt plus rotator cuff.", rest:60 },
  ],
  "Close-Grip Bench Press": [
    { name:"Skull Crushers", sets:3, target:"12 reps", note:"EZ bar lowered to forehead. Long head under stretch.", rest:90 },
    { name:"Tricep Dips", sets:3, target:"To Failure", note:"Elbows tucked — tricep emphasis over chest.", rest:120 },
  ],
  "Overhead Tricep Extension": [
    { name:"DB Overhead Extension", sets:3, target:"12 reps", note:"One or two DBs overhead — same long head stretch.", rest:90 },
  ],
  "Slow Controlled Barbell Curl": [
    { name:"Cable Curl — Slow Eccentric", sets:3, target:"12 reps", note:"Low pulley cable, 4 sec eccentric. Constant tension version.", rest:90 },
    { name:"Preacher Curl", sets:3, target:"10 reps", note:"Upper arm fixed on pad — removes momentum completely.", rest:90 },
  ],
  "Incline DB Curl": [
    { name:"Cable Curl — High Pulley", sets:3, target:"12 reps/arm", note:"Single arm from above — keeps the bicep under tension at the lengthened position.", rest:90 },
    { name:"Spider Curl", sets:3, target:"12 reps", note:"Chest-down on incline bench, curl DBs — no momentum possible.", rest:90 },
  ],
};
