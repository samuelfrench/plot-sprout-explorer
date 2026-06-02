import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  buildLibraryStoryClubKit,
  loadLibraryStoryClubBuildInputs,
  renderLibraryStoryClubKitHtml,
} from './library-story-club-kit-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function session(index, worldSlug, ageBand) {
  return {
    id: `library-session-${index}`,
    title: `Library Session ${index}`,
    worldSlug,
    ageBand,
    clubUse: 'Adult-led printable writing club table for a library, homeschool co-op, tutoring group, or classroom.',
    setupMinutes: '6 minutes',
    groupMode: 'Small group table',
    kidDirection: 'Choose one invented setting detail and write one short club sentence.',
    facilitatorNote: 'Keep pages offline and let pointing or drawing count as planning.',
    materials: ['printed page', 'pencil', 'folder', 'choice cards'],
    pageSections: ['Gather', 'Choose', 'Finish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    takeHomeLine: 'Save this club page in the folder and finish one blank at home.',
  }
}

const source = {
  batchId: '2026-06-02-batch14',
  generatedAt: '2026-06-02',
  productSlug: 'library-story-club-kit',
  title: 'Library Story Club Kit',
  pricePoint: '$23',
  audience: "Children's librarians, homeschool co-op leaders, tutors, and elementary teachers running adult-led writing clubs for ages 7-11.",
  sessionLength: '10 printable club sessions plus adult facilitation tools',
  safetyNote: safety,
  worldSlugs: ['buttonwood-library-train', 'margin-note-market'],
  cover: {
    kicker: 'Printable library writing club kit',
    headline: 'Library Story Club Kit',
    subhead: 'Ten adult-led story club sessions for library tables, co-ops, tutoring groups, and classrooms.',
    included: [
      '10 club session pages',
      'Facilitator setup guide',
      'Group norms',
      'Materials checklist',
      'Timing menu',
      'Take-home routine',
      'Club routines',
      'Extension activities',
      'Share prompts',
      'Local image assets',
    ],
  },
  facilitatorGuide: {
    setup: ['Print pages.', 'Choose first session.', 'Set out pencils.', 'Keep folders private.', 'Explain optional sharing.'],
    groupNorms: ['Use quiet voices.', 'Share invented details.', 'Pass when needed.', 'Listen kindly.', 'Folder pages.'],
    materials: ['Printed session pages.', 'Pencils.', 'Folders.', 'Choice cards.', 'Timer.'],
    timing: ['Choose detail.', 'Plan line.', 'Draft sentence.', 'Revise word.', 'Save page.'],
    takeHome: ['Folder unfinished pages.', 'Mark one blank.', 'Send one finish prompt.', 'Skip online sharing.'],
  },
  clubRoutines: Array.from({ length: 5 }, (_, index) => ({
    name: `Routine ${index + 1}`,
    bestFor: 'Adult-led story club table.',
    steps: ['Set one page.', 'Pick one detail.', 'Write one line.', 'Save the folder.'],
  })),
  extensionActivities: Array.from({ length: 8 }, (_, index) => ({
    title: `Extension ${index + 1}`,
    time: '10 minutes',
    direction: 'Add one concrete detail to the club session draft.',
    writingSkill: 'setting detail',
  })),
  sharePrompts: ['Read one invented line.', 'Point to a detail.', 'Name a helper.', 'Share one revised word.', 'Pass and listen.', 'Choose one take-home blank.'],
  sessions: Array.from({ length: 10 }, (_, index) =>
    session(index + 1, index % 2 === 0 ? 'buttonwood-library-train' : 'margin-note-market', index % 2 === 0 ? '7-9' : '10-11'),
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

describe('Library Story Club Kit builder', () => {
  it('loads committed library club source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source: committedSource, product, worlds: committedWorlds, imageMap } = loadLibraryStoryClubBuildInputs()

    expect(committedSource.productSlug).toBe('library-story-club-kit')
    expect(committedSource.sessions).toHaveLength(10)
    expect(product.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(committedSource.worldSlugs.length)
    for (const slug of committedSource.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-library-club-build-'))
    const buildDir = join(tempDir, 'library-story-club-kit')
    try {
      const { manifest } = await buildLibraryStoryClubKit({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(14))
        },
      })

      expect(manifest.productSlug).toBe('library-story-club-kit')
      expect(manifest.sourcePageCount).toBe(10)
      expect(manifest.files.assets.length).toBe(10)
      expect(existsSync(join(buildDir, 'source', 'library-story-club-kit.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'library-story-club-kit.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'library-story-club-kit.html'), 'utf8').match(/class="[^"]*session-page/g)).toHaveLength(10)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('renders printable library club source HTML with facilitator tools, session pages, local images, and no checkout copy', () => {
    const html = renderLibraryStoryClubKitHtml(
      source,
      worlds,
      new Map([
        ['buttonwood-library-train', 'assets/buttonwood-library-train.jpg'],
        ['margin-note-market', 'assets/margin-note-market.jpg'],
      ]),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Library Story Club Kit')
    expect(html).toContain('Run the story club')
    expect(html).toContain('Optional share prompts')
    expect(html.match(/class="[^"]*session-page/g)).toHaveLength(10)
    expect(html).toContain('assets/buttonwood-library-train.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing/i)
  })

  it('builds a reusable product artifact manifest for the library club kit', () => {
    const manifest = buildProductArtifactManifest(source, {
      pdf: {
        path: 'product-build/library-story-club-kit/Library-Story-Club-Kit.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/library-story-club-kit/library-story-club-kit.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/library-story-club-kit/source/library-story-club-kit.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('library-story-club-kit')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(10)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed library club printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'library-story-club-kit.json')
    expect(existsSync(sourcePath)).toBe(true)
    const librarySource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) {
      allWorlds.set(world.slug, world)
    }
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(librarySource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderLibraryStoryClubKitHtml(librarySource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-library-club-layout-'))
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
