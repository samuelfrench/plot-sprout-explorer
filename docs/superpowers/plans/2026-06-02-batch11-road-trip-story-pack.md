# Batch 11 Road Trip Story Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$17` Road Trip Story Quest Pack as a provider-ready printable product without enabling checkout.

**Architecture:** Batch 11 follows the existing product-artifact pattern: subagent lane JSON files feed one canonical source JSON, a static product record renders to `public/<slug>/index.html`, a local GPU product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Validation stays explicit so checkout cannot be marked ready unless the artifact exists and the provider URL is intentionally wired later.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch11-road-trip-quests-a.json`
- Create: `content/product-artifacts/lanes/batch11-road-trip-quests-b.json`
- Create: `content/product-artifacts/lanes/batch11-road-trip-tools.json`

- [x] **Step 1: Dispatch three gpt-5.5/xhigh workers**

Use one worker for four early/middle travel quests, one worker for four middle/upper travel quests, and one worker for adult setup tools, routines, extension activities, and share cards.

- [x] **Step 2: Require family-safe printable content**

Every lane must avoid checkout language, account/login/upload/public publishing language, scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, and real child profiles.

- [x] **Step 3: Require writable worksheet blanks**

Every quest page section line must include underscores so the printed PDF visibly supports writing.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/road-trip-story-quest-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Generated: `public/road-trip-story-quest-pack/index.html`

- [x] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch11`
- `productSlug`: `road-trip-story-quest-pack`
- `title`: `Road Trip Story Quest Pack`
- `pricePoint`: `$17`
- 6-10 existing world slugs with local images
- 8 printable quests
- adult setup guide for car, hotel, rest stop, and visit-day use
- 5 travel routines
- 8 extension activities
- 6 optional share cards

- [x] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch11/road-trip-story-quest-pack.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Road%20Trip%20Story%20Quest%20Pack`
- checkout note saying provider/checkout is pending

- [x] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, or public publishing language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch11-product-images.json`
- Create: `content/image-runs/batch11/road-trip-story-quest-pack.json`
- Create: `public/images/plotsprout/batch11/road-trip-story-quest-pack.jpg`
- Create: `public/images/plotsprout/batch11/road-trip-story-quest-pack.webp`
- Modify: `package.json`

- [x] **Step 1: Add image manifest and script**

Add `npm run image:batch11` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [x] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons.

- [x] **Step 3: Visually inspect the image**

Confirm it reads as a road-trip printable writing kit flat lay, with no people, faces, readable text, logos, or branded characters.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/road-trip-pack-builder.mjs`
- Create: `scripts/road-trip-pack-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/product-artifact-policy.test.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Generated: `product-build/road-trip-story-quest-pack/*`

- [x] **Step 1: Add source validator**

Export `roadTripProductSlug` and `validateRoadTripPackSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, setup guide shape, routines, extension activities, share cards, eight quests, age-band match, writable blanks, and risky-language policy.

- [x] **Step 2: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records.

- [x] **Step 3: Add artifact validation**

`npm run verify:content` must verify Road Trip source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] **Step 1: Run focused checks**

Run:
`npm run product:road-trip-pack && npx vitest run scripts/product-artifact-policy.test.mjs scripts/road-trip-pack-builder.test.mjs scripts/verify-workflows.test.mjs`

- [x] **Step 2: Run full checks**

Run:
`npm run verify`

- [x] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/road-trip-story-quest-pack/`, and the four existing product pages at desktop and mobile widths. Check console errors and overflow.

- [x] **Step 4: Commit, push, and deploy**

Commit the whole Batch 11 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [ ] **Step 5: Update TODO and memory**

Record Batch 11 completion, deploy run, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
