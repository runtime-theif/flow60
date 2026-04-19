import db from './db';

const MORNING_EXERCISES = [
  { name: 'Glute Bridge', sets: 3, reps: 15, duration: null, rest: 30, description: 'Lie on your back, knees bent, feet flat. Push hips up, squeeze glutes at top, lower slowly.', imageUrl: '/exercises/glute-bridge.gif', sessionType: 'morning', phase: 0 },
  { name: 'Bird Dog', sets: 3, reps: 10, duration: null, rest: 30, description: 'On all fours, extend opposite arm and leg simultaneously. Hold 2 seconds, return. Alternate sides.', imageUrl: '/exercises/bird-dog.gif', sessionType: 'morning', phase: 0 },
  { name: 'Dead Bug', sets: 3, reps: 10, duration: null, rest: 30, description: 'Lie on back, arms up, knees at 90°. Lower opposite arm and leg toward floor. Keep back flat.', imageUrl: '/exercises/dead-bug.gif', sessionType: 'morning', phase: 0 },
  { name: 'Wall Posture Hold', sets: 1, reps: 1, duration: 90, rest: 0, description: 'Stand with back against wall. Head, shoulders, and glutes touching. Hold position.', imageUrl: '/exercises/wall-posture.gif', sessionType: 'morning', phase: 0 },
  { name: 'Bodyweight Squats', sets: 1, reps: 10, duration: null, rest: 0, description: 'Feet shoulder-width apart. Sit back and down, chest up. Drive through heels to stand.', imageUrl: '/exercises/squats.gif', sessionType: 'morning', phase: 0 },
];

const PHASE1_EXERCISES = [
  { name: 'Incline Push-ups', sets: 3, reps: 10, duration: null, rest: 45, description: 'Hands on elevated surface, body straight. Lower chest to surface, push back up.', imageUrl: '/exercises/incline-pushups.gif', sessionType: 'evening', phase: 1 },
  { name: 'Bodyweight Squats', sets: 3, reps: 15, duration: null, rest: 45, description: 'Feet shoulder-width apart. Sit back and down, chest up. Drive through heels to stand.', imageUrl: '/exercises/squats.gif', sessionType: 'evening', phase: 1 },
  { name: 'Glute Bridge Hold', sets: 3, reps: 12, duration: null, rest: 45, description: 'Glute bridge with 2-second hold at top. Squeeze hard before lowering.', imageUrl: '/exercises/glute-bridge.gif', sessionType: 'evening', phase: 1 },
  { name: 'Backpack Rows', sets: 3, reps: 10, duration: null, rest: 45, description: 'Hinge at hips, pull loaded backpack to chest. Squeeze shoulder blades together.', imageUrl: '/exercises/backpack-rows.gif', sessionType: 'evening', phase: 1 },
  { name: 'Plank', sets: 3, reps: 1, duration: 30, rest: 30, description: 'Forearms and toes on ground. Body straight like a board. Engage core, breathe steady.', imageUrl: '/exercises/plank.gif', sessionType: 'evening', phase: 1 },
];

const PHASE2A_EXERCISES = [
  { name: 'Push-ups', sets: 4, reps: 12, duration: null, rest: 45, description: 'Hands shoulder-width, body straight. Lower chest to floor, push back up explosively.', imageUrl: '/exercises/pushups.gif', sessionType: 'evening', phase: 2, dayType: 'A' },
  { name: 'Pike Push-ups', sets: 4, reps: 8, duration: null, rest: 60, description: 'Hips high in inverted V. Bend elbows, lower head toward floor. Targets shoulders.', imageUrl: '/exercises/pike-pushups.gif', sessionType: 'evening', phase: 2, dayType: 'A' },
  { name: 'Backpack Rows', sets: 4, reps: 12, duration: null, rest: 45, description: 'Hinge at hips, pull loaded backpack to chest. Squeeze shoulder blades together.', imageUrl: '/exercises/backpack-rows.gif', sessionType: 'evening', phase: 2, dayType: 'A' },
  { name: 'Plank', sets: 3, reps: 1, duration: 45, rest: 30, description: 'Forearms and toes on ground. Body straight. Engage core. Hold steady.', imageUrl: '/exercises/plank.gif', sessionType: 'evening', phase: 2, dayType: 'A' },
];

const PHASE2B_EXERCISES = [
  { name: 'Squats', sets: 4, reps: 20, duration: null, rest: 45, description: 'Feet shoulder-width. Deep squat, chest up, drive through heels.', imageUrl: '/exercises/squats.gif', sessionType: 'evening', phase: 2, dayType: 'B' },
  { name: 'Bulgarian Split Squats', sets: 3, reps: 10, duration: null, rest: 60, description: 'Rear foot elevated on chair. Lunge down on front leg. 10 reps each side.', imageUrl: '/exercises/bulgarian-split.gif', sessionType: 'evening', phase: 2, dayType: 'B' },
  { name: 'Glute Bridge', sets: 3, reps: 15, duration: null, rest: 45, description: 'Lie on back, push hips up. Squeeze glutes hard at top. Controlled lower.', imageUrl: '/exercises/glute-bridge.gif', sessionType: 'evening', phase: 2, dayType: 'B' },
  { name: 'Calf Raises', sets: 3, reps: 20, duration: null, rest: 30, description: 'Stand on edge of step. Rise up on toes, hold 1 second, lower slowly.', imageUrl: '/exercises/calf-raises.gif', sessionType: 'evening', phase: 2, dayType: 'B' },
];

const PHASE3_EXERCISES = [
  { name: 'Decline Push-ups', sets: 4, reps: 12, duration: null, rest: 45, description: 'Feet elevated on chair. Lower chest to floor. Targets upper chest and shoulders.', imageUrl: '/exercises/decline-pushups.gif', sessionType: 'evening', phase: 3 },
  { name: 'Pike Push-ups', sets: 4, reps: 10, duration: null, rest: 60, description: 'Hips high in inverted V. Bend elbows, lower head toward floor. Builds boulder shoulders.', imageUrl: '/exercises/pike-pushups.gif', sessionType: 'evening', phase: 3 },
  { name: 'Backpack Rows', sets: 4, reps: 15, duration: null, rest: 45, description: 'Heavier backpack. Hinge, pull to chest, squeeze shoulder blades. Build that V-taper.', imageUrl: '/exercises/backpack-rows.gif', sessionType: 'evening', phase: 3 },
  { name: 'Squats', sets: 4, reps: 25, duration: null, rest: 45, description: 'Deep squats, high reps. Build endurance and definition in legs.', imageUrl: '/exercises/squats.gif', sessionType: 'evening', phase: 3 },
  { name: 'Lunges', sets: 3, reps: 12, duration: null, rest: 45, description: 'Step forward, lower knee to ground. Alternate legs. 12 reps each side.', imageUrl: '/exercises/lunges.gif', sessionType: 'evening', phase: 3 },
  { name: 'Plank', sets: 1, reps: 1, duration: 60, rest: 30, description: 'Full minute plank. Core tight, body straight. Mental toughness time.', imageUrl: '/exercises/plank.gif', sessionType: 'evening', phase: 3 },
  { name: 'Side Plank', sets: 2, reps: 1, duration: 30, rest: 20, description: 'On side, forearm down. Hips up, body straight. 30 seconds each side.', imageUrl: '/exercises/side-plank.gif', sessionType: 'evening', phase: 3 },
];

const PHASE3_FINISHER = [
  { name: 'Jump Squats', sets: 3, reps: 12, duration: null, rest: 15, description: 'Squat down, explode up. Land soft. This is your finisher — give everything.', imageUrl: '/exercises/jump-squats.gif', sessionType: 'evening', phase: 3, isFinisher: true },
  { name: 'Mountain Climbers', sets: 3, reps: 25, duration: null, rest: 15, description: 'Plank position, drive knees to chest alternately. Fast pace. Burn the fat.', imageUrl: '/exercises/mountain-climbers.gif', sessionType: 'evening', phase: 3, isFinisher: true },
  { name: 'Push-ups', sets: 3, reps: 10, duration: null, rest: 15, description: 'Final push-ups. Doesn\'t matter if you\'re tired. Finish strong.', imageUrl: '/exercises/pushups.gif', sessionType: 'evening', phase: 3, isFinisher: true },
];

export function getPhase(day) {
  if (day <= 14) return 1;
  if (day <= 40) return 2;
  return 3;
}

export function getPhaseInfo(phase) {
  const phases = {
    1: { name: 'Activation + Base', description: 'Learn form. Wake muscles. Build consistency.', days: '1–14', color: '#4ecdc4' },
    2: { name: 'Strength Building', description: 'Build strength + stability. Start building visible muscle.', days: '15–40', color: '#ff6b6b' },
    3: { name: 'Shape + Intensity', description: 'Push aesthetics. Shoulder width. Athletic look.', days: '41–60', color: '#ffd93d' },
  };
  return phases[phase];
}

export function getEveningExercises(day) {
  const phase = getPhase(day);
  if (phase === 1) return PHASE1_EXERCISES;
  if (phase === 2) {
    // Alternate A/B days
    return day % 2 === 1 ? PHASE2A_EXERCISES : PHASE2B_EXERCISES;
  }
  return [...PHASE3_EXERCISES, ...PHASE3_FINISHER];
}

export function getMorningExercises() {
  return MORNING_EXERCISES;
}

export async function seedDatabase() {
  const count = await db.settings.count();
  if (count > 0) return; // Already seeded

  const allExercises = [
    ...MORNING_EXERCISES,
    ...PHASE1_EXERCISES,
    ...PHASE2A_EXERCISES,
    ...PHASE2B_EXERCISES,
    ...PHASE3_EXERCISES,
    ...PHASE3_FINISHER,
  ];

  // Deduplicate by name + sessionType + phase
  const unique = [];
  const seen = new Set();
  for (const ex of allExercises) {
    const key = `${ex.name}-${ex.sessionType}-${ex.phase}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(ex);
    }
  }

  await db.exercises.bulkAdd(unique);

  await db.plans.add({
    name: '60-Day Transformation',
    duration: 60,
    phases: [
      { phase: 1, name: 'Activation + Base', startDay: 1, endDay: 14 },
      { phase: 2, name: 'Strength Building', startDay: 15, endDay: 40 },
      { phase: 3, name: 'Shape + Intensity', startDay: 41, endDay: 60 },
    ],
    createdAt: new Date().toISOString(),
  });

  await db.settings.put({ key: 'startDate', value: new Date().toISOString().split('T')[0] });
  await db.settings.put({ key: 'seeded', value: true });
}
