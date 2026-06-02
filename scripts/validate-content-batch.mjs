import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { containsActiveCheckoutLanguage } from './content-policy.mjs'
import {
  validateAfterSchoolStoryClubKitSource,
  inspectArtifactFiles,
  validateBirthdayPartyKitSource,
  validateClassroomLicenseSource,
  validateCheckoutReadiness,
  validateFamilyGameNightStoryCardDeckSource,
  validateManifestWorldAssets,
  validateMuseumDayStoryNotebookKitSource,
  validatePackSource,
  validateLibraryStoryClubKitSource,
  validateRoadTripPackSource,
  validateSeasonBundleSource,
  validateSubstituteTeacherStationPackSource,
  validateSummerCampStoryCircleKitSource,
  validateTutoringCenterSprintPackSource,
  validateWaitingRoomPackSource,
} from './product-artifact-policy.mjs'
import { starterWorlds } from './starter-worlds.mjs'

const root = resolve(import.meta.dirname, '..')
const worldsDir = resolve(root, 'content', 'worlds')
const kitsDir = resolve(root, 'content', 'printable-kits')
const seoCollectionsDir = resolve(root, 'content', 'seo-collections')
const seoCollectionsFile = resolve(seoCollectionsDir, 'batch2-collections.json')
const miniUnitsFile = resolve(root, 'content', 'mini-units', 'batch3-mini-units.json')
const batch4ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch4-world-images.json')
const batch7ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch7-product-images.json')
const batch10ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch10-product-images.json')
const batch11ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch11-product-images.json')
const batch13ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch13-product-images.json')
const batch14ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch14-product-images.json')
const batch15ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch15-product-images.json')
const batch16ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch16-product-images.json')
const batch17ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch17-product-images.json')
const batch18ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch18-product-images.json')
const batch19ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch19-product-images.json')
const batch20ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch20-product-images.json')
const productsFile = resolve(root, 'content', 'products', 'batch5-products.json')
const rainyDayPackSourceFile = resolve(root, 'content', 'product-artifacts', 'rainy-day-story-quest-pack.json')
const seasonBundleSourceFile = resolve(root, 'content', 'product-artifacts', 'homeschool-season-story-bundle.json')
const classroomLicenseSourceFile = resolve(root, 'content', 'product-artifacts', 'classroom-story-license-pack.json')
const birthdayPartySourceFile = resolve(root, 'content', 'product-artifacts', 'birthday-party-story-quest-kit.json')
const roadTripSourceFile = resolve(root, 'content', 'product-artifacts', 'road-trip-story-quest-pack.json')
const waitingRoomSourceFile = resolve(root, 'content', 'product-artifacts', 'waiting-room-story-quest-pack.json')
const libraryStoryClubSourceFile = resolve(root, 'content', 'product-artifacts', 'library-story-club-kit.json')
const substituteTeacherSourceFile = resolve(root, 'content', 'product-artifacts', 'substitute-teacher-story-station-pack.json')
const tutoringCenterSourceFile = resolve(root, 'content', 'product-artifacts', 'tutoring-center-story-sprint-pack.json')
const summerCampSourceFile = resolve(root, 'content', 'product-artifacts', 'summer-camp-story-circle-kit.json')
const afterSchoolSourceFile = resolve(root, 'content', 'product-artifacts', 'after-school-story-club-starter-kit.json')
const museumDaySourceFile = resolve(root, 'content', 'product-artifacts', 'museum-day-story-notebook-kit.json')
const familyGameNightSourceFile = resolve(root, 'content', 'product-artifacts', 'family-game-night-story-card-deck.json')
const batchId = '2026-06-02-batch1'
const seoBatchId = '2026-06-02-batch2'
const miniUnitsBatchId = '2026-06-02-batch3'
const batch4ImagesBatchId = '2026-06-02-batch4'
const batch7ProductImagesBatchId = '2026-06-02-batch7-product-images'
const batch10ProductImagesBatchId = '2026-06-02-batch10-product-images'
const batch11ProductImagesBatchId = '2026-06-02-batch11-product-images'
const batch13ProductImagesBatchId = '2026-06-02-batch13-product-images'
const batch14ProductImagesBatchId = '2026-06-02-batch14-product-images'
const batch15ProductImagesBatchId = '2026-06-02-batch15-product-images'
const batch16ProductImagesBatchId = '2026-06-02-batch16-product-images'
const batch17ProductImagesBatchId = '2026-06-02-batch17-product-images'
const batch18ProductImagesBatchId = '2026-06-02-batch18-product-images'
const batch19ProductImagesBatchId = '2026-06-02-batch19-product-images'
const batch20ProductImagesBatchId = '2026-06-02-batch20-product-images'
const productsBatchId = '2026-06-02-batch5'
const rainyDayPackBatchId = '2026-06-02-batch7'
const seasonBundleBatchId = '2026-06-02-batch8'
const classroomLicenseBatchId = '2026-06-02-batch9'
const birthdayPartyBatchId = '2026-06-02-batch10'
const roadTripBatchId = '2026-06-02-batch11'
const waitingRoomBatchId = '2026-06-02-batch13'
const libraryStoryClubBatchId = '2026-06-02-batch14'
const substituteTeacherBatchId = '2026-06-02-batch15'
const tutoringCenterBatchId = '2026-06-02-batch16'
const summerCampBatchId = '2026-06-02-batch17'
const afterSchoolBatchId = '2026-06-02-batch18'
const museumDayBatchId = '2026-06-02-batch19'
const familyGameNightBatchId = '2026-06-02-batch20'
const allowedStarterAgeBands = new Set(['6-8', '7-9', '8-10', '10-11'])
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'
const seoLanes = new Set([
  'creative writing prompts for kids',
  'story writing worksheets',
  'reluctant writer activities',
  'homeschool writing prompts',
])
const targetCollections = new Map([
  ['creative-writing-prompts-for-kids', 'creative writing prompts for kids'],
  ['story-writing-worksheets', 'story writing worksheets'],
  ['reluctant-writer-activities', 'reluctant writer activities'],
  ['homeschool-writing-prompts', 'homeschool writing prompts'],
])
const pricePoints = new Set(['$9', '$29', '$79'])
const bannedTerms = [
  /\bweapon(s)?\b/i,
  /\bgun(s)?\b/i,
  /\bsword(s)?\b/i,
  /\bfight(ing)?\b/i,
  /\bkill(s|ed|ing)?\b/i,
  /\bblood\b/i,
  /\bhorror\b/i,
  /\bromance\b/i,
  /\bkiss(ing)?\b/i,
  /\bdating\b/i,
  /\bpolitic(s|al)?\b/i,
  /\belection(s)?\b/i,
  /\bvote(s|d|r|rs|ing)?\b/i,
  /\bcampaign(s|ing)?\b/i,
  /\breligion\b/i,
  /\breligious\b/i,
  /\bchurch(es)?\b/i,
  /\btemple(s)?\b/i,
  /\bmosque(s)?\b/i,
  /\bsynagogue(s)?\b/i,
  /\bprayer(s)?\b/i,
  /\bjesus\b/i,
  /\bgod\b/i,
  /\bpresident(s)?\b/i,
  /\bcelebrity\b/i,
  /\binfluencer(s)?\b/i,
  /\bfamous\b/i,
  /\breal child\b/i,
  /\bgambling\b/i,
  /\bcasino\b/i,
  /\bmust buy\b/i,
  /\bmake your child\b/i,
  /\bguaranteed\b/i,
  /\bsecret trick\b/i,
  /\bmiss out\b/i,
  /\bai bedtime\b/i,
  /\bbedtime story\b/i,
  /\bstory generator\b/i,
  /\bgenerate stories\b/i,
  /\bdisney\b/i,
  /\bpokemon\b/i,
  /\bminecraft\b/i,
  /\bmarvel\b/i,
  /\bstar wars\b/i,
  /\bharry potter\b/i,
]

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function fail(message) {
  throw new Error(message)
}

function expect(condition, message) {
  if (!condition) fail(message)
}

function validateString(value, label) {
  expect(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string.`)
}

function validateList(value, length, label) {
  expect(Array.isArray(value), `${label} must be an array.`)
  expect(value.length === length, `${label} must have exactly ${length} entries.`)
  value.forEach((item, index) => validateString(item, `${label}[${index}]`))
}

function validateMinList(value, minimumLength, label) {
  expect(Array.isArray(value), `${label} must be an array.`)
  expect(value.length >= minimumLength, `${label} must have at least ${minimumLength} entries.`)
  value.forEach((item, index) => validateString(item, `${label}[${index}]`))
}

function validateNoBannedTerms(record, label) {
  const text = JSON.stringify(record)
    .replaceAll(safety, '')
    .replace(/\bno\s+weapon(s)?\b/gi, '')
    .replace(/\bno\s+branded characters\b/gi, '')
    .replace(/\bno\s+scary harm\b/gi, '')
    .replace(/\bno\s+logos?\b/gi, '')
    .replace(/\bno\s+watermark\b/gi, '')
    .replace(/\bno\s+text\b/gi, '')
  for (const pattern of bannedTerms) {
    expect(!pattern.test(text), `${label} includes blocked term pattern: ${pattern}`)
  }
}

function readJpegDimensions(buffer, label) {
  expect(buffer[0] === 0xff && buffer[1] === 0xd8, `${label} is not a JPEG file.`)
  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = buffer[offset + 1]
    offset += 2
    if (marker === 0xd9 || marker === 0xda) break
    const segmentLength = buffer.readUInt16BE(offset)
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)
    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      }
    }
    offset += segmentLength
  }
  fail(`${label} does not contain a readable JPEG size marker.`)
}

function readWebpDimensions(buffer, label) {
  expect(buffer.subarray(0, 4).toString('ascii') === 'RIFF', `${label} is not a RIFF file.`)
  expect(buffer.subarray(8, 12).toString('ascii') === 'WEBP', `${label} is not a WebP file.`)
  let offset = 12
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.subarray(offset, offset + 4).toString('ascii')
    const chunkLength = buffer.readUInt32LE(offset + 4)
    const dataOffset = offset + 8
    if (chunkType === 'VP8X') {
      return {
        width: 1 + buffer.readUIntLE(dataOffset + 4, 3),
        height: 1 + buffer.readUIntLE(dataOffset + 7, 3),
      }
    }
    if (chunkType === 'VP8L') {
      expect(buffer[dataOffset] === 0x2f, `${label} has an invalid VP8L signature.`)
      const bits = buffer.readUInt32LE(dataOffset + 1)
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      }
    }
    if (chunkType === 'VP8 ') {
      expect(
        buffer[dataOffset + 3] === 0x9d &&
          buffer[dataOffset + 4] === 0x01 &&
          buffer[dataOffset + 5] === 0x2a,
        `${label} has an invalid VP8 start code.`,
      )
      return {
        width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
        height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff,
      }
    }
    offset += 8 + chunkLength + (chunkLength % 2)
  }
  fail(`${label} does not contain a readable WebP size chunk.`)
}

function validateImageFile(path, label, format) {
  expect(existsSync(path), `${label} missing image file: ${path}`)
  const buffer = readFileSync(path)
  const dimensions =
    format === 'jpeg' ? readJpegDimensions(buffer, label) : readWebpDimensions(buffer, label)
  expect(dimensions.width >= 1344, `${label} width ${dimensions.width} is smaller than 1344.`)
  expect(dimensions.height >= 768, `${label} height ${dimensions.height} is smaller than 768.`)
}

function validateWorld(world, file, slugs) {
  const label = `${file}:${world.slug ?? 'missing-slug'}`
  for (const key of [
    'slug',
    'title',
    'ageBand',
    'premise',
    'conflict',
    'safety',
    'productAngle',
    'imagePrompt',
    'seoLane',
    'kitTheme',
  ]) {
    validateString(world[key], `${label}.${key}`)
  }

  expect(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(world.slug), `${label}.slug must be lowercase kebab-case.`)
  expect(!slugs.has(world.slug), `${label}.slug is duplicated across Batch 1.`)
  slugs.add(world.slug)
  expect(['7-8', '7-9', '8-10', '9-11', '10-11'].includes(world.ageBand), `${label}.ageBand is not allowed.`)
  validateList(world.prompts, 3, `${label}.prompts`)
  validateList(world.heroChoices, 3, `${label}.heroChoices`)
  validateList(world.settingDetails, 3, `${label}.settingDetails`)
  expect(world.safety.includes(safety), `${label}.safety missing required safety sentence.`)
  expect(/printable|classroom|homeschool|bundle|pack/i.test(world.productAngle), `${label}.productAngle is not concrete enough.`)
  expect(seoLanes.has(world.seoLane), `${label}.seoLane is not allowed.`)

  for (const phrase of ['no text', 'no logos', 'no watermark', 'no branded characters', 'no scary harm', 'no weapons']) {
    expect(world.imagePrompt.toLowerCase().includes(phrase), `${label}.imagePrompt missing "${phrase}".`)
  }

  validateNoBannedTerms(world, label)
}

function validateKit(kit, file, worldSlugs, kitSlugs) {
  const label = `${file}:${kit.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'worldSlug', 'title', 'pricePoint', 'parentNote', 'classroomExtension', 'upsell']) {
    validateString(kit[key], `${label}.${key}`)
  }
  expect(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(kit.slug), `${label}.slug must be lowercase kebab-case.`)
  expect(!kitSlugs.has(kit.slug), `${label}.slug is duplicated across Batch 1 kits.`)
  kitSlugs.add(kit.slug)
  expect(worldSlugs.has(kit.worldSlug), `${label}.worldSlug does not reference a Batch 1 world.`)
  expect(pricePoints.has(kit.pricePoint), `${label}.pricePoint must be $9, $29, or $79.`)
  validateList(kit.pages, 5, `${label}.pages`)
  validateNoBannedTerms(kit, label)
}

function validateCollection(collection, collectionSlugs, worldSlugs) {
  const label = `batch2-collections.json:${collection.slug ?? 'missing-slug'}`
  for (const key of [
    'slug',
    'keyword',
    'title',
    'metaDescription',
    'audience',
    'intro',
    'whyItWorks',
    'printableOffer',
    'safetyNote',
    'cta',
  ]) {
    validateString(collection[key], `${label}.${key}`)
  }

  expect(targetCollections.has(collection.slug), `${label}.slug is not a target Batch 2 collection.`)
  expect(collection.keyword === targetCollections.get(collection.slug), `${label}.keyword does not match the target lane.`)
  expect(!collectionSlugs.has(collection.slug), `${label}.slug is duplicated across Batch 2 collections.`)
  collectionSlugs.add(collection.slug)
  expect(collection.metaDescription.length <= 165, `${label}.metaDescription is too long for a focused search result.`)
  expect(collection.title.length <= 72, `${label}.title is too long for a focused page title.`)
  expect(collection.safetyNote.includes(safety), `${label}.safetyNote missing required safety sentence.`)

  validateMinList(collection.featuredWorldSlugs, 3, `${label}.featuredWorldSlugs`)
  for (const worldSlug of collection.featuredWorldSlugs) {
    expect(worldSlugs.has(worldSlug), `${label}.featuredWorldSlugs references unknown world slug ${worldSlug}.`)
  }

  expect(Array.isArray(collection.sections), `${label}.sections must be an array.`)
  expect(collection.sections.length === 3, `${label}.sections must have exactly 3 entries.`)
  collection.sections.forEach((section, index) => {
    validateString(section.heading, `${label}.sections[${index}].heading`)
    validateString(section.body, `${label}.sections[${index}].body`)
    validateMinList(section.bullets, 3, `${label}.sections[${index}].bullets`)
  })

  validateNoBannedTerms(collection, label)

  const renderedPath = resolve(root, 'public', collection.slug, 'index.html')
  expect(existsSync(renderedPath), `${label} static output is missing: ${renderedPath}`)
  const renderedHtml = readFileSync(renderedPath, 'utf8')
  expect(renderedHtml.includes(collection.title), `${label} static output missing collection title.`)
  expect(renderedHtml.includes(collection.metaDescription), `${label} static output missing meta description.`)
}

function validateLesson(lesson, label) {
  for (const key of ['title', 'teacherMove', 'studentTask', 'output']) {
    validateString(lesson[key], `${label}.${key}`)
  }
  expect(Number.isInteger(lesson.minutes), `${label}.minutes must be an integer.`)
  expect(lesson.minutes >= 10 && lesson.minutes <= 60, `${label}.minutes must be between 10 and 60.`)
}

function validateMiniUnit(unit, unitSlugs, worldSlugs) {
  const label = `batch3-mini-units.json:${unit.slug ?? 'missing-slug'}`
  for (const key of [
    'slug',
    'title',
    'ageBand',
    'audience',
    'duration',
    'summary',
    'homeschoolAdaptation',
    'classroomManagement',
    'assessment',
    'printableOffer',
    'safetyNote',
    'imagePrompt',
  ]) {
    validateString(unit[key], `${label}.${key}`)
  }

  expect(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(unit.slug), `${label}.slug must be lowercase kebab-case.`)
  expect(!unitSlugs.has(unit.slug), `${label}.slug is duplicated across Batch 3 mini-units.`)
  unitSlugs.add(unit.slug)
  expect(['7-8', '7-9', '8-10', '9-11', '10-11'].includes(unit.ageBand), `${label}.ageBand is not allowed.`)
  expect(unit.safetyNote.includes(safety), `${label}.safetyNote missing required safety sentence.`)

  validateMinList(unit.worldSlugs, 2, `${label}.worldSlugs`)
  expect(unit.worldSlugs.length <= 4, `${label}.worldSlugs must have no more than 4 entries.`)
  for (const worldSlug of unit.worldSlugs) {
    expect(worldSlugs.has(worldSlug), `${label}.worldSlugs references unknown world slug ${worldSlug}.`)
  }

  validateList(unit.objectives, 3, `${label}.objectives`)
  validateMinList(unit.materials, 4, `${label}.materials`)
  validateMinList(unit.teacherNotes, 4, `${label}.teacherNotes`)

  expect(Array.isArray(unit.lessonFlow), `${label}.lessonFlow must be an array.`)
  expect(unit.lessonFlow.length === 3, `${label}.lessonFlow must have exactly 3 lessons.`)
  unit.lessonFlow.forEach((lesson, index) => validateLesson(lesson, `${label}.lessonFlow[${index}]`))

  expect(/printable|classroom|homeschool|bundle|pack/i.test(unit.printableOffer), `${label}.printableOffer is not concrete enough.`)
  for (const phrase of ['no text', 'no logos', 'no watermark', 'no branded characters', 'no scary harm', 'no weapons']) {
    expect(unit.imagePrompt.toLowerCase().includes(phrase), `${label}.imagePrompt missing "${phrase}".`)
  }
  const accountLanguage = JSON.stringify(unit)
    .replace(/\bwithout\s+logins?\b/gi, '')
    .replace(/\bwithout\s+student accounts?\b/gi, '')
    .replace(/\bwithout\s+account setup\b/gi, '')
    .replace(/\bno\s+student accounts?\b/gi, '')
    .replace(/\bno\s+logins?\b/gi, '')
    .replace(/\bno\s+uploads?\b/gi, '')
    .replace(/\bno\s+public publishing\b/gi, '')
    .replace(/\bdoes not require student accounts?\b/gi, '')
  expect(!/student accounts?|login|log in|public publishing|publish online|upload/i.test(accountLanguage), `${label} includes account, login, upload, or public publishing language.`)

  validateNoBannedTerms(unit, label)

  const renderedPath = resolve(root, 'public', 'mini-units', unit.slug, 'index.html')
  expect(existsSync(renderedPath), `${label} static output is missing: ${renderedPath}`)
  const renderedHtml = readFileSync(renderedPath, 'utf8')
  expect(renderedHtml.includes(unit.title), `${label} static output missing unit title.`)
  expect(renderedHtml.includes('Lesson flow'), `${label} static output missing lesson flow heading.`)
}

function validateBatch4Image(image, imageSlugs, worldSlugs, worldSources) {
  const label = `2026-06-02-batch4-world-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of [
    'slug',
    'title',
    'ageBand',
    'seoLane',
    'sourceWorldFile',
    'prompt',
    'outputJpeg',
    'outputWebp',
    'sidecar',
  ]) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(image.slug), `${label}.slug must be lowercase kebab-case.`)
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 4 images.`)
  imageSlugs.add(image.slug)
  expect(worldSlugs.has(image.slug), `${label}.slug does not reference a Batch 1 world.`)
  expect(image.sourceWorldFile === worldSources.get(image.slug), `${label}.sourceWorldFile does not match source world file.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch4/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch4/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch4/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)

  for (const phrase of [
    'family-friendly',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  validateString(sidecar.model, `${label}.sidecar.model`)
  expect(sidecar.width >= 1344, `${label}.sidecar.width is too small.`)
  expect(sidecar.height >= 768, `${label}.sidecar.height is too small.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch7ProductImage(image, worldSlugs, worldSources) {
  const label = `2026-06-02-batch7-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of [
    'slug',
    'title',
    'ageBand',
    'seoLane',
    'sourceWorldFile',
    'prompt',
    'outputJpeg',
    'outputWebp',
    'sidecar',
  ]) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'rain-boot-route-rangers', `${label}.slug must be rain-boot-route-rangers.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(worldSlugs.has(image.slug), `${label}.slug does not reference a Batch 1 world.`)
  expect(image.sourceWorldFile === worldSources.get(image.slug), `${label}.sourceWorldFile does not match source world file.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch7/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch7/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch7/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of ['family-friendly', 'no text', 'no letters', 'no labels', 'no logos', 'no watermark']) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch10ProductImage(image) {
  const label = `2026-06-02-batch10-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'birthday-party-story-quest-kit', `${label}.slug must be birthday-party-story-quest-kit.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch10/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch10/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch10/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'birthday party',
    'no text',
    'no letters',
    'no labels',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch11ProductImage(image) {
  const label = `2026-06-02-batch11-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'road-trip-story-quest-pack', `${label}.slug must be road-trip-story-quest-pack.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch11/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch11/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch11/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch13ProductImage(image) {
  const label = `2026-06-02-batch13-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'waiting-room-story-quest-pack', `${label}.slug must be waiting-room-story-quest-pack.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch13/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch13/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch13/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch14ProductImage(image) {
  const label = `2026-06-02-batch14-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'library-story-club-kit', `${label}.slug must be library-story-club-kit.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch14/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch14/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch14/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch15ProductImage(image) {
  const label = `2026-06-02-batch15-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'substitute-teacher-story-station-pack', `${label}.slug must be substitute-teacher-story-station-pack.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch15/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch15/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch15/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch16ProductImage(image) {
  const label = `2026-06-02-batch16-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'tutoring-center-story-sprint-pack', `${label}.slug must be tutoring-center-story-sprint-pack.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch16/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch16/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch16/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch17ProductImage(image) {
  const label = `2026-06-02-batch17-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'summer-camp-story-circle-kit', `${label}.slug must be summer-camp-story-circle-kit.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch17/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch17/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch17/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch18ProductImage(image) {
  const label = `2026-06-02-batch18-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'after-school-story-club-starter-kit', `${label}.slug must be after-school-story-club-starter-kit.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch18/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch18/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch18/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
    'no phone',
    'no tablet',
    'no device',
    'screen-free printable after-school writing club kit',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch19ProductImage(image) {
  const label = `2026-06-02-batch19-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'museum-day-story-notebook-kit', `${label}.slug must be museum-day-story-notebook-kit.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch19/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch19/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch19/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
    'no phone',
    'no tablet',
    'no device',
    'screen-free printable museum day writing notebook kit',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch20ProductImage(image) {
  const label = `2026-06-02-batch20-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'family-game-night-story-card-deck', `${label}.slug must be family-game-night-story-card-deck.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch20/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch20/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch20/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no people',
    'no faces',
    'no animals',
    'no phone',
    'no tablet',
    'no device',
    'no dice',
    'screen-free printable family game night story card deck',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  validateNoBannedTerms(image, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar.seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateProduct(product, productSlugs, worldSlugs) {
  const label = `batch5-products.json:${product.slug ?? 'missing-slug'}`
  for (const key of [
    'slug',
    'title',
    'pricePoint',
    'status',
    'headline',
    'summary',
    'heroImage',
    'ctaLabel',
    'ctaHref',
    'checkoutNote',
    'safetyNote',
  ]) {
    validateString(product[key], `${label}.${key}`)
  }
  const expectedProducts = {
    'rainy-day-story-quest-pack': {
      title: 'Rainy Day Story Quest Pack',
      pricePoint: '$9',
      minIncludedPages: 6,
      minUseCases: 3,
      minParentSteps: 3,
      maxWorldSlugs: 5,
    },
    'homeschool-season-story-bundle': {
      title: 'Homeschool Season Story Bundle',
      pricePoint: '$29',
      minIncludedPages: 10,
      minUseCases: 4,
      minParentSteps: 4,
      maxWorldSlugs: 12,
    },
    'classroom-story-license-pack': {
      title: 'Classroom Story License Pack',
      pricePoint: '$79',
      minIncludedPages: 12,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 30,
    },
    'birthday-party-story-quest-kit': {
      title: 'Birthday Party Story Quest Kit',
      pricePoint: '$19',
      minIncludedPages: 9,
      minUseCases: 4,
      minParentSteps: 5,
      maxWorldSlugs: 10,
    },
    'road-trip-story-quest-pack': {
      title: 'Road Trip Story Quest Pack',
      pricePoint: '$17',
      minIncludedPages: 9,
      minUseCases: 4,
      minParentSteps: 5,
      maxWorldSlugs: 10,
    },
    'waiting-room-story-quest-pack': {
      title: 'Waiting Room Story Quest Pack',
      pricePoint: '$11',
      minIncludedPages: 9,
      minUseCases: 4,
      minParentSteps: 5,
      maxWorldSlugs: 10,
    },
    'library-story-club-kit': {
      title: 'Library Story Club Kit',
      pricePoint: '$23',
      minIncludedPages: 10,
      minUseCases: 4,
      minParentSteps: 5,
      maxWorldSlugs: 10,
    },
    'substitute-teacher-story-station-pack': {
      title: 'Substitute Teacher Story Station Pack',
      pricePoint: '$39',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 12,
    },
    'tutoring-center-story-sprint-pack': {
      title: 'Tutoring Center Story Sprint Pack',
      pricePoint: '$49',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 20,
    },
    'summer-camp-story-circle-kit': {
      title: 'Summer Camp Story Circle Kit',
      pricePoint: '$59',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'after-school-story-club-starter-kit': {
      title: 'After-School Story Club Starter Kit',
      pricePoint: '$69',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 18,
    },
    'museum-day-story-notebook-kit': {
      title: 'Museum Day Story Notebook Kit',
      pricePoint: '$37',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 15,
    },
    'family-game-night-story-card-deck': {
      title: 'Family Game Night Story Card Deck',
      pricePoint: '$27',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 15,
    },
  }
  const expectedProduct = expectedProducts[product.slug]
  expect(Boolean(expectedProduct), `${label}.slug is not an expected product slug.`)
  expect(product.title === expectedProduct.title, `${label}.title mismatch.`)
  expect(product.pricePoint === expectedProduct.pricePoint, `${label}.pricePoint mismatch.`)
  expect(product.status === 'checkout_pending', `${label}.status must be checkout_pending.`)
  expect(!productSlugs.has(product.slug), `${label}.slug is duplicated across Batch 5 products.`)
  productSlugs.add(product.slug)
  expect(product.heroImage.startsWith('images/plotsprout/'), `${label}.heroImage must use a committed local image.`)
  expect(product.ctaHref.startsWith('mailto:'), `${label}.ctaHref must be mailto while checkout is pending.`)
  expect(/provider|checkout.*pending|checkout.*selected/i.test(product.checkoutNote), `${label}.checkoutNote must say checkout/provider is pending.`)
  expect(product.safetyNote.includes(safety), `${label}.safetyNote missing required safety sentence.`)
  validateMinList(product.worldSlugs, 3, `${label}.worldSlugs`)
  expect(product.worldSlugs.length <= expectedProduct.maxWorldSlugs, `${label}.worldSlugs has too many entries.`)
  for (const worldSlug of product.worldSlugs) {
    expect(worldSlugs.has(worldSlug), `${label}.worldSlugs references unknown world slug ${worldSlug}.`)
  }
  validateMinList(product.includedPages, expectedProduct.minIncludedPages, `${label}.includedPages`)
  validateMinList(product.useCases, expectedProduct.minUseCases, `${label}.useCases`)
  validateMinList(product.parentSteps, expectedProduct.minParentSteps, `${label}.parentSteps`)

  expect(!containsActiveCheckoutLanguage(product), `${label} includes active checkout or payment-provider language.`)
  expect(!/student accounts?|login|log in|public publishing|publish online|upload/i.test(JSON.stringify(product)), `${label} includes account, upload, or public publishing language.`)
  validateNoBannedTerms(product, label)

  const renderedPath = resolve(root, 'public', product.slug, 'index.html')
  expect(existsSync(renderedPath), `${label} static output is missing: ${renderedPath}`)
  const renderedHtml = readFileSync(renderedPath, 'utf8')
  expect(renderedHtml.includes(product.title), `${label} static output missing product title.`)
  expect(renderedHtml.includes(product.pricePoint), `${label} static output missing price.`)
  expect(renderedHtml.includes(product.checkoutNote), `${label} static output missing checkout note.`)
  const metaDescription = renderedHtml.match(/<meta name="description" content="([^"]+)">/)?.[1]
  validateString(metaDescription, `${label} rendered meta description`)
  expect(
    !/\b(and|or|with|for|to)$/i.test(metaDescription),
    `${label} rendered meta description must not end on a dangling connector.`,
  )
  expect(
    !/[,:;-]$/.test(metaDescription),
    `${label} rendered meta description must not end on dangling punctuation.`,
  )
  expect(
    /[.!?]$/.test(metaDescription),
    `${label} rendered meta description must be a complete sentence.`,
  )
}

for (const dir of [worldsDir, kitsDir]) {
  expect(existsSync(dir), `Missing content directory: ${dir}`)
}

const worldFiles = readdirSync(worldsDir).filter((file) => /^batch1-.+\.json$/.test(file)).sort()
const kitFiles = readdirSync(kitsDir).filter((file) => /^batch1-.+-kits\.json$/.test(file)).sort()
expect(worldFiles.length === 3, `Expected 3 Batch 1 world files, found ${worldFiles.length}.`)
expect(kitFiles.length === 3, `Expected 3 Batch 1 kit files, found ${kitFiles.length}.`)

const worldSlugs = new Set()
const worldSources = new Map()
const worldAgeBands = new Map()
let worldCount = 0

for (const world of starterWorlds) {
  const label = `starter-worlds.mjs:${world.slug ?? 'missing-slug'}`
  validateString(world.slug, `${label}.slug`)
  validateString(world.title, `${label}.title`)
  validateString(world.ageBand, `${label}.ageBand`)
  validateString(world.premise, `${label}.premise`)
  expect(allowedStarterAgeBands.has(world.ageBand), `${label}.ageBand is not allowed.`)
  worldSlugs.add(world.slug)
  worldSources.set(world.slug, 'scripts/starter-worlds.mjs')
  worldAgeBands.set(world.slug, world.ageBand)
}

for (const file of worldFiles) {
  const data = readJson(resolve(worldsDir, file))
  expect(data.batchId === batchId, `${file}.batchId must be ${batchId}.`)
  validateString(data.lane, `${file}.lane`)
  expect(Array.isArray(data.worlds), `${file}.worlds must be an array.`)
  expect(data.worlds.length === 10, `${file}.worlds must contain exactly 10 worlds.`)
  data.worlds.forEach((world) => {
    validateWorld(world, file, worldSlugs)
    worldSources.set(world.slug, `content/worlds/${file}`)
    worldAgeBands.set(world.slug, world.ageBand)
  })
  worldCount += data.worlds.length
}

const kitSlugs = new Set()
let kitCount = 0
for (const file of kitFiles) {
  const data = readJson(resolve(kitsDir, file))
  expect(data.batchId === batchId, `${file}.batchId must be ${batchId}.`)
  validateString(data.lane, `${file}.lane`)
  expect(Array.isArray(data.kits), `${file}.kits must be an array.`)
  data.kits.forEach((kit) => validateKit(kit, file, worldSlugs, kitSlugs))
  kitCount += data.kits.length
}

expect(worldCount === 30, `Expected 30 Batch 1 worlds, found ${worldCount}.`)
expect(kitCount === 10, `Expected 10 Batch 1 printable kit outlines, found ${kitCount}.`)

expect(existsSync(seoCollectionsFile), `Missing Batch 2 SEO collections file: ${seoCollectionsFile}`)
const seoCollections = readJson(seoCollectionsFile)
expect(seoCollections.batchId === seoBatchId, `batch2-collections.json.batchId must be ${seoBatchId}.`)
expect(seoCollections.generatedAt === '2026-06-02', 'batch2-collections.json.generatedAt must be 2026-06-02.')
expect(Array.isArray(seoCollections.collections), 'batch2-collections.json.collections must be an array.')
expect(
  seoCollections.collections.length === targetCollections.size,
  `Expected ${targetCollections.size} Batch 2 SEO collections, found ${seoCollections.collections.length}.`,
)

const collectionSlugs = new Set()
seoCollections.collections.forEach((collection) => validateCollection(collection, collectionSlugs, worldSlugs))
for (const slug of targetCollections.keys()) {
  expect(collectionSlugs.has(slug), `Missing Batch 2 SEO collection slug: ${slug}`)
}

expect(existsSync(miniUnitsFile), `Missing Batch 3 mini-units file: ${miniUnitsFile}`)
const miniUnits = readJson(miniUnitsFile)
expect(miniUnits.batchId === miniUnitsBatchId, `batch3-mini-units.json.batchId must be ${miniUnitsBatchId}.`)
expect(miniUnits.generatedAt === '2026-06-02', 'batch3-mini-units.json.generatedAt must be 2026-06-02.')
expect(Array.isArray(miniUnits.units), 'batch3-mini-units.json.units must be an array.')
expect(miniUnits.units.length === 10, `Expected 10 Batch 3 mini-units, found ${miniUnits.units.length}.`)

const miniUnitSlugs = new Set()
miniUnits.units.forEach((unit) => validateMiniUnit(unit, miniUnitSlugs, worldSlugs))
const miniUnitIndexPath = resolve(root, 'public', 'mini-units', 'index.html')
expect(existsSync(miniUnitIndexPath), `Missing Batch 3 mini-unit index page: ${miniUnitIndexPath}`)
const miniUnitIndexHtml = readFileSync(miniUnitIndexPath, 'utf8')
expect(miniUnitIndexHtml.includes('Teacher Mini-Units'), 'Batch 3 mini-unit index missing expected heading.')

expect(existsSync(batch4ImagesFile), `Missing Batch 4 image manifest: ${batch4ImagesFile}`)
const batch4Images = readJson(batch4ImagesFile)
expect(batch4Images.batchId === batch4ImagesBatchId, `batch4 image manifest batchId must be ${batch4ImagesBatchId}.`)
expect(batch4Images.generatedAt === '2026-06-02', 'batch4 image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch4Images.images), 'batch4 image manifest images must be an array.')
expect(batch4Images.images.length === 20, `Expected 20 Batch 4 images, found ${batch4Images.images.length}.`)
const batch4ImageSlugs = new Set()
batch4Images.images.forEach((image) => validateBatch4Image(image, batch4ImageSlugs, worldSlugs, worldSources))
const worldGalleryPath = resolve(root, 'public', 'world-gallery', 'index.html')
expect(existsSync(worldGalleryPath), `Missing Batch 4 world gallery page: ${worldGalleryPath}`)
const worldGalleryHtml = readFileSync(worldGalleryPath, 'utf8')
expect(worldGalleryHtml.includes('World Art Gallery'), 'Batch 4 world gallery missing expected heading.')
expect(
  (worldGalleryHtml.match(/class="image-card"/g) ?? []).length === 20,
  'Batch 4 world gallery must render exactly 20 image cards.',
)
for (const image of batch4Images.images) {
  expect(worldGalleryHtml.includes(image.title), `Batch 4 world gallery missing image title: ${image.title}`)
  expect(
    worldGalleryHtml.includes(image.outputJpeg.replace(/^public\//, '')),
    `Batch 4 world gallery missing JPEG path for ${image.slug}.`,
  )
}

expect(existsSync(batch7ProductImagesFile), `Missing Batch 7 product image manifest: ${batch7ProductImagesFile}`)
const batch7ProductImages = readJson(batch7ProductImagesFile)
expect(
  batch7ProductImages.batchId === batch7ProductImagesBatchId,
  `batch7 product image manifest batchId must be ${batch7ProductImagesBatchId}.`,
)
expect(batch7ProductImages.generatedAt === '2026-06-02', 'batch7 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch7ProductImages.images), 'batch7 product image manifest images must be an array.')
expect(batch7ProductImages.images.length === 1, `Expected 1 Batch 7 product image, found ${batch7ProductImages.images.length}.`)
validateBatch7ProductImage(batch7ProductImages.images[0], worldSlugs, worldSources)

expect(existsSync(batch10ProductImagesFile), `Missing Batch 10 product image manifest: ${batch10ProductImagesFile}`)
const batch10ProductImages = readJson(batch10ProductImagesFile)
expect(
  batch10ProductImages.batchId === batch10ProductImagesBatchId,
  `batch10 product image manifest batchId must be ${batch10ProductImagesBatchId}.`,
)
expect(batch10ProductImages.generatedAt === '2026-06-02', 'batch10 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch10ProductImages.images), 'batch10 product image manifest images must be an array.')
expect(batch10ProductImages.images.length === 1, `Expected 1 Batch 10 product image, found ${batch10ProductImages.images.length}.`)
validateBatch10ProductImage(batch10ProductImages.images[0])

expect(existsSync(batch11ProductImagesFile), `Missing Batch 11 product image manifest: ${batch11ProductImagesFile}`)
const batch11ProductImages = readJson(batch11ProductImagesFile)
expect(
  batch11ProductImages.batchId === batch11ProductImagesBatchId,
  `batch11 product image manifest batchId must be ${batch11ProductImagesBatchId}.`,
)
expect(batch11ProductImages.generatedAt === '2026-06-02', 'batch11 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch11ProductImages.images), 'batch11 product image manifest images must be an array.')
expect(batch11ProductImages.images.length === 1, `Expected 1 Batch 11 product image, found ${batch11ProductImages.images.length}.`)
validateBatch11ProductImage(batch11ProductImages.images[0])

expect(existsSync(batch13ProductImagesFile), `Missing Batch 13 product image manifest: ${batch13ProductImagesFile}`)
const batch13ProductImages = readJson(batch13ProductImagesFile)
expect(
  batch13ProductImages.batchId === batch13ProductImagesBatchId,
  `batch13 product image manifest batchId must be ${batch13ProductImagesBatchId}.`,
)
expect(batch13ProductImages.generatedAt === '2026-06-02', 'batch13 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch13ProductImages.images), 'batch13 product image manifest images must be an array.')
expect(batch13ProductImages.images.length === 1, `Expected 1 Batch 13 product image, found ${batch13ProductImages.images.length}.`)
validateBatch13ProductImage(batch13ProductImages.images[0])

expect(existsSync(batch14ProductImagesFile), `Missing Batch 14 product image manifest: ${batch14ProductImagesFile}`)
const batch14ProductImages = readJson(batch14ProductImagesFile)
expect(
  batch14ProductImages.batchId === batch14ProductImagesBatchId,
  `batch14 product image manifest batchId must be ${batch14ProductImagesBatchId}.`,
)
expect(batch14ProductImages.generatedAt === '2026-06-02', 'batch14 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch14ProductImages.images), 'batch14 product image manifest images must be an array.')
expect(batch14ProductImages.images.length === 1, `Expected 1 Batch 14 product image, found ${batch14ProductImages.images.length}.`)
validateBatch14ProductImage(batch14ProductImages.images[0])

expect(existsSync(batch15ProductImagesFile), `Missing Batch 15 product image manifest: ${batch15ProductImagesFile}`)
const batch15ProductImages = readJson(batch15ProductImagesFile)
expect(
  batch15ProductImages.batchId === batch15ProductImagesBatchId,
  `batch15 product image manifest batchId must be ${batch15ProductImagesBatchId}.`,
)
expect(batch15ProductImages.generatedAt === '2026-06-02', 'batch15 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch15ProductImages.images), 'batch15 product image manifest images must be an array.')
expect(batch15ProductImages.images.length === 1, `Expected 1 Batch 15 product image, found ${batch15ProductImages.images.length}.`)
validateBatch15ProductImage(batch15ProductImages.images[0])

expect(existsSync(batch16ProductImagesFile), `Missing Batch 16 product image manifest: ${batch16ProductImagesFile}`)
const batch16ProductImages = readJson(batch16ProductImagesFile)
expect(
  batch16ProductImages.batchId === batch16ProductImagesBatchId,
  `batch16 product image manifest batchId must be ${batch16ProductImagesBatchId}.`,
)
expect(batch16ProductImages.generatedAt === '2026-06-02', 'batch16 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch16ProductImages.images), 'batch16 product image manifest images must be an array.')
expect(batch16ProductImages.images.length === 1, `Expected 1 Batch 16 product image, found ${batch16ProductImages.images.length}.`)
validateBatch16ProductImage(batch16ProductImages.images[0])

expect(existsSync(batch17ProductImagesFile), `Missing Batch 17 product image manifest: ${batch17ProductImagesFile}`)
const batch17ProductImages = readJson(batch17ProductImagesFile)
expect(
  batch17ProductImages.batchId === batch17ProductImagesBatchId,
  `batch17 product image manifest batchId must be ${batch17ProductImagesBatchId}.`,
)
expect(batch17ProductImages.generatedAt === '2026-06-02', 'batch17 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch17ProductImages.images), 'batch17 product image manifest images must be an array.')
expect(batch17ProductImages.images.length === 1, `Expected 1 Batch 17 product image, found ${batch17ProductImages.images.length}.`)
validateBatch17ProductImage(batch17ProductImages.images[0])

expect(existsSync(batch18ProductImagesFile), `Missing Batch 18 product image manifest: ${batch18ProductImagesFile}`)
const batch18ProductImages = readJson(batch18ProductImagesFile)
expect(
  batch18ProductImages.batchId === batch18ProductImagesBatchId,
  `batch18 product image manifest batchId must be ${batch18ProductImagesBatchId}.`,
)
expect(batch18ProductImages.generatedAt === '2026-06-02', 'batch18 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch18ProductImages.images), 'batch18 product image manifest images must be an array.')
expect(batch18ProductImages.images.length === 1, `Expected 1 Batch 18 product image, found ${batch18ProductImages.images.length}.`)
validateBatch18ProductImage(batch18ProductImages.images[0])

expect(existsSync(batch19ProductImagesFile), `Missing Batch 19 product image manifest: ${batch19ProductImagesFile}`)
const batch19ProductImages = readJson(batch19ProductImagesFile)
expect(
  batch19ProductImages.batchId === batch19ProductImagesBatchId,
  `batch19 product image manifest batchId must be ${batch19ProductImagesBatchId}.`,
)
expect(batch19ProductImages.generatedAt === '2026-06-02', 'batch19 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch19ProductImages.images), 'batch19 product image manifest images must be an array.')
expect(batch19ProductImages.images.length === 1, `Expected 1 Batch 19 product image, found ${batch19ProductImages.images.length}.`)
validateBatch19ProductImage(batch19ProductImages.images[0])

expect(existsSync(batch20ProductImagesFile), `Missing Batch 20 product image manifest: ${batch20ProductImagesFile}`)
const batch20ProductImages = readJson(batch20ProductImagesFile)
expect(
  batch20ProductImages.batchId === batch20ProductImagesBatchId,
  `batch20 product image manifest batchId must be ${batch20ProductImagesBatchId}.`,
)
expect(batch20ProductImages.generatedAt === '2026-06-02', 'batch20 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch20ProductImages.images), 'batch20 product image manifest images must be an array.')
expect(batch20ProductImages.images.length === 1, `Expected 1 Batch 20 product image, found ${batch20ProductImages.images.length}.`)
validateBatch20ProductImage(batch20ProductImages.images[0])

expect(existsSync(productsFile), `Missing Batch 5 products file: ${productsFile}`)
const products = readJson(productsFile)
expect(products.batchId === productsBatchId, `batch5-products.json.batchId must be ${productsBatchId}.`)
expect(products.generatedAt === '2026-06-02', 'batch5-products.json.generatedAt must be 2026-06-02.')
expect(Array.isArray(products.products), 'batch5-products.json.products must be an array.')
expect(products.products.length === 13, `Expected 13 product records, found ${products.products.length}.`)
const productSlugs = new Set()
products.products.forEach((product) => validateProduct(product, productSlugs, worldSlugs))
for (const requiredProductSlug of [
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
]) {
  expect(productSlugs.has(requiredProductSlug), `Missing product record: ${requiredProductSlug}`)
}

expect(existsSync(rainyDayPackSourceFile), `Missing Batch 7 Rainy Day pack source file: ${rainyDayPackSourceFile}`)
const rainyDayPackSource = readJson(rainyDayPackSourceFile)
expect(rainyDayPackSource.batchId === rainyDayPackBatchId, `Rainy Day pack source batchId must be ${rainyDayPackBatchId}.`)
const rainyDayProduct = products.products.find((product) => product.slug === 'rainy-day-story-quest-pack')
expect(rainyDayProduct, 'Missing Rainy Day product record for Batch 7 artifact validation.')
const rainyDaySourceErrors = validatePackSource(rainyDayPackSource, rainyDayProduct, worldSlugs)
expect(
  rainyDaySourceErrors.length === 0,
  `Rainy Day pack source failed validation:\n${rainyDaySourceErrors.join('\n')}`,
)
const rainyDayExpectedPdfPages = rainyDayPackSource.pages.length + 2
const rainyDayArtifactStatus = inspectArtifactFiles(root, rainyDayPackSource.artifact, {
  expectedPdfPages: rainyDayExpectedPdfPages,
})
expect(
  rainyDayArtifactStatus.valid,
  `Rainy Day pack artifacts failed validation:\n${rainyDayArtifactStatus.errors.join('\n')}`,
)
expect(
  rainyDayArtifactStatus.files.pdf.size > 100_000,
  `Rainy Day PDF artifact is unexpectedly small: ${rainyDayArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  rainyDayArtifactStatus.files.pdf.pageCount === rainyDayExpectedPdfPages,
  `Rainy Day PDF artifact must have ${rainyDayExpectedPdfPages} pages.`,
)
expect(
  rainyDayArtifactStatus.files.zip.size > rainyDayArtifactStatus.files.pdf.size,
  'Rainy Day ZIP artifact should include the PDF plus source HTML and image assets.',
)
const rainyDayCheckoutErrors = validateCheckoutReadiness(rainyDayProduct, rainyDayArtifactStatus)
expect(
  rainyDayCheckoutErrors.length === 0,
  `Rainy Day checkout readiness failed validation:\n${rainyDayCheckoutErrors.join('\n')}`,
)
const rainyDayArtifactManifest = readJson(resolve(root, rainyDayPackSource.artifact.manifestPath))
expect(
  rainyDayArtifactManifest.sourcePageCount === rainyDayPackSource.pages.length,
  'Rainy Day artifact manifest sourcePageCount must match source pages.',
)
expect(
  Array.isArray(rainyDayArtifactManifest.files.assets),
  'Rainy Day artifact manifest files.assets must be an array.',
)
expect(
  rainyDayArtifactManifest.files.assets.length === rainyDayPackSource.worldSlugs.length,
  'Rainy Day artifact manifest must include one copied source image per product world.',
)
const rainyDayManifestAssetErrors = validateManifestWorldAssets(rainyDayPackSource, rainyDayArtifactManifest)
expect(
  rainyDayManifestAssetErrors.length === 0,
  `Rainy Day artifact manifest image coverage failed validation:\n${rainyDayManifestAssetErrors.join('\n')}`,
)
for (const worldSlug of rainyDayPackSource.worldSlugs) {
  const asset = rainyDayArtifactManifest.files.assets.find((candidate) => candidate.path.includes(`${worldSlug}.jpg`))
  expect(asset, `Rainy Day artifact manifest missing copied image for ${worldSlug}.`)
  validateImageFile(resolve(root, asset.path), `Rainy Day copied artifact image ${worldSlug}`, 'jpeg')
}

expect(existsSync(seasonBundleSourceFile), `Missing Batch 8 Homeschool Season bundle source file: ${seasonBundleSourceFile}`)
const seasonBundleSource = readJson(seasonBundleSourceFile)
expect(
  seasonBundleSource.batchId === seasonBundleBatchId,
  `Homeschool Season bundle source batchId must be ${seasonBundleBatchId}.`,
)
const seasonBundleProduct = products.products.find((product) => product.slug === 'homeschool-season-story-bundle')
expect(seasonBundleProduct, 'Missing Homeschool Season product record for Batch 8 artifact validation.')
const seasonBundleSourceErrors = validateSeasonBundleSource(seasonBundleSource, seasonBundleProduct, worldSlugs)
expect(
  seasonBundleSourceErrors.length === 0,
  `Homeschool Season bundle source failed validation:\n${seasonBundleSourceErrors.join('\n')}`,
)
const seasonBundleExpectedPdfPages = seasonBundleSource.pages.length + 2
const seasonBundleArtifactStatus = inspectArtifactFiles(root, seasonBundleSource.artifact, {
  expectedPdfPages: seasonBundleExpectedPdfPages,
})
expect(
  seasonBundleArtifactStatus.valid,
  `Homeschool Season bundle artifacts failed validation:\n${seasonBundleArtifactStatus.errors.join('\n')}`,
)
expect(
  seasonBundleArtifactStatus.files.pdf.size > 100_000,
  `Homeschool Season PDF artifact is unexpectedly small: ${seasonBundleArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  seasonBundleArtifactStatus.files.pdf.pageCount === seasonBundleExpectedPdfPages,
  `Homeschool Season PDF artifact must have ${seasonBundleExpectedPdfPages} pages.`,
)
expect(
  seasonBundleArtifactStatus.files.zip.size > seasonBundleArtifactStatus.files.pdf.size,
  'Homeschool Season ZIP artifact should include the PDF plus source HTML and image assets.',
)
const seasonBundleCheckoutErrors = validateCheckoutReadiness(seasonBundleProduct, seasonBundleArtifactStatus)
expect(
  seasonBundleCheckoutErrors.length === 0,
  `Homeschool Season checkout readiness failed validation:\n${seasonBundleCheckoutErrors.join('\n')}`,
)
const seasonBundleArtifactManifest = readJson(resolve(root, seasonBundleSource.artifact.manifestPath))
expect(
  seasonBundleArtifactManifest.sourcePageCount === seasonBundleSource.pages.length,
  'Homeschool Season artifact manifest sourcePageCount must match source pages.',
)
expect(
  Array.isArray(seasonBundleArtifactManifest.files.assets),
  'Homeschool Season artifact manifest files.assets must be an array.',
)
expect(
  seasonBundleArtifactManifest.files.assets.length === seasonBundleSource.worldSlugs.length,
  'Homeschool Season artifact manifest must include one copied local image per product world.',
)
const seasonBundleManifestAssetErrors = validateManifestWorldAssets(seasonBundleSource, seasonBundleArtifactManifest)
expect(
  seasonBundleManifestAssetErrors.length === 0,
  `Homeschool Season artifact manifest image coverage failed validation:\n${seasonBundleManifestAssetErrors.join('\n')}`,
)
for (const asset of seasonBundleArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Homeschool Season copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(classroomLicenseSourceFile), `Missing Batch 9 Classroom license source file: ${classroomLicenseSourceFile}`)
const classroomLicenseSource = readJson(classroomLicenseSourceFile)
expect(
  classroomLicenseSource.batchId === classroomLicenseBatchId,
  `Classroom license source batchId must be ${classroomLicenseBatchId}.`,
)
const classroomLicenseProduct = products.products.find((product) => product.slug === 'classroom-story-license-pack')
expect(classroomLicenseProduct, 'Missing Classroom Story License product record for Batch 9 artifact validation.')
const classroomLicenseSourceErrors = validateClassroomLicenseSource(classroomLicenseSource, classroomLicenseProduct, worldSlugs)
expect(
  classroomLicenseSourceErrors.length === 0,
  `Classroom Story License source failed validation:\n${classroomLicenseSourceErrors.join('\n')}`,
)
const classroomExpectedPdfPages = classroomLicenseSource.promptCards.length + 4
const classroomArtifactStatus = inspectArtifactFiles(root, classroomLicenseSource.artifact, {
  expectedPdfPages: classroomExpectedPdfPages,
})
expect(
  classroomArtifactStatus.valid,
  `Classroom Story License artifacts failed validation:\n${classroomArtifactStatus.errors.join('\n')}`,
)
expect(
  classroomArtifactStatus.files.pdf.size > 150_000,
  `Classroom Story License PDF artifact is unexpectedly small: ${classroomArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  classroomArtifactStatus.files.pdf.pageCount === classroomExpectedPdfPages,
  `Classroom Story License PDF artifact must have ${classroomExpectedPdfPages} pages.`,
)
expect(
  classroomArtifactStatus.files.zip.size > classroomArtifactStatus.files.pdf.size,
  'Classroom Story License ZIP artifact should include the PDF plus source HTML and image assets.',
)
const classroomCheckoutErrors = validateCheckoutReadiness(classroomLicenseProduct, classroomArtifactStatus)
expect(
  classroomCheckoutErrors.length === 0,
  `Classroom Story License checkout readiness failed validation:\n${classroomCheckoutErrors.join('\n')}`,
)
const classroomArtifactManifest = readJson(resolve(root, classroomLicenseSource.artifact.manifestPath))
expect(
  classroomArtifactManifest.sourcePageCount === classroomLicenseSource.promptCards.length,
  'Classroom Story License artifact manifest sourcePageCount must match source prompt cards.',
)
expect(
  Array.isArray(classroomArtifactManifest.files.assets),
  'Classroom Story License artifact manifest files.assets must be an array.',
)
expect(
  classroomArtifactManifest.files.assets.length === classroomLicenseSource.worldSlugs.length,
  'Classroom Story License artifact manifest must include one copied local image per product world.',
)
const classroomManifestAssetErrors = validateManifestWorldAssets(classroomLicenseSource, classroomArtifactManifest)
expect(
  classroomManifestAssetErrors.length === 0,
  `Classroom Story License artifact manifest image coverage failed validation:\n${classroomManifestAssetErrors.join('\n')}`,
)
for (const asset of classroomArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Classroom Story License copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(birthdayPartySourceFile), `Missing Batch 10 Birthday Party kit source file: ${birthdayPartySourceFile}`)
const birthdayPartySource = readJson(birthdayPartySourceFile)
expect(
  birthdayPartySource.batchId === birthdayPartyBatchId,
  `Birthday Party kit source batchId must be ${birthdayPartyBatchId}.`,
)
const birthdayPartyProduct = products.products.find((product) => product.slug === 'birthday-party-story-quest-kit')
expect(birthdayPartyProduct, 'Missing Birthday Party product record for Batch 10 artifact validation.')
const birthdayPartySourceErrors = validateBirthdayPartyKitSource(birthdayPartySource, birthdayPartyProduct, worldAgeBands)
expect(
  birthdayPartySourceErrors.length === 0,
  `Birthday Party Story Quest Kit source failed validation:\n${birthdayPartySourceErrors.join('\n')}`,
)
const birthdayPartyExpectedPdfPages = birthdayPartySource.quests.length + 4
const birthdayPartyArtifactStatus = inspectArtifactFiles(root, birthdayPartySource.artifact, {
  expectedPdfPages: birthdayPartyExpectedPdfPages,
})
expect(
  birthdayPartyArtifactStatus.valid,
  `Birthday Party Story Quest Kit artifacts failed validation:\n${birthdayPartyArtifactStatus.errors.join('\n')}`,
)
expect(
  birthdayPartyArtifactStatus.files.pdf.size > 100_000,
  `Birthday Party Story Quest Kit PDF artifact is unexpectedly small: ${birthdayPartyArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  birthdayPartyArtifactStatus.files.pdf.pageCount === birthdayPartyExpectedPdfPages,
  `Birthday Party Story Quest Kit PDF artifact must have ${birthdayPartyExpectedPdfPages} pages.`,
)
expect(
  birthdayPartyArtifactStatus.files.zip.size > birthdayPartyArtifactStatus.files.pdf.size,
  'Birthday Party Story Quest Kit ZIP artifact should include the PDF plus source HTML and image assets.',
)
const birthdayPartyCheckoutErrors = validateCheckoutReadiness(birthdayPartyProduct, birthdayPartyArtifactStatus)
expect(
  birthdayPartyCheckoutErrors.length === 0,
  `Birthday Party Story Quest Kit checkout readiness failed validation:\n${birthdayPartyCheckoutErrors.join('\n')}`,
)
const birthdayPartyArtifactManifest = readJson(resolve(root, birthdayPartySource.artifact.manifestPath))
expect(
  birthdayPartyArtifactManifest.sourcePageCount === birthdayPartySource.quests.length,
  'Birthday Party Story Quest Kit artifact manifest sourcePageCount must match source quests.',
)
expect(
  Array.isArray(birthdayPartyArtifactManifest.files.assets),
  'Birthday Party Story Quest Kit artifact manifest files.assets must be an array.',
)
expect(
  birthdayPartyArtifactManifest.files.assets.length === birthdayPartySource.worldSlugs.length,
  'Birthday Party Story Quest Kit artifact manifest must include one copied local image per product world.',
)
const birthdayPartyManifestAssetErrors = validateManifestWorldAssets(birthdayPartySource, birthdayPartyArtifactManifest)
expect(
  birthdayPartyManifestAssetErrors.length === 0,
  `Birthday Party Story Quest Kit artifact manifest image coverage failed validation:\n${birthdayPartyManifestAssetErrors.join('\n')}`,
)
for (const asset of birthdayPartyArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Birthday Party Story Quest Kit copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(roadTripSourceFile), `Missing Batch 11 Road Trip pack source file: ${roadTripSourceFile}`)
const roadTripSource = readJson(roadTripSourceFile)
expect(
  roadTripSource.batchId === roadTripBatchId,
  `Road Trip pack source batchId must be ${roadTripBatchId}.`,
)
const roadTripProduct = products.products.find((product) => product.slug === 'road-trip-story-quest-pack')
expect(roadTripProduct, 'Missing Road Trip product record for Batch 11 artifact validation.')
const roadTripSourceErrors = validateRoadTripPackSource(roadTripSource, roadTripProduct, worldAgeBands)
expect(
  roadTripSourceErrors.length === 0,
  `Road Trip Story Quest Pack source failed validation:\n${roadTripSourceErrors.join('\n')}`,
)
const roadTripExpectedPdfPages = roadTripSource.quests.length + 4
const roadTripArtifactStatus = inspectArtifactFiles(root, roadTripSource.artifact, {
  expectedPdfPages: roadTripExpectedPdfPages,
})
expect(
  roadTripArtifactStatus.valid,
  `Road Trip Story Quest Pack artifacts failed validation:\n${roadTripArtifactStatus.errors.join('\n')}`,
)
expect(
  roadTripArtifactStatus.files.pdf.size > 100_000,
  `Road Trip Story Quest Pack PDF artifact is unexpectedly small: ${roadTripArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  roadTripArtifactStatus.files.pdf.pageCount === roadTripExpectedPdfPages,
  `Road Trip Story Quest Pack PDF artifact must have ${roadTripExpectedPdfPages} pages.`,
)
expect(
  roadTripArtifactStatus.files.zip.size > roadTripArtifactStatus.files.pdf.size,
  'Road Trip Story Quest Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const roadTripCheckoutErrors = validateCheckoutReadiness(roadTripProduct, roadTripArtifactStatus)
expect(
  roadTripCheckoutErrors.length === 0,
  `Road Trip Story Quest Pack checkout readiness failed validation:\n${roadTripCheckoutErrors.join('\n')}`,
)
const roadTripArtifactManifest = readJson(resolve(root, roadTripSource.artifact.manifestPath))
expect(
  roadTripArtifactManifest.sourcePageCount === roadTripSource.quests.length,
  'Road Trip Story Quest Pack artifact manifest sourcePageCount must match source quests.',
)
expect(
  Array.isArray(roadTripArtifactManifest.files.assets),
  'Road Trip Story Quest Pack artifact manifest files.assets must be an array.',
)
expect(
  roadTripArtifactManifest.files.assets.length === roadTripSource.worldSlugs.length,
  'Road Trip Story Quest Pack artifact manifest must include one copied local image per product world.',
)
const roadTripManifestAssetErrors = validateManifestWorldAssets(roadTripSource, roadTripArtifactManifest)
expect(
  roadTripManifestAssetErrors.length === 0,
  `Road Trip Story Quest Pack artifact manifest image coverage failed validation:\n${roadTripManifestAssetErrors.join('\n')}`,
)
for (const asset of roadTripArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Road Trip Story Quest Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(waitingRoomSourceFile), `Missing Batch 13 Waiting Room pack source file: ${waitingRoomSourceFile}`)
const waitingRoomSource = readJson(waitingRoomSourceFile)
expect(
  waitingRoomSource.batchId === waitingRoomBatchId,
  `Waiting Room pack source batchId must be ${waitingRoomBatchId}.`,
)
const waitingRoomProduct = products.products.find((product) => product.slug === 'waiting-room-story-quest-pack')
expect(waitingRoomProduct, 'Missing Waiting Room product record for Batch 13 artifact validation.')
const waitingRoomSourceErrors = validateWaitingRoomPackSource(waitingRoomSource, waitingRoomProduct, worldAgeBands)
expect(
  waitingRoomSourceErrors.length === 0,
  `Waiting Room Story Quest Pack source failed validation:\n${waitingRoomSourceErrors.join('\n')}`,
)
const waitingRoomExpectedPdfPages = waitingRoomSource.quests.length + 4
const waitingRoomArtifactStatus = inspectArtifactFiles(root, waitingRoomSource.artifact, {
  expectedPdfPages: waitingRoomExpectedPdfPages,
})
expect(
  waitingRoomArtifactStatus.valid,
  `Waiting Room Story Quest Pack artifacts failed validation:\n${waitingRoomArtifactStatus.errors.join('\n')}`,
)
expect(
  waitingRoomArtifactStatus.files.pdf.size > 100_000,
  `Waiting Room Story Quest Pack PDF artifact is unexpectedly small: ${waitingRoomArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  waitingRoomArtifactStatus.files.pdf.pageCount === waitingRoomExpectedPdfPages,
  `Waiting Room Story Quest Pack PDF artifact must have ${waitingRoomExpectedPdfPages} pages.`,
)
expect(
  waitingRoomArtifactStatus.files.zip.size > waitingRoomArtifactStatus.files.pdf.size,
  'Waiting Room Story Quest Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const waitingRoomCheckoutErrors = validateCheckoutReadiness(waitingRoomProduct, waitingRoomArtifactStatus)
expect(
  waitingRoomCheckoutErrors.length === 0,
  `Waiting Room Story Quest Pack checkout readiness failed validation:\n${waitingRoomCheckoutErrors.join('\n')}`,
)
const waitingRoomArtifactManifest = readJson(resolve(root, waitingRoomSource.artifact.manifestPath))
expect(
  waitingRoomArtifactManifest.sourcePageCount === waitingRoomSource.quests.length,
  'Waiting Room Story Quest Pack artifact manifest sourcePageCount must match source quests.',
)
expect(
  Array.isArray(waitingRoomArtifactManifest.files.assets),
  'Waiting Room Story Quest Pack artifact manifest files.assets must be an array.',
)
expect(
  waitingRoomArtifactManifest.files.assets.length === waitingRoomSource.worldSlugs.length,
  'Waiting Room Story Quest Pack artifact manifest must include one copied local image per product world.',
)
const waitingRoomManifestAssetErrors = validateManifestWorldAssets(waitingRoomSource, waitingRoomArtifactManifest)
expect(
  waitingRoomManifestAssetErrors.length === 0,
  `Waiting Room Story Quest Pack artifact manifest image coverage failed validation:\n${waitingRoomManifestAssetErrors.join('\n')}`,
)
for (const asset of waitingRoomArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Waiting Room Story Quest Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(libraryStoryClubSourceFile), `Missing Batch 14 Library Story Club source file: ${libraryStoryClubSourceFile}`)
const libraryStoryClubSource = readJson(libraryStoryClubSourceFile)
expect(
  libraryStoryClubSource.batchId === libraryStoryClubBatchId,
  `Library Story Club source batchId must be ${libraryStoryClubBatchId}.`,
)
const libraryStoryClubProduct = products.products.find((product) => product.slug === 'library-story-club-kit')
expect(libraryStoryClubProduct, 'Missing Library Story Club product record for Batch 14 artifact validation.')
const libraryStoryClubSourceErrors = validateLibraryStoryClubKitSource(
  libraryStoryClubSource,
  libraryStoryClubProduct,
  worldAgeBands,
)
expect(
  libraryStoryClubSourceErrors.length === 0,
  `Library Story Club Kit source failed validation:\n${libraryStoryClubSourceErrors.join('\n')}`,
)
const libraryStoryClubExpectedPdfPages = libraryStoryClubSource.sessions.length + 4
const libraryStoryClubArtifactStatus = inspectArtifactFiles(root, libraryStoryClubSource.artifact, {
  expectedPdfPages: libraryStoryClubExpectedPdfPages,
})
expect(
  libraryStoryClubArtifactStatus.valid,
  `Library Story Club Kit artifacts failed validation:\n${libraryStoryClubArtifactStatus.errors.join('\n')}`,
)
expect(
  libraryStoryClubArtifactStatus.files.pdf.size > 100_000,
  `Library Story Club Kit PDF artifact is unexpectedly small: ${libraryStoryClubArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  libraryStoryClubArtifactStatus.files.pdf.pageCount === libraryStoryClubExpectedPdfPages,
  `Library Story Club Kit PDF artifact must have ${libraryStoryClubExpectedPdfPages} pages.`,
)
expect(
  libraryStoryClubArtifactStatus.files.zip.size > libraryStoryClubArtifactStatus.files.pdf.size,
  'Library Story Club Kit ZIP artifact should include the PDF plus source HTML and image assets.',
)
const libraryStoryClubCheckoutErrors = validateCheckoutReadiness(libraryStoryClubProduct, libraryStoryClubArtifactStatus)
expect(
  libraryStoryClubCheckoutErrors.length === 0,
  `Library Story Club Kit checkout readiness failed validation:\n${libraryStoryClubCheckoutErrors.join('\n')}`,
)
const libraryStoryClubArtifactManifest = readJson(resolve(root, libraryStoryClubSource.artifact.manifestPath))
expect(
  libraryStoryClubArtifactManifest.sourcePageCount === libraryStoryClubSource.sessions.length,
  'Library Story Club Kit artifact manifest sourcePageCount must match source sessions.',
)
expect(
  Array.isArray(libraryStoryClubArtifactManifest.files.assets),
  'Library Story Club Kit artifact manifest files.assets must be an array.',
)
expect(
  libraryStoryClubArtifactManifest.files.assets.length === libraryStoryClubSource.worldSlugs.length,
  'Library Story Club Kit artifact manifest must include one copied local image per product world.',
)
const libraryStoryClubManifestAssetErrors = validateManifestWorldAssets(
  libraryStoryClubSource,
  libraryStoryClubArtifactManifest,
)
expect(
  libraryStoryClubManifestAssetErrors.length === 0,
  `Library Story Club Kit artifact manifest image coverage failed validation:\n${libraryStoryClubManifestAssetErrors.join('\n')}`,
)
for (const asset of libraryStoryClubArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Library Story Club Kit copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(substituteTeacherSourceFile), `Missing Batch 15 Substitute Teacher source file: ${substituteTeacherSourceFile}`)
const substituteTeacherSource = readJson(substituteTeacherSourceFile)
expect(
  substituteTeacherSource.batchId === substituteTeacherBatchId,
  `Substitute Teacher source batchId must be ${substituteTeacherBatchId}.`,
)
const substituteTeacherProduct = products.products.find((product) => product.slug === 'substitute-teacher-story-station-pack')
expect(substituteTeacherProduct, 'Missing Substitute Teacher product record for Batch 15 artifact validation.')
const substituteTeacherSourceErrors = validateSubstituteTeacherStationPackSource(
  substituteTeacherSource,
  substituteTeacherProduct,
  worldAgeBands,
)
expect(
  substituteTeacherSourceErrors.length === 0,
  `Substitute Teacher Story Station Pack source failed validation:\n${substituteTeacherSourceErrors.join('\n')}`,
)
const substituteTeacherExpectedPdfPages = substituteTeacherSource.stations.length + 4
const substituteTeacherArtifactStatus = inspectArtifactFiles(root, substituteTeacherSource.artifact, {
  expectedPdfPages: substituteTeacherExpectedPdfPages,
})
expect(
  substituteTeacherArtifactStatus.valid,
  `Substitute Teacher Story Station Pack artifacts failed validation:\n${substituteTeacherArtifactStatus.errors.join('\n')}`,
)
expect(
  substituteTeacherArtifactStatus.files.pdf.size > 100_000,
  `Substitute Teacher Story Station Pack PDF artifact is unexpectedly small: ${substituteTeacherArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  substituteTeacherArtifactStatus.files.pdf.pageCount === substituteTeacherExpectedPdfPages,
  `Substitute Teacher Story Station Pack PDF artifact must have ${substituteTeacherExpectedPdfPages} pages.`,
)
expect(
  substituteTeacherArtifactStatus.files.zip.size > substituteTeacherArtifactStatus.files.pdf.size,
  'Substitute Teacher Story Station Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const substituteTeacherCheckoutErrors = validateCheckoutReadiness(substituteTeacherProduct, substituteTeacherArtifactStatus)
expect(
  substituteTeacherCheckoutErrors.length === 0,
  `Substitute Teacher Story Station Pack checkout readiness failed validation:\n${substituteTeacherCheckoutErrors.join('\n')}`,
)
const substituteTeacherArtifactManifest = readJson(resolve(root, substituteTeacherSource.artifact.manifestPath))
expect(
  substituteTeacherArtifactManifest.sourcePageCount === substituteTeacherSource.stations.length,
  'Substitute Teacher Story Station Pack artifact manifest sourcePageCount must match source stations.',
)
expect(
  Array.isArray(substituteTeacherArtifactManifest.files.assets),
  'Substitute Teacher Story Station Pack artifact manifest files.assets must be an array.',
)
expect(
  substituteTeacherArtifactManifest.files.assets.length === substituteTeacherSource.worldSlugs.length,
  'Substitute Teacher Story Station Pack artifact manifest must include one copied local image per product world.',
)
const substituteTeacherManifestAssetErrors = validateManifestWorldAssets(
  substituteTeacherSource,
  substituteTeacherArtifactManifest,
)
expect(
  substituteTeacherManifestAssetErrors.length === 0,
  `Substitute Teacher Story Station Pack artifact manifest image coverage failed validation:\n${substituteTeacherManifestAssetErrors.join('\n')}`,
)
for (const asset of substituteTeacherArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Substitute Teacher Story Station Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(tutoringCenterSourceFile), `Missing Batch 16 Tutoring Center source file: ${tutoringCenterSourceFile}`)
const tutoringCenterSource = readJson(tutoringCenterSourceFile)
expect(
  tutoringCenterSource.batchId === tutoringCenterBatchId,
  `Tutoring Center source batchId must be ${tutoringCenterBatchId}.`,
)
const tutoringCenterProduct = products.products.find((product) => product.slug === 'tutoring-center-story-sprint-pack')
expect(tutoringCenterProduct, 'Missing Tutoring Center product record for Batch 16 artifact validation.')
const tutoringCenterSourceErrors = validateTutoringCenterSprintPackSource(
  tutoringCenterSource,
  tutoringCenterProduct,
  worldAgeBands,
)
expect(
  tutoringCenterSourceErrors.length === 0,
  `Tutoring Center Story Sprint Pack source failed validation:\n${tutoringCenterSourceErrors.join('\n')}`,
)
const tutoringCenterExpectedPdfPages = tutoringCenterSource.sprints.length + 4
const tutoringCenterArtifactStatus = inspectArtifactFiles(root, tutoringCenterSource.artifact, {
  expectedPdfPages: tutoringCenterExpectedPdfPages,
})
expect(
  tutoringCenterArtifactStatus.valid,
  `Tutoring Center Story Sprint Pack artifacts failed validation:\n${tutoringCenterArtifactStatus.errors.join('\n')}`,
)
expect(
  tutoringCenterArtifactStatus.files.pdf.size > 100_000,
  `Tutoring Center Story Sprint Pack PDF artifact is unexpectedly small: ${tutoringCenterArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  tutoringCenterArtifactStatus.files.pdf.pageCount === tutoringCenterExpectedPdfPages,
  `Tutoring Center Story Sprint Pack PDF artifact must have ${tutoringCenterExpectedPdfPages} pages.`,
)
expect(
  tutoringCenterArtifactStatus.files.zip.size > tutoringCenterArtifactStatus.files.pdf.size,
  'Tutoring Center Story Sprint Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const tutoringCenterCheckoutErrors = validateCheckoutReadiness(tutoringCenterProduct, tutoringCenterArtifactStatus)
expect(
  tutoringCenterCheckoutErrors.length === 0,
  `Tutoring Center Story Sprint Pack checkout readiness failed validation:\n${tutoringCenterCheckoutErrors.join('\n')}`,
)
const tutoringCenterArtifactManifest = readJson(resolve(root, tutoringCenterSource.artifact.manifestPath))
expect(
  tutoringCenterArtifactManifest.sourcePageCount === tutoringCenterSource.sprints.length,
  'Tutoring Center Story Sprint Pack artifact manifest sourcePageCount must match source sprints.',
)
expect(
  Array.isArray(tutoringCenterArtifactManifest.files.assets),
  'Tutoring Center Story Sprint Pack artifact manifest files.assets must be an array.',
)
expect(
  tutoringCenterArtifactManifest.files.assets.length === tutoringCenterSource.worldSlugs.length,
  'Tutoring Center Story Sprint Pack artifact manifest must include one copied local image per source world.',
)
const tutoringCenterManifestAssetErrors = validateManifestWorldAssets(
  tutoringCenterSource,
  tutoringCenterArtifactManifest,
)
expect(
  tutoringCenterManifestAssetErrors.length === 0,
  `Tutoring Center Story Sprint Pack artifact manifest image coverage failed validation:\n${tutoringCenterManifestAssetErrors.join('\n')}`,
)
for (const asset of tutoringCenterArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Tutoring Center Story Sprint Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(summerCampSourceFile), `Missing Batch 17 Summer Camp source file: ${summerCampSourceFile}`)
const summerCampSource = readJson(summerCampSourceFile)
expect(
  summerCampSource.batchId === summerCampBatchId,
  `Summer Camp source batchId must be ${summerCampBatchId}.`,
)
const summerCampProduct = products.products.find((product) => product.slug === 'summer-camp-story-circle-kit')
expect(summerCampProduct, 'Missing Summer Camp product record for Batch 17 artifact validation.')
const summerCampSourceErrors = validateSummerCampStoryCircleKitSource(
  summerCampSource,
  summerCampProduct,
  worldAgeBands,
)
expect(
  summerCampSourceErrors.length === 0,
  `Summer Camp Story Circle Kit source failed validation:\n${summerCampSourceErrors.join('\n')}`,
)
const summerCampExpectedPdfPages = summerCampSource.activities.length + 4
const summerCampArtifactStatus = inspectArtifactFiles(root, summerCampSource.artifact, {
  expectedPdfPages: summerCampExpectedPdfPages,
})
expect(
  summerCampArtifactStatus.valid,
  `Summer Camp Story Circle Kit artifacts failed validation:\n${summerCampArtifactStatus.errors.join('\n')}`,
)
expect(
  summerCampArtifactStatus.files.pdf.size > 100_000,
  `Summer Camp Story Circle Kit PDF artifact is unexpectedly small: ${summerCampArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  summerCampArtifactStatus.files.pdf.pageCount === summerCampExpectedPdfPages,
  `Summer Camp Story Circle Kit PDF artifact must have ${summerCampExpectedPdfPages} pages.`,
)
expect(
  summerCampArtifactStatus.files.zip.size > summerCampArtifactStatus.files.pdf.size,
  'Summer Camp Story Circle Kit ZIP artifact should include the PDF plus source HTML and image assets.',
)
const summerCampCheckoutErrors = validateCheckoutReadiness(summerCampProduct, summerCampArtifactStatus)
expect(
  summerCampCheckoutErrors.length === 0,
  `Summer Camp Story Circle Kit checkout readiness failed validation:\n${summerCampCheckoutErrors.join('\n')}`,
)
const summerCampArtifactManifest = readJson(resolve(root, summerCampSource.artifact.manifestPath))
expect(
  summerCampArtifactManifest.sourcePageCount === summerCampSource.activities.length,
  'Summer Camp Story Circle Kit artifact manifest sourcePageCount must match source activities.',
)
expect(
  Array.isArray(summerCampArtifactManifest.files.assets),
  'Summer Camp Story Circle Kit artifact manifest files.assets must be an array.',
)
expect(
  summerCampArtifactManifest.files.assets.length === summerCampSource.worldSlugs.length,
  'Summer Camp Story Circle Kit artifact manifest must include one copied local image per source world.',
)
const summerCampManifestAssetErrors = validateManifestWorldAssets(
  summerCampSource,
  summerCampArtifactManifest,
)
expect(
  summerCampManifestAssetErrors.length === 0,
  `Summer Camp Story Circle Kit artifact manifest image coverage failed validation:\n${summerCampManifestAssetErrors.join('\n')}`,
)
for (const asset of summerCampArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Summer Camp Story Circle Kit copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(afterSchoolSourceFile), `Missing Batch 18 After-School source file: ${afterSchoolSourceFile}`)
const afterSchoolSource = readJson(afterSchoolSourceFile)
expect(
  afterSchoolSource.batchId === afterSchoolBatchId,
  `After-School source batchId must be ${afterSchoolBatchId}.`,
)
const afterSchoolProduct = products.products.find((product) => product.slug === 'after-school-story-club-starter-kit')
expect(afterSchoolProduct, 'Missing After-School product record for Batch 18 artifact validation.')
const afterSchoolSourceErrors = validateAfterSchoolStoryClubKitSource(
  afterSchoolSource,
  afterSchoolProduct,
  worldAgeBands,
)
expect(
  afterSchoolSourceErrors.length === 0,
  `After-School Story Club Starter Kit source failed validation:\n${afterSchoolSourceErrors.join('\n')}`,
)
const afterSchoolExpectedPdfPages = afterSchoolSource.sessions.length + 4
const afterSchoolArtifactStatus = inspectArtifactFiles(root, afterSchoolSource.artifact, {
  expectedPdfPages: afterSchoolExpectedPdfPages,
})
expect(
  afterSchoolArtifactStatus.valid,
  `After-School Story Club Starter Kit artifacts failed validation:\n${afterSchoolArtifactStatus.errors.join('\n')}`,
)
expect(
  afterSchoolArtifactStatus.files.pdf.size > 100_000,
  `After-School Story Club Starter Kit PDF artifact is unexpectedly small: ${afterSchoolArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  afterSchoolArtifactStatus.files.pdf.pageCount === afterSchoolExpectedPdfPages,
  `After-School Story Club Starter Kit PDF artifact must have ${afterSchoolExpectedPdfPages} pages.`,
)
expect(
  afterSchoolArtifactStatus.files.zip.size > afterSchoolArtifactStatus.files.pdf.size,
  'After-School Story Club Starter Kit ZIP artifact should include the PDF plus source HTML and image assets.',
)
const afterSchoolCheckoutErrors = validateCheckoutReadiness(afterSchoolProduct, afterSchoolArtifactStatus)
expect(
  afterSchoolCheckoutErrors.length === 0,
  `After-School Story Club Starter Kit checkout readiness failed validation:\n${afterSchoolCheckoutErrors.join('\n')}`,
)
const afterSchoolArtifactManifest = readJson(resolve(root, afterSchoolSource.artifact.manifestPath))
expect(
  afterSchoolArtifactManifest.sourcePageCount === afterSchoolSource.sessions.length,
  'After-School Story Club Starter Kit artifact manifest sourcePageCount must match source sessions.',
)
expect(
  Array.isArray(afterSchoolArtifactManifest.files.assets),
  'After-School Story Club Starter Kit artifact manifest files.assets must be an array.',
)
expect(
  afterSchoolArtifactManifest.files.assets.length === afterSchoolSource.worldSlugs.length,
  'After-School Story Club Starter Kit artifact manifest must include one copied local image per source world.',
)
const afterSchoolManifestAssetErrors = validateManifestWorldAssets(
  afterSchoolSource,
  afterSchoolArtifactManifest,
)
expect(
  afterSchoolManifestAssetErrors.length === 0,
  `After-School Story Club Starter Kit artifact manifest image coverage failed validation:\n${afterSchoolManifestAssetErrors.join('\n')}`,
)
for (const asset of afterSchoolArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `After-School Story Club Starter Kit copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(museumDaySourceFile), `Missing Batch 19 Museum Day source file: ${museumDaySourceFile}`)
const museumDaySource = readJson(museumDaySourceFile)
expect(
  museumDaySource.batchId === museumDayBatchId,
  `Museum Day source batchId must be ${museumDayBatchId}.`,
)
const museumDayProduct = products.products.find((product) => product.slug === 'museum-day-story-notebook-kit')
expect(museumDayProduct, 'Missing Museum Day product record for Batch 19 artifact validation.')
const museumDaySourceErrors = validateMuseumDayStoryNotebookKitSource(
  museumDaySource,
  museumDayProduct,
  worldAgeBands,
)
expect(
  museumDaySourceErrors.length === 0,
  `Museum Day Story Notebook Kit source failed validation:\n${museumDaySourceErrors.join('\n')}`,
)
const museumDayExpectedPdfPages = museumDaySource.pages.length + 5
const museumDayArtifactStatus = inspectArtifactFiles(root, museumDaySource.artifact, {
  expectedPdfPages: museumDayExpectedPdfPages,
})
expect(
  museumDayArtifactStatus.valid,
  `Museum Day Story Notebook Kit artifacts failed validation:\n${museumDayArtifactStatus.errors.join('\n')}`,
)
expect(
  museumDayArtifactStatus.files.pdf.size > 100_000,
  `Museum Day Story Notebook Kit PDF artifact is unexpectedly small: ${museumDayArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  museumDayArtifactStatus.files.pdf.pageCount === museumDayExpectedPdfPages,
  `Museum Day Story Notebook Kit PDF artifact must have ${museumDayExpectedPdfPages} pages.`,
)
expect(
  museumDayArtifactStatus.files.zip.size > museumDayArtifactStatus.files.pdf.size,
  'Museum Day Story Notebook Kit ZIP artifact should include the PDF plus source HTML and image assets.',
)
const museumDayCheckoutErrors = validateCheckoutReadiness(museumDayProduct, museumDayArtifactStatus)
expect(
  museumDayCheckoutErrors.length === 0,
  `Museum Day Story Notebook Kit checkout readiness failed validation:\n${museumDayCheckoutErrors.join('\n')}`,
)
const museumDayArtifactManifest = readJson(resolve(root, museumDaySource.artifact.manifestPath))
expect(
  museumDayArtifactManifest.sourcePageCount === museumDaySource.pages.length,
  'Museum Day Story Notebook Kit artifact manifest sourcePageCount must match source pages.',
)
expect(
  Array.isArray(museumDayArtifactManifest.files.assets),
  'Museum Day Story Notebook Kit artifact manifest files.assets must be an array.',
)
expect(
  museumDayArtifactManifest.files.assets.length === museumDaySource.worldSlugs.length,
  'Museum Day Story Notebook Kit artifact manifest must include one copied local image per source world.',
)
const museumDayManifestAssetErrors = validateManifestWorldAssets(
  museumDaySource,
  museumDayArtifactManifest,
)
expect(
  museumDayManifestAssetErrors.length === 0,
  `Museum Day Story Notebook Kit artifact manifest image coverage failed validation:\n${museumDayManifestAssetErrors.join('\n')}`,
)
for (const asset of museumDayArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Museum Day Story Notebook Kit copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(familyGameNightSourceFile), `Missing Batch 20 Family Game Night source file: ${familyGameNightSourceFile}`)
const familyGameNightSource = readJson(familyGameNightSourceFile)
expect(
  familyGameNightSource.batchId === familyGameNightBatchId,
  `Family Game Night source batchId must be ${familyGameNightBatchId}.`,
)
const familyGameNightProduct = products.products.find((product) => product.slug === 'family-game-night-story-card-deck')
expect(familyGameNightProduct, 'Missing Family Game Night product record for Batch 20 artifact validation.')
const familyGameNightSourceErrors = validateFamilyGameNightStoryCardDeckSource(
  familyGameNightSource,
  familyGameNightProduct,
  worldAgeBands,
)
expect(
  familyGameNightSourceErrors.length === 0,
  `Family Game Night Story Card Deck source failed validation:\n${familyGameNightSourceErrors.join('\n')}`,
)
const familyGameNightExpectedPdfPages = familyGameNightSource.cards.length + 5
const familyGameNightArtifactStatus = inspectArtifactFiles(root, familyGameNightSource.artifact, {
  expectedPdfPages: familyGameNightExpectedPdfPages,
})
expect(
  familyGameNightArtifactStatus.valid,
  `Family Game Night Story Card Deck artifacts failed validation:\n${familyGameNightArtifactStatus.errors.join('\n')}`,
)
expect(
  familyGameNightArtifactStatus.files.pdf.size > 100_000,
  `Family Game Night Story Card Deck PDF artifact is unexpectedly small: ${familyGameNightArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  familyGameNightArtifactStatus.files.pdf.pageCount === familyGameNightExpectedPdfPages,
  `Family Game Night Story Card Deck PDF artifact must have ${familyGameNightExpectedPdfPages} pages.`,
)
expect(
  familyGameNightArtifactStatus.files.zip.size > familyGameNightArtifactStatus.files.pdf.size,
  'Family Game Night Story Card Deck ZIP artifact should include the PDF plus source HTML and image assets.',
)
const familyGameNightCheckoutErrors = validateCheckoutReadiness(familyGameNightProduct, familyGameNightArtifactStatus)
expect(
  familyGameNightCheckoutErrors.length === 0,
  `Family Game Night Story Card Deck checkout readiness failed validation:\n${familyGameNightCheckoutErrors.join('\n')}`,
)
const familyGameNightArtifactManifest = readJson(resolve(root, familyGameNightSource.artifact.manifestPath))
expect(
  familyGameNightArtifactManifest.sourcePageCount === familyGameNightSource.cards.length,
  'Family Game Night Story Card Deck artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(familyGameNightArtifactManifest.files.assets),
  'Family Game Night Story Card Deck artifact manifest files.assets must be an array.',
)
expect(
  familyGameNightArtifactManifest.files.assets.length === familyGameNightSource.worldSlugs.length,
  'Family Game Night Story Card Deck artifact manifest must include one copied local image per source world.',
)
const familyGameNightManifestAssetErrors = validateManifestWorldAssets(
  familyGameNightSource,
  familyGameNightArtifactManifest,
)
expect(
  familyGameNightManifestAssetErrors.length === 0,
  `Family Game Night Story Card Deck artifact manifest image coverage failed validation:\n${familyGameNightManifestAssetErrors.join('\n')}`,
)
for (const asset of familyGameNightArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Family Game Night Story Card Deck copied artifact image ${asset.path}`, 'jpeg')
}

console.log(
  `Content batch verified: ${worldCount} worlds, ${worldCount * 3} prompts, ${worldCount} image prompts, ${kitCount} kit outlines, ${collectionSlugs.size} SEO collections, ${miniUnitSlugs.size} mini-units, ${batch4ImageSlugs.size + batch7ProductImages.images.length + batch10ProductImages.images.length + batch11ProductImages.images.length + batch13ProductImages.images.length + batch14ProductImages.images.length + batch15ProductImages.images.length + batch16ProductImages.images.length + batch17ProductImages.images.length + batch18ProductImages.images.length + batch19ProductImages.images.length + batch20ProductImages.images.length} local world/product images, ${productSlugs.size} static product pages, 13 product artifacts.`,
)
