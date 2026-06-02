import { describe, expect, it } from 'vitest'

import {
  buildImagePrompt,
  buildQuestPack,
  getQuestBySlug,
  productLinks,
  questWorlds,
} from './storyData'

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
    ])
    expect(productLinks.map((product) => product.pricePoint)).toEqual(['$9', '$29', '$79', '$19', '$17', '$11', '$23', '$39', '$49', '$59'])
    for (const product of productLinks) {
      expect(product.note).toMatch(/No checkout/i)
    }
  })
})
