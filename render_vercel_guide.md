# Render & Vercel Deployment Guide: KharchaAi ☁️🌐

This guide explains how to deploy **KharchaAi** using **Render** for the backend and **Vercel** for the frontend.

## 🏗️ Architecture
- **Backend**: Hosted on Render (Docker container).
- **Frontend**: Hosted on Vercel (Vite static build).
- **Database**: Supabase (Cloud).

---

## 🚀 Step 1: Backend on Render
1.  Log in to [Render](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Configuration**:
    - **Name**: `kharcha-backend`
    - **Runtime**: `Docker`
    - **Dockerfile Path**: `backend/Dockerfile`
    - **Build Context**: `.` (Crucial! Keep it as the root)
5.  **Environment Variables**:
    - Add everything from `GITHUB_SECRETS.md` (Supabase, Sarvam API Key).
    - `PORT`: `5001`.
    - `MCP_SERVER_COMMAND`: `python3 /app/mcp-server/mcp_server.py`.

---

## 🎨 Step 2: Frontend on Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New** -> **Project**.
3.  Connect your GitHub repository.
4.  **Edit Settings**:
    - **Root Directory**: `frontend`.
    - **Build Command**: `npm run build`.
    - **Output Directory**: `dist`.
5.  **Environment Variables**:
    - `VITE_SUPABASE_URL`: (Your URL).
    - `VITE_SUPABASE_ANON_KEY`: (Your Key).
    - `VITE_API_URL`: Paste your **Render Web Service URL** (e.g., `https://kharcha-backend.onrender.com`).

---

## 🔗 Step 3: Troubleshooting CORS
Since the frontend and backend are on different domains, the backend must allow the Vercel URL.
- I have already configured `server.js` to allow all origins (`app.use(cors())`), so it should work out of the box!

---
Built with ❤️ by Antigravity AI for Lucky. 🛋️🚀🔍✨
