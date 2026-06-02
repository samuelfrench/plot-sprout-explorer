# Batch 23 Nature Walk Story Field Notes Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `$33` Nature Walk Story Field Notes Kit as a checkout-pending printable product for families, homeschool groups, tutors, co-ops, and library tables that turn safe outdoor observations into short fiction.

**Architecture:** Batch 23 follows the mature static product-artifact pattern from Batches 19-22. Four gpt-5.5/xhigh lanes create field-note/tool source JSON, then the canonical source feeds a static product record, homepage product link, validation policy, PDF/source/ZIP builder, manifest checks, local RTX 4090 product image, and deploy verification. Checkout remains mailto-only until Sam chooses a hosted provider.

**Tech Stack:** Vite, React, TypeScript, Vitest, Playwright PDF generation/smoke tests, local SDXL image generation on the RTX 4090, static GitHub Pages deploy through the self-hosted runner.

---

## Tasks

- [ ] Create four lane JSON files under `content/product-artifacts/lanes/`:
  - `batch23-nature-field-notes-a.json`
  - `batch23-nature-field-notes-b.json`
  - `batch23-nature-field-notes-c.json`
  - `batch23-nature-tools.json`
- [ ] Create `content/product-artifacts/nature-walk-story-field-notes-kit.json` with 12 printable field notes, adult guide tools, 6 walk formats, 10 take-home field cards, and 8 optional share prompts.
- [ ] Add failing Vitest coverage for the Batch 23 source validator, source-file reproducibility, builder entry point, manifest page count, no checkout copy, no unsafe outdoor language, and loaded-image print-page overflow.
- [ ] Implement product-artifact policy wiring, source-file checks, artifact path checks, and content-batch validation for Batch 23.
- [ ] Add product record, homepage product link, README script entries, image manifest, package scripts, and static rendered page integration.
- [ ] Generate the local RTX 4090 product image only through `scripts/generate_story_images_local.py`; inspect and reject pseudo-text, people, devices, maps, route/location cues, animal-contact cues, or unsafe outdoor cues.
- [ ] Build PDF/source/ZIP/manifest artifacts under `product-build/nature-walk-story-field-notes-kit/`.
- [ ] Run focused checks, `npm run verify`, desktop/mobile local Playwright smoke, spec/quality review, commit, push, local-runner deploy, live smoke, TODO closeout, and memory update.

## Product Scope

- Product slug: `nature-walk-story-field-notes-kit`
- Price point: `$33`
- Batch id: `2026-06-02-batch23`
- Product image batch id: `2026-06-02-batch23-product-images`
- Field notes: 12 pages across existing local-image worlds
- PDF shape: cover page, adult guide page, world menu page, walk-format page, take-home-card page, and 12 field-note pages
- Checkout state: `checkout_pending` only

## Safety Gates

- No accounts, uploads, public publishing, public download links, checkout URLs, or custom checkout/webhook endpoints.
- No real child profiles, rosters, personal records, grades, scores, contests, prizes, timer pressure, medical/legal/therapy/grief processing, politics, religion, romance, weapons, violence, gambling, branded characters, or ads targeted to children.
- No outdoor-risk drift: no GPS, coordinates, exact locations, addresses, route tracking, street crossing, running, jumping, climbing, water entry, animal contact, feeding animals, foraging, tasting plants, weather-risk instructions, or directions that override adult/site rules.
- Every printable response line must include visible human-readable blanks.
