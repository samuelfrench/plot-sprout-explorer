import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  buildBirthdayPartyKit,
  loadBirthdayPartyBuildInputs,
  renderBirthdayPartyKitHtml,
} from './birthday-party-kit-builder.mjs'
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
    id: `party-quest-${index}`,
    title: `Party Quest ${index}`,
    worldSlug,
    ageBand: '8-10',
    partyUse: 'Small-table birthday writing station with a visible finish line.',
    setupMinutes: '5 minutes',
    groupMode: 'small table',
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
    takeHomeLine: 'Take this page home as a finished party quest start.',
  }
}

const source = {
  batchId: '2026-06-02-batch10',
  generatedAt: '2026-06-02',
  productSlug: 'birthday-party-story-quest-kit',
  title: 'Birthday Party Story Quest Kit',
  pricePoint: '$19',
  audience: 'Parents and teachers hosting adult-led story tables for ages 7-11.',
  sessionLength: '8 printable party quests plus adult setup tools',
  safetyNote: safety,
  worldSlugs: ['seed-library-map-room', 'greenhouse-gear-garden'],
  cover: {
    kicker: 'Printable party writing kit',
    headline: 'Birthday Party Story Quest Kit',
    subhead: 'Eight quick quests for party tables, co-op celebrations, and classroom treats.',
    included: [
      '8 party quest pages',
      'Adult setup guide',
      'Timing menu',
      'Table setup list',
      'Group share cards',
      'Extension activity menu',
      'Take-home folder steps',
      'World menu',
      'Source HTML',
      'Local image assets',
    ],
  },
  setupGuide: {
    timing: ['Start.', 'Launch.', 'Draft.', 'Decorate.', 'Share.'],
    tableSetup: ['Folders.', 'Pencils.', 'Cards.', 'Timer.', 'Separate snack surface.'],
    adultScript: ['Safety.', 'Point first.', 'One place.', 'Two choices.', 'Optional share.'],
    takeHomePrep: ['Print packets.', 'Fold covers.', 'Add note.', 'Pack cards.'],
  },
  partyRoutines: Array.from({ length: 5 }, (_, index) => ({
    name: `Routine ${index + 1}`,
    bestFor: 'Birthday table.',
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

describe('Birthday Party Story Quest Kit builder', () => {
  it('loads committed birthday source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source: committedSource, product, worlds: committedWorlds, imageMap } = loadBirthdayPartyBuildInputs()

    expect(committedSource.productSlug).toBe('birthday-party-story-quest-kit')
    expect(committedSource.quests).toHaveLength(8)
    expect(product.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(committedSource.worldSlugs.length)
    for (const slug of committedSource.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-birthday-build-'))
    const buildDir = join(tempDir, 'birthday-party-story-quest-kit')
    try {
      const { manifest } = await buildBirthdayPartyKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(12))
        },
      })

      expect(manifest.productSlug).toBe('birthday-party-story-quest-kit')
      expect(manifest.sourcePageCount).toBe(8)
      expect(manifest.files.assets.length).toBeGreaterThanOrEqual(6)
      expect(existsSync(join(buildDir, 'source', 'birthday-party-story-quest-kit.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'birthday-party-story-quest-kit.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'birthday-party-story-quest-kit.html'), 'utf8').match(/class="[^"]*quest-page/g)).toHaveLength(8)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('renders printable birthday kit source HTML with party tools, quest pages, local images, and no checkout copy', () => {
    const html = renderBirthdayPartyKitHtml(
      source,
      worlds,
      new Map([
        ['seed-library-map-room', 'assets/seed-library-map-room.jpg'],
        ['greenhouse-gear-garden', 'assets/greenhouse-gear-garden.jpg'],
      ]),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Birthday Party Story Quest Kit')
    expect(html).toContain('Run the party table')
    expect(html).toContain('Group share cards')
    expect(html.match(/class="[^"]*quest-page/g)).toHaveLength(8)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad/i)
  })

  it('builds a reusable product artifact manifest for the birthday kit', () => {
    const manifest = buildProductArtifactManifest(source, {
      pdf: {
        path: 'product-build/birthday-party-story-quest-kit/Birthday-Party-Story-Quest-Kit.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/birthday-party-story-quest-kit/birthday-party-story-quest-kit.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/birthday-party-story-quest-kit/source/birthday-party-story-quest-kit.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('birthday-party-story-quest-kit')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(8)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed birthday kit printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'birthday-party-story-quest-kit.json')
    expect(existsSync(sourcePath)).toBe(true)
    const birthdaySource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) {
      allWorlds.set(world.slug, world)
    }
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(birthdaySource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderBirthdayPartyKitHtml(birthdaySource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-birthday-layout-'))
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
