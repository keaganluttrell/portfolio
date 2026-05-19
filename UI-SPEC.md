# UI Spec — keagan.ai Premium Animation Upgrade

## Goal

Elevate the portfolio from "clean and functional" to "worldclass and premium." Every animation should feel intentional, polished, and expensive. The site should feel like it was built by someone who sweats the details — because it was.

## Design Principles

1. **Restraint over excess.** Every animation earns its place. If it doesn't add to the experience, cut it.
2. **Performance first.** 60fps or don't bother. No jank. No layout thrashing. `transform` and `opacity` only for animated properties.
3. **Respect the user.** `prefers-reduced-motion` disables all non-essential animation. No autoplay. No seizure triggers.
4. **Desktop-first polish, mobile-first usability.** Premium effects on desktop, graceful degradation on mobile. Never break functionality for animation.
5. **The 1.5-second rule.** Page load orchestration completes within 1.5s. Scroll animations are snappy (200-400ms). Nothing feels sluggish.
6. **Personality without gimmick.** A few moments of delight (live status pill, easter egg) — but never at the cost of professionalism.

## Stack

- **Astro 6.x** — MPA with `<ClientRouter />` for cross-document view transitions
- **React 19.x** — Interactive components only (animation islands)
- **Framer Motion 12.x** — All React-based animation
- **CSS** — Grain overlay, marquee, cursor spotlight, gradient mesh (no JS needed)
- **Lenis** — Smooth scroll library, conservatively configured

---

## Phase 1: Foundation (Highest Impact)

### 1.1 — Lenis Smooth Scroll

**What:** Replace native scroll with smooth inertia scrolling. Single biggest "premium feel" upgrade.

**Implementation:**
- Install `lenis` (package was renamed from `@studio-freight/lenis`)
- Initialize in a `client:load` `LenisProvider` component mounted in `BaseLayout.astro`
- Lenis 1.1+ integrates natively with Framer Motion's `useScroll`
- RAF-based, 60fps, ~3KB gzipped

**Config (conservative — trackpad-friendly):**
```ts
{
  lerp: 0.08,           // light touch, not sluggish
  duration: 1.0,        // for scroll-to calls
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  syncTouch: false,     // native scroll on mobile
}
```

**Mobile:** Lenis auto-disables on touch devices with `syncTouch: false`. Native scroll preserved.

**Trackpad considerations:** `lerp: 0.08` keeps it responsive. We're not hijacking scroll velocity, just smoothing the easing curve.

### 1.2 — Animated Film Grain Overlay

**What:** Subtle animated noise texture over the entire viewport. Makes the dark theme feel organic instead of flat. The secret sauce on sites like DayTrip.

**Implementation:**
- Pure CSS, zero JS
- `<body>::after` pseudo-element with a noise texture background image
- `background-size: 300%` for movement range
- `@keyframes grain` — 8 frames with random translate offsets at ~12.5% intervals
- `animation: grain 8s steps(10) infinite`
- `opacity: 0.035` — very subtle (lower than typical 0.06 because our bg already has gradients)
- `pointer-events: none`, `position: fixed`, `inset: -50%`
- `z-index: 9999` — above everything but doesn't block interaction
- `mix-blend-mode: overlay` for richer integration with the gold/navy palette

**Reduced motion:** Static grain remains, animation disabled.

**Asset:** 256x256 PNG of monochrome noise texture, ~2KB.

### 1.3 — Clip-Path Scroll Reveals

**What:** Replace basic `slideUp` / `fadeIn` reveals with directional clip-path animations. Elements get "wiped" into view. The #1 technique on Awwwards-winning sites right now.

**Implementation:**
- New Framer Motion variants in `motion.ts`: `clipReveal` family
- `clipPath: inset(100% 0 0 0)` → `inset(0 0 0 0)` (bottom-to-top, default)
- Directional variants: `clipUp`, `clipDown`, `clipLeft`, `clipRight`, `clipDiagonal`
- Duration: 600ms (slightly longer than current 400ms — reveals need air)
- Ease: `[0.22, 1, 0.36, 1]` (decelerate)
- Trigger: `whileInView` with `viewport: { once: true, amount: 0.2 }`
- Stagger delay per sibling: 80ms

**Component:** New `AnimatedReveal.tsx` for hero/section headers. Keep `AnimatedSection` for paragraph blocks (uses a softer `clipUp` variant by default).

### 1.4 — Scroll-Linked Hero Text Reveal

**What:** Hero headline reveals word-by-word as the user scrolls down the first 30vh. Directly tied to scroll position — not just "on enter viewport." Immersive and unmistakably premium.

**Decision recorded:** Chose scroll-linked over page-load orchestration for the hero. Page-load orchestration applies to nav + section labels only.

**Implementation:**
- New `TextReveal.tsx` component
- Split headline into words, each wrapped in `<span>` with `overflow: hidden`
- Inner span animated: `y: 100% → 0`, `opacity: 0 → 1`
- `useScroll({ target: heroRef, offset: ['start start', 'end start'] })` + `useTransform`
- Words stagger across scroll progress: word N starts revealing at `N / wordCount * 0.8` of total progress
- All words fully revealed by 30vh of scroll
- On reduced-motion: words visible immediately, no animation

**Fallback:** If JS fails or hydration is delayed, words remain visible (no `hidden` state on the outer container — only inner spans).

### 1.5 — Hero Loading Sequence

**What:** Brief opening moment that sets the tone before the hero text appears. A gold dot in the center expands to a horizontal line, then the line "ignites" the hero text reveal. Total duration: ~600ms. Happens once per session.

**Implementation:**
- New `HeroIntro.tsx` component, mounted in hero
- Sequence:
  1. `0ms` — Gold dot fades in at center (8px diameter), opacity 0→1
  2. `200ms` — Dot expands horizontally to a 120px line (width animation)
  3. `400ms` — Line fades out, hero text begins its word-by-word reveal
  4. `600ms` — Tagline fades in below
- Stored in `sessionStorage` — only fires on first page load per session
- On reduced-motion: skip the sequence entirely, hero appears immediately

---

## Phase 2: Motion & Interaction

### 2.1 — Cursor Spotlight (Hero Only)

**What:** A subtle radial gradient that follows the mouse position within the hero section. Creates a spotlight on the dark background. Hero-scoped, not whole-page, so it stays deliberate.

**Implementation:**
- React component `CursorSpotlight.tsx` (`client:load`)
- Mounted inside the hero, positioned absolutely
- `useMotionValue` for x/y mouse position
- `useSpring` with `damping: 30, stiffness: 200` for smooth follow
- Render: `position: absolute` div with `background: radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 50%)`
- Size: 600px diameter
- `pointer-events: none`, `z-index: 1`
- **Desktop only:** Check `window.matchMedia('(pointer: fine)')` — render nothing on touch
- Tracks pointer relative to hero bounds, not viewport

### 2.2 — 3D Tilt Project Cards

**What:** Project cards tilt in 3D based on cursor position within the card. Adds depth without being gimmicky.

**Implementation:**
- Enhance `AnimatedCard.tsx` with tilt behavior
- On `onPointerMove`: calculate cursor position relative to card center
- Map to `rotateX` and `rotateY` (-4deg to +4deg range — restrained, not flashy)
- `useSpring` for smooth interpolation (`damping: 20, stiffness: 300`)
- `perspective: 1000px` on parent grid container
- Shadow shifts opposite to tilt direction for parallax depth
- **Mobile disabled:** Check `pointer: fine` media query
- Return to flat on `onPointerLeave` with `transition: { duration: 0.4 }`

### 2.3 — Magnetic Social Links

**What:** Social links subtly pull toward the cursor when hovered nearby.

**Implementation:**
- New `MagneticButton.tsx` wrapper component
- `useMotionValue` for x/y offset
- On `onPointerMove`: distance from cursor to element center → proportional translate (max 8px pull)
- `useSpring` with `damping: 20, stiffness: 300`
- Applied to `.connect-links a` elements on every page
- **Desktop only**

### 2.4 — Cursor Text Label on Project Cards

**What:** When hovering a project card, a small text label ("view ↗" or similar) follows the cursor. Premium portfolio pattern — used on basement.studio and similar sites.

**Implementation:**
- New `CursorLabel.tsx` component
- Listens for `onPointerEnter` / `onPointerLeave` on elements with `data-cursor-label` attribute
- Reads the label text from the attribute value
- `useMotionValue` + `useSpring` for smooth follow with slight lag
- Renders fixed-position pill near cursor (offset +12px x, +12px y)
- Fades in/out with scale spring
- Hidden on touch devices

**Usage:** Add `data-cursor-label="view"` to project cards. Future-proof: works on any element.

### 2.5 — Infinite Skills Marquee

**What:** Continuously scrolling ticker of skills below the hero. Adds motion energy to the landing page.

**Content (final list — no Rust, that's interest not skill):**
```
AI Systems · Agent Infrastructure · Memory Systems · Multi-Agent Orchestration
MCP · SRE · React · TypeScript · Python · Cloudflare · Astro · Systems Thinking
```

**Implementation:**
- Pure CSS, no JS animation
- Flex container with `overflow: hidden`
- Two identical content groups, `min-width: 100%`, duplicated content marked `aria-hidden="true"`
- `@keyframes marquee`: `translateX(0)` → `translateX(calc(-100% - var(--gap)))`
- `animation: marquee 28s linear infinite`
- Gradient mask on edges: `mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent)`
- `user-select: none`
- Pause on hover: `&:hover { animation-play-state: paused; }`
- `prefers-reduced-motion: reduce` → pause animation, static display

---

## Phase 3: Page Architecture

### 3.1 — Staggered Page Load (Nav + Section Labels Only)

**What:** Orchestrated entrance for nav and section labels. Hero is handled separately by HeroIntro (1.5).

**Sequence (total: ~700ms):**
1. `0ms` — Nav slides down from `y: -16`, opacity 0→1, duration 400ms
2. `300ms` — Section labels (`.section-label`) cascade in with 120ms stagger between each
3. Body content uses scroll-triggered reveals (Phase 1.3), not page-load animation

**Why scoped:** Page-load orchestrating everything makes the site feel slow. Only animate what the user sees in the first viewport.

### 3.2 — Sticky Nav with Scroll-Reactive Blur

**What:** As the user scrolls past the hero, the sticky nav's backdrop blur intensifies and a subtle gold underline appears. Currently the nav is sticky but visually static — this gives it presence.

**Implementation:**
- Add a `data-scrolled` attribute to `.site-header` via a small `client:load` script
- IntersectionObserver watching the hero — when out of view, set `data-scrolled="true"`
- CSS transitions:
  - `backdrop-filter: blur(1.125rem)` → `blur(1.5rem)`
  - `background-color` opacity 72% → 88%
  - `border-bottom` color from subtle → accent-border (gold at low opacity)
  - All transitioned over 300ms
- No JS scroll listener — uses IntersectionObserver (single trigger, efficient)

### 3.3 — Astro ClientRouter (View Transitions)

**What:** Smooth crossfade between pages via Astro's built-in `<ClientRouter />` component, which wraps the View Transitions API.

**Implementation:**
- Import `<ClientRouter />` from `astro:transitions` in `BaseLayout.astro` `<head>`
- Add `transition:name="nav"` to the header element — persists across navigations
- Add `transition:name="footer"` to the footer element
- CSS overrides for transition timing:
  ```css
  ::view-transition-old(root) { animation-duration: 0.18s; }
  ::view-transition-new(root) { animation-duration: 0.3s; }
  ```
- Falls back gracefully on browsers without VT support (regular MPA navigation)
- Caveat: Lenis must be re-initialized on `astro:after-swap` event — wire this into `LenisProvider`

### 3.4 — Numbered Section Labels

**What:** Replace section labels like "Now" with `01 / Now`, `02 / Writing`, `03 / Connect`. Premium portfolio pattern — gives structure and rhythm.

**Implementation:**
- Update existing `.section-label` CSS
- Numbers in monospace, slightly smaller than the label, in gold-700 (deeper gold for less aggression)
- Slash separator in `--color-text-muted`
- Numbers count up sequentially within each page

**Markup:**
```html
<div class="section-label" data-num="01">Now</div>
```

```css
.section-label::before {
  content: attr(data-num) ' / ';
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
  margin-right: var(--space-1);
}
```

Replaces the existing `::before` gold gradient line (which was conflicting with h2 styling anyway).

---

## Phase 4: Polish & Personality

### 4.1 — Live Status Pill

**What:** A small pill at the top of the hero with a pulsing gold dot and a live status message. Premium portfolios do this (linear.app team pages, vercel designer portfolios).

**Examples:**
- `● Currently: Director-level AI roles`
- `● Building: BoltOS at Bolt Farm Treehouse`
- `● Open to: cofounder conversations`

**Implementation:**
- Static markup in hero of `index.astro` (single source of truth for status)
- `.status-pill` styling: small monospace, accent border, low-opacity gold background
- Dot: 6px circle, `background: var(--color-accent-bright)`, `@keyframes pulse` (opacity 1 → 0.4 → 1, 2s loop)
- Position: above the H1, with `margin-bottom: var(--space-4)`
- Reduced motion: dot static, no pulse

### 4.2 — Enhanced h2 Section Dividers

**What:** Resolve the conflict with the existing `h2::before` gold gradient. Keep it, but animate it.

**Implementation:**
- Existing `h2::before` (gold gradient line, 3rem wide) stays
- Add `scaleX: 0 → 1` animation on scroll into view
- `transform-origin: left`
- Duration: 600ms, ease: `[0.22, 1, 0.36, 1]`
- Triggered by IntersectionObserver (CSS-only via `animation-timeline: view()` where supported, JS fallback otherwise)

### 4.3 — Gradient Mesh Drift

**What:** The existing radial gradient orbs in the body background slowly drift over time. Adds organic movement without distraction.

**Implementation:**
- Move the existing radial gradients from `body` background to a fixed `<div aria-hidden>` element
- Apply `@keyframes drift` — `translate(±20px, ±15px)` over 30s, infinite, alternate
- Two separate orbs drift in opposing directions
- `will-change: transform` on the drift container
- Reduced motion: animation disabled, static gradients remain

### 4.4 — Hover State Upgrades

**Links (body text):**
- Current: color change + browser underline on `:hover`
- New: animated underline that draws from left (`scaleX: 0 → 1`, origin left), 250ms, decelerate ease
- Remove the static underline

**Cards:**
- Current: `y: -4` lift + gold radial glow
- New: Add `border-color` transition from `--color-border-default` to `--color-accent-border` on hover, plus shadow deepens from `--shadow-lg` to `--shadow-xl`

**Nav links:**
- Current: color change + pill background (already good)
- New: Add subtle `scale: 1.04` on hover before the pill slides in

**Logo:**
- Current: scale + rotate + shine sweep (already good)
- New: Add `box-shadow` gold-glow pulse on hover (existing `--shadow-gold-sm` expands to a slightly larger glow)

### 4.5 — Konami Code Easter Egg

**What:** A small playful moment for developers who actually inspect the site. Triggers when the Konami code sequence is typed: `↑ ↑ ↓ ↓ ← → ← → B A`.

**Effect:** Briefly overlays the site with a gold gradient sweep + a hidden message: `"identity over credentials. - keagan"`. Fades after 4 seconds. Logs to console: `"you found it. let's talk: keaganluttrell7@gmail.com"`.

**Implementation:**
- Single small `EasterEgg.tsx` component (`client:idle`)
- Listens for keydown sequence
- ~1KB, no impact on perf
- No accessibility issue — purely additive, ignorable

---

## New Components

| Component | Location | Hydration | Purpose |
|---|---|---|---|
| `LenisProvider.tsx` | `src/components/` | `client:load` | Smooth scroll initialization, handles re-init on view transitions |
| `CursorSpotlight.tsx` | `src/components/` | `client:load` | Mouse-following hero gradient |
| `MagneticButton.tsx` | `src/components/` | `client:visible` | Magnetic pull wrapper |
| `AnimatedReveal.tsx` | `src/components/` | `client:visible` | Clip-path scroll reveal |
| `TextReveal.tsx` | `src/components/` | `client:load` | Scroll-linked word-by-word reveal |
| `HeroIntro.tsx` | `src/components/` | `client:load` | Opening gold-dot-to-line sequence |
| `Marquee.tsx` | `src/components/` | none (pure CSS) | Infinite skills marquee |
| `CursorLabel.tsx` | `src/components/` | `client:idle` | Cursor-following text label |
| `StickyNavObserver.tsx` | `src/components/` | `client:load` | IntersectionObserver for nav scroll state |
| `EasterEgg.tsx` | `src/components/` | `client:idle` | Konami code listener |

## Modified Components

| Component | Changes |
|---|---|
| `AnimatedCard.tsx` | Add 3D tilt, enhanced hover, support `data-cursor-label` |
| `AnimatedSection.tsx` | Switch default variant to `clipReveal` |
| `AnimatedNav.tsx` | Enhanced hover scale, magnetic logo |
| `BaseLayout.astro` | Add `<ClientRouter />`, LenisProvider, grain overlay, drift container, EasterEgg, StickyNavObserver |
| `index.astro` | Add HeroIntro, TextReveal for h1, CursorSpotlight, status pill, Marquee, numbered section labels |
| `about.astro` | Numbered section labels, simplify timeline (no sticky pin) |
| `projects.astro` | Add `data-cursor-label="view"` to project cards, numbered labels |
| `motion.ts` | Add clipReveal variants, spring configs for tilt/magnetic/spotlight |

## New CSS Files

| File | Purpose |
|---|---|
| `src/styles/components/marquee.css` | Marquee keyframes + edge masks |
| `src/styles/components/grain.css` | Film grain overlay |
| `src/styles/components/spotlight.css` | Cursor spotlight + cursor label |
| `src/styles/components/status-pill.css` | Live status pill + pulse |
| `src/styles/components/drift.css` | Gradient mesh drift container |
| `src/styles/base/view-transitions.css` | VT API timing overrides |
| `src/styles/base/sticky-nav.css` | Scroll-reactive nav state |

## Dependencies to Add

```json
{
  "lenis": "^1.1.20"
}
```

(Astro 6 includes `<ClientRouter />` built-in via `astro:transitions` — no extra dep.)

## Files to Remove

None — all additive.

## Accessibility Checklist

- [ ] All animations respect `prefers-reduced-motion: reduce`
- [ ] Grain overlay is `pointer-events: none`, `aria-hidden="true"`
- [ ] Cursor spotlight is `pointer-events: none`, decorative
- [ ] Cursor label is `pointer-events: none`, `aria-hidden="true"`
- [ ] Marquee clone has `aria-hidden="true"`
- [ ] All interactive elements remain keyboard-navigable
- [ ] Focus states visible, not removed by hover animations
- [ ] No content hidden behind animation (visible if JS fails)
- [ ] Status pill text is real text, screen-reader accessible
- [ ] Easter egg is purely additive, no blocking
- [ ] Skip link still works above all overlays

## Performance Budget

- First Contentful Paint: < 1.0s
- Largest Contentful Paint: < 2.0s
- Cumulative Layout Shift: < 0.05
- Animation frame rate: 60fps (use `will-change` only on actively animating elements)
- Total JS added: < 18KB gzipped (Lenis ~3KB, new components ~12-15KB)
- Animate only `transform` and `opacity` — never layout properties

## Implementation Order

1. Lenis smooth scroll (foundation for everything scroll-related)
2. Film grain overlay (instant atmospheric upgrade)
3. Astro ClientRouter (page transitions)
4. Clip-path scroll reveals (replace existing fade/slide variants)
5. Scroll-linked hero text reveal
6. Hero loading sequence (gold dot → line)
7. Numbered section labels
8. Live status pill
9. Cursor spotlight (hero)
10. 3D tilt project cards
11. Cursor text label
12. Magnetic social links
13. Skills marquee
14. Sticky nav scroll-reactive blur
15. Gradient mesh drift
16. Enhanced h2 divider animation
17. Hover state upgrades
18. Konami easter egg

## What We're NOT Doing

- Custom cursor replacement (accessibility nightmare, gimmicky)
- WebGL / Three.js (wrong tool for a portfolio, massive overhead)
- Page transition loading spinners
- Parallax that hurts readability
- Sticky pinned timeline (UX hit for marginal payoff — dropped per review)
- Scroll progress indicator (portfolio cliché — dropped per review)
- Page-load orchestration of hero text (conflicts with scroll-linked reveal — dropped per review)
- Sound on hover or scroll
- Auto-playing video backgrounds
- Cookie banners or consent modals (no tracking, no need)

## Decisions Recorded (from review)

| Question | Decision |
|---|---|
| Lenis smooth scroll? | Yes, conservative config (`lerp: 0.08`) |
| Hero text: scroll-linked vs page-load? | Scroll-linked |
| Marquee content | Real skills only — no Rust |
| Sticky pinned About timeline | Dropped — keep simple stack |
| Cursor spotlight scope | Hero only |
| Scroll progress indicator | Dropped — cliché |

## Premium Additions (beyond original spec)

- **Hero loading sequence** (1.5) — gold dot → line → text reveal trigger
- **Live status pill** (4.1) — pulsing dot + current status message
- **Cursor text label** (2.4) — floating label on project cards
- **Sticky nav scroll-reactive blur** (3.2) — nav intensifies past hero
- **Numbered section labels** (3.4) — `01 / Now` style rhythm
- **Konami easter egg** (4.5) — playful dev moment
