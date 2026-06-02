# Batch 20 Family Game Night Story Card Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$27` Family Game Night Story Card Deck as a checkout-pending printable product for screen-free family tables, homeschool co-ops, library family nights, and classroom celebration tables.

**Architecture:** Batch 20 follows the established static product-artifact pattern. Four gpt-5.5/xhigh content lanes feed one canonical source JSON, a product record renders to `public/family-game-night-story-card-deck/index.html`, a local RTX 4090 product image is committed with a sidecar, and a builder writes PDF/ZIP/source/manifest artifacts. Checkout remains mailto-only and externally gated until Sam chooses a hosted provider.

**Tech Stack:** Vite/React static app, Node ESM builder scripts, Playwright PDF generation, local SDXL image generation on RTX 4090, Vitest, GitHub Pages deploy on a local self-hosted runner.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch20-family-game-night-cards-a.json`
- Create: `content/product-artifacts/lanes/batch20-family-game-night-cards-b.json`
- Create: `content/product-artifacts/lanes/batch20-family-game-night-cards-c.json`
- Create: `content/product-artifacts/lanes/batch20-family-game-night-tools.json`

- [ ] **Step 1: Dispatch four gpt-5.5/xhigh workers**

Use one worker for five lower-age family-table cards, one worker for five middle-age cards, one worker for five upper-age cards, and one worker for host tools, cooperative round formats, take-home story starters, and optional family-share prompts.

- [ ] **Step 2: Require cooperative family-table content**

Every lane must support adult-led family game night, homeschool co-op table nights, library family events, or classroom celebration tables. Content must be screen-free, printable, cooperative, and usable without teams, scores, winners, gambling, betting, dares, prizes, leaderboards, timers that create pressure, accounts, uploads, public publishing, rosters, attendance, sign-in sheets, child names, photos, addresses, grades, scores, behavior reports, medical/legal/therapy guidance, or guaranteed learning outcomes.

- [ ] **Step 3: Require family-safe creative writing**

Every lane must avoid scary harm, bullying, romance, weapons, political persuasion, gambling, branded characters, real child profiles, ads targeted to children, pressure copy, unsafe physical activity instructions, and guaranteed learning-outcome claims.

- [ ] **Step 4: Require printable response blanks**

Every card prompt line, table talk line, tiny draft line, round wrap line, quiet option line, and take-home story line must include underscores so the printed PDF visibly supports short written responses.

### Task 2: Product Source and Static Page

**Files:**
- Create: `content/product-artifacts/family-game-night-story-card-deck.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Generated: `public/family-game-night-story-card-deck/index.html`

- [ ] **Step 1: Create canonical source JSON**

Canonical source must include:
- `batchId`: `2026-06-02-batch20`
- `productSlug`: `family-game-night-story-card-deck`
- `title`: `Family Game Night Story Card Deck`
- `pricePoint`: `$27`
- fifteen existing world slugs with local images
- fifteen printable cooperative story card pages
- host guide for table setup, round hosting, quiet participation, no-data use, family handoff, and pack-reset cleanup
- six repeatable cooperative round formats
- ten take-home story starter cards
- eight optional family-share prompts
- exact artifact paths under `product-build/family-game-night-story-card-deck/`

- [ ] **Step 2: Add product record**

Product must use:
- `status`: `checkout_pending`
- `heroImage`: `images/plotsprout/batch20/family-game-night-story-card-deck.jpg`
- `ctaHref`: `mailto:samfrench@gmail.com?subject=Family%20Game%20Night%20Story%20Card%20Deck`
- checkout note saying provider/checkout is pending
- no checkout URL, payment copy, account copy, upload copy, public publishing copy, scoring copy, winner copy, gambling copy, or branded-game copy

- [ ] **Step 3: Add homepage product link**

Append a `productLinks` item in `src/storyData.ts` with no checkout, account, upload, public publishing, student data, score, winner, gambling, or pressure language.

### Task 3: Local Product Image

**Files:**
- Create: `content/image-queue/2026-06-02-batch20-product-images.json`
- Create: `content/image-runs/batch20/family-game-night-story-card-deck.json`
- Create: `public/images/plotsprout/batch20/family-game-night-story-card-deck.jpg`
- Create: `public/images/plotsprout/batch20/family-game-night-story-card-deck.webp`
- Modify: `package.json`

- [ ] **Step 1: Add image manifest and script**

Add `npm run image:batch20` for manual local generation only. Workflow policy tests must continue blocking every `npm run image:*` Action use.

- [ ] **Step 2: Generate image locally**

Use local SDXL with at least 1344x768, 30+ steps, JPEG/WebP quality 90+, no text/letters/logos/watermark/branded characters/scary harm/weapons/people/faces/animals/phones/tablets/devices.

- [ ] **Step 3: Visually inspect the image**

Confirm it reads as a polished screen-free family game night printable card flat lay, with blank story cards, pencils, simple tokens, family-table paper materials, no readable text, no logos, no people, no faces, no animals, no devices, no dice/casino visuals, and no branded characters.

### Task 4: Builder and Artifact Gate

**Files:**
- Create: `scripts/family-game-night-story-card-deck-builder.mjs`
- Create: `scripts/family-game-night-story-card-deck-builder.test.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs` only if manifest helper needs broader source-count support
- Modify: `package.json`
- Generated: `product-build/family-game-night-story-card-deck/*`

- [ ] **Step 1: Write failing validator and builder tests**

Add tests that fail until Batch 20 exists:
- `validateFamilyGameNightStoryCardDeckSource` accepts a valid source with fifteen story cards, exact batch/title/price, matching product, known world slugs, age-band match, and writable blanks.
- `validateFamilyGameNightStoryCardDeckSource` rejects a card line without a writable blank.
- `validateFamilyGameNightStoryCardDeckSource` rejects scoring, winners, teams, gambling, betting, dares, prizes, leaderboards, timers that create pressure, rosters, attendance, sign-in, child-name, child-account, upload, public publishing, medical/legal, therapy/diagnosis, assessment, grades, scores, guaranteed-result, behavior-report, political/branded/romance/weapon/violence/ad-targeting, or unsafe physical instruction language.
- `family-game-night-story-card-deck-builder` loads committed source/product/world/image inputs, renders fifteen story card pages, writes source HTML, README, PDF, ZIP, and manifest in a temp build directory.

- [ ] **Step 2: Add source validator**

Export `familyGameNightStoryCardDeckProductSlug` and `validateFamilyGameNightStoryCardDeckSource`. Validate exact batch/title/price, known world references, product record match, artifact paths, host guide shape, round formats, take-home starter cards, share prompts, fifteen story cards, age-band match, writable blanks, family-safety policy, and unsafe game-night/scoring/data/pressure language.

- [ ] **Step 3: Add builder**

Builder must copy local world images, render a Letter-size PDF, write source HTML, README, ZIP, and manifest with SHA-256 and size records. HTML must contain `Start the story round`, `Take-home story starters`, and fifteen `.game-card-page` sections.

- [ ] **Step 4: Add artifact validation**

`npm run verify:content` must verify Family Game Night source, PDF page count, ZIP larger than PDF, manifest asset coverage, copied image dimensions, checkout readiness, static product page, and total counts.

### Task 5: Verification, Deploy, and Closeout

**Files:**
- Modify: `README.md`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] **Step 1: Run focused checks**

Run:
`npm run product:family-game-night-deck && npx vitest run scripts/family-game-night-story-card-deck-builder.test.mjs scripts/verify-workflows.test.mjs && npm run verify:content`

- [ ] **Step 2: Run full checks**

Run:
`npm run verify`

- [ ] **Step 3: Runtime smoke**

Run local preview and Playwright smoke for `/`, `/family-game-night-story-card-deck/`, and existing product pages at desktop and mobile widths. Check console errors, page errors, image failures, and overflow.

- [ ] **Step 4: Review**

Run a spec-compliance and quality review. Fix blocking findings before commit.

- [ ] **Step 5: Commit, push, and deploy**

Commit the whole Batch 20 as one batch commit, push to `origin/main`, confirm GitHub Actions deploy success on the local runner, and run a live smoke on the new product route.

- [ ] **Step 6: Update TODO and memory**

Record Batch 20 completion, deploy evidence, validation evidence, local GPU image use, subagent use, and billable-service state. Keep checkout provider-gated.
