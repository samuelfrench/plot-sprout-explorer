# Quiet Corner Story Map Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch 29, the `$31` Quiet Corner Story Map Card Pack, as a checkout-pending static product page plus PDF/source/ZIP artifact.

**Architecture:** Follow the recent product pattern: three map-card lane JSON files plus one tools lane feed one canonical source JSON, one product-artifact policy validator, one builder that writes source HTML/PDF/ZIP/manifest, one static product page rendered by `scripts/render-seo-collections.mjs`, and one local RTX 4090 product image manifest. The product is an adult-led paper story-map card pack; maps are fictional story-shape tools only, never real routes, GPS, addresses, or real-place directions.

**Tech Stack:** Node ESM scripts, Vitest, Playwright/Chromium PDF generation, static HTML under `public/`, local SDXL image generation via `scripts/generate_story_images_local.py`, GitHub Pages deploy on push.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch29-quiet-corner-map-cards-a.json`
- Create: `content/product-artifacts/lanes/batch29-quiet-corner-map-cards-b.json`
- Create: `content/product-artifacts/lanes/batch29-quiet-corner-map-cards-c.json`
- Create: `content/product-artifacts/lanes/batch29-quiet-corner-map-tools.json`

- [ ] Write three map-card lanes covering 16 total printable story-map cards.
- [ ] Write one tools lane with adult guide, 6 map routines, 10 take-home map slips, and 8 optional share prompts.
- [ ] Keep every item adult-led, paper-only, offline, fictional, and creative-writing focused.
- [ ] Run JSON parse checks on all four lane files.
- [ ] Run scoped safety scans for account/login/upload/public post/review/rating/score/grade/contest/prize/timer/address/GPS/coordinates/real route/real location/photo/camera/medical/legal/therapy/grief/politics/religion/romance/weapon/violence/branded-franchise language.

### Task 2: RED Builder And Policy Tests

**Files:**
- Create: `scripts/quiet-corner-story-map-card-pack-builder.test.mjs`

- [ ] Add a Vitest file that imports `validateQuietCornerStoryMapCardPackSource`, `validateQuietCornerStoryMapCardPackSourceFiles`, `buildQuietCornerStoryMapCardPack`, `loadQuietCornerStoryMapCardPackBuildInputs`, and `renderQuietCornerStoryMapCardPackHtml`.
- [ ] Fixture contract: product slug `quiet-corner-story-map-card-pack`, title `Quiet Corner Story Map Card Pack`, price `$31`, batch `2026-06-02-batch29`, 16 card records, 6 routines, 10 take-home slips, 8 share prompts.
- [ ] Add safety regression blocking real addresses, GPS, coordinates, exact places, real routes, photos, cameras, accounts, upload/public posting/review/rating, grade/score/timer/prize/contest, medical/legal/therapy/grief, politics, religion, romance, weapon, violence, and branded/franchise language.
- [ ] Add builder test: temporary build writes `Quiet-Corner-Story-Map-Card-Pack.pdf`, source HTML, README, manifest, ZIP, and 16 copied local image assets.
- [ ] Add render test: HTML contains 16 `story-map-card-page` pages, no checkout/payment copy, no account/public-posting/review/rating/tracker copy, and no artifact page overflow after images load.
- [ ] Run: `npx vitest run scripts/quiet-corner-story-map-card-pack-builder.test.mjs --testTimeout 40000`
- [ ] Expected RED: imports fail because the Batch 29 validator and builder do not exist yet.

### Task 3: Product Policy

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`

- [ ] Export `quietCornerStoryMapCardPackProductSlug`.
- [ ] Add required artifact paths for the Batch 29 PDF, ZIP, source HTML, and manifest.
- [ ] Add `validateQuietCornerStoryMapCardPackSource` with exact count checks, writable blank checks, world age-band matching, checkout-pending source alignment, source-file coverage, and safety regexes.
- [ ] Add `validateQuietCornerStoryMapCardPackSourceFiles` to require exactly three card lane files and one tools lane, and to compare lane content byte-for-byte after ID sort.
- [ ] Route `inspectArtifactFiles` to the Batch 29 expected artifact paths.

### Task 4: Builder And Source

**Files:**
- Create: `content/product-artifacts/quiet-corner-story-map-card-pack.json`
- Create: `scripts/quiet-corner-story-map-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Merge the four lane files into canonical Batch 29 source JSON.
- [ ] Add a builder modeled on `scripts/window-seat-story-scene-card-pack-builder.mjs` with 16 story-map-card pages, adult guide page, world menu, map routine page, take-home map slip page, README, manifest, and ZIP.
- [ ] Keep PDF metadata deterministic after Playwright writes the PDF.
- [ ] Add `product:quiet-corner-map-pack` script.

### Task 5: Product Page, App Link, Image Manifest

**Files:**
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `content/image-queue/2026-06-02-batch29-product-images.json`

- [ ] Add the `$31` checkout-pending product record with `mailto:` CTA, local hero image path, included pages, use cases, parent steps, 16 world slugs, and product-specific safe world summaries.
- [ ] Add homepage product link and update `storyData.test.ts` expected slugs/prices.
- [ ] Add Batch 29 image manifest and `image:batch29` script.
- [ ] Extend `validate-content-batch.mjs` to require the product page, source file, image manifest, artifact, and checkout-pending state.
- [ ] Render pages with `npm run render:seo`.

### Task 6: Local Image And Artifact Generation

**Files:**
- Create: `public/images/plotsprout/batch29/quiet-corner-story-map-card-pack.jpg`
- Create: `public/images/plotsprout/batch29/quiet-corner-story-map-card-pack.webp`
- Create: `content/image-runs/batch29/quiet-corner-story-map-card-pack.json`
- Create: `product-build/quiet-corner-story-map-card-pack/**`
- Create: `public/quiet-corner-story-map-card-pack/index.html`

- [ ] Generate the product image locally on the RTX 4090 only. Reject outputs with readable/pseudo text, logos, devices, people/faces, photos/cameras, real-home/address cues, real navigation/GPS signals, public-review/rating signals, scores, timers, or branded/copyrighted material.
- [ ] Run: `npm run product:quiet-corner-map-pack`.
- [ ] Run: `npm run render:seo`.
- [ ] Inspect PDF page count with `pdfinfo product-build/quiet-corner-story-map-card-pack/Quiet-Corner-Story-Map-Card-Pack.pdf`; expected 21 pages.
- [ ] Run: `npm run verify`.

### Task 7: Review, Deploy, Closeout

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run local Playwright smoke for `/`, `/quiet-corner-story-map-card-pack/`, `/window-seat-story-scene-card-pack/`, and `/writing-desk-story-prompt-strip-pack/` on desktop and mobile.
- [ ] Dispatch read-only spec and quality reviewers.
- [ ] Commit and push Batch 29 code/artifacts.
- [ ] Watch the push-triggered `Deploy` GitHub Actions run on the self-hosted runner.
- [ ] Run live Playwright smoke for `/`, `/quiet-corner-story-map-card-pack/`, `/window-seat-story-scene-card-pack/`, and `/writing-desk-story-prompt-strip-pack/`.
- [ ] Update `TODO.md` to mark Batch 29 shipped and set the next batch.
- [ ] Commit/push TODO closeout with `[skip ci]`.
- [ ] Update memory with shipped commits, run ID, tests, image path, billable-service state, and checkout status.
