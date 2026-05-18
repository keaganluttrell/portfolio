# Design System Audit

## Architecture decision

Selected pure CSS custom-property tokens over Tailwind.

Reason: this is a small Astro site with stable page structure and a custom premium brand direction. Tailwind would add dependency/config surface without much benefit. Formal CSS tokens keep the styling layer explicit, portable, and easy to audit.

## Issues found

- One monolithic `src/styles/global.css` mixed reset, tokens, base styles, layout, nav, cards, sections, footer, utilities, and responsive rules.
- Tokens existed but were informal: only a few semantic variables and no full color/type/spacing/elevation/radius/motion system.
- Colors were used as raw hex/rgba throughout component CSS.
- Typography used ad-hoc sizes and a non-standard `font-weight: 780`.
- Spacing used arbitrary rem values instead of a consistent 4px scale.
- Shadows used raw rgba values rather than elevation tokens.
- Radius values were repeated ad hoc.
- Framer Motion transitions and variants were repeated per component.
- `AnimatedCard` had a hardcoded rgba border color in JS hover state.
- No inline `style=""` attributes were present in pages/components, but the refactor verified this remains true.
- Component CSS and layout classes were coupled implicitly inside the monolithic global file.

## Refactor completed

- Split styling into token, base, and component layers.
- Added formal navy, gold, neutral, surface, border, and effect color tokens.
- Added typography tokens for families, weights, sizes, line heights, and letter spacing.
- Added 4px-based spacing and sizing tokens.
- Added shadow/elevation tokens.
- Added radius tokens.
- Added CSS motion tokens and centralized Framer Motion variants/transitions in `src/lib/motion.ts`.
- Refactored nav/card/section/footer styling to consume tokens.
- Refactored React motion components to use shared variants/transitions.
- Removed the old monolithic `src/styles/global.css`.
- Updated `BaseLayout.astro` to import `src/styles/index.css`.

## Verification

- `npm run build` passes.
- Search verified no inline `style=` attributes under `src`.
- Search verified no raw hex/rgba/rgb values in `src/components` or `src/styles/components`.
