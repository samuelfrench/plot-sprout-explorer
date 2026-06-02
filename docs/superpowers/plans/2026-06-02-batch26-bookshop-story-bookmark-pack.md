# Bookshop Story Bookmark Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch 26, the `$25` Bookshop Story Bookmark Pack, as a checkout-pending static product page plus PDF/source/ZIP artifact.

**Architecture:** Follow the Batch 25 product pattern: three bookmark lane JSON files plus one tools lane feed one canonical source JSON, one product-artifact policy validator, one builder that writes source HTML/PDF/ZIP/manifest, one product page rendered by `scripts/render-seo-collections.mjs`, and one local RTX 4090 product image manifest. The product is an adult-led printable creative-writing bookmark pack; it must not become a reading review, account, public posting, ratings, real bookstore, or copyrighted book-title product.

**Tech Stack:** Node ESM scripts, Vitest, Playwright/Chromium PDF generation, static HTML under `public/`, local SDXL image generation via `scripts/generate_story_images_local.py`, GitHub Pages deploy on push.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch26-bookmarks-a.json`
- Create: `content/product-artifacts/lanes/batch26-bookmarks-b.json`
- Create: `content/product-artifacts/lanes/batch26-bookmarks-c.json`
- Create: `content/product-artifacts/lanes/batch26-bookmark-tools.json`

- [ ] Write three bookmark lanes covering 16 total printable bookmark writing prompts.
- [ ] Write one tools lane with adult guide, 6 bookmark formats, 10 take-home bookmark slips, and 8 optional share prompts.
- [ ] Keep every item adult-led, paper-only, offline, and creative-writing focused.
- [ ] Run: `node -e "for (const f of ['content/product-artifacts/lanes/batch26-bookmarks-a.json','content/product-artifacts/lanes/batch26-bookmarks-b.json','content/product-artifacts/lanes/batch26-bookmarks-c.json','content/product-artifacts/lanes/batch26-bookmark-tools.json']) JSON.parse(require('fs').readFileSync(f,'utf8'))"`
- [ ] Run: `rg -n "account|login|upload|post|public review|rating|score|grade|contest|prize|timer|address|GPS|photo|camera|Harry Potter|Disney|Pokemon|Marvel|Star Wars|Minecraft|publisher|bestseller|weapon|violence|romance|politic|religion|medical|therapy|diagnos|grief" content/product-artifacts/lanes/batch26-bookmarks-a.json content/product-artifacts/lanes/batch26-bookmarks-b.json content/product-artifacts/lanes/batch26-bookmarks-c.json content/product-artifacts/lanes/batch26-bookmark-tools.json`
- [ ] Expected safety scan: no matches except explicitly allowed safety-note wording if intentionally added.

### Task 2: RED Builder And Policy Tests

**Files:**
- Create: `scripts/bookshop-story-bookmark-pack-builder.test.mjs`

- [ ] Add a Vitest file that imports `validateBookshopStoryBookmarkPackSource`, `validateBookshopStoryBookmarkPackSourceFiles`, `buildBookshopStoryBookmarkPack`, `loadBookshopStoryBookmarkPackBuildInputs`, and `renderBookshopStoryBookmarkPackHtml`.
- [ ] Fixture contract: product slug `bookshop-story-bookmark-pack`, title `Bookshop Story Bookmark Pack`, price `$25`, batch `2026-06-02-batch26`, 16 bookmark records, 6 formats, 10 slips, 8 share prompts.
- [ ] Add safety regression: a mutated bookmark/source with account, upload, public posting, public review, rating, grade, score, timer, prize, exact address, photo, real title, real author, branded character, publisher, politics, religion, romance, weapon, violence, and medical/legal/therapy language must return policy errors.
- [ ] Add builder test: temporary build writes `Bookshop-Story-Bookmark-Pack.pdf`, source HTML, README, manifest, ZIP, and 16 copied local image assets.
- [ ] Add render test: HTML contains 16 `bookmark-page` pages, no checkout/payment copy, no public review/account/rating/book-title copy, and no horizontal artifact overflow after images load.
- [ ] Run: `npx vitest run scripts/bookshop-story-bookmark-pack-builder.test.mjs --testTimeout 30000`
- [ ] Expected RED: imports fail because the Batch 26 validator and builder do not exist yet.

### Task 3: Product Policy

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`

- [ ] Export `bookshopStoryBookmarkPackProductSlug`.
- [ ] Add required artifact paths for the Batch 26 PDF, ZIP, source HTML, and manifest.
- [ ] Add `validateBookshopStoryBookmarkPackSource` with exact count checks, writable blank checks, world age-band matching, checkout-pending source alignment, and safety regexes blocking accounts/uploads/public posting/reviews/ratings, exact-place/private-child data, real book titles/authors, publishers/franchises/branded characters, grades/scores/contests/prizes/timers, medical/legal/therapy claims, politics, religion, romance, weapons, violence, and broad app/AI-generator positioning.
- [ ] Add `validateBookshopStoryBookmarkPackSourceFiles` to require exactly three bookmark lane files and one tools lane, and to compare lane content byte-for-byte after ID sort.
- [ ] Route `inspectArtifactFiles` to the Batch 26 source validator.
- [ ] Run: `npx vitest run scripts/bookshop-story-bookmark-pack-builder.test.mjs --testTimeout 30000`.

### Task 4: Builder And Source

**Files:**
- Create: `content/product-artifacts/bookshop-story-bookmark-pack.json`
- Create: `scripts/bookshop-story-bookmark-pack-builder.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs`
- Modify: `package.json`

- [ ] Merge the four lane files into canonical Batch 26 source JSON.
- [ ] Add a builder modeled on `scripts/kitchen-table-story-recipe-card-deck-builder.mjs` with bookmark naming, 16 bookmark pages, adult guide page, world menu, format page, slip page, README, manifest, and ZIP.
- [ ] Update `buildProductArtifactManifest` so Batch 26 reports `sourcePageCount` from `source.bookmarks?.length`.
- [ ] Add `product:bookshop-bookmark-pack` script.
- [ ] Run: `npx vitest run scripts/bookshop-story-bookmark-pack-builder.test.mjs --testTimeout 30000`.

### Task 5: Product Page, App Link, Image Manifest

**Files:**
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `content/image-queue/2026-06-02-batch26-product-images.json`

- [ ] Add the `$25` checkout-pending product record with `mailto:` CTA, local hero image path, included pages, use cases, parent steps, 16 world slugs, and product-specific world summaries safe for a writing-bookmark product.
- [ ] Add homepage product link and update `storyData.test.ts` expected slugs/prices.
- [ ] Add Batch 26 image manifest and `image:batch26` script.
- [ ] Extend `validate-content-batch.mjs` to require the product page, source file, image manifest, and artifact.
- [ ] Render pages with `npm run render:seo`.
- [ ] Run: `npm run verify:content`.

### Task 6: Local Image And Artifact Generation

**Files:**
- Create: `public/images/plotsprout/batch26/bookshop-story-bookmark-pack.jpg`
- Create: `public/images/plotsprout/batch26/bookshop-story-bookmark-pack.webp`
- Create: `content/image-runs/batch26/bookshop-story-bookmark-pack.json`
- Create: `product-build/bookshop-story-bookmark-pack/**`
- Create: `public/bookshop-story-bookmark-pack/index.html`

- [ ] Generate the product image locally on the RTX 4090 only. Reject outputs with readable/pseudo text, book covers/titles, author names, people, devices, logos, public-review/rating signals, pencils, pens, scissors, knives, food, or branded/copyrighted material.
- [ ] Run: `npm run product:bookshop-bookmark-pack`.
- [ ] Run: `npm run render:seo`.
- [ ] Inspect PDF page count with `pdfinfo product-build/bookshop-story-bookmark-pack/Bookshop-Story-Bookmark-Pack.pdf`; expected 21 pages.
- [ ] Run: `npm run verify`.

### Task 7: Review, Deploy, Closeout

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run local Playwright smoke for `/`, `/bookshop-story-bookmark-pack/`, and `/kitchen-table-story-recipe-card-deck/` on desktop and mobile.
- [ ] Dispatch read-only spec and quality reviewers.
- [ ] Commit and push Batch 26 code/artifacts.
- [ ] Watch the push-triggered `Deploy` GitHub Actions run on the self-hosted runner.
- [ ] Run live Playwright smoke for `/`, `/bookshop-story-bookmark-pack/`, and `/kitchen-table-story-recipe-card-deck/`.
- [ ] Update `TODO.md` to mark Batch 26 shipped and set the next batch.
- [ ] Commit/push TODO closeout with `[skip ci]`.
- [ ] Update memory with shipped commits, run ID, tests, image path, billable-service state, and checkout status.
