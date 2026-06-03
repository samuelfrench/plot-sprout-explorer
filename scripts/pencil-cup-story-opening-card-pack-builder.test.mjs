import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validatePencilCupStoryOpeningCardPackSource,
  validatePencilCupStoryOpeningCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildPencilCupStoryOpeningCardPack,
  renderPencilCupStoryOpeningCardPackHtml,
} from './pencil-cup-story-opening-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const openingWorldAges = {
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

const openingWorldSlugs = Object.keys(openingWorldAges)
const openingSkills = [
  'character arrival',
  'object invitation',
  'place doorway',
  'question hook',
  'sound opening',
  'tiny problem',
  'setting clue',
  'task hook',
  'map start',
  'weather signal',
  'mystery note',
  'time clue',
  'voice start',
  'label reveal',
  'choice hook',
  'promise opening',
]
const openingSlipLabels = [
  'first-line slip',
  'character slip',
  'place slip',
  'object slip',
  'question slip',
  'next-move slip',
  'sound slip',
  'problem slip',
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
    id: `pencil-cup-opening-card-${String(index).padStart(2, '0')}`,
    title: `Pencil Cup Opening Card ${index}`,
    worldSlug,
    ageBand,
    openingSkill: openingSkills[index - 1],
    useCase:
      'Adult-led printable pencil cup opening card for starting one fictional story with a gentle first clue: ____________________.',
    adultSetup:
      'Adult: place one blank opening card beside the pretend pencil cup and keep every choice fictional: ____________________.',
    kidDirection:
      'Choose how the make-believe story starts, then write one opening clue for the reader: ____________________.',
    firstLinePrompt: 'First line: write the first sentence that opens the fictional story: ____________________.',
    characterPrompt: 'Character arrival: name who steps into the opening moment: ____________________.',
    placePrompt: 'Place doorway: choose the broad invented place where the opening begins: ____________________.',
    objectPrompt: 'Object invitation: add one harmless story object from the pencil cup idea: ____________________.',
    questionPrompt: 'Opening question: ask one gentle question that can pull the story forward: ____________________.',
    nextMovePrompt: 'First next move: write what the character tries right after the opening: ____________________.',
    reviseOpeningPrompt: 'Revise opening: make the first clue clearer or more inviting: ____________________.',
    quietOptionLine: 'Quiet option: circle one opening clue and fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: invent one more pencil cup opening for later: ____________________.',
  }
}

function validPencilCupOpeningSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch40',
    generatedAt: '2026-06-03',
    productSlug: 'pencil-cup-story-opening-card-pack',
    title: 'Pencil Cup Story Opening Card Pack',
    pricePoint: '$53',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable opening cards plus adult guide tools, opening routines, take-home opening slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/pencil-cup-story-opening-card-pack/Pencil-Cup-Story-Opening-Card-Pack.pdf',
      zipPath:
        'product-build/pencil-cup-story-opening-card-pack/pencil-cup-story-opening-card-pack.zip',
      sourceHtmlPath:
        'product-build/pencil-cup-story-opening-card-pack/source/pencil-cup-story-opening-card-pack.html',
      manifestPath: 'product-build/pencil-cup-story-opening-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-a.json',
      'content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-b.json',
      'content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-c.json',
      'content/product-artifacts/lanes/batch40-pencil-cup-opening-tools.json',
    ],
    worldSlugs: openingWorldSlugs,
    cover: {
      kicker: 'Printable pencil cup opening cards',
      headline: 'Pencil Cup Story Opening Card Pack',
      subhead:
        'Sixteen paper cards help writers begin fictional stories with first lines, character arrivals, place doorways, object invitations, and opening questions.',
      included: [
        '16 printable pencil cup opening cards',
        'Adult setup guide',
        'Fictional opening safety notes',
        'Pencil cup opening coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led opening routines',
        'Ten take-home opening slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the opening cards, blank slips, and adult guide before the writer arrives.',
        'Place one pretend pencil cup card where the adult can see every choice.',
        'Choose one opening routine and one fictional world before writers begin.',
        'Keep the activity offline, paper-only, and adult-led.',
        'Explain that every opening is invented for a story page.',
      ],
      pencilCupOpeningSetup: [
        'Place one blank opening card beside the pretend pencil cup.',
        'Ask for one first line, one character arrival, one place doorway, and one object invitation.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the card back for first line, character, place, object, question, first move, and revision notes.',
      ],
      openingCoaching: [
        'Ask what the reader sees first before asking what happens next.',
        'Ask the writer to keep the opening broad, invented, and useful to the story.',
        'Point to the character, place, object, and question boxes when an opening feels stuck.',
        'If the opening feels flat, add one invented sound, object, or first move on paper.',
        'Finish by reading the first line, character, place, object, question, first move, and revision once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, and broad story labels for every opening.',
        'Use broad pretend story words instead of narrow real-world facts.',
        'Keep every opening card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for narrow real-world facts before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle fictional opening is enough for one story start.',
        'Invite praise for one clear first line, character arrival, object invitation, or revision.',
        'Ask adults to keep narrow real-world facts off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused opening cards and blank pencil cup slips.',
        'Check finished pages for narrow real-world facts before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh opening cards.',
      ],
    },
    openingRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Opening Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional opening choices.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer chooses whether to fill the first line or character arrival first.',
        'Adult models how place doorway, object invitation, and opening question make a start usable.',
        'Writer drafts one short first line, character, place, object, question, first move, or revision on the card.',
      ],
    })),
    takeHomeOpeningSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Opening Slip ${index + 1}`,
      time: openingSlipLabels[index],
      skill: openingSkills[index],
      direction: 'Choose one fictional opening clue and one pretend pencil cup object: ____________________.',
      familyLine: 'A grown-up can ask what the reader sees in the first line: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented first line if you choose: ____________________.',
      'Show one sketched pencil cup object from the card: ____________________.',
      'Name one character arrival without narrow real-world facts: ____________________.',
      'Share one harmless story object you want to introduce: ____________________.',
      'Point to one opening question that helped the start: ____________________.',
      'Ask an adult to read your favorite fictional opening line: ____________________.',
      'Circle one opening detail you want to keep broad: ____________________.',
      'Choose one pencil cup opening for later: ____________________.',
    ],
    cards: openingWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, openingWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'pencil-cup-story-opening-card-pack',
  title: 'Pencil Cup Story Opening Card Pack',
  pricePoint: '$53',
  status: 'checkout_pending',
  worldSlugs: openingWorldSlugs,
  worldSummaries: openingWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(openingWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: openingWorldAges[worldSlug] }]))

const worlds = new Map(
  openingWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: openingWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free opening card prompt.',
    },
  ]),
)

function writeValidPencilCupOpeningLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            openingRoutines: source.openingRoutines,
            takeHomeOpeningSlips: source.takeHomeOpeningSlips,
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

describe('Pencil Cup Story Opening Card Pack policy', () => {
  it('accepts a valid source with sixteen printable opening cards', () => {
    expect(validatePencilCupStoryOpeningCardPackSource(validPencilCupOpeningSource(), product, worldAges)).toEqual([])
  })

  it('rejects an opening prompt field without a writable blank', () => {
    const source = validPencilCupOpeningSource()
    source.cards[0].firstLinePrompt = 'First line: write the first sentence that opens the fictional story.'
    expect(validatePencilCupStoryOpeningCardPackSource(source, product, worldAges)).toContain(
      'cards[0].firstLinePrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validPencilCupOpeningSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validatePencilCupStoryOpeningCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validPencilCupOpeningSource()
    source.takeHomeOpeningSlips[0].time = '7 minutes'
    expect(validatePencilCupStoryOpeningCardPackSource(source, product, worldAges)).toContain(
      'takeHomeOpeningSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Pencil Cup Story Opening Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Pencil Cup Story Opening Card Pack',
      ),
    ).toContain('Pencil Cup Story Opening Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce opening cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-pencil-cup-opening-source-'))
    const source = validPencilCupOpeningSource()
    try {
      writeValidPencilCupOpeningLaneFiles(tempRoot, source)
      expect(validatePencilCupStoryOpeningCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 40 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-pencil-cup-opening-source-path-'))
    const source = validPencilCupOpeningSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-pencil-cup-opening-cards-a.json'
    try {
      writeValidPencilCupOpeningLaneFiles(tempRoot, source)
      expect(validatePencilCupStoryOpeningCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 40 opening-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects pencil cup opening artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-pencil-cup-opening-artifacts-'))
    const source = validPencilCupOpeningSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/pencil-cup-story-opening-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK pencil cup opening zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Pencil Cup Story Opening Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Pencil Cup Story Opening Card Pack\n', { flag: 'wx' })
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
              path: 'product-build/pencil-cup-story-opening-card-pack/README.txt',
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
describe('Pencil Cup Story Opening Card Pack builder', () => {
  it('renders the printable opening card HTML with source cards and local world images', () => {
    const source = validPencilCupOpeningSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderPencilCupStoryOpeningCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Pencil Cup Story Opening Card Pack')
    expect(html).toContain('Opening Card 1')
    expect(html).toContain('First line')
    expect(html).toContain('Take-home opening slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-pencil-cup-opening-build-'))
    try {
      const output = await buildPencilCupStoryOpeningCardPack({
        buildDir: join(tempRoot, 'product-build', 'pencil-cup-story-opening-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('pencil-cup-story-opening-card-pack')
      expect(manifest.productSlug).toBe('pencil-cup-story-opening-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildPencilCupStoryOpeningCardPack({
        buildDir: join(tempRoot, 'product-build', 'pencil-cup-story-opening-card-pack'),
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
