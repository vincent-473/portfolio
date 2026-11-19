# Darren Gendron — Portfolio

An interactive portfolio for a backend engineer, built with Next.js 16 (App Router), Tailwind CSS 4, and Motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Edit the content

Everything on the site reads from one file: `src/lib/data.ts` — profile, jobs, systems, skills, certifications.
Add your LinkedIn / GitHub URLs to `profile` there and the buttons appear in the contact section.
Update `PRESENT` in the same file occasionally so the career-trace durations stay current.

## What's in it

| Section | File | What it does |
| --- | --- | --- |
| Hero | `src/components/Topology.tsx` | Canvas simulation of an event-driven system; click to send traffic |
| Playground | `src/components/WorkerPool.tsx` | Live Go worker-pool simulation with sliders, load shedding, synced code |
| Experience | `src/components/Trace.tsx` | Career as a distributed-trace waterfall |
| Systems | `src/components/Systems.tsx` | Case-study cards with cursor spotlight and animated pipelines |
| Skills | `src/components/Skills.tsx` | Marquee, layered skill tabs, certifications |
| Contact | `src/components/Terminal.tsx` | A working shell (`help`, `whoami`, `curl /api/whoami`, …) |
| API | `src/app/api/whoami/route.ts` | The résumé as JSON: `curl <site>/api/whoami` |

## Deploy

Push to GitHub and import the repo at vercel.com, or run `npx vercel`.
