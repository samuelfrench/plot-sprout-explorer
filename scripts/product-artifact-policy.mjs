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
export const afterSchoolStoryClubKitProductSlug = 'after-school-story-club-starter-kit'
export const museumDayStoryNotebookKitProductSlug = 'museum-day-story-notebook-kit'
export const familyGameNightStoryCardDeckProductSlug = 'family-game-night-story-card-deck'
export const grandparentStoryVisitKitProductSlug = 'grandparent-story-visit-kit'
export const thankYouNoteStoryPostcardPackProductSlug = 'thank-you-note-story-postcard-pack'
export const natureWalkStoryFieldNotesKitProductSlug = 'nature-walk-story-field-notes-kit'
export const backyardStorySeedPacketKitProductSlug = 'backyard-story-seed-packet-kit'
export const kitchenTableStoryRecipeCardDeckProductSlug = 'kitchen-table-story-recipe-card-deck'
export const bookshopStoryBookmarkPackProductSlug = 'bookshop-story-bookmark-pack'
export const writingDeskStoryPromptStripPackProductSlug = 'writing-desk-story-prompt-strip-pack'
export const windowSeatStorySceneCardPackProductSlug = 'window-seat-story-scene-card-pack'
export const quietCornerStoryMapCardPackProductSlug = 'quiet-corner-story-map-card-pack'
export const porchLightStorySignalCardPackProductSlug = 'porch-light-story-signal-card-pack'
export const pencilCaseStorySwitchCardPackProductSlug = 'pencil-case-story-switch-card-pack'
export const notebookMarginStoryRevisionCardPackProductSlug = 'notebook-margin-story-revision-card-pack'
export const deskDrawerStorySequenceCardPackProductSlug = 'desk-drawer-story-sequence-card-pack'
export const readingNookStoryCauseEffectCardPackProductSlug = 'reading-nook-story-cause-effect-card-pack'

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

const requiredAfterSchoolStoryClubArtifactPaths = {
  pdfPath: 'product-build/after-school-story-club-starter-kit/After-School-Story-Club-Starter-Kit.pdf',
  zipPath: 'product-build/after-school-story-club-starter-kit/after-school-story-club-starter-kit.zip',
  sourceHtmlPath: 'product-build/after-school-story-club-starter-kit/source/after-school-story-club-starter-kit.html',
  manifestPath: 'product-build/after-school-story-club-starter-kit/manifest.json',
}

const requiredMuseumDayStoryNotebookArtifactPaths = {
  pdfPath: 'product-build/museum-day-story-notebook-kit/Museum-Day-Story-Notebook-Kit.pdf',
  zipPath: 'product-build/museum-day-story-notebook-kit/museum-day-story-notebook-kit.zip',
  sourceHtmlPath: 'product-build/museum-day-story-notebook-kit/source/museum-day-story-notebook-kit.html',
  manifestPath: 'product-build/museum-day-story-notebook-kit/manifest.json',
}

const requiredFamilyGameNightStoryCardDeckArtifactPaths = {
  pdfPath: 'product-build/family-game-night-story-card-deck/Family-Game-Night-Story-Card-Deck.pdf',
  zipPath: 'product-build/family-game-night-story-card-deck/family-game-night-story-card-deck.zip',
  sourceHtmlPath: 'product-build/family-game-night-story-card-deck/source/family-game-night-story-card-deck.html',
  manifestPath: 'product-build/family-game-night-story-card-deck/manifest.json',
}

const requiredGrandparentStoryVisitKitArtifactPaths = {
  pdfPath: 'product-build/grandparent-story-visit-kit/Grandparent-Story-Visit-Kit.pdf',
  zipPath: 'product-build/grandparent-story-visit-kit/grandparent-story-visit-kit.zip',
  sourceHtmlPath: 'product-build/grandparent-story-visit-kit/source/grandparent-story-visit-kit.html',
  manifestPath: 'product-build/grandparent-story-visit-kit/manifest.json',
}

const requiredThankYouNoteStoryPostcardPackArtifactPaths = {
  pdfPath: 'product-build/thank-you-note-story-postcard-pack/Thank-You-Note-Story-Postcard-Pack.pdf',
  zipPath: 'product-build/thank-you-note-story-postcard-pack/thank-you-note-story-postcard-pack.zip',
  sourceHtmlPath:
    'product-build/thank-you-note-story-postcard-pack/source/thank-you-note-story-postcard-pack.html',
  manifestPath: 'product-build/thank-you-note-story-postcard-pack/manifest.json',
}

const requiredNatureWalkStoryFieldNotesKitArtifactPaths = {
  pdfPath: 'product-build/nature-walk-story-field-notes-kit/Nature-Walk-Story-Field-Notes-Kit.pdf',
  zipPath: 'product-build/nature-walk-story-field-notes-kit/nature-walk-story-field-notes-kit.zip',
  sourceHtmlPath:
    'product-build/nature-walk-story-field-notes-kit/source/nature-walk-story-field-notes-kit.html',
  manifestPath: 'product-build/nature-walk-story-field-notes-kit/manifest.json',
}

const requiredBackyardStorySeedPacketKitArtifactPaths = {
  pdfPath: 'product-build/backyard-story-seed-packet-kit/Backyard-Story-Seed-Packet-Kit.pdf',
  zipPath: 'product-build/backyard-story-seed-packet-kit/backyard-story-seed-packet-kit.zip',
  sourceHtmlPath:
    'product-build/backyard-story-seed-packet-kit/source/backyard-story-seed-packet-kit.html',
  manifestPath: 'product-build/backyard-story-seed-packet-kit/manifest.json',
}

const requiredKitchenTableStoryRecipeCardDeckArtifactPaths = {
  pdfPath: 'product-build/kitchen-table-story-recipe-card-deck/Kitchen-Table-Story-Recipe-Card-Deck.pdf',
  zipPath: 'product-build/kitchen-table-story-recipe-card-deck/kitchen-table-story-recipe-card-deck.zip',
  sourceHtmlPath:
    'product-build/kitchen-table-story-recipe-card-deck/source/kitchen-table-story-recipe-card-deck.html',
  manifestPath: 'product-build/kitchen-table-story-recipe-card-deck/manifest.json',
}

const requiredBookshopStoryBookmarkPackArtifactPaths = {
  pdfPath: 'product-build/bookshop-story-bookmark-pack/Bookshop-Story-Bookmark-Pack.pdf',
  zipPath: 'product-build/bookshop-story-bookmark-pack/bookshop-story-bookmark-pack.zip',
  sourceHtmlPath: 'product-build/bookshop-story-bookmark-pack/source/bookshop-story-bookmark-pack.html',
  manifestPath: 'product-build/bookshop-story-bookmark-pack/manifest.json',
}

const requiredWritingDeskStoryPromptStripPackArtifactPaths = {
  pdfPath: 'product-build/writing-desk-story-prompt-strip-pack/Writing-Desk-Story-Prompt-Strip-Pack.pdf',
  zipPath: 'product-build/writing-desk-story-prompt-strip-pack/writing-desk-story-prompt-strip-pack.zip',
  sourceHtmlPath:
    'product-build/writing-desk-story-prompt-strip-pack/source/writing-desk-story-prompt-strip-pack.html',
  manifestPath: 'product-build/writing-desk-story-prompt-strip-pack/manifest.json',
}

const requiredWindowSeatStorySceneCardPackArtifactPaths = {
  pdfPath: 'product-build/window-seat-story-scene-card-pack/Window-Seat-Story-Scene-Card-Pack.pdf',
  zipPath: 'product-build/window-seat-story-scene-card-pack/window-seat-story-scene-card-pack.zip',
  sourceHtmlPath:
    'product-build/window-seat-story-scene-card-pack/source/window-seat-story-scene-card-pack.html',
  manifestPath: 'product-build/window-seat-story-scene-card-pack/manifest.json',
}

const requiredQuietCornerStoryMapCardPackArtifactPaths = {
  pdfPath: 'product-build/quiet-corner-story-map-card-pack/Quiet-Corner-Story-Map-Card-Pack.pdf',
  zipPath: 'product-build/quiet-corner-story-map-card-pack/quiet-corner-story-map-card-pack.zip',
  sourceHtmlPath:
    'product-build/quiet-corner-story-map-card-pack/source/quiet-corner-story-map-card-pack.html',
  manifestPath: 'product-build/quiet-corner-story-map-card-pack/manifest.json',
}

const requiredPorchLightStorySignalCardPackArtifactPaths = {
  pdfPath: 'product-build/porch-light-story-signal-card-pack/Porch-Light-Story-Signal-Card-Pack.pdf',
  zipPath: 'product-build/porch-light-story-signal-card-pack/porch-light-story-signal-card-pack.zip',
  sourceHtmlPath:
    'product-build/porch-light-story-signal-card-pack/source/porch-light-story-signal-card-pack.html',
  manifestPath: 'product-build/porch-light-story-signal-card-pack/manifest.json',
}

const requiredPencilCaseStorySwitchCardPackArtifactPaths = {
  pdfPath: 'product-build/pencil-case-story-switch-card-pack/Pencil-Case-Story-Switch-Card-Pack.pdf',
  zipPath: 'product-build/pencil-case-story-switch-card-pack/pencil-case-story-switch-card-pack.zip',
  sourceHtmlPath:
    'product-build/pencil-case-story-switch-card-pack/source/pencil-case-story-switch-card-pack.html',
  manifestPath: 'product-build/pencil-case-story-switch-card-pack/manifest.json',
}

const requiredNotebookMarginStoryRevisionCardPackArtifactPaths = {
  pdfPath: 'product-build/notebook-margin-story-revision-card-pack/Notebook-Margin-Story-Revision-Card-Pack.pdf',
  zipPath: 'product-build/notebook-margin-story-revision-card-pack/notebook-margin-story-revision-card-pack.zip',
  sourceHtmlPath:
    'product-build/notebook-margin-story-revision-card-pack/source/notebook-margin-story-revision-card-pack.html',
  manifestPath: 'product-build/notebook-margin-story-revision-card-pack/manifest.json',
}

const requiredDeskDrawerStorySequenceCardPackArtifactPaths = {
  pdfPath: 'product-build/desk-drawer-story-sequence-card-pack/Desk-Drawer-Story-Sequence-Card-Pack.pdf',
  zipPath: 'product-build/desk-drawer-story-sequence-card-pack/desk-drawer-story-sequence-card-pack.zip',
  sourceHtmlPath:
    'product-build/desk-drawer-story-sequence-card-pack/source/desk-drawer-story-sequence-card-pack.html',
  manifestPath: 'product-build/desk-drawer-story-sequence-card-pack/manifest.json',
}

const requiredReadingNookStoryCauseEffectCardPackArtifactPaths = {
  pdfPath:
    'product-build/reading-nook-story-cause-effect-card-pack/Reading-Nook-Story-Cause-Effect-Card-Pack.pdf',
  zipPath:
    'product-build/reading-nook-story-cause-effect-card-pack/reading-nook-story-cause-effect-card-pack.zip',
  sourceHtmlPath:
    'product-build/reading-nook-story-cause-effect-card-pack/source/reading-nook-story-cause-effect-card-pack.html',
  manifestPath: 'product-build/reading-nook-story-cause-effect-card-pack/manifest.json',
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
    .replace(/\bdoes not need accounts?, uploads?, photos?, recordings?, or public posting\b/gi, '')
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

export function validateProductWorldSummaries(product, label, options = {}) {
  const errors = []
  const linkedWorldSlugs = Array.isArray(product?.worldSlugs) ? product.worldSlugs : []
  const expectedSummarySlugs = new Set(linkedWorldSlugs)
  pushIf(errors, !Array.isArray(product?.worldSummaries), `${label} worldSummaries must be an array.`)
  if (!Array.isArray(product?.worldSummaries)) return errors

  pushIf(
    errors,
    product.worldSummaries.length !== expectedSummarySlugs.size,
    `${label} worldSummaries must cover every linked world.`,
  )
  const seenSummarySlugs = new Set()
  product.worldSummaries.forEach((summary, index) => {
    pushIf(errors, !isObject(summary), `${label} worldSummaries[${index}] must be an object.`)
    if (!isObject(summary)) return
    validateString(summary.slug, `${label} worldSummaries[${index}].slug`, errors)
    validateString(summary.summary, `${label} worldSummaries[${index}].summary`, errors)
    pushIf(
      errors,
      isNonEmptyString(summary.slug) && !expectedSummarySlugs.has(summary.slug),
      `${label} worldSummaries[${index}].slug must match a linked world slug.`,
    )
    pushIf(
      errors,
      isNonEmptyString(summary.slug) && seenSummarySlugs.has(summary.slug),
      `${label} worldSummaries[${index}].slug is duplicated.`,
    )
    if (isNonEmptyString(summary.slug)) seenSummarySlugs.add(summary.slug)
    if (options.blockedSummaryPattern) {
      pushIf(
        errors,
        isNonEmptyString(summary.summary) && options.blockedSummaryPattern.test(summary.summary),
        options.blockedSummaryMessage ??
          `${label} worldSummaries[${index}].summary includes blocked product-specific language.`,
      )
    }
  })
  for (const worldSlug of linkedWorldSlugs) {
    pushIf(errors, !seenSummarySlugs.has(worldSlug), `${label} worldSummaries missing linked world slug ${worldSlug}.`)
  }
  return errors
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
    /\bcampfires?\b|\bfire pit(s)?\b|\bflames?\b|\bmatchstick(s)?\b|\bstrike(s|d|ing)? a match\b|\blight(s|ed|ing)? a match\b|\blighter(s)?\b|\bswim(ming)?\b|\bdeep water\b|\bopen water\b|\bcliff(s)?\b|\brope course(s)?\b|\barchery\b|\bknife|knives\b/i.test(
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

function validateNoUnsafeAfterSchoolLanguage(value, label, errors) {
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
    /\brosters?\b|\battendance\b|\bsign-?in\b|\bchild names?\b|\bstudent names?\b|\binitials\b|\bsurnames?\b|\bschool names?\b|\bphotos?\b|\baddresses?\b|\bbehavior reports?\b|\bupload(s|ed|ing)?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bpublic publishing\b|\bpublish online\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\btherapy\b|\btherapist\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b/i.test(
      text,
    ),
    `${label} includes roster, attendance, sign-in, child-name, photo, address, behavior, medical, legal, therapy, diagnosis, assessment, grade, score, or guaranteed-outcome language.`,
  )
  pushIf(
    errors,
    /\bcampfires?\b|\bfire pit(s)?\b|\bflames?\b|\bmatchstick(s)?\b|\bstrike(s|d|ing)? a match\b|\blight(s|ed|ing)? a match\b|\blighter(s)?\b|\bswim(ming)?\b|\bdeep water\b|\bopen water\b|\bcliff(s)?\b|\brope course(s)?\b|\barchery\b|\bknife|knives\b/i.test(
      rawText,
    ),
    `${label} includes unsafe fire, water, or outdoor-risk language.`,
  )
}

function validateAfterSchoolClubSession(
  session,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  sessionIds,
  errors,
) {
  const label = `sessions[${index}]`
  pushIf(errors, !isObject(session), `${label} must be an object.`)
  if (!isObject(session)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'clubSkill',
    'sessionFit',
    'directorSetup',
    'kidDirection',
    'facilitatorPrompt',
    'clubShareLine',
    'wrapUpLine',
    'quietOptionLine',
    'takeHomePromptLine',
  ]) {
    validateString(session[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(session.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(session.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !session.id.startsWith('after-school-'), `${label}.id must start with after-school-.`)
    pushIf(errors, sessionIds.has(session.id), `${label}.id is duplicated.`)
    sessionIds.add(session.id)
  }

  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '9-11', '10-11'].includes(session.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(session.worldSlug) && !knownWorldSlugs.has(session.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(session.worldSlug) && !sourceWorldSlugs.has(session.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(session.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(session.ageBand) && isNonEmptyString(worldAgeBand) && session.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${session.worldSlug} ageBand ${worldAgeBand}.`,
  )

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
          pushIf(errors, isNonEmptyString(line) && !hasWritableBlank(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
        })
      }
    })
  }

  for (const key of ['clubShareLine', 'wrapUpLine', 'quietOptionLine', 'takeHomePromptLine']) {
    pushIf(errors, isNonEmptyString(session[key]) && !hasWritableBlank(session[key]), `${label}.${key} must include a writable blank.`)
  }
  validateNoUnsafeAfterSchoolLanguage(session, label, errors)
}

function validateClubFormat(format, index, names, errors) {
  const label = `clubFormats[${index}]`
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
  validateNoUnsafeAfterSchoolLanguage(format, label, errors)
}

function validateTakeHomePromptCard(card, index, titles, errors) {
  const label = `takeHomePromptCards[${index}]`
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
  validateNoUnsafeAfterSchoolLanguage(card, label, errors)
}

export function validateAfterSchoolStoryClubKitSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'After-School Story Club Starter Kit source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch18', 'batchId must be 2026-06-02-batch18.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== afterSchoolStoryClubKitProductSlug,
    `productSlug must be ${afterSchoolStoryClubKitProductSlug}.`,
  )
  pushIf(errors, source.title !== 'After-School Story Club Starter Kit', 'title must be After-School Story Club Starter Kit.')
  pushIf(errors, source.pricePoint !== '$69', 'pricePoint must be $69.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'After-School source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'After-School source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'After-School source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 18, 'worldSlugs must have exactly 18 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredAfterSchoolStoryClubArtifactPaths, 'After-School', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.directorGuide), 'directorGuide must be an object.')
  if (isObject(source.directorGuide)) {
    validateExactStringArray(source.directorGuide.beforeClub, 5, 'directorGuide.beforeClub', errors)
    validateExactStringArray(source.directorGuide.roomSetup, 5, 'directorGuide.roomSetup', errors)
    validateExactStringArray(source.directorGuide.runningClub, 5, 'directorGuide.runningClub', errors)
    validateExactStringArray(source.directorGuide.quietParticipation, 5, 'directorGuide.quietParticipation', errors)
    validateExactStringArray(source.directorGuide.noDataUse, 4, 'directorGuide.noDataUse', errors)
    validateExactStringArray(source.directorGuide.familyHandoff, 4, 'directorGuide.familyHandoff', errors)
    validateNoUnsafeAfterSchoolLanguage(source.directorGuide, 'directorGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.clubFormats), 'clubFormats must be an array.')
  if (Array.isArray(source.clubFormats)) {
    pushIf(errors, source.clubFormats.length !== 6, 'clubFormats must have exactly 6 entries.')
    const names = new Set()
    source.clubFormats.forEach((format, index) => validateClubFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomePromptCards), 'takeHomePromptCards must be an array.')
  if (Array.isArray(source.takeHomePromptCards)) {
    pushIf(errors, source.takeHomePromptCards.length !== 12, 'takeHomePromptCards must have exactly 12 entries.')
    const titles = new Set()
    source.takeHomePromptCards.forEach((card, index) => validateTakeHomePromptCard(card, index, titles, errors))
  }

  validateExactStringArray(source.optionalFamilySharePrompts, 8, 'optionalFamilySharePrompts', errors)

  pushIf(errors, !Array.isArray(source.sessions), 'sessions must be an array.')
  if (Array.isArray(source.sessions)) {
    pushIf(errors, source.sessions.length !== 18, 'sessions must have exactly 18 entries.')
    const sessionIds = new Set()
    const coveredWorlds = new Set()
    source.sessions.forEach((session, index) => {
      validateAfterSchoolClubSession(session, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, sessionIds, errors)
      if (isNonEmptyString(session?.worldSlug)) coveredWorlds.add(session.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 18, 'sessions must cover at least 18 unique worlds.')
  }

  validateNoUnsafeAfterSchoolLanguage(source, 'After-School Story Club Starter Kit source', errors)
  validateNoFamilySafetyLanguage(source, 'After-School Story Club Starter Kit source', errors)
  validateNoRiskyLanguage(source, 'After-School Story Club Starter Kit source', errors)
  return errors
}

function validateNoUnsafeMuseumDayLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const text = rawText
    .replace(/\bno\s+accounts?\b/gi, '')
    .replace(/\bno\s+child accounts?\b/gi, '')
    .replace(/\bno\s+student data\b/gi, '')
    .replace(/\bno\s+data use\b/gi, '')
    .replace(/\bno\s+uploads?\b/gi, '')
    .replace(/\bno\s+public publishing\b/gi, '')
    .replace(/\bwithout\s+accounts?\b/gi, '')
    .replace(/\bwithout\s+child accounts?\b/gi, '')
    .replace(/\bwithout\s+student data\b/gi, '')
    .replace(/\bwithout\s+uploads?\b/gi, '')
    .replace(/\bwithout\s+public publishing\b/gi, '')
    .replace(/\bkeep names off pages\b/gi, '')
    .replace(/\bkeep pages offline\b/gi, '')
    .replace(/\binvented names only\b/gi, '')
    .replace(/\binvented choices only\b/gi, '')
  pushIf(
    errors,
    /\brosters?\b|\battendance\b|\bsign-?in\b|\bchild names?\b|\bstudent names?\b|\binitials\b|\bsurnames?\b|\bschool names?\b|\bphotos?\b|\baddresses?\b|\bbehavior reports?\b|\bupload(s|ed|ing)?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bpublic publishing\b|\bpublish online\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\btherapy\b|\btherapist\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b/i.test(
      text,
    ),
    `${label} includes roster, attendance, sign-in, child-name, photo, address, behavior, medical, legal, therapy, diagnosis, assessment, grade, score, or guaranteed-outcome language.`,
  )
  pushIf(
    errors,
    /\bemergency\b|\btraffic\b|\bcross(ing)? the street\b|\brun across\b|\bparking lot(s)?\b|\bmeet outside\b|\bsolo travel\b|\bunaccompanied\b|\bcliff(s)?\b|\brope course(s)?\b|\bswim(ming)?\b|\bdeep water\b|\bopen water\b|\bcampfires?\b|\bfire pit(s)?\b|\bflames?\b|\bmatchstick(s)?\b|\blighter(s)?\b|\bknife|knives\b/i.test(
      rawText,
    ),
    `${label} includes unsafe travel, outdoor-risk, or emergency instruction language.`,
  )
}

function validateMuseumNotebookPage(page, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, pageIds, errors) {
  const label = `pages[${index}]`
  pushIf(errors, !isObject(page), `${label} must be an object.`)
  if (!isObject(page)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'notebookSkill',
    'visitFit',
    'adultSetup',
    'kidDirection',
    'guidePrompt',
    'shareLine',
    'wrapUpLine',
    'quietOptionLine',
    'takeHomePromptLine',
  ]) {
    validateString(page[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(page.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !page.id.startsWith('museum-day-'), `${label}.id must start with museum-day-.`)
    pushIf(errors, pageIds.has(page.id), `${label}.id is duplicated.`)
    pageIds.add(page.id)
  }

  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '9-11', '10-11'].includes(page.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(page.worldSlug) && !knownWorldSlugs.has(page.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(page.worldSlug) && !sourceWorldSlugs.has(page.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(page.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(page.ageBand) && isNonEmptyString(worldAgeBand) && page.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${page.worldSlug} ageBand ${worldAgeBand}.`,
  )

  pushIf(errors, !Array.isArray(page.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(page.pageSections)) {
    pushIf(errors, page.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    page.pageSections.forEach((section, sectionIndex) => {
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

  for (const key of ['shareLine', 'wrapUpLine', 'quietOptionLine', 'takeHomePromptLine']) {
    pushIf(errors, isNonEmptyString(page[key]) && !hasWritableBlank(page[key]), `${label}.${key} must include a writable blank.`)
  }
  validateNoUnsafeMuseumDayLanguage(page, label, errors)
}

function validateVisitFormat(format, index, names, errors) {
  const label = `visitFormats[${index}]`
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
  validateNoUnsafeMuseumDayLanguage(format, label, errors)
}

function validateTakeHomeObservationCard(card, index, titles, errors) {
  const label = `takeHomeObservationCards[${index}]`
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
  validateNoUnsafeMuseumDayLanguage(card, label, errors)
}

export function validateMuseumDayStoryNotebookKitSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Museum Day Story Notebook Kit source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch19', 'batchId must be 2026-06-02-batch19.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== museumDayStoryNotebookKitProductSlug,
    `productSlug must be ${museumDayStoryNotebookKitProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Museum Day Story Notebook Kit', 'title must be Museum Day Story Notebook Kit.')
  pushIf(errors, source.pricePoint !== '$37', 'pricePoint must be $37.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Museum Day source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Museum Day source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Museum Day source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 15, 'worldSlugs must have exactly 15 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredMuseumDayStoryNotebookArtifactPaths, 'Museum Day', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateExactStringArray(source.adultGuide.beforeVisit, 5, 'adultGuide.beforeVisit', errors)
    validateExactStringArray(source.adultGuide.tableSetup, 5, 'adultGuide.tableSetup', errors)
    validateExactStringArray(source.adultGuide.observationToStory, 5, 'adultGuide.observationToStory', errors)
    validateExactStringArray(source.adultGuide.quietParticipation, 5, 'adultGuide.quietParticipation', errors)
    validateExactStringArray(source.adultGuide.noDataUse, 4, 'adultGuide.noDataUse', errors)
    validateExactStringArray(source.adultGuide.familyHandoff, 4, 'adultGuide.familyHandoff', errors)
    validateNoUnsafeMuseumDayLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.visitFormats), 'visitFormats must be an array.')
  if (Array.isArray(source.visitFormats)) {
    pushIf(errors, source.visitFormats.length !== 6, 'visitFormats must have exactly 6 entries.')
    const names = new Set()
    source.visitFormats.forEach((format, index) => validateVisitFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeObservationCards), 'takeHomeObservationCards must be an array.')
  if (Array.isArray(source.takeHomeObservationCards)) {
    pushIf(errors, source.takeHomeObservationCards.length !== 10, 'takeHomeObservationCards must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeObservationCards.forEach((card, index) => validateTakeHomeObservationCard(card, index, titles, errors))
  }

  validateExactStringArray(source.optionalFamilySharePrompts, 8, 'optionalFamilySharePrompts', errors)

  pushIf(errors, !Array.isArray(source.pages), 'pages must be an array.')
  if (Array.isArray(source.pages)) {
    pushIf(errors, source.pages.length !== 15, 'pages must have exactly 15 entries.')
    const pageIds = new Set()
    const coveredWorlds = new Set()
    source.pages.forEach((page, index) => {
      validateMuseumNotebookPage(page, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, pageIds, errors)
      if (isNonEmptyString(page?.worldSlug)) coveredWorlds.add(page.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 15, 'pages must cover at least 15 unique worlds.')
  }

  validateNoUnsafeMuseumDayLanguage(source, 'Museum Day Story Notebook Kit source', errors)
  validateNoFamilySafetyLanguage(source, 'Museum Day Story Notebook Kit source', errors)
  validateNoRiskyLanguage(source, 'Museum Day Story Notebook Kit source', errors)
  return errors
}

function validateNoUnsafeFamilyGameNightLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const text = rawText
    .replace(/\bno\s+scores?\b/gi, '')
    .replace(/\bno\s+scoring\b/gi, '')
    .replace(/\bno\s+winners?\b/gi, '')
    .replace(/\bno\s+teams?\b/gi, '')
    .replace(/\bno\s+competition\b/gi, '')
    .replace(/\bno\s+gambling\b/gi, '')
    .replace(/\bno\s+betting\b/gi, '')
    .replace(/\bno\s+dares?\b/gi, '')
    .replace(/\bno\s+prizes?\b/gi, '')
    .replace(/\bno\s+leaderboards?\b/gi, '')
    .replace(/\bwithout\s+scores?\b/gi, '')
    .replace(/\bwithout\s+scoring\b/gi, '')
    .replace(/\bwithout\s+winners?\b/gi, '')
    .replace(/\bwithout\s+teams?\b/gi, '')
    .replace(/\bwithout\s+competition\b/gi, '')
    .replace(/\bwithout\s+gambling\b/gi, '')
    .replace(/\bwithout\s+betting\b/gi, '')
    .replace(/\bwithout\s+dares?\b/gi, '')
    .replace(/\bwithout\s+prizes?\b/gi, '')
    .replace(/\bwithout\s+leaderboards?\b/gi, '')
    .replace(/\bno\s+accounts?\b/gi, '')
    .replace(/\bno\s+child accounts?\b/gi, '')
    .replace(/\bno\s+student data\b/gi, '')
    .replace(/\bno\s+data use\b/gi, '')
    .replace(/\bno\s+uploads?\b/gi, '')
    .replace(/\bno\s+public publishing\b/gi, '')
    .replace(/\bwithout\s+accounts?\b/gi, '')
    .replace(/\bwithout\s+child accounts?\b/gi, '')
    .replace(/\bwithout\s+student data\b/gi, '')
    .replace(/\bwithout\s+uploads?\b/gi, '')
    .replace(/\bwithout\s+public publishing\b/gi, '')
    .replace(/\bkeep pages offline\b/gi, '')
    .replace(/\binvented choices only\b/gi, '')
  pushIf(
    errors,
    /\bscores?\b|\bscoring\b|\bscorecards?\b|\bwinners?\b|\bwinning\b|\bteams?\b|\bcompetition\b|\bcompetitive\b|\bcompete(s|d|ing)?\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bdares?\b|\bprizes?\b|\bleaderboards?\b|\btimer(s)?\b|\btimed\b|\brace(s|d)?\b/i.test(
      text,
    ),
    `${label} includes scoring, winner, team, gambling, betting, dare, prize, leaderboard, timer-pressure, or competition language.`,
  )
  pushIf(
    errors,
    /\brosters?\b|\battendance\b|\bsign-?in\b|\bchild names?\b|\bstudent names?\b|\binitials\b|\bsurnames?\b|\bschool names?\b|\bphotos?\b|\baddresses?\b|\bbehavior reports?\b|\bupload(s|ed|ing)?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bpublic publishing\b|\bpublish online\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\btherapy\b|\btherapist\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b/i.test(
      text,
    ),
    `${label} includes roster, attendance, sign-in, child-name, photo, address, behavior, medical, legal, therapy, diagnosis, assessment, grade, score, or guaranteed-outcome language.`,
  )
  pushIf(
    errors,
    /\bchase(s|d|ing)?\b|\brun(s|ning)?\b|\bjump(s|ed|ing)?\b|\bhide and seek\b|\btag\b|\bclimb(s|ed|ing)?\b|\bthrow(s|ing)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bkitchen knife|knives\b|\bflames?\b|\bmatchstick(s)?\b|\blighter(s)?\b/i.test(
      rawText,
    ),
    `${label} includes unsafe physical game instruction language.`,
  )
}

function validateFamilyGameNightCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'cardSkill',
    'tableFit',
    'adultSetup',
    'kidDirection',
    'hostPrompt',
    'tableTalkLine',
    'tinyDraftLine',
    'roundWrapLine',
    'quietOptionLine',
    'takeHomeStoryLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !card.id.startsWith('family-game-night-card-'), `${label}.id must start with family-game-night-card-.`)
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }

  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '9-11', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  pushIf(errors, !Array.isArray(card.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(card.pageSections)) {
    pushIf(errors, card.pageSections.length !== 3, `${label}.pageSections must have exactly 3 entries.`)
    card.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !hasWritableBlank(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
          pushIf(errors, isNonEmptyString(line) && hasSnakeCasePlaceholder(line), `${sectionLabel}.lines[${lineIndex}] must use human-readable text, not snake_case placeholders.`)
        })
      }
    })
  }

  for (const key of ['tableTalkLine', 'tinyDraftLine', 'roundWrapLine', 'quietOptionLine', 'takeHomeStoryLine']) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeFamilyGameNightLanguage(card, label, errors)
}

function validateFamilyGameNightRoundFormat(format, index, names, errors) {
  const label = `roundFormats[${index}]`
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
  validateNoUnsafeFamilyGameNightLanguage(format, label, errors)
}

function validateTakeHomeStoryStarter(card, index, titles, errors) {
  const label = `takeHomeStoryStarters[${index}]`
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
  validateNoUnsafeFamilyGameNightLanguage(card, label, errors)
}

export function validateFamilyGameNightStoryCardDeckSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Family Game Night Story Card Deck source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch20', 'batchId must be 2026-06-02-batch20.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== familyGameNightStoryCardDeckProductSlug,
    `productSlug must be ${familyGameNightStoryCardDeckProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Family Game Night Story Card Deck', 'title must be Family Game Night Story Card Deck.')
  pushIf(errors, source.pricePoint !== '$27', 'pricePoint must be $27.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Family Game Night source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Family Game Night source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Family Game Night source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 15, 'worldSlugs must have exactly 15 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredFamilyGameNightStoryCardDeckArtifactPaths, 'Family Game Night', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.hostGuide), 'hostGuide must be an object.')
  if (isObject(source.hostGuide)) {
    validateStringArray(source.hostGuide.tableSetup, 5, 'hostGuide.tableSetup', errors)
    validateStringArray(source.hostGuide.roundHosting, 5, 'hostGuide.roundHosting', errors)
    validateStringArray(source.hostGuide.quietParticipation, 5, 'hostGuide.quietParticipation', errors)
    validateStringArray(source.hostGuide.noDataUse, 4, 'hostGuide.noDataUse', errors)
    validateStringArray(source.hostGuide.familyHandoff, 4, 'hostGuide.familyHandoff', errors)
    validateStringArray(source.hostGuide.packReset, 4, 'hostGuide.packReset', errors)
    validateNoUnsafeFamilyGameNightLanguage(source.hostGuide, 'hostGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.roundFormats), 'roundFormats must be an array.')
  if (Array.isArray(source.roundFormats)) {
    pushIf(errors, source.roundFormats.length !== 6, 'roundFormats must have exactly 6 entries.')
    const names = new Set()
    source.roundFormats.forEach((format, index) => validateFamilyGameNightRoundFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeStoryStarters), 'takeHomeStoryStarters must be an array.')
  if (Array.isArray(source.takeHomeStoryStarters)) {
    pushIf(errors, source.takeHomeStoryStarters.length !== 10, 'takeHomeStoryStarters must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeStoryStarters.forEach((card, index) => validateTakeHomeStoryStarter(card, index, titles, errors))
  }

  validateExactStringArray(source.optionalFamilySharePrompts, 8, 'optionalFamilySharePrompts', errors)

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 15, 'cards must have exactly 15 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateFamilyGameNightCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 15, 'cards must cover at least 15 unique worlds.')
  }

  validateNoUnsafeFamilyGameNightLanguage(source, 'Family Game Night Story Card Deck source', errors)
  validateNoFamilySafetyLanguage(source, 'Family Game Night Story Card Deck source', errors)
  validateNoRiskyLanguage(source, 'Family Game Night Story Card Deck source', errors)
  return errors
}

function validateNoUnsafeGrandparentStoryVisitLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const personalText = rawText
    .replace(/\bskip real names?\b/gi, '')
    .replace(/\bkeep pages offline\b/gi, '')
    .replace(/\binvented details?\b/gi, '')
    .replace(/\binvented helpers?\b/gi, '')
    .replace(/\binvented places?\b/gi, '')
    .replace(/\binvented choices?\b/gi, '')
    .replace(/\bno personal records?\b/gi, '')
    .replace(/\bwithout personal records?\b/gi, '')
    .replace(/\bno-data use\b/gi, '')
  pushIf(
    errors,
    /\bfamily\s+trees?\b|\bgenealog(y|ies|ical)\b|\bfamily names?\b|\bchild names?\b|\bstudent names?\b|\bphotos?\b|\baddresses?\b|\bphone numbers?\b|\bphones?\b|\brecording(s)?\b|\brecord(ed|s|ing)?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic publishing\b|\bpublish online\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b/i.test(
      personalText,
    ),
    `${label} includes family-tree, genealogy, family-name, child-name, photo, address, phone, recording, account, upload, public-publishing, roster, attendance, sign-in, or behavior-report language.`,
  )

  const safetyText = rawText
    .replace(/\bno\s+scores?\b/gi, '')
    .replace(/\bno\s+scoring\b/gi, '')
    .replace(/\bno\s+grades?\b/gi, '')
    .replace(/\bno\s+contest(s)?\b/gi, '')
    .replace(/\bno\s+prizes?\b/gi, '')
    .replace(/\bno\s+timers?\b/gi, '')
    .replace(/\bno\s+timer pressure\b/gi, '')
    .replace(/\bno\s+gambling\b/gi, '')
    .replace(/\bwithout\s+scores?\b/gi, '')
    .replace(/\bwithout\s+scoring\b/gi, '')
    .replace(/\bwithout\s+grades?\b/gi, '')
    .replace(/\bwithout\s+contest(s)?\b/gi, '')
    .replace(/\bwithout\s+prizes?\b/gi, '')
    .replace(/\bwithout\s+timer pressure\b/gi, '')
    .replace(/\bwithout\s+gambling\b/gi, '')
  pushIf(
    errors,
    /\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief counseling\b|\bfamily conflict\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bchase(s|d|ing)?\b|\brun(s|ning)?\b|\bjump(s|ed|ing)?\b|\bhide and seek\b|\btag\b|\bclimb(s|ed|ing)?\b|\bthrow(s|ing)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bkitchen knife|knives\b|\bflames?\b|\bmatchstick(s)?\b|\blighter(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes medical, legal, therapy, diagnosis, grief-counseling, family-conflict, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, or unsafe physical language.`,
  )

  const familyText = rawText
    .replaceAll(requiredSafety, '')
    .replace(/\bno\s+weapon(s)?\b/gi, '')
    .replace(/\bno\s+branded characters\b/gi, '')
    .replace(/\bno\s+scary harm\b/gi, '')
    .replace(/\bno\s+romance\b/gi, '')
  pushIf(
    errors,
    familySafetyBlockedTerms.some((pattern) => pattern.test(familyText)),
    `${label} includes political, branded, romance, scary, violent, weapon, gambling, ad-targeting, or pressure language.`,
  )
}

function validateGrandparentVisitQuest(quest, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, questIds, errors) {
  const label = `visitQuests[${index}]`
  pushIf(errors, !isObject(quest), `${label} must be an object.`)
  if (!isObject(quest)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'visitSkill',
    'visitFit',
    'adultSetup',
    'kidDirection',
    'hostPrompt',
    'quietOption',
    'takeHomeLine',
  ]) {
    validateString(quest[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(quest.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(quest.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !quest.id.startsWith('grandparent-visit-quest-'), `${label}.id must start with grandparent-visit-quest-.`)
    pushIf(errors, questIds.has(quest.id), `${label}.id is duplicated.`)
    questIds.add(quest.id)
  }

  pushIf(errors, !['7-8', '7-9', '8-10', '10-11'].includes(quest.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(quest.worldSlug) && !knownWorldSlugs.has(quest.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(quest.worldSlug) && !sourceWorldSlugs.has(quest.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(quest.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(quest.ageBand) && isNonEmptyString(worldAgeBand) && quest.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${quest.worldSlug} ageBand ${worldAgeBand}.`,
  )

  pushIf(errors, !Array.isArray(quest.pageSections), `${label}.pageSections must be an array.`)
  if (Array.isArray(quest.pageSections)) {
    pushIf(errors, quest.pageSections.length !== 4, `${label}.pageSections must have exactly 4 entries.`)
    quest.pageSections.forEach((section, sectionIndex) => {
      const sectionLabel = `${label}.pageSections[${sectionIndex}]`
      pushIf(errors, !isObject(section), `${sectionLabel} must be an object.`)
      if (!isObject(section)) return
      validateString(section.heading, `${sectionLabel}.heading`, errors)
      validateExactStringArray(section.lines, 3, `${sectionLabel}.lines`, errors)
      if (Array.isArray(section.lines)) {
        section.lines.forEach((line, lineIndex) => {
          pushIf(errors, isNonEmptyString(line) && !hasWritableBlank(line), `${sectionLabel}.lines[${lineIndex}] must include a writable blank.`)
          pushIf(errors, isNonEmptyString(line) && hasSnakeCasePlaceholder(line), `${sectionLabel}.lines[${lineIndex}] must use human-readable text, not snake_case placeholders.`)
        })
      }
    })
  }

  for (const key of ['quietOption', 'takeHomeLine']) {
    pushIf(errors, isNonEmptyString(quest[key]) && !hasWritableBlank(quest[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(quest[key]) && hasSnakeCasePlaceholder(quest[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeGrandparentStoryVisitLanguage(quest, label, errors)
}

function validateGrandparentVisitFormat(format, index, names, errors) {
  const label = `visitFormats[${index}]`
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
  if (Array.isArray(format.steps)) {
    format.steps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.steps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.steps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  validateNoUnsafeGrandparentStoryVisitLanguage(format, label, errors)
}

function validateGrandparentTakeHomePostcard(card, index, titles, errors) {
  const label = `takeHomePostcards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(card[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(card.title)) {
    pushIf(errors, titles.has(card.title), `${label}.title is duplicated.`)
    titles.add(card.title)
  }
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeGrandparentStoryVisitLanguage(card, label, errors)
}

export function validateGrandparentStoryVisitKitSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Grandparent Story Visit Kit source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch21', 'batchId must be 2026-06-02-batch21.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== grandparentStoryVisitKitProductSlug,
    `productSlug must be ${grandparentStoryVisitKitProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Grandparent Story Visit Kit', 'title must be Grandparent Story Visit Kit.')
  pushIf(errors, source.pricePoint !== '$31', 'pricePoint must be $31.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Grandparent Story Visit source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Grandparent Story Visit source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Grandparent Story Visit source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredGrandparentStoryVisitKitArtifactPaths, 'Grandparent Story Visit', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.hostGuide), 'hostGuide must be an object.')
  if (isObject(source.hostGuide)) {
    validateStringArray(source.hostGuide.visitSetup, 5, 'hostGuide.visitSetup', errors)
    validateStringArray(source.hostGuide.storyHosting, 5, 'hostGuide.storyHosting', errors)
    validateStringArray(source.hostGuide.quietParticipation, 5, 'hostGuide.quietParticipation', errors)
    validateStringArray(source.hostGuide.noDataUse, 4, 'hostGuide.noDataUse', errors)
    validateStringArray(source.hostGuide.takeHomeHandoff, 4, 'hostGuide.takeHomeHandoff', errors)
    validateStringArray(source.hostGuide.packReset, 4, 'hostGuide.packReset', errors)
    validateNoUnsafeGrandparentStoryVisitLanguage(source.hostGuide, 'hostGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.visitFormats), 'visitFormats must be an array.')
  if (Array.isArray(source.visitFormats)) {
    pushIf(errors, source.visitFormats.length !== 6, 'visitFormats must have exactly 6 entries.')
    const names = new Set()
    source.visitFormats.forEach((format, index) => validateGrandparentVisitFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomePostcards), 'takeHomePostcards must be an array.')
  if (Array.isArray(source.takeHomePostcards)) {
    pushIf(errors, source.takeHomePostcards.length !== 12, 'takeHomePostcards must have exactly 12 entries.')
    const titles = new Set()
    source.takeHomePostcards.forEach((card, index) => validateGrandparentTakeHomePostcard(card, index, titles, errors))
  }

  validateExactStringArray(source.optionalFamilySharePrompts, 8, 'optionalFamilySharePrompts', errors)

  pushIf(errors, !Array.isArray(source.visitQuests), 'visitQuests must be an array.')
  if (Array.isArray(source.visitQuests)) {
    pushIf(errors, source.visitQuests.length !== 12, 'visitQuests must have exactly 12 entries.')
    const questIds = new Set()
    const coveredWorlds = new Set()
    source.visitQuests.forEach((quest, index) => {
      validateGrandparentVisitQuest(quest, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, questIds, errors)
      if (isNonEmptyString(quest?.worldSlug)) coveredWorlds.add(quest.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 12, 'visitQuests must cover at least 12 unique worlds.')
  }

  validateNoUnsafeGrandparentStoryVisitLanguage(source, 'Grandparent Story Visit Kit source', errors)
  validateNoRiskyLanguage(source, 'Grandparent Story Visit Kit source', errors)
  return errors
}

export function validateGrandparentStoryVisitKitSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three quest lanes and one tools lane.')

  const questLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      pushIf(errors, lane.batchId !== source.batchId, `${sourceFile}.batchId must match ${source.batchId}.`)
      if (Array.isArray(lane.quests)) {
        questLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.hostGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 21 quest lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, questLaneFiles.length !== 3, 'sourceFiles must include exactly three quest lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneQuests = questLaneFiles
    .flatMap(({ lane }) => lane.quests)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.visitQuests)) {
    pushIf(
      errors,
      JSON.stringify(laneQuests) !== JSON.stringify(source.visitQuests),
      'sourceFiles quest lanes must reproduce visitQuests exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['hostGuide', 'visitFormats', 'takeHomePostcards', 'optionalFamilySharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

function validateNoUnsafeThankYouNoteLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const privacyText = rawText
    .replace(/\bdoes not need accounts?, uploads?, photos?, recordings?, or public posting\b/gi, '')
    .replace(
      /\bdo not collect mailing details?, full names?, contact details?, child profiles?, family records?, or private household facts\b/gi,
      '',
    )
    .replace(/\bwithout writing private contact details?\b/gi, '')
    .replace(/\bwithout private schedules?, contact details?, or family records?\b/gi, '')
    .replace(/\bwithout mentioning price or private details?\b/gi, '')
    .replace(/\bwithout discussing price or asking for personal details?\b/gi, '')
    .replace(/\bno\s+addresses?\b/gi, '')
    .replace(/\bno\s+address collection\b/gi, '')
    .replace(/\bdo not collect addresses?\b/gi, '')
    .replace(/\bwithout collecting addresses?\b/gi, '')
    .replace(/\bkeep addresses? separate\b/gi, '')
    .replace(/\bkeep delivery details? separate\b/gi, '')
    .replace(/\bkeep envelopes? separate\b/gi, '')
    .replace(/\bno\s+full names?\b/gi, '')
    .replace(/\bdo not write full names?\b/gi, '')
    .replace(/\bskip full names?\b/gi, '')
    .replace(/\bkeep samples generic\b/gi, '')
    .replace(/\bno\s+phone(s| numbers?)?\b/gi, '')
    .replace(/\bno\s+emails?\b/gi, '')
    .replace(/\bno\s+photos?\b/gi, '')
    .replace(/\bno\s+gift prices?\b/gi, '')
    .replace(/\bno\s+accounts?\b/gi, '')
    .replace(/\bno\s+uploads?\b/gi, '')
    .replace(/\bdoes not need accounts?\b/gi, '')
    .replace(/\bdoes not need uploads?\b/gi, '')
    .replace(/\bdoes not need photos?\b/gi, '')
    .replace(/\bdoes not need recordings?\b/gi, '')
    .replace(/\bskip gift prices?\b/gi, '')
    .replace(/\bkeep pages offline\b/gi, '')
    .replace(/\bshare only by choice\b/gi, '')
    .replace(/\bno personal data collection\b/gi, '')
    .replace(/\bwithout personal data collection\b/gi, '')
  pushIf(
    errors,
    /\baddresses?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\bphone numbers?\b|\bphones?\b|\bemails?\b|\bphotos?\b|\bfamily records?\b|\bgenealog(y|ies|ical)\b|\bfamily trees?\b|\bgift prices?\b|\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic publishing\b|\bpublish online\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b/i.test(
      privacyText,
    ),
    `${label} includes address, full-name, child-name, phone, email, photo, gift-price, family-record, upload, public-publishing, account, roster, attendance, sign-in, or behavior-report language.`,
  )

  const safetyText = rawText
    .replaceAll(requiredSafety, '')
    .replace(/\bno\s+scores?\b/gi, '')
    .replace(/\bno\s+scoring\b/gi, '')
    .replace(/\bno\s+grades?\b/gi, '')
    .replace(/\bno\s+contest(s)?\b/gi, '')
    .replace(/\bno\s+prizes?\b/gi, '')
    .replace(/\bno\s+timers?\b/gi, '')
    .replace(/\bno\s+timer pressure\b/gi, '')
    .replace(/\bno\s+politic(s|al)?\b/gi, '')
    .replace(/\bno\s+religion\b/gi, '')
    .replace(/\bno\s+romance\b/gi, '')
    .replace(/\bno\s+weapon(s)?\b/gi, '')
    .replace(/\bno\s+branded characters\b/gi, '')
    .replace(/\bno\s+scary harm\b/gi, '')
    .replace(/\bno\s+gambling\b/gi, '')
    .replace(/\bwithout\s+scores?\b/gi, '')
    .replace(/\bwithout\s+scoring\b/gi, '')
    .replace(/\bwithout any score or speed goal\b/gi, '')
    .replace(/\bwithout\s+scores? or speed goals?\b/gi, '')
    .replace(/\bwithout\s+grades?\b/gi, '')
    .replace(/\bwithout\s+contest(s)?\b/gi, '')
    .replace(/\bwithout\s+prizes?\b/gi, '')
    .replace(/\bwithout\s+timer pressure\b/gi, '')
    .replace(/\bwithout\s+politics?\b/gi, '')
    .replace(/\bwithout\s+religion\b/gi, '')
    .replace(/\bwithout\s+romance\b/gi, '')
    .replace(/\bwithout\s+weapon(s)?\b/gi, '')
    .replace(/\bwithout\s+branded characters\b/gi, '')
    .replace(/\bwithout\s+scary harm\b/gi, '')
    .replace(/\bwithout\s+gambling\b/gi, '')
  pushIf(
    errors,
    /\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bfamily conflict\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bbranded\b|\bbrand(ed)? character(s)?\b|\bad(s)? targeted to children\b|\bchase(s|d|ing)?\b|\brun(s|ning)?\b|\bjump(s|ed|ing)?\b|\bclimb(s|ed|ing)?\b|\bthrow(s|ing)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bkitchen knife|knives\b|\bflames?\b|\bmatchstick(s)?\b|\blighter(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes medical, legal, therapy, diagnosis, grief, family-conflict, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, or unsafe physical language.`,
  )
}

function validateThankYouPostcard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `postcards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'thankYouSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'noteStarter',
    'storyBridge',
    'politeClose',
    'drawingPrompt',
    'revisionNudge',
    'quietOption',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !card.id.startsWith('thank-you-postcard-'), `${label}.id must start with thank-you-postcard-.`)
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(
    errors,
    !['specific thank-you detail', 'kind sentence', 'gift-to-story bridge', 'memory detail', 'revision polish'].includes(
      card.thankYouSkill,
    ),
    `${label}.thankYouSkill is not allowed.`,
  )
  pushIf(errors, !['7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of ['noteStarter', 'storyBridge', 'politeClose', 'drawingPrompt', 'revisionNudge', 'quietOption', 'takeHomeLine']) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeThankYouNoteLanguage(card, label, errors)
}

function validateThankYouNoteSituation(situation, index, names, errors) {
  const label = `noteSituations[${index}]`
  pushIf(errors, !isObject(situation), `${label} must be an object.`)
  if (!isObject(situation)) return
  for (const key of ['name', 'bestFor']) {
    validateString(situation[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(situation.name)) {
    pushIf(errors, names.has(situation.name), `${label}.name is duplicated.`)
    names.add(situation.name)
  }
  validateExactStringArray(situation.steps, 4, `${label}.steps`, errors)
  if (Array.isArray(situation.steps)) {
    situation.steps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.steps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.steps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  validateNoUnsafeThankYouNoteLanguage(situation, label, errors)
}

function validateThankYouRevisionPrompt(prompt, index, titles, errors) {
  const label = `revisionPrompts[${index}]`
  pushIf(errors, !isObject(prompt), `${label} must be an object.`)
  if (!isObject(prompt)) return
  for (const key of ['title', 'skill', 'direction', 'adultLine']) {
    validateString(prompt[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(prompt.title)) {
    pushIf(errors, titles.has(prompt.title), `${label}.title is duplicated.`)
    titles.add(prompt.title)
  }
  for (const key of ['direction', 'adultLine']) {
    pushIf(errors, isNonEmptyString(prompt[key]) && !hasWritableBlank(prompt[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(prompt[key]) && hasSnakeCasePlaceholder(prompt[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeThankYouNoteLanguage(prompt, label, errors)
}

export function validateThankYouNoteStoryPostcardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Thank-You Note Story Postcard Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch22', 'batchId must be 2026-06-02-batch22.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== thankYouNoteStoryPostcardPackProductSlug,
    `productSlug must be ${thankYouNoteStoryPostcardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Thank-You Note Story Postcard Pack', 'title must be Thank-You Note Story Postcard Pack.')
  pushIf(errors, source.pricePoint !== '$21', 'pricePoint must be $21.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Thank-You Note Story Postcard source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Thank-You Note Story Postcard source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Thank-You Note Story Postcard source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredThankYouNoteStoryPostcardPackArtifactPaths, 'Thank-You Note Story Postcard', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.setup, 6, 'adultGuide.setup', errors)
    validateStringArray(source.adultGuide.coachingMoves, 6, 'adultGuide.coachingMoves', errors)
    validateStringArray(source.adultGuide.privacyNotes, 5, 'adultGuide.privacyNotes', errors)
    validateStringArray(source.adultGuide.handoff, 5, 'adultGuide.handoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeThankYouNoteLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.noteSituations), 'noteSituations must be an array.')
  if (Array.isArray(source.noteSituations)) {
    pushIf(errors, source.noteSituations.length !== 6, 'noteSituations must have exactly 6 entries.')
    const names = new Set()
    source.noteSituations.forEach((situation, index) => validateThankYouNoteSituation(situation, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.revisionPrompts), 'revisionPrompts must be an array.')
  if (Array.isArray(source.revisionPrompts)) {
    pushIf(errors, source.revisionPrompts.length !== 10, 'revisionPrompts must have exactly 10 entries.')
    const titles = new Set()
    source.revisionPrompts.forEach((prompt, index) => validateThankYouRevisionPrompt(prompt, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.postcards), 'postcards must be an array.')
  if (Array.isArray(source.postcards)) {
    pushIf(errors, source.postcards.length !== 16, 'postcards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.postcards.forEach((card, index) => {
      validateThankYouPostcard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'postcards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeThankYouNoteLanguage(source, 'Thank-You Note Story Postcard Pack source', errors)
  validateNoRiskyLanguage(source, 'Thank-You Note Story Postcard Pack source', errors)
  return errors
}

export function validateThankYouNoteStoryPostcardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three postcard lanes and one tools lane.')

  const postcardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.postcards)) {
        postcardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 22 postcard lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, postcardLaneFiles.length !== 3, 'sourceFiles must include exactly three postcard lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const lanePostcards = postcardLaneFiles
    .flatMap(({ lane }) => lane.postcards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.postcards)) {
    pushIf(
      errors,
      JSON.stringify(lanePostcards) !== JSON.stringify(source.postcards),
      'sourceFiles postcard lanes must reproduce postcards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'noteSituations', 'revisionPrompts', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const natureWalkFieldNoteSkills = new Set([
  'safe observation',
  'setting detail',
  'pattern noticing',
  'object-to-story',
  'sequence path',
  'revision detail',
])

const natureWalkTakeHomeSkills = new Set([
  'setting detail',
  'pattern noticing',
  'object-to-story',
  'sequence path',
  'revision detail',
  'sensory detail',
])

const natureWalkTakeHomeTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafeNatureWalkLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse broad place words such as yard, park, garden, porch, or field table instead of identifying details\./gi, '')
    .replace(/\bSkip house numbers, license plates, school names, and signs that identify a private place\./gi, '')
    .replace(/\bUse initials, first-name-only labels, or blank page labels for pages that leave the house\./gi, '')
    .replace(/\bUse fictional names for all people in the story, even when the idea starts from a real outing\./gi, '')
    .replace(/\bKeep finished pages in the family folder or classroom folder unless an adult chooses a private handoff\./gi, '')
    .replace(/\bCheck pages for identifying details before they go home or into a shared classroom stack\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bwithout collecting items\b/gi, '')
    .replace(/\bwithout collecting anything\b/gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic publishing\b|\bpublish online\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bschool names?\b|\bexact location\b|\broute\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-publishing, location-tracking, exact-place, contact, photo, child-profile, roster, attendance, sign-in, or behavior-report language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bwithout disturbing living things\b/gi, '')
    .replace(/\bleave living things undisturbed\b/gi, '')
    .replace(/\bkeep hands to yourself\b/gi, '')
    .replace(/\blook only\b/gi, '')
    .replace(/\beyes-only rule\b/gi, '')
    .replace(/\bobserve with eyes and ears only\b/gi, '')
    .replace(/\bwithout picking anything up\b/gi, '')
  pushIf(
    errors,
    /\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bbranded\b|\bbrand(ed)? character(s)?\b|\bad(s)? targeted to children\b|\banimal contact\b|\bfeed(s|ing)? animals?\b|\btouch(ing)? animals?\b|\bforag(e|ing)\b|\btast(e|ing)? plants?\b|\beat(ing)? plants?\b|\bcross(ing)? streets?\b|\bwater entry\b|\benter water\b|\bweather hazard\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bflames?\b|\bmatchstick(s)?\b|\blighter(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, animal-contact, foraging, tasting, street-crossing, water-entry, weather-risk, or unsafe physical language.`,
  )
}

function validateNatureWalkFieldNote(note, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, noteIds, errors) {
  const label = `fieldNotes[${index}]`
  pushIf(errors, !isObject(note), `${label} must be an object.`)
  if (!isObject(note)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'fieldNoteSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'noticePrompt',
    'detailBankPrompt',
    'storySeed',
    'sentencePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(note[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(note.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !note.id.startsWith('nature-field-note-'), `${label}.id must start with nature-field-note-.`)
    pushIf(errors, noteIds.has(note.id), `${label}.id is duplicated.`)
    noteIds.add(note.id)
  }
  pushIf(errors, !natureWalkFieldNoteSkills.has(note.fieldNoteSkill), `${label}.fieldNoteSkill is not allowed.`)
  pushIf(errors, !['7-8', '7-9', '8-10', '10-11'].includes(note.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(note.worldSlug) && !knownWorldSlugs.has(note.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(note.worldSlug) && !sourceWorldSlugs.has(note.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(note.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(note.ageBand) && isNonEmptyString(worldAgeBand) && note.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${note.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of ['noticePrompt', 'detailBankPrompt', 'storySeed', 'sentencePath', 'revisionNudge', 'quietOptionLine', 'takeHomeLine']) {
    pushIf(errors, isNonEmptyString(note[key]) && !hasWritableBlank(note[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(note[key]) && hasSnakeCasePlaceholder(note[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeNatureWalkLanguage(note, label, errors)
}

function validateNatureWalkFormat(format, index, names, errors) {
  const label = `walkFormats[${index}]`
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
  validateNoUnsafeNatureWalkLanguage(format, label, errors)
}

function validateNatureWalkTakeHomeCard(card, index, titles, errors) {
  const label = `takeHomeFieldCards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(card[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(card.title)) {
    pushIf(errors, titles.has(card.title), `${label}.title is duplicated.`)
    titles.add(card.title)
  }
  pushIf(errors, !natureWalkTakeHomeTimes.has(card.time), `${label}.time is not allowed.`)
  pushIf(errors, !natureWalkTakeHomeSkills.has(card.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeNatureWalkLanguage(card, label, errors)
}

export function validateNatureWalkStoryFieldNotesKitSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Nature Walk Story Field Notes Kit source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch23', 'batchId must be 2026-06-02-batch23.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== natureWalkStoryFieldNotesKitProductSlug,
    `productSlug must be ${natureWalkStoryFieldNotesKitProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Nature Walk Story Field Notes Kit', 'title must be Nature Walk Story Field Notes Kit.')
  pushIf(errors, source.pricePoint !== '$33', 'pricePoint must be $33.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Nature Walk Story Field Notes source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Nature Walk Story Field Notes source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Nature Walk Story Field Notes source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredNatureWalkStoryFieldNotesKitArtifactPaths, 'Nature Walk Story Field Notes', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeWalk, 5, 'adultGuide.beforeWalk', errors)
    validateStringArray(source.adultGuide.fieldTableSetup, 5, 'adultGuide.fieldTableSetup', errors)
    validateStringArray(source.adultGuide.observationToStory, 5, 'adultGuide.observationToStory', errors)
    validateStringArray(source.adultGuide.privacyAndSiteNotes, 5, 'adultGuide.privacyAndSiteNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeNatureWalkLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.walkFormats), 'walkFormats must be an array.')
  if (Array.isArray(source.walkFormats)) {
    pushIf(errors, source.walkFormats.length !== 6, 'walkFormats must have exactly 6 entries.')
    const names = new Set()
    source.walkFormats.forEach((format, index) => validateNatureWalkFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeFieldCards), 'takeHomeFieldCards must be an array.')
  if (Array.isArray(source.takeHomeFieldCards)) {
    pushIf(errors, source.takeHomeFieldCards.length !== 10, 'takeHomeFieldCards must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeFieldCards.forEach((card, index) => validateNatureWalkTakeHomeCard(card, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.fieldNotes), 'fieldNotes must be an array.')
  if (Array.isArray(source.fieldNotes)) {
    pushIf(errors, source.fieldNotes.length !== 12, 'fieldNotes must have exactly 12 entries.')
    const noteIds = new Set()
    const coveredWorlds = new Set()
    source.fieldNotes.forEach((note, index) => {
      validateNatureWalkFieldNote(note, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, noteIds, errors)
      if (isNonEmptyString(note?.worldSlug)) coveredWorlds.add(note.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 12, 'fieldNotes must cover at least 12 unique worlds.')
  }

  validateNoUnsafeNatureWalkLanguage(source, 'Nature Walk Story Field Notes Kit source', errors)
  validateNoRiskyLanguage(source, 'Nature Walk Story Field Notes Kit source', errors)
  return errors
}

export function validateNatureWalkStoryFieldNotesKitSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three field-note lanes and one tools lane.')

  const fieldNoteLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.fieldNotes)) {
        fieldNoteLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 23 field-note lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, fieldNoteLaneFiles.length !== 3, 'sourceFiles must include exactly three field-note lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneFieldNotes = fieldNoteLaneFiles
    .flatMap(({ lane }) => lane.fieldNotes)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.fieldNotes)) {
    pushIf(
      errors,
      JSON.stringify(laneFieldNotes) !== JSON.stringify(source.fieldNotes),
      'sourceFiles field-note lanes must reproduce fieldNotes exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'walkFormats', 'takeHomeFieldCards', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const backyardSeedPacketSkills = new Set([
  'setting seed',
  'character seed',
  'object seed',
  'sequence seed',
  'revision seed',
  'sensory seed',
])

const backyardSeedSlipTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafeBackyardSeedLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse broad place labels and invented details instead of exact place details\./gi, '')
    .replace(/\bOrganize pages with symbols, color tabs, or plain folders instead of private identifiers\./gi, '')
    .replace(/\bKeep packet pages offline, printable, and handled by the adult leader, writer, or family\./gi, '')
    .replace(/\bKeep pages offline, printable, and handled by the adult leader, writer, or family\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic publishing\b|\bpublish online\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bschool names?\b|\bexact location\b|\broute\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-publishing, location-tracking, exact-place, contact, photo, child-profile, roster, attendance, sign-in, or behavior-report language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bpaper story seed(s)?\b/gi, '')
    .replace(/\bstory seed(s)?\b/gi, '')
    .replace(/\bpaper seed packet(s)?\b/gi, '')
    .replace(/\bpaper packet(s)?\b/gi, '')
    .replace(/\blook, listen, point, sketch, or imagine\b/gi, '')
    .replace(/\bpoint, sketch, dictate, or write\b/gi, '')
  pushIf(
    errors,
    /\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bbranded\b|\bbrand(ed)? character(s)?\b|\bad(s)? targeted to children\b|\banimal contact\b|\binsect contact\b|\bfeed(s|ing)? animals?\b|\btouch(ing)? animals?\b|\btouch(ing)? insects?\b|\bforag(e|ing)\b|\btast(e|ing)? plants?\b|\beat(ing)? plants?\b|\bplant identification\b|\bidentify plants?\b|\bplant(ing)? seeds?\b|\bwater(ing)? plants?\b|\bsoil handling\b|\btouch(ing)? soil\b|\bsoil\b|\bgarden tools?\b|\btrowel(s)?\b|\bshovel(s)?\b|\bscissors?\b|\bknife\b|\bfertilizer(s)?\b|\bpesticide(s)?\b|\bsolar ovens?\b|\bwarm snacks?\b|\bcross(ing)? streets?\b|\bwater entry\b|\benter water\b|\bweather hazard\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bflames?\b|\bmatchstick(s)?\b|\blighter(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, animal-contact, foraging, tasting, plant-identification, real-gardening, street-crossing, water-entry, weather-risk, or unsafe physical language.`,
  )
}

function validateBackyardSeedPacket(packet, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, packetIds, errors) {
  const label = `seedPackets[${index}]`
  pushIf(errors, !isObject(packet), `${label} must be an object.`)
  if (!isObject(packet)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'seedPacketSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'packetLabelPrompt',
    'detailSeedsPrompt',
    'storySeedPrompt',
    'sproutSentencePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(packet[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(packet.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packet.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !packet.id.startsWith('backyard-seed-packet-'), `${label}.id must start with backyard-seed-packet-.`)
    pushIf(errors, packetIds.has(packet.id), `${label}.id is duplicated.`)
    packetIds.add(packet.id)
  }
  pushIf(errors, !backyardSeedPacketSkills.has(packet.seedPacketSkill), `${label}.seedPacketSkill is not allowed.`)
  pushIf(errors, !['7-8', '7-9', '8-10', '10-11'].includes(packet.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(packet.worldSlug) && !knownWorldSlugs.has(packet.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(packet.worldSlug) && !sourceWorldSlugs.has(packet.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(packet.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(packet.ageBand) && isNonEmptyString(worldAgeBand) && packet.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${packet.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of ['packetLabelPrompt', 'detailSeedsPrompt', 'storySeedPrompt', 'sproutSentencePath', 'revisionNudge', 'quietOptionLine', 'takeHomeLine']) {
    pushIf(errors, isNonEmptyString(packet[key]) && !hasWritableBlank(packet[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(packet[key]) && hasSnakeCasePlaceholder(packet[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBackyardSeedLanguage(packet, label, errors)
}

function validateBackyardPacketFormat(format, index, names, errors) {
  const label = `packetFormats[${index}]`
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
  validateNoUnsafeBackyardSeedLanguage(format, label, errors)
}

function validateBackyardTakeHomeSeedSlip(slip, index, titles, errors) {
  const label = `takeHomeSeedSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !backyardSeedSlipTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !backyardSeedPacketSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBackyardSeedLanguage(slip, label, errors)
}

export function validateBackyardStorySeedPacketKitSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Backyard Story Seed Packet Kit source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch24', 'batchId must be 2026-06-02-batch24.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== backyardStorySeedPacketKitProductSlug,
    `productSlug must be ${backyardStorySeedPacketKitProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Backyard Story Seed Packet Kit', 'title must be Backyard Story Seed Packet Kit.')
  pushIf(errors, source.pricePoint !== '$35', 'pricePoint must be $35.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Backyard Story Seed Packet source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Backyard Story Seed Packet source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Backyard Story Seed Packet source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 14, 'worldSlugs must have exactly 14 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredBackyardStorySeedPacketKitArtifactPaths, 'Backyard Story Seed Packet', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.packetTableSetup, 5, 'adultGuide.packetTableSetup', errors)
    validateStringArray(source.adultGuide.observationToStorySeeds, 5, 'adultGuide.observationToStorySeeds', errors)
    validateStringArray(source.adultGuide.privacyAndSiteNotes, 5, 'adultGuide.privacyAndSiteNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeBackyardSeedLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.packetFormats), 'packetFormats must be an array.')
  if (Array.isArray(source.packetFormats)) {
    pushIf(errors, source.packetFormats.length !== 6, 'packetFormats must have exactly 6 entries.')
    const names = new Set()
    source.packetFormats.forEach((format, index) => validateBackyardPacketFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSeedSlips), 'takeHomeSeedSlips must be an array.')
  if (Array.isArray(source.takeHomeSeedSlips)) {
    pushIf(errors, source.takeHomeSeedSlips.length !== 10, 'takeHomeSeedSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeSeedSlips.forEach((slip, index) => validateBackyardTakeHomeSeedSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.seedPackets), 'seedPackets must be an array.')
  if (Array.isArray(source.seedPackets)) {
    pushIf(errors, source.seedPackets.length !== 14, 'seedPackets must have exactly 14 entries.')
    const packetIds = new Set()
    const coveredWorlds = new Set()
    source.seedPackets.forEach((packet, index) => {
      validateBackyardSeedPacket(packet, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, packetIds, errors)
      if (isNonEmptyString(packet?.worldSlug)) coveredWorlds.add(packet.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 14, 'seedPackets must cover at least 14 unique worlds.')
  }

  validateNoUnsafeBackyardSeedLanguage(source, 'Backyard Story Seed Packet Kit source', errors)
  validateNoRiskyLanguage(source, 'Backyard Story Seed Packet Kit source', errors)
  return errors
}

export function validateBackyardStorySeedPacketKitSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three seed-packet lanes and one tools lane.')

  const seedPacketLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.seedPackets)) {
        seedPacketLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 24 seed-packet lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, seedPacketLaneFiles.length !== 3, 'sourceFiles must include exactly three seed-packet lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneSeedPackets = seedPacketLaneFiles
    .flatMap(({ lane }) => lane.seedPackets)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.seedPackets)) {
    pushIf(
      errors,
      JSON.stringify(laneSeedPackets) !== JSON.stringify(source.seedPackets),
      'sourceFiles seed-packet lanes must reproduce seedPackets exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'packetFormats', 'takeHomeSeedSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const kitchenRecipeCardSkills = new Set([
  'setting recipe',
  'character recipe',
  'object recipe',
  'sequence recipe',
  'revision recipe',
  'sensory recipe',
])

const kitchenRecipeSlipTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafeKitchenRecipeLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse invented names, role words, or blank labels for every person on the cards\./gi, '')
    .replace(/\bUse invented character labels instead of real names\./gi, '')
    .replace(/\bUse broad place words instead of addresses, exact schedules, group names, signs, or private routines\./gi, '')
    .replace(/\bUse broad table words instead of private family details\./gi, '')
    .replace(/\bKeep finished cards in the family folder, tutor folder, co-op folder, or classroom folder\./gi, '')
    .replace(/\bKeep family routines, exact places, and private details off the card\./gi, '')
    .replace(/\bKeep the cards offline with the family adult, tutor, or table host\./gi, '')
    .replace(/\bCheck every take-home slip for private details before it leaves the adult-led table\./gi, '')
    .replace(/\bSharing stays optional and limited to one title, sketch, or invented line\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic publishing\b|\bpublish online\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bschool names?\b|\bexact location\b|\bexact places?\b|\bexact schedules?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-publishing, exact-place, contact, photo, child-profile, grade, score, roster, attendance, sign-in, or behavior-report language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bstory recipe cards?\b/gi, '')
    .replace(/\bpaper recipe cards?\b/gi, '')
    .replace(/\bblank recipe cards?\b/gi, '')
    .replace(/\brecipe cards?\b/gi, '')
    .replace(/\btake-home recipe slips?\b/gi, '')
    .replace(/\brecipe slips?\b/gi, '')
    .replace(/\brecipe words?\b/gi, '')
    .replace(/\bstory recipe\b/gi, '')
    .replace(/\bstory ingredients?\b/gi, '')
    .replace(/\bsetting ingredients?\b/gi, '')
    .replace(/\bcharacter ingredients?\b/gi, '')
    .replace(/\bobject ingredients?\b/gi, '')
    .replace(/\bsequence ingredients?\b/gi, '')
    .replace(/\brevision ingredients?\b/gi, '')
    .replace(/\bsensory ingredients?\b/gi, '')
    .replace(/\bingredients?\b/gi, '')
    .replace(/\breal table directions\b/gi, '')
    .replace(/\bpaper-only sensory word\b/gi, '')
  pushIf(
    errors,
    /\bfood prep\b|\bserve food\b|\breal recipe advice\b|\brecipe instructions\b|\bcook(s|ed|ing)?\b|\bbak(e|es|ed|ing)\b|\btast(e|es|ed|ing)?\b|\beat(s|en|ing)?\b|\bstove(s)?\b|\boven(s)?\b|\bmicrowave(s)?\b|\bflame(s)?\b|\bheat\b|\bhot\b|\bknife\b|\bknives\b|\bscissors?\b|\b(kitchen|sharp|cutting) tools?\b|\ballerg(y|ies|en|ens|ic)\b|\bnutrition\b|\bdiet(s|ing|ary)?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bbranded\b|\bbrand(ed)? character(s)?\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes food-prep, tasting/eating, cooking/baking, heat, knife/tool, allergen, nutrition, diet, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, branded, ad-targeting, or unsafe physical language.`,
  )
}

function validateKitchenRecipeCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `recipeCards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'recipeCardSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'recipeTitlePrompt',
    'storyIngredientsPrompt',
    'mixItUpPrompt',
    'servingSentencePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !card.id.startsWith('kitchen-recipe-card-'), `${label}.id must start with kitchen-recipe-card-.`)
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !kitchenRecipeCardSkills.has(card.recipeCardSkill), `${label}.recipeCardSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of ['recipeTitlePrompt', 'storyIngredientsPrompt', 'mixItUpPrompt', 'servingSentencePath', 'revisionNudge', 'quietOptionLine', 'takeHomeLine']) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeKitchenRecipeLanguage(card, label, errors)
}

function validateKitchenCardFormat(format, index, names, errors) {
  const label = `cardFormats[${index}]`
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
  validateNoUnsafeKitchenRecipeLanguage(format, label, errors)
}

function validateKitchenTakeHomeRecipeSlip(slip, index, titles, errors) {
  const label = `takeHomeRecipeSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !kitchenRecipeSlipTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !kitchenRecipeCardSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeKitchenRecipeLanguage(slip, label, errors)
}

export function validateKitchenTableStoryRecipeCardDeckSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Kitchen Table Story Recipe Card Deck source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch25', 'batchId must be 2026-06-02-batch25.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== kitchenTableStoryRecipeCardDeckProductSlug,
    `productSlug must be ${kitchenTableStoryRecipeCardDeckProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Kitchen Table Story Recipe Card Deck', 'title must be Kitchen Table Story Recipe Card Deck.')
  pushIf(errors, source.pricePoint !== '$29', 'pricePoint must be $29.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Kitchen Table Story Recipe Card Deck source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Kitchen Table Story Recipe Card Deck source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Kitchen Table Story Recipe Card Deck source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredKitchenTableStoryRecipeCardDeckArtifactPaths, 'Kitchen Table Story Recipe Card Deck', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.tableSetup, 5, 'adultGuide.tableSetup', errors)
    validateStringArray(source.adultGuide.storyIngredientCoaching, 5, 'adultGuide.storyIngredientCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeKitchenRecipeLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.cardFormats), 'cardFormats must be an array.')
  if (Array.isArray(source.cardFormats)) {
    pushIf(errors, source.cardFormats.length !== 6, 'cardFormats must have exactly 6 entries.')
    const names = new Set()
    source.cardFormats.forEach((format, index) => validateKitchenCardFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeRecipeSlips), 'takeHomeRecipeSlips must be an array.')
  if (Array.isArray(source.takeHomeRecipeSlips)) {
    pushIf(errors, source.takeHomeRecipeSlips.length !== 10, 'takeHomeRecipeSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeRecipeSlips.forEach((slip, index) => validateKitchenTakeHomeRecipeSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.recipeCards), 'recipeCards must be an array.')
  if (Array.isArray(source.recipeCards)) {
    pushIf(errors, source.recipeCards.length !== 16, 'recipeCards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.recipeCards.forEach((card, index) => {
      validateKitchenRecipeCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'recipeCards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeKitchenRecipeLanguage(source, 'Kitchen Table Story Recipe Card Deck source', errors)
  validateNoRiskyLanguage(source, 'Kitchen Table Story Recipe Card Deck source', errors)
  return errors
}

export function validateKitchenTableStoryRecipeCardDeckSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three recipe-card lanes and one tools lane.')

  const recipeCardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.recipeCards)) {
        recipeCardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 25 recipe-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, recipeCardLaneFiles.length !== 3, 'sourceFiles must include exactly three recipe-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneRecipeCards = recipeCardLaneFiles
    .flatMap(({ lane }) => lane.recipeCards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.recipeCards)) {
    pushIf(
      errors,
      JSON.stringify(laneRecipeCards) !== JSON.stringify(source.recipeCards),
      'sourceFiles recipe-card lanes must reproduce recipeCards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'cardFormats', 'takeHomeRecipeSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const bookshopBookmarkSkills = new Set([
  'setting bookmark',
  'character bookmark',
  'object bookmark',
  'sequence bookmark',
  'revision bookmark',
  'sensory bookmark',
])

const bookshopBookmarkSlipTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafeBookshopBookmarkLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse invented names, role words, or blank labels for every person on the bookmark(s)?\./gi, '')
    .replace(/\bUse broad place words instead of named locations, room numbers, route details, schedules, or private routines\./gi, '')
    .replace(/\bUse broad place words instead of exact store names, school names, group names, or addresses\./gi, '')
    .replace(/\bUse pretend shelf labels instead of real store, school, or library names\./gi, '')
    .replace(/\bAsk adults to keep real book titles, author names, and store names off the page\./gi, '')
    .replace(/\bKeep every bookmark offline with the family adult, tutor, or table host\./gi, '')
    .replace(/\bKeep finished bookmarks with the family adult, tutor, co-op adult, or classroom adult\./gi, '')
    .replace(/\bKeep all bookmark writing fictional and paper-only; do not collect contact details or personal facts\./gi, '')
    .replace(/\bCheck every take-home slip for private details before it leaves the adult-led table\./gi, '')
    .replace(/\bCheck every take-home slip for identifying details before it leaves the adult-led table\./gi, '')
    .replace(/\bSharing stays optional and limited to one invented word, sketch, or line\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bstore names?\b|\bschool names?\b|\blibrary names?\b|\bexact location\b|\bexact places?\b|\bexact schedules?\b|\bprivate child data\b|\bpersonal facts?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, contact, photo, child-profile, grade, score, roster, attendance, sign-in, behavior-report, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bAsk adults to keep real book titles, author names, and store names off the page\./gi, '')
    .replace(/\bSay that every shelf, title, and character must be invented\./gi, '')
    .replace(/\bwithout using a real shop name\b/gi, '')
    .replace(/\bnot a public sharing tool\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\breal book titles?\b|\breal author names?\b|\bbook reviews?\b|\bpublic reviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, reading-review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, or unsafe physical language.`,
  )
}

function validateBookshopBookmark(bookmark, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, bookmarkIds, errors) {
  const label = `bookmarks[${index}]`
  pushIf(errors, !isObject(bookmark), `${label} must be an object.`)
  if (!isObject(bookmark)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'bookmarkSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'bookmarkFrontPrompt',
    'bookmarkBackPrompt',
    'storySeedPrompt',
    'firstLinePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(bookmark[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(bookmark.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(bookmark.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !bookmark.id.startsWith('bookshop-bookmark-'), `${label}.id must start with bookshop-bookmark-.`)
    pushIf(errors, bookmarkIds.has(bookmark.id), `${label}.id is duplicated.`)
    bookmarkIds.add(bookmark.id)
  }
  pushIf(errors, !bookshopBookmarkSkills.has(bookmark.bookmarkSkill), `${label}.bookmarkSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(bookmark.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(bookmark.worldSlug) && !knownWorldSlugs.has(bookmark.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(bookmark.worldSlug) && !sourceWorldSlugs.has(bookmark.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(bookmark.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(bookmark.ageBand) && isNonEmptyString(worldAgeBand) && bookmark.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${bookmark.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'bookmarkFrontPrompt',
    'bookmarkBackPrompt',
    'storySeedPrompt',
    'firstLinePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(bookmark[key]) && !hasWritableBlank(bookmark[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(bookmark[key]) && hasSnakeCasePlaceholder(bookmark[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBookshopBookmarkLanguage(bookmark, label, errors)
}

function validateBookshopBookmarkFormat(format, index, names, errors) {
  const label = `bookmarkFormats[${index}]`
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
  validateNoUnsafeBookshopBookmarkLanguage(format, label, errors)
}

function validateBookshopTakeHomeBookmarkSlip(slip, index, titles, errors) {
  const label = `takeHomeBookmarkSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !bookshopBookmarkSlipTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !bookshopBookmarkSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBookshopBookmarkLanguage(slip, label, errors)
}

export function validateBookshopStoryBookmarkPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Bookshop Story Bookmark Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch26', 'batchId must be 2026-06-02-batch26.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== bookshopStoryBookmarkPackProductSlug,
    `productSlug must be ${bookshopStoryBookmarkPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Bookshop Story Bookmark Pack', 'title must be Bookshop Story Bookmark Pack.')
  pushIf(errors, source.pricePoint !== '$25', 'pricePoint must be $25.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Bookshop Story Bookmark Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Bookshop Story Bookmark Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Bookshop Story Bookmark Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredBookshopStoryBookmarkPackArtifactPaths, 'Bookshop Story Bookmark Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.bookmarkSetup, 5, 'adultGuide.bookmarkSetup', errors)
    validateStringArray(source.adultGuide.shelfStoryCoaching, 5, 'adultGuide.shelfStoryCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeBookshopBookmarkLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.bookmarkFormats), 'bookmarkFormats must be an array.')
  if (Array.isArray(source.bookmarkFormats)) {
    pushIf(errors, source.bookmarkFormats.length !== 6, 'bookmarkFormats must have exactly 6 entries.')
    const names = new Set()
    source.bookmarkFormats.forEach((format, index) => validateBookshopBookmarkFormat(format, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeBookmarkSlips), 'takeHomeBookmarkSlips must be an array.')
  if (Array.isArray(source.takeHomeBookmarkSlips)) {
    pushIf(errors, source.takeHomeBookmarkSlips.length !== 10, 'takeHomeBookmarkSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeBookmarkSlips.forEach((slip, index) => validateBookshopTakeHomeBookmarkSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.bookmarks), 'bookmarks must be an array.')
  if (Array.isArray(source.bookmarks)) {
    pushIf(errors, source.bookmarks.length !== 16, 'bookmarks must have exactly 16 entries.')
    const bookmarkIds = new Set()
    const coveredWorlds = new Set()
    source.bookmarks.forEach((bookmark, index) => {
      validateBookshopBookmark(bookmark, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, bookmarkIds, errors)
      if (isNonEmptyString(bookmark?.worldSlug)) coveredWorlds.add(bookmark.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'bookmarks must cover at least 16 unique worlds.')
  }

  validateNoUnsafeBookshopBookmarkLanguage(source, 'Bookshop Story Bookmark Pack source', errors)
  validateNoRiskyLanguage(source, 'Bookshop Story Bookmark Pack source', errors)
  return errors
}

export function validateBookshopStoryBookmarkPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three bookmark lanes and one tools lane.')

  const bookmarkLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.bookmarks)) {
        bookmarkLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 26 bookmark lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, bookmarkLaneFiles.length !== 3, 'sourceFiles must include exactly three bookmark lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneBookmarks = bookmarkLaneFiles
    .flatMap(({ lane }) => lane.bookmarks)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.bookmarks)) {
    pushIf(
      errors,
      JSON.stringify(laneBookmarks) !== JSON.stringify(source.bookmarks),
      'sourceFiles bookmark lanes must reproduce bookmarks exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'bookmarkFormats', 'takeHomeBookmarkSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const writingDeskStripSkills = new Set([
  'setting strip',
  'character strip',
  'object strip',
  'sequence strip',
  'dialogue strip',
  'revision strip',
  'sensory strip',
  'object clue strip',
  'choice strip',
  'setting detail strip',
  'pattern strip',
  'sensory detail strip',
  'object detail strip',
  'character choice strip',
  'clarity strip',
])

const writingDeskStripTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafeWritingDeskStripLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse invented names, role words, or blank labels for every person on the strips\./gi, '')
    .replace(/\bUse invented names, role words, or blank labels for every person on the strip(s)?\./gi, '')
    .replace(/\bUse broad place words instead of named locations, route details, room numbers, or private routines\./gi, '')
    .replace(/\bUse broad place words instead of exact room names, group names, or addresses\./gi, '')
    .replace(/\bKeep every strip offline with the family adult, tutor, or table host\./gi, '')
    .replace(/\bKeep all desk-strip writing fictional, adult-led, offline, and paper-only\./gi, '')
    .replace(/\bKeep finished strips with the family adult, tutor, co-op adult, or classroom adult\./gi, '')
    .replace(/\bCheck every take-home strip for identifying details before it leaves the adult-led table\./gi, '')
    .replace(/\bCheck every take-home strip for private details before it leaves the adult-led table\./gi, '')
    .replace(/\bCheck finished strips for private details before they go home\./gi, '')
    .replace(/\bSharing stays optional and limited to one invented word, sketch, or line\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact location\b|\bexact places?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\bpersonal facts?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, contact, photo, child-profile, grade, score, roster, attendance, sign-in, behavior-report, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bnot a tracking tool\b/gi, '')
    .replace(/\bfictional, adult-led, offline, and paper-only\b/gi, '')
    .replace(/\bmade-up story\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\breal book titles?\b|\breal author names?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, or unsafe physical language.`,
  )
}

function validateWritingDeskStrip(strip, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, stripIds, errors) {
  const label = `strips[${index}]`
  pushIf(errors, !isObject(strip), `${label} must be an object.`)
  if (!isObject(strip)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'stripSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'stripFrontPrompt',
    'stripBackPrompt',
    'storySeedPrompt',
    'firstLinePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(strip[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(strip.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(strip.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !strip.id.startsWith('writing-desk-strip-'), `${label}.id must start with writing-desk-strip-.`)
    pushIf(errors, stripIds.has(strip.id), `${label}.id is duplicated.`)
    stripIds.add(strip.id)
  }
  pushIf(errors, !writingDeskStripSkills.has(strip.stripSkill), `${label}.stripSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(strip.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(strip.worldSlug) && !knownWorldSlugs.has(strip.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(strip.worldSlug) && !sourceWorldSlugs.has(strip.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(strip.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(strip.ageBand) && isNonEmptyString(worldAgeBand) && strip.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${strip.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'stripFrontPrompt',
    'stripBackPrompt',
    'storySeedPrompt',
    'firstLinePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(strip[key]) && !hasWritableBlank(strip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(strip[key]) && hasSnakeCasePlaceholder(strip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeWritingDeskStripLanguage(strip, label, errors)
}

function validateWritingDeskStripRoutine(routine, index, names, errors) {
  const label = `stripRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, names.has(routine.name), `${label}.name is duplicated.`)
    names.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeWritingDeskStripLanguage(routine, label, errors)
}

function validateTakeHomeDeskStrip(slip, index, titles, errors) {
  const label = `takeHomeDeskStrips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !writingDeskStripTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !writingDeskStripSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeWritingDeskStripLanguage(slip, label, errors)
}

export function validateWritingDeskStoryPromptStripPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Writing Desk Story Prompt Strip Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch27', 'batchId must be 2026-06-02-batch27.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== writingDeskStoryPromptStripPackProductSlug,
    `productSlug must be ${writingDeskStoryPromptStripPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Writing Desk Story Prompt Strip Pack', 'title must be Writing Desk Story Prompt Strip Pack.')
  pushIf(errors, source.pricePoint !== '$27', 'pricePoint must be $27.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Writing Desk Story Prompt Strip Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Writing Desk Story Prompt Strip Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Writing Desk Story Prompt Strip Pack source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 18, 'worldSlugs must have exactly 18 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(source, requiredWritingDeskStoryPromptStripPackArtifactPaths, 'Writing Desk Story Prompt Strip Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.deskSetup, 5, 'adultGuide.deskSetup', errors)
    validateStringArray(source.adultGuide.stripStoryCoaching, 5, 'adultGuide.stripStoryCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeWritingDeskStripLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.stripRoutines), 'stripRoutines must be an array.')
  if (Array.isArray(source.stripRoutines)) {
    pushIf(errors, source.stripRoutines.length !== 6, 'stripRoutines must have exactly 6 entries.')
    const names = new Set()
    source.stripRoutines.forEach((routine, index) => validateWritingDeskStripRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeDeskStrips), 'takeHomeDeskStrips must be an array.')
  if (Array.isArray(source.takeHomeDeskStrips)) {
    pushIf(errors, source.takeHomeDeskStrips.length !== 10, 'takeHomeDeskStrips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeDeskStrips.forEach((strip, index) => validateTakeHomeDeskStrip(strip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.strips), 'strips must be an array.')
  if (Array.isArray(source.strips)) {
    pushIf(errors, source.strips.length !== 18, 'strips must have exactly 18 entries.')
    const stripIds = new Set()
    const coveredWorlds = new Set()
    source.strips.forEach((strip, index) => {
      validateWritingDeskStrip(strip, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, stripIds, errors)
      if (isNonEmptyString(strip?.worldSlug)) coveredWorlds.add(strip.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 18, 'strips must cover at least 18 unique worlds.')
  }

  validateNoUnsafeWritingDeskStripLanguage(source, 'Writing Desk Story Prompt Strip Pack source', errors)
  validateNoRiskyLanguage(source, 'Writing Desk Story Prompt Strip Pack source', errors)
  return errors
}

export function validateWritingDeskStoryPromptStripPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three strip lanes and one tools lane.')

  const stripLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.strips)) {
        stripLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 27 strip lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, stripLaneFiles.length !== 3, 'sourceFiles must include exactly three strip lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneStrips = stripLaneFiles
    .flatMap(({ lane }) => lane.strips)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.strips)) {
    pushIf(
      errors,
      JSON.stringify(laneStrips) !== JSON.stringify(source.strips),
      'sourceFiles strip lanes must reproduce strips exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'stripRoutines', 'takeHomeDeskStrips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const windowSeatSceneSkills = new Set([
  'setting scene',
  'character scene',
  'object scene',
  'choice scene',
  'sequence scene',
  'sensory scene',
  'revision scene',
  'label scene',
  'clarity scene',
  'pattern scene',
  'movement scene',
  'notice scene',
])

const windowSeatSceneTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafeWindowSeatSceneLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse invented names, role words, or blank labels for every person on the scene cards\./gi, '')
    .replace(/\bUse invented names, role words, or blank labels for every person on the scene card(s)?\./gi, '')
    .replace(/\bUse broad place words instead of private details, named locations, schedules, or personal routines\./gi, '')
    .replace(/\bUse broad place words instead of private details or named locations\./gi, '')
    .replace(/\bKeep every scene card offline with the family adult, tutor, or table host\./gi, '')
    .replace(/\bKeep all window-seat writing fictional, adult-led, offline, and paper-only\./gi, '')
    .replace(/\bCheck every take-home scene slip for private details before it leaves the adult-led table\./gi, '')
    .replace(/\bCheck every take-home slip for private details before it leaves the adult-led table\./gi, '')
    .replace(/\bCheck finished scene cards for private details before they go with the family adult\./gi, '')
    .replace(/\bSharing stays optional and limited to one invented word, sketch, or line\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact location\b|\bexact places?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\bpersonal facts?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, real-home, route, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bfictional, adult-led, offline, and paper-only\b/gi, '')
    .replace(/\bmade-up story\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\breal book titles?\b|\breal author names?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b|\bwindow safety\b|\bweather safety\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, or weather-safety language.`,
  )
}

function validateWindowSeatSceneCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'sceneSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'sceneFrontPrompt',
    'sceneBackPrompt',
    'storySeedPrompt',
    'firstLinePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !card.id.startsWith('window-scene-card-'), `${label}.id must start with window-scene-card-.`)
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !windowSeatSceneSkills.has(card.sceneSkill), `${label}.sceneSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'sceneFrontPrompt',
    'sceneBackPrompt',
    'storySeedPrompt',
    'firstLinePath',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeWindowSeatSceneLanguage(card, label, errors)
}

function validateWindowSeatSceneRoutine(routine, index, names, errors) {
  const label = `sceneRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, names.has(routine.name), `${label}.name is duplicated.`)
    names.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeWindowSeatSceneLanguage(routine, label, errors)
}

function validateTakeHomeSceneSlip(slip, index, titles, errors) {
  const label = `takeHomeSceneSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !windowSeatSceneTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !windowSeatSceneSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeWindowSeatSceneLanguage(slip, label, errors)
}

export function validateWindowSeatStorySceneCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Window Seat Story Scene Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch28', 'batchId must be 2026-06-02-batch28.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== windowSeatStorySceneCardPackProductSlug,
    `productSlug must be ${windowSeatStorySceneCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Window Seat Story Scene Card Pack', 'title must be Window Seat Story Scene Card Pack.')
  pushIf(errors, source.pricePoint !== '$29', 'pricePoint must be $29.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Window Seat Story Scene Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Window Seat Story Scene Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Window Seat Story Scene Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredWindowSeatStorySceneCardPackArtifactPaths, 'Window Seat Story Scene Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.windowSeatSetup, 5, 'adultGuide.windowSeatSetup', errors)
    validateStringArray(source.adultGuide.sceneStoryCoaching, 5, 'adultGuide.sceneStoryCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeWindowSeatSceneLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.sceneRoutines), 'sceneRoutines must be an array.')
  if (Array.isArray(source.sceneRoutines)) {
    pushIf(errors, source.sceneRoutines.length !== 6, 'sceneRoutines must have exactly 6 entries.')
    const names = new Set()
    source.sceneRoutines.forEach((routine, index) => validateWindowSeatSceneRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSceneSlips), 'takeHomeSceneSlips must be an array.')
  if (Array.isArray(source.takeHomeSceneSlips)) {
    pushIf(errors, source.takeHomeSceneSlips.length !== 10, 'takeHomeSceneSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeSceneSlips.forEach((slip, index) => validateTakeHomeSceneSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateWindowSeatSceneCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeWindowSeatSceneLanguage(source, 'Window Seat Story Scene Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Window Seat Story Scene Card Pack source', errors)
  return errors
}

export function validateWindowSeatStorySceneCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three scene-card lanes and one tools lane.')

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 28 scene-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three scene-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles scene-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'sceneRoutines', 'takeHomeSceneSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}


const quietCornerMapSkills = new Set([
  'setting map',
  'message map',
  'sequence map',
  'mix-up map',
  'sensory map',
  'notice map',
  'object map',
  'helper map',
  'clue map',
  'pattern map',
  'time map',
  'revision map',
  'label map',
  'choice map',
  'order map',
  'character map',
  'clarity map',
])

const quietCornerMapTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafeQuietCornerMapLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse invented names, role words, or blank labels for every person on the map cards\./gi, '')
    .replace(/\bUse invented names, role words, or blank labels for every person on the map card(s)?\./gi, '')
    .replace(/\bUse broad place words instead of private details, named locations, schedules, or personal routines\./gi, '')
    .replace(/\bUse broad place words instead of private details or named locations\./gi, '')
    .replace(/\bKeep every map card offline with the family adult, tutor, or table host\./gi, '')
    .replace(/\bKeep all story-map writing fictional, adult-led, offline, and paper-only\./gi, '')
    .replace(/\bCheck every take-home map slip for private details before it leaves the adult-led table\./gi, '')
    .replace(/\bCheck every take-home slip for private details before it leaves the adult-led table\./gi, '')
    .replace(/\bCheck finished map cards for private details before they go with the family adult\./gi, '')
    .replace(/\bSharing stays optional and limited to one invented word, sketch, or line\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact location\b|\bexact places?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\bpersonal facts?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, real-home, route, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bfictional, adult-led, offline, and paper-only\b/gi, '')
    .replace(/\bmade-up story\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\breal book titles?\b|\breal author names?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b|\bwindow safety\b|\bweather safety\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, or weather-safety language.`,
  )
}

function validateQuietCornerMapCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'mapSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'mapFrontPrompt',
    'mapBackPrompt',
    'storyShapePrompt',
    'firstLineBridge',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !card.id.startsWith('quiet-map-card-'), `${label}.id must start with quiet-map-card-.`)
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !quietCornerMapSkills.has(card.mapSkill), `${label}.mapSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'mapFrontPrompt',
    'mapBackPrompt',
    'storyShapePrompt',
    'firstLineBridge',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeQuietCornerMapLanguage(card, label, errors)
}

function validateQuietCornerMapRoutine(routine, index, names, errors) {
  const label = `mapRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, names.has(routine.name), `${label}.name is duplicated.`)
    names.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeQuietCornerMapLanguage(routine, label, errors)
}

function validateTakeHomeMapSlip(slip, index, titles, errors) {
  const label = `takeHomeMapSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !quietCornerMapTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !quietCornerMapSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeQuietCornerMapLanguage(slip, label, errors)
}

export function validateQuietCornerStoryMapCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Quiet Corner Story Map Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch29', 'batchId must be 2026-06-02-batch29.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== quietCornerStoryMapCardPackProductSlug,
    `productSlug must be ${quietCornerStoryMapCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Quiet Corner Story Map Card Pack', 'title must be Quiet Corner Story Map Card Pack.')
  pushIf(errors, source.pricePoint !== '$31', 'pricePoint must be $31.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Quiet Corner Story Map Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Quiet Corner Story Map Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Quiet Corner Story Map Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredQuietCornerStoryMapCardPackArtifactPaths, 'Quiet Corner Story Map Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.quietCornerSetup, 5, 'adultGuide.quietCornerSetup', errors)
    validateStringArray(source.adultGuide.storyMapCoaching, 5, 'adultGuide.storyMapCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeQuietCornerMapLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.mapRoutines), 'mapRoutines must be an array.')
  if (Array.isArray(source.mapRoutines)) {
    pushIf(errors, source.mapRoutines.length !== 6, 'mapRoutines must have exactly 6 entries.')
    const names = new Set()
    source.mapRoutines.forEach((routine, index) => validateQuietCornerMapRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeMapSlips), 'takeHomeMapSlips must be an array.')
  if (Array.isArray(source.takeHomeMapSlips)) {
    pushIf(errors, source.takeHomeMapSlips.length !== 10, 'takeHomeMapSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeMapSlips.forEach((slip, index) => validateTakeHomeMapSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateQuietCornerMapCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeQuietCornerMapLanguage(source, 'Quiet Corner Story Map Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Quiet Corner Story Map Card Pack source', errors)
  return errors
}

export function validateQuietCornerStoryMapCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three map-card lanes and one tools lane.')

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 29 map-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three map-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles map-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'mapRoutines', 'takeHomeMapSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}


const porchLightSignalSkills = new Set([
  'color cue',
  'pattern cue',
  'message cue',
  'mood cue',
  'object cue',
  'sequence cue',
  'sound cue',
  'helper cue',
  'setting cue',
  'question cue',
  'revision cue',
  'ending cue',
])

const porchLightSignalTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafePorchLightSignalLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse invented names, role words, or blank labels for every person on the story signal cards\./gi, '')
    .replace(/\bUse broad place words instead of private details or named locations\./gi, '')
    .replace(/\bKeep every story signal card offline with the family adult, tutor, or table host\./gi, '')
    .replace(/\bSharing stays optional and limited to one invented word, sketch, or line\./gi, '')
    .replace(/\bCheck every take-home slip for private details before it leaves the adult-led table\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\blogins?\b|\blog in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bexact location\b|\bexact places?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\battendance\b|\bsign-?in\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\bpersonal facts?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, real-home, route, outdoor, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bfictional, adult-led, offline, and paper-only\b/gi, '')
    .replace(/\bmade-up story\b/gi, '')
    .replace(/\bpretend porch-light\b/gi, '')
    .replace(/\bpaper porch-light\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\breal book titles?\b|\breal author names?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b|\bwindow safety\b|\boutdoor safety\b|\bsafety instruction(s)?\b|\bweather safety\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, outdoor-safety, or weather-safety language.`,
  )
}

function validatePorchLightSignalCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'signalSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'signalFrontPrompt',
    'signalBackPrompt',
    'storySignalPrompt',
    'firstLineSignal',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !card.id.startsWith('porch-signal-card-'), `${label}.id must start with porch-signal-card-.`)
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !porchLightSignalSkills.has(card.signalSkill), `${label}.signalSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'signalFrontPrompt',
    'signalBackPrompt',
    'storySignalPrompt',
    'firstLineSignal',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePorchLightSignalLanguage(card, label, errors)
}

function validatePorchLightSignalRoutine(routine, index, names, errors) {
  const label = `signalRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, names.has(routine.name), `${label}.name is duplicated.`)
    names.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafePorchLightSignalLanguage(routine, label, errors)
}

function validateTakeHomeSignalSlip(slip, index, titles, errors) {
  const label = `takeHomeSignalSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !porchLightSignalTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !porchLightSignalSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePorchLightSignalLanguage(slip, label, errors)
}

export function validatePorchLightStorySignalCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Porch Light Story Signal Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch30', 'batchId must be 2026-06-02-batch30.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== porchLightStorySignalCardPackProductSlug,
    `productSlug must be ${porchLightStorySignalCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Porch Light Story Signal Card Pack', 'title must be Porch Light Story Signal Card Pack.')
  pushIf(errors, source.pricePoint !== '$33', 'pricePoint must be $33.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Porch Light Story Signal Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Porch Light Story Signal Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Porch Light Story Signal Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredPorchLightStorySignalCardPackArtifactPaths, 'Porch Light Story Signal Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.paperSignalSetup, 5, 'adultGuide.paperSignalSetup', errors)
    validateStringArray(source.adultGuide.storySignalCoaching, 5, 'adultGuide.storySignalCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafePorchLightSignalLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.signalRoutines), 'signalRoutines must be an array.')
  if (Array.isArray(source.signalRoutines)) {
    pushIf(errors, source.signalRoutines.length !== 6, 'signalRoutines must have exactly 6 entries.')
    const names = new Set()
    source.signalRoutines.forEach((routine, index) => validatePorchLightSignalRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSignalSlips), 'takeHomeSignalSlips must be an array.')
  if (Array.isArray(source.takeHomeSignalSlips)) {
    pushIf(errors, source.takeHomeSignalSlips.length !== 10, 'takeHomeSignalSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeSignalSlips.forEach((slip, index) => validateTakeHomeSignalSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validatePorchLightSignalCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafePorchLightSignalLanguage(source, 'Porch Light Story Signal Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Porch Light Story Signal Card Pack source', errors)
  return errors
}

export function validatePorchLightStorySignalCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three signal-card lanes and one tools lane.')

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 30 signal-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three signal-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles signal-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'signalRoutines', 'takeHomeSignalSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}


const pencilCaseSwitchSkills = new Set([
  'color switch',
  'pattern switch',
  'message switch',
  'mood switch',
  'object switch',
  'sequence switch',
  'sound switch',
  'helper switch',
  'setting switch',
  'question switch',
  'revision switch',
  'ending switch',
  'viewpoint switch',
  'problem switch',
  'verb switch',
])

const pencilCaseSwitchTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafePencilCaseSwitchLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bUse invented names, pretend places, and imaginary pencil case objects\./gi, '')
    .replace(/\bKeep all writing on paper and in the room or folder chosen by the adult\./gi, '')
    .replace(/\bDo not require anyone to read aloud; sharing is always optional\./gi, '')
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\breal route(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bexact location\b|\bexact places?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\bstudent records?\b|\battendance\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, real-home, route, outdoor, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bfictional, adult-led, offline, and paper-only\b/gi, '')
    .replace(/\bmade-up story\b/gi, '')
    .replace(/\bpretend pencil-case\b/gi, '')
    .replace(/\bpaper switch\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\breal book titles?\b|\breal author names?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book)?\b|\bscore(s|d|book)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b|\bfood prep\b|\bserve food\b|\breal recipe advice\b|\btast(e|es|ed|ing)?\b|\ballerg(y|ies|en|ens|ic)\b|\bwindow safety\b|\boutdoor safety\b|\bsafety instruction(s)?\b|\bweather safety\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, outdoor-safety, or weather-safety language.`,
  )
}

function validatePencilCaseSwitchCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'switchSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'switchFrontPrompt',
    'switchBackPrompt',
    'storySwitchPrompt',
    'firstLineSwitch',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(errors, !card.id.startsWith('pencil-switch-card-'), `${label}.id must start with pencil-switch-card-.`)
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !pencilCaseSwitchSkills.has(card.switchSkill), `${label}.switchSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'switchFrontPrompt',
    'switchBackPrompt',
    'storySwitchPrompt',
    'firstLineSwitch',
    'revisionNudge',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePencilCaseSwitchLanguage(card, label, errors)
}

function validatePencilCaseSwitchRoutine(routine, index, names, errors) {
  const label = `switchRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, names.has(routine.name), `${label}.name is duplicated.`)
    names.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafePencilCaseSwitchLanguage(routine, label, errors)
}

function validateTakeHomeSwitchSlip(slip, index, titles, errors) {
  const label = `takeHomeSwitchSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !pencilCaseSwitchTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !pencilCaseSwitchSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePencilCaseSwitchLanguage(slip, label, errors)
}

export function validatePencilCaseStorySwitchCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Pencil Case Story Switch Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch31', 'batchId must be 2026-06-02-batch31.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== pencilCaseStorySwitchCardPackProductSlug,
    `productSlug must be ${pencilCaseStorySwitchCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Pencil Case Story Switch Card Pack', 'title must be Pencil Case Story Switch Card Pack.')
  pushIf(errors, source.pricePoint !== '$35', 'pricePoint must be $35.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Pencil Case Story Switch Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Pencil Case Story Switch Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Pencil Case Story Switch Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredPencilCaseStorySwitchCardPackArtifactPaths, 'Pencil Case Story Switch Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.paperSwitchSetup, 5, 'adultGuide.paperSwitchSetup', errors)
    validateStringArray(source.adultGuide.storySwitchCoaching, 5, 'adultGuide.storySwitchCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafePencilCaseSwitchLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.switchRoutines), 'switchRoutines must be an array.')
  if (Array.isArray(source.switchRoutines)) {
    pushIf(errors, source.switchRoutines.length !== 6, 'switchRoutines must have exactly 6 entries.')
    const names = new Set()
    source.switchRoutines.forEach((routine, index) => validatePencilCaseSwitchRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSwitchSlips), 'takeHomeSwitchSlips must be an array.')
  if (Array.isArray(source.takeHomeSwitchSlips)) {
    pushIf(errors, source.takeHomeSwitchSlips.length !== 10, 'takeHomeSwitchSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeSwitchSlips.forEach((slip, index) => validateTakeHomeSwitchSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validatePencilCaseSwitchCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafePencilCaseSwitchLanguage(source, 'Pencil Case Story Switch Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Pencil Case Story Switch Card Pack source', errors)
  return errors
}

export function validatePencilCaseStorySwitchCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three switch-card lanes and one tools lane.')

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 31 switch-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three switch-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles switch-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'switchRoutines', 'takeHomeSwitchSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const notebookMarginRevisionSkills = new Set([
  'detail revision',
  'word swap revision',
  'sentence stretch',
  'order revision',
  'question revision',
  'setting revision',
  'character revision',
  'object revision',
  'mood revision',
  'ending revision',
  'beginning revision',
  'sound revision',
])

const notebookMarginRevisionTimes = new Set(['5 minutes', '6 minutes', '7 minutes', '8 minutes', '9 minutes'])

function validateNoUnsafeNotebookMarginRevisionLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led, paper-only, fictional, and offline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\breal route(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bexact location\b|\bexact places?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\bstudent records?\b|\battendance\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, real-home, route, outdoor, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bfictional, adult-led, offline, and paper-only\b/gi, '')
    .replace(/\badult-led, paper-only, fictional, and offline\b/gi, '')
    .replace(/\bmade-up story\b/gi, '')
    .replace(/\bnotebook-margin\b/gi, '')
    .replace(/\bpaper revision\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\breal book titles?\b|\breal author names?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b|\bfood prep\b|\bserve food\b|\breal recipe advice\b|\btast(e|es|ed|ing)?\b|\ballerg(y|ies|en|ens|ic)\b|\bwindow safety\b|\boutdoor safety\b|\bsafety instruction(s)?\b|\bweather safety\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, outdoor-safety, or weather-safety language.`,
  )
}

function validateNotebookMarginRevisionCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'revisionSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'marginPrompt',
    'draftLinePrompt',
    'revisionMovePrompt',
    'newLinePrompt',
    'checkBackPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('notebook-margin-revision-card-'),
      `${label}.id must start with notebook-margin-revision-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !notebookMarginRevisionSkills.has(card.revisionSkill), `${label}.revisionSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'marginPrompt',
    'draftLinePrompt',
    'revisionMovePrompt',
    'newLinePrompt',
    'checkBackPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeNotebookMarginRevisionLanguage(card, label, errors)
}

function validateNotebookMarginRevisionRoutine(routine, index, names, errors) {
  const label = `revisionRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, names.has(routine.name), `${label}.name is duplicated.`)
    names.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeNotebookMarginRevisionLanguage(routine, label, errors)
}

function validateTakeHomeRevisionSlip(slip, index, titles, errors) {
  const label = `takeHomeRevisionSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !notebookMarginRevisionTimes.has(slip.time), `${label}.time is not allowed.`)
  pushIf(errors, !notebookMarginRevisionSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeNotebookMarginRevisionLanguage(slip, label, errors)
}

export function validateNotebookMarginStoryRevisionCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Notebook Margin Story Revision Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch32', 'batchId must be 2026-06-02-batch32.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== notebookMarginStoryRevisionCardPackProductSlug,
    `productSlug must be ${notebookMarginStoryRevisionCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Notebook Margin Story Revision Card Pack', 'title must be Notebook Margin Story Revision Card Pack.')
  pushIf(errors, source.pricePoint !== '$37', 'pricePoint must be $37.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Notebook Margin Story Revision Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Notebook Margin Story Revision Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Notebook Margin Story Revision Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredNotebookMarginStoryRevisionCardPackArtifactPaths, 'Notebook Margin Story Revision Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.paperRevisionSetup, 5, 'adultGuide.paperRevisionSetup', errors)
    validateStringArray(source.adultGuide.revisionCoaching, 5, 'adultGuide.revisionCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeNotebookMarginRevisionLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.revisionRoutines), 'revisionRoutines must be an array.')
  if (Array.isArray(source.revisionRoutines)) {
    pushIf(errors, source.revisionRoutines.length !== 6, 'revisionRoutines must have exactly 6 entries.')
    const names = new Set()
    source.revisionRoutines.forEach((routine, index) => validateNotebookMarginRevisionRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeRevisionSlips), 'takeHomeRevisionSlips must be an array.')
  if (Array.isArray(source.takeHomeRevisionSlips)) {
    pushIf(errors, source.takeHomeRevisionSlips.length !== 10, 'takeHomeRevisionSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeRevisionSlips.forEach((slip, index) => validateTakeHomeRevisionSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateNotebookMarginRevisionCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeNotebookMarginRevisionLanguage(source, 'Notebook Margin Story Revision Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Notebook Margin Story Revision Card Pack source', errors)
  return errors
}

export function validateNotebookMarginStoryRevisionCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three revision-card lanes and one tools lane.')

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 32 revision-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three revision-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles revision-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'revisionRoutines', 'takeHomeRevisionSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const deskDrawerSequenceSkills = new Set([
  'beginning sequence',
  'middle sequence',
  'ending sequence',
  'first-next-finally',
  'cause and effect',
  'transition words',
  'event order',
  'object sequence',
  'setting sequence',
  'character choice sequence',
  'problem-solution sequence',
  'detail sequence',
])

const deskDrawerSequenceSlipLabels = new Set([
  'one-card slip',
  'bridge slip',
  'closing slip',
  'first-next-finally row',
  'because chain',
  'transition word slip',
  'event order slip',
  'object path slip',
  'setting row slip',
  'problem-solution slip',
])

function validateNoUnsafeDeskDrawerSequenceLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led, paper-only, fictional, and offline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\breal route(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bexact location\b|\bexact places?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\bstudent records?\b|\battendance\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, real-home, route, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bfictional, adult-led, offline, and paper-only\b/gi, '')
    .replace(/\badult-led, paper-only, fictional, and offline\b/gi, '')
    .replace(/\bmade-up story\b/gi, '')
    .replace(/\bdesk-drawer\b/gi, '')
    .replace(/\bdesk drawer\b/gi, '')
    .replace(/\bpaper sequence\b/gi, '')
    .replace(/\bsequence card(s)?\b/gi, '')
    .replace(/\btake-home\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\breal book titles?\b|\breal author names?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b|\bfood prep\b|\bserve food\b|\breal recipe advice\b|\btast(e|es|ed|ing)?\b|\ballerg(y|ies|en|ens|ic)\b|\bwindow safety\b|\boutdoor safety\b|\bsafety instruction(s)?\b|\bweather safety\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, outdoor-safety, or weather-safety language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateDeskDrawerSequenceCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'sequenceSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'firstPrompt',
    'nextPrompt',
    'thenPrompt',
    'finallyPrompt',
    'transitionPrompt',
    'checkBackPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('desk-drawer-sequence-card-'),
      `${label}.id must start with desk-drawer-sequence-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !deskDrawerSequenceSkills.has(card.sequenceSkill), `${label}.sequenceSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'firstPrompt',
    'nextPrompt',
    'thenPrompt',
    'finallyPrompt',
    'transitionPrompt',
    'checkBackPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeDeskDrawerSequenceLanguage(card, label, errors)
}

function validateDeskDrawerSequenceRoutine(routine, index, names, errors) {
  const label = `sequenceRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, names.has(routine.name), `${label}.name is duplicated.`)
    names.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeDeskDrawerSequenceLanguage(routine, label, errors)
}

function validateTakeHomeSequenceSlip(slip, index, titles, errors) {
  const label = `takeHomeSequenceSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !deskDrawerSequenceSlipLabels.has(slip.time), `${label}.time must use a non-timed take-home slip label.`)
  pushIf(errors, !deskDrawerSequenceSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeDeskDrawerSequenceLanguage(slip, label, errors)
}

export function validateDeskDrawerStorySequenceCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Desk Drawer Story Sequence Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-02-batch33', 'batchId must be 2026-06-02-batch33.')
  pushIf(errors, source.generatedAt !== '2026-06-02', 'generatedAt must be 2026-06-02.')
  pushIf(
    errors,
    source.productSlug !== deskDrawerStorySequenceCardPackProductSlug,
    `productSlug must be ${deskDrawerStorySequenceCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Desk Drawer Story Sequence Card Pack', 'title must be Desk Drawer Story Sequence Card Pack.')
  pushIf(errors, source.pricePoint !== '$39', 'pricePoint must be $39.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Desk Drawer Story Sequence Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Desk Drawer Story Sequence Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Desk Drawer Story Sequence Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredDeskDrawerStorySequenceCardPackArtifactPaths, 'Desk Drawer Story Sequence Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.paperSequenceSetup, 5, 'adultGuide.paperSequenceSetup', errors)
    validateStringArray(source.adultGuide.sequenceCoaching, 5, 'adultGuide.sequenceCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeDeskDrawerSequenceLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.sequenceRoutines), 'sequenceRoutines must be an array.')
  if (Array.isArray(source.sequenceRoutines)) {
    pushIf(errors, source.sequenceRoutines.length !== 6, 'sequenceRoutines must have exactly 6 entries.')
    const names = new Set()
    source.sequenceRoutines.forEach((routine, index) => validateDeskDrawerSequenceRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSequenceSlips), 'takeHomeSequenceSlips must be an array.')
  if (Array.isArray(source.takeHomeSequenceSlips)) {
    pushIf(errors, source.takeHomeSequenceSlips.length !== 10, 'takeHomeSequenceSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeSequenceSlips.forEach((slip, index) => validateTakeHomeSequenceSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateDeskDrawerSequenceCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeDeskDrawerSequenceLanguage(source, 'Desk Drawer Story Sequence Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Desk Drawer Story Sequence Card Pack source', errors)
  return errors
}

export function validateDeskDrawerStorySequenceCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three sequence-card lanes and one tools lane.')

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 33 sequence-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three sequence-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles sequence-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'sequenceRoutines', 'takeHomeSequenceSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const readingNookCauseEffectSkills = new Set([
  'clear cause',
  'direct effect',
  'because statement',
  'so result',
  'cause-and-effect chain',
  'character choice cause',
  'setting effect',
  'object cause',
  'problem cause',
  'reaction effect',
  'first cause',
  'final result',
])

const readingNookCauseEffectSlipLabels = new Set([
  'one-card slip',
  'because slip',
  'so slip',
  'chain slip',
  'effect arrow slip',
  'choice slip',
  'setting slip',
  'object slip',
  'problem-result slip',
  'final result slip',
])

function validateNoUnsafeReadingNookCauseEffectLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led, paper-only, fictional, and offline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bpaper pack keeps finished pages with the family adult\b/gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\bgps\b|\bcoordinates?\b|\breal route(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bexact location\b|\bexact places?\b|\bphone(s)?\b|\bemails?\b|\bphotos?\b|\bcameras?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\bstudent records?\b|\battendance\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, exact-place, real-home, route, contact, photo/camera, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bfictional, adult-led, offline, and paper-only\b/gi, '')
    .replace(/\badult-led, paper-only, fictional, and offline\b/gi, '')
    .replace(/\bmade-up story\b/gi, '')
    .replace(/\breading nook\b/gi, '')
    .replace(/\breading-nook\b/gi, '')
    .replace(/\bpretend page\b/gi, '')
    .replace(/\bpretend pages\b/gi, '')
    .replace(/\bblank cover shape(s)?\b/gi, '')
    .replace(/\bpaper bookmark(s)?\b/gi, '')
    .replace(/\bpaper card(s)?\b/gi, '')
    .replace(/\bcause-and-effect\b/gi, '')
    .replace(/\bcause\/effect\b/gi, '')
    .replace(/\btake-home\b/gi, '')
  pushIf(
    errors,
    /\bHarry Potter\b|\bJ\.?\s*K\.?\s*Rowling\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bbrand(ed)? character(s)?\b|\blogos?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bmedical\b|\bdoctor(s)?\b|\bdentist(s)?\b|\bsymptom(s)?\b|\bmedicine(s)?\b|\bmedication(s)?\b|\bemergency\b|\btreatment(s)?\b|\blegal\b|\blawyer(s)?\b|\battorney(s)?\b|\btherapy\b|\btherapist(s)?\b|\bdiagnos(is|e|es|ed|ing|tic)\b|\bgrief\b|\bassessment(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bguarantee(s|d)?\b|\bguaranteed\b|\bcontest(s)?\b|\bprizes?\b|\btimer(s)?\b|\btimed\b|\bgambling\b|\bbet(s|ting)?\b|\bcasino(s)?\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bchurch(es)?\b|\btemple(s)?\b|\bmosque(s)?\b|\bsynagogue(s)?\b|\bprayer(s)?\b|\bjesus\b|\bgod\b|\bromance\b|\bkiss(ing)?\b|\bdating\b|\bweapon(s)?\b|\bgun(s)?\b|\bsword(s)?\b|\bfight(ing)?\b|\bkill(s|ed|ing)?\b|\bblood\b|\bhorror\b|\bad(s)? targeted to children\b|\bclimb(s|ed|ing)?\b|\bjump(s|ed|ing)?\b|\brun(s|ning)?\b|\broughhouse\b|\bwrestl(e|ing)\b|\bblindfold(s|ed)?\b|\bstairs?\b|\bmatchstick(s)?\b|\blighter(s)?\b|\bfood prep\b|\bserve food\b|\breal recipe advice\b|\btast(e|es|ed|ing)?\b|\ballerg(y|ies|en|ens|ic)\b|\bwindow safety\b|\boutdoor safety\b|\bsafety instruction(s)?\b|\bweather safety\b/i.test(
      safetyText,
    ),
    `${label} includes real book title, author, publisher, franchise, branded/copyrighted, review/rating, medical, legal, therapy, diagnosis, grief, assessment, grade, score, guaranteed-outcome, contest, prize, timer-pressure, gambling, politics, religion, romance, weapon, violence, ad-targeting, unsafe physical, window-safety, outdoor-safety, or weather-safety language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      safetyText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateReadingNookCauseEffectCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'causeEffectSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'causePrompt',
    'effectPrompt',
    'becausePrompt',
    'soPrompt',
    'chainPrompt',
    'checkBackPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('reading-nook-cause-effect-card-'),
      `${label}.id must start with reading-nook-cause-effect-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !readingNookCauseEffectSkills.has(card.causeEffectSkill), `${label}.causeEffectSkill is not allowed.`)
  pushIf(errors, !['6-8', '7-8', '7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'causePrompt',
    'effectPrompt',
    'becausePrompt',
    'soPrompt',
    'chainPrompt',
    'checkBackPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeReadingNookCauseEffectLanguage(card, label, errors)
}

function validateReadingNookCauseEffectRoutine(routine, index, names, errors) {
  const label = `causeEffectRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['name', 'bestFor']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.name)) {
    pushIf(errors, names.has(routine.name), `${label}.name is duplicated.`)
    names.add(routine.name)
  }
  validateExactStringArray(routine.steps, 4, `${label}.steps`, errors)
  validateNoUnsafeReadingNookCauseEffectLanguage(routine, label, errors)
}

function validateTakeHomeCauseEffectSlip(slip, index, titles, errors) {
  const label = `takeHomeCauseEffectSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !readingNookCauseEffectSlipLabels.has(slip.time), `${label}.time must use a non-timed take-home slip label.`)
  pushIf(errors, !readingNookCauseEffectSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeReadingNookCauseEffectLanguage(slip, label, errors)
}

export function validateReadingNookStoryCauseEffectCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Reading Nook Story Cause-and-Effect Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch34', 'batchId must be 2026-06-03-batch34.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== readingNookStoryCauseEffectCardPackProductSlug,
    `productSlug must be ${readingNookStoryCauseEffectCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Reading Nook Story Cause-and-Effect Card Pack', 'title must be Reading Nook Story Cause-and-Effect Card Pack.')
  pushIf(errors, source.pricePoint !== '$41', 'pricePoint must be $41.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Reading Nook Story Cause-and-Effect Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Reading Nook Story Cause-and-Effect Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Reading Nook Story Cause-and-Effect Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredReadingNookStoryCauseEffectCardPackArtifactPaths, 'Reading Nook Story Cause-and-Effect Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateStringArray(source.adultGuide.paperCauseEffectSetup, 5, 'adultGuide.paperCauseEffectSetup', errors)
    validateStringArray(source.adultGuide.causeEffectCoaching, 5, 'adultGuide.causeEffectCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeReadingNookCauseEffectLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.causeEffectRoutines), 'causeEffectRoutines must be an array.')
  if (Array.isArray(source.causeEffectRoutines)) {
    pushIf(errors, source.causeEffectRoutines.length !== 6, 'causeEffectRoutines must have exactly 6 entries.')
    const names = new Set()
    source.causeEffectRoutines.forEach((routine, index) => validateReadingNookCauseEffectRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeCauseEffectSlips), 'takeHomeCauseEffectSlips must be an array.')
  if (Array.isArray(source.takeHomeCauseEffectSlips)) {
    pushIf(errors, source.takeHomeCauseEffectSlips.length !== 10, 'takeHomeCauseEffectSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeCauseEffectSlips.forEach((slip, index) => validateTakeHomeCauseEffectSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateReadingNookCauseEffectCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeReadingNookCauseEffectLanguage(source, 'Reading Nook Story Cause-and-Effect Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Reading Nook Story Cause-and-Effect Card Pack source', errors)
  return errors
}

export function validateReadingNookStoryCauseEffectCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three cause/effect-card lanes and one tools lane.')

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 34 cause/effect-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three cause/effect-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles cause/effect-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'causeEffectRoutines', 'takeHomeCauseEffectSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

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
    artifact?.pdfPath === requiredReadingNookStoryCauseEffectCardPackArtifactPaths.pdfPath
      ? requiredReadingNookStoryCauseEffectCardPackArtifactPaths
      : artifact?.pdfPath === requiredDeskDrawerStorySequenceCardPackArtifactPaths.pdfPath
      ? requiredDeskDrawerStorySequenceCardPackArtifactPaths
      : artifact?.pdfPath === requiredNotebookMarginStoryRevisionCardPackArtifactPaths.pdfPath
      ? requiredNotebookMarginStoryRevisionCardPackArtifactPaths
      : artifact?.pdfPath === requiredPencilCaseStorySwitchCardPackArtifactPaths.pdfPath
      ? requiredPencilCaseStorySwitchCardPackArtifactPaths
      : artifact?.pdfPath === requiredPorchLightStorySignalCardPackArtifactPaths.pdfPath
      ? requiredPorchLightStorySignalCardPackArtifactPaths
      : artifact?.pdfPath === requiredQuietCornerStoryMapCardPackArtifactPaths.pdfPath
      ? requiredQuietCornerStoryMapCardPackArtifactPaths
      : artifact?.pdfPath === requiredWindowSeatStorySceneCardPackArtifactPaths.pdfPath
      ? requiredWindowSeatStorySceneCardPackArtifactPaths
      : artifact?.pdfPath === requiredWritingDeskStoryPromptStripPackArtifactPaths.pdfPath
      ? requiredWritingDeskStoryPromptStripPackArtifactPaths
      : artifact?.pdfPath === requiredBookshopStoryBookmarkPackArtifactPaths.pdfPath
      ? requiredBookshopStoryBookmarkPackArtifactPaths
      : artifact?.pdfPath === requiredKitchenTableStoryRecipeCardDeckArtifactPaths.pdfPath
      ? requiredKitchenTableStoryRecipeCardDeckArtifactPaths
      : artifact?.pdfPath === requiredBackyardStorySeedPacketKitArtifactPaths.pdfPath
      ? requiredBackyardStorySeedPacketKitArtifactPaths
      : artifact?.pdfPath === requiredNatureWalkStoryFieldNotesKitArtifactPaths.pdfPath
      ? requiredNatureWalkStoryFieldNotesKitArtifactPaths
      : artifact?.pdfPath === requiredThankYouNoteStoryPostcardPackArtifactPaths.pdfPath
      ? requiredThankYouNoteStoryPostcardPackArtifactPaths
      : artifact?.pdfPath === requiredGrandparentStoryVisitKitArtifactPaths.pdfPath
      ? requiredGrandparentStoryVisitKitArtifactPaths
      : artifact?.pdfPath === requiredFamilyGameNightStoryCardDeckArtifactPaths.pdfPath
      ? requiredFamilyGameNightStoryCardDeckArtifactPaths
      : artifact?.pdfPath === requiredMuseumDayStoryNotebookArtifactPaths.pdfPath
      ? requiredMuseumDayStoryNotebookArtifactPaths
      : artifact?.pdfPath === requiredAfterSchoolStoryClubArtifactPaths.pdfPath
      ? requiredAfterSchoolStoryClubArtifactPaths
      : artifact?.pdfPath === requiredSummerCampStoryCircleArtifactPaths.pdfPath
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
