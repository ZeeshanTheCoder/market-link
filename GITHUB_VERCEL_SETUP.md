# MarketLink — GitHub + Vercel Setup

## 1. GitHub
Create a new empty GitHub repository, then from this folder run:

```bash
git init
git branch -M main
git add .
git commit -m "MarketLink final"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Do not commit any `.env` file or secrets.

## 2. Vercel Frontend
In Vercel: Add New Project → import the GitHub repository.

Set **Root Directory** to:

`marketlink-client`

Vercel should detect Vite automatically.

Build command:

`npm run build`

Output directory:

`dist`

Install command:

`npm install`

The `vercel.json` in `marketlink-client` enables SPA deep-link routing.

## 3. Frontend API Environment Variable
After your Express backend is deployed somewhere public, set this Vercel Environment Variable:

`VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN/api`

Then redeploy.

A Vercel-hosted frontend cannot call a backend that only exists on your own computer at `localhost:5000`.
