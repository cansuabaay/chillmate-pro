const DRIVER_LABELS = {
  heart: 'Heart rate vs baseline',
  sleep: 'Sleep',
  movement: 'Movement',
  screen: 'Screen time',
  caffeine: 'Caffeine',
  mood: 'Mood',
  context: 'Daily context',
  mixed: 'Mixed signals',
}

const MOOD_LABELS = {
  happy: 'Mostly upbeat',
  neutral: 'Steady',
  anxious: 'Anxious',
  overwhelmed: 'Overwhelmed',
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function WeeklyScreen({ insights }) {
  const {
    checkCount,
    avgStress,
    highest,
    lowest,
    trend,
    dominantDriver,
    avgSleep,
    avgHrDelta,
    moodPattern,
    summary,
  } = insights

  const trendLabel =
    trend === 'improving' ? 'Improving' : trend === 'worsening' ? 'Worsening' : 'Stable'

  return (
    <div className="weekly-dashboard">
      <section className="card weekly-hero">
        <p className="card-eyebrow">Last 7 days</p>
        <h2 className="section-title">Weekly insights</h2>
        <p className="weekly-summary">{summary}</p>
      </section>

      {checkCount === 0 ? (
        <section className="card weekly-empty">
          <p className="hint" style={{ marginBottom: 0 }}>
            Complete a few daily checks and come back—your week-at-a-glance will appear here.
          </p>
        </section>
      ) : (
        <>
          <div className="weekly-grid">
            <section className="card weekly-stat">
              <p className="weekly-stat__label">Weekly average stress</p>
              <p className="weekly-stat__value">{avgStress}</p>
              <p className="weekly-stat__unit">/ 100 · {checkCount} check(s)</p>
            </section>
            <section className="card weekly-stat">
              <p className="weekly-stat__label">Sleep trend (avg)</p>
              <p className="weekly-stat__value">{avgSleep != null ? `${avgSleep}h` : '—'}</p>
              <p className="weekly-stat__unit">From your daily logs</p>
            </section>
            <section className="card weekly-stat">
              <p className="weekly-stat__label">Mood pattern</p>
              <p className="weekly-stat__value">
                {moodPattern ? MOOD_LABELS[moodPattern] || moodPattern : '—'}
              </p>
              <p className="weekly-stat__unit">Most common mood tag</p>
            </section>
            <section className="card weekly-stat">
              <p className="weekly-stat__label">Main driver this week</p>
              <p className="weekly-stat__value weekly-stat__value--sm">
                {DRIVER_LABELS[dominantDriver] || dominantDriver || 'Mixed'}
              </p>
              <p className="weekly-stat__unit">From dominant factor per check</p>
            </section>
          </div>

          <section className="card weekly-detail">
            <h3 className="weekly-detail__title">Highs & lows</h3>
            <div className="weekly-detail__row">
              <div>
                <p className="weekly-detail__k">Highest day</p>
                <p className="weekly-detail__v">
                  {formatDate(highest?.date)} · <strong>{highest?.score}</strong>
                </p>
                <p className="weekly-detail__hint">{highest?.insight}</p>
              </div>
              <div>
                <p className="weekly-detail__k">Lowest day</p>
                <p className="weekly-detail__v">
                  {formatDate(lowest?.date)} · <strong>{lowest?.score}</strong>
                </p>
                <p className="weekly-detail__hint">{lowest?.insight}</p>
              </div>
            </div>
            <div className="weekly-detail__row weekly-detail__row--meta">
              <p>
                <span className="weekly-detail__k">Stress trend</span> {trendLabel}
              </p>
              <p>
                <span className="weekly-detail__k">Avg HR delta</span>{' '}
                {avgHrDelta != null ? `${avgHrDelta > 0 ? '+' : ''}${avgHrDelta} bpm` : '—'}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
