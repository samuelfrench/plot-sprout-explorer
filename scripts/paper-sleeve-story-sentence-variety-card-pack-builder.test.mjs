import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validatePaperSleeveStorySentenceVarietyCardPackSource,
  validatePaperSleeveStorySentenceVarietyCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildPaperSleeveStorySentenceVarietyCardPack,
  renderPaperSleeveStorySentenceVarietyCardPackHtml,
} from './paper-sleeve-story-sentence-variety-card-pack-builder.mjs'

const standardSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'
const safety = standardSafety

const showWorldAges = {
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

const showWorldSlugs = Object.keys(showWorldAges)
const sentenceVarietySkills = [
  'write one clear short sentence',
  'stretch a sentence with one useful detail',
  'turn a statement into a question sentence',
  'move the sentence starter',
  'combine two short sentences',
  'split one crowded sentence',
  'alternate short and long lines',
  'add a where phrase with broad invented places',
  'add a when phrase with made-up order words',
  'use an action starter',
  'use a quiet question before an answer',
  'write a sentence pair with contrast',
  'trim a sentence back to one idea',
  'choose the best sentence order',
  'compare two sentence rhythms on paper',
  'copy the strongest varied sentence',
]
const sentenceSlipLabels = [
  'short-line slip',
  'stretch-line slip',
  'question-line slip',
  'starter-swap slip',
  'combine-lines slip',
  'split-line slip',
  'rhythm-pair slip',
  'where-phrase slip',
  'when-phrase slip',
  'final-variety slip',
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
    id: `paper-sleeve-sentence-variety-card-${String(index).padStart(2, '0')}`,
    title: `Paper Sleeve Story Sentence Variety Card ${index}`,
    worldSlug,
    ageBand,
    sentenceVarietySkill: sentenceVarietySkills[index - 1],
    useCase:
      'Adult-led printable paper sleeve sentence-variety card for revising one fictional sentence with a new paper-only sentence shape: ____________________.',
    adultSetup:
      'Adult: place one blank paper sleeve strip beside the printable card and keep every example fictional: ____________________.',
    kidDirection:
      'Writer: try the same pretend idea in two sentence shapes, then choose the one that reads best: ____________________.',
    shortSentencePrompt: 'Short sentence: write the pretend idea in one clear short sentence: ____________________.',
    longSentencePrompt: 'Stretched sentence: add one useful made-up detail without crowding the line: ____________________.',
    questionSentencePrompt: 'Question sentence: turn the pretend idea into a curious question on paper: ____________________.',
    starterSwapPrompt: 'Starter swap: begin the sentence with an action, object, or place cue from the fictional world: ____________________.',
    sentenceCombinePrompt: 'Sentence combine: join two tiny fictional sentences into one smooth line: ____________________.',
    rhythmCheckPrompt: 'Rhythm check: mark whether the short line, stretched line, or question line fits best: ____________________.',
    finalLinePrompt: 'Final line: copy the varied fictional sentence that reads best on paper: ____________________.',
    quietOptionLine: 'Quiet option: choose one sentence shape and fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: revise one pretend sentence by changing its shape, not its meaning: ____________________.',
  }
}

function validPaperSleeveSentenceVarietySource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch48',
    generatedAt: '2026-06-03',
    productSlug: 'paper-sleeve-story-sentence-variety-card-pack',
    title: 'Paper Sleeve Story Sentence Variety Card Pack',
    pricePoint: '$69',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 6-11.',
    sessionLength:
      '16 printable sentence-variety cards plus adult guide tools, sentence-variety routines, take-home sentence slips, and optional prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/paper-sleeve-story-sentence-variety-card-pack/Paper-Sleeve-Story-Sentence-Variety-Card-Pack.pdf',
      zipPath:
        'product-build/paper-sleeve-story-sentence-variety-card-pack/paper-sleeve-story-sentence-variety-card-pack.zip',
      sourceHtmlPath:
        'product-build/paper-sleeve-story-sentence-variety-card-pack/source/paper-sleeve-story-sentence-variety-card-pack.html',
      manifestPath: 'product-build/paper-sleeve-story-sentence-variety-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-a.json',
      'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-b.json',
      'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-c.json',
      'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-tools.json',
    ],
    worldSlugs: showWorldSlugs,
    cover: {
      kicker: 'Printable paper sleeve sentence variety cards',
      headline: 'Paper Sleeve Story Sentence Variety Card Pack',
      subhead:
        'Sixteen paper cards help writers vary fictional sentences with short lines, stretched lines, question lines, starter swaps, combined lines, rhythm checks, and final revised lines.',
      included: [
        '16 printable paper sleeve sentence variety cards',
        'Adult setup guide',
        'Fictional sentence-variety safety notes',
        'Paper sleeve sentence coaching moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led sentence variety routines',
        'Ten take-home sentence slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Paper Sleeve Story Sentence Variety Card Adult Guide',
      bullets: [
        'Print the sentence-variety cards, blank slips, and guide before the adult-led paper session.',
        'Use fictional paper sleeve strips as paper props for short lines, stretched lines, question lines, starter swaps, combined lines, and final rhythm checks.',
        'Keep every sentence shape fictional, broad, offline, and guided by an adult.',
        'Choose one short line, stretched line, question line, starter swap, combined line, or rhythm check so the card has one clear job.',
        'Replace narrow outside facts with made-up story labels before anyone writes.',
        'Send along only blank slips or invented examples with no identity details.',
      ],
    },
    sentenceVarietyRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Sentence Variety Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one plain sentence and two new sentence shapes.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer writes one plain fictional sentence on the paper sleeve strip: ____________________.',
        'Adult models how a short sentence, stretched sentence, question sentence, starter swap, or combined sentence changes the rhythm.',
        'Writer drafts one revised fictional sentence on the card: ____________________.',
      ],
    })),
    takeHomeSentenceSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Sentence Slip ${index + 1}`,
      time: sentenceSlipLabels[index],
      skill: sentenceVarietySkills[index],
      direction: 'Choose one plain fictional sentence and try a new sentence shape on paper: ____________________.',
      familyLine: 'A grown-up can ask which sentence shape helps the reader follow the moment: ____________________.',
    })),
    optionalSharePrompts: [
      'Optional adult-led offline prompt: the plain sentence shape I changed is ____________________.',
      'Optional adult-led offline prompt: a short sentence from my card is ____________________.',
      'Optional adult-led offline prompt: the stretched sentence I built is ____________________.',
      'Optional adult-led offline prompt: the question sentence I tried is ____________________.',
      'Optional adult-led offline prompt: the starter I moved is ____________________.',
      'Optional adult-led offline prompt: the sentence sounds stronger because ____________________.',
      'Optional adult-led offline prompt: the revised fictional sentence is ____________________.',
      'Optional adult-led offline prompt: an adult can add one broad made-up sentence variety here: ____________________.',
    ],
    cards: showWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, showWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'paper-sleeve-story-sentence-variety-card-pack',
  title: 'Paper Sleeve Story Sentence Variety Card Pack',
  pricePoint: '$69',
  status: 'checkout_pending',
  worldSlugs: showWorldSlugs,
  worldSummaries: showWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(showWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: showWorldAges[worldSlug] }]))

const worlds = new Map(
  showWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: showWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free sentence variety card prompt.',
    },
  ]),
)

function writeValidPaperSleeveSentenceVarietyLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            sentenceVarietyRoutines: source.sentenceVarietyRoutines,
            takeHomeSentenceSlips: source.takeHomeSentenceSlips,
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

describe('Paper Sleeve Story Sentence Variety Card Pack policy', () => {
  it('accepts a valid source with sixteen printable sentence variety cards', () => {
    expect(validatePaperSleeveStorySentenceVarietyCardPackSource(validPaperSleeveSentenceVarietySource(), product, worldAges)).toEqual([])
  })

  it('rejects a sentence variety prompt field without a writable blank', () => {
    const source = validPaperSleeveSentenceVarietySource()
    source.cards[0].shortSentencePrompt = 'Short sentence: write the pretend idea in one clear short sentence.'
    expect(validatePaperSleeveStorySentenceVarietyCardPackSource(source, product, worldAges)).toContain(
      'cards[0].shortSentencePrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validPaperSleeveSentenceVarietySource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validatePaperSleeveStorySentenceVarietyCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('rejects scoring language in sentence variety cards', () => {
    const source = validPaperSleeveSentenceVarietySource()
    source.cards[0].kidDirection = 'Use a scoring pass to rank this detail: ____________________.'
    expect(validatePaperSleeveStorySentenceVarietyCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /score|scoring/i,
    )
  })

  it('requires the standard product safety sentence in the source safety note', () => {
    const source = validPaperSleeveSentenceVarietySource({
      safetyNote:
        'Family-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts.',
    })
    expect(validatePaperSleeveStorySentenceVarietyCardPackSource(source, product, worldAges)).toContain(
      `safetyNote must include ${standardSafety}`,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validPaperSleeveSentenceVarietySource()
    source.takeHomeSentenceSlips[0].time = '7 minutes'
    expect(validatePaperSleeveStorySentenceVarietyCardPackSource(source, product, worldAges)).toContain(
      'takeHomeSentenceSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Paper Sleeve Story Sentence Variety Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Paper Sleeve Story Sentence Variety Card Pack',
      ),
    ).toContain('Paper Sleeve Story Sentence Variety Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce sentence variety cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-sleeve-sentence-variety-source-'))
    const source = validPaperSleeveSentenceVarietySource()
    try {
      writeValidPaperSleeveSentenceVarietyLaneFiles(tempRoot, source)
      expect(validatePaperSleeveStorySentenceVarietyCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 48 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-sleeve-sentence-variety-source-path-'))
    const source = validPaperSleeveSentenceVarietySource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-paper-sleeve-sentence-variety-cards-a.json'
    try {
      writeValidPaperSleeveSentenceVarietyLaneFiles(tempRoot, source)
      expect(validatePaperSleeveStorySentenceVarietyCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 48 sentence variety-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects cards assigned to the wrong Batch 48 lane file', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-sleeve-sentence-variety-lane-range-'))
    const source = validPaperSleeveSentenceVarietySource()
    try {
      writeValidPaperSleeveSentenceVarietyLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards[0] = source.cards[6]
      laneB.cards[0] = source.cards[0]
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      writeFileSync(laneBPath, `${JSON.stringify(laneB, null, 2)}\n`)
      expect(validatePaperSleeveStorySentenceVarietyCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects paper sleeve sentence variety artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-sleeve-sentence-variety-artifacts-'))
    const source = validPaperSleeveSentenceVarietySource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/paper-sleeve-story-sentence-variety-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK paper sleeve sentence variety zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Paper Sleeve Story Sentence Variety Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Paper Sleeve Story Sentence Variety Card Pack\n', { flag: 'wx' })
      writeFileSync(
        manifestPath,
        `${JSON.stringify({
          productSlug: source.productSlug,
          sourcePageCount: 16,
          files: {
            pdf: {
              path: source.artifact.pdfPath,
              size: readFileSync(pdfPath).length,
              sha256: sha256(pdfPath),
              pageCount: 21,
            },
            zip: { path: source.artifact.zipPath, size: readFileSync(zipPath).length, sha256: sha256(zipPath) },
            sourceHtml: {
              path: source.artifact.sourceHtmlPath,
              size: readFileSync(sourceHtmlPath).length,
              sha256: sha256(sourceHtmlPath),
            },
            readme: {
              path: 'product-build/paper-sleeve-story-sentence-variety-card-pack/README.txt',
              size: readFileSync(readmePath).length,
              sha256: sha256(readmePath),
            },
            assets: [],
          },
        })}\n`,
        { flag: 'wx' },
      )
      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: source.cards.length + 5 }).valid).toBe(
        true,
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
describe('Paper Sleeve Story Sentence Variety Card Pack builder', () => {
  it('renders the printable sentence variety card HTML with source cards and local world images', () => {
    const source = validPaperSleeveSentenceVarietySource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderPaperSleeveStorySentenceVarietyCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Paper Sleeve Story Sentence Variety Card Pack')
    expect(html).toContain('Story Sentence Variety Card 1')
    expect(html).toContain('Short sentence')
    expect(html).toContain('Take-home sentence slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-sleeve-sentence-variety-build-'))
    const source = validPaperSleeveSentenceVarietySource()
    try {
      const output = await buildPaperSleeveStorySentenceVarietyCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'paper-sleeve-story-sentence-variety-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('paper-sleeve-story-sentence-variety-card-pack')
      expect(manifest.productSlug).toBe('paper-sleeve-story-sentence-variety-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildPaperSleeveStorySentenceVarietyCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'paper-sleeve-story-sentence-variety-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      expect(sha256(secondOutput.paths.zipPath)).toBe(firstZipHash)
      expect(inspectArtifactFiles(tempRoot, output.source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
