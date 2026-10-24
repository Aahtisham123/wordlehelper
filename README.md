# wordlehelp.co

Source for **[wordlehelp.co](https://wordlehelp.co)**, a free Wordle Helper built with **Next.js 16** (App Router, static export). The homepage offers three ways to solve: Guess Grid, Letter Clues and Guided Solve. The rest of the site has daily hints, an answers archive, word tools, programmatic word lists and guides.

All solving runs in the visitor's browser. `next build` writes plain static HTML to `out/`, so any static host works.

## Commands

```bash
npm install
npm run dev          # local dev server (http://localhost:3000)
npm run build        # static site in out/
npm start            # serve out/ locally
npm run lint         # TypeScript check
npm test             # engine tests + checks on the built site (build first)

npm run add-answer -- 2026-10-24 crane "optional one-line clue"
npm run images       # regenerate illustrations, social images and icons
npm run wordlists    # regenerate word lists, openers and benchmark
```

## How the project is organised

| Path | What it is |
|---|---|
| `lib/registry.mjs` | **One place for every page's SEO**: title (≤ 50 chars), meta description (≤ 144), H1, nav label, icon, hero image + alt text, social image, sitemap priority. Navigation, footer, sitemap, site search and social images all read from it. |
| `lib/engine.mjs` | Wordle scoring (exact duplicate-letter rules), filtering, ranking and best-guess entropy. Shared by the browser tools, build scripts and tests. |
| `lib/data.mjs` | Server-side loaders for word lists, daily answers, benchmark and testimonials. |
| `lib/seo.ts` | Builds Next.js metadata (canonical, Open Graph, Twitter) from the registry. |
| `app/` | One folder per URL. `app/5-letter-words/[slug]` generates the 76 letter-list pages. |
| `components/` | Layout (sidebar, mobile drawer, sticky top bar, footer), UI (search, toasts, alerts, copy buttons, cookie banner, theme toggle, back-to-top, scroll progress) and content blocks (FAQ, icon lists, steps, cards, author box, testimonials). |
| `components/tools/` | The interactive tools: GridSolver, WordFinder, GuidedSolver, Dictionary, Unscrambler, DailyNotice. |
| `data/` | Word lists, daily answers, testimonials, solver benchmark and opener rankings. |
| `scripts/` | Data and image generators, plus `copy-words.mjs`, which runs before every build to publish word lists and the search index to `public/`. |

## Features

- **Three solving methods** on the homepage as accessible tabs (`#grid`, `#clues`, `#guided` deep links).
- **Left sidebar navigation** on desktop, a slide-in **mobile menu** with focus trap and Esc to close, and a **sticky top bar** with **search** (press `/` or Ctrl+K) and a **light/dark toggle** that remembers the choice without a flash.
- **Feedback states:** loading skeletons and spinners, toast **success messages**, inline **error messages**, and a retry button if a word list fails to load.
- **Extras:** scroll progress bar, back-to-top button, skip-to-content link, copy buttons, expandable FAQs, "last updated" dates, tile animations, scroll-reveal animations (with reduced-motion support) and hover states.
- **Cookie consent banner.** Optional analytics only load after the visitor accepts, and only when `NEXT_PUBLIC_GA_ID` is set at build time. "Cookie settings" in the footer reopens the banner.
- **Custom 404 page**, and a copyright year that updates to the visitor's current year.

## SEO

- Unique titles (≤ 50 chars) and meta descriptions (≤ 144 chars). Tests enforce the limits and fail on duplicates.
- Canonical URLs, Open Graph and Twitter cards. Each of the 100 pages has its own 1200×630 social image in `public/og/`.
- JSON-LD: Organization, WebSite, WebApplication, BreadcrumbList, FAQPage and Article.
- `sitemap.xml` (with image entries), `robots.txt`, `manifest.webmanifest`, favicon.ico, SVG icon, Apple touch icon and maskable PWA icons.
- WebP illustrations with descriptive alt text. Every page links back to the homepage with the anchor "Wordle Helper".
- `npm test` fails on a broken internal link, missing alt text, a missing og:image file, invalid JSON-LD, more than one H1, or a page that doesn't link back to the homepage.

## Daily hints workflow

1. `npm run add-answer -- YYYY-MM-DD answer "optional clue"`. Five hints are generated automatically (vowels, repeated letters, rare letters, first letter, last letter); the clue becomes hint 6.
2. Rebuild and deploy. Set up a daily rebuild on your host (a scheduled deploy hook or CI cron).

Entries dated after the build date (`BUILD_DATE`, default today in UTC) stay hidden, so you can schedule ahead. Once the next puzzle is published, an answer moves to `/wordle-answers/`. `data/daily.json` ships empty: no answers are bundled.

## Testimonials

`data/testimonials.json` is empty, so the "What players say" section stays hidden. Add **real** quotes from players, with their permission:

```json
[{ "quote": "Saved my 200-day streak!", "name": "Sam P.", "detail": "Plays daily since 2022", "rating": 5 }]
```

## Word lists and images

- Word lists are generated from [SCOWL](http://wordlist.aspell.net/) via `wordlist-english`. They are **not** the official NYT lists. The SCOWL license ships in `public/LICENSE-SCOWL.txt`.
- `data/benchmark.json` records a real run of the solver over every likely answer. The site quotes these numbers.
- Images are generated from SVG templates with sharp and the Inter font (`npm run images`) and committed: compressed WebP for illustrations, JPEG for social cards (the most widely supported format for link previews).

## Before launch

- Create the `hello@wordlehelp.co` mailbox, or change `SITE.email` in `lib/site.mjs`.
- Add a real author or team bio on `/about/` to strengthen E-E-A-T, and add social profile URLs to `SITE.sameAs`.
- Optionally set `NEXT_PUBLIC_GA_ID` for consent-based analytics.
- Submit `https://wordlehelp.co/sitemap.xml` to Google Search Console.
