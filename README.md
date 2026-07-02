# ⚡ AutoLog

**AI-powered changelog automation. Push to GitHub → beautiful public changelog, automatically.**

## How it works

1. Connect your GitHub repo via webhook
2. Every `git push` triggers AutoLog
3. GPT-4o-mini reads your commits and writes a clean changelog entry
4. Public page at `/log/your-app` auto-updates

## Tech Stack

- **Next.js 15** (App Router)
- **Supabase** (Postgres + Auth)
- **OpenAI** gpt-4o-mini
- **Stripe** subscriptions
- **Vercel** deployment

## Setup

1. Clone this repo
2. Copy `.env.example` → `.env.local` and fill in your keys
3. Run the Supabase migration from `supabase/migrations/`
4. `npm install && npm run dev`
5. Deploy to Vercel

## Pricing

- **Free**: 1 repo, last 10 entries
- **Pro ($19/mo)**: Unlimited repos, full history
