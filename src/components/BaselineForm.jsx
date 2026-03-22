/**
 * Step 2: collect resting HR, usual sleep, and usual activity — your "normal" for comparisons.
 */
export default function BaselineForm({ values, onChange, onNext, error, stepMeta }) {
  return (
    <section className="card form-card" aria-labelledby="baseline-title">
      {stepMeta ? <p className="card-eyebrow">{stepMeta}</p> : null}
      <h2 id="baseline-title" className="section-title">
        Your usual baseline
      </h2>
      <p className="hint">Rough numbers are fine—we use this to see how today compares.</p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault()
          onNext()
        }}
      >
        <label className="field">
          <span className="field-label">Resting heart rate</span>
          <span className="field-sublabel">Beats per minute — your calm, awake baseline</span>
          <input
            type="number"
            inputMode="numeric"
            min={40}
            max={120}
            placeholder="e.g. 65"
            value={values.restingHr}
            onChange={(e) => onChange({ restingHr: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Average sleep per night</span>
          <span className="field-sublabel">Typical hours per night, for you</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.25}
            placeholder="e.g. 7.5"
            value={values.sleepAvg}
            onChange={(e) => onChange({ sleepAvg: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Usual activity level</span>
          <span className="field-sublabel">How most weeks feel for you</span>
          <select
            value={values.activityLevel}
            onChange={(e) => onChange({ activityLevel: e.target.value })}
          >
            <option value="sedentary">Mostly sitting</option>
            <option value="light">Light (walks, light chores)</option>
            <option value="moderate">Moderate (regular exercise some days)</option>
            <option value="active">Active (most days)</option>
            <option value="very_active">Very active (daily intense exercise)</option>
          </select>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </div>
      </form>
    </section>
  )
}
