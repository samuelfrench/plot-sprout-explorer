# Plot Sprout Explorer Design

## Decision

Build a new explorer app named **Plot Sprout Explorer**. The initial `StoryQuest` direction was rejected because a live `StoryQuest Creator` kids story app already exists. Plot Sprout Explorer is a family-safe creative-writing quest catalog that can scale through Codex/subagent text generation and local RTX 4090 image generation.

## Audience

- Parents of reluctant writers ages 7-11.
- Homeschool families who buy printable writing packs.
- Elementary teachers who need low-prep prompts and extension activities.

## Wedge

The first monetizable wedge is **printable story quest kits**. Each kit has a whimsical world, hero cards, writing prompts, a parent/teacher guide, optional illustration, and a finished-story page. This avoids child accounts, public publishing, and heavy privacy risk while still giving a concrete paid product.

## Product Surface

The first screen is the usable quest workbench:

- Pick an age band.
- Pick a world.
- Build tonight's quest.
- Show four guided writing steps.
- Show the premium printable angle.
- Show the Codex content flywheel and local GPU image lane.

## Content Model

Each world has:

- `slug`
- `title`
- `ageBand`
- `premise`
- `prompts`
- `heroChoices`
- `settingDetails`
- `conflict`
- `safety`
- `productAngle`
- `image`

Generated content batches must include prompt sidecars and safety notes. The default safety rule is: no scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.

## Automation Strategy

Use Codex indefinite goals and subagents for massive generation:

- Market/content lead: choose batch topic and SEO lane.
- World workers: generate disjoint world sets.
- Prompt workers: generate age-banded writing prompts.
- Review workers: check family safety, duplicate concepts, tone, and monetization fit.
- GPU worker: generate and validate images locally with SDXL/FLUX on the RTX 4090.

Content lands as repo files, not remote database mutations. Static generation comes first.

## Image Strategy

All production images are local. Preferred first stack:

- SDXL base or Juggernaut XL through diffusers.
- 1344x768 or larger.
- 30+ steps for SDXL.
- JPEG quality 90+ plus prompt JSON sidecars.

Cloud image services are out of scope unless Sam explicitly approves them.

## Monetization

Start with digital goods before SaaS:

- $9 printable quest packs.
- $29 seasonal homeschool bundles.
- $79 classroom license bundles.
- Later: parent email list, subscription vault, book-printing upsell.

No ads targeted to kids. If ads are added later, they should be parent/teacher-facing pages only.

## Testing

First slice requires:

- Vitest data and rendering tests.
- `npm run lint`
- `npm run test`
- `npm run build`
- Local browser smoke with Playwright and console check.

## Non-Goals

- No child accounts.
- No public story publishing.
- No real-time multiplayer.
- No public content mutation endpoints.
- No cloud image generation.
