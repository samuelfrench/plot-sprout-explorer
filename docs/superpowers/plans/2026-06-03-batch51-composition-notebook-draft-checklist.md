# Batch51 Composition Notebook Story Draft Checklist Card Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `$75` Composition Notebook Story Draft Checklist Card Pack as a static checkout-pending Plot Sprout product with source JSON, lane files, local image, PDF/source/ZIP artifacts, tests, deploy, TODO closeout, and memory update.

**Architecture:** Follow the Batch50 product-pack architecture: three card lane JSON files and one tools lane feed a canonical source JSON file; validators enforce exact schema, safety, lane coverage, world/age alignment, product/catalog alignment, artifact paths, and checkout-pending status; a dedicated builder renders deterministic printable HTML/PDF/ZIP artifacts; the existing static renderer publishes the product route from `content/products/batch5-products.json`.

**Tech Stack:** Vite, React, Vitest, Node ESM scripts, Playwright, local RTX4090 SDXL image generation through `scripts/generate_story_images_local.py`.

---

### Task 1: Batch51 Content Contract And Lanes

**Files:**
- Create: `content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-a.json`
- Create: `content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-b.json`
- Create: `content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-c.json`
- Create: `content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-tools.json`

- [ ] Write cards 01-06, 07-11, and 12-16.
- [ ] Use fields `id`, `title`, `worldSlug`, `ageBand`, `draftChecklistSkill`, `useCase`, `adultSetup`, `kidDirection`, `characterCheckPrompt`, `settingCheckPrompt`, `sequenceCheckPrompt`, `detailCheckPrompt`, `sentenceCheckPrompt`, `finalDraftChecklistPrompt`, `quietOptionLine`, and `takeHomeLine`.
- [ ] Write tools with `adultGuide`, `draftChecklistRoutines`, `takeHomeDraftChecklistSlips`, and `optionalAdultPrompts`.
- [ ] Keep every value ASCII, fictional, adult-led, offline, paper-only, and with writable blanks where applicable.
- [ ] Avoid unsafe terms: no grades, scores, timers, uploads, recording, camera/photo/audio/video/voice-memo flow, public posting, accounts, real school/home identity details, private child profiles, diary-style personal disclosures, food/allergy/medical advice, or real child data.
- [ ] Avoid repeating the exact Batch50 world-slug set; Batch51 may reuse earlier broad worlds only when product copy stays distinct and validator coverage proves the pack is not a copied Batch50 variant.

### Task 2: RED Tests

**Files:**
- Create: `scripts/composition-notebook-story-draft-checklist-card-pack-builder.test.mjs`

- [ ] Add failing tests that import nonexistent Batch51 validator and builder exports:
  - `validateCompositionNotebookStoryDraftChecklistCardPackSource`
  - `validateCompositionNotebookStoryDraftChecklistCardPackSourceFiles`
  - `buildCompositionNotebookStoryDraftChecklistCardPack`
  - `renderCompositionNotebookStoryDraftChecklistCardPackHtml`
- [ ] Assert source schema, exact lane paths, lane range ownership, banned grading/upload/recording/private-data terms, rendered draft-checklist fields, artifact path inspection, deterministic builder output, and committed product checkout-pending state.
- [ ] Add one test that rejects a source whose `worldSlugs` exactly match the Batch50 world-slug set.
- [ ] Run `npx vitest run scripts/composition-notebook-story-draft-checklist-card-pack-builder.test.mjs --testTimeout 15000` and confirm the expected import/export failure before implementation.

### Task 3: Validator And Builder Integration

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/validate-content-batch.mjs`
- Create: `scripts/composition-notebook-story-draft-checklist-card-pack-builder.mjs`
- Modify: `package.json`

- [ ] Add the Batch51 slug `composition-notebook-story-draft-checklist-card-pack` and required artifact paths.
- [ ] Add source and lane validators for 16 cards, 6 routines, 10 take-home draft-checklist slips, 8 optional prompts, exact world/age mapping, exact lane range split, writable blanks, product alignment, and safety constraints.
- [ ] Add the builder script and package scripts `image:batch51` and `product:composition-notebook-draft-checklist-pack`.
- [ ] Run the focused Batch51 Vitest file until it is green.

### Task 4: Product Source, Catalog, And Static Route

**Files:**
- Create: `content/product-artifacts/composition-notebook-story-draft-checklist-card-pack.json`
- Modify: `content/products/batch5-products.json`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Create: `content/image-queue/2026-06-03-batch51-product-images.json`

- [ ] Assemble source JSON from the lane files.
- [ ] Add the checkout-pending product page entry with `$75`, mailto-only CTA, local image path, world summaries, bullets, and safety notes.
- [ ] Add the product to `staticProducts` and route/link tests.
- [ ] Add the local-only image manifest for the product image.

### Task 5: Assets, Artifacts, Verification, And Closeout

**Files:**
- Create: `public/images/plotsprout/batch51/composition-notebook-story-draft-checklist-card-pack.jpg`
- Create: `public/images/plotsprout/batch51/composition-notebook-story-draft-checklist-card-pack.webp`
- Create: `content/image-runs/batch51/composition-notebook-story-draft-checklist-card-pack.json`
- Create: `product-build/composition-notebook-story-draft-checklist-card-pack/*`
- Create: `public/composition-notebook-story-draft-checklist-card-pack/index.html`
- Modify: `TODO.md`
- Modify: `/home/sam/.codex/memories/MEMORY.md` after deploy/live smoke

- [ ] Generate the local SDXL product image with `PLOTSPROUT_MODELS_ROOT=/home/sam/claude-workspace/ComfyUI/models npm run image:batch51`.
- [ ] Build the PDF/source/ZIP artifacts with `npm run product:composition-notebook-draft-checklist-pack`.
- [ ] Run `npm run verify`.
- [ ] Run local Playwright desktop/mobile product and homepage checks with browser console checks.
- [ ] Request content/artifact and UI/static reviews before merge.
- [ ] Commit, push the branch, merge/fast-forward main, push main, watch GitHub Actions deploy, live smoke, close TODO with `[skip ci]`, update memory, and leave checkout pending.
