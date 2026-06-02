import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const batchId = new Date().toISOString().slice(0, 10)
const root = resolve(import.meta.dirname, '..')
const briefPath = resolve(root, 'content/batches', `${batchId}-starter-quest-batch.md`)
const imageQueuePath = resolve(root, 'content/image-queue', `${batchId}-starter-image-queue.json`)

const batchBrief = `# ${batchId} Starter Quest Batch

## Mission

Generate family-friendly creative-writing quest content for Plot Sprout Explorer.

## Worker Assignments

- Worker A: 10 worlds for ages 6-8.
- Worker B: 10 worlds for ages 8-10.
- Worker C: 10 worlds for ages 10-12.
- Reviewer D: safety, duplicate, and monetization pass.
- GPU worker: image prompt queue and local generation run.

## Rules

- No scary harm, bullying, romance, weapons, branded characters, or real child profiles.
- Every world needs a printable-kit angle.
- Every image prompt must say: no text, no letters, no logos, no watermark.
- Output repo files only. Do not mutate a public endpoint.
- Do not add scheduled or automated content-generation GitHub Actions.
`

const imageQueue = [
  {
    slug: 'moon-muffin-market',
    title: 'Moon Muffin Market',
    prompt:
      'family-friendly Moon Muffin Market scene, tiny moonlit pastry market, cloud carts, lantern strings shaped like commas, warm cinnamon atmosphere, polished storybook illustration for kids, No text, no letters, no logos, no watermark, no scary harm, no weapons',
    width: 1344,
    height: 768,
  },
]

for (const path of [briefPath, imageQueuePath]) {
  mkdirSync(dirname(path), { recursive: true })
}

writeFileSync(briefPath, batchBrief)
writeFileSync(imageQueuePath, `${JSON.stringify(imageQueue, null, 2)}\n`)

console.log(`Wrote ${briefPath}`)
console.log(`Wrote ${imageQueuePath}`)
