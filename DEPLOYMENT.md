# 🚀 CricPulse — Render Deployment & Production Guide

This guide describes how to deploy the **CricPulse IPL Second-Screen Fan Experience** application on **Render** effectively, maintaining optimal performance with strict environment variable security.

---

## 🔒 Security & Secrets Hygiene

Because CricPulse is a high-performance React SPA built with Vite:
1. **No Client Leakage**: All raw secret files (like `.env`) are ignored by Git under the rules of `.gitignore` (`.env*` is excluded).
2. **Safe Compilation**: Variables prefixing `VITE_` are exposed to the client bundle at build-time. Strictly sensitive server keys (like `GEMINI_API_KEY`) must **never** be prefixed with `VITE_` to prevent leakage in browser DevTools.

---

## 🖥️ Local Setup Instructions

Before pushing, verify your local configuration:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Secrets**:
   - Create a local `.env` file (copied from `.env.example`).
   - Add local development variables:
     ```env
     GEMINI_API_KEY="your_actual_developer_key"
     VITE_APP_URL="http://localhost:3000"
     ```

3. **Run Dev Environment**:
   ```bash
   npm run dev
   ```

4. **Prepare Production Build**:
   ```bash
   npm run build
   ```
   This compiles optimized production-ready HTML, CSS, and JS into the `/dist` directory.

---

## ☁️ Deployment on Render (Recommended)

Render offers two different patterns to host this application, depending on your preferred topology:

### Choice A: Render "Static Site" (Free & Highly Recommended for SPAs)
Since CricPulse compiles down to robust client-side React code, hosting as a Static Site is the fastest, cheapest, and most secure method.

1. **Connect Repository**: Sign in to [Render Console](https://dashboard.render.com/) and click **New > Static Site**. Connect your GitHub/GitLab repository.
2. **Build Configurations**:
   - **Name**: `cricpulse-ipl-experience`
   - **Branch**: `main` or `master`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. **Environment Credentials**:
   - Add any client-side environment configs under the **Environment** tab on Render.
   - Example: Key: `VITE_APP_URL`, Value: `https://cricpulse-ipl-experience.onrender.com`.
4. **Deploy**: Click **Create Static Site**. Render compiles and serves your build via a global CDN.

---

### Choice B: Render "Web Service" (With Node.js Runtime Server)
If your application scales to handle custom server-side routing or proxy endpoints in the future:

1. **Vite Dynamic Port Mapping**:
   Vite is configured to automatically serve on port `3000` via our configuration rules. If using a custom Express server structure:
   - Ensure the server binds directly to the address `0.0.0.0` on port `3000` or reads `process.env.PORT`.
2. **Build Configurations on Render**:
   - Create a **New > Web Service**.
   - Input **Build Command**: `npm i && npm run build`
   - Input **Start Command**: `npm run preview -- --port $PORT --host 0.0.0.0` (or `node server.ts` if node server routes exist).
3. **Hide API Keys**:
   - In Render Dashboard under **Environment**, define your active keys (such as `GEMINI_API_KEY`).
   - These variables remain secured in container shells, invisible from client clients.

---

## 📈 Optimization Best Practices
- **Compression**: Use Render's native Gzip/Brotli features on assets.
- **Cache Hedging**: Render Static Sites automatically cache assets under immutable cache-control headers, ensuring milliseconds loading speeds for global fans.
