# ChillMate Pro+

A personalized, explainable stress awareness web app inspired by wearable-based stress detection systems.

This project demonstrates how behavioral and physiological signals can be combined with a baseline-based approach to estimate stress levels, provide insights, and support self-awareness.

 **Live Demo:**  
https://chillmate-lite.vercel.app

---

## Key Features

### User Onboarding & Personal Profile
- Collects user information (name, age, lifestyle context)
- Personalizes experience based on user profile

### Personal Baseline System
- Resting heart rate
- Average sleep duration
- Usual activity level
- Screen time & caffeine habits

→ Used as a reference point for all stress calculations

---

### Daily Stress Check
Users input:
- Heart rate
- Sleep hours
- Activity level
- Screen time
- Caffeine intake
- Mood (emoji-based selection)

---

### Advanced Stress Scoring
- Baseline comparison logic
- Weighted multi-factor model:
  - Heart rate & sleep → high impact
  - Movement & screen time → medium
  - Mood & caffeine → supportive factors
- Score normalized to **0–100**

---

### Explainable AI Approach
Instead of a black-box result, the app explains:

#### Why this result?
- Baseline deviations
- Behavioral patterns

#### Today’s Insight
- Main driver of stress (sleep, HR, behavior)

#### Stress Pattern Detection
- Sleep-driven
- Physiological
- Behavioral
- Mixed

---

### Smart Recommendations
Dynamic suggestions based on detected stress drivers:
- Recovery suggestions
- Digital detox
- Movement reminders
- Breathing & relaxation

---

### Weekly Insights Dashboard
- Weekly average stress
- Trend analysis (improving / worsening)
- Most stressful day
- Dominant weekly stress factor
- Mood & sleep patterns

---

### History Tracking
- Previous stress checks
- Score + insight + pattern
- Stored locally using browser storage

---

### What-If Simulator
Simulate improvements:
- More sleep
- Less screen time
- Increased activity

→ See how stress score would change

---

### Downloadable Report
Export results as JSON:
- Profile
- Baseline
- Daily input
- Stress score
- Insights & recommendations

---

## Technologies

- **React** — UI and state management  
- **Vite** — development & build tool  
- **CSS** — custom styling  
- **LocalStorage** — data persistence (no backend)

---

## How It Works (Simplified)

The app compares **today’s inputs** with **personal baseline values**.

Each factor contributes to stress:

- Higher-than-baseline heart rate ↑ stress  
- Lower-than-usual sleep ↑ stress  
- Reduced movement ↑ stress  
- Increased screen time ↑ stress  
- Higher caffeine intake ↑ stress  
- Negative mood ↑ stress  

Each factor is weighted and combined into a final score (0–100).

---

## Disclaimer

ChillMate Pro+ is **not a medical device** and does not provide diagnosis.

It is designed for:
- educational purposes  
- self-awareness  
- demonstration of stress modeling concepts  

If you have health concerns, consult a qualified professional.

---

## Run Locally

```bash
npm install
npm run dev
