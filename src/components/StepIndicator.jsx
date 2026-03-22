/**
 * Shows where you are in the flow (Intro → Baseline → Today → Result).
 * Pure presentation — the parent passes the current step name.
 */
const STEPS = [
  { key: 'welcome', label: 'Intro' },
  { key: 'baseline', label: 'Baseline' },
  { key: 'today', label: 'Today' },
  { key: 'result', label: 'Result' },
]

export default function StepIndicator({ step }) {
  const found = STEPS.findIndex((s) => s.key === step)
  // If the step name ever doesn’t match (typo / bug), avoid a broken UI (no active step, 0% bar).
  const activeIndex = found === -1 ? 0 : found

  return (
    <nav className="step-indicator" aria-label="Assessment progress">
      <ol className="step-indicator__list">
        {STEPS.map((s, i) => {
          const isDone = i < activeIndex
          const isActive = i === activeIndex
          return (
            <li key={s.key} className={`step-indicator__item ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}>
              <span className="step-indicator__dot" aria-hidden="true">
                {isDone ? '✓' : i + 1}
              </span>
              <span className="step-indicator__label">{s.label}</span>
            </li>
          )
        })}
      </ol>
      {/* One bar that fills based on how far along we are */}
      <div className="step-indicator__bar" role="presentation">
        <div
          className="step-indicator__bar-fill"
          style={{ width: `${((activeIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </nav>
  )
}
