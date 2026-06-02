# Batch 9 Classroom License Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$79` Classroom Story License Pack with 30 printable prompt cards, teacher routines, a rubric, extension activities, static product page, PDF/source/ZIP artifacts, and checkout-pending validation.

**Architecture:** Keep content generation manual and committed. Four disjoint lane files produce prompt cards and teacher tools; one source JSON integrates them into `content/product-artifacts/classroom-story-license-pack.json`; a dedicated builder renders the PDF/source/ZIP artifacts using the existing local-image copy and manifest/hash policy. The existing static renderer, content validator, product shelf, and product artifact policy get narrow additions for the new product slug.

**Tech Stack:** Vite, React, TypeScript, Vitest, Node ESM scripts, Playwright PDF rendering, static GitHub Pages deployment on the local self-hosted runner.

---

### Task 1: Product Policy Red Tests

**Files:**
- Modify: `scripts/product-artifact-policy.test.mjs`
- Modify: `scripts/content-policy.test.mjs`

- [ ] **Step 1: Write failing product artifact policy tests**

Add tests proving the classroom pack source requires 30 prompt cards, 10 extension activities, 4 rubric criteria, product/source agreement, checkout-pending artifact paths, unique prompt-card ids, and one local image asset per world.

- [ ] **Step 2: Run focused tests to verify RED**

Run: `npm run test -- scripts/product-artifact-policy.test.mjs scripts/content-policy.test.mjs`

Expected: FAIL because `validateClassroomLicenseSource` and classroom artifact paths do not exist yet.

### Task 2: Product Policy Implementation

**Files:**
- Modify: `scripts/product-artifact-policy.mjs`
- Modify: `scripts/product-artifact-policy.test.mjs`

- [ ] **Step 1: Add classroom constants and validator**

Implement `classroomLicenseProductSlug`, `validateClassroomLicenseSource`, expected artifact paths under `product-build/classroom-story-license-pack/`, prompt-card validation, teacher-tool validation, and exact expected path inspection.

- [ ] **Step 2: Run focused tests to verify GREEN**

Run: `npm run test -- scripts/product-artifact-policy.test.mjs`

Expected: PASS.

### Task 3: Classroom Source and Builder Red Tests

**Files:**
- Create: `scripts/classroom-license-pack-builder.test.mjs`
- Create: `scripts/classroom-license-pack-builder.mjs`

- [ ] **Step 1: Write failing builder tests**

Test that rendered classroom HTML contains cover, teacher guide, 30 prompt-card pages, rubric, extension activities, local image references, no active checkout copy, and no overflowing printable pages.

- [ ] **Step 2: Run focused builder test to verify RED**

Run: `npm run test -- scripts/classroom-license-pack-builder.test.mjs`

Expected: FAIL because renderer/build functions are missing or incomplete.

### Task 4: Batch 9 Content Integration

**Files:**
- Create: `content/product-artifacts/lanes/batch9-prompt-cards-a.json`
- Create: `content/product-artifacts/lanes/batch9-prompt-cards-b.json`
- Create: `content/product-artifacts/lanes/batch9-prompt-cards-c.json`
- Create: `content/product-artifacts/lanes/batch9-teacher-tools.json`
- Create: `content/product-artifacts/classroom-story-license-pack.json`
- Modify: `content/products/batch5-products.json`

- [ ] **Step 1: Integrate lane files**

Use the four Batch 9 lane outputs to assemble one source JSON with 30 prompt cards, 10 extension activities, 4 rubric criteria, 5 classroom routines, 5 setup notes, local-image-backed world slugs, and the required safety sentence.

- [ ] **Step 2: Add checkout-pending product record**

Add `classroom-story-license-pack` to `content/products/batch5-products.json` with `$79`, `checkout_pending`, mailto CTA, local hero image, and no active checkout/provider-specific language.

### Task 5: Builder Implementation and Artifacts

**Files:**
- Modify: `scripts/classroom-license-pack-builder.mjs`
- Modify: `package.json`
- Create: `product-build/classroom-story-license-pack/Classroom-Story-License-Pack.pdf`
- Create: `product-build/classroom-story-license-pack/classroom-story-license-pack.zip`
- Create: `product-build/classroom-story-license-pack/source/classroom-story-license-pack.html`
- Create: `product-build/classroom-story-license-pack/README.txt`
- Create: `product-build/classroom-story-license-pack/manifest.json`
- Create: `product-build/classroom-story-license-pack/source/assets/*.jpg`

- [ ] **Step 1: Render source HTML and PDF**

Use Playwright to generate a Letter-size printable PDF from source HTML. Keep pages bounded, source images copied locally, and the ZIP provider-upload-ready.

- [ ] **Step 2: Add npm script and build artifact**

Run: `npm run product:classroom-license-pack`

Expected: PDF, source HTML, README, manifest, ZIP, and copied image assets exist.

### Task 6: Static App and Content Validation

**Files:**
- Modify: `scripts/validate-content-batch.mjs`
- Modify: `scripts/render-seo-collections.mjs`
- Modify: `src/storyData.ts`
- Modify: `src/storyData.test.ts`
- Modify: `src/App.test.tsx`
- Modify: `TODO.md`
- Modify: `README.md` if present

- [ ] **Step 1: Add validator coverage**

Require three product records, three static product pages, the classroom source file, artifact integrity, prompt-card counts, rubric counts, extension counts, image coverage, PDF page count, and checkout-pending readiness.

- [ ] **Step 2: Add UI link coverage**

Expose the classroom pack on the homepage paid shelf and generated static product page.

- [ ] **Step 3: Run focused RED/GREEN checks**

Run: `npm run test -- src/storyData.test.ts src/App.test.tsx scripts/product-artifact-policy.test.mjs scripts/classroom-license-pack-builder.test.mjs`

Expected: PASS after implementation.

### Task 7: Verification, Review, Commit, Push, Deploy

**Files:**
- All Batch 9 changes.

- [ ] **Step 1: Full local verification**

Run: `npm run verify`

Expected: workflow policy, content validation, lint, tests, TypeScript, and Vite build pass.

- [ ] **Step 2: Runtime smoke**

Run local preview and Playwright checks for `/`, `/classroom-story-license-pack/`, `/homeschool-season-story-bundle/`, and `/rainy-day-story-quest-pack/` on desktop and mobile, with zero console/page errors and no horizontal overflow.

- [ ] **Step 3: Two-stage review**

Use spec-compliance and code-quality review subagents against the Batch 9 diff. Fix critical/important issues before proceeding.

- [ ] **Step 4: Commit and push**

Commit Batch 9, push to `origin/main`, check local runner deploy logs, and smoke the live GitHub Pages routes.
