/**
 * localStorage helpers — all ChillMate Pro data stays on this device.
 */

const KEYS = {
  profile: 'chillmate_pro_profile',
  baseline: 'chillmate_pro_baseline',
  history: 'chillmate_pro_history',
}

function safeParse(json, fallback) {
  try {
    return json ? JSON.parse(json) : fallback
  } catch {
    return fallback
  }
}

export function loadProfile() {
  return safeParse(localStorage.getItem(KEYS.profile), null)
}

export function saveProfile(profile) {
  if (profile) localStorage.setItem(KEYS.profile, JSON.stringify(profile))
  else localStorage.removeItem(KEYS.profile)
}

export function loadBaseline() {
  return safeParse(localStorage.getItem(KEYS.baseline), null)
}

export function saveBaseline(baseline) {
  if (baseline) localStorage.setItem(KEYS.baseline, JSON.stringify(baseline))
  else localStorage.removeItem(KEYS.baseline)
}

export function loadHistory() {
  const raw = safeParse(localStorage.getItem(KEYS.history), [])
  return Array.isArray(raw) ? raw : []
}

export function saveHistory(entries) {
  localStorage.setItem(KEYS.history, JSON.stringify(entries.slice(0, 200)))
}

export const defaultProfile = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  weight: '',
  height: '',
  occupation: '',
  exerciseFreq: '',
  smoking: '',
  caffeineHabit: '',
  sleepQuality: '',
}

export const defaultBaseline = {
  restingHr: '',
  sleepAvg: '',
  activityLevel: 'moderate',
  avgScreenTime: '',
  avgCaffeine: '',
  stressTendency: '',
  usualMood: 'neutral',
}

export const defaultToday = {
  currentHr: '',
  sleepHours: '',
  movement: 'moderate',
  screenTime: '',
  caffeine: '',
  mood: 'neutral',
  deadline: 'no',
  socialEnergy: 'medium',
  exercisedToday: 'no',
}
