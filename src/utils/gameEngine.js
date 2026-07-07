// src/utils/gameEngine.js

// ---------- INITIAL STATE ----------
export const INITIAL_STATE = {
  knowledge: 50,
  money: 200,
  health: 80,
  energy: 70,
  happiness: 60,
  day: 1,
  week: 1,
  semesterProgress: 0,
  inventory: [],
  achievements: [],
  currentAction: null,
  gameOver: false,
  gameOverMessage: '',
  graduated: false,
  actionUsedToday: false,
  // tracking for achievements
  stats: {
    timesRead: 0,
    totalEarned: 0,
    classesAttended: 0,
  },
};

// ---------- ACTION EFFECTS ----------
export const ACTIONS = {
  library: { knowledge: 12, energy: -8, happiness: -2 },
  class: { knowledge: 8, energy: -6 },
  studygroup: { knowledge: 10, happiness: 5, energy: -5 },
  sidehustle: { money: 150, energy: -15, knowledge: -2 },
  cook: { money: -30, health: 8, energy: 4 },
  read: { knowledge: 6, energy: -3 },
  exercise: { health: 12, energy: -8, happiness: 3 },
  rest: { energy: 20, health: 5 },
  relax: { happiness: 12, knowledge: -2, energy: 5 },
};

// ---------- CLAMP ----------
export const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

// ---------- APPLY ACTION ----------
export function applyAction(state, actionId) {
  const effects = ACTIONS[actionId];
  if (!effects || state.actionUsedToday) return state;

  const newState = { ...state };
  newState.knowledge = clamp((newState.knowledge || 0) + (effects.knowledge || 0));
  newState.money = clamp((newState.money || 0) + (effects.money || 0), 0, Infinity);
  newState.health = clamp((newState.health || 0) + (effects.health || 0));
  newState.energy = clamp((newState.energy || 0) + (effects.energy || 0));
  newState.happiness = clamp((newState.happiness || 0) + (effects.happiness || 0));

  newState.actionUsedToday = true;
  newState.currentAction = actionId;

  // Update tracking stats for achievements
  if (actionId === 'read') newState.stats.timesRead += 1;
  if (actionId === 'sidehustle') newState.stats.totalEarned += effects.money || 0;
  if (actionId === 'class') newState.stats.classesAttended += 1;

  return newState;
}

// ---------- NEXT DAY ----------
export function nextDay(state) {
  const newState = { ...state, actionUsedToday: false, currentAction: null };
  newState.day += 1;
  newState.semesterProgress = Math.round((newState.day + (newState.week - 1) * 7) / (16 * 7) * 100);

  // Week progression
  if (newState.day > 7) {
    newState.week += 1;
    newState.day = 1;
  }

  // Losing conditions
  if (newState.health <= 0 || newState.energy <= 0) {
    newState.gameOver = true;
    newState.gameOverMessage = newState.health <= 0 ? 'Your health has depleted. Game Over.' : 'You are exhausted. Game Over.';
  }

  // Winning condition
  if (newState.week > 16) {
    newState.graduated = true;
  }

  return newState;
}

// ---------- ACHIEVEMENTS ----------
export const ACHIEVEMENTS = {
  bookworm: { name: '📚 Bookworm', desc: 'Read 10 times', check: (s) => s.stats.timesRead >= 10 },
  hustler: { name: '💼 Hustler', desc: 'Earn M1000 total', check: (s) => s.stats.totalEarned >= 1000 },
  attendance: { name: '🏫 Perfect Attendance', desc: 'Attend class 15 times', check: (s) => s.stats.classesAttended >= 15 },
  balanced: { name: '😴 Balanced Life', desc: 'Keep every stat above 60', check: (s) => s.knowledge >= 60 && s.money >= 60 && s.health >= 60 && s.energy >= 60 && s.happiness >= 60 },
};

export function checkAchievements(state) {
  const unlocked = [];
  Object.entries(ACHIEVEMENTS).forEach(([key, ach]) => {
    if (!state.achievements.includes(key) && ach.check(state)) {
      unlocked.push(key);
    }
  });
  if (unlocked.length > 0) {
    return { ...state, achievements: [...state.achievements, ...unlocked], newAchievements: unlocked };
  }
  return { ...state, newAchievements: [] };
}

// ---------- SAVE / LOAD ----------
const SAVE_KEY = 'lesah_life_save';
export function saveGame(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return null;
}
export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}