import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  buildWaitingRoomPack,
  loadWaitingRoomBuildInputs,
  renderWaitingRoomPackHtml,
} from './waiting-room-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function quest(index, worldSlug, ageBand) {
  return {
    id: `quiet-quest-${index}`,
    title: `Quiet Quest ${index}`,
    worldSlug,
    ageBand,
    waitingUse: 'Quiet seated writing with one page and one pencil.',
    setupMinutes: '4 minutes',
    waitingMode: 'Appointment lobby',
    kidDirection: 'Choose one quiet detail and write one sentence for the folder.',
    adultNote: 'Read choices softly and let children point before writing.',
    materials: ['printed page', 'pencil', 'folder', 'clipboard'],
    pageSections: ['Notice', 'Choose', 'Finish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    takeHomeLine: 'Save this page in the waiting folder as a finished quiet quest.',
  }
}

const source = {
  batchId: '2026-06-02-batch13',
  generatedAt: '2026-06-02',
  productSlug: 'waiting-room-story-quest-pack',
  title: 'Waiting Room Story Quest Pack',
  pricePoint: '$11',
  audience: 'Parents, grandparents, and homeschool families planning quiet adult-guided writing for ages 7-11.',
  sessionLength: '8 printable quiet waiting quests plus adult setup tools',
  safetyNote: safety,
  worldSlugs: ['pocket-park-notice-board', 'margin-note-market'],
  cover: {
    kicker: 'Printable waiting-room writing kit',
    headline: 'Waiting Room Story Quest Pack',
    subhead: 'Eight quiet quests for restaurant tables, appointment lobbies, sibling activities, and pickup lines.',
    included: [
      '8 quiet quest pages',
      'Adult setup guide',
      'Before-you-wait checklist',
      'Restaurant table routine',
      'Lobby routine',
      'Sibling activity routine',
      'Pickup-line routine',
      'Group share cards',
      'Source HTML',
      'Local image assets',
    ],
  },
  setupGuide: {
    beforeYouWait: ['Print packets.', 'Clip pages.', 'Pack pencils.', 'Choose first quest.', 'Store finished pages.'],
    restaurantTable: ['Pick one page.', 'Keep voices low.', 'Circle first.', 'Write one line.', 'Folder the page.'],
    appointmentLobby: ['Use a clipboard.', 'Read choices softly.', 'Skip hard lines.', 'Mark one detail.', 'Close the folder.'],
    siblingEvent: ['Choose a page.', 'Trade a pencil.', 'Set a timer.', 'Write quietly.', 'Share later.'],
    pickupLine: ['Keep page ready.', 'Circle a detail.', 'Write one line.', 'Save the page.'],
  },
  waitingRoutines: Array.from({ length: 5 }, (_, index) => ({
    name: `Routine ${index + 1}`,
    bestFor: 'Quiet table or lobby wait.',
    steps: ['Set page.', 'Pick card.', 'Write line.', 'Folder page.'],
  })),
  extensionActivities: Array.from({ length: 8 }, (_, index) => ({
    title: `Extension ${index + 1}`,
    time: '8 minutes',
    direction: 'Add one concrete detail to the quiet quest page.',
    writingSkill: 'setting detail',
  })),
  groupShareCards: ['Read one line.', 'Point to a detail.', 'Name a helper.', 'Pick a card.', 'Add one color.', 'Pass and listen.'],
  quests: Array.from({ length: 8 }, (_, index) =>
    quest(index + 1, index % 2 === 0 ? 'pocket-park-notice-board' : 'margin-note-market', index % 2 === 0 ? '7-9' : '10-11'),
  ),
}

const worlds = new Map([
  [
    'pocket-park-notice-board',
    {
      title: 'Pocket Park Notice Board',
      ageBand: '7-9',
      premise: 'A tiny park board posts helpful notes that turn errands into stories.',
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

describe('Waiting Room Story Quest Pack builder', () => {
  it('loads committed waiting room source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source: committedSource, product, worlds: committedWorlds, imageMap } = loadWaitingRoomBuildInputs()

    expect(committedSource.productSlug).toBe('waiting-room-story-quest-pack')
    expect(committedSource.quests).toHaveLength(8)
    expect(product.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(committedSource.worldSlugs.length)
    for (const slug of committedSource.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-waiting-room-build-'))
    const buildDir = join(tempDir, 'waiting-room-story-quest-pack')
    try {
      const { manifest } = await buildWaitingRoomPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(12))
        },
      })

      expect(manifest.productSlug).toBe('waiting-room-story-quest-pack')
      expect(manifest.sourcePageCount).toBe(8)
      expect(manifest.files.assets.length).toBeGreaterThanOrEqual(6)
      expect(existsSync(join(buildDir, 'source', 'waiting-room-story-quest-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'waiting-room-story-quest-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'waiting-room-story-quest-pack.html'), 'utf8').match(/class="[^"]*quest-page/g)).toHaveLength(8)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('renders printable waiting room pack source HTML with quiet tools, quest pages, local images, and no checkout copy', () => {
    const html = renderWaitingRoomPackHtml(
      source,
      worlds,
      new Map([
        ['pocket-park-notice-board', 'assets/pocket-park-notice-board.jpg'],
        ['margin-note-market', 'assets/margin-note-market.jpg'],
      ]),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Waiting Room Story Quest Pack')
    expect(html).toContain('Run the quiet waiting pack')
    expect(html).toContain('Group share cards')
    expect(html.match(/class="[^"]*quest-page/g)).toHaveLength(8)
    expect(html).toContain('assets/pocket-park-notice-board.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad/i)
  })

  it('builds a reusable product artifact manifest for the waiting room pack', () => {
    const manifest = buildProductArtifactManifest(source, {
      pdf: {
        path: 'product-build/waiting-room-story-quest-pack/Waiting-Room-Story-Quest-Pack.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/waiting-room-story-quest-pack/waiting-room-story-quest-pack.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/waiting-room-story-quest-pack/source/waiting-room-story-quest-pack.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('waiting-room-story-quest-pack')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(8)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed waiting room pack printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'waiting-room-story-quest-pack.json')
    expect(existsSync(sourcePath)).toBe(true)
    const waitingSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) {
      allWorlds.set(world.slug, world)
    }
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(waitingSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderWaitingRoomPackHtml(waitingSource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-waiting-room-layout-'))
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
