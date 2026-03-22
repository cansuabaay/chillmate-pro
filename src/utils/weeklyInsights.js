/**
 * Derive weekly stats from saved check history (last 7 days).
 */

function avg(arr) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export function getWeekEntries(history) {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - 7)
  return (history || []).filter((e) => new Date(e.at) >= start)
}

export function computeWeeklyInsights(history) {
  const week = getWeekEntries(history)
  if (week.length === 0) {
    return {
      checkCount: 0,
      avgStress: null,
      highest: null,
      lowest: null,
      trend: 'stable',
      dominantDriver: null,
      avgSleep: null,
      avgHrDelta: null,
      moodPattern: null,
      summary: 'Log a few daily checks this week to unlock your weekly story.',
    }
  }

  const scores = week.map((e) => e.result?.score ?? 0)
  const avgStress = Math.round(avg(scores))

  let highest = week[0]
  let lowest = week[0]
  for (const e of week) {
    const s = e.result?.score ?? 0
    if (s > (highest.result?.score ?? -1)) highest = e
    if (s < (lowest.result?.score ?? 999)) lowest = e
  }

  const mid = Math.floor(week.length / 2)
  const sorted = [...week].sort((a, b) => new Date(a.at) - new Date(b.at))
  const firstHalf = sorted.slice(0, mid || 1)
  const secondHalf = sorted.slice(mid || 1)
  const a1 = avg(firstHalf.map((e) => e.result?.score ?? 0))
  const a2 = avg(secondHalf.map((e) => e.result?.score ?? 0))
  let trend = 'stable'
  if (a2 - a1 > 4) trend = 'worsening'
  else if (a1 - a2 > 4) trend = 'improving'

  const drivers = {}
  for (const e of week) {
    const k = e.result?.dominantFactorKey || 'mixed'
    drivers[k] = (drivers[k] || 0) + 1
  }
  const dominantDriver = Object.entries(drivers).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  const sleeps = week.map((e) => Number(e.today?.sleepHours)).filter((n) => !Number.isNaN(n))
  const avgSleep = sleeps.length ? Math.round(avg(sleeps) * 10) / 10 : null

  const hrDeltas = []
  for (const e of week) {
    const r = Number(e.baseline?.restingHr)
    const c = Number(e.today?.currentHr)
    if (!Number.isNaN(r) && !Number.isNaN(c)) hrDeltas.push(c - r)
  }
  const avgHrDelta = hrDeltas.length ? Math.round(avg(hrDeltas) * 10) / 10 : null

  const moods = week.map((e) => e.today?.mood).filter(Boolean)
  const moodCounts = {}
  moods.forEach((m) => {
    moodCounts[m] = (moodCounts[m] || 0) + 1
  })
  const moodPattern = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  let summary = ''
  if (dominantDriver === 'sleep') {
    summary = 'Your weekly pattern suggests sleep has been a main stress driver.'
  } else if (dominantDriver === 'heart') {
    summary = 'Pulse versus baseline showed up often this week—a physiological thread to watch.'
  } else if (dominantDriver === 'screen') {
    summary = 'Screen time kept appearing as a leading factor in your checks.'
  } else if (trend === 'improving') {
    summary = 'Your stress trend improved across the week—nice trajectory.'
  } else if (trend === 'worsening') {
    summary = 'Stress readings crept upward later in the week—worth a gentle reset.'
  } else {
    summary = 'This week shows a mixed pattern across sleep, behavior, and mood.'
  }

  return {
    checkCount: week.length,
    avgStress,
    highest: { date: highest.at, score: highest.result?.score, insight: highest.result?.todaysInsight },
    lowest: { date: lowest.at, score: lowest.result?.score, insight: lowest.result?.todaysInsight },
    trend,
    dominantDriver,
    avgSleep,
    avgHrDelta,
    moodPattern,
    summary,
  }
}
