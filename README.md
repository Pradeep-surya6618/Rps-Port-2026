# Pradeep Surya — Portfolio 2026

Cinematic single-page portfolio built with Next.js (App Router), GSAP + ScrollTrigger and Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.com`) before deploying so Open Graph, the
sitemap and `robots.txt` use absolute URLs.

## Structure

```
src/
  app/                  layout (fonts, metadata), page, robots, sitemap, icon
  data/                 all content — profile, experience, projects, skills, social, navigation
  lib/animations/       gsap registration, Lenis ↔ ScrollTrigger sync, parallax / reveal / magnetic helpers
  lib/effects/          Loki-style lightning generator and the green-magic WebGL wipe
  components/
    intro/              IntroLoader — name forged in metal, lightning, green-magic reveal
    cursor/             LightningCursor — glowing core with a lightning trail
    animation/          Parallax, Reveal, RevealText, Magnetic, ScrollProgress
    hero/               Hero + background layers, portrait, tech strip, info rail, socials, HeroScene (motion)
    sections/           About, Experience, Projects, TechStack, Philosophy, Education, Contact (+ their scenes)
    layout/             Navbar, Footer
```

Content lives in `src/data`; sections map over it, so adding a project or job is a data change.

## Motion rules

- One scroll system: Lenis runs on GSAP's ticker and feeds `ScrollTrigger.update`.
- Markup stays server-rendered; small client "scene" components find layers by `data-*` attributes.
- Every scene uses `gsap.matchMedia`, so mobile gets lighter parallax and `prefers-reduced-motion`
  gets static layouts, no custom cursor, no lightning and a short fade instead of the intro.
- The intro plays in full once per browser session and in a shortened form after that.

## Assets

- `public/images/profile/hero.png` — background-removed cut of `public/images/New-Rps-Hero_img.png` (pixels unchanged).
- `public/images/hero-mountains-fade.png` — the hero mountains: `Hero-Moun.png` with its left fade and dimming
  baked in (a runtime CSS mask on a moving full-screen layer cost GPU time on every frame).
- Project screenshots are in `public/projects`. Replace them in place to update the site.
- `public/pdf/PradeepSuryaCV.pdf` is served by the "Download CV" buttons.
