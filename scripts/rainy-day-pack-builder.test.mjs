import { describe, expect, it } from 'vitest'
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildArtifactManifest, renderRainyDayPackHtml } from './rainy-day-pack-builder.mjs'

const source = {
  productSlug: 'rainy-day-story-quest-pack',
  title: 'Rainy Day Story Quest Pack',
  pricePoint: '$9',
  audience: 'Parents, homeschool families, tutors, and elementary teachers working with reluctant writers ages 7-11.',
  sessionLength: '35-45 minutes',
  safetyNote: 'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.',
  worldSlugs: ['teacup-town-weather-window'],
  cover: {
    kicker: 'Rainy day writing kit',
    headline: 'Four tiny weather errands for one finished story',
    subhead: 'A printable pack for one quiet afternoon.',
    included: ['Route map', 'Forecast cards', 'Reflection page', 'Dialogue sheet', 'Sentence builder', 'Ending cards', 'Adult guide'],
  },
  adultGuide: {
    setup: ['Print pages.', 'Pick a world.', 'Set out a pencil.', 'Read aloud.'],
    sessionFlow: [{ minutes: '5', title: 'Choose', instruction: 'Circle one route.' }],
    supportMoves: ['Point first.', 'Offer two choices.', 'Read one sentence.', 'Pause often.', 'Stop early.'],
    extensionIdeas: ['Add a cover.', 'Read aloud.', 'Add a weather note.', 'Write a new errand.'],
  },
  pages: [
    {
      id: 'route-map',
      title: 'Route Map',
      worldSlug: 'teacup-town-weather-window',
      type: 'map',
      kidDirection: 'Draw one path through the rainy-day world.',
      adultNote: 'Let pointing count as planning.',
      sections: [{ heading: 'Path', lines: ['First stop: ____________________________'] }],
    },
    {
      id: 'final-story',
      title: 'Final Story',
      worldSlug: 'overview',
      type: 'worksheet',
      kidDirection: 'Use your notes to write the short story.',
      adultNote: 'Write for the child only if dictation keeps momentum.',
      sections: [{ heading: 'Story', lines: ['Beginning: ____________________________'] }],
    },
  ],
}

const worlds = new Map([
  [
    'teacup-town-weather-window',
    {
      title: 'Teacup Town Weather Window',
      ageBand: '7-8',
      premise: 'Inside a blue teacup, a tiny town checks the weather through a spoon-shaped window.',
    },
  ],
])

describe('Rainy Day pack builder', () => {
  it('renders printable source HTML with one page section per pack page and no checkout copy', () => {
    const html = renderRainyDayPackHtml(source, worlds, new Map([['teacup-town-weather-window', 'assets/teacup-town-weather-window.jpg']]))

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Rainy Day Story Quest Pack')
    expect(html.match(/class="[^"]*pack-page/g)).toHaveLength(source.pages.length + 2)
    expect(html).toContain('assets/teacup-town-weather-window.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad/i)
  })

  it('builds a manifest with artifact paths, hashes, and source page count', () => {
    const manifest = buildArtifactManifest(source, {
      pdf: { path: 'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf', sha256: 'a'.repeat(64), size: 1200 },
      zip: { path: 'product-build/rainy-day-story-quest-pack/rainy-day-story-quest-pack.zip', sha256: 'b'.repeat(64), size: 2400 },
      sourceHtml: { path: 'product-build/rainy-day-story-quest-pack/source/rainy-day-story-quest-pack.html', sha256: 'c'.repeat(64), size: 3600 },
    })

    expect(manifest.productSlug).toBe('rainy-day-story-quest-pack')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(2)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
    expect(manifest.fulfillmentNote).toContain('provider-upload-ready')
  })

  it('keeps every committed pack page within one printable sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const packSource = JSON.parse(
      readFileSync(resolve(root, 'content', 'product-artifacts', 'rainy-day-story-quest-pack.json'), 'utf8'),
    )
    const allWorlds = new Map()
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(packSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderRainyDayPackHtml(packSource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-pack-layout-'))
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
