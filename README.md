# Next.js personal scheduler

This repository contains a personal-use appointment scheduler built with Next.js, Prisma, and PostgreSQL.

## Quick start

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

## Services

- Frontend: Next.js app router
- Backend: API routes in `/app/api`
- Database: PostgreSQL via Prisma ORM

## Local database with Docker

```bash
docker compose up -d
```

Then verify via:

```bash
npx prisma studio
```

## Notes

The project is designed for personal reminders and task tracking. You can extend it later with recurring events, email reminders, or calendar views.
