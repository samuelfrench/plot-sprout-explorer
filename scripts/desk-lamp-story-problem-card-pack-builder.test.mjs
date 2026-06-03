import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateDeskLampStoryProblemCardPackSource,
  validateDeskLampStoryProblemCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildDeskLampStoryProblemCardPack,
  renderDeskLampStoryProblemCardPackHtml,
} from './desk-lamp-story-problem-card-pack-builder.mjs'

const standardSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'
const safety = standardSafety

const problemWorldAges = {
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

const problemWorldSlugs = Object.keys(problemWorldAges)
const problemSkills = [
  'spotting a small problem',
  'noticing a missing clue',
  'matching need to action',
  'asking the problem question',
  'tiny weather mismatch',
  'clear first try',
  'setting pressure',
  'task mix-up',
  'map mismatch',
  'signal mismatch',
  'message gap',
  'sequence problem',
  'revision target',
  'label clue problem',
  'choice obstacle',
  'promise problem',
]
const problemSlipLabels = [
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
    id: `desk-lamp-problem-card-${String(index).padStart(2, '0')}`,
    title: `Desk Lamp Problem Card ${index}`,
    worldSlug,
    ageBand,
    problemSkill: problemSkills[index - 1],
    useCase:
      'Adult-led printable desk lamp problem card for shaping one fictional story problem from a gentle first clue: ____________________.',
    adultSetup:
      'Adult: place one blank problem card beside the pretend desk lamp and keep every choice fictional: ____________________.',
    kidDirection:
      'Spot the make-believe story problem, then write one clue that makes the next choice clear: ____________________.',
    problemSpotPrompt: 'Problem spot: write the small fictional problem the character notices first: ____________________.',
    characterNeedPrompt: 'Character need: name what the invented character wants or needs next: ____________________.',
    placePressurePrompt: 'Place pressure: choose the broad invented place detail that makes the problem matter: ____________________.',
    objectTroublePrompt: 'Object trouble: add one harmless story object from the desk lamp idea: ____________________.',
    questionPrompt: 'Problem question: ask one gentle question that can pull the story forward: ____________________.',
    firstTryPrompt: 'First try: write what the character tries first to understand the problem: ____________________.',
    reviseProblemPrompt: 'Revise problem: make the obstacle smaller, clearer, or more useful to the story: ____________________.',
    quietOptionLine: 'Quiet option: circle one problem clue and fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: invent one more desk lamp problem for later: ____________________.',
  }
}

function validDeskLampProblemSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch41',
    generatedAt: '2026-06-03',
    productSlug: 'desk-lamp-story-problem-card-pack',
    title: 'Desk Lamp Story Problem Card Pack',
    pricePoint: '$55',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable problem cards plus adult guide tools, problem routines, take-home problem slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/desk-lamp-story-problem-card-pack/Desk-Lamp-Story-Problem-Card-Pack.pdf',
      zipPath:
        'product-build/desk-lamp-story-problem-card-pack/desk-lamp-story-problem-card-pack.zip',
      sourceHtmlPath:
        'product-build/desk-lamp-story-problem-card-pack/source/desk-lamp-story-problem-card-pack.html',
      manifestPath: 'product-build/desk-lamp-story-problem-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch41-desk-lamp-problem-cards-a.json',
      'content/product-artifacts/lanes/batch41-desk-lamp-problem-cards-b.json',
      'content/product-artifacts/lanes/batch41-desk-lamp-problem-cards-c.json',
      'content/product-artifacts/lanes/batch41-desk-lamp-problem-tools.json',
    ],
    worldSlugs: problemWorldSlugs,
    cover: {
      kicker: 'Printable desk lamp problem cards',
      headline: 'Desk Lamp Story Problem Card Pack',
      subhead:
        'Sixteen paper cards help writers begin fictional stories with first lines, character arrivals, place doorways, object invitations, and problem questions.',
      included: [
        '16 printable desk lamp problem cards',
        'Adult setup guide',
        'Fictional problem safety notes',
        'Desk lamp problem coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led problem routines',
        'Ten take-home problem slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the problem cards, blank slips, and adult guide before the writer arrives.',
        'Place one pretend desk lamp card where the adult can see every choice.',
        'Choose one problem routine and one fictional world before writers begin.',
        'Keep the activity offline, paper-only, and adult-led.',
        'Explain that every problem is invented for a story page.',
      ],
      deskLampProblemSetup: [
        'Place one blank problem card beside the pretend desk lamp.',
        'Ask for one problem spot, one character need, one place pressure, and one object trouble.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the card back for problem spot, character need, place pressure, object trouble, question, first try, and revision notes.',
      ],
      problemCoaching: [
        'Ask what the character notices first before asking what happens next.',
        'Ask the writer to keep the problem broad, invented, and useful to the story.',
        'Point to the problem spot, character need, place pressure, object trouble, and question boxes when a problem feels stuck.',
        'If the problem feels flat, add one invented mismatch, object, or first try on paper.',
        'Finish by reading the problem spot, character need, place pressure, object trouble, question, first try, and revision once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, and broad story labels for every problem.',
        'Use broad pretend story words instead of narrow real-world facts.',
        'Keep every problem card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for narrow real-world facts before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle fictional problem is enough for one story page.',
        'Invite praise for one clear problem spot, character need, object trouble, or revision.',
        'Ask adults to keep narrow real-world facts off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused problem cards and blank desk lamp slips.',
        'Check finished pages for narrow real-world facts before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh problem cards.',
      ],
    },
    problemRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Problem Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional problem choices.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer chooses whether to fill the problem spot or character need first.',
        'Adult models how place pressure, object trouble, and a problem question make the obstacle usable.',
        'Writer drafts one short problem spot, character need, place pressure, object trouble, question, first try, or revision on the card.',
      ],
    })),
    takeHomeProblemSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Problem Slip ${index + 1}`,
      time: problemSlipLabels[index],
      skill: problemSkills[index],
      direction: 'Choose one fictional problem clue and one pretend desk lamp object: ____________________.',
      familyLine: 'A grown-up can ask what the character notices first: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented problem spot if you choose: ____________________.',
      'Show one sketched desk lamp object from the card: ____________________.',
      'Name one character need without narrow real-world facts: ____________________.',
      'Share one harmless story object that makes the problem clearer: ____________________.',
      'Point to one problem question that helped the start: ____________________.',
      'Ask an adult to read your favorite fictional problem clue: ____________________.',
      'Circle one problem detail you want to keep broad: ____________________.',
      'Choose one desk lamp problem for later: ____________________.',
    ],
    cards: problemWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, problemWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'desk-lamp-story-problem-card-pack',
  title: 'Desk Lamp Story Problem Card Pack',
  pricePoint: '$55',
  status: 'checkout_pending',
  worldSlugs: problemWorldSlugs,
  worldSummaries: problemWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(problemWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: problemWorldAges[worldSlug] }]))

const worlds = new Map(
  problemWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: problemWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free problem card prompt.',
    },
  ]),
)

function writeValidDeskLampProblemLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            problemRoutines: source.problemRoutines,
            takeHomeProblemSlips: source.takeHomeProblemSlips,
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

describe('Desk Lamp Story Problem Card Pack policy', () => {
  it('accepts a valid source with sixteen printable problem cards', () => {
    expect(validateDeskLampStoryProblemCardPackSource(validDeskLampProblemSource(), product, worldAges)).toEqual([])
  })

  it('rejects a problem prompt field without a writable blank', () => {
    const source = validDeskLampProblemSource()
    source.cards[0].problemSpotPrompt = 'Problem spot: write the small fictional problem the character notices first.'
    expect(validateDeskLampStoryProblemCardPackSource(source, product, worldAges)).toContain(
      'cards[0].problemSpotPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validDeskLampProblemSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validateDeskLampStoryProblemCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('requires the standard product safety sentence in the source safety note', () => {
    const source = validDeskLampProblemSource({
      safetyNote:
        'Family-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts.',
    })
    expect(validateDeskLampStoryProblemCardPackSource(source, product, worldAges)).toContain(
      `safetyNote must include ${standardSafety}`,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validDeskLampProblemSource()
    source.takeHomeProblemSlips[0].time = '7 minutes'
    expect(validateDeskLampStoryProblemCardPackSource(source, product, worldAges)).toContain(
      'takeHomeProblemSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Desk Lamp Story Problem Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Desk Lamp Story Problem Card Pack',
      ),
    ).toContain('Desk Lamp Story Problem Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce problem cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-desk-lamp-problem-source-'))
    const source = validDeskLampProblemSource()
    try {
      writeValidDeskLampProblemLaneFiles(tempRoot, source)
      expect(validateDeskLampStoryProblemCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 41 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-desk-lamp-problem-source-path-'))
    const source = validDeskLampProblemSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-desk-lamp-problem-cards-a.json'
    try {
      writeValidDeskLampProblemLaneFiles(tempRoot, source)
      expect(validateDeskLampStoryProblemCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 41 problem-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects desk lamp problem artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-desk-lamp-problem-artifacts-'))
    const source = validDeskLampProblemSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/desk-lamp-story-problem-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK desk lamp problem zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Desk Lamp Story Problem Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Desk Lamp Story Problem Card Pack\n', { flag: 'wx' })
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
              path: 'product-build/desk-lamp-story-problem-card-pack/README.txt',
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
describe('Desk Lamp Story Problem Card Pack builder', () => {
  it('renders the printable problem card HTML with source cards and local world images', () => {
    const source = validDeskLampProblemSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderDeskLampStoryProblemCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Desk Lamp Story Problem Card Pack')
    expect(html).toContain('Problem Card 1')
    expect(html).toContain('Problem spot')
    expect(html).toContain('Take-home problem slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-desk-lamp-problem-build-'))
    try {
      const output = await buildDeskLampStoryProblemCardPack({
        buildDir: join(tempRoot, 'product-build', 'desk-lamp-story-problem-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('desk-lamp-story-problem-card-pack')
      expect(manifest.productSlug).toBe('desk-lamp-story-problem-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildDeskLampStoryProblemCardPack({
        buildDir: join(tempRoot, 'product-build', 'desk-lamp-story-problem-card-pack'),
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
