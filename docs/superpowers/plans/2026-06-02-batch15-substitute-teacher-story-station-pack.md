# Batch 15 Substitute Teacher Story Station Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$39` Substitute Teacher Story Station Pack as a checkout-pending printable product for elementary teachers, homeschool co-op leaders, tutoring centers, and substitute folders.

**Architecture:** Batch 15 follows the existing static product-artifact pattern: three gpt-5.5/xhigh content lane JSON files feed one canonical product source, a product record renders to `public/substitute-teacher-story-station-pack/index.html`, a local RTX 4090 product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Checkout remains mailto-only and externally gated until Sam chooses a hosted provider.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on a local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch15-substitute-stations-a.json`
- Create: `content/product-artifacts/lanes/batch15-substitute-stations-b.json`
- Create: `content/product-artifacts/lanes/batch15-substitute-tools.json`

- [x] **Step 1: Dispatch three gpt-5.5/xhigh workers**

Use one worker for six lower/middle substitute station pages, one worker for six middle/upper substitute station pages, and one worker for substitute guide tools, station routines, early finisher cards, and optional share prompts.

- [x] **Step 2: Require substitute-safe classroom content**

Every lane must support printable substitute folders, early finisher stations, tutoring stations, or homeschool co-op tables. Content must not require student accounts, uploads, public publishing, rosters, attendance, sign-in sheets, student names, surnames, school names, photos, addresses, behavior reports, medical/legal guidance, or any data collection.

- [x] **Step 3: Require family-safe creative writing**

Every lane must avoid scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, and pressure copy.

- [x] **Step 4: Require printable worksheet blanks**

Every station page section line and exit ticket line must include underscores so the printed PDF visibly supports short written responses.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/substitute-teacher-story-station-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/substitute-teacher-story-station-pack/index.html`

- [x] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch15`
- `productSlug`: `substitute-teacher-story-station-pack`
- `title`: `Substitute Teacher Story Station Pack`
- `pricePoint`: `$39`
- twelve existing world slugs with local images
- twelve printable substitute station pages
- substitute guide for before-the-day, morning setup, during stations, end-of-day, and handoff use
- five repeatable station routines
- eight early finisher cards
- six optional share prompts
- exact artifact paths under `product-build/substitute-teacher-story-station-pack/`

- [x] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch15/substitute-teacher-story-station-pack.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Substitute%20Teacher%20Story%20Station%20Pack`
- checkout note saying provider/checkout is pending
- no checkout URL, no payment copy, no student-account copy, no upload copy, no public publishing copy

- [x] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, or public publishing language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch15-product-images.json`
- Create: `content/image-runs/batch15/substitute-teacher-story-station-pack.json`
- Create: `public/images/plotsprout/batch15/substitute-teacher-story-station-pack.jpg`
- Create: `public/images/plotsprout/batch15/substitute-teacher-story-station-pack.webp`
- Modify: `package.json`

- [x] **Step 1: Add image manifest and script**

Add `npm run image:batch15` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [x] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals.

- [x] **Step 3: Visually inspect the image**

Confirm it reads as a polished substitute-teacher printable station pack flat lay, with blank station pages, simple folders, pencils, a supply tray, no readable text, no logos, no people, no faces, no animals, no branded characters, and no unsafe elements.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/substitute-teacher-station-pack-builder.mjs`
- Create: `scripts/substitute-teacher-station-pack-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/product-artifact-policy.test.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Generated: `product-build/substitute-teacher-story-station-pack/*`

- [x] **Step 1: Write failing validator and builder tests**

Add tests that fail until Batch 15 exists:
- `validateSubstituteTeacherStationPackSource` accepts a valid source with twelve stations, exact batch/title/price, matching product, known world slugs, age-band match, and writable blanks.
- `validateSubstituteTeacherStationPackSource` rejects a station line without a writable blank.
- `validateSubstituteTeacherStationPackSource` rejects roster, upload, account, attendance, student-name, public publishing, medical/legal, or behavior-report language.
- `substitute-teacher-station-pack-builder` loads committed source/product/world/image inputs, renders twelve station pages, writes source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [x] **Step 2: Add source validator**

Export `substituteTeacherStationPackProductSlug` and `validateSubstituteTeacherStationPackSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, substitute guide shape, routines, early finisher cards, share prompts, twelve stations, age-band match, writable blanks, risky-language policy, and unsafe substitute/school data language.

- [x] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records. HTML must contain `Run the substitute stations`, `Early finisher cards`, and twelve `.station-page` sections.

- [x] **Step 4: Add artifact validation**

`npm run verify:content` must verify Substitute Teacher source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] **Step 1: Run focused checks**

Run:
`npm run product:substitute-teacher-pack && npx vitest run scripts/product-artifact-policy.test.mjs scripts/substitute-teacher-station-pack-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [x] **Step 2: Run full checks**

Run:
`npm run verify`

- [x] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/substitute-teacher-story-station-pack/`, and the existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [x] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [ ] **Step 5: Commit, push, and deploy**

Commit the whole Batch 15 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [ ] **Step 6: Update TODO and memory**

Record Batch 15 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
