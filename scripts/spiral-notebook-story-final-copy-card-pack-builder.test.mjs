import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateProductWorldSummaries,
  validateSpiralNotebookStoryFinalCopyCardPackSource,
  validateSpiralNotebookStoryFinalCopyCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildSpiralNotebookStoryFinalCopyCardPack,
  renderSpiralNotebookStoryFinalCopyCardPackHtml,
} from './spiral-notebook-story-final-copy-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const worldAges = {
  'moon-muffin-market': '6-8',
  'buttonwood-library-train': '7-9',
  'button-bakery-map-mixup': '7-9',
  'teacup-town-weather-window': '7-8',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'pocket-park-notice-board': '7-9',
  'moss-message-observatory': '8-10',
  'revision-river-ferry': '10-11',
  'tiny-lantern-reef': '8-10',
  'mitten-market-lost-ticket': '7-8',
  'paperclip-plaza-parcel-day': '7-9',
  'penny-path-compass-shop': '7-9',
  'pantry-measurement-mystery': '8-10',
  'compost-clock-workshop': '8-10',
  'almost-invention-workshop': '10-11',
  'blue-pencil-observatory': '10-11',
}

const worldSlugs = Object.keys(worldAges)
const batch50WorldSlugs = [
  'penny-path-compass-shop',
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'greenhouse-gear-garden',
  'pantry-measurement-mystery',
  'solar-oven-picnic-station',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'margin-note-market',
  'index-card-theater-club',
  'chapter-gate-greenhouse',
]
const batch51WorldSlugs = [
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'rain-gauge-railway',
  'greenhouse-gear-garden',
  'cloudberry-clocktower',
  'moss-message-observatory',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'revision-river-ferry',
  'chapter-gate-greenhouse',
  'index-card-theater-club',
  'binding-day-boardwalk',
  'margin-note-market',
]
const finalCopySkills = [
  'move the opening line cleanly onto a spiral notebook final-copy page',
  'copy the character name the same way each time',
  'carry over the useful setting detail without adding a new scene',
  'copy first, next, and last moments in the same order',
  'move one strong detail from the draft to the final-copy page',
  'leave out one extra note that does not belong on the final-copy page',
  'make sentence breaks easy to see on the page',
  'copy one dialogue line with clear speaker marks',
  'keep paragraph space steady from top to bottom',
  'copy the ending sentence so the story feels finished',
  'check that every copied sentence belongs to the same made-up story',
  'write one title line for the final-copy page',
  'make one quiet pencil correction before copying again',
  'copy the final detail list in a calm order',
  'check one page edge, title line, and ending line before stopping',
  'write one adult-led final-copy note for the next paper pass',
]

const product = {
  slug: 'spiral-notebook-story-final-copy-card-pack',
  title: 'Spiral Notebook Story Final Copy Card Pack',
  pricePoint: '$77',
  status: 'checkout_pending',
  worldSlugs,
  worldSummaries: worldSlugs.map((slug) => ({
    slug,
    summary: `A safe fictional world summary for ${slug}.`,
  })),
}

const knownWorldAges = new Map(Object.entries(worldAges).map(([slug, ageBand]) => [slug, { ageBand }]))

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function expectedZipEntries(source) {
  return [
    'Spiral-Notebook-Story-Final-Copy-Card-Pack.pdf',
    'README.txt',
    'source/spiral-notebook-story-final-copy-card-pack.html',
    ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ]
}

function card(index, worldSlug, ageBand) {
  return {
    id: `spiral-notebook-final-copy-card-${String(index).padStart(2, '0')}`,
    title: `Spiral Notebook Story Final Copy Card ${index}`,
    worldSlug,
    ageBand,
    finalCopySkill: finalCopySkills[index - 1],
    useCase:
      'Adult-led printable spiral notebook final-copy card for copying one fictional story page on paper: ____________________.',
    adultSetup:
      'Adult: place the draft, spiral notebook page, pencil, and final-copy card together before the writer starts: ____________________.',
    kidDirection:
      'Writer: copy one made-up story part neatly, then use the card to check what moved from draft to final page: ____________________.',
    openingCopyPrompt: 'Opening copy: copy the first story line onto the spiral notebook page without adding a new event: ____________________.',
    neatCopyPrompt: 'Neat copy: choose one line and copy it slowly enough that each word is easy to read: ____________________.',
    detailTransferPrompt: 'Detail transfer: move one useful draft detail onto the final-copy page and leave one extra note behind: ____________________.',
    sentenceBoundaryPrompt: 'Sentence boundary: mark where one copied sentence begins and where it ends on the page: ____________________.',
    dialogueCopyPrompt: 'Dialogue copy: copy one pretend speaking line and show who says it with a simple speaker tag: ____________________.',
    finalCopyCheckPrompt: 'Final-copy check: write one pencil note about what to copy the same way next time: ____________________.',
    quietOptionLine: 'Quiet option: copy only the opening line and one useful detail before stopping: ____________________.',
    takeHomeLine: 'Take-home line: copy one pretend story page and check opening, detail, sentence breaks, dialogue, and one final-copy note: ____________________.',
  }
}

function validSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch52',
    generatedAt: '2026-06-03',
    productSlug: 'spiral-notebook-story-final-copy-card-pack',
    title: 'Spiral Notebook Story Final Copy Card Pack',
    pricePoint: '$77',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable spiral notebook final-copy cards plus adult guide tools, final-copy routines, take-home final-copy slips, and optional prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/spiral-notebook-story-final-copy-card-pack/Spiral-Notebook-Story-Final-Copy-Card-Pack.pdf',
      zipPath:
        'product-build/spiral-notebook-story-final-copy-card-pack/spiral-notebook-story-final-copy-card-pack.zip',
      sourceHtmlPath:
        'product-build/spiral-notebook-story-final-copy-card-pack/source/spiral-notebook-story-final-copy-card-pack.html',
      manifestPath: 'product-build/spiral-notebook-story-final-copy-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-a.json',
      'content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-b.json',
      'content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-c.json',
      'content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-tools.json',
    ],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable spiral notebook final-copy cards',
      headline: 'Spiral Notebook Story Final Copy Card Pack',
      subhead:
        'Sixteen spiral notebook cards help writers copy one fictional story page while carrying over the opening, useful details, sentence breaks, dialogue, and one final-copy pencil note.',
      included: [
        '16 printable spiral notebook final-copy cards',
        'Adult setup guide',
        'Fictional final-copy safety notes',
        'Spiral notebook copying moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led final-copy routines',
        'Ten take-home final-copy slips',
        'Eight optional prompts',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Spiral Notebook Story Final Copy Adult Guide',
      bullets: [
        'Print the spiral notebook final-copy cards, blank pages, and guide before the adult-led paper session.',
        'Begin with one broad fictional draft, then coach opening line, useful detail, sentence breaks, dialogue, and final note.',
        'Keep every example made-up, broad, offline, paper-only, and guided by an adult.',
        'Let the writer point, dictate, sketch, or write one word before asking for a longer copied line.',
        'Use one card at a time so the final-copy page stays calm and readable.',
        'End each activity with one pencil note about what to copy the same way next time.',
      ],
    },
    finalCopyRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Final Copy Routine ${index + 1}`,
      bestFor: 'A calm adult-led spiral notebook moment with one fictional story page to copy.',
      steps: [
        'Adult chooses one fictional draft page and one spiral notebook final-copy card: ____________________.',
        'Writer copies the opening line and one useful detail onto paper: ____________________.',
        'Writer checks sentence breaks, dialogue, and one final-copy note: ____________________.',
        'Adult stores the draft and final-copy page together for the next paper pass: ____________________.',
      ],
    })),
    takeHomeFinalCopySlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Final Copy Take-Home Slip ${index + 1}`,
      time: 'one quiet final-copy pass',
      skill: 'copy one fictional story page onto paper',
      direction: 'Copy one pretend story page and mark one line that stayed clear: ____________________.',
      familyLine: 'Family adult note: the final-copy part that stayed easiest to read was ____________________.',
    })),
    optionalSharePrompts: Array.from(
      { length: 8 },
      (_, index) => `Adult optional prompt ${index + 1}: point to one final-copy line that stayed easy to read: ____________________.`,
    ),
    cards: worldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, worldAges[worldSlug])),
    ...overrides,
  }
}

function tempWorldsAndImages(source, { omitBlueImage = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'spiral-final-copy-'))
  const worlds = new Map(
    source.worldSlugs.map((slug) => [
      slug,
      {
        slug,
        title: slug
          .split('-')
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(' '),
        ageBand: worldAges[slug],
      },
    ]),
  )
  for (const slug of source.worldSlugs) {
    if (omitBlueImage && slug === 'blue-pencil-observatory') continue
    const imagePath = resolve(root, `${slug}.jpg`)
    writeFileSync(imagePath, Buffer.from(`fake image ${slug}`))
  }
  return { root, worlds }
}

describe('Spiral Notebook Story Final Copy Card Pack', () => {
  it('accepts a valid source with exact product alignment', () => {
    expect(validateSpiralNotebookStoryFinalCopyCardPackSource(validSource(), product, knownWorldAges)).toEqual([])
    expect(validateProductWorldSummaries(product, new Set(worldSlugs))).toEqual([])
  })

  it('rejects excessive Batch50 world overlap', () => {
    const source = validSource()
    source.worldSlugs[0] = 'greenhouse-gear-garden'
    source.cards[0] = card(1, 'greenhouse-gear-garden', '8-10')
    const knownWorldAgesWithExtra = new Map([...knownWorldAges, ['greenhouse-gear-garden', { ageBand: '8-10' }]])
    const productWithExtraOverlap = {
      ...product,
      worldSlugs: source.worldSlugs,
      worldSummaries: source.worldSlugs.map((slug) => ({ slug, summary: `A linked summary for ${slug}.` })),
    }
    expect(
      validateSpiralNotebookStoryFinalCopyCardPackSource(source, productWithExtraOverlap, knownWorldAgesWithExtra).join('\n'),
    ).toMatch(/reuse no more than 7 Batch 50 worlds/)
  })

  it('rejects excessive Batch51 world overlap', () => {
    const source = validSource()
    source.worldSlugs[0] = 'rain-gauge-railway'
    source.cards[0] = card(1, 'rain-gauge-railway', '8-10')
    const knownWorldAgesWithExtra = new Map([...knownWorldAges, ['rain-gauge-railway', { ageBand: '8-10' }]])
    const productWithExtraOverlap = {
      ...product,
      worldSlugs: source.worldSlugs,
      worldSummaries: source.worldSlugs.map((slug) => ({ slug, summary: `A linked summary for ${slug}.` })),
    }
    expect(
      validateSpiralNotebookStoryFinalCopyCardPackSource(source, productWithExtraOverlap, knownWorldAgesWithExtra).join('\n'),
    ).toMatch(/reuse no more than 7 Batch 51 worlds/)
  })

  it('rejects a final-copy prompt without a writable blank', () => {
    const source = validSource()
    source.cards[0].finalCopyCheckPrompt = 'Final-copy check: write one pencil note about what stayed clear.'
    expect(validateSpiralNotebookStoryFinalCopyCardPackSource(source, product, knownWorldAges)).toContain(
      'cards[0].finalCopyCheckPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe public posting language', () => {
    const source = validSource()
    source.cards[0].takeHomeLine = 'Take-home line: publish the final-copy page online: ____________________.'
    expect(validateSpiralNotebookStoryFinalCopyCardPackSource(source, product, knownWorldAges).join('\n')).toMatch(
      /public|publish|upload|account/i,
    )
  })

  it('renders all final-copy fields into printable HTML', () => {
    const source = validSource()
    const { root, worlds } = tempWorldsAndImages(source)
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `${root}/${slug}.jpg`]))
    const html = renderSpiralNotebookStoryFinalCopyCardPackHtml(source, worlds, imageMap)
    expect(html).toContain('Spiral Notebook Story Final Copy Card Pack')
    expect(html).toContain('Opening copy')
    expect(html).toContain('Neat copy')
    expect(html).toContain('Detail transfer')
    expect(html).toContain('Sentence boundary')
    expect(html).toContain('Dialogue copy')
    expect(html).toContain('Final-copy check')
    rmSync(root, { recursive: true, force: true })
  })

  it('requires a local blue-pencil-observatory image before building artifacts', async () => {
    const source = validSource()
    const { root, worlds } = tempWorldsAndImages(source, { omitBlueImage: true })
    const imageSources = new Map(
      source.worldSlugs.filter((slug) => slug !== 'blue-pencil-observatory').map((slug) => [slug, `${root}/${slug}.jpg`]),
    )
    await expect(
      buildSpiralNotebookStoryFinalCopyCardPack({
        source,
        product,
        worlds,
        imageSources,
        buildDir: resolve(root, 'build'),
        recordRoot: root,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      }),
    ).rejects.toThrow(/blue-pencil-observatory/)
    rmSync(root, { recursive: true, force: true })
  })

  it('builds deterministic PDF, source, ZIP, and manifest artifacts', async () => {
    const source = validSource()
    const { root, worlds } = tempWorldsAndImages(source)
    const imageSources = new Map(source.worldSlugs.map((slug) => [slug, `${root}/${slug}.jpg`]))
    const result = await buildSpiralNotebookStoryFinalCopyCardPack({
      source,
      product,
      worlds,
      imageSources,
      buildDir: resolve(root, 'build'),
      recordRoot: root,
      writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
    })
    const htmlPath = join(root, 'build', 'source', 'spiral-notebook-story-final-copy-card-pack.html')
    const pdfPath = join(root, 'build', 'Spiral-Notebook-Story-Final-Copy-Card-Pack.pdf')
    const zipPath = join(root, 'build', 'spiral-notebook-story-final-copy-card-pack.zip')
    const manifestPath = join(root, 'build', 'manifest.json')

    expect(existsSync(htmlPath)).toBe(true)
    expect(existsSync(pdfPath)).toBe(true)
    expect(existsSync(zipPath)).toBe(true)
    expect(existsSync(manifestPath)).toBe(true)
    expect(result.manifest.files.pdf.sha256).toBe(sha256(pdfPath))
    expect(result.manifest.files.zip.sha256).toBe(sha256(zipPath))
    expect(result.manifest.files.assets).toHaveLength(16)

    const artifactErrors = inspectArtifactFiles(source, {
      expectedPdfPages: 21,
      expectedZipEntries: expectedZipEntries(source),
      rootDir: root,
    })
    expect(artifactErrors).toEqual([])
    rmSync(root, { recursive: true, force: true })
  })

  it('validates exact lane source files', () => {
    const root = mkdtempSync(join(tmpdir(), 'spiral-final-copy-lanes-'))
    const source = validSource()
    for (const sourceFile of source.sourceFiles) {
      mkdirSync(dirname(resolve(root, sourceFile)), { recursive: true })
    }
    writeFileSync(
      resolve(root, source.sourceFiles[0]),
      `${JSON.stringify({ laneId: 'batch52-spiral-notebook-final-copy-cards-a', cards: source.cards.slice(0, 6) }, null, 2)}\n`,
    )
    writeFileSync(
      resolve(root, source.sourceFiles[1]),
      `${JSON.stringify({ laneId: 'batch52-spiral-notebook-final-copy-cards-b', cards: source.cards.slice(6, 11) }, null, 2)}\n`,
    )
    writeFileSync(
      resolve(root, source.sourceFiles[2]),
      `${JSON.stringify({ laneId: 'batch52-spiral-notebook-final-copy-cards-c', cards: source.cards.slice(11, 16) }, null, 2)}\n`,
    )
    writeFileSync(
      resolve(root, source.sourceFiles[3]),
      `${JSON.stringify(
        {
          laneId: 'batch52-spiral-notebook-final-copy-tools',
          adultGuide: source.adultGuide,
          finalCopyRoutines: source.finalCopyRoutines,
          takeHomeFinalCopySlips: source.takeHomeFinalCopySlips,
          optionalAdultPrompts: source.optionalSharePrompts,
        },
        null,
        2,
      )}\n`,
    )

    expect(validateSpiralNotebookStoryFinalCopyCardPackSourceFiles(source, root)).toEqual([])
    rmSync(root, { recursive: true, force: true })
  })

  it('will be listed as a checkout-pending product after catalog integration', () => {
    const products = JSON.parse(readFileSync(resolve('content/products/batch5-products.json'), 'utf8')).products
    const productRecord = products.find((candidate) => candidate.slug === 'spiral-notebook-story-final-copy-card-pack')
    expect(productRecord).toMatchObject({
      title: 'Spiral Notebook Story Final Copy Card Pack',
      pricePoint: '$77',
      status: 'checkout_pending',
    })
    expect(productRecord.ctaHref).toMatch(/^mailto:/)
  })
})
