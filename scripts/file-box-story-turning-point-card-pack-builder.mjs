import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { writeStoredZip } from './product-artifact-policy.mjs'
import { buildProductArtifactManifest } from './rainy-day-pack-builder.mjs'
import { starterWorlds } from './starter-worlds.mjs'

export const fileBoxStoryTurningPointCardPackProductSlug =
  'file-box-story-turning-point-card-pack'

const root = resolve(import.meta.dirname, '..')
const sourcePath = resolve(root, 'content', 'product-artifacts', 'file-box-story-turning-point-card-pack.json')
const productsPath = resolve(root, 'content', 'products', 'batch5-products.json')
const worldsDir = resolve(root, 'content', 'worlds')
const buildDir = resolve(root, 'product-build', fileBoxStoryTurningPointCardPackProductSlug)

const requiredSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'

const sourceKeys = [
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
  'turningPointRoutines',
  'takeHomeTurningSlips',
  'optionalAdultPrompts',
  'cards',
]

const cardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'turningPointSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'startScenePrompt',
  'turnSignalPrompt',
  'beforePathPrompt',
  'afterPathPrompt',
  'characterReactionPrompt',
  'nextStepPrompt',
  'fileBoxLabelPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const sourceFiles = [
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-a.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-b.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-c.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-tools.json',
]

const expectedWorldSlugs = [
  'acorn-avenue-errand-office',
  'teacup-town-weather-window',
  'sticker-station-mail-cart',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'rain-boot-route-rangers',
  'tidepool-timekeepers-lab',
  'greenhouse-gear-garden',
  'solar-oven-picnic-station',
  'orchard-pulley-post',
  'revision-river-ferry',
  'clue-label-tower-museum',
  'chapter-gate-greenhouse',
  'margin-note-market',
  'binding-day-boardwalk',
  'index-card-theater-club',
]

const expectedWorldAges = new Map([
  ['acorn-avenue-errand-office', '7-9'],
  ['teacup-town-weather-window', '7-8'],
  ['sticker-station-mail-cart', '7-9'],
  ['spoon-ferry-lunchbox-harbor', '7-9'],
  ['pocket-park-notice-board', '7-9'],
  ['rain-boot-route-rangers', '7-9'],
  ['tidepool-timekeepers-lab', '8-10'],
  ['greenhouse-gear-garden', '8-10'],
  ['solar-oven-picnic-station', '8-10'],
  ['orchard-pulley-post', '8-10'],
  ['revision-river-ferry', '10-11'],
  ['clue-label-tower-museum', '10-11'],
  ['chapter-gate-greenhouse', '10-11'],
  ['margin-note-market', '10-11'],
  ['binding-day-boardwalk', '10-11'],
  ['index-card-theater-club', '10-11'],
])

const requiredArtifactPaths = {
  pdfPath:
    'product-build/file-box-story-turning-point-card-pack/File-Box-Story-Turning-Point-Card-Pack.pdf',
  zipPath:
    'product-build/file-box-story-turning-point-card-pack/file-box-story-turning-point-card-pack.zip',
  sourceHtmlPath:
    'product-build/file-box-story-turning-point-card-pack/source/file-box-story-turning-point-card-pack.html',
  manifestPath: 'product-build/file-box-story-turning-point-card-pack/manifest.json',
}

const priorSourceFiles = new Map([
  [54, 'content/product-artifacts/accordion-folder-story-arc-card-pack.json'],
  [55, 'content/product-artifacts/expanding-file-story-scene-chain-card-pack.json'],
  [56, 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json'],
  [57, 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json'],
  [58, 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json'],
])

function fileBoxStoryTurningPointBuildPaths(targetBuildDir = buildDir) {
  const sourceDir = resolve(targetBuildDir, 'source')
  return {
    buildDir: targetBuildDir,
    sourceDir,
    assetsDir: resolve(sourceDir, 'assets'),
    pdfPath: resolve(targetBuildDir, 'File-Box-Story-Turning-Point-Card-Pack.pdf'),
    zipPath: resolve(targetBuildDir, 'file-box-story-turning-point-card-pack.zip'),
    htmlPath: resolve(sourceDir, 'file-box-story-turning-point-card-pack.html'),
    manifestPath: resolve(targetBuildDir, 'manifest.json'),
    readmePath: resolve(targetBuildDir, 'README.txt'),
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function pushIf(errors, condition, message) {
  if (condition) errors.push(message)
}

function validateString(value, label, errors) {
  pushIf(errors, !isNonEmptyString(value), `${label} must be a non-empty string.`)
}

function validateExactStringArray(value, expectedLength, label, errors) {
  pushIf(errors, !Array.isArray(value), `${label} must be an array.`)
  if (!Array.isArray(value)) return
  pushIf(errors, value.length !== expectedLength, `${label} must have exactly ${expectedLength} entries.`)
  value.forEach((item, index) => validateString(item, `${label}[${index}]`, errors))
}

function sameStringSet(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right)) return false
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return (
    left.length === leftSet.size &&
    right.length === rightSet.size &&
    leftSet.size === rightSet.size &&
    [...leftSet].every((item) => rightSet.has(item))
  )
}

function hasWritableBlank(value) {
  return /_{4,}/.test(String(value))
}

function hasSnakeCasePlaceholder(value) {
  return /\b[a-z]+_[a-z0-9_]+\b/.test(String(value))
}

function normalizeAllowedText(value) {
  return JSON.stringify(value)
    .replace(
      /\bNo scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts\./gi,
      '',
    )
    .replace(/\bdo not ask for real schedules, rooms, names, or personal facts\b/gi, '')
    .replace(/\bno real school\/home identity details\b/gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bhomeschool\b/gi, '')
    .replace(/\btutors?\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bfile[- ]box story turning[- ]point card pack\b/gi, '')
    .replace(/\bfile[- ]box story turning[- ]point card(s)?\b/gi, '')
    .replace(/\bfile[- ]box turning[- ]point card(s)?\b/gi, '')
    .replace(/\bturning[- ]point card(s)?\b/gi, '')
    .replace(/\bturning[- ]point(s)?\b/gi, '')
    .replace(/\bturning point(s)?\b/gi, '')
    .replace(/\bfile[- ]box(es)?\b/gi, '')
    .replace(/\bstarting scene(s)?\b/gi, '')
    .replace(/\bturn signal(s)?\b/gi, '')
    .replace(/\bbefore path(s)?\b/gi, '')
    .replace(/\bafter path(s)?\b/gi, '')
    .replace(/\bcharacter reaction(s)?\b/gi, '')
    .replace(/\bnext step(s)?\b/gi, '')
    .replace(/\bfile[- ]box label(s)?\b/gi, '')
    .replace(/\bscene(s)?\b/gi, '')
    .replace(/\bsignal(s)?\b/gi, '')
    .replace(/\bpath(s)?\b/gi, '')
    .replace(/\breaction(s)?\b/gi, '')
    .replace(/\bstep(s)?\b/gi, '')
    .replace(/\blabel(s)?\b/gi, '')
    .replace(/\bpage(s)?\b/gi, '')
    .replace(/\bpaper\b/gi, '')
    .replace(/\bblank(s)?\b/gi, '')
    .replace(/\bnote(s)?\b/gi, '')
    .replace(/\bcard(s)?\b/gi, '')
    .replace(/\bwriter(s)?\b/gi, '')
    .replace(/\bwriting\b/gi, '')
    .replace(/\bchild\b/gi, '')
    .replace(/\bkid\b/gi, '')
    .replace(/\bcharacter(s)?\b/gi, '')
}

function validateNoUnsafeLanguage(value, label, errors) {
  const allowedText = normalizeAllowedText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic\b|\bpublish(es|ed|ing|able)?\b|\bpublication(s)?\b|\breviews?\b|\bratings?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\brecording(s)?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\bstudent names?\b|\bteacher names?\b|\breal teacher\b|\bwrite (the )?real name(s)?\b|\breal identity\b|\bidentity details?\b|\bschool names?\b|\bclassroom(s)?\b|\baddress(es)?\b|\bstreets?\b|\bprivate locations?\b|\bexact locations?\b|\blocation details?\b|\bschool route(s)?\b|\breal route(s)?\b|\broute details?\b|\bgps\b|\bcoordinates?\b|\bexact schedules?\b|\bschedules?\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bpersonal disclosure(s)?\b|\bprivate child profile(s)?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bassessment(s)?\b|\bperfect\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bspell(ing|s|ed)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bpayments?\b|\bcheckout(s)?\b|\bprovider(s)?\b|\bstripe\b|\bchapter book(s)?\b|\bepisode(s)?\b|\bscreenplay(s)?\b|\bchoose your own adventure\b|\bcliffhanger(s)?\b|\bplot twist(es)?\b|\bfood(s)?\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b|\bprofessional advice\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bprayer(s)?\b|\bbet(s|ting)?\b|\bgambling\b|\bcasino(s)?\b|\bpokemon\b|\bpokémon\b|\bbranded character(s)?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public, address, addresses, food, foods, publishing, publishable, showcase, portfolio, display, perfect, rubric, assessment, spelling, episode, chapter book, screenplay, choose your own adventure, cliffhanger, plot twist, recording, voice memo, timer, score, private child profile, election, prayer, bet, Pokemon, school name, home address, teacher name, camera, photo, audio, video, allergy, medical, diary, student profile, personal disclosure, provider, payment, checkout, Stripe, real-identity, route, GPS, schedule, location, profile, politics, religion, gambling, branded character, scary, harm, bullying, fighting, or weapon language.`,
  )
}

function validateArtifactPaths(source, errors) {
  pushIf(errors, !isObject(source.artifact), 'artifact must be an object.')
  if (!isObject(source.artifact)) return
  for (const [key, expectedPath] of Object.entries(requiredArtifactPaths)) {
    pushIf(
      errors,
      source.artifact[key] !== expectedPath,
      `File Box Story Turning Point Card Pack artifact.${key} must be ${expectedPath}.`,
    )
  }
}

function readPriorWorldSet(batchNumber) {
  const sourceFile = priorSourceFiles.get(batchNumber)
  const source = readJson(resolve(root, sourceFile))
  return new Set(source.worldSlugs)
}

function knownWorldRecordFor(knownWorldRecords, slug) {
  const record = knownWorldRecords?.get(slug)
  return typeof record === 'string' ? { ageBand: record } : record
}

function validateTurningPointCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(cardKeys),
    `${label} must use the exact file box turning-point card field order.`,
  )

  for (const key of cardKeys) validateString(card[key], `${label}.${key}`, errors)

  const expectedWorldSlug = expectedWorldSlugs[index]
  const expectedId = `file-box-turning-point-card-${String(index + 1).padStart(2, '0')}`
  const expectedAgeBand = expectedWorldAges.get(expectedWorldSlug)
  pushIf(errors, card.id !== expectedId, `${label}.id must be ${expectedId}.`)
  pushIf(errors, card.worldSlug !== expectedWorldSlug, `${label}.worldSlug must be ${expectedWorldSlug}.`)
  pushIf(errors, card.ageBand !== expectedAgeBand, `${label}.ageBand must be ${expectedAgeBand}.`)
  pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
  cardIds.add(card.id)

  pushIf(errors, !['7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(
    errors,
    isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug),
    `${label}.worldSlug references an unknown world.`,
  )
  pushIf(
    errors,
    isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug),
    `${label}.worldSlug must be listed in worldSlugs.`,
  )
  const worldRecord = knownWorldRecordFor(knownWorldRecords, card.worldSlug)
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldRecord?.ageBand) && card.ageBand !== worldRecord.ageBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldRecord.ageBand}.`,
  )
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) &&
      !(/file[- ]box/i.test(card.useCase) && /turning[- ]point/i.test(card.useCase) && /\bcard\b/i.test(card.useCase)),
    `${label}.useCase must say file box turning-point card.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'startScenePrompt',
    'turnSignalPrompt',
    'beforePathPrompt',
    'afterPathPrompt',
    'characterReactionPrompt',
    'nextStepPrompt',
    'fileBoxLabelPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeLanguage(card, label, errors)
}

function validateTurningPointRoutine(routine, index, errors) {
  const label = `turningPointRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  pushIf(
    errors,
    JSON.stringify(Object.keys(routine)) !== JSON.stringify(['title', 'time', 'materials', 'steps', 'adultWrapLine']),
    `${label} must use the exact turning-point routine field order.`,
  )
  for (const key of ['title', 'time', 'materials', 'adultWrapLine']) validateString(routine[key], `${label}.${key}`, errors)
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  if (Array.isArray(routine.steps)) {
    routine.steps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.steps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.steps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  pushIf(errors, isNonEmptyString(routine.adultWrapLine) && !hasWritableBlank(routine.adultWrapLine), `${label}.adultWrapLine must include a writable blank.`)
  validateNoUnsafeLanguage(routine, label, errors)
}

export function validateFileBoxStoryTurningPointCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'File Box Story Turning Point Card Pack source must be an object.')
  if (!isObject(source)) return errors

  const knownWorldRecords = knownWorldSlugs instanceof Map ? knownWorldSlugs : null
  const worldSlugs =
    knownWorldSlugs instanceof Map
      ? new Set(knownWorldSlugs.keys())
      : knownWorldSlugs instanceof Set
      ? knownWorldSlugs
      : new Set(knownWorldSlugs ?? [])

  pushIf(
    errors,
    JSON.stringify(Object.keys(source)) !== JSON.stringify(sourceKeys),
    'source must use the exact Batch 59 file box turning-point source field order.',
  )

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-04-batch59', 'batchId must be 2026-06-04-batch59.')
  pushIf(errors, source.generatedAt !== '2026-06-04', 'generatedAt must be 2026-06-04.')
  pushIf(errors, source.productSlug !== fileBoxStoryTurningPointCardPackProductSlug, `productSlug must be ${fileBoxStoryTurningPointCardPackProductSlug}.`)
  pushIf(errors, source.title !== 'File Box Story Turning Point Card Pack', 'title must be File Box Story Turning Point Card Pack.')
  pushIf(errors, source.pricePoint !== '$91', 'pricePoint must be $91.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include required Batch 59 safety sentence.')

  if (product) {
    pushIf(errors, product.slug !== source.productSlug, 'product.slug must match productSlug.')
    pushIf(errors, product.title !== source.title, 'product.title must match title.')
    pushIf(errors, product.pricePoint !== source.pricePoint, 'product.pricePoint must match pricePoint.')
    pushIf(errors, product.status !== 'checkout_pending', 'product.status must remain checkout_pending.')
    pushIf(errors, Array.isArray(product.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
  }

  pushIf(errors, !Array.isArray(source.sourceFiles), 'sourceFiles must be an array.')
  if (Array.isArray(source.sourceFiles)) {
    pushIf(
      errors,
      JSON.stringify(source.sourceFiles) !== JSON.stringify(sourceFiles),
      'sourceFiles must list the exact Batch 59 file-box turning-point card lane and tools files.',
    )
  }

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set()
  if (Array.isArray(source.worldSlugs)) {
    pushIf(
      errors,
      JSON.stringify(source.worldSlugs) !== JSON.stringify(expectedWorldSlugs),
      'worldSlugs must use the exact Batch 59 file box turning-point world order.',
    )
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, sourceWorldSlugs.has(slug), `worldSlugs includes duplicate slug ${slug}.`)
      sourceWorldSlugs.add(slug)
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
    for (const [batchNumber, expectedCount] of [
      [54, 8],
      [55, 7],
      [56, 7],
      [57, 7],
      [58, 7],
    ]) {
      const overlapSet = readPriorWorldSet(batchNumber)
      const overlap = source.worldSlugs.filter((slug) => overlapSet.has(slug))
      pushIf(
        errors,
        overlap.length !== expectedCount,
        `worldSlugs must overlap exactly ${expectedCount} Batch ${batchNumber} worlds; overlapping slugs: ${overlap.join(', ')}.`,
      )
    }
  }

  validateArtifactPaths(source, errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) validateString(source.cover[key], `cover.${key}`, errors)
    validateExactStringArray(source.cover.included, 11, 'cover.included', errors)
    validateNoUnsafeLanguage(source.cover, 'cover', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    pushIf(
      errors,
      JSON.stringify(Object.keys(source.adultGuide)) !== JSON.stringify(['title', 'bullets']),
      'adultGuide must use the exact field order.',
    )
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    if (Array.isArray(source.adultGuide.bullets)) {
      source.adultGuide.bullets.forEach((bullet, index) => {
        pushIf(errors, isNonEmptyString(bullet) && !hasWritableBlank(bullet), `adultGuide.bullets[${index}] must include a writable blank.`)
        pushIf(errors, isNonEmptyString(bullet) && hasSnakeCasePlaceholder(bullet), `adultGuide.bullets[${index}] must use human-readable text, not snake_case placeholders.`)
      })
    }
    validateNoUnsafeLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.turningPointRoutines), 'turningPointRoutines must be an array.')
  if (Array.isArray(source.turningPointRoutines)) {
    pushIf(errors, source.turningPointRoutines.length !== 6, 'turningPointRoutines must have exactly 6 entries.')
    source.turningPointRoutines.forEach((routine, index) => validateTurningPointRoutine(routine, index, errors))
  }

  validateExactStringArray(source.takeHomeTurningSlips, 10, 'takeHomeTurningSlips', errors)
  if (Array.isArray(source.takeHomeTurningSlips)) {
    source.takeHomeTurningSlips.forEach((slip, index) => {
      pushIf(errors, isNonEmptyString(slip) && !hasWritableBlank(slip), `takeHomeTurningSlips[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(slip) && hasSnakeCasePlaceholder(slip), `takeHomeTurningSlips[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeLanguage(slip, `takeHomeTurningSlips[${index}]`, errors)
    })
  }

  validateExactStringArray(source.optionalAdultPrompts, 8, 'optionalAdultPrompts', errors)
  if (Array.isArray(source.optionalAdultPrompts)) {
    source.optionalAdultPrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalAdultPrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalAdultPrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeLanguage(prompt, `optionalAdultPrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateTurningPointCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size !== 16, 'cards must cover exactly 16 unique worlds.')
  }

  validateNoUnsafeLanguage(source, 'File Box Story Turning Point Card Pack source', errors)
  return errors
}

export function validateFileBoxStoryTurningPointCardPackSourceFiles(source, rootDir = root) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three turning-point-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify(source.sourceFiles) !== JSON.stringify(sourceFiles),
    'sourceFiles must list the exact Batch 59 file-box turning-point card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = readJson(resolve(rootDir, sourceFile))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      if (Array.isArray(lane.cards)) {
        pushIf(
          errors,
          JSON.stringify(Object.keys(lane)) !== JSON.stringify(['laneId', 'cards']),
          `${sourceFile} must use the exact Batch 59 card lane field order.`,
        )
        pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(errors, lane.cards.length !== expectedRange.count, `${sourceFile} must contain exactly ${expectedRange.count} cards.`)
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count || wrongLaneCard,
            `${sourceFile} ${sourceFile.match(/cards-[abc]/)?.[0] ?? 'card lane'} must include card numbers ${expectedRange.label}.`,
          )
          pushIf(errors, wrongLaneCard, `${sourceFile} must include card numbers ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        pushIf(
          errors,
          JSON.stringify(Object.keys(lane)) !==
            JSON.stringify(['adultGuide', 'turningPointRoutines', 'takeHomeTurningSlips', 'optionalAdultPrompts']),
          `${sourceFile} must use the exact Batch 59 tools field order.`,
        )
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 59 turning-point-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three turning-point-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles turning-point-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'turningPointRoutines', 'takeHomeTurningSlips', 'optionalAdultPrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n')
}

function renderGuideCard(title, items) {
  return `<article class="guide-card"><h3>${escapeHtml(title)}</h3><ul>${renderList(items)}</ul></article>`
}

function renderWorldCard(world, imagePath) {
  const image = imagePath
    ? `<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">`
    : '<div class="image-placeholder" aria-hidden="true"></div>'
  return `
    <article class="world-card">
      ${image}
      <p class="card-kicker">Ages ${escapeHtml(world.ageBand)}</p>
      <h3>${escapeHtml(world.title)}</h3>
    </article>`
}

function renderRoutine(routine) {
  return `
    <article class="small-card">
      <p class="card-kicker">${escapeHtml(routine.time)}</p>
      <h3>${escapeHtml(routine.title)}</h3>
      <p>${escapeHtml(routine.materials)}</p>
      <ol>${renderList(routine.steps)}</ol>
      <p>${escapeHtml(routine.adultWrapLine)}</p>
    </article>`
}

function renderSlip(slip, index) {
  return `
    <article class="card-slip">
      <p class="card-kicker">Take-home turning slip</p>
      <h3>Turning slip ${index + 1}</h3>
      <p>${escapeHtml(slip)}</p>
    </article>`
}

function renderField(label, value) {
  return `
    <section class="field-block">
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(value)}</p>
    </section>`
}

function renderCard(card, index, worlds, imageMap) {
  const world = worlds.get(card.worldSlug)
  if (!world) throw new Error(`Unknown File Box Story Turning Point Card world slug: ${card.worldSlug}`)
  const imagePath = imageMap.get(card.worldSlug)
  if (!imagePath) throw new Error(`Missing File Box Story Turning Point Card copied image for ${card.worldSlug}`)
  const fields = [
    renderField('Starting scene', card.startScenePrompt),
    renderField('Turn signal', card.turnSignalPrompt),
    renderField('Before path', card.beforePathPrompt),
    renderField('After path', card.afterPathPrompt),
    renderField('Character reaction', card.characterReactionPrompt),
    renderField('Next step', card.nextStepPrompt),
    renderField('File-box label', card.fileBoxLabelPrompt),
  ].join('\n')

  return `
    <section class="pack-page turning-card-page">
      <div class="page-kicker">Turning Card ${index + 1} | Ages ${escapeHtml(card.ageBand)} | ${escapeHtml(card.turningPointSkill)}</div>
      <h2>${escapeHtml(card.title)}</h2>
      <figure>
        <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(world.title)} illustration">
        <figcaption>${escapeHtml(world.title)}</figcaption>
      </figure>
      <p class="adult-note"><strong>Adult setup:</strong> ${escapeHtml(card.adultSetup)}</p>
      <p class="kid-direction">${escapeHtml(card.kidDirection)}</p>
      <div class="field-grid">${fields}</div>
      <p class="take-home-line">${escapeHtml(card.quietOptionLine)} ${escapeHtml(card.takeHomeLine)}</p>
    </section>`
}

export function renderFileBoxStoryTurningPointCardPackHtml(source, worlds, imageMap = new Map()) {
  const worldCards = source.worldSlugs
    .map((slug) => {
      const world = worlds.get(slug)
      if (!world) throw new Error(`Unknown File Box Story Turning Point Card source world slug: ${slug}`)
      return renderWorldCard(world, imageMap.get(slug))
    })
    .join('\n')
  const cards = source.cards
    .map((card, index) => renderCard(card, index, worlds, imageMap))
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(source.title)}</title>
    <style>
      @page { size: Letter; margin: 0.34in; }
      :root {
        --ink: #263238;
        --muted: #5a6266;
        --paper: #fffdf8;
        --line: #d7cdbc;
        --green: #356f62;
        --red: #a54e48;
        --gold: #d1a64d;
        --blue: #416f92;
        color: var(--ink);
        font-family: Avenir Next, Avenir, Trebuchet MS, Verdana, sans-serif;
        font-size: 8px;
        line-height: 1.08;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2 { font-family: Georgia, Times New Roman, serif; line-height: 1.02; }
      h1 { max-width: 12ch; font-size: 30px; }
      h2 { margin-bottom: 0.05in; font-size: 17px; }
      h3 { margin-bottom: 0.025in; font-size: 8.45px; }
      p, li { color: var(--muted); }
      img { display: block; max-width: 100%; border: 1px solid var(--line); }
      .pack-page {
        height: 9.24in;
        padding: 0.11in;
        overflow: hidden;
        page-break-after: always;
        background:
          linear-gradient(90deg, rgba(53, 111, 98, 0.08) 1px, transparent 1px),
          linear-gradient(180deg, rgba(165, 78, 72, 0.07) 1px, transparent 1px),
          var(--paper);
        background-size: 0.25in 0.25in;
        border: 2px solid var(--ink);
      }
      .cover-page { display: grid; grid-template-columns: 1fr 2.05in; gap: 0.2in; border-top: 0.16in solid var(--red); }
      .guide-page { border-top: 0.16in solid var(--green); font-size: 6.7px; }
      .world-page { border-top: 0.16in solid var(--gold); font-size: 6.82px; }
      .routine-page { border-top: 0.16in solid var(--blue); font-size: 6.65px; }
      .slip-page { border-top: 0.16in solid var(--red); font-size: 6.88px; }
      .turning-card-page { font-size: 7.3px; }
      .page-kicker, .card-kicker, .kicker {
        color: var(--green);
        font-size: 6.55px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .badge {
        display: inline-grid;
        min-width: 0.82in;
        min-height: 0.5in;
        place-items: center;
        border: 2px solid var(--ink);
        background: white;
        font-weight: 900;
      }
      ul, ol { margin: 0; padding-left: 0.14in; }
      .cover-meta, .guide-grid, .world-grid, .routine-grid, .slip-grid { display: grid; gap: 0.045in; }
      .guide-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.032in; }
      .world-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.034in; }
      .routine-grid, .slip-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.04in; }
      .guide-card, .small-card, .world-card, .card-slip, .field-block {
        padding: 0.04in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid var(--line);
      }
      .world-card img { width: 100%; aspect-ratio: 2.15 / 1; object-fit: cover; margin-bottom: 0.022in; }
      .world-card h3 { font-size: 7.1px; }
      .small-card p, .small-card li, .card-slip p { margin-bottom: 0.02in; }
      .turning-card-page figure { float: right; width: 1.34in; margin: 0 0 0.05in 0.09in; }
      .turning-card-page figure img { width: 100%; aspect-ratio: 1.28 / 1; object-fit: cover; }
      figcaption { color: var(--green); font-size: 6.55px; font-weight: 900; }
      .adult-note, .kid-direction {
        margin-bottom: 0.04in;
        padding: 0.04in;
        background: white;
        border-left: 0.055in solid var(--gold);
      }
      .kid-direction { border-left-color: var(--green); }
      .field-grid {
        clear: both;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.032in;
      }
      .field-block p {
        min-height: 0.245in;
        margin-bottom: 0;
        padding-bottom: 0.018in;
        border-bottom: 1px solid rgba(53, 111, 98, 0.18);
      }
      .take-home-line {
        margin-top: 0.047in;
        padding: 0.045in;
        background: rgba(255, 255, 255, 0.86);
        border: 1px dashed var(--red);
        color: var(--ink);
        font-weight: 700;
      }
      .footer-note { margin-top: 0.05in; font-size: 7px; }
    </style>
  </head>
  <body>
    <section class="pack-page cover-page">
      <div>
        <p class="kicker">${escapeHtml(source.cover.kicker)}</p>
        <h1>${escapeHtml(source.cover.headline)}</h1>
        <p>${escapeHtml(source.cover.subhead)}</p>
        <p><strong>Audience:</strong> ${escapeHtml(source.audience)}</p>
        <p><strong>Format:</strong> ${escapeHtml(source.sessionLength)}</p>
        <p>Family-safe printable writing pages for adult-led, offline turning point practice.</p>
      </div>
      <div class="cover-meta">
        <span class="badge">${escapeHtml(source.pricePoint)}</span>
        <h2>Included</h2>
        <ul>${renderList(source.cover.included)}</ul>
      </div>
    </section>
    <section class="pack-page guide-page">
      <p class="page-kicker">Adult guide</p>
      <h2>Turning point coaching</h2>
      <div class="guide-grid">
        ${renderGuideCard(source.adultGuide.title, source.adultGuide.bullets)}
      </div>
      <p class="footer-note">Use one file box card at a time. Keep every change broad, invented, paper-only, and guided by an adult.</p>
    </section>
    <section class="pack-page world-page">
      <p class="page-kicker">World menu</p>
      <h2>Sixteen turning card worlds</h2>
      <p>Pick a world image, then connect what came before, what changed, and what follows next.</p>
      <div class="world-grid">${worldCards}</div>
    </section>
    <section class="pack-page routine-page">
      <p class="page-kicker">Turning routines</p>
      <h2>Choose the file box routine</h2>
      <div class="routine-grid">${source.turningPointRoutines.map(renderRoutine).join('\n')}</div>
    </section>
    <section class="pack-page slip-page">
      <p class="page-kicker">Take-home turning slips</p>
      <h2>Try one turn later</h2>
      <div class="slip-grid">${source.takeHomeTurningSlips.map(renderSlip).join('\n')}</div>
      <h3>Optional adult prompts</h3>
      <ul>${renderList(source.optionalAdultPrompts)}</ul>
    </section>
${cards}
  </body>
</html>
`
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function fileRecord(path, recordRoot) {
  return {
    path: relative(recordRoot, path),
    sha256: sha256File(path),
    size: readFileSync(path).length,
  }
}

const stablePdfDate = "D:20260604000000+00'00'"

function normalizePdfDateMetadata(pdfPath) {
  const original = readFileSync(pdfPath, 'latin1')
  const normalized = original.replaceAll(
    /\/(CreationDate|ModDate)\s*\(([^)]*)\)/g,
    (_match, label, value) => {
      if (value.length !== stablePdfDate.length) {
        throw new Error(`Cannot normalize PDF ${label}; unexpected date metadata length ${value.length}.`)
      }
      return `/${label} (${stablePdfDate})`
    },
  )
  if (normalized !== original) writeFileSync(pdfPath, Buffer.from(normalized, 'latin1'))
}

function loadWorlds() {
  const worlds = new Map()
  for (const world of starterWorlds) worlds.set(world.slug, world)
  for (const file of readdirSync(worldsDir).filter((item) => /^batch1-.+\.json$/.test(item))) {
    const data = readJson(resolve(worldsDir, file))
    for (const world of data.worlds) worlds.set(world.slug, world)
  }
  return worlds
}

function productImagePath(slug) {
  for (const relativeDir of [
    ['public', 'images', 'plotsprout', 'batch4'],
    ['public', 'images', 'plotsprout', 'batch50-worlds'],
    ['public', 'images', 'plotsprout', 'batch51-worlds'],
    ['public', 'images', 'plotsprout', 'batch52-worlds'],
    ['public', 'images', 'plotsprout', 'batch53-worlds'],
    ['public', 'images', 'plotsprout', 'batch7'],
    ['public', 'images', 'plotsprout'],
  ]) {
    const imagePath = resolve(root, ...relativeDir, `${slug}.jpg`)
    if (existsSync(imagePath)) return imagePath
  }
  return null
}

function assembleSourceFromLanes() {
  const lanes = sourceFiles.map((file) => readJson(resolve(root, file)))
  const cardLanes = lanes.filter((lane) => Array.isArray(lane.cards))
  const tools = lanes.find((lane) => isObject(lane.adultGuide))
  const cards = cardLanes.flatMap((lane) => lane.cards).sort((left, right) => String(left.id).localeCompare(String(right.id)))
  return {
    batchId: '2026-06-04-batch59',
    generatedAt: '2026-06-04',
    productSlug: fileBoxStoryTurningPointCardPackProductSlug,
    title: 'File Box Story Turning Point Card Pack',
    pricePoint: '$91',
    audience: 'Families, homeschool groups, tutors, and adult-led writing tables for writers ages 7-11.',
    sessionLength:
      '16 printable file box story turning-point cards plus adult guide tools, turning-point routines, take-home turning slips, and optional adult prompts',
    safetyNote: requiredSafety,
    artifact: { ...requiredArtifactPaths },
    sourceFiles: [...sourceFiles],
    worldSlugs: [...expectedWorldSlugs],
    cover: {
      kicker: 'Printable file box turning point cards',
      headline: 'File Box Story Turning Point Card Pack',
      subhead:
        'Sixteen file-box cards help writers connect a starting scene, a turn signal, a before path, an after path, a character reaction, and a next step.',
      included: [
        '16 printable file box turning point cards',
        'Adult setup guide',
        'Fictional turning-point safety notes',
        'Starting scene prompts',
        'Turn signal prompts',
        'Before and after path prompts',
        'Character reaction prompts',
        'Next step prompts',
        'Six adult-led turning-point routines',
        'Ten take-home turning slips',
        'Printable PDF and ZIP artifact',
      ],
    },
    adultGuide: tools?.adultGuide,
    turningPointRoutines: tools?.turningPointRoutines,
    takeHomeTurningSlips: tools?.takeHomeTurningSlips,
    optionalAdultPrompts: tools?.optionalAdultPrompts,
    cards,
  }
}

export function loadFileBoxStoryTurningPointCardPackBuildInputs() {
  const source = existsSync(sourcePath) ? readJson(sourcePath) : assembleSourceFromLanes()
  const products = existsSync(productsPath) ? readJson(productsPath).products : []
  const product = products.find((candidate) => candidate.slug === source.productSlug) ?? {
    slug: source.productSlug,
    title: source.title,
    pricePoint: source.pricePoint,
    status: 'checkout_pending',
    worldSlugs: source.worldSlugs,
  }
  const worlds = loadWorlds()
  const imageMap = new Map()
  for (const slug of new Set(source.worldSlugs)) {
    if (!worlds.has(slug)) throw new Error(`Missing world record for ${slug}`)
    if (!productImagePath(slug)) throw new Error(`Missing local image for ${slug}`)
    imageMap.set(slug, `assets/${slug}.jpg`)
  }
  for (const card of source.cards) {
    if (!worlds.has(card.worldSlug)) throw new Error(`Missing card world record for ${card.worldSlug}`)
    if (!imageMap.has(card.worldSlug)) throw new Error(`Missing local copied image for card world ${card.worldSlug}`)
  }
  return { source, product, worlds, imageMap }
}

function prepareBuildDirectory(paths = fileBoxStoryTurningPointBuildPaths()) {
  rmSync(paths.buildDir, { recursive: true, force: true })
  mkdirSync(paths.assetsDir, { recursive: true })
}

function sourceImageForSlug(slug, { imageRoot, imageSources } = {}) {
  if (imageSources) return imageSources.get(slug)
  if (imageRoot) {
    const imagePath = resolve(imageRoot, `${slug}.jpg`)
    return existsSync(imagePath) ? imagePath : null
  }
  return productImagePath(slug)
}

function copyPackAssets(source, paths = fileBoxStoryTurningPointBuildPaths(), options = {}) {
  const imageMap = new Map()
  for (const slug of new Set(source.worldSlugs)) {
    const sourceImage = sourceImageForSlug(slug, options)
    if (!sourceImage) throw new Error(`Missing File Box Story Turning Point Card Pack source image for ${slug}`)
    const targetName = `${slug}.jpg`
    const targetPath = resolve(paths.assetsDir, targetName)
    copyFileSync(sourceImage, targetPath)
    imageMap.set(slug, `assets/${targetName}`)
  }
  return imageMap
}

function writeReadme(source, paths = fileBoxStoryTurningPointBuildPaths()) {
  const text = [
    source.title,
    '',
    `Price point: ${source.pricePoint}`,
    `Audience: ${source.audience}`,
    `Format: ${source.sessionLength}`,
    '',
    'Files:',
    '- File-Box-Story-Turning-Point-Card-Pack.pdf',
    '- source/file-box-story-turning-point-card-pack.html',
    '- source/assets/*.jpg',
    '',
    'Fulfillment note:',
    'Hold the ZIP for Sam until the sales path is chosen.',
    'Do not add a download URL to the site.',
    '',
  ].join('\n')
  writeFileSync(paths.readmePath, text)
}

function zipEntries(paths = fileBoxStoryTurningPointBuildPaths()) {
  const entries = [
    {
      name: 'File-Box-Story-Turning-Point-Card-Pack.pdf',
      data: readFileSync(paths.pdfPath),
    },
    {
      name: 'README.txt',
      data: readFileSync(paths.readmePath),
    },
    {
      name: 'source/file-box-story-turning-point-card-pack.html',
      data: readFileSync(paths.htmlPath),
    },
  ]
  for (const file of readdirSync(paths.assetsDir).sort()) {
    entries.push({
      name: `source/assets/${file}`,
      data: readFileSync(resolve(paths.assetsDir, file)),
    })
  }
  return entries
}

async function writePdfWithPlaywright({ htmlPath, pdfPath }) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } })
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' })
    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.25in',
        right: '0.25in',
        bottom: '0.25in',
        left: '0.25in',
      },
    })
    normalizePdfDateMetadata(pdfPath)
  } finally {
    await browser.close()
  }
}

async function writePdf({ htmlPath, pdfPath, pdfRenderer }) {
  if (!pdfRenderer) {
    await writePdfWithPlaywright({ htmlPath, pdfPath })
    return
  }
  const rendered = await pdfRenderer({ htmlPath, pdfPath })
  if (Buffer.isBuffer(rendered) || rendered instanceof Uint8Array) {
    writeFileSync(pdfPath, rendered)
    return
  }
  if (!existsSync(pdfPath)) {
    throw new Error('Custom PDF renderer must return PDF bytes or write the PDF file.')
  }
}

export async function buildFileBoxStoryTurningPointCardPack(options = {}) {
  const { source, product, worlds } = options.source
    ? options
    : loadFileBoxStoryTurningPointCardPackBuildInputs()
  const paths = fileBoxStoryTurningPointBuildPaths(options.outputDir ?? options.buildDir ?? buildDir)
  const recordRoot = options.recordRoot ?? root

  prepareBuildDirectory(paths)
  const imageMap = copyPackAssets(source, paths, {
    imageRoot: options.imageRoot,
    imageSources: options.imageSources,
  })
  const html = renderFileBoxStoryTurningPointCardPackHtml(source, worlds, imageMap)
  mkdirSync(dirname(paths.htmlPath), { recursive: true })
  writeFileSync(paths.htmlPath, html)
  writeReadme(source, paths)

  await writePdf({
    htmlPath: paths.htmlPath,
    pdfPath: paths.pdfPath,
    pdfRenderer: options.pdfRenderer ?? options.writePdf,
  })

  writeStoredZip(paths.zipPath, zipEntries(paths))
  const manifest = buildProductArtifactManifest(
    source,
    {
      pdf: fileRecord(paths.pdfPath, recordRoot),
      zip: fileRecord(paths.zipPath, recordRoot),
      sourceHtml: fileRecord(paths.htmlPath, recordRoot),
      readme: fileRecord(paths.readmePath, recordRoot),
      assets: source.worldSlugs.map((slug) => fileRecord(resolve(paths.assetsDir, `${slug}.jpg`), recordRoot)),
    },
    {
      fulfillmentNote:
        'Static artifact bundle: PDF plus source HTML and local image assets; sales path stays pending on the site.',
    },
  )
  writeFileSync(paths.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  return {
    product,
    source,
    manifest,
    paths,
    pdfPath: paths.pdfPath,
    zipPath: paths.zipPath,
    htmlPath: paths.htmlPath,
    manifestPath: paths.manifestPath,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildFileBoxStoryTurningPointCardPack().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
