import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import {
  validateKitchenTableStoryRecipeCardDeckSource,
  validateKitchenTableStoryRecipeCardDeckSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildKitchenTableStoryRecipeCardDeck,
  loadKitchenTableStoryRecipeCardDeckBuildInputs,
  renderKitchenTableStoryRecipeCardDeckHtml,
} from './kitchen-table-story-recipe-card-deck-builder.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function fakePdf(pageCount) {
  return Buffer.from(
    `%PDF-1.7\n${Array.from({ length: pageCount }, (_, index) => `${index + 1} 0 obj << /Type /Page >> endobj`).join('\n')}\n%%EOF\n`,
  )
}

const recipeWorldAges = {
  'moon-muffin-market': '6-8',
  'puddle-planet-post-office': '6-8',
  'buttonwood-library-train': '7-9',
  'teacup-town-weather-window': '7-8',
  'button-bakery-map-mixup': '7-9',
  'spoon-ferry-lunchbox-harbor': '7-9',
  'pantry-measurement-mystery': '8-10',
  'seed-library-map-room': '8-10',
  'moss-message-observatory': '8-10',
  'compass-craft-academy': '10-11',
  'almost-invention-workshop': '10-11',
  'margin-note-market': '10-11',
  'binding-day-boardwalk': '10-11',
  'index-card-theater-club': '10-11',
  'clue-label-tower-museum': '10-11',
  'revision-river-ferry': '10-11',
}

const recipeWorldSlugs = Object.keys(recipeWorldAges)

function recipeCard(index, worldSlug, ageBand) {
  return {
    id: `kitchen-recipe-card-${String(index).padStart(2, '0')}`,
    title: `Kitchen Table Story Recipe Card ${index}`,
    worldSlug,
    ageBand,
    recipeCardSkill: 'setting recipe',
    useCase:
      'A screen-free paper recipe card that turns one table detail into make-believe story planning.',
    adultSetup:
      'Place the paper card on the table, choose one ordinary table detail, and remind writers this is story writing only.',
    kidDirection:
      'Look, point, sketch, or imagine one safe table detail, then turn it into a story ingredient.',
    recipeTitlePrompt: 'Story recipe title: ____________________',
    storyIngredientsPrompt:
      'Story ingredients: setting ____________________, helper ____________________, clue ____________________.',
    mixItUpPrompt: 'Mix-it-up story move: change one ordinary detail into ____________________.',
    servingSentencePath:
      'Serving sentence path: First ____________________, next ____________________, and finally ____________________.',
    revisionNudge: 'Revise one plain word into a clearer story word: ____________________.',
    quietOptionLine: 'Quiet option: sketch first, then write one private recipe word: ____________________.',
    takeHomeLine: 'At home, add one invented title or ending detail here: ____________________.',
  }
}

function validKitchenRecipeSource(overrides = {}) {
  return {
    batchId: '2026-06-02-batch25',
    generatedAt: '2026-06-02',
    productSlug: 'kitchen-table-story-recipe-card-deck',
    title: 'Kitchen Table Story Recipe Card Deck',
    pricePoint: '$29',
    audience:
      'Families, homeschool groups, tutors, library tables, and adult-led table writers ages 6-11.',
    sessionLength:
      '16 printable paper story recipe cards plus adult guide tools, card formats, take-home recipe slips, and optional share prompts',
    safetyNote: safety,
    artifact: {
      pdfPath:
        'product-build/kitchen-table-story-recipe-card-deck/Kitchen-Table-Story-Recipe-Card-Deck.pdf',
      zipPath:
        'product-build/kitchen-table-story-recipe-card-deck/kitchen-table-story-recipe-card-deck.zip',
      sourceHtmlPath:
        'product-build/kitchen-table-story-recipe-card-deck/source/kitchen-table-story-recipe-card-deck.html',
      manifestPath: 'product-build/kitchen-table-story-recipe-card-deck/manifest.json',
    },
    sourceFiles: [
      'content/product-artifacts/lanes/batch25-recipe-cards-a.json',
      'content/product-artifacts/lanes/batch25-recipe-cards-b.json',
      'content/product-artifacts/lanes/batch25-recipe-cards-c.json',
      'content/product-artifacts/lanes/batch25-recipe-tools.json',
    ],
    worldSlugs: recipeWorldSlugs,
    cover: {
      kicker: 'Printable kitchen table story recipe cards',
      headline: 'Kitchen Table Story Recipe Card Deck',
      subhead:
        'Sixteen paper recipe-card prompts turn table details into story ingredients for writing-only sessions.',
      included: [
        '16 printable paper story recipe cards',
        'Adult setup guide',
        'Kitchen table safety notes',
        'Story ingredient coaching moves',
        'Privacy and family handoff notes',
        'Pack reset notes',
        'Six adult-led card formats',
        'Ten take-home recipe slips',
        'Eight optional share prompts',
        'Provider-ready PDF and ZIP artifact',
      ],
    },
    adultGuide: {
      beforeSession: [
        'Print the paper story recipe cards and say they are for writing only.',
        'Set pencils and cards on the table before the session starts.',
        'Choose one ordinary table detail for the first story ingredient.',
        'Explain that the cards are only story prompts, not real table directions.',
        'Model one imaginary ingredient becoming a story clue.',
      ],
      tableSetup: [
        'Place one card, one pencil, and one blank slip at each seat.',
        'Keep extra cards in an adult folder.',
        'Use broad table words instead of private family details.',
        'Let pointing, sketching, dictating, or writing one line count as progress.',
        'Keep all materials paper-only and offline.',
      ],
      storyIngredientCoaching: [
        'Ask for one setting ingredient, one character ingredient, and one clue ingredient.',
        'Turn an ordinary table shape into a make-believe object.',
        'Turn a color into a setting mood.',
        'Turn a quiet sound into a story signal.',
        'Turn one plain sentence into a stronger serving sentence.',
      ],
      privacyAndSafetyNotes: [
        'Use invented character labels instead of real names.',
        'Keep family routines, exact places, and private details off the card.',
        'Keep the cards offline with the family adult, tutor, or table host.',
        'Follow adult and site rules first.',
        'Sharing stays optional and limited to one title, sketch, or invented line.',
      ],
      familyHandoff: [
        'Send home one finished paper card and one blank recipe slip.',
        'Mark one small next step such as add a title or finish the final line.',
        'Tell families the recipe frame is only a story metaphor.',
        'Invite praise for one clear word, sketch, or sentence.',
        'Keep all cards together for a later writing session.',
      ],
      reset: ['Collect extra cards.', 'Refresh pencils.', 'Sort slips.', 'Recycle warm-up scraps.'],
    },
    cardFormats: Array.from({ length: 6 }, (_, index) => ({
      name: `Card Format ${index + 1}`,
      bestFor: 'A calm adult-led paper writing moment with one story ingredient.',
      steps: [
        'Adult chooses one ordinary table detail and reads the paper-only reminder.',
        'Writer chooses one setting, character, object, or sequence ingredient.',
        'Adult models how the ingredient can become an invented story clue.',
        'Writer drafts one short serving sentence on the card.',
      ],
    })),
    takeHomeRecipeSlips: Array.from({ length: 10 }, (_, index) => ({
      title: `Recipe Slip ${index + 1}`,
      time: '7 minutes',
      skill: 'setting recipe',
      direction: 'Choose one table detail and turn it into a story ingredient: ____________________',
      familyLine: 'A grown-up can ask which word makes the story easier to picture: ____________________',
    })),
    optionalSharePrompts: [
      'Read one invented recipe title if you want: ____________________',
      'Show one sketched story ingredient from the card: ____________________',
      'Point to one word you revised: ____________________',
      'Name one table detail that became make-believe: ____________________',
      'Ask an adult to read your favorite card line: ____________________',
      'Share one imaginary object ingredient: ____________________',
      'Circle one detail you want to keep private: ____________________',
      'Choose one finish step for later: ____________________',
    ],
    recipeCards: recipeWorldSlugs.map((worldSlug, index) =>
      recipeCard(index + 1, worldSlug, recipeWorldAges[worldSlug]),
    ),
    ...overrides,
  }
}

const product = {
  slug: 'kitchen-table-story-recipe-card-deck',
  title: 'Kitchen Table Story Recipe Card Deck',
  pricePoint: '$29',
  status: 'checkout_pending',
  worldSlugs: recipeWorldSlugs,
}

const worldAges = new Map(
  recipeWorldSlugs.map((worldSlug) => [worldSlug, { ageBand: recipeWorldAges[worldSlug] }]),
)

const worlds = new Map(
  recipeWorldSlugs.map((worldSlug) => [
    worldSlug,
    {
      slug: worldSlug,
      title: worldSlug
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      ageBand: recipeWorldAges[worldSlug],
      premise: 'A friendly invented world for a screen-free table story recipe card.',
    },
  ]),
)

describe('Kitchen Table Story Recipe Card Deck policy', () => {
  it('accepts a valid source with sixteen printable story recipe cards', () => {
    expect(validateKitchenTableStoryRecipeCardDeckSource(validKitchenRecipeSource(), product, worldAges)).toEqual([])
  })

  it('rejects a recipe card response field without a writable blank', () => {
    const source = validKitchenRecipeSource()
    source.recipeCards[0].recipeTitlePrompt = 'My story recipe has a title.'

    expect(validateKitchenTableStoryRecipeCardDeckSource(source, product, worldAges)).toContain(
      'recipeCards[0].recipeTitlePrompt must include a writable blank.',
    )
  })

  it('rejects food-prep, tasting, allergy, cooking, scoring, upload, and public-publishing language', () => {
    const source = validKitchenRecipeSource()
    source.adultGuide.beforeSession[0] =
      'Create accounts, upload photos, publish online, collect child names, grades, scores, and exact addresses.'
    source.recipeCards[0].kidDirection =
      'Use a timer to cook, bake, taste, eat, serve food, use a stove, oven, microwave, flame, knife, scissors, allergy chart, nutrition plan, diet advice, medicine, score, prize, politics, romance, and weapons.'

    expect(validateKitchenTableStoryRecipeCardDeckSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'Kitchen Table Story Recipe Card Deck source includes account, upload, public-publishing, exact-place, contact, photo, child-profile, grade, score, roster, attendance, sign-in, or behavior-report language.',
        'Kitchen Table Story Recipe Card Deck source includes food-prep, tasting/eating, cooking/baking, heat, knife/tool, allergen, nutrition, diet, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, or unsafe physical language.',
      ]),
    )
  })

  it('keeps declared source lane files reproducible with the committed kitchen recipe source', () => {
    const root = resolve(import.meta.dirname, '..')
    const source = JSON.parse(
      readFileSync(
        resolve(root, 'content', 'product-artifacts', 'kitchen-table-story-recipe-card-deck.json'),
        'utf8',
      ),
    )

    expect(validateKitchenTableStoryRecipeCardDeckSourceFiles(source, root)).toEqual([])
  })
})

describe('Kitchen Table Story Recipe Card Deck builder', () => {
  it('loads committed kitchen recipe source, product, worlds, and local image inputs before writing artifacts', () => {
    const { source, product: committedProduct, worlds: committedWorlds, imageMap } =
      loadKitchenTableStoryRecipeCardDeckBuildInputs()

    expect(source.productSlug).toBe('kitchen-table-story-recipe-card-deck')
    expect(source.recipeCards).toHaveLength(16)
    expect(committedProduct.status).toBe('checkout_pending')
    expect(imageMap.size).toBe(source.worldSlugs.length)
    for (const slug of source.worldSlugs) {
      expect(committedWorlds.has(slug)).toBe(true)
      expect(imageMap.has(slug)).toBe(true)
    }
  })

  it('exercises the actual build entry point against a temporary artifact directory', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-kitchen-recipe-build-'))
    const buildDir = join(tempDir, 'kitchen-table-story-recipe-card-deck')
    try {
      const { manifest } = await buildKitchenTableStoryRecipeCardDeck({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })

      expect(manifest.productSlug).toBe('kitchen-table-story-recipe-card-deck')
      expect(manifest.sourcePageCount).toBe(16)
      expect(manifest.files.assets.length).toBe(16)
      expect(existsSync(join(buildDir, 'source', 'kitchen-table-story-recipe-card-deck.html'))).toBe(true)
      expect(existsSync(join(buildDir, 'README.txt'))).toBe(true)
      expect(existsSync(join(buildDir, 'manifest.json'))).toBe(true)
      expect(readFileSync(join(buildDir, 'kitchen-table-story-recipe-card-deck.zip')).subarray(0, 2).toString('ascii')).toBe('PK')
      expect(readFileSync(join(buildDir, 'source', 'kitchen-table-story-recipe-card-deck.html'), 'utf8').match(/class="[^"]*recipe-card-page/g)).toHaveLength(16)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 15000)

  it('renders printable kitchen recipe card HTML with adult guide, local images, and no checkout copy', () => {
    const html = renderKitchenTableStoryRecipeCardDeckHtml(
      validKitchenRecipeSource(),
      worlds,
      new Map(recipeWorldSlugs.map((worldSlug) => [worldSlug, `assets/${worldSlug}.jpg`])),
    )

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('@page')
    expect(html).toContain('Kitchen Table Story Recipe Card Deck')
    expect(html).toContain('Story ingredient coaching')
    expect(html).toContain('Privacy and safety notes')
    expect(html).toContain('Story recipe title')
    expect(html.match(/class="[^"]*recipe-card-page/g)).toHaveLength(16)
    expect(html).toContain('assets/pantry-measurement-mystery.jpg')
    expect(html).not.toMatch(/checkout|payment link|buy now|stripe|gumroad|\baccount\b|login|upload|public publishing|GPS|coordinates|\baddress\b|phone|email|photo|camera|medical|legal|therapy|grief|\bgrade\b|\bscore\b|contest|prize|\btimer\b|politics|religion|romance|weapon|violence|\bcook(ing)?\b|\bbak(e|ing)\b|\btast(e|ing)\b|\beat(ing)?\b|food prep|stove|oven|microwave|flame|knife|scissors|allergy|allergen|nutrition|diet|recipe instructions/i)
  })

  it('builds a reusable product artifact manifest for the kitchen recipe card deck', () => {
    const manifest = buildProductArtifactManifest(validKitchenRecipeSource(), {
      pdf: {
        path: 'product-build/kitchen-table-story-recipe-card-deck/Kitchen-Table-Story-Recipe-Card-Deck.pdf',
        size: 123,
        sha256: 'pdf',
      },
      zip: {
        path: 'product-build/kitchen-table-story-recipe-card-deck/kitchen-table-story-recipe-card-deck.zip',
        size: 234,
        sha256: 'zip',
      },
      sourceHtml: {
        path: 'product-build/kitchen-table-story-recipe-card-deck/source/kitchen-table-story-recipe-card-deck.html',
        size: 345,
        sha256: 'html',
      },
      assets: [],
    })

    expect(manifest.productSlug).toBe('kitchen-table-story-recipe-card-deck')
    expect(manifest.sourcePageCount).toBe(16)
    expect(manifest.files.pdf.sha256).toBe('pdf')
  })

  it('keeps every built kitchen recipe artifact page within one sheet after images load', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'plot-sprout-kitchen-recipe-layout-'))
    const buildDir = join(tempDir, 'kitchen-table-story-recipe-card-deck')
    const browser = await chromium.launch({ headless: true })
    try {
      await buildKitchenTableStoryRecipeCardDeck({
        buildDir,
        recordRoot: tempDir,
        writePdf: async ({ pdfPath }) => {
          writeFileSync(pdfPath, fakePdf(21))
        },
      })
      const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
      await page.goto(pathToFileURL(join(buildDir, 'source', 'kitchen-table-story-recipe-card-deck.html')).href, {
        waitUntil: 'load',
      })
      await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0))
      const overflowingPages = await page.$$eval('.pack-page', (pages) =>
        pages
          .map((element, index) => ({
            index,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            heading: element.querySelector('h1, h2')?.textContent ?? '',
          }))
          .filter((entry) => entry.scrollHeight > entry.clientHeight + 1),
      )

      expect(overflowingPages).toEqual([])
    } finally {
      await browser.close()
      rmSync(tempDir, { recursive: true, force: true })
    }
  }, 20000)
})
