# Migration report — lab-website

WordPress (Astra + Elementor) export `lab-website.WordPress.xml` → Astro + `@pcl/design-system`.
Build: `npm run build` ✓ · `npm run check:html` → **10 pages checked, 0 problem(s)**.

## Pages built

| WordPress page | Old URL | New URL | Source file |
|---|---|---|---|
| Home | `/` | `/` | `src/pages/index.astro` (lead text from the Home page; project cards + latest 5 publications + contact card) |
| Research | `/about/` | `/research/` (+ `/about/` meta-refresh redirect) | `src/pages/research/index.astro` (section lists come from the research files' front matter) |
| Psychedelic research | `/psychedelic-research/` | same | `src/content/research/psychedelic.md` |
| Contemplative research | `/contemplative-research/` | same | `src/content/research/contemplative.md` |
| Lab Members | `/services/` | `/people/` (+ `/services/` meta-refresh redirect) | `src/content/people/*.md` (one file per person) |
| Publications | `/publications/` | same | `src/content/publications.json` (31 structured records, grouped by year on the page) |
| Media | `/media/` | same | `src/content/pages/media.md` |
| Contact | `/contact/` | same | `src/pages/contact/index.astro` |

Also generated: `sitemap.xml`, `robots.txt`, `favicon.svg`, `apple-touch-icon.png`, `og-image.png` (1200×630, drawn in SVG → PNG, no photo).

The source's in-page anchors are preserved: `/psychedelic-research/#depression|#music|#methods|#realworld` and
`/contemplative-research/#meditation|#imagination|#interpersonal|#ecological` (the Elementor tabs became
`<h2 id="…">` sections; the "Scroll to the bottom for more categories" tab instruction was dropped as it no longer applies).

Navigation: Research · People · Publications · Media · Contact. The two research strands are **not** top-level nav
items (see "Deviations" below); they are the first thing on `/research/`, the home-page buttons, and the footer.
Footer links: Psychedelic research, Contemplative research, Contact, ReSPCT Guidelines ↗, StaMPS Data Framework ↗, The Montreal Model ↗.

## Word counts (source Elementor text vs. built `<main>`)

| Page | Source | Built | Notes |
|---|---|---|---|
| Home | 38 | 387 | Home was a hero only; built page adds project cards, 5 publications, contact card (all from other source pages / the brief) |
| Research (`/about/`) | 35 | 87 | Source was two columns of 4 buttons; built page adds a lead per strand (taken from the research pages' front matter) |
| Psychedelic research | 1669 | 1697 | All source words present (word-level diff: only "Scroll to the bottom for more categories", "mid-20 th" → "mid-20th", "individual's" → "individual’s"). Adds a "Learn more → StaMPS" button and 3 Spotify embeds |
| Contemplative research | 1277 | 1307 | All source words present (diff: the scroll instruction; a split "w" + "e" span merged into "we") |
| Lab Members | 1329 | 1552 | All bios present; built page adds a role line and a one-line summary per person (written from the bio). See typo fixes and the removed duplicate paragraph below |
| Publications | 1367 | 1334 | All 31 references present; the difference is the visible "https://doi.org/…" strings, now rendered as `doi:10.…` links |
| Media | 122 | 136 | All 3 podcasts + 4 news items; "[Read Article]" → "Read article", "LaPresse" → "La Presse" |
| Contact | 86 | 131 | All text kept; WPForms contact form replaced by a mailto button (no forms, per the rules) |

Word-level diff script: every source word sequence was checked against the built page; the only deletions are the ones listed above.

## Content decisions to review (please confirm)

1. **Contact e-mail** — the WordPress site had no public address: "All other inquiries" was a WPForms form that
   e-mailed the site admin, and the "Participating in our studies" paragraph still contains the placeholder
   `TITLE OF STUDY -- Contact email@email.com`. Both now point to `contactEmail` in `src/site.config.ts`, currently set to
   the WordPress admin address (`elisabeth.irvine@mail.mcgill.ca`). **Change it there** (one place) to the lab's preferred
   address, and replace the placeholder study text in `src/pages/contact/index.astro`.
2. **Lena Adel's bio** ended with a paragraph copied from Sara Gloeckler's ("In her spare time, Sara loves being active…").
   It was removed from Lena's file (`src/content/people/lena-adel.md`); it remains in Sara's.
3. **Typos corrected** in bios: "2011and" → "2011 and"; Jonas Mago: "meditaiton", "psychedleics", "gab", "comuptational",
   "bridge the gab between these his empirical work" → "bridge the gap between his empirical work". Publication author
   "Gloecker, S. G." (2024, *Journal of Psychedelic Studies*) → "Gloeckler, S. G.".
4. **DOIs**: in 11 references the DOI printed on the page differed from the DOI in the link (`href`); the linked DOI was
   the correct one in every case checked (e.g. printed `10.1001/jamapsychiatry.2022.12345`, linked `…2022.1749`). The
   built site uses the linked DOI. "Context is critical…" (CNS Drugs 2023) linked to psycnet.apa.org; it now links to
   `https://doi.org/10.1007/s40263-023-01053-0`.
5. "Richard-Devantoy … Psychological pain and depression (2021)" was listed under the **2020** heading; it is now under 2021
   (its citation year). Every other entry keeps its source year and order.
6. Michael Lifshitz's photo on the Lab Members page was `Screen-Shot-2025-04-17-at-1.13.22-AM.png` (not the older
   `Michael-Lifshitz_profile.jpg`); the Elementor choice was kept.
7. The three Spotify playlists are embedded with Spotify's standard iframe (lazy-loaded, no tracking script of our own).
   Their titles could not be fetched offline, so the iframes are titled "Spotify playlist 1/2/3 — …". If embeds are not
   wanted, replace the `<div class="playlists">` block in `psychedelic.md` by links.
8. Julien Thibault Lévesque is a Ph.D. student but was listed under **Post-docs** on the old site; that grouping was kept.

## Deviations from the brief

- **Top navigation has 5 items, not 7.** With the lab's long wordmark in the header lockup, seven items
  ("Research · Psychedelic research · Contemplative research · People · Publications · Media · Contact") overflow the
  design-system header and overlap the site name at every width between 1024 and ~1320 px (measured). Even shortened to
  "Psychedelics / Contemplation" they overlap below ~1320 px. The two strands are therefore linked from `/research/`,
  the home page and the footer instead. To restore them, add the two entries back to `navItems` in `src/site.config.ts`.
- `src/styles/site.css` contains one small guard for the design-system header (`.logo-lockup__name` may wrap to two
  lines between 60 em and 78 em). This does not change the look at normal widths; it only prevents the wordmark from
  running under the navigation. **Suggested upstream fix** in `Header.astro`: the ellipsis on `.logo-lockup__name`
  never kicks in because the flex item is not allowed to shrink (`min-width: 0` + `overflow: hidden` on
  `.logo-lockup__brand`, or `white-space: normal` under ~78 em).
- `Layout` links `/favicon.svg` and `/apple-touch-icon.png` and the brand link `homeHref="/"` without the base prefix,
  so on github.io (`/lab-website/`) the favicon 404s and the wordmark links to the github.io root. Both are correct once
  the custom domain is on. (Design-system issue, not fixable from the site.)
- Spotify embeds and member photos cannot be verified in the build sandbox (no network, no media) — see below.

## Media

Only one file from the export was available (`uploads/2021/11/logo-green.svg`, an unused theme logo of the 2021 Astra
template — not needed, not copied). Everything referenced by the migrated pages is listed here with its original URL.
Drop each file at `public/uploads/<year>/<month>/<same filename>`; the pages pick them up automatically at the next build
(the People cards show an initials placeholder until then, the research pages simply omit the figure).
Remember to resize anything over 400 KB (max 1600 px wide, JPEG q82 or WebP) before committing.

### Needed — member photos (12), People page

| Person | Original URL → `public/uploads/…` |
|---|---|
| Kyle Greenway | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Kyle-Greenway.jpg |
| Michael Lifshitz | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-17-at-1.13.22-AM.png |
| Nathan Fisher | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-16-at-9.54.53-PM.png |
| Sara de la Salle | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-16-at-9.46.08-PM.png |
| Mar Estarellas | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-16-at-9.57.08-PM.png |
| Julien Thibault Lévesque | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-16-at-10.03.19-PM.png |
| Jonas Mago | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-16-at-10.06.27-PM.png |
| Sara Gloeckler | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-16-at-10.08.32-PM.png |
| Lena Adel | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-16-at-10.10.39-PM.png |
| Alyssa Bensoussan | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-16-at-10.12.37-PM.png |
| Elizabeth Misener | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/04/Screen-Shot-2025-04-17-at-1.34.46-AM.png |
| Elisabeth Irvine | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/10/Elisabeth-Irvine-Profile-copy-2.jpeg |

The file names are what the `photo:` field of each `src/content/people/*.md` expects (the "Screen-Shot…" names can be
renamed, as long as the front matter is updated too). Square-ish crops look best (rendered as 88–112 px circles).

### Needed — research page figures (2)

| Page / section | Original URL |
|---|---|
| Psychedelic research → The Montreal Model | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/10/montreal-model-pic.jpg |
| Contemplative research → Jhana meditation | https://psychedelicsandcontemplationlab.com/wp-content/uploads/2025/10/jhana-pic-1.jpg |

Both have an `alt` written from context ("A ketamine treatment room of the Montreal Model program", "EEG recording during
jhāna meditation") — please correct the alt text in the Markdown if the pictures show something else.

### Not needed (theme / template / test assets in the export)

`2021/11/*` (Astra demo: service-1/2/3.jpg, avatar_1–4.jpg, header-hero*.jpg, footer-hero-*.jpg, contact-hero*.jpg,
services-hero.jpg, leaf.jpg, quotes.svg, logo-green.svg, logo-white.svg, avatar_on_home/about.png),
`2022/01/demo-screenshot.jpg`, `2022/01/header-hero.jpg`, `2025/04/oilslick_1.webp`, `oilslick_2.png`,
`NicePng_university-vector-png_*.png`, `forest_2.png`, `closeup-motionblurred-water-rapids-*.webp`, `grass.webp`,
`2025/05/homepage-background-2.png`, `website-logo-2*.jpeg`, `ldi_jgh.tmb-cfthumb_m.webp`, `McGill-LDI-job-posting-1.png`,
`transparent-logo*.png`, `2025/05/forest_2.png`, `2025/06/mt-sample-background.jpg`, `2025/04/Michael-Lifshitz_profile.jpg`
(superseded, see above). The three "test pdf" attachments (`ASI_FullProgram2024.pdf`, `Williams.pdf`, `Snodgrass.pdf`)
belonged to test posts of an unfinished ACF "Publications" post type that contained no real publications; no publication
on the live page referenced a PDF, so no PDF links were created. (Add a `"pdf": "/uploads/…pdf"` field to any record in
`publications.json` and the ⤓ link appears.)

## Checks performed

- `npm run build` and `npm run check:html` pass (one `<h1>` per page, heading order, alt text, meta description,
  og/twitter/JSON-LD, internal links and anchors, outbound `target/rel`).
- Screenshots at 1400 px and 390 px of all 10 pages (Playwright, Chromium), print preview + PDF of the longest page
  (`/psychedelic-research/`). No horizontal overflow at either width. Header checked at 1400 / 1280 / 1100 / 1024 px.
- The only 404 in the preview is `/favicon.svg` (root path written by the design-system `Layout`; fine on the domain).
- Publications page carries a `CollectionPage` + `ScholarlyArticle` JSON-LD; other pages use the organisation schema.
- No forms, no analytics, no background media. Contact = `mailto:` only.

## Editing content later

- Bios: `src/content/people/<name>.md` (front matter: name, role, group, order, photo, summary, links; body = bio).
- Publications: `src/content/publications.json` (add a record with `order`, `year`, `authors`, `title`, `journal`,
  `volume`/`issue`/`pages`, `doi` and optionally `pdf`).
- Research text: `src/content/research/psychedelic.md`, `contemplative.md` (Markdown; `<h2 id="…">` keep the anchors).
- Media list: `src/content/pages/media.md`. Site name, e-mail, nav, footer links, projects: `src/site.config.ts`.

## Version 2.0 pass (original identity, polished)

Rebuilt the visuals as "version 2.0 of the original site" (`V2-BRIEF.md`). Content unchanged.

- **Texture**: `public/images/marble-1920.webp` (160 KB) and `marble-960.webp` (56 KB, under 60em) from
  `uploads/2025/04/oilslick_1.webp`, upscaled with Lanczos and desaturated to 45 % so that, under the
  CSS veil (`rgba(74,52,86,.58)` on the home hero, `rgba(50,34,60,.74)` on inner bands), it reads as the
  original's muted purple marble. No dithered PNG. `<Marble>` renders the two layers (texture with
  `data-parallax`, veil); `<BandHeader>` is the inner pages' marbled header with the page's only `<h1>`.
- **Local tokens** in `src/styles/site.css`: `--brand-purple #5A4466`, `--brand-olive #55624F`;
  the design-system accent `#4B6A8A` stays for links and UI on white.
- **Home**: full-viewport marbled hero, lab name in Source Serif 4 `clamp(3rem, 9vw, 8.5rem)` bottom-left,
  first sentence of the lead, white primary + outlined secondary buttons; header transparent over the hero
  (logos on cream pills). Below: the three project cards (ReSPCT illustration; StaMPS purple, Montreal
  Model olive — its schematic is unreadable under a card gradient) and the five latest publications.
  The "Working with the lab" card moved off the home page (its text is on /contact/).
- **Research pages**: marbled band, "← Back to all research", category tab-row (white pill = the category
  on screen, tracked by a small IntersectionObserver). **Research index**: two marbled panels.
- **People**: "LAB DIRECTORS" label between rules, directors as purple / olive panels with the full bio
  and a square photo, other groups in 2–3-column purple/olive panels with the biography disclosure.
- **Publications / Media / Contact**: marbled band + unchanged lists; year tabs in the band.
- **Measured contrast** (white text vs the 5 % brightest background pixels under it, Playwright at 1400):
  home h1 5.8:1, home lead 7.9:1, band h1 ≥ 7.6:1, band lead ≥ 7.6:1, tab pills 7.7:1, strand panel
  title 5.7:1 / text 7.1:1, purple panel text 8.6:1, olive panel text 6.5:1.
- Build OK, `npm run check:html` 0 problems, no console errors. Screenshots: `screenshots/*-1400-top.png`,
  `*-1400.png`, `*-390-top.png`, `*-390.png` for home, research, psychedelic, contemplative, people,
  publications, media, contact; `home-1400-reduced-motion.png`, `people-1400-reduced-motion.png`,
  `psychedelic-print.png`. Script: `scripts/screenshots.mjs`.
