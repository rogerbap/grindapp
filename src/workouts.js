export const PHASE_COLORS = { 1: "#e8a838", 2: "#e05c2a", 3: "#c0392b" };
export const DAY_ORDER = ["mon","tue","wed","thu","fri","sat","sun"];
export const JS_TO_DAY = { 1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat",0:"sun" };
// Schedule: Mon=Sprints | Tue=Boxing/Flex(optional) | Wed=Full REST | Thu=Lower A | Fri=Upper A | Sat=Lower B | Sun=Upper B

export const WORKOUTS = {
  mon: {
    label:"Monday", name:"Sprints", subtitle:"Dedicated speed day", color:"#27ae60",
    sections:[
      { title:"Dynamic Warm-Up", exercises:[
        { name:"Easy Jog", sets:1, target:"3 min", note:"Get the legs warm — don't skip this.", rest:0, tags:["sprint","bodyweight","warmup"] },
        { name:"A-Skips", sets:2, target:"20 yards", note:"Paw the ground back under the hip, arm drive matches the leg.", rest:30, tags:["sprint","bodyweight","plyo","warmup"] },
        { name:"Build-Up Accelerations", sets:3, target:"20 yards @ 65%", note:"Each rep a little faster — mechanics before max effort.", rest:45, tags:["sprint","bodyweight","explosive","warmup"] },
      ]},
      { title:"Phase 1 Protocol", exercises:[
        { name:"100m Sprint @ 75%", sets:6, target:"1 rep", note:"Walk back every rep — full recovery is what makes these quality.", rest:90, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"40m Acceleration @ 85%", sets:4, target:"1 rep", note:"Drive the arms hard — 90° bend, drive back not across. Shin angle forward at the start.", rest:60, tags:["sprint","bodyweight","explosive","bilateral"] },
      ]},
      { title:"Phase 2 Protocol", exercises:[
        { name:"100m Sprint @ 85%", sets:8, target:"1 rep", note:"75 sec rest between reps.", rest:75, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"50m Fly Sprint", sets:4, target:"1 rep", note:"Rolling start — hit max velocity at the 20m mark.", rest:90, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"40m Sprint @ 95%", sets:4, target:"1 rep", note:"Standing start, maximum acceleration intent.", rest:90, tags:["sprint","bodyweight","explosive","bilateral"] },
      ]},
      { title:"Phase 3 Protocol", exercises:[
        { name:"100m Sprint @ 90%", sets:10, target:"1 rep", note:"60 sec rest. This is where conditioning meets speed.", rest:60, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"50m Fly @ 100%", sets:6, target:"1 rep", note:"Absolute max velocity — 2 min rest.", rest:120, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"20m Max Acceleration", sets:4, target:"1 rep", note:"Dead stop start, 100% effort — 2 min rest.", rest:120, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"150m Build-Up Run", sets:2, target:"1 rep", note:"60% building to 100% — trains speed endurance.", rest:120, tags:["sprint","bodyweight","explosive","bilateral"] },
      ]},
    ]
  },

  tue: {
    label:"Tuesday", name:"Boxing / Flex", subtitle:"Optional boxing or full rest", color:"#576574",
    sections:[
      { title:"Options", exercises:[
        { name:"Boxing Training", sets:1, target:"Full session", note:"Best use of Tuesday — full rest Wednesday means fatigue clears before Thursday. Combinations, bag work, sparring, footwork.", rest:0, tags:["push","pull","core","bodyweight","explosive"] },
        { name:"Mobility Session", sets:1, target:"30 min", note:"Run the Mobility + Recovery session from the BUILD tab if skipping boxing. Keeps movement quality high mid-week.", rest:0, tags:["recovery","bodyweight","mobility"] },
        { name:"Full Rest", sets:1, target:"All day", note:"Completely valid — especially in Phase 2 and 3 when intensity is high. Listen to your body.", rest:0, tags:["recovery"] },
      ]},
    ]
  },

  wed: {
    label:"Wednesday", name:"Full Rest", subtitle:"Recovery day — nothing", color:"#2c3e50",
    sections:[
      { title:"Rest Protocol", exercises:[
        { name:"Sleep 8–9 hrs", sets:1, target:"Non-negotiable", note:"Growth hormone peaks in deep sleep. This is when the adaptations from the previous week consolidate.", rest:0, tags:["recovery"] },
        { name:"1 Gallon Water", sets:1, target:"Minimum", note:"", rest:0, tags:["recovery"] },
        { name:"Light Walk", sets:1, target:"10–20 min optional", note:"Promotes circulation without adding stress. Not mandatory.", rest:0, tags:["recovery","bodyweight"] },
        { name:"Meal Prep", sets:1, target:"Optional", note:"Set up nutrition for Thu–Sun lifting block.", rest:0, tags:["recovery"] },
      ]},
    ]
  },

  thu: {
    label:"Thursday", name:"Lower A", subtitle:"Quad Dominant + Athletic Power", color:"#e8a838",
    sections:[
      { title:"Activation", exercises:[
        { name:"Banded Lateral Walk", sets:2, target:"15 steps/side", note:"Most important direction — activates glute medius which stabilizes every single-leg movement. Band taut, knees don't cave.", rest:20, tags:["glute","adductor","band","bilateral","warmup"] },
        { name:"Hip CARs", sets:2, target:"5 reps/side", note:"Full slow circle of the hip joint — forward then backward. Opens the joint capsule, improves ROM for deep squats.", rest:30, tags:["hip","bodyweight","unilateral","warmup"] },
      ]},
      { title:"Power Primer", exercises:[
        { name:"Kneeling to Tuck Jump", sets:4, target:"3 reps", note:"Tall kneeling — explode both feet to floor landing in squat, immediately drive both knees to chest at peak. Full reset between every rep — max CNS demand.", rest:120, tags:["quad","glute","plyo","bodyweight","explosive","bilateral"] },
        { name:"Split Stance Jump Switches", sets:3, target:"6 reps/side", note:"Lunge position, explode upward, switch legs in air, land in opposite lunge. Reactive hip flexor power. Land soft — deceleration quality matters.", rest:90, tags:["quad","glute","plyo","bodyweight","explosive","unilateral"] },
      ]},
      { title:"Isometrics", exercises:[
        { name:"Spanish Squat Hold", sets:3, target:"45 sec", note:"Band around a fixed post, lean back, squat to 90° — band pulls knees forward creating max quad and patellar tendon load. Ph3: go deeper.", rest:60, tags:["quad","band","iso","bilateral"] },
        { name:"Split Stance Hold", sets:3, target:"20 sec/side", note:"Split squat position held at the bottom — hip flexor and quad under simultaneous stretch and load. Lock in, no adjusting.", rest:45, tags:["quad","hip","bodyweight","iso","unilateral"] },
      ]},
      { title:"Quad Strength", exercises:[
        { name:"Banded Box Squat", sets:4, target:"5 reps", note:"Bands anchored low, looped over bar. Sit back to box, pause, EXPLODE against band resistance. Trains rate of force development for jumping.", rest:180, tags:["quad","glute","barbell","band","squat","compound","bilateral","explosive"] },
        { name:"Front Squat — Heel Elevated", sets:3, target:"8 reps", note:"2–3 inch plates under heels. Upright torso, knee tracks over toe — max quad load with reduced lower back stress. Tempo applies.", rest:180, tags:["quad","barbell","squat","compound","bilateral"] },
        { name:"Bulgarian Split Squat with Rotation", sets:3, target:"10 reps/leg", note:"Rear foot elevated, hold DB at chest, rotate torso AWAY from front leg at the bottom. Anti-rotation core plus quad plus glute.", rest:120, tags:["quad","glute","core","dumbbell","lunge","compound","unilateral"] },
      ]},
      { title:"Unilateral + Isolation", exercises:[
        { name:"Barbell Single-Leg Reverse Lunge", sets:3, target:"10 reps/leg", note:"Barbell on back, step back into lunge, drive through front heel. Unilateral leg strength and hip stability under axial load.", rest:120, tags:["quad","glute","barbell","lunge","compound","unilateral"] },
        { name:"Leg Extension", sets:3, target:"15 reps", note:"4 sec eccentric, squeeze at full extension 1 sec. Patellar tendon under direct load.", rest:90, tags:["quad","machine","isolation","bilateral"] },
      ]},
      { title:"Adductors", exercises:[
        { name:"Side Lunge", sets:3, target:"10 reps/side", note:"Push hips back as you step laterally — feel the inner thigh of the straight leg stretch. Only squat pattern that loads adductors eccentrically.", rest:90, tags:["adductor","quad","glute","bodyweight","lunge","compound","unilateral"] },
        { name:"Weighted Copenhagen Plank", sets:3, target:"20 sec/side", note:"Top leg on bench, bottom leg hanging, plate on hip. Adductor and oblique under simultaneous load.", rest:60, tags:["adductor","core","bodyweight","iso","unilateral"] },
      ]},
      { title:"Calves + Tibialis", exercises:[
        { name:"Standing Calf Raise", sets:4, target:"20 reps", note:"3 sec eccentric, 1 sec stretch at bottom. Full range — heel drops as low as possible. Gastrocnemius.", rest:60, tags:["calf","machine","isolation","bilateral"] },
        { name:"Tibialis Raise", sets:3, target:"20 reps", note:"Heels on step, pull toes up against resistance. Prevents shin splints — non-negotiable with sprinting and boxing footwork.", rest:45, tags:["calf","bodyweight","isolation","bilateral"] },
      ]},
      { title:"Core", exercises:[
        { name:"Lying Leg Raise", sets:3, target:"12 reps", note:"Flat on floor, lower back pressed down hard. Raise straight legs to 90° then lower slowly. Ph1: slight knee bend. Ph2: straight legs. Ph3: ankle weight. Foundation that builds toward hanging leg raises — do not skip.", rest:60, tags:["core","bodyweight","compound","bilateral"] },
        { name:"Plank Drags", sets:3, target:"10 reps/side", note:"Push-up plank, drag KB across body. Zero hip rotation — anti-rotation demand is the entire point.", rest:60, tags:["core","kettlebell","iso","unilateral"] },
      ]},
    ]
  },

  fri: {
    label:"Friday", name:"Upper A", subtitle:"Chest + Back Heavy", color:"#2980b9",
    sections:[
      { title:"Activation", exercises:[
        { name:"Band Pull-Aparts", sets:3, target:"15 reps", note:"Arms straight, pull band to chest. Rear delt and mid-trap activation — most important pre-press movement.", rest:30, tags:["shoulder","back","band","isolation","bilateral","warmup"] },
        { name:"Push-Up to Downward Dog", sets:2, target:"10 reps", note:"Perform a push-up then push hips back to downward dog — stretches lats and chest dynamically. Warms up push and pull muscles together.", rest:30, tags:["chest","back","bodyweight","compound","bilateral","warmup"] },
      ]},
      { title:"Power Primer", exercises:[
        { name:"Hang Clean High Pull", sets:4, target:"4 reps", note:"Bar at mid-thigh. Aggressive triple extension — ankle, knee, hip simultaneously. Shrug hard, pull bar to sternum with elbows high and wide. Hip power not bicep curl.", rest:120, tags:["back","shoulder","trap","barbell","pull","compound","bilateral","explosive"] },
        { name:"Plyo Push-Ups", sets:3, target:"6 reps", note:"Hands leave the floor. Lower under control, explode upward. Reset each rep.", rest:60, tags:["chest","shoulder","tricep","bodyweight","push","compound","bilateral","explosive"] },
      ]},
      { title:"Isometrics", exercises:[
        { name:"Dead Hang", sets:3, target:"30 sec", note:"Lat and bicep tendon loading before heavy pulling. Decompresses the shoulder joint before pressing — do these before both your press and pull work.", rest:60, tags:["back","bicep","bodyweight","iso","bilateral"] },
      ]},
      { title:"Chest — Heavy Compounds", exercises:[
        { name:"Incline Barbell Press", sets:4, target:"8 reps", note:"30–45° incline. Upper chest and front delt. Don't exceed 45°. Tempo applies.", rest:180, tags:["chest","shoulder","tricep","barbell","push","compound","bilateral"] },
        { name:"Flat Barbell Bench Press", sets:4, target:"8 reps", note:"Primary chest mass builder. Pause at bottom every rep. Tempo applies.", rest:180, tags:["chest","shoulder","tricep","barbell","push","compound","bilateral"] },
      ]},
      { title:"Back — Heavy Compounds", exercises:[
        { name:"Weighted Pull-Ups", sets:4, target:"8 reps", note:"Full dead hang at the bottom every rep. No half reps, no kipping.", rest:180, tags:["back","bicep","bodyweight","pull","compound","bilateral"] },
        { name:"Barbell Bent-Over Row", sets:4, target:"10 reps", note:"Hinge to 45° and hold — no standing up. Drive elbows back past torso. Tempo applies.", rest:180, tags:["back","bicep","barbell","pull","compound","bilateral"] },
      ]},
      { title:"Accessories", exercises:[
        { name:"Incline DB Fly", sets:3, target:"12 reps", note:"Slow eccentric — feel every fiber of upper pec lengthen. Don't let arms drop too low.", rest:90, tags:["chest","dumbbell","push","isolation","bilateral"], superset:"ss_chest_back_a" },
        { name:"Lat Pullover", sets:3, target:"12 reps", note:"DB held in both hands, lower behind head with soft elbows — full lat stretch. Pull back over chest.", rest:90, tags:["back","chest","dumbbell","pull","isolation","bilateral"], superset:"ss_chest_back_a" },
        { name:"Single-Arm DB Row", sets:3, target:"10 reps/side", note:"Brace on bench, full stretch at bottom — this earns its place as a working set, not a warm-up. Drive elbow back past hip. 3 sec eccentric.", rest:90, tags:["back","bicep","dumbbell","pull","compound","unilateral"] },
        { name:"Barbell Shrug", sets:3, target:"15 reps", note:"Hold 1 sec at top. Straight up, straight down — no rolling.", rest:90, tags:["trap","barbell","pull","isolation","bilateral"] },
      ]},
      { title:"Rotator Cuff", exercises:[
        { name:"Band External Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side. Critical with boxing twice a week.", rest:45, tags:["shoulder","band","isolation","unilateral"] },
        { name:"Band Internal Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side. Balance both directions.", rest:45, tags:["shoulder","band","isolation","unilateral"] },
      ]},
      { title:"Core", exercises:[
        { name:"Ab Wheel Rollout", sets:3, target:"10 reps", note:"From knees — roll out slowly until body is parallel to floor, pull back. Anti-extension core under max load. Directly builds the pressing stability and boxing rotational base you need.", rest:60, tags:["core","bodyweight","compound","bilateral"] },
        { name:"Pallof Press", sets:3, target:"12 reps/side", note:"Cable at chest height, hold handle at chest, press straight out and hold 2 sec before returning. Anti-rotation — the core demand for every boxing punch and basketball cut. Stand side-on to the cable.", rest:60, tags:["core","cable","iso","unilateral"] },
      ]},
    ]
  },

  sat: {
    label:"Saturday", name:"Lower B", subtitle:"Posterior Chain + Vertical + Athletic", color:"#c0392b",
    sections:[
      { title:"Activation", exercises:[
        { name:"Banded Lateral Walk", sets:2, target:"15 steps/side", note:"Glute medius activation before posterior chain loading — same as Lower A.", rest:20, tags:["glute","adductor","band","bilateral","warmup"] },
        { name:"World's Greatest Stretch", sets:2, target:"5 reps/side", note:"Step into a deep lunge, place same-side hand on the floor, rotate opposite arm to the sky. One movement covers hip flexor lengthening, thoracic rotation, adductor opening, and glute activation dynamically. Far superior to static holds pre-lift.", rest:30, tags:["hip","adductor","back","bodyweight","compound","unilateral","warmup"] },
      ]},
      { title:"Power Primer", exercises:[
        { name:"Kettlebell Snatch", sets:4, target:"5 reps/side", note:"Hike KB back, drive hips forward explosively, punch overhead in one motion. Hip snap — not a shoulder press. Develops posterior chain power for sprinting and jumping.", rest:120, tags:["glute","hamstring","shoulder","kettlebell","hinge","compound","unilateral","explosive"] },
        { name:"Lateral Hop Single-Leg Tuck Jump", sets:3, target:"4 reps/side", note:"Lateral hop landing on one foot — immediately jump vertically driving both knees to chest. Lateral reactive ability plus vertical power.", rest:120, tags:["quad","glute","plyo","bodyweight","explosive","unilateral"] },
      ]},
      { title:"Vertical Jump Protocol", exercises:[
        { name:"Approach Jump Practice", sets:4, target:"5 reps", note:"2–3 step approach. Gather step, hinge hips, load glutes. Arm swing generates 10–15% of jump height. Full reset between every rep — skill practice.", rest:120, tags:["quad","glute","plyo","bodyweight","explosive","bilateral"] },
        { name:"Broad Jumps", sets:3, target:"5 reps", note:"Max horizontal distance. Full hip extension, aggressive arm drive, land and absorb.", rest:120, tags:["quad","glute","hamstring","plyo","bodyweight","explosive","bilateral"] },
        { name:"Depth Jump to Max Reach", sets:3, target:"5 reps", note:"Ph2–3 only. Step off box, land, explode immediately — ground contact under 0.2 seconds.", rest:120, tags:["quad","glute","plyo","bodyweight","explosive","bilateral","box"] },
      ]},
      { title:"Isometrics", exercises:[
        { name:"Single-Leg RDL Hold", sets:3, target:"20 sec/side", note:"Stand on one leg, hinge to mid-shin level, hold. Same hamstring tendon loading as bilateral RDL hold but adds proprioceptive demand and is more specific to the single-leg work that follows. Use light DB for counterbalance if needed.", rest:45, tags:["hamstring","bodyweight","hinge","iso","unilateral"] },
      ]},
      { title:"Posterior Chain Strength", exercises:[
        { name:"Nordic Curls", sets:3, target:"6 reps", note:"Ph2–3 only. Do FIRST while hamstrings are completely fresh. Lower as slowly as possible — catch yourself with hands at the bottom. Ph1: skip this and do an extra set of leg curls instead.", rest:120, tags:["hamstring","bodyweight","hinge","compound","bilateral"] },
        { name:"Trap Bar Deadlift", sets:4, target:"5 reps", note:"Primary strength driver. No squats today — spine fully recovered from Thursday. Controlled descent, explosive hip drive. Ph rotation: swap for conventional or sumo deadlift every 3–4 weeks.", rest:180, tags:["hamstring","glute","back","barbell","hinge","compound","bilateral"] },
        { name:"Barbell Hip Thrust", sets:4, target:"12 reps", note:"Squeeze plus 1 sec hold at top every rep. Primary glute hypertrophy exercise — do not rush.", rest:120, tags:["glute","hamstring","barbell","compound","bilateral"] },
        { name:"Seated Leg Curl", sets:3, target:"10 reps", note:"3 sec eccentric every rep. Ph1: do 4 sets here instead of Nordic curls. Ph2–3: this is your hamstring hypertrophy finisher after Nordics handle the strength work.", rest:90, tags:["hamstring","machine","isolation","bilateral"] },
      ]},
      { title:"Adductors", exercises:[
        { name:"Adductor Machine", sets:3, target:"15 reps", note:"3 sec eccentric opening — the lengthening is where the adaptation happens. Full range.", rest:90, tags:["adductor","machine","isolation","bilateral"] },
        { name:"Copenhagen Plank", sets:3, target:"25 sec/side", note:"Top leg on bench, bottom leg hanging. Groin injury prevention — evidence-backed.", rest:60, tags:["adductor","core","bodyweight","iso","unilateral"] },
      ]},
      { title:"Core", exercises:[
        { name:"Dead Bug", sets:3, target:"10 reps/side", note:"Lie on back, arms to ceiling, knees at 90°. Lower opposite arm and leg simultaneously while pressing lower back into the floor. Anti-extension core — directly builds the spinal stability needed for heavy deadlifts and hip thrusts.", rest:60, tags:["core","bodyweight","compound","unilateral"] },
        { name:"Decline Leg Raise", sets:3, target:"12 reps", note:"On a decline bench, grip behind head. Raise legs to 90°. Ph1: slight knee bend. Ph2: straight legs. Ph3: DB between feet. Harder than floor version — step up from Lying Leg Raise.", rest:60, tags:["core","bodyweight","compound","bilateral"] },
      ]},
      { title:"Conditioning Finisher", exercises:[
        { name:"Sled Sprint Carry", sets:4, target:"20 yards", note:"Lean in, drive the knees, big arm swing. Ph1: light load, mechanics. Ph2: moderate. Ph3: heavy, max effort. 90 sec rest. NO SLED ALTERNATIVES: Hill sprints (best substitute — same leg drive demand), resistance band resisted sprints (anchor band at waist, sprint against resistance), or loaded gym bag pushed across turf floor.", rest:90, tags:["quad","glute","hamstring","sled","compound","bilateral","explosive"] },
      ]},
    ]
  },

  sun: {
    label:"Sunday", name:"Upper B", subtitle:"Shoulders + Arms + Athletic Detail", color:"#8e44ad",
    sections:[
      { title:"Activation", exercises:[
        { name:"Band Pull-Aparts", sets:3, target:"15 reps", note:"Rear delt and rotator cuff activation before pressing.", rest:30, tags:["shoulder","back","band","isolation","bilateral","warmup"] },
        { name:"Band External Rotation", sets:2, target:"15 reps/arm", note:"Rotator cuff warm-up before heavy overhead pressing.", rest:30, tags:["shoulder","band","isolation","unilateral","warmup"] },
      ]},
      { title:"Power Primer", exercises:[
        { name:"Med Ball Overhead Slam", sets:3, target:"6 reps", note:"Full extension overhead, slam through the floor. Posterior chain activation and shoulder prep.", rest:60, tags:["shoulder","back","core","bodyweight","explosive","bilateral"] },
        { name:"Plyo Push-Ups", sets:3, target:"6 reps", note:"Hands leave the floor. Reset each rep.", rest:60, tags:["chest","shoulder","tricep","bodyweight","push","compound","bilateral","explosive"] },
      ]},
      { title:"Isometrics", exercises:[
        { name:"OHP Lockout Hold", sets:3, target:"20 sec", note:"60% of working weight, pressed overhead, hold at lockout. Shoulder tendon loading before the heavy press.", rest:60, tags:["shoulder","tricep","barbell","iso","bilateral"] },
      ]},
      { title:"Shoulder — Compound", exercises:[
        { name:"Overhead Press", sets:4, target:"10 reps", note:"Tempo applies. Front delt primary, full shoulder stability. Brace the core hard.", rest:180, tags:["shoulder","tricep","barbell","push","compound","bilateral"] },
        { name:"Face Pulls", sets:3, target:"15 reps", note:"Rope at face height, pull with external rotation — elbows finishing behind the bar. Done before lateral raises to prime rear delt and rotator cuff.", rest:60, tags:["shoulder","back","cable","pull","isolation","bilateral"] },
      ]},
      { title:"Shoulder — Isolation", exercises:[
        { name:"DB Lateral Raise", sets:3, target:"15 reps", note:"2 sec up, 3 sec down. Lead with elbow, no swinging.", rest:60, tags:["shoulder","dumbbell","push","isolation","bilateral"], superset:"ss_lat_rear" },
        { name:"Rear Delt DB Fly", sets:4, target:"15 reps", note:"Chest parallel to floor. Slow eccentric, zero momentum. Keep weight light enough to feel rear delt.", rest:60, tags:["shoulder","back","dumbbell","pull","isolation","bilateral"], superset:"ss_lat_rear" },
        { name:"Cable Lateral Raise", sets:3, target:"15 reps/side", note:"Low pulley — constant tension eliminates dead spot of DB version.", rest:60, tags:["shoulder","cable","push","isolation","unilateral"], superset:"ss_cable_pec" },
        { name:"Reverse Pec Deck", sets:3, target:"15 reps", note:"Squeeze hard at full extension — rear delt peak contraction.", rest:60, tags:["shoulder","back","machine","pull","isolation","bilateral"], superset:"ss_cable_pec" },
      ]},
      { title:"Second Chest Stimulus", exercises:[
        { name:"Pec Deck / Machine Fly", sets:3, target:"12 reps", note:"Constant tension, mid-chest squeeze. Second chest hit this week.", rest:90, tags:["chest","machine","push","isolation","bilateral"] },
        { name:"Chest Dips", sets:2, target:"To Failure", note:"Forward lean, elbows slightly flared. Full pec stretch at bottom. Lower chest.", rest:60, tags:["chest","shoulder","tricep","bodyweight","push","compound","bilateral"] },
      ]},
      { title:"Back Detail", exercises:[
        { name:"Seated Cable Row", sets:3, target:"12 reps", note:"Full forward lean, drive elbows past torso. Mid-back and lat thickness.", rest:90, tags:["back","bicep","cable","pull","compound","bilateral"] },
        { name:"Lat Pullover", sets:3, target:"12 reps", note:"DB or cable — full lat lengthening behind the head, pull back over chest.", rest:90, tags:["back","chest","dumbbell","pull","isolation","bilateral"] },
      ]},
      { title:"Triceps", exercises:[
        { name:"Close-Grip Bench Press", sets:3, target:"10 reps", note:"Hands shoulder-width. Hits all three heads — best tricep mass builder.", rest:120, tags:["tricep","chest","barbell","push","compound","bilateral"] },
        { name:"Overhead Tricep Extension", sets:3, target:"12 reps", note:"Arms overhead — long head maximally stretched. Most important tricep exercise.", rest:90, tags:["tricep","cable","push","isolation","bilateral"], superset:"ss_tri_bi" },
        { name:"Incline DB Curl", sets:3, target:"12 reps", note:"45° bench, arm hangs behind body — maximum long head stretch.", rest:90, tags:["bicep","dumbbell","pull","isolation","unilateral"], superset:"ss_tri_bi" },
        { name:"Underhand Tricep Pushdown", sets:3, target:"15 reps", note:"Reverse grip — medial head emphasis.", rest:60, tags:["tricep","cable","push","isolation","bilateral"] },
      ]},
      { title:"Biceps", exercises:[
        { name:"Slow Controlled Barbell Curl", sets:3, target:"10 reps", note:"4 sec eccentric, 1 sec pause, 2 sec concentric. No swinging.", rest:90, tags:["bicep","barbell","pull","isolation","bilateral"] },
        { name:"Hammer Curl", sets:3, target:"12 reps", note:"Neutral grip. Brachialis and forearm thickness.", rest:60, tags:["bicep","forearm","dumbbell","pull","isolation","bilateral"] },
      ]},
      { title:"Forearms + Grip", exercises:[
        { name:"Reverse Curl (EZ Bar)", sets:3, target:"12 reps", note:"Overhand grip — brachioradialis emphasis.", rest:60, tags:["forearm","bicep","barbell","pull","isolation","bilateral"] },
        { name:"Farmer Carry", sets:3, target:"30 sec", note:"Heavy DBs. Grip, forearms, traps, and core all working simultaneously.", rest:60, tags:["forearm","trap","core","dumbbell","carry","compound","bilateral"] },
      ]},
      { title:"Core", exercises:[
        { name:"Weighted Decline Sit-Up", sets:3, target:"12 reps", note:"On a decline bench, hold a plate at chest. Full range — shoulders touch the pad at the bottom, sit fully upright at the top. Ph1: bodyweight only. Ph2: 10–25 lbs. Ph3: 25–45 lbs. Flex the abs at the top — don't just use momentum.", rest:60, tags:["core","bodyweight","compound","bilateral"] },
        { name:"Cable Woodchop", sets:3, target:"12 reps/side", note:"High pulley, rotate from high to low diagonally across the body. Rotational core power — this is the movement pattern for every boxing punch and basketball drive. Drive from the hips, not just the arms.", rest:60, tags:["core","cable","compound","unilateral"] },
        { name:"Plank", sets:2, target:"45 sec", note:"Full body tension. Don't let the hips sag or rise. This is an anti-extension hold — brace everything.", rest:45, tags:["core","bodyweight","iso","bilateral"] },
      ]},
      { title:"Rotator Cuff", exercises:[
        { name:"Band External Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side. Every upper day ends here.", rest:45, tags:["shoulder","band","isolation","unilateral"] },
        { name:"Band Internal Rotation", sets:3, target:"15 reps/arm", note:"Elbow at side.", rest:45, tags:["shoulder","band","isolation","unilateral"] },
      ]},
    ]
  },
};


// ── MOBILITY & RECOVERY SESSION ──────────────────────────────────────────
// Not assigned to a fixed day — access from BUILD tab and start anytime.
// Ideal: morning on any training day, or on a true rest day.
export const MOBILITY_SESSION = {
  label:"Anytime", name:"Mobility + Recovery", subtitle:"Daily movement quality", color:"#16a085",
  sections:[
    { title:"Thoracic Spine", exercises:[
      { name:"World's Greatest Stretch", sets:3, target:"5 reps/side", note:"Deep lunge, same-side hand to floor, rotate opposite arm to sky. Covers hip flexor, T-spine, adductor, and glute in one movement. Move slowly — feel every range.", rest:20, tags:["hip","back","adductor","bodyweight","compound","unilateral","mobility"] },
      { name:"Thoracic Rotation on Foam Roller", sets:2, target:"10 reps/side", note:"Seated, roller behind upper back, hands behind head. Rotate each side — this unlocks the T-spine that gets jammed from pressing and boxing.", rest:20, tags:["back","bodyweight","mobility"] },
      { name:"Cat-Cow", sets:2, target:"10 reps", note:"Full spinal flexion and extension. Slow — 3 seconds each direction. Wakes up the entire spine.", rest:15, tags:["back","core","bodyweight","mobility"] },
    ]},
    { title:"Hip + Groin", exercises:[
      { name:"90/90 Hip Switch", sets:3, target:"8 reps/side", note:"Seated with both knees bent at 90°, rotate hips to each side lifting the knee. This is the most direct hip internal and external rotation work you can do. Non-negotiable for basketball and boxing hip mobility.", rest:20, tags:["hip","glute","adductor","bodyweight","unilateral","mobility"] },
      { name:"Pigeon Stretch Hold", sets:2, target:"45 sec/side", note:"Figure-4 position — front leg bent, rear leg extended. Sink into the hip. The static hold here is appropriate because this is post-activation recovery work, not pre-lift prep.", rest:20, tags:["hip","glute","bodyweight","iso","unilateral","mobility"] },
      { name:"Deep Squat Hold", sets:2, target:"45 sec", note:"Feet shoulder-width, heels flat if possible, hold bottom of squat. Grab a rack if needed. Loads ankle dorsiflexion and hip flexors in their full range.", rest:20, tags:["quad","hip","adductor","calf","bodyweight","iso","bilateral","mobility"] },
      { name:"Adductor Rockback", sets:2, target:"10 reps/side", note:"On all fours, one leg extended to the side, rock hips back toward the extended leg. Eccentric adductor loading through range — specific to the lateral cuts in basketball.", rest:20, tags:["adductor","hip","bodyweight","mobility"] },
    ]},
    { title:"Hamstring + Posterior Chain", exercises:[
      { name:"Single-Leg Forward Fold", sets:2, target:"30 sec/side", note:"Stand on one leg, fold forward reaching toward the floor. Hamstring and calf flexibility plus balance. Appropriate here as a static hold — this is mobility work not pre-lift warm-up.", rest:15, tags:["hamstring","calf","bodyweight","iso","unilateral","mobility"] },
      { name:"Hip Flexor Couch Stretch", sets:2, target:"45 sec/side", note:"Rear foot elevated on bench or couch, front foot forward, drive hips forward. The most effective hip flexor stretch that exists. Especially important with all the sprint and boxing work — hip flexors get chronically short.", rest:20, tags:["hip","quad","bodyweight","iso","unilateral","mobility"] },
    ]},
    { title:"Shoulder + Upper Back", exercises:[
      { name:"Band Distraction Stretch", sets:2, target:"30 sec/side", note:"Loop band around a rack at shoulder height, step forward creating tension, shoulder in external rotation. Decompresses the shoulder joint capsule — critical with heavy pressing and boxing twice a week.", rest:15, tags:["shoulder","band","iso","unilateral","mobility"] },
      { name:"Doorway Pec Stretch", sets:2, target:"30 sec/side", note:"Arm at 90° on doorframe, lean forward. Reverses the internal rotation pattern that boxing and bench pressing create chronically.", rest:15, tags:["chest","shoulder","bodyweight","iso","unilateral","mobility"] },
      { name:"Sleeper Stretch", sets:2, target:"30 sec/side", note:"Lie on side, push forearm toward floor — posterior shoulder capsule stretch. Essential for overhead press longevity and rotator cuff health.", rest:15, tags:["shoulder","bodyweight","iso","unilateral","mobility"] },
    ]},
    { title:"Ankle + Lower Leg", exercises:[
      { name:"Ankle CARs", sets:2, target:"10 circles/side", note:"Full controlled circles of the ankle joint in both directions. Ankle mobility is the most underrated limiter in squatting depth and jumping mechanics.", rest:15, tags:["calf","bodyweight","unilateral","mobility"] },
      { name:"Calf Hang (Eccentric)", sets:3, target:"10 reps/side", note:"One foot on a step, lower heel below step level slowly — 4 sec eccentric. This is Achilles tendon health work, not just calf flexibility. Critical given sprint load.", rest:30, tags:["calf","bodyweight","iso","unilateral","mobility"] },
    ]},
  ]
};

// ── FLAT EXERCISE LIBRARY ─────────────────────────────────────────────────
// Built from all exercises across all workouts — used for the library picker
// and tag-based swap suggestions. Deduplicated by name.
const _seen = new Set();
export const EXERCISE_LIBRARY = [];
Object.values(WORKOUTS).forEach(day => {
  day.sections.forEach(sec => {
    sec.exercises.forEach(ex => {
      if (!_seen.has(ex.name)) {
        _seen.add(ex.name);
        EXERCISE_LIBRARY.push({ ...ex, dayLabel: day.name });
      }
    });
  });
});

// Additional exercises not in the main program but available in library
const EXTRA_EXERCISES = [
  { name:"Goblet Squat", tags:["quad","glute","dumbbell","squat","compound","bilateral"], sets:4, target:"10 reps", rest:120, note:"DB or KB held at chest. Upright torso, deep knee bend." },
  { name:"Pause Squat", tags:["quad","glute","barbell","squat","compound","bilateral"], sets:4, target:"5 reps", rest:180, note:"Full pause at the bottom for 2 sec — removes stretch reflex." },
  { name:"Hack Squat Machine", tags:["quad","machine","squat","compound","bilateral"], sets:4, target:"8 reps", rest:150, note:"Machine removes stability demand — pure quad loading." },
  { name:"Leg Press", tags:["quad","glute","machine","compound","bilateral"], sets:4, target:"12 reps", rest:120, note:"High narrow foot placement for quad emphasis. 3 sec eccentric." },
  { name:"Walking Lunges", tags:["quad","glute","dumbbell","lunge","compound","bilateral"], sets:3, target:"12 reps/leg", rest:120, note:"Step forward, drive back up and step through." },
  { name:"Step-Ups", tags:["quad","glute","dumbbell","lunge","compound","unilateral","box"], sets:3, target:"10 reps/leg", rest:120, note:"Box or bench, drive through the heel of the elevated leg." },
  { name:"Bulgarian Split Squat", tags:["quad","glute","dumbbell","lunge","compound","unilateral"], sets:3, target:"10 reps/leg", rest:120, note:"Rear foot elevated, heavy DBs in each hand." },
  { name:"Sissy Squat", tags:["quad","bodyweight","squat","isolation","bilateral"], sets:3, target:"12 reps", rest:90, note:"Extreme knee flexion — highest patellar tendon load. 3 sec eccentric." },
  { name:"Cossack Squat", tags:["adductor","quad","glute","bodyweight","squat","compound","unilateral"], sets:3, target:"8 reps/side", rest:90, note:"Deep lateral lunge — one leg straight, one in deep squat." },
  { name:"Good Mornings", tags:["hamstring","back","barbell","hinge","compound","bilateral"], sets:3, target:"10 reps", rest:120, note:"Bar on back, hinge forward keeping back flat." },
  { name:"Conventional Deadlift", tags:["hamstring","glute","back","barbell","hinge","compound","bilateral"], sets:4, target:"5 reps", rest:180, note:"Standard barbell. More hip hinge demand than trap bar." },
  { name:"Sumo Deadlift", tags:["hamstring","glute","adductor","barbell","hinge","compound","bilateral"], sets:4, target:"5 reps", rest:180, note:"Wide stance, hands inside legs. More adductor involvement." },
  { name:"Cable Pull-Through", tags:["hamstring","glute","cable","hinge","compound","bilateral"], sets:4, target:"12 reps", rest:120, note:"Low pulley, rope between legs — hip hinge with no axial load." },
  { name:"Kettlebell Swing", tags:["hamstring","glute","kettlebell","hinge","compound","bilateral","explosive"], sets:4, target:"15 reps", rest:120, note:"Explosive RDL pattern. Hip extension power for jumping and sprinting." },
  { name:"DB Hip Thrust", tags:["glute","hamstring","dumbbell","compound","bilateral"], sets:4, target:"12 reps", rest:120, note:"Same movement, DBs on hips. Easier to set up." },
  { name:"Incline DB Press", tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"], sets:4, target:"10 reps", rest:150, note:"Deeper stretch at bottom than barbell. Independent arm movement." },
  { name:"Machine Chest Press", tags:["chest","shoulder","tricep","machine","push","compound","bilateral"], sets:4, target:"12 reps", rest:120, note:"Fixed path — joint-friendly option." },
  { name:"DB Bench Press", tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"], sets:4, target:"10 reps", rest:150, note:"Deeper stretch, independent arm movement." },
  { name:"Cable Fly — High to Low", tags:["chest","cable","push","isolation","bilateral"], sets:3, target:"12 reps", rest:90, note:"High pulleys, draw hands down and together. Constant tension." },
  { name:"Lat Pulldown — Wide Grip", tags:["back","bicep","cable","pull","compound","bilateral"], sets:4, target:"10 reps", rest:150, note:"Same pulling pattern as pull-ups, easier to control load." },
  { name:"DB Bent-Over Row", tags:["back","bicep","dumbbell","pull","compound","unilateral"], sets:4, target:"10 reps/arm", rest:120, note:"Greater range of motion, removes balance demand." },
  { name:"Pendlay Row", tags:["back","bicep","barbell","pull","compound","bilateral","explosive"], sets:4, target:"6 reps", rest:180, note:"Dead stop on floor each rep — more power development." },
  { name:"T-Bar Row", tags:["back","bicep","barbell","pull","compound","bilateral"], sets:4, target:"10 reps", rest:150, note:"Mid-back emphasis with neutral grip." },
  { name:"DB Shoulder Press", tags:["shoulder","tricep","dumbbell","push","compound","bilateral"], sets:4, target:"10 reps", rest:180, note:"Independent arms — deeper range, exposes imbalances." },
  { name:"Arnold Press", tags:["shoulder","tricep","dumbbell","push","compound","bilateral"], sets:4, target:"10 reps", rest:150, note:"Rotate from palms facing you to palms forward as you press." },
  { name:"Cable Lateral Raise — Both Arms", tags:["shoulder","cable","push","isolation","bilateral"], sets:3, target:"15 reps", rest:60, note:"Cross cables at low pulley. Constant tension throughout." },
  { name:"Skull Crushers", tags:["tricep","barbell","push","isolation","bilateral"], sets:3, target:"12 reps", rest:90, note:"EZ bar lowered to forehead — long head under stretch." },
  { name:"Tricep Dips", tags:["tricep","chest","bodyweight","push","compound","bilateral"], sets:3, target:"To Failure", rest:120, note:"Elbows tucked — tricep emphasis over chest." },
  { name:"Cable Curl — Slow Eccentric", tags:["bicep","cable","pull","isolation","bilateral"], sets:3, target:"12 reps", rest:90, note:"Low pulley, 4 sec eccentric. Constant tension." },
  { name:"Preacher Curl", tags:["bicep","barbell","pull","isolation","bilateral"], sets:3, target:"10 reps", rest:90, note:"Upper arm fixed on pad — removes momentum completely." },
  { name:"Spider Curl", tags:["bicep","dumbbell","pull","isolation","bilateral"], sets:3, target:"12 reps", rest:90, note:"Chest-down on incline bench — no momentum possible." },
];
EXTRA_EXERCISES.forEach(ex => {
  if (!_seen.has(ex.name)) {
    _seen.add(ex.name);
    EXERCISE_LIBRARY.push(ex);
  }
});

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

// ── SWAPS (tag-aware) ──────────────────────────────────────────────────────
export const SWAPS = {
  "Banded Box Squat": [
    { name:"Pause Squat", sets:4, target:"5 reps", note:"Full pause at bottom for 2 sec — removes stretch reflex, pure quad strength.", rest:180, tags:["quad","glute","barbell","squat","compound","bilateral"] },
    { name:"Goblet Squat", sets:4, target:"10 reps", note:"DB held at chest, upright torso, deep knee bend. Good when bands aren't available.", rest:120, tags:["quad","glute","dumbbell","squat","compound","bilateral"] },
    { name:"Hack Squat Machine", sets:4, target:"8 reps", note:"Machine removes stability demand — pure quad loading.", rest:150, tags:["quad","machine","squat","compound","bilateral"] },
  ],
  "Front Squat — Heel Elevated": [
    { name:"Leg Press", sets:4, target:"12 reps", note:"High narrow foot placement for quad emphasis. 3 sec eccentric.", rest:120, tags:["quad","glute","machine","compound","bilateral"] },
    { name:"Goblet Squat", sets:3, target:"12 reps", note:"Heavy DB at chest, heels elevated on plates.", rest:120, tags:["quad","glute","dumbbell","squat","compound","bilateral"] },
  ],
  "Bulgarian Split Squat with Rotation": [
    { name:"Walking Lunges", sets:3, target:"12 reps/leg", note:"Step forward into lunge, drive back up and step through.", rest:120, tags:["quad","glute","dumbbell","lunge","compound","bilateral"] },
    { name:"Bulgarian Split Squat", sets:3, target:"10 reps/leg", note:"Standard version without rotation. Heavy DBs.", rest:120, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
    { name:"Reverse Lunge", sets:3, target:"10 reps/leg", note:"Step backward — easier on the knees.", rest:120, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
    { name:"Step-Ups", sets:3, target:"10 reps/leg", note:"Box or bench, drive through the heel.", rest:120, tags:["quad","glute","dumbbell","lunge","compound","unilateral","box"] },
  ],
  "Barbell Single-Leg Reverse Lunge": [
    { name:"DB Reverse Lunge", sets:3, target:"10 reps/leg", note:"Same movement with DBs — less spinal loading.", rest:120, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
    { name:"Step-Ups with Knee Drive", sets:3, target:"10 reps/leg", note:"Step up, drive free knee to hip height at top.", rest:120, tags:["quad","glute","dumbbell","lunge","compound","unilateral","box"] },
    { name:"Split Squat", sets:3, target:"10 reps/leg", note:"Static — both feet planted. Simplest single-leg quad exercise.", rest:120, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
  ],
  "Leg Extension": [
    { name:"Sissy Squat", sets:3, target:"12 reps", note:"Extreme knee flexion, highest patellar tendon load. 3 sec eccentric, hold at bottom.", rest:90, tags:["quad","bodyweight","squat","isolation","bilateral"] },
    { name:"Terminal Knee Extension (Band)", sets:3, target:"20 reps/leg", note:"Band around back of knee, drive knee forward. VMO loading with minimal joint stress.", rest:60, tags:["quad","band","isolation","unilateral"] },
  ],
  "Incline Barbell Press": [
    { name:"Incline DB Press", sets:4, target:"10 reps", note:"Deeper stretch at bottom. Independent arm movement.", rest:150, tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"] },
    { name:"Machine Incline Press", sets:4, target:"12 reps", note:"Fixed path — good when shoulders are sensitive.", rest:120, tags:["chest","shoulder","tricep","machine","push","compound","bilateral"] },
  ],
  "Flat Barbell Bench Press": [
    { name:"DB Bench Press", sets:4, target:"10 reps", note:"Deeper stretch, independent arm movement.", rest:150, tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"] },
    { name:"Machine Chest Press", sets:4, target:"12 reps", note:"Fixed path — joint-friendly.", rest:120, tags:["chest","shoulder","tricep","machine","push","compound","bilateral"] },
    { name:"Close-Grip Bench Press", sets:4, target:"10 reps", note:"More tricep involvement.", rest:180, tags:["chest","tricep","barbell","push","compound","bilateral"] },
  ],
  "Weighted Pull-Ups": [
    { name:"Lat Pulldown — Wide Grip", sets:4, target:"10 reps", note:"Same pulling pattern, easier to control load.", rest:150, tags:["back","bicep","cable","pull","compound","bilateral"] },
    { name:"Assisted Pull-Ups", sets:4, target:"8 reps", note:"Machine assistance — maintains movement pattern.", rest:150, tags:["back","bicep","bodyweight","pull","compound","bilateral"] },
  ],
  "Barbell Bent-Over Row": [
    { name:"DB Bent-Over Row", sets:4, target:"10 reps/arm", note:"Greater range, removes balance demand.", rest:120, tags:["back","bicep","dumbbell","pull","compound","unilateral"] },
    { name:"Pendlay Row", sets:4, target:"6 reps", note:"Dead stop each rep — more power development.", rest:180, tags:["back","bicep","barbell","pull","compound","bilateral","explosive"] },
    { name:"Seated Cable Row", sets:4, target:"12 reps", note:"Full forward lean stretch. Constant tension.", rest:120, tags:["back","bicep","cable","pull","compound","bilateral"] },
  ],
  "Nordic Curls": [
    { name:"Leg Curl — Slow Eccentric", sets:4, target:"10 reps", note:"5 sec eccentric every rep. Closest substitute for hamstring lengthening demand.", rest:120, tags:["hamstring","machine","hinge","isolation","bilateral"] },
    { name:"Good Mornings", sets:3, target:"10 reps", note:"Bar on back, hinge forward — loads hamstrings and erectors.", rest:120, tags:["hamstring","back","barbell","hinge","compound","bilateral"] },
  ],
  "Trap Bar Deadlift": [
    { name:"Conventional Deadlift", sets:4, target:"5 reps", note:"Standard barbell. More hip hinge and posterior chain demand.", rest:180, tags:["hamstring","glute","back","barbell","hinge","compound","bilateral"] },
    { name:"Sumo Deadlift", sets:4, target:"5 reps", note:"Wide stance. More adductor and quad involvement.", rest:180, tags:["hamstring","glute","adductor","barbell","hinge","compound","bilateral"] },
  ],
  "Romanian Deadlift": [
    { name:"Cable Pull-Through", sets:4, target:"12 reps", note:"Low pulley, rope between legs — hip hinge with no axial load.", rest:120, tags:["hamstring","glute","cable","hinge","compound","bilateral"] },
    { name:"Kettlebell Swing", sets:4, target:"15 reps", note:"Explosive hip extension. Power for jumping and sprinting.", rest:120, tags:["hamstring","glute","kettlebell","hinge","compound","bilateral","explosive"] },
    { name:"Good Mornings", sets:3, target:"10 reps", note:"Bar on back, hinge forward with flat back.", rest:120, tags:["hamstring","back","barbell","hinge","compound","bilateral"] },
  ],
  "Barbell Hip Thrust": [
    { name:"DB Hip Thrust", sets:4, target:"12 reps", note:"Same movement, DBs on hips. Easier to set up.", rest:120, tags:["glute","hamstring","dumbbell","compound","bilateral"] },
    { name:"Cable Hip Extension", sets:4, target:"15 reps/leg", note:"Low cable, ankle attachment. Single-leg glute isolation.", rest:90, tags:["glute","cable","isolation","unilateral"] },
  ],
  "Seated Leg Curl": [
    { name:"Lying Leg Curl", sets:4, target:"12 reps", note:"Face down — slightly different hamstring angle. 3 sec eccentric.", rest:90, tags:["hamstring","machine","isolation","bilateral"] },
  ],
  "Overhead Press": [
    { name:"DB Shoulder Press", sets:4, target:"10 reps", note:"Independent arms — deeper range, exposes imbalances.", rest:180, tags:["shoulder","tricep","dumbbell","push","compound","bilateral"] },
    { name:"Arnold Press", sets:4, target:"10 reps", note:"Rotate from palms facing you to forward as you press. Hits all three delt heads.", rest:150, tags:["shoulder","tricep","dumbbell","push","compound","bilateral"] },
  ],
  "DB Lateral Raise": [
    { name:"Cable Lateral Raise — Both Arms", sets:3, target:"15 reps", note:"Cross cables at low pulley. Constant tension.", rest:60, tags:["shoulder","cable","push","isolation","bilateral"] },
    { name:"Machine Lateral Raise", sets:3, target:"15 reps", note:"Pad on wrist — removes momentum entirely.", rest:60, tags:["shoulder","machine","push","isolation","bilateral"] },
  ],
  "Rear Delt DB Fly": [
    { name:"Band Pull-Aparts", sets:4, target:"20 reps", note:"Bodyweight band — rear delt pump, minimal equipment.", rest:45, tags:["shoulder","back","band","pull","isolation","bilateral"] },
    { name:"Face Pulls (Extra Sets)", sets:4, target:"15 reps", note:"Rope at face height with external rotation.", rest:60, tags:["shoulder","back","cable","pull","isolation","bilateral"] },
  ],
  "Close-Grip Bench Press": [
    { name:"Skull Crushers", sets:3, target:"12 reps", note:"EZ bar to forehead — long head under stretch.", rest:90, tags:["tricep","barbell","push","isolation","bilateral"] },
    { name:"Tricep Dips", sets:3, target:"To Failure", note:"Elbows tucked — tricep emphasis.", rest:120, tags:["tricep","chest","bodyweight","push","compound","bilateral"] },
  ],
  "Overhead Tricep Extension": [
    { name:"DB Overhead Extension", sets:3, target:"12 reps", note:"One or two DBs overhead — same long head stretch.", rest:90, tags:["tricep","dumbbell","push","isolation","bilateral"] },
    { name:"Skull Crushers", sets:3, target:"12 reps", note:"EZ bar to forehead.", rest:90, tags:["tricep","barbell","push","isolation","bilateral"] },
  ],
  "Slow Controlled Barbell Curl": [
    { name:"Cable Curl — Slow Eccentric", sets:3, target:"12 reps", note:"Low pulley, 4 sec eccentric. Constant tension.", rest:90, tags:["bicep","cable","pull","isolation","bilateral"] },
    { name:"Preacher Curl", sets:3, target:"10 reps", note:"Upper arm fixed — removes momentum completely.", rest:90, tags:["bicep","barbell","pull","isolation","bilateral"] },
  ],
  "Incline DB Curl": [
    { name:"Spider Curl", sets:3, target:"12 reps", note:"Chest-down on incline bench — no momentum possible.", rest:90, tags:["bicep","dumbbell","pull","isolation","bilateral"] },
    { name:"Cable Curl — High Pulley", sets:3, target:"12 reps/arm", note:"Single arm from above — tension at lengthened position.", rest:90, tags:["bicep","cable","pull","isolation","unilateral"] },
  ],
};
