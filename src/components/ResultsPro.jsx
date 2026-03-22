import { useState } from 'react'
import { runWhatIfSimulation } from '../utils/stressEngine.js'

const WHAT_IF_PRESETS = [
  { id: 'sleep8', label: 'If I slept 8 hours' },
  { id: 'lessScreen', label: 'If I cut screen time ~2h' },
  { id: 'lessCaffeine', label: 'If I had one less caffeine' },
  { id: 'moreMovement', label: 'If I moved up one activity level' },
]

export default function ResultsPro({
  result,
  profile,
  baseline,
  today,
  weeklyInsights,
  onNewCheck,
  onWeeklyInsights,
}) {
  const {
    score,
    category,
    todaysInsight,
    explanationBullets,
    recommendations,
    stressPattern,
    confidenceLabel,
    confidenceNote,
  } = result

  const categoryClass =
    category === 'Low' ? 'cat-low' : category === 'Medium' ? 'cat-mid' : 'cat-high'

  const [whatIfPreset, setWhatIfPreset] = useState(null)
  const simulation =
    whatIfPreset != null ? runWhatIfSimulation(profile, baseline, today, whatIfPreset) : null

  const handleDownload = () => {
    const payload = {
      app: 'ChillMate Pro',
      disclaimer:
        'This JSON export is for personal reflection only. ChillMate Pro does not provide medical diagnosis.',
      exportedAt: new Date().toISOString(),
      profile,
      baseline,
      today,
      stressScore: result.score,
      category: result.category,
      insight: result.todaysInsight,
      reasons: result.explanationBullets,
      stressPattern: result.stressPattern,
      recommendations: result.recommendations,
      confidenceLabel: result.confidenceLabel,
      confidenceNote: result.confidenceNote,
      weeklySummary: weeklyInsights,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chillmate-pro-report-${new Date().toISOString().slice(0, 10)}.json`
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const bullets =
    explanationBullets?.length > 0
      ? explanationBullets
      : ['No single factor dominated—your inputs landed in a balanced range today.']

  return (
    <section className="result-stack result-stack--premium" aria-live="polite">
      <div className={`result-section result-section--score card ${categoryClass}`}>
        <p className="result-section__eyebrow">Stress snapshot</p>
        <div className="result-score-panel result-score-panel--hero">
          <div className="score-row" aria-hidden="true">
            <span className="score-number">{score}</span>
            <span className="score-out">/ 100</span>
          </div>
          <p className="score-bar-label">Modeled load (0–100) — demo only, not clinical</p>
          <div className="score-meter">
            <div
              className="score-meter__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={score}
              aria-valuetext={`Score ${score} out of 100. ${category} stress band.`}
            >
              <div className="score-meter__zones" aria-hidden="true">
                <span className="score-meter__zone score-meter__zone--low" />
                <span className="score-meter__zone score-meter__zone--mid" />
                <span className="score-meter__zone score-meter__zone--high" />
              </div>
              <div className={`score-meter__fill ${categoryClass}`} style={{ width: `${score}%` }} />
              <span className="score-meter__thumb" style={{ left: `${score}%` }} aria-hidden="true" />
            </div>
            <div className="score-meter__scale">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          <div className={`category-rail ${categoryClass}`} role="presentation">
            <span className="category-rail__seg category-rail__seg--low">Low</span>
            <span className="category-rail__seg category-rail__seg--mid">Medium</span>
            <span className="category-rail__seg category-rail__seg--high">High</span>
          </div>
          <p className={`category-pill ${categoryClass}`}>{category} stress band</p>
        </div>
      </div>

      <div className={`result-section card result-section--insight ${categoryClass}`}>
        <h2 className="result-section__title">Today&apos;s insight</h2>
        <p className="result-insight__text">{todaysInsight}</p>
      </div>

      <div className="result-section card result-section--explain">
        <h2 className="result-section__title">Why this result?</h2>
        <p className="result-section__subtitle">Compared with your baseline and what you logged today</p>
        <ul className="explain-list">
          {bullets.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="card result-section pattern-card">
        <h2 className="result-section__title">Stress pattern</h2>
        <p className="pattern-card__value">{stressPattern}</p>
        <p className="pattern-card__hint">
          {stressPattern === 'Sleep-driven' && 'Recovery and sleep debt are doing more of the lifting in the model.'}
          {stressPattern === 'Physiological' && 'Heart rate and mood signals are weighted heavily this round.'}
          {stressPattern === 'Behavioral' && 'Screens, movement, and caffeine shifts are the main story.'}
          {stressPattern === 'Mixed' && 'Several channels contributed—no single label captures the whole day.'}
        </p>
      </div>

      <div className="result-section result-section--recs">
        <h2 className="result-section__title result-section__title--flush">Smart suggestions</h2>
        <p className="result-section__subtitle">Ideas tuned to your strongest signals—not prescriptions</p>
        <div className="recommendation-cards">
          {recommendations.map((tip, i) => (
            <div key={i} className="card recommendation-card recommendation-card--premium">
              <p className="recommendation-card__text">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card confidence-card">
        <h2 className="result-section__title result-section__title--flush">Confidence</h2>
        <p className="confidence-card__label">{confidenceLabel}</p>
        <p className="confidence-card__note">{confidenceNote}</p>
      </div>

      <div className="card whatif-card">
        <h2 className="result-section__title result-section__title--flush">What if?</h2>
        <p className="result-section__subtitle">
          Tap a scenario—we re-run the same simple model with one lever adjusted.
        </p>
        <div className="whatif-presets">
          {WHAT_IF_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`whatif-preset ${whatIfPreset === p.id ? 'is-active' : ''}`}
              onClick={() => setWhatIfPreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {simulation ? (
          <div className="whatif-outcome">
            <p className="whatif-outcome__scores">
              Current <strong>{simulation.originalScore}</strong>
              {' → '}
              simulated <strong>{simulation.simulatedScore}</strong>
            </p>
            <p className="whatif-outcome__text">{simulation.explanation}</p>
          </div>
        ) : null}
      </div>

      <div className="card disclaimer-card">
        <p>
          <strong>Important:</strong> ChillMate Pro is a stress-awareness demo for self-reflection. It is{' '}
          <em>not</em> a medical device and does not diagnose any condition. If you need support, reach out to a
          qualified professional or someone you trust.
        </p>
      </div>

      <div className="actions-row actions-row--split actions-row--stack">
        <button type="button" className="btn btn-primary" onClick={onNewCheck}>
          Start new check
        </button>
        <button type="button" className="btn btn-secondary" onClick={onWeeklyInsights}>
          View weekly insights
        </button>
        <button type="button" className="btn btn-secondary btn-secondary--ghost" onClick={handleDownload}>
          Download my report
        </button>
      </div>
    </section>
  )
}
