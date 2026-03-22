const MOOD_OPTIONS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'anxious', emoji: '😟', label: 'Anxious' },
  { id: 'overwhelmed', emoji: '😣', label: 'Overwhelmed' },
]

export default function DailyCheckScreen({ values, onChange, onSubmit, error }) {
  return (
    <section className="card form-card form-card--wide">
      <p className="card-eyebrow">Daily check</p>
      <h2 className="section-title">How is today going?</h2>
      <p className="hint">Rough numbers are fine. We compare everything to the baseline you saved.</p>

      <form
        className="form form--two-col"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="field">
          <span className="field-label">Current heart rate (bpm) *</span>
          <input
            type="number"
            min={40}
            max={220}
            value={values.currentHr}
            onChange={(e) => onChange({ currentHr: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <span className="field-label">Sleep last night (h) *</span>
          <input
            type="number"
            min={0}
            max={24}
            step={0.25}
            value={values.sleepHours}
            onChange={(e) => onChange({ sleepHours: e.target.value })}
            required
          />
        </div>
        <div className="field field--full">
          <span className="field-label">Movement today *</span>
          <select value={values.movement} onChange={(e) => onChange({ movement: e.target.value })}>
            <option value="sedentary">Mostly sitting</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very active</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Screen time today (h) *</span>
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={values.screenTime}
            onChange={(e) => onChange({ screenTime: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <span className="field-label">Caffeine today *</span>
          <input
            type="number"
            min={0}
            max={12}
            step={0.5}
            value={values.caffeine}
            onChange={(e) => onChange({ caffeine: e.target.value })}
            required
          />
        </div>

        <div className="field field--full mood-field">
          <span className="field-label" id="dmood-label">
            Mood right now *
          </span>
          <div className="mood-options" role="radiogroup" aria-labelledby="dmood-label">
            {MOOD_OPTIONS.map((opt) => {
              const selected = values.mood === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`mood-option ${selected ? 'mood-option--selected' : ''}`}
                  onClick={() => onChange({ mood: opt.id })}
                  role="radio"
                  aria-checked={selected}
                >
                  <span className="mood-option__emoji" aria-hidden="true">
                    {opt.emoji}
                  </span>
                  <span className="mood-option__label">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="field">
          <span className="field-label">Big deadline today?</span>
          <select value={values.deadline} onChange={(e) => onChange({ deadline: e.target.value })}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Social energy</span>
          <select value={values.socialEnergy} onChange={(e) => onChange({ socialEnergy: e.target.value })}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="drained">Drained</option>
          </select>
        </div>
        <div className="field field--full">
          <span className="field-label">Exercised today?</span>
          <select value={values.exercisedToday} onChange={(e) => onChange({ exercisedToday: e.target.value })}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {error ? <p className="form-error field--full">{error}</p> : null}

        <div className="form-actions field--full">
          <button type="submit" className="btn btn-primary">
            See my results
          </button>
        </div>
      </form>
    </section>
  )
}
