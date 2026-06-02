import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  buildRoadTripKit,
  loadRoadTripBuildInputs,
  renderRoadTripKitHtml,
} from './road-trip-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function quest(index, worldSlug) {
  return {
    id: `travel-quest-${index}`,
    title: `Travel Quest ${index}`,
    worldSlug,
    ageBand: '8-10',
    travelUse: 'Rest stop table writing station with a visible finish line.',
    setupMinutes: '5 minutes',
    travelMode: 'Rest stop table',
    kidDirection: 'Choose one place detail and write one sentence for the take-home page.',
    adultNote: 'Read choices aloud and let children point before writing.',
    materials: ['printed page', 'pencils', 'crayons', 'timer'],
    pageSections: ['Place', 'Helper', 'Ending'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    takeHomeLine: 'Save this page in the trip folder as a finished quest start.',
  }
}

const source = {
  batchId: '2026-06-02-batch11',
  generatedAt: '2026-06-02',
  productSlug: 'road-trip-story-quest-pack',
  title: 'Road Trip Story Quest Pack',
  pricePoint: '$17',
  audience: 'Parents, grandparents, and homeschool families planning adult-guided travel writing for ages 7-11.',
  sessionLength: '8 printable travel quests plus adult setup tools',
  safetyNote: safety,
  worldSlugs: ['seed-library-map-room', 'greenhouse-gear-garden'],
  cover: {
    kicker: 'Printable road trip writing kit',
    headline: 'Road Trip Story Quest Pack',
    subhead: 'Eight quick quests for car passengers, rest stops, hotel desks, and visit days.',
    included: [
      '8 travel quest pages',
      'Adult setup guide',
      'Before-you-go checklist',
      'Rest stop routine list',
      'Group share cards',
      'Extension activity menu',
      'Take-home folder steps',
      'World menu',
      'Source HTML',
      'Local image assets',
    ],
  },
  setupGuide: {
    beforeYouGo: ['Print packets.', 'Clip pages.', 'Pack pencils.', 'Choose first quest.', 'Store finished pages.'],
    inTheCar: ['Hand out one page.', 'Use passenger prompts.', 'Circle before writing.', 'Pause for turns.', 'Save loose pages.'],
    restStopHotel: ['Pick a table.', 'Read choices aloud.', 'Write three lines.', 'Add one color.', 'Pack the folder.'],
    visitDay: ['Choose one share card.', 'Read one line.', 'Invite a listener.', 'Save the page.'],
  },
  travelRoutines: Array.from({ length: 5 }, (_, index) => ({
    name: `Routine ${index + 1}`,
    bestFor: 'Rest stop or hotel table.',
    steps: ['Set page.', 'Pick card.', 'Write line.', 'Folder page.'],
  })),
  extensionActivities: Array.from({ length: 8 }, (_, index) => ({
    title: `Extension ${index + 1}`,
    time: '10 minutes',
    direction: 'Add one concrete detail to the quest page.',
    writingSkill: 'setting detail',
  })),
  groupShareCards: ['Read one line.', 'Show a map.', 'Ask an adult.', 'Name a card.', 'Pick a detail.', 'Pass and listen.'],
  quests: Array.from({ length: 8 }, (_, index) =>
    quest(index + 1, index % 2 === 0 ? 'seed-library-map-room' : 'greenhouse-gear-garden'),
  ),
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
  [
    'greenhouse-gear-garden',
    {
      title: 'Greenhouse Gear Garden',
      ageBand: '8-10',
      premise: 'A greenhouse runs on gentle gears that move watering cans and tiny notebooks.',
    },
  ],
])

describe('Road Trip Story Quest Pack builder', () => {
  it('loads committed road trip source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source: committedSource, product, worlds: committedWorlds, imageMap } = loadRoadTripBuildInputs()

    expect(committedSource.productSlug).toBe('road-trip-story-quest-pack')
    expect(committedSource.quests).toHaveLength(8)
    expect(product.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(committedSource.worldSlugs.length)
    for (const slug of committedSource.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-road-trip-build-'))
    const buildDir = join(tempDir, 'road-trip-story-quest-pack')
    try {
      const { manifest } = await buildRoadTripKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(12))
        },
      })

      expect(manifest.productSlug).toBe('road-trip-story-quest-pack')
      expect(manifest.sourcePageCount).toBe(8)
      expect(manifest.files.assets.length).toBeGreaterThanOrEqual(6)
      expect(existsSync(join(buildDir, 'source', 'road-trip-story-quest-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'road-trip-story-quest-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'road-trip-story-quest-pack.html'), 'utf8').match(/class="[^"]*quest-page/g)).toHaveLength(8)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('renders printable road trip pack source HTML with travel tools, quest pages, local images, and no checkout copy', () => {
    const html = renderRoadTripKitHtml(
      source,
      worlds,
      new Map([
        ['seed-library-map-room', 'assets/seed-library-map-room.jpg'],
        ['greenhouse-gear-garden', 'assets/greenhouse-gear-garden.jpg'],
      ]),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Road Trip Story Quest Pack')
    expect(html).toContain('Run the travel pack')
    expect(html).toContain('Group share cards')
    expect(html.match(/class="[^"]*quest-page/g)).toHaveLength(8)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad/i)
  })

  it('builds a reusable product artifact manifest for the road trip pack', () => {
    const manifest = buildProductArtifactManifest(source, {
      pdf: {
        path: 'product-build/road-trip-story-quest-pack/Road-Trip-Story-Quest-Pack.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/road-trip-story-quest-pack/road-trip-story-quest-pack.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/road-trip-story-quest-pack/source/road-trip-story-quest-pack.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('road-trip-story-quest-pack')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(8)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed road trip pack printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'road-trip-story-quest-pack.json')
    expect(existsSync(sourcePath)).toBe(true)
    const roadTripSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) {
      allWorlds.set(world.slug, world)
    }
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(roadTripSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderRoadTripKitHtml(roadTripSource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-road-trip-layout-'))
    const htmlPath = join(tempDir, 'pack.html')
    writeFileSync(htmlPath, html)

    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 })
      await page.emulateMedia({ media: 'print' })
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' })
      const overflowingPages = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.pack-page'))
          .map((element, index) => ({
            index,
            heading: element.querySelector('h1,h2')?.textContent?.trim(),
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
          }))
          .filter((printPage) => printPage.scrollHeight > printPage.clientHeight + 4),
      )

      expect(overflowingPages).toEqual([])
    } finally {
      await browser.close()
      rmSync(tempDir, { recursive: true, force: true })
    }
  })
})
