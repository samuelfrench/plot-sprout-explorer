# Batch49 Clipboard Story Paragraph Focus Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$71` Clipboard Story Paragraph Focus Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch48 product pattern: content lanes feed one source JSON file, validators enforce exact schema/safety/path rules, a builder renders deterministic print HTML/PDF/ZIP artifacts, and the existing static renderer publishes the product route from `content/products/batch5-products.json`.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-a.json`
- Create: `content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-b.json`
- Create: `content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-c.json`
- Create: `content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16 with disjoint world slugs from the Batch44-48 set.
- [ ] Use fields `id`, `title`, `worldSlug`, `ageBand`, `paragraphFocusSkill`, `useCase`, `adultSetup`, `kidDirection`, `mainIdeaPrompt`, `detailOnePrompt`, `detailTwoPrompt`, `detailOrderPrompt`, `linkingSentencePrompt`, `cutExtraPrompt`, `finalParagraphPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Write tools with `adultGuide`, `paragraphFocusRoutines`, `takeHomeParagraphSlips`, and `optionalAdultPrompts`.
- [ ] Keep all values ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.

### Task 2: RED Tests

**Files:**
- Create: `scripts/clipboard-story-paragraph-focus-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch49 validator and builder exports.
- [ ] Assert source schema, exact lane paths, lane range ownership, banned scoring/upload/recording/private-data terms, rendered paragraph-focus fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Run `npx vitest run scripts/clipboard-story-paragraph-focus-card-pack-builder.test.mjs --testTimeout 15000` and confirm expected import/export failure before implementation.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `scripts/clipboard-story-paragraph-focus-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add Batch49 slug and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home paragraph slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, and safety constraints.
- [ ] Add the builder script and package scripts `image:batch49` and `product:clipboard-paragraph-focus-pack`.
- [ ] Run the focused Batch49 Vitest file until it is green.

### Task 4: Product Source And Static Catalog

**Files:**
- Create: `content/product-artifacts/clipboard-story-paragraph-focus-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-03-batch49-product-images.json`

- [ ] Assemble source JSON from the lane files.
- [ ] Add the checkout-pending product page entry with `$71`, mailto-only CTA, local image path, world summaries, bullets, and safety notes.
- [ ] Add the product to `staticProducts` and route/link tests.
- [ ] Add the local-only image manifest for the product image.

### Task 5: Assets, Artifacts, And Verification

**Files:**
- Create: `public/images/plotsprout/batch49/clipboard-story-paragraph-focus-card-pack.jpg`
- Create: `public/images/plotsprout/batch49/clipboard-story-paragraph-focus-card-pack.webp`
- Create: `content/image-runs/batch49/clipboard-story-paragraph-focus-card-pack.json`
- Create: `product-build/clipboard-story-paragraph-focus-card-pack/*`
- Modify: generated static route `clipboard-story-paragraph-focus-card-pack/index.html`

- [ ] Generate the local SDXL image with `PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models npm run image:batch49`.
- [ ] Build the PDF/source/ZIP artifacts with `npm run product:clipboard-paragraph-focus-pack`.
- [ ] Run `npm run verify`, local Playwright desktop/mobile product and homepage checks, and browser console checks.
- [ ] Request content/artifact and UI/static reviews before merge.
- [ ] Commit, push the branch, merge/fast-forward main, push main, watch GitHub Actions deploy, live smoke, close TODO with `[skip ci]`, update memory, and leave checkout pending.
