import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import {
  inspectArtifactFiles,
  validateBlanketFortStoryDialogueCardPackSource,
  validateBlanketFortStoryDialogueCardPackSourceFiles,
  validateProductWorldSummaries,
} from './product-artifact-policy.mjs'
import {
  buildBlanketFortStoryDialogueCardPack,
  loadBlanketFortStoryDialogueCardPackBuildInputs,
  renderBlanketFortStoryDialogueCardPackHtml,
} from './blanket-fort-story-dialogue-card-pack-builder.mjs'

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

const dialogueWorldAges = {
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

const dialogueWorldSlugs = Object.keys(dialogueWorldAges)

const dialogueSkills = [
  'greeting line',
  'question reply',
  'feeling clue',
  'dialogue tag',
  'turn-taking',
  'revise for voice',
  'setting-aware line',
  'object clue line',
  'problem-solving reply',
  'listener reaction',
  'polite disagreement',
  'closing line',
]

const dialogueSlipLabels = [
  'one-line slip',
  'question slip',
  'reply slip',
  'tag slip',
  'voice slip',
  'turn slip',
  'feeling slip',
  'object slip',
  'problem-reply slip',
  'closing slip',
]

function card(index, worldSlug, ageBand) {
  const skill = dialogueSkills[(index - 1) % dialogueSkills.length]
  return {
    id: `blanket-fort-dialogue-card-${String(index).padStart(2, '0')}`,
    title: `Blanket Fort Dialogue Card ${index}`,
    worldSlug,
    ageBand,
    dialogueSkill: skill,
    useCase:
      'Adult-led printable dialogue card for writing one fictional blanket-fort story exchange on paper: ____________________.',
    adultSetup:
      'Print the card, choose two pretend speaker labels, and keep every line fictional and offline: ____________________.',
    kidDirection:
      'Write one make-believe speaker line and one reply that fits the story scene: ____________________.',
    speakerOnePrompt: 'Speaker one says a gentle story line about ____________________.',
    speakerTwoPrompt: 'Speaker two answers with a matching story reply about ____________________.',
    dialogueTagPrompt: 'Add a tag that tells who is speaking without using a real name: ____________________.',
    feelingCluePrompt: 'Show a feeling clue through one invented action or object: ____________________.',
    replyPrompt: 'Write the next reply that listens to the first line: ____________________.',
    reviseLinePrompt: 'Revise one line so the speaker voice is clearer: ____________________.',
    quietOptionLine: 'Quiet option: point to the speaker label first, then write one short line: ____________________.',
    takeHomeLine: 'Take-home line: try the same fictional exchange with two new paper speaker labels: ____________________.',
  }
}

function validBlanketFortDialogueSource(overrides = {}) {
  return {
    batchId: '2026-06-03-batch35',
    generatedAt: '2026-06-03',
    productSlug: 'blanket-fort-story-dialogue-card-pack',
    title: 'Blanket Fort Story Dialogue Card Pack',
    pricePoint: '$43',
    audience:
      'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable dialogue cards plus adult guide tools, dialogue routines, take-home dialogue slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/blanket-fort-story-dialogue-card-pack/Blanket-Fort-Story-Dialogue-Card-Pack.pdf',
      zipPath:
        'product-build/blanket-fort-story-dialogue-card-pack/blanket-fort-story-dialogue-card-pack.zip',
      sourceHtmlPath:
        'product-build/blanket-fort-story-dialogue-card-pack/source/blanket-fort-story-dialogue-card-pack.html',
      manifestPath: 'product-build/blanket-fort-story-dialogue-card-pack/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch35-blanket-fort-dialogue-cards-a.json',
      'content/product-artifacts/lanes/batch35-blanket-fort-dialogue-cards-b.json',
      'content/product-artifacts/lanes/batch35-blanket-fort-dialogue-cards-c.json',
      'content/product-artifacts/lanes/batch35-blanket-fort-dialogue-tools.json',
    ],
    worldSlugs: dialogueWorldSlugs,
    cover: {
      kicker: 'Printable paper dialogue cards',
      headline: 'Blanket Fort Story Dialogue Card Pack',
      subhead:
        'Sixteen paper cards help writers draft two fictional speaker lines inside a pretend blanket-fort story scene.',
      included: [
        '16 printable blanket-fort dialogue cards',
        'Adult setup guide',
        'Fictional dialogue safety notes',
        'Speaker line coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led dialogue routines',
        'Ten take-home dialogue slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the dialogue cards, slips, and adult guide before the writer arrives.',
        'Say that blanket fort means a pretend paper scene, not a private place.',
        'Choose one dialogue routine before writers begin.',
        'Keep the session offline, paper-only, and adult-led.',
        'Explain that the card drafts invented speaker lines for a story.',
      ],
      paperDialogueSetup: [
        'Place one dialogue card and two speaker labels where the adult can see the writing.',
        'Use invented speaker labels like Speaker A, helper, guide, or visitor.',
        'Let pointing, sketching, dictating, or filling one blank count as progress.',
        'Keep finished cards in an adult folder until they go to the family adult.',
        'Use the back of the card for speaker, tag, feeling clue, and reply notes.',
      ],
      dialogueCoaching: [
        'Ask what speaker one wants before asking what speaker two answers.',
        'Ask the writer to test whether the reply listens to the first line.',
        'Point to the tag box and ask who speaks without adding a real name.',
        'If the line sounds flat, add one object or action clue on paper.',
        'Finish by reading the invented line and reply together once.',
      ],
      privacyAndSafetyNotes: [
        'Use invented names, role words, or blank labels for every speaker.',
        'Use broad pretend place words instead of private details or named locations.',
        'Keep every dialogue card offline with the family adult, tutor, or table host.',
        'Sharing stays optional and limited to one invented word, sketch, or line.',
        'Check every take-home slip for private details before it leaves the adult-led table.',
      ],
      familyHandoff: [
        'Send one finished paper card and one blank take-home slip with each writer.',
        'Tell family adults that one gentle paper retell is enough for one extra exchange.',
        'Invite praise for one clear speaker label, tag, reply, or feeling clue.',
        'Ask adults to keep personal names and narrow place labels off the page.',
        'Suggest saving the card as a starter for a later printable story.',
      ],
      reset: [
        'Collect unused dialogue cards and blank speaker labels.',
        'Check finished pages for private details before they go to family adults.',
        'Recycle scrap pages that only hold practice marks.',
        'Restock the adult folder with fresh dialogue cards.',
      ],
    },
    dialogueRoutines: Array.from({ length: 6 }, (_, index) => ({
      name: `Dialogue Routine ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with two fictional speaker labels.',
      steps: [
        'Adult chooses one broad invented blanket-fort idea and reads the paper-only reminder.',
        'Writer chooses whether to fill speaker one or speaker two first.',
        'Adult models how one line can invite one matching reply.',
        'Writer drafts one short line, reply, tag, or feeling clue on the card.',
      ],
    })),
    takeHomeDialogueSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Dialogue Slip ${index + 1}`,
      time: dialogueSlipLabels[index],
      skill: dialogueSkills[index % dialogueSkills.length],
      direction: 'Choose two fictional speaker labels and write the first line here: ____________________.',
      familyLine: 'A grown-up can ask what the second speaker answers next: ____________________.',
    })),
    optionalSharePrompts: [
      'Read one invented speaker line if you choose: ____________________.',
      'Show one sketched speaker label from the card: ____________________.',
      'Name one dialogue tag without private details: ____________________.',
      'Share one gentle reply you want to keep: ____________________.',
      'Point to one feeling clue that helped the reply: ____________________.',
      'Ask an adult to read your favorite fictional line: ____________________.',
      'Circle one story detail you want to keep private: ____________________.',
      'Choose one line-and-reply pair for later: ____________________.',
    ],
    cards: dialogueWorldSlugs.map((worldSlug, index) => card(index + 1, worldSlug, dialogueWorldAges[worldSlug])),
    ...overrides,
  }
}

const product = {
  slug: 'blanket-fort-story-dialogue-card-pack',
  title: 'Blanket Fort Story Dialogue Card Pack',
  pricePoint: '$43',
  status: 'checkout_pending',
  worldSlugs: dialogueWorldSlugs,
  worldSummaries: dialogueWorldSlugs.map((slug) => ({
    slug,
    summary: `A linked fictional world summary for ${slug}.`,
  })),
}

const worldAges = new Map(
  dialogueWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: dialogueWorldAges[worldSlug] }]),
)

const worlds = new Map(
  dialogueWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: dialogueWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free dialogue card prompt.',
    },
  ]),
)

function writeValidBlanketFortDialogueLaneFiles(tempRoot, source, laneIdOverrides = {}) {
  for (const sourceFile of source.sourceFiles) {
    const target = resolve(tempRoot, sourceFile)
    const laneId = laneIdOverrides[sourceFile] ?? sourceFile.split('/').at(-1)?.replace('.json', '')
    const lane =
      sourceFile.includes('-tools')
        ? {
            laneId,
            adultGuide: source.adultGuide,
            dialogueRoutines: source.dialogueRoutines,
            takeHomeDialogueSlips: source.takeHomeDialogueSlips,
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

describe('Blanket Fort Story Dialogue Card Pack policy', () => {
  it('accepts a valid source with sixteen printable dialogue cards', () => {
    expect(validateBlanketFortStoryDialogueCardPackSource(validBlanketFortDialogueSource(), product, worldAges)).toEqual([])
  })

  it('rejects a dialogue prompt field without a writable blank', () => {
    const source = validBlanketFortDialogueSource()
    source.cards[0].speakerOnePrompt = 'Speaker one says a gentle story line.'

    expect(validateBlanketFortStoryDialogueCardPackSource(source, product, worldAges)).toContain(
      'cards[0].speakerOnePrompt must include a writable blank.',
    )
  })

  it('rejects real speech, private conversation, recording, account, or upload language', () => {
    const source = validBlanketFortDialogueSource()
    source.cards[0].kidDirection =
      'Record a private conversation, upload the audio to the class account, and post it publicly: ____________________.'

    expect(validateBlanketFortStoryDialogueCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /record|private conversation|upload|account|public/i,
    )
  })

  it('rejects minute-duration labels for take-home slips', () => {
    const source = validBlanketFortDialogueSource()
    source.takeHomeDialogueSlips[0].time = '7 minutes'

    expect(validateBlanketFortStoryDialogueCardPackSource(source, product, worldAges).join('\n')).toMatch(
      /timed|duration|minute/i,
    )
  })

  it('requires product world summaries to cover the same linked worlds', () => {
    expect(validateProductWorldSummaries(product, 'Blanket Fort Story Dialogue Card Pack')).toEqual([])
    expect(
      validateProductWorldSummaries(
        {
          ...product,
          worldSummaries: product.worldSummaries.slice(1),
        },
        'Blanket Fort Story Dialogue Card Pack',
      ),
    ).toContain('Blanket Fort Story Dialogue Card Pack worldSummaries must cover every linked world.')
  })

  it('validates source lane files reproduce dialogue cards and tools exactly', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-blanket-fort-source-'))
    const source = validBlanketFortDialogueSource()
    try {
      writeValidBlanketFortDialogueLaneFiles(tempRoot, source)

      expect(validateBlanketFortStoryDialogueCardPackSourceFiles(source, tempRoot)).toEqual([])
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects unexpected source lane paths even when copied content matches', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-blanket-fort-source-path-'))
    const source = validBlanketFortDialogueSource()
    source.sourceFiles[0] = 'content/product-artifacts/lanes/copied-blanket-fort-dialogue-cards-a.json'
    try {
      writeValidBlanketFortDialogueLaneFiles(tempRoot, source)

      expect(validateBlanketFortStoryDialogueCardPackSourceFiles(source, tempRoot)).toContain(
        'sourceFiles must list the exact Batch 35 dialogue-card lane and tools files.',
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects source lane files whose laneId does not match the expected file stem', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-blanket-fort-source-laneid-'))
    const source = validBlanketFortDialogueSource()
    const badLanePath = source.sourceFiles[1]
    try {
      writeValidBlanketFortDialogueLaneFiles(tempRoot, source, {
        [badLanePath]: 'batch35-blanket-fort-dialogue-cards-copy',
      })

      expect(validateBlanketFortStoryDialogueCardPackSourceFiles(source, tempRoot)).toContain(
        `${badLanePath}.laneId must be batch35-blanket-fort-dialogue-cards-b.`,
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('inspects blanket-fort dialogue artifacts against the required paths', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-blanket-fort-artifacts-'))
    const source = validBlanketFortDialogueSource()
    const pdfPath = resolve(tempRoot, source.artifact.pdfPath)
    const zipPath = resolve(tempRoot, source.artifact.zipPath)
    const sourceHtmlPath = resolve(tempRoot, source.artifact.sourceHtmlPath)
    const manifestPath = resolve(tempRoot, source.artifact.manifestPath)
    try {
      mkdirSync(dirname(pdfPath), { recursive: true })
      mkdirSync(dirname(sourceHtmlPath), { recursive: true })
      writeFileSync(pdfPath, fakePdf(source.cards.length + 5), { flag: 'wx' })
      writeFileSync(zipPath, Buffer.from('PK blanket fort zip'), { flag: 'wx' })
      writeFileSync(sourceHtmlPath, '<!doctype html><title>Blanket Fort Story Dialogue Card Pack</title>', { flag: 'wx' })
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

describe('Blanket Fort Story Dialogue Card Pack builder', () => {
  it('renders the printable dialogue card HTML with source cards and local world images', () => {
    const source = validBlanketFortDialogueSource()
    const imageMap = new Map(source.worldSlugs.map((slug) => [slug, `assets/${slug}.jpg`]))
    const html = renderBlanketFortStoryDialogueCardPackHtml(source, worlds, imageMap)

    expect(html).toContain('Blanket Fort Story Dialogue Card Pack')
    expect(html).toContain('Dialogue Card 1')
    expect(html).toContain('Speaker one')
    expect(html).toContain('Speaker two')
    expect(html).toContain('Take-home dialogue slips')
  })

  it('loads committed Batch 35 product inputs', () => {
    const { source, product: loadedProduct, imageMap } = loadBlanketFortStoryDialogueCardPackBuildInputs()

    expect(source.productSlug).toBe('blanket-fort-story-dialogue-card-pack')
    expect(source.cards).toHaveLength(16)
    expect(loadedProduct.pricePoint).toBe('$43')
    expect(imageMap.size).toBe(16)
  })

  it('builds deterministic PDF, ZIP, source HTML, and manifest artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'plotsprout-blanket-fort-build-'))
    try {
      const { source, manifest, paths } = await buildBlanketFortStoryDialogueCardPack({
        buildDir: join(tempRoot, 'product-build', 'blanket-fort-story-dialogue-card-pack'),
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
      expect(manifest.productSlug).toBe('blanket-fort-story-dialogue-card-pack')
      expect(manifest.files.assets).toHaveLength(16)
      expect(inspectArtifactFiles(tempRoot, source.artifact, { expectedPdfPages: 21 }).valid).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
