import { useState } from 'react'

function formatWhen(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function HistoryScreen({ history, onDeleteOne, onClearAll, onViewEntry }) {
  const [confirmClear, setConfirmClear] = useState(false)
  const sorted = [...history].sort((a, b) => new Date(b.at) - new Date(a.at))

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    onClearAll()
    setConfirmClear(false)
  }

  return (
    <div className="history-screen">
      <section className="card history-header">
        <p className="card-eyebrow">Your log</p>
        <h2 className="section-title">Previous checks</h2>
        <p className="hint">
          Everything stays on this device. Remove entries anytime—you&apos;re in control.
        </p>
        {sorted.length > 0 ? (
          <div className="history-toolbar">
            <button
              type="button"
              className="btn btn-secondary btn-secondary--ghost btn--compact"
              onClick={handleClear}
            >
              {confirmClear ? 'Tap again to clear all' : 'Clear all history'}
            </button>
          </div>
        ) : null}
      </section>

      {sorted.length === 0 ? (
        <section className="card history-empty">
          <p>No saved checks yet. Your daily results will show up here.</p>
        </section>
      ) : (
        <ul className="history-list">
          {sorted.map((entry) => (
            <li key={entry.id} className="card history-card">
              <div className="history-card__top">
                <div>
                  <p className="history-card__date">{formatWhen(entry.at)}</p>
                  <p className="history-card__score">
                    <strong>{entry.result?.score}</strong>
                    <span> / 100 · {entry.result?.category}</span>
                  </p>
                </div>
                <span className="history-card__pattern">{entry.result?.stressPattern}</span>
              </div>
              <p className="history-card__insight">{entry.result?.todaysInsight}</p>
              <div className="history-card__actions">
                <button
                  type="button"
                  className="btn btn-secondary btn--compact"
                  onClick={() => onViewEntry(entry)}
                >
                  View
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-secondary--ghost btn--compact"
                  onClick={() => onDeleteOne(entry.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
