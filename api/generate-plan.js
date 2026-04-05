// Vercel serverless function — keeps ANTHROPIC_API_KEY server-side only
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI plan generation not configured', fallback: true });
  }

  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: 'Profile required' });
  }

  const { goal, experience, days, duration, equipment, injuries, sport, weight, prs, name } = profile;

  const daysStr = days.join(', ');
  const equipStr = equipment.join(', ');
  const prStr = Object.entries(prs || {}).slice(0, 5).map(([k, v]) => `${k}: ${v.weight}lbs × ${v.reps} reps`).join(', ') || 'none logged yet';
  const injuryStr = injuries || 'none';

  const prompt = `You are an expert strength and conditioning coach building a personalized workout plan for a fitness app called WRK.

USER PROFILE:
- Name: ${name || 'User'}
- Goal: ${goal}
- Experience: ${experience}
- Training days: ${daysStr} (${days.length} days/week)
- Session length: ${duration} minutes
- Equipment: ${equipStr}
- Injuries/limitations: ${injuryStr}
- Primary sport/activity: ${sport || 'general fitness'}
- Bodyweight: ${weight || 'not specified'} lbs
- Known PRs: ${prStr}

Build a complete weekly workout plan. Return ONLY valid JSON matching this exact schema — no explanation, no markdown, no preamble:

{
  "planName": "string",
  "planSubtitle": "string",
  "color": "#hexcolor",
  "weeks": [
    {
      "weekLabel": "Week 1-2",
      "focus": "Foundation",
      "days": {
        "mon": { "name": "string", "subtitle": "string", "color": "#hex", "sections": [ { "title": "string", "exercises": [ { "name": "string", "sets": 3, "target": "10 reps", "rest": 90, "note": "coaching cue", "tags": ["muscle","equipment","pattern"] } ] } ] },
        "tue": { "name": "Rest", "subtitle": "Recovery", "color": "#2c3e50", "sections": [] },
        "wed": { "name": "string", ... },
        "thu": { "name": "string", ... },
        "fri": { "name": "string", ... },
        "sat": { "name": "string", ... },
        "sun": { "name": "string", ... }
      }
    }
  ]
}

RULES:
- Only schedule workouts on these days: ${daysStr}. All other days must be rest (name: "Rest", color: "#2c3e50", sections: []).
- Session length is ${duration} minutes — scale volume accordingly. 75 min = ~5-6 sections, 45 min = ~3-4 sections.
- Use ONLY equipment available: ${equipStr}. Never prescribe barbell exercises if only "dumbbells" listed.
- If experience is "beginner": simpler movements, 3x10-12, focus on form cues. No Olympic lifts.
- If experience is "intermediate" or "advanced": include power primers, tempo work, progressive overload.
- Goal adjustments: muscle gain = higher volume, more sets. Fat loss = shorter rest, supersets. Athletic = power primers, plyometrics. General = balanced.
- Each exercise needs a specific coaching note (not generic).
- Tags must include muscle group, equipment type, and movement pattern from: quad, hamstring, glute, chest, back, shoulder, tricep, bicep, core, calf, barbell, dumbbell, cable, machine, bodyweight, band, kettlebell, squat, hinge, push, pull, lunge, plyo, iso, compound, isolation, unilateral, bilateral.
- Include 2-3 week progressions in the weeks array (adjust intensity/volume each block).
- Return valid JSON only. No comments in JSON.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(502).json({ error: 'AI service error', fallback: true });
    }

    const data = await response.json();
    const text = data.content[0]?.text || '';

    // Parse JSON — strip any accidental markdown fences
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const plan = JSON.parse(clean);

    return res.status(200).json({ plan });
  } catch (e) {
    console.error('Generate plan error:', e);
    return res.status(500).json({ error: e.message, fallback: true });
  }
}
