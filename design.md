# Nextale Design System

Lightweight design reference for the Nextale marketing site. This document reflects the **current** codebase — no external UI framework, no component library.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (Pages Router) |
| Styling | Single global stylesheet — [`styles/globals.css`](styles/globals.css) |
| State | React hooks inline per page; shared form hook in [`hooks/useContactForm.js`](hooks/useContactForm.js) |
| Fonts | System stack in CSS (`--font-sans`); no Google Fonts |

## Architecture

```
pages/_app.js          → Site shell (nav, footer, page wrapper)
pages/_document.js     → HTML shell (no external fonts)
pages/index.js         → Landing page (hero scroll, story, capabilities)
pages/services.js      → Services hero + creative story scroll
pages/{work,process,contact}.js → Other subpages
hooks/useContactForm.js   → useContactForm + SERVICES_OPTIONS
hooks/useStoryScroll.js   → useStoryArticleScroll (landing + services)
components/contact/ContactWizard.js → Contact wizard UI
lib/mailer.js             → Contact email (API only)
styles/globals.css     → All tokens, layout, components
```

`useScrollHeroTransition` remains inline in `pages/index.js` (landing-only). `useStoryArticleScroll` drives landing + both services story sections.

## Typography

All text uses Apple’s system font stack via a single sans token — no web font downloads.

| Token | Stack | Use |
|-------|-------|-----|
| `--font-sans` | `-apple-system`, `BlinkMacSystemFont`, SF Pro Text/Display, Segoe UI, Helvetica Neue, Arial | Source of truth |
| `--font-display` | `var(--font-sans)` | Headlines, section titles, large display copy |
| `--font-body` | `var(--font-sans)` | Body paragraphs, input values, hero subcopy |
| `--font-ui` | `var(--font-sans)` | Nav, buttons, form labels, footer |
| `--font-mono` | `SF Mono`, system monospace | Rare monospace fallback only |

On macOS/iOS, text renders in **San Francisco**. On Windows/Android, the stack falls back to Segoe UI / Roboto.

**Voice:** Sentence case for labels and buttons. Display headings use `font-weight: 600–800` on the same family.

## Color tokens

```css
--bg: #fafaf8;
--bg-2: #f0efeb;
--text: #111111;
--text-muted: #666666;
--text-primary: #1d1d1f;      /* UI chrome */
--text-secondary: #6e6e73;    /* Labels, legal */
--blue: #1b3fd8;              /* Editorial accents (eyebrows, hovers) */
--action: #0071e3;            /* Primary buttons, focus rings */
--action-hover: #0077ed;
--black: #0a0a0a;
--white: #ffffff;
--border: #e0ded9;
--surface-footer: #f5f5f7;
--tan: #c4a97a;               /* Portfolio tab accent */
```

## Layout primitives

| Token | Value | Use |
|-------|-------|-----|
| `--nav-h` | `72px` | Fixed nav height; story sticky offset |
| `--container` | `min(1200px, calc(100% - 2.5rem))` | Content max-width |
| `--radius-pill` | `980px` | Pill buttons and chips |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Transitions |

## Buttons

Shared primitives in `globals.css`. Compose BEM + `.btn` in markup:

| Class | Appearance | Used for |
|-------|------------|----------|
| `.btn` | Base pill, `--font-ui`, 14px | All interactive buttons/links styled as buttons |
| `.btn--primary` | Apple blue fill, white text | Form submit, primary CTAs on dark surfaces |
| `.btn--dark` | `#1d1d1f` fill | Nav CTA, hero primary link |
| `.btn--secondary` | Transparent + border | Ghost links (hero, explore services) |
| `.btn--ghost` | Transparent, muted text | Wizard Back / restart |
| `.btn--chip` | Small pill, bordered | Service picker in contact wizard |

**Pattern:** No uppercase, no mono, no slide-in hover effects. Hover = background or opacity shift only.

### Button map

| Location | Classes |
|----------|---------|
| Nav CTA | `site-nav__cta btn btn--dark` |
| Hero | `home-intro__link btn btn--dark` / `btn btn--secondary` |
| Capabilities CTA | `home-intro__link btn btn--secondary home-capabilities__cta` |
| Contact wizard Next/Submit | `contact-wizard__next btn btn--primary` |
| Contact wizard Back | `contact-wizard__back btn btn--ghost` |
| Service chips | `contact-wizard__service-btn btn btn--chip` |

## Navigation

**Layout (unchanged):** Logo left · links + CTA right (`flex` + `margin-left: auto` on `.site-nav__links`).

**Style:** Frosted white bar (`rgba(255,255,255,0.8)` + `backdrop-filter: saturate(180%) blur(20px)`). Links are 12px `--font-ui`, opacity 0.8 → 1 on hover. CTA is a dark pill.

**Mobile:** Burger below 900px; drawer stacks links + pill CTA. Same positions/order as before.

Links defined in `pages/_app.js`:

- Nav: Services, Work, Process + Start a project
- Footer: Services, Work, Process, Contact

## Footer

Light Apple-style bar (`--surface-footer`), dark logo (no invert filter), inline nav row, social icons, 12px legal copy in `--font-ui`.

## Forms

Shared hook: `useContactForm()` in [`hooks/useContactForm.js`](hooks/useContactForm.js). UI: [`components/contact/ContactWizard.js`](components/contact/ContactWizard.js).

`/contact` is a full-screen conversational wizard (Blankslate-style): one question per step, **Page X of 6**, Back / Next navigation, all on a single route.

| Step | Question | Field |
|------|----------|-------|
| 0 | Welcome — Start a project | — |
| 1 | What's your name? | `name` (required) |
| 2 | How can we reach you? | `email` (required) |
| 3 | What company is this for? | `company` (optional) |
| 4 | How can we help? | `services[]` (≥1 chip) |
| 5 | Thank you | — |

**Input style:** Underline fields on warm `--bg`; large display question typography (`.contact-wizard__question`).

## Home page sections

| Section | Class prefix | Notes |
|---------|--------------|-------|
| Hero scroll | `.home-scroll-track`, `.home-hero` | Pinned 360vh track; collapses after commit |
| Intro | `.home-intro` | Section 2 landing animation |
| Story | `.home-story-*` | Pinned scrollytelling — **do not regress** (see `.cursor/rules/story-scroll-effect.mdc`) |
| Capabilities | `.home-capabilities-*` | Two-pillar service grid; pillar names only (no taglines) |

Story scroll constraints (landing):

- Pinned track + sticky `.home-story` viewport at `top: var(--nav-h)` (video + rail centered)
- Track height: content-driven via `useStoryArticleScroll`; rail dot follows scroll progress
- Right column only: all beats stacked; continuous scroll via `translateY` (no slide crossfade)
- Below 901px or `prefers-reduced-motion`: static stacked beats

## Subpages

| Page | Key classes |
|------|-------------|
| Services | `.home-intro`, `.svc-story-*` — landing intro + pinned Creative story (5 beats) |
| Work | `.portfolio-tabs`, `.portfolio-grid` |
| Process | `.process-list`, `.process-step`, numbered steps |
| Contact | `.page--contact-wizard`, `.contact-wizard__*` |

### Services page

**Landing intro:** Reuses `.home-intro` / `.home-intro__*` from the home page (left-aligned eyebrow, headline, body). Scoped with `.page-services .home-intro` for nav offset. No CTA buttons.

**Story scroll:**

- **Creative track:** `.svc-story-track--article` — article scroll on the right column (`useStoryArticleScroll`); left: Creative label only
- **Technology track:** `.svc-story-track--article.svc-story-track--technology` — same article scroll (mirrored layout); left: Technology label only
- **Sticky panel:** `.svc-story` — `align-items: flex-start` (content from top; home story stays center-aligned)
- **Left:** `.svc-story__category-label` — static "Creative" (unchanged across beats)
- **Rail:** reuses `.home-story__rail`, `__line`, `__dot`
- **Right slide:** `.svc-story__header` — number beside title/body in one row; `.svc-story__visuals` — mosaic screenshots below (brand beat)
- **Brand mosaic:** `.svc-story__visuals--mosaic` — 3-slot grid (`tl` / `tr` top row, `bc` centered below) with gaps, no overlap
- **Callouts:** `.svc-story__callout` per image — label + curved SVG arrow (`ServiceCalloutArrow`); stroke draws in (`svcCalloutDraw`), arrowhead pops at end (`svcCalloutHeadPop`), label fades in (`svcCalloutLabelIn`)
- **Images:** `assets/services/{folder}/` — rich objects `{ src, label, slot, calloutSide }` on brand beat; `svcShotEnter` spring bounce on active beat
- **Per-service accents:** `.svc-story__slide--{id}` colors the number heading
- Below 901px or `prefers-reduced-motion`: static stacked cards; mosaic collapses to column; callouts inline above images; no draw animation

## Responsive breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `max-width: 900px` | Nav links hidden; mobile drawer; capabilities single column; story static layout |
| `prefers-reduced-motion: reduce` | Story static; marquee becomes wrapped grid |

## Motion

- Scroll-driven state via `requestAnimationFrame` / scroll listeners (`useStoryArticleScroll` on landing + services, hero commit in `index.js`)
- `body.is-interaction-locked` during hero commit (disables pointer events on shell)
- Button hovers are CSS-only (no motion dependency)
- Services Creative + Technology: article scroll on right column; landing article scroll

## Conventions

- **BEM** class naming: `block__element--modifier`
- **Imports** at top of file only
- **No** nested scroll containers inside story section
- **No** new dependencies for styling — extend `globals.css` tokens and `.btn` primitives
- **Commits** only when explicitly requested

## File index

```
styles/globals.css     Tokens, reset, .btn, nav, footer, home, subpages
pages/_app.js          Nav + footer shell
pages/_document.js     Font loading
pages/index.js         Landing content + hero scroll hook
pages/services.js      Services hero + story scroll
pages/contact.js       Contact wizard page
hooks/useContactForm.js       Form state + step validation
hooks/useStoryScroll.js       useStoryArticleScroll (landing + services)
components/contact/ContactWizard.js   Contact wizard UI
lib/mailer.js                   Contact email (server)
design.md              This file
.cursor/rules/story-scroll-effect.mdc   Story scroll preservation rule
```
