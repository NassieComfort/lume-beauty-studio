# Lume Beauty Studio

Single-business appointment booking web app for a lash & beauty studio.

## Stack
- **Frontend:** React + TypeScript + Tailwind CSS (Vite)
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT
- **Deploy:** Vercel (frontend), Render/Railway (backend)

## Structure
```
lume-beauty-studio/
├── frontend/     # React + TS + Tailwind app
└── backend/      # Express + MongoDB API
```

## Getting started

### 1. Push to GitHub
```bash
cd lume-beauty-studio
git init
git add .
git commit -m "Initial commit: project foundation"
gh repo create lume-beauty-studio --private --source=. --push
# or manually create the repo on GitHub, then:
# git remote add origin https://github.com/<you>/lume-beauty-studio.git
# git branch -M main
# git push -u origin main
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in your MongoDB URI + JWT secret
npm run dev
```
Visit `http://localhost:5000/api/health` — you should see `{ "status": "ok" }`.

Set your real environment variables in Render (or your local `.env`) only. Do not commit real secrets to Git. Example files are safe to version.

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # optional for local development
npm run dev
```
Set `VITE_API_BASE_URL` in Vercel or your local `.env` to your Render backend URL, for example:
```bash
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```
Visit `http://localhost:5173`.
