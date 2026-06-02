import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { containsActiveCheckoutLanguage } from './content-policy.mjs'

const root = resolve(import.meta.dirname, '..')
const worldsDir = resolve(root, 'content', 'worlds')
const kitsDir = resolve(root, 'content', 'printable-kits')
const seoCollectionsDir = resolve(root, 'content', 'seo-collections')
const seoCollectionsFile = resolve(seoCollectionsDir, 'batch2-collections.json')
const miniUnitsFile = resolve(root, 'content', 'mini-units', 'batch3-mini-units.json')
const batch4ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch4-world-images.json')
const productsFile = resolve(root, 'content', 'products', 'batch5-products.json')
const batchId = '2026-06-02-batch1'
const seoBatchId = '2026-06-02-batch2'
const miniUnitsBatchId = '2026-06-02-batch3'
const batch4ImagesBatchId = '2026-06-02-batch4'
const productsBatchId = '2026-06-02-batch5'
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
  expect(product.slug === 'rainy-day-story-quest-pack', `${label}.slug must be rainy-day-story-quest-pack.`)
  expect(product.title === 'Rainy Day Story Quest Pack', `${label}.title mismatch.`)
  expect(product.pricePoint === '$9', `${label}.pricePoint must be $9.`)
  expect(product.status === 'checkout_pending', `${label}.status must be checkout_pending.`)
  expect(!productSlugs.has(product.slug), `${label}.slug is duplicated across Batch 5 products.`)
  productSlugs.add(product.slug)
  expect(product.heroImage.startsWith('images/plotsprout/'), `${label}.heroImage must use a committed local image.`)
  expect(product.ctaHref.startsWith('mailto:'), `${label}.ctaHref must be mailto while checkout is pending.`)
  expect(/provider|checkout.*pending|checkout.*selected/i.test(product.checkoutNote), `${label}.checkoutNote must say checkout/provider is pending.`)
  expect(product.safetyNote.includes(safety), `${label}.safetyNote missing required safety sentence.`)
  validateMinList(product.worldSlugs, 3, `${label}.worldSlugs`)
  expect(product.worldSlugs.length <= 5, `${label}.worldSlugs must have no more than 5 entries.`)
  for (const worldSlug of product.worldSlugs) {
    expect(worldSlugs.has(worldSlug), `${label}.worldSlugs references unknown world slug ${worldSlug}.`)
  }
  validateMinList(product.includedPages, 6, `${label}.includedPages`)
  validateMinList(product.useCases, 3, `${label}.useCases`)
  validateMinList(product.parentSteps, 3, `${label}.parentSteps`)

  expect(!containsActiveCheckoutLanguage(product), `${label} includes active checkout or payment-provider language.`)
  expect(!/student accounts?|login|log in|public publishing|publish online|upload/i.test(JSON.stringify(product)), `${label} includes account, upload, or public publishing language.`)
  validateNoBannedTerms(product, label)

  const renderedPath = resolve(root, 'public', product.slug, 'index.html')
  expect(existsSync(renderedPath), `${label} static output is missing: ${renderedPath}`)
  const renderedHtml = readFileSync(renderedPath, 'utf8')
  expect(renderedHtml.includes(product.title), `${label} static output missing product title.`)
  expect(renderedHtml.includes(product.pricePoint), `${label} static output missing price.`)
  expect(renderedHtml.includes(product.checkoutNote), `${label} static output missing checkout note.`)
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
let worldCount = 0

for (const file of worldFiles) {
  const data = readJson(resolve(worldsDir, file))
  expect(data.batchId === batchId, `${file}.batchId must be ${batchId}.`)
  validateString(data.lane, `${file}.lane`)
  expect(Array.isArray(data.worlds), `${file}.worlds must be an array.`)
  expect(data.worlds.length === 10, `${file}.worlds must contain exactly 10 worlds.`)
  data.worlds.forEach((world) => {
    validateWorld(world, file, worldSlugs)
    worldSources.set(world.slug, `content/worlds/${file}`)
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

expect(existsSync(productsFile), `Missing Batch 5 products file: ${productsFile}`)
const products = readJson(productsFile)
expect(products.batchId === productsBatchId, `batch5-products.json.batchId must be ${productsBatchId}.`)
expect(products.generatedAt === '2026-06-02', 'batch5-products.json.generatedAt must be 2026-06-02.')
expect(Array.isArray(products.products), 'batch5-products.json.products must be an array.')
expect(products.products.length === 1, `Expected 1 Batch 5 product, found ${products.products.length}.`)
const productSlugs = new Set()
products.products.forEach((product) => validateProduct(product, productSlugs, worldSlugs))

console.log(
  `Content batch verified: ${worldCount} worlds, ${worldCount * 3} prompts, ${worldCount} image prompts, ${kitCount} kit outlines, ${collectionSlugs.size} SEO collections, ${miniUnitSlugs.size} mini-units, ${batch4ImageSlugs.size} local world images, ${productSlugs.size} static product page.`,
)
