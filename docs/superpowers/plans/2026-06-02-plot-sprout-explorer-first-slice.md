# Plot Sprout Explorer First Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working Plot Sprout Explorer slice: family writing quest workbench, content model, local image pipeline, TODO tracking, and verification.

**Architecture:** Static React/Vite app with TypeScript data modules. Content generation starts as repo-local scripts and markdown workflows so subagents can generate, review, and commit batches without live mutating endpoints.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Playwright, Python diffusers for local GPU images.

---

### Task 1: Content Data Model

**Files:**
- Create: `src/storyData.ts`
- Test: `src/storyData.test.ts`

- [x] **Step 1: Write failing tests**
- [x] **Step 2: Run tests to verify RED**
- [x] **Step 3: Implement data model**
- [x] **Step 4: Run tests to verify GREEN**

### Task 2: Workbench UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Modify: `src/index.css`
- Test: `src/App.test.tsx`

- [x] **Step 1: Write failing render test**
- [x] **Step 2: Implement UI**
- [x] **Step 3: Verify UI tests**

### Task 3: Automation Docs and Scripts

**Files:**
- Create: `docs/CONTENT_FLYWHEEL.md`
- Create: `scripts/create-content-batch.mjs`
- Create: `scripts/generate_story_images_local.py`
- Modify: `package.json`

- [x] **Step 1: Add deterministic content batch script**
- [x] **Step 2: Add local GPU image script**

### Task 4: Verification and Commit

**Files:**
- Modify: `TODO.md`
- Git commit all nested-repo files.

- [x] **Step 1: Run verification**
- [x] **Step 2: Run browser smoke**
- [ ] **Step 3: Commit**
- [ ] **Step 4: Push if possible**
