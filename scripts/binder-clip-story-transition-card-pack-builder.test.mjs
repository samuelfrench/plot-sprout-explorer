import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateBinderClipStoryTransitionCardPackSource,
  validateBinderClipStoryTransitionCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildBinderClipStoryTransitionCardPack,
  renderBinderClipStoryTransitionCardPackHtml,
} from './binder-clip-story-transition-card-pack-builder.mjs'

const standardSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'
const safety = standardSafety

const transitionWorldAges = {
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

const transitionWorldSlugs = Object.keys(transitionWorldAges)
const transitionSkills = [
  'choosing a small transition step',
  'noticing a missing clue',
  'matching need to action',
  'asking the transition question',
  'tiny weather mismatch',
  'clear first try',
  'setting pressure',
  'task mix-up',
  'map mismatch',
  'signal mismatch',
  'message gap',
  'sequence transition',
  'revision target',
  'label clue transition',
  'choice obstacle',
  'promise transition',
]
const transitionSlipLabels = [
  'first-line slip',
  'character slip',
  'place slip',
  'object slip',
  'question slip',
  'next-move slip',
  'sound slip',
  'transition slip',
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
    id: `binder-clip-transition-card-${String(index).padStart(2, '0')}`,
    title: `Binder Clip Transition Card ${index}`,
    worldSlug,
    ageBand,
    transitionSkill: transitionSkills[index - 1],
    useCase:
      'Adult-led printable binder clip transition card for shaping one fictional story transition from a gentle first choice: ____________________.',
    adultSetup:
      'Adult: place one blank transition card beside the pretend binder clip and keep every choice fictional: ____________________.',
    kidDirection:
      'Spot the make-believe story need, then write one clue that makes the next choice clear: ____________________.',
    beforeMomentPrompt: 'Before moment: write what the invented scene was doing first: ____________________.',
    afterMomentPrompt: 'After moment: write what changes in the next story moment: ____________________.',
    bridgeWordPrompt: 'Bridge word: choose one transition word that clips the moments together: ____________________.',
    characterMovePrompt: 'Character move: add one gentle action that carries the character forward: ____________________.',
    placeShiftPrompt: 'Place shift: choose the broad invented place detail that changes next: ____________________.',
    objectCarryPrompt: 'Object carry-over: add one harmless story object from the binder clip idea: ____________________.',
    transitionQuestionPrompt: 'Transition question: ask one gentle question that can pull the story forward: ____________________.',
    reviseTransitionPrompt: 'Revise transition: make the answer smaller, clearer, or more useful to the story: ____________________.',
    quietOptionLine: 'Quiet option: circle one transition clue and fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: invent one more binder clip transition for later: ____________________.',
  }
}

function validBinderClipTransitionSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch43',
    generatedAt: '2026-06-03',
    productSlug: 'binder-clip-story-transition-card-pack',
    title: 'Binder Clip Story Transition Card Pack',
    pricePoint: '$59',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable transition cards plus adult guide tools, transition routines, take-home transition slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/binder-clip-story-transition-card-pack/Binder-Clip-Story-Transition-Card-Pack.pdf',
      zipPath:
        'product-build/binder-clip-story-transition-card-pack/binder-clip-story-transition-card-pack.zip',
      sourceHtmlPath:
        'product-build/binder-clip-story-transition-card-pack/source/binder-clip-story-transition-card-pack.html',
      manifestPath: 'product-build/binder-clip-story-transition-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-a.json',
      'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-b.json',
      'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-c.json',
      'content/product-artifacts/lanes/batch43-binder-clip-transition-tools.json',
    ],
    worldSlugs: transitionWorldSlugs,
    cover: {
      kicker: 'Printable binder clip transition cards',
      headline: 'Binder Clip Story Transition Card Pack',
      subhead:
        'Sixteen paper cards help writers begin fictional stories with first lines, character arrivals, place doorways, object invitations, and transition questions.',
      included: [
        '16 printable binder clip transition cards',
        'Adult setup guide',
        'Fictional transition safety notes',
        'Binder clip transition coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led transition routines',
        'Ten take-home transition slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      title: 'Binder Clip Transition Card Adult Guide',
      bullets: [
        'Print the transition cards, blank slips, and guide before the adult-led paper session.',
        'Use binder clips only as paper props for holding, grouping, or pointing to invented story moments.',
        'Keep every story detail fictional, broad, offline, and guided by an adult.',
        'Choose one before moment, one after moment, and one binder-clip job so the transition has a clear bridge.',
        'Replace any personal place, schedule, group name, or child detail with a made-up story label.',
        'Send along only blank slips or invented examples with no identity details.',
      ],
    },
    transitionRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Transition Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional transition choices.',
      steps: [
        'Adult chooses one broad invented story start and reads the paper-only reminder.',
        'Writer chooses whether to fill the before moment or after moment first.',
        'Adult models how a bridge word, character move, place shift, and carried object connect two moments.',
        'Writer drafts one short before moment, after moment, bridge word, character move, place shift, carried object, question, or revision on the card.',
      ],
    })),
    takeHomeTransitionSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Transition Slip ${index + 1}`,
      time: transitionSlipLabels[index],
      skill: transitionSkills[index],
      direction: 'Choose one fictional transition clue and one pretend binder clip object: ____________________.',
      familyLine: 'A grown-up can ask what the character notices first: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented transition step if you choose: ____________________.',
      'Show one sketched binder clip object from the card: ____________________.',
      'Name one character need without narrow real-world facts: ____________________.',
      'Share one harmless story object that makes the transition clearer: ____________________.',
      'Point to one transition question that helped the start: ____________________.',
      'Ask an adult to read your favorite fictional transition clue: ____________________.',
      'Circle one transition detail you want to keep broad: ____________________.',
      'Choose one binder clip transition for later: ____________________.',
    ],
    cards: transitionWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, transitionWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'binder-clip-story-transition-card-pack',
  title: 'Binder Clip Story Transition Card Pack',
  pricePoint: '$59',
  status: 'checkout_pending',
  worldSlugs: transitionWorldSlugs,
  worldSummaries: transitionWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(transitionWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: transitionWorldAges[worldSlug] }]))

const worlds = new Map(
  transitionWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: transitionWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free transition card prompt.',
    },
  ]),
)

function writeValidBinderClipTransitionLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            transitionRoutines: source.transitionRoutines,
            takeHomeTransitionSlips: source.takeHomeTransitionSlips,
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

describe('Binder Clip Story Transition Card Pack policy', () => {
  it('accepts a valid source with sixteen printable transition cards', () => {
    expect(validateBinderClipStoryTransitionCardPackSource(validBinderClipTransitionSource(), product, worldAges)).toEqual([])
  })

  it('rejects a transition prompt field without a writable blank', () => {
    const source = validBinderClipTransitionSource()
    source.cards[0].beforeMomentPrompt = 'Before moment: write what the invented scene was doing first.'
    expect(validateBinderClipStoryTransitionCardPackSource(source, product, worldAges)).toContain(
      'cards[0].beforeMomentPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe private identity, school, route, account, upload, and camera language', () => {
    const source = validBinderClipTransitionSource()
    source.cards[0].kidDirection =
      'Upload a photo to your school profile with your real name and GPS route: ____________________.'
    expect(validateBinderClipStoryTransitionCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /account|upload|school|route|GPS|profile|photo|camera|private-child-data/i,
    )
  })

  it('rejects scoring language in transition cards', () => {
    const source = validBinderClipTransitionSource()
    source.cards[0].kidDirection = 'Use a scoring pass to rank this transition: ____________________.'
    expect(validateBinderClipStoryTransitionCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /score|scoring/i,
    )
  })

  it('requires the standard product safety sentence in the source safety note', () => {
    const source = validBinderClipTransitionSource({
      safetyNote:
        'Family-safe fictional transitions only; paper-only adult-led work with broad invented labels and no narrow personal facts.',
    })
    expect(validateBinderClipStoryTransitionCardPackSource(source, product, worldAges)).toContain(
      `safetyNote must include ${standardSafety}`,
    )
  })

  it('rejects timed take-home slip labels', () => {
    const source = validBinderClipTransitionSource()
    source.takeHomeTransitionSlips[0].time = '7 minutes'
    expect(validateBinderClipStoryTransitionCardPackSource(source, product, worldAges)).toContain(
      'takeHomeTransitionSlips[0].time must use a non-timed take-home slip label.',
    )
  })

  it('requires product world summaries for every linked world', () => {
    expect(validateProductWorldSummaries(product, 'Binder Clip Story Transition Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        { ...product, worldSummaries: product.worldSummaries.slice(0, 15) },
        'Binder Clip Story Transition Card Pack',
      ),
    ).toContain('Binder Clip Story Transition Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce transition cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-binder-clip-transition-source-'))
    const source = validBinderClipTransitionSource()
    try {
      writeValidBinderClipTransitionLaneFiles(tempRoot, source)
      expect(validateBinderClipStoryTransitionCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects missing expected Batch 43 source lane paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-binder-clip-transition-source-path-'))
    const source = validBinderClipTransitionSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-binder-clip-transition-cards-a.json'
    try {
      writeValidBinderClipTransitionLaneFiles(tempRoot, source)
      expect(validateBinderClipStoryTransitionCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 43 transition-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects cards assigned to the wrong Batch 43 lane file', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-binder-clip-transition-lane-range-'))
    const source = validBinderClipTransitionSource()
    try {
      writeValidBinderClipTransitionLaneFiles(tempRoot, source)
      const laneAPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-a.json')
      const laneBPath = resolve(tempRoot, 'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-b.json')
      const laneA = JSON.parse(readFileSync(laneAPath, 'utf8'))
      const laneB = JSON.parse(readFileSync(laneBPath, 'utf8'))
      laneA.cards[0] = source.cards[6]
      laneB.cards[0] = source.cards[0]
      writeFileSync(laneAPath, `${JSON.stringify(laneA, null, 2)}\n`)
      writeFileSync(laneBPath, `${JSON.stringify(laneB, null, 2)}\n`)
      expect(validateBinderClipStoryTransitionCardPackSourceFiles(source, tempRoot)).toContain(
        'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-a.json must contain only cards 01-06.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects binder clip transition artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-binder-clip-transition-artifacts-'))
    const source = validBinderClipTransitionSource()
    try {
      const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
      const zipPath = resolve(tempRoot, source.artifact.zipPath)
      const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
      const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
      const readmePath = resolve(tempRoot, 'product-build/binder-clip-story-transition-card-pack/README.txt')
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(21), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK binder clip transition zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Binder Clip Story Transition Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Binder Clip Story Transition Card Pack\n', { flag: 'wx' })
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
              path: 'product-build/binder-clip-story-transition-card-pack/README.txt',
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
describe('Binder Clip Story Transition Card Pack builder', () => {
  it('renders the printable transition card HTML with source cards and local world images', () => {
    const source = validBinderClipTransitionSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderBinderClipStoryTransitionCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Binder Clip Story Transition Card Pack')
    expect(html).toContain('Transition Card 1')
    expect(html).toContain('Before moment')
    expect(html).toContain('Take-home transition slips')
    expect(html).toContain('assets/moon-muffin-market.jpg')
  })

  it('builds deterministic provider-ready artifacts from the source', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-binder-clip-transition-build-'))
    try {
      const output = await buildBinderClipStoryTransitionCardPack({
        buildDir: join(tempRoot, 'product-build', 'binder-clip-story-transition-card-pack'),
        recordRoot: tempRoot,
        writePdf: ({ pdfPath }) => writeFileSync(pdfPath, fakePdf(21)),
      })
      const manifest = output.manifest

      expect(output.source.productSlug).toBe('binder-clip-story-transition-card-pack')
      expect(manifest.productSlug).toBe('binder-clip-story-transition-card-pack')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets).toHaveLength(16)
      expect(existsSync(output.paths.pdfPath)).toBe(true)
      expect(existsSync(output.paths.zipPath)).toBe(true)
      expect(existsSync(output.paths.htmlPath)).toBe(true)

      const firstZipHash = sha256(output.paths.zipPath)
      const secondOutput = await buildBinderClipStoryTransitionCardPack({
        buildDir: join(tempRoot, 'product-build', 'binder-clip-story-transition-card-pack'),
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
