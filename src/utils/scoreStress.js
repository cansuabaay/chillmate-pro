/**
 * ChillMate Lite — stress estimation (demo only, not medical advice).
 * Each factor produces a 0–100 "stress contribution" from deviation vs baseline (where baseline exists).
 * Weighted sum → normalized score 0–100.
 */

export const ACTIVITY_SCALE = {
  sedentary: 1,
  light: 2,
  moderate: 3,
  active: 4,
  very_active: 5,
}

export const MOOD_TO_NUMBER = {
  happy: 5,
  neutral: 3,
  anxious: 2,
  overwhelmed: 1,
}

const LABELS = {
  activity: {
    sedentary: 'Mostly sitting',
    light: 'Light activity',
    moderate: 'Moderate activity',
    active: 'Active most days',
    very_active: 'Very active',
  },
}

/** Weights: HR & sleep high; movement & screen medium; caffeine low; mood medium */
const W = {
  heart: 0.26,
  sleep: 0.26,
  movement: 0.14,
  screen: 0.14,
  caffeine: 0.08,
  mood: 0.12,
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

/** 0–100 stress from HR vs personal resting baseline */
function factorHeart(rest, cur) {
  const r = Number(rest)
  const c = Number(cur)
  if (Number.isNaN(r) || Number.isNaN(c)) return 0
  const diff = c - r
  if (diff <= 0) return clamp(8 - diff * 0.4, 0, 20)
  return clamp((diff / 32) * 100, 0, 100)
}

/** 0–100 stress from sleep vs personal average */
function factorSleep(baseH, todayH) {
  const b = Number(baseH)
  const t = Number(todayH)
  if (Number.isNaN(b) || Number.isNaN(t)) return 0
  const deficit = b - t
  if (deficit <= 0) return 6
  return clamp(deficit * 24, 0, 100)
}

/** 0–100 stress when today movement is below usual level */
function factorMovement(usualKey, todayKey) {
  const u = ACTIVITY_SCALE[usualKey] ?? 3
  const t = ACTIVITY_SCALE[todayKey] ?? 3
  const gap = u - t
  if (gap <= 0) return 8
  return clamp(gap * 26, 0, 100)
}

/** No screen baseline — stress from hours (implicit “heavy day” curve) */
function factorScreen(hours) {
  const h = Number(hours)
  if (Number.isNaN(h)) return 0
  return clamp(h * 11, 0, 100)
}

function factorCaffeine(cups) {
  const c = Number(cups)
  if (Number.isNaN(c)) return 0
  return clamp(c * 18, 0, 100)
}

function factorMood(moodKey) {
  const m = MOOD_TO_NUMBER[moodKey]
  if (m == null) return 0
  return ((5 - m) / 4) * 100
}

/**
 * One clear sentence: what mattered most (or that things look calm).
 */
function buildTodaysInsight(weighted, score, baseline, today) {
  const top = weighted[0]
  const second = weighted[1]

  if (score <= 30) {
    return "Compared with your baseline, today's numbers look fairly calm—nothing jumped out as a heavy stress driver."
  }

  if (!top || top.impact < 5) {
    return 'Several small signals added up today rather than one single standout.'
  }

  const k = top.key
  const rest = Number(baseline.restingHr)
  const cur = Number(today.currentHr)
  const bSleep = Number(baseline.sleepAvg)
  const tSleep = Number(today.sleepHours)

  if (k === 'heart' && cur > rest) {
    return `Your pulse is above your usual resting ${rest} bpm—that's the strongest lift in your score today.`
  }
  if (k === 'sleep' && bSleep > tSleep) {
    const d = (bSleep - tSleep).toFixed(1)
    return `You're about ${d} hours under your own sleep average—that's pulling the score up more than anything else.`
  }
  if (k === 'movement') {
    return "You moved less than your typical level today—that gap is the main story behind your number."
  }
  if (k === 'screen') {
    const h = Number(today.screenTime)
    return `Screen time around ${h} hours is weighing on today's snapshot more than your other inputs.`
  }
  if (k === 'caffeine') {
    const c = Number(today.caffeine)
    return `With ${c} caffeinated servings logged, caffeine is the biggest contributor in the mix today.`
  }
  if (k === 'mood') {
    if (today.mood === 'overwhelmed') {
      return "The mood you picked—overwhelmed—is doing the most work in today's score."
    }
    if (today.mood === 'anxious') {
      return "An anxious mood is the clearest signal in your score compared with your other entries."
    }
    return 'How you rated your mood is driving more of this score than your other inputs today.'
  }

  if (second && second.impact > top.impact * 0.65) {
    return `Two things are neck and neck: ${labelForKey(top.key)} and ${labelForKey(second.key)}.`
  }
  return `${labelForKey(k)} is the main factor shaping today's score.`
}

function labelForKey(key) {
  const map = {
    heart: 'Heart rate vs your baseline',
    sleep: 'Sleep vs your average',
    movement: 'Movement vs usual',
    screen: 'Screen time',
    caffeine: 'Caffeine',
    mood: 'Mood',
  }
  return map[key] || key
}

/**
 * 3–5 bullets, ordered by impact (weighted), each comparing today vs baseline where we can.
 */
function buildExplanationBullets(baseline, today, weighted) {
  const lineFor = {
    heart: () => {
      const rest = Number(baseline.restingHr)
      const cur = Number(today.currentHr)
      if (Number.isNaN(rest) || Number.isNaN(cur)) return null
      if (cur > rest)
        return `Heart rate: ${cur} bpm vs your resting baseline ${rest} bpm (${Math.round(cur - rest)} above usual).`
      if (cur < rest)
        return `Heart rate: ${cur} bpm is below your baseline ${rest} bpm—a calmer signal than usual.`
      return `Heart rate: ${cur} bpm matches your resting baseline.`
    },
    sleep: () => {
      const b = Number(baseline.sleepAvg)
      const t = Number(today.sleepHours)
      if (Number.isNaN(b) || Number.isNaN(t)) return null
      if (t < b) return `Sleep: ${t}h last night vs your usual ${b}h—you're short on rest.`
      if (t > b) return `Sleep: ${t}h last night, above your usual ${b}h.`
      return `Sleep: ${t}h—right on your personal average.`
    },
    movement: () => {
      const u = ACTIVITY_SCALE[baseline.activityLevel] ?? 3
      const t = ACTIVITY_SCALE[today.movement] ?? 3
      if (u > t)
        return `Movement: below your usual (${LABELS.activity[baseline.activityLevel] || 'your baseline'}).`
      if (t > u) return `Movement: above your typical day—nice extra activity.`
      return `Movement: matches your usual level.`
    },
    screen: () => {
      const h = Number(today.screenTime)
      if (Number.isNaN(h)) return null
      return `Screen time: ~${h}h today${h > 4 ? ' (a heavier day for many people)' : ' (moderate)'}.`
    },
    caffeine: () => {
      const c = Number(today.caffeine)
      if (Number.isNaN(c)) return null
      return `Caffeine: ${c} serving(s) logged${c >= 2 ? '—noticeable if you want a calmer evening' : '—fairly light'}.`
    },
    mood: () => {
      const moodLabel = { happy: 'Happy', neutral: 'Neutral', anxious: 'Anxious', overwhelmed: 'Overwhelmed' }
      return `Mood: ${moodLabel[today.mood] || today.mood}—how you're feeling right now.`
    },
  }

  const out = []
  const seen = new Set()
  for (const row of weighted) {
    if (out.length >= 5) break
    const fn = lineFor[row.key]
    const line = fn ? fn() : null
    if (line && !seen.has(line)) {
      seen.add(line)
      out.push(line)
    }
  }
  return out
}

function buildPartNotesForFactors(baseline, today) {
  const rest = Number(baseline.restingHr)
  const cur = Number(today.currentHr)
  let heartNote = null
  if (!Number.isNaN(rest) && !Number.isNaN(cur)) {
    heartNote =
      cur > rest
        ? `Pulse is ${Math.round(cur - rest)} bpm above your resting baseline.`
        : 'Pulse is at or below your usual resting level.'
  }

  const b = Number(baseline.sleepAvg)
  const t = Number(today.sleepHours)
  let sleepNote = null
  if (!Number.isNaN(b) && !Number.isNaN(t)) {
    sleepNote =
      b > t
        ? `About ${(b - t).toFixed(1)}h less sleep than your average.`
        : 'Sleep is at or above your usual amount.'
  }

  const usual = ACTIVITY_SCALE[baseline.activityLevel] ?? 3
  const mov = ACTIVITY_SCALE[today.movement] ?? 3
  const movNote =
    usual > mov
      ? 'Less movement than your typical day.'
      : mov > usual
        ? 'More movement than usual for you.'
        : 'Movement matches your usual level.'

  const h = Number(today.screenTime)
  const screenNote = !Number.isNaN(h) ? `Roughly ${h} hours on screens today.` : null

  const caf = Number(today.caffeine)
  const cafNote = !Number.isNaN(caf) ? `${caf} caffeinated drink(s) logged.` : null

  const moodNote =
    today.mood === 'happy'
      ? 'Mood feels positive.'
      : today.mood === 'neutral'
        ? 'Mood is neutral.'
        : today.mood === 'anxious'
          ? 'Mood leans anxious.'
          : today.mood === 'overwhelmed'
            ? 'Mood feels overwhelmed.'
            : null

  return { heartNote, sleepNote, movNote, screenNote, cafNote, moodNote }
}

/**
 * Targeted tips (2–3) tied to the strongest factors—no generic filler when avoidable.
 */
const REC_TEXT = {
  heart:
    'Try two minutes of slow breathing: inhale four counts, exhale six—to ease a raised pulse.',
  sleep:
    'Give yourself a simpler evening: dim lights earlier and aim closer to your usual sleep hours tonight.',
  movement: 'Add one short walk or stretch block—even ten minutes breaks up a still day.',
  screen: 'Try a screen-free window before bed or between long work blocks so your eyes and mind get a real pause.',
  caffeine: 'Shift caffeine earlier or swap one drink for water or herbal tea—especially if sleep was short.',
  mood: 'Name one small win from today, or message someone you trust—connection often softens a heavy mood.',
}

function buildRecommendations(weighted) {
  const out = []
  const push = (key) => {
    const text = REC_TEXT[key]
    if (text && !out.includes(text)) out.push(text)
  }

  for (const row of weighted) {
    if (out.length >= 3) break
    if (row.impact < 3) continue
    push(row.key)
  }
  if (out.length < 2) {
    for (const row of weighted) {
      if (out.length >= 3) break
      push(row.key)
    }
  }
  if (out.length === 0) {
    push('movement')
    push('mood')
  }
  return out.slice(0, 3)
}

export function computeStressResult(baseline, today) {
  const heart = factorHeart(baseline.restingHr, today.currentHr)
  const sleep = factorSleep(baseline.sleepAvg, today.sleepHours)
  const movement = factorMovement(baseline.activityLevel, today.movement)
  const screen = factorScreen(today.screenTime)
  const caffeine = factorCaffeine(today.caffeine)
  const mood = factorMood(today.mood)

  const rawScore =
    heart * W.heart +
    sleep * W.sleep +
    movement * W.movement +
    screen * W.screen +
    caffeine * W.caffeine +
    mood * W.mood

  const score = Math.round(clamp(rawScore, 0, 100))

  let category = 'Low'
  if (score >= 70) category = 'High'
  else if (score >= 40) category = 'Medium'

  const weighted = [
    { key: 'heart', w: W.heart, value: heart },
    { key: 'sleep', w: W.sleep, value: sleep },
    { key: 'movement', w: W.movement, value: movement },
    { key: 'screen', w: W.screen, value: screen },
    { key: 'caffeine', w: W.caffeine, value: caffeine },
    { key: 'mood', w: W.mood, value: mood },
  ]
    .map((x) => ({ ...x, impact: x.value * x.w }))
    .sort((a, b) => b.impact - a.impact)

  let explanationBullets = buildExplanationBullets(baseline, today, weighted)

  if (explanationBullets.length < 3) {
    const extras = buildPartNotesForFactors(baseline, today)
    const fill = [extras.heartNote, extras.sleepNote, extras.movNote, extras.screenNote, extras.cafNote, extras.moodNote].filter(
      Boolean
    )
    for (const f of fill) {
      if (explanationBullets.length >= 5) break
      if (!explanationBullets.includes(f)) explanationBullets.push(f)
    }
  }

  explanationBullets = explanationBullets.slice(0, 5)

  const todaysInsight = buildTodaysInsight(weighted, score, baseline, today)
  const recommendations = buildRecommendations(weighted)

  return {
    score,
    category,
    todaysInsight,
    explanationBullets,
    recommendations,
    exportedAt: new Date().toISOString(),
  }
}
