export const PHASE_COLORS = { 1: "#e8a838", 2: "#e05c2a", 3: "#c0392b" };
export const DAY_ORDER = ["mon","tue","wed","thu","fri","sat","sun"];
export const JS_TO_DAY = { 1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat",0:"sun" };

export const WORKOUTS = {

  mon: {
    label:"Monday", name:"Boxing", subtitle:"Skill + Conditioning", color:"#576574",
    sections:[
      { title:"Session", exercises:[
        { name:"Boxing training", sets:1, target:"Full session", note:"Combinations, footwork, bag work or sparring. Upper body and core dominant — shoulder endurance, rotational power, reactive movement.", rest:0 },
        { name:"Foam roll post-session", sets:1, target:"10 min", note:"Shoulders, forearms, upper back, lats, hips. Priority on anything that feels tight from the session.", rest:0 },
      ]},
    ]
  },

  tue: {
    label:"Tuesday", name:"Sprints", subtitle:"Dedicated speed day", color:"#27ae60",
    sections:[
      { title:"Dynamic warm-up", exercises:[
        { name:"Easy jog", sets:1, target:"3 min", note:"Loosen up — don't skip this", rest:0 },
        { name:"High knees", sets:2, target:"20 yards", note:"Drive knees to hip height, stay on balls of feet", rest:30 },
        { name:"A-skips", sets:2, target:"20 yards", note:"Paw the ground back under hip, arm drive matches leg", rest:30 },
        { name:"B-skips", sets:2, target:"20 yards", note:"Extend the leg forward after the A-skip knee drive", rest:30 },
        { name:"Build-up accelerations", sets:3, target:"20 yards @ 65%", note:"Gradually increase effort — mechanics first, speed second", rest:45 },
      ]},
      { title:"Phase 1 protocol", exercises:[
        { name:"100m sprint @ 75%", sets:6, target:"1 rep", note:"Walk back every time — do not jog the rest. Full recovery between reps is what makes these quality.", rest:90 },
        { name:"40m acceleration @ 85%", sets:4, target:"1 rep", note:"Focus on arm drive (90° bend, drive back not across), shin angle forward at start", rest:60 },
      ]},
      { title:"Phase 2 protocol", exercises:[
        { name:"100m sprint @ 85%", sets:8, target:"1 rep", note:"75 sec rest between reps", rest:75 },
        { name:"50m fly sprint", sets:4, target:"1 rep", note:"Rolling start — hit max velocity by the 20m mark, hold it through the 50", rest:90 },
        { name:"40m sprint @ 95%", sets:4, target:"1 rep", note:"Standing start, maximum acceleration intent", rest:90 },
      ]},
      { title:"Phase 3 protocol", exercises:[
        { name:"100m sprint @ 90%", sets:10, target:"1 rep", note:"60 sec rest — this is where conditioning meets speed", rest:60 },
        { name:"50m fly @ 100%", sets:6, target:"1 rep", note:"Absolute max velocity — 2 min rest, don't shortchange it", rest:120 },
        { name:"20m max acceleration", sets:4, target:"1 rep", note:"100% effort from dead stop — 2 min rest", rest:120 },
        { name:"150m build-up run", sets:2, target:"1 rep", note:"Start at 60%, hit 100% by the last 30 meters — teaches speed endurance", rest:120 },
      ]},
    ]
  },

  wed: {
    label:"Wednesday", name:"Boxing", subtitle:"Skill + Conditioning", color:"#576574",
    sections:[
      { title:"Session", exercises:[
        { name:"Boxing training", sets:1, target:"Full session", note:"Combinations, defensive work, sparring or heavy bag, footwork drills. Mid-week session — conditioning focus.", rest:0 },
        { name:"Foam roll post-session", sets:1, target:"10 min", note:"Shoulders, forearms, upper back, hips. Same as Monday.", rest:0 },
      ]},
    ]
  },

  thu: {
    label:"Thursday", name:"Lower A", subtitle:"Quad dominant + athletic power", color:"#e8a838",
    sections:[
      {
        title:"Activation + warm-up",
        exercises:[
          { name:"Banded forward march", sets:2, target:"15 steps", note:"Band around ankles — walk forward with deliberate steps. Activates hip flexors and glute med. Keep band taut the whole time, don't let knees cave in.", rest:20 },
          { name:"Banded backward march", sets:2, target:"15 steps", note:"Same band, walk backward. Activates glutes and hamstrings from a different angle than forward. Keep hips level.", rest:20 },
          { name:"Banded lateral walk", sets:2, target:"15 steps/side", note:"Side step right 15, then left 15. This is the most important direction — directly targets glute medius which stabilizes every single-leg movement you're about to do.", rest:20 },
          { name:"Split stance switches", sets:2, target:"10 reps/side", note:"Start in lunge position — switch legs with a small controlled hop. No jumping yet, this is just activating the hip flexors, glutes, and proprioception before the explosive version later. Stay controlled.", rest:30 },
          { name:"Hip CARs", sets:2, target:"5 reps/side", note:"Standing hip controlled articular rotations — full slow circle of the hip joint. Forward 5 then backward 5 each side. Opens the joint capsule, improves hip ROM for deep squats.", rest:30 },
          { name:"Frog stretch hold", sets:2, target:"30 sec", note:"On all fours, knees wide, feet flat, sit hips back. Groin and adductor prep before any lateral loading.", rest:30 },
        ]
      },
      {
        title:"Power primer",
        exercises:[
          { name:"Kneeling to tuck jump", sets:4, target:"3 reps", note:"Start in tall kneeling. Explosively drive both feet to the floor landing in a squat position, immediately explode vertically driving both knees to your chest at peak height. This is a two-part movement — the floor transition IS the power expression, the jump is the finish. Full reset between every rep. This is max CNS demand — do not rush, do not do more than 3 reps per set.", rest:120 },
          { name:"Split stance jump switches", sets:3, target:"6 reps/side", note:"Start in a lunge, explode upward, switch legs in the air, land in the opposite lunge. Reactive hip flexor power, glute activation, and deceleration control. Land softly — the landing quality matters as much as the jump. This is the loaded version of the split stance switches you just did in warm-up.", rest:90 },
        ]
      },
      {
        title:"Isometrics",
        exercises:[
          { name:"Spanish squat hold", sets:3, target:"45 sec", note:"Band around a fixed post at shin height. Lean back against band, squat to 90° knee bend — band pulls knees forward creating maximum quad and patellar tendon loading. This is tendon prep for what follows. Ph3: go deeper, increase time.", rest:60 },
          { name:"Adductor squeeze hold", sets:3, target:"30 sec", note:"Seated or standing with a ball or pad between knees. Squeeze as hard as possible and hold. Activates the adductors isometrically before the lateral loading in adductor block.", rest:60 },
          { name:"Single-leg wall sit", sets:3, target:"20 sec/leg", note:"Back against wall, one leg extended, sit to 90°. Quad and VMO loading under time. Ph3: drop lower toward 100° knee bend.", rest:45 },
        ]
      },
      {
        title:"Quad strength",
        exercises:[
          { name:"Banded box squat", sets:4, target:"5 reps", note:"Bands anchored low (around the base of a rack or dumbbells), looped over the barbell. Sit back onto box, pause, then EXPLODE up against band resistance. The band deloads at the bottom and loads hardest at lockout — teaches you to maintain bar speed through the whole rep. This directly develops rate of force development for jumping. Ph1: light bands, controlled. Ph2–3: aggressive drive against the bands. Box height = parallel or just below.", rest:180 },
          { name:"Front squat — heel elevated", sets:3, target:"8 reps", note:"2–3 inch plates or a heel wedge under both heels. This shifts the torso upright and forces the knee to travel over the toe — maximum quad loading with significantly less lower back and hip flexor stress than back squat. Elbows high, bar resting on front delts, tempo applies. This hits the quad from a different angle than box squat.", rest:180 },
          { name:"Bulgarian split squat with rotation", sets:3, target:"10 reps/leg", note:"Rear foot elevated on bench. Hold a DB or plate at chest. At the bottom of each rep rotate your torso AWAY from the front leg — rotate right when left leg is forward. This adds anti-rotation core demand while the hip flexor and quad are under load. Come back to center, drive up. Tempo applies on the descent. 3–4 week rotation: switch to holding the weight overhead for increased core demand.", rest:120 },
        ]
      },
      {
        title:"Quad + unilateral detail",
        exercises:[
          { name:"Barbell single-leg reverse lunge", sets:3, target:"10 reps/leg", note:"Barbell on back. Step one foot back into a lunge, lower rear knee toward floor, drive back up through the front heel. This is harder than it looks — you're on one leg with an axial load. Hip stability and quad strength together. Keep the front shin as vertical as possible. 3–4 week rotation: switch to DB reverse lunge for easier load management.", rest:120 },
          { name:"Sissy squat", sets:3, target:"12 reps", note:"Hold something fixed for balance (rack, machine). Let the knees travel far forward as you lower, lean the torso back to counterbalance, heels rise. You are going into extreme knee flexion with the body in a plank-like position from knee to shoulder. This is the highest patellar tendon load you can create. Control the descent completely — 3 sec down. Hold at the bottom for 1 sec. Do NOT rush these. Ph1: bodyweight and partial range. Ph2–3: full depth with weight held at chest.", rest:90 },
          { name:"Leg extension", sets:3, target:"15 reps", note:"4 sec eccentric — lower slowly. Squeeze at full extension for 1 sec. Last exercise in quad block so go to near-failure. This plus sissy squats means the patellar tendon has been thoroughly loaded today.", rest:90 },
        ]
      },
      {
        title:"Adductor work",
        exercises:[
          { name:"Side lunge", sets:3, target:"12 reps/side", note:"Push hips back as you step laterally — you should feel the inner thigh of the straight leg stretch as you load the bent leg. Drive back to standing through the bent leg heel. This is the only squat pattern that loads the adductors eccentrically under bodyweight. 3–4 week rotation: add a DB goblet hold for extra load.", rest:90 },
          { name:"Cable hip adduction", sets:3, target:"15 reps/leg", note:"Low pulley, cable attached to ankle. Stand side-on to machine, draw the working leg across the body against the cable. Full ROM — let the leg travel back out slowly. This is pure adductor isolation.", rest:60 },
          { name:"Weighted Copenhagen plank", sets:3, target:"20 sec/side", note:"Top leg on a bench, bottom leg hanging. Body in a straight line. Hold a weight plate on the hip of the working side. This is significantly harder than the bodyweight version — adductors and obliques both under load. Build to heavier plates over weeks.", rest:60 },
        ]
      },
      {
        title:"Calves + tibialis",
        exercises:[
          { name:"Standing calf raise", sets:4, target:"20 reps", note:"3 sec eccentric, 1 sec stretch hold at the bottom every rep. Full range — let the heel drop as low as possible. Gastrocnemius emphasis.", rest:60 },
          { name:"Seated calf raise", sets:3, target:"20 reps", note:"Knee bent at 90°. Same tempo. The bent knee takes the gastrocnemius off the equation and isolates the soleus — a separate muscle that most people neglect. Both heads need training.", rest:60 },
          { name:"Tibialis raise", sets:3, target:"20 reps", note:"Stand with heels on a step or plate, toes in the air. Dorsiflex the foot (pull toes up) against resistance. This muscle is the one that prevents shin splints and controls ankle dorsiflexion. Non-negotiable with sprinting and boxing footwork.", rest:45 },
        ]
      },
      {
        title:"Core",
        exercises:[
          { name:"Hanging leg raise", sets:3, target:"12 reps", note:"Dead hang from bar. Raise straight legs to parallel or above. Keep the swing controlled — this is not a momentum exercise. Rotate through variations each week: straight leg raises → toes to bar → oblique knee tucks (bring both knees to one side alternating) → windshield wipers (legs side to side at top).", rest:60 },
          { name:"Plank drags", sets:3, target:"10 reps/side", note:"In a push-up plank position, place a KB or plate on the floor. Reach under with one hand, drag it across your body to the other side. The goal is zero hip rotation — brace everything. This is anti-rotation core under load. Harder than it looks.", rest:60 },
          { name:"Bicycle crunches", sets:3, target:"20 reps", note:"Slow and controlled — 2 sec each side. Don't pull the neck. Full rotation through the torso, not just elbow to knee.", rest:45 },
        ]
      },
    ]
  },

  fri: {
    label:"Friday", name:"Upper A", subtitle:"Chest + back heavy", color:"#2980b9",
    sections:[
      {
        title:"Activation + warm-up",
        exercises:[
          { name:"Band pull-aparts", sets:3, target:"15 reps", note:"Arms straight in front, pull band apart to chest level. Rear delt and mid-trap activation before any pressing. This is the most important pre-press warm-up movement.", rest:30 },
          { name:"Dead hangs", sets:2, target:"20 sec", note:"Full bodyweight hang from a bar. Decompresses the shoulder joint, activates the lats passively. Do this before pressing to create proper shoulder positioning.", rest:30 },
          { name:"Push-up to downward dog", sets:2, target:"10 reps", note:"Perform a push-up then push hips back to downward dog, stretching lats and chest. Warms up both pushing muscles and antagonists.", rest:30 },
        ]
      },
      {
        title:"Power primer",
        exercises:[
          { name:"Hang clean high pull", sets:4, target:"4 reps", note:"Start from hang position — bar at mid-thigh, hips hinged. Drive hips forward aggressively (triple extension — ankle, knee, hip all at once), shrug hard, and pull the bar to sternum height with elbows high and wide. This is NOT a bicep curl — the power comes from the hips. This movement primes the posterior chain, upper traps, and every muscle you're about to use. Ph1: light bar, focus on hip snap. Ph2–3: add load, but power is always the priority over weight.", rest:120 },
          { name:"Plyo push-ups", sets:3, target:"6 reps", note:"Hands leave the floor at the top. Lower under control, then explode upward. Reset on each rep. Upper body rate of force development — this is the pressing equivalent of a jump squat.", rest:60 },
        ]
      },
      {
        title:"Isometrics",
        exercises:[
          { name:"Wall chest push", sets:3, target:"30 sec", note:"Stand facing a wall, arms bent at 90°. Push maximally into the wall — chest and triceps contract isometrically. Tendon loading for the pressing that follows.", rest:60 },
          { name:"Dead hang", sets:3, target:"30 sec", note:"Bodyweight hang, lat and bicep tendon loading. Also decompresses the spine between sessions.", rest:60 },
          { name:"Slow controlled single-arm DB row", sets:3, target:"8 reps/side", note:"REPLACING the isometric row hold — 3 sec down, pause at stretch, 2 sec pull. Light weight. This activates the lat and mid-back with actual movement and blood flow rather than a static hold which provides minimal activation benefit at this point in the session.", rest:60 },
        ]
      },
      {
        title:"Chest — heavy compounds",
        exercises:[
          { name:"Incline barbell press", sets:4, target:"8 reps", note:"30–45° incline. Tempo applies. Upper chest and front delt. Don't go too steep — above 45° it becomes more shoulder press than chest.", rest:180 },
          { name:"Flat barbell bench press", sets:4, target:"8 reps", note:"Primary chest mass builder. Tempo applies. Pause at the bottom every rep — eliminates bounce, increases pec loading.", rest:180 },
        ]
      },
      {
        title:"Back — heavy compounds",
        exercises:[
          { name:"Weighted pull-ups", sets:4, target:"8 reps", note:"Full dead hang at the bottom every single rep. No half reps, no kipping. Add weight via belt or vest. Most complete lat and mid-back exercise that exists.", rest:180 },
          { name:"Barbell bent-over row", sets:4, target:"10 reps", note:"Hinge to 45° and hold that position throughout — no standing up on each rep. Drive elbows back past the torso. Tempo applies. 3–4 week rotation: switch to Pendlay row (dead stop on floor each rep) for more explosion.", rest:180 },
        ]
      },
      {
        title:"Chest accessories",
        exercises:[
          { name:"Incline DB fly", sets:3, target:"12 reps", note:"30–45° incline. Slow eccentric — feel every fiber of the upper pec lengthening. Don't let the arms drop too low. 3–4 week rotation: switch to cable fly (high to low) for constant tension version.", rest:90 },
          { name:"Push-ups", sets:2, target:"To failure", note:"Bodyweight — chest pump finisher. Hands slightly wider than shoulder width. Full depth.", rest:60 },
        ]
      },
      {
        title:"Back accessories",
        exercises:[
          { name:"Incline DB row", sets:3, target:"12 reps", note:"Lie chest-down on an incline bench set to 30–45°. Row both DBs or alternate. Chest support removes all lower back involvement — pure lat and mid-back. 3–4 week rotation: switch to chest-supported machine row.", rest:90 },
          { name:"Lat pullover", sets:3, target:"12 reps", note:"Lying on a bench, DB held in both hands. Lower the weight behind your head with soft elbows, stretching the lat fully, then pull back over chest. Full lat range that no other exercise provides. Can also do with a cable for constant tension.", rest:90 },
          { name:"Barbell shrug", sets:3, target:"15 reps", note:"Hold 1 sec at top. No rolling — straight up, straight down. Trap fullness.", rest:90 },
          { name:"Back extension", sets:3, target:"15 reps", note:"Erectors. Controlled — don't hyperextend at the top.", rest:60 },
        ]
      },
      {
        title:"Rotator cuff",
        exercises:[
          { name:"Band external rotation", sets:3, target:"15 reps/arm", note:"Elbow at side, rotate outward against band resistance. Especially important with boxing in the program — shoulder longevity depends on rotator cuff integrity.", rest:45 },
          { name:"Band internal rotation", sets:3, target:"15 reps/arm", note:"Elbow at side, rotate inward against band. Balance both directions.", rest:45 },
        ]
      },
    ]
  },

  sat: {
    label:"Saturday", name:"Lower B", subtitle:"Posterior chain + vertical + athletic", color:"#c0392b",
    sections:[
      {
        title:"Activation + warm-up",
        exercises:[
          { name:"Banded forward march", sets:2, target:"15 steps", note:"Same as Lower A. Hip flexor and glute med activation. Band around ankles, deliberate steps forward.", rest:20 },
          { name:"Banded backward march", sets:2, target:"15 steps", note:"Walk backward against band. Loads glutes and hamstrings from extension — direct prep for the hinge work ahead.", rest:20 },
          { name:"Banded lateral walk", sets:2, target:"15 steps/side", note:"Glute medius is critical for every single-leg movement today. Don't rush this.", rest:20 },
          { name:"Glute bridges", sets:2, target:"15 reps", note:"Activate glutes before you load them heavily with hip thrusts and deadlifts. Hold 1 sec at top.", rest:30 },
          { name:"Hip flexor stretch", sets:2, target:"45 sec/side", note:"Kneeling lunge position. Opens hip extension range for deadlifts and jumps. Posterior pelvic tilt to increase the stretch.", rest:30 },
        ]
      },
      {
        title:"Power primer",
        exercises:[
          { name:"Kettlebell snatch", sets:4, target:"5 reps/side", note:"From hang or floor — hike the KB back, drive hips forward explosively, and punch the KB overhead in one fluid motion. The hip snap is everything — this is not a shoulder press. Develops the same explosive posterior chain power used in jumping and sprinting. Ph1: light KB, nail the hip snap. Ph2–3: heavier load, same explosive intent. 3–4 week rotation: switch to dumbbell snatch.", rest:120 },
          { name:"Lateral hop single-leg tuck jump", sets:3, target:"4 reps/side", note:"Hop laterally on one foot, land on the same foot, immediately jump vertically driving both knees to chest. Two demands at once — lateral reactive ability and vertical power. The landing on one foot is where the athletic adaptation happens. Land softly, absorb, explode. Basketball-specific pattern — this is a lateral cut turned into a jump.", rest:120 },
        ]
      },
      {
        title:"Vertical jump protocol",
        exercises:[
          { name:"Approach jump practice", sets:4, target:"5 reps", note:"2–3 step approach. Gather step — plant, hinge hips, load the glutes. Arm swing must be aggressive — arms generate 10–15% of jump height. Drive knees up at peak. Full reset between every rep — this is skill practice, not conditioning.", rest:120 },
          { name:"Broad jumps", sets:3, target:"5 reps", note:"Max horizontal distance. Full hip extension, aggressive arm drive, land softly and absorb. Develops the same explosive hip extension pattern as sprinting and jumping.", rest:120 },
          { name:"Ankle hops", sets:3, target:"15 reps", note:"Minimal knee bend — all ankle. Rapid, low amplitude. This trains the Achilles tendon's elastic properties which are directly responsible for jumping efficiency. Think stiff, quick, springy.", rest:60 },
          { name:"Depth jump to max reach", sets:3, target:"5 reps", note:"Ph2–3 only. Step off a box (do not jump off), land, and immediately explode upward reaching max height. Ground contact should be under 0.2 seconds — the shorter the better. This teaches reactive strength.", rest:120 },
        ]
      },
      {
        title:"Isometrics",
        exercises:[
          { name:"RDL hold at mid-shin", sets:3, target:"30 sec", note:"Light load — 50% of your working RDL weight. Hold the hinge position at mid-shin. Hamstring and posterior knee tendon loading before the heavy work. Feels uncomfortable — that's the point.", rest:60 },
          { name:"Hip thrust hold at top", sets:3, target:"30 sec", note:"Barbell on hips, hold the top position. Glute max isometric. Activates the glutes maximally before loading them.", rest:60 },
          { name:"Standing plate adductor squeeze", sets:3, target:"30 sec", note:"Stand with a plate held between your knees. Squeeze as hard as possible. Adductor activation before the lateral work at the end.", rest:60 },
        ]
      },
      {
        title:"Posterior chain strength",
        exercises:[
          { name:"Nordic curls", sets:3, target:"6 reps", note:"Ph2–3 only. FIRST exercise in this block while hamstrings are completely fresh. Kneel on a pad, anchor feet under a heavy bar or have someone hold them. Lower your body toward the floor using hamstring eccentric control — as slow as possible. Use hands to catch yourself. Pull back up. This is the most effective hamstring exercise that exists for both strength and injury prevention.", rest:120 },
          { name:"Trap bar deadlift", sets:4, target:"5 reps", note:"Today's primary strength driver. No squats today — spine is fully recovered from Thursday. Controlled descent, sit into the hips, explosive drive. 3–4 week rotation: switch to conventional deadlift for a different hip hinge demand.", rest:180 },
          { name:"Romanian deadlift", sets:4, target:"10 reps", note:"After trap bar — hamstring hypertrophy work. Feel the full stretch at the bottom every rep. Tempo applies. Don't round the lower back.", rest:180 },
          { name:"Barbell hip thrust", sets:4, target:"12 reps", note:"Squeeze + 1 sec hold at the top every rep. Glute max under full load. This is the primary glute hypertrophy exercise.", rest:120 },
          { name:"Seated leg curl", sets:4, target:"12 reps", note:"3 sec eccentric — the slow lowering is what drives hamstring hypertrophy. Control the weight back down every rep.", rest:90 },
        ]
      },
      {
        title:"Adductor detail",
        exercises:[
          { name:"Adductor machine", sets:3, target:"15 reps", note:"3 sec eccentric opening — let the legs travel out slowly. The lengthening is where the adaptation happens. Full ROM.", rest:90 },
          { name:"Weighted Copenhagen plank", sets:3, target:"20 sec/side", note:"Top leg on bench, bottom leg hanging, plate on hip. Hold a straight body line. Adductor and oblique loading simultaneously.", rest:60 },
        ]
      },
      {
        title:"Conditioning finisher",
        exercises:[
          { name:"Sled sprint carry", sets:4, target:"20 yards", note:"Load the sled and drive it forward as fast as possible. Lean into it, drive the knees, big arm swing. This is leg power + conditioning in one. Ph1: light load — focus on mechanics and leg drive. Ph2: moderate load — controlled aggression. Ph3: heavy load — max effort every rep. 90 sec rest between sets.", rest:90 },
        ]
      },
      {
        title:"Calves + core",
        exercises:[
          { name:"Single-leg calf raise", sets:3, target:"20 reps/leg", note:"Full stretch at bottom every rep. Single-leg for greater loading and balance demand.", rest:60 },
          { name:"Back extension", sets:3, target:"15 reps", note:"Erectors — lower back health across both leg days. Controlled.", rest:60 },
          { name:"Plank", sets:2, target:"60 sec", note:"Full body tension. Don't let the hips sag.", rest:45 },
        ]
      },
    ]
  },

  sun: {
    label:"Sunday", name:"Upper B", subtitle:"Shoulders + arms + athletic detail", color:"#8e44ad",
    sections:[
      {
        title:"Activation + warm-up",
        exercises:[
          { name:"Band pull-aparts", sets:3, target:"15 reps", note:"Rear delt and rotator cuff activation. Arms straight, pull band to chest. 4 days since last boxing — shoulders still benefit from activation work.", rest:30 },
          { name:"Arm circles", sets:2, target:"30 sec/direction", note:"Forward 30 sec then backward 30 sec. Full shoulder joint range of motion prep.", rest:30 },
          { name:"Band external rotation", sets:2, target:"15 reps/arm", note:"Elbow at side — rotator cuff warm-up before heavy overhead pressing.", rest:30 },
        ]
      },
      {
        title:"Power primer",
        exercises:[
          { name:"Med ball overhead slam", sets:3, target:"6 reps", note:"Hold ball overhead, full extension. Slam down as hard as possible. Posterior chain activation, lat loading, shoulder prep. Catch or pick up and repeat.", rest:60 },
          { name:"Plyo push-ups", sets:3, target:"6 reps", note:"Hands off floor at top. Upper body rate of force development — same as Friday but lighter load due to Saturday's session.", rest:60 },
        ]
      },
      {
        title:"Isometrics",
        exercises:[
          { name:"DB fly hold", sets:3, target:"20 sec", note:"Arms wide, mid-range position. Second chest stimulus this week — isometric loading of the pec in a stretched position.", rest:60 },
          { name:"OHP lockout hold", sets:3, target:"20 sec", note:"60% of working weight, pressed overhead, hold at lockout. Shoulder tendon loading before the heavy press.", rest:60 },
          { name:"Rear delt fly hold", sets:3, target:"20 sec", note:"Arms extended out to sides, hold the contracted position. Rear delt and mid-trap activation before isolation work.", rest:60 },
        ]
      },
      {
        title:"Shoulder — compound",
        exercises:[
          { name:"Overhead press", sets:4, target:"10 reps", note:"Tempo applies — front delt primary, full shoulder stability. 3–4 week rotation: switch between barbell and DB press.", rest:180 },
          { name:"Face pulls", sets:3, target:"15 reps", note:"Cable at face height, rope attachment. Pull to face with external rotation at the end — elbows end up behind the bar. Done before lateral raises to prime the rear delt and rotator cuff joint capsule.", rest:60 },
        ]
      },
      {
        title:"Shoulder — lateral + rear isolation",
        exercises:[
          { name:"DB lateral raise", sets:3, target:"15 reps", note:"2 sec up, 3 sec down. Lead with the elbow, not the wrist. Pinky slightly higher than thumb at top. No swinging — if you're swinging it's too heavy.", rest:60 },
          { name:"Rear delt DB fly", sets:4, target:"15 reps", note:"Chest parallel to floor or on incline bench face down. Slow eccentric, zero momentum. This is the exercise most people do wrong — keep the weight light enough to feel the rear delt working.", rest:60 },
          { name:"Cable lateral raise", sets:3, target:"15 reps/side", note:"Low pulley, cable at ankle. Raise to shoulder height. Constant tension throughout — no dead spot at the bottom like DB version. Interleaved with rear delt work to alternate the stimulus angle.", rest:60 },
          { name:"Reverse pec deck", sets:3, target:"15 reps", note:"Machine — squeeze hard at full extension. Rear delt peak contraction.", rest:60 },
        ]
      },
      {
        title:"Second chest stimulus",
        exercises:[
          { name:"Pec deck / machine fly", sets:3, target:"12 reps", note:"Constant tension, mid-chest squeeze. This is the second chest hit of the week — isolation, not compound.", rest:90 },
          { name:"Chest dips", sets:2, target:"To failure", note:"Forward lean, elbows slightly flared outward. Lower until a full pec stretch. This is lower chest primary. Bodyweight so recovery cost is negligible.", rest:60 },
        ]
      },
      {
        title:"Back detail",
        exercises:[
          { name:"Seated cable row", sets:3, target:"12 reps", note:"Full forward lean at the stretch, drive elbows past the torso on the pull. Mid-back and lat thickness. 3–4 week rotation: switch to single-arm cable row for more ROM.", rest:90 },
          { name:"Lat pullover", sets:3, target:"12 reps", note:"Second hit this week. DB or cable — full lat lengthening behind the head, pull back to over chest. Serratus anterior also works here.", rest:90 },
        ]
      },
      {
        title:"Triceps",
        exercises:[
          { name:"Close-grip bench press", sets:3, target:"10 reps", note:"Hands shoulder-width on bar. All 3 tricep heads. Best mass builder for the triceps.", rest:120 },
          { name:"Overhead tricep extension", sets:3, target:"12 reps", note:"Arms overhead — long head of the tricep is maximally stretched in this position. The long head is the biggest head. Don't skip this.", rest:90 },
          { name:"Underhand tricep pushdown", sets:3, target:"15 reps", note:"Reverse grip on the cable bar — palms facing up. This emphasizes the medial head of the tricep which the standard and rope pushdown don't hit as directly. Different angle, different head, complete coverage.", rest:60 },
        ]
      },
      {
        title:"Biceps",
        exercises:[
          { name:"Slow controlled barbell curl", sets:3, target:"10 reps", note:"4 sec eccentric, 1 sec pause at stretch, 2 sec concentric. No swinging. This is the controlled version you asked for — the slow eccentric is what drives hypertrophy. The weight will be lighter than your normal curl weight and that's correct.", rest:90 },
          { name:"Incline DB curl", sets:3, target:"12 reps", note:"45° bench, arm hangs behind body at full extension. Maximum long head stretch — the arm-behind-body position is what makes this different from a regular DB curl.", rest:90 },
          { name:"Hammer curl", sets:3, target:"12 reps", note:"Neutral grip — brachialis and forearm thickness. The brachialis sits between the bicep and tricep and makes the arm look thicker from every angle.", rest:60 },
        ]
      },
      {
        title:"Forearms + grip",
        exercises:[
          { name:"Wrist curl (supinated)", sets:3, target:"20 reps", note:"Forearms on a bench, palms up, curl the wrist up. Flexors — underside of forearm.", rest:45 },
          { name:"Wrist curl (pronated)", sets:3, target:"20 reps", note:"Forearms on bench, palms down, curl the wrist up. Extensors — top of forearm.", rest:45 },
          { name:"Reverse curl (EZ bar)", sets:3, target:"12 reps", note:"Overhand grip on EZ bar. Brachioradialis — adds thickness just above the wrist.", rest:60 },
          { name:"Farmer carry", sets:3, target:"30 sec", note:"Heavy DBs, walk a fixed distance or in place. Grip strength for boxing and court. Forearms, grip, traps, and core all working.", rest:60 },
        ]
      },
      {
        title:"Core",
        exercises:[
          { name:"Hanging leg raise", sets:3, target:"12 reps", note:"Dead hang from bar. Rotate through variations each week: straight leg raises (easiest) → toes to bar → oblique knee tucks (bring knees to one side, alternating) → windshield wipers (legs side to side at top — hardest). Progress through these over the 12 weeks.", rest:60 },
          { name:"Plank drags", sets:3, target:"10 reps/side", note:"KB or plate on floor beside you. From a plank, reach under with one hand and drag it to the other side. Anti-rotation under load — core works to prevent the hip from dropping or rotating.", rest:60 },
          { name:"Hollow body hold", sets:2, target:"30 sec", note:"Lower back pressed into floor, arms overhead, legs extended and elevated. Full body tension. Deep core.", rest:45 },
        ]
      },
      {
        title:"Rotator cuff",
        exercises:[
          { name:"Band external rotation", sets:3, target:"15 reps/arm", note:"Elbow at side. Shoulder longevity — especially important with boxing twice a week.", rest:45 },
          { name:"Band internal rotation", sets:3, target:"15 reps/arm", note:"Elbow at side.", rest:45 },
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
// Maps each swappable exercise to a list of alternatives.
// Alternatives include the exercise name, sets, target, note, and rest time
// so the session can fully initialize the swap without losing any data.

export const SWAPS = {
  // ── LOWER A — Quad Strength ──
  "Banded box squat": [
    { name:"Pause squat", sets:4, target:"5 reps", note:"Bar on back, full pause at the bottom for 2 sec — removes stretch reflex, pure quad strength from a dead stop.", rest:180 },
    { name:"Goblet squat", sets:4, target:"10 reps", note:"DB or KB held at chest. Upright torso, deep knee bend. Great substitute when bands aren't available.", rest:120 },
    { name:"Hack squat machine", sets:4, target:"8 reps", note:"Machine takes the stability demand away — pure quad loading. Good when lower back is fatigued.", rest:150 },
  ],
  "Front squat — heel elevated": [
    { name:"Leg press", sets:4, target:"12 reps", note:"High and narrow foot placement for quad emphasis. 3 sec eccentric. No lower back involvement.", rest:120 },
    { name:"Safety bar squat", sets:3, target:"8 reps", note:"Upright torso like front squat but hands free. Same quad emphasis, easier on wrists.", rest:180 },
    { name:"Dumbbell goblet squat", sets:3, target:"12 reps", note:"Hold heavy DB at chest, heels elevated on plates. Good front squat substitute when the barbell rack isn't available.", rest:120 },
  ],
  "Bulgarian split squat with rotation": [
    { name:"Walking lunges", sets:3, target:"12 reps/leg", note:"Step forward into lunge, drive back up and step through. Continuous movement — develops rhythm and coordination as well as strength.", rest:120 },
    { name:"Reverse lunge", sets:3, target:"10 reps/leg", note:"Step backward — easier on the knees than forward lunge. Same quad and glute demand.", rest:120 },
    { name:"Step-ups", sets:3, target:"10 reps/leg", note:"Box or bench, drive through the heel of the elevated leg. Unilateral quad and glute without the balance challenge of split squat.", rest:120 },
    { name:"Bulgarian split squat", sets:3, target:"10 reps/leg", note:"Standard version without rotation. Rear foot elevated, straight descent. Heavy DB in each hand.", rest:120 },
  ],
  "Barbell single-leg reverse lunge": [
    { name:"DB reverse lunge", sets:3, target:"10 reps/leg", note:"Same movement with DBs instead of barbell — easier to control, less spinal loading.", rest:120 },
    { name:"Step-ups with knee drive", sets:3, target:"10 reps/leg", note:"Step up, drive the free knee to hip height at the top. More hip flexor involvement, same quad loading.", rest:120 },
    { name:"Split squat", sets:3, target:"10 reps/leg", note:"Static — no stepping. Both feet stay planted in a lunge position, just go up and down. Simplest single-leg quad exercise.", rest:120 },
  ],
  "Sissy squat": [
    { name:"Leg extension — extended tempo", sets:3, target:"15 reps", note:"4 sec down, 2 sec up, 1 sec squeeze at top. Extra sets to compensate for removing sissy squat.", rest:90 },
    { name:"Terminal knee extension (TKE)", sets:3, target:"20 reps/leg", note:"Band around back of knee, standing on one leg, drive knee forward against band. VMO and patellar tendon loading, easier than sissy squat.", rest:60 },
    { name:"Wall sit", sets:3, target:"45 sec", note:"Back against wall, thighs parallel — isometric quad hold. Good substitute when knees are sensitive.", rest:60 },
  ],
  // ── LOWER A — Adductor Work ──
  "Side lunge": [
    { name:"Cossack squat", sets:3, target:"8 reps/side", note:"Deep lateral lunge with full adductor stretch — one leg straight, one leg in a deep squat. More range than side lunge.", rest:90 },
    { name:"Sumo squat", sets:3, target:"12 reps", note:"Wide stance, toes out. Both adductors load simultaneously. Hold a heavy DB for more resistance.", rest:90 },
    { name:"Lateral step-up", sets:3, target:"10 reps/leg", note:"Step sideways onto a box. Glute med and adductor loading from a lateral approach.", rest:90 },
  ],
  "Cable hip adduction": [
    { name:"Adductor machine", sets:3, target:"15 reps", note:"Same movement pattern as cable adduction, easier to set up. 3 sec eccentric opening.", rest:90 },
    { name:"Side-lying hip adduction", sets:3, target:"20 reps/leg", note:"Lie on side, raise bottom leg up. Pure bodyweight adductor isolation — use ankle weight to progress.", rest:60 },
    { name:"Band hip adduction", sets:3, target:"15 reps/leg", note:"Band around ankle, stand side-on to anchor. Same as cable version.", rest:60 },
  ],
  // ── LOWER A — Core ──
  "Hanging leg raise": [
    { name:"Lying leg raise", sets:3, target:"12 reps", note:"Flat on floor, raise straight legs to 90°. Lower back pressed into floor. Same rectus abdominis demand without the bar.", rest:60 },
    { name:"Ab wheel rollout", sets:3, target:"10 reps", note:"From knees, roll out slowly and return. Anti-extension core — very demanding.", rest:60 },
    { name:"Cable crunch", sets:3, target:"15 reps", note:"Rope at high pulley, kneel, crunch down. Loaded abs through full range.", rest:60 },
  ],
  "Plank drags": [
    { name:"Pallof press", sets:3, target:"12 reps/side", note:"Cable at chest height, hold handle at chest, press straight out and return. Anti-rotation core — same intent as plank drags.", rest:60 },
    { name:"Renegade row", sets:3, target:"8 reps/side", note:"In push-up position with DBs, row one DB at a time. Anti-rotation plus upper back.", rest:90 },
    { name:"Plank with shoulder tap", sets:3, target:"10 taps/side", note:"In plank, tap opposite shoulder alternately. Anti-rotation and shoulder stability.", rest:60 },
  ],
  // ── UPPER A — Chest ──
  "Incline barbell press": [
    { name:"Incline DB press", sets:4, target:"10 reps", note:"Deeper stretch at the bottom than barbell. Independent arm movement exposes imbalances.", rest:150 },
    { name:"Machine incline press", sets:4, target:"12 reps", note:"Fixed path — remove stability demand. Good when shoulders are sensitive.", rest:120 },
    { name:"Cable incline fly", sets:4, target:"12 reps", note:"Low pulleys, incline bench — constant tension fly variation.", rest:90 },
  ],
  "Flat barbell bench press": [
    { name:"DB bench press", sets:4, target:"10 reps", note:"Deeper stretch than barbell. Each arm works independently — exposes and corrects imbalances.", rest:150 },
    { name:"Machine chest press", sets:4, target:"12 reps", note:"Fixed path, easy to control load. Good when lower back, shoulders, or wrist feel off.", rest:120 },
    { name:"Close-grip bench press", sets:4, target:"10 reps", note:"More tricep involvement, less chest range. Good variation for overall pressing strength.", rest:180 },
  ],
  "Incline DB fly": [
    { name:"Cable fly — high to low", sets:3, target:"12 reps", note:"High pulleys, draw hands down and together. Constant tension — no dead spot.", rest:90 },
    { name:"Pec deck / machine fly", sets:3, target:"12 reps", note:"Same constant tension as cable, easier to set up.", rest:90 },
    { name:"Push-ups — incline", sets:3, target:"15 reps", note:"Hands elevated, bodyweight fly/press hybrid.", rest:60 },
  ],
  // ── UPPER A — Back ──
  "Weighted pull-ups": [
    { name:"Lat pulldown — wide grip", sets:4, target:"10 reps", note:"Same pulling pattern, easier to load and control. Full stretch at the top every rep.", rest:150 },
    { name:"Assisted pull-ups", sets:4, target:"8 reps", note:"Machine assistance — maintains the movement pattern at lower bodyweight.", rest:150 },
    { name:"Single-arm lat pulldown", sets:4, target:"10 reps/arm", note:"Greater range of motion than double. Forces each side to work independently.", rest:120 },
  ],
  "Barbell bent-over row": [
    { name:"DB bent-over row", sets:4, target:"10 reps/arm", note:"Single arm — greater range of motion, removes balance demand.", rest:120 },
    { name:"Pendlay row", sets:4, target:"6 reps", note:"Dead stop on floor each rep, explosive pull. More power development than standard row.", rest:180 },
    { name:"T-bar row", sets:4, target:"10 reps", note:"Chest supported version available on most machines. Mid-back emphasis.", rest:150 },
    { name:"Seated cable row", sets:4, target:"12 reps", note:"Full forward lean stretch. Constant tension. Lower back stays out of it more than bent-over row.", rest:120 },
  ],
  "Incline DB row": [
    { name:"Chest-supported machine row", sets:3, target:"12 reps", note:"Same chest support principle — removes lower back. Pull to lower chest.", rest:90 },
    { name:"Single-arm DB row", sets:3, target:"10 reps/arm", note:"Brace on bench, full stretch at bottom. Standard lat row.", rest:90 },
  ],
  // ── LOWER B — Posterior Chain ──
  "Nordic curls": [
    { name:"Leg curl — slow eccentric", sets:3, target:"10 reps", note:"3 extra sets on the leg curl machine, 5 sec eccentric each rep. Closest substitute to Nordic — same hamstring lengthening demand.", rest:120 },
    { name:"Good mornings", sets:3, target:"10 reps", note:"Bar on back, hinge forward keeping back flat — loads hamstrings and erectors under load.", rest:120 },
    { name:"Swiss ball hamstring curl", sets:3, target:"12 reps", note:"Hips up, feet on ball, curl ball toward body. Requires no equipment beyond a stability ball.", rest:90 },
  ],
  "Trap bar deadlift": [
    { name:"Conventional deadlift", sets:4, target:"5 reps", note:"Standard barbell deadlift. More hip hinge and posterior chain demand than trap bar.", rest:180 },
    { name:"Sumo deadlift", sets:4, target:"5 reps", note:"Wide stance, hands inside legs. More adductor and quad involvement than conventional.", rest:180 },
    { name:"Romanian deadlift — heavy", sets:5, target:"8 reps", note:"Extra set, heavier load — if trap bar isn't available, RDL as the primary hinge today.", rest:180 },
  ],
  "Romanian deadlift": [
    { name:"Good mornings", sets:4, target:"10 reps", note:"Bar on back, hinge forward — loads the hamstrings from a hip hinge. Similar stimulus, different feel.", rest:150 },
    { name:"Cable pull-through", sets:4, target:"12 reps", note:"Low pulley, rope between legs — hip hinge with constant cable tension. No axial load.", rest:120 },
    { name:"Kettlebell swing", sets:4, target:"15 reps", note:"Explosive RDL pattern — hip hinge power. Develops the same hip extension used for jumping and sprinting.", rest:120 },
  ],
  "Barbell hip thrust": [
    { name:"DB hip thrust", sets:4, target:"12 reps", note:"Same movement, DBs on hips instead of barbell. Easier to set up, slightly less stable.", rest:120 },
    { name:"Glute bridge", sets:4, target:"15 reps", note:"On the floor — shorter range of motion than hip thrust but zero setup. Can use barbell or bodyweight.", rest:90 },
    { name:"Cable hip extension", sets:4, target:"15 reps/leg", note:"Low cable, ankle attachment — kick one leg back. Single-leg glute isolation.", rest:90 },
  ],
  "Seated leg curl": [
    { name:"Lying leg curl", sets:4, target:"12 reps", note:"Face down — slightly different hamstring angle than seated. 3 sec eccentric.", rest:90 },
    { name:"Nordic curl — partial", sets:4, target:"8 reps", note:"Only lower halfway — builds toward full Nordic. 4 sec eccentric lowering.", rest:120 },
  ],
  // ── UPPER B — Shoulders ──
  "Overhead press": [
    { name:"DB shoulder press", sets:4, target:"10 reps", note:"Independent arms — deeper range, exposes imbalances. Seated or standing.", rest:180 },
    { name:"Arnold press", sets:4, target:"10 reps", note:"Start palms facing you, rotate to palms forward as you press. Hits all three delt heads in one movement.", rest:150 },
    { name:"Machine shoulder press", sets:4, target:"12 reps", note:"Fixed path, joint-friendly. Good when shoulders are fatigued or sensitive.", rest:120 },
  ],
  "DB lateral raise": [
    { name:"Cable lateral raise — both arms", sets:3, target:"15 reps", note:"Cross cables at low pulley, raise both arms simultaneously. Constant tension throughout.", rest:60 },
    { name:"Machine lateral raise", sets:3, target:"15 reps", note:"Pad on wrist, constant tension. Removes momentum entirely.", rest:60 },
    { name:"Leaning cable lateral raise", sets:3, target:"15 reps/side", note:"Hold a rack, lean away, raise cable from low pulley. Maximum stretch at the bottom.", rest:60 },
  ],
  "Rear delt DB fly": [
    { name:"Reverse pec deck — extra sets", sets:5, target:"15 reps", note:"Machine substitute — same rear delt isolation, constant tension.", rest:60 },
    { name:"Band pull-aparts", sets:4, target:"20 reps", note:"Bodyweight band — great rear delt pump, no equipment needed beyond a band.", rest:45 },
    { name:"Face pulls", sets:4, target:"15 reps", note:"Rope at face height, external rotation at the end. Rear delt plus rotator cuff.", rest:60 },
  ],
  // ── UPPER B — Triceps ──
  "Close-grip bench press": [
    { name:"Tricep dips", sets:3, target:"To failure", note:"Chest dip with elbows tucked close to torso. Emphasizes triceps over chest.", rest:120 },
    { name:"Skull crushers", sets:3, target:"12 reps", note:"EZ bar lowered to forehead. Long head of tricep under full stretch.", rest:90 },
    { name:"Tricep cable pushdown — bar", sets:3, target:"15 reps", note:"Straight bar — both arms, full extension.", rest:60 },
  ],
  "Overhead tricep extension": [
    { name:"Skull crushers", sets:3, target:"12 reps", note:"EZ bar lowered to forehead — long head loaded though not as stretched as overhead version.", rest:90 },
    { name:"DB overhead extension", sets:3, target:"12 reps", note:"One or two DBs overhead — same long head stretch as cable version.", rest:90 },
  ],
  // ── UPPER B — Biceps ──
  "Slow controlled barbell curl": [
    { name:"Cable curl — slow eccentric", sets:3, target:"12 reps", note:"Low pulley cable, 4 sec eccentric. Constant tension version of the controlled barbell curl.", rest:90 },
    { name:"Preacher curl", sets:3, target:"10 reps", note:"Upper arm fixed on pad — removes momentum completely. Short head of bicep emphasis.", rest:90 },
    { name:"Concentration curl", sets:3, target:"12 reps/arm", note:"Seated, elbow braced against inner thigh. Maximum isolation, zero momentum.", rest:60 },
  ],
  "Incline DB curl": [
    { name:"Cable curl — high pulley", sets:3, target:"12 reps/arm", note:"Single arm, cable from above — keeps the bicep under tension at the lengthened position.", rest:90 },
    { name:"Spider curl", sets:3, target:"12 reps", note:"Lie chest-down on incline bench, curl DBs. Arms hang straight down — short head emphasis and no momentum.", rest:90 },
  ],
};
