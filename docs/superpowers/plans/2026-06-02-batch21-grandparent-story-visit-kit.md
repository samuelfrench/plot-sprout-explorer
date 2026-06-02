# Batch 21 Grandparent Story Visit Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$31` Grandparent Story Visit Kit as a checkout-pending printable product for screen-free grandparent, aunt/uncle, neighbor-helper, and family-visit story time.

**Architecture:** Batch 21 follows the established static product-artifact pattern. Four gpt-5.5/xhigh content lanes feed one canonical source JSON, a product record renders to `public/grandparent-story-visit-kit/index.html`, a local RTX 4090 product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Checkout remains mailto-only and externally gated until Sam chooses a hosted provider.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on a local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch21-grandparent-visit-quests-a.json`
- Create: `content/product-artifacts/lanes/batch21-grandparent-visit-quests-b.json`
- Create: `content/product-artifacts/lanes/batch21-grandparent-visit-quests-c.json`
- Create: `content/product-artifacts/lanes/batch21-grandparent-visit-tools.json`

- [ ] **Step 1: Dispatch four gpt-5.5/xhigh workers**

Use one worker for four lower-age visit quests, one worker for four middle-age quests, one worker for four upper-age quests, and one worker for host tools, repeatable visit formats, take-home postcard prompts, and optional family-share prompts.

- [ ] **Step 2: Require visit-friendly content**

Every lane must support adult-led visits with grandparents, relatives, neighbor helpers, library family visit tables, or homeschool co-op family days. Content must be screen-free, printable, cooperative, and usable without accounts, uploads, public publishing, family trees, genealogy records, family names, real child profiles, photos, addresses, phone numbers, medical history, estate/legal advice, therapy/diagnosis, grief counseling, family conflict mediation, guaranteed learning outcomes, grades, scores, behavior reports, contests, prizes, or timed pressure.

- [ ] **Step 3: Require family-safe creative writing**

Every lane must avoid scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, pressure copy, unsafe physical activity instructions, and personal-data collection.

- [ ] **Step 4: Require printable response blanks**

Every visit prompt line, conversation choice line, tiny draft line, visit wrap line, quiet option line, take-home postcard line, and optional family-share line must include underscores so the printed PDF visibly supports short written responses.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/grandparent-story-visit-kit.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/grandparent-story-visit-kit/index.html`

- [ ] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch21`
- `productSlug`: `grandparent-story-visit-kit`
- `title`: `Grandparent Story Visit Kit`
- `pricePoint`: `$31`
- twelve existing world slugs with local images
- twelve printable adult-led visit quest pages
- host guide for visit setup, story hosting, quiet participation, no-data use, take-home handoff, and pack-reset cleanup
- six repeatable visit formats
- twelve take-home postcard prompts
- eight optional family-share prompts
- exact artifact paths under `product-build/grandparent-story-visit-kit/`

- [ ] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch21/grandparent-story-visit-kit.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Grandparent%20Story%20Visit%20Kit`
- checkout note saying provider/checkout is pending
- no checkout URL, payment copy, account copy, upload copy, public publishing copy, family-tree copy, genealogy copy, child-data copy, medical/legal/therapy copy, grief-processing copy, scoring copy, contest copy, or pressure language

- [ ] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, public publishing, student data, score, contest, genealogy, medical/legal/therapy, grief-processing, or pressure language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch21-product-images.json`
- Create: `content/image-runs/batch21/grandparent-story-visit-kit.json`
- Create: `public/images/plotsprout/batch21/grandparent-story-visit-kit.jpg`
- Create: `public/images/plotsprout/batch21/grandparent-story-visit-kit.webp`
- Modify: `package.json`

- [ ] **Step 1: Add image manifest and script**

Add `npm run image:batch21` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [ ] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals/phones/tablets/devices/family photos.

- [ ] **Step 3: Visually inspect the image**

Confirm it reads as a polished screen-free family-visit printable kit flat lay, with blank cards, pencils, plain envelopes, warm table materials, no readable text, no logos, no people, no faces, no animals, no devices, no family photos, and no branded characters.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/grandparent-story-visit-kit-builder.mjs`
- Create: `scripts/grandparent-story-visit-kit-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs` only if manifest helper needs broader source-count support
- Modify: `package.json`
- Generated: `product-build/grandparent-story-visit-kit/*`

- [ ] **Step 1: Write failing validator and builder tests**

Add tests that fail until Batch 21 exists:
- `validateGrandparentStoryVisitKitSource` accepts a valid source with twelve visit quests, exact batch/title/price, matching product, known world slugs, age-band match, and writable blanks.
- `validateGrandparentStoryVisitKitSource` rejects a visit line without a writable blank.
- `validateGrandparentStoryVisitKitSource` rejects family tree, genealogy, family-name collection, child-name, photo, address, phone, recording, upload, public publishing, account, roster, attendance, sign-in, behavior report, medical/legal, therapy/diagnosis, grief counseling, family conflict mediation, grades, scores, assessment, guaranteed-result, contest, prize, timer-pressure, political/branded/romance/weapon/violence/ad-targeting, gambling, or unsafe physical instruction language.
- `grandparent-story-visit-kit-builder` loads committed source/product/world/image inputs, renders twelve visit quest pages, writes source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [ ] **Step 2: Add source validator**

Export `grandparentStoryVisitKitProductSlug` and `validateGrandparentStoryVisitKitSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, host guide shape, visit formats, take-home postcard prompts, share prompts, twelve visit quests, age-band match, writable blanks, family-safety policy, and unsafe visit/data/pressure language.

- [ ] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records. HTML must contain `Start the visit story`, `Take-home story postcards`, and twelve `.visit-quest-page` sections.

- [ ] **Step 4: Add artifact validation**

`npm run verify:content` must verify Grandparent Story Visit source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] **Step 1: Run focused checks**

Run:
`npm run product:grandparent-visit-kit && npx vitest run scripts/grandparent-story-visit-kit-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [ ] **Step 2: Run full checks**

Run:
`npm run verify`

- [ ] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/grandparent-story-visit-kit/`, and existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [ ] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [ ] **Step 5: Commit, push, and deploy**

Commit the whole Batch 21 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [ ] **Step 6: Update TODO and memory**

Record Batch 21 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
