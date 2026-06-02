# Batch 17 Summer Camp Story Circle Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$59` Summer Camp Story Circle Kit as a checkout-pending printable product for day camps, summer camps, recreation programs, camp counselors, and homeschool summer co-ops.

**Architecture:** Batch 17 follows the existing static product-artifact pattern: four gpt-5.5/xhigh content lane JSON files feed one canonical product source, a product record renders to `public/summer-camp-story-circle-kit/index.html`, a local RTX 4090 product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Checkout remains mailto-only and externally gated until Sam chooses a hosted provider.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on a local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch17-summer-camp-activities-a.json`
- Create: `content/product-artifacts/lanes/batch17-summer-camp-activities-b.json`
- Create: `content/product-artifacts/lanes/batch17-summer-camp-activities-c.json`
- Create: `content/product-artifacts/lanes/batch17-summer-camp-tools.json`

- [x] **Step 1: Dispatch four gpt-5.5/xhigh workers**

Use one worker for five lower-age camp story-circle pages, one worker for six middle-age camp story-circle pages, one worker for five upper-age camp story-circle pages, and one worker for counselor guide tools, circle formats, take-home trail cards, and optional share prompts.

- [x] **Step 2: Require camp-safe adult-led content**

Every lane must support day camps, summer camps, recreation programs, camp counselors, homeschool summer co-ops, or adult-led summer writing circles. Content must not require child accounts, uploads, public publishing, rosters, attendance, sign-in sheets, camper names, student names, surnames, school names, photos, addresses, behavior reports, medical/legal guidance, therapy/diagnosis claims, assessment claims, or guaranteed learning-outcome claims.

- [x] **Step 3: Require family-safe creative writing**

Every lane must avoid scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, pressure copy, unsafe fire/water instructions, and guaranteed learning-outcome claims.

- [x] **Step 4: Require printable worksheet blanks**

Every activity page planning line, circle line, wrap-up line, quiet option line, and take-home trail card line must include underscores so the printed PDF visibly supports short written responses.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/summer-camp-story-circle-kit.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/summer-camp-story-circle-kit/index.html`

- [x] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch17`
- `productSlug`: `summer-camp-story-circle-kit`
- `title`: `Summer Camp Story Circle Kit`
- `pricePoint`: `$59`
- sixteen existing world slugs with local images
- sixteen printable camp story-circle activity pages
- counselor guide for before-camp prep, setup, running circles, quiet options, and no-data use
- six repeatable circle formats
- ten take-home trail cards
- eight optional share prompts
- exact artifact paths under `product-build/summer-camp-story-circle-kit/`

- [x] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch17/summer-camp-story-circle-kit.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Summer%20Camp%20Story%20Circle%20Kit`
- checkout note saying provider/checkout is pending
- no checkout URL, no payment copy, no child-account copy, no upload copy, no public publishing copy

- [x] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, or public publishing language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch17-product-images.json`
- Create: `content/image-runs/batch17/summer-camp-story-circle-kit.json`
- Create: `public/images/plotsprout/batch17/summer-camp-story-circle-kit.jpg`
- Create: `public/images/plotsprout/batch17/summer-camp-story-circle-kit.webp`
- Modify: `package.json`

- [x] **Step 1: Add image manifest and script**

Add `npm run image:batch17` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [x] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals.

- [x] **Step 3: Visually inspect the image**

Confirm it reads as a polished summer-camp printable story circle kit flat lay, with blank worksheets, counselor clipboard, pencils, simple schedule cards, cord/string or nature-color supplies, no readable text, no logos, no people, no faces, no animals, no unsafe fire/water setup, and no branded characters.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/summer-camp-story-circle-kit-builder.mjs`
- Create: `scripts/summer-camp-story-circle-kit-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/product-artifact-policy.test.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Generated: `product-build/summer-camp-story-circle-kit/*`

- [x] **Step 1: Write failing validator and builder tests**

Add tests that fail until Batch 17 exists:
- `validateSummerCampStoryCircleKitSource` accepts a valid source with sixteen activities, exact batch/title/price, matching product, known world slugs, age-band match, and writable blanks.
- `validateSummerCampStoryCircleKitSource` rejects an activity line without a writable blank.
- `validateSummerCampStoryCircleKitSource` rejects roster, attendance, sign-in, camper-name, child-account, upload, public publishing, medical/legal, therapy/diagnosis, assessment, guaranteed-result, behavior-report, or unsafe fire/water language.
- `summer-camp-story-circle-kit-builder` loads committed source/product/world/image inputs, renders sixteen activity pages, writes source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [x] **Step 2: Add source validator**

Export `summerCampStoryCircleKitProductSlug` and `validateSummerCampStoryCircleKitSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, counselor guide shape, circle formats, take-home trail cards, share prompts, sixteen activities, age-band match, writable blanks, risky-language policy, and unsafe camp data language.

- [x] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records. HTML must contain `Run the story circles`, `Take-home trail cards`, and sixteen `.camp-activity-page` sections.

- [x] **Step 4: Add artifact validation**

`npm run verify:content` must verify Summer Camp source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] **Step 1: Run focused checks**

Run:
`npm run product:summer-camp-kit && npx vitest run scripts/product-artifact-policy.test.mjs scripts/summer-camp-story-circle-kit-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [x] **Step 2: Run full checks**

Run:
`npm run verify`

- [x] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/summer-camp-story-circle-kit/`, and the existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [x] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [ ] **Step 5: Commit, push, and deploy**

Commit the whole Batch 17 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [ ] **Step 6: Update TODO and memory**

Record Batch 17 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
