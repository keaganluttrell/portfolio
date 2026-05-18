# PORTFOLIO REDESIGN BRIEF

## Your Task
Redesign and rebuild the portfolio site at /home/keagan/repos/portfolio. This is a完整的 UI overhaul — new color palette, new visual identity, Framer Motion animations, while keeping the existing content and Astro structure.

## Current State
- Astro 6 static site with React support (just added `@astrojs/react`)
- 3 pages: index (home), about, projects
- 1 layout: BaseLayout.astro (all CSS is inline <style> in the layout)
- Vanilla CSS, dark zinc palette, no JavaScript, no animations
- Deployed on Cloudflare Pages, auto-deploys on push to main
- Content is already solid — don't change the copy

## Target Brand Identity
- **Palette: Navy and Gold** — high-end, trusted, premium feel
  - Primary background: deep navy (not pure black)
  - Gold/amber as accent color for links, CTAs, highlights, interactive states
  - Text: warm whites/ivories on navy (avoid pure white on dark — too harsh)
  - Cards/surfaces: slightly lighter navy with subtle borders
- **Typography**: Keep the monospace + sans-serif pairing. Consider a more distinctive monospace (JetBrains Mono, or keep SF Mono/Fira Code). Consider a slightly larger type scale — current h1 at 1.75rem is safe but could have more presence.
- **Visual identity**: 
  - The "kl" logo mark in the nav should feel more intentional — consider a custom SVG monogram or a more refined text treatment
  - Subtle gold gradients or gold-tinted shadows for depth
  — Clean, minimal, but with moments of delight
  - This should feel like it belongs to someone who operates at a Director level

## Motion & Interaction (Framer Motion)
Add tasteful, purposeful animations — not gratuitous:
- Page transitions: subtle fade + slide on initial load
- Cards: hover lift/shadow, entrance stagger
- Section labels and headings: fade-in on scroll into view
- Navigation: smooth underline or highlight transitions
- Logo: subtle hover animation (scale, or a gold shimmer)
- "Connect" links: hover state with gold underline draw
- Scroll-triggered reveals for sections (IntersectionObserver via Framer)
- Keep it performant — prefer `transform` and `opacity` animations only
- All animations should be subtle and fast (150-300ms)

## Technical Constraints
- Keep Astro as the framework — use React islands (`client:load` or `client:visible`) for interactive/motion components
- Keep the existing file structure (pages in src/pages/, layout in src/layouts/)
- Extract CSS from inline <style> in BaseLayout into a proper external stylesheet or CSS modules
- Keep all existing meta tags, OG tags, JSON-LD, robots.txt, sitemap.xml
- Keep the existing GitHub Actions deploy workflow unchanged
- Build must pass (`npm run build` must succeed)
- Static output only — no SSR

## What to NOT change
- Page content/copy (the text on all 3 pages is finalized)
- The deploy pipeline (.github/workflows/deploy.yml)
- robots.txt, sitemap.xml, favicon.svg, favicon.ico
- The astro.config.mjs integration setup (already has react())

## Suggested Approach
1. Read all existing files first (BaseLayout.astro, all 3 pages, astro.config.mjs, package.json)
2. Plan the navy/gold color palette (define CSS custom properties)
3. Create a global CSS file with the new design tokens
4. Update BaseLayout with new color variables and link to external CSS
5. Build React motion components (AnimatedSection, AnimatedCard, AnimatedNav)
6. Update each page to use motion components iteratively
7. Build and verify at each step
8. Final build + verify all 3 pages render correctly

## Color Palette Starting Point (adjust as you see fit)
```
--bg: #0a1628;           /* deep navy */
--bg-rgb: 10, 22, 40;
--surface: #112240;       /* slightly lighter navy */
--surface-2: #1a3a5c;     /* card hover state */
--border: #1e3a5f;        /* subtle blue borders */
--gold: #d4a843;          /* primary gold accent */
--gold-dim: rgba(212, 168, 67, 0.1);
--gold-glow: rgba(212, 168, 67, 0.15);
--text: #e8e0d4;          /* warm ivory */
--text-dim: #a09080;      /* muted warm */
--text-muted: #7a6b5c;    /* subtle warm */
```

## Final Check
After all changes:
1. Run `npm run build` — must succeed
2. Verify the site looks like a premium, high-end brand
3. Verify animations are smooth and subtle
4. Commit your changes to the repo
