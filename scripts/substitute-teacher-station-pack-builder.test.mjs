import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  buildSubstituteTeacherStationPack,
  loadSubstituteTeacherStationBuildInputs,
  renderSubstituteTeacherStationPackHtml,
} from './substitute-teacher-station-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function station(index, worldSlug, ageBand) {
  return {
    id: `substitute-station-${index}`,
    title: `Substitute Station ${index}`,
    worldSlug,
    ageBand,
    stationUse: 'Printable substitute-day story station for calm desk work, tutoring, or a co-op table.',
    setupMinutes: '5 minutes',
    stationMode: 'Independent desk',
    kidDirection: 'Choose one invented detail and write one short station sentence.',
    subNote: 'Keep pages offline, collect them in folders, and let pointing or drawing count as planning.',
    materials: ['printed station page', 'pencil', 'folder', 'choice cards'],
    pageSections: ['Gather', 'Choose', 'Finish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    exitTicketLine: 'One useful detail: ____________________________',
  }
}

const source = {
  batchId: '2026-06-02-batch15',
  generatedAt: '2026-06-02',
  productSlug: 'substitute-teacher-story-station-pack',
  title: 'Substitute Teacher Story Station Pack',
  pricePoint: '$39',
  audience: 'Elementary teachers, homeschool co-op leaders, tutors, and substitute folders for ages 7-11.',
  sessionLength: '12 printable substitute stations plus adult setup tools',
  safetyNote: safety,
  worldSlugs: ['buttonwood-library-train', 'margin-note-market'],
  cover: {
    kicker: 'Printable substitute writing station pack',
    headline: 'Substitute Teacher Story Station Pack',
    subhead: 'Twelve calm writing stations for substitute folders, co-op tables, tutoring groups, and early finishers.',
    included: [
      '12 station pages',
      'Before-the-day prep',
      'Morning setup',
      'During-stations notes',
      'End-of-day collection',
      'Handoff routine',
      'Station routines',
      'Early finisher cards',
      'Share prompts',
      'Local image assets',
    ],
  },
  substituteGuide: {
    beforeTheDay: ['Print pages.', 'Choose first stations.', 'Clip pencils.', 'Set folders aside.', 'Leave one note.'],
    morningSetup: ['Place packets.', 'Set pencil tray.', 'Pick first station.', 'Read direction.', 'Folder pages.'],
    duringStations: ['Use quiet voices.', 'Let pointing count.', 'Circle a detail.', 'Folder pages.', 'Offer a finisher card.'],
    endOfDay: ['Stack pages.', 'Clip unfinished work.', 'Return pencils.', 'Save unused stations.', 'Leave a note.'],
    handoff: ['List stations used.', 'Mark pages collected.', 'Name next station.', 'Leave folders on the desk.'],
  },
  stationRoutines: Array.from({ length: 5 }, (_, index) => ({
    name: `Routine ${index + 1}`,
    bestFor: 'Substitute-day story station.',
    steps: ['Set one page.', 'Pick one detail.', 'Write one line.', 'Save the folder.'],
  })),
  earlyFinisherCards: Array.from({ length: 8 }, (_, index) => ({
    title: `Early Finisher ${index + 1}`,
    time: '8 minutes',
    direction: 'Add one concrete detail to the station draft.',
    writingSkill: 'setting detail',
  })),
  sharePrompts: ['Read one invented line.', 'Point to a detail.', 'Name a helper.', 'Share one revised word.', 'Pass and listen.', 'Choose one folder page.'],
  stations: Array.from({ length: 12 }, (_, index) =>
    station(index + 1, index % 2 === 0 ? 'buttonwood-library-train' : 'margin-note-market', index % 2 === 0 ? '7-9' : '10-11'),
  ),
}

const worlds = new Map([
  [
    'buttonwood-library-train',
    {
      title: 'Buttonwood Library Train',
      ageBand: '7-9',
      premise: 'A pocket-sized train circles a library tree and stops at shelves that grow questions.',
    },
  ],
  [
    'margin-note-market',
    {
      title: 'Margin Note Market',
      ageBand: '10-11',
      premise: 'A market of margin notes helps writers trade clearer details.',
    },
  ],
])

describe('Substitute Teacher Story Station Pack builder', () => {
  it('loads committed substitute station source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source: committedSource, product, worlds: committedWorlds, imageMap } = loadSubstituteTeacherStationBuildInputs()

    expect(committedSource.productSlug).toBe('substitute-teacher-story-station-pack')
    expect(committedSource.stations).toHaveLength(12)
    expect(product.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(committedSource.worldSlugs.length)
    for (const slug of committedSource.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-substitute-build-'))
    const buildDir = join(tempDir, 'substitute-teacher-story-station-pack')
    try {
      const { manifest } = await buildSubstituteTeacherStationPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(16))
        },
      })

      expect(manifest.productSlug).toBe('substitute-teacher-story-station-pack')
      expect(manifest.sourcePageCount).toBe(12)
      expect(manifest.files.assets.length).toBe(12)
      expect(existsSync(join(buildDir, 'source', 'substitute-teacher-story-station-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'substitute-teacher-story-station-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'substitute-teacher-story-station-pack.html'), 'utf8').match(/class="[^"]*station-page/g)).toHaveLength(12)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable substitute station source HTML with adult tools, station pages, local images, and no checkout copy', () => {
    const html = renderSubstituteTeacherStationPackHtml(
      source,
      worlds,
      new Map([
        ['buttonwood-library-train', 'assets/buttonwood-library-train.jpg'],
        ['margin-note-market', 'assets/margin-note-market.jpg'],
      ]),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Substitute Teacher Story Station Pack')
    expect(html).toContain('Run the substitute stations')
    expect(html).toContain('Early finisher cards')
    expect(html.match(/class="[^"]*station-page/g)).toHaveLength(12)
    expect(html).toContain('assets/buttonwood-library-train.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing/i)
  })

  it('builds a reusable product artifact manifest for the substitute station pack', () => {
    const manifest = buildProductArtifactManifest(source, {
      pdf: {
        path: 'product-build/substitute-teacher-story-station-pack/Substitute-Teacher-Story-Station-Pack.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/substitute-teacher-story-station-pack/substitute-teacher-story-station-pack.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/substitute-teacher-story-station-pack/source/substitute-teacher-story-station-pack.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('substitute-teacher-story-station-pack')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(12)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed substitute station printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'substitute-teacher-story-station-pack.json')
    expect(existsSync(sourcePath)).toBe(true)
    const substituteSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) {
      allWorlds.set(world.slug, world)
    }
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(substituteSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderSubstituteTeacherStationPackHtml(substituteSource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-substitute-layout-'))
    const htmlPath = join(tempDir, 'kit.html')
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
