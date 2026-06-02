import { describe, expect, it } from 'vitest'
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { renderSeasonBundleHtml } from './homeschool-season-bundle-builder.mjs'

const source = {
  batchId: '2026-06-02-batch8',
  generatedAt: '2026-06-02',
  productSlug: 'homeschool-season-story-bundle',
  title: 'Homeschool Season Story Bundle',
  pricePoint: '$29',
  audience: 'Homeschool families planning a year of short writing sessions.',
  sessionLength: '12 printable quests across four seasons',
  safetyNote: 'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.',
  worldSlugs: ['seed-library-map-room'],
  cover: {
    kicker: 'Printable homeschool writing bundle',
    headline: 'A year of small story quests',
    subhead: 'A seasonal bundle for weekly short-story practice.',
    included: [
      'Quest page',
      'Season planner',
      'Parent guide',
      'Revision checklist',
      'Portfolio cover',
      'Read-aloud reflection',
      'Story bank tracker',
      'Extension menu',
      'Co-op use notes',
      'Materials checklist',
    ],
  },
  adultGuide: {
    setup: ['Print one season.', 'Choose a weekly rhythm.', 'Set out pencils.', 'Save pages in a folder.'],
    seasonPlan: [{ season: 'fall', focus: 'setting and details' }],
    supportMoves: ['Point first.', 'Offer two choices.', 'Read one line.', 'Circle a detail.', 'Stop with a clear ending.'],
    extensionIdeas: ['Make a cover.', 'Read aloud.', 'Pair two quests.', 'Start a portfolio.'],
  },
  pages: [
    {
      id: 'fall-map-room-labels',
      title: 'Fall Map Room Labels',
      worldSlug: 'seed-library-map-room',
      season: 'fall',
      type: 'worksheet',
      kidDirection: 'Choose three seed labels before writing.',
      adultNote: 'Let the child point to labels before turning one into a sentence.',
      sections: [
        { heading: 'Collect', lines: ['Seed label: ____________________________'] },
        { heading: 'Write', lines: ['My first sentence: ____________________________'] },
      ],
    },
  ],
}

const worlds = new Map([
  [
    'seed-library-map-room',
    {
      title: 'Seed Library Map Room',
      ageBand: '8-10',
      premise: 'A map room stores tiny seed envelopes that remember where gardens want to grow.',
    },
  ],
])

describe('Homeschool Season bundle builder', () => {
  it('renders printable source HTML with one page section per bundle page and no checkout copy', () => {
    const html = renderSeasonBundleHtml(source, worlds, new Map([['seed-library-map-room', 'assets/seed-library-map-room.jpg']]))

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Homeschool Season Story Bundle')
    expect(html.match(/class="[^"]*pack-page/g)).toHaveLength(source.pages.length + 2)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad/i)
  })

  it('builds a reusable product artifact manifest for the season bundle', () => {
    const manifest = buildProductArtifactManifest(
      source,
      {
        pdf: {
          path: 'product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf',
          sha256: 'a'.repeat(64),
          size: 1200,
        },
        zip: {
          path: 'product-build/homeschool-season-story-bundle/homeschool-season-story-bundle.zip',
          sha256: 'b'.repeat(64),
          size: 2400,
        },
        sourceHtml: {
          path: 'product-build/homeschool-season-story-bundle/source/homeschool-season-story-bundle.html',
          sha256: 'c'.repeat(64),
          size: 3600,
        },
      },
      {
        fulfillmentNote:
          'provider-upload-ready artifact: PDF plus source HTML and local image assets; checkout still requires Sam provider choice.',
      },
    )

    expect(manifest.productSlug).toBe('homeschool-season-story-bundle')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(1)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
    expect(manifest.fulfillmentNote).toContain('provider-upload-ready')
  })

  it('keeps every committed season bundle page within one printable sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const bundleSource = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'homeschool-season-story-bundle.json'), 'utf8'),
    )
    const allWorlds = new Map()
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(bundleSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderSeasonBundleHtml(bundleSource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-season-layout-'))
    const htmlPath = join(tempDir, 'pack.html')
    writeFileSync(htmlPath, html)

    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 })
      await page.emulateMedia({ media: 'print' })
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' })
      const overflowingPages = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.pack-page'))
          .map((element, index) => {
            return {
              index,
              heading: element.querySelector('h1,h2')?.textContent?.trim(),
              scrollHeight: element.scrollHeight,
              clientHeight: element.clientHeight,
            }
          })
          .filter((page) => page.scrollHeight > page.clientHeight + 4),
      )

      expect(overflowingPages).toEqual([])
    } finally {
      await browser.close()
      rmSync(tempDir, { recursive: true, force: true })
    }
  })
})
