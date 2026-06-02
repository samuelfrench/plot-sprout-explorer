# Window Seat Story Scene Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch 28, the `$29` Window Seat Story Scene Card Pack, as a checkout-pending static product page plus PDF/source/ZIP artifact.

**Architecture:** Follow the recent product pattern: three scene-card lane JSON files plus one tools lane feed one canonical source JSON, one product-artifact policy validator, one builder that writes source HTML/PDF/ZIP/manifest, one static product page rendered by `scripts/render-seo-collections.mjs`, and one local RTX 4090 product image manifest. The product is an adult-led paper scene-card pack; "window seat" means a pretend framed view or imagined window view only.

**Tech Stack:** Node ESM scripts, Vitest, Playwright/Chromium PDF generation, static HTML under `public/`, local SDXL image generation via `scripts/generate_story_images_local.py`, GitHub Pages deploy on push.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch28-window-scene-cards-a.json`
- Create: `content/product-artifacts/lanes/batch28-window-scene-cards-b.json`
- Create: `content/product-artifacts/lanes/batch28-window-scene-cards-c.json`
- Create: `content/product-artifacts/lanes/batch28-window-scene-tools.json`

- [x] Write three scene-card lanes covering 16 total printable scene cards.
- [x] Write one tools lane with adult guide, 6 scene routines, 10 take-home scene slips, and 8 optional share prompts.
- [x] Keep every item adult-led, paper-only, offline, fictional, and creative-writing focused.
- [x] Run JSON parse checks on all four lane files.
- [x] Run scoped safety scans for account/login/upload/public post/review/rating/score/grade/contest/prize/timer/address/GPS/photo/camera/window-safety/weather-safety/medical/legal/therapy/grief/politics/religion/romance/weapon/violence/branded-franchise language.

### Task 2: RED Builder And Policy Tests

**Files:**
- Create: `scripts/window-seat-story-scene-card-pack-builder.test.mjs`

- [x] Add a Vitest file that imports `validateWindowSeatStorySceneCardPackSource`, `validateWindowSeatStorySceneCardPackSourceFiles`, `buildWindowSeatStorySceneCardPack`, `loadWindowSeatStorySceneCardPackBuildInputs`, and `renderWindowSeatStorySceneCardPackHtml`.
- [x] Fixture contract: product slug `window-seat-story-scene-card-pack`, title `Window Seat Story Scene Card Pack`, price `$29`, batch `2026-06-02-batch28`, 16 card records, 6 routines, 10 take-home slips, 8 share prompts.
- [x] Add safety regression blocking real addresses, real homes, GPS, routes, exact places, photos, cameras, window-safety/weather-safety advice, accounts, upload/public posting/review/rating, grade/score/timer/prize/contest, medical/legal/therapy/grief, politics, religion, romance, weapon, violence, and branded/franchise language.
- [x] Add builder test: temporary build writes `Window-Seat-Story-Scene-Card-Pack.pdf`, source HTML, README, manifest, ZIP, and 16 copied local image assets.
- [x] Add render test: HTML contains 16 `scene-card-page` pages, no checkout/payment copy, no account/public-posting/review/rating/tracker copy, and no artifact page overflow after images load.
- [x] Run: `npx vitest run scripts/window-seat-story-scene-card-pack-builder.test.mjs --testTimeout 40000`
- [x] Expected RED: imports fail because the Batch 28 validator and builder do not exist yet.

### Task 3: Product Policy

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`

- [x] Export `windowSeatStorySceneCardPackProductSlug`.
- [x] Add required artifact paths for the Batch 28 PDF, ZIP, source HTML, and manifest.
- [x] Add `validateWindowSeatStorySceneCardPackSource` with exact count checks, writable blank checks, world age-band matching, checkout-pending source alignment, source-file coverage, and safety regexes.
- [x] Add `validateWindowSeatStorySceneCardPackSourceFiles` to require exactly three card lane files and one tools lane, and to compare lane content byte-for-byte after ID sort.
- [x] Route `inspectArtifactFiles` to the Batch 28 expected artifact paths.

### Task 4: Builder And Source

**Files:**
- Create: `content/product-artifacts/window-seat-story-scene-card-pack.json`
- Create: `scripts/window-seat-story-scene-card-pack-builder.mjs`
- Modify: `package.json`

- [x] Merge the four lane files into canonical Batch 28 source JSON.
- [x] Add a builder modeled on `scripts/writing-desk-story-prompt-strip-pack-builder.mjs` with 16 scene-card pages, adult guide page, world menu, scene routine page, take-home scene slip page, README, manifest, and ZIP.
- [x] Keep PDF metadata deterministic after Playwright writes the PDF.
- [x] Add `product:window-seat-scene-pack` script.

### Task 5: Product Page, App Link, Image Manifest

**Files:**
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `content/image-queue/2026-06-02-batch28-product-images.json`

- [x] Add the `$29` checkout-pending product record with `mailto:` CTA, local hero image path, included pages, use cases, parent steps, 16 world slugs, and product-specific safe world summaries.
- [x] Add homepage product link and update `storyData.test.ts` expected slugs/prices.
- [x] Add Batch 28 image manifest and `image:batch28` script.
- [x] Extend `validate-content-batch.mjs` to require the product page, source file, image manifest, artifact, and checkout-pending state.
- [x] Render pages with `npm run render:seo`.

### Task 6: Local Image And Artifact Generation

**Files:**
- Create: `public/images/plotsprout/batch28/window-seat-story-scene-card-pack.jpg`
- Create: `public/images/plotsprout/batch28/window-seat-story-scene-card-pack.webp`
- Create: `content/image-runs/batch28/window-seat-story-scene-card-pack.json`
- Create: `product-build/window-seat-story-scene-card-pack/**`
- Create: `public/window-seat-story-scene-card-pack/index.html`

- [x] Generate the product image locally on the RTX 4090 only. Reject outputs with readable/pseudo text, logos, devices, people/faces, photos/cameras, real-home/address cues, public-review/rating signals, scores, timers, or branded/copyrighted material.
- [x] Run: `npm run product:window-seat-scene-pack`.
- [x] Run: `npm run render:seo`.
- [x] Inspect PDF page count with `pdfinfo product-build/window-seat-story-scene-card-pack/Window-Seat-Story-Scene-Card-Pack.pdf`; expected 21 pages.
- [x] Run: `npm run verify`.

### Task 7: Review, Deploy, Closeout

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] Run local Playwright smoke for `/`, `/window-seat-story-scene-card-pack/`, `/writing-desk-story-prompt-strip-pack/`, and `/bookshop-story-bookmark-pack/` on desktop and mobile.
- [x] Dispatch read-only spec and quality reviewers.
- [x] Commit and push Batch 28 code/artifacts.
- [x] Watch the push-triggered `Deploy` GitHub Actions run on the self-hosted runner.
- [x] Run live Playwright smoke for `/`, `/window-seat-story-scene-card-pack/`, `/writing-desk-story-prompt-strip-pack/`, and `/bookshop-story-bookmark-pack/`.
- [x] Update `TODO.md` to mark Batch 28 shipped and set the next batch.
- [ ] Commit/push TODO closeout with `[skip ci]`.
- [ ] Update memory with shipped commits, run ID, tests, image path, billable-service state, and checkout status.
