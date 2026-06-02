import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  buildClassroomLicensePack,
  loadClassroomLicenseBuildInputs,
  renderClassroomLicenseHtml,
} from './classroom-license-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function promptCard(index, worldSlug) {
  return {
    id: `card-${index}`,
    worldSlug,
    title: `Prompt Card ${index}`,
    skillFocus: 'setting detail',
    teacherSetup: 'Place this card at a writing station and read the choices aloud.',
    studentPrompt: 'Choose one tiny place detail and one useful choice before you draft.',
    choiceSet: ['map clue', 'quiet helper', 'clear ending'],
    writingLines: [
      'Place detail: ____________________________',
      'Character choice: ____________________________',
      'Problem step: ____________________________',
      'Ending sentence: ____________________________',
    ],
    shareMove: 'Read only the sentence with the strongest place detail.',
    extension: 'Revise the sentence by adding one clearer verb.',
    rubricLookFor: 'Student includes one concrete detail that a partner can point to.',
  }
}

const source = {
  batchId: '2026-06-02-batch9',
  generatedAt: '2026-06-02',
  productSlug: 'classroom-story-license-pack',
  title: 'Classroom Story License Pack',
  pricePoint: '$79',
  audience: 'Elementary teachers and homeschool co-ops running repeatable writing stations.',
  sessionLength: '30 prompt cards plus teacher tools',
  safetyNote: safety,
  worldSlugs: ['seed-library-map-room', 'greenhouse-gear-garden'],
  cover: {
    kicker: 'Printable classroom writing license',
    headline: 'Thirty story stations for one busy classroom',
    subhead: 'Prompt cards, routines, extension activities, and a practical rubric.',
    included: [
      '30 prompt cards',
      'Teacher setup guide',
      'Station routine',
      'Partner share moves',
      'Four-criterion rubric',
      'Extension activity menu',
      'Portfolio tracker',
      'Revision mini-lessons',
      'Source HTML',
      'Local image assets',
      'Substitute folder notes',
      'Co-op use notes',
    ],
  },
  classroomRoutines: ['Station rotation', 'Partner talk', 'Quiet draft', 'Teacher conference', 'Share circle'],
  teacherSetup: ['Print cards.', 'Cut card sheets.', 'Set bins.', 'Pick focus cards.', 'Save samples.'],
  extensionActivities: Array.from({ length: 10 }, (_, index) => ({
    id: `extension-${index + 1}`,
    title: `Extension ${index + 1}`,
    minutes: 20,
    teacherMove: 'Model one concrete detail before students try the extension.',
    studentOutput: 'One revised paragraph with a clearer setting detail.',
    usesPromptCards: index % 2 === 0,
  })),
  rubric: {
    levels: ['Beginning', 'Developing', 'Secure', 'Extending'],
    criteria: ['Concrete details', 'Clear sequence', 'Character choice', 'Revision move'].map((name) => ({
      id: name.toLowerCase().replaceAll(' ', '-'),
      name,
      lookFor: `Teacher can point to ${name.toLowerCase()} in the draft.`,
      levels: {
        Beginning: 'The draft needs a teacher prompt to show this skill.',
        Developing: 'The draft shows this skill once with partial clarity.',
        Secure: 'The draft shows this skill clearly in the story.',
        Extending: 'The draft uses this skill clearly and improves one connected sentence.',
      },
    })),
  },
  promptCards: Array.from({ length: 30 }, (_, index) =>
    promptCard(index + 1, index % 2 === 0 ? 'seed-library-map-room' : 'greenhouse-gear-garden'),
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

describe('Classroom Story License Pack builder', () => {
  it('loads committed classroom source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source: committedSource, product, worlds: committedWorlds, imageMap } = loadClassroomLicenseBuildInputs()

    expect(committedSource.productSlug).toBe('classroom-story-license-pack')
    expect(committedSource.promptCards).toHaveLength(30)
    expect(product.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(committedSource.worldSlugs.length)
    for (const slug of committedSource.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-classroom-build-'))
    const buildDir = join(tempDir, 'classroom-story-license-pack')
    try {
      const { manifest } = await buildClassroomLicensePack({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(34))
        },
      })

      expect(manifest.productSlug).toBe('classroom-story-license-pack')
      expect(manifest.sourcePageCount).toBe(30)
      expect(manifest.files.assets).toHaveLength(27)
      expect(existsSync(join(buildDir, 'source', 'classroom-story-license-pack.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'classroom-story-license-pack.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'classroom-story-license-pack.html'), 'utf8').match(/prompt-card-page/g)).toHaveLength(30)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('renders printable classroom source HTML with card pages, teacher tools, local images, and no checkout copy', () => {
    const html = renderClassroomLicenseHtml(
      source,
      worlds,
      new Map([
        ['seed-library-map-room', 'assets/seed-library-map-room.jpg'],
        ['greenhouse-gear-garden', 'assets/greenhouse-gear-garden.jpg'],
      ]),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Classroom Story License Pack')
    expect(html).toContain('Teacher setup')
    expect(html).toContain('Four-criterion rubric')
    expect(html).toContain('Extension activity menu')
    expect(html.match(/class="[^"]*prompt-card-page/g)).toHaveLength(30)
    expect(html).toContain('assets/seed-library-map-room.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad/i)
  })

  it('builds a reusable product artifact manifest for the classroom license pack', () => {
    const manifest = buildProductArtifactManifest(source, {
      pdf: {
        path: 'product-build/classroom-story-license-pack/Classroom-Story-License-Pack.pdf',
        sha256: 'a'.repeat(64),
        size: 1200,
      },
      zip: {
        path: 'product-build/classroom-story-license-pack/classroom-story-license-pack.zip',
        sha256: 'b'.repeat(64),
        size: 2400,
      },
      sourceHtml: {
        path: 'product-build/classroom-story-license-pack/source/classroom-story-license-pack.html',
        sha256: 'c'.repeat(64),
        size: 3600,
      },
    })

    expect(manifest.productSlug).toBe('classroom-story-license-pack')
    expect(manifest.generatedAt).toBe('2026-06-02')
    expect(manifest.sourcePageCount).toBe(30)
    expect(manifest.files.pdf.sha256).toMatch(/^[a-f0-9]{64}$/)
  })

  it('keeps every committed classroom pack printable page within one sheet', async () => {
    const root = resolve(import.meta.dirname, '..')
    const sourcePath = resolve(root, 'content', 'product-artifacts', 'classroom-story-license-pack.json')
    expect(existsSync(sourcePath)).toBe(true)
    const classroomSource = JSON.parse(readFileSync(sourcePath, 'utf8'))
    const allWorlds = new Map()
    for (const world of starterWorlds) {
      allWorlds.set(world.slug, world)
    }
    for (const file of readdirSync(resolve(root, 'content', 'worlds')).filter((item) => /^batch1-.+\.json$/.test(item))) {
      const data = JSON.parse(readFileSync(resolve(root, 'content', 'worlds', file), 'utf8'))
      for (const world of data.worlds) allWorlds.set(world.slug, world)
    }
    const imageMap = new Map(classroomSource.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderClassroomLicenseHtml(classroomSource, allWorlds, imageMap)
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-classroom-layout-'))
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
