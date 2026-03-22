/**
 * ChillMate Pro — explainable stress model (demo, not medical).
 * Combines profile context, personal baseline, and today's check.
 */

export const ACTIVITY_SCALE = {
  sedentary: 1,
  light: 2,
  moderate: 3,
  active: 4,
  very_active: 5,
}

const ACTIVITY_ORDER = ['sedentary', 'light', 'moderate', 'active', 'very_active']

export const MOOD_TO_NUMBER = {
  happy: 5,
  neutral: 3,
  anxious: 2,
  overwhelmed: 1,
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

/** Core weights (heart + sleep high; movement + screen medium; caffeine lower; mood medium) */
const W = {
  heart: 0.24,
  sleep: 0.24,
  movement: 0.14,
  screen: 0.14,
  caffeine: 0.08,
  mood: 0.12,
  context: 0.04,
}

function factorHeart(rest, cur) {
  const r = Number(rest)
  const c = Number(cur)
  if (Number.isNaN(r) || Number.isNaN(c)) return 0
  const diff = c - r
  if (diff <= 0) return clamp(6 - diff * 0.35, 0, 18)
  return clamp((diff / 30) * 100, 0, 100)
}

function factorSleep(baseH, todayH) {
  const b = Number(baseH)
  const t = Number(todayH)
  if (Number.isNaN(b) || Number.isNaN(t)) return 0
  const deficit = b - t
  if (deficit <= 0) return 5
  return clamp(deficit * 22, 0, 100)
}

function factorMovement(usualKey, todayKey, exercisedToday) {
  const u = ACTIVITY_SCALE[usualKey] ?? 3
  let t = ACTIVITY_SCALE[todayKey] ?? 3
  if (exercisedToday === 'yes') t = Math.min(5, t + 0.5)
  const gap = u - t
  if (gap <= 0) return 6
  return clamp(gap * 24, 0, 100)
}

/** Today vs your usual screen baseline */
function factorScreen(todayH, baseH) {
  const t = Number(todayH)
  if (Number.isNaN(t)) return 0
  const b = Number(baseH)
  if (Number.isNaN(b) || b < 0) return clamp(t * 10, 0, 100)
  const diff = t - b
  if (diff <= 0) return clamp(8 - diff * 3, 0, 25)
  return clamp(15 + diff * 14, 0, 100)
}

/** Today vs usual caffeine baseline */
function factorCaffeine(todayC, baseC) {
  const t = Number(todayC)
  if (Number.isNaN(t)) return 0
  const b = Number(baseC)
  if (Number.isNaN(b) || b < 0) return clamp(t * 16, 0, 100)
  const diff = t - b
  if (diff <= 0) return clamp(6 - diff * 4, 0, 20)
  return clamp(diff * 22 + 8, 0, 100)
}

function factorMood(moodKey) {
  const m = MOOD_TO_NUMBER[moodKey]
  if (m == null) return 0
  return ((5 - m) / 4) * 100
}

/** Deadline, social energy, profile tendencies — small layered signal */
function factorContext(profile, baseline, today) {
  let v = 0
  if (today.deadline === 'yes') v += 28
  if (today.socialEnergy === 'low') v += 12
  if (today.socialEnergy === 'drained') v += 22
  if (profile?.sleepQuality === 'poor' || profile?.sleepQuality === 'fair') v += 10
  if (profile?.smoking === 'yes') v += 8
  if (baseline?.stressTendency === 'often' || profile?.occupation === 'high_stress') v += 10
  return clamp(v, 0, 100)
}

function profileSleepMultiplier(profile) {
  if (profile?.sleepQuality === 'poor') return 1.08
  if (profile?.sleepQuality === 'fair') return 1.04
  return 1
}

/**
 * Confidence from how complete the picture is.
 */
function buildConfidence(profile, baseline, today) {
  let score = 0
  if (profile?.firstName && profile?.lastName && profile?.age) score += 3
  if (profile?.sleepQuality) score += 1
  if (profile?.exerciseFreq) score += 1
  if (baseline?.restingHr && baseline?.sleepAvg) score += 2
  if (baseline?.avgScreenTime !== '' && baseline?.avgCaffeine !== '') score += 2
  if (baseline?.stressTendency) score += 1
  if (baseline?.usualMood) score += 1
  if (today?.currentHr && today?.sleepHours !== '') score += 2
  if (today?.deadline && today?.socialEnergy) score += 1

  let label = 'Moderate confidence'
  let note =
    'We used what you shared. Adding more profile and baseline detail would make this estimate steadier.'
  if (score >= 9) {
    label = 'Stable estimate'
    note =
      'You gave a solid mix of profile, baseline, and today’s check—this snapshot has a strong foundation.'
  } else if (score <= 4) {
    label = 'Low confidence'
    note =
      'Several fields were light today. Treat this as a rough sketch—fill in profile and baseline when you can.'
  }
  return { label, note, score }
}

function classifyPattern(weighted) {
  const m = Object.fromEntries(weighted.map((w) => [w.key, w.impact]))
  const sleep = m.sleep || 0
  const physio = (m.heart || 0) * 1.1 + (m.mood || 0) * 0.9
  const beh = (m.screen || 0) + (m.movement || 0) + (m.caffeine || 0)
  const vals = [
    { name: 'Sleep-driven', v: sleep },
    { name: 'Physiological', v: physio },
    { name: 'Behavioral', v: beh },
  ].sort((a, b) => b.v - a.v)
  const top = vals[0].v
  const second = vals[1].v
  if (top < 4) return 'Mixed'
  if (top - second < top * 0.2) return 'Mixed'
  return vals[0].name
}

const REC_TEXT = {
  heart: 'Try a 3-minute breathing reset: inhale four counts, exhale six—to ease a raised pulse.',
  sleep: 'Prioritize recovery tonight: dim lights early and aim closer to your usual sleep window.',
  movement: 'Add a light walk or gentle stretch—even ten minutes softens a still day.',
  screen: 'Take a short digital break: eyes off the screen for 20 minutes before bed or between blocks.',
  caffeine: 'Ease caffeine after midday or swap one drink for water—especially if sleep was short.',
  mood: 'Name one small win today, or reach out to someone you trust—connection helps carry heavy moods.',
  context: 'If a deadline is looming, block 15 minutes for a single focused task—small wins lower the noise.',
}

function buildRecommendations(weighted, pattern) {
  const out = []
  const push = (key) => {
    const t = REC_TEXT[key]
    if (t && !out.includes(t)) out.push(t)
  }

  for (const row of weighted) {
    if (out.length >= 4) break
    if (row.impact < 2.5) continue
    push(row.key)
  }
  if (pattern === 'Sleep-driven') push('sleep')
  if (pattern === 'Behavioral') push('screen')
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
  return out.slice(0, 4)
}

function buildInsight(weighted, score, profile, baseline, today, pattern) {
  const name = profile?.firstName?.trim()
  const prefix = name ? `${name}, ` : ''
  const top = weighted[0]
  const second = weighted[1]

  if (score <= 28) {
    return `${prefix}Compared with your baseline, today looks fairly calm—no single driver dominated.`
  }

  if (pattern === 'Sleep-driven') {
    return `${prefix}Your stress appears to be mainly sleep-driven today.`
  }
  if (pattern === 'Physiological') {
    return `${prefix}Your score leans physiological—pulse and how you feel are doing more of the talking.`
  }
  if (pattern === 'Behavioral') {
    return `${prefix}Behavioral signals (screens, movement, caffeine) are shaping most of today's number.`
  }

  if (second && second.impact > (top?.impact || 0) * 0.72) {
    return `${prefix}Your score is influenced by both ${labelKey(top.key)} and ${labelKey(second.key)}.`
  }

  if (top?.key === 'heart') return `${prefix}Elevated heart rate vs your resting baseline is the headline today.`
  if (top?.key === 'sleep') return `${prefix}Less sleep than your usual average is pulling the score up the most.`
  if (top?.key === 'screen') return `${prefix}Screen time compared with your normal day is standing out.`
  if (top?.key === 'mood') return `${prefix}Your current mood suggests emotional load is central today.`

  return `${prefix}Your profile and today's inputs suggest a moderate stress response pattern.`
}

function labelKey(k) {
  const map = {
    heart: 'heart rate',
    sleep: 'sleep',
    movement: 'movement',
    screen: 'screen time',
    caffeine: 'caffeine',
    mood: 'mood',
    context: 'daily context',
  }
  return map[k] || k
}

function buildBullets(baseline, today, weighted) {
  const lineFor = {
    heart: () => {
      const r = Number(baseline.restingHr)
      const c = Number(today.currentHr)
      if (Number.isNaN(r) || Number.isNaN(c)) return null
      if (c > r) return `Your heart rate is above your resting baseline (${c} vs ${r} bpm).`
      if (c < r) return `Your heart rate is below your usual resting baseline—a calmer signal.`
      return `Your heart rate matches your resting baseline.`
    },
    sleep: () => {
      const bs = Number(baseline.sleepAvg)
      const ts = Number(today.sleepHours)
      if (Number.isNaN(bs) || Number.isNaN(ts)) return null
      if (ts < bs) return `Your sleep duration is lower than your usual average (${ts}h vs ${bs}h).`
      if (ts > bs) return `You slept longer than your typical average.`
      return `Sleep landed on your personal average (${ts}h).`
    },
    movement: () => {
      const u = ACTIVITY_SCALE[baseline.activityLevel] ?? 3
      const t = ACTIVITY_SCALE[today.movement] ?? 3
      if (u > t) return `Movement today is below your usual daily activity level.`
      if (t > u) return `You're moving more than your typical baseline today.`
      return `Movement is in line with your usual pattern.`
    },
    screen: () => {
      const bsc = Number(baseline.avgScreenTime)
      const tsc = Number(today.screenTime)
      if (Number.isNaN(tsc)) return null
      if (!Number.isNaN(bsc) && tsc > bsc + 0.5)
        return `Screen time is higher than your normal (${tsc}h vs usual ~${bsc}h).`
      if (!Number.isNaN(bsc) && tsc < bsc - 0.5) return `You're under your usual screen time today.`
      return `Screen time today: about ${tsc} hours.`
    },
    caffeine: () => {
      const bc = Number(baseline.avgCaffeine)
      const tc = Number(today.caffeine)
      if (Number.isNaN(tc)) return null
      if (!Number.isNaN(bc) && tc > bc) return `Caffeine today is above your usual intake.`
      return `Caffeine logged: ${tc} serving(s).`
    },
    mood: () => {
      if (today.mood === 'overwhelmed' || today.mood === 'anxious') {
        return `Your current mood suggests emotional overload.`
      }
      const moodW = { happy: 'positive', neutral: 'neutral' }
      return `Mood today reads as ${moodW[today.mood] || 'noted'}.`
    },
    context: () => {
      if (today.deadline === 'yes') return `You flagged a deadline today—that context adds weight in the model.`
      return null
    },
  }

  const out = []
  const seen = new Set()
  for (const w of weighted) {
    if (out.length >= 5) break
    const fn = lineFor[w.key]
    const line = fn ? fn() : null
    if (line && !seen.has(line)) {
      seen.add(line)
      out.push(line)
    }
  }
  return out
}

function innerCompute(profile, baseline, today) {
  let sleepV = factorSleep(baseline.sleepAvg, today.sleepHours) * profileSleepMultiplier(profile || {})
  const heart = factorHeart(baseline.restingHr, today.currentHr)
  const movement = factorMovement(baseline.activityLevel, today.movement, today.exercisedToday)
  const screen = factorScreen(today.screenTime, baseline.avgScreenTime)
  const caffeine = factorCaffeine(today.caffeine, baseline.avgCaffeine)
  const mood = factorMood(today.mood)
  const context = factorContext(profile || {}, baseline || {}, today)

  const raw =
    heart * W.heart +
    sleepV * W.sleep +
    movement * W.movement +
    screen * W.screen +
    caffeine * W.caffeine +
    mood * W.mood +
    context * W.context

  const score = Math.round(clamp(raw, 0, 100))
  let category = 'Low'
  if (score >= 70) category = 'High'
  else if (score >= 40) category = 'Medium'

  const weighted = [
    { key: 'heart', w: W.heart, value: heart },
    { key: 'sleep', w: W.sleep, value: sleepV },
    { key: 'movement', w: W.movement, value: movement },
    { key: 'screen', w: W.screen, value: screen },
    { key: 'caffeine', w: W.caffeine, value: caffeine },
    { key: 'mood', w: W.mood, value: mood },
    { key: 'context', w: W.context, value: context },
  ]
    .map((x) => ({ ...x, impact: x.value * x.w }))
    .sort((a, b) => b.impact - a.impact)

  const pattern = classifyPattern(weighted.filter((x) => x.key !== 'context'))
  const dominantFactorKey = weighted[0]?.key === 'context' ? weighted[1]?.key : weighted[0]?.key

  return {
    score,
    category,
    weighted,
    pattern,
    dominantFactorKey,
    factors: { heart, sleep: sleepV, movement, screen, caffeine, mood, context },
  }
}

export function computeFullResult(profile, baseline, today) {
  const core = innerCompute(profile, baseline, today)
  const conf = buildConfidence(profile, baseline, today)
  const confidenceLabel = conf.label
  const confidenceNote = conf.note

  const recommendations = buildRecommendations(core.weighted, core.pattern)
  const todaysInsight = buildInsight(core.weighted, core.score, profile, baseline, today, core.pattern)
  const explanationBullets = buildBullets(baseline, today, core.weighted)

  return {
    score: core.score,
    category: core.category,
    todaysInsight,
    explanationBullets,
    recommendations,
    stressPattern: core.pattern,
    dominantFactorKey: core.dominantFactorKey,
    confidenceLabel,
    confidenceNote,
    exportedAt: new Date().toISOString(),
  }
}

/** Quick presets: adjust one lever and see approximate score change */
export function runWhatIfSimulation(profile, baseline, today, preset) {
  const base = computeFullResult(profile, baseline, today)
  let alt = { ...today }

  if (preset === 'sleep8') alt = { ...alt, sleepHours: '8' }
  else if (preset === 'lessScreen') {
    const t = Number(today.screenTime)
    alt = { ...alt, screenTime: String(Math.max(0, (Number.isNaN(t) ? 4 : t) - 2)) }
  } else if (preset === 'lessCaffeine') {
    const t = Number(today.caffeine)
    alt = { ...alt, caffeine: String(Math.max(0, (Number.isNaN(t) ? 1 : t) - 1)) }
  } else if (preset === 'moreMovement') {
    const i = ACTIVITY_ORDER.indexOf(today.movement)
    if (i >= 0 && i < ACTIVITY_ORDER.length - 1) alt = { ...alt, movement: ACTIVITY_ORDER[i + 1] }
    else alt = { ...alt, exercisedToday: 'yes' }
  }

  const sim = computeFullResult(profile, baseline, alt)
  const delta = base.score - sim.score
  let explanation = ''
  if (delta > 0) {
    explanation = `If this change held, your modeled stress could drop by about ${delta} points.`
  } else if (delta < 0) {
    explanation = `In this toy model, that tweak nudges the score up slightly—your baselines matter.`
  } else {
    explanation = `This lever barely moves the score today—other signals are doing more work.`
  }

  return {
    originalScore: base.score,
    simulatedScore: sim.score,
    deltaPoints: delta,
    explanation,
    preset,
  }
}
