# Interswitch Discovery Series registration

Vite + React frontend. Postgres and email run as small Vercel serverless functions in `/api`, so there is no separate server to host.

## 1. Set your secrets

Edit `api/_lib/config.js` (hardcoded, as requested):

- `DATABASE_URL` your Postgres connection string
- `GMAIL_USER` and `GMAIL_APP_PASSWORD` the Gmail account and its Google App Password
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` the dashboard login
- `TOKEN_SECRET` any long random string

The `registrations` table is created automatically on first use.

Because the secrets sit in the code, keep the repository private.

## 2. Logos

Replace `public/logos/interswitch.svg` and `public/logos/lcu.svg` with the official files. If you use PNG, update the paths in `src/config.js`.

## 3. Deploy

Push to a private GitHub repo and import it in Vercel (framework: Vite). Optional: set `SITE_URL` in Vercel so `sitemap.xml` uses your custom domain.

## Run locally

```
npm install
npx vercel dev
```

(`npm run dev` serves only the frontend, the `/api` routes need `vercel dev`.)

## Pages

- `/` registration (main page)
- `/dashboard` organiser login, search, level filter, CSV export, delete
