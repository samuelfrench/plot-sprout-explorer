# Batch 3 Mini-Units Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 10 homeschool/classroom mini-units with teacher notes, printable-kit positioning, and no student-account requirements.

**Architecture:** Generate mini-unit content as committed JSON under `content/mini-units/`, validate it with the existing content gate, render deterministic static HTML pages under `public/mini-units/`, and add a small homepage entry point. Mini-unit generation remains manual/subagent-driven; GitHub Actions only verifies and deploys committed files on push.

**Tech Stack:** React, TypeScript, Vite, Vitest, Node.js static rendering, committed JSON content, GitHub Pages deployed by push-triggered local runner.

---

### Task 1: RED Tests and Batch 3 Contract

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `scripts/validate-content-batch.mjs`

- [ ] **Step 1: Write failing homepage test**

Add a test that renders `<App />` and expects a `Teacher mini-units` heading plus a link to `/mini-units/`.

- [ ] **Step 2: Verify UI RED**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL because the mini-units homepage entry point does not exist.

- [ ] **Step 3: Extend validator contract**

Update `scripts/validate-content-batch.mjs` to require `content/mini-units/batch3-mini-units.json` with:

- batchId `2026-06-02-batch3`
- exactly 10 units
- unique kebab-case slugs
- each unit references 2-4 Batch 1 worlds
- each unit has `title`, `ageBand`, `audience`, `duration`, `summary`, `objectives`, `materials`, `lessonFlow`, `teacherNotes`, `homeschoolAdaptation`, `classroomManagement`, `assessment`, `printableOffer`, `safetyNote`, and `imagePrompt`
- `lessonFlow` exactly 3 lessons with `title`, `minutes`, `teacherMove`, `studentTask`, and `output`
- no child accounts, no public publishing, no live checkout claims
- required safety sentence present
- generated pages exist under `public/mini-units/`

- [ ] **Step 4: Verify content RED**

Run: `npm run verify:content`

Expected: FAIL because Batch 3 mini-unit source and pages do not exist yet.

### Task 2: Parallel Mini-Unit Generation

**Files:**
- Create: `content/mini-units/lanes/worker-a.json`
- Create: `content/mini-units/lanes/worker-b.json`
- Create: `content/mini-units/lanes/worker-c.json`
- Create: `content/mini-units/lanes/worker-d.json`
- Create: `content/mini-units/lanes/worker-e.json`
- Create: `content/mini-units/batch3-mini-units.json`

- [ ] **Step 1: Dispatch five workers**

Each worker owns one lane file and writes exactly two units:

- Lower ages 7-8 practical starters
- Lower/middle ages 7-9 printable worksheet units
- Middle ages 8-10 STEM/nature crossover units
- Upper ages 10-11 revision/craft units
- Mixed classroom/homeschool bundle units

- [ ] **Step 2: Merge lanes**

Create `content/mini-units/batch3-mini-units.json`:

```json
{
  "batchId": "2026-06-02-batch3",
  "generatedAt": "2026-06-02",
  "units": []
}
```

- [ ] **Step 3: Manual content review**

Check all units for family safety, useful teacher notes, no account assumptions, no public sharing, no manipulative selling, and clear printable value.

### Task 3: Static Mini-Unit Renderer

**Files:**
- Modify: `scripts/render-seo-collections.mjs`
- Modify: `package.json` only if the script name changes
- Generate: `public/mini-units/index.html`
- Generate: `public/mini-units/<unit-slug>/index.html`

- [ ] **Step 1: Extend renderer**

Read `content/mini-units/batch3-mini-units.json` and render:

- index page with all 10 units
- one detail page per unit

Pages must include escaped HTML, title/meta description, canonical URL, world references, lesson flow, teacher notes, homeschool adaptation, classroom management, assessment, printable direction, safety note, and links back to the app.

- [ ] **Step 2: Run renderer**

Run: `npm run render:seo`

Expected: four Batch 2 pages, mini-unit index, and 10 mini-unit pages are generated.

### Task 4: Homepage Entry Point

**Files:**
- Modify: `src/storyData.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Add typed homepage link metadata**

Export a small `miniUnitHubLink` object with slug `mini-units`, title `Teacher mini-units`, and a short description. Keep full unit bodies out of the React bundle.

- [ ] **Step 2: Render homepage section**

Add one compact section after writing lanes linking to `/mini-units/`. Keep the UI consistent with the existing workbench and cards.

- [ ] **Step 3: Verify UI GREEN**

Run: `npm run test -- src/App.test.tsx`

Expected: PASS.

### Task 5: Verification, Reviews, Commit, Push, Deploy

**Files:**
- Modify: `TODO.md`

- [ ] **Step 1: Full local verification**

Run: `npm run verify`

Expected: workflow policy, rendering, content validation, lint, tests, and build all pass.

- [ ] **Step 2: Browser smoke**

Run preview and verify:

- homepage loads with zero console warnings/errors
- mini-unit hub link is present
- `/mini-units/` returns HTTP 200 and lists 10 units
- at least three mini-unit detail pages return HTTP 200 and show lesson flow
- mobile viewport has no horizontal overflow

- [ ] **Step 3: Subagent reviews**

Use read-only reviewers for:

- spec/safety/product fit
- code quality/deploy policy/base-path/runtime risk

- [ ] **Step 4: TODO closeout**

Move Batch 3 to completed and set Batch 4 local GPU image generation as the next in-progress batch.

- [ ] **Step 5: Commit, push, deploy-check**

Commit and push all Batch 3 files. Verify the local runner deploy succeeds and live Pages routes return HTTP 200 with clean Playwright smoke.
