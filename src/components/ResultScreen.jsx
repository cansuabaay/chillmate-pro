/**
 * Result: premium layout — score, insight, explanation, recommendations, download, disclaimer.
 */
export default function ResultScreen({ result, baseline, today, onReset }) {
  const { score, category, todaysInsight, explanationBullets, recommendations } = result

  const categoryClass =
    category === 'Low' ? 'cat-low' : category === 'Medium' ? 'cat-mid' : 'cat-high'

  const handleDownload = () => {
    const payload = {
      app: 'ChillMate Lite',
      exportedAt: new Date().toISOString(),
      baseline,
      today,
      result: {
        score: result.score,
        category: result.category,
        todaysInsight: result.todaysInsight,
        explanationBullets: result.explanationBullets,
        recommendations: result.recommendations,
      },
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chillmate-lite-result-${new Date().toISOString().slice(0, 10)}.json`
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="result-stack result-stack--premium" aria-live="polite">
      {/* Score */}
      <div className={`result-section result-section--score card ${categoryClass}`}>
        <p className="result-section__eyebrow">Stress snapshot</p>
        <div className="result-score-panel result-score-panel--hero">
          <div className="score-row" aria-hidden="true">
            <span className="score-number">{score}</span>
            <span className="score-out">/ 100</span>
          </div>
          <p className="score-bar-label">Your score (0–100)</p>
          <div className="score-meter">
            <div
              className="score-meter__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={score}
              aria-valuetext={`Score ${score} out of 100. ${category} stress load.`}
            >
              <div className="score-meter__zones" aria-hidden="true">
                <span className="score-meter__zone score-meter__zone--low" />
                <span className="score-meter__zone score-meter__zone--mid" />
                <span className="score-meter__zone score-meter__zone--high" />
              </div>
              <div
                className={`score-meter__fill ${categoryClass}`}
                style={{ width: `${score}%` }}
              />
              <span
                className="score-meter__thumb"
                style={{ left: `${score}%` }}
                aria-hidden="true"
              />
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
          <p className={`category-pill ${categoryClass}`}>{category} stress today</p>
        </div>
      </div>

      {/* Today's Insight */}
      <div className={`result-section card result-section--insight ${categoryClass}`}>
        <h2 className="result-section__title">Today&apos;s insight</h2>
        <p className="result-insight__text">{todaysInsight}</p>
      </div>

      {/* Explanation */}
      <div className="result-section card result-section--explain">
        <h2 className="result-section__title">Why this score?</h2>
        <p className="result-section__subtitle">Compared with your baseline and today&apos;s entries</p>
        <ul className="explain-list">
          {explanationBullets.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="result-section result-section--recs">
        <h2 className="result-section__title result-section__title--flush">What could help</h2>
        <p className="result-section__subtitle">Based on your strongest signals</p>
        <div className="recommendation-cards">
          {recommendations.map((tip, i) => (
            <div key={i} className="card recommendation-card recommendation-card--premium">
              <p className="recommendation-card__text">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card disclaimer-card">
        <p>
          <strong>Heads up:</strong> ChillMate Lite is a demo for curiosity and self-awareness. It isn&apos;t
          medical advice. If you&apos;re overwhelmed or worried about your health, please reach out to someone who
          can help in person.
        </p>
      </div>

      <div className="actions-row actions-row--split">
        <button type="button" className="btn btn-secondary" onClick={handleDownload}>
          Download result
        </button>
        <button type="button" className="btn btn-secondary btn-secondary--ghost" onClick={onReset}>
          Start over
        </button>
      </div>
    </section>
  )
}
