# Batch 13 Waiting Room Story Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$11` Waiting Room Story Quest Pack as a provider-ready printable product without enabling checkout.

**Architecture:** Batch 12 remains the external checkout-provider gate. Batch 13 continues the content flywheel by following the existing static product-artifact pattern: three subagent lane files feed one canonical source JSON, a static product record renders to `public/<slug>/index.html`, a local GPU product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Validation stays explicit so checkout cannot be marked ready unless the artifact exists and a provider URL is intentionally wired later.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch13-waiting-room-quests-a.json`
- Create: `content/product-artifacts/lanes/batch13-waiting-room-quests-b.json`
- Create: `content/product-artifacts/lanes/batch13-waiting-room-tools.json`

- [x] **Step 1: Dispatch three gpt-5.5/xhigh workers**

Use one worker for four lower/middle quiet waiting quests, one worker for four middle/upper quiet waiting quests, and one worker for adult setup tools, routines, extension activities, and share cards.

- [x] **Step 2: Require narrow waiting-use content**

Every lane must support quiet, low-mess adult-guided writing in restaurants, appointment lobbies, airport gates, sibling activities, pickup lines, or other seated waits. Content must not give medical, dental, legal, safety, diagnosis, therapy, emergency, or travel-navigation advice.

- [x] **Step 3: Require family-safe printable content**

Every lane must avoid checkout language, account/login/upload/public publishing language, scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, and pressure copy.

- [x] **Step 4: Require writable worksheet blanks**

Every quest page section line must include underscores so the printed PDF visibly supports writing.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/waiting-room-story-quest-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/waiting-room-story-quest-pack/index.html`

- [x] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch13`
- `productSlug`: `waiting-room-story-quest-pack`
- `title`: `Waiting Room Story Quest Pack`
- `pricePoint`: `$11`
- 6-10 existing world slugs with local images
- 8 printable quests
- adult setup guide for before-you-wait, restaurant table, appointment lobby, sibling activity, and pickup-line use
- 5 quiet waiting routines
- 8 extension activities
- 6 optional share cards
- exact artifact paths under `product-build/waiting-room-story-quest-pack/`

- [x] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch13/waiting-room-story-quest-pack.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Waiting%20Room%20Story%20Quest%20Pack`
- checkout note saying provider/checkout is pending
- no checkout URL, no payment copy, no account copy

- [x] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, or public publishing language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch13-product-images.json`
- Create: `content/image-runs/batch13/waiting-room-story-quest-pack.json`
- Create: `public/images/plotsprout/batch13/waiting-room-story-quest-pack.jpg`
- Create: `public/images/plotsprout/batch13/waiting-room-story-quest-pack.webp`
- Modify: `package.json`

- [x] **Step 1: Add image manifest and script**

Add `npm run image:batch13` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [x] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals.

- [x] **Step 3: Visually inspect the image**

Confirm it reads as a quiet printable writing-kit flat lay, with blank pages, pencils, no readable text, no logos, no people, no faces, no animals, no branded characters, and no unsafe elements.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/waiting-room-pack-builder.mjs`
- Create: `scripts/waiting-room-pack-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/product-artifact-policy.test.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Generated: `product-build/waiting-room-story-quest-pack/*`

- [x] **Step 1: Write failing validator/builder tests**

Add tests that fail until Batch 13 exists:
- `validateWaitingRoomPackSource` accepts a valid source with 8 quests, exact batch/title/price, matching product, known world image slugs, age-band match, and writable blanks.
- `validateWaitingRoomPackSource` rejects a quest line without a writable blank.
- `validateWaitingRoomPackSource` rejects appointment/medical advice language such as diagnosis, symptoms, medicine, emergency, or treatment.
- `waiting-room-pack-builder` loads committed source/product/world/image inputs, renders 8 quest pages, writes a source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [x] **Step 2: Add source validator**

Export `waitingRoomProductSlug` and `validateWaitingRoomPackSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, setup guide shape, routines, extension activities, share cards, eight quests, age-band match, writable blanks, risky-language policy, and unsafe waiting-room language.

- [x] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records.

- [x] **Step 4: Add artifact validation**

`npm run verify:content` must verify Waiting Room source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] **Step 1: Run focused checks**

Run:
`npm run product:waiting-room-pack && npx vitest run scripts/product-artifact-policy.test.mjs scripts/waiting-room-pack-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [x] **Step 2: Run full checks**

Run:
`npm run verify`

- [x] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/waiting-room-story-quest-pack/`, and the five existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [x] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [ ] **Step 5: Commit, push, and deploy**

Commit the whole Batch 13 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [ ] **Step 6: Update TODO and memory**

Record Batch 13 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
