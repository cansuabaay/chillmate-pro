export default function DashboardHome({ firstName, lastCheck, onDaily }) {
  return (
    <div className="dashboard-home">
      <section className="card dashboard-hero">
        <h2 className="section-title">Hello{firstName ? `, ${firstName}` : ''}</h2>
        <p className="hint">
          Your data stays on this device. Run a quick daily check when you want a grounded read on how today
          feels.
        </p>
        <button type="button" className="btn btn-primary" onClick={onDaily}>
          Start daily check
        </button>
      </section>

      {lastCheck ? (
        <section className="card dashboard-last">
          <p className="card-eyebrow">Last check</p>
          <p className="dashboard-last__score">
            <strong>{lastCheck.result?.score}</strong>
            <span> / 100 · {lastCheck.result?.category}</span>
          </p>
          <p className="dashboard-last__insight">{lastCheck.result?.todaysInsight}</p>
          <p className="dashboard-last__date">{new Date(lastCheck.at).toLocaleString()}</p>
        </section>
      ) : (
        <section className="card dashboard-last dashboard-last--empty">
          <p>No checks yet—your first one takes about a minute.</p>
        </section>
      )}
    </div>
  )
}
