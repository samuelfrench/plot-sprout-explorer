# Batch63 Shelf Marker Story Theme Design

## Standing Approval

The standing Plot Sprout goal asks for indefinite, front-loaded, batch-based content generation without turning the app into an unrelated feature pile. Batch63 follows the established static product-pack pattern and does not add app mechanics, accounts, public posting, uploads, checkout wiring, scheduled generation, or unauthenticated mutation endpoints.

## Product

- Title: `Shelf Marker Story Theme Card Pack`
- Slug: `shelf-marker-story-theme-card-pack`
- Price: `$99`
- Batch id: `2026-06-04-batch63`
- Route: `/shelf-marker-story-theme-card-pack/`
- Checkout state: pending, mailto-only CTA

Batch63 is an adult-led printable pack for private paper writing sessions. The writing skill is fictional story theme: each card helps a writer notice a story question, repeatable clue, character choice, ending echo, theme line, and shelf marker note. The pack should feel like calm paper shelf markers used to sort fictional story ideas, not a real library account, real book record, review form, book report grade, diary, portfolio, publishing workflow, or online sharing flow.

## Selected Approach

Use the established Batch52-Batch62 architecture.

The alternatives considered were:

- Add an interactive theme builder. This would create new app mechanics and increase safety, privacy, and maintenance risk.
- Build a real-book theme-analysis pack. This would invite real titles, real author names, ratings, public-review language, and assessment pressure.
- Build the next premium static card pack. This keeps the product family coherent and lets existing validators, renderers, local image generation, artifact build, review, deploy, and live-smoke patterns carry the work.

The selected approach is the third option.

## Content Contract

Create three card lane files plus one tools lane:

- `content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-a.json`
- `content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-b.json`
- `content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-c.json`
- `content/product-artifacts/lanes/batch63-shelf-marker-theme-tools.json`

Cards use this field order:

`id`, `title`, `worldSlug`, `ageBand`, `themeSkill`, `useCase`, `adultSetup`, `kidDirection`, `storyQuestionPrompt`, `repeatedCluePrompt`, `characterChoicePrompt`, `endingEchoPrompt`, `themeLinePrompt`, `shelfMarkerNotePrompt`, `quietOptionLine`, `takeHomeLine`.

Tools use:

`adultGuide`, `themeRoutines`, `takeHomeThemeSlips`, `optionalAdultPrompts`.

The source file `content/product-artifacts/shelf-marker-story-theme-card-pack.json` combines the lanes into 16 cards, 6 routines, 10 take-home theme slips, and 8 optional adult prompts.

## World Set

Use these 16 worlds in this order:

1. `compass-craft-academy`
2. `tiny-lantern-reef`
3. `acorn-avenue-errand-office`
4. `compost-clock-workshop`
5. `pantry-measurement-mystery`
6. `button-bakery-map-mixup`
7. `revision-river-ferry`
8. `sticker-station-mail-cart`
9. `moon-muffin-market`
10. `index-card-theater-club`
11. `puddle-planet-post-office`
12. `binding-day-boardwalk`
13. `seed-library-map-room`
14. `moss-message-observatory`
15. `cloudberry-clocktower`
16. `spoon-ferry-lunchbox-harbor`

The finite world pool makes a perfectly fresh 16-world product impossible. Batch63 uses a balanced set and validation should enforce overlap counts of 6 with Batch56, 6 with Batch57, 6 with Batch58, 6 with Batch59, 6 with Batch60, 7 with Batch61, and 5 with Batch62.

## Safety Constraints

Batch63 must stay family-friendly and offline:

- No violence, horror, weapons, bullying, romance, politics, religion, gambling, branded characters, or ads targeted to children.
- No real school/home identity details, real addresses, real routes, public posting, accounts, uploads, child profiles, private diary-style disclosures, camera/photo/audio/video/voice-memo flows, or child data collection.
- No grading, scores, timers, rubrics, assessments, spelling grades, perfection pressure, portfolio/showcase/display/publishing pressure, ratings, reviews, real book titles, real author names, real library names, library cards, checkout desks, due dates, fines, call numbers, barcode labels, or online sharing.
- No food/allergy/medical advice and no standalone `food`, `address`, `public`, `review`, or `rating` terms.
- Avoid provider/payment terms in generated artifacts and review-facing metadata. Checkout remains pending.
- Avoid dramatic-series marketing terms such as `episode`, `chapter book`, `screenplay`, `cliffhanger`, `plot twist`, `choose your own adventure`, and `publishable`.
- Use `theme`, `story question`, `repeated clue`, `character choice`, `ending echo`, `theme line`, and `shelf marker note` language.

## Artifacts And UI

Build the same asset stack as the prior premium packs:

- Local SDXL product image at `public/images/plotsprout/batch63/shelf-marker-story-theme-card-pack.jpg`
- WebP companion at `public/images/plotsprout/batch63/shelf-marker-story-theme-card-pack.webp`
- Image sidecar at `content/image-runs/batch63/shelf-marker-story-theme-card-pack.json`
- Image queue at `content/image-queue/2026-06-04-batch63-images.json`
- Static route at `public/shelf-marker-story-theme-card-pack/index.html`
- PDF/source HTML/README/manifest/ZIP under `product-build/shelf-marker-story-theme-card-pack/`

The product should appear on the homepage product shelf through `src/storyData.ts`, with tests confirming title, slug, price, and link.

## Verification

Required checks:

- RED focused tests fail before implementation.
- Focused Batch63 tests pass after implementation.
- `npm run verify:content` passes with updated counts.
- Full `npm run verify` passes.
- Local Playwright desktop and mobile smoke checks pass for homepage and Batch63 route, including console/page errors and image loading.
- Content/artifact and code/static reviews approve before merge.
- GitHub Actions Deploy succeeds after pushing `main`.
- Live GitHub Pages desktop/mobile smoke passes, and live Batch63 JPEG bytes match the committed file.
