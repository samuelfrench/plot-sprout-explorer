# Batch 8 Homeschool Season Bundle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$29` Homeschool Season Story Bundle as a checkout-pending static product page plus provider-upload-ready PDF/source/ZIP artifact.

**Architecture:** Keep checkout wiring externally gated and continue the manual product-build lane. Extend the existing product source, static renderer, artifact policy, and artifact builder patterns so the second paid product proves it has committed source pages, local image assets, PDF, manifest, and ZIP before any checkout status can be changed.

**Tech Stack:** Vite, React, TypeScript, Vitest, Node ESM scripts, Playwright PDF generation, committed local RTX 4090 image assets.

---

### Task 1: Batch 8 Contract Tests

**Files:**
- Modify: `scripts/product-artifact-policy.test.mjs`
- Modify: `scripts/rainy-day-pack-builder.test.mjs`
- Modify: `src/App.test.tsx`
- Modify: `src/storyData.test.ts`
- Modify: `scripts/validate-content-batch.mjs`

- [ ] **Step 1: Add failing product policy expectations**

Add a test that expects `validateSeasonBundleSource(source, product, knownWorldSlugs)` to accept a `$29` source with 12 quests, one source page per quest, required checkout-pending artifact paths, and at least 8 unique Batch 1 worlds.

- [ ] **Step 2: Add failing generic artifact expectations**

Add a test that calls `inspectConfiguredArtifactFiles(root, artifact, expectedPaths, { expectedPdfPages })` against a temporary bundle folder. Expected RED failure before implementation: the exported function does not exist.

- [ ] **Step 3: Add failing builder expectations**

Add a test that imports `renderSeasonBundleHtml` and `buildProductArtifactManifest`, renders a one-quest sample, and proves the output has `source.pages.length + 2` printable sheets and no checkout/payment language. Expected RED failure before implementation: exports do not exist.

- [ ] **Step 4: Add failing homepage/product link expectations**

Add React tests that expect both Rainy Day and Homeschool Season product links on the homepage. Add story data tests that expect a `productLinks` array containing both slugs. Expected RED failure before implementation: only `featuredProductLink` exists.

- [ ] **Step 5: Add failing content validator checks**

Extend `scripts/validate-content-batch.mjs` so the expected future output is 2 static product pages and 2 product artifacts. Expected RED failure before content implementation: missing `content/product-artifacts/homeschool-season-story-bundle.json`.

### Task 2: Product Records and Static Pages

**Files:**
- Modify: `content/products/batch5-products.json`
- Modify: `scripts/render-seo-collections.mjs`
- Modify: `src/storyData.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Add product record**

Add `homeschool-season-story-bundle` to `content/products/batch5-products.json` with `pricePoint: "$29"`, `status: "checkout_pending"`, `ctaHref` as `mailto:`, a committed local hero image, at least 10 included pages, 4 use cases, 4 parent steps, the required safety sentence, and no active checkout language.

- [ ] **Step 2: Render all products**

Keep `renderProductPage` static and checkout-pending. Let the existing products loop render both `public/rainy-day-story-quest-pack/index.html` and `public/homeschool-season-story-bundle/index.html`.

- [ ] **Step 3: Update app product links**

Replace the single `featuredProductLink` export with `productLinks`. Render a compact product grid on the homepage, preserving the existing Rainy Day link and adding the `$29` bundle link.

- [ ] **Step 4: Run focused tests**

Run `npm run test -- src/App.test.tsx src/storyData.test.ts`. Expected GREEN: homepage and story data expose both product links without enabling checkout.

### Task 3: Season Bundle Source Content

**Files:**
- Create: `content/product-artifacts/homeschool-season-story-bundle.json`

- [ ] **Step 1: Generate 12 quest source pages**

Create 12 printable quest pages across `fall`, `winter`, `spring`, and `summer` seasons. Each quest must include a kid direction, adult note, 2-4 worksheet sections, lines that can be printed as blanks, and a referenced Batch 1 world slug.

- [ ] **Step 2: Add adult guide and cover**

Include `cover`, `adultGuide.setup`, `adultGuide.seasonPlan`, `adultGuide.supportMoves`, and `adultGuide.extensionIdeas`. Keep all language family-friendly, offline, adult-guided, and printable-first.

- [ ] **Step 3: Run content validator**

Run `npm run verify:content`. Expected RED until artifact files exist, but source-level validation must not report source schema, safety, world coverage, or checkout-language errors.

### Task 4: Bundle Artifact Builder

**Files:**
- Create: `scripts/homeschool-season-bundle-builder.mjs`
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/rainy-day-pack-builder.mjs`
- Modify: `package.json`

- [ ] **Step 1: Generalize artifact inspection**

Keep Rainy Day behavior intact by making `inspectArtifactFiles` delegate to a new generic `inspectConfiguredArtifactFiles(root, artifact, expectedPaths, options)` helper.

- [ ] **Step 2: Add season source validation**

Export `validateSeasonBundleSource`. Enforce slug/title/price/batch/date, required safety sentence, product record match, 12 quests, 4 seasons, 8+ unique world slugs, source artifact paths, no account/upload/publishing language, and no active checkout language.

- [ ] **Step 3: Add reusable manifest helper**

Export `buildProductArtifactManifest(source, files, options)` from the existing builder module and keep `buildArtifactManifest` as the Rainy Day wrapper.

- [ ] **Step 4: Add season builder**

Build `product-build/homeschool-season-story-bundle/` with:
- `Homeschool-Season-Story-Bundle.pdf`
- `homeschool-season-story-bundle.zip`
- `source/homeschool-season-story-bundle.html`
- `manifest.json`
- `README.txt`
- copied local JPEG image assets for every referenced world that already has a committed Batch 4 or starter image.

- [ ] **Step 5: Add manual script**

Add `product:homeschool-season-bundle` to `package.json`. Do not add any GitHub Actions content or product generation workflow.

### Task 5: Build, Validate, and Document

**Files:**
- Modify: `TODO.md`
- Modify: `README.md`
- Generated: `public/homeschool-season-story-bundle/index.html`
- Generated: `product-build/homeschool-season-story-bundle/**`

- [ ] **Step 1: Build static pages**

Run `npm run render:seo` and confirm the new static product page exists.

- [ ] **Step 2: Build product artifact**

Run `npm run product:homeschool-season-bundle` and inspect generated PDF page count via the validator.

- [ ] **Step 3: Run full verification**

Run `npm run verify`. Expected GREEN: workflow policy, content validation, lint, tests, and production build pass.

- [ ] **Step 4: Runtime smoke**

Run a local preview and use Playwright to verify `/`, `/homeschool-season-story-bundle/`, and the generated product page have no browser console errors and no horizontal overflow at desktop and 390px mobile widths.

- [ ] **Step 5: Update docs and TODO**

Move hosted checkout wiring into an external-provider gate. Mark Batch 8 complete for the `$29` bundle artifact. Keep checkout wiring unchecked.

- [ ] **Step 6: Commit, push, deploy smoke**

Commit and push all changes. Wait for the push-triggered local-runner GitHub Pages deployment, then live-smoke `https://samuelfrench.github.io/plot-sprout-explorer/homeschool-season-story-bundle/`.

### Self-Review

- Scope is a single product-batch slice: static product page plus artifact.
- Checkout remains pending; no provider, endpoint, webhook, download URL, scheduled workflow, or cloud image path is introduced.
- Tests cover source schema, artifact files, page count, homepage links, and checkout-pending behavior.
- Content generation is manual/local and can use subagents; GitHub Actions remain deploy-only.
