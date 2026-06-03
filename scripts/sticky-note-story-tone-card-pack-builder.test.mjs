import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateStickyNoteStoryToneCardPackSource,
  validateStickyNoteStoryToneCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildStickyNoteStoryToneCardPack,
  renderStickyNoteStoryToneCardPackHtml,
} from './sticky-note-story-tone-card-pack-builder.mjs'

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
const toneSkills = [
  'turning a plain line into a visible clue',
  'showing a choice with object action',
  'making a place react on the page',
  'using a gesture instead of a label',
  'adding a paper-safe sound or texture',
  'revising a told sentence into shown action',
  'choosing one visible clue',
  'matching object action to mood',
  'using a setting signal',
  'building a gesture chain',
  'showing surprise without naming it',
  'adding texture without tasting',
  'revising a plain statement',
  'combining clue and action',
  'showing a decision on paper',
  'making the final line visible',
]
const showSlipLabels = [
  'plain-line slip',
  'visible-clue slip',
  'object-action slip',
  'place-signal slip',
  'gesture slip',
  'texture slip',
  'revision slip',
  'sentence slip',
  'quiet-clue slip',
  'final-line slip',
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
    id: `sticky-note-tone-card-${String(index).padStart(2, '0')}`,
    title: `Sticky Note Story Tone Card ${index}`,
    worldSlug,
    ageBand,
    toneSkill: toneSkills[index - 1],
    useCase:
      'Adult-led printable sticky note story tone card for changing one plain fictional line into a visible story moment: ____________________.',
    adultSetup:
      'Adult: place one blank sticky note beside the printable card and keep every choice fictional: ____________________.',
    kidDirection:
      'Writer: Start with the plain line, then show it with one visible fictional clue: ____________________.',
    neutralLinePrompt: 'Plain line: write the simple told sentence you want to change: ____________________.',
    toneChoicePrompt: 'Visible clue: show the idea with one invented thing the reader can picture: ____________________.',
    wordChoicePrompt: 'Object action: let a harmless story object move, shift, tilt, or change: ____________________.',
    objectSignalPrompt: 'Place signal: make the pretend setting give one broad clue about the moment: ____________________.',
    placeCuePrompt: 'Character gesture: show the character choice with one gentle paper-safe move: ____________________.',
    gestureTonePrompt: 'Sound or texture: add one pretend sound, surface, or touch clue without tasting: ____________________.',
    sentenceFramePrompt: 'Sentence frame: The reader can tell what is happening because: ____________________.',
    reviseTonePrompt: 'Revise story tone: replace the plain line with the clearest visible clue: ____________________.',
    quietOptionLine: 'Quiet option: underline one tone clue and fill one sticky-note blank: ____________________.',
    takeHomeLine: 'Take-home line: turn another plain fictional line into one shown clue: ____________________.',
  }
}

function validIndexCardShowNotTellSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch46',
    generatedAt: '2026-06-03',
    productSlug: 'sticky-note-story-tone-card-pack',
    title: 'Sticky Note Story Tone Card Pack',
    pricePoint: '$65',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable story tone cards plus adult guide tools, story tone routines, take-home tone slips, and optional prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/sticky-note-story-tone-card-pack/Sticky-Note-Story-Tone-Card-Pack.pdf',
      zipPath:
        'product-build/sticky-note-story-tone-card-pack/sticky-note-story-tone-card-pack.zip',
      sourceHtmlPath:
        'product-build/sticky-note-story-tone-card-pack/source/sticky-note-story-tone-card-pack.html',
      manifestPath: 'product-build/sticky-note-story-tone-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-a.json',
      'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-b.json',
      'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-c.json',
      'content/product-artifacts/lanes/batch46-sticky-note-tone-tools.json',
    ],
    worldSlugs: showWorldSlugs,
    cover: {
      kicker: 'Printable sticky note story tone cards',
      headline: 'Sticky Note Story Tone Card Pack',
      subhead:
        'Sixteen paper cards help writers turn plain fictional lines into visible story clues, object actions, place signals, and revised sentences.',
      included: [
        '16 printable sticky note story tone cards',
        'Adult setup guide',
        'Fictional story tone safety notes',
        'Index card coaching moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led story tone routines',
        'Ten take-home tone slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Sticky Note Story Tone Card Adult Guide',
      bullets: [
        'Print the story tone cards, blank slips, and guide before the adult-led paper session.',
        'Use fictional sticky notes as paper props for neutral lines, tone clues, object signals, place cues, gestures, and revised sentences.',
        'Keep every story tone choice fictional, broad, offline, and guided by an adult.',
        'Choose one visible clue, object action, place signal, gesture, or sound/texture detail so the card has one clear job.',
        'Replace narrow outside facts with made-up story labels before anyone writes.',
        'Send along only blank slips or invented examples with no identity details.',
      ],
    },
    toneRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Tone Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one plain line and two visible choices.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer writes one neutral fictional line on the sticky note: ____________________.',
        'Adult models how a visible clue, object action, place signal, gesture, and sound/texture clue can show the line.',
        'Writer drafts one revised shown sentence on the card: ____________________.',
      ],
    })),
    takeHomeToneSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Tone Slip ${index + 1}`,
      time: showSlipLabels[index],
      skill: toneSkills[index],
      direction: 'Choose one plain fictional line and add one visible clue on paper: ____________________.',
      familyLine: 'A grown-up can ask which clue helps the reader picture the moment: ____________________.',
    })),
    optionalSharePrompts: [
      'Optional adult-led offline prompt: the plain line I changed is ____________________.',
      'Optional adult-led offline prompt: one visible clue from my card is ____________________.',
      'Optional adult-led offline prompt: the invented object action I used is ____________________.',
      'Optional adult-led offline prompt: the pretend place signal I chose is ____________________.',
      'Optional adult-led offline prompt: the character gesture I added is ____________________.',
      'Optional adult-led offline prompt: one paper-safe sound or texture clue is ____________________.',
      'Optional adult-led offline prompt: the revised shown sentence is ____________________.',
      'Optional adult-led offline prompt: an adult can add one broad made-up clue here: ____________________.',
    ],
    cards: showWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, showWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'sticky-note-story-tone-card-pack',
  title: 'Sticky Note Story Tone Card Pack',
  pricePoint: '$65',
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
      premise: 'A friendly invented world for a screen-free story tone card prompt.',
    },
  ]),
)

function writeValidIndexCardShowNotTellLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            toneRoutines: source.toneRoutines,
            takeHomeToneSlips: source.takeHomeToneSlips,
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

describe('Sticky Note Story Tone Card Pack policy', () => {
  it('accepts a valid source with sixteen printable story tone cards', () => {
    expect(validateStickyNoteStoryToneCardPackSource(validIndexCardShowNotTellSource(), product, worldAges)).toEqual([])
  })

  it('rejects a story tone prompt field without a writable blank', () => {
    const source = validIndexCardShowNotTellSource()
    source.cards[0].neutralLinePrompt = 'Plain line: write the told sentence that needs a visible clue.'
    expect(validateStickyNoteStoryToneCardPackSource(source, product, worldAges)).toContain(
      'cards[0].neutralLinePrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validIndexCardShowNotTellSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validateStickyNoteStoryToneCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('rejects scoring language in story tone cards', () => {
    const source = validIndexCardShowNotTellSource()
    source.cards[0].kidDirection = 'Use a scoring pass to rank this detail: ____________________.'
    expect(validateStickyNoteStoryToneCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /score|scoring/i,
    )
  })

  it('requires the standard product safety sentence in the source safety note', () => {
    const source = validIndexCardShowNotTellSource({
      safetyNote:
        'Family-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts.',
    })
    expect(validateStickyNoteStoryToneCardPackSource(source, product, worldAges)).toContain(
      `safetyNote must include ${standardSafety}`,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validIndexCardShowNotTellSource()
    source.takeHomeToneSlips[0].time = '7 minutes'
    expect(validateStickyNoteStoryToneCardPackSource(source, product, worldAges)).toContain(
      'takeHomeToneSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Sticky Note Story Tone Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Sticky Note Story Tone Card Pack',
      ),
    ).toContain('Sticky Note Story Tone Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce story tone cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-sticky-note-tone-source-'))
    const source = validIndexCardShowNotTellSource()
    try {
      writeValidIndexCardShowNotTellLaneFiles(tempRoot, source)
      expect(validateStickyNoteStoryToneCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 46 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-sticky-note-tone-source-path-'))
    const source = validIndexCardShowNotTellSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-sticky-note-tone-cards-a.json'
    try {
      writeValidIndexCardShowNotTellLaneFiles(tempRoot, source)
      expect(validateStickyNoteStoryToneCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 46 story tone-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects cards assigned to the wrong Batch 46 lane file', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-sticky-note-tone-lane-range-'))
    const source = validIndexCardShowNotTellSource()
    try {
      writeValidIndexCardShowNotTellLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards[0] = source.cards[6]
      laneB.cards[0] = source.cards[0]
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      writeFileSync(laneBPath, `${JSON.stringify(laneB, null, 2)}\n`)
      expect(validateStickyNoteStoryToneCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects sticky note story tone artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-sticky-note-tone-artifacts-'))
    const source = validIndexCardShowNotTellSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/sticky-note-story-tone-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK sticky note story tone zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Sticky Note Story Tone Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Sticky Note Story Tone Card Pack\n', { flag: 'wx' })
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
              path: 'product-build/sticky-note-story-tone-card-pack/README.txt',
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
describe('Sticky Note Story Tone Card Pack builder', () => {
  it('renders the printable story tone card HTML with source cards and local world images', () => {
    const source = validIndexCardShowNotTellSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderStickyNoteStoryToneCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Sticky Note Story Tone Card Pack')
    expect(html).toContain('Story Tone Card 1')
    expect(html).toContain('Plain line')
    expect(html).toContain('Take-home tone slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-sticky-note-tone-build-'))
    const source = validIndexCardShowNotTellSource()
    try {
      const output = await buildStickyNoteStoryToneCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'sticky-note-story-tone-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('sticky-note-story-tone-card-pack')
      expect(manifest.productSlug).toBe('sticky-note-story-tone-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildStickyNoteStoryToneCardPack({
        source,
        product,
        worlds,
        buildDir: join(tempRoot, 'product-build', 'sticky-note-story-tone-card-pack'),
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
