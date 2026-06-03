import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateWashiTapeStoryWordChoiceCardPackSource,
  validateWashiTapeStoryWordChoiceCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildWashiTapeStoryWordChoiceCardPack,
  renderWashiTapeStoryWordChoiceCardPackHtml,
} from './washi-tape-story-word-choice-card-pack-builder.mjs'

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
const wordChoiceSkills = [
  'swap a bland noun for a precise story noun',
  'choose a clear verb the reader can picture',
  'trim one weak describing word',
  'replace a vague phrase with a concrete detail',
  'match a word to the character choice',
  'make a place clue sharper with one word',
  'choose a small object word',
  'make a sentence sound smoother on paper',
  'turn a general word into an invented label',
  'choose one word that changes the mood',
  'replace repeated words without a thesaurus',
  'use one texture word without tasting',
  'tighten a sentence with fewer words',
  'choose a verb before adding describing words',
  'compare two word choices on paper',
  'copy the strongest revised line',
]
const wordSlipLabels = [
  'noun-swap slip',
  'verb-choice slip',
  'describer-trim slip',
  'phrase-swap slip',
  'object-word slip',
  'place-word slip',
  'label-word slip',
  'sentence-smooth slip',
  'repeat-repair slip',
  'final-word slip',
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
    id: `washi-tape-word-choice-card-${String(index).padStart(2, '0')}`,
    title: `Washi Tape Story Word Choice Card ${index}`,
    worldSlug,
    ageBand,
    wordChoiceSkill: wordChoiceSkills[index - 1],
    useCase:
      'Adult-led printable washi tape word-choice card for revising one fictional sentence with stronger paper-only word choices: ____________________.',
    adultSetup:
      'Adult: place one blank washi tape strip beside the printable card and keep every example fictional: ____________________.',
    kidDirection:
      'Writer: choose one bland word, then replace it with a clearer story word: ____________________.',
    plainWordPrompt: 'Plain word: write the bland word or phrase here: ____________________.',
    preciseNounPrompt: 'Precise noun: choose one invented object, place, or role word: ____________________.',
    clearVerbPrompt: 'Clear verb: choose one action word the reader can picture: ____________________.',
    describerPrompt: 'Useful describer: add one describing word that changes the picture: ____________________.',
    sentenceSwapPrompt: 'Sentence swap: rewrite the sentence with the stronger word choice: ____________________.',
    soundShapePrompt: 'Sound and shape check: mark the word that fits the sentence rhythm on paper: ____________________.',
    finalLinePrompt: 'Final line: copy the revised fictional sentence here: ____________________.',
    quietOptionLine: 'Quiet option: circle one stronger word and fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: replace one plain fictional word with a clearer choice: ____________________.',
  }
}

function validWashiTapeWordChoiceSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch47',
    generatedAt: '2026-06-03',
    productSlug: 'washi-tape-story-word-choice-card-pack',
    title: 'Washi Tape Story Word Choice Card Pack',
    pricePoint: '$67',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable word-choice cards plus adult guide tools, word-choice routines, take-home word slips, and optional prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/washi-tape-story-word-choice-card-pack/Washi-Tape-Story-Word-Choice-Card-Pack.pdf',
      zipPath:
        'product-build/washi-tape-story-word-choice-card-pack/washi-tape-story-word-choice-card-pack.zip',
      sourceHtmlPath:
        'product-build/washi-tape-story-word-choice-card-pack/source/washi-tape-story-word-choice-card-pack.html',
      manifestPath: 'product-build/washi-tape-story-word-choice-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-a.json',
      'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-b.json',
      'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-c.json',
      'content/product-artifacts/lanes/batch47-washi-tape-word-choice-tools.json',
    ],
    worldSlugs: showWorldSlugs,
    cover: {
      kicker: 'Printable washi tape word choice cards',
      headline: 'Washi Tape Story Word Choice Card Pack',
      subhead:
        'Sixteen paper cards help writers replace bland fictional words with precise nouns, clear verbs, useful describers, sentence swaps, and revised final lines.',
      included: [
        '16 printable washi tape word choice cards',
        'Adult setup guide',
        'Fictional word-choice safety notes',
        'Washi tape coaching moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led word choice routines',
        'Ten take-home word slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Washi Tape Story Word Choice Card Adult Guide',
      bullets: [
        'Print the word-choice cards, blank slips, and guide before the adult-led paper session.',
        'Use fictional washi tape strips as paper props for plain words, precise nouns, clear verbs, useful describers, sentence swaps, and final lines.',
        'Keep every word choice fictional, broad, offline, and guided by an adult.',
        'Choose one precise noun, clear verb, useful describer, phrase swap, or sentence rewrite so the card has one clear job.',
        'Replace narrow outside facts with made-up story labels before anyone writes.',
        'Send along only blank slips or invented examples with no identity details.',
      ],
    },
    wordChoiceRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Word Choice Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one bland word and two stronger choices.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer writes one bland fictional word on the washi tape strip: ____________________.',
        'Adult models how a precise noun, clear verb, useful describer, or phrase swap changes the sentence.',
        'Writer drafts one revised fictional sentence on the card: ____________________.',
      ],
    })),
    takeHomeWordSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Word Slip ${index + 1}`,
      time: wordSlipLabels[index],
      skill: wordChoiceSkills[index],
      direction: 'Choose one plain fictional word and replace it with a clearer choice on paper: ____________________.',
      familyLine: 'A grown-up can ask which word helps the reader picture the moment: ____________________.',
    })),
    optionalSharePrompts: [
      'Optional adult-led offline prompt: the plain word I changed is ____________________.',
      'Optional adult-led offline prompt: one precise noun from my card is ____________________.',
      'Optional adult-led offline prompt: the clear verb I used is ____________________.',
      'Optional adult-led offline prompt: one useful describing word I chose is ____________________.',
      'Optional adult-led offline prompt: the phrase I swapped is ____________________.',
      'Optional adult-led offline prompt: the sentence sounds stronger because ____________________.',
      'Optional adult-led offline prompt: the revised fictional sentence is ____________________.',
      'Optional adult-led offline prompt: an adult can add one broad made-up word choice here: ____________________.',
    ],
    cards: showWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, showWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'washi-tape-story-word-choice-card-pack',
  title: 'Washi Tape Story Word Choice Card Pack',
  pricePoint: '$67',
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
      premise: 'A friendly invented world for a screen-free word choice card prompt.',
    },
  ]),
)

function writeValidWashiTapeWordChoiceLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            wordChoiceRoutines: source.wordChoiceRoutines,
            takeHomeWordSlips: source.takeHomeWordSlips,
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

describe('Washi Tape Story Word Choice Card Pack policy', () => {
  it('accepts a valid source with sixteen printable word choice cards', () => {
    expect(validateWashiTapeStoryWordChoiceCardPackSource(validWashiTapeWordChoiceSource(), product, worldAges)).toEqual([])
  })

  it('rejects a word choice prompt field without a writable blank', () => {
    const source = validWashiTapeWordChoiceSource()
    source.cards[0].plainWordPrompt = 'Plain word: write the bland word or phrase here.'
    expect(validateWashiTapeStoryWordChoiceCardPackSource(source, product, worldAges)).toContain(
      'cards[0].plainWordPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validWashiTapeWordChoiceSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validateWashiTapeStoryWordChoiceCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('rejects scoring language in word choice cards', () => {
    const source = validWashiTapeWordChoiceSource()
    source.cards[0].kidDirection = 'Use a scoring pass to rank this detail: ____________________.'
    expect(validateWashiTapeStoryWordChoiceCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /score|scoring/i,
    )
  })

  it('requires the standard product safety sentence in the source safety note', () => {
    const source = validWashiTapeWordChoiceSource({
      safetyNote:
        'Family-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts.',
    })
    expect(validateWashiTapeStoryWordChoiceCardPackSource(source, product, worldAges)).toContain(
      `safetyNote must include ${standardSafety}`,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validWashiTapeWordChoiceSource()
    source.takeHomeWordSlips[0].time = '7 minutes'
    expect(validateWashiTapeStoryWordChoiceCardPackSource(source, product, worldAges)).toContain(
      'takeHomeWordSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Washi Tape Story Word Choice Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Washi Tape Story Word Choice Card Pack',
      ),
    ).toContain('Washi Tape Story Word Choice Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce word choice cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-washi-tape-word-choice-source-'))
    const source = validWashiTapeWordChoiceSource()
    try {
      writeValidWashiTapeWordChoiceLaneFiles(tempRoot, source)
      expect(validateWashiTapeStoryWordChoiceCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 47 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-washi-tape-word-choice-source-path-'))
    const source = validWashiTapeWordChoiceSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-washi-tape-word-choice-cards-a.json'
    try {
      writeValidWashiTapeWordChoiceLaneFiles(tempRoot, source)
      expect(validateWashiTapeStoryWordChoiceCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 47 word choice-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects cards assigned to the wrong Batch 47 lane file', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-washi-tape-word-choice-lane-range-'))
    const source = validWashiTapeWordChoiceSource()
    try {
      writeValidWashiTapeWordChoiceLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards[0] = source.cards[6]
      laneB.cards[0] = source.cards[0]
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      writeFileSync(laneBPath, `${JSON.stringify(laneB, null, 2)}\n`)
      expect(validateWashiTapeStoryWordChoiceCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects washi tape word choice artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-washi-tape-word-choice-artifacts-'))
    const source = validWashiTapeWordChoiceSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/washi-tape-story-word-choice-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK washi tape word choice zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Washi Tape Story Word Choice Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Washi Tape Story Word Choice Card Pack\n', { flag: 'wx' })
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
              path: 'product-build/washi-tape-story-word-choice-card-pack/README.txt',
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
describe('Washi Tape Story Word Choice Card Pack builder', () => {
  it('renders the printable word choice card HTML with source cards and local world images', () => {
    const source = validWashiTapeWordChoiceSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderWashiTapeStoryWordChoiceCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Washi Tape Story Word Choice Card Pack')
    expect(html).toContain('Story Word Choice Card 1')
    expect(html).toContain('Plain word')
    expect(html).toContain('Take-home word slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-washi-tape-word-choice-build-'))
    const source = validWashiTapeWordChoiceSource()
    try {
      const output = await buildWashiTapeStoryWordChoiceCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'washi-tape-story-word-choice-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('washi-tape-story-word-choice-card-pack')
      expect(manifest.productSlug).toBe('washi-tape-story-word-choice-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildWashiTapeStoryWordChoiceCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'washi-tape-story-word-choice-card-pack'),
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
