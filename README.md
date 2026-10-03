# Personal Appointment Scheduler

A personal-use Next.js appointment scheduler with PostgreSQL backend and Prisma ORM.

## Features

- Add appointments with title, date, time, notes, and reminder timing
- View upcoming, missed, and completed items in one dashboard
- Delete appointments
- Mark appointments as completed or upcoming
- PostgreSQL database for persistent storage

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL (using Docker):
   ```bash
   docker compose up -d
   ```

4. Push Prisma schema to database:
   ```bash
   npx prisma db push
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file with:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/appointments?schema=public"
```

## Vercel Deployment

1. Push code to GitHub
2. Connect repo to Vercel
3. Add `DATABASE_URL` environment variable in Vercel project settings
4. Deploy

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma studio` - Open Prisma Studio GUI

## Database Schema

Appointments table with:
- id (primary key)
- title
- description
- appointmentDate
- reminderMinutes
- status (upcoming/completed/missed)
- createdAt, updatedAt
