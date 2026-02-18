# 🚀 Bike Rental System — Deployment & CI/CD Guide

## Architecture Overview

```
GitHub (push to main)
    │
    ├──► GitHub Actions CI/CD
    │       ├── Build & Test Backend (Maven)
    │       ├── Build & Test Frontend (npm)
    │       ├── Deploy Frontend → Vercel
    │       └── Deploy Backend  → Render
    │
    ├──► Vercel (Frontend - React + Vite)
    │       https://your-app.vercel.app
    │
    └──► Render (Backend - Spring Boot)
            https://your-api.onrender.com
```

---

## Part 1: Deploy Frontend to Vercel

### Step 1 — Create a Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up with your **GitHub** account

### Step 2 — Import the Project
1. Click **"Add New…"** → **"Project"**
2. Select your **Bike-Rental-System** repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: Click **Edit** → type `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **"Deploy"**
5. Wait for the build to finish — you'll get a URL like `https://bike-rental-system.vercel.app`

### Step 3 — Get Vercel Secrets (for CI/CD)
1. **Vercel Token**:
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Click **"Create"**, name it `github-actions`, click **"Create Token"**
   - **Copy the token** — you'll need it later

2. **Org ID & Project ID**:
   - Open your terminal and run:
     ```bash
     cd frontend
     npx vercel link
     ```
   - Follow the prompts to link to your Vercel project
   - Open the generated file `.vercel/project.json`
   - Copy the values of `orgId` and `projectId`

---

## Part 2: Deploy Backend to Render

### Step 1 — Create a Render Account
1. Go to [render.com](https://render.com) and sign up with your **GitHub** account

### Step 2 — Create a New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your **Bike-Rental-System** repository
3. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `bike-rental-backend` |
   | **Region** | Choose nearest to you |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Docker` |
   | **Plan** | Free |

4. Add environment variable:
   - Key: `SPRING_PROFILES_ACTIVE`, Value: `prod`
5. Click **"Create Web Service"**
6. Wait for the first deploy — you'll get a URL like `https://bike-rental-backend.onrender.com`

### Step 3 — Get Render Deploy Hook (for CI/CD)
1. Go to your Render service dashboard
2. Click **"Settings"** tab
3. Scroll down to **"Deploy Hook"**
4. Click **"Create Deploy Hook"**, name it `github-actions`
5. **Copy the URL** — you'll need it later

---

## Part 3: Set Up GitHub Actions CI/CD

### Step 1 — Add Secrets to GitHub
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** and add each one:

   | Secret Name | Value | From |
   |-------------|-------|------|
   | `VERCEL_TOKEN` | Your Vercel token | Part 1, Step 3 |
   | `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` | Part 1, Step 3 |
   | `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` | Part 1, Step 3 |
   | `RENDER_DEPLOY_HOOK_URL` | Deploy hook URL | Part 2, Step 3 |

### Step 2 — Push to GitHub
```bash
cd /Users/leng/Documents/GitHub/Bike-Rental-System
git add .
git commit -m "Add CI/CD pipeline with Vercel and Render deployment"
git push origin main
```

### Step 3 — Verify the Pipeline
1. Go to your GitHub repo → **"Actions"** tab
2. You should see a workflow run in progress: **"CI/CD - Deploy to Vercel & Render"**
3. The pipeline runs these jobs:

   ```
   ✅ Backend - Build & Test     (Maven build + tests)
   ✅ Frontend - Build & Test    (npm build)
       ↓ both pass
   ✅ Deploy Frontend to Vercel  (production deploy)
   ✅ Deploy Backend to Render   (triggers deploy hook)
   ```

---

## Part 4: How the CI/CD Works

### On Push to `main`
| Step | What happens |
|------|-------------|
| 1 | GitHub Actions detects the push |
| 2 | **Backend job**: Sets up JDK 17, runs `mvnw clean verify` |
| 3 | **Frontend job**: Sets up Node 20, runs `npm ci` + `npm run build` |
| 4 | If both pass → **Deploy frontend** to Vercel production |
| 5 | If both pass → **Trigger Render** deploy hook (rebuilds Docker image) |

### On Pull Request to `main`
| Step | What happens |
|------|-------------|
| 1 | Same build & test for both backend and frontend |
| 2 | If both pass → **Preview deployment** to Vercel (temporary URL) |
| 3 | Bot **comments the preview URL** on the PR |
| 4 | Backend is **not deployed** (only on merge to main) |

### Pipeline Files

| File | Purpose |
|------|---------|
| [ci-cd.yml](file:///.github/workflows/ci-cd.yml) | GitHub Actions workflow |
| [vercel.json](file:///frontend/vercel.json) | Vercel frontend config |
| [Dockerfile](file:///backend/Dockerfile) | Docker build for Render |
| [render.yaml](file:///render.yaml) | Render infrastructure blueprint |

---

## Part 5: Connect Frontend to Backend

After both are deployed, update the frontend API base URL:

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://bike-rental-backend.onrender.com/api` *(your Render URL)*
3. In your frontend code, use:
   ```js
   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
   ```
4. Redeploy the frontend (push a commit or trigger manually in Vercel)

---

## Quick Reference

| Service | Dashboard | Local URL | Production URL |
|---------|-----------|-----------|---------------|
| Frontend | [vercel.com/dashboard](https://vercel.com/dashboard) | http://localhost:5173 | `https://your-app.vercel.app` |
| Backend | [dashboard.render.com](https://dashboard.render.com) | http://localhost:8080 | `https://your-api.onrender.com` |
| CI/CD | GitHub → Actions tab | — | Auto-runs on push |

> [!TIP]
> **Render free tier** spins down after 15 minutes of inactivity. The first request after idle takes ~30 seconds. Consider upgrading to the Starter plan ($7/mo) for always-on.
