# Pencil Case Story Switch Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Batch 31, the `$35` Pencil Case Story Switch Card Pack, as a checkout-pending static product page plus PDF/source/ZIP artifact.

**Architecture:** Follow the Batch 30 product pattern: three card lane JSON files plus one tools lane feed one canonical source JSON, one product-artifact policy validator, one builder that writes source HTML/PDF/ZIP/manifest, one static product page rendered by `scripts/render-seo-collections.mjs`, and one local RTX 4090 product image manifest. The product is an adult-led paper switch-card pack; pencil-case switch language means fictional printed choice toggles only, never school logins, accounts, public posting, reviews, real child data, grades, apps, QR codes, or uploads.

**Tech Stack:** Node ESM scripts, Vitest, Playwright/Chromium PDF generation, static HTML under `public/`, local SDXL image generation via `scripts/generate_story_images_local.py`, GitHub Pages deploy on push.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch31-pencil-case-switch-cards-a.json`
- Create: `content/product-artifacts/lanes/batch31-pencil-case-switch-cards-b.json`
- Create: `content/product-artifacts/lanes/batch31-pencil-case-switch-cards-c.json`
- Create: `content/product-artifacts/lanes/batch31-pencil-case-switch-tools.json`

- [ ] Write three switch-card lanes covering 16 total printable story switch cards.
- [ ] Write one tools lane with adult guide, 6 switch routines, 10 take-home switch slips, and 8 optional share prompts.
- [ ] Keep every item adult-led, paper-only, offline, fictional, and creative-writing focused.
- [ ] Run JSON parse checks on all four lane files.
- [ ] Run scoped safety scans for account/login/upload/public post/review/rating/score/grade/contest/prize/timer/QR/app/portal/student record/real child data/photo/camera/address/GPS/coordinates/real route/real location/food/allergy/medical/legal/therapy/grief/politics/religion/romance/weapon/violence/branded-franchise language.

### Task 2: RED Builder And Policy Tests

**Files:**
- Create: `scripts/pencil-case-story-switch-card-pack-builder.test.mjs`

- [ ] Add a Vitest file that imports `validatePencilCaseStorySwitchCardPackSource`, `validatePencilCaseStorySwitchCardPackSourceFiles`, `buildPencilCaseStorySwitchCardPack`, `loadPencilCaseStorySwitchCardPackBuildInputs`, and `renderPencilCaseStorySwitchCardPackHtml`.
- [ ] Fixture contract: product slug `pencil-case-story-switch-card-pack`, title `Pencil Case Story Switch Card Pack`, price `$35`, batch `2026-06-02-batch31`, 16 card records, 6 routines, 10 take-home slips, 8 share prompts.
- [ ] Add safety regression blocking school logins, accounts, uploads, public posting, reviews, ratings, grades, scores, timers, prizes, contests, QR/app/portal language, real child data, student records, photos, cameras, addresses, GPS, coordinates, real routes, exact locations, food/allergy advice, medical/legal/therapy/grief, politics, religion, romance, weapons, violence, and branded/franchise language.
- [ ] Add builder test: temporary build writes `Pencil-Case-Story-Switch-Card-Pack.pdf`, source HTML, README, manifest, ZIP, and 16 copied local image assets.
- [ ] Add render test: HTML contains 16 `story-switch-card-page` pages, no checkout/payment copy, no account/public-posting/review/rating/tracker/school-login copy, and no artifact page overflow after images load.
- [ ] Run: `npx vitest run scripts/pencil-case-story-switch-card-pack-builder.test.mjs --testTimeout 40000`.
- [ ] Expected RED: imports fail because the Batch 31 validator and builder do not exist yet.

### Task 3: Product Policy

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`

- [ ] Export `pencilCaseStorySwitchCardPackProductSlug`.
- [ ] Add required artifact paths for the Batch 31 PDF, ZIP, source HTML, and manifest.
- [ ] Add `validatePencilCaseStorySwitchCardPackSource` with exact count checks, writable blank checks, world age-band matching, checkout-pending source alignment, source-file coverage, and safety regexes.
- [ ] Add `validatePencilCaseStorySwitchCardPackSourceFiles` to require exactly three card lane files and one tools lane, and to compare lane content byte-for-byte after ID sort.
- [ ] Route `inspectArtifactFiles` to the Batch 31 expected artifact paths.

### Task 4: Builder And Source

**Files:**
- Create: `content/product-artifacts/pencil-case-story-switch-card-pack.json`
- Create: `scripts/pencil-case-story-switch-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Merge the four lane files into canonical Batch 31 source JSON.
- [ ] Add a builder modeled on `scripts/porch-light-story-signal-card-pack-builder.mjs` with 16 story-switch-card pages, adult guide page, world menu, switch routine page, take-home switch slip page, README, manifest, and ZIP.
- [ ] Keep PDF metadata deterministic after Playwright writes the PDF.
- [ ] Add `product:pencil-case-switch-pack` script.

### Task 5: Product Page, App Link, Image Manifest

**Files:**
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `content/image-queue/2026-06-02-batch31-product-images.json`

- [ ] Add the `$35` checkout-pending product record with `mailto:` CTA, local hero image path, included pages, use cases, parent steps, 16 world slugs, and product-specific safe world summaries.
- [ ] Add homepage product link and update `storyData.test.ts` expected slugs/prices.
- [ ] Add Batch 31 image manifest and `image:batch31` script.
- [ ] Extend `validate-content-batch.mjs` to require the product page, source file, image manifest, artifact, and checkout-pending state.
- [ ] Render pages with `npm run render:seo`.

### Task 6: Local Image And Artifact Generation

**Files:**
- Create: `public/images/plotsprout/batch31/pencil-case-story-switch-card-pack.jpg`
- Create: `public/images/plotsprout/batch31/pencil-case-story-switch-card-pack.webp`
- Create: `content/image-runs/batch31/pencil-case-story-switch-card-pack.json`
- Create: `product-build/pencil-case-story-switch-card-pack/**`
- Create: `public/pencil-case-story-switch-card-pack/index.html`

- [ ] Generate the product image locally on the RTX 4090 only. Reject outputs with readable/pseudo text, logos, devices, people/faces, photos/cameras, school login/app/QR cues, real child data, public-review/rating signals, scores, timers, or branded/copyrighted material.
- [ ] Run: `npm run product:pencil-case-switch-pack`.
- [ ] Run: `npm run render:seo`.
- [ ] Inspect PDF page count with `pdfinfo product-build/pencil-case-story-switch-card-pack/Pencil-Case-Story-Switch-Card-Pack.pdf`; expected 21 pages.
- [ ] Run: `npm run verify`.

### Task 7: Review, Deploy, Closeout

**Files:**
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md`

- [ ] Run local Playwright smoke for `/`, `/pencil-case-story-switch-card-pack/`, `/porch-light-story-signal-card-pack/`, and `/quiet-corner-story-map-card-pack/` on desktop and mobile.
- [ ] Dispatch read-only spec and quality reviewers.
- [ ] Commit and push Batch 31 code/artifacts.
- [ ] Watch the push-triggered `Deploy` GitHub Actions run on the self-hosted runner.
- [ ] Run live Playwright smoke for `/`, `/pencil-case-story-switch-card-pack/`, `/porch-light-story-signal-card-pack/`, and `/quiet-corner-story-map-card-pack/`.
- [ ] Update `TODO.md` to mark Batch 31 shipped and set the next batch.
- [ ] Commit/push TODO closeout with `[skip ci]`.
- [ ] Update memory with shipped commits, run ID, tests, image path, billable-service state, and checkout status.
