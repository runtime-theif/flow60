const MOTIVATIONAL_QUOTES = [
  "Every rep is a vote for the person you want to become.",
  "You don't have to be great to start. But you have to start to be great.",
  "The pain you feel today is the strength you feel tomorrow.",
  "Discipline is choosing between what you want now and what you want most.",
  "Small daily improvements are the key to staggering long-term results.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The only bad workout is the one that didn't happen.",
  "Progress, not perfection.",
  "You're not tired. You're uninspired. Let's fix that.",
  "60 days. That's all that stands between you and a different life.",
  "Consistency beats intensity. Show up.",
  "You showed up. That's already a win.",
  "Your future self will thank you for this.",
  "Push through. The magic happens when you don't quit.",
  "One more rep. One more day. One more step.",
];

const ENCOURAGEMENTS = [
  "Great work! Keep it up!",
  "You're crushing it!",
  "That's the spirit!",
  "Unstoppable!",
  "Feel the burn. Love the burn.",
  "Nice form! Keep pushing!",
  "Halfway there. Don't stop now!",
  "Almost done. Finish strong!",
  "You're stronger than yesterday!",
  "Let's go! Next one!",
];

export function getMotivationalQuote() {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

export function getEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getDayNumber(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(diff + 1, 60));
}

export function calculateStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;

  const sorted = [...sessions]
    .filter(s => s.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const sessionDate = new Date(sorted[i].date);
    sessionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else if (i === 0 && sessionDate.getTime() === expectedDate.getTime() - 86400000) {
      // Allow yesterday as start
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getWeeklyConsistency(sessions) {
  const weeks = {};
  const completed = (sessions || []).filter(s => s.completed);

  completed.forEach(s => {
    const date = new Date(s.date);
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().split('T')[0];
    weeks[key] = (weeks[key] || 0) + 1;
  });

  return weeks;
}

export function getCompletionPercentage(completedDays, totalDays = 60) {
  return Math.round((completedDays / totalDays) * 100);
}

export function getInsight(sessions, moods) {
  const insights = [];
  const completedSessions = (sessions || []).filter(s => s.completed);
  const totalSessions = sessions?.length || 0;

  if (completedSessions.length === 0) {
    return "Ready to start your transformation? Your first session awaits.";
  }

  const recentSessions = completedSessions.slice(-7);
  const skipped = 7 - recentSessions.length;

  if (skipped > 3) {
    insights.push(`You skipped ${skipped} days this week. Consistency is your bottleneck.`);
  } else if (skipped === 0) {
    insights.push("Perfect week! Your consistency is building real momentum.");
  }

  if (moods && moods.length >= 3) {
    const recentMoods = moods.slice(-3);
    const avgEnergy = recentMoods.reduce((a, m) => a + m.energy, 0) / recentMoods.length;
    if (avgEnergy < 3) {
      insights.push("Low energy pattern detected. Try sleeping earlier tonight.");
    }
  }

  const pct = getCompletionPercentage(completedSessions.length);
  if (pct > 0) {
    insights.push(`You're ${pct}% through your transformation.`);
  }

  return insights[Math.floor(Math.random() * insights.length)] || getMotivationalQuote();
}
