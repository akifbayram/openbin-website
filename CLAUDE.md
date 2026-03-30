# OpenBin Marketing Website

**Website**: https://openbin.app
**Product**: Self-hosted bin inventory with QR codes and AI
**Target Audience**: Self-hosters, small teams, households organizing physical storage
**Goal**: Convert visitors to self-host (docs) or sign up for cloud hosting

## Domain Structure

| Domain | Purpose |
|---|---|
| `openbin.app` | Marketing site (this repo) |
| `docs.openbin.app` | Documentation (separate VitePress site in main repo) |
| `cloud.openbin.app` | Cloud application |
| `demo.openbin.app` | Interactive demo (embedded in home page iframe) |
| `billing.openbin.app` | Billing portal |

## Technical Stack

- **Static Site Generator**: VitePress 1.x
- **CSS**: Tailwind CSS 4 via `@tailwindcss/vite` plugin (utilities only, no preflight)
- **Fonts**: DM Sans 700 (Google Fonts) for headings, VitePress default (Inter) for body
- **Deployment**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)
- **Build**: `npm run build` outputs to `.vitepress/dist/`

## File Structure

```
openbin-website/
├── .vitepress/
│   ├── config.ts              # VitePress config: nav, social links, Tailwind plugin, OG meta
│   └── theme/
│       ├── index.ts           # Extends DefaultTheme, registers page layout components
│       ├── HomeLayout.vue     # Home page: hero, features, comparison, bottom CTA
│       ├── PricingLayout.vue  # Pricing page: 3-column plan comparison
│       └── custom.css         # All custom styles: tokens, animations, buttons, chrome
├── index.md                   # Home page (layout: page, renders <HomeLayout />)
├── pricing.md                 # Pricing page (layout: page, renders <PricingLayout />)
└── public/
    ├── CNAME                  # openbin.app
    ├── favicon.svg
    ├── logo-horizontal.svg
    ├── logo-horizontal-dark.svg
    └── screenshots/
```

## Brand & Design

### Color Palette

All colors use VitePress CSS custom properties (`var(--vp-c-*)`):

- **Brand primary**: `--vp-c-brand-1: #5e2fe0` (purple, buttons, accents)
- **Brand secondary**: `--vp-c-brand-2: #7b52f5` (hover states)
- **Brand tertiary**: `--vp-c-brand-3: #9b7af7` (dark mode outlines)
- **Brand soft**: `--vp-c-brand-soft: rgba(94, 47, 224, 0.14)` (subtle backgrounds)
- **Text/surfaces**: Use `--vp-c-text-1`, `--vp-c-text-2`, `--vp-c-bg`, `--vp-c-bg-soft`, `--vp-c-divider`

### Design Principles

- **Flat**: No blur, no shadows, solid borders. Consistent with the OpenBin app.
- **Dark mode default**: VitePress dark theme as base, user can toggle to light.
- **Generous but not wasteful**: Section padding `py-16`, heading gaps `mb-10`. Content breathes without floating.
- **DM Sans headings**: `.display-heading` class. Body text stays in Inter (VitePress default).
- **Gradient hero text**: `.gradient-text` class on the main h1 only.

### CSS Classes

- `.btn-primary` / `.btn-secondary` — CTA buttons with hover lift, focus-visible outline, active press
- `.btn-arrow` — sliding arrow span inside buttons (`→`)
- `.feature-card` — bordered card with hover lift + brand border
- `.window-chrome` — macOS-style title bar frame (dots + URL bar)
- `.hero-bg` — radial gradient decorative background
- `.display-heading` — DM Sans 700, tight tracking
- `.gradient-text` — brand gradient with `background-clip: text`
- `.animate-in` + `.delay-1` through `.delay-5` — page-load entrance animations
- `.scroll-reveal` / `.scroll-slide-left` / `.scroll-slide-right` — IntersectionObserver-driven scroll animations (JS in each layout component)

### Animation Pattern

Hero elements use CSS `animate-in` (plays on page load). Everything below the fold uses `scroll-reveal` (triggered by IntersectionObserver when 15% visible). Both respect `prefers-reduced-motion`.

Each layout component (`HomeLayout.vue`, `PricingLayout.vue`) includes its own `<script setup>` with the IntersectionObserver setup — it's duplicated intentionally to keep components self-contained.

## Pages

### Home (`index.md` → `HomeLayout.vue`)

1. **Hero**: Gradient headline, subtitle, two CTAs (Get Started / Try Cloud), live demo iframe (desktop) or screenshot (mobile) in macOS window chrome
2. **Features**: "What's in the bin" — 4 icon cards in a row (QR Labels, AI-Powered, Multi-User, Open Source)
3. **Self-Host vs Cloud**: Two-column comparison cards, cloud card highlighted with brand border
4. **Bottom CTA**: "Stop searching. Start finding."

### Pricing (`pricing.md` → `PricingLayout.vue`)

Three plan columns: Self-Hosted (free), Lite ($5/mo), Pro ($12/mo highlighted). Feature checklist with check/dash SVG icons. Prices are placeholders — update in the `plans` array in `PricingLayout.vue`.

## Adding New Pages

1. Create `pagename.md` with frontmatter `layout: page`
2. Create `.vitepress/theme/PagenameLayout.vue` with template + optional `<script setup>` for scroll animations
3. Register the component in `.vitepress/theme/index.ts` via `app.component()`
4. Add nav link in `.vitepress/config.ts` if needed

## Tone & Copy

- Direct and conversational, not corporate or promotional
- Avoid AI writing patterns: no "everything you need", "seamless", "powerful", rule-of-three lists
- Specific over vague: "One Docker container" not "easy deployment"
- Short sentences. Let the product speak for itself.

## Development

```sh
npm install          # Install dependencies
npm run dev          # Dev server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build (port 4173)
```

## Verification

```sh
npm run build        # Must complete with no errors
```

Check both light and dark mode. Check mobile (< 768px) and desktop (> 1024px). The live demo iframe only shows on `lg:` screens — mobile gets the static screenshot.
