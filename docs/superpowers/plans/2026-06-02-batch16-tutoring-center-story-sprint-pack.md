# Batch 16 Tutoring Center Story Sprint Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$49` Tutoring Center Story Sprint Pack as a checkout-pending printable product for literacy tutors, tutoring centers, after-school programs, homeschool co-op tutors, and small-group writing intervention.

**Architecture:** Batch 16 follows the existing static product-artifact pattern: four gpt-5.5/xhigh content lane JSON files feed one canonical product source, a product record renders to `public/tutoring-center-story-sprint-pack/index.html`, a local RTX 4090 product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Checkout remains mailto-only and externally gated until Sam chooses a hosted provider.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on a local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch16-tutoring-sprints-a.json`
- Create: `content/product-artifacts/lanes/batch16-tutoring-sprints-b.json`
- Create: `content/product-artifacts/lanes/batch16-tutoring-sprints-c.json`
- Create: `content/product-artifacts/lanes/batch16-tutoring-tools.json`

- [x] **Step 1: Dispatch four gpt-5.5/xhigh workers**

Use one worker for six lower-age tutoring sprint pages, one worker for seven middle-age tutoring sprint pages, one worker for seven upper-age tutoring sprint pages, and one worker for tutor guide tools, routines, take-home slips, and optional share prompts.

- [x] **Step 2: Require tutor-safe center content**

Every lane must support printable tutoring centers, literacy intervention, after-school tutoring, homeschool co-op tutors, or small-group writing help. Content must not require student accounts, uploads, public publishing, rosters, attendance, sign-in sheets, student names, surnames, school names, photos, addresses, behavior reports, medical/legal guidance, grading claims, diagnosis claims, or data collection.

- [x] **Step 3: Require family-safe creative writing**

Every lane must avoid scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, pressure copy, and guaranteed learning-outcome claims.

- [x] **Step 4: Require printable worksheet blanks**

Every sprint page planning line, draft line, wrap-up line, and take-home slip line must include underscores so the printed PDF visibly supports short written responses.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/tutoring-center-story-sprint-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/tutoring-center-story-sprint-pack/index.html`

- [x] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch16`
- `productSlug`: `tutoring-center-story-sprint-pack`
- `title`: `Tutoring Center Story Sprint Pack`
- `pricePoint`: `$49`
- twenty existing world slugs with local images
- twenty printable tutoring story sprint pages
- tutor guide for before-session prep, setup, during-sprint coaching, wrap-up, and no-data center use
- five repeatable sprint routines
- eight take-home micro-practice slips
- six optional share prompts
- exact artifact paths under `product-build/tutoring-center-story-sprint-pack/`

- [x] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch16/tutoring-center-story-sprint-pack.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Tutoring%20Center%20Story%20Sprint%20Pack`
- checkout note saying provider/checkout is pending
- no checkout URL, no payment copy, no student-account copy, no upload copy, no public publishing copy

- [x] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, or public publishing language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch16-product-images.json`
- Create: `content/image-runs/batch16/tutoring-center-story-sprint-pack.json`
- Create: `public/images/plotsprout/batch16/tutoring-center-story-sprint-pack.jpg`
- Create: `public/images/plotsprout/batch16/tutoring-center-story-sprint-pack.webp`
- Modify: `package.json`

- [x] **Step 1: Add image manifest and script**

Add `npm run image:batch16` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [x] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals.

- [x] **Step 3: Visually inspect the image**

Confirm it reads as a polished tutoring-center printable sprint pack flat lay, with blank sprint pages, simple folders, pencils, timer/cards/supply tray, no readable text, no logos, no people, no faces, no animals, no branded characters, and no unsafe elements.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/tutoring-center-sprint-pack-builder.mjs`
- Create: `scripts/tutoring-center-sprint-pack-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/product-artifact-policy.test.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Generated: `product-build/tutoring-center-story-sprint-pack/*`

- [x] **Step 1: Write failing validator and builder tests**

Add tests that fail until Batch 16 exists:
- `validateTutoringCenterSprintPackSource` accepts a valid source with twenty sprints, exact batch/title/price, matching product, known world slugs, age-band match, and writable blanks.
- `validateTutoringCenterSprintPackSource` rejects a sprint line without a writable blank.
- `validateTutoringCenterSprintPackSource` rejects roster, upload, account, attendance, student-name, public publishing, medical/legal, diagnosis, grading guarantee, or behavior-report language.
- `tutoring-center-sprint-pack-builder` loads committed source/product/world/image inputs, renders twenty sprint pages, writes source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [x] **Step 2: Add source validator**

Export `tutoringCenterSprintPackProductSlug` and `validateTutoringCenterSprintPackSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, tutor guide shape, routines, take-home slips, share prompts, twenty sprints, age-band match, writable blanks, risky-language policy, and unsafe tutoring-center data language.

- [x] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records. HTML must contain `Run the tutoring sprints`, `Take-home micro-practice slips`, and twenty `.sprint-page` sections.

- [x] **Step 4: Add artifact validation**

`npm run verify:content` must verify Tutoring Center source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] **Step 1: Run focused checks**

Run:
`npm run product:tutoring-center-pack && npx vitest run scripts/product-artifact-policy.test.mjs scripts/tutoring-center-sprint-pack-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [x] **Step 2: Run full checks**

Run:
`npm run verify`

- [x] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/tutoring-center-story-sprint-pack/`, and the existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [x] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [x] **Step 5: Commit, push, and deploy**

Commit the whole Batch 16 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [x] **Step 6: Update TODO and memory**

Record Batch 16 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
