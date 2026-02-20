# Environment Setup Guide

## Understanding the Two Environments

### 1. **Local Development** (running `npm run dev` on your machine)
- Uses a `.env.local` file in `speech-to-text-mvp/` directory
- This file is gitignored and stays on your machine
- You need to create it manually with your actual API keys

### 2. **GitHub Pages Deployment** (the live site)
- Uses GitHub Secrets you've already configured ✅
- Already set: `VITE_DEEPGRAM_API_KEY`, `VITE_GROQ_API_KEY`
- Injected at build time by the GitHub Actions workflow

---

## Local Development Setup

**Create `/speech-to-text-mvp/.env.local`** with your actual API keys:

```bash
# Deepgram API Key (for STT + English TTS)
VITE_DEEPGRAM_API_KEY=your_actual_deepgram_key

# Groq API Key (for LLM chat)
VITE_GROQ_API_KEY=your_actual_groq_key

# Google Cloud TTS API Key (for Finnish TTS — optional for now)
VITE_GOOGLE_TTS_KEY=your_actual_google_key
```

**Get your API keys:**
- **Deepgram**: https://console.deepgram.com/ (you already have this)
- **Groq**: https://console.groq.com/ → Create account → API Keys (free tier is generous)
- **Google TTS**: https://console.cloud.google.com/ → Create project → Enable "Cloud Text-to-Speech API" → Credentials → Create API Key

---

## Deployment Setup (Already Done ✅)

You've already added GitHub Secrets correctly. When you push code, GitHub Actions will:
1. Pull the secrets from Settings → Secrets
2. Inject them as environment variables during `npm run build`
3. Deploy to GitHub Pages

To add the Google TTS key for deployment later:
1. Go to your repo → Settings → Secrets and variables → Actions
2. Add `VITE_GOOGLE_TTS_KEY` as a new secret
3. Update the workflow to include it (I'll do this when we implement Finnish TTS)

---

## Quick Start

1. Create `.env.local` file in `speech-to-text-mvp/` directory
2. Copy your Deepgram key and Groq key into it (same values you added to GitHub Secrets)
3. Run `npm run dev` — the error should be gone!
