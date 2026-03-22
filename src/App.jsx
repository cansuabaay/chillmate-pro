import { useEffect, useMemo, useState } from 'react'
import './App.css'
import NavBar from './components/NavBar.jsx'
import WelcomeLanding from './components/WelcomeLanding.jsx'
import OnboardingScreen from './components/OnboardingScreen.jsx'
import BaselineScreen from './components/BaselineScreen.jsx'
import DashboardHome from './components/DashboardHome.jsx'
import DailyCheckScreen from './components/DailyCheckScreen.jsx'
import ResultsPro from './components/ResultsPro.jsx'
import WeeklyScreen from './components/WeeklyScreen.jsx'
import HistoryScreen from './components/HistoryScreen.jsx'
import {
  loadProfile,
  saveProfile,
  loadBaseline,
  saveBaseline,
  loadHistory,
  saveHistory,
  defaultProfile,
  defaultBaseline,
  defaultToday,
} from './utils/storage.js'
import { computeFullResult } from './utils/stressEngine.js'
import { computeWeeklyInsights } from './utils/weeklyInsights.js'

function isProfileComplete(p) {
  const age = Number(p?.age)
  return !!(p?.firstName?.trim() && p?.lastName?.trim() && !Number.isNaN(age) && age >= 13 && age <= 120)
}

function isBaselineComplete(b) {
  const r = Number(b?.restingHr)
  const s = Number(b?.sleepAvg)
  const sc = Number(b?.avgScreenTime)
  const c = Number(b?.avgCaffeine)
  return (
    !Number.isNaN(r) &&
    r >= 40 &&
    r <= 120 &&
    !Number.isNaN(s) &&
    s >= 0 &&
    s <= 24 &&
    !!b?.activityLevel &&
    !Number.isNaN(sc) &&
    sc >= 0 &&
    sc <= 24 &&
    !Number.isNaN(c) &&
    c >= 0 &&
    c <= 12
  )
}

function App() {
  const [profile, setProfile] = useState(() => ({
    ...defaultProfile,
    ...(loadProfile() || {}),
  }))
  const [baseline, setBaseline] = useState(() => ({
    ...defaultBaseline,
    ...(loadBaseline() || {}),
  }))
  const [history, setHistory] = useState(() => loadHistory())
  const [today, setToday] = useState(defaultToday)
  const [view, setView] = useState('welcome')
  const [onboardingError, setOnboardingError] = useState('')
  const [baselineError, setBaselineError] = useState('')
  const [dailyError, setDailyError] = useState('')
  const [historyDetail, setHistoryDetail] = useState(null)

  useEffect(() => {
    if (isProfileComplete(profile)) saveProfile(profile)
  }, [profile])

  useEffect(() => {
    if (isBaselineComplete(baseline)) saveBaseline(baseline)
  }, [baseline])

  const weeklyInsights = useMemo(() => computeWeeklyInsights(history), [history])
  const setupDone = isProfileComplete(profile) && isBaselineComplete(baseline)
  const lastCheck = history[0] ?? null

  const handleGetStarted = () => {
    if (isProfileComplete(profile) && !isBaselineComplete(baseline)) {
      setView('baseline')
      return
    }
    setView('onboarding')
  }

  const handleReviewSetup = () => setView('onboarding')

  const updateProfile = (patch) => {
    setProfile((prev) => ({ ...prev, ...patch }))
    setOnboardingError('')
  }

  const updateBaseline = (patch) => {
    setBaseline((prev) => ({ ...prev, ...patch }))
    setBaselineError('')
  }

  const updateToday = (patch) => {
    setToday((prev) => ({ ...prev, ...patch }))
    setDailyError('')
  }

  const submitOnboarding = () => {
    if (!isProfileComplete(profile)) {
      setOnboardingError('Please add your first name, last name, and a valid age (13–120).')
      return
    }
    saveProfile(profile)
    setView('baseline')
  }

  const submitBaseline = () => {
    if (!isBaselineComplete(baseline)) {
      setBaselineError(
        'Check your numbers: resting HR 40–120, sleep 0–24h, usual screen 0–24h, caffeine 0–12.',
      )
      return
    }
    saveBaseline(baseline)
    setView('home')
  }

  const validateDaily = () => {
    const c = Number(today.currentHr)
    const sh = Number(today.sleepHours)
    const sc = Number(today.screenTime)
    const caf = Number(today.caffeine)
    if (Number.isNaN(c) || c < 40 || c > 220) {
      setDailyError('Current heart rate should be between 40 and 220.')
      return false
    }
    if (Number.isNaN(sh) || sh < 0 || sh > 24) {
      setDailyError('Sleep hours should be between 0 and 24.')
      return false
    }
    if (Number.isNaN(sc) || sc < 0 || sc > 24) {
      setDailyError('Screen time should be between 0 and 24 hours.')
      return false
    }
    if (Number.isNaN(caf) || caf < 0 || caf > 12) {
      setDailyError('Caffeine should be between 0 and 12.')
      return false
    }
    return true
  }

  const submitDaily = () => {
    if (!validateDaily()) return
    const result = computeFullResult(profile, baseline, today)
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      at: new Date().toISOString(),
      baseline: { ...baseline },
      today: { ...today },
      result,
    }
    const next = [entry, ...history]
    setHistory(next)
    saveHistory(next)
    setView('results')
  }

  const navActive =
    view === 'results'
      ? 'daily'
      : view === 'home' || view === 'daily' || view === 'weekly' || view === 'history'
        ? view
        : 'home'

  const handleNavigate = (id) => {
    setHistoryDetail(null)
    if (id === 'home') setView('home')
    if (id === 'daily') setView('daily')
    if (id === 'weekly') setView('weekly')
    if (id === 'history') setView('history')
  }

  const showNav =
    setupDone &&
    (view === 'home' ||
      view === 'daily' ||
      view === 'weekly' ||
      view === 'history' ||
      view === 'results')

  return (
    <div className={`app-shell ${showNav ? 'app-shell--dashboard' : ''}`}>
      {showNav ? (
        <NavBar
          active={navActive}
          onNavigate={handleNavigate}
          firstName={profile.firstName?.trim()}
        />
      ) : (
        <header className="app-header app-header--lite">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-text">ChillMate Pro</span>
        </header>
      )}

      <main className="app-main">
        {view === 'welcome' && (
          <WelcomeLanding
            hasAccount={setupDone}
            firstName={profile.firstName?.trim()}
            onGetStarted={handleGetStarted}
            onDashboard={() => setView('home')}
            onReviewSetup={handleReviewSetup}
          />
        )}

        {view === 'onboarding' && (
          <OnboardingScreen
            values={profile}
            onChange={updateProfile}
            onSubmit={submitOnboarding}
            error={onboardingError}
          />
        )}

        {view === 'baseline' && (
          <BaselineScreen
            values={baseline}
            onChange={updateBaseline}
            onSubmit={submitBaseline}
            error={baselineError}
          />
        )}

        {view === 'home' && (
          <DashboardHome
            firstName={profile.firstName?.trim()}
            lastCheck={lastCheck}
            onDaily={() => setView('daily')}
          />
        )}

        {view === 'daily' && (
          <DailyCheckScreen
            values={today}
            onChange={updateToday}
            onSubmit={submitDaily}
            error={dailyError}
          />
        )}

        {view === 'results' && lastCheck && (
          <ResultsPro
            result={lastCheck.result}
            profile={profile}
            baseline={lastCheck.baseline}
            today={lastCheck.today}
            weeklyInsights={weeklyInsights}
            onNewCheck={() => {
              setToday({ ...defaultToday })
              setView('daily')
            }}
            onWeeklyInsights={() => setView('weekly')}
          />
        )}

        {view === 'weekly' && <WeeklyScreen insights={weeklyInsights} />}

        {view === 'history' && (
          <HistoryScreen
            history={history}
            onDeleteOne={(id) => {
              const next = history.filter((e) => e.id !== id)
              setHistory(next)
              saveHistory(next)
            }}
            onClearAll={() => {
              setHistory([])
              saveHistory([])
            }}
            onViewEntry={(entry) => setHistoryDetail(entry)}
          />
        )}
      </main>

      {historyDetail ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={() => setHistoryDetail(null)}
          onKeyDown={(e) => e.key === 'Escape' && setHistoryDetail(null)}
        >
          <div
            className="card modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hist-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="hist-modal-title" className="section-title">
              {new Date(historyDetail.at).toLocaleString()}
            </h2>
            <p className="history-modal__score">
              <strong>{historyDetail.result?.score}</strong> / 100 · {historyDetail.result?.category}
            </p>
            <p className="history-modal__insight">{historyDetail.result?.todaysInsight}</p>
            <p className="history-modal__pattern">Pattern: {historyDetail.result?.stressPattern}</p>
            {(historyDetail.result?.explanationBullets || []).length > 0 ? (
              <ul className="explain-list">
                {historyDetail.result.explanationBullets.slice(0, 5).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : null}
            <button type="button" className="btn btn-primary" onClick={() => setHistoryDetail(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      <footer className="app-footer">
        <p>Your data stays in this browser. ChillMate Pro is a demo—not a medical service.</p>
      </footer>
    </div>
  )
}

export default App
