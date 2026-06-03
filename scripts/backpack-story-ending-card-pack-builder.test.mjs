import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateBackpackStoryEndingCardPackSource,
  validateBackpackStoryEndingCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildBackpackStoryEndingCardPack,
  renderBackpackStoryEndingCardPackHtml,
} from './backpack-story-ending-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const endingWorldAges = {
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

const endingWorldSlugs = Object.keys(endingWorldAges)
const endingSkills = [
  'choice ending',
  'feeling ending',
  'object return',
  'question echo',
  'promise line',
  'small surprise',
  'lesson clue',
  'next-day hint',
  'thank-you ending',
  'closing-image ending',
  'revision ending',
  'closing image',
]
const endingSlipLabels = [
  'choice slip',
  'feeling slip',
  'object-return slip',
  'echo slip',
  'promise slip',
  'surprise slip',
  'lesson slip',
  'next-day slip',
  'thank-you slip',
  'closing-image slip',
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
    id: `backpack-ending-card-${String(index).padStart(2, '0')}`,
    title: `Backpack Ending Card ${index}`,
    worldSlug,
    ageBand,
    endingSkill: endingSkills[(index - 1) % endingSkills.length],
    useCase:
      'Adult-led printable backpack ending card for closing one fictional story with a gentle final choice: ____________________.',
    adultSetup:
      'Adult: place one blank ending card beside the pretend backpack pocket and keep every choice fictional: ____________________.',
    kidDirection:
      'Choose how the make-believe story closes, then write one final clue for the reader: ____________________.',
    endingChoicePrompt: 'Ending choice: decide what the character chooses on the final page: ____________________.',
    feelingPrompt: 'Final feeling: name the gentle feeling the ending leaves behind: ____________________.',
    objectReturnPrompt: 'Object return: bring back one harmless story object from earlier: ____________________.',
    echoPrompt: 'Echo line: repeat or change one friendly idea from the beginning: ____________________.',
    finalLinePrompt: 'Final line: write one short closing sentence for the fictional story: ____________________.',
    reviseEndingPrompt: 'Revise ending: make the final choice clearer or kinder: ____________________.',
    quietOptionLine: 'Quiet option: circle one ending choice and fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: invent one more backpack ending for later: ____________________.',
  }
}

function validBackpackEndingSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch39',
    generatedAt: '2026-06-03',
    productSlug: 'backpack-story-ending-card-pack',
    title: 'Backpack Story Ending Card Pack',
    pricePoint: '$51',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable ending cards plus adult guide tools, ending routines, take-home ending slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/backpack-story-ending-card-pack/Backpack-Story-Ending-Card-Pack.pdf',
      zipPath:
        'product-build/backpack-story-ending-card-pack/backpack-story-ending-card-pack.zip',
      sourceHtmlPath:
        'product-build/backpack-story-ending-card-pack/source/backpack-story-ending-card-pack.html',
      manifestPath: 'product-build/backpack-story-ending-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch39-backpack-ending-cards-a.json',
      'content/product-artifacts/lanes/batch39-backpack-ending-cards-b.json',
      'content/product-artifacts/lanes/batch39-backpack-ending-cards-c.json',
      'content/product-artifacts/lanes/batch39-backpack-ending-tools.json',
    ],
    worldSlugs: endingWorldSlugs,
    cover: {
      kicker: 'Printable backpack ending cards',
      headline: 'Backpack Story Ending Card Pack',
      subhead:
        'Sixteen paper cards help writers close fictional stories with choices, feelings, object returns, echo lines, and final images.',
      included: [
        '16 printable backpack ending cards',
        'Adult setup guide',
        'Fictional ending safety notes',
        'Backpack ending coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led ending routines',
        'Ten take-home ending slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the ending cards, blank slips, and adult guide before the writer arrives.',
        'Place one pretend backpack pocket card where the adult can see every choice.',
        'Choose one ending routine and one fictional world before writers begin.',
        'Keep the activity offline, paper-only, and adult-led.',
        'Explain that every ending is invented for a story page.',
      ],
      backpackEndingSetup: [
        'Place one blank ending card beside the pretend backpack pocket.',
        'Ask for one final choice, one feeling, one object return, and one echo line.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the card back for choice, feeling, object, echo, final line, and revision notes.',
      ],
      endingCoaching: [
        'Ask what changed before asking what lesson the character learned.',
        'Ask the writer to keep the ending broad, invented, and useful to the story.',
        'Point to the object return and echo boxes when an ending feels sudden.',
        'If the ending feels flat, add one invented object or final image on paper.',
        'Finish by reading the choice, feeling, echo, final line, and revision once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, and broad story labels for every ending.',
        'Use broad pretend story words instead of narrow real-world facts.',
        'Keep every ending card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for narrow real-world facts before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle fictional ending is enough for one story close.',
        'Invite praise for one clear final choice, object return, echo line, or revision.',
        'Ask adults to keep narrow real-world facts off the page.',
        'Suggest saving the card as a closer for a later printable story.',
      ],
      reset: [
        'Collect unused ending cards and blank backpack slips.',
        'Check finished pages for narrow real-world facts before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh ending cards.',
      ],
    },
    endingRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Ending Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional ending choices.',
      steps: [
        'Adult chooses one broad invented story close and reads the paper-only reminder.',
        'Writer chooses whether to fill the final choice or final feeling first.',
        'Adult models how object return, echo line, and final image make an ending usable.',
        'Writer drafts one short choice, feeling, object, echo, final line, or revision on the card.',
      ],
    })),
    takeHomeEndingSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Ending Slip ${index + 1}`,
      time: endingSlipLabels[index],
      skill: endingSkills[index % endingSkills.length],
      direction: 'Choose one fictional ending choice and one pretend backpack clue: ____________________.',
      familyLine: 'A grown-up can ask what changed by the final line: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented final choice if you choose: ____________________.',
      'Show one sketched object return from the card: ____________________.',
      'Name one final feeling without narrow real-world facts: ____________________.',
      'Share one harmless story object you want to bring back: ____________________.',
      'Point to one echo line that helped the ending: ____________________.',
      'Ask an adult to read your favorite fictional closing line: ____________________.',
      'Circle one ending detail you want to keep broad: ____________________.',
      'Choose one backpack ending for later: ____________________.',
    ],
    cards: endingWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, endingWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'backpack-story-ending-card-pack',
  title: 'Backpack Story Ending Card Pack',
  pricePoint: '$51',
  status: 'checkout_pending',
  worldSlugs: endingWorldSlugs,
  worldSummaries: endingWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(endingWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: endingWorldAges[worldSlug] }]))

const worlds = new Map(
  endingWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: endingWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free ending card prompt.',
    },
  ]),
)

function writeValidBackpackEndingLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            endingRoutines: source.endingRoutines,
            takeHomeEndingSlips: source.takeHomeEndingSlips,
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

describe('Backpack Story Ending Card Pack policy', () => {
  it('accepts a valid source with sixteen printable ending cards', () => {
    expect(validateBackpackStoryEndingCardPackSource(validBackpackEndingSource(), product, worldAges)).toEqual([])
  })

  it('rejects an ending prompt field without a writable blank', () => {
    const source = validBackpackEndingSource()
    source.cards[0].endingChoicePrompt = 'Ending choice: decide what the character chooses on the final page.'
    expect(validateBackpackStoryEndingCardPackSource(source, product, worldAges)).toContain(
      'cards[0].endingChoicePrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validBackpackEndingSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validateBackpackStoryEndingCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validBackpackEndingSource()
    source.takeHomeEndingSlips[0].time = '7 minutes'
    expect(validateBackpackStoryEndingCardPackSource(source, product, worldAges)).toContain(
      'takeHomeEndingSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Backpack Story Ending Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Backpack Story Ending Card Pack',
      ),
    ).toContain('Backpack Story Ending Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce ending cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-backpack-ending-source-'))
    const source = validBackpackEndingSource()
    try {
      writeValidBackpackEndingLaneFiles(tempRoot, source)
      expect(validateBackpackStoryEndingCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 39 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-backpack-ending-source-path-'))
    const source = validBackpackEndingSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-backpack-ending-cards-a.json'
    try {
      writeValidBackpackEndingLaneFiles(tempRoot, source)
      expect(validateBackpackStoryEndingCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 39 ending-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects source lane id drift', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-backpack-ending-source-laneid-'))
    const source = validBackpackEndingSource()
    const badLanePath = 'content/product-artifacts/lanes/batch39-backpack-ending-cards-b.json'
    try {
      writeValidBackpackEndingLaneFiles(tempRoot, source, {
        [badLanePath]: 'batch39-backpack-ending-cards-copy',
      })
      expect(validateBackpackStoryEndingCardPackSourceFiles(source, tempRoot)).toContain(
        `${badLanePath}.laneId must be batch39-backpack-ending-cards-b.`,
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects backpack ending artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-backpack-ending-artifacts-'))
    const source = validBackpackEndingSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/backpack-story-ending-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK backpack ending zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Backpack Story Ending Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Backpack Story Ending Card Pack\n', { flag: 'wx' })
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
              path: 'product-build/backpack-story-ending-card-pack/README.txt',
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

describe('Backpack Story Ending Card Pack builder', () => {
  it('renders the printable ending card HTML with source cards and local world images', () => {
    const source = validBackpackEndingSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderBackpackStoryEndingCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Backpack Story Ending Card Pack')
    expect(html).toContain('Ending Card 1')
    expect(html).toContain('Ending choice')
    expect(html).toContain('Take-home ending slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-backpack-ending-build-'))
    try {
      const output = await buildBackpackStoryEndingCardPack({
        buildDir: join(tempRoot, 'product-build', 'backpack-story-ending-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('backpack-story-ending-card-pack')
      expect(manifest.productSlug).toBe('backpack-story-ending-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildBackpackStoryEndingCardPack({
        buildDir: join(tempRoot, 'product-build', 'backpack-story-ending-card-pack'),
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
