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
export const blanketFortStoryDialogueCardPackProductSlug = 'blanket-fort-story-dialogue-card-pack'
export const kitchenWindowStoryPovCardPackProductSlug = 'kitchen-window-story-pov-card-pack'
export const coatPocketStoryCharacterCardPackProductSlug = 'coat-pocket-story-character-card-pack'
export const paperTrayStorySettingCardPackProductSlug = 'paper-tray-story-setting-card-pack'
export const backpackStoryEndingCardPackProductSlug = 'backpack-story-ending-card-pack'
export const pencilCupStoryOpeningCardPackProductSlug = 'pencil-cup-story-opening-card-pack'
export const deskLampStoryProblemCardPackProductSlug = 'desk-lamp-story-problem-card-pack'
export const paperClipStorySolutionCardPackProductSlug = 'paper-clip-story-solution-card-pack'
export const binderClipStoryTransitionCardPackProductSlug = 'binder-clip-story-transition-card-pack'
export const folderTabStoryDetailCardPackProductSlug = 'folder-tab-story-detail-card-pack'
export const indexCardStoryShowNotTellCardPackProductSlug =
  'index-card-story-show-not-tell-card-pack'
export const stickyNoteStoryToneCardPackProductSlug = 'sticky-note-story-tone-card-pack'
export const washiTapeStoryWordChoiceCardPackProductSlug =
  'washi-tape-story-word-choice-card-pack'
export const paperSleeveStorySentenceVarietyCardPackProductSlug =
  'paper-sleeve-story-sentence-variety-card-pack'
export const clipboardStoryParagraphFocusCardPackProductSlug =
  'clipboard-story-paragraph-focus-card-pack'
export const linedPaperStoryParagraphRevisionCardPackProductSlug =
  'lined-paper-story-paragraph-revision-card-pack'
export const compositionNotebookStoryDraftChecklistCardPackProductSlug =
  'composition-notebook-story-draft-checklist-card-pack'
export const spiralNotebookStoryFinalCopyCardPackProductSlug =
  'spiral-notebook-story-final-copy-card-pack'
export const tabbedFolderStorySeriesCardPackProductSlug =
  'tabbed-folder-story-series-card-pack'
export const accordionFolderStoryArcCardPackProductSlug =
  'accordion-folder-story-arc-card-pack'
export const expandingFileStorySceneChainCardPackProductSlug =
  'expanding-file-story-scene-chain-card-pack'
export const manilaFolderStoryClueTrailCardPackProductSlug =
  'manila-folder-story-clue-trail-card-pack'
export const pocketFolderStoryGoalPathCardPackProductSlug =
  'pocket-folder-story-goal-path-card-pack'
export const hangingFileStoryDecisionPointCardPackProductSlug =
  'hanging-file-story-decision-point-card-pack'
export const fileBoxStoryTurningPointCardPackProductSlug =
  'file-box-story-turning-point-card-pack'

const requiredSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'
const expandingFileStorySceneChainRequiredSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'
const manilaFolderStoryClueTrailRequiredSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'
const pocketFolderStoryGoalPathRequiredSafety = manilaFolderStoryClueTrailRequiredSafety
const hangingFileStoryDecisionPointRequiredSafety = manilaFolderStoryClueTrailRequiredSafety
const fileBoxStoryTurningPointRequiredSafety = manilaFolderStoryClueTrailRequiredSafety

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

const requiredBlanketFortStoryDialogueCardPackArtifactPaths = {
  pdfPath:
    'product-build/blanket-fort-story-dialogue-card-pack/Blanket-Fort-Story-Dialogue-Card-Pack.pdf',
  zipPath:
    'product-build/blanket-fort-story-dialogue-card-pack/blanket-fort-story-dialogue-card-pack.zip',
  sourceHtmlPath:
    'product-build/blanket-fort-story-dialogue-card-pack/source/blanket-fort-story-dialogue-card-pack.html',
  manifestPath: 'product-build/blanket-fort-story-dialogue-card-pack/manifest.json',
}

const requiredKitchenWindowStoryPovCardPackArtifactPaths = {
  pdfPath:
    'product-build/kitchen-window-story-pov-card-pack/Kitchen-Window-Story-Point-of-View-Card-Pack.pdf',
  zipPath:
    'product-build/kitchen-window-story-pov-card-pack/kitchen-window-story-pov-card-pack.zip',
  sourceHtmlPath:
    'product-build/kitchen-window-story-pov-card-pack/source/kitchen-window-story-pov-card-pack.html',
  manifestPath: 'product-build/kitchen-window-story-pov-card-pack/manifest.json',
}

const requiredCoatPocketStoryCharacterCardPackArtifactPaths = {
  pdfPath:
    'product-build/coat-pocket-story-character-card-pack/Coat-Pocket-Story-Character-Card-Pack.pdf',
  zipPath:
    'product-build/coat-pocket-story-character-card-pack/coat-pocket-story-character-card-pack.zip',
  sourceHtmlPath:
    'product-build/coat-pocket-story-character-card-pack/source/coat-pocket-story-character-card-pack.html',
  manifestPath: 'product-build/coat-pocket-story-character-card-pack/manifest.json',
}

const requiredPaperTrayStorySettingCardPackArtifactPaths = {
  pdfPath:
    'product-build/paper-tray-story-setting-card-pack/Paper-Tray-Story-Setting-Card-Pack.pdf',
  zipPath:
    'product-build/paper-tray-story-setting-card-pack/paper-tray-story-setting-card-pack.zip',
  sourceHtmlPath:
    'product-build/paper-tray-story-setting-card-pack/source/paper-tray-story-setting-card-pack.html',
  manifestPath: 'product-build/paper-tray-story-setting-card-pack/manifest.json',
}

const requiredBackpackStoryEndingCardPackArtifactPaths = {
  pdfPath:
    'product-build/backpack-story-ending-card-pack/Backpack-Story-Ending-Card-Pack.pdf',
  zipPath:
    'product-build/backpack-story-ending-card-pack/backpack-story-ending-card-pack.zip',
  sourceHtmlPath:
    'product-build/backpack-story-ending-card-pack/source/backpack-story-ending-card-pack.html',
  manifestPath: 'product-build/backpack-story-ending-card-pack/manifest.json',
}

const requiredPencilCupStoryOpeningCardPackArtifactPaths = {
  pdfPath:
    'product-build/pencil-cup-story-opening-card-pack/Pencil-Cup-Story-Opening-Card-Pack.pdf',
  zipPath:
    'product-build/pencil-cup-story-opening-card-pack/pencil-cup-story-opening-card-pack.zip',
  sourceHtmlPath:
    'product-build/pencil-cup-story-opening-card-pack/source/pencil-cup-story-opening-card-pack.html',
  manifestPath: 'product-build/pencil-cup-story-opening-card-pack/manifest.json',
}

const requiredDeskLampStoryProblemCardPackArtifactPaths = {
  pdfPath:
    'product-build/desk-lamp-story-problem-card-pack/Desk-Lamp-Story-Problem-Card-Pack.pdf',
  zipPath:
    'product-build/desk-lamp-story-problem-card-pack/desk-lamp-story-problem-card-pack.zip',
  sourceHtmlPath:
    'product-build/desk-lamp-story-problem-card-pack/source/desk-lamp-story-problem-card-pack.html',
  manifestPath: 'product-build/desk-lamp-story-problem-card-pack/manifest.json',
}

const requiredPaperClipStorySolutionCardPackArtifactPaths = {
  pdfPath:
    'product-build/paper-clip-story-solution-card-pack/Paper-Clip-Story-Solution-Card-Pack.pdf',
  zipPath:
    'product-build/paper-clip-story-solution-card-pack/paper-clip-story-solution-card-pack.zip',
  sourceHtmlPath:
    'product-build/paper-clip-story-solution-card-pack/source/paper-clip-story-solution-card-pack.html',
  manifestPath: 'product-build/paper-clip-story-solution-card-pack/manifest.json',
}

const requiredBinderClipStoryTransitionCardPackArtifactPaths = {
  pdfPath:
    'product-build/binder-clip-story-transition-card-pack/Binder-Clip-Story-Transition-Card-Pack.pdf',
  zipPath:
    'product-build/binder-clip-story-transition-card-pack/binder-clip-story-transition-card-pack.zip',
  sourceHtmlPath:
    'product-build/binder-clip-story-transition-card-pack/source/binder-clip-story-transition-card-pack.html',
  manifestPath: 'product-build/binder-clip-story-transition-card-pack/manifest.json',
}

const requiredFolderTabStoryDetailCardPackArtifactPaths = {
  pdfPath:
    'product-build/folder-tab-story-detail-card-pack/Folder-Tab-Story-Detail-Card-Pack.pdf',
  zipPath:
    'product-build/folder-tab-story-detail-card-pack/folder-tab-story-detail-card-pack.zip',
  sourceHtmlPath:
    'product-build/folder-tab-story-detail-card-pack/source/folder-tab-story-detail-card-pack.html',
  manifestPath: 'product-build/folder-tab-story-detail-card-pack/manifest.json',
}

const requiredIndexCardStoryShowNotTellCardPackArtifactPaths = {
  pdfPath:
    'product-build/index-card-story-show-not-tell-card-pack/Index-Card-Story-Show-Not-Tell-Card-Pack.pdf',
  zipPath:
    'product-build/index-card-story-show-not-tell-card-pack/index-card-story-show-not-tell-card-pack.zip',
  sourceHtmlPath:
    'product-build/index-card-story-show-not-tell-card-pack/source/index-card-story-show-not-tell-card-pack.html',
  manifestPath: 'product-build/index-card-story-show-not-tell-card-pack/manifest.json',
}

const requiredStickyNoteStoryToneCardPackArtifactPaths = {
  pdfPath:
    'product-build/sticky-note-story-tone-card-pack/Sticky-Note-Story-Tone-Card-Pack.pdf',
  zipPath:
    'product-build/sticky-note-story-tone-card-pack/sticky-note-story-tone-card-pack.zip',
  sourceHtmlPath:
    'product-build/sticky-note-story-tone-card-pack/source/sticky-note-story-tone-card-pack.html',
  manifestPath: 'product-build/sticky-note-story-tone-card-pack/manifest.json',
}

const requiredWashiTapeStoryWordChoiceCardPackArtifactPaths = {
  pdfPath:
    'product-build/washi-tape-story-word-choice-card-pack/Washi-Tape-Story-Word-Choice-Card-Pack.pdf',
  zipPath:
    'product-build/washi-tape-story-word-choice-card-pack/washi-tape-story-word-choice-card-pack.zip',
  sourceHtmlPath:
    'product-build/washi-tape-story-word-choice-card-pack/source/washi-tape-story-word-choice-card-pack.html',
  manifestPath: 'product-build/washi-tape-story-word-choice-card-pack/manifest.json',
}

const requiredPaperSleeveStorySentenceVarietyCardPackArtifactPaths = {
  pdfPath:
    'product-build/paper-sleeve-story-sentence-variety-card-pack/Paper-Sleeve-Story-Sentence-Variety-Card-Pack.pdf',
  zipPath:
    'product-build/paper-sleeve-story-sentence-variety-card-pack/paper-sleeve-story-sentence-variety-card-pack.zip',
  sourceHtmlPath:
    'product-build/paper-sleeve-story-sentence-variety-card-pack/source/paper-sleeve-story-sentence-variety-card-pack.html',
  manifestPath: 'product-build/paper-sleeve-story-sentence-variety-card-pack/manifest.json',
}

const requiredClipboardStoryParagraphFocusCardPackArtifactPaths = {
  pdfPath:
    'product-build/clipboard-story-paragraph-focus-card-pack/Clipboard-Story-Paragraph-Focus-Card-Pack.pdf',
  zipPath:
    'product-build/clipboard-story-paragraph-focus-card-pack/clipboard-story-paragraph-focus-card-pack.zip',
  sourceHtmlPath:
    'product-build/clipboard-story-paragraph-focus-card-pack/source/clipboard-story-paragraph-focus-card-pack.html',
  manifestPath: 'product-build/clipboard-story-paragraph-focus-card-pack/manifest.json',
}

const requiredLinedPaperStoryParagraphRevisionCardPackArtifactPaths = {
  pdfPath:
    'product-build/lined-paper-story-paragraph-revision-card-pack/Lined-Paper-Story-Paragraph-Revision-Card-Pack.pdf',
  zipPath:
    'product-build/lined-paper-story-paragraph-revision-card-pack/lined-paper-story-paragraph-revision-card-pack.zip',
  sourceHtmlPath:
    'product-build/lined-paper-story-paragraph-revision-card-pack/source/lined-paper-story-paragraph-revision-card-pack.html',
  manifestPath: 'product-build/lined-paper-story-paragraph-revision-card-pack/manifest.json',
}

const requiredCompositionNotebookStoryDraftChecklistCardPackArtifactPaths = {
  pdfPath:
    'product-build/composition-notebook-story-draft-checklist-card-pack/Composition-Notebook-Story-Draft-Checklist-Card-Pack.pdf',
  zipPath:
    'product-build/composition-notebook-story-draft-checklist-card-pack/composition-notebook-story-draft-checklist-card-pack.zip',
  sourceHtmlPath:
    'product-build/composition-notebook-story-draft-checklist-card-pack/source/composition-notebook-story-draft-checklist-card-pack.html',
  manifestPath: 'product-build/composition-notebook-story-draft-checklist-card-pack/manifest.json',
}

const requiredSpiralNotebookStoryFinalCopyCardPackArtifactPaths = {
  pdfPath:
    'product-build/spiral-notebook-story-final-copy-card-pack/Spiral-Notebook-Story-Final-Copy-Card-Pack.pdf',
  zipPath:
    'product-build/spiral-notebook-story-final-copy-card-pack/spiral-notebook-story-final-copy-card-pack.zip',
  sourceHtmlPath:
    'product-build/spiral-notebook-story-final-copy-card-pack/source/spiral-notebook-story-final-copy-card-pack.html',
  manifestPath: 'product-build/spiral-notebook-story-final-copy-card-pack/manifest.json',
}

const requiredTabbedFolderStorySeriesCardPackArtifactPaths = {
  pdfPath:
    'product-build/tabbed-folder-story-series-card-pack/Tabbed-Folder-Story-Series-Card-Pack.pdf',
  zipPath:
    'product-build/tabbed-folder-story-series-card-pack/tabbed-folder-story-series-card-pack.zip',
  sourceHtmlPath:
    'product-build/tabbed-folder-story-series-card-pack/source/tabbed-folder-story-series-card-pack.html',
  manifestPath: 'product-build/tabbed-folder-story-series-card-pack/manifest.json',
}

const requiredAccordionFolderStoryArcCardPackArtifactPaths = {
  pdfPath:
    'product-build/accordion-folder-story-arc-card-pack/Accordion-Folder-Story-Arc-Card-Pack.pdf',
  zipPath:
    'product-build/accordion-folder-story-arc-card-pack/accordion-folder-story-arc-card-pack.zip',
  sourceHtmlPath:
    'product-build/accordion-folder-story-arc-card-pack/source/accordion-folder-story-arc-card-pack.html',
  manifestPath: 'product-build/accordion-folder-story-arc-card-pack/manifest.json',
}

const requiredExpandingFileStorySceneChainCardPackArtifactPaths = {
  pdfPath:
    'product-build/expanding-file-story-scene-chain-card-pack/Expanding-File-Story-Scene-Chain-Card-Pack.pdf',
  zipPath:
    'product-build/expanding-file-story-scene-chain-card-pack/expanding-file-story-scene-chain-card-pack.zip',
  sourceHtmlPath:
    'product-build/expanding-file-story-scene-chain-card-pack/source/expanding-file-story-scene-chain-card-pack.html',
  manifestPath: 'product-build/expanding-file-story-scene-chain-card-pack/manifest.json',
}

const requiredManilaFolderStoryClueTrailCardPackArtifactPaths = {
  pdfPath:
    'product-build/manila-folder-story-clue-trail-card-pack/Manila-Folder-Story-Clue-Trail-Card-Pack.pdf',
  zipPath:
    'product-build/manila-folder-story-clue-trail-card-pack/manila-folder-story-clue-trail-card-pack.zip',
  sourceHtmlPath:
    'product-build/manila-folder-story-clue-trail-card-pack/source/manila-folder-story-clue-trail-card-pack.html',
  manifestPath: 'product-build/manila-folder-story-clue-trail-card-pack/manifest.json',
}

const requiredPocketFolderStoryGoalPathCardPackArtifactPaths = {
  pdfPath:
    'product-build/pocket-folder-story-goal-path-card-pack/Pocket-Folder-Story-Goal-Path-Card-Pack.pdf',
  zipPath:
    'product-build/pocket-folder-story-goal-path-card-pack/pocket-folder-story-goal-path-card-pack.zip',
  sourceHtmlPath:
    'product-build/pocket-folder-story-goal-path-card-pack/source/pocket-folder-story-goal-path-card-pack.html',
  manifestPath: 'product-build/pocket-folder-story-goal-path-card-pack/manifest.json',
}

const requiredHangingFileStoryDecisionPointCardPackArtifactPaths = {
  pdfPath:
    'product-build/hanging-file-story-decision-point-card-pack/Hanging-File-Story-Decision-Point-Card-Pack.pdf',
  zipPath:
    'product-build/hanging-file-story-decision-point-card-pack/hanging-file-story-decision-point-card-pack.zip',
  sourceHtmlPath:
    'product-build/hanging-file-story-decision-point-card-pack/source/hanging-file-story-decision-point-card-pack.html',
  manifestPath: 'product-build/hanging-file-story-decision-point-card-pack/manifest.json',
}

const requiredFileBoxStoryTurningPointCardPackArtifactPaths = {
  pdfPath:
    'product-build/file-box-story-turning-point-card-pack/File-Box-Story-Turning-Point-Card-Pack.pdf',
  zipPath:
    'product-build/file-box-story-turning-point-card-pack/file-box-story-turning-point-card-pack.zip',
  sourceHtmlPath:
    'product-build/file-box-story-turning-point-card-pack/source/file-box-story-turning-point-card-pack.html',
  manifestPath: 'product-build/file-box-story-turning-point-card-pack/manifest.json',
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

const blanketFortDialogueSkills = new Set([
  'greeting line',
  'question reply',
  'feeling clue',
  'dialogue tag',
  'turn-taking',
  'revise for voice',
  'setting-aware line',
  'object clue line',
  'problem-solving reply',
  'listener reaction',
  'polite disagreement',
  'closing line',
])

const blanketFortDialogueSlipLabels = new Set([
  'one-line slip',
  'question slip',
  'reply slip',
  'tag slip',
  'voice slip',
  'turn slip',
  'feeling slip',
  'object slip',
  'problem-reply slip',
  'closing slip',
])

function validateNoUnsafeBlanketFortDialogueLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const accountText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily folder\b/gi, '')
    .replace(/\bfamily adult\b/gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\bgps\b|\bcoordinates?\b|\breal route(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bexact location\b|\bexact places?\b|\bemails?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\bstudent records?\b|\battendance\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      accountText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device, photo/camera, private-conversation, exact-place, real-home, route, contact, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bfictional, gentle, paper-only, or adult-led\b/gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\bpaper writing only\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\bblanket fort\b/gi, '')
    .replace(/\bblanket-fort\b/gi, '')
    .replace(/\bpaper card(s)?\b/gi, '')
    .replace(/\bpaper slip(s)?\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
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

function validateBlanketFortDialogueCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'dialogueSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'speakerOnePrompt',
    'speakerTwoPrompt',
    'dialogueTagPrompt',
    'feelingCluePrompt',
    'replyPrompt',
    'reviseLinePrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('blanket-fort-dialogue-card-'),
      `${label}.id must start with blanket-fort-dialogue-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !blanketFortDialogueSkills.has(card.dialogueSkill), `${label}.dialogueSkill is not allowed.`)
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
    'speakerOnePrompt',
    'speakerTwoPrompt',
    'dialogueTagPrompt',
    'feelingCluePrompt',
    'replyPrompt',
    'reviseLinePrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBlanketFortDialogueLanguage(card, label, errors)
}

function validateBlanketFortDialogueRoutine(routine, index, names, errors) {
  const label = `dialogueRoutines[${index}]`
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
  validateNoUnsafeBlanketFortDialogueLanguage(routine, label, errors)
}

function validateTakeHomeDialogueSlip(slip, index, titles, errors) {
  const label = `takeHomeDialogueSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !blanketFortDialogueSlipLabels.has(slip.time), `${label}.time must use a non-timed take-home slip label.`)
  pushIf(errors, !blanketFortDialogueSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBlanketFortDialogueLanguage(slip, label, errors)
}

export function validateBlanketFortStoryDialogueCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Blanket Fort Story Dialogue Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch35', 'batchId must be 2026-06-03-batch35.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== blanketFortStoryDialogueCardPackProductSlug,
    `productSlug must be ${blanketFortStoryDialogueCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Blanket Fort Story Dialogue Card Pack', 'title must be Blanket Fort Story Dialogue Card Pack.')
  pushIf(errors, source.pricePoint !== '$43', 'pricePoint must be $43.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Blanket Fort Story Dialogue Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Blanket Fort Story Dialogue Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Blanket Fort Story Dialogue Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredBlanketFortStoryDialogueCardPackArtifactPaths, 'Blanket Fort Story Dialogue Card Pack', errors)

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
    validateStringArray(source.adultGuide.paperDialogueSetup, 5, 'adultGuide.paperDialogueSetup', errors)
    validateStringArray(source.adultGuide.dialogueCoaching, 5, 'adultGuide.dialogueCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeBlanketFortDialogueLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.dialogueRoutines), 'dialogueRoutines must be an array.')
  if (Array.isArray(source.dialogueRoutines)) {
    pushIf(errors, source.dialogueRoutines.length !== 6, 'dialogueRoutines must have exactly 6 entries.')
    const names = new Set()
    source.dialogueRoutines.forEach((routine, index) => validateBlanketFortDialogueRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeDialogueSlips), 'takeHomeDialogueSlips must be an array.')
  if (Array.isArray(source.takeHomeDialogueSlips)) {
    pushIf(errors, source.takeHomeDialogueSlips.length !== 10, 'takeHomeDialogueSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeDialogueSlips.forEach((slip, index) => validateTakeHomeDialogueSlip(slip, index, titles, errors))
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
      validateBlanketFortDialogueCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeBlanketFortDialogueLanguage(source, 'Blanket Fort Story Dialogue Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Blanket Fort Story Dialogue Card Pack source', errors)
  return errors
}

export function validateBlanketFortStoryDialogueCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three dialogue-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch35-blanket-fort-dialogue-cards-a.json',
    'content/product-artifacts/lanes/batch35-blanket-fort-dialogue-cards-b.json',
    'content/product-artifacts/lanes/batch35-blanket-fort-dialogue-cards-c.json',
    'content/product-artifacts/lanes/batch35-blanket-fort-dialogue-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 35 dialogue-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 35 dialogue-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three dialogue-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles dialogue-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'dialogueRoutines', 'takeHomeDialogueSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const kitchenWindowPovSkills = new Set([
  'first person view',
  'third person view',
  'observer detail',
  'near detail',
  'far detail',
  'thought clue',
  'voice filter',
  'same scene new view',
  'object viewpoint',
  'setting lens',
  'emotion lens',
  'closing viewpoint',
])

const kitchenWindowPovSlipLabels = new Set([
  'view slip',
  'observer slip',
  'near-detail slip',
  'far-detail slip',
  'thought slip',
  'voice slip',
  'object-view slip',
  'setting-lens slip',
  'emotion-lens slip',
  'closing-view slip',
])

function validateNoUnsafeKitchenWindowPovLanguage(value, label, errors) {
  const rawText = JSON.stringify(value)
  const allowedFrameText = rawText
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bkitchen window\b/gi, '')
    .replace(/\bkitchen-window\b/gi, '')
    .replace(/\bpoint-of-view\b/gi, '')
    .replace(/\bpoint of view\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult\b/gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bpaper frame\b/gi, '')
    .replace(/\bpaper scene\b/gi, '')
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\bgps\b|\bcoordinates?\b|\breal route(s)?\b|\bexact address\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhome window(s)?\b|\breal window(s)?\b|\breal view(s)?\b|\blook out\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bexact location\b|\bexact places?\b|\bemails?\b|\bchild names?\b|\bstudent names?\b|\bfull names?\b|\brosters?\b|\bstudent records?\b|\battendance\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      allowedFrameText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device, photo/camera, private-conversation, exact-place, real-home/window, route, contact, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )

  const safetyText = allowedFrameText
    .replace(/\bpaper writing only\b/gi, '')
    .replace(/\bpaper card(s)?\b/gi, '')
    .replace(/\bpaper slip(s)?\b/gi, '')
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

function validateKitchenWindowPovCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'pointOfViewSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'firstViewPrompt',
    'secondViewPrompt',
    'nearDetailPrompt',
    'farDetailPrompt',
    'thoughtCluePrompt',
    'reviseViewPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('kitchen-window-pov-card-'),
      `${label}.id must start with kitchen-window-pov-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !kitchenWindowPovSkills.has(card.pointOfViewSkill), `${label}.pointOfViewSkill is not allowed.`)
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
    'firstViewPrompt',
    'secondViewPrompt',
    'nearDetailPrompt',
    'farDetailPrompt',
    'thoughtCluePrompt',
    'reviseViewPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeKitchenWindowPovLanguage(card, label, errors)
}

function validateKitchenWindowPovRoutine(routine, index, names, errors) {
  const label = `povRoutines[${index}]`
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
  validateNoUnsafeKitchenWindowPovLanguage(routine, label, errors)
}

function validateTakeHomePovSlip(slip, index, titles, errors) {
  const label = `takeHomePovSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(errors, !kitchenWindowPovSlipLabels.has(slip.time), `${label}.time must use a non-timed take-home slip label.`)
  pushIf(errors, !kitchenWindowPovSkills.has(slip.skill), `${label}.skill is not allowed.`)
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeKitchenWindowPovLanguage(slip, label, errors)
}

export function validateKitchenWindowStoryPovCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Kitchen Window Story Point-of-View Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch36', 'batchId must be 2026-06-03-batch36.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== kitchenWindowStoryPovCardPackProductSlug,
    `productSlug must be ${kitchenWindowStoryPovCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Kitchen Window Story Point-of-View Card Pack', 'title must be Kitchen Window Story Point-of-View Card Pack.')
  pushIf(errors, source.pricePoint !== '$45', 'pricePoint must be $45.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Kitchen Window Story Point-of-View Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Kitchen Window Story Point-of-View Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Kitchen Window Story Point-of-View Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredKitchenWindowStoryPovCardPackArtifactPaths, 'Kitchen Window Story Point-of-View Card Pack', errors)

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
    validateStringArray(source.adultGuide.paperViewpointSetup, 5, 'adultGuide.paperViewpointSetup', errors)
    validateStringArray(source.adultGuide.viewpointCoaching, 5, 'adultGuide.viewpointCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeKitchenWindowPovLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.povRoutines), 'povRoutines must be an array.')
  if (Array.isArray(source.povRoutines)) {
    pushIf(errors, source.povRoutines.length !== 6, 'povRoutines must have exactly 6 entries.')
    const names = new Set()
    source.povRoutines.forEach((routine, index) => validateKitchenWindowPovRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomePovSlips), 'takeHomePovSlips must be an array.')
  if (Array.isArray(source.takeHomePovSlips)) {
    pushIf(errors, source.takeHomePovSlips.length !== 10, 'takeHomePovSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomePovSlips.forEach((slip, index) => validateTakeHomePovSlip(slip, index, titles, errors))
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
      validateKitchenWindowPovCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeKitchenWindowPovLanguage(source, 'Kitchen Window Story Point-of-View Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Kitchen Window Story Point-of-View Card Pack source', errors)
  return errors
}

export function validateKitchenWindowStoryPovCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three POV-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-a.json',
    'content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-b.json',
    'content/product-artifacts/lanes/batch36-kitchen-window-pov-cards-c.json',
    'content/product-artifacts/lanes/batch36-kitchen-window-pov-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 36 POV-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 36 POV-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three POV-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles POV-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'povRoutines', 'takeHomePovSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

function normalizeCoatPocketAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult\b/gi, '')
    .replace(/\bfamily reader\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bwithout using grades, scores, or real details\b/gi, '')
    .replace(/\bno grades, scores, or real details\b/gi, '')
    .replace(/\bcoat pocket\b/gi, '')
    .replace(/\bcoat-pocket\b/gi, '')
    .replace(/\bpaper pocket\b/gi, '')
    .replace(/\bpaper-pocket\b/gi, '')
    .replace(/\bdrawn paper pocket\b/gi, '')
    .replace(/\bpretend paper pocket\b/gi, '')
    .replace(/\bnot real clothing\b/gi, '')
    .replace(/\bno real addresses?\b/gi, '')
    .replace(/\bprivate places?\b/gi, '')
}

function validateNoUnsafeCoatPocketCharacterLanguage(value, label, errors) {
  const allowedText = normalizeCoatPocketAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bprivate locations?\b|\bprivate place details?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bhome address\b|\breal homes?\b|\breal houses?\b|\bactual rooms?\b|\bactual schools?\b|\brelatives?\b|\bactual pockets?\b|\breal pockets?\b|\bactual clothing\b|\breal clothing\b|\bdescribe your pocket\b|\bdescribe your clothing\b|\bstudent records?\b|\battendance\b|\bbehavior reports?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device, photo/camera, real-identity, private-location, route, contact, real-pocket/clothing, child-profile, grade, score, tracker, schedule, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateCoatPocketCharacterCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'characterSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'characterNamePrompt',
    'pocketItemPrompt',
    'wantPrompt',
    'worryPrompt',
    'actionPrompt',
    'voicePrompt',
    'reviseCharacterPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('coat-pocket-character-card-'),
      `${label}.id must start with coat-pocket-character-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(errors, isNonEmptyString(card.useCase) && !/paper (?:character )?card/i.test(card.useCase), `${label}.useCase must say paper card.`)
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'characterNamePrompt',
    'pocketItemPrompt',
    'wantPrompt',
    'worryPrompt',
    'actionPrompt',
    'voicePrompt',
    'reviseCharacterPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeCoatPocketCharacterLanguage(card, label, errors)
}

function validateCoatPocketCharacterRoutine(routine, index, names, errors) {
  const label = `characterRoutines[${index}]`
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
}

function validateTakeHomeCharacterSlip(slip, index, titles, errors) {
  const label = `takeHomeCharacterSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeCoatPocketCharacterLanguage(slip, label, errors)
}

export function validateCoatPocketStoryCharacterCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Coat Pocket Story Character Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch37', 'batchId must be 2026-06-03-batch37.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== coatPocketStoryCharacterCardPackProductSlug,
    `productSlug must be ${coatPocketStoryCharacterCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Coat Pocket Story Character Card Pack', 'title must be Coat Pocket Story Character Card Pack.')
  pushIf(errors, source.pricePoint !== '$47', 'pricePoint must be $47.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Coat Pocket Story Character Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Coat Pocket Story Character Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Coat Pocket Story Character Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredCoatPocketStoryCharacterCardPackArtifactPaths, 'Coat Pocket Story Character Card Pack', errors)

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
    validateStringArray(source.adultGuide.paperCharacterSetup, 5, 'adultGuide.paperCharacterSetup', errors)
    validateStringArray(source.adultGuide.characterCoaching, 5, 'adultGuide.characterCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
  }

  pushIf(errors, !Array.isArray(source.characterRoutines), 'characterRoutines must be an array.')
  if (Array.isArray(source.characterRoutines)) {
    pushIf(errors, source.characterRoutines.length !== 6, 'characterRoutines must have exactly 6 entries.')
    const names = new Set()
    source.characterRoutines.forEach((routine, index) => validateCoatPocketCharacterRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeCharacterSlips), 'takeHomeCharacterSlips must be an array.')
  if (Array.isArray(source.takeHomeCharacterSlips)) {
    pushIf(errors, source.takeHomeCharacterSlips.length !== 10, 'takeHomeCharacterSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeCharacterSlips.forEach((slip, index) => validateTakeHomeCharacterSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeCoatPocketCharacterLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateCoatPocketCharacterCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoRiskyLanguage(source, 'Coat Pocket Story Character Card Pack source', errors)
  return errors
}

export function validateCoatPocketStoryCharacterCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three character-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch37-coat-pocket-character-cards-a.json',
    'content/product-artifacts/lanes/batch37-coat-pocket-character-cards-b.json',
    'content/product-artifacts/lanes/batch37-coat-pocket-character-cards-c.json',
    'content/product-artifacts/lanes/batch37-coat-pocket-character-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 37 character-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 37 character-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three character-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles character-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'characterRoutines', 'takeHomeCharacterSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

function normalizePaperTrayAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\bno screens?\b/gi, '')
    .replace(/\bwithout screens?\b/gi, '')
    .replace(/\bscreen-free\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult\b/gi, '')
    .replace(/\bfamily reader\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bpaper tray\b/gi, '')
    .replace(/\bpaper-tray\b/gi, '')
    .replace(/\btray card\b/gi, '')
    .replace(/\btray label\b/gi, '')
    .replace(/\bstory-place\b/gi, '')
    .replace(/\bstory place\b/gi, '')
    .replace(/\bnot real-world\b/gi, '')
    .replace(/\breal-world facts\b/gi, '')
    .replace(/\bnarrow real-world facts\b/gi, '')
    .replace(/\bnarrow place labels\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafePaperTraySettingLanguage(value, label, errors) {
  const allowedText = normalizePaperTrayAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\boffices?\b|\bdesks?\b|\brooms?\b|\bactual rooms?\b|\bprivate rooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, real classroom/home/office/room, school, address, route, GPS, location, tracker, grade, score, timer, contest, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validatePaperTraySettingCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'settingSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'settingNamePrompt',
    'trayLabelPrompt',
    'moodPrompt',
    'sensoryPrompt',
    'mapEdgePrompt',
    'objectAnchorPrompt',
    'reviseSettingPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('paper-tray-setting-card-'),
      `${label}.id must start with paper-tray-setting-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(errors, isNonEmptyString(card.useCase) && !/paper setting card/i.test(card.useCase), `${label}.useCase must say paper setting card.`)
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'settingNamePrompt',
    'trayLabelPrompt',
    'moodPrompt',
    'sensoryPrompt',
    'mapEdgePrompt',
    'objectAnchorPrompt',
    'reviseSettingPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePaperTraySettingLanguage(card, label, errors)
}

function validatePaperTraySettingRoutine(routine, index, names, errors) {
  const label = `settingRoutines[${index}]`
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
  validateNoUnsafePaperTraySettingLanguage(routine, label, errors)
}

function validateTakeHomeSettingSlip(slip, index, titles, errors) {
  const label = `takeHomeSettingSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePaperTraySettingLanguage(slip, label, errors)
}

export function validatePaperTrayStorySettingCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Paper Tray Story Setting Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch38', 'batchId must be 2026-06-03-batch38.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== paperTrayStorySettingCardPackProductSlug,
    `productSlug must be ${paperTrayStorySettingCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Paper Tray Story Setting Card Pack', 'title must be Paper Tray Story Setting Card Pack.')
  pushIf(errors, source.pricePoint !== '$49', 'pricePoint must be $49.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Paper Tray Story Setting Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Paper Tray Story Setting Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Paper Tray Story Setting Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredPaperTrayStorySettingCardPackArtifactPaths, 'Paper Tray Story Setting Card Pack', errors)

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
    validateStringArray(source.adultGuide.paperSettingSetup, 5, 'adultGuide.paperSettingSetup', errors)
    validateStringArray(source.adultGuide.settingCoaching, 5, 'adultGuide.settingCoaching', errors)
    validateStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafePaperTraySettingLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.settingRoutines), 'settingRoutines must be an array.')
  if (Array.isArray(source.settingRoutines)) {
    pushIf(errors, source.settingRoutines.length !== 6, 'settingRoutines must have exactly 6 entries.')
    const names = new Set()
    source.settingRoutines.forEach((routine, index) => validatePaperTraySettingRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSettingSlips), 'takeHomeSettingSlips must be an array.')
  if (Array.isArray(source.takeHomeSettingSlips)) {
    pushIf(errors, source.takeHomeSettingSlips.length !== 10, 'takeHomeSettingSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeSettingSlips.forEach((slip, index) => validateTakeHomeSettingSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafePaperTraySettingLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validatePaperTraySettingCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafePaperTraySettingLanguage(source, 'Paper Tray Story Setting Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Paper Tray Story Setting Card Pack source', errors)
  return errors
}

export function validatePaperTrayStorySettingCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three setting-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch38-paper-tray-setting-cards-a.json',
    'content/product-artifacts/lanes/batch38-paper-tray-setting-cards-b.json',
    'content/product-artifacts/lanes/batch38-paper-tray-setting-cards-c.json',
    'content/product-artifacts/lanes/batch38-paper-tray-setting-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 38 setting-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 38 setting-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three setting-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles setting-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'settingRoutines', 'takeHomeSettingSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

function normalizeBackpackEndingAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\bno screens?\b/gi, '')
    .replace(/\bwithout screens?\b/gi, '')
    .replace(/\bscreen-free\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bbackpack ending card(s)?\b/gi, '')
    .replace(/\bbackpack ending\b/gi, '')
    .replace(/\bpretend backpack pocket(s)?\b/gi, '')
    .replace(/\bpretend backpack\b/gi, '')
    .replace(/\bpaper backpack\b/gi, '')
    .replace(/\bbackpack\b/gi, '')
    .replace(/\bending card(s)?\b/gi, '')
    .replace(/\bending slip(s)?\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafeBackpackEndingLanguage(value, label, errors) {
  const allowedText = normalizeBackpackEndingAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, address, route, GPS, location, tracker, profile, grade, score, timer, contest, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateBackpackEndingCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'endingSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'endingChoicePrompt',
    'feelingPrompt',
    'objectReturnPrompt',
    'echoPrompt',
    'finalLinePrompt',
    'reviseEndingPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('backpack-ending-card-'),
      `${label}.id must start with backpack-ending-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/backpack ending card/i.test(card.useCase),
    `${label}.useCase must say backpack ending card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'endingChoicePrompt',
    'feelingPrompt',
    'objectReturnPrompt',
    'echoPrompt',
    'finalLinePrompt',
    'reviseEndingPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBackpackEndingLanguage(card, label, errors)
}

function validateBackpackEndingRoutine(routine, index, names, errors) {
  const label = `endingRoutines[${index}]`
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
  validateNoUnsafeBackpackEndingLanguage(routine, label, errors)
}

function validateTakeHomeEndingSlip(slip, index, titles, errors) {
  const label = `takeHomeEndingSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBackpackEndingLanguage(slip, label, errors)
}

export function validateBackpackStoryEndingCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Backpack Story Ending Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch39', 'batchId must be 2026-06-03-batch39.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== backpackStoryEndingCardPackProductSlug,
    `productSlug must be ${backpackStoryEndingCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Backpack Story Ending Card Pack', 'title must be Backpack Story Ending Card Pack.')
  pushIf(errors, source.pricePoint !== '$51', 'pricePoint must be $51.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Backpack Story Ending Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Backpack Story Ending Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Backpack Story Ending Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredBackpackStoryEndingCardPackArtifactPaths, 'Backpack Story Ending Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateExactStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateExactStringArray(source.adultGuide.backpackEndingSetup, 5, 'adultGuide.backpackEndingSetup', errors)
    validateExactStringArray(source.adultGuide.endingCoaching, 5, 'adultGuide.endingCoaching', errors)
    validateExactStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateExactStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateExactStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeBackpackEndingLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.endingRoutines), 'endingRoutines must be an array.')
  if (Array.isArray(source.endingRoutines)) {
    pushIf(errors, source.endingRoutines.length !== 6, 'endingRoutines must have exactly 6 entries.')
    const names = new Set()
    source.endingRoutines.forEach((routine, index) => validateBackpackEndingRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeEndingSlips), 'takeHomeEndingSlips must be an array.')
  if (Array.isArray(source.takeHomeEndingSlips)) {
    pushIf(errors, source.takeHomeEndingSlips.length !== 10, 'takeHomeEndingSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeEndingSlips.forEach((slip, index) => validateTakeHomeEndingSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeBackpackEndingLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateBackpackEndingCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeBackpackEndingLanguage(source, 'Backpack Story Ending Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Backpack Story Ending Card Pack source', errors)
  return errors
}

export function validateBackpackStoryEndingCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three ending-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch39-backpack-ending-cards-a.json',
    'content/product-artifacts/lanes/batch39-backpack-ending-cards-b.json',
    'content/product-artifacts/lanes/batch39-backpack-ending-cards-c.json',
    'content/product-artifacts/lanes/batch39-backpack-ending-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 39 ending-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 39 ending-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three ending-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles ending-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'endingRoutines', 'takeHomeEndingSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

function normalizePencilCupOpeningAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bpencil cup story opening card(s)?\b/gi, '')
    .replace(/\bpencil cup opening card(s)?\b/gi, '')
    .replace(/\bpencil cup opening\b/gi, '')
    .replace(/\bpretend pencil cup\b/gi, '')
    .replace(/\bpencil cup\b/gi, '')
    .replace(/\bopening card(s)?\b/gi, '')
    .replace(/\bopening slip(s)?\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafePencilCupOpeningLanguage(value, label, errors) {
  const allowedText = normalizePencilCupOpeningAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, address, route, GPS, location, tracker, profile, grade, score, timer, contest, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validatePencilCupOpeningCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'openingSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'firstLinePrompt',
    'characterPrompt',
    'placePrompt',
    'objectPrompt',
    'questionPrompt',
    'nextMovePrompt',
    'reviseOpeningPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('pencil-cup-opening-card-'),
      `${label}.id must start with pencil-cup-opening-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/pencil cup opening card/i.test(card.useCase),
    `${label}.useCase must say pencil cup opening card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'firstLinePrompt',
    'characterPrompt',
    'placePrompt',
    'objectPrompt',
    'questionPrompt',
    'nextMovePrompt',
    'reviseOpeningPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePencilCupOpeningLanguage(card, label, errors)
}

function validatePencilCupOpeningRoutine(routine, index, names, errors) {
  const label = `openingRoutines[${index}]`
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
  validateNoUnsafePencilCupOpeningLanguage(routine, label, errors)
}

function validateTakeHomeOpeningSlip(slip, index, titles, errors) {
  const label = `takeHomeOpeningSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePencilCupOpeningLanguage(slip, label, errors)
}

export function validatePencilCupStoryOpeningCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Pencil Cup Story Opening Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch40', 'batchId must be 2026-06-03-batch40.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== pencilCupStoryOpeningCardPackProductSlug,
    `productSlug must be ${pencilCupStoryOpeningCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Pencil Cup Story Opening Card Pack', 'title must be Pencil Cup Story Opening Card Pack.')
  pushIf(errors, source.pricePoint !== '$53', 'pricePoint must be $53.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include the required safety sentence.')

  pushIf(errors, product?.slug !== source.productSlug, 'Pencil Cup Story Opening Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Pencil Cup Story Opening Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Pencil Cup Story Opening Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredPencilCupStoryOpeningCardPackArtifactPaths, 'Pencil Cup Story Opening Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateExactStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateExactStringArray(source.adultGuide.pencilCupOpeningSetup, 5, 'adultGuide.pencilCupOpeningSetup', errors)
    validateExactStringArray(source.adultGuide.openingCoaching, 5, 'adultGuide.openingCoaching', errors)
    validateExactStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateExactStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateExactStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafePencilCupOpeningLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.openingRoutines), 'openingRoutines must be an array.')
  if (Array.isArray(source.openingRoutines)) {
    pushIf(errors, source.openingRoutines.length !== 6, 'openingRoutines must have exactly 6 entries.')
    const names = new Set()
    source.openingRoutines.forEach((routine, index) => validatePencilCupOpeningRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeOpeningSlips), 'takeHomeOpeningSlips must be an array.')
  if (Array.isArray(source.takeHomeOpeningSlips)) {
    pushIf(errors, source.takeHomeOpeningSlips.length !== 10, 'takeHomeOpeningSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeOpeningSlips.forEach((slip, index) => validateTakeHomeOpeningSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafePencilCupOpeningLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validatePencilCupOpeningCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafePencilCupOpeningLanguage(source, 'Pencil Cup Story Opening Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Pencil Cup Story Opening Card Pack source', errors)
  return errors
}

export function validatePencilCupStoryOpeningCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three opening-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-a.json',
    'content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-b.json',
    'content/product-artifacts/lanes/batch40-pencil-cup-opening-cards-c.json',
    'content/product-artifacts/lanes/batch40-pencil-cup-opening-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 40 opening-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 40 opening-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three opening-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles opening-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'openingRoutines', 'takeHomeOpeningSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

function normalizeDeskLampProblemAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bFamily-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bdesk lamp story problem card(s)?\b/gi, '')
    .replace(/\bdesk lamp problem card(s)?\b/gi, '')
    .replace(/\bdesk lamp problem\b/gi, '')
    .replace(/\bpretend desk lamp\b/gi, '')
    .replace(/\bdrawn desk lamp\b/gi, '')
    .replace(/\bdesk lamp\b/gi, '')
    .replace(/\bproblem card(s)?\b/gi, '')
    .replace(/\bproblem slip(s)?\b/gi, '')
    .replace(/\bsmall story problem(s)?\b/gi, '')
    .replace(/\bgentle obstacle(s)?\b/gi, '')
    .replace(/\bmismatch(es)?\b/gi, '')
    .replace(/\bmissing clue(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brevise the problem\b/gi, '')
    .replace(/\bproblem spot(s)?\b/gi, '')
    .replace(/\bcharacter need(s)?\b/gi, '')
    .replace(/\bplace pressure\b/gi, '')
    .replace(/\bobject trouble\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafeDeskLampProblemLanguage(value, label, errors) {
  const allowedText = normalizeDeskLampProblemAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, address, route, GPS, location, schedule, tracker, profile, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateDeskLampProblemCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'problemSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'problemSpotPrompt',
    'characterNeedPrompt',
    'placePressurePrompt',
    'objectTroublePrompt',
    'questionPrompt',
    'firstTryPrompt',
    'reviseProblemPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('desk-lamp-problem-card-'),
      `${label}.id must start with desk-lamp-problem-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/desk[- ]lamp problem card/i.test(card.useCase),
    `${label}.useCase must say desk lamp problem card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'problemSpotPrompt',
    'characterNeedPrompt',
    'placePressurePrompt',
    'objectTroublePrompt',
    'questionPrompt',
    'firstTryPrompt',
    'reviseProblemPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeDeskLampProblemLanguage(card, label, errors)
}

function validateDeskLampProblemRoutine(routine, index, names, errors) {
  const label = `problemRoutines[${index}]`
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
  validateNoUnsafeDeskLampProblemLanguage(routine, label, errors)
}

function validateTakeHomeProblemSlip(slip, index, titles, errors) {
  const label = `takeHomeProblemSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeDeskLampProblemLanguage(slip, label, errors)
}

export function validateDeskLampStoryProblemCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Desk Lamp Story Problem Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch41', 'batchId must be 2026-06-03-batch41.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== deskLampStoryProblemCardPackProductSlug,
    `productSlug must be ${deskLampStoryProblemCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Desk Lamp Story Problem Card Pack', 'title must be Desk Lamp Story Problem Card Pack.')
  pushIf(errors, source.pricePoint !== '$55', 'pricePoint must be $55.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Desk Lamp Story Problem Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Desk Lamp Story Problem Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Desk Lamp Story Problem Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredDeskLampStoryProblemCardPackArtifactPaths, 'Desk Lamp Story Problem Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateExactStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateExactStringArray(source.adultGuide.deskLampProblemSetup, 5, 'adultGuide.deskLampProblemSetup', errors)
    validateExactStringArray(source.adultGuide.problemCoaching, 5, 'adultGuide.problemCoaching', errors)
    validateExactStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateExactStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateExactStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafeDeskLampProblemLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.problemRoutines), 'problemRoutines must be an array.')
  if (Array.isArray(source.problemRoutines)) {
    pushIf(errors, source.problemRoutines.length !== 6, 'problemRoutines must have exactly 6 entries.')
    const names = new Set()
    source.problemRoutines.forEach((routine, index) => validateDeskLampProblemRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeProblemSlips), 'takeHomeProblemSlips must be an array.')
  if (Array.isArray(source.takeHomeProblemSlips)) {
    pushIf(errors, source.takeHomeProblemSlips.length !== 10, 'takeHomeProblemSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeProblemSlips.forEach((slip, index) => validateTakeHomeProblemSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeDeskLampProblemLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateDeskLampProblemCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeDeskLampProblemLanguage(source, 'Desk Lamp Story Problem Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Desk Lamp Story Problem Card Pack source', errors)
  return errors
}

export function validateDeskLampStoryProblemCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three problem-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch41-desk-lamp-problem-cards-a.json',
    'content/product-artifacts/lanes/batch41-desk-lamp-problem-cards-b.json',
    'content/product-artifacts/lanes/batch41-desk-lamp-problem-cards-c.json',
    'content/product-artifacts/lanes/batch41-desk-lamp-problem-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 41 problem-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 41 problem-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three problem-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles problem-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'problemRoutines', 'takeHomeProblemSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}


function normalizePaperClipSolutionAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bFamily-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bpaper clip story solution card(s)?\b/gi, '')
    .replace(/\bpaper clip solution card(s)?\b/gi, '')
    .replace(/\bpaper clip solution\b/gi, '')
    .replace(/\bpretend paper clip\b/gi, '')
    .replace(/\bdrawn paper clip\b/gi, '')
    .replace(/\bpaper clip\b/gi, '')
    .replace(/\bsolution card(s)?\b/gi, '')
    .replace(/\bproblem slip(s)?\b/gi, '')
    .replace(/\bsmall story problem(s)?\b/gi, '')
    .replace(/\bgentle obstacle(s)?\b/gi, '')
    .replace(/\bmismatch(es)?\b/gi, '')
    .replace(/\bmissing clue(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brevise the problem\b/gi, '')
    .replace(/\bproblem spot(s)?\b/gi, '')
    .replace(/\bcharacter need(s)?\b/gi, '')
    .replace(/\bplace pressure\b/gi, '')
    .replace(/\bobject trouble\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafePaperClipSolutionLanguage(value, label, errors) {
  const allowedText = normalizePaperClipSolutionAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, address, route, GPS, location, schedule, tracker, profile, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validatePaperClipSolutionCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'solutionSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'solutionStepPrompt',
    'characterChoicePrompt',
    'placeCluePrompt',
    'objectUsePrompt',
    'solutionQuestionPrompt',
    'firstStepPrompt',
    'reviseSolutionPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('paper-clip-solution-card-'),
      `${label}.id must start with paper-clip-solution-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/paper[- ]clip solution card/i.test(card.useCase),
    `${label}.useCase must say paper clip solution card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'solutionStepPrompt',
    'characterChoicePrompt',
    'placeCluePrompt',
    'objectUsePrompt',
    'solutionQuestionPrompt',
    'firstStepPrompt',
    'reviseSolutionPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePaperClipSolutionLanguage(card, label, errors)
}

function validatePaperClipSolutionRoutine(routine, index, names, errors) {
  const label = `solutionRoutines[${index}]`
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
  validateNoUnsafePaperClipSolutionLanguage(routine, label, errors)
}

function validateTakeHomeSolutionSlip(slip, index, titles, errors) {
  const label = `takeHomeSolutionSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePaperClipSolutionLanguage(slip, label, errors)
}

export function validatePaperClipStorySolutionCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Paper Clip Story Solution Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch42', 'batchId must be 2026-06-03-batch42.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== paperClipStorySolutionCardPackProductSlug,
    `productSlug must be ${paperClipStorySolutionCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Paper Clip Story Solution Card Pack', 'title must be Paper Clip Story Solution Card Pack.')
  pushIf(errors, source.pricePoint !== '$57', 'pricePoint must be $57.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Paper Clip Story Solution Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Paper Clip Story Solution Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Paper Clip Story Solution Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredPaperClipStorySolutionCardPackArtifactPaths, 'Paper Clip Story Solution Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateExactStringArray(source.adultGuide.beforeSession, 5, 'adultGuide.beforeSession', errors)
    validateExactStringArray(source.adultGuide.paperClipSolutionSetup, 5, 'adultGuide.paperClipSolutionSetup', errors)
    validateExactStringArray(source.adultGuide.solutionCoaching, 5, 'adultGuide.solutionCoaching', errors)
    validateExactStringArray(source.adultGuide.privacyAndSafetyNotes, 5, 'adultGuide.privacyAndSafetyNotes', errors)
    validateExactStringArray(source.adultGuide.familyHandoff, 5, 'adultGuide.familyHandoff', errors)
    validateExactStringArray(source.adultGuide.reset, 4, 'adultGuide.reset', errors)
    validateNoUnsafePaperClipSolutionLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.solutionRoutines), 'solutionRoutines must be an array.')
  if (Array.isArray(source.solutionRoutines)) {
    pushIf(errors, source.solutionRoutines.length !== 6, 'solutionRoutines must have exactly 6 entries.')
    const names = new Set()
    source.solutionRoutines.forEach((routine, index) => validatePaperClipSolutionRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSolutionSlips), 'takeHomeSolutionSlips must be an array.')
  if (Array.isArray(source.takeHomeSolutionSlips)) {
    pushIf(errors, source.takeHomeSolutionSlips.length !== 10, 'takeHomeSolutionSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeSolutionSlips.forEach((slip, index) => validateTakeHomeSolutionSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafePaperClipSolutionLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validatePaperClipSolutionCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafePaperClipSolutionLanguage(source, 'Paper Clip Story Solution Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Paper Clip Story Solution Card Pack source', errors)
  return errors
}

export function validatePaperClipStorySolutionCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three solution-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch42-paper-clip-solution-cards-a.json',
    'content/product-artifacts/lanes/batch42-paper-clip-solution-cards-b.json',
    'content/product-artifacts/lanes/batch42-paper-clip-solution-cards-c.json',
    'content/product-artifacts/lanes/batch42-paper-clip-solution-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 42 solution-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 42 solution-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three solution-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles solution-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'solutionRoutines', 'takeHomeSolutionSlips', 'optionalSharePrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}


function normalizeBinderClipTransitionAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bFamily-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\bFamily-safe fictional transitions only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bbinder clip story transition card(s)?\b/gi, '')
    .replace(/\bbinder clip transition card(s)?\b/gi, '')
    .replace(/\bbinder clip transition\b/gi, '')
    .replace(/\bpretend binder clip\b/gi, '')
    .replace(/\bdrawn binder clip\b/gi, '')
    .replace(/\bbinder clip\b/gi, '')
    .replace(/\btransition card(s)?\b/gi, '')
    .replace(/\btransition slip(s)?\b/gi, '')
    .replace(/\bstory transition(s)?\b/gi, '')
    .replace(/\bbefore moment(s)?\b/gi, '')
    .replace(/\bafter moment(s)?\b/gi, '')
    .replace(/\bbridge word(s)?\b/gi, '')
    .replace(/\bcharacter move(s)?\b/gi, '')
    .replace(/\bplace shift(s)?\b/gi, '')
    .replace(/\bcarried object(s)?\b/gi, '')
    .replace(/\bobject carry-over\b/gi, '')
    .replace(/\bstory moment(s)?\b/gi, '')
    .replace(/\bproblem slip(s)?\b/gi, '')
    .replace(/\bsmall story problem(s)?\b/gi, '')
    .replace(/\bgentle obstacle(s)?\b/gi, '')
    .replace(/\bmismatch(es)?\b/gi, '')
    .replace(/\bmissing clue(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brevise the problem\b/gi, '')
    .replace(/\bproblem spot(s)?\b/gi, '')
    .replace(/\bcharacter need(s)?\b/gi, '')
    .replace(/\bplace pressure\b/gi, '')
    .replace(/\bobject trouble\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\bpersonal place, schedule, group name, or child detail\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bno identity details\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafeBinderClipTransitionLanguage(value, label, errors) {
  const allowedText = normalizeBinderClipTransitionAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, address, route, GPS, location, schedule, tracker, profile, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateBinderClipTransitionCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'transitionSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'beforeMomentPrompt',
    'afterMomentPrompt',
    'bridgeWordPrompt',
    'characterMovePrompt',
    'objectCarryPrompt',
    'transitionQuestionPrompt',
    'placeShiftPrompt',
    'reviseTransitionPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('binder-clip-transition-card-'),
      `${label}.id must start with binder-clip-transition-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/binder[- ]clip transition card/i.test(card.useCase),
    `${label}.useCase must say binder clip transition card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'beforeMomentPrompt',
    'afterMomentPrompt',
    'bridgeWordPrompt',
    'characterMovePrompt',
    'objectCarryPrompt',
    'transitionQuestionPrompt',
    'placeShiftPrompt',
    'reviseTransitionPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBinderClipTransitionLanguage(card, label, errors)
}

function validateBinderClipTransitionRoutine(routine, index, names, errors) {
  const label = `transitionRoutines[${index}]`
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
  validateNoUnsafeBinderClipTransitionLanguage(routine, label, errors)
}

function validateTakeHomeTransitionSlip(slip, index, titles, errors) {
  const label = `takeHomeTransitionSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeBinderClipTransitionLanguage(slip, label, errors)
}

export function validateBinderClipStoryTransitionCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Binder Clip Story Transition Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch43', 'batchId must be 2026-06-03-batch43.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== binderClipStoryTransitionCardPackProductSlug,
    `productSlug must be ${binderClipStoryTransitionCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Binder Clip Story Transition Card Pack', 'title must be Binder Clip Story Transition Card Pack.')
  pushIf(errors, source.pricePoint !== '$59', 'pricePoint must be $59.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Binder Clip Story Transition Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Binder Clip Story Transition Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Binder Clip Story Transition Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredBinderClipStoryTransitionCardPackArtifactPaths, 'Binder Clip Story Transition Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeBinderClipTransitionLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.transitionRoutines), 'transitionRoutines must be an array.')
  if (Array.isArray(source.transitionRoutines)) {
    pushIf(errors, source.transitionRoutines.length !== 6, 'transitionRoutines must have exactly 6 entries.')
    const names = new Set()
    source.transitionRoutines.forEach((routine, index) => validateBinderClipTransitionRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeTransitionSlips), 'takeHomeTransitionSlips must be an array.')
  if (Array.isArray(source.takeHomeTransitionSlips)) {
    pushIf(errors, source.takeHomeTransitionSlips.length !== 10, 'takeHomeTransitionSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeTransitionSlips.forEach((slip, index) => validateTakeHomeTransitionSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeBinderClipTransitionLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateBinderClipTransitionCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeBinderClipTransitionLanguage(source, 'Binder Clip Story Transition Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Binder Clip Story Transition Card Pack source', errors)
  return errors
}

export function validateBinderClipStoryTransitionCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three transition-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-a.json',
    'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-b.json',
    'content/product-artifacts/lanes/batch43-binder-clip-transition-cards-c.json',
    'content/product-artifacts/lanes/batch43-binder-clip-transition-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 43 transition-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 43 transition-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three transition-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles transition-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'transitionRoutines', 'takeHomeTransitionSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}



function normalizeFolderTabDetailAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bFamily-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\bFamily-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bfolder tab story detail card(s)?\b/gi, '')
    .replace(/\bfolder tab detail card(s)?\b/gi, '')
    .replace(/\bfolder tab detail\b/gi, '')
    .replace(/\bpretend folder tab\b/gi, '')
    .replace(/\bdrawn folder tab\b/gi, '')
    .replace(/\bfolder tab\b/gi, '')
    .replace(/\bdetail card(s)?\b/gi, '')
    .replace(/\bdetail slip(s)?\b/gi, '')
    .replace(/\bstory detail(s)?\b/gi, '')
    .replace(/\bfocus detail(s)?\b/gi, '')
    .replace(/\bobject trait(s)?\b/gi, '')
    .replace(/\bsentence frame(s)?\b/gi, '')
    .replace(/\bcharacter action(s)?\b/gi, '')
    .replace(/\bmood signal(s)?\b/gi, '')
    .replace(/\bplace clue(s)?\b/gi, '')
    .replace(/\bplace detail\b/gi, '')
    .replace(/\bstory moment(s)?\b/gi, '')
    .replace(/\bproblem slip(s)?\b/gi, '')
    .replace(/\bsmall story problem(s)?\b/gi, '')
    .replace(/\bgentle obstacle(s)?\b/gi, '')
    .replace(/\bmismatch(es)?\b/gi, '')
    .replace(/\bmissing clue(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brevise the problem\b/gi, '')
    .replace(/\bproblem spot(s)?\b/gi, '')
    .replace(/\bcharacter need(s)?\b/gi, '')
    .replace(/\bplace pressure\b/gi, '')
    .replace(/\bobject trouble\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\bpersonal place, schedule, group name, or child detail\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bno identity details\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafeFolderTabDetailLanguage(value, label, errors) {
  const allowedText = normalizeFolderTabDetailAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b|\bfood tasting\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, address, route, GPS, location, schedule, tracker, profile, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateFolderTabDetailCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'detailSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'focusDetailPrompt',
    'objectTraitPrompt',
    'placeDetailPrompt',
    'characterActionPrompt',
    'moodSignalPrompt',
    'sentenceFramePrompt',
    'detailQuestionPrompt',
    'reviseDetailPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('folder-tab-detail-card-'),
      `${label}.id must start with folder-tab-detail-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/folder[- ]tab detail card/i.test(card.useCase),
    `${label}.useCase must say folder tab detail card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'focusDetailPrompt',
    'objectTraitPrompt',
    'placeDetailPrompt',
    'characterActionPrompt',
    'sentenceFramePrompt',
    'detailQuestionPrompt',
    'moodSignalPrompt',
    'reviseDetailPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeFolderTabDetailLanguage(card, label, errors)
}

function validateFolderTabDetailRoutine(routine, index, names, errors) {
  const label = `detailRoutines[${index}]`
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
  validateNoUnsafeFolderTabDetailLanguage(routine, label, errors)
}

function validateTakeHomeDetailSlip(slip, index, titles, errors) {
  const label = `takeHomeDetailSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeFolderTabDetailLanguage(slip, label, errors)
}

export function validateFolderTabStoryDetailCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Folder Tab Story Detail Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch44', 'batchId must be 2026-06-03-batch44.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== folderTabStoryDetailCardPackProductSlug,
    `productSlug must be ${folderTabStoryDetailCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Folder Tab Story Detail Card Pack', 'title must be Folder Tab Story Detail Card Pack.')
  pushIf(errors, source.pricePoint !== '$61', 'pricePoint must be $61.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Folder Tab Story Detail Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Folder Tab Story Detail Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Folder Tab Story Detail Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredFolderTabStoryDetailCardPackArtifactPaths, 'Folder Tab Story Detail Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeFolderTabDetailLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.detailRoutines), 'detailRoutines must be an array.')
  if (Array.isArray(source.detailRoutines)) {
    pushIf(errors, source.detailRoutines.length !== 6, 'detailRoutines must have exactly 6 entries.')
    const names = new Set()
    source.detailRoutines.forEach((routine, index) => validateFolderTabDetailRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeDetailSlips), 'takeHomeDetailSlips must be an array.')
  if (Array.isArray(source.takeHomeDetailSlips)) {
    pushIf(errors, source.takeHomeDetailSlips.length !== 10, 'takeHomeDetailSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeDetailSlips.forEach((slip, index) => validateTakeHomeDetailSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeFolderTabDetailLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateFolderTabDetailCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeFolderTabDetailLanguage(source, 'Folder Tab Story Detail Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Folder Tab Story Detail Card Pack source', errors)
  return errors
}

export function validateFolderTabStoryDetailCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three detail-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-a.json',
    'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-b.json',
    'content/product-artifacts/lanes/batch44-folder-tab-detail-cards-c.json',
    'content/product-artifacts/lanes/batch44-folder-tab-detail-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 44 detail-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 44 detail-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three detail-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles detail-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'detailRoutines', 'takeHomeDetailSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}


function normalizeIndexCardShowNotTellAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bFamily-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\bFamily-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bindex card story show-not-tell card(s)?\b/gi, '')
    .replace(/\bindex card show-not-tell card(s)?\b/gi, '')
    .replace(/\bindex card show-not-tell\b/gi, '')
    .replace(/\bpretend index card\b/gi, '')
    .replace(/\bdrawn index card\b/gi, '')
    .replace(/\bindex card\b/gi, '')
    .replace(/\bshow-not-tell card(s)?\b/gi, '')
    .replace(/\bdetail slip(s)?\b/gi, '')
    .replace(/\bstory detail(s)?\b/gi, '')
    .replace(/\bfocus detail(s)?\b/gi, '')
    .replace(/\bobject trait(s)?\b/gi, '')
    .replace(/\bsentence frame(s)?\b/gi, '')
    .replace(/\bcharacter action(s)?\b/gi, '')
    .replace(/\bmood signal(s)?\b/gi, '')
    .replace(/\bplace clue(s)?\b/gi, '')
    .replace(/\bplace detail\b/gi, '')
    .replace(/\bstory moment(s)?\b/gi, '')
    .replace(/\bproblem slip(s)?\b/gi, '')
    .replace(/\bsmall story problem(s)?\b/gi, '')
    .replace(/\bgentle obstacle(s)?\b/gi, '')
    .replace(/\bmismatch(es)?\b/gi, '')
    .replace(/\bmissing clue(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brevise the problem\b/gi, '')
    .replace(/\bproblem spot(s)?\b/gi, '')
    .replace(/\bcharacter need(s)?\b/gi, '')
    .replace(/\bplace pressure\b/gi, '')
    .replace(/\bobject trouble\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\bpersonal place, schedule, group name, or child detail\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bno identity details\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafeIndexCardShowNotTellLanguage(value, label, errors) {
  const allowedText = normalizeIndexCardShowNotTellAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b|\bfood tasting\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, address, route, GPS, location, schedule, tracker, profile, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateIndexCardShowNotTellCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'showSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'plainLinePrompt',
    'visibleCluePrompt',
    'objectActionPrompt',
    'placeSignalPrompt',
    'characterGesturePrompt',
    'soundOrTexturePrompt',
    'sentenceFramePrompt',
    'reviseShowPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('index-card-show-not-tell-card-'),
      `${label}.id must start with index-card-show-not-tell-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/index[- ]card show[- ]not[- ]tell card/i.test(card.useCase),
    `${label}.useCase must say index card show-not-tell card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'plainLinePrompt',
    'visibleCluePrompt',
    'objectActionPrompt',
    'placeSignalPrompt',
    'characterGesturePrompt',
    'soundOrTexturePrompt',
    'sentenceFramePrompt',
    'reviseShowPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeIndexCardShowNotTellLanguage(card, label, errors)
}

function validateIndexCardShowNotTellRoutine(routine, index, names, errors) {
  const label = `showRoutines[${index}]`
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
  validateNoUnsafeIndexCardShowNotTellLanguage(routine, label, errors)
}

function validateTakeHomeShowSlip(slip, index, titles, errors) {
  const label = `takeHomeShowSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeIndexCardShowNotTellLanguage(slip, label, errors)
}

export function validateIndexCardStoryShowNotTellCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Index Card Story Show-Not-Tell Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch45', 'batchId must be 2026-06-03-batch45.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== indexCardStoryShowNotTellCardPackProductSlug,
    `productSlug must be ${indexCardStoryShowNotTellCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Index Card Story Show-Not-Tell Card Pack', 'title must be Index Card Story Show-Not-Tell Card Pack.')
  pushIf(errors, source.pricePoint !== '$63', 'pricePoint must be $63.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Index Card Story Show-Not-Tell Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Index Card Story Show-Not-Tell Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Index Card Story Show-Not-Tell Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredIndexCardStoryShowNotTellCardPackArtifactPaths, 'Index Card Story Show-Not-Tell Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeIndexCardShowNotTellLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.showRoutines), 'showRoutines must be an array.')
  if (Array.isArray(source.showRoutines)) {
    pushIf(errors, source.showRoutines.length !== 6, 'showRoutines must have exactly 6 entries.')
    const names = new Set()
    source.showRoutines.forEach((routine, index) => validateIndexCardShowNotTellRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeShowSlips), 'takeHomeShowSlips must be an array.')
  if (Array.isArray(source.takeHomeShowSlips)) {
    pushIf(errors, source.takeHomeShowSlips.length !== 10, 'takeHomeShowSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeShowSlips.forEach((slip, index) => validateTakeHomeShowSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeIndexCardShowNotTellLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateIndexCardShowNotTellCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeIndexCardShowNotTellLanguage(source, 'Index Card Story Show-Not-Tell Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Index Card Story Show-Not-Tell Card Pack source', errors)
  return errors
}

export function validateIndexCardStoryShowNotTellCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three show-not-tell-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-a.json',
    'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-b.json',
    'content/product-artifacts/lanes/batch45-index-card-show-not-tell-cards-c.json',
    'content/product-artifacts/lanes/batch45-index-card-show-not-tell-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 45 show-not-tell-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 45 show-not-tell-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three show-not-tell-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles show-not-tell-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'showRoutines', 'takeHomeShowSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}


function normalizeStickyNoteToneAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bFamily-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\bFamily-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bsticky note story tone card(s)?\b/gi, '')
    .replace(/\bsticky note story tone card(s)?\b/gi, '')
    .replace(/\bsticky note story tone\b/gi, '')
    .replace(/\bpretend story tone\b/gi, '')
    .replace(/\bdrawn story tone\b/gi, '')
    .replace(/\bstory tone\b/gi, '')
    .replace(/\bstory tone card(s)?\b/gi, '')
    .replace(/\bdetail slip(s)?\b/gi, '')
    .replace(/\bstory detail(s)?\b/gi, '')
    .replace(/\bfocus detail(s)?\b/gi, '')
    .replace(/\bobject trait(s)?\b/gi, '')
    .replace(/\bsentence frame(s)?\b/gi, '')
    .replace(/\bcharacter action(s)?\b/gi, '')
    .replace(/\bmood signal(s)?\b/gi, '')
    .replace(/\bplace clue(s)?\b/gi, '')
    .replace(/\bplace detail\b/gi, '')
    .replace(/\bstory moment(s)?\b/gi, '')
    .replace(/\bproblem slip(s)?\b/gi, '')
    .replace(/\bsmall story problem(s)?\b/gi, '')
    .replace(/\bgentle obstacle(s)?\b/gi, '')
    .replace(/\bmismatch(es)?\b/gi, '')
    .replace(/\bmissing clue(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brevise the problem\b/gi, '')
    .replace(/\bproblem spot(s)?\b/gi, '')
    .replace(/\bcharacter need(s)?\b/gi, '')
    .replace(/\bplace pressure\b/gi, '')
    .replace(/\bobject trouble\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\bpersonal place, schedule, group name, or child detail\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bno identity details\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafeStickyNoteToneLanguage(value, label, errors) {
  const allowedText = normalizeStickyNoteToneAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b|\bfood tasting\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, address, route, GPS, location, schedule, tracker, profile, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateStickyNoteToneCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'toneSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'neutralLinePrompt',
    'toneChoicePrompt',
    'wordChoicePrompt',
    'objectSignalPrompt',
    'placeCuePrompt',
    'gestureTonePrompt',
    'sentenceFramePrompt',
    'reviseTonePrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('sticky-note-tone-card-'),
      `${label}.id must start with sticky-note-tone-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/sticky[- ]note story[- ]tone card/i.test(card.useCase),
    `${label}.useCase must say sticky note story tone card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'neutralLinePrompt',
    'toneChoicePrompt',
    'wordChoicePrompt',
    'objectSignalPrompt',
    'placeCuePrompt',
    'gestureTonePrompt',
    'sentenceFramePrompt',
    'reviseTonePrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeStickyNoteToneLanguage(card, label, errors)
}

function validateStickyNoteToneRoutine(routine, index, names, errors) {
  const label = `toneRoutines[${index}]`
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
  validateNoUnsafeStickyNoteToneLanguage(routine, label, errors)
}

function validateTakeHomeToneSlip(slip, index, titles, errors) {
  const label = `takeHomeToneSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeStickyNoteToneLanguage(slip, label, errors)
}

export function validateStickyNoteStoryToneCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Sticky Note Story Tone Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch46', 'batchId must be 2026-06-03-batch46.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== stickyNoteStoryToneCardPackProductSlug,
    `productSlug must be ${stickyNoteStoryToneCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Sticky Note Story Tone Card Pack', 'title must be Sticky Note Story Tone Card Pack.')
  pushIf(errors, source.pricePoint !== '$65', 'pricePoint must be $65.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Sticky Note Story Tone Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Sticky Note Story Tone Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Sticky Note Story Tone Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredStickyNoteStoryToneCardPackArtifactPaths, 'Sticky Note Story Tone Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeStickyNoteToneLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.toneRoutines), 'toneRoutines must be an array.')
  if (Array.isArray(source.toneRoutines)) {
    pushIf(errors, source.toneRoutines.length !== 6, 'toneRoutines must have exactly 6 entries.')
    const names = new Set()
    source.toneRoutines.forEach((routine, index) => validateStickyNoteToneRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeToneSlips), 'takeHomeToneSlips must be an array.')
  if (Array.isArray(source.takeHomeToneSlips)) {
    pushIf(errors, source.takeHomeToneSlips.length !== 10, 'takeHomeToneSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeToneSlips.forEach((slip, index) => validateTakeHomeToneSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeStickyNoteToneLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateStickyNoteToneCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeStickyNoteToneLanguage(source, 'Sticky Note Story Tone Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Sticky Note Story Tone Card Pack source', errors)
  return errors
}

export function validateStickyNoteStoryToneCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three story tone-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-a.json',
    'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-b.json',
    'content/product-artifacts/lanes/batch46-sticky-note-tone-cards-c.json',
    'content/product-artifacts/lanes/batch46-sticky-note-tone-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 46 story tone-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 46 story tone-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three story tone-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles story tone-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'toneRoutines', 'takeHomeToneSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}



function normalizeWashiTapeWordChoiceAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bFamily-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\bFamily-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bwashi tape word choice card(s)?\b/gi, '')
    .replace(/\bwashi tape word choice\b/gi, '')
    .replace(/\bpretend word choice\b/gi, '')
    .replace(/\bdrawn word choice\b/gi, '')
    .replace(/\bword choice\b/gi, '')
    .replace(/\bword choice card(s)?\b/gi, '')
    .replace(/\bdetail slip(s)?\b/gi, '')
    .replace(/\bstory detail(s)?\b/gi, '')
    .replace(/\bfocus detail(s)?\b/gi, '')
    .replace(/\bobject trait(s)?\b/gi, '')
    .replace(/\bsentence frame(s)?\b/gi, '')
    .replace(/\bcharacter action(s)?\b/gi, '')
    .replace(/\bmood signal(s)?\b/gi, '')
    .replace(/\bplace clue(s)?\b/gi, '')
    .replace(/\bplace detail\b/gi, '')
    .replace(/\bstory moment(s)?\b/gi, '')
    .replace(/\bproblem slip(s)?\b/gi, '')
    .replace(/\bsmall story problem(s)?\b/gi, '')
    .replace(/\bgentle obstacle(s)?\b/gi, '')
    .replace(/\bmismatch(es)?\b/gi, '')
    .replace(/\bmissing clue(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brevise the problem\b/gi, '')
    .replace(/\bproblem spot(s)?\b/gi, '')
    .replace(/\bcharacter need(s)?\b/gi, '')
    .replace(/\bplace pressure\b/gi, '')
    .replace(/\bobject trouble\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\bpersonal place, schedule, group name, or child detail\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bno identity details\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafeWashiTapeWordChoiceLanguage(value, label, errors) {
  const allowedText = normalizeWashiTapeWordChoiceAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b|\bfood tasting\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, address, route, GPS, location, schedule, tracker, profile, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateWashiTapeWordChoiceCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'wordChoiceSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'plainWordPrompt',
    'preciseNounPrompt',
    'clearVerbPrompt',
    'describerPrompt',
    'sentenceSwapPrompt',
    'soundShapePrompt',
    'finalLinePrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('washi-tape-word-choice-card-'),
      `${label}.id must start with washi-tape-word-choice-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/washi[- ]tape (story[- ])?word[- ]choice card/i.test(card.useCase),
    `${label}.useCase must say washi tape word choice card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'plainWordPrompt',
    'preciseNounPrompt',
    'clearVerbPrompt',
    'describerPrompt',
    'sentenceSwapPrompt',
    'soundShapePrompt',
    'finalLinePrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeWashiTapeWordChoiceLanguage(card, label, errors)
}

function validateWashiTapeWordChoiceRoutine(routine, index, names, errors) {
  const label = `wordChoiceRoutines[${index}]`
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
  validateNoUnsafeWashiTapeWordChoiceLanguage(routine, label, errors)
}

function validateTakeHomeWordSlip(slip, index, titles, errors) {
  const label = `takeHomeWordSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeWashiTapeWordChoiceLanguage(slip, label, errors)
}

export function validateWashiTapeStoryWordChoiceCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Washi Tape Story Word Choice Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch47', 'batchId must be 2026-06-03-batch47.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== washiTapeStoryWordChoiceCardPackProductSlug,
    `productSlug must be ${washiTapeStoryWordChoiceCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Washi Tape Story Word Choice Card Pack', 'title must be Washi Tape Story Word Choice Card Pack.')
  pushIf(errors, source.pricePoint !== '$67', 'pricePoint must be $67.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Washi Tape Story Word Choice Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Washi Tape Story Word Choice Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Washi Tape Story Word Choice Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredWashiTapeStoryWordChoiceCardPackArtifactPaths, 'Washi Tape Story Word Choice Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeWashiTapeWordChoiceLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.wordChoiceRoutines), 'wordChoiceRoutines must be an array.')
  if (Array.isArray(source.wordChoiceRoutines)) {
    pushIf(errors, source.wordChoiceRoutines.length !== 6, 'wordChoiceRoutines must have exactly 6 entries.')
    const names = new Set()
    source.wordChoiceRoutines.forEach((routine, index) => validateWashiTapeWordChoiceRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeWordSlips), 'takeHomeWordSlips must be an array.')
  if (Array.isArray(source.takeHomeWordSlips)) {
    pushIf(errors, source.takeHomeWordSlips.length !== 10, 'takeHomeWordSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeWordSlips.forEach((slip, index) => validateTakeHomeWordSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeWashiTapeWordChoiceLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateWashiTapeWordChoiceCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeWashiTapeWordChoiceLanguage(source, 'Washi Tape Story Word Choice Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Washi Tape Story Word Choice Card Pack source', errors)
  return errors
}

export function validateWashiTapeStoryWordChoiceCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three word choice-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-a.json',
    'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-b.json',
    'content/product-artifacts/lanes/batch47-washi-tape-word-choice-cards-c.json',
    'content/product-artifacts/lanes/batch47-washi-tape-word-choice-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 47 word choice-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 47 word choice-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three word choice-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles word choice-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'wordChoiceRoutines', 'takeHomeWordSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}

function normalizePaperSleeveSentenceVarietyAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\bFamily-safe fictional problems only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\bFamily-safe fictional details only; paper-only adult-led work with broad invented labels and no narrow personal facts\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bpaper sleeve sentence variety card(s)?\b/gi, '')
    .replace(/\bpaper sleeve sentence variety\b/gi, '')
    .replace(/\bpretend sentence variety\b/gi, '')
    .replace(/\bdrawn sentence variety\b/gi, '')
    .replace(/\bsentence variety\b/gi, '')
    .replace(/\bsentence variety card(s)?\b/gi, '')
    .replace(/\bdetail slip(s)?\b/gi, '')
    .replace(/\bstory detail(s)?\b/gi, '')
    .replace(/\bfocus detail(s)?\b/gi, '')
    .replace(/\bobject trait(s)?\b/gi, '')
    .replace(/\bsentence frame(s)?\b/gi, '')
    .replace(/\bcharacter action(s)?\b/gi, '')
    .replace(/\bmood signal(s)?\b/gi, '')
    .replace(/\bplace clue(s)?\b/gi, '')
    .replace(/\bplace detail\b/gi, '')
    .replace(/\bstory moment(s)?\b/gi, '')
    .replace(/\bproblem slip(s)?\b/gi, '')
    .replace(/\bsmall story problem(s)?\b/gi, '')
    .replace(/\bgentle obstacle(s)?\b/gi, '')
    .replace(/\bmismatch(es)?\b/gi, '')
    .replace(/\bmissing clue(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brevise the problem\b/gi, '')
    .replace(/\bproblem spot(s)?\b/gi, '')
    .replace(/\bcharacter need(s)?\b/gi, '')
    .replace(/\bplace pressure\b/gi, '')
    .replace(/\bobject trouble\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad pretend places?\b/gi, '')
    .replace(/\bpersonal place, schedule, group name, or child detail\b/gi, '')
    .replace(/\breal-world facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow real-world fact\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bno identity details\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
}

function validateNoUnsafePaperSleeveSentenceVarietyLanguage(value, label, errors) {
  const allowedText = normalizePaperSleeveSentenceVarietyAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b|\bfood tasting\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, address, route, GPS, location, schedule, tracker, profile, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validatePaperSleeveSentenceVarietyCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'sentenceVarietySkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'shortSentencePrompt',
    'longSentencePrompt',
    'questionSentencePrompt',
    'starterSwapPrompt',
    'sentenceCombinePrompt',
    'rhythmCheckPrompt',
    'finalLinePrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('paper-sleeve-sentence-variety-card-'),
      `${label}.id must start with paper-sleeve-sentence-variety-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/paper[- ]sleeve (story[- ])?sentence[- ]variety card/i.test(card.useCase),
    `${label}.useCase must say paper sleeve sentence variety card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'shortSentencePrompt',
    'longSentencePrompt',
    'questionSentencePrompt',
    'starterSwapPrompt',
    'sentenceCombinePrompt',
    'rhythmCheckPrompt',
    'finalLinePrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePaperSleeveSentenceVarietyLanguage(card, label, errors)
}

function validatePaperSleeveSentenceVarietyRoutine(routine, index, names, errors) {
  const label = `sentenceVarietyRoutines[${index}]`
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
  validateNoUnsafePaperSleeveSentenceVarietyLanguage(routine, label, errors)
}

function validatePaperSleeveTakeHomeSentenceSlip(slip, index, titles, errors) {
  const label = `takeHomeSentenceSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePaperSleeveSentenceVarietyLanguage(slip, label, errors)
}

export function validatePaperSleeveStorySentenceVarietyCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Paper Sleeve Story Sentence Variety Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch48', 'batchId must be 2026-06-03-batch48.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== paperSleeveStorySentenceVarietyCardPackProductSlug,
    `productSlug must be ${paperSleeveStorySentenceVarietyCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Paper Sleeve Story Sentence Variety Card Pack', 'title must be Paper Sleeve Story Sentence Variety Card Pack.')
  pushIf(errors, source.pricePoint !== '$69', 'pricePoint must be $69.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Paper Sleeve Story Sentence Variety Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Paper Sleeve Story Sentence Variety Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Paper Sleeve Story Sentence Variety Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredPaperSleeveStorySentenceVarietyCardPackArtifactPaths, 'Paper Sleeve Story Sentence Variety Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafePaperSleeveSentenceVarietyLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.sentenceVarietyRoutines), 'sentenceVarietyRoutines must be an array.')
  if (Array.isArray(source.sentenceVarietyRoutines)) {
    pushIf(errors, source.sentenceVarietyRoutines.length !== 6, 'sentenceVarietyRoutines must have exactly 6 entries.')
    const names = new Set()
    source.sentenceVarietyRoutines.forEach((routine, index) => validatePaperSleeveSentenceVarietyRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSentenceSlips), 'takeHomeSentenceSlips must be an array.')
  if (Array.isArray(source.takeHomeSentenceSlips)) {
    pushIf(errors, source.takeHomeSentenceSlips.length !== 10, 'takeHomeSentenceSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeSentenceSlips.forEach((slip, index) => validatePaperSleeveTakeHomeSentenceSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafePaperSleeveSentenceVarietyLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validatePaperSleeveSentenceVarietyCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafePaperSleeveSentenceVarietyLanguage(source, 'Paper Sleeve Story Sentence Variety Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Paper Sleeve Story Sentence Variety Card Pack source', errors)
  return errors
}

export function validatePaperSleeveStorySentenceVarietyCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three sentence variety-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-a.json',
    'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-b.json',
    'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-cards-c.json',
    'content/product-artifacts/lanes/batch48-paper-sleeve-sentence-variety-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 48 sentence variety-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 48 sentence variety-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three sentence variety-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles sentence variety-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'sentenceVarietyRoutines', 'takeHomeSentenceSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}

function normalizeClipboardParagraphFocusAllowedSafetyText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\bclipboard story paragraph focus card(s)?\b/gi, '')
    .replace(/\bclipboard paragraph focus card(s)?\b/gi, '')
    .replace(/\bparagraph focus card(s)?\b/gi, '')
    .replace(/\bparagraph focus\b/gi, '')
    .replace(/\bparagraph slip(s)?\b/gi, '')
    .replace(/\bparagraph main idea(s)?\b/gi, '')
    .replace(/\bmain idea(s)?\b/gi, '')
    .replace(/\bdetail one\b/gi, '')
    .replace(/\bdetail two\b/gi, '')
    .replace(/\bmatching detail(s)?\b/gi, '')
    .replace(/\buseful detail(s)?\b/gi, '')
    .replace(/\bdetail order\b/gi, '')
    .replace(/\blink(ing)? sentence(s)?\b/gi, '')
    .replace(/\bcut extra\b/gi, '')
    .replace(/\bside idea(s)?\b/gi, '')
    .replace(/\bfocus check(s)?\b/gi, '')
    .replace(/\bfinal paragraph(s)?\b/gi, '')
    .replace(/\bone clear paragraph\b/gi, '')
    .replace(/\bstory paragraph(s)?\b/gi, '')
    .replace(/\bstory table(s)?\b/gi, '')
    .replace(/\bpaper station(s)?\b/gi, '')
    .replace(/\berrand counter(s)?\b/gi, '')
    .replace(/\bmap table(s)?\b/gi, '')
    .replace(/\btimekeeper table(s)?\b/gi, '')
    .replace(/\blabel tower(s)?\b/gi, '')
    .replace(/\bcraft counter(s)?\b/gi, '')
    .replace(/\bbinding board(s)?\b/gi, '')
    .replace(/\bpaper dock(s)?\b/gi, '')
    .replace(/\bpuddle post\b/gi, '')
    .replace(/\bbroad story labels?\b/gi, '')
    .replace(/\bbroad story words?\b/gi, '')
    .replace(/\bbroad invented story labels?\b/gi, '')
    .replace(/\bpersonal place, schedule, group name, or child detail\b/gi, '')
    .replace(/\bnarrow outside facts?\b/gi, '')
    .replace(/\bnarrow real-world facts?\b/gi, '')
    .replace(/\bnarrow personal facts?\b/gi, '')
    .replace(/\bno identity details\b/gi, '')
    .replace(/\bpuddle-planet-post-office\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\btidepool-timekeepers-lab\b/gi, '')
    .replace(/\bclue-label-tower-museum\b/gi, '')
    .replace(/\bcompass-craft-academy\b/gi, '')
    .replace(/\bPuddle Planet Post Office\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
    .replace(/\bTidepool Timekeepers Lab\b/g, '')
    .replace(/\bClue Label Tower Museum\b/g, '')
    .replace(/\bCompass Craft Academy\b/g, '')
}

function validateNoUnsafeClipboardParagraphFocusLanguage(value, label, errors) {
  const allowedText = normalizeClipboardParagraphFocusAllowedSafetyText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate rooms?\b|\breal rooms?\b|\brooms?\b|\boffices?\b|\blabs?\b|\bmuseums?\b|\bacadem(y|ies)\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddresses?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bspelling grade(s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b|\bfood tasting\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public-posting, review/rating, recording, transcript, microphone, phone/device/screen, photo/camera, real-identity, school/home, room, office, lab, museum, academy, address, route, GPS, location, schedule, tracker, profile, diary/journal, grade, score, timer, contest, scary/harm/bullying/fighting, or private-child-data language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateClipboardParagraphFocusCard(card, index, sourceWorldSlugs, knownWorldSlugs, knownWorldRecords, cardIds, errors) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  for (const key of [
    'id',
    'title',
    'worldSlug',
    'ageBand',
    'paragraphFocusSkill',
    'useCase',
    'adultSetup',
    'kidDirection',
    'mainIdeaPrompt',
    'detailOnePrompt',
    'detailTwoPrompt',
    'detailOrderPrompt',
    'linkingSentencePrompt',
    'cutExtraPrompt',
    'finalParagraphPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('clipboard-paragraph-focus-card-'),
      `${label}.id must start with clipboard-paragraph-focus-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/clipboard (story[- ])?paragraph[- ]focus card/i.test(card.useCase),
    `${label}.useCase must say clipboard paragraph focus card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'mainIdeaPrompt',
    'detailOnePrompt',
    'detailTwoPrompt',
    'detailOrderPrompt',
    'linkingSentencePrompt',
    'cutExtraPrompt',
    'finalParagraphPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeClipboardParagraphFocusLanguage(card, label, errors)
}

function validateClipboardParagraphFocusRoutine(routine, index, names, errors) {
  const label = `paragraphFocusRoutines[${index}]`
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
  if (Array.isArray(routine.steps)) {
    routine.steps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.steps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.steps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  validateNoUnsafeClipboardParagraphFocusLanguage(routine, label, errors)
}

function validateClipboardTakeHomeParagraphSlip(slip, index, titles, errors) {
  const label = `takeHomeParagraphSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeClipboardParagraphFocusLanguage(slip, label, errors)
}

export function validateClipboardStoryParagraphFocusCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Clipboard Story Paragraph Focus Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch49', 'batchId must be 2026-06-03-batch49.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== clipboardStoryParagraphFocusCardPackProductSlug,
    `productSlug must be ${clipboardStoryParagraphFocusCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Clipboard Story Paragraph Focus Card Pack', 'title must be Clipboard Story Paragraph Focus Card Pack.')
  pushIf(errors, source.pricePoint !== '$71', 'pricePoint must be $71.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Clipboard Story Paragraph Focus Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Clipboard Story Paragraph Focus Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Clipboard Story Paragraph Focus Card Pack source pricePoint must match product.pricePoint.')

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

  validateArtifactPaths(source, requiredClipboardStoryParagraphFocusCardPackArtifactPaths, 'Clipboard Story Paragraph Focus Card Pack', errors)

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeClipboardParagraphFocusLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.paragraphFocusRoutines), 'paragraphFocusRoutines must be an array.')
  if (Array.isArray(source.paragraphFocusRoutines)) {
    pushIf(errors, source.paragraphFocusRoutines.length !== 6, 'paragraphFocusRoutines must have exactly 6 entries.')
    const names = new Set()
    source.paragraphFocusRoutines.forEach((routine, index) => validateClipboardParagraphFocusRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeParagraphSlips), 'takeHomeParagraphSlips must be an array.')
  if (Array.isArray(source.takeHomeParagraphSlips)) {
    pushIf(errors, source.takeHomeParagraphSlips.length !== 10, 'takeHomeParagraphSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeParagraphSlips.forEach((slip, index) => validateClipboardTakeHomeParagraphSlip(slip, index, titles, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeClipboardParagraphFocusLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateClipboardParagraphFocusCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeClipboardParagraphFocusLanguage(source, 'Clipboard Story Paragraph Focus Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Clipboard Story Paragraph Focus Card Pack source', errors)
  return errors
}

export function validateClipboardStoryParagraphFocusCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three paragraph focus-card lanes and one tools lane.')

  const expectedSourceFiles = [
    'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-a.json',
    'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-b.json',
    'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-cards-c.json',
    'content/product-artifacts/lanes/batch49-clipboard-paragraph-focus-tools.json',
  ]
  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expectedSourceFiles].sort()),
    'sourceFiles must list the exact Batch 49 paragraph focus-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 49 paragraph focus-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three paragraph focus-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles paragraph focus-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'paragraphFocusRoutines', 'takeHomeParagraphSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}

const linedPaperParagraphRevisionCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'paragraphRevisionSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'topicSentencePrompt',
  'detailOrderPrompt',
  'transitionCheckPrompt',
  'closingSentencePrompt',
  'repeatedWordCutPrompt',
  'finalRevisedParagraphPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const linedPaperParagraphRevisionSourceFiles = [
  'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-a.json',
  'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-b.json',
  'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-cards-c.json',
  'content/product-artifacts/lanes/batch50-lined-paper-paragraph-revision-tools.json',
]

const linedPaperParagraphRevisionBlockedPriorWorldSlugs = new Set([
  'moon-muffin-market',
  'puddle-planet-post-office',
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'pocket-park-notice-board',
  'spoon-ferry-lunchbox-harbor',
  'acorn-avenue-errand-office',
  'seed-library-map-room',
  'rain-gauge-railway',
  'moss-message-observatory',
  'tidepool-timekeepers-lab',
  'revision-river-ferry',
  'clue-label-tower-museum',
  'compass-craft-academy',
  'binding-day-boardwalk',
])

function validateNoUnsafeLinedPaperParagraphRevisionLanguage(value, label, errors) {
  validateNoUnsafeClipboardParagraphFocusLanguage(value, label, errors)
}

function validateLinedPaperParagraphRevisionCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(linedPaperParagraphRevisionCardKeys),
    `${label} must use the exact lined paper paragraph revision card field order.`,
  )

  for (const key of linedPaperParagraphRevisionCardKeys) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('lined-paper-paragraph-revision-card-'),
      `${label}.id must start with lined-paper-paragraph-revision-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/lined[- ]paper (story[- ])?paragraph[- ]revision card/i.test(card.useCase),
    `${label}.useCase must say lined paper paragraph revision card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'topicSentencePrompt',
    'detailOrderPrompt',
    'transitionCheckPrompt',
    'closingSentencePrompt',
    'repeatedWordCutPrompt',
    'finalRevisedParagraphPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeLinedPaperParagraphRevisionLanguage(card, label, errors)
}

function validateLinedPaperParagraphRevisionRoutine(routine, index, names, errors) {
  const label = `paragraphRevisionRoutines[${index}]`
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
  if (Array.isArray(routine.steps)) {
    routine.steps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.steps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.steps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  validateNoUnsafeLinedPaperParagraphRevisionLanguage(routine, label, errors)
}

function validateLinedPaperTakeHomeParagraphRevisionSlip(slip, index, titles, errors) {
  const label = `takeHomeParagraphRevisionSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeLinedPaperParagraphRevisionLanguage(slip, label, errors)
}

export function validateLinedPaperStoryParagraphRevisionCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Lined Paper Story Paragraph Revision Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch50', 'batchId must be 2026-06-03-batch50.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== linedPaperStoryParagraphRevisionCardPackProductSlug,
    `productSlug must be ${linedPaperStoryParagraphRevisionCardPackProductSlug}.`,
  )
  pushIf(
    errors,
    source.title !== 'Lined Paper Story Paragraph Revision Card Pack',
    'title must be Lined Paper Story Paragraph Revision Card Pack.',
  )
  pushIf(errors, source.pricePoint !== '$73', 'pricePoint must be $73.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Lined Paper Story Paragraph Revision Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Lined Paper Story Paragraph Revision Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Lined Paper Story Paragraph Revision Card Pack source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    const blockedPriorWorldSlugs = [...sourceWorldSlugs].filter((slug) =>
      linedPaperParagraphRevisionBlockedPriorWorldSlugs.has(slug),
    )
    pushIf(
      errors,
      blockedPriorWorldSlugs.length > 0,
      `worldSlugs must be disjoint from Batch 44-49 world slugs; overlapping slugs: ${blockedPriorWorldSlugs.join(', ')}.`,
    )
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(
    source,
    requiredLinedPaperStoryParagraphRevisionCardPackArtifactPaths,
    'Lined Paper Story Paragraph Revision Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeLinedPaperParagraphRevisionLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.paragraphRevisionRoutines), 'paragraphRevisionRoutines must be an array.')
  if (Array.isArray(source.paragraphRevisionRoutines)) {
    pushIf(errors, source.paragraphRevisionRoutines.length !== 6, 'paragraphRevisionRoutines must have exactly 6 entries.')
    const names = new Set()
    source.paragraphRevisionRoutines.forEach((routine, index) => validateLinedPaperParagraphRevisionRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeParagraphRevisionSlips), 'takeHomeParagraphRevisionSlips must be an array.')
  if (Array.isArray(source.takeHomeParagraphRevisionSlips)) {
    pushIf(errors, source.takeHomeParagraphRevisionSlips.length !== 10, 'takeHomeParagraphRevisionSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeParagraphRevisionSlips.forEach((slip, index) =>
      validateLinedPaperTakeHomeParagraphRevisionSlip(slip, index, titles, errors),
    )
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeLinedPaperParagraphRevisionLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateLinedPaperParagraphRevisionCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeLinedPaperParagraphRevisionLanguage(source, 'Lined Paper Story Paragraph Revision Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Lined Paper Story Paragraph Revision Card Pack source', errors)
  return errors
}

export function validateLinedPaperStoryParagraphRevisionCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three paragraph revision-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...linedPaperParagraphRevisionSourceFiles].sort()),
    'sourceFiles must list the exact Batch 50 paragraph revision-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 50 paragraph revision-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three paragraph revision-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles paragraph revision-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'paragraphRevisionRoutines', 'takeHomeParagraphRevisionSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}

const compositionNotebookDraftChecklistCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'draftChecklistSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'characterCheckPrompt',
  'settingCheckPrompt',
  'sequenceCheckPrompt',
  'detailCheckPrompt',
  'sentenceCheckPrompt',
  'finalDraftChecklistPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const compositionNotebookDraftChecklistSourceFiles = [
  'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-a.json',
  'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-b.json',
  'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-cards-c.json',
  'content/product-artifacts/lanes/batch51-composition-notebook-draft-checklist-tools.json',
]

const batch50CompositionNotebookRejectedWorldSet = new Set([
  'penny-path-compass-shop',
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'greenhouse-gear-garden',
  'pantry-measurement-mystery',
  'solar-oven-picnic-station',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'margin-note-market',
  'index-card-theater-club',
  'chapter-gate-greenhouse',
])

function validateNoUnsafeCompositionNotebookDraftChecklistLanguage(value, label, errors) {
  validateNoUnsafeClipboardParagraphFocusLanguage(value, label, errors)
}

function validateCompositionNotebookDraftChecklistCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(compositionNotebookDraftChecklistCardKeys),
    `${label} must use the exact composition notebook draft checklist card field order.`,
  )

  for (const key of compositionNotebookDraftChecklistCardKeys) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('composition-notebook-draft-checklist-card-'),
      `${label}.id must start with composition-notebook-draft-checklist-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/composition notebook (story )?draft checklist card/i.test(card.useCase),
    `${label}.useCase must say composition notebook draft checklist card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'characterCheckPrompt',
    'settingCheckPrompt',
    'sequenceCheckPrompt',
    'detailCheckPrompt',
    'sentenceCheckPrompt',
    'finalDraftChecklistPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeCompositionNotebookDraftChecklistLanguage(card, label, errors)
}

function validateCompositionNotebookDraftChecklistRoutine(routine, index, names, errors) {
  const label = `draftChecklistRoutines[${index}]`
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
  if (Array.isArray(routine.steps)) {
    routine.steps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.steps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.steps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  validateNoUnsafeCompositionNotebookDraftChecklistLanguage(routine, label, errors)
}

function validateCompositionNotebookTakeHomeDraftChecklistSlip(slip, index, titles, errors) {
  const label = `takeHomeDraftChecklistSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeCompositionNotebookDraftChecklistLanguage(slip, label, errors)
}

export function validateCompositionNotebookStoryDraftChecklistCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Composition Notebook Story Draft Checklist Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch51', 'batchId must be 2026-06-03-batch51.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== compositionNotebookStoryDraftChecklistCardPackProductSlug,
    `productSlug must be ${compositionNotebookStoryDraftChecklistCardPackProductSlug}.`,
  )
  pushIf(
    errors,
    source.title !== 'Composition Notebook Story Draft Checklist Card Pack',
    'title must be Composition Notebook Story Draft Checklist Card Pack.',
  )
  pushIf(errors, source.pricePoint !== '$75', 'pricePoint must be $75.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Composition Notebook Story Draft Checklist Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Composition Notebook Story Draft Checklist Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Composition Notebook Story Draft Checklist Card Pack source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    pushIf(
      errors,
      source.worldSlugs.length === batch50CompositionNotebookRejectedWorldSet.size &&
        source.worldSlugs.every((slug) => batch50CompositionNotebookRejectedWorldSet.has(slug)),
      'worldSlugs must not exactly reuse the Batch 50 world set.',
    )
    const batch50Overlap = source.worldSlugs.filter((slug) => batch50CompositionNotebookRejectedWorldSet.has(slug))
    pushIf(
      errors,
      batch50Overlap.length > 7,
      `worldSlugs must reuse no more than 7 Batch 50 worlds; overlapping slugs: ${batch50Overlap.join(', ')}.`,
    )
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(
    source,
    requiredCompositionNotebookStoryDraftChecklistCardPackArtifactPaths,
    'Composition Notebook Story Draft Checklist Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeCompositionNotebookDraftChecklistLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.draftChecklistRoutines), 'draftChecklistRoutines must be an array.')
  if (Array.isArray(source.draftChecklistRoutines)) {
    pushIf(errors, source.draftChecklistRoutines.length !== 6, 'draftChecklistRoutines must have exactly 6 entries.')
    const names = new Set()
    source.draftChecklistRoutines.forEach((routine, index) => validateCompositionNotebookDraftChecklistRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeDraftChecklistSlips), 'takeHomeDraftChecklistSlips must be an array.')
  if (Array.isArray(source.takeHomeDraftChecklistSlips)) {
    pushIf(errors, source.takeHomeDraftChecklistSlips.length !== 10, 'takeHomeDraftChecklistSlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeDraftChecklistSlips.forEach((slip, index) =>
      validateCompositionNotebookTakeHomeDraftChecklistSlip(slip, index, titles, errors),
    )
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeCompositionNotebookDraftChecklistLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateCompositionNotebookDraftChecklistCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeCompositionNotebookDraftChecklistLanguage(source, 'Composition Notebook Story Draft Checklist Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Composition Notebook Story Draft Checklist Card Pack source', errors)
  return errors
}

export function validateCompositionNotebookStoryDraftChecklistCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three draft checklist-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...compositionNotebookDraftChecklistSourceFiles].sort()),
    'sourceFiles must list the exact Batch 51 draft checklist-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 51 draft checklist-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three draft checklist-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles draft checklist-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'draftChecklistRoutines', 'takeHomeDraftChecklistSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}

const spiralNotebookFinalCopyCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'finalCopySkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'openingCopyPrompt',
  'neatCopyPrompt',
  'detailTransferPrompt',
  'sentenceBoundaryPrompt',
  'dialogueCopyPrompt',
  'finalCopyCheckPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const spiralNotebookFinalCopySourceFiles = [
  'content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-a.json',
  'content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-b.json',
  'content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-cards-c.json',
  'content/product-artifacts/lanes/batch52-spiral-notebook-final-copy-tools.json',
]

const batch50SpiralNotebookFinalCopyOverlapWorldSet = new Set([
  'penny-path-compass-shop',
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'greenhouse-gear-garden',
  'pantry-measurement-mystery',
  'solar-oven-picnic-station',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'margin-note-market',
  'index-card-theater-club',
  'chapter-gate-greenhouse',
])

const batch51SpiralNotebookFinalCopyOverlapWorldSet = new Set([
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'rain-gauge-railway',
  'greenhouse-gear-garden',
  'cloudberry-clocktower',
  'moss-message-observatory',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'revision-river-ferry',
  'chapter-gate-greenhouse',
  'index-card-theater-club',
  'binding-day-boardwalk',
  'margin-note-market',
])

function validateNoUnsafeSpiralNotebookFinalCopyLanguage(value, label, errors) {
  validateNoUnsafeClipboardParagraphFocusLanguage(value, label, errors)
  const allowedText = normalizeClipboardParagraphFocusAllowedSafetyText(value)
  pushIf(
    errors,
    /\bpublic\b|\baddress(es)?\b|\bfoods?\b/i.test(allowedText),
    `${label} includes public, address, or food language.`,
  )
  pushIf(
    errors,
    /\bpublish(es|ed|ing)?\b|\bpublication(s)?\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bperfect\b|\brubric(s)?\b|\bassessment(s)?\b|\bspell(ing|s|ed)?\b/i.test(
      allowedText,
    ),
    `${label} includes publishing, showcase, portfolio, display, perfect, rubric, assessment, or spelling language.`,
  )
}

function validateSpiralNotebookFinalCopyCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(spiralNotebookFinalCopyCardKeys),
    `${label} must use the exact spiral notebook final-copy card field order.`,
  )

  for (const key of spiralNotebookFinalCopyCardKeys) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('spiral-notebook-final-copy-card-'),
      `${label}.id must start with spiral-notebook-final-copy-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) && !/spiral notebook (story )?final-copy card/i.test(card.useCase),
    `${label}.useCase must say spiral notebook final-copy card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'openingCopyPrompt',
    'neatCopyPrompt',
    'detailTransferPrompt',
    'sentenceBoundaryPrompt',
    'dialogueCopyPrompt',
    'finalCopyCheckPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeSpiralNotebookFinalCopyLanguage(card, label, errors)
}

function validateSpiralNotebookFinalCopyRoutine(routine, index, names, errors) {
  const label = `finalCopyRoutines[${index}]`
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
  if (Array.isArray(routine.steps)) {
    routine.steps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.steps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.steps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  validateNoUnsafeSpiralNotebookFinalCopyLanguage(routine, label, errors)
}

function validateSpiralNotebookTakeHomeFinalCopySlip(slip, index, titles, errors) {
  const label = `takeHomeFinalCopySlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['title', 'time', 'skill', 'direction', 'familyLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.title)) {
    pushIf(errors, titles.has(slip.title), `${label}.title is duplicated.`)
    titles.add(slip.title)
  }
  pushIf(
    errors,
    isNonEmptyString(slip.time) && /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+minute(s)?\b/i.test(slip.time),
    `${label}.time must use a non-timed take-home slip label.`,
  )
  for (const key of ['direction', 'familyLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeSpiralNotebookFinalCopyLanguage(slip, label, errors)
}

export function validateSpiralNotebookStoryFinalCopyCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Spiral Notebook Story Final Copy Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch52', 'batchId must be 2026-06-03-batch52.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== spiralNotebookStoryFinalCopyCardPackProductSlug,
    `productSlug must be ${spiralNotebookStoryFinalCopyCardPackProductSlug}.`,
  )
  pushIf(
    errors,
    source.title !== 'Spiral Notebook Story Final Copy Card Pack',
    'title must be Spiral Notebook Story Final Copy Card Pack.',
  )
  pushIf(errors, source.pricePoint !== '$77', 'pricePoint must be $77.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Spiral Notebook Story Final Copy Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Spiral Notebook Story Final Copy Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Spiral Notebook Story Final Copy Card Pack source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    const batch50Overlap = source.worldSlugs.filter((slug) => batch50SpiralNotebookFinalCopyOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch50Overlap.length > 7,
      `worldSlugs must reuse no more than 7 Batch 50 worlds; overlapping slugs: ${batch50Overlap.join(', ')}.`,
    )
    const batch51Overlap = source.worldSlugs.filter((slug) => batch51SpiralNotebookFinalCopyOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch51Overlap.length > 7,
      `worldSlugs must reuse no more than 7 Batch 51 worlds; overlapping slugs: ${batch51Overlap.join(', ')}.`,
    )
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(
    source,
    requiredSpiralNotebookStoryFinalCopyCardPackArtifactPaths,
    'Spiral Notebook Story Final Copy Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) {
      validateString(source.cover[key], `cover.${key}`, errors)
    }
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeSpiralNotebookFinalCopyLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.finalCopyRoutines), 'finalCopyRoutines must be an array.')
  if (Array.isArray(source.finalCopyRoutines)) {
    pushIf(errors, source.finalCopyRoutines.length !== 6, 'finalCopyRoutines must have exactly 6 entries.')
    const names = new Set()
    source.finalCopyRoutines.forEach((routine, index) => validateSpiralNotebookFinalCopyRoutine(routine, index, names, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeFinalCopySlips), 'takeHomeFinalCopySlips must be an array.')
  if (Array.isArray(source.takeHomeFinalCopySlips)) {
    pushIf(errors, source.takeHomeFinalCopySlips.length !== 10, 'takeHomeFinalCopySlips must have exactly 10 entries.')
    const titles = new Set()
    source.takeHomeFinalCopySlips.forEach((slip, index) =>
      validateSpiralNotebookTakeHomeFinalCopySlip(slip, index, titles, errors),
    )
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeSpiralNotebookFinalCopyLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateSpiralNotebookFinalCopyCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeSpiralNotebookFinalCopyLanguage(source, 'Spiral Notebook Story Final Copy Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Spiral Notebook Story Final Copy Card Pack source', errors)
  return errors
}

export function validateSpiralNotebookStoryFinalCopyCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three final-copy-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...spiralNotebookFinalCopySourceFiles].sort()),
    'sourceFiles must list the exact Batch 52 final-copy-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
        const expectedRange = sourceFile.includes('-cards-a')
          ? { min: 1, max: 6, count: 6, label: '01-06' }
          : sourceFile.includes('-cards-b')
          ? { min: 7, max: 11, count: 5, label: '07-11' }
          : sourceFile.includes('-cards-c')
          ? { min: 12, max: 16, count: 5, label: '12-16' }
          : null
        if (expectedRange) {
          pushIf(
            errors,
            lane.cards.length !== expectedRange.count,
            `${sourceFile} must contain exactly ${expectedRange.count} cards.`,
          )
          const wrongLaneCard = lane.cards.some((card) => {
            const match = String(card?.id ?? '').match(/-(\d{2})$/)
            const cardNumber = match ? Number(match[1]) : NaN
            return !Number.isInteger(cardNumber) || cardNumber < expectedRange.min || cardNumber > expectedRange.max
          })
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 52 final-copy-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three final-copy-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles final-copy-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'finalCopyRoutines', 'takeHomeFinalCopySlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}

const tabbedFolderStorySeriesCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'seriesSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'pageOneAnchorPrompt',
  'characterReturnPrompt',
  'settingReturnPrompt',
  'clueCarryPrompt',
  'pageTurnPrompt',
  'seriesWrapPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const tabbedFolderStorySeriesSourceFiles = [
  'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-a.json',
  'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-b.json',
  'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-cards-c.json',
  'content/product-artifacts/lanes/batch53-tabbed-folder-story-series-tools.json',
]

const batch50TabbedFolderStorySeriesOverlapWorldSet = new Set([
  'penny-path-compass-shop',
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'greenhouse-gear-garden',
  'pantry-measurement-mystery',
  'solar-oven-picnic-station',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'margin-note-market',
  'index-card-theater-club',
  'chapter-gate-greenhouse',
])

const batch51TabbedFolderStorySeriesOverlapWorldSet = new Set([
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'rain-gauge-railway',
  'greenhouse-gear-garden',
  'cloudberry-clocktower',
  'moss-message-observatory',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'revision-river-ferry',
  'chapter-gate-greenhouse',
  'index-card-theater-club',
  'binding-day-boardwalk',
  'margin-note-market',
])

const batch52TabbedFolderStorySeriesOverlapWorldSet = new Set([
  'moon-muffin-market',
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'moss-message-observatory',
  'revision-river-ferry',
  'tiny-lantern-reef',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'penny-path-compass-shop',
  'pantry-measurement-mystery',
  'compost-clock-workshop',
  'almost-invention-workshop',
  'blue-pencil-observatory',
])

function normalizeTabbedFolderStorySeriesAllowedText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\bno screens?\b/gi, '')
    .replace(/\bwithout screens?\b/gi, '')
    .replace(/\bscreen-free\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily adult(s)?\b/gi, '')
    .replace(/\bfamily reader(s)?\b/gi, '')
    .replace(/\bfamily-safe\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bmake-believe\b/gi, '')
    .replace(/\btabbed folder story-series card(s)?\b/gi, '')
    .replace(/\btabbed folder story series card(s)?\b/gi, '')
    .replace(/\bstory-series card(s)?\b/gi, '')
    .replace(/\bstory series card(s)?\b/gi, '')
    .replace(/\btabbed folder(s)?\b/gi, '')
    .replace(/\bstory folder(s)?\b/gi, '')
    .replace(/\bstory-series\b/gi, '')
    .replace(/\bstory series\b/gi, '')
    .replace(/\bpage-one\b/gi, '')
    .replace(/\bpage one\b/gi, '')
    .replace(/\bnext-page\b/gi, '')
    .replace(/\bnext page\b/gi, '')
    .replace(/\bpage turn(s)?\b/gi, '')
    .replace(/\bclue label(s)?\b/gi, '')
    .replace(/\bpaper page(s)?\b/gi, '')
    .replace(/\btrack(s|ed|ing)?\b/gi, '')
    .replace(/\bstar wheel\b/gi, '')
    .replace(/\bstar tag\b/gi, '')
    .replace(/\bstars?\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\bHome Tab Label Slip\b/g, '')
    .replace(/\bchapter-gate-greenhouse\b/gi, '')
    .replace(/\bbinding-day-boardwalk\b/gi, '')
    .replace(/\bindex-card-theater-club\b/gi, '')
    .replace(/\bmargin-note-market\b/gi, '')
    .replace(/\brevision-river-ferry\b/gi, '')
    .replace(/\bblue-pencil-observatory\b/gi, '')
    .replace(/\bappendix-archive-lab\b/gi, '')
    .replace(/\bclue-label-tower-museum\b/gi, '')
    .replace(/\bcompass-craft-academy\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\btidepool-timekeepers-lab\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\brain-boot-route-rangers\b/gi, '')
    .replace(/\bbuttonwood-library-train\b/gi, '')
    .replace(/\bcloudberry-clocktower\b/gi, '')
    .replace(/\bmoon-muffin-market\b/gi, '')
    .replace(/\bChapter Gate Greenhouse\b/g, '')
    .replace(/\bBinding Day Boardwalk\b/g, '')
    .replace(/\bIndex Card Theater Club\b/g, '')
    .replace(/\bMargin Note Market\b/g, '')
    .replace(/\bRevision River Ferry\b/g, '')
    .replace(/\bBlue Pencil Observatory\b/g, '')
    .replace(/\bAppendix Archive Lab\b/g, '')
    .replace(/\bClue Label Tower Museum\b/g, '')
    .replace(/\bCompass Craft Academy\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
    .replace(/\bTidepool Timekeepers Lab\b/g, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bRain Boot Route Rangers\b/g, '')
    .replace(/\bButtonwood Library Train\b/g, '')
    .replace(/\bCloudberry Clocktower\b/g, '')
    .replace(/\bMoon Muffin Market\b/g, '')
    .replace(/\blabs?\b|\bmuseums?\b|\bacadem(y|ies)\b|\boffices?\b|\broutes?\b|\brooms?\b|\bhomes?\b/gi, '')
}

function validateNoUnsafeTabbedFolderStorySeriesLanguage(value, label, errors) {
  const allowedText = normalizeTabbedFolderStorySeriesAllowedText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhome address\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bexact places?\b|\blocation details?\b|\blocations?\b|\bschool route(s)?\b|\breal route(s)?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddress(es)?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate child profile(s)?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bspelling grade(s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b|\bfood tasting\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public, recording, audio, video, camera, photo, real-identity, school, address, route, location, schedule, profile, private child profile, diary, grade, score, timer, contest, food, allergy, medical, scary, harm, bullying, fighting, or weapon language.`,
  )
  pushIf(
    errors,
    /\bpublic\b|\bpublish(es|ed|ing)?\b|\bpublication(s)?\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bperfect\b|\brubric(s)?\b|\bassessment(s)?\b|\bspell(ing|s|ed)?\b|\bpayments?\b|\bcheckout(s)?\b|\bchapter book(s)?\b|\bepisode(s)?\b|\bfoods?\b/i.test(
      allowedText,
    ),
    `${label} includes public, publish, publication, showcase, portfolio, display, perfect, rubric, assessment, spelling, payment, checkout, chapter book, episode, or food language.`,
  )
  pushIf(
    errors,
    /\b\d+\s*(minute|minutes|min|mins)\b|\b(five|six|seven|eight|nine|ten)\s+(to\s+(five|six|seven|eight|nine|ten)\s+)?minute(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes timed-duration or minute-pressure language.`,
  )
}

function validateTabbedFolderStorySeriesCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(tabbedFolderStorySeriesCardKeys),
    `${label} must use the exact tabbed folder story-series card field order.`,
  )

  for (const key of tabbedFolderStorySeriesCardKeys) {
    validateString(card[key], `${label}.${key}`, errors)
  }

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('tabbed-folder-series-card-'),
      `${label}.id must start with tabbed-folder-series-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) &&
      !(/tabbed[- ]folder/i.test(card.useCase) && /story[- ]series/i.test(card.useCase) && /\bcard\b/i.test(card.useCase)),
    `${label}.useCase must say tabbed folder story-series card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'pageOneAnchorPrompt',
    'characterReturnPrompt',
    'settingReturnPrompt',
    'clueCarryPrompt',
    'pageTurnPrompt',
    'seriesWrapPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeTabbedFolderStorySeriesLanguage(card, label, errors)
}

function validateTabbedFolderStorySeriesRoutine(routine, index, ids, errors) {
  const label = `seriesRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['id', 'title', 'time', 'familyLine']) {
    validateString(routine[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(routine.id)) {
    pushIf(errors, ids.has(routine.id), `${label}.id is duplicated.`)
    ids.add(routine.id)
  }
  validateExactStringArray(routine.adultSteps, 4, `${label}.adultSteps`, errors)
  if (Array.isArray(routine.adultSteps)) {
    routine.adultSteps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.adultSteps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.adultSteps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  pushIf(errors, isNonEmptyString(routine.familyLine) && !hasWritableBlank(routine.familyLine), `${label}.familyLine must include a writable blank.`)
  validateNoUnsafeTabbedFolderStorySeriesLanguage(routine, label, errors)
}

function validateTabbedFolderTakeHomeSeriesSlip(slip, index, ids, errors) {
  const label = `takeHomeSeriesSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['id', 'title', 'adultLine', 'childLine', 'nextStepLine']) {
    validateString(slip[key], `${label}.${key}`, errors)
  }
  if (isNonEmptyString(slip.id)) {
    pushIf(errors, ids.has(slip.id), `${label}.id is duplicated.`)
    ids.add(slip.id)
  }
  for (const key of ['adultLine', 'childLine', 'nextStepLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeTabbedFolderStorySeriesLanguage(slip, label, errors)
}

export function validateTabbedFolderStorySeriesCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Tabbed Folder Story Series Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch53', 'batchId must be 2026-06-03-batch53.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== tabbedFolderStorySeriesCardPackProductSlug,
    `productSlug must be ${tabbedFolderStorySeriesCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Tabbed Folder Story Series Card Pack', 'title must be Tabbed Folder Story Series Card Pack.')
  pushIf(errors, source.pricePoint !== '$79', 'pricePoint must be $79.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), `safetyNote must include ${requiredSafety}`)

  pushIf(errors, product?.slug !== source.productSlug, 'Tabbed Folder Story Series Card Pack source productSlug must match product.slug.')
  pushIf(errors, product?.title !== source.title, 'Tabbed Folder Story Series Card Pack source title must match product.title.')
  pushIf(errors, product?.pricePoint !== source.pricePoint, 'Tabbed Folder Story Series Card Pack source pricePoint must match product.pricePoint.')

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set(Array.isArray(source.worldSlugs) ? source.worldSlugs : [])
  if (Array.isArray(source.worldSlugs)) {
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    pushIf(errors, sourceWorldSlugs.size !== source.worldSlugs.length, 'worldSlugs must list unique worlds.')
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    const batch50Overlap = source.worldSlugs.filter((slug) => batch50TabbedFolderStorySeriesOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch50Overlap.length > 7,
      `worldSlugs must reuse no more than 7 Batch 50 worlds; overlapping slugs: ${batch50Overlap.join(', ')}.`,
    )
    const batch51Overlap = source.worldSlugs.filter((slug) => batch51TabbedFolderStorySeriesOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch51Overlap.length > 7,
      `worldSlugs must reuse no more than 7 Batch 51 worlds; overlapping slugs: ${batch51Overlap.join(', ')}.`,
    )
    const batch52Overlap = source.worldSlugs.filter((slug) => batch52TabbedFolderStorySeriesOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch52Overlap.length > 7,
      `worldSlugs must reuse no more than 7 Batch 52 worlds; overlapping slugs: ${batch52Overlap.join(', ')}.`,
    )
    for (const slug of source.worldSlugs) {
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
  }

  validateArtifactPaths(
    source,
    requiredTabbedFolderStorySeriesCardPackArtifactPaths,
    'Tabbed Folder Story Series Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) validateString(source.cover[key], `cover.${key}`, errors)
    validateStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeTabbedFolderStorySeriesLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.seriesRoutines), 'seriesRoutines must be an array.')
  if (Array.isArray(source.seriesRoutines)) {
    pushIf(errors, source.seriesRoutines.length !== 6, 'seriesRoutines must have exactly 6 entries.')
    const ids = new Set()
    source.seriesRoutines.forEach((routine, index) => validateTabbedFolderStorySeriesRoutine(routine, index, ids, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSeriesSlips), 'takeHomeSeriesSlips must be an array.')
  if (Array.isArray(source.takeHomeSeriesSlips)) {
    pushIf(errors, source.takeHomeSeriesSlips.length !== 10, 'takeHomeSeriesSlips must have exactly 10 entries.')
    const ids = new Set()
    source.takeHomeSeriesSlips.forEach((slip, index) => validateTabbedFolderTakeHomeSeriesSlip(slip, index, ids, errors))
  }

  validateExactStringArray(source.optionalSharePrompts, 8, 'optionalSharePrompts', errors)
  if (Array.isArray(source.optionalSharePrompts)) {
    source.optionalSharePrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalSharePrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalSharePrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeTabbedFolderStorySeriesLanguage(prompt, `optionalSharePrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateTabbedFolderStorySeriesCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size < 16, 'cards must cover at least 16 unique worlds.')
  }

  validateNoUnsafeTabbedFolderStorySeriesLanguage(source, 'Tabbed Folder Story Series Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Tabbed Folder Story Series Card Pack source', errors)
  return errors
}

export function validateTabbedFolderStorySeriesCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three story-series-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...tabbedFolderStorySeriesSourceFiles].sort()),
    'sourceFiles must list the exact Batch 53 story-series-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
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
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 53 story-series-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three story-series-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles story-series-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'seriesRoutines', 'takeHomeSeriesSlips']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
    pushIf(
      errors,
      JSON.stringify(toolsLane.optionalAdultPrompts) !== JSON.stringify(source.optionalSharePrompts),
      'sourceFiles tools lane optionalAdultPrompts must reproduce optionalSharePrompts exactly.',
    )
  }

  return errors
}

const accordionFolderStoryArcCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'arcSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'beginningPrompt',
  'middleChangePrompt',
  'choiceBridgePrompt',
  'consequencePrompt',
  'endingReturnPrompt',
  'arcFolderPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const accordionFolderStoryArcSourceFiles = [
  'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-a.json',
  'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-b.json',
  'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-cards-c.json',
  'content/product-artifacts/lanes/batch54-accordion-folder-story-arc-tools.json',
]

const accordionFolderStoryArcExpectedWorldSlugs = [
  'acorn-avenue-errand-office',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'sticker-station-mail-cart',
  'spoon-ferry-lunchbox-harbor',
  'solar-oven-picnic-station',
  'paperclip-plaza-parcel-day',
  'penny-path-compass-shop',
  'tidepool-timekeepers-lab',
  'rain-gauge-railway',
  'compost-clock-workshop',
  'seed-library-map-room',
  'moss-message-observatory',
  'clue-label-tower-museum',
  'compass-craft-academy',
  'greenhouse-gear-garden',
]

const batch50AccordionFolderStoryArcOverlapWorldSet = new Set([
  'penny-path-compass-shop',
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'greenhouse-gear-garden',
  'pantry-measurement-mystery',
  'solar-oven-picnic-station',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'margin-note-market',
  'index-card-theater-club',
  'chapter-gate-greenhouse',
])

const batch51AccordionFolderStoryArcOverlapWorldSet = new Set([
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'rain-gauge-railway',
  'greenhouse-gear-garden',
  'cloudberry-clocktower',
  'moss-message-observatory',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'revision-river-ferry',
  'chapter-gate-greenhouse',
  'index-card-theater-club',
  'binding-day-boardwalk',
  'margin-note-market',
])

const batch52AccordionFolderStoryArcOverlapWorldSet = new Set([
  'moon-muffin-market',
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'moss-message-observatory',
  'revision-river-ferry',
  'tiny-lantern-reef',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'penny-path-compass-shop',
  'pantry-measurement-mystery',
  'compost-clock-workshop',
  'almost-invention-workshop',
  'blue-pencil-observatory',
])

const batch53AccordionFolderStoryArcOverlapWorldSet = new Set([
  'chapter-gate-greenhouse',
  'binding-day-boardwalk',
  'index-card-theater-club',
  'margin-note-market',
  'revision-river-ferry',
  'blue-pencil-observatory',
  'appendix-archive-lab',
  'clue-label-tower-museum',
  'compass-craft-academy',
  'seed-library-map-room',
  'tidepool-timekeepers-lab',
  'acorn-avenue-errand-office',
  'rain-boot-route-rangers',
  'buttonwood-library-train',
  'cloudberry-clocktower',
  'moon-muffin-market',
])

function normalizeAccordionFolderStoryArcAllowedText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\bno screens?\b/gi, '')
    .replace(/\bwithout screens?\b/gi, '')
    .replace(/\bscreen-free\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily-friendly\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bwithout using grades, scores, or real details\b/gi, '')
    .replace(/\bno grades, scores, or real details\b/gi, '')
    .replace(/\bprivate\b/gi, '')
    .replace(/\baccordion folder story-arc card(s)?\b/gi, '')
    .replace(/\baccordion folder story arc card(s)?\b/gi, '')
    .replace(/\bstory-arc card(s)?\b/gi, '')
    .replace(/\bstory arc card(s)?\b/gi, '')
    .replace(/\baccordion folder(s)?\b/gi, '')
    .replace(/\bpaper folder(s)?\b/gi, '')
    .replace(/\bstory arc(s)?\b/gi, '')
    .replace(/\bstory-arc(s)?\b/gi, '')
    .replace(/\bbeginning pocket(s)?\b/gi, '')
    .replace(/\bbeginning\b/gi, '')
    .replace(/\bmiddle change(s)?\b/gi, '')
    .replace(/\bchoice bridge(s)?\b/gi, '')
    .replace(/\bconsequence note(s)?\b/gi, '')
    .replace(/\bconsequence(s)?\b/gi, '')
    .replace(/\bending return(s)?\b/gi, '')
    .replace(/\barc folder note(s)?\b/gi, '')
    .replace(/\breset note(s)?\b/gi, '')
    .replace(/\bpage(s)?\b/gi, '')
    .replace(/\bpocket(s)?\b/gi, '')
    .replace(/\bpaper\b/gi, '')
    .replace(/\bblank(s)?\b/gi, '')
    .replace(/\bnote(s)?\b/gi, '')
    .replace(/\bchoice(s)?\b/gi, '')
    .replace(/\bchange(s|d)?\b/gi, '')
    .replace(/\bbridge(s|d)?\b/gi, '')
    .replace(/\bclue label(s)?\b/gi, '')
    .replace(/\btrack(s)?\b/gi, '')
    .replace(/\bgauge(s)?\b/gi, '')
    .replace(/\bfood-safe\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bbutton-bakery-map-mixup\b/gi, '')
    .replace(/\bteacup-town-weather-window\b/gi, '')
    .replace(/\bsticker-station-mail-cart\b/gi, '')
    .replace(/\bspoon-ferry-lunchbox-harbor\b/gi, '')
    .replace(/\bsolar-oven-picnic-station\b/gi, '')
    .replace(/\bpaperclip-plaza-parcel-day\b/gi, '')
    .replace(/\bpenny-path-compass-shop\b/gi, '')
    .replace(/\btidepool-timekeepers-lab\b/gi, '')
    .replace(/\brain-gauge-railway\b/gi, '')
    .replace(/\bcompost-clock-workshop\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bmoss-message-observatory\b/gi, '')
    .replace(/\bclue-label-tower-museum\b/gi, '')
    .replace(/\bcompass-craft-academy\b/gi, '')
    .replace(/\bgreenhouse-gear-garden\b/gi, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bButton Bakery Map Mixup\b/g, '')
    .replace(/\bTeacup Town Weather Window\b/g, '')
    .replace(/\bSticker Station Mail Cart\b/g, '')
    .replace(/\bSpoon Ferry Lunchbox Harbor\b/g, '')
    .replace(/\bSolar Oven Picnic Station\b/g, '')
    .replace(/\bPaperclip Plaza Parcel Day\b/g, '')
    .replace(/\bPenny Path Compass Shop\b/g, '')
    .replace(/\bTidepool Timekeepers Lab\b/g, '')
    .replace(/\bRain Gauge Railway\b/g, '')
    .replace(/\bCompost Clock Workshop\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
    .replace(/\bMoss Message Observatory\b/g, '')
    .replace(/\bClue Label Tower Museum\b/g, '')
    .replace(/\bCompass Craft Academy\b/g, '')
    .replace(/\bGreenhouse Gear Garden\b/g, '')
}

function validateNoUnsafeAccordionFolderStoryArcLanguage(value, label, errors) {
  const allowedText = normalizeAccordionFolderStoryArcAllowedText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic posting\b|\bpublic publishing\b|\bpublish online\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bchild names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bhome address\b|\bprivate locations?\b|\bprivate place details?\b|\bexact locations?\b|\bschool route(s)?\b|\breal route(s)?\b|\bgps\b|\bcoordinates?\b|\bexact address\b|\baddress(es)?\b|\bstreets?\b|\bhouse numbers?\b|\blicense plates?\b|\bvehicle plates?\b|\bexact schedules?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate child profile(s)?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bspelling grade(s)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b|\bfood tasting\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public, recording, audio, video, camera, photo, real-identity, school, address, route, location, schedule, profile, private child profile, diary, grade, score, timer, contest, food, allergy, medical, scary, harm, bullying, fighting, or weapon language.`,
  )
  pushIf(
    errors,
    /\bpublic\b|\bpublish(es|ed|ing)?\b|\bpublication(s)?\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bperfect\b|\brubric(s)?\b|\bassessment(s)?\b|\bspell(ing|s|ed)?\b|\bpayments?\b|\bcheckout(s)?\b|\bchapter book(s)?\b|\bepisode(s)?\b|\bfoods?\b/i.test(
      allowedText,
    ),
    `${label} includes public, publish, publication, showcase, portfolio, display, perfect, rubric, assessment, spelling, payment, checkout, chapter book, episode, or food language.`,
  )
}

function validateAccordionFolderStoryArcCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(accordionFolderStoryArcCardKeys),
    `${label} must use the exact accordion folder story-arc card field order.`,
  )

  for (const key of accordionFolderStoryArcCardKeys) validateString(card[key], `${label}.${key}`, errors)

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('accordion-folder-arc-card-'),
      `${label}.id must start with accordion-folder-arc-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) &&
      !(/accordion[- ]folder/i.test(card.useCase) && /story[- ]arc/i.test(card.useCase) && /\bcard\b/i.test(card.useCase)),
    `${label}.useCase must say accordion folder story-arc card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'beginningPrompt',
    'middleChangePrompt',
    'choiceBridgePrompt',
    'consequencePrompt',
    'endingReturnPrompt',
    'arcFolderPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeAccordionFolderStoryArcLanguage(card, label, errors)
}

function validateAccordionFolderStoryArcRoutine(routine, index, ids, errors) {
  const label = `arcRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  for (const key of ['id', 'title', 'time', 'familyLine']) validateString(routine[key], `${label}.${key}`, errors)
  if (isNonEmptyString(routine.id)) {
    pushIf(errors, ids.has(routine.id), `${label}.id is duplicated.`)
    ids.add(routine.id)
  }
  validateExactStringArray(routine.adultSteps, 4, `${label}.adultSteps`, errors)
  if (Array.isArray(routine.adultSteps)) {
    routine.adultSteps.forEach((step, stepIndex) => {
      pushIf(errors, isNonEmptyString(step) && !hasWritableBlank(step), `${label}.adultSteps[${stepIndex}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(step) && hasSnakeCasePlaceholder(step), `${label}.adultSteps[${stepIndex}] must use human-readable text, not snake_case placeholders.`)
    })
  }
  pushIf(errors, isNonEmptyString(routine.familyLine) && !hasWritableBlank(routine.familyLine), `${label}.familyLine must include a writable blank.`)
  validateNoUnsafeAccordionFolderStoryArcLanguage(routine, label, errors)
}

function validateAccordionFolderTakeHomeArcSlip(slip, index, ids, errors) {
  const label = `takeHomeArcSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  for (const key of ['id', 'title', 'adultLine', 'childLine', 'nextStepLine']) validateString(slip[key], `${label}.${key}`, errors)
  if (isNonEmptyString(slip.id)) {
    pushIf(errors, ids.has(slip.id), `${label}.id is duplicated.`)
    ids.add(slip.id)
  }
  for (const key of ['adultLine', 'childLine', 'nextStepLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeAccordionFolderStoryArcLanguage(slip, label, errors)
}

export function validateAccordionFolderStoryArcCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Accordion Folder Story Arc Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch54', 'batchId must be 2026-06-03-batch54.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== accordionFolderStoryArcCardPackProductSlug,
    `productSlug must be ${accordionFolderStoryArcCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Accordion Folder Story Arc Card Pack', 'title must be Accordion Folder Story Arc Card Pack.')
  pushIf(errors, source.pricePoint !== '$81', 'pricePoint must be $81.')
  pushIf(errors, !source.safetyNote?.includes(requiredSafety), 'safetyNote must include required safety sentence.')

  if (product) {
    pushIf(errors, product.slug !== source.productSlug, 'product.slug must match productSlug.')
    pushIf(errors, product.title !== source.title, 'product.title must match title.')
    pushIf(errors, product.pricePoint !== source.pricePoint, 'product.pricePoint must match pricePoint.')
    pushIf(errors, product.status !== 'checkout_pending', 'product.status must remain checkout_pending.')
  }

  pushIf(errors, !Array.isArray(source.sourceFiles), 'sourceFiles must be an array.')
  if (Array.isArray(source.sourceFiles)) {
    pushIf(
      errors,
      JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...accordionFolderStoryArcSourceFiles].sort()),
      'sourceFiles must list the exact Batch 54 story-arc-card lane and tools files.',
    )
  }

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set()
  if (Array.isArray(source.worldSlugs)) {
    pushIf(
      errors,
      JSON.stringify(source.worldSlugs) !== JSON.stringify(accordionFolderStoryArcExpectedWorldSlugs),
      'worldSlugs must use the exact Batch 54 accordion folder story-arc world order.',
    )
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, sourceWorldSlugs.has(slug), `worldSlugs includes duplicate slug ${slug}.`)
      sourceWorldSlugs.add(slug)
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    const batch50Overlap = source.worldSlugs.filter((slug) => batch50AccordionFolderStoryArcOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch50Overlap.length !== 6,
      `worldSlugs must overlap exactly 6 Batch 50 worlds; overlapping slugs: ${batch50Overlap.join(', ')}.`,
    )
    const batch51Overlap = source.worldSlugs.filter((slug) => batch51AccordionFolderStoryArcOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch51Overlap.length !== 6,
      `worldSlugs must overlap exactly 6 Batch 51 worlds; overlapping slugs: ${batch51Overlap.join(', ')}.`,
    )
    const batch52Overlap = source.worldSlugs.filter((slug) => batch52AccordionFolderStoryArcOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch52Overlap.length !== 7,
      `worldSlugs must overlap exactly 7 Batch 52 worlds; overlapping slugs: ${batch52Overlap.join(', ')}.`,
    )
    const batch53Overlap = source.worldSlugs.filter((slug) => batch53AccordionFolderStoryArcOverlapWorldSet.has(slug))
    pushIf(
      errors,
      batch53Overlap.length !== 5,
      `worldSlugs must overlap exactly 5 Batch 53 worlds; overlapping slugs: ${batch53Overlap.join(', ')}.`,
    )
  }

  validateArtifactPaths(
    source,
    requiredAccordionFolderStoryArcCardPackArtifactPaths,
    'Accordion Folder Story Arc Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) validateString(source.cover[key], `cover.${key}`, errors)
    validateExactStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    validateNoUnsafeAccordionFolderStoryArcLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.arcRoutines), 'arcRoutines must be an array.')
  if (Array.isArray(source.arcRoutines)) {
    pushIf(errors, source.arcRoutines.length !== 6, 'arcRoutines must have exactly 6 entries.')
    const ids = new Set()
    source.arcRoutines.forEach((routine, index) => validateAccordionFolderStoryArcRoutine(routine, index, ids, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeArcSlips), 'takeHomeArcSlips must be an array.')
  if (Array.isArray(source.takeHomeArcSlips)) {
    pushIf(errors, source.takeHomeArcSlips.length !== 10, 'takeHomeArcSlips must have exactly 10 entries.')
    const ids = new Set()
    source.takeHomeArcSlips.forEach((slip, index) => validateAccordionFolderTakeHomeArcSlip(slip, index, ids, errors))
  }

  validateExactStringArray(source.optionalAdultPrompts, 8, 'optionalAdultPrompts', errors)
  if (Array.isArray(source.optionalAdultPrompts)) {
    source.optionalAdultPrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalAdultPrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalAdultPrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeAccordionFolderStoryArcLanguage(prompt, `optionalAdultPrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateAccordionFolderStoryArcCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size !== 16, 'cards must cover exactly 16 unique worlds.')
  }

  validateNoUnsafeAccordionFolderStoryArcLanguage(source, 'Accordion Folder Story Arc Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Accordion Folder Story Arc Card Pack source', errors)
  return errors
}

export function validateAccordionFolderStoryArcCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three story-arc-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...accordionFolderStoryArcSourceFiles].sort()),
    'sourceFiles must list the exact Batch 54 story-arc-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      pushIf(errors, lane.laneId !== expectedLaneId, `${sourceFile}.laneId must be ${expectedLaneId}.`)
      if (Array.isArray(lane.cards)) {
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
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 54 story-arc-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three story-arc-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles story-arc-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'arcRoutines', 'takeHomeArcSlips', 'optionalAdultPrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const expandingFileStorySceneChainCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'chainSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'startScenePrompt',
  'nextScenePrompt',
  'bridgeDetailPrompt',
  'changeMarkerPrompt',
  'returnDetailPrompt',
  'filePocketPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const expandingFileStorySceneChainSourceFiles = [
  'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-a.json',
  'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-b.json',
  'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-cards-c.json',
  'content/product-artifacts/lanes/batch55-expanding-file-scene-chain-tools.json',
]

const expandingFileStorySceneChainExpectedWorldSlugs = [
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

const batch50ExpandingFileStorySceneChainOverlapWorldSet = new Set([
  'penny-path-compass-shop',
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'greenhouse-gear-garden',
  'pantry-measurement-mystery',
  'solar-oven-picnic-station',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'cloudberry-clocktower',
  'tiny-lantern-reef',
  'almost-invention-workshop',
  'margin-note-market',
  'index-card-theater-club',
  'chapter-gate-greenhouse',
])

const batch51ExpandingFileStorySceneChainOverlapWorldSet = new Set([
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'rain-gauge-railway',
  'greenhouse-gear-garden',
  'cloudberry-clocktower',
  'moss-message-observatory',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'revision-river-ferry',
  'chapter-gate-greenhouse',
  'index-card-theater-club',
  'binding-day-boardwalk',
  'margin-note-market',
])

const batch52ExpandingFileStorySceneChainOverlapWorldSet = new Set([
  'moon-muffin-market',
  'buttonwood-library-train',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'pocket-park-notice-board',
  'moss-message-observatory',
  'revision-river-ferry',
  'tiny-lantern-reef',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'penny-path-compass-shop',
  'pantry-measurement-mystery',
  'compost-clock-workshop',
  'almost-invention-workshop',
  'blue-pencil-observatory',
])

const batch53ExpandingFileStorySceneChainOverlapWorldSet = new Set([
  'chapter-gate-greenhouse',
  'binding-day-boardwalk',
  'index-card-theater-club',
  'margin-note-market',
  'revision-river-ferry',
  'blue-pencil-observatory',
  'appendix-archive-lab',
  'clue-label-tower-museum',
  'compass-craft-academy',
  'seed-library-map-room',
  'tidepool-timekeepers-lab',
  'acorn-avenue-errand-office',
  'rain-boot-route-rangers',
  'buttonwood-library-train',
  'cloudberry-clocktower',
  'moon-muffin-market',
])

const batch54ExpandingFileStorySceneChainOverlapWorldSet = new Set([
  'acorn-avenue-errand-office',
  'button-bakery-map-mixup',
  'teacup-town-weather-window',
  'sticker-station-mail-cart',
  'spoon-ferry-lunchbox-harbor',
  'solar-oven-picnic-station',
  'paperclip-plaza-parcel-day',
  'penny-path-compass-shop',
  'tidepool-timekeepers-lab',
  'rain-gauge-railway',
  'compost-clock-workshop',
  'seed-library-map-room',
  'moss-message-observatory',
  'clue-label-tower-museum',
  'compass-craft-academy',
  'greenhouse-gear-garden',
])

function normalizeExpandingFileStorySceneChainAllowedText(value) {
  return JSON.stringify(value)
    .replace(/\bNo scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles\./gi, '')
    .replace(
      /\bNo scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts\./gi,
      '',
    )
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily-friendly\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bdo not ask for personal facts or real day details\b/gi, '')
    .replace(/\bwithout naming any real place\b/gi, '')
    .replace(/\bexpanding file story scene chain card(s)?\b/gi, '')
    .replace(/\bexpanding file scene chain card(s)?\b/gi, '')
    .replace(/\bscene-chain card(s)?\b/gi, '')
    .replace(/\bscene chain card(s)?\b/gi, '')
    .replace(/\bexpanding file(s)?\b/gi, '')
    .replace(/\bscene-chain(s)?\b/gi, '')
    .replace(/\bscene chain(s)?\b/gi, '')
    .replace(/\bstart scene(s)?\b/gi, '')
    .replace(/\bnext scene(s)?\b/gi, '')
    .replace(/\bbridge detail(s)?\b/gi, '')
    .replace(/\bchange marker(s)?\b/gi, '')
    .replace(/\breturn detail(s)?\b/gi, '')
    .replace(/\bfile pocket note(s)?\b/gi, '')
    .replace(/\bpaper pocket(s)?\b/gi, '')
    .replace(/\bpocket(s)?\b/gi, '')
    .replace(/\bpage(s)?\b/gi, '')
    .replace(/\bpaper\b/gi, '')
    .replace(/\bblank(s)?\b/gi, '')
    .replace(/\bnote(s)?\b/gi, '')
    .replace(/\bclue(s)?\b/gi, '')
    .replace(/\bbutton-bakery-map-mixup\b/gi, '')
    .replace(/\bsticker-station-mail-cart\b/gi, '')
    .replace(/\bpocket-park-notice-board\b/gi, '')
    .replace(/\brain-boot-route-rangers\b/gi, '')
    .replace(/\bpaperclip-plaza-parcel-day\b/gi, '')
    .replace(/\bsolar-oven-picnic-station\b/gi, '')
    .replace(/\bmoss-message-observatory\b/gi, '')
    .replace(/\bpantry-measurement-mystery\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bpond-bridge-blueprint-club\b/gi, '')
    .replace(/\brevision-river-ferry\b/gi, '')
    .replace(/\bbinding-day-boardwalk\b/gi, '')
    .replace(/\bmargin-note-market\b/gi, '')
    .replace(/\balmost-invention-workshop\b/gi, '')
    .replace(/\bappendix-archive-lab\b/gi, '')
    .replace(/\bcompass-craft-academy\b/gi, '')
    .replace(/\bButton Bakery Map Mixup\b/g, '')
    .replace(/\bSticker Station Mail Cart\b/g, '')
    .replace(/\bPocket Park Notice Board\b/g, '')
    .replace(/\bRain Boot Route Rangers\b/g, '')
    .replace(/\bPaperclip Plaza Parcel Day\b/g, '')
    .replace(/\bSolar Oven Picnic Station\b/g, '')
    .replace(/\bMoss Message Observatory\b/g, '')
    .replace(/\bPantry Measurement Mystery\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
    .replace(/\bPond Bridge Blueprint Club\b/g, '')
    .replace(/\bRevision River Ferry\b/g, '')
    .replace(/\bBinding Day Boardwalk\b/g, '')
    .replace(/\bMargin Note Market\b/g, '')
    .replace(/\bAlmost Invention Workshop\b/g, '')
    .replace(/\bAppendix Archive Lab\b/g, '')
    .replace(/\bCompass Craft Academy\b/g, '')
}

function validateNoUnsafeExpandingFileStorySceneChainLanguage(value, label, errors) {
  const allowedText = normalizeExpandingFileStorySceneChainAllowedText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic\b|\bpublish(es|ed|ing)?\b|\bpublication(s)?\b|\breviews?\b|\bratings?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bschool(s)?\b|\bclassroom(s)?\b|\bhome(s)?\b|\baddress(es)?\b|\bstreets?\b|\bprivate locations?\b|\bexact locations?\b|\blocation details?\b|\bschool route(s)?\b|\breal route(s)?\b|\broute details?\b|\bgps\b|\bcoordinates?\b|\bexact schedules?\b|\bschedules?\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate child profile(s)?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bassessment(s)?\b|\bperfect\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bspell(ing|s|ed)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bpayments?\b|\bcheckout(s)?\b|\bprovider(s)?\b|\bchapter book(s)?\b|\bepisode(s)?\b|\bfood(s)?\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b|\bprofessional advice\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public, recording, audio, video, camera, photo, real-identity, school, home, address, route, GPS, schedule, location, profile, private child profile, diary, grade, score, timer, contest, publishing, showcase, portfolio, display, payment, provider, chapter book, episode, food, allergy, medical, scary, harm, bullying, fighting, or weapon language.`,
  )
}

function validateExpandingFileStorySceneChainCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(expandingFileStorySceneChainCardKeys),
    `${label} must use the exact expanding file scene-chain card field order.`,
  )

  for (const key of expandingFileStorySceneChainCardKeys) validateString(card[key], `${label}.${key}`, errors)

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('expanding-file-scene-chain-card-'),
      `${label}.id must start with expanding-file-scene-chain-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
  pushIf(errors, !['7-9', '8-10', '10-11'].includes(card.ageBand), `${label}.ageBand is not allowed.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !knownWorldSlugs.has(card.worldSlug), `${label}.worldSlug references an unknown world.`)
  pushIf(errors, isNonEmptyString(card.worldSlug) && !sourceWorldSlugs.has(card.worldSlug), `${label}.worldSlug must be listed in worldSlugs.`)
  const worldRecord = knownWorldRecords?.get(card.worldSlug)
  const worldAgeBand = typeof worldRecord === 'string' ? worldRecord : worldRecord?.ageBand
  pushIf(
    errors,
    isNonEmptyString(card.ageBand) && isNonEmptyString(worldAgeBand) && card.ageBand !== worldAgeBand,
    `${label}.ageBand must match ${card.worldSlug} ageBand ${worldAgeBand}.`,
  )
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) &&
      !(/expanding[- ]file/i.test(card.useCase) && /scene[- ]chain/i.test(card.useCase) && /\bcard\b/i.test(card.useCase)),
    `${label}.useCase must say expanding file scene-chain card.`,
  )
  pushIf(errors, isNonEmptyString(card.adultSetup) && !card.adultSetup.startsWith('Adult:'), `${label}.adultSetup must start with Adult:.`)

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'startScenePrompt',
    'nextScenePrompt',
    'bridgeDetailPrompt',
    'changeMarkerPrompt',
    'returnDetailPrompt',
    'filePocketPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeExpandingFileStorySceneChainLanguage(card, label, errors)
}

function validateExpandingFileStorySceneChainRoutine(routine, index, errors) {
  const label = `sceneChainRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  pushIf(
    errors,
    JSON.stringify(Object.keys(routine)) !== JSON.stringify(['title', 'time', 'materials', 'steps', 'adultWrapLine']),
    `${label} must use the exact scene-chain routine field order.`,
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
  validateNoUnsafeExpandingFileStorySceneChainLanguage(routine, label, errors)
}

function validateExpandingFileTakeHomeSceneSlip(slip, index, errors) {
  const label = `takeHomeSceneSlips[${index}]`
  pushIf(errors, !isObject(slip), `${label} must be an object.`)
  if (!isObject(slip)) return
  pushIf(
    errors,
    JSON.stringify(Object.keys(slip)) !== JSON.stringify(['title', 'adultLine', 'childLine', 'nextPageLine']),
    `${label} must use the exact take-home scene slip field order.`,
  )
  for (const key of ['title', 'adultLine', 'childLine', 'nextPageLine']) validateString(slip[key], `${label}.${key}`, errors)
  for (const key of ['adultLine', 'childLine', 'nextPageLine']) {
    pushIf(errors, isNonEmptyString(slip[key]) && !hasWritableBlank(slip[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(slip[key]) && hasSnakeCasePlaceholder(slip[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeExpandingFileStorySceneChainLanguage(slip, label, errors)
}

export function validateExpandingFileStorySceneChainCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Expanding File Story Scene Chain Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch55', 'batchId must be 2026-06-03-batch55.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== expandingFileStorySceneChainCardPackProductSlug,
    `productSlug must be ${expandingFileStorySceneChainCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Expanding File Story Scene Chain Card Pack', 'title must be Expanding File Story Scene Chain Card Pack.')
  pushIf(errors, source.pricePoint !== '$83', 'pricePoint must be $83.')
  pushIf(
    errors,
    !source.safetyNote?.includes(expandingFileStorySceneChainRequiredSafety),
    'safetyNote must include required Batch 55 safety sentence.',
  )

  if (product) {
    pushIf(errors, product.slug !== source.productSlug, 'product.slug must match productSlug.')
    pushIf(errors, product.title !== source.title, 'product.title must match title.')
    pushIf(errors, product.pricePoint !== source.pricePoint, 'product.pricePoint must match pricePoint.')
    pushIf(errors, product.status !== 'checkout_pending', 'product.status must remain checkout_pending.')
  }

  pushIf(errors, !Array.isArray(source.sourceFiles), 'sourceFiles must be an array.')
  if (Array.isArray(source.sourceFiles)) {
    pushIf(
      errors,
      JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expandingFileStorySceneChainSourceFiles].sort()),
      'sourceFiles must list the exact Batch 55 scene-chain-card lane and tools files.',
    )
  }

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set()
  if (Array.isArray(source.worldSlugs)) {
    pushIf(
      errors,
      JSON.stringify(source.worldSlugs) !== JSON.stringify(expandingFileStorySceneChainExpectedWorldSlugs),
      'worldSlugs must use the exact Batch 55 expanding file scene-chain world order.',
    )
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, sourceWorldSlugs.has(slug), `worldSlugs includes duplicate slug ${slug}.`)
      sourceWorldSlugs.add(slug)
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const [batchNumber, overlapSet] of [
      [50, batch50ExpandingFileStorySceneChainOverlapWorldSet],
      [51, batch51ExpandingFileStorySceneChainOverlapWorldSet],
      [52, batch52ExpandingFileStorySceneChainOverlapWorldSet],
      [53, batch53ExpandingFileStorySceneChainOverlapWorldSet],
      [54, batch54ExpandingFileStorySceneChainOverlapWorldSet],
    ]) {
      const overlap = source.worldSlugs.filter((slug) => overlapSet.has(slug))
      pushIf(
        errors,
        overlap.length !== 7,
        `worldSlugs must overlap exactly 7 Batch ${batchNumber} worlds; overlapping slugs: ${overlap.join(', ')}.`,
      )
    }
  }

  validateArtifactPaths(
    source,
    requiredExpandingFileStorySceneChainCardPackArtifactPaths,
    'Expanding File Story Scene Chain Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) validateString(source.cover[key], `cover.${key}`, errors)
    validateExactStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    if (Array.isArray(source.adultGuide.bullets)) {
      source.adultGuide.bullets.forEach((bullet, index) => {
        pushIf(errors, isNonEmptyString(bullet) && !hasWritableBlank(bullet), `adultGuide.bullets[${index}] must include a writable blank.`)
      })
    }
    validateNoUnsafeExpandingFileStorySceneChainLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.sceneChainRoutines), 'sceneChainRoutines must be an array.')
  if (Array.isArray(source.sceneChainRoutines)) {
    pushIf(errors, source.sceneChainRoutines.length !== 6, 'sceneChainRoutines must have exactly 6 entries.')
    source.sceneChainRoutines.forEach((routine, index) => validateExpandingFileStorySceneChainRoutine(routine, index, errors))
  }

  pushIf(errors, !Array.isArray(source.takeHomeSceneSlips), 'takeHomeSceneSlips must be an array.')
  if (Array.isArray(source.takeHomeSceneSlips)) {
    pushIf(errors, source.takeHomeSceneSlips.length !== 10, 'takeHomeSceneSlips must have exactly 10 entries.')
    source.takeHomeSceneSlips.forEach((slip, index) => validateExpandingFileTakeHomeSceneSlip(slip, index, errors))
  }

  validateExactStringArray(source.optionalAdultPrompts, 8, 'optionalAdultPrompts', errors)
  if (Array.isArray(source.optionalAdultPrompts)) {
    source.optionalAdultPrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalAdultPrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalAdultPrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeExpandingFileStorySceneChainLanguage(prompt, `optionalAdultPrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateExpandingFileStorySceneChainCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size !== 16, 'cards must cover exactly 16 unique worlds.')
  }

  validateNoUnsafeExpandingFileStorySceneChainLanguage(source, 'Expanding File Story Scene Chain Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Expanding File Story Scene Chain Card Pack source', errors)
  return errors
}

export function validateExpandingFileStorySceneChainCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three scene-chain-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...expandingFileStorySceneChainSourceFiles].sort()),
    'sourceFiles must list the exact Batch 55 scene-chain-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      if (Array.isArray(lane.cards)) {
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
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        pushIf(
          errors,
          JSON.stringify(Object.keys(lane)) !==
            JSON.stringify(['adultGuide', 'sceneChainRoutines', 'takeHomeSceneSlips', 'optionalAdultPrompts']),
          `${sourceFile} must use the exact Batch 55 tools field order.`,
        )
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 55 scene-chain-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three scene-chain-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles scene-chain-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'sceneChainRoutines', 'takeHomeSceneSlips', 'optionalAdultPrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const manilaFolderStoryClueTrailCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'clueSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'firstCluePrompt',
  'nextCluePrompt',
  'turningCluePrompt',
  'mismatchPrompt',
  'returnCluePrompt',
  'folderLabelPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const manilaFolderStoryClueTrailSourceFiles = [
  'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-a.json',
  'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-b.json',
  'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-cards-c.json',
  'content/product-artifacts/lanes/batch56-manila-folder-clue-trail-tools.json',
]

const manilaFolderStoryClueTrailExpectedWorldSlugs = [
  'teacup-town-weather-window',
  'spoon-ferry-lunchbox-harbor',
  'sticker-station-mail-cart',
  'chapter-gate-greenhouse',
  'paperclip-plaza-parcel-day',
  'orchard-pulley-post',
  'appendix-archive-lab',
  'penny-path-compass-shop',
  'pantry-measurement-mystery',
  'blue-pencil-observatory',
  'rain-gauge-railway',
  'binding-day-boardwalk',
  'seed-library-map-room',
  'mitten-market-lost-ticket',
  'cloudberry-clocktower',
  'rain-boot-route-rangers',
]

function normalizeManilaFolderStoryClueTrailAllowedText(value) {
  return JSON.stringify(value)
    .replace(
      /\bNo scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts\./gi,
      '',
    )
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily-friendly\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bbroad\b/gi, '')
    .replace(/\bdo not ask for real schedules, rooms, names, or personal facts\b/gi, '')
    .replace(/\bwithout using real names, places, or facts\b/gi, '')
    .replace(/\bwith no real trip details\b/gi, '')
    .replace(/\bwithout using real details\b/gi, '')
    .replace(/\bmanila folder story clue trail card(s)?\b/gi, '')
    .replace(/\bmanila folder clue trail card(s)?\b/gi, '')
    .replace(/\bclue-trail card(s)?\b/gi, '')
    .replace(/\bclue trail card(s)?\b/gi, '')
    .replace(/\bmanila folder(s)?\b/gi, '')
    .replace(/\bclue-trail(s)?\b/gi, '')
    .replace(/\bclue trail(s)?\b/gi, '')
    .replace(/\bfirst clue(s)?\b/gi, '')
    .replace(/\bnext clue(s)?\b/gi, '')
    .replace(/\bturning clue(s)?\b/gi, '')
    .replace(/\bmismatch clue(s)?\b/gi, '')
    .replace(/\breturn clue(s)?\b/gi, '')
    .replace(/\bfolder label(s)?\b/gi, '')
    .replace(/\bpage(s)?\b/gi, '')
    .replace(/\bpaper\b/gi, '')
    .replace(/\bblank(s)?\b/gi, '')
    .replace(/\bnote(s)?\b/gi, '')
    .replace(/\bclue(s)?\b/gi, '')
    .replace(/\bteacup-town-weather-window\b/gi, '')
    .replace(/\bspoon-ferry-lunchbox-harbor\b/gi, '')
    .replace(/\bsticker-station-mail-cart\b/gi, '')
    .replace(/\bchapter-gate-greenhouse\b/gi, '')
    .replace(/\bpaperclip-plaza-parcel-day\b/gi, '')
    .replace(/\borchard-pulley-post\b/gi, '')
    .replace(/\bappendix-archive-lab\b/gi, '')
    .replace(/\bpenny-path-compass-shop\b/gi, '')
    .replace(/\bpantry-measurement-mystery\b/gi, '')
    .replace(/\bblue-pencil-observatory\b/gi, '')
    .replace(/\brain-gauge-railway\b/gi, '')
    .replace(/\bbinding-day-boardwalk\b/gi, '')
    .replace(/\bseed-library-map-room\b/gi, '')
    .replace(/\bmitten-market-lost-ticket\b/gi, '')
    .replace(/\bcloudberry-clocktower\b/gi, '')
    .replace(/\brain-boot-route-rangers\b/gi, '')
    .replace(/\bTeacup Town Weather Window\b/g, '')
    .replace(/\bSpoon Ferry Lunchbox Harbor\b/g, '')
    .replace(/\bSticker Station Mail Cart\b/g, '')
    .replace(/\bChapter Gate Greenhouse\b/g, '')
    .replace(/\bPaperclip Plaza Parcel Day\b/g, '')
    .replace(/\bOrchard Pulley Post\b/g, '')
    .replace(/\bAppendix Archive Lab\b/g, '')
    .replace(/\bPenny Path Compass Shop\b/g, '')
    .replace(/\bPantry Measurement Mystery\b/g, '')
    .replace(/\bBlue Pencil Observatory\b/g, '')
    .replace(/\bRain Gauge Railway\b/g, '')
    .replace(/\bBinding Day Boardwalk\b/g, '')
    .replace(/\bSeed Library Map Room\b/g, '')
    .replace(/\bMitten Market Lost Ticket\b/g, '')
    .replace(/\bCloudberry Clocktower\b/g, '')
    .replace(/\bRain Boot Route Rangers\b/g, '')
}

function validateNoUnsafeManilaFolderStoryClueTrailLanguage(value, label, errors) {
  const allowedText = normalizeManilaFolderStoryClueTrailAllowedText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic\b|\bpublish(es|ed|ing)?\b|\bpublication(s)?\b|\breviews?\b|\bratings?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bstudent names?\b|\breal identity\b|\bidentity details?\b|\bschool(s)?\b|\bclassroom(s)?\b|\bhome(s)?\b|\baddress(es)?\b|\bstreets?\b|\bprivate locations?\b|\bexact locations?\b|\blocation details?\b|\bschool route(s)?\b|\breal route(s)?\b|\broute details?\b|\bgps\b|\bcoordinates?\b|\bexact schedules?\b|\bschedules?\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bprivate child profile(s)?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bassessment(s)?\b|\bperfect\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bspell(ing|s|ed)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bpayments?\b|\bcheckout(s)?\b|\bprovider(s)?\b|\bchapter book(s)?\b|\bepisode(s)?\b|\bscreenplay(s)?\b|\bfood(s)?\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b|\bprofessional advice\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public, recording, audio, video, camera, photo, real-identity, school, home, address, route, GPS, schedule, location, profile, private child profile, diary, grade, score, timer, contest, publishing, showcase, portfolio, display, payment, provider, chapter book, episode, screenplay, food, allergy, medical, scary, harm, bullying, fighting, or weapon language.`,
  )
}

function validateManilaFolderStoryClueTrailCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(manilaFolderStoryClueTrailCardKeys),
    `${label} must use the exact manila folder clue-trail card field order.`,
  )

  for (const key of manilaFolderStoryClueTrailCardKeys) validateString(card[key], `${label}.${key}`, errors)

  if (isNonEmptyString(card.id)) {
    pushIf(errors, !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.id), `${label}.id must be lowercase kebab-case.`)
    pushIf(
      errors,
      !card.id.startsWith('manila-folder-clue-trail-card-'),
      `${label}.id must start with manila-folder-clue-trail-card-.`,
    )
    pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
    cardIds.add(card.id)
  }
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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) &&
      !(/manila[- ]folder/i.test(card.useCase) && /clue[- ]trail/i.test(card.useCase) && /\bcard\b/i.test(card.useCase)),
    `${label}.useCase must say manila folder clue-trail card.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'firstCluePrompt',
    'nextCluePrompt',
    'turningCluePrompt',
    'mismatchPrompt',
    'returnCluePrompt',
    'folderLabelPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeManilaFolderStoryClueTrailLanguage(card, label, errors)
}

function validateManilaFolderStoryClueTrailRoutine(routine, index, errors) {
  const label = `clueTrailRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  pushIf(
    errors,
    JSON.stringify(Object.keys(routine)) !== JSON.stringify(['title', 'time', 'materials', 'steps', 'adultWrapLine']),
    `${label} must use the exact clue-trail routine field order.`,
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
  validateNoUnsafeManilaFolderStoryClueTrailLanguage(routine, label, errors)
}

export function validateManilaFolderStoryClueTrailCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Manila Folder Story Clue Trail Card Pack source must be an object.')
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
  pushIf(errors, source.batchId !== '2026-06-03-batch56', 'batchId must be 2026-06-03-batch56.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== manilaFolderStoryClueTrailCardPackProductSlug,
    `productSlug must be ${manilaFolderStoryClueTrailCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Manila Folder Story Clue Trail Card Pack', 'title must be Manila Folder Story Clue Trail Card Pack.')
  pushIf(errors, source.pricePoint !== '$85', 'pricePoint must be $85.')
  pushIf(
    errors,
    !source.safetyNote?.includes(manilaFolderStoryClueTrailRequiredSafety),
    'safetyNote must include required Batch 56 safety sentence.',
  )

  if (product) {
    pushIf(errors, product.slug !== source.productSlug, 'product.slug must match productSlug.')
    pushIf(errors, product.title !== source.title, 'product.title must match title.')
    pushIf(errors, product.pricePoint !== source.pricePoint, 'product.pricePoint must match pricePoint.')
    pushIf(errors, product.status !== 'checkout_pending', 'product.status must remain checkout_pending.')
  }

  pushIf(errors, !Array.isArray(source.sourceFiles), 'sourceFiles must be an array.')
  if (Array.isArray(source.sourceFiles)) {
    pushIf(
      errors,
      JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...manilaFolderStoryClueTrailSourceFiles].sort()),
      'sourceFiles must list the exact Batch 56 clue-trail-card lane and tools files.',
    )
  }

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set()
  if (Array.isArray(source.worldSlugs)) {
    pushIf(
      errors,
      JSON.stringify(source.worldSlugs) !== JSON.stringify(manilaFolderStoryClueTrailExpectedWorldSlugs),
      'worldSlugs must use the exact Batch 56 manila folder clue-trail world order.',
    )
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, sourceWorldSlugs.has(slug), `worldSlugs includes duplicate slug ${slug}.`)
      sourceWorldSlugs.add(slug)
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
    pushIf(errors, Array.isArray(product?.worldSlugs) && !sameStringSet(source.worldSlugs, product.worldSlugs), 'worldSlugs must match product.worldSlugs.')
    for (const [batchNumber, overlapSet] of [
      [51, batch51ExpandingFileStorySceneChainOverlapWorldSet],
      [52, batch52ExpandingFileStorySceneChainOverlapWorldSet],
      [53, batch53ExpandingFileStorySceneChainOverlapWorldSet],
      [54, batch54ExpandingFileStorySceneChainOverlapWorldSet],
      [55, new Set(expandingFileStorySceneChainExpectedWorldSlugs)],
    ]) {
      const overlap = source.worldSlugs.filter((slug) => overlapSet.has(slug))
      pushIf(
        errors,
        overlap.length !== 7,
        `worldSlugs must overlap exactly 7 Batch ${batchNumber} worlds; overlapping slugs: ${overlap.join(', ')}.`,
      )
    }
  }

  validateArtifactPaths(
    source,
    requiredManilaFolderStoryClueTrailCardPackArtifactPaths,
    'Manila Folder Story Clue Trail Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) validateString(source.cover[key], `cover.${key}`, errors)
    validateExactStringArray(source.cover.included, 10, 'cover.included', errors)
  }

  pushIf(errors, !isObject(source.adultGuide), 'adultGuide must be an object.')
  if (isObject(source.adultGuide)) {
    validateString(source.adultGuide.title, 'adultGuide.title', errors)
    validateExactStringArray(source.adultGuide.bullets, 6, 'adultGuide.bullets', errors)
    if (Array.isArray(source.adultGuide.bullets)) {
      source.adultGuide.bullets.forEach((bullet, index) => {
        pushIf(errors, isNonEmptyString(bullet) && !hasWritableBlank(bullet), `adultGuide.bullets[${index}] must include a writable blank.`)
      })
    }
    validateNoUnsafeManilaFolderStoryClueTrailLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.clueTrailRoutines), 'clueTrailRoutines must be an array.')
  if (Array.isArray(source.clueTrailRoutines)) {
    pushIf(errors, source.clueTrailRoutines.length !== 6, 'clueTrailRoutines must have exactly 6 entries.')
    source.clueTrailRoutines.forEach((routine, index) => validateManilaFolderStoryClueTrailRoutine(routine, index, errors))
  }

  validateExactStringArray(source.takeHomeClueSlips, 10, 'takeHomeClueSlips', errors)
  if (Array.isArray(source.takeHomeClueSlips)) {
    source.takeHomeClueSlips.forEach((slip, index) => {
      pushIf(errors, isNonEmptyString(slip) && !hasWritableBlank(slip), `takeHomeClueSlips[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(slip) && hasSnakeCasePlaceholder(slip), `takeHomeClueSlips[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeManilaFolderStoryClueTrailLanguage(slip, `takeHomeClueSlips[${index}]`, errors)
    })
  }

  validateExactStringArray(source.optionalAdultPrompts, 8, 'optionalAdultPrompts', errors)
  if (Array.isArray(source.optionalAdultPrompts)) {
    source.optionalAdultPrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalAdultPrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalAdultPrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeManilaFolderStoryClueTrailLanguage(prompt, `optionalAdultPrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateManilaFolderStoryClueTrailCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size !== 16, 'cards must cover exactly 16 unique worlds.')
  }

  validateNoUnsafeManilaFolderStoryClueTrailLanguage(source, 'Manila Folder Story Clue Trail Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Manila Folder Story Clue Trail Card Pack source', errors)
  return errors
}

export function validateManilaFolderStoryClueTrailCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three clue-trail-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify([...source.sourceFiles].sort()) !== JSON.stringify([...manilaFolderStoryClueTrailSourceFiles].sort()),
    'sourceFiles must list the exact Batch 56 clue-trail-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      if (Array.isArray(lane.cards)) {
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
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        pushIf(
          errors,
          JSON.stringify(Object.keys(lane)) !==
            JSON.stringify(['adultGuide', 'clueTrailRoutines', 'takeHomeClueSlips', 'optionalAdultPrompts']),
          `${sourceFile} must use the exact Batch 56 tools field order.`,
        )
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 56 clue-trail-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three clue-trail-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles clue-trail-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'clueTrailRoutines', 'takeHomeClueSlips', 'optionalAdultPrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const pocketFolderStoryGoalPathSourceKeys = [
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
  'goalPathRoutines',
  'takeHomeGoalSlips',
  'optionalAdultPrompts',
  'cards',
]

const pocketFolderStoryGoalPathCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'goalSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'wantPrompt',
  'snagPrompt',
  'firstTryPrompt',
  'rethinkPrompt',
  'finishNotePrompt',
  'pocketLabelPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const pocketFolderStoryGoalPathSourceFiles = [
  'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-a.json',
  'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-b.json',
  'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-cards-c.json',
  'content/product-artifacts/lanes/batch57-pocket-folder-goal-path-tools.json',
]

const pocketFolderStoryGoalPathExpectedWorldSlugs = [
  'acorn-avenue-errand-office',
  'pocket-park-notice-board',
  'mitten-market-lost-ticket',
  'penny-path-compass-shop',
  'rain-boot-route-rangers',
  'greenhouse-gear-garden',
  'moss-message-observatory',
  'rain-gauge-railway',
  'pond-bridge-blueprint-club',
  'compost-clock-workshop',
  'chapter-gate-greenhouse',
  'binding-day-boardwalk',
  'blue-pencil-observatory',
  'index-card-theater-club',
  'compass-craft-academy',
  'almost-invention-workshop',
]

const pocketFolderStoryGoalPathExpectedWorldAges = new Map([
  ['acorn-avenue-errand-office', '7-9'],
  ['pocket-park-notice-board', '7-9'],
  ['mitten-market-lost-ticket', '7-8'],
  ['penny-path-compass-shop', '7-9'],
  ['rain-boot-route-rangers', '7-9'],
  ['greenhouse-gear-garden', '8-10'],
  ['moss-message-observatory', '8-10'],
  ['rain-gauge-railway', '8-10'],
  ['pond-bridge-blueprint-club', '8-10'],
  ['compost-clock-workshop', '8-10'],
  ['chapter-gate-greenhouse', '10-11'],
  ['binding-day-boardwalk', '10-11'],
  ['blue-pencil-observatory', '10-11'],
  ['index-card-theater-club', '10-11'],
  ['compass-craft-academy', '10-11'],
  ['almost-invention-workshop', '10-11'],
])

function normalizePocketFolderStoryGoalPathAllowedText(value) {
  return JSON.stringify(value)
    .replace(
      /\bNo scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts\./gi,
      '',
    )
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily-friendly\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bbroad\b/gi, '')
    .replace(/\bno real trip details\b/gi, '')
    .replace(/\bdo not ask for real schedules, rooms, names, or personal facts\b/gi, '')
    .replace(/\bno real names, real places, and personal facts\b/gi, '')
    .replace(/\bskip real names, real places, and personal facts\b/gi, '')
    .replace(/\bwithout danger or blame\b/gi, '')
    .replace(/\bpocket folder story goal path card pack\b/gi, '')
    .replace(/\bpocket folder story goal-path card pack\b/gi, '')
    .replace(/\bpocket folder goal path card(s)?\b/gi, '')
    .replace(/\bpocket folder(s)?\b/gi, '')
    .replace(/\bgoal-path card(s)?\b/gi, '')
    .replace(/\bgoal path card(s)?\b/gi, '')
    .replace(/\bgoal-path(s)?\b/gi, '')
    .replace(/\bgoal path(s)?\b/gi, '')
    .replace(/\bpocket label(s)?\b/gi, '')
    .replace(/\bfinish note(s)?\b/gi, '')
    .replace(/\bfirst try\b/gi, '')
    .replace(/\brethink(s)?\b/gi, '')
    .replace(/\bwant(s)?\b/gi, '')
    .replace(/\bsnag(s)?\b/gi, '')
    .replace(/\bcharacter(s)?\b/gi, '')
    .replace(/\bwriter(s)?\b/gi, '')
    .replace(/\bpage(s)?\b/gi, '')
    .replace(/\bpaper\b/gi, '')
    .replace(/\bblank(s)?\b/gi, '')
    .replace(/\bnote(s)?\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bpocket-park-notice-board\b/gi, '')
    .replace(/\bmitten-market-lost-ticket\b/gi, '')
    .replace(/\bpenny-path-compass-shop\b/gi, '')
    .replace(/\brain-boot-route-rangers\b/gi, '')
    .replace(/\bgreenhouse-gear-garden\b/gi, '')
    .replace(/\bmoss-message-observatory\b/gi, '')
    .replace(/\brain-gauge-railway\b/gi, '')
    .replace(/\bpond-bridge-blueprint-club\b/gi, '')
    .replace(/\bcompost-clock-workshop\b/gi, '')
    .replace(/\bchapter-gate-greenhouse\b/gi, '')
    .replace(/\bbinding-day-boardwalk\b/gi, '')
    .replace(/\bblue-pencil-observatory\b/gi, '')
    .replace(/\bindex-card-theater-club\b/gi, '')
    .replace(/\bcompass-craft-academy\b/gi, '')
    .replace(/\balmost-invention-workshop\b/gi, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bPocket Park Notice Board\b/g, '')
    .replace(/\bMitten Market Lost Ticket\b/g, '')
    .replace(/\bPenny Path Compass Shop\b/g, '')
    .replace(/\bRain Boot Route Rangers\b/g, '')
    .replace(/\bGreenhouse Gear Garden\b/g, '')
    .replace(/\bMoss Message Observatory\b/g, '')
    .replace(/\bRain Gauge Railway\b/g, '')
    .replace(/\bPond Bridge Blueprint Club\b/g, '')
    .replace(/\bCompost Clock Workshop\b/g, '')
    .replace(/\bChapter Gate Greenhouse\b/g, '')
    .replace(/\bBinding Day Boardwalk\b/g, '')
    .replace(/\bBlue Pencil Observatory\b/g, '')
    .replace(/\bIndex Card Theater Club\b/g, '')
    .replace(/\bCompass Craft Academy\b/g, '')
    .replace(/\bAlmost Invention Workshop\b/g, '')
}

function validateNoUnsafePocketFolderStoryGoalPathLanguage(value, label, errors) {
  const allowedText = normalizePocketFolderStoryGoalPathAllowedText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic\b|\bpublish(es|ed|ing)?\b|\bpublication(s)?\b|\breviews?\b|\bratings?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\brecording(s)?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\breal names?\b|\bfull names?\b|\bstudent names?\b|\bteacher names?\b|\breal teacher\b|\breal identity\b|\bidentity details?\b|\bschool names?\b|\bschool(s)?\b|\bclassroom(s)?\b|\bhome(s)?\b|\baddress(es)?\b|\bstreets?\b|\bprivate locations?\b|\bexact locations?\b|\blocation details?\b|\bschool route(s)?\b|\breal route(s)?\b|\broute details?\b|\bgps\b|\bcoordinates?\b|\bexact schedules?\b|\bschedules?\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bpersonal disclosure(s)?\b|\bprivate child profile(s)?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bassessment(s)?\b|\bperfect\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bspell(ing|s|ed)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bpayments?\b|\bcheckout(s)?\b|\bprovider(s)?\b|\bstripe\b|\bchapter book(s)?\b|\bepisode(s)?\b|\bscreenplay(s)?\b|\bfood(s)?\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b|\bprofessional advice\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bprayer(s)?\b|\bbet(s|ting)?\b|\bgambling\b|\bcasino(s)?\b|\bpokemon\b|\bpokémon\b|\bbranded character(s)?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public, address, addresses, food, foods, publishing, showcase, portfolio, display, perfect, rubric, assessment, spelling, episode, chapter book, screenplay, recording, voice memo, timer, score, private child profile, election, prayer, bet, Pokemon, school name, home address, teacher name, camera, photo, audio, video, allergy, medical, diary, student profile, personal disclosure, provider, payment, checkout, Stripe, real-identity, route, GPS, schedule, location, profile, politics, religion, gambling, branded character, scary, harm, bullying, fighting, or weapon language.`,
  )
}

function validatePocketFolderStoryGoalPathCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(pocketFolderStoryGoalPathCardKeys),
    `${label} must use the exact pocket folder goal-path card field order.`,
  )

  for (const key of pocketFolderStoryGoalPathCardKeys) validateString(card[key], `${label}.${key}`, errors)

  const expectedWorldSlug = pocketFolderStoryGoalPathExpectedWorldSlugs[index]
  const expectedId = `pocket-folder-goal-path-card-${String(index + 1).padStart(2, '0')}`
  const expectedAgeBand = pocketFolderStoryGoalPathExpectedWorldAges.get(expectedWorldSlug)
  pushIf(errors, card.id !== expectedId, `${label}.id must be ${expectedId}.`)
  pushIf(errors, card.worldSlug !== expectedWorldSlug, `${label}.worldSlug must be ${expectedWorldSlug}.`)
  pushIf(errors, card.ageBand !== expectedAgeBand, `${label}.ageBand must be ${expectedAgeBand}.`)
  pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
  cardIds.add(card.id)

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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) &&
      !(/pocket[- ]folder/i.test(card.useCase) && /goal[- ]path/i.test(card.useCase) && /\bcard\b/i.test(card.useCase)),
    `${label}.useCase must say pocket folder goal-path card.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'wantPrompt',
    'snagPrompt',
    'firstTryPrompt',
    'rethinkPrompt',
    'finishNotePrompt',
    'pocketLabelPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafePocketFolderStoryGoalPathLanguage(card, label, errors)
}

function validatePocketFolderStoryGoalPathRoutine(routine, index, errors) {
  const label = `goalPathRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  pushIf(
    errors,
    JSON.stringify(Object.keys(routine)) !== JSON.stringify(['title', 'time', 'materials', 'steps', 'adultWrapLine']),
    `${label} must use the exact goal-path routine field order.`,
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
  validateNoUnsafePocketFolderStoryGoalPathLanguage(routine, label, errors)
}

export function validatePocketFolderStoryGoalPathCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Pocket Folder Story Goal Path Card Pack source must be an object.')
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
    JSON.stringify(Object.keys(source)) !== JSON.stringify(pocketFolderStoryGoalPathSourceKeys),
    'source must use the exact Batch 57 pocket folder goal-path source field order.',
  )

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-03-batch57', 'batchId must be 2026-06-03-batch57.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== pocketFolderStoryGoalPathCardPackProductSlug,
    `productSlug must be ${pocketFolderStoryGoalPathCardPackProductSlug}.`,
  )
  pushIf(errors, source.title !== 'Pocket Folder Story Goal Path Card Pack', 'title must be Pocket Folder Story Goal Path Card Pack.')
  pushIf(errors, source.pricePoint !== '$87', 'pricePoint must be $87.')
  pushIf(
    errors,
    !source.safetyNote?.includes(pocketFolderStoryGoalPathRequiredSafety),
    'safetyNote must include required Batch 57 safety sentence.',
  )

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
      JSON.stringify(source.sourceFiles) !== JSON.stringify(pocketFolderStoryGoalPathSourceFiles),
      'sourceFiles must list the exact Batch 57 goal-path-card lane and tools files.',
    )
  }

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set()
  if (Array.isArray(source.worldSlugs)) {
    pushIf(
      errors,
      JSON.stringify(source.worldSlugs) !== JSON.stringify(pocketFolderStoryGoalPathExpectedWorldSlugs),
      'worldSlugs must use the exact Batch 57 pocket folder goal-path world order.',
    )
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, sourceWorldSlugs.has(slug), `worldSlugs includes duplicate slug ${slug}.`)
      sourceWorldSlugs.add(slug)
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
    for (const [batchNumber, overlapSet] of [
      [52, batch52TabbedFolderStorySeriesOverlapWorldSet],
      [53, batch53ExpandingFileStorySceneChainOverlapWorldSet],
      [54, batch54ExpandingFileStorySceneChainOverlapWorldSet],
      [55, new Set(expandingFileStorySceneChainExpectedWorldSlugs)],
      [56, new Set(manilaFolderStoryClueTrailExpectedWorldSlugs)],
    ]) {
      const overlap = source.worldSlugs.filter((slug) => overlapSet.has(slug))
      pushIf(
        errors,
        overlap.length !== 7,
        `worldSlugs must overlap exactly 7 Batch ${batchNumber} worlds; overlapping slugs: ${overlap.join(', ')}.`,
      )
    }
  }

  validateArtifactPaths(
    source,
    requiredPocketFolderStoryGoalPathCardPackArtifactPaths,
    'Pocket Folder Story Goal Path Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) validateString(source.cover[key], `cover.${key}`, errors)
    validateExactStringArray(source.cover.included, 10, 'cover.included', errors)
    validateNoUnsafePocketFolderStoryGoalPathLanguage(source.cover, 'cover', errors)
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
    validateNoUnsafePocketFolderStoryGoalPathLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.goalPathRoutines), 'goalPathRoutines must be an array.')
  if (Array.isArray(source.goalPathRoutines)) {
    pushIf(errors, source.goalPathRoutines.length !== 6, 'goalPathRoutines must have exactly 6 entries.')
    source.goalPathRoutines.forEach((routine, index) => validatePocketFolderStoryGoalPathRoutine(routine, index, errors))
  }

  validateExactStringArray(source.takeHomeGoalSlips, 10, 'takeHomeGoalSlips', errors)
  if (Array.isArray(source.takeHomeGoalSlips)) {
    source.takeHomeGoalSlips.forEach((slip, index) => {
      pushIf(errors, isNonEmptyString(slip) && !hasWritableBlank(slip), `takeHomeGoalSlips[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(slip) && hasSnakeCasePlaceholder(slip), `takeHomeGoalSlips[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafePocketFolderStoryGoalPathLanguage(slip, `takeHomeGoalSlips[${index}]`, errors)
    })
  }

  validateExactStringArray(source.optionalAdultPrompts, 8, 'optionalAdultPrompts', errors)
  if (Array.isArray(source.optionalAdultPrompts)) {
    source.optionalAdultPrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalAdultPrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalAdultPrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafePocketFolderStoryGoalPathLanguage(prompt, `optionalAdultPrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validatePocketFolderStoryGoalPathCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size !== 16, 'cards must cover exactly 16 unique worlds.')
  }

  validateNoUnsafePocketFolderStoryGoalPathLanguage(source, 'Pocket Folder Story Goal Path Card Pack source', errors)
  validateNoRiskyLanguage(source, 'Pocket Folder Story Goal Path Card Pack source', errors)
  return errors
}

export function validatePocketFolderStoryGoalPathCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three goal-path-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify(source.sourceFiles) !== JSON.stringify(pocketFolderStoryGoalPathSourceFiles),
    'sourceFiles must list the exact Batch 57 goal-path-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      if (Array.isArray(lane.cards)) {
        pushIf(
          errors,
          JSON.stringify(Object.keys(lane)) !== JSON.stringify(['laneId', 'cards']),
          `${sourceFile} must use the exact Batch 57 card lane field order.`,
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
          pushIf(errors, wrongLaneCard, `${sourceFile} must contain only cards ${expectedRange.label}.`)
        }
        cardLaneFiles.push({ sourceFile, lane })
      } else if (isObject(lane.adultGuide)) {
        pushIf(
          errors,
          JSON.stringify(Object.keys(lane)) !==
            JSON.stringify(['adultGuide', 'goalPathRoutines', 'takeHomeGoalSlips', 'optionalAdultPrompts']),
          `${sourceFile} must use the exact Batch 57 tools field order.`,
        )
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 57 goal-path-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three goal-path-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles goal-path-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'goalPathRoutines', 'takeHomeGoalSlips', 'optionalAdultPrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const hangingFileStoryDecisionPointSourceKeys = [
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
  'decisionPointRoutines',
  'takeHomeDecisionSlips',
  'optionalAdultPrompts',
  'cards',
]

const hangingFileStoryDecisionPointCardKeys = [
  'id',
  'title',
  'worldSlug',
  'ageBand',
  'decisionSkill',
  'useCase',
  'adultSetup',
  'kidDirection',
  'choicePrompt',
  'pathOnePrompt',
  'pathTwoPrompt',
  'compareCluePrompt',
  'chosenPathPrompt',
  'consequenceNotePrompt',
  'fileLabelPrompt',
  'quietOptionLine',
  'takeHomeLine',
]

const hangingFileStoryDecisionPointSourceFiles = [
  'content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-a.json',
  'content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-b.json',
  'content/product-artifacts/lanes/batch58-hanging-file-decision-point-cards-c.json',
  'content/product-artifacts/lanes/batch58-hanging-file-decision-point-tools.json',
]

const hangingFileStoryDecisionPointExpectedWorldSlugs = [
  'acorn-avenue-errand-office',
  'button-bakery-map-mixup',
  'mitten-market-lost-ticket',
  'penny-path-compass-shop',
  'spoon-ferry-lunchbox-harbor',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pantry-measurement-mystery',
  'pond-bridge-blueprint-club',
  'tidepool-timekeepers-lab',
  'almost-invention-workshop',
  'appendix-archive-lab',
  'blue-pencil-observatory',
  'clue-label-tower-museum',
  'margin-note-market',
  'revision-river-ferry',
]

const hangingFileStoryDecisionPointExpectedWorldAges = new Map([
  ['acorn-avenue-errand-office', '7-9'],
  ['button-bakery-map-mixup', '7-9'],
  ['mitten-market-lost-ticket', '7-8'],
  ['penny-path-compass-shop', '7-9'],
  ['spoon-ferry-lunchbox-harbor', '7-9'],
  ['compost-clock-workshop', '8-10'],
  ['orchard-pulley-post', '8-10'],
  ['pantry-measurement-mystery', '8-10'],
  ['pond-bridge-blueprint-club', '8-10'],
  ['tidepool-timekeepers-lab', '8-10'],
  ['almost-invention-workshop', '10-11'],
  ['appendix-archive-lab', '10-11'],
  ['blue-pencil-observatory', '10-11'],
  ['clue-label-tower-museum', '10-11'],
  ['margin-note-market', '10-11'],
  ['revision-river-ferry', '10-11'],
])

const hangingFileStoryDecisionPointPriorSourceFiles = new Map([
  [53, 'content/product-artifacts/tabbed-folder-story-series-card-pack.json'],
  [54, 'content/product-artifacts/accordion-folder-story-arc-card-pack.json'],
  [55, 'content/product-artifacts/expanding-file-story-scene-chain-card-pack.json'],
  [56, 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json'],
  [57, 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json'],
])

function readHangingFileStoryDecisionPointPriorWorldSet(batchNumber) {
  const sourceFile = hangingFileStoryDecisionPointPriorSourceFiles.get(batchNumber)
  const source = JSON.parse(readFileSync(resolve(import.meta.dirname, '..', sourceFile), 'utf8'))
  return new Set(source.worldSlugs)
}

function normalizeHangingFileStoryDecisionPointAllowedText(value) {
  return JSON.stringify(value)
    .replace(
      /\bNo scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts\./gi,
      '',
    )
    .replace(/\bdo not ask for real schedules, rooms, names, or personal facts\b/gi, '')
    .replace(/\bskip real names, real places, and personal facts\b/gi, '')
    .replace(/\bno real school\/home identity details\b/gi, '')
    .replace(/\bwithout blame or danger\b/gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily-friendly\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfamily\b/gi, '')
    .replace(/\bfictional\b/gi, '')
    .replace(/\bpretend\b/gi, '')
    .replace(/\binvented\b/gi, '')
    .replace(/\bmade-up\b/gi, '')
    .replace(/\bmade up\b/gi, '')
    .replace(/\bhanging[- ]file story decision[- ]point card pack\b/gi, '')
    .replace(/\bhanging[- ]file story decision[- ]point card(s)?\b/gi, '')
    .replace(/\bhanging[- ]file decision[- ]point card(s)?\b/gi, '')
    .replace(/\bdecision[- ]point card(s)?\b/gi, '')
    .replace(/\bdecision[- ]point(s)?\b/gi, '')
    .replace(/\bdecision point(s)?\b/gi, '')
    .replace(/\bhanging[- ]file(s)?\b/gi, '')
    .replace(/\bcharacter choice(s)?\b/gi, '')
    .replace(/\bchoice prompt(s)?\b/gi, '')
    .replace(/\bpath one\b/gi, '')
    .replace(/\bpath two\b/gi, '')
    .replace(/\btwo paths\b/gi, '')
    .replace(/\bcompare clue(s)?\b/gi, '')
    .replace(/\bchosen path(s)?\b/gi, '')
    .replace(/\bconsequence note(s)?\b/gi, '')
    .replace(/\bfile label(s)?\b/gi, '')
    .replace(/\bpath(s)?\b/gi, '')
    .replace(/\bchoice(s)?\b/gi, '')
    .replace(/\bclue(s)?\b/gi, '')
    .replace(/\bpage(s)?\b/gi, '')
    .replace(/\bpaper\b/gi, '')
    .replace(/\bblank(s)?\b/gi, '')
    .replace(/\bnote(s)?\b/gi, '')
    .replace(/\bacorn-avenue-errand-office\b/gi, '')
    .replace(/\bbutton-bakery-map-mixup\b/gi, '')
    .replace(/\bmitten-market-lost-ticket\b/gi, '')
    .replace(/\bpenny-path-compass-shop\b/gi, '')
    .replace(/\bspoon-ferry-lunchbox-harbor\b/gi, '')
    .replace(/\bcompost-clock-workshop\b/gi, '')
    .replace(/\borchard-pulley-post\b/gi, '')
    .replace(/\bpantry-measurement-mystery\b/gi, '')
    .replace(/\bpond-bridge-blueprint-club\b/gi, '')
    .replace(/\btidepool-timekeepers-lab\b/gi, '')
    .replace(/\balmost-invention-workshop\b/gi, '')
    .replace(/\bappendix-archive-lab\b/gi, '')
    .replace(/\bblue-pencil-observatory\b/gi, '')
    .replace(/\bclue-label-tower-museum\b/gi, '')
    .replace(/\bmargin-note-market\b/gi, '')
    .replace(/\brevision-river-ferry\b/gi, '')
    .replace(/\bAcorn Avenue Errand Office\b/g, '')
    .replace(/\bButton Bakery Map Mixup\b/g, '')
    .replace(/\bMitten Market Lost Ticket\b/g, '')
    .replace(/\bPenny Path Compass Shop\b/g, '')
    .replace(/\bSpoon Ferry Lunchbox Harbor\b/g, '')
    .replace(/\bCompost Clock Workshop\b/g, '')
    .replace(/\bOrchard Pulley Post\b/g, '')
    .replace(/\bPantry Measurement Mystery\b/g, '')
    .replace(/\bPond Bridge Blueprint Club\b/g, '')
    .replace(/\bTidepool Timekeepers Lab\b/g, '')
    .replace(/\bAlmost Invention Workshop\b/g, '')
    .replace(/\bAppendix Archive Lab\b/g, '')
    .replace(/\bBlue Pencil Observatory\b/g, '')
    .replace(/\bClue Label Tower Museum\b/g, '')
    .replace(/\bMargin Note Market\b/g, '')
    .replace(/\bRevision River Ferry\b/g, '')
}

function validateNoUnsafeHangingFileStoryDecisionPointLanguage(value, label, errors) {
  const allowedText = normalizeHangingFileStoryDecisionPointAllowedText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic\b|\bpublish(es|ed|ing|able)?\b|\bpublication(s)?\b|\breviews?\b|\bratings?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\brecording(s)?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\bstudent names?\b|\bteacher names?\b|\breal teacher\b|\bwrite (the )?real name(s)?\b|\breal identity\b|\bidentity details?\b|\bschool names?\b|\bclassroom(s)?\b|\baddress(es)?\b|\bstreets?\b|\bprivate locations?\b|\bexact locations?\b|\blocation details?\b|\bschool route(s)?\b|\breal route(s)?\b|\broute details?\b|\bgps\b|\bcoordinates?\b|\bexact schedules?\b|\bschedules?\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bpersonal disclosure(s)?\b|\bprivate child profile(s)?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bassessment(s)?\b|\bperfect\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bspell(ing|s|ed)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bpayments?\b|\bcheckout(s)?\b|\bprovider(s)?\b|\bstripe\b|\bchapter book(s)?\b|\bepisode(s)?\b|\bscreenplay(s)?\b|\bchoose your own adventure\b|\bfood(s)?\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b|\bprofessional advice\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bprayer(s)?\b|\bbet(s|ting)?\b|\bgambling\b|\bcasino(s)?\b|\bpokemon\b|\bpokémon\b|\bbranded character(s)?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public, address, addresses, food, foods, publishing, publishable, showcase, portfolio, display, perfect, rubric, assessment, spelling, episode, chapter book, screenplay, choose your own adventure, recording, voice memo, timer, score, private child profile, election, prayer, bet, Pokemon, school name, home address, teacher name, camera, photo, audio, video, allergy, medical, diary, student profile, personal disclosure, provider, payment, checkout, Stripe, real-identity, route, GPS, schedule, location, profile, politics, religion, gambling, branded character, scary, harm, bullying, fighting, or weapon language.`,
  )
}

function validateHangingFileStoryDecisionPointCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(hangingFileStoryDecisionPointCardKeys),
    `${label} must use the exact hanging file decision-point card field order.`,
  )

  for (const key of hangingFileStoryDecisionPointCardKeys) validateString(card[key], `${label}.${key}`, errors)

  const expectedWorldSlug = hangingFileStoryDecisionPointExpectedWorldSlugs[index]
  const expectedId = `hanging-file-decision-point-card-${String(index + 1).padStart(2, '0')}`
  const expectedAgeBand = hangingFileStoryDecisionPointExpectedWorldAges.get(expectedWorldSlug)
  pushIf(errors, card.id !== expectedId, `${label}.id must be ${expectedId}.`)
  pushIf(errors, card.worldSlug !== expectedWorldSlug, `${label}.worldSlug must be ${expectedWorldSlug}.`)
  pushIf(errors, card.ageBand !== expectedAgeBand, `${label}.ageBand must be ${expectedAgeBand}.`)
  pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
  cardIds.add(card.id)

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
  pushIf(errors, isNonEmptyString(card.useCase) && !/adult-led/i.test(card.useCase), `${label}.useCase must say adult-led.`)
  pushIf(
    errors,
    isNonEmptyString(card.useCase) &&
      !(/hanging[- ]file/i.test(card.useCase) && /decision[- ]point/i.test(card.useCase) && /\bcard\b/i.test(card.useCase)),
    `${label}.useCase must say hanging file decision-point card.`,
  )

  for (const key of [
    'useCase',
    'adultSetup',
    'kidDirection',
    'choicePrompt',
    'pathOnePrompt',
    'pathTwoPrompt',
    'compareCluePrompt',
    'chosenPathPrompt',
    'consequenceNotePrompt',
    'fileLabelPrompt',
    'quietOptionLine',
    'takeHomeLine',
  ]) {
    pushIf(errors, isNonEmptyString(card[key]) && !hasWritableBlank(card[key]), `${label}.${key} must include a writable blank.`)
    pushIf(errors, isNonEmptyString(card[key]) && hasSnakeCasePlaceholder(card[key]), `${label}.${key} must use human-readable text, not snake_case placeholders.`)
  }
  validateNoUnsafeHangingFileStoryDecisionPointLanguage(card, label, errors)
}

function validateHangingFileStoryDecisionPointRoutine(routine, index, errors) {
  const label = `decisionPointRoutines[${index}]`
  pushIf(errors, !isObject(routine), `${label} must be an object.`)
  if (!isObject(routine)) return
  pushIf(
    errors,
    JSON.stringify(Object.keys(routine)) !== JSON.stringify(['title', 'time', 'materials', 'steps', 'adultWrapLine']),
    `${label} must use the exact decision-point routine field order.`,
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
  validateNoUnsafeHangingFileStoryDecisionPointLanguage(routine, label, errors)
}

export function validateHangingFileStoryDecisionPointCardPackSource(source, product, knownWorldSlugs) {
  const errors = []
  pushIf(errors, !isObject(source), 'Hanging File Story Decision Point Card Pack source must be an object.')
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
    JSON.stringify(Object.keys(source)) !== JSON.stringify(hangingFileStoryDecisionPointSourceKeys),
    'source must use the exact Batch 58 hanging file decision-point source field order.',
  )

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-03-batch58', 'batchId must be 2026-06-03-batch58.')
  pushIf(errors, source.generatedAt !== '2026-06-03', 'generatedAt must be 2026-06-03.')
  pushIf(
    errors,
    source.productSlug !== hangingFileStoryDecisionPointCardPackProductSlug,
    `productSlug must be ${hangingFileStoryDecisionPointCardPackProductSlug}.`,
  )
  pushIf(
    errors,
    source.title !== 'Hanging File Story Decision Point Card Pack',
    'title must be Hanging File Story Decision Point Card Pack.',
  )
  pushIf(errors, source.pricePoint !== '$89', 'pricePoint must be $89.')
  pushIf(
    errors,
    !source.safetyNote?.includes(hangingFileStoryDecisionPointRequiredSafety),
    'safetyNote must include required Batch 58 safety sentence.',
  )

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
      JSON.stringify(source.sourceFiles) !== JSON.stringify(hangingFileStoryDecisionPointSourceFiles),
      'sourceFiles must list the exact Batch 58 decision-point-card lane and tools files.',
    )
  }

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set()
  if (Array.isArray(source.worldSlugs)) {
    pushIf(
      errors,
      JSON.stringify(source.worldSlugs) !== JSON.stringify(hangingFileStoryDecisionPointExpectedWorldSlugs),
      'worldSlugs must use the exact Batch 58 hanging file decision-point world order.',
    )
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, sourceWorldSlugs.has(slug), `worldSlugs includes duplicate slug ${slug}.`)
      sourceWorldSlugs.add(slug)
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
    for (const batchNumber of [53, 54, 55, 56, 57]) {
      const overlapSet = readHangingFileStoryDecisionPointPriorWorldSet(batchNumber)
      const overlap = source.worldSlugs.filter((slug) => overlapSet.has(slug))
      pushIf(
        errors,
        overlap.length !== 7,
        `worldSlugs must overlap exactly 7 Batch ${batchNumber} worlds; overlapping slugs: ${overlap.join(', ')}.`,
      )
    }
  }

  validateArtifactPaths(
    source,
    requiredHangingFileStoryDecisionPointCardPackArtifactPaths,
    'Hanging File Story Decision Point Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) validateString(source.cover[key], `cover.${key}`, errors)
    validateExactStringArray(source.cover.included, 11, 'cover.included', errors)
    validateNoUnsafeHangingFileStoryDecisionPointLanguage(source.cover, 'cover', errors)
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
    validateNoUnsafeHangingFileStoryDecisionPointLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.decisionPointRoutines), 'decisionPointRoutines must be an array.')
  if (Array.isArray(source.decisionPointRoutines)) {
    pushIf(errors, source.decisionPointRoutines.length !== 6, 'decisionPointRoutines must have exactly 6 entries.')
    source.decisionPointRoutines.forEach((routine, index) =>
      validateHangingFileStoryDecisionPointRoutine(routine, index, errors),
    )
  }

  validateExactStringArray(source.takeHomeDecisionSlips, 10, 'takeHomeDecisionSlips', errors)
  if (Array.isArray(source.takeHomeDecisionSlips)) {
    source.takeHomeDecisionSlips.forEach((slip, index) => {
      pushIf(errors, isNonEmptyString(slip) && !hasWritableBlank(slip), `takeHomeDecisionSlips[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(slip) && hasSnakeCasePlaceholder(slip), `takeHomeDecisionSlips[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeHangingFileStoryDecisionPointLanguage(slip, `takeHomeDecisionSlips[${index}]`, errors)
    })
  }

  validateExactStringArray(source.optionalAdultPrompts, 8, 'optionalAdultPrompts', errors)
  if (Array.isArray(source.optionalAdultPrompts)) {
    source.optionalAdultPrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalAdultPrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalAdultPrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeHangingFileStoryDecisionPointLanguage(prompt, `optionalAdultPrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateHangingFileStoryDecisionPointCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size !== 16, 'cards must cover exactly 16 unique worlds.')
  }

  validateNoUnsafeHangingFileStoryDecisionPointLanguage(
    source,
    'Hanging File Story Decision Point Card Pack source',
    errors,
  )
  validateNoRiskyLanguage(source, 'Hanging File Story Decision Point Card Pack source', errors)
  return errors
}

export function validateHangingFileStoryDecisionPointCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three decision-point-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify(source.sourceFiles) !== JSON.stringify(hangingFileStoryDecisionPointSourceFiles),
    'sourceFiles must list the exact Batch 58 decision-point-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
      const expectedLaneId = sourceFile.split('/').at(-1)?.replace('.json', '')
      if (Array.isArray(lane.cards)) {
        pushIf(
          errors,
          JSON.stringify(Object.keys(lane)) !== JSON.stringify(['laneId', 'cards']),
          `${sourceFile} must use the exact Batch 58 card lane field order.`,
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
            JSON.stringify(['adultGuide', 'decisionPointRoutines', 'takeHomeDecisionSlips', 'optionalAdultPrompts']),
          `${sourceFile} must use the exact Batch 58 tools field order.`,
        )
        toolsLaneFiles.push({ sourceFile, lane })
      } else {
        errors.push(`${sourceFile} must be a Batch 58 decision-point-card lane or tools lane.`)
      }
    } catch (error) {
      errors.push(`${sourceFile} could not be read as JSON: ${error.message}`)
    }
  }

  pushIf(errors, cardLaneFiles.length !== 3, 'sourceFiles must include exactly three decision-point-card lane files.')
  pushIf(errors, toolsLaneFiles.length !== 1, 'sourceFiles must include exactly one tools lane file.')

  const laneCards = cardLaneFiles
    .flatMap(({ lane }) => lane.cards)
    .sort((left, right) => String(left?.id).localeCompare(String(right?.id)))
  if (Array.isArray(source.cards)) {
    pushIf(
      errors,
      JSON.stringify(laneCards) !== JSON.stringify(source.cards),
      'sourceFiles decision-point-card lanes must reproduce cards exactly.',
    )
  }

  const toolsLane = toolsLaneFiles[0]?.lane
  if (toolsLane) {
    for (const key of ['adultGuide', 'decisionPointRoutines', 'takeHomeDecisionSlips', 'optionalAdultPrompts']) {
      pushIf(
        errors,
        JSON.stringify(toolsLane[key]) !== JSON.stringify(source[key]),
        `sourceFiles tools lane must reproduce ${key} exactly.`,
      )
    }
  }

  return errors
}

const fileBoxStoryTurningPointSourceKeys = [
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

const fileBoxStoryTurningPointCardKeys = [
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

const fileBoxStoryTurningPointSourceFiles = [
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-a.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-b.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-cards-c.json',
  'content/product-artifacts/lanes/batch59-file-box-turning-point-tools.json',
]

const fileBoxStoryTurningPointExpectedWorldSlugs = [
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

const fileBoxStoryTurningPointExpectedWorldAges = new Map([
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

const fileBoxStoryTurningPointPriorSourceFiles = new Map([
  [54, 'content/product-artifacts/accordion-folder-story-arc-card-pack.json'],
  [55, 'content/product-artifacts/expanding-file-story-scene-chain-card-pack.json'],
  [56, 'content/product-artifacts/manila-folder-story-clue-trail-card-pack.json'],
  [57, 'content/product-artifacts/pocket-folder-story-goal-path-card-pack.json'],
  [58, 'content/product-artifacts/hanging-file-story-decision-point-card-pack.json'],
])

function readFileBoxStoryTurningPointPriorWorldSet(batchNumber) {
  const sourceFile = fileBoxStoryTurningPointPriorSourceFiles.get(batchNumber)
  const source = JSON.parse(readFileSync(resolve(import.meta.dirname, '..', sourceFile), 'utf8'))
  return new Set(source.worldSlugs)
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function titleFromWorldSlug(slug) {
  return slug
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

function removeLiteralTerm(text, term) {
  return text.replace(new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi'), '')
}

function normalizeFileBoxStoryTurningPointAllowedText(value) {
  let text = JSON.stringify(value)
    .replace(
      /\bNo scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts\./gi,
      '',
    )
    .replace(/\bdo not ask for real schedules, rooms, names, or personal facts\b/gi, '')
    .replace(/\bskip real names, real places, and personal facts\b/gi, '')
    .replace(/\binstead of real names, exact places, or personal facts\b/gi, '')
    .replace(/\buse pretend characters, broad places, and invented actions\b/gi, '')
    .replace(/\bno real school\/home identity details\b/gi, '')
    .replace(/\bwithout blame or danger\b/gi, '')
    .replace(/\badult-led\b/gi, '')
    .replace(/\badult\b/gi, '')
    .replace(/\boffline\b/gi, '')
    .replace(/\bpaper-only\b/gi, '')
    .replace(/\btake-home\b/gi, '')
    .replace(/\bfamily-friendly\b/gi, '')
    .replace(/\bfamilies\b/gi, '')
    .replace(/\bfamily\b/gi, '')
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
    .replace(/\bstart scene(s)?\b/gi, '')
    .replace(/\bturn signal(s)?\b/gi, '')
    .replace(/\bbefore path(s)?\b/gi, '')
    .replace(/\bafter path(s)?\b/gi, '')
    .replace(/\bcharacter reaction(s)?\b/gi, '')
    .replace(/\breaction(s)?\b/gi, '')
    .replace(/\bnext[- ]step(s)?\b/gi, '')
    .replace(/\bnext step(s)?\b/gi, '')
    .replace(/\bfile[- ]box label(s)?\b/gi, '')
    .replace(/\blabel(s)?\b/gi, '')
    .replace(/\bpath(s)?\b/gi, '')
    .replace(/\bscene(s)?\b/gi, '')
    .replace(/\bsignal(s)?\b/gi, '')
    .replace(/\bcard(s)?\b/gi, '')
    .replace(/\bpage(s)?\b/gi, '')
    .replace(/\bpaper\b/gi, '')
    .replace(/\bblank(s)?\b/gi, '')
    .replace(/\bnote(s)?\b/gi, '')

  for (const slug of fileBoxStoryTurningPointExpectedWorldSlugs) {
    text = removeLiteralTerm(text, slug)
    text = removeLiteralTerm(text, titleFromWorldSlug(slug))
  }

  return text
}

function validateNoUnsafeFileBoxStoryTurningPointLanguage(value, label, errors) {
  const allowedText = normalizeFileBoxStoryTurningPointAllowedText(value)
  pushIf(
    errors,
    /\baccounts?\b|\bschool accounts?\b|\blogins?\b|\blog in\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic\b|\bpublish(es|ed|ing|able)?\b|\bpublication(s)?\b|\breviews?\b|\bratings?\b|\bcomments?\b|\bforums?\b|\bsocial\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\brecording(s)?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideo(s)?\b|\bphone(s)?\b|\btablet(s)?\b|\blaptop(s)?\b|\bcomputer(s)?\b|\bscreen(s)?\b|\bdevice(s)?\b|\bphotos?\b|\bcameras?\b|\bstudent names?\b|\bteacher names?\b|\breal teacher\b|\bwrite (the )?real name(s)?\b|\breal identity\b|\bidentity details?\b|\bschool names?\b|\bclassroom(s)?\b|\baddress(es)?\b|\bstreets?\b|\bprivate locations?\b|\bexact locations?\b|\blocation details?\b|\bschool route(s)?\b|\breal route(s)?\b|\broute details?\b|\bgps\b|\bcoordinates?\b|\bexact schedules?\b|\bschedules?\b|\bprivate child data\b|\breal child data\b|\bpersonal facts?\b|\bpersonal details?\b|\bpersonal disclosure(s)?\b|\bprivate child profile(s)?\b|\bprivate profiles?\b|\bchild profiles?\b|\bstudent profiles?\b|\bprofiles?\b|\bdiar(y|ies)\b|\bjournal(s)?\b|\bgrade(s|d|book|s)?\b|\bgrading\b|\brubric(s)?\b|\bscore(s|d|book|s)?\b|\bscoring\b|\bassessment(s)?\b|\bperfect\b|\bshowcase(s|d|ing)?\b|\bportfolio(s)?\b|\bdisplay(s|ed|ing)?\b|\bspell(ing|s|ed)?\b|\btimer(s)?\b|\btimed\b|\bcontest(s)?\b|\bprizes?\b|\bpayments?\b|\bcheckout(s)?\b|\bprovider(s)?\b|\bstripe\b|\bchapter book(s)?\b|\bepisode(s)?\b|\bscreenplay(s)?\b|\bcliffhanger(s)?\b|\bplot twist(s)?\b|\bchoose your own adventure\b|\bfood(s)?\b|\btaste(s|d|ing)?\b|\ballerg(y|ies|ic|ens?)\b|\bmedical\b|\bprofessional advice\b|\bpolitic(s|al)?\b|\belection(s)?\b|\bvote(s|d|r|rs|ing)?\b|\bcampaign(s|ing)?\b|\breligion\b|\breligious\b|\bprayer(s)?\b|\bbet(s|ting)?\b|\bgambling\b|\bcasino(s)?\b|\bpokemon\b|\bpokémon\b|\bbranded character(s)?\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(
      allowedText,
    ),
    `${label} includes account, upload, public, address, addresses, food, foods, publishing, publishable, showcase, portfolio, display, perfect, rubric, assessment, spelling, episode, chapter book, screenplay, cliffhanger, plot twist, choose your own adventure, recording, voice memo, timer, score, private child profile, election, prayer, bet, Pokemon, school name, home address, teacher name, camera, photo, audio, video, allergy, medical, diary, student profile, personal disclosure, provider, payment, checkout, Stripe, real-identity, route, GPS, schedule, location, profile, politics, religion, gambling, branded character, scary, harm, bullying, fighting, or weapon language.`,
  )
}

function validateFileBoxStoryTurningPointCard(
  card,
  index,
  sourceWorldSlugs,
  knownWorldSlugs,
  knownWorldRecords,
  cardIds,
  errors,
) {
  const label = `cards[${index}]`
  pushIf(errors, !isObject(card), `${label} must be an object.`)
  if (!isObject(card)) return

  pushIf(
    errors,
    JSON.stringify(Object.keys(card)) !== JSON.stringify(fileBoxStoryTurningPointCardKeys),
    `${label} must use the exact file box turning-point card field order.`,
  )

  for (const key of fileBoxStoryTurningPointCardKeys) validateString(card[key], `${label}.${key}`, errors)

  const expectedWorldSlug = fileBoxStoryTurningPointExpectedWorldSlugs[index]
  const expectedId = `file-box-turning-point-card-${String(index + 1).padStart(2, '0')}`
  const expectedAgeBand = fileBoxStoryTurningPointExpectedWorldAges.get(expectedWorldSlug)
  pushIf(errors, card.id !== expectedId, `${label}.id must be ${expectedId}.`)
  pushIf(errors, card.worldSlug !== expectedWorldSlug, `${label}.worldSlug must be ${expectedWorldSlug}.`)
  pushIf(errors, card.ageBand !== expectedAgeBand, `${label}.ageBand must be ${expectedAgeBand}.`)
  pushIf(errors, cardIds.has(card.id), `${label}.id is duplicated.`)
  cardIds.add(card.id)

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
  validateNoUnsafeFileBoxStoryTurningPointLanguage(card, label, errors)
}

function validateFileBoxStoryTurningPointRoutine(routine, index, errors) {
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
  validateNoUnsafeFileBoxStoryTurningPointLanguage(routine, label, errors)
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
    JSON.stringify(Object.keys(source)) !== JSON.stringify(fileBoxStoryTurningPointSourceKeys),
    'source must use the exact Batch 59 file box turning-point source field order.',
  )

  for (const key of ['batchId', 'generatedAt', 'productSlug', 'title', 'pricePoint', 'audience', 'sessionLength', 'safetyNote']) {
    validateString(source[key], key, errors)
  }
  pushIf(errors, source.batchId !== '2026-06-04-batch59', 'batchId must be 2026-06-04-batch59.')
  pushIf(errors, source.generatedAt !== '2026-06-04', 'generatedAt must be 2026-06-04.')
  pushIf(
    errors,
    source.productSlug !== fileBoxStoryTurningPointCardPackProductSlug,
    `productSlug must be ${fileBoxStoryTurningPointCardPackProductSlug}.`,
  )
  pushIf(
    errors,
    source.title !== 'File Box Story Turning Point Card Pack',
    'title must be File Box Story Turning Point Card Pack.',
  )
  pushIf(errors, source.pricePoint !== '$91', 'pricePoint must be $91.')
  pushIf(
    errors,
    !source.safetyNote?.includes(fileBoxStoryTurningPointRequiredSafety),
    'safetyNote must include required Batch 59 safety sentence.',
  )

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
      JSON.stringify(source.sourceFiles) !== JSON.stringify(fileBoxStoryTurningPointSourceFiles),
      'sourceFiles must list the exact Batch 59 turning-point-card lane and tools files.',
    )
  }

  pushIf(errors, !Array.isArray(source.worldSlugs), 'worldSlugs must be an array.')
  const sourceWorldSlugs = new Set()
  if (Array.isArray(source.worldSlugs)) {
    pushIf(
      errors,
      JSON.stringify(source.worldSlugs) !== JSON.stringify(fileBoxStoryTurningPointExpectedWorldSlugs),
      'worldSlugs must use the exact Batch 59 file box turning-point world order.',
    )
    pushIf(errors, source.worldSlugs.length !== 16, 'worldSlugs must have exactly 16 entries.')
    for (const slug of source.worldSlugs) {
      pushIf(errors, sourceWorldSlugs.has(slug), `worldSlugs includes duplicate slug ${slug}.`)
      sourceWorldSlugs.add(slug)
      pushIf(errors, !worldSlugs.has(slug), `worldSlugs references unknown world slug ${slug}.`)
    }
    for (const batchNumber of [54, 55, 56, 57, 58]) {
      const expectedOverlap = batchNumber === 54 ? 8 : 7
      const overlapSet = readFileBoxStoryTurningPointPriorWorldSet(batchNumber)
      const overlap = source.worldSlugs.filter((slug) => overlapSet.has(slug))
      pushIf(
        errors,
        overlap.length !== expectedOverlap,
        `worldSlugs must overlap exactly ${expectedOverlap} Batch ${batchNumber} worlds; overlapping slugs: ${overlap.join(', ')}.`,
      )
    }
  }

  validateArtifactPaths(
    source,
    requiredFileBoxStoryTurningPointCardPackArtifactPaths,
    'File Box Story Turning Point Card Pack',
    errors,
  )

  pushIf(errors, !isObject(source.cover), 'cover must be an object.')
  if (isObject(source.cover)) {
    for (const key of ['kicker', 'headline', 'subhead']) validateString(source.cover[key], `cover.${key}`, errors)
    validateExactStringArray(source.cover.included, 11, 'cover.included', errors)
    validateNoUnsafeFileBoxStoryTurningPointLanguage(source.cover, 'cover', errors)
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
    validateNoUnsafeFileBoxStoryTurningPointLanguage(source.adultGuide, 'adultGuide', errors)
  }

  pushIf(errors, !Array.isArray(source.turningPointRoutines), 'turningPointRoutines must be an array.')
  if (Array.isArray(source.turningPointRoutines)) {
    pushIf(errors, source.turningPointRoutines.length !== 6, 'turningPointRoutines must have exactly 6 entries.')
    source.turningPointRoutines.forEach((routine, index) =>
      validateFileBoxStoryTurningPointRoutine(routine, index, errors),
    )
  }

  validateExactStringArray(source.takeHomeTurningSlips, 10, 'takeHomeTurningSlips', errors)
  if (Array.isArray(source.takeHomeTurningSlips)) {
    source.takeHomeTurningSlips.forEach((slip, index) => {
      pushIf(errors, isNonEmptyString(slip) && !hasWritableBlank(slip), `takeHomeTurningSlips[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(slip) && hasSnakeCasePlaceholder(slip), `takeHomeTurningSlips[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeFileBoxStoryTurningPointLanguage(slip, `takeHomeTurningSlips[${index}]`, errors)
    })
  }

  validateExactStringArray(source.optionalAdultPrompts, 8, 'optionalAdultPrompts', errors)
  if (Array.isArray(source.optionalAdultPrompts)) {
    source.optionalAdultPrompts.forEach((prompt, index) => {
      pushIf(errors, isNonEmptyString(prompt) && !hasWritableBlank(prompt), `optionalAdultPrompts[${index}] must include a writable blank.`)
      pushIf(errors, isNonEmptyString(prompt) && hasSnakeCasePlaceholder(prompt), `optionalAdultPrompts[${index}] must use human-readable text, not snake_case placeholders.`)
      validateNoUnsafeFileBoxStoryTurningPointLanguage(prompt, `optionalAdultPrompts[${index}]`, errors)
    })
  }

  pushIf(errors, !Array.isArray(source.cards), 'cards must be an array.')
  if (Array.isArray(source.cards)) {
    pushIf(errors, source.cards.length !== 16, 'cards must have exactly 16 entries.')
    const cardIds = new Set()
    const coveredWorlds = new Set()
    source.cards.forEach((card, index) => {
      validateFileBoxStoryTurningPointCard(card, index, sourceWorldSlugs, worldSlugs, knownWorldRecords, cardIds, errors)
      if (isNonEmptyString(card?.worldSlug)) coveredWorlds.add(card.worldSlug)
    })
    pushIf(errors, coveredWorlds.size !== 16, 'cards must cover exactly 16 unique worlds.')
  }

  validateNoUnsafeFileBoxStoryTurningPointLanguage(
    source,
    'File Box Story Turning Point Card Pack source',
    errors,
  )
  validateNoRiskyLanguage(source, 'File Box Story Turning Point Card Pack source', errors)
  return errors
}

export function validateFileBoxStoryTurningPointCardPackSourceFiles(source, rootDir = resolve(import.meta.dirname, '..')) {
  const errors = []
  pushIf(errors, !Array.isArray(source?.sourceFiles), 'sourceFiles must be an array.')
  if (!Array.isArray(source?.sourceFiles)) return errors
  pushIf(errors, source.sourceFiles.length !== 4, 'sourceFiles must list the three turning-point-card lanes and one tools lane.')

  pushIf(
    errors,
    JSON.stringify(source.sourceFiles) !== JSON.stringify(fileBoxStoryTurningPointSourceFiles),
    'sourceFiles must list the exact Batch 59 turning-point-card lane and tools files.',
  )

  const cardLaneFiles = []
  const toolsLaneFiles = []
  for (const sourceFile of source.sourceFiles) {
    validateString(sourceFile, 'sourceFiles[]', errors)
    if (!isNonEmptyString(sourceFile)) continue
    try {
      const lane = JSON.parse(readFileSync(resolve(rootDir, sourceFile), 'utf8'))
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

export function countPdfPages(buffer) {
  const text = buffer.toString('latin1')
  return (text.match(/\/Type\s*\/Page\b/g) ?? []).length
}

function readZipCentralDirectoryEntryNames(buffer) {
  const endOfCentralDirectorySignature = 0x06054b50
  const centralDirectorySignature = 0x02014b50
  const minimumEndOfCentralDirectorySize = 22
  const maximumCommentSize = 0xffff
  const searchStart = Math.max(0, buffer.length - minimumEndOfCentralDirectorySize - maximumCommentSize)
  let endOffset = -1
  for (let offset = buffer.length - minimumEndOfCentralDirectorySize; offset >= searchStart; offset -= 1) {
    if (buffer.readUInt32LE(offset) === endOfCentralDirectorySignature) {
      endOffset = offset
      break
    }
  }
  if (endOffset < 0) {
    throw new Error('missing end of central directory')
  }

  const entryCount = buffer.readUInt16LE(endOffset + 10)
  const centralDirectoryOffset = buffer.readUInt32LE(endOffset + 16)
  let offset = centralDirectoryOffset
  const names = []
  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > buffer.length || buffer.readUInt32LE(offset) !== centralDirectorySignature) {
      throw new Error('invalid central directory entry')
    }
    const nameLength = buffer.readUInt16LE(offset + 28)
    const extraLength = buffer.readUInt16LE(offset + 30)
    const commentLength = buffer.readUInt16LE(offset + 32)
    const nameStart = offset + 46
    const nameEnd = nameStart + nameLength
    if (nameEnd > buffer.length) {
      throw new Error('truncated central directory entry name')
    }
    names.push(buffer.toString('utf8', nameStart, nameEnd))
    offset = nameEnd + extraLength + commentLength
  }
  return names
}

function validateZipEntryNames(buffer, relativePath, expectedEntries, errors, fileRecord) {
  let entryNames = []
  try {
    entryNames = readZipCentralDirectoryEntryNames(buffer)
  } catch (error) {
    errors.push(`${relativePath} does not have a readable ZIP central directory: ${error.message}.`)
    return
  }
  fileRecord.entries = entryNames
  const actual = [...entryNames].sort()
  const expected = [...expectedEntries].sort()
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    errors.push(`${relativePath} ZIP entries must be exactly ${expected.join(', ')}.`)
  }
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
  const manifestRecordRoot = resolve(root, dirname(expectedPaths.manifestPath))

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
    const repoRelativePath = resolve(root, relativePath)
    const absolutePath = existsSync(repoRelativePath) ? repoRelativePath : resolve(manifestRecordRoot, relativePath)
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

function inspectAbsoluteArtifactFiles(artifact, label = 'Product artifact') {
  const errors = []
  const records = {}
  for (const [key, description] of [
    ['pdfPath', 'PDF'],
    ['zipPath', 'ZIP'],
    ['sourceHtmlPath', 'source HTML'],
    ['manifestPath', 'manifest'],
  ]) {
    const filePath = artifact?.[key]
    if (!isNonEmptyString(filePath)) {
      errors.push(`${label} missing ${key}.`)
      continue
    }
    if (!existsSync(filePath)) {
      errors.push(`${label} missing ${description} artifact: ${filePath}`)
      continue
    }
    const buffer = readFileSync(filePath)
    records[key] = { filePath, buffer }
    if (key === 'pdfPath' && buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
      errors.push(`${filePath} is not a PDF artifact.`)
    }
    if (key === 'zipPath' && buffer.subarray(0, 2).toString('ascii') !== 'PK') {
      errors.push(`${filePath} is not a ZIP artifact.`)
    }
    if (key === 'sourceHtmlPath' && !buffer.toString('utf8', 0, Math.min(buffer.length, 120)).toLowerCase().includes('<!doctype html')) {
      errors.push(`${filePath} is not a source HTML artifact.`)
    }
  }

  const manifestBuffer = records.manifestPath?.buffer
  if (!manifestBuffer) return errors
  let manifest
  try {
    manifest = JSON.parse(manifestBuffer.toString('utf8'))
  } catch {
    errors.push(`${artifact.manifestPath} is not valid JSON.`)
    return errors
  }
  const manifestRoot = dirname(artifact.manifestPath)
  const fileRecords = manifestFileRecords(manifest.files)
  for (const { label: recordLabel, record } of fileRecords) {
    const filePath = resolve(manifestRoot, record.path)
    if (!existsSync(filePath)) {
      errors.push(`manifest ${recordLabel} path does not exist: ${record.path}.`)
      continue
    }
    const buffer = readFileSync(filePath)
    if (!Number.isInteger(record.size)) {
      errors.push(`manifest ${recordLabel} size must be an integer.`)
    } else if (record.size !== buffer.length) {
      errors.push(`manifest ${recordLabel} size does not match ${record.path}.`)
    }
    if (!/^[a-f0-9]{64}$/.test(record.sha256 ?? '')) {
      errors.push(`manifest ${recordLabel} sha256 must be a 64-character lowercase hex digest.`)
    } else if (record.sha256 !== sha256(buffer)) {
      errors.push(`manifest ${recordLabel} sha256 does not match ${record.path}.`)
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
    if (key === 'zipPath' && Array.isArray(options.expectedZipEntries)) {
      validateZipEntryNames(buffer, relativePath, options.expectedZipEntries, errors, files[label])
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
  if (isObject(root) && typeof artifact === 'string') {
    return inspectAbsoluteArtifactFiles(root, artifact)
  }
  const expectedPaths =
    artifact?.pdfPath === requiredDeskLampStoryProblemCardPackArtifactPaths.pdfPath
      ? requiredDeskLampStoryProblemCardPackArtifactPaths
      : artifact?.pdfPath === requiredFileBoxStoryTurningPointCardPackArtifactPaths.pdfPath
      ? requiredFileBoxStoryTurningPointCardPackArtifactPaths
      : artifact?.pdfPath === requiredHangingFileStoryDecisionPointCardPackArtifactPaths.pdfPath
      ? requiredHangingFileStoryDecisionPointCardPackArtifactPaths
      : artifact?.pdfPath === requiredPocketFolderStoryGoalPathCardPackArtifactPaths.pdfPath
      ? requiredPocketFolderStoryGoalPathCardPackArtifactPaths
      : artifact?.pdfPath === requiredManilaFolderStoryClueTrailCardPackArtifactPaths.pdfPath
      ? requiredManilaFolderStoryClueTrailCardPackArtifactPaths
      : artifact?.pdfPath === requiredExpandingFileStorySceneChainCardPackArtifactPaths.pdfPath
      ? requiredExpandingFileStorySceneChainCardPackArtifactPaths
      : artifact?.pdfPath === requiredAccordionFolderStoryArcCardPackArtifactPaths.pdfPath
      ? requiredAccordionFolderStoryArcCardPackArtifactPaths
      : artifact?.pdfPath === requiredTabbedFolderStorySeriesCardPackArtifactPaths.pdfPath
      ? requiredTabbedFolderStorySeriesCardPackArtifactPaths
      : artifact?.pdfPath === requiredSpiralNotebookStoryFinalCopyCardPackArtifactPaths.pdfPath
      ? requiredSpiralNotebookStoryFinalCopyCardPackArtifactPaths
      : artifact?.pdfPath === requiredCompositionNotebookStoryDraftChecklistCardPackArtifactPaths.pdfPath
      ? requiredCompositionNotebookStoryDraftChecklistCardPackArtifactPaths
      : artifact?.pdfPath === requiredLinedPaperStoryParagraphRevisionCardPackArtifactPaths.pdfPath
      ? requiredLinedPaperStoryParagraphRevisionCardPackArtifactPaths
      : artifact?.pdfPath === requiredClipboardStoryParagraphFocusCardPackArtifactPaths.pdfPath
      ? requiredClipboardStoryParagraphFocusCardPackArtifactPaths
      : artifact?.pdfPath === requiredPaperSleeveStorySentenceVarietyCardPackArtifactPaths.pdfPath
      ? requiredPaperSleeveStorySentenceVarietyCardPackArtifactPaths
      : artifact?.pdfPath === requiredWashiTapeStoryWordChoiceCardPackArtifactPaths.pdfPath
      ? requiredWashiTapeStoryWordChoiceCardPackArtifactPaths
      : artifact?.pdfPath === requiredStickyNoteStoryToneCardPackArtifactPaths.pdfPath
      ? requiredStickyNoteStoryToneCardPackArtifactPaths
      : artifact?.pdfPath === requiredIndexCardStoryShowNotTellCardPackArtifactPaths.pdfPath
      ? requiredIndexCardStoryShowNotTellCardPackArtifactPaths
      : artifact?.pdfPath === requiredFolderTabStoryDetailCardPackArtifactPaths.pdfPath
      ? requiredFolderTabStoryDetailCardPackArtifactPaths
      : artifact?.pdfPath === requiredBinderClipStoryTransitionCardPackArtifactPaths.pdfPath
      ? requiredBinderClipStoryTransitionCardPackArtifactPaths
      : artifact?.pdfPath === requiredPaperClipStorySolutionCardPackArtifactPaths.pdfPath
      ? requiredPaperClipStorySolutionCardPackArtifactPaths
      : artifact?.pdfPath === requiredPencilCupStoryOpeningCardPackArtifactPaths.pdfPath
      ? requiredPencilCupStoryOpeningCardPackArtifactPaths
      : artifact?.pdfPath === requiredBackpackStoryEndingCardPackArtifactPaths.pdfPath
      ? requiredBackpackStoryEndingCardPackArtifactPaths
      : artifact?.pdfPath === requiredPaperTrayStorySettingCardPackArtifactPaths.pdfPath
      ? requiredPaperTrayStorySettingCardPackArtifactPaths
      : artifact?.pdfPath === requiredCoatPocketStoryCharacterCardPackArtifactPaths.pdfPath
      ? requiredCoatPocketStoryCharacterCardPackArtifactPaths
      : artifact?.pdfPath === requiredKitchenWindowStoryPovCardPackArtifactPaths.pdfPath
      ? requiredKitchenWindowStoryPovCardPackArtifactPaths
      : artifact?.pdfPath === requiredBlanketFortStoryDialogueCardPackArtifactPaths.pdfPath
      ? requiredBlanketFortStoryDialogueCardPackArtifactPaths
      : artifact?.pdfPath === requiredReadingNookStoryCauseEffectCardPackArtifactPaths.pdfPath
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
