# Content Flywheel

## Indefinite Goal Prompt

Use this prompt when continuing the long-running project:

```text
Continue Plot Sprout Explorer indefinitely. Generate and review family-friendly creative-writing quest content for reluctant writers ages 7-11. Use subagents for disjoint batches. Commit every verified batch. Update TODO.md after each batch. Use only local RTX 4090 image generation for images. Do not create child accounts, public publishing, or unauthenticated mutation endpoints.
```

## Batch Roles

- `World workers`: 10 worlds each, one age band, unique premise, no duplicate genre beats.
- `Prompt workers`: 3 prompts per world: opening, twist, ending choice.
- `Kit workers`: printable kit outline, parent note, classroom extension, paid-pack angle.
- `Safety reviewers`: reject scary harm, bullying, romance, weapons, real child profiles, branded characters, and manipulative monetization.
- `Image workers`: create SDXL/FLUX prompt sidecars and generate images locally on the RTX 4090.

## Content Schema

```json
{
  "slug": "moon-muffin-market",
  "title": "Moon Muffin Market",
  "ageBand": "6-8",
  "premise": "A tiny night market opens whenever the moon smells cinnamon.",
  "prompts": ["..."],
  "heroChoices": ["..."],
  "settingDetails": ["..."],
  "conflict": "...",
  "safety": "No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.",
  "productAngle": "$9 printable pack: story map, hero cards, ending cards, parent guide.",
  "image": "/images/plotsprout/moon-muffin-market.jpg"
}
```

## Weekly Batch Loop

1. Pick one SEO lane: `creative writing prompts for kids`, `story writing worksheets`, `reluctant writer activities`, or `homeschool writing prompts`.
2. Spawn 3-5 subagents with disjoint world/prompt ownership.
3. Main agent creates or updates schema files and tests.
4. Review with one safety pass and one product-quality pass.
5. Generate top images locally with `npm run image:starter -- --only <slug>`.
6. Run `npm run verify`.
7. Commit. Push if a remote exists.
8. Update `TODO.md` and memory with the batch count, image count, verification, and billable-service state.

## Monetization Ladder

- Free: one generated quest on the workbench.
- $9: printable pack for one theme.
- $29: seasonal homeschool bundle.
- $79: classroom license bundle.
- Later: subscription vault after parent auth, privacy policy, and payment provider are ready.
