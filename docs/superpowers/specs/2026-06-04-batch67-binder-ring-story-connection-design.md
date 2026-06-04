# Batch67 Binder Ring Story Connection Design

## Standing Approval

The active Plot Sprout goal asks for indefinite, front-loaded, batch-based product generation without turning the app into a mismatched feature pile. Batch67 continues the established static premium card-pack pattern. It does not add accounts, publishing, uploads, public mutation endpoints, checkout wiring, scheduled generation, or any new app mechanic.

## Product

- Title: `Binder Ring Story Connection Card Pack`
- Slug: `binder-ring-story-connection-card-pack`
- Price: `$107`
- Batch id: `2026-06-04-batch67`
- Route: `/binder-ring-story-connection-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch67 is an adult-led printable pack for private paper writing sessions. The writing skill is fictional story connection: each card helps a writer name one invented story detail, connect it to another invented detail, explain why the connection fits, write one bridge sentence, and finish with a binder-ring check. The product should feel like calm paper rings holding story ideas together, not a citation exercise, source analysis task, review, grade, portfolio, display, public sharing flow, or real reading record.

## Selected Approach

Use the established Batch52-Batch66 architecture.

The alternatives considered were:

- Add an interactive story-connection board. This would create new UI mechanics and raise privacy and maintenance risk.
- Build a real-reading connection product. This would invite real titles, authors, quotes, citations, ratings, reviews, and assessment language.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch67-binder-ring-story-connection-cards-a.json`
- `content/product-artifacts/lanes/batch67-binder-ring-story-connection-cards-b.json`
- `content/product-artifacts/lanes/batch67-binder-ring-story-connection-cards-c.json`
- `content/product-artifacts/lanes/batch67-binder-ring-story-connection-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `connectionSkill`, `useCase`, `adultSetup`, `kidDirection`, `firstDetailPrompt`, `connectionPrompt`, `becausePrompt`, `secondDetailPrompt`, `bridgeSentencePrompt`, `binderRingCheckPrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `connectionRoutines`, `takeHomeConnectionSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/binder-ring-story-connection-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home connection slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `mitten-market-lost-ticket`
2. `sticker-station-mail-cart`
3. `spoon-ferry-lunchbox-harbor`
4. `penny-path-compass-shop`
5. `buttonwood-library-train`
6. `paperclip-plaza-parcel-day`
7. `pond-bridge-blueprint-club`
8. `cloudberry-clocktower`
9. `solar-oven-picnic-station`
10. `greenhouse-gear-garden`
11. `seed-library-map-room`
12. `compass-craft-academy`
13. `pencil-dragon-academy`
14. `blue-pencil-observatory`
15. `margin-note-market`
16. `index-card-theater-club`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch67 rebalances toward lower-frequency recent worlds and validation should enforce exact overlap counts of 6 with Batch58, 6 with Batch59, 7 with Batch60, 8 with Batch61, 6 with Batch62, 6 with Batch63, 6 with Batch64, 6 with Batch65, and 6 with Batch66.

Product/display ages must stay constrained to 7-11.

## Safety Constraints

Batch67 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, ratings, reviews, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, call numbers, barcode labels, source citations, quotations from real works, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, `public`, `review`, `rating`, `quote`, `citation`, or `source` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `detail`, `connects to`, `because`, `second detail`, `bridge sentence`, and `binder ring check` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch67/binder-ring-story-connection-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch67/binder-ring-story-connection-card-pack.webp`
- Image sidecar at `content/image-runs/batch67/binder-ring-story-connection-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch67-images.json`
- Static route at `public/binder-ring-story-connection-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/binder-ring-story-connection-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, link, and checkout-pending state.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch67 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch67 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and the live Batch67 JPEG loads from the committed static path.
