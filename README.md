# ChillMate Lite

## Purpose

**ChillMate Lite** is a small web app that estimates a **stress score (0–100)** from your baseline habits and today’s inputs. It is inspired by wellness and wearable-style stress awareness, but it runs entirely in the browser and does **not** use a server or store your data.

It is meant for learning, demos, and gentle self-reflection—not clinical use.

## Features

- **Welcome screen** with a short introduction and a one-click start
- **Baseline form** (resting heart rate, usual sleep, usual activity level)
- **Today’s data form** (current heart rate, sleep, movement, screen time, caffeine, mood)
- **Results** with a score, Low / Medium / High category, short explanations, and three tips
- **Responsive layout** that works on phones and desktops
- **No backend**—everything runs locally in your browser

## Technologies

- **React** — UI and screen flow
- **Vite** — dev server and production build
- **Plain CSS** — layout and styling (no UI framework required)

## How the stress score works (simple explanation)

The app compares **today** to **your baseline** and looks at several everyday signals:

- **Heart rate** — higher than your resting baseline adds to the score
- **Sleep** — less sleep than your usual average adds to the score
- **Movement** — less movement than your usual level adds to the score
- **Screen time** — more hours add to the score
- **Caffeine** — more servings add to the score
- **Mood** — lower mood ratings add to the score

Each factor is turned into a **0–100 “stress contribution”**, then they are combined with a **fixed weight** (for example, sleep and heart rate are weighted a bit more than caffeine). The final number is **rounded** and **capped between 0 and 100**.

**Categories** (for display only):

- **Low** — score below 40  
- **Medium** — score 40–69  
- **High** — score 70 and above  

This is a **rough demo model**, not a medical measurement.

## Disclaimer

**ChillMate Lite is not a medical device and does not diagnose any condition.**  
Treat the score and text as educational and informational only. If you have health concerns or feel unwell, contact a qualified healthcare professional.

## Run locally

**Requirements:** [Node.js](https://nodejs.org/) (LTS recommended)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the URL shown in the terminal (often `http://localhost:5173`).

**Other commands:**

- `npm run build` — create a production build in the `dist` folder  
- `npm run preview` — preview the production build locally  
- `npm run lint` — run ESLint  

## Deploy on Vercel

ChillMate Lite is a static **Vite** app. You can deploy it on [Vercel](https://vercel.com/) in a few steps:

1. Push this project to a Git repository (GitHub, GitLab, or Bitbucket).
2. In Vercel, choose **Add New → Project** and import that repository.
3. Vercel usually detects **Vite** automatically. If you set it manually:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`  
4. Click **Deploy**.

After deployment, Vercel gives you a live URL. Future pushes to your main branch can trigger automatic redeploys if you enable them.

## Live Demo
https://chillmate-lite.vercel.app
---

*Built for learning — stress estimation is illustrative only.*
