# Batch66 Paper Tab Story Inference Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch66 follows the established static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, scheduled generation, or unauthenticated mutation endpoints.

## Product

- Title: `Paper Tab Story Inference Card Pack`
- Slug: `paper-tab-story-inference-card-pack`
- Price: `$105`
- Batch id: `2026-06-04-batch66`
- Route: `/paper-tab-story-inference-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch66 is an adult-led printable pack for private paper writing sessions. The writing skill is fictional inference: each card helps a writer notice one invented clue, say what it might suggest inside the pretend story, add a second clue, write one short inference sentence, and finish with a paper tab check. The pack should feel like calm paper tabs guiding story thinking, not a real book report, source-citation exercise, grade, review, diary, portfolio, public display, or online sharing flow.

## Selected Approach

Use the established Batch52-Batch65 architecture.

The alternatives considered were:

- Add an interactive inference board. This would create new app mechanics and increase safety, privacy, and maintenance risk.
- Build a real-reading inference product. This would invite real titles, real author names, quotes, source framing, ratings, reviews, and assessment pressure.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch66-paper-tab-story-inference-cards-a.json`
- `content/product-artifacts/lanes/batch66-paper-tab-story-inference-cards-b.json`
- `content/product-artifacts/lanes/batch66-paper-tab-story-inference-cards-c.json`
- `content/product-artifacts/lanes/batch66-paper-tab-story-inference-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `inferenceSkill`, `useCase`, `adultSetup`, `kidDirection`, `cluePrompt`, `suggestsPrompt`, `whyPrompt`, `secondCluePrompt`, `inferenceSentencePrompt`, `paperTabCheckPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `inferenceRoutines`, `takeHomeInferenceSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/paper-tab-story-inference-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home inference slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `puddle-planet-post-office`
2. `moon-muffin-market`
3. `teacup-town-weather-window`
4. `mitten-market-lost-ticket`
5. `button-bakery-map-mixup`
6. `penny-path-compass-shop`
7. `spoon-ferry-lunchbox-harbor`
8. `buttonwood-library-train`
9. `rain-boot-route-rangers`
10. `cloudberry-clocktower`
11. `rain-gauge-railway`
12. `pantry-measurement-mystery`
13. `solar-oven-picnic-station`
14. `appendix-archive-lab`
15. `chapter-gate-greenhouse`
16. `binding-day-boardwalk`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch66 uses a balanced set with product/display ages constrained to 7-11 and validation should enforce overlap counts of 6 with Batch57, 6 with Batch58, 6 with Batch59, 6 with Batch60, 6 with Batch61, 7 with Batch62, 7 with Batch63, 7 with Batch64, and 6 with Batch65.

For worlds whose stored age band starts at 6, use `7-8` in Batch66 product/card display so the paid product remains in the 7-11 range.

## Safety Constraints

Batch66 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, ratings, reviews, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, call numbers, barcode labels, source citations, quotations from real works, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, `public`, `review`, `rating`, `quote`, `citation`, or `source` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `clue`, `might suggest`, `why`, `second clue`, `inference sentence`, and `paper tab check` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch66/paper-tab-story-inference-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch66/paper-tab-story-inference-card-pack.webp`
- Image sidecar at `content/image-runs/batch66/paper-tab-story-inference-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch66-images.json`
- Static route at `public/paper-tab-story-inference-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/paper-tab-story-inference-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, link, and checkout-pending state.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch66 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch66 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch66 JPEG loads from the committed static path.
