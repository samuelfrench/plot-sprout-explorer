import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validatePaperTrayStorySettingCardPackSource,
  validatePaperTrayStorySettingCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildPaperTrayStorySettingCardPack,
  loadPaperTrayStorySettingCardPackBuildInputs,
  renderPaperTrayStorySettingCardPackHtml,
} from './paper-tray-story-setting-card-pack-builder.mjs'

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

const settingWorldAges = {
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

const settingWorldSlugs = Object.keys(settingWorldAges)

const settingSkills = [
  'setting name',
  'tray label',
  'mood clue',
  'sensory clue',
  'map edge',
  'object anchor',
  'movement path',
  'weather hint',
  'sound detail',
  'color clue',
  'revision detail',
  'closing place',
]

const settingSlipLabels = [
  'name slip',
  'tray-label slip',
  'mood slip',
  'sensory slip',
  'map-edge slip',
  'object-anchor slip',
  'movement slip',
  'weather slip',
  'sound slip',
  'closing-place slip',
]

function card(index, worldSlug, ageBand) {
  return {
    id: `paper-tray-setting-card-${String(index).padStart(2, '0')}`,
    title: `Paper Tray Setting Card ${index}`,
    worldSlug,
    ageBand,
    settingSkill: settingSkills[(index - 1) % settingSkills.length],
    useCase:
      'Adult-led printable paper setting card for inventing one fictional story place from broad tray clues: ____________________.',
    adultSetup:
      'Adult: place one blank tray card on the table and name the whole place as make-believe: ____________________.',
    kidDirection:
      'Invent a story place that could sit in a paper tray and give it one broad clue: ____________________.',
    settingNamePrompt: 'Setting name: give the make-believe place a short title: ____________________.',
    trayLabelPrompt: 'Tray label: choose a broad paper label for the place card: ____________________.',
    moodPrompt: 'Mood clue: pick calm, busy, bright, odd, or cozy for the place: ____________________.',
    sensoryPrompt: 'Sensory clue: add one color, sound, texture, or smell from imagination: ____________________.',
    mapEdgePrompt: 'Map edge: describe one border on the pretend paper map: ____________________.',
    objectAnchorPrompt: 'Object anchor: add one harmless story object that belongs in the place: ____________________.',
    reviseSettingPrompt: 'Revise setting: add one clearer detail that helps a story happen there: ____________________.',
    quietOptionLine: 'Quiet option: point to a tray label, then fill one blank: ____________________.',
    takeHomeLine: 'Take-home line: invent one more paper-tray place for later: ____________________.',
  }
}

function validPaperTraySettingSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch38',
    generatedAt: '2026-06-03',
    productSlug: 'paper-tray-story-setting-card-pack',
    title: 'Paper Tray Story Setting Card Pack',
    pricePoint: '$49',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable setting cards plus adult guide tools, setting routines, take-home setting slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/paper-tray-story-setting-card-pack/Paper-Tray-Story-Setting-Card-Pack.pdf',
      zipPath:
        'product-build/paper-tray-story-setting-card-pack/paper-tray-story-setting-card-pack.zip',
      sourceHtmlPath:
        'product-build/paper-tray-story-setting-card-pack/source/paper-tray-story-setting-card-pack.html',
      manifestPath: 'product-build/paper-tray-story-setting-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch38-paper-tray-setting-cards-a.json',
      'content/product-artifacts/lanes/batch38-paper-tray-setting-cards-b.json',
      'content/product-artifacts/lanes/batch38-paper-tray-setting-cards-c.json',
      'content/product-artifacts/lanes/batch38-paper-tray-setting-tools.json',
    ],
    worldSlugs: settingWorldSlugs,
    cover: {
      kicker: 'Printable paper setting cards',
      headline: 'Paper Tray Story Setting Card Pack',
      subhead:
        'Sixteen paper cards help writers build fictional story places from tray labels, mood clues, sensory details, and map edges.',
      included: [
        '16 printable paper tray setting cards',
        'Adult setup guide',
        'Fictional setting safety notes',
        'Paper tray coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led setting routines',
        'Ten take-home setting slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the setting cards, tray labels, and slips before the writer arrives.',
        'Place blank tray cards where the adult can see every paper choice.',
        'Choose one routine and one fictional world before writers begin.',
        'Keep the activity offline, paper-only, and adult-led.',
        'Explain that every place is invented for a story page.',
      ],
      paperSettingSetup: [
        'Place one blank setting card on the tray and choose a broad story-place label.',
        'Add one mood word, one sensory word, and one harmless object clue.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the card back for name, label, mood, sensory, edge, object, and revision notes.',
      ],
      settingCoaching: [
        'Ask what the place feels like before asking what happens there.',
        'Ask the writer to keep the setting broad, invented, and useful to the story.',
        'Point to the mood and sensory boxes and ask what a reader would notice first.',
        'If the setting feels flat, add one invented object or map-edge clue on paper.',
        'Finish by reading the setting name, label, mood, object, and revision once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, and broad story-place labels for every setting.',
        'Use broad pretend place words instead of narrow real-world facts.',
        'Keep every setting card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for narrow real-world facts before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle paper place is enough for one story start.',
        'Invite praise for one clear setting name, mood clue, object anchor, or revision.',
        'Ask adults to keep narrow real-world facts and narrow place labels off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused setting cards and blank tray labels.',
        'Check finished pages for narrow real-world facts before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh setting cards.',
      ],
    },
    settingRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Setting Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional setting labels.',
      steps: [
        'Adult chooses one broad invented paper tray idea and reads the paper-only reminder.',
        'Writer chooses whether to fill the setting name or tray label first.',
        'Adult models how mood, sensory, edge, and object clues make a setting usable.',
        'Writer drafts one short name, label, mood, object, edge, or revision on the card.',
      ],
    })),
    takeHomeSettingSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Setting Slip ${index + 1}`,
      time: settingSlipLabels[index],
      skill: settingSkills[index % settingSkills.length],
      direction: 'Choose one fictional setting label and one pretend paper tray clue: ____________________.',
      familyLine: 'A grown-up can ask what a character would notice first: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented setting name if you choose: ____________________.',
      'Show one sketched tray label from the card: ____________________.',
      'Name one mood clue without narrow real-world facts: ____________________.',
      'Share one harmless story object you want to keep: ____________________.',
      'Point to one sensory clue that helped the setting: ____________________.',
      'Ask an adult to read your favorite fictional setting line: ____________________.',
      'Circle one story-place detail you want to keep broad: ____________________.',
      'Choose one paper-tray place for later: ____________________.',
    ],
    cards: settingWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, settingWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'paper-tray-story-setting-card-pack',
  title: 'Paper Tray Story Setting Card Pack',
  pricePoint: '$49',
  status: 'checkout_pending',
  worldSlugs: settingWorldSlugs,
  worldSummaries: settingWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(settingWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: settingWorldAges[worldSlug] }]))

const worlds = new Map(
  settingWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: settingWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free setting card prompt.',
    },
  ]),
)

function writeValidPaperTraySettingLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            settingRoutines: source.settingRoutines,
            takeHomeSettingSlips: source.takeHomeSettingSlips,
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

describe('Paper Tray Story Setting Card Pack policy', () => {
  it('accepts a valid source with sixteen printable setting cards', () => {
    expect(validatePaperTrayStorySettingCardPackSource(validPaperTraySettingSource(), product, worldAges)).toEqual([])
  })

  it('rejects a setting prompt field without a writable blank', () => {
    const source = validPaperTraySettingSource()
    source.cards[0].settingNamePrompt = 'Setting name: give the make-believe place a short title.'

    expect(validatePaperTrayStorySettingCardPackSource(source, product, worldAges)).toContain(
      'cards[0].settingNamePrompt must include a writable blank.',
    )
  })

  it('rejects real room, school, address, route, GPS, account, upload, public-posting, photo, or camera language', () => {
    const source = validPaperTraySettingSource()
    source.cards[0].kidDirection =
      'Describe your real classroom room, home address, school route, GPS location, take a photo with a camera, upload it to an account, and make a public post: ____________________.'

    expect(validatePaperTrayStorySettingCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /classroom|room|home|address|school|route|gps|camera|upload|account|public/i,
    )
  })

  it('rejects minute-duration labels for take-home slips', () => {
    const source = validPaperTraySettingSource()
    source.takeHomeSettingSlips[0].time = '7 minutes'

    expect(validatePaperTrayStorySettingCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /timed|duration|minute/i,
    )
  })

  it('requires product world summaries to cover the same linked worlds', () => {
    expect(validateProductWorldSummaries(product, 'Paper Tray Story Setting Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Paper Tray Story Setting Card Pack',
      ),
    ).toContain('Paper Tray Story Setting Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce setting cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-tray-source-'))
    const source = validPaperTraySettingSource()
    try {
      writeValidPaperTraySettingLaneFiles(tempRoot, source)

      expect(validatePaperTrayStorySettingCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects unexpected source lane paths even when copied content matches', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-tray-source-path-'))
    const source = validPaperTraySettingSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-paper-tray-setting-cards-a.json'
    try {
      writeValidPaperTraySettingLaneFiles(tempRoot, source)

      expect(validatePaperTrayStorySettingCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 38 setting-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects source lane files whose laneId does not match the expected file stem', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-tray-source-laneid-'))
    const source = validPaperTraySettingSource()
    const badLanePath = source.sourceFiles[1]
    try {
      writeValidPaperTraySettingLaneFiles(tempRoot, source, {
        [badLanePath]: 'batch38-paper-tray-setting-cards-copy',
      })

      expect(validatePaperTrayStorySettingCardPackSourceFiles(source, tempRoot)).toContain(
        `${badLanePath}.laneId must be batch38-paper-tray-setting-cards-b.`,
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects paper-tray setting artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-tray-artifacts-'))
    const source = validPaperTraySettingSource()
    const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
    const zipPath = resolve(tempRoot, source.artifact.zipPath)
    const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
    const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
    const readmePath = resolve(tempRoot, 'product-build/paper-tray-story-setting-card-pack/README.txt')
    try {
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(source.cards.length + 5), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK paper tray zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Paper Tray Story Setting Card Pack</title>', {
        flag: 'wx',
      })
      writeFileSync(readmePath, 'Paper Tray Story Setting Card Pack\n', { flag: 'wx' })
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
                path: 'product-build/paper-tray-story-setting-card-pack/README.txt',
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

describe('Paper Tray Story Setting Card Pack builder', () => {
  it('renders the printable setting card HTML with source cards and local world images', () => {
    const source = validPaperTraySettingSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderPaperTrayStorySettingCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Paper Tray Story Setting Card Pack')
    expect(html).toContain('Setting Card 1')
    expect(html).toContain('Setting name')
    expect(html).toContain('Tray label')
    expect(html).toContain('Take-home setting slips')
  })

  it('loads committed Batch 38 product inputs', () => {
    const { source, product: loadedProduct, imageMap } = loadPaperTrayStorySettingCardPackBuildInputs()

    expect(source.productSlug).toBe('paper-tray-story-setting-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(loadedProduct.pricePoint).toBe('$49')
    expect(imageMap.size).toBe(16)
  })

  it('builds deterministic PDF, ZIP, source HTML, and manifest artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-paper-tray-build-'))
    try {
      const { source, manifest, paths } = await buildPaperTrayStorySettingCardPack({
        buildDir: join(tempRoot, 'product-build', 'paper-tray-story-setting-card-pack'),
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
      expect(manifest.productSlug).toBe('paper-tray-story-setting-card-pack')
      expect(manifest.files.assets).toHaveLength(16)
      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
