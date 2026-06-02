import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const worldsDir = resolve(root, 'content', 'worlds')
const kitsDir = resolve(root, 'content', 'printable-kits')
const seoCollectionsDir = resolve(root, 'content', 'seo-collections')
const seoCollectionsFile = resolve(seoCollectionsDir, 'batch2-collections.json')
const miniUnitsFile = resolve(root, 'content', 'mini-units', 'batch3-mini-units.json')
const batchId = '2026-06-02-batch1'
const seoBatchId = '2026-06-02-batch2'
const miniUnitsBatchId = '2026-06-02-batch3'
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

for (const dir of [worldsDir, kitsDir]) {
  expect(existsSync(dir), `Missing content directory: ${dir}`)
}

const worldFiles = readdirSync(worldsDir).filter((file) => /^batch1-.+\.json$/.test(file)).sort()
const kitFiles = readdirSync(kitsDir).filter((file) => /^batch1-.+-kits\.json$/.test(file)).sort()
expect(worldFiles.length === 3, `Expected 3 Batch 1 world files, found ${worldFiles.length}.`)
expect(kitFiles.length === 3, `Expected 3 Batch 1 kit files, found ${kitFiles.length}.`)

const worldSlugs = new Set()
let worldCount = 0

for (const file of worldFiles) {
  const data = readJson(resolve(worldsDir, file))
  expect(data.batchId === batchId, `${file}.batchId must be ${batchId}.`)
  validateString(data.lane, `${file}.lane`)
  expect(Array.isArray(data.worlds), `${file}.worlds must be an array.`)
  expect(data.worlds.length === 10, `${file}.worlds must contain exactly 10 worlds.`)
  data.worlds.forEach((world) => validateWorld(world, file, worldSlugs))
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

console.log(
  `Content batch verified: ${worldCount} worlds, ${worldCount * 3} prompts, ${worldCount} image prompts, ${kitCount} kit outlines, ${collectionSlugs.size} SEO collections, ${miniUnitSlugs.size} mini-units.`,
)
