# OpenBin Marketing Website

**Website**: https://openbin.app
**Product**: Inventory with intelligence — QR codes, photo recognition, and multi-user collaboration
**Target Audience**: Self-hosters, small teams, households organizing physical storage
**Goal**: Convert visitors to self-host (docs) or sign up for cloud hosting

## Domain Structure

| Domain | Purpose |
|---|---|
| `openbin.app` | Marketing site (this repo) |
| `openbin.app/docs/` | Documentation (lives in this repo under `/docs/`) |
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
│   ├── config.ts              # VitePress config: nav, sidebar, social links, Tailwind plugin, OG meta
│   └── theme/
│       ├── index.ts           # Extends DefaultTheme, registers layout components, medium-zoom
│       ├── Layout.vue         # Wraps DefaultTheme layout, adds nav login button, hides search on marketing pages
│       ├── HomeLayout.vue     # Home page: hero, demos, features, comparison, FAQ, CTA
│       ├── CloudLayout.vue    # Cloud page: benefits, pricing plans, comparison table, FAQ
│       └── custom.css         # All custom styles: tokens, animations, buttons, components
├── docs/                      # Documentation (served at /docs/, sidebar defined in config.ts)
│   ├── index.md               # "What is OpenBin?"
│   ├── getting-started/       # Installation, Docker, config
│   ├── guide/                 # Feature docs (bins, QR, AI, etc.)
│   └── api/                   # REST API reference
├── index.md                   # Home page (layout: page, renders <HomeLayout />)
├── cloud.md                   # Cloud page (layout: page, renders <CloudLayout />)
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
- **Dark mode only**: `appearance: false` in config + `dark` class forced in `index.ts`. No light/dark toggle.
- **Generous but not wasteful**: Section padding `py-16`, heading gaps `mb-10`. Content breathes without floating.
- **DM Sans headings**: `.display-heading` class. Body text stays in Inter (VitePress default).
- **Gradient hero text**: `.gradient-text` class on the main h1 only.

### CSS Classes (Reusable)

- `.btn-primary` / `.btn-secondary` — CTA buttons with hover lift, focus-visible outline, active press
- `.btn-arrow` — sliding arrow span inside buttons (`→`)
- `.feature-card` — bordered card with hover lift + brand border
- `.device-frame` / `.device-frame-screen` — iPad-style bezel frame for screenshots/iframes (`.device-frame--sm` for smaller variant)
- `.hero-bg` / `.cta-bg` — radial gradient decorative backgrounds with floating animation
- `.display-heading` — DM Sans 700, tight tracking
- `.gradient-text` — brand gradient with `background-clip: text`
- `.animate-in` + `.delay-1` through `.delay-5` — page-load entrance animations
- `.scroll-reveal` / `.scroll-slide-left` / `.scroll-slide-right` / `.scroll-scale-in` / `.tilt-reveal` — IntersectionObserver-driven scroll animations
- `.stagger-1` through `.stagger-6` — transition-delay for grouped scroll animations
- `.faq-item` / `.faq-chevron` / `.faq-answer` — accordion with `grid-template-rows` animation
- `.section-divider` — gradient horizontal rule between sections

### Animation Pattern

Hero elements use CSS `animate-in` (plays on page load). Everything below the fold uses `scroll-reveal` (triggered by IntersectionObserver when 15% visible). Both respect `prefers-reduced-motion`. Easing throughout uses `cubic-bezier(0.16, 1, 0.3, 1)` (exponential ease-out).

Each layout component (`HomeLayout.vue`, `CloudLayout.vue`) includes its own `<script setup>` with the IntersectionObserver setup — it's duplicated intentionally to keep components self-contained.

HomeLayout also has three self-running demos that start via IntersectionObserver: the Photo-to-Bin timeline, the AI terminal simulation, and the split-comparison auto-sweep.

## Pages

### Home (`index.md` → `HomeLayout.vue`)

1. **Hero**: Gradient headline with rotating word ticker, three CTAs (Get Started / Try Demo / Try Cloud), live demo iframe (desktop) or screenshot (mobile) in device frame
2. **Feature Marquee**: Two-row infinite-scroll badge carousel (features + integrations)
3. **How It Works**: 3-step grid with wire connector (Snap → Stick → Scan)
4. **Photo to Bin**: Animated timeline demo — upload, analyze (multi-bin carousel), create
5. **AI Reorganization**: Before/after split comparison with spring-animated divider (desktop), stacked cards (mobile). Three switchable scenarios.
6. **Natural Language Commands**: Terminal simulation cycling through 5 command examples with typing + streaming animation
7. **Use Cases**: 4 tilted cards (Moving, Workshop, Shared spaces, Collections)
8. **Self-Host vs Cloud**: Two-column comparison cards, cloud card highlighted with brand border
9. **FAQ**: Accordion with 6 questions
10. **Bottom CTA**: "Stop searching. Start finding."

### Cloud (`cloud.md` → `CloudLayout.vue`)

1. **Hero**: "OpenBin Cloud" gradient heading, CTAs (Start Free Trial / Self-Host Instead)
2. **Benefits**: 4-card grid (No setup, Always up to date, Managed backups, AI included)
3. **Pricing**: Billing toggle, three plan cards (Free, Plus $3/mo, Pro $6/mo). Prices update with toggle — edit `plans` computed in `CloudLayout.vue`.
4. **Feature Comparison Table**: Grouped by category, sticky first column on mobile, Pro column highlighted
5. **FAQ**: 6-question accordion
6. **Bottom CTA**: "Start organizing"

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

## SEO Keywords

Target search terms to guide content and meta tag decisions:

- "QR code inventory"
- "open source inventory app"
- "bin organization system"
- "QR label maker"
- "home inventory open source"
- "physical storage organizer"

## Performance & Accessibility

- **PageSpeed Insights**: Target 90+ on all four categories (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Green scores for LCP, INP, CLS
- **Accessibility**: WCAG 2.1 AA compliance — proper heading hierarchy, sufficient color contrast, keyboard navigable, screen reader friendly
- **Images**: Use descriptive alt text, serve optimized formats (WebP where possible)

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

Site is dark mode only. Check mobile (< 768px) and desktop (> 1024px). The live demo iframe only shows on `lg:` screens — mobile gets the static screenshot.
