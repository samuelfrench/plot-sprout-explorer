# Batch 19 Museum Day Story Notebook Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a `$37` Museum Day Story Notebook Kit as a checkout-pending printable product for homeschool co-ops, family learning days, museum educators, field-trip organizers, and library/gallery writing tables.

**Architecture:** Batch 19 follows the existing static product-artifact pattern. Four gpt-5.5/xhigh lane files feed one canonical source JSON, a product record renders to `public/museum-day-story-notebook-kit/index.html`, a local RTX 4090 product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Checkout remains mailto-only and externally gated until Sam chooses a hosted provider.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on a local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch19-museum-notebook-pages-a.json`
- Create: `content/product-artifacts/lanes/batch19-museum-notebook-pages-b.json`
- Create: `content/product-artifacts/lanes/batch19-museum-notebook-pages-c.json`
- Create: `content/product-artifacts/lanes/batch19-museum-notebook-tools.json`

- [x] **Step 1: Dispatch four gpt-5.5/xhigh workers**

Use one worker for five lower-age museum notebook pages, one worker for five middle-age pages, one worker for five upper-age pages, and one worker for adult guide tools, visit formats, take-home observation cards, and optional family-share prompts.

- [x] **Step 2: Require museum-safe adult-led content**

Every lane must support homeschool co-ops, family learning days, museum educators, field-trip organizers, library/gallery writing tables, or adult-led observation-to-fiction writing. Content must not require child accounts, uploads, public publishing, rosters, attendance, sign-in sheets, child names, student names, surnames, school names, grades, scores, assessment claims, photos, addresses, medical/legal/therapy/diagnosis guidance, or guaranteed learning outcomes.

- [x] **Step 3: Require family-safe creative writing**

Every lane must avoid scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, pressure copy, unsafe travel/outdoor instructions, and guaranteed learning-outcome claims.

- [x] **Step 4: Require printable response blanks**

Every notebook page section line, share line, wrap-up line, quiet option line, and take-home prompt line must include underscores so the printed PDF visibly supports short written responses.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/museum-day-story-notebook-kit.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/museum-day-story-notebook-kit/index.html`

- [x] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch19`
- `productSlug`: `museum-day-story-notebook-kit`
- `title`: `Museum Day Story Notebook Kit`
- `pricePoint`: `$37`
- fifteen existing world slugs with local images
- fifteen printable museum-day notebook pages
- adult guide for before-visit prep, table setup, observation-to-story moves, quiet participation, no-data use, and family handoff
- six repeatable visit formats
- ten take-home observation cards
- eight optional family-share prompts
- exact artifact paths under `product-build/museum-day-story-notebook-kit/`

- [x] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch19/museum-day-story-notebook-kit.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Museum%20Day%20Story%20Notebook%20Kit`
- checkout note saying provider/checkout is pending
- no checkout URL, no payment copy, no child-account copy, no upload copy, no public publishing copy

- [x] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, public publishing, or student data language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch19-product-images.json`
- Create: `content/image-runs/batch19/museum-day-story-notebook-kit.json`
- Create: `public/images/plotsprout/batch19/museum-day-story-notebook-kit.jpg`
- Create: `public/images/plotsprout/batch19/museum-day-story-notebook-kit.webp`
- Modify: `package.json`

- [x] **Step 1: Add image manifest and script**

Add `npm run image:batch19` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [x] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals/phones/tablets/devices.

- [x] **Step 3: Visually inspect the image**

Confirm it reads as a polished screen-free museum-day writing notebook flat lay, with blank notebook pages, blank observation cards, pencils, simple paper frames, blank folders, color tabs, no readable text, no logos, no people, no faces, no animals, no devices, and no branded characters.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/museum-day-story-notebook-kit-builder.mjs`
- Create: `scripts/museum-day-story-notebook-kit-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs` only if manifest helper needs broader source-count support
- Modify: `package.json`
- Generated: `product-build/museum-day-story-notebook-kit/*`

- [x] **Step 1: Write failing validator and builder tests**

Add tests that fail until Batch 19 exists:
- `validateMuseumDayStoryNotebookKitSource` accepts a valid source with fifteen notebook pages, exact batch/title/price, matching product, known world slugs, age-band match, and writable blanks.
- `validateMuseumDayStoryNotebookKitSource` rejects a notebook page line without a writable blank.
- `validateMuseumDayStoryNotebookKitSource` rejects roster, attendance, sign-in, child-name, child-account, upload, public publishing, medical/legal, therapy/diagnosis, assessment, grades, scores, guaranteed-result, behavior-report, political/branded/romance/weapon/violence/gambling/ad-targeting, or unsafe visit/travel instruction language.
- `museum-day-story-notebook-kit-builder` loads committed source/product/world/image inputs, renders fifteen notebook pages, writes source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [x] **Step 2: Add source validator**

Export `museumDayStoryNotebookKitProductSlug` and `validateMuseumDayStoryNotebookKitSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, adult guide shape, visit formats, observation cards, share prompts, fifteen notebook pages, age-band match, writable blanks, family-safety policy, and unsafe museum-day data/travel language.

- [x] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records. HTML must contain `Use the notebook day`, `Take-home observation cards`, and fifteen `.notebook-page` sections.

- [x] **Step 4: Add artifact validation**

`npm run verify:content` must verify Museum Day source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [x] **Step 1: Run focused checks**

Run:
`npm run product:museum-day-kit && npx vitest run scripts/museum-day-story-notebook-kit-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [x] **Step 2: Run full checks**

Run:
`npm run verify`

- [x] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/museum-day-story-notebook-kit/`, and the existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [x] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [x] **Step 5: Commit, push, and deploy**

Commit the whole Batch 19 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [x] **Step 6: Update TODO and memory**

Record Batch 19 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
