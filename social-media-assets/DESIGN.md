# Dako Studios — Social Media Design System

**Purpose:** Reference for generating Dako Studios social content (Claude/Canvas, Figma, or hand-built). Everything below is pulled from the live production site (`src/app/globals.css`, `src/app/landing/components/*`, `src/components/dako-logo.tsx`), not a generic template. Treat the **Do Not** section as a hard gate — it exists specifically to keep output from reading as AI-generated.

---

## 0. Do Not (read this first)

This system was built to *not* look like every other studio's Canva/Midjourney feed. Reject these on sight, even if a draft "looks fine":

- **No purple/blue gradient blobs.** Not in the brand. If a background needs energy, use the crimson radial glow (§4) or the dot-grid (§4), not a gradient mesh.
- **No glassmorphism clichés** (frosted cards floating at angles, fake 3D glass panels). The one legitimate use of blur is the nav backdrop-blur — a thin functional bar, not a design centerpiece.
- **No soft pastel rounded-blob illustrations** or generic "flat corporate" people-illustration style. Dako has no illustration system — use real photography (case-study posters, BTS shots) or typography-led layouts.
- **No Inter/Helvetica-and-call-it-a-day.** The type pairing is Space Grotesk (display) + Plus Jakarta Sans (body) — see §2. Substituting generic system fonts is an instant tell.
- **No centered-everything-with-a-soft-shadow SaaS-card look.** Dako's UI is sharp-cornered surfaces (2–16px radius) inside pill-shaped chrome (nav, buttons, badges) — see §3. The contrast between sharp content blocks and pill controls *is* the signature, don't round everything off.
- **No neon-cyberpunk-on-pure-black "tech" cliché.** Dark mode background is warm carbon `#161618`, not `#000000`. It should read premium and grounded, not gamer-RGB.
- **No stock-photo handshakes/lightbulbs/rocket-ships.** If a post needs imagery and no real asset exists, default to type-only layouts over generic stock.
- **No exclamation marks in headlines, no emoji in headline/body copy.** Confidence reads as restraint, not enthusiasm punctuation. (Emoji are fine only in casual caption sign-offs, never in the graphic itself.)

---

## 1. Brand Core

- **Name:** Dako Studios (parent entity Dakonoveu Ltd) — Abuja, Nigeria, serving Nigeria + diaspora.
- **Tagline:** "One Creative Studio. Every Edge."
- **Positioning line:** "Built for the businesses building Africa's next chapter."
- **Structure:** one studio, five arms, each with its own accent color but the same bones (type, radius, motion language). A post should always be identifiable as Dako first, arm second.
- **Voice:** confident, direct, short sentences, no filler. First-person plural for the studio ("We build…"), second-person for the client ("Your brand…"). Outcomes over process.
- **Casing:** Title Case for headlines/CTAs ("Start a Project," "View Work"); sentence case for body copy; lowercase for arm names in running text ("the labs team"), capitalized when standalone ("Labs").

---

## 2. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headlines | **Space Grotesk** | 700–800 (extrabold for hero-weight statements) | `letter-spacing: -0.02em`, `line-height: 1.1`. This is the default `h1–h6` font sitewide — use it for any headline-sized text. |
| Body / UI / Captions | **Plus Jakarta Sans** | 300–800 available; 400/500 for body, 600/700 for emphasis | The workhorse font — everything that isn't a headline. |
| Mono / Technical / Stats labels | **JetBrains Mono** | 400–700 | For code-flavored or data-flavored moments — stat callouts, technical labels, Labs-arm content. |
| Editorial accent (rare) | **Fraunces**, italic only | 300–400 | Serif italic, used sparingly for a single editorial word or pull-quote moment — not a workhorse font. Don't overuse. |
| Wordmark lockup | **Syne**, 700–800 | Reserved for the DAKO logo wordmark specifically (see §5), not general headlines. |

**Hero-scale headline pattern** (use for big statement posts): huge type, `leading-[0.9]`, tight tracking, two-line stacked statement where line 2 is in the primary accent color. Example from the live site:

```
One Creative Studio.       ← foreground color
Every Edge.                 ← primary/accent color
```

That two-tone, two-line stacking — neutral line, then accent-colored payoff line — is a reusable signature for headline-led posts.

---

## 3. Shape & Surface

- **Corner radius scale:** `sm 2px · md 4px · lg 8px · xl 12px · 2xl 16px · 3xl 24px · full 9999px`. Content surfaces (cards, image frames, stat blocks) sit at **8–16px** — sharp, not soft. Controls, badges, and chrome (buttons, nav, tags) go **full pill**.
- That sharp/pill contrast is intentional: rectangular content with crisp corners, circular/pill interactive or label elements. Don't blur the line by rounding everything to the same radius.
- **Badges/tags:** tiny, bold, uppercase, wide tracking (`0.1em–0.15em`), pill-shaped, `bg-primary/10` with `text-primary`. Used for arm labels, status tags ("Soon"), category callouts.

---

## 4. Color

Dark-first. Default theme is **dark**.

### Root palette
| Token | Light | Dark | Use |
|---|---|---|---|
| Background | `#FAF8F4` Warm White | `#161618` Carbon | Base canvas. Dark is NOT pure black — it's a warm near-black. |
| Foreground | `#161618` | `#FAF8F4` | Primary text |
| Card / surface | `#FFFFFF` | `#1E1E21` | Elevated blocks |
| Popover / deep surface | `#FFFFFF` | `#252528` | Layered elements |
| Border | `#E0E0E4` | `#2C2C30` | Hairlines, dividers |
| Muted foreground | `#636367` | `#8E8E92` | Secondary text |
| **Primary / brand accent** | **`#C1272D` Crimson** | **`#C1272D` Crimson** | The one constant. CTAs, logomark, the accent line of a headline, key highlights. Used with intent, not flooded. |
| Sidebar / deepest surface | `#F8F6F4` | `#0A0908` | Near-black, used sparingly for max-depth panels |

### Arm accent system (use to color-code content by service line)
| Arm | Accent | Subtle (12%) | Character |
|---|---|---|---|
| **Labs** (web/UX) | `#4A7C96` Steel Blue | `rgba(74,124,150,.12)` | Technical, premium, credible |
| **Brand** (identity) | `#C9A227` Gold | `rgba(201,162,39,.12)` | Polished, versatile |
| **Motion** (video ads) | `#E84C00` Vivid Orange | `rgba(232,76,0,.12)` | Kinetic, high-energy |
| **Film** (cinematic) | `#3D5470` Navy | `rgba(39,55,77,.2)` | Moody, atmospheric |
| **Academy** | `#C1272D` Crimson (shares root accent, light surfaces) | `rgba(193,39,45,.12)` | Approachable, same DNA as root |

**Practical rule for social:** studio-wide posts (announcements, culture, "Dako" brand voice) use **crimson** on **carbon**. Arm-specific posts (a Labs case study, a Motion reel) swap in that arm's accent as the single highlight color — never mix two arm accents in one post.

### Signature background device
A soft radial glow of the accent color at low opacity, centered upper-mid canvas, fading to transparent — this is how the live hero background works:
```
radial-gradient(ellipse 80% 60% at 50% 40%, <accent>/0.10 0%, transparent 70%)
```
Pair with an optional **dot-grid texture** (1px dots, 16px grid, masked to fade out radially, ~50% opacity) for added depth on large flat areas — this is the actual texture system used on the site (not noise/grain, not a gradient mesh).

---

## 5. Logo & Lockup

- **Logomark:** a geometric "D" — semicircle bowl with a triangular V-notch cut into the spine (arrow/play-button motif). Hard-edged, not rounded-corner-soft. Single fill color (`currentColor`, normally crimson `#C1272D`, or foreground white/black depending on surface).
  ```svg
  <path d="M 0 0 L 108 0 Q 205 0 205 100 Q 205 200 108 200 L 0 200 L 0 132 L 70 100 L 0 68 Z" />
  ```
- **Wordmark lockup:** "DAKO" in Syne ExtraBold, tight tracking, stacked above a tiny tracked-out uppercase subline ("STUDIOS" or the active arm name e.g. "LABS") in muted foreground, `0.15em` letter-spacing.
- Always pair mark + wordmark for first brand touch in a post (e.g., corner watermark); the mark alone is fine for small avatar-scale use (profile pictures, favicons, sticker-style call-outs).

---

## 6. Motion Language (for video/reel content)

The site's signature entrance motion is a **word-by-word blur-focus reveal**: each word fades from `opacity:0, blur(10px)` to fully sharp, staggered ~0.08s apart, eased out. Secondary elements (subtitle, CTA) follow with a simpler `fadeUp` (opacity + 14px translateY).

For Reels/TikTok/motion posts, mirror this: **text materializes word-by-word via blur-to-sharp, not slide-ins or bouncy pop-ins.** Easing reference: `ease-out cubic-bezier(0,0,0.2,1)` for reveals, a spring curve `cubic-bezier(0.34,1.56,0.64,1)` only for small interactive accents (button hovers), never for headline entrances.

---

## 7. Imagery Direction

- Real client work and real photography only — case-study posters (product shots, branded film stills), not stock or AI-generated imagery.
- Product/poster-style crops: tight, deliberate, editorial — not loose lifestyle stock framing.
- If a post needs an icon, use thin-stroke line icons (`strokeWidth: 1.5`, Lucide-style) inside a small `primary/10` rounded chip — not filled glyphs, not 3D icon packs, not emoji-as-icon.

---

## 8. Reusable Social Motifs

Pulled directly from live UI patterns — these translate well to static/motion posts:

- **Stat callout card:** icon chip (primary/10 bg, rounded-xl) + huge display-font number + bold label + muted description. e.g. `20+ Projects Delivered`.
- **Avatar stack + rating:** overlapping initial-circles with background-colored border, plus a 5-star row, for social-proof posts.
- **Pill CTA with reveal icon:** rounded-full button, label left, circular icon swatch right that "expands" on interaction — translate to motion posts as the button label sliding to reveal an arrow-in-circle.
- **Two-line accent headline:** neutral line + accent-colored payoff line (§2) — the default opener for any announcement or hook post.

---

## 9. Format Quick Reference

| Placement | Aspect | Background default |
|---|---|---|
| Feed (IG/LinkedIn/X) | 1:1 or 4:5 | Carbon `#161618` + crimson radial glow |
| Story / Reel / TikTok | 9:16 | Carbon, word-reveal motion per §6 |
| Case-study carousel | 4:5 per slide | Card surface `#1E1E21`, arm accent for highlight color |
| Profile / avatar | 1:1 | Crimson `#C1272D` fill, D-mark only, centered |

---

## 10. Token Cheat Sheet

```
Crimson (root accent)   #C1272D
Carbon (dark bg)         #161618
Carbon surface           #1E1E21
Warm White (light bg)    #FAF8F4
Labs blue                #4A7C96
Brand gold               #C9A227
Motion orange            #E84C00
Film navy                #3D5470
Display font             Space Grotesk 700/800
Body font                Plus Jakarta Sans 400–700
Mono font                JetBrains Mono
Radius (content)         8–16px
Radius (chrome/controls) full pill
```

---

## 11. Export Standard

Every post/graphic deliverable built against this system follows the same export pattern — see the live examples in `social-media-assets/posts/`.

- Each post is a self-contained `.dc.html` file. Wrap the artwork in a single element marked `data-export-root="true"` with explicit pixel `width`/`height` matching the target format (e.g. `1080×1350` for a 4:5 feed post).
- Include a **Download PNG** button: fixed top-right, crimson `#C1272D` pill, white label, download icon. Mark it (and any other non-art chrome) with `data-export-exclude="true"` so it's excluded from the export.
- Export via `html-to-image` (`toPng`) at `pixelRatio: 4` for maximum resolution, sized to the export root's exact pixel dimensions, with a `filter` that drops any node carrying `dataset.exportExclude`.
- The button itself must never appear in the exported file — it's UI chrome only.

---

## 12. Existing Launch Posts

Finished post designs live in `social-media-assets/posts/` (each a standalone `.dc.html`, open directly in a browser, use the Download PNG button to export):

| File | Format | Purpose |
|---|---|---|
| `dako-dark-feed-post.dc.html` | 1080×1350 feed | Studio-wide announcement — "One Creative Studio. Every Edge." hero headline |
| `dako-beta-story.dc.html` | Story | Beta launch announcement, features a live-site phone mockup |
| `dako-labs-feed-post.dc.html` | Feed | Labs-arm announcement/promo |
| `dako-labs-5-day-process-post.dc.html` | Feed | Labs' 5-day delivery process explainer |
| `dako-labs-case-study-carousel.dc.html` | 4:5 carousel | Tabsil case study, uses `posts/assets/tabsil-desktop.png` + `tabsil-phone.png` |
| `dako-labs-real-estate-story.dc.html` | Story | Labs real-estate vertical post |
| `dako-testimonial-post.dc.html` | Feed | Client testimonial/social-proof post |
