import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateClipboardStoryParagraphFocusCardPackSource,
  validateClipboardStoryParagraphFocusCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildClipboardStoryParagraphFocusCardPack,
  renderClipboardStoryParagraphFocusCardPackHtml,
} from './clipboard-story-paragraph-focus-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const worldAges = {
  'moon-muffin-market': '6-8',
  'puddle-planet-post-office': '6-8',
  'buttonwood-library-train': '7-9',
  'button-bakery-map-mixup': '7-9',
  'teacup-town-weather-window': '7-8',
  'pocket-park-notice-board': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'acorn-avenue-errand-office': '7-9',
  'seed-library-map-room': '8-10',
  'rain-gauge-railway': '8-10',
  'moss-message-observatory': '8-10',
  'tidepool-timekeepers-lab': '8-10',
  'revision-river-ferry': '10-11',
  'clue-label-tower-museum': '10-11',
  'compass-craft-academy': '10-11',
  'binding-day-boardwalk': '10-11',
}

const worldSlugs = Object.keys(worldAges)
const paragraphSkills = [
  'choose one paragraph main idea',
  'name the detail that belongs first',
  'name the detail that belongs second',
  'keep two details under one main idea',
  'order details from broad to specific',
  'link a detail back to the main idea',
  'cut an extra idea that does not fit',
  'build one focused paragraph from three notes',
  'choose the sentence that belongs in the paragraph',
  'move a detail sentence into better order',
  'write a linking sentence for a paragraph',
  'trim a side detail from a paragraph',
  'check whether every sentence points to one idea',
  'copy a final focused paragraph',
  'compare two paragraph focus choices',
  'finish with one clear paragraph label',
]

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function card(index, worldSlug, ageBand) {
  return {
    id: `clipboard-paragraph-focus-card-${String(index).padStart(2, '0')}`,
    title: `Clipboard Story Paragraph Focus Card ${index}`,
    worldSlug,
    ageBand,
    paragraphFocusSkill: paragraphSkills[index - 1],
    useCase:
      'Adult-led printable clipboard story paragraph focus card for shaping one fictional paragraph on paper: ____________________.',
    adultSetup:
      'Adult: place one clipboard page beside the card and choose one broad invented paragraph idea: ____________________.',
    kidDirection:
      'Writer: keep the paragraph about one pretend idea, then choose two details that belong with it: ____________________.',
    mainIdeaPrompt: 'Main idea: write the one pretend idea this paragraph will stay about: ____________________.',
    detailOnePrompt: 'Detail one: add one useful fictional detail that belongs with the main idea: ____________________.',
    detailTwoPrompt: 'Detail two: add a second useful fictional detail that still belongs: ____________________.',
    detailOrderPrompt: 'Detail order: mark which detail should come first and why it fits there: ____________________.',
    linkingSentencePrompt: 'Linking sentence: write one sentence that points the details back to the main idea: ____________________.',
    cutExtraPrompt: 'Cut extra: name one side idea that should stay out of this paragraph: ____________________.',
    finalParagraphPrompt: 'Final paragraph: copy one focused fictional paragraph with the main idea and two details: ____________________.',
    quietOptionLine: 'Quiet option: point to the main idea and fill only one detail blank: ____________________.',
    takeHomeLine: 'Take-home line: build one pretend paragraph from one idea and two matching details: ____________________.',
  }
}

function validSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch49',
    generatedAt: '2026-06-03',
    productSlug: 'clipboard-story-paragraph-focus-card-pack',
    title: 'Clipboard Story Paragraph Focus Card Pack',
    pricePoint: '$71',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable paragraph focus cards plus adult guide tools, paragraph focus routines, take-home paragraph slips, and optional prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/clipboard-story-paragraph-focus-card-pack/Clipboard-Story-Paragraph-Focus-Card-Pack.pdf',
      zipPath:
        'product-build/clipboard-story-paragraph-focus-card-pack/clipboard-story-paragraph-focus-card-pack.zip',
      sourceHtmlPath:
        'product-build/clipboard-story-paragraph-focus-card-pack/source/clipboard-story-paragraph-focus-card-pack.html',
      manifestPath: 'product-build/clipboard-story-paragraph-focus-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-a.json',
      'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-b.json',
      'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-c.json',
      'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-tools.json',
    ],
    worldSlugs,
    cover: {
      kicker: 'Printable clipboard paragraph focus cards',
      headline: 'Clipboard Story Paragraph Focus Card Pack',
      subhead:
        'Sixteen clipboard cards help writers keep one fictional paragraph focused with a main idea, two useful details, a linking sentence, one cut extra, and a final copied paragraph.',
      included: [
        '16 printable clipboard paragraph focus cards',
        'Adult setup guide',
        'Fictional paragraph focus safety notes',
        'Clipboard paragraph coaching moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led paragraph focus routines',
        'Ten take-home paragraph slips',
        'Eight optional prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Clipboard Story Paragraph Focus Adult Guide',
      bullets: [
        'Print the clipboard paragraph focus cards, blank pages, and guide before the adult-led paper session.',
        'Begin with one broad fictional main idea, then coach two matching details and one linking sentence.',
        'Keep every example made-up, broad, offline, paper-only, and guided by an adult.',
        'Ask whether each sentence belongs in this paragraph before asking for a longer draft.',
        'Replace narrow outside facts with made-up story labels before anyone writes.',
        'End each activity by copying one final focused fictional paragraph on paper.',
      ],
    },
    paragraphFocusRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Paragraph Focus Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one main idea and two matching details.',
      steps: [
        'Adult chooses one broad invented main idea and reads the paper-only reminder: ____________________.',
        'Writer writes one detail that clearly belongs with that idea: ____________________.',
        'Writer writes a second detail and marks whether it should come before or after the first: ____________________.',
        'Writer copies one focused paragraph with no extra side idea: ____________________.',
      ],
    })),
    takeHomeParagraphSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Paragraph Slip ${index + 1}`,
      time: `paragraph slip ${index + 1}`,
      skill: paragraphSkills[index],
      direction: 'Choose one pretend main idea and two matching details on paper: ____________________.',
      familyLine: 'A grown-up can ask which side idea should stay out of the paragraph: ____________________.',
    })),
    optionalSharePrompts: [
      'Optional adult-led offline prompt: my paragraph main idea is ____________________.',
      'Optional adult-led offline prompt: the first detail that belongs is ____________________.',
      'Optional adult-led offline prompt: the second detail that belongs is ____________________.',
      'Optional adult-led offline prompt: a detail I left out is ____________________.',
      'Optional adult-led offline prompt: my linking sentence says ____________________.',
      'Optional adult-led offline prompt: the paragraph stays focused because ____________________.',
      'Optional adult-led offline prompt: my final fictional paragraph begins with ____________________.',
      'Optional adult-led offline prompt: an adult can add one broad made-up paragraph note here: ____________________.',
    ],
    cards: worldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, worldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'clipboard-story-paragraph-focus-card-pack',
  title: 'Clipboard Story Paragraph Focus Card Pack',
  pricePoint: '$71',
  status: 'checkout_pending',
  worldSlugs,
  worldSummaries: worldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const knownWorldAges = new Map(worldSlugs.map((worldSlug) => [worldSlug, { ageBand: worldAges[worldSlug] }]))
const worlds = new Map(
  worldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: worldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free paragraph focus card prompt.',
    },
  ]),
)

function writeLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            paragraphFocusRoutines: source.paragraphFocusRoutines,
            takeHomeParagraphSlips: source.takeHomeParagraphSlips,
            optionalAdultPrompts: source.optionalSharePrompts,
          }
        : {
            laneId,
            cards: source.cards.filter((entry) => {
              const number = Number(entry.id.slice(-2))
              if (sourceFile.includes('-cards-a')) return number <= 6
              if (sourceFile.includes('-cards-b')) return number >= 7 && number <= 11
              return number >= 12
            }),
          }
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, `${JSON.stringify(lane, null, 2)}\n`, { flag: 'wx' })
  }
}

describe('Clipboard Story Paragraph Focus Card Pack policy', () => {
  it('accepts a valid source with sixteen printable paragraph focus cards', () => {
    expect(validateClipboardStoryParagraphFocusCardPackSource(validSource(), product, knownWorldAges)).toEqual([])
  })

  it('rejects a paragraph focus prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].mainIdeaPrompt = 'Main idea: write the one pretend idea this paragraph will stay about.'
    expect(validateClipboardStoryParagraphFocusCardPackSource(source, product, knownWorldAges)).toContain(
      'cards[0].mainIdeaPrompt must include a writable blank.',
    )
  })

  it('rejects upload and scoring language in paragraph focus cards', () => {
    const source = validSource()
    source.cards[0].takeHomeLine = 'Upload this paragraph for a score: ____________________.'
    expect(validateClipboardStoryParagraphFocusCardPackSource(source, product, knownWorldAges).join('\n')).toMatch(
      /upload|score/i,
    )
  })

  it('rejects a copied source that points at the wrong lane files', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-clipboard-paragraph-source-path-'))
    const source = validSource()
    try {
      source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-clipboard-paragraph-cards-a.json'
      writeLaneFiles(tempRoot, source)
      expect(validateClipboardStoryParagraphFocusCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 49 paragraph focus-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('validates source lane files reproduce paragraph focus cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-clipboard-paragraph-source-'))
    const source = validSource()
    try {
      writeLaneFiles(tempRoot, source)
      expect(validateClipboardStoryParagraphFocusCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects a card placed in the wrong paragraph focus lane range', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-clipboard-paragraph-lane-range-'))
    const source = validSource()
    try {
      writeLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards.push(laneB.cards[0])
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      expect(validateClipboardStoryParagraphFocusCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects clipboard paragraph focus artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-clipboard-paragraph-artifacts-'))
    const source = validSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const htmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/clipboard-story-paragraph-focus-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(htmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK clipboard paragraph focus zip'), { flag: 'wx' })
      writeFileSync(htmlPath, '<!doctype html><html><body>clipboard paragraph focus</body></html>', { flag: 'wx' })
      writeFileSync(readmePath, 'README', { flag: 'wx' })
      writeFileSync(
        manifestPath,
        JSON.stringify(
          {
            productSlug: source.productSlug,
            files: {
              pdf: {
                path: source.artifact.pdfPath,
                sha256: sha256(pdfPath),
                size: readFileSync(pdfPath).length,
              },
              zip: {
                path: source.artifact.zipPath,
                sha256: sha256(zipPath),
                size: readFileSync(zipPath).length,
              },
              sourceHtml: {
                path: source.artifact.sourceHtmlPath,
                sha256: sha256(htmlPath),
                size: readFileSync(htmlPath).length,
              },
              readme: {
                path: 'product-build/clipboard-story-paragraph-focus-card-pack/README.txt',
                sha256: sha256(readmePath),
                size: readFileSync(readmePath).length,
              },
              assets: [],
            },
          },
          null,
          2,
        ),
        { flag: 'wx' },
      )

      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: source.cards.length + 5 }).valid).toBe(
        true,
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('renders printable paragraph focus card HTML with source cards and local world images', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderClipboardStoryParagraphFocusCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Clipboard Story Paragraph Focus Card Pack')
    expect(html).toContain('Main idea')
    expect(html).toContain('Detail one')
    expect(html).toContain('Cut extra')
    expect(html).toContain('Final paragraph')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic printable paragraph focus artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-clipboard-paragraph-build-'))
    const source = validSource()
    try {
      const output = await buildClipboardStoryParagraphFocusCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'clipboard-story-paragraph-focus-card-pack'),
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = JSON.parse(readFileSync(output.paths.manifestPath, 'utf8'))

      expect(output.source.productSlug).toBe('clipboard-story-paragraph-focus-card-pack')
      expect(manifest.productSlug).toBe('clipboard-story-paragraph-focus-card-pack')
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)

      const secondOutput = await buildClipboardStoryParagraphFocusCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'clipboard-story-paragraph-focus-card-pack'),
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      expect(readFileSync(secondOutput.paths.manifestPath, 'utf8')).toBe(
        readFileSync(output.paths.manifestPath, 'utf8'),
      )
      expect(inspectArtifactFiles(tempRoot, output.source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('validates committed product world summaries stay linked to product worlds', () => {
    expect(validateProductWorldSummaries(product, 'Clipboard Story Paragraph Focus Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Clipboard Story Paragraph Focus Card Pack',
      ),
    ).toContain('Clipboard Story Paragraph Focus Card Pack worldSummaries must cover every linked world.')
  })
})
