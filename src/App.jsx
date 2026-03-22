import { useState } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import BaselineForm from './components/BaselineForm.jsx'
import TodayForm from './components/TodayForm.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import StepIndicator from './components/StepIndicator.jsx'
import { computeStressResult } from './utils/scoreStress.js'

/**
 * Main app: one "step" string decides which screen to show.
 * All form data lives here so "Start over" can reset everything in one place.
 */
const initialBaseline = {
  restingHr: '',
  sleepAvg: '',
  activityLevel: 'moderate',
}

const initialToday = {
  currentHr: '',
  sleepHours: '',
  movement: 'moderate',
  screenTime: '',
  caffeine: '',
  mood: 'neutral',
}

function App() {
  const [step, setStep] = useState('welcome')
  const [baseline, setBaseline] = useState(initialBaseline)
  const [today, setToday] = useState(initialToday)
  const [result, setResult] = useState(null)
  const [baselineError, setBaselineError] = useState('')
  const [todayError, setTodayError] = useState('')

  const updateBaseline = (patch) => {
    setBaseline((prev) => ({ ...prev, ...patch }))
    setBaselineError('')
  }

  const updateToday = (patch) => {
    setToday((prev) => ({ ...prev, ...patch }))
    setTodayError('')
  }

  const validateBaseline = () => {
    const r = Number(baseline.restingHr)
    const s = Number(baseline.sleepAvg)
    if (Number.isNaN(r) || r < 40 || r > 120) {
      setBaselineError('Resting heart rate should be between 40 and 120.')
      return false
    }
    if (Number.isNaN(s) || s < 0 || s > 24) {
      setBaselineError('Average sleep should be between 0 and 24 hours.')
      return false
    }
    return true
  }

  const validateToday = () => {
    const c = Number(today.currentHr)
    const sh = Number(today.sleepHours)
    const sc = Number(today.screenTime)
    const caf = Number(today.caffeine)
    if (Number.isNaN(c) || c < 40 || c > 220) {
      setTodayError('Current heart rate should be between 40 and 220.')
      return false
    }
    if (Number.isNaN(sh) || sh < 0 || sh > 24) {
      setTodayError('Sleep hours should be between 0 and 24.')
      return false
    }
    if (Number.isNaN(sc) || sc < 0 || sc > 24) {
      setTodayError('Screen time should be between 0 and 24 hours.')
      return false
    }
    if (Number.isNaN(caf) || caf < 0 || caf > 12) {
      setTodayError('Caffeine count should be between 0 and 12.')
      return false
    }
    return true
  }

  const handleBaselineNext = () => {
    if (!validateBaseline()) return
    setStep('today')
  }

  const handleTodaySubmit = () => {
    if (!validateToday()) return
    const computed = computeStressResult(baseline, today)
    setResult(computed)
    setStep('result')
  }

  const handleReset = () => {
    // New objects so React always sees a clean reset (same pattern as clearing form state).
    setBaseline({ ...initialBaseline })
    setToday({ ...initialToday })
    setResult(null)
    setBaselineError('')
    setTodayError('')
    setStep('welcome')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="logo-mark" aria-hidden="true" />
        <span className="logo-text">ChillMate Lite</span>
      </header>

      <main className="app-main">
        {step !== 'welcome' ? <StepIndicator step={step} /> : null}

        {step === 'welcome' && <WelcomeScreen onStart={() => setStep('baseline')} />}

        {step === 'baseline' && (
          <BaselineForm
            values={baseline}
            onChange={updateBaseline}
            onNext={handleBaselineNext}
            error={baselineError}
            stepMeta="Step 1 of 2 · Baseline"
          />
        )}

        {step === 'today' && (
          <TodayForm
            values={today}
            onChange={updateToday}
            onSubmit={handleTodaySubmit}
            error={todayError}
            stepMeta="Step 2 of 2 · Today"
          />
        )}

        {step === 'result' && result && (
          <ResultScreen result={result} baseline={baseline} today={today} onReset={handleReset} />
        )}
      </main>

      <footer className="app-footer">
        <p>Made for learning—your snapshot stays on this device.</p>
      </footer>
    </div>
  )
}

export default App
