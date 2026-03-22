export default function BaselineScreen({ values, onChange, onSubmit, error }) {
  return (
    <section className="card form-card form-card--wide">
      <p className="card-eyebrow">Step 2 of 2 · Your baseline</p>
      <h2 className="section-title">What&apos;s normal for you?</h2>
      <p className="hint">
        These anchors let us compare &quot;today&quot; to <em>your</em> usual—not a textbook ideal.
      </p>

      <form
        className="form form--two-col"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="field field--full">
          <span className="field-label">Resting heart rate (bpm) *</span>
          <span className="field-sublabel">Calm, seated, typical for you</span>
          <input
            type="number"
            min={40}
            max={120}
            value={values.restingHr}
            onChange={(e) => onChange({ restingHr: e.target.value })}
            required
          />
        </div>
        <div className="field field--full">
          <span className="field-label">Average sleep (hours / night) *</span>
          <input
            type="number"
            min={0}
            max={24}
            step={0.25}
            value={values.sleepAvg}
            onChange={(e) => onChange({ sleepAvg: e.target.value })}
            required
          />
        </div>
        <div className="field field--full">
          <span className="field-label">Usual activity level *</span>
          <select value={values.activityLevel} onChange={(e) => onChange({ activityLevel: e.target.value })}>
            <option value="sedentary">Mostly sitting</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very active</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Usual screen time (h/day) *</span>
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={values.avgScreenTime}
            onChange={(e) => onChange({ avgScreenTime: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <span className="field-label">Usual caffeine (servings/day) *</span>
          <input
            type="number"
            min={0}
            max={12}
            step={0.5}
            value={values.avgCaffeine}
            onChange={(e) => onChange({ avgCaffeine: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <span className="field-label">Stress tendency (optional)</span>
          <select value={values.stressTendency} onChange={(e) => onChange({ stressTendency: e.target.value })}>
            <option value="">—</option>
            <option value="rarely">Rarely tense</option>
            <option value="sometimes">Sometimes</option>
            <option value="often">Often on edge</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Usual mood (optional)</span>
          <select value={values.usualMood} onChange={(e) => onChange({ usualMood: e.target.value })}>
            <option value="happy">Mostly upbeat</option>
            <option value="neutral">Mostly steady</option>
            <option value="anxious">Often anxious</option>
            <option value="overwhelmed">Often overwhelmed</option>
          </select>
        </div>

        {error ? <p className="form-error field--full">{error}</p> : null}

        <div className="form-actions field--full">
          <button type="submit" className="btn btn-primary">
            Save &amp; enter dashboard
          </button>
        </div>
      </form>
    </section>
  )
}
