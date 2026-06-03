import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateIndexCardStoryShowNotTellCardPackSource,
  validateIndexCardStoryShowNotTellCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildIndexCardStoryShowNotTellCardPack,
  renderIndexCardStoryShowNotTellCardPackHtml,
} from './index-card-story-show-not-tell-card-pack-builder.mjs'

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
const showSkills = [
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
    id: `index-card-show-not-tell-card-${String(index).padStart(2, '0')}`,
    title: `Index Card Show-Not-Tell Card ${index}`,
    worldSlug,
    ageBand,
    showSkill: showSkills[index - 1],
    useCase:
      'Adult-led printable index card show-not-tell card for changing one plain fictional line into a visible story moment: ____________________.',
    adultSetup:
      'Adult: place one blank index card beside the printable card and keep every choice fictional: ____________________.',
    kidDirection:
      'Writer: Start with the plain line, then show it with one visible fictional clue: ____________________.',
    plainLinePrompt: 'Plain line: write the simple told sentence you want to change: ____________________.',
    visibleCluePrompt: 'Visible clue: show the idea with one invented thing the reader can picture: ____________________.',
    objectActionPrompt: 'Object action: let a harmless story object move, shift, tilt, or change: ____________________.',
    placeSignalPrompt: 'Place signal: make the pretend setting give one broad clue about the moment: ____________________.',
    characterGesturePrompt: 'Character gesture: show the character choice with one gentle paper-safe move: ____________________.',
    soundOrTexturePrompt: 'Sound or texture: add one pretend sound, surface, or touch clue without tasting: ____________________.',
    sentenceFramePrompt: 'Sentence frame: The reader can tell what is happening because: ____________________.',
    reviseShowPrompt: 'Revise show-not-tell: replace the plain line with the clearest visible clue: ____________________.',
    quietOptionLine: 'Quiet option: underline one visible clue and fill one index-card blank: ____________________.',
    takeHomeLine: 'Take-home line: turn another plain fictional line into one shown clue: ____________________.',
  }
}

function validIndexCardShowNotTellSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch45',
    generatedAt: '2026-06-03',
    productSlug: 'index-card-story-show-not-tell-card-pack',
    title: 'Index Card Story Show-Not-Tell Card Pack',
    pricePoint: '$63',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable show-not-tell cards plus adult guide tools, show-not-tell routines, take-home show slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/index-card-story-show-not-tell-card-pack/Index-Card-Story-Show-Not-Tell-Card-Pack.pdf',
      zipPath:
        'product-build/index-card-story-show-not-tell-card-pack/index-card-story-show-not-tell-card-pack.zip',
      sourceHtmlPath:
        'product-build/index-card-story-show-not-tell-card-pack/source/index-card-story-show-not-tell-card-pack.html',
      manifestPath: 'product-build/index-card-story-show-not-tell-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-a.json',
      'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-b.json',
      'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-c.json',
      'content/product-artifacts/lanes/batch45-index-card-show-not-tell-tools.json',
    ],
    worldSlugs: showWorldSlugs,
    cover: {
      kicker: 'Printable index card show-not-tell cards',
      headline: 'Index Card Story Show-Not-Tell Card Pack',
      subhead:
        'Sixteen paper cards help writers turn plain fictional lines into visible story clues, object actions, place signals, and revised sentences.',
      included: [
        '16 printable index card show-not-tell cards',
        'Adult setup guide',
        'Fictional show-not-tell safety notes',
        'Index card coaching moves',
        'Family handoff notes',
        'Pack reset notes',
        'Six adult-led show-not-tell routines',
        'Ten take-home show slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Index Card Show-Not-Tell Card Adult Guide',
      bullets: [
        'Print the show-not-tell cards, blank slips, and guide before the adult-led paper session.',
        'Use fictional index cards as paper props for plain lines, visible clues, object actions, and revised sentences.',
        'Keep every show-not-tell choice fictional, broad, offline, and guided by an adult.',
        'Choose one visible clue, object action, place signal, gesture, or sound/texture detail so the card has one clear job.',
        'Replace narrow outside facts with made-up story labels before anyone writes.',
        'Send along only blank slips or invented examples with no identity details.',
      ],
    },
    showRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Show Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one plain line and two visible choices.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer writes one plain fictional line on the index card: ____________________.',
        'Adult models how a visible clue, object action, place signal, gesture, and sound/texture clue can show the line.',
        'Writer drafts one revised shown sentence on the card: ____________________.',
      ],
    })),
    takeHomeShowSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Show Slip ${index + 1}`,
      time: showSlipLabels[index],
      skill: showSkills[index],
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
  slug: 'index-card-story-show-not-tell-card-pack',
  title: 'Index Card Story Show-Not-Tell Card Pack',
  pricePoint: '$63',
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
      premise: 'A friendly invented world for a screen-free show-not-tell card prompt.',
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
            showRoutines: source.showRoutines,
            takeHomeShowSlips: source.takeHomeShowSlips,
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

describe('Index Card Story Show-Not-Tell Card Pack policy', () => {
  it('accepts a valid source with sixteen printable show-not-tell cards', () => {
    expect(validateIndexCardStoryShowNotTellCardPackSource(validIndexCardShowNotTellSource(), product, worldAges)).toEqual([])
  })

  it('rejects a show-not-tell prompt field without a writable blank', () => {
    const source = validIndexCardShowNotTellSource()
    source.cards[0].plainLinePrompt = 'Plain line: write the told sentence that needs a visible clue.'
    expect(validateIndexCardStoryShowNotTellCardPackSource(source, product, worldAges)).toContain(
      'cards[0].plainLinePrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validIndexCardShowNotTellSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validateIndexCardStoryShowNotTellCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('rejects scoring language in show-not-tell cards', () => {
    const source = validIndexCardShowNotTellSource()
    source.cards[0].kidDirection = 'Use a scoring pass to rank this detail: ____________________.'
    expect(validateIndexCardStoryShowNotTellCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /score|scoring/i,
    )
  })

  it('requires the standard product safety sentence in the source safety note', () => {
    const source = validIndexCardShowNotTellSource({
      safetyNote:
        'Family-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts.',
    })
    expect(validateIndexCardStoryShowNotTellCardPackSource(source, product, worldAges)).toContain(
      `safetyNote must include ${standardSafety}`,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validIndexCardShowNotTellSource()
    source.takeHomeShowSlips[0].time = '7 minutes'
    expect(validateIndexCardStoryShowNotTellCardPackSource(source, product, worldAges)).toContain(
      'takeHomeShowSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Index Card Story Show-Not-Tell Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Index Card Story Show-Not-Tell Card Pack',
      ),
    ).toContain('Index Card Story Show-Not-Tell Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce show-not-tell cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-index-card-show-not-tell-source-'))
    const source = validIndexCardShowNotTellSource()
    try {
      writeValidIndexCardShowNotTellLaneFiles(tempRoot, source)
      expect(validateIndexCardStoryShowNotTellCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 45 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-index-card-show-not-tell-source-path-'))
    const source = validIndexCardShowNotTellSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-index-card-show-not-tell-cards-a.json'
    try {
      writeValidIndexCardShowNotTellLaneFiles(tempRoot, source)
      expect(validateIndexCardStoryShowNotTellCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 45 show-not-tell-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects cards assigned to the wrong Batch 45 lane file', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-index-card-show-not-tell-lane-range-'))
    const source = validIndexCardShowNotTellSource()
    try {
      writeValidIndexCardShowNotTellLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards[0] = source.cards[6]
      laneB.cards[0] = source.cards[0]
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      writeFileSync(laneBPath, `${JSON.stringify(laneB, null, 2)}\n`)
      expect(validateIndexCardStoryShowNotTellCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects index card show-not-tell artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-index-card-show-not-tell-artifacts-'))
    const source = validIndexCardShowNotTellSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/index-card-story-show-not-tell-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK index card show-not-tell zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Index Card Story Show-Not-Tell Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Index Card Story Show-Not-Tell Card Pack\n', { flag: 'wx' })
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
              path: 'product-build/index-card-story-show-not-tell-card-pack/README.txt',
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
describe('Index Card Story Show-Not-Tell Card Pack builder', () => {
  it('renders the printable show-not-tell card HTML with source cards and local world images', () => {
    const source = validIndexCardShowNotTellSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderIndexCardStoryShowNotTellCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Index Card Story Show-Not-Tell Card Pack')
    expect(html).toContain('Show-Not-Tell Card 1')
    expect(html).toContain('Plain line')
    expect(html).toContain('Take-home show slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-index-card-show-not-tell-build-'))
    try {
      const output = await buildIndexCardStoryShowNotTellCardPack({
        buildDir: join(tempRoot, 'product-build', 'index-card-story-show-not-tell-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('index-card-story-show-not-tell-card-pack')
      expect(manifest.productSlug).toBe('index-card-story-show-not-tell-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildIndexCardStoryShowNotTellCardPack({
        buildDir: join(tempRoot, 'product-build', 'index-card-story-show-not-tell-card-pack'),
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
