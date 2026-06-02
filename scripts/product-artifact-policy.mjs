import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'

import { containsActiveCheckoutLanguage } from './content-policy.mjs'

export const rainyDayProductSlug = 'rainy-day-story-quest-pack'
export const seasonBundleProductSlug = 'homeschool-season-story-bundle'
export const classroomLicenseProductSlug = 'classroom-story-license-pack'
export const birthdayPartyProductSlug = 'birthday-party-story-quest-kit'
export const roadTripProductSlug = 'road-trip-story-quest-pack'
export const waitingRoomProductSlug = 'waiting-room-story-quest-pack'
export const libraryStoryClubProductSlug = 'library-story-club-kit'
export const substituteTeacherStationPackProductSlug = 'substitute-teacher-story-station-pack'
export const tutoringCenterSprintPackProductSlug = 'tutoring-center-story-sprint-pack'
export const summerCampStoryCircleKitProductSlug = 'summer-camp-story-circle-kit'

const requiredSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const familySafetyBlockedTerms = [
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
  /\bbranded\b/i,
  /\bbrand(ed)? character(s)?\b/i,
  /\bad(s)? targeted to children\b/i,
]

const requiredWorldSlugs = [
  'teacup-town-weather-window',
  'rain-gauge-railway',
  'spoon-ferry-lunchbox-harbor',
  'rain-boot-route-rangers',
]

const requiredArtifactPaths = {
  pdfPath: 'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf',
  zipPath: 'product-build/rainy-day-story-quest-pack/rainy-day-story-quest-pack.zip',
  sourceHtmlPath: 'product-build/rainy-day-story-quest-pack/source/rainy-day-story-quest-pack.html',
  manifestPath: 'product-build/rainy-day-story-quest-pack/manifest.json',
}

const requiredSeasonBundleArtifactPaths = {
  pdfPath: 'product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf',
  zipPath: 'product-build/homeschool-season-story-bundle/homeschool-season-story-bundle.zip',
  sourceHtmlPath: 'product-build/homeschool-season-story-bundle/source/homeschool-season-story-bundle.html',
  manifestPath: 'product-build/homeschool-season-story-bundle/manifest.json',
}

const requiredClassroomLicenseArtifactPaths = {
  pdfPath: 'product-build/classroom-story-license-pack/Classroom-Story-License-Pack.pdf',
  zipPath: 'product-build/classroom-story-license-pack/classroom-story-license-pack.zip',
  sourceHtmlPath: 'product-build/classroom-story-license-pack/source/classroom-story-license-pack.html',
  manifestPath: 'product-build/classroom-story-license-pack/manifest.json',
}

const requiredBirthdayPartyArtifactPaths = {
  pdfPath: 'product-build/birthday-party-story-quest-kit/Birthday-Party-Story-Quest-Kit.pdf',
  zipPath: 'product-build/birthday-party-story-quest-kit/birthday-party-story-quest-kit.zip',
  sourceHtmlPath: 'product-build/birthday-party-story-quest-kit/source/birthday-party-story-quest-kit.html',
  manifestPath: 'product-build/birthday-party-story-quest-kit/manifest.json',
}

const requiredRoadTripArtifactPaths = {
  pdfPath: 'product-build/road-trip-story-quest-pack/Road-Trip-Story-Quest-Pack.pdf',
  zipPath: 'product-build/road-trip-story-quest-pack/road-trip-story-quest-pack.zip',
  sourceHtmlPath: 'product-build/road-trip-story-quest-pack/source/road-trip-story-quest-pack.html',
  manifestPath: 'product-build/road-trip-story-quest-pack/manifest.json',
}

const requiredWaitingRoomArtifactPaths = {
  pdfPath: 'product-build/waiting-room-story-quest-pack/Waiting-Room-Story-Quest-Pack.pdf',
  zipPath: 'product-build/waiting-room-story-quest-pack/waiting-room-story-quest-pack.zip',
  sourceHtmlPath: 'product-build/waiting-room-story-quest-pack/source/waiting-room-story-quest-pack.html',
  manifestPath: 'product-build/waiting-room-story-quest-pack/manifest.json',
}

const requiredLibraryStoryClubArtifactPaths = {
  pdfPath: 'product-build/library-story-club-kit/Library-Story-Club-Kit.pdf',
  zipPath: 'product-build/library-story-club-kit/library-story-club-kit.zip',
  sourceHtmlPath: 'product-build/library-story-club-kit/source/library-story-club-kit.html',
  manifestPath: 'product-build/library-story-club-kit/manifest.json',
}

const requiredSubstituteTeacherStationArtifactPaths = {
  pdfPath: 'product-build/substitute-teacher-story-station-pack/Substitute-Teacher-Story-Station-Pack.pdf',
  zipPath: 'product-build/substitute-teacher-story-station-pack/substitute-teacher-story-station-pack.zip',
  sourceHtmlPath: 'product-build/substitute-teacher-story-station-pack/source/substitute-teacher-story-station-pack.html',
  manifestPath: 'product-build/substitute-teacher-story-station-pack/manifest.json',
}

const requiredTutoringCenterSprintArtifactPaths = {
  pdfPath: 'product-build/tutoring-center-story-sprint-pack/Tutoring-Center-Story-Sprint-Pack.pdf',
  zipPath: 'product-build/tutoring-center-story-sprint-pack/tutoring-center-story-sprint-pack.zip',
  sourceHtmlPath: 'product-build/tutoring-center-story-sprint-pack/source/tutoring-center-story-sprint-pack.html',
  manifestPath: 'product-build/tutoring-center-story-sprint-pack/manifest.json',
}

const requiredSummerCampStoryCircleArtifactPaths = {
  pdfPath: 'product-build/summer-camp-story-circle-kit/Summer-Camp-Story-Circle-Kit.pdf',
  zipPath: 'product-build/summer-camp-story-circle-kit/summer-camp-story-circle-kit.zip',
  sourceHtmlPath: 'product-build/summer-camp-story-circle-kit/source/summer-camp-story-circle-kit.html',
  manifestPath: 'product-build/summer-camp-story-circle-kit/manifest.json',
}

const allowedPageTypes = new Set(['map', 'prompt', 'worksheet', 'cards', 'reflection', 'adult-guide'])
const allowedSkillFocuses = new Set([
  'setting detail',
  'character choice',
  'sequence',
  'dialogue',
  'revision',
  'sensory detail',
  'problem-solution',
  'ending choice',
  'sentence variety',
  'peer sharing',
])
const requiredRubricLevels = ['Beginning', 'Developing', 'Secure', 'Extending']
const requiredRubricCriteria = ['Concrete details', 'Clear sequence', 'Character choice', 'Revision move']

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

function validateStringArray(value, minLength, label, errors) {
  pushIf(errors, !Array.isArray(value), `${label} must be an array.`)
  if (!Array.isArray(value)) return
  pushIf(errors, value.length < minLength, `${label} must have at least ${minLength} entries.`)
  value.forEach((item, index) => validateString(item, `${label}[${index}]`, errors))
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

function validateNoRiskyLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const checkoutText = rawText
    .replace(/hosted checkout-link path/gi, '')
    .replace(/checkout cannot be marked ready without the artifact/gi, '')
    .replace(/before checkout wiring/gi, '')
  pushIf(
    errors,
    containsActiveCheckoutLanguage(JSON.parse(checkoutText)),
    `${label} includes active checkout or payment-provider language.`,
  )

  const accountText = rawText
    .replace(/\bno\s+accounts?\b/gi, '')
    .replace(/\bno\s+student accounts?\b/gi, '')
    .replace(/\bno\s+logins?\b/gi, '')
    .replace(/\bno\s+uploads?\b/gi, '')
    .replace(/\bno\s+public publishing\b/gi, '')
    .replace(/\bwithout\s+accounts?\b/gi, '')
    .replace(/\bwithout\s+student accounts?\b/gi, '')
    .replace(/\bwithout\s+logins?\b/gi, '')
    .replace(/\bwithout\s+uploads?\b/gi, '')
    .replace(/\bwithout\s+public publishing\b/gi, '')
  pushIf(
    errors,
    /student accounts?|login|log in|public publishing|publish online|upload/i.test(accountText),
    `${label} includes account, login, upload, or public publishing language.`,
  )
}

function validatePage(page, index, worldSlugs, worldCoverage, pageIds, errors) {
  const label = `pages[${index}]`
  pushIf(errors, !isObject(page), `${label} must be an object.`)
  if (!isObject(page)) return

  for (const key of ['id', 'title', 'worldSlug', 'type', 'kidDirection', 'adultNote']) {
    validateString(page[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(page.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, pageIds.has(page.id), `${label}.id is duplicated.`)
    pageIds.add(page.id)
  }

  pushIf(errors, isNonEmptyString(page.type) && !allowedPageTypes.has(page.type), `${label}.type is not allowed.`)
  const allowedWorld = page.worldSlug === 'overview' || worldSlugs.has(page.worldSlug)
  pushIf(errors, isNonEmptyString(page.worldSlug) && !allowedWorld, `${label}.worldSlug references an unknown world.`)
  if (worldSlugs.has(page.worldSlug)) {
    worldCoverage.set(page.worldSlug, (worldCoverage.get(page.worldSlug) ?? 0) + 1)
  }

  pushIf(errors, !Array.isArray(page.sections) || page.sections.length === 0, `${label}.sections must contain at least one section.`)
  if (Array.isArray(page.sections)) {
    page.sections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.sections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateStringArray(section.lines, 1, `${sectionLabel}.lines`, errors)
    })
  }
}

export function validatePackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Pack source must be an object.')
  if (!isObject(source)) return errors

  const worldSlugs = knownWorldSlugs instanceof Set ? knownWorldSlugs : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch7', 'batchId must be 2026-06-02-batch7.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(errors, source.productSlug !== rainyDayProductSlug, `productSlug must be ${rainyDayProductSlug}.`)
  pushIf(errors, source.title !== 'Rainy Day Story Quest Pack', 'title must be Rainy Day Story Quest Pack.')
  pushIf(errors, source.pricePoint !== '$9', 'pricePoint must be $9.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Pack source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, !sameStringSet(source.worldSlugs, requiredWorldSlugs), 'worldSlugs must match the Rainy Day product worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  pushIf(errors, !isObject(source.artifact), 'artifact must be an object.')
  if (isObject(source.artifact)) {
    for (const [key, expectedPath] of Object.entries(requiredArtifactPaths)) {
      pushIf(errors, source.artifact[key] !== expectedPath, `artifact.${key} must be ${expectedPath}.`)
    }
  }

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 7, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.setup, 4, 'adultGuide.setup', errors)
    validateStringArray(source.adultGuide.supportMoves, 5, 'adultGuide.supportMoves', errors)
    validateStringArray(source.adultGuide.extensionIdeas, 4, 'adultGuide.extensionIdeas', errors)
    pushIf(errors, !Array.isArray(source.adultGuide.sessionFlow), 'adultGuide.sessionFlow must be an array.')
    if (Array.isArray(source.adultGuide.sessionFlow)) {
      pushIf(errors, source.adultGuide.sessionFlow.length < 5, 'adultGuide.sessionFlow must have at least 5 entries.')
      source.adultGuide.sessionFlow.forEach((step, index) => {
        pushIf(errors, !isObject(step), `adultGuide.sessionFlow[${index}] must be an object.`)
        if (!isObject(step)) return
        for (const key of ['minutes', 'title', 'instruction']) {
          validateString(step[key], `adultGuide.sessionFlow[${index}].${key}`, errors)
        }
      })
    }
  }

  pushIf(errors, !Array.isArray(source.pages), 'pages must be an array.')
  if (Array.isArray(source.pages)) {
    pushIf(errors, source.pages.length < 10, 'pages must have at least 10 printable pages.')
    const pageIds = new Set()
    const worldCoverage = new Map(requiredWorldSlugs.map((slug) => [slug, 0]))
    source.pages.forEach((page, index) => validatePage(page, index, worldSlugs, worldCoverage, pageIds, errors))
    for (const [slug, count] of worldCoverage.entries()) {
      pushIf(errors, count < 2, `${slug} must be referenced by at least two printable pages.`)
    }
  }

  validateNoRiskyLanguage(source, 'Rainy Day Story Quest Pack source', errors)
  return errors
}

function validateArtifactPaths(source, expectedPaths, label, errors) {
  pushIf(errors, !isObject(source.artifact), 'artifact must be an object.')
  if (!isObject(source.artifact)) return
  for (const [key, expectedPath] of Object.entries(expectedPaths)) {
    pushIf(errors, source.artifact[key] !== expectedPath, `${label} artifact.${key} must be ${expectedPath}.`)
  }
}

function validateSeasonPlan(source, errors) {
  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (!isObject(source.adultGuide)) return
  validateStringArray(source.adultGuide.setup, 4, 'adultGuide.setup', errors)
  validateStringArray(source.adultGuide.supportMoves, 5, 'adultGuide.supportMoves', errors)
  validateStringArray(source.adultGuide.extensionIdeas, 4, 'adultGuide.extensionIdeas', errors)
  pushIf(errors, !Array.isArray(source.adultGuide.seasonPlan), 'adultGuide.seasonPlan must be an array.')
  if (Array.isArray(source.adultGuide.seasonPlan)) {
    const seasons = source.adultGuide.seasonPlan.map((plan) => plan?.season)
    pushIf(errors, !sameStringSet(seasons, ['fall', 'winter', 'spring', 'summer']), 'adultGuide.seasonPlan must cover fall, winter, spring, and summer.')
    source.adultGuide.seasonPlan.forEach((plan, index) => {
      pushIf(errors, !isObject(plan), `adultGuide.seasonPlan[${index}] must be an object.`)
      if (!isObject(plan)) return
      validateString(plan.season, `adultGuide.seasonPlan[${index}].season`, errors)
      validateString(plan.focus, `adultGuide.seasonPlan[${index}].focus`, errors)
    })
  }
}

export function validateSeasonBundleSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Season bundle source must be an object.')
  if (!isObject(source)) return errors

  const worldSlugs = knownWorldSlugs instanceof Set ? knownWorldSlugs : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch8', 'batchId must be 2026-06-02-batch8.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(errors, source.productSlug !== seasonBundleProductSlug, `productSlug must be ${seasonBundleProductSlug}.`)
  pushIf(errors, source.title !== 'Homeschool Season Story Bundle', 'title must be Homeschool Season Story Bundle.')
  pushIf(errors, source.pricePoint !== '$29', 'pricePoint must be $29.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Season bundle source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Season bundle source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Season bundle source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  if (Array.isArray(source.worldSlugs)) {
    const uniqueWorldSlugs = new Set(source.worldSlugs)
    pushIf(errors, source.worldSlugs.length < 8, 'worldSlugs must have at least 8 entries.')
    pushIf(errors, source.worldSlugs.length > 12, 'worldSlugs must have no more than 12 entries.')
    pushIf(errors, uniqueWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, uniqueWorldSlugs.size < 8, 'worldSlugs must include at least 8 unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredSeasonBundleArtifactPaths, 'Season bundle', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  validateSeasonPlan(source, errors)

  pushIf(errors, !Array.isArray(source.pages), 'pages must be an array.')
  if (Array.isArray(source.pages)) {
    pushIf(errors, source.pages.length !== 12, 'pages must have exactly 12 printable quests.')
    const pageIds = new Set()
    const pageWorldCoverage = new Set()
    const seasonCounts = new Map([
      ['fall', 0],
      ['winter', 0],
      ['spring', 0],
      ['summer', 0],
    ])
    const sourceWorldSet = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
    source.pages.forEach((page, index) => {
      validatePage(page, index, worldSlugs, new Map(), pageIds, errors)
      validateString(page.season, `pages[${index}].season`, errors)
      if (isNonEmptyString(page.season)) {
        pushIf(errors, !seasonCounts.has(page.season), `pages[${index}].season must be fall, winter, spring, or summer.`)
        if (seasonCounts.has(page.season)) seasonCounts.set(page.season, seasonCounts.get(page.season) + 1)
      }
      if (isNonEmptyString(page.worldSlug)) {
        pushIf(errors, !sourceWorldSet.has(page.worldSlug), `pages[${index}].worldSlug must be listed in worldSlugs.`)
        pageWorldCoverage.add(page.worldSlug)
      }
    })
    for (const [season, count] of seasonCounts.entries()) {
      pushIf(errors, count !== 3, `${season} must have exactly 3 printable quests.`)
    }
    pushIf(errors, pageWorldCoverage.size < 8, 'pages must cover at least 8 unique worlds.')
  }

  validateNoRiskyLanguage(source, 'Homeschool Season Story Bundle source', errors)
  return errors
}

function validateClassroomPromptCard(card, index, sourceWorldSlugs, knownWorldSlugs, cardIds, errors) {
  const label = `promptCards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'worldSlug',
    'title',
    'skillFocus',
    'teacherSetup',
    'studentPrompt',
    'shareMove',
    'extension',
    'rubricLookFor',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, isNonEmptyString(card.skillFocus) && !allowedSkillFocuses.has(card.skillFocus), `${label}.skillFocus is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  validateExactStringArray(card.choiceSet, 3, `${label}.choiceSet`, errors)
  validateExactStringArray(card.writingLines, 4, `${label}.writingLines`, errors)
  if (Array.isArray(card.writingLines)) {
    card.writingLines.forEach((line, lineIndex) => {
      pushIf(errors, isNonEmptyString(line) && !/_+/.test(line), `${label}.writingLines[${lineIndex}] must include writing blanks.`)
    })
  }
}

function validateClassroomExtension(activity, index, activityIds, errors) {
  const label = `extensionActivities[${index}]`
  pushIf(errors, !isObject(activity), `${label} must be an object.`)
  if (!isObject(activity)) return
  for (const key of ['id', 'title', 'teacherMove', 'studentOutput']) {
    validateString(activity[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(activity.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(activity.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, activityIds.has(activity.id), `${label}.id is duplicated.`)
    activityIds.add(activity.id)
  }
  pushIf(errors, !Number.isInteger(activity.minutes), `${label}.minutes must be an integer.`)
  if (Number.isInteger(activity.minutes)) {
    pushIf(errors, activity.minutes < 10 || activity.minutes > 45, `${label}.minutes must be between 10 and 45.`)
  }
  pushIf(errors, typeof activity.usesPromptCards !== 'boolean', `${label}.usesPromptCards must be a boolean.`)
}

function validateClassroomRubric(rubric, errors) {
  pushIf(errors, !isObject(rubric), 'rubric must be an object.')
  if (!isObject(rubric)) return

  pushIf(errors, !sameStringSet(rubric.levels, requiredRubricLevels), 'rubric.levels must cover Beginning, Developing, Secure, and Extending.')
  pushIf(errors, !Array.isArray(rubric.criteria), 'rubric.criteria must be an array.')
  if (!Array.isArray(rubric.criteria)) return
  pushIf(errors, rubric.criteria.length !== 4, 'rubric.criteria must have exactly 4 entries.')
  const names = rubric.criteria.map((criterion) => criterion?.name)
  pushIf(errors, !sameStringSet(names, requiredRubricCriteria), 'rubric.criteria must cover the required classroom criteria.')
  const criterionIds = new Set()
  rubric.criteria.forEach((criterion, index) => {
    const label = `rubric.criteria[${index}]`
    pushIf(errors, !isObject(criterion), `${label} must be an object.`)
    if (!isObject(criterion)) return
    for (const key of ['id', 'name', 'lookFor']) {
      validateString(criterion[key], `${label}.${key}`, errors)
    }
    if (isNonEmptyString(criterion.id)) {
      pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(criterion.id), `${label}.id must be lowercase kebab-case.`)
      pushIf(errors, criterionIds.has(criterion.id), `${label}.id is duplicated.`)
      criterionIds.add(criterion.id)
    }
    pushIf(errors, !isObject(criterion.levels), `${label}.levels must be an object.`)
    if (isObject(criterion.levels)) {
      for (const level of requiredRubricLevels) {
        validateString(criterion.levels[level], `${label}.levels.${level}`, errors)
      }
    }
  })
}

export function validateClassroomLicenseSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Classroom license source must be an object.')
  if (!isObject(source)) return errors

  const worldSlugs = knownWorldSlugs instanceof Set ? knownWorldSlugs : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch9', 'batchId must be 2026-06-02-batch9.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(errors, source.productSlug !== classroomLicenseProductSlug, `productSlug must be ${classroomLicenseProductSlug}.`)
  pushIf(errors, source.title !== 'Classroom Story License Pack', 'title must be Classroom Story License Pack.')
  pushIf(errors, source.pricePoint !== '$79', 'pricePoint must be $79.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Classroom license source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Classroom license source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Classroom license source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length < 10, 'worldSlugs must have at least 10 entries.')
    pushIf(errors, source.worldSlugs.length > 30, 'worldSlugs must have no more than 30 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredClassroomLicenseArtifactPaths, 'Classroom license', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 12, 'cover.included', errors)
  }

  validateExactStringArray(source.classroomRoutines, 5, 'classroomRoutines', errors)
  validateExactStringArray(source.teacherSetup, 5, 'teacherSetup', errors)

  pushIf(errors, !Array.isArray(source.extensionActivities), 'extensionActivities must be an array.')
  if (Array.isArray(source.extensionActivities)) {
    pushIf(errors, source.extensionActivities.length !== 10, 'extensionActivities must have exactly 10 entries.')
    const activityIds = new Set()
    source.extensionActivities.forEach((activity, index) => validateClassroomExtension(activity, index, activityIds, errors))
  }

  validateClassroomRubric(source.rubric, errors)

  pushIf(errors, !Array.isArray(source.promptCards), 'promptCards must be an array.')
  if (Array.isArray(source.promptCards)) {
    pushIf(errors, source.promptCards.length !== 30, 'promptCards must have exactly 30 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.promptCards.forEach((card, index) => {
      validateClassroomPromptCard(card, index, sourceWorldSlugs, worldSlugs, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 10, 'promptCards must cover at least 10 unique worlds.')
  }

  validateNoRiskyLanguage(source, 'Classroom Story License Pack source', errors)
  return errors
}

function validateBirthdayQuest(quest, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, questIds, errors) {
  const label = `quests[${index}]`
  pushIf(errors, !isObject(quest), `${label} must be an object.`)
  if (!isObject(quest)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'partyUse',
    'setupMinutes',
    'groupMode',
    'kidDirection',
    'adultNote',
    'takeHomeLine',
  ]) {
    validateString(quest[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(quest.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(quest.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, questIds.has(quest.id), `${label}.id is duplicated.`)
    questIds.add(quest.id)
  }

  pushIf(errors, !['7-8', '7-9', '8-10', '9-11', '10-11'].includes(quest.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(quest.worldSlug) && !knownWorldSlugs.has(quest.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(quest.worldSlug) && !sourceWorldSlugs.has(quest.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(quest.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(quest.ageBand) && isNonEmptyString(worldAgeBand) && quest.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${quest.worldSlug} ageBand ${worldAgeBand}.`,
  )
  validateExactStringArray(quest.materials, 4, `${label}.materials`, errors)

  pushIf(errors, !Array.isArray(quest.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(quest.pageSections)) {
    pushIf(errors, quest.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    quest.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !/_+/.test(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
        })
      }
    })
  }
}

function validateBirthdayRoutine(routine, index, routineNames, errors) {
  const label = `partyRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, routineNames.has(routine.name), `${label}.name is duplicated.`)
    routineNames.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
}

function validateBirthdayExtension(activity, index, titles, errors) {
  const label = `extensionActivities[${index}]`
  pushIf(errors, !isObject(activity), `${label} must be an object.`)
  if (!isObject(activity)) return
  for (const key of ['title', 'time', 'direction', 'writingSkill']) {
    validateString(activity[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(activity.title)) {
    pushIf(errors, titles.has(activity.title), `${label}.title is duplicated.`)
    titles.add(activity.title)
  }
}

export function validateBirthdayPartyKitSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Birthday Party Story Quest Kit source must be an object.')
  if (!isObject(source)) return errors

  const knownWorldRecords = knownWorldSlugs instanceof Map ? knownWorldSlugs : null
  const worldSlugs =
    knownWorldSlugs instanceof Map
      ? new Set(knownWorldSlugs.keys())
      : knownWorldSlugs instanceof Set
      ? knownWorldSlugs
      : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch10', 'batchId must be 2026-06-02-batch10.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(errors, source.productSlug !== birthdayPartyProductSlug, `productSlug must be ${birthdayPartyProductSlug}.`)
  pushIf(errors, source.title !== 'Birthday Party Story Quest Kit', 'title must be Birthday Party Story Quest Kit.')
  pushIf(errors, source.pricePoint !== '$19', 'pricePoint must be $19.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Birthday Party source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Birthday Party source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Birthday Party source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length < 6, 'worldSlugs must have at least 6 entries.')
    pushIf(errors, source.worldSlugs.length > 10, 'worldSlugs must have no more than 10 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredBirthdayPartyArtifactPaths, 'Birthday Party', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.setupGuide), 'setupGuide must be an object.')
  if (isObject(source.setupGuide)) {
    validateExactStringArray(source.setupGuide.timing, 5, 'setupGuide.timing', errors)
    validateExactStringArray(source.setupGuide.tableSetup, 5, 'setupGuide.tableSetup', errors)
    validateExactStringArray(source.setupGuide.adultScript, 5, 'setupGuide.adultScript', errors)
    validateExactStringArray(source.setupGuide.takeHomePrep, 4, 'setupGuide.takeHomePrep', errors)
  }

  pushIf(errors, !Array.isArray(source.partyRoutines), 'partyRoutines must be an array.')
  if (Array.isArray(source.partyRoutines)) {
    pushIf(errors, source.partyRoutines.length !== 5, 'partyRoutines must have exactly 5 entries.')
    const names = new Set()
    source.partyRoutines.forEach((routine, index) => validateBirthdayRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.extensionActivities), 'extensionActivities must be an array.')
  if (Array.isArray(source.extensionActivities)) {
    pushIf(errors, source.extensionActivities.length !== 8, 'extensionActivities must have exactly 8 entries.')
    const titles = new Set()
    source.extensionActivities.forEach((activity, index) => validateBirthdayExtension(activity, index, titles, errors))
  }

  validateExactStringArray(source.groupShareCards, 6, 'groupShareCards', errors)

  pushIf(errors, !Array.isArray(source.quests), 'quests must be an array.')
  if (Array.isArray(source.quests)) {
    pushIf(errors, source.quests.length !== 8, 'quests must have exactly 8 entries.')
    const questIds = new Set()
    const coveredWorlds = new Set()
    source.quests.forEach((quest, index) => {
      validateBirthdayQuest(quest, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, questIds, errors)
      if (isNonEmptyString(quest?.worldSlug)) coveredWorlds.add(quest.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 6, 'quests must cover at least 6 unique worlds.')
  }

  validateNoRiskyLanguage(source, 'Birthday Party Story Quest Kit source', errors)
  return errors
}

function validateNoUnsafeTravelLanguage(value, label, errors) {
  const text = JSON.stringify(value).replace(/\bnon-driving\b/gi, 'passenger')
  pushIf(
    errors,
    /\bwhile driving\b|\bbehind the wheel\b|\b(?:ask|asking|tell|telling|have|having|invite|inviting|prompt|prompting)\s+(?:the\s+)?driver\b|\bdriver\s+to\b/i.test(
      text,
    ),
    `${label} includes driver-facing facilitation language.`,
  )
}

function validateRoadTripQuest(quest, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, questIds, errors) {
  const label = `quests[${index}]`
  pushIf(errors, !isObject(quest), `${label} must be an object.`)
  if (!isObject(quest)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'travelUse',
    'setupMinutes',
    'travelMode',
    'kidDirection',
    'adultNote',
    'takeHomeLine',
  ]) {
    validateString(quest[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(quest.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(quest.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, questIds.has(quest.id), `${label}.id is duplicated.`)
    questIds.add(quest.id)
  }

  pushIf(errors, !['7-8', '7-9', '8-10', '9-11', '10-11'].includes(quest.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(quest.worldSlug) && !knownWorldSlugs.has(quest.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(quest.worldSlug) && !sourceWorldSlugs.has(quest.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(quest.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(quest.ageBand) && isNonEmptyString(worldAgeBand) && quest.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${quest.worldSlug} ageBand ${worldAgeBand}.`,
  )

  validateExactStringArray(quest.materials, 4, `${label}.materials`, errors)

  pushIf(errors, !Array.isArray(quest.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(quest.pageSections)) {
    pushIf(errors, quest.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    quest.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !/_+/.test(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
        })
      }
    })
  }

  validateNoUnsafeTravelLanguage(quest, label, errors)
}

function validateRoadTripRoutine(routine, index, routineNames, errors) {
  const label = `travelRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, routineNames.has(routine.name), `${label}.name is duplicated.`)
    routineNames.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeTravelLanguage(routine, label, errors)
}

export function validateRoadTripPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Road Trip Story Quest Pack source must be an object.')
  if (!isObject(source)) return errors

  const knownWorldRecords = knownWorldSlugs instanceof Map ? knownWorldSlugs : null
  const worldSlugs =
    knownWorldSlugs instanceof Map
      ? new Set(knownWorldSlugs.keys())
      : knownWorldSlugs instanceof Set
      ? knownWorldSlugs
      : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch11', 'batchId must be 2026-06-02-batch11.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(errors, source.productSlug !== roadTripProductSlug, `productSlug must be ${roadTripProductSlug}.`)
  pushIf(errors, source.title !== 'Road Trip Story Quest Pack', 'title must be Road Trip Story Quest Pack.')
  pushIf(errors, source.pricePoint !== '$17', 'pricePoint must be $17.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Road Trip source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Road Trip source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Road Trip source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length < 6, 'worldSlugs must have at least 6 entries.')
    pushIf(errors, source.worldSlugs.length > 10, 'worldSlugs must have no more than 10 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredRoadTripArtifactPaths, 'Road Trip', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.setupGuide), 'setupGuide must be an object.')
  if (isObject(source.setupGuide)) {
    validateExactStringArray(source.setupGuide.beforeYouGo, 5, 'setupGuide.beforeYouGo', errors)
    validateExactStringArray(source.setupGuide.inTheCar, 5, 'setupGuide.inTheCar', errors)
    validateExactStringArray(source.setupGuide.restStopHotel, 5, 'setupGuide.restStopHotel', errors)
    validateExactStringArray(source.setupGuide.visitDay, 4, 'setupGuide.visitDay', errors)
    validateNoUnsafeTravelLanguage(source.setupGuide, 'setupGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.travelRoutines), 'travelRoutines must be an array.')
  if (Array.isArray(source.travelRoutines)) {
    pushIf(errors, source.travelRoutines.length !== 5, 'travelRoutines must have exactly 5 entries.')
    const names = new Set()
    source.travelRoutines.forEach((routine, index) => validateRoadTripRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.extensionActivities), 'extensionActivities must be an array.')
  if (Array.isArray(source.extensionActivities)) {
    pushIf(errors, source.extensionActivities.length !== 8, 'extensionActivities must have exactly 8 entries.')
    const titles = new Set()
    source.extensionActivities.forEach((activity, index) => validateBirthdayExtension(activity, index, titles, errors))
  }

  validateExactStringArray(source.groupShareCards, 6, 'groupShareCards', errors)

  pushIf(errors, !Array.isArray(source.quests), 'quests must be an array.')
  if (Array.isArray(source.quests)) {
    pushIf(errors, source.quests.length !== 8, 'quests must have exactly 8 entries.')
    const questIds = new Set()
    const coveredWorlds = new Set()
    source.quests.forEach((quest, index) => {
      validateRoadTripQuest(quest, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, questIds, errors)
      if (isNonEmptyString(quest?.worldSlug)) coveredWorlds.add(quest.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 8, 'quests must cover at least 8 unique worlds.')
  }

  validateNoUnsafeTravelLanguage(source, 'Road Trip Story Quest Pack source', errors)
  validateNoRiskyLanguage(source, 'Road Trip Story Quest Pack source', errors)
  return errors
}

function validateNoUnsafeWaitingLanguage(value, label, errors) {
  const text = JSON.stringify(value)
  pushIf(
    errors,
    /\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\bdiagnos(is|e|es|ed|ing)\b|\btherapy\b|\btherapist\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b/i.test(
      text,
    ),
    `${label} includes medical, emergency, legal, diagnosis, therapy, or treatment language.`,
  )
}

function validateWaitingRoomQuest(quest, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, questIds, errors) {
  const label = `quests[${index}]`
  pushIf(errors, !isObject(quest), `${label} must be an object.`)
  if (!isObject(quest)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'waitingUse',
    'setupMinutes',
    'waitingMode',
    'kidDirection',
    'adultNote',
    'takeHomeLine',
  ]) {
    validateString(quest[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(quest.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(quest.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, questIds.has(quest.id), `${label}.id is duplicated.`)
    questIds.add(quest.id)
  }

  pushIf(errors, !['7-8', '7-9', '8-10', '9-11', '10-11'].includes(quest.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(quest.waitingMode) && !['Restaurant table', 'Appointment lobby', 'Airport gate', 'Sibling activity', 'Pickup line'].includes(quest.waitingMode), `${label}.waitingMode is not allowed.`)
  pushIf(errors, isNonEmptyString(quest.worldSlug) && !knownWorldSlugs.has(quest.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(quest.worldSlug) && !sourceWorldSlugs.has(quest.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(quest.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(quest.ageBand) && isNonEmptyString(worldAgeBand) && quest.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${quest.worldSlug} ageBand ${worldAgeBand}.`,
  )

  validateExactStringArray(quest.materials, 4, `${label}.materials`, errors)

  pushIf(errors, !Array.isArray(quest.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(quest.pageSections)) {
    pushIf(errors, quest.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    quest.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !/_+/.test(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
        })
      }
    })
  }

  validateNoUnsafeWaitingLanguage(quest, label, errors)
}

function validateWaitingRoomRoutine(routine, index, routineNames, errors) {
  const label = `waitingRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, routineNames.has(routine.name), `${label}.name is duplicated.`)
    routineNames.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeWaitingLanguage(routine, label, errors)
}

export function validateWaitingRoomPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Waiting Room Story Quest Pack source must be an object.')
  if (!isObject(source)) return errors

  const knownWorldRecords = knownWorldSlugs instanceof Map ? knownWorldSlugs : null
  const worldSlugs =
    knownWorldSlugs instanceof Map
      ? new Set(knownWorldSlugs.keys())
      : knownWorldSlugs instanceof Set
      ? knownWorldSlugs
      : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch13', 'batchId must be 2026-06-02-batch13.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(errors, source.productSlug !== waitingRoomProductSlug, `productSlug must be ${waitingRoomProductSlug}.`)
  pushIf(errors, source.title !== 'Waiting Room Story Quest Pack', 'title must be Waiting Room Story Quest Pack.')
  pushIf(errors, source.pricePoint !== '$11', 'pricePoint must be $11.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Waiting Room source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Waiting Room source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Waiting Room source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length < 6, 'worldSlugs must have at least 6 entries.')
    pushIf(errors, source.worldSlugs.length > 10, 'worldSlugs must have no more than 10 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredWaitingRoomArtifactPaths, 'Waiting Room', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.setupGuide), 'setupGuide must be an object.')
  if (isObject(source.setupGuide)) {
    validateExactStringArray(source.setupGuide.beforeYouWait, 5, 'setupGuide.beforeYouWait', errors)
    validateExactStringArray(source.setupGuide.restaurantTable, 5, 'setupGuide.restaurantTable', errors)
    validateExactStringArray(source.setupGuide.appointmentLobby, 5, 'setupGuide.appointmentLobby', errors)
    validateExactStringArray(source.setupGuide.siblingEvent, 5, 'setupGuide.siblingEvent', errors)
    validateExactStringArray(source.setupGuide.pickupLine, 4, 'setupGuide.pickupLine', errors)
    validateNoUnsafeWaitingLanguage(source.setupGuide, 'setupGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.waitingRoutines), 'waitingRoutines must be an array.')
  if (Array.isArray(source.waitingRoutines)) {
    pushIf(errors, source.waitingRoutines.length !== 5, 'waitingRoutines must have exactly 5 entries.')
    const names = new Set()
    source.waitingRoutines.forEach((routine, index) => validateWaitingRoomRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.extensionActivities), 'extensionActivities must be an array.')
  if (Array.isArray(source.extensionActivities)) {
    pushIf(errors, source.extensionActivities.length !== 8, 'extensionActivities must have exactly 8 entries.')
    const titles = new Set()
    source.extensionActivities.forEach((activity, index) => validateBirthdayExtension(activity, index, titles, errors))
  }

  validateExactStringArray(source.groupShareCards, 6, 'groupShareCards', errors)

  pushIf(errors, !Array.isArray(source.quests), 'quests must be an array.')
  if (Array.isArray(source.quests)) {
    pushIf(errors, source.quests.length !== 8, 'quests must have exactly 8 entries.')
    const questIds = new Set()
    const coveredWorlds = new Set()
    source.quests.forEach((quest, index) => {
      validateWaitingRoomQuest(quest, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, questIds, errors)
      if (isNonEmptyString(quest?.worldSlug)) coveredWorlds.add(quest.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 8, 'quests must cover at least 8 unique worlds.')
  }

  validateNoUnsafeWaitingLanguage(source, 'Waiting Room Story Quest Pack source', errors)
  validateNoRiskyLanguage(source, 'Waiting Room Story Quest Pack source', errors)
  return errors
}

function validateNoUnsafeLibraryClubLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const text = rawText
    .replace(/\bskip online sharing\b/gi, '')
    .replace(/\bno online sharing\b/gi, '')
    .replace(/\bwithout online sharing\b/gi, '')
    .replace(/\bno uploads?\b/gi, '')
    .replace(/\bno public publishing\b/gi, '')
    .replace(/\bwithout public publishing\b/gi, '')
  pushIf(
    errors,
    /\bpatron records?\b|\blibrary-?card\b|\bsign-?in sheets?\b|\bphotos?\b|\bsurnames?\b|\baddresses?\b|\bschool names?\b|\bonline sharing\b|\bupload(s|ed|ing)?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bpublic publishing\b|\bpublish online\b/i.test(
      text,
    ),
    `${label} includes patron records, library-card data, sign-in sheet, photo, upload, account, or public publishing language.`,
  )
  pushIf(
    errors,
    /\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\bdiagnos(is|e|es|ed|ing)\b|\btherapy\b|\btherapist\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b/i.test(
      rawText,
    ),
    `${label} includes medical, emergency, legal, diagnosis, therapy, or treatment language.`,
  )
}

function validateLibraryClubSession(session, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, sessionIds, errors) {
  const label = `sessions[${index}]`
  pushIf(errors, !isObject(session), `${label} must be an object.`)
  if (!isObject(session)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'clubUse',
    'setupMinutes',
    'groupMode',
    'kidDirection',
    'facilitatorNote',
    'takeHomeLine',
  ]) {
    validateString(session[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(session.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(session.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, sessionIds.has(session.id), `${label}.id is duplicated.`)
    sessionIds.add(session.id)
  }

  pushIf(errors, !['7-8', '7-9', '8-10', '9-11', '10-11'].includes(session.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(session.worldSlug) && !knownWorldSlugs.has(session.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(session.worldSlug) && !sourceWorldSlugs.has(session.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(session.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(session.ageBand) && isNonEmptyString(worldAgeBand) && session.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${session.worldSlug} ageBand ${worldAgeBand}.`,
  )

  validateExactStringArray(session.materials, 4, `${label}.materials`, errors)

  pushIf(errors, !Array.isArray(session.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(session.pageSections)) {
    pushIf(errors, session.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    session.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !/_+/.test(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
        })
      }
    })
  }

  validateNoUnsafeLibraryClubLanguage(session, label, errors)
}

function validateLibraryClubRoutine(routine, index, routineNames, errors) {
  const label = `clubRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, routineNames.has(routine.name), `${label}.name is duplicated.`)
    routineNames.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeLibraryClubLanguage(routine, label, errors)
}

export function validateLibraryStoryClubKitSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Library Story Club Kit source must be an object.')
  if (!isObject(source)) return errors

  const knownWorldRecords = knownWorldSlugs instanceof Map ? knownWorldSlugs : null
  const worldSlugs =
    knownWorldSlugs instanceof Map
      ? new Set(knownWorldSlugs.keys())
      : knownWorldSlugs instanceof Set
      ? knownWorldSlugs
      : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch14', 'batchId must be 2026-06-02-batch14.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(errors, source.productSlug !== libraryStoryClubProductSlug, `productSlug must be ${libraryStoryClubProductSlug}.`)
  pushIf(errors, source.title !== 'Library Story Club Kit', 'title must be Library Story Club Kit.')
  pushIf(errors, source.pricePoint !== '$23', 'pricePoint must be $23.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Library Story Club source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Library Story Club source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Library Story Club source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 10, 'worldSlugs must have exactly 10 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredLibraryStoryClubArtifactPaths, 'Library Story Club', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.facilitatorGuide), 'facilitatorGuide must be an object.')
  if (isObject(source.facilitatorGuide)) {
    validateExactStringArray(source.facilitatorGuide.setup, 5, 'facilitatorGuide.setup', errors)
    validateExactStringArray(source.facilitatorGuide.groupNorms, 5, 'facilitatorGuide.groupNorms', errors)
    validateExactStringArray(source.facilitatorGuide.materials, 5, 'facilitatorGuide.materials', errors)
    validateExactStringArray(source.facilitatorGuide.timing, 5, 'facilitatorGuide.timing', errors)
    validateExactStringArray(source.facilitatorGuide.takeHome, 4, 'facilitatorGuide.takeHome', errors)
    validateNoUnsafeLibraryClubLanguage(source.facilitatorGuide, 'facilitatorGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.clubRoutines), 'clubRoutines must be an array.')
  if (Array.isArray(source.clubRoutines)) {
    pushIf(errors, source.clubRoutines.length !== 5, 'clubRoutines must have exactly 5 entries.')
    const names = new Set()
    source.clubRoutines.forEach((routine, index) => validateLibraryClubRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.extensionActivities), 'extensionActivities must be an array.')
  if (Array.isArray(source.extensionActivities)) {
    pushIf(errors, source.extensionActivities.length !== 8, 'extensionActivities must have exactly 8 entries.')
    const titles = new Set()
    source.extensionActivities.forEach((activity, index) => validateBirthdayExtension(activity, index, titles, errors))
  }

  validateExactStringArray(source.sharePrompts, 6, 'sharePrompts', errors)

  pushIf(errors, !Array.isArray(source.sessions), 'sessions must be an array.')
  if (Array.isArray(source.sessions)) {
    pushIf(errors, source.sessions.length !== 10, 'sessions must have exactly 10 entries.')
    const sessionIds = new Set()
    const coveredWorlds = new Set()
    source.sessions.forEach((session, index) => {
      validateLibraryClubSession(session, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, sessionIds, errors)
      if (isNonEmptyString(session?.worldSlug)) coveredWorlds.add(session.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 10, 'sessions must cover at least 10 unique worlds.')
  }

  validateNoUnsafeLibraryClubLanguage(source, 'Library Story Club Kit source', errors)
  validateNoRiskyLanguage(source, 'Library Story Club Kit source', errors)
  return errors
}

function validateNoUnsafeSubstituteLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const text = rawText
    .replace(/\bno\s+uploads?\b/gi, '')
    .replace(/\bno\s+public publishing\b/gi, '')
    .replace(/\bwithout\s+public publishing\b/gi, '')
    .replace(/\bwithout\s+uploads?\b/gi, '')
  pushIf(
    errors,
    /\brosters?\b|\battendance\b|\bsign-?in sheets?\b|\bstudent names?\b|\bsurnames?\b|\bschool names?\b|\bphotos?\b|\baddresses?\b|\bbehavior reports?\b|\bupload(s|ed|ing)?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bpublic publishing\b|\bpublish online\b/i.test(
      text,
    ),
    `${label} includes roster, attendance, sign-in, student-name, school-data, photo, behavior-report, upload, account, or public publishing language.`,
  )
  pushIf(
    errors,
    /\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\bdiagnos(is|e|es|ed|ing)\b|\btherapy\b|\btherapist\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b/i.test(
      rawText,
    ),
    `${label} includes medical, emergency, legal, diagnosis, therapy, or treatment language.`,
  )
}

function validateSubstituteStation(station, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, stationIds, errors) {
  const label = `stations[${index}]`
  pushIf(errors, !isObject(station), `${label} must be an object.`)
  if (!isObject(station)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'stationUse',
    'setupMinutes',
    'stationMode',
    'kidDirection',
    'subNote',
    'exitTicketLine',
  ]) {
    validateString(station[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(station.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(station.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !station.id.startsWith('substitute-'), `${label}.id must start with substitute-.`)
    pushIf(errors, stationIds.has(station.id), `${label}.id is duplicated.`)
    stationIds.add(station.id)
  }

  pushIf(errors, !['7-8', '7-9', '8-10', '9-11', '10-11'].includes(station.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(
    errors,
    isNonEmptyString(station.stationMode) &&
      !['Calm start', 'Partner table', 'Early finisher', 'Independent desk', 'Small group'].includes(station.stationMode),
    `${label}.stationMode is not allowed.`,
  )
  pushIf(errors, isNonEmptyString(station.worldSlug) && !knownWorldSlugs.has(station.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(station.worldSlug) && !sourceWorldSlugs.has(station.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(station.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(station.ageBand) && isNonEmptyString(worldAgeBand) && station.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${station.worldSlug} ageBand ${worldAgeBand}.`,
  )

  validateExactStringArray(station.materials, 4, `${label}.materials`, errors)

  pushIf(errors, !Array.isArray(station.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(station.pageSections)) {
    pushIf(errors, station.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    station.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !/_+/.test(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
        })
      }
    })
  }

  pushIf(errors, isNonEmptyString(station.exitTicketLine) && !/_+/.test(station.exitTicketLine), `${label}.exitTicketLine must include a writable blank.`)
  validateNoUnsafeSubstituteLanguage(station, label, errors)
}

function validateSubstituteRoutine(routine, index, routineNames, errors) {
  const label = `stationRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, routineNames.has(routine.name), `${label}.name is duplicated.`)
    routineNames.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeSubstituteLanguage(routine, label, errors)
}

export function validateSubstituteTeacherStationPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Substitute Teacher Story Station Pack source must be an object.')
  if (!isObject(source)) return errors

  const knownWorldRecords = knownWorldSlugs instanceof Map ? knownWorldSlugs : null
  const worldSlugs =
    knownWorldSlugs instanceof Map
      ? new Set(knownWorldSlugs.keys())
      : knownWorldSlugs instanceof Set
      ? knownWorldSlugs
      : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch15', 'batchId must be 2026-06-02-batch15.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== substituteTeacherStationPackProductSlug,
    `productSlug must be ${substituteTeacherStationPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Substitute Teacher Story Station Pack', 'title must be Substitute Teacher Story Station Pack.')
  pushIf(errors, source.pricePoint !== '$39', 'pricePoint must be $39.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Substitute Teacher source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Substitute Teacher source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Substitute Teacher source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 12, 'worldSlugs must have exactly 12 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredSubstituteTeacherStationArtifactPaths, 'Substitute Teacher', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.substituteGuide), 'substituteGuide must be an object.')
  if (isObject(source.substituteGuide)) {
    validateExactStringArray(source.substituteGuide.beforeTheDay, 5, 'substituteGuide.beforeTheDay', errors)
    validateExactStringArray(source.substituteGuide.morningSetup, 5, 'substituteGuide.morningSetup', errors)
    validateExactStringArray(source.substituteGuide.duringStations, 5, 'substituteGuide.duringStations', errors)
    validateExactStringArray(source.substituteGuide.endOfDay, 5, 'substituteGuide.endOfDay', errors)
    validateExactStringArray(source.substituteGuide.handoff, 4, 'substituteGuide.handoff', errors)
    validateNoUnsafeSubstituteLanguage(source.substituteGuide, 'substituteGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.stationRoutines), 'stationRoutines must be an array.')
  if (Array.isArray(source.stationRoutines)) {
    pushIf(errors, source.stationRoutines.length !== 5, 'stationRoutines must have exactly 5 entries.')
    const names = new Set()
    source.stationRoutines.forEach((routine, index) => validateSubstituteRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.earlyFinisherCards), 'earlyFinisherCards must be an array.')
  if (Array.isArray(source.earlyFinisherCards)) {
    pushIf(errors, source.earlyFinisherCards.length !== 8, 'earlyFinisherCards must have exactly 8 entries.')
    const titles = new Set()
    source.earlyFinisherCards.forEach((activity, index) => validateBirthdayExtension(activity, index, titles, errors))
  }

  validateExactStringArray(source.sharePrompts, 6, 'sharePrompts', errors)

  pushIf(errors, !Array.isArray(source.stations), 'stations must be an array.')
  if (Array.isArray(source.stations)) {
    pushIf(errors, source.stations.length !== 12, 'stations must have exactly 12 entries.')
    const stationIds = new Set()
    const coveredWorlds = new Set()
    source.stations.forEach((station, index) => {
      validateSubstituteStation(station, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, stationIds, errors)
      if (isNonEmptyString(station?.worldSlug)) coveredWorlds.add(station.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 12, 'stations must cover at least 12 unique worlds.')
  }

  validateNoUnsafeSubstituteLanguage(source, 'Substitute Teacher Story Station Pack source', errors)
  validateNoRiskyLanguage(source, 'Substitute Teacher Story Station Pack source', errors)
  return errors
}

function validateNoUnsafeTutoringLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const text = rawText
    .replace(/\bno\s+uploads?\b/gi, '')
    .replace(/\bno\s+public publishing\b/gi, '')
    .replace(/\bwithout\s+public publishing\b/gi, '')
    .replace(/\bwithout\s+uploads?\b/gi, '')
  pushIf(
    errors,
    /\brosters?\b|\battendance\b|\bsign-?in sheets?\b|\bstudent names?\b|\binitials\b|\bsurnames?\b|\bschool names?\b|\bphotos?\b|\baddresses?\b|\bbehavior reports?\b|\bupload(s|ed|ing)?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bpublic publishing\b|\bpublish online\b/i.test(
      text,
    ),
    `${label} includes roster, attendance, sign-in, student-name, school-data, photo, behavior-report, upload, account, or public publishing language.`,
  )
  pushIf(
    errors,
    /\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\btherapy\b|\btherapist\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b/i.test(
      rawText,
    ),
    `${label} includes diagnosis, medical, legal, formal scoring, or guaranteed-outcome language.`,
  )
}

function hasWritableBlank(value) {
  return /_{4,}/.test(value)
}

function hasSnakeCasePlaceholder(value) {
  return /\b[a-z]+(?:_[a-z]+){2,}\b/.test(value)
}

function validateTutoringSprint(sprint, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, sprintIds, errors) {
  const label = `sprints[${index}]`
  pushIf(errors, !isObject(sprint), `${label} must be an object.`)
  if (!isObject(sprint)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'sprintSkill',
    'sessionFit',
    'tutorSetup',
    'kidDirection',
    'coachingPrompt',
    'wrapUpLine',
    'extensionLine',
  ]) {
    validateString(sprint[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(sprint.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sprint.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !sprint.id.startsWith('tutoring-'), `${label}.id must start with tutoring-.`)
    pushIf(errors, sprintIds.has(sprint.id), `${label}.id is duplicated.`)
    sprintIds.add(sprint.id)
  }

  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '9-11', '10-11'].includes(sprint.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(sprint.worldSlug) && !knownWorldSlugs.has(sprint.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(sprint.worldSlug) && !sourceWorldSlugs.has(sprint.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(sprint.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(sprint.ageBand) && isNonEmptyString(worldAgeBand) && sprint.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${sprint.worldSlug} ageBand ${worldAgeBand}.`,
  )

  pushIf(errors, !Array.isArray(sprint.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(sprint.pageSections)) {
    pushIf(errors, sprint.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    sprint.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !hasWritableBlank(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
        })
      }
    })
  }

  pushIf(errors, isNonEmptyString(sprint.wrapUpLine) && !hasWritableBlank(sprint.wrapUpLine), `${label}.wrapUpLine must include a writable blank.`)
  pushIf(errors, isNonEmptyString(sprint.extensionLine) && !hasWritableBlank(sprint.extensionLine), `${label}.extensionLine must include a writable blank.`)
  validateNoUnsafeTutoringLanguage(sprint, label, errors)
}

function validateTutoringRoutine(routine, index, routineNames, errors) {
  const label = `sprintRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, routineNames.has(routine.name), `${label}.name is duplicated.`)
    routineNames.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeTutoringLanguage(routine, label, errors)
}

function validateTakeHomeSlip(slip, index, titles, errors) {
  const label = `takeHomeSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, isNonEmptyString(slip.direction) && !hasWritableBlank(slip.direction), `${label}.direction must include a writable blank.`)
  pushIf(errors, isNonEmptyString(slip.direction) && hasSnakeCasePlaceholder(slip.direction), `${label}.direction must use human-readable text, not snake_case placeholders.`)
  pushIf(errors, isNonEmptyString(slip.familyLine) && !hasWritableBlank(slip.familyLine), `${label}.familyLine must include a writable blank.`)
  pushIf(errors, isNonEmptyString(slip.familyLine) && hasSnakeCasePlaceholder(slip.familyLine), `${label}.familyLine must use human-readable text, not snake_case placeholders.`)
  validateNoUnsafeTutoringLanguage(slip, label, errors)
}

export function validateTutoringCenterSprintPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Tutoring Center Story Sprint Pack source must be an object.')
  if (!isObject(source)) return errors

  const knownWorldRecords = knownWorldSlugs instanceof Map ? knownWorldSlugs : null
  const worldSlugs =
    knownWorldSlugs instanceof Map
      ? new Set(knownWorldSlugs.keys())
      : knownWorldSlugs instanceof Set
      ? knownWorldSlugs
      : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch16', 'batchId must be 2026-06-02-batch16.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== tutoringCenterSprintPackProductSlug,
    `productSlug must be ${tutoringCenterSprintPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Tutoring Center Story Sprint Pack', 'title must be Tutoring Center Story Sprint Pack.')
  pushIf(errors, source.pricePoint !== '$49', 'pricePoint must be $49.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Tutoring Center source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Tutoring Center source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Tutoring Center source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 20, 'worldSlugs must have exactly 20 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredTutoringCenterSprintArtifactPaths, 'Tutoring Center', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.tutorGuide), 'tutorGuide must be an object.')
  if (isObject(source.tutorGuide)) {
    validateExactStringArray(source.tutorGuide.beforeSession, 5, 'tutorGuide.beforeSession', errors)
    validateExactStringArray(source.tutorGuide.setup, 5, 'tutorGuide.setup', errors)
    validateExactStringArray(source.tutorGuide.duringSprint, 5, 'tutorGuide.duringSprint', errors)
    validateExactStringArray(source.tutorGuide.wrapUp, 5, 'tutorGuide.wrapUp', errors)
    validateExactStringArray(source.tutorGuide.noDataUse, 4, 'tutorGuide.noDataUse', errors)
    validateNoUnsafeTutoringLanguage(source.tutorGuide, 'tutorGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.sprintRoutines), 'sprintRoutines must be an array.')
  if (Array.isArray(source.sprintRoutines)) {
    pushIf(errors, source.sprintRoutines.length !== 5, 'sprintRoutines must have exactly 5 entries.')
    const names = new Set()
    source.sprintRoutines.forEach((routine, index) => validateTutoringRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSlips), 'takeHomeSlips must be an array.')
  if (Array.isArray(source.takeHomeSlips)) {
    pushIf(errors, source.takeHomeSlips.length !== 8, 'takeHomeSlips must have exactly 8 entries.')
    const titles = new Set()
    source.takeHomeSlips.forEach((slip, index) => validateTakeHomeSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.sharePrompts, 6, 'sharePrompts', errors)

  pushIf(errors, !Array.isArray(source.sprints), 'sprints must be an array.')
  if (Array.isArray(source.sprints)) {
    pushIf(errors, source.sprints.length !== 20, 'sprints must have exactly 20 entries.')
    const sprintIds = new Set()
    const coveredWorlds = new Set()
    source.sprints.forEach((sprint, index) => {
      validateTutoringSprint(sprint, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, sprintIds, errors)
      if (isNonEmptyString(sprint?.worldSlug)) coveredWorlds.add(sprint.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'sprints must cover at least 16 unique worlds.')
  }

  validateNoUnsafeTutoringLanguage(source, 'Tutoring Center Story Sprint Pack source', errors)
  validateNoRiskyLanguage(source, 'Tutoring Center Story Sprint Pack source', errors)
  return errors
}

function validateNoUnsafeCampLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const text = rawText
    .replace(/\bno\s+accounts?\b/gi, '')
    .replace(/\bno\s+child accounts?\b/gi, '')
    .replace(/\bno\s+uploads?\b/gi, '')
    .replace(/\bno\s+public publishing\b/gi, '')
    .replace(/\bwithout\s+accounts?\b/gi, '')
    .replace(/\bwithout\s+child accounts?\b/gi, '')
    .replace(/\bwithout\s+uploads?\b/gi, '')
    .replace(/\bwithout\s+public publishing\b/gi, '')
  pushIf(
    errors,
    /\brosters?\b|\battendance\b|\bsign-?in\b|\bcamper names?\b|\bstudent names?\b|\binitials\b|\bsurnames?\b|\bschool names?\b|\bphotos?\b|\baddresses?\b|\bbehavior reports?\b|\bupload(s|ed|ing)?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bpublic publishing\b|\bpublish online\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\btherapy\b|\btherapist\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b/i.test(
      text,
    ),
    `${label} includes roster, attendance, sign-in, camper-name, photo, address, behavior, medical, legal, therapy, diagnosis, assessment, or guaranteed-outcome language.`,
  )
  pushIf(
    errors,
    /\bcampfires?\b|\bfire pit(s)?\b|\bflames?\b|\bmatches\b|\blighter(s)?\b|\bswim(ming)?\b|\bdeep water\b|\bopen water\b|\bcliff(s)?\b|\brope course(s)?\b|\barchery\b|\bknife|knives\b/i.test(
      rawText,
    ),
    `${label} includes unsafe fire, water, or outdoor-risk language.`,
  )
}

function validateNoFamilySafetyLanguage(value, label, errors) {
  const text = JSON.stringify(value)
    .replaceAll(requiredSafety, '')
    .replace(/\bno\s+weapon(s)?\b/gi, '')
    .replace(/\bno\s+branded characters\b/gi, '')
    .replace(/\bno\s+scary harm\b/gi, '')
    .replace(/\bno\s+logos?\b/gi, '')
    .replace(/\bno\s+watermark\b/gi, '')
    .replace(/\bno\s+text\b/gi, '')

  pushIf(
    errors,
    familySafetyBlockedTerms.some((pattern) => pattern.test(text)),
    `${label} includes political, branded, romance, scary, violent, weapon, gambling, ad-targeting, or pressure language.`,
  )
}

function validateCampActivity(activity, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, activityIds, errors) {
  const label = `activities[${index}]`
  pushIf(errors, !isObject(activity), `${label} must be an object.`)
  if (!isObject(activity)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'circleSkill',
    'sessionFit',
    'counselorSetup',
    'kidDirection',
    'counselorPrompt',
    'groupTwistLine',
    'wrapUpLine',
    'quietOptionLine',
  ]) {
    validateString(activity[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(activity.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(activity.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, activityIds.has(activity.id), `${label}.id is duplicated.`)
    activityIds.add(activity.id)
  }

  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '9-11', '10-11'].includes(activity.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(activity.worldSlug) && !knownWorldSlugs.has(activity.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(activity.worldSlug) && !sourceWorldSlugs.has(activity.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(activity.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(activity.ageBand) && isNonEmptyString(worldAgeBand) && activity.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${activity.worldSlug} ageBand ${worldAgeBand}.`,
  )

  pushIf(errors, !Array.isArray(activity.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(activity.pageSections)) {
    pushIf(errors, activity.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    activity.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !hasWritableBlank(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
        })
      }
    })
  }

  for (const key of ['groupTwistLine', 'wrapUpLine', 'quietOptionLine']) {
    pushIf(errors, isNonEmptyString(activity[key]) && !hasWritableBlank(activity[key]), `${label}.${key} must include a writable blank.`)
  }
  validateNoUnsafeCampLanguage(activity, label, errors)
}

function validateCircleFormat(format, index, names, errors) {
  const label = `circleFormats[${index}]`
  pushIf(errors, !isObject(format), `${label} must be an object.`)
  if (!isObject(format)) return
  for (const key of ['name', 'bestFor']) {
    validateString(format[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(format.name)) {
    pushIf(errors, names.has(format.name), `${label}.name is duplicated.`)
    names.add(format.name)
  }
  validateExactStringArray(format.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeCampLanguage(format, label, errors)
}

function validateTrailCard(card, index, titles, errors) {
  const label = `takeHomeTrailCards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(card[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(card.title)) {
    pushIf(errors, titles.has(card.title), `${label}.title is duplicated.`)
    titles.add(card.title)
  }
  pushIf(errors, isNonEmptyString(card.direction) && !hasWritableBlank(card.direction), `${label}.direction must include a writable blank.`)
  pushIf(errors, isNonEmptyString(card.direction) && hasSnakeCasePlaceholder(card.direction), `${label}.direction must use human-readable text, not snake_case placeholders.`)
  pushIf(errors, isNonEmptyString(card.familyLine) && !hasWritableBlank(card.familyLine), `${label}.familyLine must include a writable blank.`)
  pushIf(errors, isNonEmptyString(card.familyLine) && hasSnakeCasePlaceholder(card.familyLine), `${label}.familyLine must use human-readable text, not snake_case placeholders.`)
  validateNoUnsafeCampLanguage(card, label, errors)
}

export function validateSummerCampStoryCircleKitSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Summer Camp Story Circle Kit source must be an object.')
  if (!isObject(source)) return errors

  const knownWorldRecords = knownWorldSlugs instanceof Map ? knownWorldSlugs : null
  const worldSlugs =
    knownWorldSlugs instanceof Map
      ? new Set(knownWorldSlugs.keys())
      : knownWorldSlugs instanceof Set
      ? knownWorldSlugs
      : new Set(knownWorldSlugs)

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-02-batch17', 'batchId must be 2026-06-02-batch17.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== summerCampStoryCircleKitProductSlug,
    `productSlug must be ${summerCampStoryCircleKitProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Summer Camp Story Circle Kit', 'title must be Summer Camp Story Circle Kit.')
  pushIf(errors, source.pricePoint !== '$59', 'pricePoint must be $59.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Summer Camp source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Summer Camp source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Summer Camp source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredSummerCampStoryCircleArtifactPaths, 'Summer Camp', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.counselorGuide), 'counselorGuide must be an object.')
  if (isObject(source.counselorGuide)) {
    validateExactStringArray(source.counselorGuide.beforeCamp, 5, 'counselorGuide.beforeCamp', errors)
    validateExactStringArray(source.counselorGuide.setup, 5, 'counselorGuide.setup', errors)
    validateExactStringArray(source.counselorGuide.runningCircle, 5, 'counselorGuide.runningCircle', errors)
    validateExactStringArray(source.counselorGuide.quietOptions, 5, 'counselorGuide.quietOptions', errors)
    validateExactStringArray(source.counselorGuide.noDataUse, 4, 'counselorGuide.noDataUse', errors)
    validateNoUnsafeCampLanguage(source.counselorGuide, 'counselorGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.circleFormats), 'circleFormats must be an array.')
  if (Array.isArray(source.circleFormats)) {
    pushIf(errors, source.circleFormats.length !== 6, 'circleFormats must have exactly 6 entries.')
    const names = new Set()
    source.circleFormats.forEach((format, index) => validateCircleFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeTrailCards), 'takeHomeTrailCards must be an array.')
  if (Array.isArray(source.takeHomeTrailCards)) {
    pushIf(errors, source.takeHomeTrailCards.length !== 10, 'takeHomeTrailCards must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeTrailCards.forEach((card, index) => validateTrailCard(card, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)

  pushIf(errors, !Array.isArray(source.activities), 'activities must be an array.')
  if (Array.isArray(source.activities)) {
    pushIf(errors, source.activities.length !== 16, 'activities must have exactly 16 entries.')
    const activityIds = new Set()
    const coveredWorlds = new Set()
    source.activities.forEach((activity, index) => {
      validateCampActivity(activity, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, activityIds, errors)
      if (isNonEmptyString(activity?.worldSlug)) coveredWorlds.add(activity.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'activities must cover at least 16 unique worlds.')
  }

  validateNoUnsafeCampLanguage(source, 'Summer Camp Story Circle Kit source', errors)
  validateNoFamilySafetyLanguage(source, 'Summer Camp Story Circle Kit source', errors)
  validateNoRiskyLanguage(source, 'Summer Camp Story Circle Kit source', errors)
  return errors
}

export function countPdfPages(buffer) {
  const text = buffer.toString('latin1')
  return (text.match(/\/Type\s*\/Page\b/g) ?? []).length
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function manifestFileRecords(value, label = 'files') {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => manifestFileRecords(item, `${label}[${index}]`))
  }
  if (!isObject(value)) return []
  if (isNonEmptyString(value.path)) {
    return [{ label, record: value }]
  }
  return Object.entries(value).flatMap(([key, item]) => manifestFileRecords(item, `${label}.${key}`))
}

function validateManifestFileRecords(root, manifest, expectedPaths, errors) {
  if (!isObject(manifest?.files)) return

  for (const [manifestKey, pathKey] of [
    ['pdf', 'pdfPath'],
    ['zip', 'zipPath'],
    ['sourceHtml', 'sourceHtmlPath'],
  ]) {
    const recordPath = manifest.files[manifestKey]?.path
    if (isNonEmptyString(recordPath) && recordPath !== expectedPaths[pathKey]) {
      errors.push(`manifest files.${manifestKey} path must be ${expectedPaths[pathKey]}.`)
    }
  }

  for (const { label, record } of manifestFileRecords(manifest.files)) {
    const relativePath = record.path
    const absolutePath = resolve(root, relativePath)
    if (!existsSync(absolutePath)) {
      errors.push(`manifest ${label} path does not exist: ${relativePath}.`)
      continue
    }
    const buffer = readFileSync(absolutePath)
    if (!Number.isInteger(record.size)) {
      errors.push(`manifest ${label} size must be an integer.`)
    } else if (record.size !== buffer.length) {
      errors.push(`manifest ${label} size does not match ${relativePath}.`)
    }
    if (!/^[a-f0-9]{64}$/.test(record.sha256 ?? '')) {
      errors.push(`manifest ${label} sha256 must be a 64-character lowercase hex digest.`)
    } else if (record.sha256 !== sha256(buffer)) {
      errors.push(`manifest ${label} sha256 does not match ${relativePath}.`)
    }
  }
}

export function validateManifestWorldAssets(source, manifest) {
  const errors = []
  const assets = manifest?.files?.assets
  if (!Array.isArray(assets)) {
    return [`${source.title} artifact manifest files.assets must be an array.`]
  }
  const assetPaths = assets.map((asset) => asset?.path).filter(isNonEmptyString)
  for (const worldSlug of source.worldSlugs ?? []) {
    const hasAsset = assetPaths.some((path) => path.endsWith(`/assets/${worldSlug}.jpg`))
    if (!hasAsset) {
      errors.push(`${source.title} artifact manifest missing copied image for ${worldSlug}.`)
    }
  }
  return errors
}

export function inspectConfiguredArtifactFiles(root, artifact, expectedPaths, options = {}) {
  const files = {}
  const errors = []
  let parsedManifest = null
  for (const [key, relativePath] of Object.entries(expectedPaths)) {
    const label = key.replace(/Path$/, '')
    const configuredPath = artifact?.[key]
    if (configuredPath !== relativePath) {
      errors.push(`artifact.${key} must be ${relativePath}.`)
      continue
    }
    const absolutePath = resolve(root, relativePath)
    if (!existsSync(absolutePath)) {
      errors.push(`missing ${label} artifact: ${relativePath}`)
      continue
    }
    const buffer = readFileSync(absolutePath)
    files[label] = {
      path: relativePath,
      size: buffer.length,
    }
    if (key === 'pdfPath' && buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
      errors.push(`${relativePath} is not a PDF artifact.`)
    }
    if (key === 'pdfPath' && Number.isInteger(options.expectedPdfPages)) {
      const pageCount = countPdfPages(buffer)
      files[label].pageCount = pageCount
      if (pageCount !== options.expectedPdfPages) {
        errors.push(`${relativePath} must have exactly ${options.expectedPdfPages} pages; found ${pageCount}.`)
      }
    }
    if (key === 'zipPath' && buffer.subarray(0, 2).toString('ascii') !== 'PK') {
      errors.push(`${relativePath} is not a ZIP artifact.`)
    }
    if (key === 'sourceHtmlPath' && !buffer.toString('utf8', 0, Math.min(buffer.length, 120)).toLowerCase().includes('<!doctype html')) {
      errors.push(`${relativePath} is not a source HTML artifact.`)
    }
    if (key === 'manifestPath') {
      try {
        parsedManifest = JSON.parse(buffer.toString('utf8'))
      } catch {
        errors.push(`${relativePath} is not valid JSON.`)
      }
    }
  }
  if (parsedManifest) {
    validateManifestFileRecords(root, parsedManifest, expectedPaths, errors)
  }
  return {
    valid: errors.length === 0,
    errors,
    files,
  }
}

export function inspectArtifactFiles(root, artifact, options = {}) {
  const expectedPaths =
    artifact?.pdfPath === requiredSummerCampStoryCircleArtifactPaths.pdfPath
      ? requiredSummerCampStoryCircleArtifactPaths
      : artifact?.pdfPath === requiredTutoringCenterSprintArtifactPaths.pdfPath
      ? requiredTutoringCenterSprintArtifactPaths
      : artifact?.pdfPath === requiredSubstituteTeacherStationArtifactPaths.pdfPath
      ? requiredSubstituteTeacherStationArtifactPaths
      : artifact?.pdfPath === requiredLibraryStoryClubArtifactPaths.pdfPath
      ? requiredLibraryStoryClubArtifactPaths
      : artifact?.pdfPath === requiredWaitingRoomArtifactPaths.pdfPath
      ? requiredWaitingRoomArtifactPaths
      : artifact?.pdfPath === requiredRoadTripArtifactPaths.pdfPath
      ? requiredRoadTripArtifactPaths
      : artifact?.pdfPath === requiredBirthdayPartyArtifactPaths.pdfPath
      ? requiredBirthdayPartyArtifactPaths
      : artifact?.pdfPath === requiredClassroomLicenseArtifactPaths.pdfPath
      ? requiredClassroomLicenseArtifactPaths
      : artifact?.pdfPath === requiredSeasonBundleArtifactPaths.pdfPath
      ? requiredSeasonBundleArtifactPaths
      : requiredArtifactPaths
  return inspectConfiguredArtifactFiles(root, artifact, expectedPaths, options)
}

export function validateCheckoutReadiness(product, artifactStatus) {
  if (product?.status === 'checkout_pending') return []
  if (artifactStatus?.valid) return []
  return ['checkout_ready cannot be used until the product artifact validates.']
}

function makeCrc32Table() {
  const table = []
  for (let index = 0; index < 256; index += 1) {
    let value = index
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    }
    table[index] = value >>> 0
  }
  return table
}

const crc32Table = makeCrc32Table()
const dosDate1980Jan1 = 0x0021

function crc32(buffer) {
  let value = 0xffffffff
  for (const byte of buffer) {
    value = crc32Table[(value ^ byte) & 0xff] ^ (value >>> 8)
  }
  return (value ^ 0xffffffff) >>> 0
}

function localFileHeader(entry) {
  const header = Buffer.alloc(30)
  header.writeUInt32LE(0x04034b50, 0)
  header.writeUInt16LE(20, 4)
  header.writeUInt16LE(0, 6)
  header.writeUInt16LE(0, 8)
  header.writeUInt16LE(0, 10)
  header.writeUInt16LE(dosDate1980Jan1, 12)
  header.writeUInt32LE(entry.crc, 14)
  header.writeUInt32LE(entry.data.length, 18)
  header.writeUInt32LE(entry.data.length, 22)
  header.writeUInt16LE(entry.name.length, 26)
  header.writeUInt16LE(0, 28)
  return Buffer.concat([header, entry.name])
}

function centralDirectoryHeader(entry) {
  const header = Buffer.alloc(46)
  header.writeUInt32LE(0x02014b50, 0)
  header.writeUInt16LE(20, 4)
  header.writeUInt16LE(20, 6)
  header.writeUInt16LE(0, 8)
  header.writeUInt16LE(0, 10)
  header.writeUInt16LE(0, 12)
  header.writeUInt16LE(dosDate1980Jan1, 14)
  header.writeUInt32LE(entry.crc, 16)
  header.writeUInt32LE(entry.data.length, 20)
  header.writeUInt32LE(entry.data.length, 24)
  header.writeUInt16LE(entry.name.length, 28)
  header.writeUInt16LE(0, 30)
  header.writeUInt16LE(0, 32)
  header.writeUInt16LE(0, 34)
  header.writeUInt16LE(0, 36)
  header.writeUInt32LE(0, 38)
  header.writeUInt32LE(entry.offset, 42)
  return Buffer.concat([header, entry.name])
}

function endOfCentralDirectory(entryCount, centralDirectorySize, centralDirectoryOffset) {
  const header = Buffer.alloc(22)
  header.writeUInt32LE(0x06054b50, 0)
  header.writeUInt16LE(0, 4)
  header.writeUInt16LE(0, 6)
  header.writeUInt16LE(entryCount, 8)
  header.writeUInt16LE(entryCount, 10)
  header.writeUInt32LE(centralDirectorySize, 12)
  header.writeUInt32LE(centralDirectoryOffset, 16)
  header.writeUInt16LE(0, 20)
  return header
}

export function writeStoredZip(outputPath, entries) {
  const normalizedEntries = entries
    .map((entry) => ({
      name: Buffer.from(entry.name.replace(/^\/+/, ''), 'utf8'),
      data: Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(String(entry.data), 'utf8'),
    }))
    .sort((left, right) => left.name.toString('utf8').localeCompare(right.name.toString('utf8')))

  const localParts = []
  let offset = 0
  const centralEntries = normalizedEntries.map((entry) => {
    const withMeta = {
      ...entry,
      crc: crc32(entry.data),
      offset,
    }
    const header = localFileHeader(withMeta)
    localParts.push(header, entry.data)
    offset += header.length + entry.data.length
    return withMeta
  })

  const centralParts = centralEntries.map((entry) => centralDirectoryHeader(entry))
  const centralDirectory = Buffer.concat(centralParts)
  const output = Buffer.concat([
    ...localParts,
    centralDirectory,
    endOfCentralDirectory(centralEntries.length, centralDirectory.length, offset),
  ])
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, output)
}
