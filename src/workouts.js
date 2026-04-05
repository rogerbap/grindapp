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
        { name:"A-Skips", sets:2, target:"20 yards", note:"Paw the ground back under the hip, arm drive matches the leg.", rest:15, tags:["sprint","bodyweight","plyo","warmup"] },
        { name:"Build-Up Accelerations", sets:3, target:"20 yards @ 65%", note:"Each rep a little faster — mechanics before max effort.", rest:20, tags:["sprint","bodyweight","explosive","warmup"] },
      ]},
      { title:"Phase 1 Protocol", exercises:[
        { name:"100m Sprint @ 75%", sets:6, target:"1 rep", note:"Walk back every rep — full recovery is what makes these quality.", rest:20, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"40m Acceleration @ 85%", sets:4, target:"1 rep", note:"Drive the arms hard — 90° bend, drive back not across. Shin angle forward at the start.", rest:15, tags:["sprint","bodyweight","explosive","bilateral"] },
      ]},
      { title:"Phase 2 Protocol", exercises:[
        { name:"100m Sprint @ 85%", sets:8, target:"1 rep", note:"75 sec rest between reps.", rest:75, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"50m Fly Sprint", sets:4, target:"1 rep", note:"Rolling start — hit max velocity at the 20m mark.", rest:20, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"40m Sprint @ 95%", sets:4, target:"1 rep", note:"Standing start, maximum acceleration intent.", rest:20, tags:["sprint","bodyweight","explosive","bilateral"] },
      ]},
      { title:"Phase 3 Protocol", exercises:[
        { name:"100m Sprint @ 90%", sets:10, target:"1 rep", note:"60 sec rest. This is where conditioning meets speed.", rest:15, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"50m Fly @ 100%", sets:6, target:"1 rep", note:"Absolute max velocity — 2 min rest.", rest:15, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"20m Max Acceleration", sets:4, target:"1 rep", note:"Dead stop start, 100% effort — 2 min rest.", rest:15, tags:["sprint","bodyweight","explosive","bilateral"] },
        { name:"150m Build-Up Run", sets:2, target:"1 rep", note:"60% building to 100% — trains speed endurance.", rest:15, tags:["sprint","bodyweight","explosive","bilateral"] },
      ]},
    ]
  },

  tue: {
    label:"Tuesday", name:"Boxing / Flex", subtitle:"Optional boxing or full rest", color:"#576574",
    sections:[
      { title:"Options", exercises:[
        { name:"Boxing Training", sets:1, target:"Full session", note:"Best use of Tuesday — full rest Wednesday means fatigue clears before Thursday. Combinations, bag work, sparring, footwork.", rest:0, tags:["push","pull","core","bodyweight","explosive"] },
        { name:"Mobility Session", sets:1, target:"30 min", note:"Run the Mobility + Recovery session from the BUILD tab if skipping boxing. Keeps movement quality high mid-week.", rest:30, tags:["recovery","bodyweight","mobility"] },
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
      { title:"Warm-Up", warmup:true, exercises:[
        { name:"Banded Lateral Walk", sets:2, target:"15 steps/side", note:"Band taut, knees don't cave. Activates glute medius before every lower body session.", rest:0, tags:["glute","adductor","band","bilateral","warmup"], warmup:true },
        { name:"Hip CARs", sets:2, target:"5 reps/side", note:"Full slow circle of the hip joint — forward then backward. Opens the joint capsule for deep squats.", rest:0, tags:["hip","bodyweight","unilateral","warmup"], warmup:true },
        { name:"Spanish Squat Hold", sets:2, target:"30 sec", note:"Band around post, lean back to 90°. Quad and patellar tendon primer before heavy squatting.", rest:0, tags:["quad","band","iso","bilateral","warmup"], warmup:true },
      ]},
      { title:"Power Primer", exercises:[
        { name:"Kneeling to Tuck Jump", sets:4, target:"3 reps", note:"Tall kneeling — explode feet to floor, immediately drive knees to chest at peak. Full reset every rep. Max CNS demand.", rest:120, tags:["quad","glute","plyo","bodyweight","explosive","bilateral"] },
        { name:"Split Stance Jump Switches", sets:3, target:"6 reps/side", note:"Lunge position, explode up, switch legs in air. Land soft — deceleration matters as much as the jump.", rest:90, tags:["quad","glute","plyo","bodyweight","explosive","unilateral"] },
      ]},
      { title:"Quad — 4 exercises", exercises:[
        { name:"Banded Box Squat", sets:4, target:"5 reps", note:"Bands anchored low, looped over bar. Sit back to box, pause, EXPLODE against band. Rate of force development — foundation of your jump.", rest:120, tags:["quad","glute","barbell","band","squat","compound","bilateral","explosive"] },
        { name:"Front Squat — Heel Elevated", sets:3, target:"8 reps", note:"2–3 inch plates under heels. Upright torso, knee tracks toe. Max quad load, reduced lower back stress. Tempo applies.", rest:90, tags:["quad","barbell","squat","compound","bilateral"] },
        { name:"Bulgarian Split Squat", sets:3, target:"10 reps/leg", note:"Rear foot elevated, DB at sides. Drive through front heel. Best unilateral quad + glute exercise.", rest:75, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
        { name:"Leg Extension", sets:3, target:"15 reps", note:"4 sec eccentric, 1 sec squeeze at top. Patellar tendon loading — important for jump performance.", rest:45, tags:["quad","machine","isolation","bilateral"] },
      ]},
      { title:"Hamstring — 1 exercise", exercises:[
        { name:"Seated Leg Curl", sets:3, target:"12 reps", note:"3 sec eccentric every rep. Ph2–3: replace with Nordic Curls 3×6 for more hamstring tendon adaptation.", rest:45, tags:["hamstring","machine","isolation","bilateral"] },
      ]},
      { title:"Calf + Ab", exercises:[
        { name:"Standing Calf Raise", sets:4, target:"20 reps", note:"3 sec eccentric, 1 sec stretch at bottom. Full range.", rest:30, tags:["calf","machine","isolation","bilateral"] },
        { name:"Lying Leg Raise", sets:3, target:"12 reps", note:"Lower back pressed to floor the entire set. Ph1: slight knee bend. Ph2: straight legs. Ph3: ankle weight.", rest:30, tags:["core","bodyweight","compound","bilateral"] },
      ]},
    ]

  },
  fri: {
    label:"Friday", name:"Upper A", subtitle:"Chest + Back Heavy", color:"#2980b9",
    sections:[
      { title:"Warm-Up", warmup:true, exercises:[
        { name:"Band Pull-Aparts", sets:3, target:"15 reps", note:"Arms straight, pull band to chest. Rear delt and mid-trap activation — most important pre-press movement.", rest:0, tags:["shoulder","back","band","isolation","bilateral","warmup"], warmup:true },
        { name:"Push-Up to Downward Dog", sets:2, target:"10 reps", note:"Push-up then push hips back to downward dog. Dynamically warms up push and pull muscles together.", rest:0, tags:["chest","back","bodyweight","compound","bilateral","warmup"], warmup:true },
        { name:"Dead Hang", sets:2, target:"30 sec", note:"Lat and bicep tendon decompression before heavy pulling. Opens the shoulder joint.", rest:0, tags:["back","bicep","bodyweight","iso","bilateral","warmup"], warmup:true },
      ]},
      { title:"Power Primer", exercises:[
        { name:"Hang Clean High Pull", sets:4, target:"4 reps", note:"Bar at mid-thigh, aggressive triple extension — ankle, knee, hip simultaneously. Shrug hard, elbows high and wide. Hip power, not a bicep curl.", rest:120, tags:["back","shoulder","trap","barbell","pull","compound","bilateral","explosive"] },
        { name:"Plyo Push-Ups", sets:3, target:"6 reps", note:"Hands leave the floor every rep. Control the descent, explode up. Full reset.", rest:60, tags:["chest","shoulder","tricep","bodyweight","push","compound","bilateral","explosive"] },
      ]},
      { title:"Back — 3 exercises", exercises:[
        { name:"Weighted Pull-Ups", sets:4, target:"8 reps", note:"Full dead hang at bottom every rep. Add weight when you can do 10 clean reps bodyweight. Primary vertical pull.", rest:90, tags:["back","bicep","bodyweight","pull","compound","bilateral"] },
        { name:"Barbell Bent-Over Row", sets:4, target:"10 reps", note:"Hinge to 45° and hold. Drive elbows past torso. Primary horizontal pull.", rest:90, tags:["back","bicep","barbell","pull","compound","bilateral"] },
        { name:"Single-Arm DB Row", sets:3, target:"10 reps/arm", note:"Brace on bench, full stretch at bottom. Heavy — last 2 reps should be a grind. Drive elbow back past hip.", rest:60, tags:["back","bicep","dumbbell","pull","compound","unilateral"] },
      ]},
      { title:"Chest — 1 exercise", exercises:[
        { name:"Cable Chest Fly", sets:3, target:"12 reps", note:"Mid pulley, slight forward lean, wide arc from shoulder height to chest. Full pec stretch at the start — this is the part that builds muscle. No bench needed, constant tension through full range.", rest:45, tags:["chest","cable","push","isolation","bilateral"] },
      ]},
      { title:"Rear Delt + Trap — 2 exercises", exercises:[
        { name:"Reverse Pec Deck", sets:4, target:"15 reps", note:"Arms wide, slight bend in elbows. Squeeze rear delts at full extension — hold 1 sec. Much more direct rear delt stimulus than face pulls. Keep chest against pad the entire time.", rest:45, tags:["shoulder","back","machine","pull","isolation","bilateral"] },
        { name:"DB Shrug", sets:3, target:"15 reps", note:"Hold 1 sec at top. Straight up, straight down. DBs allow deeper range than barbell.", rest:45, tags:["trap","dumbbell","pull","isolation","bilateral"] },
      ]},
      { title:"Biceps — 2 exercises", exercises:[
        { name:"Barbell Curl", sets:3, target:"10 reps", note:"4 sec eccentric, no swinging. Full range.", rest:45, tags:["bicep","barbell","pull","isolation","bilateral"] },
        { name:"Incline DB Curl", sets:3, target:"12 reps", note:"45° bench, arm hangs behind body — maximum long head stretch.", rest:45, tags:["bicep","dumbbell","pull","isolation","unilateral"] },
      ]},
    ]

  },
  sat: {
    label:"Saturday", name:"Lower B", subtitle:"Posterior Chain + Vertical + Athletic", color:"#c0392b",
    sections:[
      { title:"Warm-Up", warmup:true, exercises:[
        { name:"Banded Lateral Walk", sets:2, target:"15 steps/side", note:"Glute medius activation before posterior chain loading.", rest:0, tags:["glute","adductor","band","bilateral","warmup"], warmup:true },
        { name:"World's Greatest Stretch", sets:2, target:"5 reps/side", note:"Deep lunge, same-side hand to floor, rotate opposite arm to sky. Covers hip flexor, T-spine, adductor, and glute in one movement.", rest:0, tags:["hip","adductor","back","bodyweight","compound","unilateral","warmup"], warmup:true },
        { name:"Single-Leg RDL Hold", sets:2, target:"20 sec/side", note:"Stand on one leg, hinge to mid-shin. Hamstring tendon primer before heavy hinging.", rest:0, tags:["hamstring","bodyweight","hinge","iso","unilateral","warmup"], warmup:true },
      ]},
      { title:"Power + Vertical", exercises:[
        { name:"Kettlebell Snatch", sets:4, target:"5 reps/side", note:"Hike KB back, drive hips explosively, punch overhead in one motion. Hip snap — not a shoulder press.", rest:60, tags:["glute","hamstring","shoulder","kettlebell","hinge","compound","unilateral","explosive"] },
        { name:"Approach Jump Practice", sets:4, target:"5 reps", note:"2–3 step approach, gather step, load glutes, arm swing. Full reset every rep — skill practice not conditioning.", rest:90, tags:["quad","glute","plyo","bodyweight","explosive","bilateral"] },
      ]},
      { title:"Hamstring — 2 exercises", exercises:[
        { name:"Trap Bar Deadlift", sets:4, target:"5 reps", note:"Primary strength driver. Spine recovered from Thursday. Controlled descent, explosive hip drive. Rotate to conventional deadlift every 3–4 weeks.", rest:120, tags:["hamstring","glute","back","barbell","hinge","compound","bilateral"] },
        { name:"Nordic Curls", sets:3, target:"6 reps", note:"Ph2–3 only — do while hamstrings are fresh. Lower as slowly as possible, catch with hands. Ph1: replace with Seated Leg Curl 3×12.", rest:90, tags:["hamstring","bodyweight","hinge","compound","bilateral"] },
      ]},
      { title:"Quad — 2 exercises", exercises:[
        { name:"Barbell Hip Thrust", sets:4, target:"12 reps", note:"Squeeze + 1 sec hold at top every rep. Primary glute and quad finisher.", rest:75, tags:["glute","hamstring","barbell","compound","bilateral"] },
        { name:"Walking Lunge", sets:3, target:"12 reps/leg", note:"DB at sides, long stride, front knee tracks toe. Quad and glute under load through a long range. Athletic carry-over to basketball cuts.", rest:60, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
      ]},
      { title:"Calf + Ab", exercises:[
        { name:"Seated Calf Raise", sets:4, target:"20 reps", note:"3 sec eccentric. Seated targets soleus — different emphasis from standing version. Full range.", rest:30, tags:["calf","machine","isolation","bilateral"] },
        { name:"Dead Bug", sets:3, target:"10 reps/side", note:"Arms to ceiling, knees 90°, lower opposite arm and leg simultaneously. Back flat the entire time — if it arches, reset.", rest:30, tags:["core","bodyweight","compound","unilateral"] },
      ]},
    ]

  },
  sun: {
    label:"Sunday", name:"Upper B", subtitle:"Shoulders + Arms + Athletic Detail", color:"#8e44ad",
    sections:[
      { title:"Warm-Up", warmup:true, exercises:[
        { name:"Band Pull-Aparts", sets:3, target:"15 reps", note:"Arms straight, pull band to chest. Rear delt and mid-trap activation before pressing.", rest:0, tags:["shoulder","back","band","isolation","bilateral","warmup"], warmup:true },
        { name:"Band External Rotation", sets:2, target:"15 reps/arm", note:"Elbow at side. Rotator cuff prep before overhead and bench pressing.", rest:0, tags:["shoulder","band","isolation","unilateral","warmup"], warmup:true },
        { name:"Push-Up to Downward Dog", sets:2, target:"10 reps", note:"Chest and lat dynamic warmup — warms up both push and pull simultaneously.", rest:0, tags:["chest","back","bodyweight","compound","bilateral","warmup"], warmup:true },
      ]},
      { title:"Power Primer", exercises:[
        { name:"Med Ball Overhead Slam", sets:3, target:"6 reps", note:"Full extension overhead, slam through the floor. Posterior chain + shoulder CNS activation.", rest:30, tags:["shoulder","back","core","bodyweight","explosive","bilateral"] },
        { name:"Plyo Push-Ups", sets:3, target:"6 reps", note:"Hands leave floor every rep. Reset fully between reps.", rest:60, tags:["chest","shoulder","tricep","bodyweight","push","compound","bilateral","explosive"] },
      ]},
      { title:"Chest — 2 exercises", exercises:[
        { name:"Flat Barbell Bench Press", sets:4, target:"8 reps", note:"Primary chest mass builder. Pause at bottom, explosive up. Go straight into Bent-Over Row — antagonist superset.", rest:0, tags:["chest","shoulder","tricep","barbell","push","compound","bilateral"], superset:"ss_bench_row" },
        { name:"Incline DB Press", sets:3, target:"10 reps", note:"Upper chest focus. Full pec stretch at bottom. Go straight into Lat Pulldown.", rest:0, tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"], superset:"ss_incline_pull" },
      ]},
      { title:"Back — 2 exercises", exercises:[
        { name:"Barbell Bent-Over Row", sets:4, target:"10 reps", note:"Superset with Bench Press. Hinge to 45°, drive elbows past torso. Rest 90 sec after both.", rest:90, tags:["back","bicep","barbell","pull","compound","bilateral"], superset:"ss_bench_row" },
        { name:"Lat Pulldown — Wide Grip", sets:3, target:"12 reps", note:"Superset with Incline Press. Full stretch at top, drive elbows down. Rest 60 sec after both.", rest:60, tags:["back","bicep","cable","pull","compound","bilateral"], superset:"ss_incline_pull" },
      ]},
      { title:"Shoulder — 2 exercises", exercises:[
        { name:"Overhead Press", sets:3, target:"10 reps", note:"Core braced, full lockout overhead. Go straight into Face Pulls.", rest:0, tags:["shoulder","tricep","barbell","push","compound","bilateral"], superset:"ss_ohp_face" },
        { name:"DB Lateral Raise", sets:3, target:"15 reps", note:"2 sec up, 3 sec down. Lead with elbow. Rest 45 sec after OHP.", rest:45, tags:["shoulder","dumbbell","push","isolation","bilateral"] },
      ]},
      { title:"Tricep + Bicep — 1 each", exercises:[
        { name:"Overhead Tricep Extension", sets:3, target:"12 reps", note:"Long head maximally stretched overhead. Go straight into Hammer Curl.", rest:0, tags:["tricep","cable","push","isolation","bilateral"], superset:"ss_tri_bi" },
        { name:"Hammer Curl", sets:3, target:"12 reps", note:"Superset with Tricep Extension. Neutral grip, brachialis thickness. Rest 45 sec after both.", rest:45, tags:["bicep","forearm","dumbbell","pull","isolation","bilateral"], superset:"ss_tri_bi" },
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
      { name:"World's Greatest Stretch", sets:3, target:"5 reps/side", note:"Deep lunge, same-side hand to floor, rotate opposite arm to sky. Covers hip flexor, T-spine, adductor, and glute in one movement. Move slowly — feel every range.", rest:75, tags:["hip","back","adductor","bodyweight","compound","unilateral","mobility"] },
      { name:"Thoracic Rotation on Foam Roller", sets:2, target:"10 reps/side", note:"Seated, roller behind upper back, hands behind head. Rotate each side — this unlocks the T-spine that gets jammed from pressing and boxing.", rest:30, tags:["back","bodyweight","mobility"] },
      { name:"Cat-Cow", sets:2, target:"10 reps", note:"Full spinal flexion and extension. Slow — 3 seconds each direction. Wakes up the entire spine.", rest:30, tags:["back","core","bodyweight","mobility"] },
    ]},
    { title:"Hip + Groin", exercises:[
      { name:"90/90 Hip Switch", sets:3, target:"8 reps/side", note:"Seated with both knees bent at 90°, rotate hips to each side lifting the knee. This is the most direct hip internal and external rotation work you can do. Non-negotiable for basketball and boxing hip mobility.", rest:30, tags:["hip","glute","adductor","bodyweight","unilateral","mobility"] },
      { name:"Pigeon Stretch Hold", sets:2, target:"45 sec/side", note:"Figure-4 position — front leg bent, rear leg extended. Sink into the hip. The static hold here is appropriate because this is post-activation recovery work, not pre-lift prep.", rest:30, tags:["hip","glute","bodyweight","iso","unilateral","mobility"] },
      { name:"Deep Squat Hold", sets:2, target:"45 sec", note:"Feet shoulder-width, heels flat if possible, hold bottom of squat. Grab a rack if needed. Loads ankle dorsiflexion and hip flexors in their full range.", rest:30, tags:["quad","hip","adductor","calf","bodyweight","iso","bilateral","mobility"] },
      { name:"Adductor Rockback", sets:2, target:"10 reps/side", note:"On all fours, one leg extended to the side, rock hips back toward the extended leg. Eccentric adductor loading through range — specific to the lateral cuts in basketball.", rest:30, tags:["adductor","hip","bodyweight","mobility"] },
    ]},
    { title:"Hamstring + Posterior Chain", exercises:[
      { name:"Single-Leg Forward Fold", sets:2, target:"30 sec/side", note:"Stand on one leg, fold forward reaching toward the floor. Hamstring and calf flexibility plus balance. Appropriate here as a static hold — this is mobility work not pre-lift warm-up.", rest:30, tags:["hamstring","calf","bodyweight","iso","unilateral","mobility"] },
      { name:"Hip Flexor Couch Stretch", sets:2, target:"45 sec/side", note:"Rear foot elevated on bench or couch, front foot forward, drive hips forward. The most effective hip flexor stretch that exists. Especially important with all the sprint and boxing work — hip flexors get chronically short.", rest:30, tags:["hip","quad","bodyweight","iso","unilateral","mobility"] },
    ]},
    { title:"Shoulder + Upper Back", exercises:[
      { name:"Band Distraction Stretch", sets:2, target:"30 sec/side", note:"Loop band around a rack at shoulder height, step forward creating tension, shoulder in external rotation. Decompresses the shoulder joint capsule — critical with heavy pressing and boxing twice a week.", rest:30, tags:["shoulder","band","iso","unilateral","mobility"] },
      { name:"Doorway Pec Stretch", sets:2, target:"30 sec/side", note:"Arm at 90° on doorframe, lean forward. Reverses the internal rotation pattern that boxing and bench pressing create chronically.", rest:30, tags:["chest","shoulder","bodyweight","iso","unilateral","mobility"] },
      { name:"Sleeper Stretch", sets:2, target:"30 sec/side", note:"Lie on side, push forearm toward floor — posterior shoulder capsule stretch. Essential for overhead press longevity and rotator cuff health.", rest:30, tags:["shoulder","bodyweight","iso","unilateral","mobility"] },
    ]},
    { title:"Ankle + Lower Leg", exercises:[
      { name:"Ankle CARs", sets:2, target:"10 circles/side", note:"Full controlled circles of the ankle joint in both directions. Ankle mobility is the most underrated limiter in squatting depth and jumping mechanics.", rest:30, tags:["calf","bodyweight","unilateral","mobility"] },
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
  { name:"Goblet Squat", tags:["quad","glute","dumbbell","squat","compound","bilateral"], sets:4, target:"10 reps", rest:60, note:"DB or KB held at chest. Upright torso, deep knee bend." },
  { name:"Pause Squat", tags:["quad","glute","barbell","squat","compound","bilateral"], sets:4, target:"5 reps", rest:60, note:"Full pause at the bottom for 2 sec — removes stretch reflex." },
  { name:"Hack Squat Machine", tags:["quad","machine","squat","compound","bilateral"], sets:4, target:"8 reps", rest:120, note:"Machine removes stability demand — pure quad loading." },
  { name:"Leg Press", tags:["quad","glute","machine","compound","bilateral"], sets:4, target:"12 reps", rest:60, note:"High narrow foot placement for quad emphasis. 3 sec eccentric." },
  { name:"Walking Lunges", tags:["quad","glute","dumbbell","lunge","compound","bilateral"], sets:3, target:"12 reps/leg", rest:60, note:"Step forward, drive back up and step through." },
  { name:"Step-Ups", tags:["quad","glute","dumbbell","lunge","compound","unilateral","box"], sets:3, target:"10 reps/leg", rest:60, note:"Box or bench, drive through the heel of the elevated leg." },
  { name:"Bulgarian Split Squat", tags:["quad","glute","dumbbell","lunge","compound","unilateral"], sets:3, target:"10 reps/leg", rest:60, note:"Rear foot elevated, heavy DBs in each hand." },
  { name:"Sissy Squat", tags:["quad","bodyweight","squat","isolation","bilateral"], sets:3, target:"12 reps", rest:60, note:"Extreme knee flexion — highest patellar tendon load. 3 sec eccentric." },
  { name:"Cossack Squat", tags:["adductor","quad","glute","bodyweight","squat","compound","unilateral"], sets:3, target:"8 reps/side", rest:60, note:"Deep lateral lunge — one leg straight, one in deep squat." },
  { name:"Good Mornings", tags:["hamstring","back","barbell","hinge","compound","bilateral"], sets:3, target:"10 reps", rest:120, note:"Bar on back, hinge forward keeping back flat." },
  { name:"Conventional Deadlift", tags:["hamstring","glute","back","barbell","hinge","compound","bilateral"], sets:4, target:"5 reps", rest:120, note:"Standard barbell. More hip hinge demand than trap bar." },
  { name:"Sumo Deadlift", tags:["hamstring","glute","adductor","barbell","hinge","compound","bilateral"], sets:4, target:"5 reps", rest:120, note:"Wide stance, hands inside legs. More adductor involvement." },
  { name:"Cable Pull-Through", tags:["hamstring","glute","cable","hinge","compound","bilateral"], sets:4, target:"12 reps", rest:60, note:"Low pulley, rope between legs — hip hinge with no axial load." },
  { name:"Kettlebell Swing", tags:["hamstring","glute","kettlebell","hinge","compound","bilateral","explosive"], sets:4, target:"15 reps", rest:60, note:"Explosive RDL pattern. Hip extension power for jumping and sprinting." },
  { name:"DB Hip Thrust", tags:["glute","hamstring","dumbbell","compound","bilateral"], sets:4, target:"12 reps", rest:60, note:"Same movement, DBs on hips. Easier to set up." },
  { name:"Incline DB Press", tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"], sets:4, target:"10 reps", rest:60, note:"Deeper stretch at bottom than barbell. Independent arm movement." },
  { name:"Machine Chest Press", tags:["chest","shoulder","tricep","machine","push","compound","bilateral"], sets:4, target:"12 reps", rest:60, note:"Fixed path — joint-friendly option." },
  { name:"DB Bench Press", tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"], sets:4, target:"10 reps", rest:60, note:"Deeper stretch, independent arm movement." },
  { name:"Cable Fly — High to Low", tags:["chest","cable","push","isolation","bilateral"], sets:3, target:"12 reps", rest:60, note:"High pulleys, draw hands down and together. Constant tension." },
  { name:"Lat Pulldown — Wide Grip", tags:["back","bicep","cable","pull","compound","bilateral"], sets:4, target:"10 reps", rest:40, note:"Same pulling pattern as pull-ups, easier to control load." },
  { name:"DB Bent-Over Row", tags:["back","bicep","dumbbell","pull","compound","unilateral"], sets:4, target:"10 reps/arm", rest:60, note:"Greater range of motion, removes balance demand." },
  { name:"Pendlay Row", tags:["back","bicep","barbell","pull","compound","bilateral","explosive"], sets:4, target:"6 reps", rest:60, note:"Dead stop on floor each rep — more power development." },
  { name:"T-Bar Row", tags:["back","bicep","barbell","pull","compound","bilateral"], sets:4, target:"10 reps", rest:60, note:"Mid-back emphasis with neutral grip." },
  { name:"DB Shoulder Press", tags:["shoulder","tricep","dumbbell","push","compound","bilateral"], sets:4, target:"10 reps", rest:60, note:"Independent arms — deeper range, exposes imbalances." },
  { name:"Arnold Press", tags:["shoulder","tricep","dumbbell","push","compound","bilateral"], sets:4, target:"10 reps", rest:60, note:"Rotate from palms facing you to palms forward as you press." },
  { name:"Cable Lateral Raise — Both Arms", tags:["shoulder","cable","push","isolation","bilateral"], sets:3, target:"15 reps", rest:40, note:"Cross cables at low pulley. Constant tension throughout." },
  { name:"Skull Crushers", tags:["tricep","barbell","push","isolation","bilateral"], sets:3, target:"12 reps", rest:40, note:"EZ bar lowered to forehead — long head under stretch." },
  { name:"Tricep Dips", tags:["tricep","chest","bodyweight","push","compound","bilateral"], sets:3, target:"To Failure", rest:40, note:"Elbows tucked — tricep emphasis over chest." },
  { name:"Cable Curl — Slow Eccentric", tags:["bicep","cable","pull","isolation","bilateral"], sets:3, target:"12 reps", rest:60, note:"Low pulley, 4 sec eccentric. Constant tension." },
  { name:"Preacher Curl", tags:["bicep","barbell","pull","isolation","bilateral"], sets:3, target:"10 reps", rest:40, note:"Upper arm fixed on pad — removes momentum completely." },
  { name:"Spider Curl", tags:["bicep","dumbbell","pull","isolation","bilateral"], sets:3, target:"12 reps", rest:40, note:"Chest-down on incline bench — no momentum possible." },
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
    { name:"Pause Squat", sets:4, target:"5 reps", note:"Full pause at bottom for 2 sec — removes stretch reflex, pure quad strength.", rest:120, tags:["quad","glute","barbell","squat","compound","bilateral"] },
    { name:"Goblet Squat", sets:4, target:"10 reps", note:"DB held at chest, upright torso, deep knee bend. Good when bands aren't available.", rest:60, tags:["quad","glute","dumbbell","squat","compound","bilateral"] },
    { name:"Hack Squat Machine", sets:4, target:"8 reps", note:"Machine removes stability demand — pure quad loading.", rest:60, tags:["quad","machine","squat","compound","bilateral"] },
  ],
  "Front Squat — Heel Elevated": [
    { name:"Leg Press", sets:4, target:"12 reps", note:"High narrow foot placement for quad emphasis. 3 sec eccentric.", rest:60, tags:["quad","glute","machine","compound","bilateral"] },
    { name:"Goblet Squat", sets:3, target:"12 reps", note:"Heavy DB at chest, heels elevated on plates.", rest:60, tags:["quad","glute","dumbbell","squat","compound","bilateral"] },
  ],
  "Bulgarian Split Squat with Rotation": [
    { name:"Walking Lunges", sets:3, target:"12 reps/leg", note:"Step forward into lunge, drive back up and step through.", rest:60, tags:["quad","glute","dumbbell","lunge","compound","bilateral"] },
    { name:"Bulgarian Split Squat", sets:3, target:"10 reps/leg", note:"Standard version without rotation. Heavy DBs.", rest:60, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
    { name:"Reverse Lunge", sets:3, target:"10 reps/leg", note:"Step backward — easier on the knees.", rest:60, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
    { name:"Step-Ups", sets:3, target:"10 reps/leg", note:"Box or bench, drive through the heel.", rest:60, tags:["quad","glute","dumbbell","lunge","compound","unilateral","box"] },
  ],
  "Barbell Single-Leg Reverse Lunge": [
    { name:"DB Reverse Lunge", sets:3, target:"10 reps/leg", note:"Same movement with DBs — less spinal loading.", rest:60, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
    { name:"Step-Ups with Knee Drive", sets:3, target:"10 reps/leg", note:"Step up, drive free knee to hip height at top.", rest:60, tags:["quad","glute","dumbbell","lunge","compound","unilateral","box"] },
    { name:"Split Squat", sets:3, target:"10 reps/leg", note:"Static — both feet planted. Simplest single-leg quad exercise.", rest:60, tags:["quad","glute","dumbbell","lunge","compound","unilateral"] },
  ],
  "Leg Extension": [
    { name:"Sissy Squat", sets:3, target:"12 reps", note:"Extreme knee flexion, highest patellar tendon load. 3 sec eccentric, hold at bottom.", rest:40, tags:["quad","bodyweight","squat","isolation","bilateral"] },
    { name:"Terminal Knee Extension (Band)", sets:3, target:"20 reps/leg", note:"Band around back of knee, drive knee forward. VMO loading with minimal joint stress.", rest:40, tags:["quad","band","isolation","unilateral"] },
  ],
  "Incline Barbell Press": [
    { name:"Incline DB Press", sets:4, target:"10 reps", note:"Deeper stretch at bottom. Independent arm movement.", rest:60, tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"] },
    { name:"Machine Incline Press", sets:4, target:"12 reps", note:"Fixed path — good when shoulders are sensitive.", rest:60, tags:["chest","shoulder","tricep","machine","push","compound","bilateral"] },
  ],
  "Flat Barbell Bench Press": [
    { name:"DB Bench Press", sets:4, target:"10 reps", note:"Deeper stretch, independent arm movement.", rest:60, tags:["chest","shoulder","tricep","dumbbell","push","compound","bilateral"] },
    { name:"Machine Chest Press", sets:4, target:"12 reps", note:"Fixed path — joint-friendly.", rest:60, tags:["chest","shoulder","tricep","machine","push","compound","bilateral"] },
    { name:"Close-Grip Bench Press", sets:4, target:"10 reps", note:"More tricep involvement.", rest:120, tags:["chest","tricep","barbell","push","compound","bilateral"] },
  ],
  "Weighted Pull-Ups": [
    { name:"Lat Pulldown — Wide Grip", sets:4, target:"10 reps", note:"Same pulling pattern, easier to control load.", rest:60, tags:["back","bicep","cable","pull","compound","bilateral"] },
    { name:"Assisted Pull-Ups", sets:4, target:"8 reps", note:"Machine assistance — maintains movement pattern.", rest:75, tags:["back","bicep","bodyweight","pull","compound","bilateral"] },
  ],
  "Barbell Bent-Over Row": [
    { name:"DB Bent-Over Row", sets:4, target:"10 reps/arm", note:"Greater range, removes balance demand.", rest:60, tags:["back","bicep","dumbbell","pull","compound","unilateral"] },
    { name:"Pendlay Row", sets:4, target:"6 reps", note:"Dead stop each rep — more power development.", rest:120, tags:["back","bicep","barbell","pull","compound","bilateral","explosive"] },
    { name:"Seated Cable Row", sets:4, target:"12 reps", note:"Full forward lean stretch. Constant tension.", rest:60, tags:["back","bicep","cable","pull","compound","bilateral"] },
  ],
  "Nordic Curls": [
    { name:"Leg Curl — Slow Eccentric", sets:4, target:"10 reps", note:"5 sec eccentric every rep. Closest substitute for hamstring lengthening demand.", rest:40, tags:["hamstring","machine","hinge","isolation","bilateral"] },
    { name:"Good Mornings", sets:3, target:"10 reps", note:"Bar on back, hinge forward — loads hamstrings and erectors.", rest:120, tags:["hamstring","back","barbell","hinge","compound","bilateral"] },
  ],
  "Trap Bar Deadlift": [
    { name:"Conventional Deadlift", sets:4, target:"5 reps", note:"Standard barbell. More hip hinge and posterior chain demand.", rest:120, tags:["hamstring","glute","back","barbell","hinge","compound","bilateral"] },
    { name:"Sumo Deadlift", sets:4, target:"5 reps", note:"Wide stance. More adductor and quad involvement.", rest:120, tags:["hamstring","glute","adductor","barbell","hinge","compound","bilateral"] },
  ],
  "Romanian Deadlift": [
    { name:"Cable Pull-Through", sets:4, target:"12 reps", note:"Low pulley, rope between legs — hip hinge with no axial load.", rest:60, tags:["hamstring","glute","cable","hinge","compound","bilateral"] },
    { name:"Kettlebell Swing", sets:4, target:"15 reps", note:"Explosive hip extension. Power for jumping and sprinting.", rest:60, tags:["hamstring","glute","kettlebell","hinge","compound","bilateral","explosive"] },
    { name:"Good Mornings", sets:3, target:"10 reps", note:"Bar on back, hinge forward with flat back.", rest:120, tags:["hamstring","back","barbell","hinge","compound","bilateral"] },
  ],
  "Barbell Hip Thrust": [
    { name:"DB Hip Thrust", sets:4, target:"12 reps", note:"Same movement, DBs on hips. Easier to set up.", rest:60, tags:["glute","hamstring","dumbbell","compound","bilateral"] },
    { name:"Cable Hip Extension", sets:4, target:"15 reps/leg", note:"Low cable, ankle attachment. Single-leg glute isolation.", rest:40, tags:["glute","cable","isolation","unilateral"] },
  ],
  "Seated Leg Curl": [
    { name:"Lying Leg Curl", sets:4, target:"12 reps", note:"Face down — slightly different hamstring angle. 3 sec eccentric.", rest:40, tags:["hamstring","machine","isolation","bilateral"] },
  ],
  "Overhead Press": [
    { name:"DB Shoulder Press", sets:4, target:"10 reps", note:"Independent arms — deeper range, exposes imbalances.", rest:60, tags:["shoulder","tricep","dumbbell","push","compound","bilateral"] },
    { name:"Arnold Press", sets:4, target:"10 reps", note:"Rotate from palms facing you to forward as you press. Hits all three delt heads.", rest:60, tags:["shoulder","tricep","dumbbell","push","compound","bilateral"] },
  ],
  "DB Lateral Raise": [
    { name:"Cable Lateral Raise — Both Arms", sets:3, target:"15 reps", note:"Cross cables at low pulley. Constant tension.", rest:40, tags:["shoulder","cable","push","isolation","bilateral"] },
    { name:"Machine Lateral Raise", sets:3, target:"15 reps", note:"Pad on wrist — removes momentum entirely.", rest:40, tags:["shoulder","machine","push","isolation","bilateral"] },
  ],
  "Rear Delt DB Fly": [
    { name:"Band Pull-Aparts", sets:4, target:"20 reps", note:"Bodyweight band — rear delt pump, minimal equipment.", rest:40, tags:["shoulder","back","band","pull","isolation","bilateral"] },
    { name:"Face Pulls (Extra Sets)", sets:4, target:"15 reps", note:"Rope at face height with external rotation.", rest:40, tags:["shoulder","back","cable","pull","isolation","bilateral"] },
  ],
  "Close-Grip Bench Press": [
    { name:"Skull Crushers", sets:3, target:"12 reps", note:"EZ bar to forehead — long head under stretch.", rest:40, tags:["tricep","barbell","push","isolation","bilateral"] },
    { name:"Tricep Dips", sets:3, target:"To Failure", note:"Elbows tucked — tricep emphasis.", rest:75, tags:["tricep","chest","bodyweight","push","compound","bilateral"] },
  ],
  "Overhead Tricep Extension": [
    { name:"DB Overhead Extension", sets:3, target:"12 reps", note:"One or two DBs overhead — same long head stretch.", rest:40, tags:["tricep","dumbbell","push","isolation","bilateral"] },
    { name:"Skull Crushers", sets:3, target:"12 reps", note:"EZ bar to forehead.", rest:40, tags:["tricep","barbell","push","isolation","bilateral"] },
  ],
  "Slow Controlled Barbell Curl": [
    { name:"Cable Curl — Slow Eccentric", sets:3, target:"12 reps", note:"Low pulley, 4 sec eccentric. Constant tension.", rest:40, tags:["bicep","cable","pull","isolation","bilateral"] },
    { name:"Preacher Curl", sets:3, target:"10 reps", note:"Upper arm fixed — removes momentum completely.", rest:40, tags:["bicep","barbell","pull","isolation","bilateral"] },
  ],
  "Incline DB Curl": [
    { name:"Spider Curl", sets:3, target:"12 reps", note:"Chest-down on incline bench — no momentum possible.", rest:40, tags:["bicep","dumbbell","pull","isolation","bilateral"] },
    { name:"Cable Curl — High Pulley", sets:3, target:"12 reps/arm", note:"Single arm from above — tension at lengthened position.", rest:40, tags:["bicep","cable","pull","isolation","unilateral"] },
  ],
};

// ── PR GROUPS ──────────────────────────────────────────────────────────────
// Each group tracks PRs across all variants — one PR per movement pattern.
// The best weight across any variant wins. Implement is recorded alongside.
export const PR_GROUPS = [
  {
    id: "bench",
    label: "Bench Press",
    icon: "🏋",
    variants: [
      "Flat Barbell Bench Press",
      "Incline Barbell Press",
      "DB Bench Press",
      "Incline DB Press",
      "Close-Grip Bench Press",
    ]
  },
  {
    id: "squat",
    label: "Squat",
    icon: "🦵",
    variants: [
      "Banded Box Squat",
      "Front Squat — Heel Elevated",
      "Goblet Squat",
      "Pause Squat",
      "Hack Squat Machine",
      "Bulgarian Split Squat with Rotation",
      "Bulgarian Split Squat",
    ]
  },
  {
    id: "deadlift",
    label: "Deadlift",
    icon: "⚡",
    variants: [
      "Trap Bar Deadlift",
      "Conventional Deadlift",
      "Sumo Deadlift",
      "Romanian Deadlift",
      "DB Deadlift",
      "DB Romanian Deadlift",
      "Single-Leg RDL",
    ]
  },
  {
    id: "row",
    label: "Row",
    icon: "💪",
    variants: [
      "Barbell Bent-Over Row",
      "Single-Arm DB Row",
      "DB Bent-Over Row",
      "Pendlay Row",
      "Seated Cable Row",
      "T-Bar Row",
      "Incline DB Row",
    ]
  },
  {
    id: "overhead",
    label: "Overhead Press",
    icon: "🔝",
    variants: [
      "Overhead Press",
      "DB Shoulder Press",
      "Arnold Press",
      "Machine Shoulder Press",
    ]
  },
  {
    id: "pull",
    label: "Pull-Up / Pulldown",
    icon: "⬆",
    variants: [
      "Weighted Pull-Ups",
      "Lat Pulldown — Wide Grip",
      "Assisted Pull-Ups",
      "Single-Arm Lat Pulldown",
    ]
  },
  {
    id: "olympic",
    label: "Olympic / Power",
    icon: "🥇",
    variants: [
      "Hang Clean High Pull",
      "Kettlebell Snatch",
      "DB Snatch",
      "Power Clean",
      "Hang Power Clean",
    ]
  },
];
