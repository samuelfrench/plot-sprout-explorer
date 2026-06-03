import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateProductWorldSummaries,
  validateReadingNookStoryCauseEffectCardPackSource,
  validateReadingNookStoryCauseEffectCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildReadingNookStoryCauseEffectCardPack,
  loadReadingNookStoryCauseEffectCardPackBuildInputs,
  renderReadingNookStoryCauseEffectCardPackHtml,
} from './reading-nook-story-cause-effect-card-pack-builder.mjs'

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

const causeEffectWorldAges = {
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

const causeEffectWorldSlugs = Object.keys(causeEffectWorldAges)

const causeEffectSkills = [
  'clear cause',
  'direct effect',
  'because statement',
  'so result',
  'cause-and-effect chain',
  'character choice cause',
  'setting effect',
  'object cause',
  'problem cause',
  'reaction effect',
  'first cause',
  'final result',
]

function card(index, worldSlug, ageBand) {
  const skill = causeEffectSkills[(index - 1) % causeEffectSkills.length]
  return {
    id: `reading-nook-cause-effect-card-${String(index).padStart(2, '0')}`,
    title: `Reading Nook Cause-and-Effect Card ${index}`,
    worldSlug,
    ageBand,
    causeEffectSkill: skill,
    useCase:
      'Adult-led printable cause-and-effect card for linking one invented reading nook cause to one gentle story result: ____________________.',
    adultSetup:
      'Print the card, choose one pretend page label, and keep every cause and effect fictional and offline: ____________________.',
    kidDirection:
      'Choose a pretend reading nook detail, then write what causes it and what changes after it: ____________________.',
    causePrompt: 'Cause prompt: The story changes because the pretend page shows ____________________.',
    effectPrompt: 'Effect prompt: The gentle result is that the character decides to ____________________.',
    becausePrompt: 'Because prompt: Write a because sentence using ____________________.',
    soPrompt: 'So prompt: Finish the so sentence with one small result: ____________________.',
    chainPrompt: 'Chain prompt: Draw one arrow from the cause to the effect and name ____________________.',
    checkBackPrompt: 'Check back: Point to the cause before naming what changed: ____________________.',
    quietOptionLine: 'Quiet option: Mark the cause box and effect box before writing one line: ____________________.',
    takeHomeLine: 'Take-home line: Try the same card later with a new pretend page label: ____________________.',
  }
}

function validReadingNookCauseEffectSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch34',
    generatedAt: '2026-06-03',
    productSlug: 'reading-nook-story-cause-effect-card-pack',
    title: 'Reading Nook Story Cause-and-Effect Card Pack',
    pricePoint: '$41',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable cause-and-effect cards plus adult guide tools, cause/effect routines, take-home cause/effect slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/reading-nook-story-cause-effect-card-pack/Reading-Nook-Story-Cause-Effect-Card-Pack.pdf',
      zipPath:
        'product-build/reading-nook-story-cause-effect-card-pack/reading-nook-story-cause-effect-card-pack.zip',
      sourceHtmlPath:
        'product-build/reading-nook-story-cause-effect-card-pack/source/reading-nook-story-cause-effect-card-pack.html',
      manifestPath: 'product-build/reading-nook-story-cause-effect-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch34-reading-nook-cause-effect-cards-a.json',
      'content/product-artifacts/lanes/batch34-reading-nook-cause-effect-cards-b.json',
      'content/product-artifacts/lanes/batch34-reading-nook-cause-effect-cards-c.json',
      'content/product-artifacts/lanes/batch34-reading-nook-cause-effect-tools.json',
    ],
    worldSlugs: causeEffectWorldSlugs,
    cover: {
      kicker: 'Printable paper cause-and-effect cards',
      headline: 'Reading Nook Story Cause-and-Effect Card Pack',
      subhead:
        'Sixteen paper cards help writers connect a pretend reading nook cause to a clear fictional result.',
      included: [
        '16 printable reading-nook cause-and-effect cards',
        'Adult setup guide',
        'Fictional cause/effect safety notes',
        'Cause/effect coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led cause/effect routines',
        'Ten take-home cause/effect slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the cause/effect cards, slips, and adult guide before the writer arrives.',
        'Say that reading nook means a pretend paper corner, not a private place.',
        'Choose one cause/effect routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card links why something happens to what changes next.',
      ],
      paperCauseEffectSetup: [
        'Place one cause/effect card and one blank page where the adult can see the writing.',
        'Use invented page labels, cushion corners, lamp glows, and broad fictional places.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the back of the card for cause, because, so, and effect notes.',
      ],
      causeEffectCoaching: [
        'Ask what started the change before asking what happened after it.',
        'Ask the writer to test the because sentence aloud.',
        'Point to the effect box and ask what changed because of the cause.',
        'If the result feels too sudden, add one bridge arrow on paper.',
        'Finish by reading the because and so sentence together once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every person on the cards.',
        'Use broad pretend place words instead of private details or named locations.',
        'Keep every cause/effect card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle paper retell is enough for one extra link.',
        'Invite praise for one clear because word, arrow, sketch, or sentence.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused cause/effect cards and blank pages.',
        'Check finished pages for private details before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh cause/effect cards.',
      ],
    },
    causeEffectRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Cause Effect Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one fictional reading nook detail.',
      steps: [
        'Adult chooses one broad invented nook idea and reads the paper-only reminder.',
        'Writer chooses whether to fill the cause box or effect box first.',
        'Adult models how a pretend page detail can cause one gentle result.',
        'Writer drafts one short because or so line on the card.',
      ],
    })),
    takeHomeCauseEffectSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Cause Effect Slip ${index + 1}`,
      time: [
        'one-card slip',
        'because slip',
        'so slip',
        'chain slip',
        'effect arrow slip',
        'choice slip',
        'setting slip',
        'object slip',
        'problem-result slip',
        'final result slip',
      ][index],
      skill: causeEffectSkills[index % causeEffectSkills.length],
      direction: 'Choose one fictional reading nook detail and write the cause here: ____________________.',
      familyLine: 'A grown-up can ask what changed after that cause: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented cause if you choose: ____________________.',
      'Show one sketched cause/effect arrow from the card: ____________________.',
      'Name one because word without private details: ____________________.',
      'Share one gentle result you want to keep: ____________________.',
      'Point to one effect that grew from the cause: ____________________.',
      'Ask an adult to read your favorite cause/effect line: ____________________.',
      'Circle one story detail you want to keep private: ____________________.',
      'Choose one cause/effect link for later: ____________________.',
    ],
    cards: causeEffectWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, causeEffectWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'reading-nook-story-cause-effect-card-pack',
  title: 'Reading Nook Story Cause-and-Effect Card Pack',
  pricePoint: '$41',
  status: 'checkout_pending',
  worldSlugs: causeEffectWorldSlugs,
  worldSummaries: causeEffectWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(
  causeEffectWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: causeEffectWorldAges[worldSlug] }]),
)

const worlds = new Map(
  causeEffectWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: causeEffectWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free cause/effect card prompt.',
    },
  ]),
)

describe('Reading Nook Story Cause-and-Effect Card Pack policy', () => {
  it('accepts a valid source with sixteen printable cause/effect cards', () => {
    expect(validateReadingNookStoryCauseEffectCardPackSource(validReadingNookCauseEffectSource(), product, worldAges)).toEqual([])
  })

  it('rejects a card response field without a writable blank', () => {
    const source = validReadingNookCauseEffectSource()
    source.cards[0].causePrompt = 'The pretend page changes because the cushion glows.'

    expect(validateReadingNookStoryCauseEffectCardPackSource(source, product, worldAges)).toContain(
      'cards[0].causePrompt must include a writable blank.',
    )
  })

  it('rejects real book, review, account, or upload language', () => {
    const source = validReadingNookCauseEffectSource()
    source.cards[0].kidDirection = 'Write a public review of a real author and upload it to the class portal: ____________________.'

    expect(validateReadingNookStoryCauseEffectCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /review|author|upload|portal/i,
    )
  })

  it('rejects minute-duration labels for take-home slips', () => {
    const source = validReadingNookCauseEffectSource()
    source.takeHomeCauseEffectSlips[0].time = '7 minutes'

    expect(validateReadingNookStoryCauseEffectCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /timed|duration|minute/i,
    )
  })

  it('requires product world summaries to cover the same linked worlds', () => {
    expect(validateProductWorldSummaries(product, 'Reading Nook Story Cause-and-Effect Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Reading Nook Story Cause-and-Effect Card Pack',
      ),
    ).toContain('Reading Nook Story Cause-and-Effect Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce cause/effect cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-reading-nook-source-'))
    const source = validReadingNookCauseEffectSource()
    try {
      for (const sourceFile of source.sourceFiles) {
        const target = resolve(tempRoot, sourceFile)
        const lane =
          sourceFile.includes('-tools')
            ? {
                laneId: 'batch34-reading-nook-cause-effect-tools',
                adultGuide: source.adultGuide,
                causeEffectRoutines: source.causeEffectRoutines,
                takeHomeCauseEffectSlips: source.takeHomeCauseEffectSlips,
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

      expect(validateReadingNookStoryCauseEffectCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects reading-nook cause/effect artifacts against the reading-nook required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-reading-nook-artifacts-'))
    const source = validReadingNookCauseEffectSource()
    const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
    const zipPath = resolve(tempRoot, source.artifact.zipPath)
    const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
    const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
    try {
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(source.cards.length + 5), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK reading nook zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Reading Nook Story Cause-and-Effect Card Pack</title>', { flag: 'wx' })
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

describe('Reading Nook Story Cause-and-Effect Card Pack builder', () => {
  it('renders the printable cause/effect card HTML with source cards and local world images', () => {
    const source = validReadingNookCauseEffectSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderReadingNookStoryCauseEffectCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Reading Nook Story Cause-and-Effect Card Pack')
    expect(html).toContain('Cause-and-Effect Card 1')
    expect(html).toContain('Cause prompt')
    expect(html).toContain('Effect prompt')
    expect(html).toContain('Take-home cause/effect slips')
  })

  it('loads committed Batch 34 product inputs', () => {
    const { source, product: loadedProduct, imageMap } = loadReadingNookStoryCauseEffectCardPackBuildInputs()

    expect(source.productSlug).toBe('reading-nook-story-cause-effect-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(loadedProduct.pricePoint).toBe('$41')
    expect(imageMap.size).toBe(16)
  })

  it('builds deterministic PDF, ZIP, source HTML, and manifest artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-reading-nook-build-'))
    try {
      const { source, manifest, paths } = await buildReadingNookStoryCauseEffectCardPack({
        buildDir: join(tempRoot, 'product-build', 'reading-nook-story-cause-effect-card-pack'),
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
      expect(manifest.productSlug).toBe('reading-nook-story-cause-effect-card-pack')
      expect(manifest.files.assets).toHaveLength(16)
      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
