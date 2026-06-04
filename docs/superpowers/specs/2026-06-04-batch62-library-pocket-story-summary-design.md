# Batch62 Library Pocket Story Summary Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch62 follows the established static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, scheduled generation, or unauthenticated mutation endpoints.

## Product

- Title: `Library Pocket Story Summary Card Pack`
- Slug: `library-pocket-story-summary-card-pack`
- Price: `$97`
- Batch id: `2026-06-04-batch62`
- Route: `/library-pocket-story-summary-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch62 is an adult-led printable pack for private paper writing sessions. The writing skill is fictional story summary: each card helps a writer name one story start, main action, important change, ending result, keeper detail, short summary sentence, and library pocket label. The pack should feel like a calm paper pocket tucked into a folder, not a library account, review form, book report grade, diary, portfolio, publishing workflow, or online sharing flow.

## Selected Approach

Use the established Batch52-Batch61 architecture.

The alternatives considered were:

- Add an interactive summary builder. This would create new app mechanics and increase safety, privacy, and maintenance risk.
- Build a real-book review pack. This would invite real titles, real author names, ratings, public-review language, and assessment pressure.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch62-library-pocket-summary-cards-a.json`
- `content/product-artifacts/lanes/batch62-library-pocket-summary-cards-b.json`
- `content/product-artifacts/lanes/batch62-library-pocket-summary-cards-c.json`
- `content/product-artifacts/lanes/batch62-library-pocket-summary-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `summarySkill`, `useCase`, `adultSetup`, `kidDirection`, `storyStartPrompt`, `mainActionPrompt`, `importantChangePrompt`, `endingResultPrompt`, `keeperDetailPrompt`, `summarySentencePrompt`, `libraryPocketLabelPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `summaryRoutines`, `takeHomeSummarySlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/library-pocket-story-summary-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home summary slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `moon-muffin-market`
2. `pencil-dragon-academy`
3. `teacup-town-weather-window`
4. `mitten-market-lost-ticket`
5. `rain-boot-route-rangers`
6. `greenhouse-gear-garden`
7. `moss-message-observatory`
8. `rain-gauge-railway`
9. `compost-clock-workshop`
10. `seed-library-map-room`
11. `solar-oven-picnic-station`
12. `tidepool-timekeepers-lab`
13. `almost-invention-workshop`
14. `appendix-archive-lab`
15. `clue-label-tower-museum`
16. `index-card-theater-club`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch62 gives all Batch61 worlds a rest and avoids real-library-service framing. Validation should enforce overlap counts of 6 with Batch56, 8 with Batch57, 6 with Batch58, 7 with Batch59, 13 with Batch60, and 0 with Batch61.

## Safety Constraints

Batch62 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, ratings, reviews, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, `public`, `review`, or `rating` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `summary`, `story start`, `main action`, `important change`, `ending result`, `keeper detail`, `summary sentence`, and `library pocket label` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch62/library-pocket-story-summary-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch62/library-pocket-story-summary-card-pack.webp`
- Image sidecar at `content/image-runs/batch62/library-pocket-story-summary-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch62-images.json`
- Static route at `public/library-pocket-story-summary-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/library-pocket-story-summary-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, and link.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch62 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch62 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch62 JPEG bytes match the committed file.
