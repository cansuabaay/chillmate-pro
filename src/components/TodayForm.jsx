/**
 * Step 3: today's indicators — compared to baseline inside the scoring helper.
 */
const MOOD_OPTIONS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'anxious', emoji: '😟', label: 'Anxious' },
  { id: 'overwhelmed', emoji: '😣', label: 'Overwhelmed' },
]

export default function TodayForm({ values, onChange, onSubmit, error, stepMeta }) {
  return (
    <section className="card form-card" aria-labelledby="today-title">
      {stepMeta ? <p className="card-eyebrow">{stepMeta}</p> : null}
      <h2 id="today-title" className="section-title">
        How today looks
      </h2>
      <p className="hint">Ballpark answers work—nothing needs to be exact.</p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <label className="field">
          <span className="field-label">Current heart rate</span>
          <span className="field-sublabel">Right now, if you have a rough idea</span>
          <input
            type="number"
            inputMode="numeric"
            min={40}
            max={220}
            placeholder="e.g. 88"
            value={values.currentHr}
            onChange={(e) => onChange({ currentHr: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Sleep last night</span>
          <span className="field-sublabel">Hours you slept last night</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.25}
            placeholder="e.g. 6"
            value={values.sleepHours}
            onChange={(e) => onChange({ sleepHours: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Movement level today</span>
          <span className="field-sublabel">Your whole day, not just exercise</span>
          <select value={values.movement} onChange={(e) => onChange({ movement: e.target.value })}>
            <option value="sedentary">Mostly sitting</option>
            <option value="light">Light (walks, light chores)</option>
            <option value="moderate">Moderate (regular exercise some days)</option>
            <option value="active">Active (most days)</option>
            <option value="very_active">Very active (daily intense exercise)</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Screen time today</span>
          <span className="field-sublabel">Phone, laptop, TV—rough total</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.5}
            placeholder="e.g. 5"
            value={values.screenTime}
            onChange={(e) => onChange({ screenTime: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Caffeine</span>
          <span className="field-sublabel">Coffee, tea, energy drinks—count what feels right</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={12}
            step={0.5}
            placeholder="e.g. 1"
            value={values.caffeine}
            onChange={(e) => onChange({ caffeine: e.target.value })}
            required
          />
        </label>

        <div className="field mood-field">
          <span className="field-label" id="mood-label">
            Mood right now
          </span>
          <span className="field-sublabel" id="mood-hint">
            Tap one—how you feel in this moment
          </span>
          <div className="mood-options" role="radiogroup" aria-labelledby="mood-label" aria-describedby="mood-hint">
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

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            See my snapshot
          </button>
        </div>
      </form>
    </section>
  )
}
