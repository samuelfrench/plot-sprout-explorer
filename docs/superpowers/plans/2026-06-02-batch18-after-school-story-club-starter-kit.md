# Batch 18 After-School Story Club Starter Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$69` After-School Story Club Starter Kit as a checkout-pending printable product for after-school program directors, enrichment coordinators, community centers, childcare site leads, and homeschool co-ops.

**Architecture:** Batch 18 follows the existing static product-artifact pattern. Four gpt-5.5/xhigh lane files feed one canonical source JSON, a product record renders to `public/after-school-story-club-starter-kit/index.html`, a local RTX 4090 product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Checkout remains mailto-only and externally gated until Sam chooses a hosted provider.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on a local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch18-after-school-sessions-a.json`
- Create: `content/product-artifacts/lanes/batch18-after-school-sessions-b.json`
- Create: `content/product-artifacts/lanes/batch18-after-school-sessions-c.json`
- Create: `content/product-artifacts/lanes/batch18-after-school-tools.json`

- [x] **Step 1: Dispatch four gpt-5.5/xhigh workers**

Use one worker for six lower-age story club sessions, one worker for six middle-age story club sessions, one worker for six upper-age story club sessions, and one worker for program guide tools, repeatable club formats, take-home prompt cards, and optional family-share prompts.

- [x] **Step 2: Require program-safe adult-led content**

Every lane must support after-school enrichment, community centers, childcare site leads, homeschool co-ops, or adult-led writing clubs. Content must not require child accounts, uploads, public publishing, rosters, attendance, sign-in sheets, child names, student names, surnames, school names, photos, addresses, behavior reports, medical/legal guidance, therapy/diagnosis claims, assessment claims, grades, scores, or guaranteed learning-outcome claims.

- [x] **Step 3: Require family-safe creative writing**

Every lane must avoid scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, pressure copy, unsafe outdoor instructions, and guaranteed learning-outcome claims.

- [x] **Step 4: Require printable response blanks**

Every session page warm-up line, story-build line, club-share line, wrap-up line, quiet option line, and take-home prompt line must include underscores so the printed PDF visibly supports short written responses.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/after-school-story-club-starter-kit.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/after-school-story-club-starter-kit/index.html`

- [x] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch18`
- `productSlug`: `after-school-story-club-starter-kit`
- `title`: `After-School Story Club Starter Kit`
- `pricePoint`: `$69`
- eighteen existing world slugs with local images
- eighteen printable after-school story club sessions
- director guide for prep, room setup, running clubs, quiet participation, no-data use, and family handoff
- six repeatable club formats
- twelve take-home prompt cards
- eight optional family-share prompts
- exact artifact paths under `product-build/after-school-story-club-starter-kit/`

- [x] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch18/after-school-story-club-starter-kit.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=After-School%20Story%20Club%20Starter%20Kit`
- checkout note saying provider/checkout is pending
- no checkout URL, no payment copy, no child-account copy, no upload copy, no public publishing copy

- [x] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, or public publishing language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch18-product-images.json`
- Create: `content/image-runs/batch18/after-school-story-club-starter-kit.json`
- Create: `public/images/plotsprout/batch18/after-school-story-club-starter-kit.jpg`
- Create: `public/images/plotsprout/batch18/after-school-story-club-starter-kit.webp`
- Modify: `package.json`

- [x] **Step 1: Add image manifest and script**

Add `npm run image:batch18` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [x] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals/devices.

- [x] **Step 3: Visually inspect the image**

Confirm it reads as a polished screen-free after-school writing club kit flat lay, with blank worksheets, folders, pencils, blank cards, supply bins, simple color-coded materials, no readable text, no logos, no people, no faces, no animals, no devices, and no branded characters.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/after-school-story-club-kit-builder.mjs`
- Create: `scripts/after-school-story-club-kit-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs` only if manifest helper needs broader source-count support
- Modify: `package.json`
- Generated: `product-build/after-school-story-club-starter-kit/*`

- [x] **Step 1: Write failing validator and builder tests**

Add tests that fail until Batch 18 exists:
- `validateAfterSchoolStoryClubKitSource` accepts a valid source with eighteen sessions, exact batch/title/price, matching product, known world slugs, age-band match, and writable blanks.
- `validateAfterSchoolStoryClubKitSource` rejects a session line without a writable blank.
- `validateAfterSchoolStoryClubKitSource` rejects roster, attendance, sign-in, child-name, child-account, upload, public publishing, medical/legal, therapy/diagnosis, assessment, grades, scores, guaranteed-result, behavior-report, political/branded/romance/weapon/violence/gambling/ad-targeting, or unsafe instruction language.
- `after-school-story-club-kit-builder` loads committed source/product/world/image inputs, renders eighteen session pages, writes source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [x] **Step 2: Add source validator**

Export `afterSchoolStoryClubKitProductSlug` and `validateAfterSchoolStoryClubKitSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, director guide shape, club formats, take-home cards, share prompts, eighteen sessions, age-band match, writable blanks, family-safety policy, and unsafe after-school data language.

- [x] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records. HTML must contain `Run the story club`, `Take-home prompt cards`, and eighteen `.club-session-page` sections.

- [x] **Step 4: Add artifact validation**

`npm run verify:content` must verify After-School source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] **Step 1: Run focused checks**

Run:
`npm run product:after-school-club-kit && npx vitest run scripts/after-school-story-club-kit-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [x] **Step 2: Run full checks**

Run:
`npm run verify`

- [x] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/after-school-story-club-starter-kit/`, and the existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [x] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [x] **Step 5: Commit, push, and deploy**

Commit the whole Batch 18 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [x] **Step 6: Update TODO and memory**

Record Batch 18 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
