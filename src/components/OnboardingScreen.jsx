export default function OnboardingScreen({ values, onChange, onSubmit, error }) {
  return (
    <section className="card form-card form-card--wide">
      <p className="card-eyebrow">Step 1 of 2 · Profile</p>
      <h2 className="section-title">Let&apos;s personalize ChillMate</h2>
      <p className="hint">
        We use this to shape wording and context—never to label you medically. Skip anything you&apos;d rather
        not share.
      </p>

      <form
        className="form form--two-col"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="field">
          <span className="field-label">First name *</span>
          <input
            value={values.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            required
            autoComplete="given-name"
          />
        </div>
        <div className="field">
          <span className="field-label">Last name *</span>
          <input
            value={values.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            required
            autoComplete="family-name"
          />
        </div>
        <div className="field">
          <span className="field-label">Age *</span>
          <input
            type="number"
            min={13}
            max={120}
            value={values.age}
            onChange={(e) => onChange({ age: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <span className="field-label">Gender</span>
          <select value={values.gender} onChange={(e) => onChange({ gender: e.target.value })}>
            <option value="">Prefer not to say</option>
            <option value="woman">Woman</option>
            <option value="man">Man</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Another identity</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Weight (kg)</span>
          <input
            type="number"
            min={20}
            max={300}
            value={values.weight}
            onChange={(e) => onChange({ weight: e.target.value })}
          />
        </div>
        <div className="field">
          <span className="field-label">Height (cm)</span>
          <input
            type="number"
            min={100}
            max={250}
            value={values.height}
            onChange={(e) => onChange({ height: e.target.value })}
          />
        </div>
        <div className="field field--full">
          <span className="field-label">Work / study</span>
          <select value={values.occupation} onChange={(e) => onChange({ occupation: e.target.value })}>
            <option value="">Select…</option>
            <option value="student">Student</option>
            <option value="employed">Employed</option>
            <option value="self">Self-employed</option>
            <option value="looking">Looking for work</option>
            <option value="retired">Retired</option>
            <option value="high_stress">Often in high-pressure roles</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Exercise</span>
          <select value={values.exerciseFreq} onChange={(e) => onChange({ exerciseFreq: e.target.value })}>
            <option value="">—</option>
            <option value="rarely">Rarely</option>
            <option value="light">1–2× / week</option>
            <option value="moderate">3–4× / week</option>
            <option value="often">Most days</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Smoking</span>
          <select value={values.smoking} onChange={(e) => onChange({ smoking: e.target.value })}>
            <option value="">—</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
            <option value="prefer_not">Prefer not to say</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Typical caffeine</span>
          <select value={values.caffeineHabit} onChange={(e) => onChange({ caffeineHabit: e.target.value })}>
            <option value="">—</option>
            <option value="low">Light</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="field">
          <span className="field-label">Sleep quality tendency</span>
          <select value={values.sleepQuality} onChange={(e) => onChange({ sleepQuality: e.target.value })}>
            <option value="">—</option>
            <option value="poor">Often rough</option>
            <option value="fair">Mixed</option>
            <option value="good">Usually solid</option>
            <option value="great">Usually great</option>
          </select>
        </div>

        {error ? <p className="form-error field--full">{error}</p> : null}

        <div className="form-actions field--full">
          <button type="submit" className="btn btn-primary">
            Continue to baseline
          </button>
        </div>
      </form>
    </section>
  )
}
