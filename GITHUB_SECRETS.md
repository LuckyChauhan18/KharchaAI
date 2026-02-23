# GitHub Secrets for KharchaAi 🔐🛡️

To keep your application secure while deploying from GitHub, you should store these sensitive variables in your **GitHub Repository Secrets**.

## 📍 Where to add them?
Go to your GitHub repo -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

## 🔑 Required Secrets

### 1. Database (Supabase)
- `SUPABASE_URL`: Your project URL (e.g., `https://xyz.supabase.co`).
- `SUPABASE_ANON_KEY`: Your project's anonymous public key.

### 2. AI Service
- `SARVAM_API_KEY`: Your Sarvam.ai API key for the AI extractions.

### 3. Build Variables (For Frontend)
- `VITE_SUPABASE_URL`: Same as `SUPABASE_URL`.
- `VITE_SUPABASE_ANON_KEY`: Same as `SUPABASE_ANON_KEY`.

## ⚠️ Important Note
**NEVER** commit your actual password or API keys to the code. The `.gitignore` file I created will prevent you from accidentally uploading your `.env` files.

If you are deploying to **AWS EC2**, you will also need to manually create the `.env` files on the server using these same values.

---
Built with ❤️ by Antigravity AI for Lucky. 🛋️🚀🔍✨
