# Batch64 Bookend Story Evidence Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch64 follows the established static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, scheduled generation, or unauthenticated mutation endpoints.

## Product

- Title: `Bookend Story Evidence Card Pack`
- Slug: `bookend-story-evidence-card-pack`
- Price: `$101`
- Batch id: `2026-06-04-batch64`
- Route: `/bookend-story-evidence-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch64 is an adult-led printable pack for private paper writing sessions. The writing skill is fictional story evidence: each card helps a writer make a small story claim, find two invented clue details, connect them with a because line, write one evidence sentence, and close with a bookend note. The pack should feel like calm paper bookends holding invented story clues, not a real book report grade, real source citation, review form, diary, portfolio, publishing workflow, public display, or online sharing flow.

## Selected Approach

Use the established Batch52-Batch63 architecture.

The alternatives considered were:

- Add an interactive evidence organizer. This would create new app mechanics and increase safety, privacy, and maintenance risk.
- Build a real-book evidence pack. This would invite real titles, real author names, quote extraction, ratings, reviews, grades, and assessment pressure.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch64-bookend-evidence-cards-a.json`
- `content/product-artifacts/lanes/batch64-bookend-evidence-cards-b.json`
- `content/product-artifacts/lanes/batch64-bookend-evidence-cards-c.json`
- `content/product-artifacts/lanes/batch64-bookend-evidence-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `evidenceSkill`, `useCase`, `adultSetup`, `kidDirection`, `storyClaimPrompt`, `firstCluePrompt`, `secondCluePrompt`, `becauseLinePrompt`, `evidenceSentencePrompt`, `bookendNotePrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `evidenceRoutines`, `takeHomeEvidenceSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/bookend-story-evidence-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home evidence slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `moon-muffin-market`
2. `puddle-planet-post-office`
3. `teacup-town-weather-window`
4. `button-bakery-map-mixup`
5. `penny-path-compass-shop`
6. `pocket-park-notice-board`
7. `greenhouse-gear-garden`
8. `orchard-pulley-post`
9. `rain-gauge-railway`
10. `cloudberry-clocktower`
11. `tiny-lantern-reef`
12. `almost-invention-workshop`
13. `clue-label-tower-museum`
14. `compass-craft-academy`
15. `margin-note-market`
16. `pencil-dragon-academy`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch64 uses a balanced set and validation should enforce overlap counts of 5 with Batch56, 6 with Batch57, 6 with Batch58, 6 with Batch59, 6 with Batch60, 7 with Batch61, 7 with Batch62, and 6 with Batch63.

## Safety Constraints

Batch64 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, ratings, reviews, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, call numbers, barcode labels, source citations, quotations from real works, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, `public`, `review`, `rating`, `quote`, or `citation` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `story claim`, `first clue`, `second clue`, `because line`, `evidence sentence`, and `bookend note` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch64/bookend-story-evidence-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch64/bookend-story-evidence-card-pack.webp`
- Image sidecar at `content/image-runs/batch64/bookend-story-evidence-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch64-images.json`
- Static route at `public/bookend-story-evidence-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/bookend-story-evidence-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, and link.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch64 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch64 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch64 JPEG bytes match the committed file.
