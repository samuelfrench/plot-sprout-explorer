import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validatePaperClipStorySolutionCardPackSource,
  validatePaperClipStorySolutionCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildPaperClipStorySolutionCardPack,
  renderPaperClipStorySolutionCardPackHtml,
} from './paper-clip-story-solution-card-pack-builder.mjs'

const standardSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'
const safety = standardSafety

const solutionWorldAges = {
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

const solutionWorldSlugs = Object.keys(solutionWorldAges)
const solutionSkills = [
  'choosing a small solution step',
  'noticing a missing clue',
  'matching need to action',
  'asking the solution question',
  'tiny weather mismatch',
  'clear first try',
  'setting pressure',
  'task mix-up',
  'map mismatch',
  'signal mismatch',
  'message gap',
  'sequence solution',
  'revision target',
  'label clue solution',
  'choice obstacle',
  'promise solution',
]
const solutionSlipLabels = [
  'first-line slip',
  'character slip',
  'place slip',
  'object slip',
  'question slip',
  'next-move slip',
  'sound slip',
  'solution slip',
  'voice slip',
  'revision slip',
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
    id: `paper-clip-solution-card-${String(index).padStart(2, '0')}`,
    title: `Paper Clip Solution Card ${index}`,
    worldSlug,
    ageBand,
    solutionSkill: solutionSkills[index - 1],
    useCase:
      'Adult-led printable paper clip solution card for shaping one fictional story solution from a gentle first choice: ____________________.',
    adultSetup:
      'Adult: place one blank solution card beside the pretend paper clip and keep every choice fictional: ____________________.',
    kidDirection:
      'Spot the make-believe story need, then write one clue that makes the next choice clear: ____________________.',
    solutionStepPrompt: 'Solution step: write the small fictional solution the character tries first: ____________________.',
    characterChoicePrompt: 'Character need: name what the invented character wants or needs next: ____________________.',
    placeCluePrompt: 'Place clue: choose the broad invented place detail that makes the solution matter: ____________________.',
    objectUsePrompt: 'Object trouble: add one harmless story object from the paper clip idea: ____________________.',
    solutionQuestionPrompt: 'Solution question: ask one gentle question that can pull the story forward: ____________________.',
    firstStepPrompt: 'First step: write what the character tries first to understand the solution: ____________________.',
    reviseSolutionPrompt: 'Revise solution: make the answer smaller, clearer, or more useful to the story: ____________________.',
    quietOptionLine: 'Quiet option: circle one solution clue and fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: invent one more paper clip solution for later: ____________________.',
  }
}

function validPaperClipSolutionSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch42',
    generatedAt: '2026-06-03',
    productSlug: 'paper-clip-story-solution-card-pack',
    title: 'Paper Clip Story Solution Card Pack',
    pricePoint: '$57',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable solution cards plus adult guide tools, solution routines, take-home solution slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/paper-clip-story-solution-card-pack/Paper-Clip-Story-Solution-Card-Pack.pdf',
      zipPath:
        'product-build/paper-clip-story-solution-card-pack/paper-clip-story-solution-card-pack.zip',
      sourceHtmlPath:
        'product-build/paper-clip-story-solution-card-pack/source/paper-clip-story-solution-card-pack.html',
      manifestPath: 'product-build/paper-clip-story-solution-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch42-paper-clip-solution-cards-a.json',
      'content/product-artifacts/lanes/batch42-paper-clip-solution-cards-b.json',
      'content/product-artifacts/lanes/batch42-paper-clip-solution-cards-c.json',
      'content/product-artifacts/lanes/batch42-paper-clip-solution-tools.json',
    ],
    worldSlugs: solutionWorldSlugs,
    cover: {
      kicker: 'Printable paper clip solution cards',
      headline: 'Paper Clip Story Solution Card Pack',
      subhead:
        'Sixteen paper cards help writers begin fictional stories with first lines, character arrivals, place doorways, object invitations, and solution questions.',
      included: [
        '16 printable paper clip solution cards',
        'Adult setup guide',
        'Fictional solution safety notes',
        'Paper clip solution coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led solution routines',
        'Ten take-home solution slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the solution cards, blank slips, and adult guide before the writer arrives.',
        'Place one pretend paper clip card where the adult can see every choice.',
        'Choose one solution routine and one fictional world before writers begin.',
        'Keep the activity offline, paper-only, and adult-led.',
        'Explain that every solution is invented for a story page.',
      ],
      paperClipSolutionSetup: [
        'Place one blank solution card beside the pretend paper clip.',
        'Ask for one solution step, one character need, one place pressure, and one object trouble.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the card back for solution step, character need, place pressure, object trouble, question, first try, and revision notes.',
      ],
      solutionCoaching: [
        'Ask what the character notices first before asking what happens next.',
        'Ask the writer to keep the solution broad, invented, and useful to the story.',
        'Point to the solution step, character need, place pressure, object trouble, and question boxes when a solution feels stuck.',
        'If the solution feels flat, add one invented mismatch, object, or first try on paper.',
        'Finish by reading the solution step, character need, place pressure, object trouble, question, first try, and revision once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, and broad story labels for every solution.',
        'Use broad pretend story words instead of narrow real-world facts.',
        'Keep every solution card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for narrow real-world facts before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle fictional solution is enough for one story page.',
        'Invite praise for one clear solution step, character need, object trouble, or revision.',
        'Ask adults to keep narrow real-world facts off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused solution cards and blank paper clip slips.',
        'Check finished pages for narrow real-world facts before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh solution cards.',
      ],
    },
    solutionRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Solution Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional solution choices.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer chooses whether to fill the solution step or character need first.',
        'Adult models how place pressure, object trouble, and a solution question make the obstacle usable.',
        'Writer drafts one short solution step, character need, place pressure, object trouble, question, first try, or revision on the card.',
      ],
    })),
    takeHomeSolutionSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Solution Slip ${index + 1}`,
      time: solutionSlipLabels[index],
      skill: solutionSkills[index],
      direction: 'Choose one fictional solution clue and one pretend paper clip object: ____________________.',
      familyLine: 'A grown-up can ask what the character notices first: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented solution step if you choose: ____________________.',
      'Show one sketched paper clip object from the card: ____________________.',
      'Name one character need without narrow real-world facts: ____________________.',
      'Share one harmless story object that makes the solution clearer: ____________________.',
      'Point to one solution question that helped the start: ____________________.',
      'Ask an adult to read your favorite fictional solution clue: ____________________.',
      'Circle one solution detail you want to keep broad: ____________________.',
      'Choose one paper clip solution for later: ____________________.',
    ],
    cards: solutionWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, solutionWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'paper-clip-story-solution-card-pack',
  title: 'Paper Clip Story Solution Card Pack',
  pricePoint: '$57',
  status: 'checkout_pending',
  worldSlugs: solutionWorldSlugs,
  worldSummaries: solutionWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(solutionWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: solutionWorldAges[worldSlug] }]))

const worlds = new Map(
  solutionWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: solutionWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free solution card prompt.',
    },
  ]),
)

function writeValidPaperClipSolutionLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            solutionRoutines: source.solutionRoutines,
            takeHomeSolutionSlips: source.takeHomeSolutionSlips,
            optionalSharePrompts: source.optionalSharePrompts,
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

describe('Paper Clip Story Solution Card Pack policy', () => {
  it('accepts a valid source with sixteen printable solution cards', () => {
    expect(validatePaperClipStorySolutionCardPackSource(validPaperClipSolutionSource(), product, worldAges)).toEqual([])
  })

  it('rejects a solution prompt field without a writable blank', () => {
    const source = validPaperClipSolutionSource()
    source.cards[0].solutionStepPrompt = 'Solution step: write the small fictional solution the character tries first.'
    expect(validatePaperClipStorySolutionCardPackSource(source, product, worldAges)).toContain(
      'cards[0].solutionStepPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validPaperClipSolutionSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validatePaperClipStorySolutionCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('requires the standard product safety sentence in the source safety note', () => {
    const source = validPaperClipSolutionSource({
      safetyNote:
        'Family-safe fictional solutions only; paper-only adult-led work with broad invented labels and no narrow personal facts.',
    })
    expect(validatePaperClipStorySolutionCardPackSource(source, product, worldAges)).toContain(
      `safetyNote must include ${standardSafety}`,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validPaperClipSolutionSource()
    source.takeHomeSolutionSlips[0].time = '7 minutes'
    expect(validatePaperClipStorySolutionCardPackSource(source, product, worldAges)).toContain(
      'takeHomeSolutionSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Paper Clip Story Solution Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Paper Clip Story Solution Card Pack',
      ),
    ).toContain('Paper Clip Story Solution Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce solution cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-clip-solution-source-'))
    const source = validPaperClipSolutionSource()
    try {
      writeValidPaperClipSolutionLaneFiles(tempRoot, source)
      expect(validatePaperClipStorySolutionCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 42 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-clip-solution-source-path-'))
    const source = validPaperClipSolutionSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-paper-clip-solution-cards-a.json'
    try {
      writeValidPaperClipSolutionLaneFiles(tempRoot, source)
      expect(validatePaperClipStorySolutionCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 42 solution-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects paper clip solution artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-clip-solution-artifacts-'))
    const source = validPaperClipSolutionSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/paper-clip-story-solution-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK paper clip solution zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Paper Clip Story Solution Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Paper Clip Story Solution Card Pack\n', { flag: 'wx' })
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
              path: 'product-build/paper-clip-story-solution-card-pack/README.txt',
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
describe('Paper Clip Story Solution Card Pack builder', () => {
  it('renders the printable solution card HTML with source cards and local world images', () => {
    const source = validPaperClipSolutionSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderPaperClipStorySolutionCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Paper Clip Story Solution Card Pack')
    expect(html).toContain('Solution Card 1')
    expect(html).toContain('Solution step')
    expect(html).toContain('Take-home solution slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-clip-solution-build-'))
    try {
      const output = await buildPaperClipStorySolutionCardPack({
        buildDir: join(tempRoot, 'product-build', 'paper-clip-story-solution-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('paper-clip-story-solution-card-pack')
      expect(manifest.productSlug).toBe('paper-clip-story-solution-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildPaperClipStorySolutionCardPack({
        buildDir: join(tempRoot, 'product-build', 'paper-clip-story-solution-card-pack'),
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
