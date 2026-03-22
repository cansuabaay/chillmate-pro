/**
 * First screen: introduces the app and lets the user start the flow.
 */
export default function WelcomeScreen({ onStart }) {
  return (
    <section className="card welcome-card" aria-labelledby="welcome-title">
      <div className="welcome-card__glow" aria-hidden="true" />
      <p className="badge">Quick wellness snapshot · demo</p>
      <h1 id="welcome-title" className="title">
        ChillMate Lite
      </h1>
      <p className="subtitle">
        Compare today to your usual rhythm—sleep, movement, and a few everyday habits. You&apos;ll get a simple
        score for reflection, not a diagnosis.
      </p>
      <button type="button" className="btn btn-primary" onClick={onStart}>
        Start check-in
      </button>
    </section>
  )
}
