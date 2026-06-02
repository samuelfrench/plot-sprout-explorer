# Kitchen Table Story Recipe Card Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch 25, the `$29` Kitchen Table Story Recipe Card Deck, as a checkout-pending static product page plus PDF/source/ZIP artifact.

**Architecture:** Follow the Batch 24 product pattern: three content lane JSON files plus one tools lane feed one canonical source JSON, one product-artifact policy validator, one builder that writes source HTML/PDF/ZIP/manifest, one product page rendered by `scripts/render-seo-collections.mjs`, and one local RTX 4090 product image manifest. The product is paper-only creative writing; the recipe frame is metaphorical and must not include food prep, tasting, cooking, allergy, nutrition, heat, knife, or real recipe advice.

**Tech Stack:** Node ESM scripts, Vitest, Playwright/Chromium PDF generation, static HTML under `public/`, local SDXL image generation via `scripts/generate_story_images_local.py`, GitHub Pages deploy on push.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch25-recipe-cards-a.json`
- Create: `content/product-artifacts/lanes/batch25-recipe-cards-b.json`
- Create: `content/product-artifacts/lanes/batch25-recipe-cards-c.json`
- Create: `content/product-artifacts/lanes/batch25-recipe-tools.json`

- [ ] Write three card lanes covering 16 total recipe-card story prompts.
- [ ] Write one tools lane with adult guide, 6 card formats, 10 take-home recipe slips, and 8 optional share prompts.
- [ ] Keep every item adult-led, paper-only, and story-metaphor-only.
- [ ] Run: `node -e "for (const f of ['content/product-artifacts/lanes/batch25-recipe-cards-a.json','content/product-artifacts/lanes/batch25-recipe-cards-b.json','content/product-artifacts/lanes/batch25-recipe-cards-c.json','content/product-artifacts/lanes/batch25-recipe-tools.json']) JSON.parse(require('fs').readFileSync(f,'utf8'))"`
- [ ] Run: `git diff --check -- content/product-artifacts/lanes/batch25-recipe-cards-a.json content/product-artifacts/lanes/batch25-recipe-cards-b.json content/product-artifacts/lanes/batch25-recipe-cards-c.json content/product-artifacts/lanes/batch25-recipe-tools.json`

### Task 2: RED Builder And Policy Tests

**Files:**
- Create: `scripts/kitchen-table-story-recipe-card-deck-builder.test.mjs`

- [ ] Add a Vitest file that imports `validateKitchenTableStoryRecipeCardDeckSource`, `validateKitchenTableStoryRecipeCardDeckSourceFiles`, `buildKitchenTableStoryRecipeCardDeck`, `loadKitchenTableStoryRecipeCardDeckBuildInputs`, and `renderKitchenTableStoryRecipeCardDeckHtml`.
- [ ] Fixture contract: product slug `kitchen-table-story-recipe-card-deck`, title `Kitchen Table Story Recipe Card Deck`, price `$29`, batch `2026-06-02-batch25`, 16 card records, 6 formats, 10 slips, 8 share prompts.
- [ ] Add safety regression: a mutated card with `cook`, `taste`, `allergy`, `stove`, `oven`, `knife`, `nutrition`, `recipe instructions`, `timer`, `score`, `upload`, and `public publishing` must return account/safety errors.
- [ ] Add builder test: temporary build writes `Kitchen-Table-Story-Recipe-Card-Deck.pdf`, source HTML, README, manifest, ZIP, and 16 copied local image assets.
- [ ] Add render test: HTML contains 16 `recipe-card-page` pages, no checkout/payment copy, no forbidden real-food wording, and no horizontal artifact overflow after images load.
- [ ] Run: `npx vitest run scripts/kitchen-table-story-recipe-card-deck-builder.test.mjs --testTimeout 20000`
- [ ] Expected RED: imports fail because the Batch 25 validator and builder do not exist yet.

### Task 3: Product Policy

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`

- [ ] Export `kitchenTableStoryRecipeCardDeckProductSlug`.
- [ ] Add required artifact paths for the Batch 25 PDF, ZIP, source HTML, and manifest.
- [ ] Add `validateKitchenTableStoryRecipeCardDeckSource` with exact count checks, writable blank checks, world age-band matching, checkout-pending source alignment, and a safety regex blocking food prep, tasting/eating, cooking/baking, heat/flames/stove/oven/microwave, knives/scissors/tools, allergens/allergy, nutrition/diet/medical claims, accounts/uploads/public publishing, private child data, contests/timers/scores, violence, weapons, romance, politics, religion, and branded characters.
- [ ] Add `validateKitchenTableStoryRecipeCardDeckSourceFiles` to require exactly three recipe-card lane files and one tools lane, and to compare lane content byte-for-byte after ID sort.
- [ ] Route `inspectArtifactFiles` to the Batch 25 source validator.
- [ ] Run: `npx vitest run scripts/kitchen-table-story-recipe-card-deck-builder.test.mjs --testTimeout 20000`

### Task 4: Builder And Source

**Files:**
- Create: `content/product-artifacts/kitchen-table-story-recipe-card-deck.json`
- Create: `scripts/kitchen-table-story-recipe-card-deck-builder.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs`
- Modify: `package.json`

- [ ] Merge the four lane files into canonical Batch 25 source JSON.
- [ ] Add a builder modeled on `scripts/backyard-story-seed-packet-kit-builder.mjs` with recipe-card naming, 16 card pages, adult guide page, world menu, format page, slip page, README, manifest, and ZIP.
- [ ] Update `buildProductArtifactManifest` so Batch 25 reports `sourcePageCount` from `source.recipeCards?.length`.
- [ ] Add `product:kitchen-recipe-deck` script.
- [ ] Run: `npx vitest run scripts/kitchen-table-story-recipe-card-deck-builder.test.mjs --testTimeout 20000`

### Task 5: Product Page, App Link, Image Manifest

**Files:**
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/render-seo-collections.mjs`
- Modify: `README.md`
- Create: `content/image-queue/2026-06-02-batch25-product-images.json`

- [ ] Add the `$29` checkout-pending product record with `mailto:` CTA, local hero image path, included pages, use cases, parent steps, 16 world slugs, and product-specific world summaries safe for a recipe-card writing product.
- [ ] Add homepage product link and update `storyData.test.ts` expected slugs/prices.
- [ ] Add Batch 25 image manifest and `image:batch25` script.
- [ ] Extend `validate-content-batch.mjs` to require the product page, source file, image manifest, and artifact, and to scan Batch 25 rendered HTML for forbidden real-food language.
- [ ] Render pages with `npm run render:seo`.
- [ ] Run: `npm run verify:content`.

### Task 6: Local Image And Artifact Generation

**Files:**
- Create: `public/images/plotsprout/batch25/kitchen-table-story-recipe-card-deck.jpg`
- Create: `public/images/plotsprout/batch25/kitchen-table-story-recipe-card-deck.webp`
- Create: `content/image-runs/batch25/kitchen-table-story-recipe-card-deck.json`
- Create: `product-build/kitchen-table-story-recipe-card-deck/**`
- Create: `public/kitchen-table-story-recipe-card-deck/index.html`

- [ ] Generate the product image locally on RTX 4090 only. Reject outputs with readable/pseudo text, food, utensils, knives, ovens, flames, people, devices, logos, or real cooking signals.
- [ ] Run: `npm run product:kitchen-recipe-deck`.
- [ ] Run: `npm run render:seo`.
- [ ] Inspect PDF page count with `pdfinfo product-build/kitchen-table-story-recipe-card-deck/Kitchen-Table-Story-Recipe-Card-Deck.pdf`; expected 21 pages.
- [ ] Run: `npm run verify`.

### Task 7: Review, Deploy, Closeout

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run local Playwright smoke for `/`, `/kitchen-table-story-recipe-card-deck/`, and `/backyard-story-seed-packet-kit/` on desktop and mobile.
- [ ] Dispatch spec and quality read-only reviewers.
- [ ] Commit and push Batch 25 code/artifacts.
- [ ] Watch the push-triggered `Deploy` GitHub Actions run on the self-hosted runner.
- [ ] Run live Playwright smoke for `/`, `/kitchen-table-story-recipe-card-deck/`, and `/backyard-story-seed-packet-kit/`.
- [ ] Update `TODO.md` to mark Batch 25 shipped and set Batch 26.
- [ ] Commit/push TODO closeout with `[skip ci]`.
- [ ] Update memory with shipped commits, run ID, tests, image path, billing/service state, and checkout status.
