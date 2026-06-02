import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'
import {
  buildTutoringCenterSprintPack,
  loadTutoringCenterSprintBuildInputs,
  renderTutoringCenterSprintPackHtml,
} from './tutoring-center-sprint-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function sprint(index, worldSlug, ageBand) {
  return {
    id: `tutoring-sprint-${index}`,
    title: `Tutoring Sprint ${index}`,
    worldSlug,
    ageBand,
    sprintSkill: 'setting detail',
    sessionFit: '10-minute tutoring warmup for a small table.',
    tutorSetup: 'Print one sprint page, set out pencils, and choose one world card.',
    kidDirection: 'Pick one tiny detail, write one short line, and circle one keeper word.',
    coachingPrompt: 'Ask for one concrete place detail before asking for a sentence.',
    pageSections: ['Plan', 'Draft', 'Polish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    wrapUpLine: 'One line I can keep: ____________________________',
    extensionLine: 'At home I can add: ____________________________',
  }
}

const source = {
  batchId: '2026-06-02-batch16',
  generatedAt: '2026-06-02',
  productSlug: 'tutoring-center-story-sprint-pack',
  title: 'Tutoring Center Story Sprint Pack',
  pricePoint: '$49',
  audience: 'Literacy tutors, tutoring centers, after-school programs, and homeschool co-op tutors for ages 7-11.',
  sessionLength: '20 printable 10-minute story sprints plus tutor setup tools',
  safetyNote: safety,
  worldSlugs: ['buttonwood-library-train', 'margin-note-market'],
  cover: {
    kicker: 'Printable tutoring writing sprint pack',
    headline: 'Tutoring Center Story Sprint Pack',
    subhead: 'Twenty 10-minute writing sprints for tutoring centers, small groups, and after-school tables.',
    included: [
      '20 sprint pages',
      'Before-session prep',
      'Tutor setup checklist',
      'During-sprint coaching notes',
      'Wrap-up routine',
      'No-data use notes',
      'Sprint routines',
      'Take-home slips',
      'Share prompts',
      'Local image assets',
    ],
  },
  tutorGuide: {
    beforeSession: ['Choose pages.', 'Print packets.', 'Clip pencils.', 'Set a timer nearby.', 'Pick one finish slip.'],
    setup: ['Place one page.', 'Set pencil tray.', 'Choose a world.', 'Read the goal.', 'Keep extras in a folder.'],
    duringSprint: ['Ask for detail.', 'Offer two choices.', 'Read one line back.', 'Circle one word.', 'Stop while it feels light.'],
    wrapUp: ['Choose a kept line.', 'Mark next choice.', 'Stack unused pages.', 'Send one slip home.', 'Reset the table.'],
    noDataUse: ['Use color folders.', 'Avoid personal labels.', 'Keep pages offline.', 'Share invented choices only.'],
  },
  sprintRoutines: Array.from({ length: 5 }, (_, index) => ({
    name: `Routine ${index + 1}`,
    bestFor: 'Short tutoring writing block.',
    steps: ['Pick one page.', 'Name one goal.', 'Write one line.', 'Choose one next step.'],
  })),
  takeHomeSlips: Array.from({ length: 8 }, (_, index) => ({
    title: `Take-Home Slip ${index + 1}`,
    time: '5 minutes',
    skill: 'small detail',
    direction: 'Add one detail to the story line: ____________________________',
    familyLine: 'A grown-up can ask about: ____________________________',
  })),
  sharePrompts: ['Point to one invented place.', 'Read one kept line.', 'Name one detail.', 'Share one revised word.', 'Pass and listen.', 'Choose one page to save.'],
  sprints: Array.from({ length: 20 }, (_, index) =>
    sprint(index + 1, index % 2 === 0 ? 'buttonwood-library-train' : 'margin-note-market', index % 2 === 0 ? '7-9' : '10-11'),
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

describe('Tutoring Center Story Sprint Pack builder', () => {
  it('loads committed tutoring sprint source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source: committedSource, product, worlds: committedWorlds, imageMap } = loadTutoringCenterSprintBuildInputs()

    expect(committedSource.productSlug).toBe('tutoring-center-story-sprint-pack')
    expect(committedSource.sprints).toHaveLength(20)
    expect(product.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(committedSource.worldSlugs.length)
    for (const slug of committedSource.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
    for (const slug of new Set(committedSource.sprints.map((sprint) => sprint.worldSlug))) {
      expect(committedSource.worldSlugs).toContain(slug)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-tutoring-build-'))
    const buildDir = join(tempDir, 'tutoring-center-story-sprint-pack')
    try {
      const { manifest } = await buildTutoringCenterSprintPack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(24))
        },
      })

      expect(manifest.productSlug).toBe('tutoring-center-story-sprint-pack')
      expect(manifest.sourcePageCount).toBe(20)
      expect(manifest.files.assets.length).toBe(20)
      expect(existsSync(join(buildDir, 'source', 'tutoring-center-story-sprint-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'tutoring-center-story-sprint-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'tutoring-center-story-sprint-pack.html'), 'utf8').match(/class="[^"]*sprint-page/g)).toHaveLength(20)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable tutoring sprint source HTML with tutor tools, sprint pages, local images, and no checkout copy', () => {
    const html = renderTutoringCenterSprintPackHtml(
      source,
      worlds,
      new Map([
        ['buttonwood-library-train', 'assets/buttonwood-library-train.jpg'],
        ['margin-note-market', 'assets/margin-note-market.jpg'],
      ]),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Tutoring Center Story Sprint Pack')
    expect(html).toContain('Run the tutoring sprints')
    expect(html).toContain('Take-home micro-practice slips')
    expect(html.match(/class="[^"]*sprint-page/g)).toHaveLength(20)
    expect(html).toContain('assets/buttonwood-library-train.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|upload|public publishing/i)
  })

  it('builds a reusable product artifact manifest for the tutoring sprint pack', () => {
    const manifest = buildProductArtifactManifest(source, {
      pdf: {
        path: 'product-build/tutoring-center-story-sprint-pack/Tutoring-Center-Story-Sprint-Pack.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/tutoring-center-story-sprint-pack/tutoring-center-story-sprint-pack.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/tutoring-center-story-sprint-pack/source/tutoring-center-story-sprint-pack.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('tutoring-center-story-sprint-pack')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(20)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed tutoring sprint printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'tutoring-center-story-sprint-pack.json')
    expect(existsSync(sourcePath)).toBe(true)
    const tutoringSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) {
      allWorlds.set(world.slug, world)
    }
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(tutoringSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderTutoringCenterSprintPackHtml(tutoringSource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-tutoring-layout-'))
    const htmlPath = join(tempDir, 'kit.html')
    writeFileSync(htmlPath, html)

    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage({ viewport: { width: 816, height: 1056 } })
      await page.goto(pathToFileURL(htmlPath).href)
      const overflows = await page.$$eval('.pack-page', (pages) =>
        pages
          .map((packPage, index) => ({
            index,
            scrollHeight: packPage.scrollHeight,
            clientHeight: packPage.clientHeight,
          }))
          .filter((item) => item.scrollHeight > item.clientHeight + 4),
      )
      expect(overflows).toEqual([])
    } finally {
      await browser.close()
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)
})
