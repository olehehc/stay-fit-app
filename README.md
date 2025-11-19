# StayFit App

> A full‑stack Next.js app for tracking trainings and meals.

---

## Summary

StayFit App is a personal/portfolio project implemented with the Next.js `app/` router. It includes user authentication, a local SQLite database for data persistence, UI components (shadcn/ui + Radix + some MUI), meal/recipe management, and workout tracking. The project is aimed at demonstrating full‑stack skills: routing, server code, database access, authentication, and a polished UI.

---

## Key features

- Email/password user authentication (bcrypt + JWT)
- Persistent storage with SQLite (`database.db`) using `better-sqlite3`
- CRUD for meals, exercises and trainings
- Training sets tracking (performed sets history)
- Image handling (uploads to S3 compatible storage via AWS keys)
- Modern UI (Tailwind, Radix, shadcn/ui components)

---

## Tech stack

- Next.js (App Router)
- Node.js (recommend Node 18+)
- Tailwind CSS
- shadcn/ui + Radix UI + @mui
- better-sqlite3 for a simple server‑side DB
- bcryptjs for password hashing
- JWT for session tokens
- AWS S3 for image hosting

---

## Getting started (local development)

1. Install Node.js (v18 or later recommended).
2. Clone or extract the project and open it in your terminal.

```bash
# from project root
npm install
# or
# yarn
```

3. Create a `.env` file in the project root. Example `.env` (required values):

```
# JSON Web Token secret used to sign auth tokens
JWT_SECRET=supersecret

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket-name
NEXT_PUBLIC_AWS_IMAGE_HOSTNAME=https://your-bucket.s3.amazonaws.com
```

4. Run the dev server:

```bash
npm run dev
# or
# yarn dev
```

Open http://localhost:3000 in your browser.

> The app uses a local `database.db` SQLite file stored in the project root. On first run the app will create the database and required tables automatically.

---

## Available scripts

- `npm run dev` - run Next.js in development mode (Turbopack enabled)
- `npm run build` - build for production
- `npm run start` - start production server
- `npm run lint` - run linter

---

## Environment variables (explanation)

- `JWT_SECRET` - **required**. Secret string for signing JWT tokens. Keep this safe and never commit it.
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_S3_BUCKET` - optional, used if you want image uploads to persist to S3. If not set, images may be stored/served differently depending on code paths.
- `NEXT_PUBLIC_AWS_IMAGE_HOSTNAME` - optional public hostname for serving uploaded images.

---

## Database

This project uses a local SQLite database (`database.db`) created and managed by `lib/db.js` using `better-sqlite3`. On first run the file creates these tables: `users`, `meals`, `meal_favorites`, `exercises`, `trainings`, `training_sets`, and `performed_sets`. Foreign keys and `ON DELETE CASCADE` are enabled, slugs provide unique public identifiers, and `performed_sets` records actual workout data with timestamps.

---

## Deployment notes

- This project uses a filesystem SQLite DB and `better-sqlite3`, which generally requires a stateful server. Serverless platforms (like Vercel serverless functions) make persistent local files unavailable or ephemeral. For production deploys, consider:
  - Replace SQLite with Postgres (e.g., Supabase, Neon, Heroku Postgres) and update DB access code.
  - Or deploy to a serverful host (DigitalOcean, Railway in container mode, VPS) where the filesystem persists.
- If you use AWS S3 for images, make sure to set the AWS env vars in the deployment environment and set appropriate bucket CORS/policy rules.

---

## Project structure (high‑level)

```
/ (project root)
├─ app/                # Next.js app routes + pages
├─ components/         # UI components (shadcn + Radix + custom)
├─ lib/                # server utilities: db.js, auth.js, server helpers
├─ hooks/              # client hooks (e.g. useExercises)
├─ public/             # static assets
├─ database.db         # (created at runtime) SQLite DB file
├─ package.json
├─ tailwind.config.js
└─ ...
```

---

## Security & best practices

- Never commit `.env` or secrets to source control. Add `.env` to `.gitignore`.
- Keep `JWT_SECRET` and AWS credentials private.
- For production, use HTTPS and secure cookie settings if you switch to cookie-based auth.

---

## Common improvements / TODOs (for future iteration)

- Replace SQLite with a managed DB for production readiness (Postgres)
- Add tests (unit & integration) for core flows (auth, recipe CRUD)
- Improve access control (roles, ownership checks) for API routes
- Add image upload progress and optimistic UI for media
- Provide seed script for demo content
