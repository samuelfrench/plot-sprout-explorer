import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateCoatPocketStoryCharacterCardPackSource,
  validateCoatPocketStoryCharacterCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildCoatPocketStoryCharacterCardPack,
  loadCoatPocketStoryCharacterCardPackBuildInputs,
  renderCoatPocketStoryCharacterCardPackHtml,
} from './coat-pocket-story-character-card-pack-builder.mjs'

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

const characterWorldAges = {
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

const characterWorldSlugs = Object.keys(characterWorldAges)

const characterSkills = [
  'character name',
  'pocket item',
  'want clue',
  'worry clue',
  'action clue',
  'voice choice',
  'helper role',
  'object buddy',
  'setting tie',
  'emotion hint',
  'revision detail',
  'closing trait',
]

const characterSlipLabels = [
  'name slip',
  'pocket-item slip',
  'want slip',
  'worry slip',
  'action slip',
  'voice slip',
  'helper-role slip',
  'object-buddy slip',
  'setting-tie slip',
  'closing-trait slip',
]

function card(index, worldSlug, ageBand) {
  return {
    id: `coat-pocket-character-card-${String(index).padStart(2, '0')}`,
    title: `Coat Pocket Character Card ${index}`,
    worldSlug,
    ageBand,
    characterSkill: characterSkills[(index - 1) % characterSkills.length],
    useCase:
      'Adult-led printable paper character card for inventing one fictional coat-pocket story helper: ____________________.',
    adultSetup:
      'Adult: print the card, choose one pretend paper pocket item, and keep every character fictional: ____________________.',
    kidDirection:
      'Invent a character who carries one pretend paper pocket item into the story: ____________________.',
    characterNamePrompt: 'Character name: Pick a fictional name or role label: ____________________.',
    pocketItemPrompt: 'Pocket item: Choose one pretend paper item the character carries: ____________________.',
    wantPrompt: 'Want clue: What gentle story job does this character want to finish? ____________________.',
    worryPrompt: 'Worry clue: What small pretend mix-up does the character wonder about? ____________________.',
    actionPrompt: 'Action clue: Show one tiny action the character tries next: ____________________.',
    voicePrompt: 'Voice prompt: Choose careful, bouncy, puzzled, or proud for one line: ____________________.',
    reviseCharacterPrompt: 'Revise character: Add one detail that makes the character more specific: ____________________.',
    quietOptionLine: 'Quiet option: point to a character label, then fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: invent one more paper-pocket helper for later: ____________________.',
  }
}

function validCoatPocketCharacterSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch37',
    generatedAt: '2026-06-03',
    productSlug: 'coat-pocket-story-character-card-pack',
    title: 'Coat Pocket Story Character Card Pack',
    pricePoint: '$47',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable character cards plus adult guide tools, character routines, take-home character slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/coat-pocket-story-character-card-pack/Coat-Pocket-Story-Character-Card-Pack.pdf',
      zipPath:
        'product-build/coat-pocket-story-character-card-pack/coat-pocket-story-character-card-pack.zip',
      sourceHtmlPath:
        'product-build/coat-pocket-story-character-card-pack/source/coat-pocket-story-character-card-pack.html',
      manifestPath: 'product-build/coat-pocket-story-character-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch37-coat-pocket-character-cards-a.json',
      'content/product-artifacts/lanes/batch37-coat-pocket-character-cards-b.json',
      'content/product-artifacts/lanes/batch37-coat-pocket-character-cards-c.json',
      'content/product-artifacts/lanes/batch37-coat-pocket-character-tools.json',
    ],
    worldSlugs: characterWorldSlugs,
    cover: {
      kicker: 'Printable paper character cards',
      headline: 'Coat Pocket Story Character Card Pack',
      subhead:
        'Sixteen paper cards help writers retell the same pretend story moment from different characters.',
      included: [
        '16 printable coat-pocket character cards',
        'Adult setup guide',
        'Fictional character safety notes',
        'Same-scene retell coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led character routines',
        'Ten take-home character slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the character cards, slips, and adult guide before the writer arrives.',
        'Say that coat pocket means a pretend paper pocket, not real clothing.',
        'Choose one character routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card drafts invented views for a story.',
      ],
      paperCharacterSetup: [
        'Place one character card and three pretend paper pocket-item labels where the adult can see the writing.',
        'Use role words like helper, keeper, visitor, carrier, or finder for every character.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the back of the card for name, pocket item, want, worry, action, voice, and revision notes.',
      ],
      characterCoaching: [
        'Ask what the character carries before asking what the character does.',
        'Ask the writer to keep the pocket item pretend and useful to the story.',
        'Point to the want and worry boxes and ask what the character is trying to fix.',
        'If the character sounds flat, add one invented object or action clue on paper.',
        'Finish by reading the character name, item, want, action, and voice once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every character.',
        'Use broad pretend place words instead of private details, schools, homes, or named locations.',
        'Keep every character card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle paper retell is enough for one extra view.',
        'Invite praise for one clear character name, pocket item, want clue, action, voice, or revision.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused character cards and blank pocket-item labels.',
        'Check finished pages for private details before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh character cards.',
      ],
    },
    characterRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Character Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional character labels.',
      steps: [
        'Adult chooses one broad invented coat-pocket idea and reads the paper-only reminder.',
        'Writer chooses whether to fill the character name or pocket item first.',
        'Adult models how want, worry, action, and voice make a character usable.',
        'Writer drafts one short name, item, want, action, voice, or revision on the card.',
      ],
    })),
    takeHomeCharacterSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Character Slip ${index + 1}`,
      time: characterSlipLabels[index],
      skill: characterSkills[index % characterSkills.length],
      direction: 'Choose one fictional character label and one pretend paper pocket item: ____________________.',
      familyLine: 'A grown-up can ask what the character wants to do next: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented character line if you choose: ____________________.',
      'Show one sketched character label from the card: ____________________.',
      'Name one pocket item without private details: ____________________.',
      'Share one gentle character action you want to keep: ____________________.',
      'Point to one want clue that helped the character: ____________________.',
      'Ask an adult to read your favorite fictional character line: ____________________.',
      'Circle one story detail you want to keep private: ____________________.',
      'Choose one same-scene retell for later: ____________________.',
    ],
    cards: characterWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, characterWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'coat-pocket-story-character-card-pack',
  title: 'Coat Pocket Story Character Card Pack',
  pricePoint: '$47',
  status: 'checkout_pending',
  worldSlugs: characterWorldSlugs,
  worldSummaries: characterWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(characterWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: characterWorldAges[worldSlug] }]))

const worlds = new Map(
  characterWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: characterWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free character card prompt.',
    },
  ]),
)

function writeValidCoatPocketCharacterLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            characterRoutines: source.characterRoutines,
            takeHomeCharacterSlips: source.takeHomeCharacterSlips,
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

describe('Coat Pocket Story Character Card Pack policy', () => {
  it('accepts a valid source with sixteen printable character cards', () => {
    expect(validateCoatPocketStoryCharacterCardPackSource(validCoatPocketCharacterSource(), product, worldAges)).toEqual([])
  })

  it('rejects a character prompt field without a writable blank', () => {
    const source = validCoatPocketCharacterSource()
    source.cards[0].characterNamePrompt = 'Character name: Pick a fictional name or role label.'

    expect(validateCoatPocketStoryCharacterCardPackSource(source, product, worldAges)).toContain(
      'cards[0].characterNamePrompt must include a writable blank.',
    )
  })

  it('rejects real identity, private location, account, upload, public-posting, photo, or camera language', () => {
    const source = validCoatPocketCharacterSource()
    source.cards[0].kidDirection =
      'Use your real name, school route, and actual pocket, take a photo with a camera, upload it to an account, and post a public review: ____________________.'

    expect(validateCoatPocketStoryCharacterCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /real name|school|actual pocket|camera|upload|account|public/i,
    )
  })

  it('rejects minute-duration labels for take-home slips', () => {
    const source = validCoatPocketCharacterSource()
    source.takeHomeCharacterSlips[0].time = '7 minutes'

    expect(validateCoatPocketStoryCharacterCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /timed|duration|minute/i,
    )
  })

  it('requires product world summaries to cover the same linked worlds', () => {
    expect(validateProductWorldSummaries(product, 'Coat Pocket Story Character Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Coat Pocket Story Character Card Pack',
      ),
    ).toContain('Coat Pocket Story Character Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce character cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-coat-pocket-source-'))
    const source = validCoatPocketCharacterSource()
    try {
      writeValidCoatPocketCharacterLaneFiles(tempRoot, source)

      expect(validateCoatPocketStoryCharacterCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects unexpected source lane paths even when copied content matches', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-coat-pocket-source-path-'))
    const source = validCoatPocketCharacterSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-coat-pocket-character-cards-a.json'
    try {
      writeValidCoatPocketCharacterLaneFiles(tempRoot, source)

      expect(validateCoatPocketStoryCharacterCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 37 character-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects source lane files whose laneId does not match the expected file stem', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-coat-pocket-source-laneid-'))
    const source = validCoatPocketCharacterSource()
    const badLanePath = source.sourceFiles[1]
    try {
      writeValidCoatPocketCharacterLaneFiles(tempRoot, source, {
        [badLanePath]: 'batch37-coat-pocket-character-cards-copy',
      })

      expect(validateCoatPocketStoryCharacterCardPackSourceFiles(source, tempRoot)).toContain(
        `${badLanePath}.laneId must be batch37-coat-pocket-character-cards-b.`,
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects coat-pocket character artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-coat-pocket-artifacts-'))
    const source = validCoatPocketCharacterSource()
    const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
    const zipPath = resolve(tempRoot, source.artifact.zipPath)
    const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
    const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
    const readmePath = resolve(tempRoot, 'product-build/coat-pocket-story-character-card-pack/README.txt')
    try {
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(source.cards.length + 5), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK coat pocket zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Coat Pocket Story Character Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Coat Pocket Story Character Card Pack\n', { flag: 'wx' })
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
              readme: {
                path: 'product-build/coat-pocket-story-character-card-pack/README.txt',
                sha256: sha256(readmePath),
                size: readFileSync(readmePath).length,
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

describe('Coat Pocket Story Character Card Pack builder', () => {
  it('renders the printable character card HTML with source cards and local world images', () => {
    const source = validCoatPocketCharacterSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderCoatPocketStoryCharacterCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Coat Pocket Story Character Card Pack')
    expect(html).toContain('Character Card 1')
    expect(html).toContain('Character name')
    expect(html).toContain('Pocket item')
    expect(html).toContain('Take-home character slips')
  })

  it('loads committed Batch 37 product inputs', () => {
    const { source, product: loadedProduct, imageMap } = loadCoatPocketStoryCharacterCardPackBuildInputs()

    expect(source.productSlug).toBe('coat-pocket-story-character-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(loadedProduct.pricePoint).toBe('$47')
    expect(imageMap.size).toBe(16)
  })

  it('builds deterministic PDF, ZIP, source HTML, and manifest artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-coat-pocket-build-'))
    try {
      const { source, manifest, paths } = await buildCoatPocketStoryCharacterCardPack({
        buildDir: join(tempRoot, 'product-build', 'coat-pocket-story-character-card-pack'),
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
      expect(manifest.productSlug).toBe('coat-pocket-story-character-card-pack')
      expect(manifest.files.assets).toHaveLength(16)
      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
