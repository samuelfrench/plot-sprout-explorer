import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateDeskDrawerStorySequenceCardPackSource,
  validateDeskDrawerStorySequenceCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildDeskDrawerStorySequenceCardPack,
  loadDeskDrawerStorySequenceCardPackBuildInputs,
  renderDeskDrawerStorySequenceCardPackHtml,
} from './desk-drawer-story-sequence-card-pack-builder.mjs'

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

const sequenceWorldAges = {
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

const sequenceWorldSlugs = Object.keys(sequenceWorldAges)

const sequenceSkills = [
  'beginning sequence',
  'middle sequence',
  'ending sequence',
  'first-next-finally',
  'cause and effect',
  'transition words',
  'event order',
  'object sequence',
  'setting sequence',
  'character choice sequence',
  'problem-solution sequence',
  'detail sequence',
]

function card(index, worldSlug, ageBand) {
  const skill = sequenceSkills[(index - 1) % sequenceSkills.length]
  return {
    id: `desk-drawer-sequence-card-${String(index).padStart(2, '0')}`,
    title: `Desk Drawer Story Sequence Card ${index}`,
    worldSlug,
    ageBand,
    sequenceSkill: skill,
    useCase:
      'Adult-led printable sequence card for placing one pretend desk-drawer story event in a clear order: ____________________.',
    adultSetup:
      'Print the card, name one invented drawer object, and keep every event fictional and offline: ____________________.',
    kidDirection:
      'Choose a pretend drawer object, then write what happens first, next, then, and finally: ____________________.',
    firstPrompt: 'First prompt: The drawer opens and the first pretend clue is ____________________.',
    nextPrompt: 'Next prompt: The next gentle event happens when ____________________.',
    thenPrompt: 'Then prompt: Then the character notices or chooses ____________________.',
    finallyPrompt: 'Finally prompt: Finally the story settles when ____________________.',
    transitionPrompt: 'Transition prompt: Add one linking word such as first, next, then, because, or finally: ____________________.',
    checkBackPrompt: 'Check back: Point to the clearest event order and name what changed: ____________________.',
    quietOptionLine: 'Quiet option: Number the four event boxes before writing one full line: ____________________.',
    takeHomeLine: 'Take-home line: Use this sequence card again with a new pretend drawer object: ____________________.',
  }
}

function validDeskDrawerSequenceSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch33',
    generatedAt: '2026-06-02',
    productSlug: 'desk-drawer-story-sequence-card-pack',
    title: 'Desk Drawer Story Sequence Card Pack',
    pricePoint: '$39',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable sequence cards plus adult guide tools, sequence routines, take-home sequence slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/desk-drawer-story-sequence-card-pack/Desk-Drawer-Story-Sequence-Card-Pack.pdf',
      zipPath:
        'product-build/desk-drawer-story-sequence-card-pack/desk-drawer-story-sequence-card-pack.zip',
      sourceHtmlPath:
        'product-build/desk-drawer-story-sequence-card-pack/source/desk-drawer-story-sequence-card-pack.html',
      manifestPath: 'product-build/desk-drawer-story-sequence-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch33-desk-drawer-sequence-cards-a.json',
      'content/product-artifacts/lanes/batch33-desk-drawer-sequence-cards-b.json',
      'content/product-artifacts/lanes/batch33-desk-drawer-sequence-cards-c.json',
      'content/product-artifacts/lanes/batch33-desk-drawer-sequence-tools.json',
    ],
    worldSlugs: sequenceWorldSlugs,
    cover: {
      kicker: 'Printable paper sequence cards',
      headline: 'Desk Drawer Story Sequence Card Pack',
      subhead:
        'Sixteen paper sequence cards turn pretend drawer objects into clear beginning-middle-ending story order.',
      included: [
        '16 printable desk-drawer sequence cards',
        'Adult setup guide',
        'Fictional sequence-card safety notes',
        'Sequence coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led sequence routines',
        'Ten take-home sequence slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the sequence cards, take-home slips, and adult guide before the session.',
        'Say that desk drawer means a pretend paper drawer, not a real private drawer.',
        'Choose one sequence routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card helps order events, not measure writing.',
      ],
      paperSequenceSetup: [
        'Place one sequence card and one blank page where the adult can see the writing.',
        'Use invented drawer objects, pretend labels, and broad fictional places.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the back of the card for first, next, then, and finally notes.',
      ],
      sequenceCoaching: [
        'Ask for one invented drawer object first.',
        'Ask what happens before the character touches the object.',
        'Ask what changes next because of the object.',
        'Ask what the character chooses near the middle.',
        'Ask what final small result makes the story feel complete.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every person on the cards.',
        'Use broad pretend place words instead of private details or named locations.',
        'Keep every sequence card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper sequence card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle paper retell is enough for one extra sequence.',
        'Invite praise for one clear order word, sketch, or sentence.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused sequence cards and blank pages.',
        'Check finished pages for private details before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh sequence cards.',
      ],
    },
    sequenceRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Sequence Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one fictional desk-drawer object.',
      steps: [
        'Adult chooses one broad invented drawer idea and reads the paper-only reminder.',
        'Writer chooses a first, next, then, or finally event box.',
        'Adult models how the object can cause one gentle story event.',
        'Writer drafts one short ordered line on the card.',
      ],
    })),
    takeHomeSequenceSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Sequence Slip ${index + 1}`,
      time: 'one-card slip',
      skill: sequenceSkills[index % sequenceSkills.length],
      direction: 'Choose one fictional desk-drawer object and write the first event here: ____________________.',
      familyLine: 'A grown-up can ask which event should happen next: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented first event if you choose: ____________________.',
      'Show one sketched drawer object from the card: ____________________.',
      'Name one transition word without private details: ____________________.',
      'Share one final line you want to keep: ____________________.',
      'Point to one event that moved to a better place: ____________________.',
      'Ask an adult to read your favorite ordered line: ____________________.',
      'Circle one event you want to keep private: ____________________.',
      'Choose one sequence step for later: ____________________.',
    ],
    cards: sequenceWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, sequenceWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'desk-drawer-story-sequence-card-pack',
  title: 'Desk Drawer Story Sequence Card Pack',
  pricePoint: '$39',
  status: 'checkout_pending',
  worldSlugs: sequenceWorldSlugs,
  worldSummaries: sequenceWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(
  sequenceWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: sequenceWorldAges[worldSlug] }]),
)

const worlds = new Map(
  sequenceWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: sequenceWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free sequence card prompt.',
    },
  ]),
)

describe('Desk Drawer Story Sequence Card Pack policy', () => {
  it('accepts a valid source with sixteen printable sequence cards', () => {
    expect(validateDeskDrawerStorySequenceCardPackSource(validDeskDrawerSequenceSource(), product, worldAges)).toEqual([])
  })

  it('rejects a card response field without a writable blank', () => {
    const source = validDeskDrawerSequenceSource()
    source.cards[0].firstPrompt = 'The first drawer clue is a paper moon.'

    expect(validateDeskDrawerStorySequenceCardPackSource(source, product, worldAges)).toContain(
      'cards[0].firstPrompt must include a writable blank.',
    )
  })

  it('rejects unsafe account or upload language', () => {
    const source = validDeskDrawerSequenceSource()
    source.cards[0].kidDirection = 'Upload your drawer sequence to the class portal: ____________________.'

    expect(validateDeskDrawerStorySequenceCardPackSource(source, product, worldAges).join('\n')).toMatch(/upload|account|portal/i)
  })

  it('rejects minute-duration labels for take-home slips', () => {
    const source = validDeskDrawerSequenceSource()
    source.takeHomeSequenceSlips[0].time = '7 minutes'

    expect(validateDeskDrawerStorySequenceCardPackSource(source, product, worldAges).join('\n')).toMatch(/timed|duration|minute/i)
  })

  it('requires product world summaries to cover the same linked worlds', () => {
    expect(validateProductWorldSummaries(product, 'Desk Drawer Story Sequence Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Desk Drawer Story Sequence Card Pack',
      ),
    ).toContain('Desk Drawer Story Sequence Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce sequence cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-desk-drawer-source-'))
    const source = validDeskDrawerSequenceSource()
    try {
      for (const sourceFile of source.sourceFiles) {
        const target = resolve(tempRoot, sourceFile)
        const lane =
          sourceFile.includes('-tools')
            ? {
                laneId: 'batch33-desk-drawer-sequence-tools',
                adultGuide: source.adultGuide,
                sequenceRoutines: source.sequenceRoutines,
                takeHomeSequenceSlips: source.takeHomeSequenceSlips,
                optionalSharePrompts: source.optionalSharePrompts,
              }
            : {
                laneId: sourceFile.split('/').at(-1)?.replace('.json', ''),
                cards: source.cards.filter((entry) => {
                  if (sourceFile.includes('-cards-a')) return Number(entry.id.slice(-2)) <= 6
                  if (sourceFile.includes('-cards-b')) return Number(entry.id.slice(-2)) >= 7 && Number(entry.id.slice(-2)) <= 11
                  return Number(entry.id.slice(-2)) >= 12
                }),
              }
        mkdirSync(dirname(target), { recursive: true })
        writeFileSync(target, `${JSON.stringify(lane, null, 2)}\n`, { flag: 'wx' })
      }

      expect(validateDeskDrawerStorySequenceCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects desk-drawer sequence artifacts against the desk-drawer required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-desk-drawer-artifacts-'))
    const source = validDeskDrawerSequenceSource()
    const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
    const zipPath = resolve(tempRoot, source.artifact.zipPath)
    const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
    const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
    try {
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(source.cards.length + 5), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK desk drawer zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Desk Drawer Story Sequence Card Pack</title>', { flag: 'wx' })
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

describe('Desk Drawer Story Sequence Card Pack builder', () => {
  it('renders the printable sequence card HTML with source cards and local world images', () => {
    const source = validDeskDrawerSequenceSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderDeskDrawerStorySequenceCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Desk Drawer Story Sequence Card Pack')
    expect(html).toContain('Story Sequence Card 1')
    expect(html).toContain('First prompt')
    expect(html).toContain('Finally prompt')
    expect(html).toContain('Take-home sequence slips')
  })

  it('loads committed Batch 33 product inputs', () => {
    const { source, product: loadedProduct, imageMap } = loadDeskDrawerStorySequenceCardPackBuildInputs()

    expect(source.productSlug).toBe('desk-drawer-story-sequence-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(loadedProduct.pricePoint).toBe('$39')
    expect(imageMap.size).toBe(16)
  })

  it('builds deterministic PDF, ZIP, source HTML, and manifest artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-desk-drawer-build-'))
    try {
      const { source, manifest, paths } = await buildDeskDrawerStorySequenceCardPack({
        buildDir: join(tempRoot, 'product-build', 'desk-drawer-story-sequence-card-pack'),
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
      expect(manifest.productSlug).toBe('desk-drawer-story-sequence-card-pack')
      expect(manifest.files.assets).toHaveLength(16)
      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
