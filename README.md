# 🏏 CricPulse — Real-Time IPL Second-Screen Fan Companion

CricPulse is an active, ultra-immersive, full-stack **IPL second-screen fan experience** designed to turn passive viewers into active match participants. By bridging the gap between live television broadcasts and interactive mobile sports media, CricPulse integrates **real-time simulation**, **dynamic predictions**, **live polls**, and **Generative AI commentary** into a single cohesive experience.

🖥️ **Live App URL:** [CricPulse Fan Hub](https://ais-dev-bqedlzjy6c4bkztcpmn4x2-259009699296.asia-east1.run.app)

---

## 💡 The Second-Screen Problem & Our Solution
During massive IPL tournament broadcasts, viewers have their smartphones in hand—scrolling social media, checking fantasy leagues, or debating matches online. 

**CricPulse binds these dispersed behaviors into one central hub:**
* **Passive ➡️ Active**: Instantly make live-prediction picks on the upcoming ball to earn leaderboard points.
* **Solitary ➡️ Shared**: Enter team chats that adapt dynamically to match momentum, color themes, and cheer states.
* **Static ➡️ Intelligent**: Provide fans with a virtual "Commentary Box" that breaks down simulated match actions in real-time.

---

## ⭐ Core Pillars & Visual Features

### 🎙️ 1. Live Gemini AI Commentary (Ravi Shastri & Harsha Bhogle Mode)
* **Generative Sports Analyst**: Built on `gemini-3.5-flash` via the `@google/genai` SDK. Translates complex live game states (runs, overs, wickets, bowler economy, batsman runs, recent deliveries) into high-energy **Hinglish** commentary.
* **⚡ Graceful Hype Engine Fallback**: In production, public API quotas often experience 429 Rate Limits. CricPulse features a built-in local heuristic parser. If `status === 429` is detected, the app activates the **Local Hype Engine**, generating immediate high-voltage commentary without interrupting the user experience or throwing unsightly console errors.

### 🎯 2. Live Interactive Prediction Engine
* **Real-Time Locks**: Predict the outcome of the very next delivery (Dot ball, Boundary, Single, Wicket) or over.
* **Automated Settlement**: The moment the next ball is simulated, predictions auto-evaluate instantly. Correct answers credit points to the user's account and activate **hot-streak multiplier animations**.

### 📊 3. Real-Time Ball-by-Ball Simulator
* **Interactive Controls**: Features a live simulation toggler (Start, Pause, Reset) allowing developers and judges to speed up, slow down, or pause the match feed.
* **Match Moments Log**: Highlights major milestones such as "🔥 Sixer!", "🔴 WICKET!", or "🏏 Boundary" dynamically in the event feed.

### 💬 4. Team-First Fan Zone Chat & Polls
* **Adaptive Team Theming**: Colors, message boxes, and user cards morph to match the selected franchise (e.g., Royal Gold for CSK, Electric Purple for KKR, Midnight Blue for Mumbai).
* **Live Voting Pools**: Fast-react to breaking polls like "Who will win the Super Over?" with immediate, stylized percentage results.

### 📱 5. Responsive UX Mastery & Sleek Typography
* **Responsive Visual Viewports**: Optimized desktop display with a balanced layout paired with a native-behaving **Mobile Bottom Navigation Bar** for dual-axis ergonomics.
* **Fluid Page Transitions**: Seamless, low-friction, hardware-accelerated movement between views managed by `motion/react` (Framer Motion).
* **Typography & Contrast**: Clean Inter font paired with high-contrast, eye-safe slate backgrounds and vibrant primary team brand accents.

---

## 👑 Pitch Guide: How to Impress the Judging Panel

If presenting this to a hackathon judging panel, highlight these **five structural details** to score highest:

1. **🔒 Secure, Secret-Guided API Architecture (No Client Leakage)**
   * *The Pitch*: "We did not take shortcuts by calling Gemini directly from the client. The browser never sees our `GEMINI_API_KEY`. Instead, we built a secure Express backend proxy that feeds the game's state context, structures the prompting parameters, and shields all workspace credentials."

2. **🛡️ Resilient System Design (The local Quota Failure Fallback)**
   * *The Pitch*: "Generative models can throw 429 limits or hit service outages under heavy traffic. To ensure infinite uptime in a stadium full of users, we created a localized **Commentary Fallback Parser**. If the model throttles or fails, our local commentary engine instantly takes over, keeping the crowd hyped with Ravi-Shastri-inspired text seamlessly."

3. **🕹️ Zero-Latency State Synchronization**
   * *The Pitch*: "Our state machine connects the Match Simulator directly with user Predictions. There is zero delay: the moment the ball is simulated, the React context settles predictions, increments points, triggers sound-and-visual streak multiplier indicators, and unlocks the next betting board."

4. **♿ Universal Accessibility & Responsive Adaptations**
   * *The Pitch*: "A second-screen app is worthless if fans can't use it on their phones while watching TV. CricPulse features an adaptive dual layout. On desktop, it showcases a wide, high-density dashboard. On mobile, it switches to a thumb-optimized layout with a floating bottom navigation bar and gesture-safe scroll components."

5. **⚡ Bundled Micro-Services & Build Hygiene**
   * *The Pitch*: "Our production build system uses `esbuild` to bundle our Express server into a single, self-contained `dist/server.cjs` file. This minimizes container cold-starts, guarantees package isolation on Cloud Run, and makes development incredibly fast."

---

## ⚙️ Local Setup & Sandbox Run Guide

To run CricPulse locally on your machine, follow these simple steps:

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher)
* **NPM** (v9.0.0 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Secrets
Create a `.env` file in the root of the project (copying `.env.example`):
```env
# Server Secrets (Kept hidden from the client)
GEMINI_API_KEY="your_google_gemini_api_key_here"

# Client Variables (Exposed to Vite bundle)
VITE_APP_URL="http://localhost:3000"
```

### 4. Direct Development Run
To boot up the dynamic development server (running Node Express and hot Vite proxy together on **port 3000**):
```bash
npm run dev
```

### 5. Production Build & Execution
Compile the React front-end assets and bundle the TypeScript Express backend:
```bash
npm run build
```
Start the high-performance local production server:
```bash
npm run start
```

---

## 🐳 Technic Stack Overview

| Layer | Technologies & Frameworks | Description |
|---|---|---|
| **Frontend Frame** | React 19, TypeScript, Vite | Ultra-fast client compilation & rendering. |
| **Styling & Fluidity** | Tailwind CSS v4, Lucide Icons | Responsive UI framework with visual presets. |
| **Animations** | `motion/react` | Hardware-accelerated transitions & streak states. |
| **Backend Engine** | Node.js, Express, TSX | Secure proxy and static router on Port 3000. |
| **AI Integration** | `@google/genai` (Gemini 3.5 Flash) | Context-aware sports commentator. |
| **Compiler / Bundler** | `esbuild` | Compiles raw TypeScript server, outputting `dist/server.cjs`. |

---
*Created with 🏏 Passion for Cricket Fans Worldwide.*
