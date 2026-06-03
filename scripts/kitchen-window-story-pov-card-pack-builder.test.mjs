import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateKitchenWindowStoryPovCardPackSource,
  validateKitchenWindowStoryPovCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildKitchenWindowStoryPovCardPack,
  loadKitchenWindowStoryPovCardPackBuildInputs,
  renderKitchenWindowStoryPovCardPackHtml,
} from './kitchen-window-story-pov-card-pack-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

const povWorldAges = {
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

const povWorldSlugs = Object.keys(povWorldAges)

const povSkills = [
  'first person view',
  'third person view',
  'observer detail',
  'near detail',
  'far detail',
  'thought clue',
  'voice filter',
  'same scene new view',
  'object viewpoint',
  'setting lens',
  'emotion lens',
  'closing viewpoint',
]

const povSlipLabels = [
  'view slip',
  'observer slip',
  'near-detail slip',
  'far-detail slip',
  'thought slip',
  'voice slip',
  'object-view slip',
  'setting-lens slip',
  'emotion-lens slip',
  'closing-view slip',
]

function card(index, worldSlug, ageBand) {
  return {
    id: `kitchen-window-pov-card-${String(index).padStart(2, '0')}`,
    title: `Kitchen Window POV Card ${index}`,
    worldSlug,
    ageBand,
    pointOfViewSkill: povSkills[(index - 1) % povSkills.length],
    useCase:
      'Adult-led printable point-of-view card for writing one fictional kitchen-window story view on paper: ____________________.',
    adultSetup:
      'Print the card, choose one invented scene label, and keep every viewpoint fictional and offline: ____________________.',
    kidDirection:
      'Write how the same pretend moment changes when the storyteller changes: ____________________.',
    firstViewPrompt: 'First view says what the storyteller notices first: ____________________.',
    secondViewPrompt: 'Second view retells the same pretend moment another way: ____________________.',
    nearDetailPrompt: 'Name one close paper detail that changes the view: ____________________.',
    farDetailPrompt: 'Name one far pretend detail that changes the view: ____________________.',
    thoughtCluePrompt: 'Add one thought clue that only this storyteller would know: ____________________.',
    reviseViewPrompt: 'Revise one sentence so the viewpoint is clearer: ____________________.',
    quietOptionLine: 'Quiet option: point to a view label, then fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: retell the same fictional moment from a new paper view: ____________________.',
  }
}

function validKitchenWindowPovSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch36',
    generatedAt: '2026-06-03',
    productSlug: 'kitchen-window-story-pov-card-pack',
    title: 'Kitchen Window Story Point-of-View Card Pack',
    pricePoint: '$45',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable point-of-view cards plus adult guide tools, POV routines, take-home POV slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/kitchen-window-story-pov-card-pack/Kitchen-Window-Story-Point-of-View-Card-Pack.pdf',
      zipPath:
        'product-build/kitchen-window-story-pov-card-pack/kitchen-window-story-pov-card-pack.zip',
      sourceHtmlPath:
        'product-build/kitchen-window-story-pov-card-pack/source/kitchen-window-story-pov-card-pack.html',
      manifestPath: 'product-build/kitchen-window-story-pov-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-a.json',
      'content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-b.json',
      'content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-c.json',
      'content/product-artifacts/lanes/batch36-kitchen-window-pov-tools.json',
    ],
    worldSlugs: povWorldSlugs,
    cover: {
      kicker: 'Printable paper viewpoint cards',
      headline: 'Kitchen Window Story Point-of-View Card Pack',
      subhead:
        'Sixteen paper cards help writers retell the same pretend story moment from different viewpoints.',
      included: [
        '16 printable kitchen-window point-of-view cards',
        'Adult setup guide',
        'Fictional viewpoint safety notes',
        'Same-scene retell coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led POV routines',
        'Ten take-home POV slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the viewpoint cards, slips, and adult guide before the writer arrives.',
        'Say that kitchen window means a pretend paper story frame.',
        'Choose one viewpoint routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card drafts invented views for a story.',
      ],
      paperViewpointSetup: [
        'Place one viewpoint card and two invented view labels where the adult can see the writing.',
        'Use role words like teller, helper, keeper, or visitor for every view.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the back of the card for near detail, far detail, thought clue, and revision notes.',
      ],
      viewpointCoaching: [
        'Ask what this teller notices before asking what another teller notices.',
        'Ask the writer to keep the pretend moment the same while the view changes.',
        'Point to the thought clue box and ask what only this teller knows.',
        'If the view sounds flat, add one invented object or action clue on paper.',
        'Finish by reading the two invented views together once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every viewpoint.',
        'Use broad pretend place words instead of private details or named locations.',
        'Keep every viewpoint card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle paper retell is enough for one extra view.',
        'Invite praise for one clear view label, thought clue, detail, or revision.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused viewpoint cards and blank view labels.',
        'Check finished pages for private details before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh viewpoint cards.',
      ],
    },
    povRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `POV Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional viewpoint labels.',
      steps: [
        'Adult chooses one broad invented kitchen-window idea and reads the paper-only reminder.',
        'Writer chooses whether to fill the first view or second view first.',
        'Adult models how one pretend moment can sound different from another view.',
        'Writer drafts one short view, detail, thought clue, or revision on the card.',
      ],
    })),
    takeHomePovSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `POV Slip ${index + 1}`,
      time: povSlipLabels[index],
      skill: povSkills[index % povSkills.length],
      direction: 'Choose one fictional viewpoint label and write the first view here: ____________________.',
      familyLine: 'A grown-up can ask what a second pretend view would notice: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented viewpoint line if you choose: ____________________.',
      'Show one sketched view label from the card: ____________________.',
      'Name one thought clue without private details: ____________________.',
      'Share one gentle retell sentence you want to keep: ____________________.',
      'Point to one near detail that helped the view: ____________________.',
      'Ask an adult to read your favorite fictional view: ____________________.',
      'Circle one story detail you want to keep private: ____________________.',
      'Choose one same-scene retell for later: ____________________.',
    ],
    cards: povWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, povWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'kitchen-window-story-pov-card-pack',
  title: 'Kitchen Window Story Point-of-View Card Pack',
  pricePoint: '$45',
  status: 'checkout_pending',
  worldSlugs: povWorldSlugs,
  worldSummaries: povWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(povWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: povWorldAges[worldSlug] }]))

const worlds = new Map(
  povWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: povWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free viewpoint card prompt.',
    },
  ]),
)

function writeValidKitchenWindowPovLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            povRoutines: source.povRoutines,
            takeHomePovSlips: source.takeHomePovSlips,
            optionalSharePrompts: source.optionalSharePrompts,
          }
        : {
            laneId,
            cards: source.cards.filter((entry) => {
              if (sourceFile.includes('-cards-a')) return Number(entry.id.slice(-2)) <= 6
              if (sourceFile.includes('-cards-b')) return Number(entry.id.slice(-2)) >= 7 && Number(entry.id.slice(-2)) <= 11
              return Number(entry.id.slice(-2)) >= 12
            }),
          }
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, `${JSON.stringify(lane, null, 2)}\n`, { flag: 'wx' })
  }
}

describe('Kitchen Window Story Point-of-View Card Pack policy', () => {
  it('accepts a valid source with sixteen printable point-of-view cards', () => {
    expect(validateKitchenWindowStoryPovCardPackSource(validKitchenWindowPovSource(), product, worldAges)).toEqual([])
  })

  it('rejects a POV prompt field without a writable blank', () => {
    const source = validKitchenWindowPovSource()
    source.cards[0].firstViewPrompt = 'First view says what the storyteller notices first.'

    expect(validateKitchenWindowStoryPovCardPackSource(source, product, worldAges)).toContain(
      'cards[0].firstViewPrompt must include a writable blank.',
    )
  })

  it('rejects real home, real window, account, upload, public-posting, photo, or camera language', () => {
    const source = validKitchenWindowPovSource()
    source.cards[0].kidDirection =
      'Look from a real home window, take a photo with a camera, upload it to an account, and post a public review: ____________________.'

    expect(validateKitchenWindowStoryPovCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /real home|camera|upload|account|public/i,
    )
  })

  it('rejects minute-duration labels for take-home slips', () => {
    const source = validKitchenWindowPovSource()
    source.takeHomePovSlips[0].time = '7 minutes'

    expect(validateKitchenWindowStoryPovCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /timed|duration|minute/i,
    )
  })

  it('requires product world summaries to cover the same linked worlds', () => {
    expect(validateProductWorldSummaries(product, 'Kitchen Window Story Point-of-View Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Kitchen Window Story Point-of-View Card Pack',
      ),
    ).toContain('Kitchen Window Story Point-of-View Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce POV cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-kitchen-window-source-'))
    const source = validKitchenWindowPovSource()
    try {
      writeValidKitchenWindowPovLaneFiles(tempRoot, source)

      expect(validateKitchenWindowStoryPovCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects unexpected source lane paths even when copied content matches', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-kitchen-window-source-path-'))
    const source = validKitchenWindowPovSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-kitchen-window-pov-cards-a.json'
    try {
      writeValidKitchenWindowPovLaneFiles(tempRoot, source)

      expect(validateKitchenWindowStoryPovCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 36 POV-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects source lane files whose laneId does not match the expected file stem', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-kitchen-window-source-laneid-'))
    const source = validKitchenWindowPovSource()
    const badLanePath = source.sourceFiles[1]
    try {
      writeValidKitchenWindowPovLaneFiles(tempRoot, source, {
        [badLanePath]: 'batch36-kitchen-window-pov-cards-copy',
      })

      expect(validateKitchenWindowStoryPovCardPackSourceFiles(source, tempRoot)).toContain(
        `${badLanePath}.laneId must be batch36-kitchen-window-pov-cards-b.`,
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects kitchen-window POV artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-kitchen-window-artifacts-'))
    const source = validKitchenWindowPovSource()
    const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
    const zipPath = resolve(tempRoot, source.artifact.zipPath)
    const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
    const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
    try {
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(source.cards.length + 5), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK kitchen window zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Kitchen Window Story Point-of-View Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(
        manifestPath,
        `${JSON.stringify(
          {
            productSlug: source.productSlug,
            sourcePageCount: source.cards.length,
            files: {
              pdf: { path: source.artifact.pdfPath, sha256: sha256(pdfPath), size: readFileSync(pdfPath).length },
              zip: { path: source.artifact.zipPath, sha256: sha256(zipPath), size: readFileSync(zipPath).length },
              sourceHtml: {
                path: source.artifact.sourceHtmlPath,
                sha256: sha256(sourceHtmlPath),
                size: readFileSync(sourceHtmlPath).length,
              },
              assets: [],
            },
          },
          null,
          2,
        )}\n`,
        { flag: 'wx' },
      )

      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: source.cards.length + 5 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})

describe('Kitchen Window Story Point-of-View Card Pack builder', () => {
  it('renders the printable POV card HTML with source cards and local world images', () => {
    const source = validKitchenWindowPovSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderKitchenWindowStoryPovCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Kitchen Window Story Point-of-View Card Pack')
    expect(html).toContain('POV Card 1')
    expect(html).toContain('First view')
    expect(html).toContain('Second view')
    expect(html).toContain('Take-home POV slips')
  })

  it('loads committed Batch 36 product inputs', () => {
    const { source, product: loadedProduct, imageMap } = loadKitchenWindowStoryPovCardPackBuildInputs()

    expect(source.productSlug).toBe('kitchen-window-story-pov-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(loadedProduct.pricePoint).toBe('$45')
    expect(imageMap.size).toBe(16)
  })

  it('builds deterministic PDF, ZIP, source HTML, and manifest artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-kitchen-window-build-'))
    try {
      const { source, manifest, paths } = await buildKitchenWindowStoryPovCardPack({
        buildDir: join(tempRoot, 'product-build', 'kitchen-window-story-pov-card-pack'),
        recordRoot: tempRoot,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      expect(source.cards).toHaveLength(16)
      expect(existsSync(paths.pdfPath)).toBe(true)
      expect(existsSync(paths.zipPath)).toBe(true)
      expect(existsSync(paths.htmlPath)).toBe(true)
      expect(existsSync(paths.manifestPath)).toBe(true)
      expect(manifest.productSlug).toBe('kitchen-window-story-pov-card-pack')
      expect(manifest.files.assets).toHaveLength(16)
      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
