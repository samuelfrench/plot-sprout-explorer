# Batch50 Lined Paper Story Paragraph Revision Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$73` Lined Paper Story Paragraph Revision Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch49 product pattern: content lanes feed one source JSON file, validators enforce exact schema/safety/path rules, a builder renders deterministic print HTML/PDF/ZIP artifacts, and the existing static renderer publishes the product route from `content/products/batch5-products.json`.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Content Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-a.json`
- Create: `content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-b.json`
- Create: `content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-c.json`
- Create: `content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16 with disjoint world slugs from the Batch44-49 set.
- [ ] Use fields `id`, `title`, `worldSlug`, `ageBand`, `paragraphRevisionSkill`, `useCase`, `adultSetup`, `kidDirection`, `topicSentencePrompt`, `detailOrderPrompt`, `transitionCheckPrompt`, `closingSentencePrompt`, `repeatedWordCutPrompt`, `finalRevisedParagraphPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Write tools with `adultGuide`, `paragraphRevisionRoutines`, `takeHomeParagraphRevisionSlips`, and `optionalAdultPrompts`.
- [ ] Keep all values ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no spelling grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, food/allergy/medical advice, or real child data.

### Task 2: RED Tests

**Files:**
- Create: `scripts/lined-paper-story-paragraph-revision-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch50 validator and builder exports.
- [ ] Assert source schema, exact lane paths, lane range ownership, banned scoring/upload/recording/private-data terms, rendered paragraph-revision fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Run `npx vitest run scripts/lined-paper-story-paragraph-revision-card-pack-builder.test.mjs --testTimeout 15000` and confirm expected import/export failure before implementation.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `scripts/lined-paper-story-paragraph-revision-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add Batch50 slug and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home paragraph revision slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, and safety constraints.
- [ ] Add the builder script and package scripts `image:batch50` and `product:lined-paper-paragraph-revision-pack`.
- [ ] Run the focused Batch50 Vitest file until it is green.

### Task 4: Product Source And Static Catalog

**Files:**
- Create: `content/product-artifacts/lined-paper-story-paragraph-revision-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-03-batch50-product-images.json`

- [ ] Assemble source JSON from the lane files.
- [ ] Add the checkout-pending product page entry with `$73`, mailto-only CTA, local image path, world summaries, bullets, and safety notes.
- [ ] Add the product to `staticProducts` and route/link tests.
- [ ] Add the local-only image manifest for the product image.

### Task 5: Assets, Artifacts, And Verification

**Files:**
- Create: `public/images/plotsprout/batch50/lined-paper-story-paragraph-revision-card-pack.jpg`
- Create: `public/images/plotsprout/batch50/lined-paper-story-paragraph-revision-card-pack.webp`
- Create: `content/image-runs/batch50/lined-paper-story-paragraph-revision-card-pack.json`
- Create: `product-build/lined-paper-story-paragraph-revision-card-pack/*`
- Modify: generated static route `lined-paper-story-paragraph-revision-card-pack/index.html`

- [ ] Generate the local SDXL image with `PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models npm run image:batch50`.
- [ ] Build the PDF/source/ZIP artifacts with `npm run product:lined-paper-paragraph-revision-pack`.
- [ ] Run `npm run verify`, local Playwright desktop/mobile product and homepage checks, and browser console checks.
- [ ] Request content/artifact and UI/static reviews before merge.
- [ ] Commit, push the branch, merge/fast-forward main, push main, watch GitHub Actions deploy, live smoke, close TODO with `[skip ci]`, update memory, and leave checkout pending.
