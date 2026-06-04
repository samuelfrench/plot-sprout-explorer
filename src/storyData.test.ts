/// <reference types="node" />

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  buildImagePrompt,
  buildQuestPack,
  getQuestBySlug,
  productLinks,
  questWorlds,
} from './storyData'

const archiveDrawerWorldSlugs = [
  'teacup-town-weather-window',
  'mitten-market-lost-ticket',
  'button-bakery-map-mixup',
  'paperclip-plaza-parcel-day',
  'sticker-station-mail-cart',
  'greenhouse-gear-garden',
  'moss-message-observatory',
  'rain-gauge-railway',
  'seed-library-map-room',
  'solar-oven-picnic-station',
  'tidepool-timekeepers-lab',
  'almost-invention-workshop',
  'appendix-archive-lab',
  'clue-label-tower-museum',
  'compost-clock-workshop',
  'index-card-theater-club',
]

const cardCatalogWorldSlugs = [
  'puddle-planet-post-office',
  'buttonwood-library-train',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'acorn-avenue-errand-office',
  'pocket-park-notice-board',
  'penny-path-compass-shop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'revision-river-ferry',
  'chapter-gate-greenhouse',
  'margin-note-market',
  'blue-pencil-observatory',
  'binding-day-boardwalk',
  'sticker-station-mail-cart',
  'paperclip-plaza-parcel-day',
]

const libraryPocketWorldSlugs = [
  'moon-muffin-market',
  'pencil-dragon-academy',
  'teacup-town-weather-window',
  'mitten-market-lost-ticket',
  'rain-boot-route-rangers',
  'greenhouse-gear-garden',
  'moss-message-observatory',
  'rain-gauge-railway',
  'compost-clock-workshop',
  'seed-library-map-room',
  'solar-oven-picnic-station',
  'tidepool-timekeepers-lab',
  'almost-invention-workshop',
  'appendix-archive-lab',
  'clue-label-tower-museum',
  'index-card-theater-club',
]

const shelfMarkerWorldSlugs = [
  'compass-craft-academy',
  'tiny-lantern-reef',
  'acorn-avenue-errand-office',
  'compost-clock-workshop',
  'pantry-measurement-mystery',
  'button-bakery-map-mixup',
  'revision-river-ferry',
  'sticker-station-mail-cart',
  'moon-muffin-market',
  'index-card-theater-club',
  'puddle-planet-post-office',
  'binding-day-boardwalk',
  'seed-library-map-room',
  'moss-message-observatory',
  'cloudberry-clocktower',
  'spoon-ferry-lunchbox-harbor',
]

const bookendEvidenceWorldSlugs = [
  'moon-muffin-market',
  'puddle-planet-post-office',
  'teacup-town-weather-window',
  'button-bakery-map-mixup',
  'penny-path-compass-shop',
  'pocket-park-notice-board',
  'greenhouse-gear-garden',
  'orchard-pulley-post',
  'rain-gauge-railway',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'clue-label-tower-museum',
  'compass-craft-academy',
  'margin-note-market',
  'pencil-dragon-academy',
]

function readJson(relativePath: string): unknown {
  return JSON.parse(readFileSync(resolve(process.cwd(), relativePath), 'utf8'))
}

describe('storyData', () => {
  it('keeps every starter world family-friendly and monetizable', () => {
    expect(questWorlds.length).toBeGreaterThanOrEqual(6)

    for (const world of questWorlds) {
      expect(world.safety).toContain('No scary harm')
      expect(world.productAngle).toMatch(/printable|subscription|classroom/i)
      expect(world.ageBand).toMatch(/\d/)
      expect(world.prompts.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('builds a quest pack with a usable writing loop', () => {
    const pack = buildQuestPack('moon-muffin-market', 1)

    expect(pack.world.slug).toBe('moon-muffin-market')
    expect(pack.steps).toHaveLength(4)
    expect(pack.steps[0].label).toBe('Pick a hero')
    expect(pack.steps[3].label).toBe('Finish with a choice')
    expect(pack.printableTitle).toContain('Moon Muffin Market')
  })

  it('creates local GPU image prompts with no text or unsafe content', () => {
    const world = getQuestBySlug('puddle-planet-post-office')
    const prompt = buildImagePrompt(world)

    expect(prompt).toContain('family-friendly')
    expect(prompt).toContain('No text')
    expect(prompt).toContain('no logos')
    expect(prompt).toContain('storybook illustration')
  })

  it('exposes checkout-pending product links for all paid printable bundles', () => {
    expect(productLinks.map((product) => product.slug)).toEqual([
      'rainy-day-story-quest-pack',
      'homeschool-season-story-bundle',
      'classroom-story-license-pack',
      'birthday-party-story-quest-kit',
      'road-trip-story-quest-pack',
      'waiting-room-story-quest-pack',
      'library-story-club-kit',
      'substitute-teacher-story-station-pack',
      'tutoring-center-story-sprint-pack',
      'summer-camp-story-circle-kit',
      'after-school-story-club-starter-kit',
      'museum-day-story-notebook-kit',
      'family-game-night-story-card-deck',
      'grandparent-story-visit-kit',
      'thank-you-note-story-postcard-pack',
      'nature-walk-story-field-notes-kit',
      'backyard-story-seed-packet-kit',
      'kitchen-table-story-recipe-card-deck',
      'bookshop-story-bookmark-pack',
      'writing-desk-story-prompt-strip-pack',
      'window-seat-story-scene-card-pack',
      'quiet-corner-story-map-card-pack',
      'porch-light-story-signal-card-pack',
      'pencil-case-story-switch-card-pack',
      'notebook-margin-story-revision-card-pack',
      'desk-drawer-story-sequence-card-pack',
      'reading-nook-story-cause-effect-card-pack',
      'blanket-fort-story-dialogue-card-pack',
      'kitchen-window-story-pov-card-pack',
      'coat-pocket-story-character-card-pack',
      'paper-tray-story-setting-card-pack',
      'backpack-story-ending-card-pack',
      'pencil-cup-story-opening-card-pack',
      'desk-lamp-story-problem-card-pack',
      'paper-clip-story-solution-card-pack',
      'binder-clip-story-transition-card-pack',
      'folder-tab-story-detail-card-pack',
      'index-card-story-show-not-tell-card-pack',
      'sticky-note-story-tone-card-pack',
      'washi-tape-story-word-choice-card-pack',
      'paper-sleeve-story-sentence-variety-card-pack',
      'clipboard-story-paragraph-focus-card-pack',
      'lined-paper-story-paragraph-revision-card-pack',
      'composition-notebook-story-draft-checklist-card-pack',
      'spiral-notebook-story-final-copy-card-pack',
      'tabbed-folder-story-series-card-pack',
      'accordion-folder-story-arc-card-pack',
      'expanding-file-story-scene-chain-card-pack',
      'manila-folder-story-clue-trail-card-pack',
      'pocket-folder-story-goal-path-card-pack',
      'hanging-file-story-decision-point-card-pack',
      'file-box-story-turning-point-card-pack',
      'archive-drawer-story-resolution-card-pack',
      'card-catalog-story-retell-card-pack',
      'library-pocket-story-summary-card-pack',
      'shelf-marker-story-theme-card-pack',
      'bookend-story-evidence-card-pack',
    ])
    expect(productLinks.map((product) => product.pricePoint)).toEqual([
      '$9',
      '$29',
      '$79',
      '$19',
      '$17',
      '$11',
      '$23',
      '$39',
      '$49',
      '$59',
      '$69',
      '$37',
      '$27',
      '$31',
      '$21',
      '$33',
      '$35',
      '$29',
      '$25',
      '$27',
      '$29',
      '$31',
      '$33',
      '$35',
      '$37',
      '$39',
      '$41',
      '$43',
      '$45',
      '$47',
      '$49',
      '$51',
      '$53',
      '$55',
      '$57',
      '$59',
      '$61',
      '$63',
      '$65',
      '$67',
      '$69',
      '$71',
      '$73',
      '$75',
      '$77',
      '$79',
      '$81',
      '$83',
      '$85',
      '$87',
      '$89',
      '$91',
      '$93',
      '$95',
      '$97',
      '$99',
      '$101',
    ])
    for (const product of productLinks) {
      expect(product.note).toMatch(/No checkout/i)
    }
  })

  it('keeps the Batch60 archive drawer source artifact aligned with the lane files', () => {
    const source = readJson('content/product-artifacts/archive-drawer-story-resolution-card-pack.json') as Record<
      string,
      unknown
    >
    const laneA = readJson('content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-a.json') as unknown[]
    const laneB = readJson('content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-b.json') as unknown[]
    const laneC = readJson('content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-c.json') as unknown[]
    const tools = readJson('content/product-artifacts/lanes/batch60-archive-drawer-resolution-tools.json') as Record<
      string,
      unknown
    >

    expect(Object.keys(source)).toEqual([
      'batchId',
      'generatedAt',
      'productSlug',
      'title',
      'pricePoint',
      'audience',
      'sessionLength',
      'safetyNote',
      'artifact',
      'sourceFiles',
      'worldSlugs',
      'cover',
      'adultGuide',
      'resolutionRoutines',
      'takeHomeResolutionSlips',
      'optionalAdultPrompts',
      'cards',
    ])
    expect(source.sourceFiles).toEqual([
      'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-a.json',
      'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-b.json',
      'content/product-artifacts/lanes/batch60-archive-drawer-resolution-cards-c.json',
      'content/product-artifacts/lanes/batch60-archive-drawer-resolution-tools.json',
    ])
    expect(source.worldSlugs).toEqual(archiveDrawerWorldSlugs)
    expect(source.cards).toEqual([...laneA, ...laneB, ...laneC])
    expect(source.adultGuide).toEqual(tools.adultGuide)
    expect(source.resolutionRoutines).toEqual(tools.resolutionRoutines)
    expect(source.takeHomeResolutionSlips).toEqual(tools.takeHomeResolutionSlips)
    expect(source.optionalAdultPrompts).toEqual(tools.optionalAdultPrompts)
  })

  it('keeps the Batch60 archive drawer product checkout-pending and mailto-only', () => {
    const products = readJson('content/products/batch5-products.json') as {
      products: Array<Record<string, unknown>>
    }
    const product = products.products.find(
      (candidate) => candidate.slug === 'archive-drawer-story-resolution-card-pack',
    )

    expect(product).toMatchObject({
      slug: 'archive-drawer-story-resolution-card-pack',
      title: 'Archive Drawer Story Resolution Card Pack',
      pricePoint: '$93',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch60/archive-drawer-story-resolution-card-pack.jpg',
      ctaHref:
        'mailto:samfrench@gmail.com?subject=Archive%20Drawer%20Story%20Resolution%20Card%20Pack',
    })
    expect(product?.worldSlugs).toEqual(archiveDrawerWorldSlugs)
    expect(String(product?.ctaHref)).toMatch(/^mailto:/)
    expect(String(product?.ctaHref)).not.toMatch(/^https?:/)
  })

  it('keeps the Batch61 card catalog source artifact aligned with the lane files', () => {
    const source = readJson('content/product-artifacts/card-catalog-story-retell-card-pack.json') as Record<
      string,
      unknown
    >
    const laneA = readJson('content/product-artifacts/lanes/batch61-card-catalog-retell-cards-a.json') as unknown[]
    const laneB = readJson('content/product-artifacts/lanes/batch61-card-catalog-retell-cards-b.json') as unknown[]
    const laneC = readJson('content/product-artifacts/lanes/batch61-card-catalog-retell-cards-c.json') as unknown[]
    const tools = readJson('content/product-artifacts/lanes/batch61-card-catalog-retell-tools.json') as Record<
      string,
      unknown
    >

    expect(Object.keys(source)).toEqual([
      'batchId',
      'generatedAt',
      'productSlug',
      'title',
      'pricePoint',
      'audience',
      'sessionLength',
      'safetyNote',
      'artifact',
      'sourceFiles',
      'worldSlugs',
      'cover',
      'adultGuide',
      'retellRoutines',
      'takeHomeRetellSlips',
      'optionalAdultPrompts',
      'cards',
    ])
    expect(source.sourceFiles).toEqual([
      'content/product-artifacts/lanes/batch61-card-catalog-retell-cards-a.json',
      'content/product-artifacts/lanes/batch61-card-catalog-retell-cards-b.json',
      'content/product-artifacts/lanes/batch61-card-catalog-retell-cards-c.json',
      'content/product-artifacts/lanes/batch61-card-catalog-retell-tools.json',
    ])
    expect(source.worldSlugs).toEqual(cardCatalogWorldSlugs)
    expect(source.cards).toEqual([...laneA, ...laneB, ...laneC])
    expect(source.adultGuide).toEqual(tools.adultGuide)
    expect(source.retellRoutines).toEqual(tools.retellRoutines)
    expect(source.takeHomeRetellSlips).toEqual(tools.takeHomeRetellSlips)
    expect(source.optionalAdultPrompts).toEqual(tools.optionalAdultPrompts)
  })

  it('keeps the Batch61 card catalog product checkout-pending and mailto-only', () => {
    const products = readJson('content/products/batch5-products.json') as {
      products: Array<Record<string, unknown>>
    }
    const product = products.products.find(
      (candidate) => candidate.slug === 'card-catalog-story-retell-card-pack',
    )

    expect(product).toMatchObject({
      slug: 'card-catalog-story-retell-card-pack',
      title: 'Card Catalog Story Retell Card Pack',
      pricePoint: '$95',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch61/card-catalog-story-retell-card-pack.jpg',
      ctaHref:
        'mailto:samfrench@gmail.com?subject=Card%20Catalog%20Story%20Retell%20Card%20Pack',
    })
    expect(product?.worldSlugs).toEqual(cardCatalogWorldSlugs)
    expect(String(product?.ctaHref)).toMatch(/^mailto:/)
    expect(String(product?.ctaHref)).not.toMatch(/^https?:/)
  })

  it('keeps the Batch62 library pocket source artifact aligned with the lane files', () => {
    const source = readJson('content/product-artifacts/library-pocket-story-summary-card-pack.json') as Record<
      string,
      unknown
    >
    const laneA = readJson(
      'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-a.json',
    ) as unknown[]
    const laneB = readJson(
      'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-b.json',
    ) as unknown[]
    const laneC = readJson(
      'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-c.json',
    ) as unknown[]
    const tools = readJson('content/product-artifacts/lanes/batch62-library-pocket-summary-tools.json') as Record<
      string,
      unknown
    >
    const cover = source.cover as { included?: string[] }

    expect(Object.keys(source)).toEqual([
      'batchId',
      'generatedAt',
      'productSlug',
      'title',
      'pricePoint',
      'audience',
      'sessionLength',
      'safetyNote',
      'artifact',
      'sourceFiles',
      'worldSlugs',
      'cover',
      'adultGuide',
      'summaryRoutines',
      'takeHomeSummarySlips',
      'optionalAdultPrompts',
      'cards',
    ])
    expect(source.sourceFiles).toEqual([
      'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-a.json',
      'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-b.json',
      'content/product-artifacts/lanes/batch62-library-pocket-summary-cards-c.json',
      'content/product-artifacts/lanes/batch62-library-pocket-summary-tools.json',
    ])
    expect(source.worldSlugs).toEqual(libraryPocketWorldSlugs)
    expect(cover.included).toHaveLength(11)
    expect(cover.included?.join(' ')).toMatch(/summary/i)
    expect(cover.included?.join(' ')).not.toMatch(/retell|card catalog/i)
    expect(source.cards).toEqual([...laneA, ...laneB, ...laneC])
    expect(source.adultGuide).toEqual(tools.adultGuide)
    expect(source.summaryRoutines).toEqual(tools.summaryRoutines)
    expect(source.takeHomeSummarySlips).toEqual(tools.takeHomeSummarySlips)
    expect(source.optionalAdultPrompts).toEqual(tools.optionalAdultPrompts)
  })

  it('keeps the Batch62 library pocket product checkout-pending and mailto-only', () => {
    const products = readJson('content/products/batch5-products.json') as {
      products: Array<Record<string, unknown>>
    }
    const product = products.products.find(
      (candidate) => candidate.slug === 'library-pocket-story-summary-card-pack',
    )

    expect(product).toMatchObject({
      slug: 'library-pocket-story-summary-card-pack',
      title: 'Library Pocket Story Summary Card Pack',
      pricePoint: '$97',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch62/library-pocket-story-summary-card-pack.jpg',
      ctaHref:
        'mailto:samfrench@gmail.com?subject=Library%20Pocket%20Story%20Summary%20Card%20Pack',
    })
    expect(product?.worldSlugs).toEqual(libraryPocketWorldSlugs)
    expect(String(product?.ctaHref)).toMatch(/^mailto:/)
    expect(String(product?.ctaHref)).not.toMatch(/^https?:/)
  })

  it('keeps the Batch63 shelf marker theme source artifact aligned with the lane files', () => {
    const source = readJson('content/product-artifacts/shelf-marker-story-theme-card-pack.json') as Record<
      string,
      unknown
    >
    const laneA = readJson(
      'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-a.json',
    ) as unknown[]
    const laneB = readJson(
      'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-b.json',
    ) as unknown[]
    const laneC = readJson(
      'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-c.json',
    ) as unknown[]
    const tools = readJson('content/product-artifacts/lanes/batch63-shelf-marker-theme-tools.json') as Record<
      string,
      unknown
    >
    const cover = source.cover as { included?: string[] }

    expect(Object.keys(source)).toEqual([
      'batchId',
      'generatedAt',
      'productSlug',
      'title',
      'pricePoint',
      'audience',
      'sessionLength',
      'safetyNote',
      'artifact',
      'sourceFiles',
      'worldSlugs',
      'cover',
      'adultGuide',
      'themeRoutines',
      'takeHomeThemeSlips',
      'optionalAdultPrompts',
      'cards',
    ])
    expect(source.sourceFiles).toEqual([
      'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-a.json',
      'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-b.json',
      'content/product-artifacts/lanes/batch63-shelf-marker-theme-cards-c.json',
      'content/product-artifacts/lanes/batch63-shelf-marker-theme-tools.json',
    ])
    expect(source.worldSlugs).toEqual(shelfMarkerWorldSlugs)
    expect(cover.included).toHaveLength(11)
    expect(cover.included?.join(' ')).toMatch(/theme/i)
    expect(cover.included?.join(' ')).not.toMatch(/summary|library pocket/i)
    expect(source.cards).toEqual([...laneA, ...laneB, ...laneC])
    expect(source.adultGuide).toEqual(tools.adultGuide)
    expect(source.themeRoutines).toEqual(tools.themeRoutines)
    expect(source.takeHomeThemeSlips).toEqual(tools.takeHomeThemeSlips)
    expect(source.optionalAdultPrompts).toEqual(tools.optionalAdultPrompts)
  })

  it('keeps the Batch63 shelf marker product checkout-pending and mailto-only', () => {
    const products = readJson('content/products/batch5-products.json') as {
      products: Array<Record<string, unknown>>
    }
    const product = products.products.find(
      (candidate) => candidate.slug === 'shelf-marker-story-theme-card-pack',
    )

    expect(product).toMatchObject({
      slug: 'shelf-marker-story-theme-card-pack',
      title: 'Shelf Marker Story Theme Card Pack',
      pricePoint: '$99',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch63/shelf-marker-story-theme-card-pack.jpg',
      ctaHref:
        'mailto:samfrench@gmail.com?subject=Shelf%20Marker%20Story%20Theme%20Card%20Pack',
    })
    expect(product?.worldSlugs).toEqual(shelfMarkerWorldSlugs)
    expect(String(product?.ctaHref)).toMatch(/^mailto:/)
    expect(String(product?.ctaHref)).not.toMatch(/^https?:/)
  })

  it('keeps the Batch64 bookend evidence source artifact aligned with the lane files', () => {
    const source = readJson('content/product-artifacts/bookend-story-evidence-card-pack.json') as Record<
      string,
      unknown
    >
    const laneA = readJson(
      'content/product-artifacts/lanes/batch64-bookend-evidence-cards-a.json',
    ) as unknown[]
    const laneB = readJson(
      'content/product-artifacts/lanes/batch64-bookend-evidence-cards-b.json',
    ) as unknown[]
    const laneC = readJson(
      'content/product-artifacts/lanes/batch64-bookend-evidence-cards-c.json',
    ) as unknown[]
    const tools = readJson('content/product-artifacts/lanes/batch64-bookend-evidence-tools.json') as Record<
      string,
      unknown
    >
    const cover = source.cover as { included?: string[] }

    expect(Object.keys(source)).toEqual([
      'batchId',
      'generatedAt',
      'productSlug',
      'title',
      'pricePoint',
      'audience',
      'sessionLength',
      'safetyNote',
      'artifact',
      'sourceFiles',
      'worldSlugs',
      'cover',
      'adultGuide',
      'evidenceRoutines',
      'takeHomeEvidenceSlips',
      'optionalAdultPrompts',
      'cards',
    ])
    expect(source.sourceFiles).toEqual([
      'content/product-artifacts/lanes/batch64-bookend-evidence-cards-a.json',
      'content/product-artifacts/lanes/batch64-bookend-evidence-cards-b.json',
      'content/product-artifacts/lanes/batch64-bookend-evidence-cards-c.json',
      'content/product-artifacts/lanes/batch64-bookend-evidence-tools.json',
    ])
    expect(source.worldSlugs).toEqual(bookendEvidenceWorldSlugs)
    expect(cover.included).toHaveLength(11)
    expect(cover.included?.join(' ')).toMatch(/evidence/i)
    expect(cover.included?.join(' ')).not.toMatch(/theme|summary|library pocket/i)
    expect(source.cards).toEqual([...laneA, ...laneB, ...laneC])
    expect(source.adultGuide).toEqual(tools.adultGuide)
    expect(source.evidenceRoutines).toEqual(tools.evidenceRoutines)
    expect(source.takeHomeEvidenceSlips).toEqual(tools.takeHomeEvidenceSlips)
    expect(source.optionalAdultPrompts).toEqual(tools.optionalAdultPrompts)
  })

  it('keeps the Batch64 bookend evidence product checkout-pending and mailto-only', () => {
    const products = readJson('content/products/batch5-products.json') as {
      products: Array<Record<string, unknown>>
    }
    const product = products.products.find(
      (candidate) => candidate.slug === 'bookend-story-evidence-card-pack',
    )

    expect(product).toMatchObject({
      slug: 'bookend-story-evidence-card-pack',
      title: 'Bookend Story Evidence Card Pack',
      pricePoint: '$101',
      status: 'checkout_pending',
      heroImage: 'images/plotsprout/batch64/bookend-story-evidence-card-pack.jpg',
      ctaHref:
        'mailto:samfrench@gmail.com?subject=Bookend%20Story%20Evidence%20Card%20Pack',
    })
    expect(product?.worldSlugs).toEqual(bookendEvidenceWorldSlugs)
    expect(String(product?.ctaHref)).toMatch(/^mailto:/)
    expect(String(product?.ctaHref)).not.toMatch(/^https?:/)
  })
})
