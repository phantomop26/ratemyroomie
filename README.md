# Rate My Roommate

An NYU-only roommate ratings app with database-backed accounts and reviews.

## Stack

- Next.js App Router
- Prisma
- Postgres on Vercel

## Core flow

- Join with an `@nyu.edu` email
- Session cookie persists the account for return visits
- Users can create a roommate profile and post reviews
- Home page reads live data from the database

## Environment

Set `DATABASE_URL` before running locally or deploying to Vercel.

For email verification, also set:

- `SMTP_URL` for the mail provider connection string
- `EMAIL_FROM` for the sender address shown in outgoing verification emails
- `ALLOW_ANY_EMAIL=true` only for local testing outside the NYU domain

## Run locally

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Then open `http://localhost:3000`.# Rate My Roommate

An NYU-only roommate ratings demo inspired by Rate My Professor.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any local static server.

Example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## What it includes

- NYU email verification gate
- Roommate discovery board
- Rating submission form
- Local persistence for demo data
# ratemyroomie
