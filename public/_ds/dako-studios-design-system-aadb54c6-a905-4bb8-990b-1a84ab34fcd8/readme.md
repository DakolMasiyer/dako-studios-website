# Dako Studios Design System

**Version:** 1.0 · **Updated:** June 2026  
**Organization:** Dakonoveu Ltd, Abuja, Nigeria  
**Root domain:** dako.studio

---

## Company Context

Dako Studios is a multi-vertical digital agency operating under Dakonoveu Ltd. Five service arms share a single brand shell but each carries its own visual accent and tone of voice:

| Arm | Subdomain | Accent | Character |
|-----|-----------|--------|-----------|
| **Labs** | labs.dako.studio | Electric Blue `#1464E8` | Premium, technical, professional services credibility |
| **Brand** | brand.dako.studio | Amber Gold `#C97D10` | Versatile, polished, identity-first |
| **Motion** | motion.dako.studio | Vivid Orange `#E84C00` | High-energy, bold, kinetic |
| **Film** | film.dako.studio | Deep Navy `#0E4D7A` | Cinematic, moody, atmospheric |
| **Academy** | learn.dako.studio | Jade Green `#0A9165` | Approachable, beginner-friendly, encouraging |

**Primary audience:** Nigerian SME clients (Lagos/Abuja) + diaspora / international clients with higher budgets. Must read as credible to both.

**Near-term priority:** dako.studio root + labs.dako.studio landing page (21-day sprint). Academy is secondary.

---

## Source Materials

- `uploads/IMG_1318.JPG` — Reference logo: "Dakon Enterprise" — black bg, white circle, bold crimson D-mark with chevron notch, "Dakon" wordmark. Inspiration for color palette and logomark concept.
- `uploads/IMG_6864.PNG` — Close-up of the D-mark shape. Confirms: semicircle-D bowl, triangular V-notch cut into the left spine pointing inward/right (arrow/play-button motif).

No Figma file, no existing codebase — this design system was built from scratch using the reference assets above.

---

## Content Fundamentals

### Voice & Tone
- **Confident, not arrogant.** Dako does serious work. Copy leads with outcomes, not process.
- **Direct.** Short sentences. No filler. Every word earns its place.
- **We vs. You.** Dako speaks in first-person plural ("We build…", "Our process…") when describing the studio, and second-person ("Your brand…", "You'll get…") when addressing clients.
- **Professional but not stiff.** Nigerian creative culture is vibrant — copy can carry warmth and personality without sacrificing credibility.
- **No emoji** in UI copy or headlines. Reserved for informal channels only.
- **No exclamation marks** in headlines. Let the work speak.

### Casing Conventions
- Headlines: Title Case for short hero headlines; sentence case for body/descriptive text
- Navigation: Title Case
- Buttons/CTAs: Title Case ("Get Started", "View Work", "Book a Call")
- Labels/tags: lowercase (`motion`, `brand`, `labs`)
- Arm names: always lowercase in copy context ("the labs team"), capitalized as proper noun when standalone ("Labs")

### Copy Examples
> "We build digital presences that convert."  
> "Serious creative work for serious ambitions."  
> "From Abuja to the diaspora — one studio, five disciplines."  
> "Your brand deserves more than a template."

---

## Visual Foundations

### Color
Dark-first. Black (`#080808`) is the canonical background. Off-white (`#FAFAF8`) is the primary foreground. Crimson red (`#CC0A0A`) is the brand accent — used sparingly and with intent: CTAs, logomark, hover states on key actions. Light mode (`data-theme="light"`) inverts the surface hierarchy but keeps the same red accent.

Five arm accents swap into `--color-accent-arm` via `[data-arm="<name>"]` on a page wrapper. Each arm has a primary, dark, and subtle (12% opacity) variant.

### Typography
- **Syne** (ExtraBold 800 / Bold 700) — all display, hero headlines, nav wordmark. Geometric, slightly angular. Conveys craft and modernity.
- **Plus Jakarta Sans** (Light 300 → ExtraBold 800) — body, UI, labels. Clean but has personality. Not sterile.
- **JetBrains Mono** — code blocks, Academy platform, technical labels.
- Heading tracking: `–0.02em` to `–0.04em` (tight, professional).
- Body tracking: `0em` default, `+0.18em` for uppercase labels/overlines.

### Spacing
4px base unit. Scale follows `--space-1` (4px) through `--space-64` (256px). Section padding uses fluid clamp: `--section-px` and `--section-py`.

### Backgrounds & Surfaces
- Hero sections: pure black (`#080808`) or very dark neutral (`#0A0908`)
- Cards/panels: `--color-neutral-900` (#161412)
- Elevated surfaces: `--color-neutral-800` (#252220)
- No gradients on backgrounds — flat, high-contrast, cinematic
- Full-bleed imagery with a dark overlay is the primary hero treatment
- Subtle `1px` borders at `--color-neutral-800` define surface edges rather than shadows in dark mode

### Corner Radii
- Buttons: `--radius-md` (4px) — crisp, not pill-shaped
- Cards: `--radius-lg` (8px)
- Tags/badges: `--radius-full` (9999px)
- Modals/sheets: `--radius-xl` (12px)
- No aggressive rounding — this brand is angular, not bubbly

### Shadows
Shadows are deep and cool (no warm color cast). Used sparingly — primarily on elevated surfaces in dark mode. Light mode uses stronger shadows. Glow variants exist for accent-colored elements.

### Motion & Animation
- Easing default: `ease-out` cubic-bezier (decelerates to stop — feels responsive)
- Spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for interactive elements (dropdowns, modals opening)
- Base duration: 200ms for UI transitions; 350ms for page-level transitions
- No looping decorative animations on static pages
- Entrance animations: fade + subtle translate-up, gated on `[data-deck-active]` for presentations

### Hover & Press States
- **Buttons:** Background lightens slightly; no scale transform on default buttons. CTAs: `--color-brand-red-light` on hover.
- **Cards:** Subtle border becomes `--color-neutral-700`; optional `translateY(-2px)` with shadow increase
- **Links:** Color shifts to `--color-accent-hover`; no underline default
- **Press:** `scale(0.97)` on interactive elements — subtle, not bouncy
- **Opacity approach:** Never reduce opacity below 0.5 for hover states; prefer color shift

### Iconography
No proprietary icon font. Icons are sourced from **Lucide Icons** (CDN: `https://unpkg.com/lucide@latest`). Lucide is stroke-based, 24px grid, 1.5px stroke weight — clean and professional.  
- Always use `stroke-width="1.5"` for Lucide in UI contexts
- Icon size: 16px (sm), 20px (md/default), 24px (lg)
- Never use emoji as icons in UI
- Unicode characters (`→`, `×`, `·`) are permitted for typographic details

### Imagery
- Color grade: cool/neutral. No warm-toned stock photography.
- Dark overlay: `rgba(8,8,8,0.5)` minimum on full-bleed hero images
- Art direction: hands-on work (production stills, screens, creative process) over generic business photography
- Academy: warmer, friendlier imagery than other arms — but still professional

### Cards
- Background: `--color-neutral-900`
- Border: `1px solid var(--color-neutral-800)` — hairline definition
- Radius: `--radius-lg` (8px)
- Inner padding: `--space-6` (24px)
- No box-shadow on dark surfaces (border suffices); `--shadow-md` on light surfaces

### Layout
- Max content width: `--container-xl` (1280px), centered
- Section padding: `clamp(1.5rem, 5vw, 5rem)` horizontal; `clamp(4rem, 8vw, 8rem)` vertical
- Grid: 12-column, 24px gutter
- No fixed-height hero sections — let content breathe; hero typically `min-height: 90vh`

---

## Iconography

Dako Studios uses **Lucide Icons** (v0.400+) loaded from CDN. Usage:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="arrow-right"></i>
<script>lucide.createIcons();</script>
```

Or via React:
```jsx
import { ArrowRight } from 'lucide-react';
<ArrowRight size={20} strokeWidth={1.5} />
```

Standard sizes: `16` (inline/label), `20` (default UI), `24` (prominent/standalone).  
Always `strokeWidth={1.5}` — never filled icons in core UI.

---

## File Index

```
styles.css                    — Design system entry point (link this)
tokens/
  colors.css                  — Brand colors, arm accents, neutrals, semantic aliases
  typography.css              — Font families, size scale, weights, leading, tracking
  spacing.css                 — Space scale, container widths, radii, z-index
  effects.css                 — Shadows, easing, durations, blur
  base.css                    — CSS reset and global element styles

assets/
  logomark.svg                — Red D-mark (transparent bg) — primary brand mark
  logomark-white.svg          — White D-mark variant
  logomark-black.svg          — Dark D-mark variant
  logomark-circle.svg         — D-mark with white circle (reference style)
  logo-dark.svg               — Horizontal lockup for dark backgrounds
  logo-light.svg              — Horizontal lockup for light backgrounds

guidelines/
  colors-brand.card.html      — Core brand palette
  colors-neutrals.card.html   — Neutral scale
  colors-arms.card.html       — 5 arm accent colors
  colors-semantic.card.html   — Semantic color aliases
  type-display.card.html      — Syne display specimens
  type-body.card.html         — Plus Jakarta Sans body specimens
  type-scale.card.html        — Full type scale
  type-mono.card.html         — JetBrains Mono specimens
  spacing-scale.card.html     — Spacing tokens
  effects-shadows.card.html   — Shadow system
  effects-radius.card.html    — Border radius tokens
  effects-transitions.card.html — Motion tokens
  brand-logomark.card.html    — Logomark variants
  brand-wordmark.card.html    — Wordmark lockups

components/core/
  Button.jsx / .d.ts          — Primary interaction: CTA, secondary, ghost, icon variants
  Card.jsx / .d.ts            — Surface container: default, elevated, outlined
  Badge.jsx / .d.ts           — Status/label chip: filled, subtle
  Input.jsx / .d.ts           — Text input with label, helper, error states
  NavBar.jsx / .d.ts          — Site navigation shell with arm theming

ui_kits/
  root/index.html             — dako.studio homepage mock (dark, editorial)
  labs/index.html             — labs.dako.studio landing page mock

templates/
  landing-page/index.html     — Reusable single-page landing template
  landing-page/ds-base.js     — Design system loader for templates
```

---

## Caveats & Font Note

Fonts are loaded from **Google Fonts CDN** (Syne, Plus Jakarta Sans, JetBrains Mono). For production use, self-host via `@font-face` declarations pointing to local WOFF2 files — see `tokens/typography.css` for the font stack. Provide font files if you have licensed versions.
