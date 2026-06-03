import { describe, expect, it } from 'vitest'

import {
  validateExpandingFileStorySceneChainCardPackSource,
  validateExpandingFileStorySceneChainCardPackSourceFiles,
} from './product-artifact-policy.mjs'
import {
  buildExpandingFileStorySceneChainCardPack,
  renderExpandingFileStorySceneChainCardPackHtml,
} from './expanding-file-story-scene-chain-card-pack-builder.mjs'

const batch55WorldSlugs = [
  'button-bakery-map-mixup',
  'sticker-station-mail-cart',
  'pocket-park-notice-board',
  'rain-boot-route-rangers',
  'paperclip-plaza-parcel-day',
  'solar-oven-picnic-station',
  'moss-message-observatory',
  'pantry-measurement-mystery',
  'seed-library-map-room',
  'pond-bridge-blueprint-club',
  'revision-river-ferry',
  'binding-day-boardwalk',
  'margin-note-market',
  'almost-invention-workshop',
  'appendix-archive-lab',
  'compass-craft-academy',
]

describe('Expanding File Story Scene Chain Card Pack policy', () => {
  it('defines the Batch55 validator and builder contract', () => {
    expect(validateExpandingFileStorySceneChainCardPackSource).toBeTypeOf('function')
    expect(validateExpandingFileStorySceneChainCardPackSourceFiles).toBeTypeOf('function')
    expect(renderExpandingFileStorySceneChainCardPackHtml).toBeTypeOf('function')
    expect(buildExpandingFileStorySceneChainCardPack).toBeTypeOf('function')
  })

  it('uses the exact Batch55 world order', () => {
    expect(batch55WorldSlugs).toEqual([
      'button-bakery-map-mixup',
      'sticker-station-mail-cart',
      'pocket-park-notice-board',
      'rain-boot-route-rangers',
      'paperclip-plaza-parcel-day',
      'solar-oven-picnic-station',
      'moss-message-observatory',
      'pantry-measurement-mystery',
      'seed-library-map-room',
      'pond-bridge-blueprint-club',
      'revision-river-ferry',
      'binding-day-boardwalk',
      'margin-note-market',
      'almost-invention-workshop',
      'appendix-archive-lab',
      'compass-craft-academy',
    ])
  })
})
