export default function WelcomeLanding({
  hasAccount,
  firstName,
  onGetStarted,
  onDashboard,
  onReviewSetup,
}) {
  return (
    <section className="card welcome-pro">
      <div className="welcome-pro__glow" aria-hidden="true" />
      <p className="badge badge--pro">Stress awareness · wearable-inspired demo</p>
      <h1 className="title">ChillMate Pro</h1>
      <p className="subtitle">
        A personalized companion for reflecting on stress—built in the spirit of sensor-based wearables and
        calm, explainable insights. Not a diagnosis; just clarity for your day.
      </p>
      {hasAccount ? (
        <div className="welcome-pro__actions">
          <p className="welcome-back">Welcome back{firstName ? `, ${firstName}` : ''}.</p>
          <button type="button" className="btn btn-primary" onClick={onDashboard}>
            Open dashboard
          </button>
          <button type="button" className="btn btn-text" onClick={onReviewSetup}>
            Review setup
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-primary" onClick={onGetStarted}>
          Get started
        </button>
      )}
    </section>
  )
}
