# Batch 14 Library Story Club Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$23` Library Story Club Kit as a checkout-pending printable product for children's librarians, homeschool co-ops, tutoring centers, and classroom writing clubs.

**Architecture:** Batch 14 follows the static product-artifact pattern already used by the paid packs: subagent lane JSON files feed one canonical source JSON, a product record renders to `public/library-story-club-kit/index.html`, a local RTX 4090 product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Checkout stays externally gated and mailto-only until Sam chooses a hosted provider.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on a local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch14-library-club-sessions-a.json`
- Create: `content/product-artifacts/lanes/batch14-library-club-sessions-b.json`
- Create: `content/product-artifacts/lanes/batch14-library-club-tools.json`

- [x] **Step 1: Dispatch three gpt-5.5/xhigh workers**

Use one worker for five lower/middle club sessions, one worker for five upper club sessions, and one worker for adult facilitator tools, club routines, extension activities, and optional share prompts.

- [x] **Step 2: Require club-safe content**

Every lane must support adult-led library, homeschool co-op, tutoring, or classroom story club use. Content must not require child accounts, uploads, public publishing, patron records, library-card data, sign-in sheets, photos, surnames, addresses, school names, or online sharing.

- [x] **Step 3: Require family-safe creative writing**

Every lane must avoid scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, medical/legal advice, and pressure copy.

- [x] **Step 4: Require printable worksheet blanks**

Every session page section line must include underscores so the printed PDF visibly supports short written responses.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/library-story-club-kit.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/library-story-club-kit/index.html`

- [x] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch14`
- `productSlug`: `library-story-club-kit`
- `title`: `Library Story Club Kit`
- `pricePoint`: `$23`
- ten existing world slugs with local images
- ten printable club-session quests
- adult facilitator guide for setup, group norms, materials, timing, and take-home use
- five repeatable club routines
- eight extension activities
- six optional share prompts
- exact artifact paths under `product-build/library-story-club-kit/`

- [x] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch14/library-story-club-kit.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Library%20Story%20Club%20Kit`
- checkout note saying provider/checkout is pending
- no checkout URL, no payment copy, no account copy, no upload or public publishing copy

- [x] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, or public publishing language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch14-product-images.json`
- Create: `content/image-runs/batch14/library-story-club-kit.json`
- Create: `public/images/plotsprout/batch14/library-story-club-kit.jpg`
- Create: `public/images/plotsprout/batch14/library-story-club-kit.webp`
- Modify: `package.json`

- [x] **Step 1: Add image manifest and script**

Add `npm run image:batch14` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [x] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals.

- [x] **Step 3: Visually inspect the image**

Confirm it reads as a polished printable library story club kit flat lay, with blank pages, pencils, simple folders or book-like shapes, no readable text, no logos, no people, no faces, no animals, no branded characters, and no unsafe elements.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/library-story-club-kit-builder.mjs`
- Create: `scripts/library-story-club-kit-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/product-artifact-policy.test.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `package.json`
- Generated: `product-build/library-story-club-kit/*`

- [x] **Step 1: Write failing validator/builder tests**

Add tests that fail until Batch 14 exists:
- `validateLibraryStoryClubKitSource` accepts a valid source with ten sessions, exact batch/title/price, matching product, known world slugs, age-band match, and writable blanks.
- `validateLibraryStoryClubKitSource` rejects a session line without a writable blank.
- `validateLibraryStoryClubKitSource` rejects patron/account/upload/public publishing language.
- `library-story-club-kit-builder` loads committed source/product/world/image inputs, renders ten session pages, writes source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [x] **Step 2: Add source validator**

Export `libraryStoryClubProductSlug` and `validateLibraryStoryClubKitSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, facilitator guide shape, routines, extension activities, share prompts, ten sessions, age-band match, writable blanks, risky-language policy, and unsafe club language.

- [x] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records.

- [x] **Step 4: Add artifact validation**

`npm run verify:content` must verify Library Story Club source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] **Step 1: Run focused checks**

Run:
`npm run product:library-story-club-kit && npx vitest run scripts/product-artifact-policy.test.mjs scripts/library-story-club-kit-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [x] **Step 2: Run full checks**

Run:
`npm run verify`

- [x] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/library-story-club-kit/`, and the six existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [x] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [ ] **Step 5: Commit, push, and deploy**

Commit the whole Batch 14 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [ ] **Step 6: Update TODO and memory**

Record Batch 14 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
