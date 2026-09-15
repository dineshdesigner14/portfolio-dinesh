# Dinesh Kannan — Portfolio (Next.js)

Cloud & DevOps engineering portfolio built with Next.js 15, React 19, TypeScript,
Tailwind CSS v4, and Framer Motion. Flagship project: **D-Worker**.

## What's included in this pass

- Loading screen with boot sequence
- Floating glass navbar — hide on scroll down, reveal on scroll up, active section
  underline, magnetic Resume button
- Hero with split typography (`CLOUD` / portrait / `ENGINEER`), floating portrait,
  typing animation, and a cursor-spotlight infrastructure reveal background
  (two-layer radial-mask effect, rAF-smoothed)
- About with fade/blur reveal and animated counters
- Engineering Journey — scroll-driven SVG path draw with a vehicle marker
  following the path and milestone glow
- Skills — tilt + glow hover cards
- Experience — expandable timeline
- D-Worker showcase — boot animation + interactive hub-and-spoke architecture
  diagram with animated connection lines and traveling packets
- **Platform Modules** — the signature interaction: cards start scattered
  (random position/rotation/scale/blur) and spring-assemble into the grid as
  the section enters the viewport, reversing when you scroll away. Real spring
  physics via Framer Motion (`type: "spring"`), not manual easing math.
- Projects, Certifications, Contact (working form UI + success state), Footer

## Not yet built (left as clear next steps)

- GSAP-specific effects beyond what Framer Motion already covers
- Lenis is wired in globally, but no pinned/sticky-section scroll storytelling yet
- GitHub Activity section (contribution graph / pinned repos / commit feed) —
  needs a GitHub API integration
- Canvas-based particle system (current background uses SVG, which is
  lighter-weight and easier to keep at 60fps)

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Before deploying

1. Replace `/public/profile.jpg` with your real photo (add the file — it's
   referenced but not included in this scaffold)
2. Add your real resume PDF at `/public/resume.pdf`
3. Edit `lib/data.ts` — this is the single source of truth for all content
   (bio, skills, experience, projects, certifications, contact links, GitHub
   URLs). No content lives inside components.
4. Update social/contact links in `CONTACT` inside `lib/data.ts`

## Deploy

This is a standard Next.js app — deploys cleanly to **Vercel**:

```bash
npx vercel
```

or connect the GitHub repo directly in the Vercel dashboard.

## Project structure

```
app/            → routing, layout, global CSS
components/     → one component per section (no duplicated code)
lib/data.ts     → all content as typed data
public/         → images, resume PDF
```
