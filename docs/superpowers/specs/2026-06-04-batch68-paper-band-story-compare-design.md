# Batch68 Paper Band Story Compare Design

## Standing Approval

The active Plot Sprout goal asks for indefinite, front-loaded, batch-based product generation without turning the app into a mismatched feature pile. Batch68 continues the established static premium card-pack pattern. It does not add accounts, publishing, uploads, public mutation endpoints, checkout wiring, scheduled generation, or any new app mechanic.

## Product

- Title: `Paper Band Story Compare Card Pack`
- Slug: `paper-band-story-compare-card-pack`
- Price: `$109`
- Batch id: `2026-06-04-batch68`
- Route: `/paper-band-story-compare-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch68 is an adult-led printable pack for private paper writing sessions. The writing skill is fictional story comparison: each card helps a writer name two invented story details, mark what is the same, mark what is different, write one compare sentence using `but` or `while`, and finish with a paper band check. The product should feel like a calm paper band holding two story details side by side, not a real-book review, source analysis task, citation exercise, grade, portfolio, display, public sharing flow, or real reading record.

## Selected Approach

Use the established Batch52-Batch67 architecture.

The alternatives considered were:

- Add an interactive compare board. This would create new UI mechanics and raise privacy and maintenance risk.
- Build a real-reading compare product. This would invite real titles, authors, quotes, citations, ratings, reviews, and assessment language.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-a.json`
- `content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-b.json`
- `content/product-artifacts/lanes/batch68-paper-band-story-compare-cards-c.json`
- `content/product-artifacts/lanes/batch68-paper-band-story-compare-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `compareSkill`, `useCase`, `adultSetup`, `kidDirection`, `firstDetailPrompt`, `secondDetailPrompt`, `samePrompt`, `differentPrompt`, `compareSentencePrompt`, `paperBandCheckPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `compareRoutines`, `takeHomeCompareSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/paper-band-story-compare-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home compare slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `mitten-market-lost-ticket` ages `7-8`
2. `moon-muffin-market` display ages `7-8`
3. `acorn-avenue-errand-office` ages `7-9`
4. `button-bakery-map-mixup` ages `7-9`
5. `penny-path-compass-shop` ages `7-9`
6. `rain-boot-route-rangers` ages `7-9`
7. `compost-clock-workshop` ages `8-10`
8. `orchard-pulley-post` ages `8-10`
9. `pond-bridge-blueprint-club` ages `8-10`
10. `seed-library-map-room` ages `8-10`
11. `tidepool-timekeepers-lab` ages `8-10`
12. `almost-invention-workshop` ages `10-11`
13. `blue-pencil-observatory` ages `10-11`
14. `chapter-gate-greenhouse` ages `10-11`
15. `pencil-dragon-academy` ages `10-11`
16. `revision-river-ferry` ages `10-11`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch68 rebalances toward lower-frequency recent worlds and validation should enforce exact overlap counts of 6 with Batch59, 6 with Batch60, 7 with Batch61, 8 with Batch62, 6 with Batch63, 6 with Batch64, 6 with Batch65, 6 with Batch66, and 6 with Batch67.

Product/display ages must stay constrained to 7-11. `moon-muffin-market` is displayed as `7-8` inside this product even though its broader world record is `6-8`.

## Safety Constraints

Batch68 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, ratings, reviews, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, call numbers, barcode labels, source citations, quotations from real works, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, `public`, `review`, `rating`, `quote`, `citation`, or `source` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `first detail`, `second detail`, `same`, `different`, `but`, `while`, `compare sentence`, and `paper band check` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch68/paper-band-story-compare-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch68/paper-band-story-compare-card-pack.webp`
- Image sidecar at `content/image-runs/batch68/paper-band-story-compare-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch68-images.json`
- Static route at `public/paper-band-story-compare-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/paper-band-story-compare-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, link, and checkout-pending state.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch68 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch68 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and the live Batch68 JPEG loads from the committed static path.
