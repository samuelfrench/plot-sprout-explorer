# Plot Sprout Explorer TODO

## Active Goal

Build an indefinite Codex-driven explorer app for family creative writing.

## Current Thesis

Plot Sprout Explorer is a family writing adventure app for reluctant writers ages 7-11: parents or teachers pick a whimsical world, kids write a short story from guided prompts, and the site packages the result as printable quest kits. Monetization starts with paid printable bundles and classroom packs before accounts, subscriptions, or user-generated publishing.

## Completed

- [x] 2026-06-02: Created `/home/sam/claude-workspace/plot-sprout-explorer` as a new Vite/React project.
- [x] 2026-06-02: Set active indefinite Codex goal for this project.
- [x] 2026-06-02: Found exact-name conflict for `StoryQuest` and switched app branding to `Plot Sprout Explorer`.
- [x] 2026-06-02: Added starter RED coverage for quest data, prompt safety, and app rendering.
- [x] 2026-06-02: Built the first usable quest workbench with age bands, world picker, writing loop, Codex content flywheel, local GPU image lane, safety framing, and monetization panels.
- [x] 2026-06-02: Added manual content-batch workflow and generated starter batch files under `content/batches/` and `content/image-queue/`.
- [x] 2026-06-02: Added local SDXL image generator and generated 6 starter 1344x768 JPEG world images on the RTX 4090 with prompt sidecars.
- [x] 2026-06-02: Configured push-triggered GitHub Pages deploy workflow for `self-hosted`, `Linux`, `X64` local runners.
- [x] 2026-06-02: Added workflow policy verifier to reject scheduled/cron/image/content-generation GitHub Actions.
- [x] 2026-06-02: Verified app locally with lint, tests, build, dev server, Playwright interaction checks, mobile overflow check, image render check, and zero browser console errors/warnings.
- [x] 2026-06-02: Created public GitHub repo `samuelfrench/plot-sprout-explorer`, enabled GitHub Pages workflow deploys, and pushed initial app scaffold.
- [x] 2026-06-02: Registered local self-hosted runner `sam-local-plot-sprout-1` with labels `self-hosted`, `Linux`, `X64`, `plot-sprout` via user service `actions-runner-plot-sprout-1.service`.
- [x] 2026-06-02: Fixed first deploy failure root cause: Node 24.16/npm 11.13 required regenerated `package-lock.json` entries for `@emnapi/core` and `@emnapi/runtime`.
- [x] 2026-06-02: Fixed GitHub Pages base-path asset bug; live site now serves HTML, JS, favicon, and local world images from `/plot-sprout-explorer/`.
- [x] 2026-06-02: Removed `setup-node` npm caching after it restored a 5.6GB shared local runner cache; workflow verifier now blocks `cache: npm`.
- [x] 2026-06-02: Final no-cache deploy succeeded on local runner at `2026-06-02T04:35:44Z`; live URL `https://samuelfrench.github.io/plot-sprout-explorer/` returned HTTP 200 for HTML, JS, and generated JPEG assets, and Playwright live smoke found zero console warnings/errors.
- [x] 2026-06-02: Batch 1 content expansion generated 30 age-banded worlds, 90 writing prompts, 30 local GPU image prompts, and 10 printable kit outlines across lower/middle/upper lanes.
- [x] 2026-06-02: Added `npm run verify:content` with schema/count/reference/safety/monetization gates for Batch 1 content.
- [x] 2026-06-02: Batch 1 safety/spec and product-quality subagent reviews approved after fixes for age targeting, duplicate mechanics, and validator coverage.
- [x] 2026-06-02: Batch 2 generated four crawlable SEO collection pages for creative writing prompts, story writing worksheets, reluctant writer activities, and homeschool writing prompts.
- [x] 2026-06-02: Added deterministic static SEO renderer plus content validation for Batch 2 collection JSON and generated pages.

## In Progress

- [ ] Batch 3 homeschool/classroom mini-units with teacher notes and no student-account requirements.

## Next Content Batches

- [x] Batch 1: Generate 30 age-banded worlds, 90 writing prompts, 30 image prompts, and 10 printable kit outlines.
- [x] Batch 2: Generate SEO collection pages for `creative writing prompts for kids`, `story writing worksheets`, `reluctant writer activities`, and `homeschool writing prompts`.
- [ ] Batch 3: Generate 10 homeschool/classroom mini-units with teacher notes and no student-account requirements.
- [ ] Batch 4: Generate 20 local GPU images for top worlds, save JPEG/WebP assets, and record prompt sidecars.

## Product Gates

- [ ] No child accounts before parent/teacher auth and privacy policy exist.
- [ ] No public publishing before moderation and abuse controls exist.
- [ ] No cloud image generation unless Sam explicitly approves paid/cloud use.
- [ ] No generic broad "AI bedtime story app" positioning; keep the wedge to printable family/classroom writing quests.
- [ ] No automated GitHub Actions content-generation workflows; content generation stays manual/subagent-driven from local Codex.

## Monetization Backlog

- [ ] $9 printable "Rainy Day Story Quest Pack" landing page.
- [ ] $29 homeschool season bundle with 12 printable quests.
- [ ] $79 classroom license pack with 30 prompts, rubric, and extension activities.
- [ ] Parent email capture for weekly printable quest drops.
