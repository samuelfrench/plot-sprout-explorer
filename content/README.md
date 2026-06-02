# Plot Sprout Content

Content batches are repo files, not public mutation endpoints.

## Batch 1 Shape

- `content/worlds/batch1-*.json`: 30 generated worlds total, split across lower, middle, and upper lanes.
- `content/printable-kits/batch1-*-kits.json`: 10 printable kit outlines total.
- `npm run verify:content`: validates counts, schema, unique slugs, safety text, image-prompt negatives, kit references, and price points.

## Generation Rules

- Use subagents with disjoint file ownership.
- Keep content family-friendly and practical for parents, homeschool families, and teachers.
- Store image prompts as text first; generate production images locally on the RTX 4090 in later image batches.
- Do not add scheduled GitHub Actions or public content-writing endpoints.
