import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateLinedPaperStoryParagraphRevisionCardPackSource,
  validateLinedPaperStoryParagraphRevisionCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildLinedPaperStoryParagraphRevisionCardPack,
  renderLinedPaperStoryParagraphRevisionCardPackHtml,
} from './lined-paper-story-paragraph-revision-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const worldAges = {
  'penny-path-compass-shop': '7-9',
  'sticker-station-mail-cart': '7-9',
  'mitten-market-lost-ticket': '7-8',
  'paperclip-plaza-parcel-day': '7-9',
  'greenhouse-gear-garden': '8-10',
  'pantry-measurement-mystery': '8-10',
  'solar-oven-picnic-station': '8-10',
  'compost-clock-workshop': '8-10',
  'orchard-pulley-post': '8-10',
  'pond-bridge-blueprint-club': '8-10',
  'cloudberry-clocktower': '8-10',
  'tiny-lantern-reef': '8-10',
  'almost-invention-workshop': '10-11',
  'margin-note-market': '10-11',
  'index-card-theater-club': '10-11',
  'chapter-gate-greenhouse': '10-11',
}

const worldSlugs = Object.keys(worldAges)
const paragraphSkills = [
  'add a topic sentence before revising',
  'move the clearest detail first',
  'check whether details follow one order',
  'add one transition between two details',
  'replace a repeated word once',
  'write a closing sentence that matches the topic',
  'cut one extra side detail',
  'combine notes into one revised paragraph',
  'check a sentence that drifts from the paragraph',
  'move a detail sentence into stronger order',
  'add a transition before the final detail',
  'trim repeated wording from a paragraph',
  'check whether every sentence supports the topic',
  'copy a final revised paragraph',
  'compare two paragraph revision choices',
  'finish with one clear revision note',
]

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
    'Lined-Paper-Story-Paragraph-Revision-Card-Pack.pdf',
    'README.txt',
    'source/lined-paper-story-paragraph-revision-card-pack.html',
    ...source.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ]
}

function card(index, worldSlug, ageBand) {
  return {
    id: `lined-paper-paragraph-revision-card-${String(index).padStart(2, '0')}`,
    title: `Lined Paper Story Paragraph Revision Card ${index}`,
    worldSlug,
    ageBand,
    paragraphRevisionSkill: paragraphSkills[index - 1],
    useCase:
      'Adult-led printable lined paper paragraph revision card for polishing one fictional paragraph on paper: ____________________.',
    adultSetup:
      'Adult: place one lined-paper page beside the card and choose one broad invented paragraph draft: ____________________.',
    kidDirection:
      'Writer: revise the pretend paragraph so the topic, details, transition, and closing sentence fit: ____________________.',
    topicSentencePrompt: 'Topic sentence: write the first sentence so the paragraph has one pretend topic: ____________________.',
    detailOrderPrompt: 'Detail order: number two fictional details in the clearest order: ____________________.',
    transitionCheckPrompt: 'Transition check: add one short transition before the second detail: ____________________.',
    closingSentencePrompt: 'Closing sentence: write one ending sentence that matches the topic: ____________________.',
    repeatedWordCutPrompt: 'Repeated-word cut: replace one repeated word with a stronger story word: ____________________.',
    finalRevisedParagraphPrompt: 'Final revised paragraph: copy the polished fictional paragraph on lined paper: ____________________.',
    quietOptionLine: 'Quiet option: fill only the topic sentence and repeated-word cut blanks: ____________________.',
    takeHomeLine: 'Take-home line: revise one pretend paragraph with a topic, two details, and a closing sentence: ____________________.',
  }
}

function validSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch50',
    generatedAt: '2026-06-03',
    productSlug: 'lined-paper-story-paragraph-revision-card-pack',
    title: 'Lined Paper Story Paragraph Revision Card Pack',
    pricePoint: '$73',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable paragraph revision cards plus adult guide tools, paragraph revision routines, take-home paragraph revision slips, and optional prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/lined-paper-story-paragraph-revision-card-pack/Lined-Paper-Story-Paragraph-Revision-Card-Pack.pdf',
      zipPath:
        'product-build/lined-paper-story-paragraph-revision-card-pack/lined-paper-story-paragraph-revision-card-pack.zip',
      sourceHtmlPath:
        'product-build/lined-paper-story-paragraph-revision-card-pack/source/lined-paper-story-paragraph-revision-card-pack.html',
      manifestPath: 'product-build/lined-paper-story-paragraph-revision-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-a.json',
      'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-b.json',
      'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-c.json',
      'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-tools.json',
    ],
    worldSlugs: [...worldSlugs],
    cover: {
      kicker: 'Printable lined paper paragraph revision cards',
      headline: 'Lined Paper Story Paragraph Revision Card Pack',
      subhead:
        'Sixteen lined-paper cards help writers revise one fictional paragraph with a topic sentence, ordered details, a transition check, a closing sentence, one repeated-word cut, and a final copied paragraph.',
      included: [
        '16 printable lined paper paragraph revision cards',
        'Adult setup guide',
        'Fictional paragraph revision safety notes',
        'Lined-paper paragraph coaching moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led paragraph revision routines',
        'Ten take-home paragraph revision slips',
        'Eight optional prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Lined Paper Story Paragraph Revision Adult Guide',
      bullets: [
        'Print the lined paper paragraph revision cards, blank pages, and guide before the adult-led paper session.',
        'Begin with one broad fictional draft, then coach the topic sentence, detail order, transition, and closing sentence.',
        'Keep every example made-up, broad, offline, paper-only, and guided by an adult.',
        'Ask whether each sentence belongs in this paragraph before asking for a longer draft.',
        'Replace repeated wording once before copying the final paragraph.',
        'End each activity by copying one final revised fictional paragraph on paper.',
      ],
    },
    paragraphRevisionRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Paragraph Revision Routine ${index + 1}`,
      bestFor: 'A calm adult-led lined-paper writing moment with one fictional paragraph to revise.',
      steps: [
        'Adult chooses one broad invented paragraph draft and reads the paper-only reminder: ____________________.',
        'Writer writes or revises one topic sentence for the paragraph: ____________________.',
        'Writer numbers two details, adds one transition, and replaces one repeated word: ____________________.',
        'Writer copies one revised paragraph with a matching closing sentence: ____________________.',
      ],
    })),
    takeHomeParagraphRevisionSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Paragraph Revision Slip ${index + 1}`,
      time: `revision slip ${index + 1}`,
      skill: paragraphSkills[index],
      direction: 'Choose one pretend paragraph and revise it on lined paper: ____________________.',
      familyLine: 'A grown-up can ask which sentence made the paragraph clearer: ____________________.',
    })),
    optionalSharePrompts: [
      'Optional adult-led offline prompt: my revised topic sentence is ____________________.',
      'Optional adult-led offline prompt: the first detail should come first because ____________________.',
      'Optional adult-led offline prompt: the transition I added says ____________________.',
      'Optional adult-led offline prompt: the repeated word I replaced was ____________________.',
      'Optional adult-led offline prompt: my closing sentence matches because ____________________.',
      'Optional adult-led offline prompt: the paragraph is clearer after I changed ____________________.',
      'Optional adult-led offline prompt: my final fictional paragraph begins with ____________________.',
      'Optional adult-led offline prompt: an adult can add one broad made-up revision note here: ____________________.',
    ],
    cards: worldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, worldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'lined-paper-story-paragraph-revision-card-pack',
  title: 'Lined Paper Story Paragraph Revision Card Pack',
  pricePoint: '$73',
  status: 'checkout_pending',
  worldSlugs: [...worldSlugs],
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
      premise: 'A friendly invented world for a screen-free paragraph revision card prompt.',
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
            paragraphRevisionRoutines: source.paragraphRevisionRoutines,
            takeHomeParagraphRevisionSlips: source.takeHomeParagraphRevisionSlips,
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

describe('Lined Paper Story Paragraph Revision Card Pack policy', () => {
  it('accepts a valid source with sixteen printable paragraph revision cards', () => {
    expect(validateLinedPaperStoryParagraphRevisionCardPackSource(validSource(), product, knownWorldAges)).toEqual([])
  })

  it('rejects world slug reuse from Batch 44-49 paragraph skill packs', () => {
    const source = validSource()
    source.worldSlugs[0] = 'moon-muffin-market'
    source.cards[0] = {
      ...source.cards[0],
      worldSlug: 'moon-muffin-market',
      ageBand: '6-8',
    }
    const productWithOverlap = {
      ...product,
      worldSlugs: source.worldSlugs,
      worldSummaries: source.worldSlugs.map((slug) => ({
        slug,
        summary: `A linked fictional world summary for ${slug}.`,
      })),
    }
    const knownWorldAgesWithPriorBatch = new Map([
      ...knownWorldAges,
      ['moon-muffin-market', { ageBand: '6-8' }],
    ])
    expect(
      validateLinedPaperStoryParagraphRevisionCardPackSource(
        source,
        productWithOverlap,
        knownWorldAgesWithPriorBatch,
      ),
    ).toContain(
      'worldSlugs must be disjoint from Batch 44-49 world slugs; overlapping slugs: moon-muffin-market.',
    )
  })

  it('rejects a paragraph revision prompt field without a writable blank', () => {
    const source = validSource()
    source.cards[0].topicSentencePrompt = 'Topic sentence: write the first sentence so the paragraph has one pretend topic.'
    expect(validateLinedPaperStoryParagraphRevisionCardPackSource(source, product, knownWorldAges)).toContain(
      'cards[0].topicSentencePrompt must include a writable blank.',
    )
  })

  it('rejects upload and scoring language in paragraph revision cards', () => {
    const source = validSource()
    source.cards[0].takeHomeLine = 'Upload this paragraph for a score: ____________________.'
    expect(validateLinedPaperStoryParagraphRevisionCardPackSource(source, product, knownWorldAges).join('\n')).toMatch(
      /upload|score/i,
    )
  })

  it('rejects a copied source that points at the wrong lane files', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-lined-paper-revision-source-path-'))
    const source = validSource()
    try {
      source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-lined-paper-revision-cards-a.json'
      writeLaneFiles(tempRoot, source)
      expect(validateLinedPaperStoryParagraphRevisionCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 50 paragraph revision-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('validates source lane files reproduce paragraph revision cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-lined-paper-revision-source-'))
    const source = validSource()
    try {
      writeLaneFiles(tempRoot, source)
      expect(validateLinedPaperStoryParagraphRevisionCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects a card placed in the wrong paragraph revision lane range', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-lined-paper-revision-lane-range-'))
    const source = validSource()
    try {
      writeLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards.push(laneB.cards[0])
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      expect(validateLinedPaperStoryParagraphRevisionCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects lined paper paragraph revision artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-lined-paper-revision-artifacts-'))
    const source = validSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const htmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/lined-paper-story-paragraph-revision-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(htmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK lined paper paragraph revision zip'), { flag: 'wx' })
      writeFileSync(htmlPath, '<!doctype html><html><body>lined paper paragraph revision</body></html>', { flag: 'wx' })
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
                path: 'product-build/lined-paper-story-paragraph-revision-card-pack/README.txt',
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

      const artifactStatus = inspectArtifactFiles(tempRoot, source.artifact, {
        expectedPdfPages: source.cards.length + 5,
        expectedZipEntries: expectedZipEntries(source),
      })
      expect(artifactStatus.valid).toBe(false)
      expect(artifactStatus.errors.join('\n')).toContain('does not have a readable ZIP central directory')
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('renders printable paragraph revision card HTML with source cards and local world images', () => {
    const source = validSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderLinedPaperStoryParagraphRevisionCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Lined Paper Story Paragraph Revision Card Pack')
    expect(html).toContain('Topic sentence')
    expect(html).toContain('Detail order')
    expect(html).toContain('Repeated-word cut')
    expect(html).toContain('Final revised paragraph')
    expect(html).toContain('assets/penny-path-compass-shop.jpg')
  })

  it('builds deterministic printable paragraph revision artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-lined-paper-revision-build-'))
    const source = validSource()
    try {
      const output = await buildLinedPaperStoryParagraphRevisionCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'lined-paper-story-paragraph-revision-card-pack'),
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = JSON.parse(readFileSync(output.paths.manifestPath, 'utf8'))

      expect(output.source.productSlug).toBe('lined-paper-story-paragraph-revision-card-pack')
      expect(manifest.productSlug).toBe('lined-paper-story-paragraph-revision-card-pack')
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)

      const secondOutput = await buildLinedPaperStoryParagraphRevisionCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'lined-paper-story-paragraph-revision-card-pack'),
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      expect(readFileSync(secondOutput.paths.manifestPath, 'utf8')).toBe(
        readFileSync(output.paths.manifestPath, 'utf8'),
      )
      expect(
        inspectArtifactFiles(tempRoot, output.source.artifact, {
          expectedPdfPages: 21,
          expectedZipEntries: expectedZipEntries(output.source),
        }).valid,
      ).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('validates committed product world summaries stay linked to product worlds', () => {
    expect(validateProductWorldSummaries(product, 'Lined Paper Story Paragraph Revision Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Lined Paper Story Paragraph Revision Card Pack',
      ),
    ).toContain('Lined Paper Story Paragraph Revision Card Pack worldSummaries must cover every linked world.')
  })
})
