import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { containsActiveCheckoutLanguage } from './content-policy.mjs'
import {
  validateBackyardStorySeedPacketKitSource,
  validateBackyardStorySeedPacketKitSourceFiles,
  validateBookshopStoryBookmarkPackSource,
  validateBookshopStoryBookmarkPackSourceFiles,
  validateKitchenTableStoryRecipeCardDeckSource,
  validateKitchenTableStoryRecipeCardDeckSourceFiles,
  validateQuietCornerStoryMapCardPackSource,
  validateQuietCornerStoryMapCardPackSourceFiles,
  validatePorchLightStorySignalCardPackSource,
  validatePorchLightStorySignalCardPackSourceFiles,
  validatePencilCaseStorySwitchCardPackSource,
  validatePencilCaseStorySwitchCardPackSourceFiles,
  validateNotebookMarginStoryRevisionCardPackSource,
  validateNotebookMarginStoryRevisionCardPackSourceFiles,
  validateDeskDrawerStorySequenceCardPackSource,
  validateDeskDrawerStorySequenceCardPackSourceFiles,
  validateBlanketFortStoryDialogueCardPackSource,
  validateBlanketFortStoryDialogueCardPackSourceFiles,
  validateKitchenWindowStoryPovCardPackSource,
  validateKitchenWindowStoryPovCardPackSourceFiles,
  validateCoatPocketStoryCharacterCardPackSource,
  validateCoatPocketStoryCharacterCardPackSourceFiles,
  validatePaperTrayStorySettingCardPackSource,
  validatePaperTrayStorySettingCardPackSourceFiles,
  validateBackpackStoryEndingCardPackSource,
  validateBackpackStoryEndingCardPackSourceFiles,
  validatePencilCupStoryOpeningCardPackSource,
  validatePencilCupStoryOpeningCardPackSourceFiles,
  validateDeskLampStoryProblemCardPackSource,
  validateDeskLampStoryProblemCardPackSourceFiles,
  validatePaperClipStorySolutionCardPackSource,
  validatePaperClipStorySolutionCardPackSourceFiles,
  validateBinderClipStoryTransitionCardPackSource,
  validateBinderClipStoryTransitionCardPackSourceFiles,
  validateFolderTabStoryDetailCardPackSource,
  validateFolderTabStoryDetailCardPackSourceFiles,
  validateIndexCardStoryShowNotTellCardPackSource,
  validateIndexCardStoryShowNotTellCardPackSourceFiles,
  validateStickyNoteStoryToneCardPackSource,
  validateStickyNoteStoryToneCardPackSourceFiles,
  validateWashiTapeStoryWordChoiceCardPackSource,
  validateWashiTapeStoryWordChoiceCardPackSourceFiles,
  validatePaperSleeveStorySentenceVarietyCardPackSource,
  validatePaperSleeveStorySentenceVarietyCardPackSourceFiles,
  validateClipboardStoryParagraphFocusCardPackSource,
  validateClipboardStoryParagraphFocusCardPackSourceFiles,
  validateLinedPaperStoryParagraphRevisionCardPackSource,
  validateLinedPaperStoryParagraphRevisionCardPackSourceFiles,
  validateCompositionNotebookStoryDraftChecklistCardPackSource,
  validateCompositionNotebookStoryDraftChecklistCardPackSourceFiles,
  validateSpiralNotebookStoryFinalCopyCardPackSource,
  validateSpiralNotebookStoryFinalCopyCardPackSourceFiles,
  validateTabbedFolderStorySeriesCardPackSource,
  validateTabbedFolderStorySeriesCardPackSourceFiles,
  validateAccordionFolderStoryArcCardPackSource,
  validateAccordionFolderStoryArcCardPackSourceFiles,
  validateExpandingFileStorySceneChainCardPackSource,
  validateExpandingFileStorySceneChainCardPackSourceFiles,
  validateManilaFolderStoryClueTrailCardPackSource,
  validateManilaFolderStoryClueTrailCardPackSourceFiles,
  validatePocketFolderStoryGoalPathCardPackSource,
  validatePocketFolderStoryGoalPathCardPackSourceFiles,
  validateHangingFileStoryDecisionPointCardPackSource,
  validateHangingFileStoryDecisionPointCardPackSourceFiles,
  validateFileBoxStoryTurningPointCardPackSource,
  validateFileBoxStoryTurningPointCardPackSourceFiles,
  validateArchiveDrawerStoryResolutionCardPackSource,
  validateArchiveDrawerStoryResolutionCardPackSourceFiles,
  validateCardCatalogStoryRetellCardPackSource,
  validateCardCatalogStoryRetellCardPackSourceFiles,
  validateLibraryPocketStorySummaryCardPackSource,
  validateLibraryPocketStorySummaryCardPackSourceFiles,
  validateReadingNookStoryCauseEffectCardPackSource,
  validateReadingNookStoryCauseEffectCardPackSourceFiles,
  validateWindowSeatStorySceneCardPackSource,
  validateWindowSeatStorySceneCardPackSourceFiles,
  validateWritingDeskStoryPromptStripPackSource,
  validateWritingDeskStoryPromptStripPackSourceFiles,
  validateAfterSchoolStoryClubKitSource,
  inspectArtifactFiles,
  validateBirthdayPartyKitSource,
  validateClassroomLicenseSource,
  validateCheckoutReadiness,
  validateFamilyGameNightStoryCardDeckSource,
  validateGrandparentStoryVisitKitSource,
  validateGrandparentStoryVisitKitSourceFiles,
  validateManifestWorldAssets,
  validateMuseumDayStoryNotebookKitSource,
  validateNatureWalkStoryFieldNotesKitSource,
  validateNatureWalkStoryFieldNotesKitSourceFiles,
  validatePackSource,
  validateProductWorldSummaries,
  validateThankYouNoteStoryPostcardPackSource,
  validateThankYouNoteStoryPostcardPackSourceFiles,
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
const batch21ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch21-product-images.json')
const batch22ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch22-product-images.json')
const batch23ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch23-product-images.json')
const batch24ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch24-product-images.json')
const batch25ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch25-product-images.json')
const batch26ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch26-product-images.json')
const batch27ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch27-product-images.json')
const batch28ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch28-product-images.json')
const batch29ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch29-product-images.json')
const batch30ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch30-product-images.json')
const batch31ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch31-product-images.json')
const batch32ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch32-product-images.json')
const batch33ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-02-batch33-product-images.json')
const batch34ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch34-product-images.json')
const batch35ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch35-product-images.json')
const batch36ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch36-product-images.json')
const batch37ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch37-product-images.json')
const batch38ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch38-product-images.json')
const batch39ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch39-product-images.json')
const batch40ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch40-product-images.json')
const batch41ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch41-product-images.json')
const batch42ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch42-product-images.json')
const batch43ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch43-product-images.json')
const batch44ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch44-product-images.json')
const batch45ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch45-product-images.json')
const batch46ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch46-product-images.json')
const batch47ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch47-product-images.json')
const batch48ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch48-product-images.json')
const batch49ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch49-product-images.json')
const batch50WorldImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch50-world-images.json')
const batch50ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch50-product-images.json')
const batch51ProductImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch51-product-images.json')
const batch52ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch52-images.json')
const batch53ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch53-images.json')
const batch54ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch54-images.json')
const batch55ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch55-images.json')
const batch56ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch56-images.json')
const batch57ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch57-images.json')
const batch58ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-03-batch58-images.json')
const batch59ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-04-batch59-images.json')
const batch60ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-04-batch60-images.json')
const batch61ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-04-batch61-images.json')
const batch62ImagesFile = resolve(root, 'content', 'image-queue', '2026-06-04-batch62-images.json')
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
const grandparentVisitSourceFile = resolve(root, 'content', 'product-artifacts', 'grandparent-story-visit-kit.json')
const thankYouSourceFile = resolve(root, 'content', 'product-artifacts', 'thank-you-note-story-postcard-pack.json')
const natureWalkSourceFile = resolve(root, 'content', 'product-artifacts', 'nature-walk-story-field-notes-kit.json')
const backyardSeedSourceFile = resolve(root, 'content', 'product-artifacts', 'backyard-story-seed-packet-kit.json')
const kitchenRecipeSourceFile = resolve(root, 'content', 'product-artifacts', 'kitchen-table-story-recipe-card-deck.json')
const bookshopBookmarkSourceFile = resolve(root, 'content', 'product-artifacts', 'bookshop-story-bookmark-pack.json')
const writingDeskStripSourceFile = resolve(root, 'content', 'product-artifacts', 'writing-desk-story-prompt-strip-pack.json')
const windowSeatSceneSourceFile = resolve(root, 'content', 'product-artifacts', 'window-seat-story-scene-card-pack.json')
const quietCornerMapSourceFile = resolve(root, 'content', 'product-artifacts', 'quiet-corner-story-map-card-pack.json')
const porchLightSignalSourceFile = resolve(root, 'content', 'product-artifacts', 'porch-light-story-signal-card-pack.json')
const pencilCaseSwitchSourceFile = resolve(root, 'content', 'product-artifacts', 'pencil-case-story-switch-card-pack.json')
const notebookMarginRevisionSourceFile = resolve(root, 'content', 'product-artifacts', 'notebook-margin-story-revision-card-pack.json')
const deskDrawerSequenceSourceFile = resolve(root, 'content', 'product-artifacts', 'desk-drawer-story-sequence-card-pack.json')
const readingNookCauseEffectSourceFile = resolve(root, 'content', 'product-artifacts', 'reading-nook-story-cause-effect-card-pack.json')
const blanketFortDialogueSourceFile = resolve(root, 'content', 'product-artifacts', 'blanket-fort-story-dialogue-card-pack.json')
const kitchenWindowPovSourceFile = resolve(root, 'content', 'product-artifacts', 'kitchen-window-story-pov-card-pack.json')
const coatPocketCharacterSourceFile = resolve(root, 'content', 'product-artifacts', 'coat-pocket-story-character-card-pack.json')
const paperTraySettingSourceFile = resolve(root, 'content', 'product-artifacts', 'paper-tray-story-setting-card-pack.json')
const backpackEndingSourceFile = resolve(root, 'content', 'product-artifacts', 'backpack-story-ending-card-pack.json')
const pencilCupOpeningSourceFile = resolve(root, 'content', 'product-artifacts', 'pencil-cup-story-opening-card-pack.json')
const deskLampProblemSourceFile = resolve(root, 'content', 'product-artifacts', 'desk-lamp-story-problem-card-pack.json')
const paperClipSolutionSourceFile = resolve(root, 'content', 'product-artifacts', 'paper-clip-story-solution-card-pack.json')
const binderClipTransitionSourceFile = resolve(root, 'content', 'product-artifacts', 'binder-clip-story-transition-card-pack.json')
const folderTabDetailSourceFile = resolve(root, 'content', 'product-artifacts', 'folder-tab-story-detail-card-pack.json')
const indexCardShowNotTellSourceFile = resolve(root, 'content', 'product-artifacts', 'index-card-story-show-not-tell-card-pack.json')
const stickyNoteToneSourceFile = resolve(root, 'content', 'product-artifacts', 'sticky-note-story-tone-card-pack.json')
const washiTapeWordChoiceSourceFile = resolve(root, 'content', 'product-artifacts', 'washi-tape-story-word-choice-card-pack.json')
const paperSleeveSentenceVarietySourceFile = resolve(root, 'content', 'product-artifacts', 'paper-sleeve-story-sentence-variety-card-pack.json')
const clipboardParagraphFocusSourceFile = resolve(root, 'content', 'product-artifacts', 'clipboard-story-paragraph-focus-card-pack.json')
const linedPaperParagraphRevisionSourceFile = resolve(root, 'content', 'product-artifacts', 'lined-paper-story-paragraph-revision-card-pack.json')
const compositionNotebookDraftChecklistSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'composition-notebook-story-draft-checklist-card-pack.json',
)
const spiralNotebookFinalCopySourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'spiral-notebook-story-final-copy-card-pack.json',
)
const tabbedFolderStorySeriesSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'tabbed-folder-story-series-card-pack.json',
)
const accordionFolderStoryArcSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'accordion-folder-story-arc-card-pack.json',
)
const expandingFileStorySceneChainSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'expanding-file-story-scene-chain-card-pack.json',
)
const manilaFolderStoryClueTrailSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'manila-folder-story-clue-trail-card-pack.json',
)
const pocketFolderStoryGoalPathSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'pocket-folder-story-goal-path-card-pack.json',
)
const hangingFileStoryDecisionPointSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'hanging-file-story-decision-point-card-pack.json',
)
const fileBoxStoryTurningPointSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'file-box-story-turning-point-card-pack.json',
)
const archiveDrawerStoryResolutionSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'archive-drawer-story-resolution-card-pack.json',
)
const cardCatalogStoryRetellSourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'card-catalog-story-retell-card-pack.json',
)
const libraryPocketStorySummarySourceFile = resolve(
  root,
  'content',
  'product-artifacts',
  'library-pocket-story-summary-card-pack.json',
)
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
const batch21ProductImagesBatchId = '2026-06-02-batch21-product-images'
const batch22ProductImagesBatchId = '2026-06-02-batch22-product-images'
const batch23ProductImagesBatchId = '2026-06-02-batch23-product-images'
const batch24ProductImagesBatchId = '2026-06-02-batch24-product-images'
const batch25ProductImagesBatchId = '2026-06-02-batch25-product-images'
const batch26ProductImagesBatchId = '2026-06-02-batch26-product-images'
const batch27ProductImagesBatchId = '2026-06-02-batch27-product-images'
const batch28ProductImagesBatchId = '2026-06-02-batch28-product-images'
const batch29ProductImagesBatchId = '2026-06-02-batch29-product-images'
const batch30ProductImagesBatchId = '2026-06-02-batch30-product-images'
const batch31ProductImagesBatchId = '2026-06-02-batch31-product-images'
const batch32ProductImagesBatchId = '2026-06-02-batch32-product-images'
const batch33ProductImagesBatchId = '2026-06-02-batch33-product-images'
const batch34ProductImagesBatchId = '2026-06-03-batch34-product-images'
const batch35ProductImagesBatchId = '2026-06-03-batch35-product-images'
const batch36ProductImagesBatchId = '2026-06-03-batch36-product-images'
const batch37ProductImagesBatchId = '2026-06-03-batch37-product-images'
const batch38ProductImagesBatchId = '2026-06-03-batch38-product-images'
const batch39ProductImagesBatchId = '2026-06-03-batch39-product-images'
const batch40ProductImagesBatchId = '2026-06-03-batch40-product-images'
const batch41ProductImagesBatchId = '2026-06-03-batch41-product-images'
const batch42ProductImagesBatchId = '2026-06-03-batch42-product-images'
const batch43ProductImagesBatchId = '2026-06-03-batch43-product-images'
const batch44ProductImagesBatchId = '2026-06-03-batch44-product-images'
const batch45ProductImagesBatchId = '2026-06-03-batch45-product-images'
const batch46ProductImagesBatchId = '2026-06-03-batch46-product-images'
const batch47ProductImagesBatchId = '2026-06-03-batch47-product-images'
const batch48ProductImagesBatchId = '2026-06-03-batch48-product-images'
const batch49ProductImagesBatchId = '2026-06-03-batch49-product-images'
const batch50WorldImagesBatchId = '2026-06-03-batch50-world-images'
const batch50ProductImagesBatchId = '2026-06-03-batch50-product-images'
const batch51ProductImagesBatchId = '2026-06-03-batch51-product-images'
const batch52ImagesBatchId = '2026-06-03-batch52-images'
const batch53ImagesBatchId = '2026-06-03-batch53-images'
const batch54ImagesBatchId = '2026-06-03-batch54-images'
const batch55ImagesBatchId = '2026-06-03-batch55-images'
const batch56ImagesBatchId = '2026-06-03-batch56-images'
const batch57ImagesBatchId = '2026-06-03-batch57-images'
const batch58ImagesBatchId = '2026-06-03-batch58-images'
const batch59ImagesBatchId = '2026-06-04-batch59-images'
const batch60ImagesBatchId = '2026-06-04-batch60-images'
const batch61ImagesBatchId = '2026-06-04-batch61-images'
const batch62ImagesBatchId = '2026-06-04-batch62-images'
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
const grandparentVisitBatchId = '2026-06-02-batch21'
const thankYouBatchId = '2026-06-02-batch22'
const natureWalkBatchId = '2026-06-02-batch23'
const backyardSeedBatchId = '2026-06-02-batch24'
const kitchenRecipeBatchId = '2026-06-02-batch25'
const bookshopBookmarkBatchId = '2026-06-02-batch26'
const writingDeskStripBatchId = '2026-06-02-batch27'
const windowSeatSceneBatchId = '2026-06-02-batch28'
const quietCornerMapBatchId = '2026-06-02-batch29'
const porchLightSignalBatchId = '2026-06-02-batch30'
const pencilCaseSwitchBatchId = '2026-06-02-batch31'
const notebookMarginRevisionBatchId = '2026-06-02-batch32'
const deskDrawerSequenceBatchId = '2026-06-02-batch33'
const readingNookCauseEffectBatchId = '2026-06-03-batch34'
const blanketFortDialogueBatchId = '2026-06-03-batch35'
const kitchenWindowPovBatchId = '2026-06-03-batch36'
const coatPocketCharacterBatchId = '2026-06-03-batch37'
const paperTraySettingBatchId = '2026-06-03-batch38'
const backpackEndingBatchId = '2026-06-03-batch39'
const pencilCupOpeningBatchId = '2026-06-03-batch40'
const deskLampProblemBatchId = '2026-06-03-batch41'
const paperClipSolutionBatchId = '2026-06-03-batch42'
const binderClipTransitionBatchId = '2026-06-03-batch43'
const folderTabDetailBatchId = '2026-06-03-batch44'
const indexCardShowNotTellBatchId = '2026-06-03-batch45'
const stickyNoteToneBatchId = '2026-06-03-batch46'
const washiTapeWordChoiceBatchId = '2026-06-03-batch47'
const paperSleeveSentenceVarietyBatchId = '2026-06-03-batch48'
const clipboardParagraphFocusBatchId = '2026-06-03-batch49'
const linedPaperParagraphRevisionBatchId = '2026-06-03-batch50'
const compositionNotebookDraftChecklistBatchId = '2026-06-03-batch51'
const spiralNotebookFinalCopyBatchId = '2026-06-03-batch52'
const tabbedFolderStorySeriesBatchId = '2026-06-03-batch53'
const accordionFolderStoryArcBatchId = '2026-06-03-batch54'
const allowedStarterAgeBands = new Set(['6-8', '7-9', '8-10', '10-11'])
const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'
const expandingFileStorySceneChainSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, and no identifying facts.'
const manilaFolderStoryClueTrailSafety = expandingFileStorySceneChainSafety
const pocketFolderStoryGoalPathSafety = expandingFileStorySceneChainSafety
const hangingFileStoryDecisionPointSafety = expandingFileStorySceneChainSafety
const fileBoxStoryTurningPointSafety = expandingFileStorySceneChainSafety
const archiveDrawerStoryResolutionSafety = expandingFileStorySceneChainSafety
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
    .replaceAll(expandingFileStorySceneChainSafety, '')
    .replaceAll(manilaFolderStoryClueTrailSafety, '')
    .replaceAll(pocketFolderStoryGoalPathSafety, '')
    .replaceAll(hangingFileStoryDecisionPointSafety, '')
    .replaceAll(fileBoxStoryTurningPointSafety, '')
    .replaceAll(archiveDrawerStoryResolutionSafety, '')
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

function anyPathExists(paths) {
  return paths.some((path) => existsSync(path))
}

function allPathsExist(paths) {
  return paths.every((path) => existsSync(path))
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

function validateBatch50WorldImage(image, imageSlugs, worldSlugs, worldSources) {
  const label = `2026-06-03-batch50-world-images.json:${image.slug ?? 'missing-slug'}`
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
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 50 world images.`)
  imageSlugs.add(image.slug)
  expect(worldSlugs.has(image.slug), `${label}.slug does not reference a Batch 1 world.`)
  expect(image.sourceWorldFile === worldSources.get(image.slug), `${label}.sourceWorldFile does not match source world file.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch50-worlds/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch50-worlds/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch50-worlds/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)

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

function validateBatch21ProductImage(image) {
  const label = `2026-06-02-batch21-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'grandparent-story-visit-kit', `${label}.slug must be grandparent-story-visit-kit.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch21/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch21/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch21/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
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
    'no family photos',
    'screen-free printable grandparent story visit kit',
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

function validateBatch22ProductImage(image) {
  const label = `2026-06-02-batch22-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'thank-you-note-story-postcard-pack', `${label}.slug must be thank-you-note-story-postcard-pack.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch22/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch22/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch22/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
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
    'no family photos',
    'screen-free printable thank-you note story postcard pack',
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

function validateBatch23ProductImage(image) {
  const label = `2026-06-02-batch23-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'nature-walk-story-field-notes-kit', `${label}.slug must be nature-walk-story-field-notes-kit.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch23/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch23/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch23/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
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
    'no map',
    'no gps',
    'no route',
    'no address',
    'screen-free printable nature walk story field notes kit',
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

function validateBatch24ProductImage(image) {
  const label = `2026-06-02-batch24-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'backyard-story-seed-packet-kit', `${label}.slug must be backyard-story-seed-packet-kit.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch24/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch24/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch24/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'no text',
    'no letters',
    'no labels',
    'no logos',
    'no watermark',
    'no branded characters',
    'no scary harm',
    'no weapons',
    'no writing tools',
    'no pencils',
    'no pens',
    'no crayons',
    'no people',
    'no faces',
    'no animals',
    'no phone',
    'no tablet',
    'no device',
    'no map',
    'no gps',
    'no route',
    'no address',
    'screen-free printable backyard story seed packet kit',
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
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch25ProductImage(image) {
  const label = `2026-06-02-batch25-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  expect(image.slug === 'kitchen-table-story-recipe-card-deck', `${label}.slug must be kitchen-table-story-recipe-card-deck.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch25/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch25/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch25/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream index-card',
    'no text',
    'no letters',
    'no labels',
    'no logos',
    'no watermark',
    'no pencils',
    'no pens',
    'no crayons',
    'no scissors',
    'no knives',
    'no utensils',
    'no plates',
    'no bowls',
    'no cups',
    'no food',
    'no people',
    'no faces',
    'no animals',
    'no phone',
    'no tablet',
    'no device',
    'no stove',
    'no oven',
    'no microwave',
    'no map',
    'no gps',
    'no route',
    'no address',
    'screen-free printable kitchen table story recipe card deck',
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
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch26ProductImage(image) {
  const label = `2026-06-02-batch26-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(image.slug === 'bookshop-story-bookmark-pack', `${label}.slug must be bookshop-story-bookmark-pack.`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch26/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch26/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch26/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream paper bookmark strips',
    'no text',
    'no letters',
    'no labels',
    'no logos',
    'no watermark',
    'no book covers',
    'no real book titles',
    'no author names',
    'no publisher marks',
    'no public reviews',
    'no ratings',
    'no stars',
    'no pencils',
    'no pens',
    'no crayons',
    'no scissors',
    'no knives',
    'no food',
    'no people',
    'no faces',
    'no animals',
    'no phone',
    'no tablet',
    'no device',
    'no map',
    'no gps',
    'no route',
    'no address',
    'screen-free printable bookshop story bookmark pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'plant',
    'potted plant',
    'greenery',
    'jar',
    'cup',
    'mug',
    'bowl',
    'utensil',
    'brush',
    'spoon',
    'fork',
    'knife',
    'pencil',
    'pen',
    'crayon',
    'marker',
    'notebook',
    'spiral binding',
    'ruler',
    'scissors',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch27ProductImage(image) {
  const label = `2026-06-02-batch27-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'writing-desk-story-prompt-strip-pack',
    `${label}.slug must be writing-desk-story-prompt-strip-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch27/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch27/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch27/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream paper prompt strips',
    'plain white background',
    'zero other objects',
    'screen-free printable writing desk story prompt strip pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'plant',
    'potted plant',
    'greenery',
    'flower',
    'jar',
    'cup',
    'mug',
    'bowl',
    'utensil',
    'brush',
    'spoon',
    'fork',
    'knife',
    'pencil',
    'pen',
    'crayon',
    'marker',
    'notebook',
    'spiral binding',
    'ruler',
    'scissors',
    'calendar',
    'clock',
    'timer',
    'score',
    'star',
    'rating',
    'review',
    'food',
    'people',
    'face',
    'animal',
    'map',
    'gps',
    'route',
    'address',
    'tabletop props',
    'decoration',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch28ProductImage(image) {
  const label = `2026-06-02-batch28-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'window-seat-story-scene-card-pack',
    `${label}.slug must be window-seat-story-scene-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch28/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch28/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch28/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream paper scene cards',
    'plain white background',
    'zero other objects',
    'screen-free printable window seat story scene card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'plant',
    'potted plant',
    'greenery',
    'flower',
    'jar',
    'cup',
    'mug',
    'bowl',
    'utensil',
    'brush',
    'spoon',
    'fork',
    'knife',
    'pencil',
    'pen',
    'crayon',
    'marker',
    'notebook',
    'spiral binding',
    'ruler',
    'scissors',
    'calendar',
    'clock',
    'timer',
    'score',
    'star',
    'rating',
    'review',
    'people',
    'face',
    'animal',
    'map',
    'gps',
    'route',
    'address',
    'house',
    'real window',
    'camera',
    'photo',
    'tabletop props',
    'decoration',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch29ProductImage(image) {
  const label = `2026-06-02-batch29-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'quiet-corner-story-map-card-pack',
    `${label}.slug must be quiet-corner-story-map-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch29/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch29/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch29/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream paper story map cards',
    'plain white background',
    'zero other objects',
    'screen-free printable quiet corner story map card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'gps',
    'navigation app',
    'coordinates',
    'address',
    'house',
    'street sign',
    'real place',
    'realistic road atlas',
    'real-world map',
    'photo',
    'camera',
    'people',
    'face',
    'animal',
    'plant',
    'greenery',
    'flower',
    'jar',
    'cup',
    'mug',
    'bowl',
    'utensil',
    'brush',
    'spoon',
    'fork',
    'knife',
    'pencil',
    'pen',
    'crayon',
    'marker',
    'notebook',
    'spiral binding',
    'ruler',
    'scissors',
    'calendar',
    'clock',
    'timer',
    'score',
    'star',
    'rating',
    'review',
    'tabletop props',
    'decoration',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch30ProductImage(image) {
  const label = `2026-06-02-batch30-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'porch-light-story-signal-card-pack',
    `${label}.slug must be porch-light-story-signal-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch30/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch30/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch30/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream paper signal cards',
    'plain white background',
    'zero other objects',
    'screen-free printable porch light story signal card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'gps',
    'navigation app',
    'coordinates',
    'address',
    'house',
    'home',
    'street sign',
    'real place',
    'realistic road atlas',
    'real-world map',
    'outdoor scene',
    'window',
    'porch',
    'doorway',
    'building',
    'safety sign',
    'photo',
    'camera',
    'people',
    'face',
    'animal',
    'plant',
    'greenery',
    'flower',
    'jar',
    'cup',
    'mug',
    'bowl',
    'utensil',
    'brush',
    'spoon',
    'fork',
    'knife',
    'pencil',
    'pen',
    'crayon',
    'marker',
    'notebook',
    'spiral binding',
    'ruler',
    'scissors',
    'calendar',
    'clock',
    'timer',
    'score',
    'star',
    'rating',
    'review',
    'tabletop props',
    'decoration',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch31ProductImage(image) {
  const label = `2026-06-02-batch31-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'pencil-case-story-switch-card-pack',
    `${label}.slug must be pencil-case-story-switch-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch31/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch31/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch31/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream paper switch cards',
    'closed unbranded pencil case',
    'plain white background',
    'screen-free printable pencil case story switch card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'camera',
    'photo',
    'gps',
    'navigation app',
    'coordinates',
    'address',
    'house',
    'home',
    'street sign',
    'real place',
    'real-world map',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'branded character',
    'franchise',
    'copyright character',
    'people',
    'face',
    'animal',
    'food',
    'medicine',
    'weapon',
    'violence',
    'scary scene',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch32ProductImage(image) {
  const label = `2026-06-02-batch32-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'notebook-margin-story-revision-card-pack',
    `${label}.slug must be notebook-margin-story-revision-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch32/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch32/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch32/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream notebook-margin revision cards',
    'open unbranded notebook',
    'wide blank margins',
    'plain white background',
    'screen-free printable notebook margin story revision card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'camera',
    'photo',
    'gps',
    'navigation app',
    'coordinates',
    'address',
    'house',
    'home',
    'street sign',
    'real place',
    'real-world map',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'branded character',
    'franchise',
    'copyright character',
    'people',
    'face',
    'animal',
    'food',
    'snack',
    'medicine',
    'weapon',
    'violence',
    'scary scene',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch33ProductImage(image) {
  const label = `2026-06-02-batch33-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'desk-drawer-story-sequence-card-pack',
    `${label}.slug must be desk-drawer-story-sequence-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch33/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch33/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch33/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream desk drawer story sequence cards',
    'open unbranded wooden desk drawer tray',
    'first-next-then-finally guide boxes',
    'plain white background',
    'screen-free printable desk drawer story sequence card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'camera',
    'photo',
    'gps',
    'navigation app',
    'coordinates',
    'address',
    'house',
    'home',
    'street sign',
    'real place',
    'real-world map',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'branded character',
    'franchise',
    'copyright character',
    'people',
    'face',
    'animal',
    'food',
    'snack',
    'medicine',
    'weapon',
    'violence',
    'scary scene',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch34ProductImage(image) {
  const label = `2026-06-03-batch34-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'reading-nook-story-cause-effect-card-pack',
    `${label}.slug must be reading-nook-story-cause-effect-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch34/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch34/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch34/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream reading nook story cause-and-effect cards',
    'unbranded cushion corner',
    'because-so arrow guide boxes',
    'plain white background',
    'screen-free printable reading nook story cause-and-effect card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'book',
    'book cover',
    'real book title',
    'author name',
    'publisher name',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'camera',
    'photo',
    'gps',
    'navigation app',
    'coordinates',
    'address',
    'house',
    'home',
    'street sign',
    'real place',
    'real-world map',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'branded character',
    'franchise',
    'copyright character',
    'people',
    'face',
    'animal',
    'food',
    'snack',
    'medicine',
    'weapon',
    'violence',
    'scary scene',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch35ProductImage(image) {
  const label = `2026-06-03-batch35-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'blanket-fort-story-dialogue-card-pack',
    `${label}.slug must be blanket-fort-story-dialogue-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch35/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch35/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch35/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream blanket fort story dialogue cards',
    'unbranded blanket fort corner',
    'speaker line guide boxes',
    'plain white background',
    'screen-free printable blanket fort story dialogue card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'book',
    'book cover',
    'real book title',
    'author name',
    'publisher name',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch36ProductImage(image) {
  const label = `2026-06-03-batch36-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'kitchen-window-story-pov-card-pack',
    `${label}.slug must be kitchen-window-story-pov-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch36/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch36/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch36/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream kitchen window story point-of-view cards',
    'unbranded cozy writing table',
    'viewpoint guide boxes',
    'plain white background',
    'screen-free printable kitchen window story point-of-view card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'book',
    'book cover',
    'real book title',
    'author name',
    'publisher name',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'address',
    'house',
    'home',
    'street',
    'gps',
    'child face',
    'child portrait',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch37ProductImage(image) {
  const label = `2026-06-03-batch37-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'coat-pocket-story-character-card-pack',
    `${label}.slug must be coat-pocket-story-character-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch37/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch37/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch37/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream coat pocket story character cards',
    'unbranded cozy writing table',
    'character guide boxes',
    'plain white background',
    'screen-free printable coat pocket story character card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'book',
    'book cover',
    'real book title',
    'author name',
    'publisher name',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'address',
    'house',
    'home',
    'street',
    'gps',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
    'clothing',
    'coat',
    'jacket',
    'real pocket',
    'actual pocket',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch38ProductImage(image) {
  const label = `2026-06-03-batch38-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'paper-tray-story-setting-card-pack',
    `${label}.slug must be paper-tray-story-setting-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch38/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch38/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch38/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank cream paper tray story setting cards',
    'unbranded cozy writing table',
    'setting guide boxes',
    'plain white background',
    'screen-free printable paper tray story setting card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
    'plant',
    'cup',
    'container',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch39ProductImage(image) {
  const label = `2026-06-03-batch39-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'backpack-story-ending-card-pack',
    `${label}.slug must be backpack-story-ending-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch39/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch39/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch39/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'six loose blank cream printable story ending cards',
    'unbranded cozy writing table',
    'empty rectangular writing areas',
    'plain white background',
    'screen-free backpack story ending card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
    'backpack bag',
    'real backpack',
    'personal bag',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch40ProductImage(image) {
  const label = `2026-06-03-batch40-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'pencil-cup-story-opening-card-pack',
    `${label}.slug must be pencil-cup-story-opening-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch40/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch40/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch40/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'six loose blank cream printable story opening cards',
    'unbranded cozy writing table',
    'empty rectangular writing areas',
    'plain white background',
    'screen-free pencil cup story opening card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch41ProductImage(image) {
  const label = `2026-06-03-batch41-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'desk-lamp-story-problem-card-pack',
    `${label}.slug must be desk-lamp-story-problem-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch41/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch41/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch41/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'six loose blank cream printable story problem cards',
    'simple unbranded desk lamp',
    'empty rectangular writing areas',
    'plain white background',
    'screen-free desk lamp story problem card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch42ProductImage(image) {
  const label = `2026-06-03-batch42-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'paper-clip-story-solution-card-pack',
    `${label}.slug must be paper-clip-story-solution-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch42/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch42/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch42/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'six loose blank cream printable story solution cards',
    'simple unbranded silver paper clips',
    'empty rectangular writing areas',
    'plain white background',
    'screen-free paper clip story solution card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch43ProductImage(image) {
  const label = `2026-06-03-batch43-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'binder-clip-story-transition-card-pack',
    `${label}.slug must be binder-clip-story-transition-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch43/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch43/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch43/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'six loose blank cream printable story transition cards',
    'simple unbranded black binder clips',
    'empty rectangular writing areas',
    'plain white background',
    'screen-free binder clip story transition card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch44ProductImage(image) {
  const label = `2026-06-03-batch44-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'folder-tab-story-detail-card-pack',
    `${label}.slug must be folder-tab-story-detail-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch44/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch44/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch44/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'six blank cream printable story detail cards',
    'colorful unbranded folder tabs',
    'empty rectangular writing areas',
    'plain white background',
    'screen-free folder tab story detail card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch45ProductImage(image) {
  const label = `2026-06-03-batch45-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'index-card-story-show-not-tell-card-pack',
    `${label}.slug must be index-card-story-show-not-tell-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch45/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch45/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch45/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'six blank cream printable index cards',
    'empty rectangular writing areas',
    'unbranded pencils',
    'plain white background',
    'screen-free index card story show-not-tell card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'app interface',
    'microphone',
    'audio recorder',
    'camera',
    'photo',
    'recording',
    'transcription',
    'school login',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'review',
    'score',
    'grade',
    'timer',
    'clock',
    'calendar',
    'contest',
    'prize',
    'child face',
    'child portrait',
    'person',
    'hands',
    'body',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch46ProductImage(image) {
  const label = `2026-06-03-batch46-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'sticky-note-story-tone-card-pack',
    `${label}.slug must be sticky-note-story-tone-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch46/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch46/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch46/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'twelve blank pastel sticky notes',
    'empty writing areas',
    'unbranded pencils',
    'plain white background',
    'screen-free sticky note story tone card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch47ProductImage(image) {
  const label = `2026-06-03-batch47-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'washi-tape-story-word-choice-card-pack',
    `${label}.slug must be washi-tape-story-word-choice-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch47/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch47/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch47/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank washi tape strips',
    'empty writing areas',
    'unbranded pencils',
    'plain white background',
    'screen-free washi tape story word choice card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch48ProductImage(image) {
  const label = `2026-06-03-batch48-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'paper-sleeve-story-sentence-variety-card-pack',
    `${label}.slug must be paper-sleeve-story-sentence-variety-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch48/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch48/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch48/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank paper sleeves',
    'blank sentence cards',
    'empty writing areas',
    'unbranded pencils',
    'plain white background',
    'paper sleeve story sentence variety card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch49ProductImage(image) {
  const label = `2026-06-03-batch49-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'clipboard-story-paragraph-focus-card-pack',
    `${label}.slug must be clipboard-story-paragraph-focus-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch49/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch49/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch49/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank clipboard',
    'blank paragraph cards',
    'empty writing areas',
    'unbranded pencils',
    'plain white background',
    'clipboard story paragraph focus card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch50ProductImage(image) {
  const label = `2026-06-03-batch50-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'lined-paper-story-paragraph-revision-card-pack',
    `${label}.slug must be lined-paper-story-paragraph-revision-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch50/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch50/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch50/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank lined paper',
    'blank paragraph revision cards',
    'empty writing areas',
    'unbranded pencils',
    'plain white background',
    'lined paper story paragraph revision card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch51ProductImage(image) {
  const label = `2026-06-03-batch51-product-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(
    image.slug === 'composition-notebook-story-draft-checklist-card-pack',
    `${label}.slug must be composition-notebook-story-draft-checklist-card-pack.`,
  )
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.outputJpeg === `public/images/plotsprout/batch51/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch51/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch51/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'flat lay',
    'blank composition notebook',
    'blank draft checklist cards',
    'empty writing areas',
    'unbranded pencils',
    'plain white background',
    'composition notebook story draft checklist card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar.negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar.steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar.outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar.outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch52Image(image, imageSlugs, worldSlugs, worldSources) {
  const label = `2026-06-03-batch52-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(image.slug), `${label}.slug must be lowercase kebab-case.`)
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 52 images.`)
  imageSlugs.add(image.slug)

  if (image.slug === 'blue-pencil-observatory') {
    for (const key of ['ageBand', 'seoLane', 'sourceWorldFile']) validateString(image[key], `${label}.${key}`)
    expect(worldSlugs.has(image.slug), `${label}.slug does not reference a Batch 1 world.`)
    expect(image.sourceWorldFile === worldSources.get(image.slug), `${label}.sourceWorldFile does not match source world file.`)
    expect(image.outputJpeg === `public/images/plotsprout/batch52-worlds/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
    expect(image.outputWebp === `public/images/plotsprout/batch52-worlds/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
    expect(image.sidecar === `content/image-runs/batch52-worlds/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
    for (const phrase of [
      'family-friendly',
      'blue pencil observatory',
      'blank notebook pages',
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
  } else {
    expect(
      image.slug === 'spiral-notebook-story-final-copy-card-pack',
      `${label}.slug must be blue-pencil-observatory or spiral-notebook-story-final-copy-card-pack.`,
    )
    expect(image.outputJpeg === `public/images/plotsprout/batch52/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
    expect(image.outputWebp === `public/images/plotsprout/batch52/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
    expect(image.sidecar === `content/image-runs/batch52/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
    for (const phrase of [
      'family-friendly',
      'orthographic top-down view',
      'blank spiral notebook',
      'blank final-copy cards',
      'empty writing areas',
      'unbranded pencils',
      'plain white background',
      'spiral notebook story final copy card pack',
    ]) {
      expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
    }
  }

  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch53Image(image, imageSlugs, worldSlugs, worldSources) {
  const label = `2026-06-03-batch53-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(image.slug), `${label}.slug must be lowercase kebab-case.`)
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 53 images.`)
  imageSlugs.add(image.slug)

  if (image.slug === 'appendix-archive-lab') {
    for (const key of ['ageBand', 'seoLane', 'sourceWorldFile']) validateString(image[key], `${label}.${key}`)
    expect(worldSlugs.has(image.slug), `${label}.slug does not reference a Batch 1 world.`)
    expect(image.sourceWorldFile === worldSources.get(image.slug), `${label}.sourceWorldFile does not match source world file.`)
    expect(image.outputJpeg === `public/images/plotsprout/batch53-worlds/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
    expect(image.outputWebp === `public/images/plotsprout/batch53-worlds/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
    expect(image.sidecar === `content/image-runs/batch53-worlds/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
    for (const phrase of [
      'family-friendly',
      'appendix archive lab',
      'blank folder pages',
      'tabbed folder stack',
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
  } else {
    expect(
      image.slug === 'tabbed-folder-story-series-card-pack',
      `${label}.slug must be appendix-archive-lab or tabbed-folder-story-series-card-pack.`,
    )
    expect(image.outputJpeg === `public/images/plotsprout/batch53/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
    expect(image.outputWebp === `public/images/plotsprout/batch53/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
    expect(image.sidecar === `content/image-runs/batch53/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
    for (const phrase of [
      'family-friendly',
      'orthographic top-down view',
      'blank tabbed folder',
      'blank story-series cards',
      'empty writing areas',
      'unbranded pencils',
      'plain white background',
      'tabbed folder story series card pack',
    ]) {
      expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
    }
  }

  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch54Image(image, imageSlugs) {
  const label = `2026-06-03-batch54-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.slug === 'accordion-folder-story-arc-card-pack', `${label}.slug must be accordion-folder-story-arc-card-pack.`)
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 54 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch54/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch54/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch54/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  for (const phrase of [
    'family-friendly',
    'orthographic top-down view',
    'blank accordion folder',
    'blank story-arc cards',
    'empty writing areas',
    'unbranded pencils',
    'plain white background',
    'accordion folder story arc card pack',
  ]) {
    expect(image.prompt.toLowerCase().includes(phrase), `${label}.prompt missing "${phrase}".`)
  }
  for (const phrase of [
    'text',
    'readable writing',
    'letters',
    'labels',
    'logo',
    'watermark',
    'classroom',
    'school',
    'student',
    'teacher',
    'home',
    'house',
    'room',
    'office',
    'address',
    'street',
    'route',
    'gps',
    'coordinates',
    'location',
    'schedule',
    'phone',
    'tablet',
    'laptop',
    'computer',
    'screen',
    'device',
    'microphone',
    'audio recorder',
    'voice memo',
    'camera',
    'photo',
    'recording',
    'transcription',
    'account login',
    'portal',
    'qr code',
    'upload icon',
    'public post',
    'public review',
    'rating',
    'score',
    'grade',
    'timer',
    'contest',
    'prize',
    'food',
    'tasting',
    'allergy',
    'medical',
    'scary',
    'weapon',
    'fight',
    'bullying',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch55Image(image, imageSlugs) {
  const label = `2026-06-03-batch55-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(
    image.slug === 'expanding-file-story-scene-chain-card-pack',
    `${label}.slug must be expanding-file-story-scene-chain-card-pack.`,
  )
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 55 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch55/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch55/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch55/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  expect(
    image.prompt ===
      'family-friendly studio product mockup of an open expanding file folder story scene chain card pack, orthographic top-down catalog view, accordion-style paper folder with multiple blank divider pockets fanned open, loose blank scene-chain cards tucked into separate pockets, visible pocket depth, empty writing areas, two unbranded graphite pencils, quiet printable writing kit, seamless plain white background, clean shadow, only paper folder pockets loose cards and pencils, no text',
    `${label}.prompt must match the approved Batch55 hero prompt.`,
  )
  for (const phrase of [
    'text',
    'labels',
    'logo',
    'spiral binding',
    'notebook',
    'school',
    'home',
    'address',
    'route',
    'gps',
    'schedule',
    'screens',
    'devices',
    'public',
    'upload',
    'rating',
    'score',
    'grade',
    'timer',
    'food',
    'allergy',
    'medical',
    'scary',
    'weapons',
    'bullying',
    'plants',
    'cups',
    'bowls',
    'desk decor',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  const generatedFileExists = [jpegPath, webpPath, sidecarPath].some((filePath) => existsSync(filePath))
  if (!generatedFileExists) return

  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch56Image(image, imageSlugs) {
  const label = `2026-06-03-batch56-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(
    image.slug === 'manila-folder-story-clue-trail-card-pack',
    `${label}.slug must be manila-folder-story-clue-trail-card-pack.`,
  )
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 56 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch56/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch56/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch56/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  expect(
    image.prompt ===
      'family-friendly top-down close-cropped catalog product photo on seamless white background, blank tan manila folder, blank off-white clue card stack, blank paper slip edges, quiet printable paper kit mockup, no writing',
    `${label}.prompt must match the approved Batch56 hero prompt.`,
  )
  for (const phrase of [
    'text',
    'labels',
    'logo',
    'spiral binding',
    'notebook',
    'school',
    'home',
    'address',
    'route',
    'gps',
    'schedule',
    'screens',
    'devices',
    'public',
    'upload',
    'rating',
    'score',
    'grade',
    'timer',
    'food',
    'allergy',
    'medical',
    'scary',
    'weapons',
    'bullying',
    'plants',
    'cups',
    'bowls',
    'desk decor',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  const generatedFileExists = [jpegPath, webpPath, sidecarPath].some((filePath) => existsSync(filePath))
  if (!generatedFileExists) return

  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch57Image(image, imageSlugs) {
  const label = `2026-06-03-batch57-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(
    image.slug === 'pocket-folder-story-goal-path-card-pack',
    `${label}.slug must be pocket-folder-story-goal-path-card-pack.`,
  )
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 57 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch57/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch57/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch57/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  expect(
    image.prompt ===
      'family-friendly top-down close-cropped catalog product photo on seamless white background, blank two-pocket paper folder, blank off-white goal path card stack, blank pocket label slips, quiet printable paper kit mockup, no writing',
    `${label}.prompt must match the approved Batch57 hero prompt.`,
  )
  for (const phrase of [
    'text',
    'labels',
    'logo',
    'spiral binding',
    'notebook',
    'school',
    'home',
    'address',
    'route',
    'gps',
    'schedule',
    'screens',
    'devices',
    'public',
    'upload',
    'recording',
    'camera',
    'photo',
    'audio',
    'video',
    'voice memo',
    'rating',
    'score',
    'grade',
    'timer',
    'food',
    'allergy',
    'medical',
    'scary',
    'weapons',
    'bullying',
    'plants',
    'cups',
    'bowls',
    'desk decor',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  const generatedFileExists = [jpegPath, webpPath, sidecarPath].some((filePath) => existsSync(filePath))
  if (!generatedFileExists) return

  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch58Image(image, imageSlugs) {
  const label = `2026-06-03-batch58-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(
    image.slug === 'hanging-file-story-decision-point-card-pack',
    `${label}.slug must be hanging-file-story-decision-point-card-pack.`,
  )
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 58 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch58/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch58/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch58/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  expect(
    image.prompt ===
      'family-friendly top-down close-cropped catalog product photo on seamless pale neutral background, blank tan hanging file folder, blank off-white decision card stack, blank beige file label slips, clean printable paper kit, isolated paper stationery arrangement, unmarked paper, no writing, no symbols',
    `${label}.prompt must match the approved Batch58 hero prompt.`,
  )
  for (const phrase of [
    'text',
    'symbols',
    'fake letters',
    'stray marks',
    'labels',
    'logo',
    'spiral binding',
    'notebook',
    'school',
    'home',
    'address',
    'route',
    'gps',
    'schedule',
    'screens',
    'devices',
    'keyboard',
    'laptop',
    'trackpad',
    'computer',
    'phone',
    'public',
    'upload',
    'recording',
    'camera',
    'photo',
    'audio',
    'video',
    'voice memo',
    'rating',
    'score',
    'grade',
    'timer',
    'food',
    'allergy',
    'medical',
    'scary',
    'weapons',
    'bullying',
    'plants',
    'greenery',
    'succulent',
    'plant pot',
    'cups',
    'bowls',
    'desk decor',
    'colored background',
    'pink background',
  ]) {
    expect(image.negativePrompt.toLowerCase().includes(phrase), `${label}.negativePrompt missing "${phrase}".`)
  }
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  const generatedFileExists = [jpegPath, webpPath, sidecarPath].some((filePath) => existsSync(filePath))
  if (!generatedFileExists) return

  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch59Image(image, imageSlugs) {
  const label = `2026-06-04-batch59-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.width === 1344, `${label}.width must be 1344.`)
  expect(image.height === 768, `${label}.height must be 768.`)
  expect(
    image.slug === 'file-box-story-turning-point-card-pack',
    `${label}.slug must be file-box-story-turning-point-card-pack.`,
  )
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 59 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch59/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch59/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch59/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  expect(
    image.prompt ===
      'family-friendly top-down close-cropped catalog product photo on seamless pale neutral background, blank file box tray, blank off-white turning point card stack, blank beige file tab slips, clean printable paper kit, isolated paper stationery arrangement, unmarked paper, no writing, no symbols',
    `${label}.prompt must match the approved Batch59 hero prompt.`,
  )
  expect(
    image.negativePrompt ===
      'text, writing, letters, words, labels, titles, logo, watermark, symbols, scribbles, printed marks, fake letters, stray marks, forms, borders, ruled paper, handwriting, brand marks, spiral binding, notebook, school, home, address, route, gps, schedule, screens, devices, keyboard, laptop, trackpad, computer, phone, public, upload, recording, camera, photo, audio, video, voice memo, rating, score, grade, timer, food, allergy, medical, scary, weapons, bullying, plants, leaves, greenery, succulent, plant pot, wood, stone, desk decor, tabletop props, cups, bowls, children, faces, hands, clutter, colored background, pink background, dark shadows',
    `${label}.negativePrompt must match the approved Batch59 negative prompt.`,
  )
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  const generatedFileExists = [jpegPath, webpPath, sidecarPath].some((filePath) => existsSync(filePath))
  if (!generatedFileExists) return

  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch60Image(image, imageSlugs) {
  const label = `2026-06-04-batch60-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.seed === 260660093, `${label}.seed must be 260660093.`)
  expect(image.width === 1344, `${label}.width must be 1344.`)
  expect(image.height === 768, `${label}.height must be 768.`)
  expect(
    image.slug === 'archive-drawer-story-resolution-card-pack',
    `${label}.slug must be archive-drawer-story-resolution-card-pack.`,
  )
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 60 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch60/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch60/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch60/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  expect(
    image.prompt ===
      'family-friendly top-down close-cropped catalog product photo on seamless pale neutral background, blank archive drawer tray, blank off-white resolution card stack, blank beige drawer label slips, clean printable paper kit, isolated paper stationery arrangement, unmarked paper, no writing, no symbols',
    `${label}.prompt must match the approved Batch60 hero prompt.`,
  )
  expect(
    image.negativePrompt ===
      'text, writing, letters, words, labels, titles, logo, watermark, symbols, scribbles, printed marks, fake letters, stray marks, forms, borders, ruled paper, handwriting, brand marks, spiral binding, notebook, school, home, address, route, gps, schedule, screens, devices, keyboard, laptop, trackpad, computer, phone, public, upload, recording, camera, photo, audio, video, voice memo, rating, score, grade, timer, food, allergy, medical, scary, weapons, bullying, plants, leaves, greenery, succulent, plant pot, wood, stone, desk decor, tabletop props, cups, bowls, children, faces, hands, clutter, colored background, pink background, dark shadows',
    `${label}.negativePrompt must match the approved Batch60 negative prompt.`,
  )
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  const generatedFileExists = [jpegPath, webpPath, sidecarPath].some((filePath) => existsSync(filePath))
  if (!generatedFileExists) return

  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch61Image(image, imageSlugs) {
  const label = `2026-06-04-batch61-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.seed === 260661196, `${label}.seed must be 260661196.`)
  expect(image.width === 1344, `${label}.width must be 1344.`)
  expect(image.height === 768, `${label}.height must be 768.`)
  expect(
    image.slug === 'card-catalog-story-retell-card-pack',
    `${label}.slug must be card-catalog-story-retell-card-pack.`,
  )
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 61 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch61/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch61/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch61/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  expect(
    image.prompt ===
      'family-friendly top-down close-cropped product photo on seamless pale neutral background, one blank beige card catalog tray, neat stack of blank off-white retell cards, three blank beige catalog label slips, clean printable paper kit, paper-only stationery arrangement, unmarked paper, no writing, no symbols, no decorative props',
    `${label}.prompt must match the approved Batch61 hero prompt.`,
  )
  expect(
    image.negativePrompt ===
      'text, writing, letters, words, labels, titles, logo, watermark, symbols, scribbles, printed marks, fake letters, stray marks, forms, borders, ruled paper, handwriting, brand marks, spiral binding, notebook, school, home, address, route, gps, schedule, screens, devices, keyboard, laptop, trackpad, computer, phone, public, upload, recording, camera, photo, audio, video, voice memo, review, rating, score, grade, timer, food, allergy, medical, scary, weapons, bullying, plants, leaves, leaf, greenery, succulent, plant pot, flowers, wood, stone, desk decor, tabletop props, cups, bowls, thread, yarn, string, twine, roll, fabric, cloth, ribbon, children, faces, hands, clutter, colored background, pink background, dark shadows',
    `${label}.negativePrompt must match the approved Batch61 negative prompt.`,
  )
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  const generatedFileExists = [jpegPath, webpPath, sidecarPath].some((filePath) => existsSync(filePath))
  if (!generatedFileExists) return

  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateBatch62Image(image, imageSlugs) {
  const label = `2026-06-04-batch62-images.json:${image.slug ?? 'missing-slug'}`
  for (const key of ['slug', 'title', 'purpose', 'prompt', 'outputJpeg', 'outputWebp', 'sidecar']) {
    validateString(image[key], `${label}.${key}`)
  }
  validateString(image.negativePrompt, `${label}.negativePrompt`)
  expect(Number.isInteger(image.seed), `${label}.seed must be an integer.`)
  expect(image.width === 1344, `${label}.width must be 1344.`)
  expect(image.height === 768, `${label}.height must be 768.`)
  expect(
    image.slug === 'library-pocket-story-summary-card-pack',
    `${label}.slug must be library-pocket-story-summary-card-pack.`,
  )
  expect(!imageSlugs.has(image.slug), `${label}.slug is duplicated across Batch 62 images.`)
  imageSlugs.add(image.slug)
  expect(image.outputJpeg === `public/images/plotsprout/batch62/${image.slug}.jpg`, `${label}.outputJpeg has an unexpected path.`)
  expect(image.outputWebp === `public/images/plotsprout/batch62/${image.slug}.webp`, `${label}.outputWebp has an unexpected path.`)
  expect(image.sidecar === `content/image-runs/batch62/${image.slug}.json`, `${label}.sidecar has an unexpected path.`)
  expect(/library pocket/i.test(image.prompt), `${label}.prompt must describe the library pocket product hero.`)
  expect(/text/i.test(image.negativePrompt), `${label}.negativePrompt must block text-like artifacts.`)
  const imageCopy = { ...image }
  delete imageCopy.negativePrompt
  validateNoBannedTerms(imageCopy, label)

  const jpegPath = resolve(root, image.outputJpeg)
  const webpPath = resolve(root, image.outputWebp)
  const sidecarPath = resolve(root, image.sidecar)
  const generatedFileExists = [jpegPath, webpPath, sidecarPath].some((filePath) => existsSync(filePath))
  if (!generatedFileExists) return

  validateImageFile(jpegPath, `${label}.outputJpeg`, 'jpeg')
  validateImageFile(webpPath, `${label}.outputWebp`, 'webp')
  expect(existsSync(sidecarPath), `${label} missing sidecar file: ${sidecarPath}`)
  const sidecar = readJson(sidecarPath)
  expect(sidecar.slug === image.slug, `${label}.sidecar slug mismatch.`)
  expect(sidecar.prompt === image.prompt, `${label}.sidecar prompt mismatch.`)
  expect(sidecar.negativePrompt === image.negativePrompt, `${label}.sidecar negativePrompt mismatch.`)
  expect(sidecar.steps >= 30, `${label}.sidecar steps must be at least 30.`)
  expect(sidecar.seed === image.seed, `${label}.sidecar seed must match manifest seed.`)
  expect(sidecar.outputJpeg === image.outputJpeg, `${label}.sidecar outputJpeg mismatch.`)
  expect(sidecar.outputWebp === image.outputWebp, `${label}.sidecar outputWebp mismatch.`)
  expect(!Object.hasOwn(sidecar, 'elapsedSeconds'), `${label}.sidecar must not include wall-clock elapsedSeconds.`)
}

function validateProduct(product, productSlugs, worldSlugs, options = {}) {
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
    'grandparent-story-visit-kit': {
      title: 'Grandparent Story Visit Kit',
      pricePoint: '$31',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 12,
    },
    'thank-you-note-story-postcard-pack': {
      title: 'Thank-You Note Story Postcard Pack',
      pricePoint: '$21',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'nature-walk-story-field-notes-kit': {
      title: 'Nature Walk Story Field Notes Kit',
      pricePoint: '$33',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 12,
    },
    'backyard-story-seed-packet-kit': {
      title: 'Backyard Story Seed Packet Kit',
      pricePoint: '$35',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 14,
    },
    'kitchen-table-story-recipe-card-deck': {
      title: 'Kitchen Table Story Recipe Card Deck',
      pricePoint: '$29',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'bookshop-story-bookmark-pack': {
      title: 'Bookshop Story Bookmark Pack',
      pricePoint: '$25',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'writing-desk-story-prompt-strip-pack': {
      title: 'Writing Desk Story Prompt Strip Pack',
      pricePoint: '$27',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 18,
    },
    'window-seat-story-scene-card-pack': {
      title: 'Window Seat Story Scene Card Pack',
      pricePoint: '$29',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'quiet-corner-story-map-card-pack': {
      title: 'Quiet Corner Story Map Card Pack',
      pricePoint: '$31',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'porch-light-story-signal-card-pack': {
      title: 'Porch Light Story Signal Card Pack',
      pricePoint: '$33',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'pencil-case-story-switch-card-pack': {
      title: 'Pencil Case Story Switch Card Pack',
      pricePoint: '$35',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'notebook-margin-story-revision-card-pack': {
      title: 'Notebook Margin Story Revision Card Pack',
      pricePoint: '$37',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'desk-drawer-story-sequence-card-pack': {
      title: 'Desk Drawer Story Sequence Card Pack',
      pricePoint: '$39',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'reading-nook-story-cause-effect-card-pack': {
      title: 'Reading Nook Story Cause-and-Effect Card Pack',
      pricePoint: '$41',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'blanket-fort-story-dialogue-card-pack': {
      title: 'Blanket Fort Story Dialogue Card Pack',
      pricePoint: '$43',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'kitchen-window-story-pov-card-pack': {
      title: 'Kitchen Window Story Point-of-View Card Pack',
      pricePoint: '$45',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'coat-pocket-story-character-card-pack': {
      title: 'Coat Pocket Story Character Card Pack',
      pricePoint: '$47',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'paper-tray-story-setting-card-pack': {
      title: 'Paper Tray Story Setting Card Pack',
      pricePoint: '$49',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'backpack-story-ending-card-pack': {
      title: 'Backpack Story Ending Card Pack',
      pricePoint: '$51',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'pencil-cup-story-opening-card-pack': {
      title: 'Pencil Cup Story Opening Card Pack',
      pricePoint: '$53',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'desk-lamp-story-problem-card-pack': {
      title: 'Desk Lamp Story Problem Card Pack',
      pricePoint: '$55',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'paper-clip-story-solution-card-pack': {
      title: 'Paper Clip Story Solution Card Pack',
      pricePoint: '$57',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'binder-clip-story-transition-card-pack': {
      title: 'Binder Clip Story Transition Card Pack',
      pricePoint: '$59',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'folder-tab-story-detail-card-pack': {
      title: 'Folder Tab Story Detail Card Pack',
      pricePoint: '$61',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'index-card-story-show-not-tell-card-pack': {
      title: 'Index Card Story Show-Not-Tell Card Pack',
      pricePoint: '$63',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'sticky-note-story-tone-card-pack': {
      title: 'Sticky Note Story Tone Card Pack',
      pricePoint: '$65',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'washi-tape-story-word-choice-card-pack': {
      title: 'Washi Tape Story Word Choice Card Pack',
      pricePoint: '$67',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'paper-sleeve-story-sentence-variety-card-pack': {
      title: 'Paper Sleeve Story Sentence Variety Card Pack',
      pricePoint: '$69',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'clipboard-story-paragraph-focus-card-pack': {
      title: 'Clipboard Story Paragraph Focus Card Pack',
      pricePoint: '$71',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'lined-paper-story-paragraph-revision-card-pack': {
      title: 'Lined Paper Story Paragraph Revision Card Pack',
      pricePoint: '$73',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'composition-notebook-story-draft-checklist-card-pack': {
      title: 'Composition Notebook Story Draft Checklist Card Pack',
      pricePoint: '$75',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'spiral-notebook-story-final-copy-card-pack': {
      title: 'Spiral Notebook Story Final Copy Card Pack',
      pricePoint: '$77',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'tabbed-folder-story-series-card-pack': {
      title: 'Tabbed Folder Story Series Card Pack',
      pricePoint: '$79',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'accordion-folder-story-arc-card-pack': {
      title: 'Accordion Folder Story Arc Card Pack',
      pricePoint: '$81',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'expanding-file-story-scene-chain-card-pack': {
      title: 'Expanding File Story Scene Chain Card Pack',
      pricePoint: '$83',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'manila-folder-story-clue-trail-card-pack': {
      title: 'Manila Folder Story Clue Trail Card Pack',
      pricePoint: '$85',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'pocket-folder-story-goal-path-card-pack': {
      title: 'Pocket Folder Story Goal Path Card Pack',
      pricePoint: '$87',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'hanging-file-story-decision-point-card-pack': {
      title: 'Hanging File Story Decision Point Card Pack',
      pricePoint: '$89',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'file-box-story-turning-point-card-pack': {
      title: 'File Box Story Turning Point Card Pack',
      pricePoint: '$91',
      minIncludedPages: 10,
      minUseCases: 5,
      minParentSteps: 5,
      maxWorldSlugs: 16,
    },
    'archive-drawer-story-resolution-card-pack': {
      title: 'Archive Drawer Story Resolution Card Pack',
      pricePoint: '$93',
      minIncludedPages: 10,
      minUseCases: 4,
      minParentSteps: 4,
      maxWorldSlugs: 16,
    },
    'card-catalog-story-retell-card-pack': {
      title: 'Card Catalog Story Retell Card Pack',
      pricePoint: '$95',
      minIncludedPages: 10,
      minUseCases: 4,
      minParentSteps: 4,
      maxWorldSlugs: 16,
    },
    'library-pocket-story-summary-card-pack': {
      title: 'Library Pocket Story Summary Card Pack',
      pricePoint: '$97',
      minIncludedPages: 10,
      minUseCases: 4,
      minParentSteps: 4,
      maxWorldSlugs: 16,
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
  const requiredProductSafety =
    product.slug === 'expanding-file-story-scene-chain-card-pack' ||
    product.slug === 'manila-folder-story-clue-trail-card-pack' ||
    product.slug === 'pocket-folder-story-goal-path-card-pack' ||
    product.slug === 'hanging-file-story-decision-point-card-pack' ||
    product.slug === 'file-box-story-turning-point-card-pack' ||
    product.slug === 'archive-drawer-story-resolution-card-pack' ||
    product.slug === 'card-catalog-story-retell-card-pack' ||
    product.slug === 'library-pocket-story-summary-card-pack'
      ? expandingFileStorySceneChainSafety
      : safety
  expect(product.safetyNote.includes(requiredProductSafety), `${label}.safetyNote missing required safety sentence.`)
  validateMinList(product.worldSlugs, 3, `${label}.worldSlugs`)
  expect(product.worldSlugs.length <= expectedProduct.maxWorldSlugs, `${label}.worldSlugs has too many entries.`)
  for (const worldSlug of product.worldSlugs) {
    expect(worldSlugs.has(worldSlug), `${label}.worldSlugs references unknown world slug ${worldSlug}.`)
  }
  if (product.slug === 'backyard-story-seed-packet-kit') {
    const offScopeBackyardLanguage =
      /\bseed swaps?\b|\bcompost\b|\bwatering cans?\b|\bseedlings?\b|\bsolar ovens?\b|\bwarm snacks?\b|\bplanting seeds?\b|\bwatering plants?\b|\bsoil\b|\bgarden tools?\b|\bforaging\b|\btasting plants?\b|\bplant identification\b/i
    expect(Array.isArray(product.worldSummaries), `${label}.worldSummaries must be an array.`)
    expect(
      product.worldSummaries.length === product.worldSlugs.length,
      `${label}.worldSummaries must cover every linked world.`,
    )
    const expectedSummarySlugs = new Set(product.worldSlugs)
    const seenSummarySlugs = new Set()
    product.worldSummaries.forEach((summary, index) => {
      expect(typeof summary === 'object' && summary !== null, `${label}.worldSummaries[${index}] must be an object.`)
      validateString(summary.slug, `${label}.worldSummaries[${index}].slug`)
      validateString(summary.summary, `${label}.worldSummaries[${index}].summary`)
      expect(
        expectedSummarySlugs.has(summary.slug),
        `${label}.worldSummaries[${index}].slug must match a linked world slug.`,
      )
      expect(!seenSummarySlugs.has(summary.slug), `${label}.worldSummaries[${index}].slug is duplicated.`)
      seenSummarySlugs.add(summary.slug)
      expect(
        !offScopeBackyardLanguage.test(summary.summary),
        `${label}.worldSummaries[${index}].summary includes real-gardening, experiment, foraging, tasting, or plant-identification language.`,
      )
    })
    for (const worldSlug of product.worldSlugs) {
      expect(seenSummarySlugs.has(worldSlug), `${label}.worldSummaries missing linked world slug ${worldSlug}.`)
    }
  }
  if (product.slug === 'kitchen-table-story-recipe-card-deck') {
    const offScopeKitchenLanguage =
      /\bfood prep\b|\bserve food\b|\breal recipe advice\b|\brecipe instructions\b|\bcook(s|ed|ing)?\b|\bbak(e|es|ed|ing)\b|\btast(e|es|ed|ing)?\b|\beat(s|en|ing)?\b|\bstove(s)?\b|\boven(s)?\b|\bmicrowave(s)?\b|\bflame(s)?\b|\bknife\b|\bknives\b|\bscissors?\b|\ballerg(y|ies|en|ens|ic)\b|\bnutrition\b|\bdiet(s|ing|ary)?\b/i
    expect(Array.isArray(product.worldSummaries), `${label}.worldSummaries must be an array.`)
    expect(
      product.worldSummaries.length === product.worldSlugs.length,
      `${label}.worldSummaries must cover every linked world.`,
    )
    const expectedSummarySlugs = new Set(product.worldSlugs)
    const seenSummarySlugs = new Set()
    product.worldSummaries.forEach((summary, index) => {
      expect(typeof summary === 'object' && summary !== null, `${label}.worldSummaries[${index}] must be an object.`)
      validateString(summary.slug, `${label}.worldSummaries[${index}].slug`)
      validateString(summary.summary, `${label}.worldSummaries[${index}].summary`)
      expect(
        expectedSummarySlugs.has(summary.slug),
        `${label}.worldSummaries[${index}].slug must match a linked world slug.`,
      )
      expect(!seenSummarySlugs.has(summary.slug), `${label}.worldSummaries[${index}].slug is duplicated.`)
      seenSummarySlugs.add(summary.slug)
      expect(
        !offScopeKitchenLanguage.test(summary.summary),
        `${label}.worldSummaries[${index}].summary includes real table-task, tasting, allergen, nutrition, or diet language.`,
      )
    })
    for (const worldSlug of product.worldSlugs) {
      expect(seenSummarySlugs.has(worldSlug), `${label}.worldSummaries missing linked world slug ${worldSlug}.`)
    }
  }
  if (product.slug === 'bookshop-story-bookmark-pack') {
    const offScopeBookshopLanguage =
      /\baccounts?\b|\blogins?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\breal book titles?\b|\bauthor names?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b/i
    expect(Array.isArray(product.worldSummaries), `${label}.worldSummaries must be an array.`)
    expect(
      product.worldSummaries.length === product.worldSlugs.length,
      `${label}.worldSummaries must cover every linked world.`,
    )
    const expectedSummarySlugs = new Set(product.worldSlugs)
    const seenSummarySlugs = new Set()
    product.worldSummaries.forEach((summary, index) => {
      expect(typeof summary === 'object' && summary !== null, `${label}.worldSummaries[${index}] must be an object.`)
      validateString(summary.slug, `${label}.worldSummaries[${index}].slug`)
      validateString(summary.summary, `${label}.worldSummaries[${index}].summary`)
      expect(
        expectedSummarySlugs.has(summary.slug),
        `${label}.worldSummaries[${index}].slug must match a linked world slug.`,
      )
      expect(!seenSummarySlugs.has(summary.slug), `${label}.worldSummaries[${index}].slug is duplicated.`)
      seenSummarySlugs.add(summary.slug)
      expect(
        !offScopeBookshopLanguage.test(summary.summary),
        `${label}.worldSummaries[${index}].summary includes account, public-posting, review/rating, real-book, author, publisher, franchise, or branded language.`,
      )
    })
    for (const worldSlug of product.worldSlugs) {
      expect(seenSummarySlugs.has(worldSlug), `${label}.worldSummaries missing linked world slug ${worldSlug}.`)
    }
  }
  if (product.slug === 'writing-desk-story-prompt-strip-pack') {
    const offScopeWritingDeskLanguage =
      /\baccounts?\b|\blogins?\b|\bsign-?in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bscores?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal child\b|\bprivate child data\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b/i
    expect(Array.isArray(product.worldSummaries), `${label}.worldSummaries must be an array.`)
    expect(
      product.worldSummaries.length === product.worldSlugs.length,
      `${label}.worldSummaries must cover every linked world.`,
    )
    const expectedSummarySlugs = new Set(product.worldSlugs)
    const seenSummarySlugs = new Set()
    product.worldSummaries.forEach((summary, index) => {
      expect(typeof summary === 'object' && summary !== null, `${label}.worldSummaries[${index}] must be an object.`)
      validateString(summary.slug, `${label}.worldSummaries[${index}].slug`)
      validateString(summary.summary, `${label}.worldSummaries[${index}].summary`)
      expect(
        expectedSummarySlugs.has(summary.slug),
        `${label}.worldSummaries[${index}].slug must match a linked world slug.`,
      )
      expect(!seenSummarySlugs.has(summary.slug), `${label}.worldSummaries[${index}].slug is duplicated.`)
      seenSummarySlugs.add(summary.slug)
      expect(
        !offScopeWritingDeskLanguage.test(summary.summary),
        `${label}.worldSummaries[${index}].summary includes account, public-posting, review/rating, tracker, private-child-data, score, timer, contact, photo, publisher, franchise, or branded language.`,
      )
    })
    for (const worldSlug of product.worldSlugs) {
      expect(seenSummarySlugs.has(worldSlug), `${label}.worldSummaries missing linked world slug ${worldSlug}.`)
    }
  }
  if (product.slug === 'window-seat-story-scene-card-pack') {
    const offScopeWindowSeatLanguage =
      /\baccounts?\b|\blogins?\b|\bsign-?in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bscores?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal homes?\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\breal child\b|\bprivate child data\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bwindow safety\b|\bweather safety\b/i
    expect(Array.isArray(product.worldSummaries), `${label}.worldSummaries must be an array.`)
    expect(
      product.worldSummaries.length === product.worldSlugs.length,
      `${label}.worldSummaries must cover every linked world.`,
    )
    const expectedSummarySlugs = new Set(product.worldSlugs)
    const seenSummarySlugs = new Set()
    product.worldSummaries.forEach((summary, index) => {
      expect(typeof summary === 'object' && summary !== null, `${label}.worldSummaries[${index}] must be an object.`)
      validateString(summary.slug, `${label}.worldSummaries[${index}].slug`)
      validateString(summary.summary, `${label}.worldSummaries[${index}].summary`)
      expect(
        expectedSummarySlugs.has(summary.slug),
        `${label}.worldSummaries[${index}].slug must match a linked world slug.`,
      )
      expect(!seenSummarySlugs.has(summary.slug), `${label}.worldSummaries[${index}].slug is duplicated.`)
      seenSummarySlugs.add(summary.slug)
      expect(
        !offScopeWindowSeatLanguage.test(summary.summary),
        `${label}.worldSummaries[${index}].summary includes account, public-posting, review/rating, tracker, private-child-data, score, timer, contact, photo, camera, real-home, route, publisher, franchise, branded, window-safety, or weather-safety language.`,
      )
    })
    for (const worldSlug of product.worldSlugs) {
      expect(seenSummarySlugs.has(worldSlug), `${label}.worldSummaries missing linked world slug ${worldSlug}.`)
    }
  }
  validateMinList(product.includedPages, expectedProduct.minIncludedPages, `${label}.includedPages`)
  validateMinList(product.useCases, expectedProduct.minUseCases, `${label}.useCases`)
  validateMinList(product.parentSteps, expectedProduct.minParentSteps, `${label}.parentSteps`)

  expect(!containsActiveCheckoutLanguage(product), `${label} includes active checkout or payment-provider language.`)
  expect(!/student accounts?|login|log in|public publishing|publish online|upload/i.test(JSON.stringify(product)), `${label} includes account, upload, or public publishing language.`)
  validateNoBannedTerms(product, label)

  const renderedPath = resolve(root, 'public', product.slug, 'index.html')
  if (!existsSync(renderedPath)) {
    if (product.slug === 'library-pocket-story-summary-card-pack' && options.batch62GenerationStarted) {
      fail(`${label} static output is missing after Batch 62 generated outputs started: ${renderedPath}`)
    }
    if (product.slug === 'card-catalog-story-retell-card-pack' && options.batch61GenerationStarted) {
      fail(`${label} static output is missing after Batch 61 generated outputs started: ${renderedPath}`)
    }
    if (product.slug === 'archive-drawer-story-resolution-card-pack' && options.batch60GenerationStarted) {
      fail(`${label} static output is missing after Batch 60 generated outputs started: ${renderedPath}`)
    }
    if (product.slug === 'file-box-story-turning-point-card-pack' && options.batch59GenerationStarted) {
      fail(`${label} static output is missing after Batch 59 generated outputs started: ${renderedPath}`)
    }
    if (product.slug === 'hanging-file-story-decision-point-card-pack' && options.batch58GenerationStarted) {
      fail(`${label} static output is missing after Batch 58 generated outputs started: ${renderedPath}`)
    }
    if (product.slug === 'pocket-folder-story-goal-path-card-pack' && options.batch57GenerationStarted) {
      fail(`${label} static output is missing after Batch 57 generated outputs started: ${renderedPath}`)
    }
    if (product.slug === 'manila-folder-story-clue-trail-card-pack' && options.batch56GenerationStarted) {
      fail(`${label} static output is missing after Batch 56 generated outputs started: ${renderedPath}`)
    }
    if (product.slug === 'expanding-file-story-scene-chain-card-pack' && options.batch55GenerationStarted) {
      fail(`${label} static output is missing after Batch 55 generated outputs started: ${renderedPath}`)
    }
    expect(
        product.slug === 'expanding-file-story-scene-chain-card-pack' ||
        product.slug === 'manila-folder-story-clue-trail-card-pack' ||
        product.slug === 'pocket-folder-story-goal-path-card-pack' ||
        product.slug === 'hanging-file-story-decision-point-card-pack' ||
        product.slug === 'file-box-story-turning-point-card-pack' ||
        product.slug === 'archive-drawer-story-resolution-card-pack' ||
        product.slug === 'card-catalog-story-retell-card-pack' ||
        product.slug === 'library-pocket-story-summary-card-pack',
      `${label} static output is missing: ${renderedPath}`,
    )
    return
  }
  const renderedHtml = readFileSync(renderedPath, 'utf8')
  expect(renderedHtml.includes(product.title), `${label} static output missing product title.`)
  expect(renderedHtml.includes(product.pricePoint), `${label} static output missing price.`)
  expect(renderedHtml.includes(product.checkoutNote), `${label} static output missing checkout note.`)
  if (product.slug === 'backyard-story-seed-packet-kit') {
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    expect(
      !/\bseed swaps?\b|\bcompost\b|\bwatering cans?\b|\bseedlings?\b|\bsolar ovens?\b|\bwarm snacks?\b|\bplanting seeds?\b|\bwatering plants?\b|\bsoil\b|\bgarden tools?\b|\bforaging\b|\btasting plants?\b|\bplant identification\b/i.test(renderedHtml),
      `${label} static output includes real-gardening, experiment, foraging, tasting, or plant-identification language.`,
    )
  }
  if (product.slug === 'kitchen-table-story-recipe-card-deck') {
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    expect(
      !/\bfood prep\b|\bserve food\b|\breal recipe advice\b|\brecipe instructions\b|\bcook(s|ed|ing)?\b|\bbak(e|es|ed|ing)\b|\btast(e|es|ed|ing)?\b|\beat(s|en|ing)?\b|\bstove(s)?\b|\boven(s)?\b|\bmicrowave(s)?\b|\bflame(s)?\b|\bknife\b|\bknives\b|\bscissors?\b|\ballerg(y|ies|en|ens|ic)\b|\bnutrition\b|\bdiet(s|ing|ary)?\b/i.test(renderedHtml),
      `${label} static output includes real table-task, tasting, allergen, nutrition, or diet language.`,
    )
  }
  if (product.slug === 'bookshop-story-bookmark-pack') {
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    expect(
      !/\baccounts?\b|\blogins?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\breal book titles?\b|\bauthor names?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bbestseller(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b/i.test(renderedHtml),
      `${label} static output includes account, public-posting, review/rating, real-book, author, publisher, franchise, or branded language.`,
    )
  }
  if (product.slug === 'writing-desk-story-prompt-strip-pack') {
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const writingDeskRenderedText = renderedHtml.replaceAll(safety, '')
    expect(
      !/\baccounts?\b|\blogins?\b|\bsign-?in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bscores?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal child\b|\bprivate child data\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b/i.test(writingDeskRenderedText),
      `${label} static output includes account, public-posting, review/rating, tracker, private-child-data, score, timer, contact, photo, publisher, franchise, or branded language.`,
    )
  }
  if (product.slug === 'window-seat-story-scene-card-pack') {
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const windowSeatRenderedText = renderedHtml.replaceAll(safety, '')
    expect(
      !/\baccounts?\b|\blogins?\b|\bsign-?in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bscores?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal homes?\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\breal child\b|\bprivate child data\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bwindow safety\b|\bweather safety\b/i.test(windowSeatRenderedText),
      `${label} static output includes account, public-posting, review/rating, tracker, private-child-data, score, timer, contact, photo, camera, real-home, route, publisher, franchise, branded, window-safety, or weather-safety language.`,
    )
  }
  if (product.slug === 'quiet-corner-story-map-card-pack') {
    const quietCornerSummaryErrors = validateProductWorldSummaries(product, 'Quiet Corner Story Map Card Pack')
    expect(
      quietCornerSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${quietCornerSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const quietCornerRenderedText = renderedHtml.replaceAll(safety, '')
    expect(
      !/\baccounts?\b|\blogins?\b|\bsign-?in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bscores?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal homes?\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\breal child\b|\bprivate child data\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bnavigation\b|\breal-world map\b|\broad atlas\b/i.test(quietCornerRenderedText),
      `${label} static output includes account, public-posting, review/rating, tracker, private-child-data, score, timer, contact, photo, camera, real-home, route, real-navigation, publisher, franchise, or branded language.`,
    )
  }
  if (product.slug === 'porch-light-story-signal-card-pack') {
    const porchLightSummaryErrors = validateProductWorldSummaries(product, 'Porch Light Story Signal Card Pack')
    expect(
      porchLightSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${porchLightSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const porchLightRenderedText = renderedHtml.replaceAll(safety, '')
    expect(
      !/\baccounts?\b|\blogins?\b|\bsign-?in\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\bschedules?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bscores?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\breal child\b|\bprivate child data\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bnavigation\b|\breal-world map\b|\broad atlas\b|\bwindow safety\b|\boutdoor safety\b|\bweather safety\b|\bsafety instruction(s)?\b/i.test(porchLightRenderedText),
      `${label} static output includes account, public-posting, review/rating, tracker, private-child-data, score, timer, contact, photo, camera, real-home, house, outdoor, route, safety-instruction, publisher, franchise, or branded language.`,
    )
  }
  if (product.slug === 'pencil-case-story-switch-card-pack') {
    const pencilCaseSummaryErrors = validateProductWorldSummaries(product, 'Pencil Case Story Switch Card Pack')
    expect(
      pencilCaseSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${pencilCaseSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const pencilCaseRenderedText = renderedHtml.replaceAll(safety, '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bscores?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(pencilCaseRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, tracker, private-child-data, score, timer, contact, photo, camera, real-home, outdoor, route, food/allergy, unsafe professional, publisher, franchise, or branded language.`,
    )
  }
  if (product.slug === 'notebook-margin-story-revision-card-pack') {
    const notebookMarginSummaryErrors = validateProductWorldSummaries(product, 'Notebook Margin Story Revision Card Pack')
    expect(
      notebookMarginSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${notebookMarginSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const notebookMarginRenderedText = renderedHtml.replaceAll(safety, '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bgps\b|\bcoordinates?\b|\broute(s)?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(notebookMarginRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, tracker, private-child-data, grading/rubric, score, timer, contact, photo, camera, real-home, outdoor, route, food/allergy, unsafe professional, publisher, franchise, or branded language.`,
    )
  }
  if (product.slug === 'desk-drawer-story-sequence-card-pack') {
    const deskDrawerSummaryErrors = validateProductWorldSummaries(product, 'Desk Drawer Story Sequence Card Pack')
    expect(
      deskDrawerSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${deskDrawerSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const deskDrawerRenderedText = renderedHtml.replaceAll(safety, '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bgps\b|\bcoordinates?\b|\breal route(s)?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(deskDrawerRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, tracker, private-child-data, grading/rubric, score, timer, contact, photo, camera, real-home, outdoor, real-route, food/allergy, unsafe professional, publisher, franchise, or branded language.`,
    )
  }
  if (product.slug === 'reading-nook-story-cause-effect-card-pack') {
    const readingNookSummaryErrors = validateProductWorldSummaries(product, 'Reading Nook Story Cause-and-Effect Card Pack')
    expect(
      readingNookSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${readingNookSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const readingNookRenderedText = renderedHtml.replaceAll(safety, '').replaceAll('take-home', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\bphotos?\b|\bcameras?\b|\baddresses?\b|\bphone(s)?\b|\bemails?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bgps\b|\bcoordinates?\b|\breal route(s)?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(readingNookRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, tracker, private-child-data, grading/rubric, score, timer, contact, photo, camera, real-home, outdoor, real-route, real-book-title, author, publisher, franchise, food/allergy, or unsafe professional language.`,
    )
  }
  if (product.slug === 'blanket-fort-story-dialogue-card-pack') {
    const blanketFortSummaryErrors = validateProductWorldSummaries(product, 'Blanket Fort Story Dialogue Card Pack')
    expect(
      blanketFortSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${blanketFortSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const blanketFortRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bgps\b|\bcoordinates?\b|\breal route(s)?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(blanketFortRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, contact, photo, camera, real-home, outdoor, real-route, real-book-title, author, publisher, franchise, food/allergy, or unsafe professional language.`,
    )
  }
  if (product.slug === 'kitchen-window-story-pov-card-pack') {
    const kitchenWindowSummaryErrors = validateProductWorldSummaries(product, 'Kitchen Window Story Point-of-View Card Pack')
    expect(
      kitchenWindowSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${kitchenWindowSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const kitchenWindowRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Kitchen Window', '')
      .replaceAll('kitchen window', '')
      .replaceAll('kitchen-window', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\baddresses?\b|\breal homes?\b|\bhome address\b|\bhome window(s)?\b|\breal window(s)?\b|\breal view(s)?\b|\blook out\b|\bhouse(s)?\b|\bneighbors?\b|\bneighborhood(s)?\b|\bstreets?\b|\boutside\b|\boutdoors?\b|\bgps\b|\bcoordinates?\b|\breal route(s)?\b|\bexact location\b|\bexact places?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b|\bwindow safety\b|\boutdoor safety\b|\bweather safety\b/i.test(kitchenWindowRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, contact, photo, camera, real-home/window, outdoor, real-route, exact-location, real-book-title, author, publisher, franchise, food/allergy, unsafe professional, or weather/window-safety language.`,
    )
  }
  if (product.slug === 'coat-pocket-story-character-card-pack') {
    const coatPocketSummaryErrors = validateProductWorldSummaries(product, 'Coat Pocket Story Character Card Pack')
    expect(
      coatPocketSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${coatPocketSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const coatPocketRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Coat Pocket', '')
      .replaceAll('coat pocket', '')
      .replaceAll('coat-pocket', '')
      .replaceAll('paper-pocket', '')
      .replaceAll('paper pocket', '')
      .replaceAll('pretend pocket', '')
      .replaceAll('pretend paper pocket', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bactual pockets?\b|\breal pockets?\b|\bactual clothing\b|\breal clothing\b|\bprivate locations?\b|\bschool route(s)?\b|\breal route(s)?\b|\baddresses?\b|\bhome address\b|\breal homes?\b|\bhouse(s)?\b|\brooms?\b|\bschools?\b|\brelatives?\b|\bgps\b|\bcoordinates?\b|\bexact location\b|\bexact places?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(coatPocketRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real-pocket/clothing, private-location, contact, photo, camera, real-home, real-route, exact-location, real-book-title, author, publisher, franchise, food/allergy, or unsafe professional language.`,
    )
  }
  if (product.slug === 'paper-tray-story-setting-card-pack') {
    const paperTraySummaryErrors = validateProductWorldSummaries(product, 'Paper Tray Story Setting Card Pack')
    expect(
      paperTraySummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${paperTraySummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const paperTrayRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Paper Tray', '')
      .replaceAll('paper tray', '')
      .replaceAll('paper-tray', '')
      .replaceAll('story place', '')
      .replaceAll('story-place', '')
      .replaceAll('Puddle Planet Post Office', '')
      .replaceAll('puddle-planet-post-office', '')
      .replaceAll('Acorn Avenue Errand Office', '')
      .replaceAll('acorn-avenue-errand-office', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\boffices?\b|\bdesks?\b|\brooms?\b|\bprivate locations?\b|\bprivate place details?\b|\blocation details?\b|\bexact locations?\b|\bexact places?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\baddresses?\b|\bstreets?\b|\bgps\b|\bcoordinates?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(paperTrayRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real classroom/home/office/room, school details, address, route, GPS, exact-location, real-book-title, author, publisher, franchise, food/allergy, or unsafe professional language.`,
    )
  }
  if (product.slug === 'backpack-story-ending-card-pack') {
    const backpackSummaryErrors = validateProductWorldSummaries(product, 'Backpack Story Ending Card Pack')
    expect(
      backpackSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${backpackSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const backpackRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Backpack Story Ending Card Pack', '')
      .replaceAll('backpack story ending card pack', '')
      .replaceAll('Backpack', '')
      .replaceAll('backpack', '')
      .replaceAll('pretend-backpack', '')
      .replaceAll('pretend backpack', '')
      .replaceAll('paper backpack', '')
      .replaceAll('ending card', '')
      .replaceAll('ending-card', '')
      .replaceAll('narrow real-world facts', '')
      .replaceAll('narrow real-world fact', '')
      .replaceAll('Puddle Planet Post Office', '')
      .replaceAll('puddle-planet-post-office', '')
      .replaceAll('Acorn Avenue Errand Office', '')
      .replaceAll('acorn-avenue-errand-office', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate locations?\b|\bprivate place details?\b|\blocation details?\b|\bexact locations?\b|\bexact places?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\baddresses?\b|\bstreets?\b|\bgps\b|\bcoordinates?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bprofiles?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(backpackRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real school/home details, address, route, GPS, exact-location, profile, real-book-title, author, publisher, franchise, food/allergy, or unsafe professional language.`,
    )
  }
  if (product.slug === 'pencil-cup-story-opening-card-pack') {
    const pencilCupSummaryErrors = validateProductWorldSummaries(product, 'Pencil Cup Story Opening Card Pack')
    expect(
      pencilCupSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${pencilCupSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const pencilCupRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Pencil Cup Story Opening Card Pack', '')
      .replaceAll('pencil cup story opening card pack', '')
      .replaceAll('Pencil Cup', '')
      .replaceAll('pencil cup', '')
      .replaceAll('pencil-cup', '')
      .replaceAll('opening card', '')
      .replaceAll('opening-card', '')
      .replaceAll('screen-free', '')
      .replaceAll('narrow real-world facts', '')
      .replaceAll('narrow real-world fact', '')
      .replaceAll('Puddle Planet Post Office', '')
      .replaceAll('puddle-planet-post-office', '')
      .replaceAll('Acorn Avenue Errand Office', '')
      .replaceAll('acorn-avenue-errand-office', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\bprivate locations?\b|\bprivate place details?\b|\blocation details?\b|\bexact locations?\b|\bexact places?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\baddresses?\b|\bstreets?\b|\bgps\b|\bcoordinates?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bprofiles?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b/i.test(pencilCupRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real school/home details, address, route, GPS, exact-location, profile, real-book-title, author, publisher, franchise, food/allergy, or unsafe professional language.`,
    )
  }
  if (product.slug === 'desk-lamp-story-problem-card-pack') {
    const deskLampSummaryErrors = validateProductWorldSummaries(product, 'Desk Lamp Story Problem Card Pack')
    expect(
      deskLampSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${deskLampSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const deskLampRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Desk Lamp Story Problem Card Pack', '')
      .replaceAll('Desk%20Lamp%20Story%20Problem%20Card%20Pack', '')
      .replaceAll('desk lamp story problem card pack', '')
      .replaceAll('desk%20lamp%20story%20problem%20card%20pack', '')
      .replaceAll('Desk Lamp', '')
      .replaceAll('Desk%20Lamp', '')
      .replaceAll('Desk lamp', '')
      .replaceAll('desk lamp', '')
      .replaceAll('desk%20lamp', '')
      .replaceAll('desk-lamp', '')
      .replaceAll('problem card', '')
      .replaceAll('problem-card', '')
      .replaceAll('screen-free', '')
      .replaceAll('narrow real-world facts', '')
      .replaceAll('narrow real-world fact', '')
      .replaceAll('narrow personal facts', '')
      .replaceAll('small story problem', '')
      .replaceAll('Puddle Planet Post Office', '')
      .replaceAll('puddle-planet-post-office', '')
      .replaceAll('Acorn Avenue Errand Office', '')
      .replaceAll('acorn-avenue-errand-office', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\boffices?\b|\bdesks?\b|\brooms?\b|\breal rooms?\b|\bprivate locations?\b|\bprivate place details?\b|\blocation details?\b|\bexact locations?\b|\bexact places?\b|\bschedules?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\baddresses?\b|\bstreets?\b|\bgps\b|\bcoordinates?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bprofiles?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(deskLampRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real room/location/schedule details, address, route, GPS, exact-location, profile, real-book-title, author, publisher, franchise, food/allergy, unsafe professional, scary/harm/bullying/fighting, or weapon language.`,
    )
  }
  if (product.slug === 'paper-clip-story-solution-card-pack') {
    const paperClipSummaryErrors = validateProductWorldSummaries(product, 'Paper Clip Story Solution Card Pack')
    expect(
      paperClipSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${paperClipSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const paperClipRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Paper Clip Story Solution Card Pack', '')
      .replaceAll('Paper%20Clip%20Story%20Solution%20Card%20Pack', '')
      .replaceAll('paper clip story solution card pack', '')
      .replaceAll('paper%20clip%20story%20solution%20card%20pack', '')
      .replaceAll('Paper Clip', '')
      .replaceAll('Paper%20Clip', '')
      .replaceAll('paper clip', '')
      .replaceAll('paper%20clip', '')
      .replaceAll('paper-clip', '')
      .replaceAll('solution card', '')
      .replaceAll('solution-card', '')
      .replaceAll('screen-free', '')
      .replaceAll('narrow real-world facts', '')
      .replaceAll('narrow real-world fact', '')
      .replaceAll('narrow personal facts', '')
      .replaceAll('blank-page pressure', '')
      .replaceAll('Puddle Planet Post Office', '')
      .replaceAll('puddle-planet-post-office', '')
      .replaceAll('Acorn Avenue Errand Office', '')
      .replaceAll('acorn-avenue-errand-office', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\boffices?\b|\bdesks?\b|\brooms?\b|\breal rooms?\b|\bprivate locations?\b|\bprivate place details?\b|\blocation details?\b|\bexact locations?\b|\bexact places?\b|\bschedules?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\baddresses?\b|\bstreets?\b|\bgps\b|\bcoordinates?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bprofiles?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(paperClipRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real room/location/schedule details, address, route, GPS, exact-location, profile, real-book-title, author, publisher, franchise, food/allergy, unsafe professional, scary/harm/bullying/fighting, or weapon language.`,
    )
  }
  if (product.slug === 'binder-clip-story-transition-card-pack') {
    const binderClipSummaryErrors = validateProductWorldSummaries(product, 'Binder Clip Story Transition Card Pack')
    expect(
      binderClipSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${binderClipSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const binderClipRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Binder Clip Story Transition Card Pack', '')
      .replaceAll('Binder%20Clip%20Story%20Transition%20Card%20Pack', '')
      .replaceAll('binder clip story transition card pack', '')
      .replaceAll('binder%20clip%20story%20transition%20card%20pack', '')
      .replaceAll('Binder Clip', '')
      .replaceAll('Binder%20Clip', '')
      .replaceAll('binder clip', '')
      .replaceAll('binder%20clip', '')
      .replaceAll('binder-clip', '')
      .replaceAll('transition card', '')
      .replaceAll('transition-card', '')
      .replaceAll('transition slip', '')
      .replaceAll('screen-free', '')
      .replaceAll('narrow real-world facts', '')
      .replaceAll('narrow real-world fact', '')
      .replaceAll('narrow personal facts', '')
      .replaceAll('blank-page pressure', '')
      .replaceAll('Puddle Planet Post Office', '')
      .replaceAll('puddle-planet-post-office', '')
      .replaceAll('Acorn Avenue Errand Office', '')
      .replaceAll('acorn-avenue-errand-office', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(!/\bscoring\b/i.test(binderClipRenderedText), `${label} static output includes scoring language.`)
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\boffices?\b|\bdesks?\b|\brooms?\b|\breal rooms?\b|\bprivate locations?\b|\bprivate place details?\b|\blocation details?\b|\bexact locations?\b|\bexact places?\b|\bschedules?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\baddresses?\b|\bstreets?\b|\bgps\b|\bcoordinates?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bprofiles?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(binderClipRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real room/location/schedule details, address, route, GPS, exact-location, profile, real-book-title, author, publisher, franchise, food/allergy, unsafe professional, scary/harm/bullying/fighting, or weapon language.`,
    )
  }
  if (product.slug === 'folder-tab-story-detail-card-pack') {
    const folderTabSummaryErrors = validateProductWorldSummaries(product, 'Folder Tab Story Detail Card Pack')
    expect(
      folderTabSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${folderTabSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const folderTabRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Folder Tab Story Detail Card Pack', '')
      .replaceAll('Folder%20Tab%20Story%20Detail%20Card%20Pack', '')
      .replaceAll('folder tab story detail card pack', '')
      .replaceAll('folder%20tab%20story%20detail%20card%20pack', '')
      .replaceAll('Folder Tab', '')
      .replaceAll('Folder%20Tab', '')
      .replaceAll('folder tab', '')
      .replaceAll('folder%20tab', '')
      .replaceAll('folder-tab', '')
      .replaceAll('detail card', '')
      .replaceAll('detail-card', '')
      .replaceAll('detail slip', '')
      .replaceAll('screen-free', '')
      .replaceAll('narrow real-world facts', '')
      .replaceAll('narrow real-world fact', '')
      .replaceAll('narrow personal facts', '')
      .replaceAll('blank-page pressure', '')
      .replaceAll('Puddle Planet Post Office', '')
      .replaceAll('puddle-planet-post-office', '')
      .replaceAll('Acorn Avenue Errand Office', '')
      .replaceAll('acorn-avenue-errand-office', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(!/\bscoring\b/i.test(folderTabRenderedText), `${label} static output includes scoring language.`)
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\boffices?\b|\bdesks?\b|\brooms?\b|\breal rooms?\b|\bprivate locations?\b|\bprivate place details?\b|\blocation details?\b|\bexact locations?\b|\bexact places?\b|\bschedules?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\baddresses?\b|\bstreets?\b|\bgps\b|\bcoordinates?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bprofiles?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\bfood tasting\b|\btast(e|es|ed|ing)?\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(folderTabRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real room/location/schedule details, address, route, GPS, exact-location, profile, real-book-title, author, publisher, franchise, food/tasting/allergy, unsafe professional, scary/harm/bullying/fighting, or weapon language.`,
    )
  }
  if (product.slug === 'index-card-story-show-not-tell-card-pack') {
    const indexCardSummaryErrors = validateProductWorldSummaries(product, 'Index Card Story Show-Not-Tell Card Pack')
    expect(
      indexCardSummaryErrors.length === 0,
      `${label}.worldSummaries failed validation:\n${indexCardSummaryErrors.join('\n')}`,
    )
    for (const { summary } of product.worldSummaries) {
      expect(renderedHtml.includes(summary), `${label} static output missing product-specific world summary.`)
    }
    const indexCardRenderedText = renderedHtml
      .replaceAll(safety, '')
      .replaceAll('take-home', '')
      .replaceAll('Checkout is pending until the payment provider is selected', '')
      .replaceAll('device-width', '')
      .replaceAll('Index Card Story Show-Not-Tell Card Pack', '')
      .replaceAll('Index%20Card%20Story%20Show-Not-Tell%20Card%20Pack', '')
      .replaceAll('index card story show-not-tell card pack', '')
      .replaceAll('index%20card%20story%20show-not-tell%20card%20pack', '')
      .replaceAll('Index Card', '')
      .replaceAll('Index%20Card', '')
      .replaceAll('index card', '')
      .replaceAll('index%20card', '')
      .replaceAll('index-card', '')
      .replaceAll('show-not-tell card', '')
      .replaceAll('show-not-tell-card', '')
      .replaceAll('show slip', '')
      .replaceAll('screen-free', '')
      .replaceAll('narrow real-world facts', '')
      .replaceAll('narrow real-world fact', '')
      .replaceAll('narrow personal facts', '')
      .replaceAll('blank-page pressure', '')
      .replaceAll('Puddle Planet Post Office', '')
      .replaceAll('puddle-planet-post-office', '')
      .replaceAll('Acorn Avenue Errand Office', '')
      .replaceAll('acorn-avenue-errand-office', '')
      .replaceAll('Seed Library Map Room', '')
      .replaceAll('seed-library-map-room', '')
    expect(!/\bscoring\b/i.test(indexCardRenderedText), `${label} static output includes scoring language.`)
    expect(
      !/\baccounts?\b|\bschool accounts?\b|\blogins?\b|\bsign-?in\b|\bportal(s)?\b|\bapps?\b|\bqr\b|\bqr codes?\b|\bupload(s|ed|ing)?\b|\bpublic post(s|ed|ing)?\b|\bpublic reviews?\b|\breviews?\b|\bratings?\b|\bstars?\b|\bcomments?\b|\bforums?\b|\brecord(s|ed|ing)?\b|\brecorders?\b|\btranscri(be|bes|bed|bing|pt|pts|ption|ptions)\b|\baudio\b|\bvoice memo(s)?\b|\bmicrophone(s)?\b|\bvideos?\b|\bphotos?\b|\bcameras?\b|\bphones?\b|\bdevices?\b|\bprivate conversation(s)?\b|\breal conversation(s)?\b|\btracker(s)?\b|\btracking\b|\bbehavior reports?\b|\bgrades?\b|\bgrading\b|\bscores?\b|\brubrics?\b|\bcontest(s)?\b|\bprizes?\b|\btimers?\b|\breal names?\b|\bfull names?\b|\bidentity details?\b|\bclassrooms?\b|\bschools?\b|\bstudents?\b|\bteachers?\b|\bhomes?\b|\bhouses?\b|\bhome address\b|\boffices?\b|\bdesks?\b|\brooms?\b|\breal rooms?\b|\bprivate locations?\b|\bprivate place details?\b|\blocation details?\b|\bexact locations?\b|\bexact places?\b|\bschedules?\b|\bschool route(s)?\b|\breal route(s)?\b|\broutes?\b|\baddresses?\b|\bstreets?\b|\bgps\b|\bcoordinates?\b|\breal child\b|\breal child data\b|\bprivate child data\b|\bstudent records?\b|\bprofiles?\b|\bbook title(s)?\b|\breal title(s)?\b|\bauthor(s)?\b|\bpublisher(s)?\b|\bfranchise(s)?\b|\bcopyright(ed)?\b|\bHarry Potter\b|\bDisney\b|\bPokemon\b|\bPokémon\b|\bMarvel\b|\bStar Wars\b|\bMinecraft\b|\bfood prep\b|\bfood tasting\b|\btast(e|es|ed|ing)?\b|\ballerg(y|ies|en|ens|ic)\b|\bmedical\b|\blegal\b|\btherapy\b|\bgrief\b|\bscary\b|\bharm(s|ed|ing)?\b|\bbull(y|ies|ied|ying)\b|\bbullying\b|\bfight(s|ing)?\b|\bdanger(s|ous)?\b|\bweapon(s)?\b/i.test(indexCardRenderedText),
      `${label} static output includes account, school-login, portal/app/QR, public-posting, review/rating, recording/audio/transcript, microphone, phone/device, private-conversation, tracker, private-child-data, grading/rubric, score, timer, real-identity, real room/location/schedule details, address, route, GPS, exact-location, profile, real-book-title, author, publisher, franchise, food/tasting/allergy, unsafe professional, scary/harm/bullying/fighting, or weapon language.`,
    )
  }
  const metaDescription = renderedHtml.match(/<meta name="description" content="([^"]+)">/)?.[1]
  validateString(metaDescription, `${label} rendered meta description`)
  expect(
    !/\b(and|or|with|for|to)[.!?]?$/i.test(metaDescription),
    `${label} rendered meta description must not end on a dangling connector.`,
  )
  expect(
    !/\b(a|an|the)[.!?]?$/i.test(metaDescription),
    `${label} rendered meta description must not end on a dangling article.`,
  )
  expect(
    !/\b[\w]+-[\w]+[.!?]?$/i.test(metaDescription),
    `${label} rendered meta description must not end on a dangling hyphenated phrase.`,
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

expect(existsSync(batch21ProductImagesFile), `Missing Batch 21 product image manifest: ${batch21ProductImagesFile}`)
const batch21ProductImages = readJson(batch21ProductImagesFile)
expect(
  batch21ProductImages.batchId === batch21ProductImagesBatchId,
  `batch21 product image manifest batchId must be ${batch21ProductImagesBatchId}.`,
)
expect(batch21ProductImages.generatedAt === '2026-06-02', 'batch21 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch21ProductImages.images), 'batch21 product image manifest images must be an array.')
expect(batch21ProductImages.images.length === 1, `Expected 1 Batch 21 product image, found ${batch21ProductImages.images.length}.`)
validateBatch21ProductImage(batch21ProductImages.images[0])

expect(existsSync(batch22ProductImagesFile), `Missing Batch 22 product image manifest: ${batch22ProductImagesFile}`)
const batch22ProductImages = readJson(batch22ProductImagesFile)
expect(
  batch22ProductImages.batchId === batch22ProductImagesBatchId,
  `batch22 product image manifest batchId must be ${batch22ProductImagesBatchId}.`,
)
expect(batch22ProductImages.generatedAt === '2026-06-02', 'batch22 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch22ProductImages.images), 'batch22 product image manifest images must be an array.')
expect(batch22ProductImages.images.length === 1, `Expected 1 Batch 22 product image, found ${batch22ProductImages.images.length}.`)
validateBatch22ProductImage(batch22ProductImages.images[0])

expect(existsSync(batch23ProductImagesFile), `Missing Batch 23 product image manifest: ${batch23ProductImagesFile}`)
const batch23ProductImages = readJson(batch23ProductImagesFile)
expect(
  batch23ProductImages.batchId === batch23ProductImagesBatchId,
  `batch23 product image manifest batchId must be ${batch23ProductImagesBatchId}.`,
)
expect(batch23ProductImages.generatedAt === '2026-06-02', 'batch23 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch23ProductImages.images), 'batch23 product image manifest images must be an array.')
expect(batch23ProductImages.images.length === 1, `Expected 1 Batch 23 product image, found ${batch23ProductImages.images.length}.`)
validateBatch23ProductImage(batch23ProductImages.images[0])

expect(existsSync(batch24ProductImagesFile), `Missing Batch 24 product image manifest: ${batch24ProductImagesFile}`)
const batch24ProductImages = readJson(batch24ProductImagesFile)
expect(
  batch24ProductImages.batchId === batch24ProductImagesBatchId,
  `batch24 product image manifest batchId must be ${batch24ProductImagesBatchId}.`,
)
expect(batch24ProductImages.generatedAt === '2026-06-02', 'batch24 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch24ProductImages.images), 'batch24 product image manifest images must be an array.')
expect(batch24ProductImages.images.length === 1, `Expected 1 Batch 24 product image, found ${batch24ProductImages.images.length}.`)
validateBatch24ProductImage(batch24ProductImages.images[0])

expect(existsSync(batch25ProductImagesFile), `Missing Batch 25 product image manifest: ${batch25ProductImagesFile}`)
const batch25ProductImages = readJson(batch25ProductImagesFile)
expect(
  batch25ProductImages.batchId === batch25ProductImagesBatchId,
  `batch25 product image manifest batchId must be ${batch25ProductImagesBatchId}.`,
)
expect(batch25ProductImages.generatedAt === '2026-06-02', 'batch25 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch25ProductImages.images), 'batch25 product image manifest images must be an array.')
expect(batch25ProductImages.images.length === 1, `Expected 1 Batch 25 product image, found ${batch25ProductImages.images.length}.`)
validateBatch25ProductImage(batch25ProductImages.images[0])

expect(existsSync(batch26ProductImagesFile), `Missing Batch 26 product image manifest: ${batch26ProductImagesFile}`)
const batch26ProductImages = readJson(batch26ProductImagesFile)
expect(
  batch26ProductImages.batchId === batch26ProductImagesBatchId,
  `batch26 product image manifest batchId must be ${batch26ProductImagesBatchId}.`,
)
expect(batch26ProductImages.generatedAt === '2026-06-02', 'batch26 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch26ProductImages.images), 'batch26 product image manifest images must be an array.')
expect(batch26ProductImages.images.length === 1, `Expected 1 Batch 26 product image, found ${batch26ProductImages.images.length}.`)
validateBatch26ProductImage(batch26ProductImages.images[0])

expect(existsSync(batch27ProductImagesFile), `Missing Batch 27 product image manifest: ${batch27ProductImagesFile}`)
const batch27ProductImages = readJson(batch27ProductImagesFile)
expect(
  batch27ProductImages.batchId === batch27ProductImagesBatchId,
  `batch27 product image manifest batchId must be ${batch27ProductImagesBatchId}.`,
)
expect(batch27ProductImages.generatedAt === '2026-06-02', 'batch27 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch27ProductImages.images), 'batch27 product image manifest images must be an array.')
expect(batch27ProductImages.images.length === 1, `Expected 1 Batch 27 product image, found ${batch27ProductImages.images.length}.`)
validateBatch27ProductImage(batch27ProductImages.images[0])

expect(existsSync(batch28ProductImagesFile), `Missing Batch 28 product image manifest: ${batch28ProductImagesFile}`)
const batch28ProductImages = readJson(batch28ProductImagesFile)
expect(
  batch28ProductImages.batchId === batch28ProductImagesBatchId,
  `batch28 product image manifest batchId must be ${batch28ProductImagesBatchId}.`,
)
expect(batch28ProductImages.generatedAt === '2026-06-02', 'batch28 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch28ProductImages.images), 'batch28 product image manifest images must be an array.')
expect(batch28ProductImages.images.length === 1, `Expected 1 Batch 28 product image, found ${batch28ProductImages.images.length}.`)
validateBatch28ProductImage(batch28ProductImages.images[0])

expect(existsSync(batch29ProductImagesFile), `Missing Batch 29 product image manifest: ${batch29ProductImagesFile}`)
const batch29ProductImages = readJson(batch29ProductImagesFile)
expect(
  batch29ProductImages.batchId === batch29ProductImagesBatchId,
  `batch29 product image manifest batchId must be ${batch29ProductImagesBatchId}.`,
)
expect(batch29ProductImages.generatedAt === '2026-06-02', 'batch29 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch29ProductImages.images), 'batch29 product image manifest images must be an array.')
expect(batch29ProductImages.images.length === 1, `Expected 1 Batch 29 product image, found ${batch29ProductImages.images.length}.`)
validateBatch29ProductImage(batch29ProductImages.images[0])

expect(existsSync(batch30ProductImagesFile), `Missing Batch 30 product image manifest: ${batch30ProductImagesFile}`)
const batch30ProductImages = readJson(batch30ProductImagesFile)
expect(
  batch30ProductImages.batchId === batch30ProductImagesBatchId,
  `batch30 product image manifest batchId must be ${batch30ProductImagesBatchId}.`,
)
expect(batch30ProductImages.generatedAt === '2026-06-02', 'batch30 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch30ProductImages.images), 'batch30 product image manifest images must be an array.')
expect(batch30ProductImages.images.length === 1, `Expected 1 Batch 30 product image, found ${batch30ProductImages.images.length}.`)
validateBatch30ProductImage(batch30ProductImages.images[0])

expect(existsSync(batch31ProductImagesFile), `Missing Batch 31 product image manifest: ${batch31ProductImagesFile}`)
const batch31ProductImages = readJson(batch31ProductImagesFile)
expect(
  batch31ProductImages.batchId === batch31ProductImagesBatchId,
  `batch31 product image manifest batchId must be ${batch31ProductImagesBatchId}.`,
)
expect(batch31ProductImages.generatedAt === '2026-06-02', 'batch31 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch31ProductImages.images), 'batch31 product image manifest images must be an array.')
expect(batch31ProductImages.images.length === 1, `Expected 1 Batch 31 product image, found ${batch31ProductImages.images.length}.`)
validateBatch31ProductImage(batch31ProductImages.images[0])

expect(existsSync(batch32ProductImagesFile), `Missing Batch 32 product image manifest: ${batch32ProductImagesFile}`)
const batch32ProductImages = readJson(batch32ProductImagesFile)
expect(
  batch32ProductImages.batchId === batch32ProductImagesBatchId,
  `batch32 product image manifest batchId must be ${batch32ProductImagesBatchId}.`,
)
expect(batch32ProductImages.generatedAt === '2026-06-02', 'batch32 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch32ProductImages.images), 'batch32 product image manifest images must be an array.')
expect(batch32ProductImages.images.length === 1, `Expected 1 Batch 32 product image, found ${batch32ProductImages.images.length}.`)
validateBatch32ProductImage(batch32ProductImages.images[0])

expect(existsSync(batch33ProductImagesFile), `Missing Batch 33 product image manifest: ${batch33ProductImagesFile}`)
const batch33ProductImages = readJson(batch33ProductImagesFile)
expect(
  batch33ProductImages.batchId === batch33ProductImagesBatchId,
  `batch33 product image manifest batchId must be ${batch33ProductImagesBatchId}.`,
)
expect(batch33ProductImages.generatedAt === '2026-06-02', 'batch33 product image manifest generatedAt must be 2026-06-02.')
expect(Array.isArray(batch33ProductImages.images), 'batch33 product image manifest images must be an array.')
expect(batch33ProductImages.images.length === 1, `Expected 1 Batch 33 product image, found ${batch33ProductImages.images.length}.`)
validateBatch33ProductImage(batch33ProductImages.images[0])

expect(existsSync(batch34ProductImagesFile), `Missing Batch 34 product image manifest: ${batch34ProductImagesFile}`)
const batch34ProductImages = readJson(batch34ProductImagesFile)
expect(
  batch34ProductImages.batchId === batch34ProductImagesBatchId,
  `batch34 product image manifest batchId must be ${batch34ProductImagesBatchId}.`,
)
expect(batch34ProductImages.generatedAt === '2026-06-03', 'batch34 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch34ProductImages.images), 'batch34 product image manifest images must be an array.')
expect(batch34ProductImages.images.length === 1, `Expected 1 Batch 34 product image, found ${batch34ProductImages.images.length}.`)
validateBatch34ProductImage(batch34ProductImages.images[0])

expect(existsSync(batch35ProductImagesFile), `Missing Batch 35 product image manifest: ${batch35ProductImagesFile}`)
const batch35ProductImages = readJson(batch35ProductImagesFile)
expect(
  batch35ProductImages.batchId === batch35ProductImagesBatchId,
  `batch35 product image manifest batchId must be ${batch35ProductImagesBatchId}.`,
)
expect(batch35ProductImages.generatedAt === '2026-06-03', 'batch35 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch35ProductImages.images), 'batch35 product image manifest images must be an array.')
expect(batch35ProductImages.images.length === 1, `Expected 1 Batch 35 product image, found ${batch35ProductImages.images.length}.`)
validateBatch35ProductImage(batch35ProductImages.images[0])

expect(existsSync(batch36ProductImagesFile), `Missing Batch 36 product image manifest: ${batch36ProductImagesFile}`)
const batch36ProductImages = readJson(batch36ProductImagesFile)
expect(
  batch36ProductImages.batchId === batch36ProductImagesBatchId,
  `batch36 product image manifest batchId must be ${batch36ProductImagesBatchId}.`,
)
expect(batch36ProductImages.generatedAt === '2026-06-03', 'batch36 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch36ProductImages.images), 'batch36 product image manifest images must be an array.')
expect(batch36ProductImages.images.length === 1, `Expected 1 Batch 36 product image, found ${batch36ProductImages.images.length}.`)
validateBatch36ProductImage(batch36ProductImages.images[0])

expect(existsSync(batch37ProductImagesFile), `Missing Batch 37 product image manifest: ${batch37ProductImagesFile}`)
const batch37ProductImages = readJson(batch37ProductImagesFile)
expect(
  batch37ProductImages.batchId === batch37ProductImagesBatchId,
  `batch37 product image manifest batchId must be ${batch37ProductImagesBatchId}.`,
)
expect(batch37ProductImages.generatedAt === '2026-06-03', 'batch37 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch37ProductImages.images), 'batch37 product image manifest images must be an array.')
expect(batch37ProductImages.images.length === 1, `Expected 1 Batch 37 product image, found ${batch37ProductImages.images.length}.`)
validateBatch37ProductImage(batch37ProductImages.images[0])

expect(existsSync(batch38ProductImagesFile), `Missing Batch 38 product image manifest: ${batch38ProductImagesFile}`)
const batch38ProductImages = readJson(batch38ProductImagesFile)
expect(
  batch38ProductImages.batchId === batch38ProductImagesBatchId,
  `batch38 product image manifest batchId must be ${batch38ProductImagesBatchId}.`,
)
expect(batch38ProductImages.generatedAt === '2026-06-03', 'batch38 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch38ProductImages.images), 'batch38 product image manifest images must be an array.')
expect(batch38ProductImages.images.length === 1, `Expected 1 Batch 38 product image, found ${batch38ProductImages.images.length}.`)
validateBatch38ProductImage(batch38ProductImages.images[0])

expect(existsSync(batch39ProductImagesFile), `Missing Batch 39 product image manifest: ${batch39ProductImagesFile}`)
const batch39ProductImages = readJson(batch39ProductImagesFile)
expect(
  batch39ProductImages.batchId === batch39ProductImagesBatchId,
  `batch39 product image manifest batchId must be ${batch39ProductImagesBatchId}.`,
)
expect(batch39ProductImages.generatedAt === '2026-06-03', 'batch39 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch39ProductImages.images), 'batch39 product image manifest images must be an array.')
expect(batch39ProductImages.images.length === 1, `Expected 1 Batch 39 product image, found ${batch39ProductImages.images.length}.`)
validateBatch39ProductImage(batch39ProductImages.images[0])

expect(existsSync(batch40ProductImagesFile), `Missing Batch 40 product image manifest: ${batch40ProductImagesFile}`)
const batch40ProductImages = readJson(batch40ProductImagesFile)
expect(
  batch40ProductImages.batchId === batch40ProductImagesBatchId,
  `batch40 product image manifest batchId must be ${batch40ProductImagesBatchId}.`,
)
expect(batch40ProductImages.generatedAt === '2026-06-03', 'batch40 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch40ProductImages.images), 'batch40 product image manifest images must be an array.')
expect(batch40ProductImages.images.length === 1, `Expected 1 Batch 40 product image, found ${batch40ProductImages.images.length}.`)
validateBatch40ProductImage(batch40ProductImages.images[0])

expect(existsSync(batch41ProductImagesFile), `Missing Batch 41 product image manifest: ${batch41ProductImagesFile}`)
const batch41ProductImages = readJson(batch41ProductImagesFile)
expect(
  batch41ProductImages.batchId === batch41ProductImagesBatchId,
  `batch41 product image manifest batchId must be ${batch41ProductImagesBatchId}.`,
)
expect(batch41ProductImages.generatedAt === '2026-06-03', 'batch41 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch41ProductImages.images), 'batch41 product image manifest images must be an array.')
expect(batch41ProductImages.images.length === 1, `Expected 1 Batch 41 product image, found ${batch41ProductImages.images.length}.`)
validateBatch41ProductImage(batch41ProductImages.images[0])

expect(existsSync(batch42ProductImagesFile), `Missing Batch 42 product image manifest: ${batch42ProductImagesFile}`)
const batch42ProductImages = readJson(batch42ProductImagesFile)
expect(
  batch42ProductImages.batchId === batch42ProductImagesBatchId,
  `batch42 product image manifest batchId must be ${batch42ProductImagesBatchId}.`,
)
expect(batch42ProductImages.generatedAt === '2026-06-03', 'batch42 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch42ProductImages.images), 'batch42 product image manifest images must be an array.')
expect(batch42ProductImages.images.length === 1, `Expected 1 Batch 42 product image, found ${batch42ProductImages.images.length}.`)
validateBatch42ProductImage(batch42ProductImages.images[0])

expect(existsSync(batch43ProductImagesFile), `Missing Batch 43 product image manifest: ${batch43ProductImagesFile}`)
const batch43ProductImages = readJson(batch43ProductImagesFile)
expect(
  batch43ProductImages.batchId === batch43ProductImagesBatchId,
  `batch43 product image manifest batchId must be ${batch43ProductImagesBatchId}.`,
)
expect(batch43ProductImages.generatedAt === '2026-06-03', 'batch43 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch43ProductImages.images), 'batch43 product image manifest images must be an array.')
expect(batch43ProductImages.images.length === 1, `Expected 1 Batch 43 product image, found ${batch43ProductImages.images.length}.`)
validateBatch43ProductImage(batch43ProductImages.images[0])

expect(existsSync(batch44ProductImagesFile), `Missing Batch 44 product image manifest: ${batch44ProductImagesFile}`)
const batch44ProductImages = readJson(batch44ProductImagesFile)
expect(
  batch44ProductImages.batchId === batch44ProductImagesBatchId,
  `batch44 product image manifest batchId must be ${batch44ProductImagesBatchId}.`,
)
expect(batch44ProductImages.generatedAt === '2026-06-03', 'batch44 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch44ProductImages.images), 'batch44 product image manifest images must be an array.')
expect(batch44ProductImages.images.length === 1, `Expected 1 Batch 44 product image, found ${batch44ProductImages.images.length}.`)
validateBatch44ProductImage(batch44ProductImages.images[0])

expect(existsSync(batch45ProductImagesFile), `Missing Batch 45 product image manifest: ${batch45ProductImagesFile}`)
const batch45ProductImages = readJson(batch45ProductImagesFile)
expect(
  batch45ProductImages.batchId === batch45ProductImagesBatchId,
  `batch45 product image manifest batchId must be ${batch45ProductImagesBatchId}.`,
)
expect(batch45ProductImages.generatedAt === '2026-06-03', 'batch45 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch45ProductImages.images), 'batch45 product image manifest images must be an array.')
expect(batch45ProductImages.images.length === 1, `Expected 1 Batch 45 product image, found ${batch45ProductImages.images.length}.`)
validateBatch45ProductImage(batch45ProductImages.images[0])

expect(existsSync(batch46ProductImagesFile), `Missing Batch 46 product image manifest: ${batch46ProductImagesFile}`)
const batch46ProductImages = readJson(batch46ProductImagesFile)
expect(
  batch46ProductImages.batchId === batch46ProductImagesBatchId,
  `batch46 product image manifest batchId must be ${batch46ProductImagesBatchId}.`,
)
expect(batch46ProductImages.generatedAt === '2026-06-03', 'batch46 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch46ProductImages.images), 'batch46 product image manifest images must be an array.')
expect(batch46ProductImages.images.length === 1, `Expected 1 Batch 46 product image, found ${batch46ProductImages.images.length}.`)
validateBatch46ProductImage(batch46ProductImages.images[0])

expect(existsSync(batch47ProductImagesFile), `Missing Batch 47 product image manifest: ${batch47ProductImagesFile}`)
const batch47ProductImages = readJson(batch47ProductImagesFile)
expect(
  batch47ProductImages.batchId === batch47ProductImagesBatchId,
  `batch47 product image manifest batchId must be ${batch47ProductImagesBatchId}.`,
)
expect(batch47ProductImages.generatedAt === '2026-06-03', 'batch47 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch47ProductImages.images), 'batch47 product image manifest images must be an array.')
expect(batch47ProductImages.images.length === 1, `Expected 1 Batch 47 product image, found ${batch47ProductImages.images.length}.`)
validateBatch47ProductImage(batch47ProductImages.images[0])

expect(existsSync(batch48ProductImagesFile), `Missing Batch 48 product image manifest: ${batch48ProductImagesFile}`)
const batch48ProductImages = readJson(batch48ProductImagesFile)
expect(
  batch48ProductImages.batchId === batch48ProductImagesBatchId,
  `batch48 product image manifest batchId must be ${batch48ProductImagesBatchId}.`,
)
expect(batch48ProductImages.generatedAt === '2026-06-03', 'batch48 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch48ProductImages.images), 'batch48 product image manifest images must be an array.')
expect(batch48ProductImages.images.length === 1, `Expected 1 Batch 48 product image, found ${batch48ProductImages.images.length}.`)
validateBatch48ProductImage(batch48ProductImages.images[0])

expect(existsSync(batch49ProductImagesFile), `Missing Batch 49 product image manifest: ${batch49ProductImagesFile}`)
const batch49ProductImages = readJson(batch49ProductImagesFile)
expect(
  batch49ProductImages.batchId === batch49ProductImagesBatchId,
  `batch49 product image manifest batchId must be ${batch49ProductImagesBatchId}.`,
)
expect(batch49ProductImages.generatedAt === '2026-06-03', 'batch49 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch49ProductImages.images), 'batch49 product image manifest images must be an array.')
expect(batch49ProductImages.images.length === 1, `Expected 1 Batch 49 product image, found ${batch49ProductImages.images.length}.`)
validateBatch49ProductImage(batch49ProductImages.images[0])

expect(existsSync(batch50WorldImagesFile), `Missing Batch 50 world image manifest: ${batch50WorldImagesFile}`)
const batch50WorldImages = readJson(batch50WorldImagesFile)
expect(
  batch50WorldImages.batchId === batch50WorldImagesBatchId,
  `batch50 world image manifest batchId must be ${batch50WorldImagesBatchId}.`,
)
expect(batch50WorldImages.generatedAt === '2026-06-03', 'batch50 world image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch50WorldImages.images), 'batch50 world image manifest images must be an array.')
expect(batch50WorldImages.images.length === 7, `Expected 7 Batch 50 world images, found ${batch50WorldImages.images.length}.`)
const batch50WorldImageSlugs = new Set()
batch50WorldImages.images.forEach((image) =>
  validateBatch50WorldImage(image, batch50WorldImageSlugs, worldSlugs, worldSources),
)
for (const expectedSlug of [
  'sticker-station-mail-cart',
  'mitten-market-lost-ticket',
  'paperclip-plaza-parcel-day',
  'compost-clock-workshop',
  'orchard-pulley-post',
  'pond-bridge-blueprint-club',
  'chapter-gate-greenhouse',
]) {
  expect(batch50WorldImageSlugs.has(expectedSlug), `Batch 50 world images missing ${expectedSlug}.`)
}

expect(existsSync(batch50ProductImagesFile), `Missing Batch 50 product image manifest: ${batch50ProductImagesFile}`)
const batch50ProductImages = readJson(batch50ProductImagesFile)
expect(
  batch50ProductImages.batchId === batch50ProductImagesBatchId,
  `batch50 product image manifest batchId must be ${batch50ProductImagesBatchId}.`,
)
expect(batch50ProductImages.generatedAt === '2026-06-03', 'batch50 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch50ProductImages.images), 'batch50 product image manifest images must be an array.')
expect(batch50ProductImages.images.length === 1, `Expected 1 Batch 50 product image, found ${batch50ProductImages.images.length}.`)
validateBatch50ProductImage(batch50ProductImages.images[0])

expect(existsSync(batch51ProductImagesFile), `Missing Batch 51 product image manifest: ${batch51ProductImagesFile}`)
const batch51ProductImages = readJson(batch51ProductImagesFile)
expect(
  batch51ProductImages.batchId === batch51ProductImagesBatchId,
  `batch51 product image manifest batchId must be ${batch51ProductImagesBatchId}.`,
)
expect(batch51ProductImages.generatedAt === '2026-06-03', 'batch51 product image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch51ProductImages.images), 'batch51 product image manifest images must be an array.')
expect(batch51ProductImages.images.length === 1, `Expected 1 Batch 51 product image, found ${batch51ProductImages.images.length}.`)
validateBatch51ProductImage(batch51ProductImages.images[0])

expect(existsSync(batch52ImagesFile), `Missing Batch 52 image manifest: ${batch52ImagesFile}`)
const batch52Images = readJson(batch52ImagesFile)
expect(
  batch52Images.batchId === batch52ImagesBatchId,
  `batch52 image manifest batchId must be ${batch52ImagesBatchId}.`,
)
expect(batch52Images.generatedAt === '2026-06-03', 'batch52 image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch52Images.images), 'batch52 image manifest images must be an array.')
expect(batch52Images.images.length === 2, `Expected 2 Batch 52 images, found ${batch52Images.images.length}.`)
const batch52ImageSlugs = new Set()
batch52Images.images.forEach((image) => validateBatch52Image(image, batch52ImageSlugs, worldSlugs, worldSources))
for (const expectedSlug of ['blue-pencil-observatory', 'spiral-notebook-story-final-copy-card-pack']) {
  expect(batch52ImageSlugs.has(expectedSlug), `Batch 52 images missing ${expectedSlug}.`)
}

expect(existsSync(batch53ImagesFile), `Missing Batch 53 image manifest: ${batch53ImagesFile}`)
const batch53Images = readJson(batch53ImagesFile)
expect(
  batch53Images.batchId === batch53ImagesBatchId,
  `batch53 image manifest batchId must be ${batch53ImagesBatchId}.`,
)
expect(batch53Images.generatedAt === '2026-06-03', 'batch53 image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch53Images.images), 'batch53 image manifest images must be an array.')
expect(batch53Images.images.length === 2, `Expected 2 Batch 53 images, found ${batch53Images.images.length}.`)
const batch53ImageSlugs = new Set()
batch53Images.images.forEach((image) => validateBatch53Image(image, batch53ImageSlugs, worldSlugs, worldSources))
for (const expectedSlug of ['appendix-archive-lab', 'tabbed-folder-story-series-card-pack']) {
  expect(batch53ImageSlugs.has(expectedSlug), `Batch 53 images missing ${expectedSlug}.`)
}

expect(existsSync(batch54ImagesFile), `Missing Batch 54 image manifest: ${batch54ImagesFile}`)
const batch54Images = readJson(batch54ImagesFile)
expect(
  batch54Images.batchId === batch54ImagesBatchId,
  `batch54 image manifest batchId must be ${batch54ImagesBatchId}.`,
)
expect(batch54Images.generatedAt === '2026-06-03', 'batch54 image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch54Images.images), 'batch54 image manifest images must be an array.')
expect(batch54Images.images.length === 1, `Expected 1 Batch 54 image, found ${batch54Images.images.length}.`)
const batch54ImageSlugs = new Set()
batch54Images.images.forEach((image) => validateBatch54Image(image, batch54ImageSlugs))
expect(
  batch54ImageSlugs.has('accordion-folder-story-arc-card-pack'),
  'Batch 54 images missing accordion-folder-story-arc-card-pack.',
)

expect(existsSync(batch55ImagesFile), `Missing Batch 55 image manifest: ${batch55ImagesFile}`)
const batch55Images = readJson(batch55ImagesFile)
expect(
  batch55Images.batchId === batch55ImagesBatchId,
  `batch55 image manifest batchId must be ${batch55ImagesBatchId}.`,
)
expect(batch55Images.generatedAt === '2026-06-03', 'batch55 image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch55Images.images), 'batch55 image manifest images must be an array.')
expect(batch55Images.images.length === 1, `Expected 1 Batch 55 image, found ${batch55Images.images.length}.`)
const batch55ImageSlugs = new Set()
batch55Images.images.forEach((image) => validateBatch55Image(image, batch55ImageSlugs))
expect(
  batch55ImageSlugs.has('expanding-file-story-scene-chain-card-pack'),
  'Batch 55 images missing expanding-file-story-scene-chain-card-pack.',
)
const batch55ImagePaths = batch55Images.images.flatMap((image) => [
  resolve(root, image.outputJpeg),
  resolve(root, image.outputWebp),
  resolve(root, image.sidecar),
])

expect(existsSync(batch56ImagesFile), `Missing Batch 56 image manifest: ${batch56ImagesFile}`)
const batch56Images = readJson(batch56ImagesFile)
expect(
  batch56Images.batchId === batch56ImagesBatchId,
  `batch56 image manifest batchId must be ${batch56ImagesBatchId}.`,
)
expect(batch56Images.generatedAt === '2026-06-03', 'batch56 image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch56Images.images), 'batch56 image manifest images must be an array.')
expect(batch56Images.images.length === 1, `Expected 1 Batch 56 image, found ${batch56Images.images.length}.`)
const batch56ImageSlugs = new Set()
batch56Images.images.forEach((image) => validateBatch56Image(image, batch56ImageSlugs))
expect(
  batch56ImageSlugs.has('manila-folder-story-clue-trail-card-pack'),
  'Batch 56 images missing manila-folder-story-clue-trail-card-pack.',
)
const batch56ImagePaths = batch56Images.images.flatMap((image) => [
  resolve(root, image.outputJpeg),
  resolve(root, image.outputWebp),
  resolve(root, image.sidecar),
])

expect(existsSync(batch57ImagesFile), `Missing Batch 57 image manifest: ${batch57ImagesFile}`)
const batch57Images = readJson(batch57ImagesFile)
expect(
  batch57Images.batchId === batch57ImagesBatchId,
  `batch57 image manifest batchId must be ${batch57ImagesBatchId}.`,
)
expect(batch57Images.generatedAt === '2026-06-03', 'batch57 image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch57Images.images), 'batch57 image manifest images must be an array.')
expect(batch57Images.images.length === 1, `Expected 1 Batch 57 image, found ${batch57Images.images.length}.`)
const batch57ImageSlugs = new Set()
batch57Images.images.forEach((image) => validateBatch57Image(image, batch57ImageSlugs))
expect(
  batch57ImageSlugs.has('pocket-folder-story-goal-path-card-pack'),
  'Batch 57 images missing pocket-folder-story-goal-path-card-pack.',
)
const batch57ImagePaths = batch57Images.images.flatMap((image) => [
  resolve(root, image.outputJpeg),
  resolve(root, image.outputWebp),
  resolve(root, image.sidecar),
])

expect(existsSync(batch58ImagesFile), `Missing Batch 58 image manifest: ${batch58ImagesFile}`)
const batch58Images = readJson(batch58ImagesFile)
expect(
  batch58Images.batchId === batch58ImagesBatchId,
  `batch58 image manifest batchId must be ${batch58ImagesBatchId}.`,
)
expect(batch58Images.generatedAt === '2026-06-03', 'batch58 image manifest generatedAt must be 2026-06-03.')
expect(Array.isArray(batch58Images.images), 'batch58 image manifest images must be an array.')
expect(batch58Images.images.length === 1, `Expected 1 Batch 58 image, found ${batch58Images.images.length}.`)
const batch58ImageSlugs = new Set()
batch58Images.images.forEach((image) => validateBatch58Image(image, batch58ImageSlugs))
expect(
  batch58ImageSlugs.has('hanging-file-story-decision-point-card-pack'),
  'Batch 58 images missing hanging-file-story-decision-point-card-pack.',
)
const batch58ImagePaths = batch58Images.images.flatMap((image) => [
  resolve(root, image.outputJpeg),
  resolve(root, image.outputWebp),
  resolve(root, image.sidecar),
])

expect(existsSync(batch59ImagesFile), `Missing Batch 59 image manifest: ${batch59ImagesFile}`)
const batch59Images = readJson(batch59ImagesFile)
expect(
  batch59Images.batchId === batch59ImagesBatchId,
  `batch59 image manifest batchId must be ${batch59ImagesBatchId}.`,
)
expect(batch59Images.generatedAt === '2026-06-04', 'batch59 image manifest generatedAt must be 2026-06-04.')
expect(Array.isArray(batch59Images.images), 'batch59 image manifest images must be an array.')
expect(batch59Images.images.length === 1, `Expected 1 Batch 59 image, found ${batch59Images.images.length}.`)
const batch59ImageSlugs = new Set()
batch59Images.images.forEach((image) => validateBatch59Image(image, batch59ImageSlugs))
expect(
  batch59ImageSlugs.has('file-box-story-turning-point-card-pack'),
  'Batch 59 images missing file-box-story-turning-point-card-pack.',
)
const batch59ImagePaths = batch59Images.images.flatMap((image) => [
  resolve(root, image.outputJpeg),
  resolve(root, image.outputWebp),
  resolve(root, image.sidecar),
])

expect(existsSync(batch60ImagesFile), `Missing Batch 60 image manifest: ${batch60ImagesFile}`)
const batch60Images = readJson(batch60ImagesFile)
expect(
  batch60Images.batchId === batch60ImagesBatchId,
  `batch60 image manifest batchId must be ${batch60ImagesBatchId}.`,
)
expect(batch60Images.generatedAt === '2026-06-04', 'batch60 image manifest generatedAt must be 2026-06-04.')
expect(Array.isArray(batch60Images.images), 'batch60 image manifest images must be an array.')
expect(batch60Images.images.length === 1, `Expected 1 Batch 60 image, found ${batch60Images.images.length}.`)
const batch60ImageSlugs = new Set()
batch60Images.images.forEach((image) => validateBatch60Image(image, batch60ImageSlugs))
expect(
  batch60ImageSlugs.has('archive-drawer-story-resolution-card-pack'),
  'Batch 60 images missing archive-drawer-story-resolution-card-pack.',
)
const batch60ImagePaths = batch60Images.images.flatMap((image) => [
  resolve(root, image.outputJpeg),
  resolve(root, image.outputWebp),
  resolve(root, image.sidecar),
])

expect(existsSync(batch61ImagesFile), `Missing Batch 61 image manifest: ${batch61ImagesFile}`)
const batch61Images = readJson(batch61ImagesFile)
expect(
  batch61Images.batchId === batch61ImagesBatchId,
  `batch61 image manifest batchId must be ${batch61ImagesBatchId}.`,
)
expect(batch61Images.generatedAt === '2026-06-04', 'batch61 image manifest generatedAt must be 2026-06-04.')
expect(Array.isArray(batch61Images.images), 'batch61 image manifest images must be an array.')
expect(batch61Images.images.length === 1, `Expected 1 Batch 61 image, found ${batch61Images.images.length}.`)
const batch61ImageSlugs = new Set()
batch61Images.images.forEach((image) => validateBatch61Image(image, batch61ImageSlugs))
expect(
  batch61ImageSlugs.has('card-catalog-story-retell-card-pack'),
  'Batch 61 images missing card-catalog-story-retell-card-pack.',
)
const batch61ImagePaths = batch61Images.images.flatMap((image) => [
  resolve(root, image.outputJpeg),
  resolve(root, image.outputWebp),
  resolve(root, image.sidecar),
])

expect(existsSync(batch62ImagesFile), `Missing Batch 62 image manifest: ${batch62ImagesFile}`)
const batch62Images = readJson(batch62ImagesFile)
expect(
  batch62Images.batchId === batch62ImagesBatchId,
  `batch62 image manifest batchId must be ${batch62ImagesBatchId}.`,
)
expect(batch62Images.generatedAt === '2026-06-04', 'batch62 image manifest generatedAt must be 2026-06-04.')
expect(Array.isArray(batch62Images.images), 'batch62 image manifest images must be an array.')
expect(batch62Images.images.length === 1, `Expected 1 Batch 62 image, found ${batch62Images.images.length}.`)
const batch62ImageSlugs = new Set()
batch62Images.images.forEach((image) => validateBatch62Image(image, batch62ImageSlugs))
expect(
  batch62ImageSlugs.has('library-pocket-story-summary-card-pack'),
  'Batch 62 images missing library-pocket-story-summary-card-pack.',
)
const batch62ImagePaths = batch62Images.images.flatMap((image) => [
  resolve(root, image.outputJpeg),
  resolve(root, image.outputWebp),
  resolve(root, image.sidecar),
])

expect(existsSync(productsFile), `Missing Batch 5 products file: ${productsFile}`)
const products = readJson(productsFile)
expect(products.batchId === productsBatchId, `batch5-products.json.batchId must be ${productsBatchId}.`)
expect(products.generatedAt === '2026-06-02', 'batch5-products.json.generatedAt must be 2026-06-02.')
expect(Array.isArray(products.products), 'batch5-products.json.products must be an array.')
expect(products.products.length === 55, `Expected 55 product records, found ${products.products.length}.`)
const productSlugs = new Set()
let batch55GeneratedOutputPaths = [...batch55ImagePaths]
const batch55ProductRecord = products.products.find(
  (product) => product.slug === 'expanding-file-story-scene-chain-card-pack',
)
if (batch55ProductRecord) {
  batch55GeneratedOutputPaths.push(resolve(root, 'public', batch55ProductRecord.slug, 'index.html'))
}
const productArtifactPathForGeneration = resolve(root, 'content', 'product-artifacts', 'expanding-file-story-scene-chain-card-pack.json')
if (existsSync(productArtifactPathForGeneration)) {
  const artifactSourceForGeneration = readJson(productArtifactPathForGeneration)
  batch55GeneratedOutputPaths.push(
    ...Object.values(artifactSourceForGeneration.artifact ?? {}).map((relativePath) => resolve(root, relativePath)),
  )
}
const batch55GenerationStarted = anyPathExists(batch55GeneratedOutputPaths)
let batch56GeneratedOutputPaths = [...batch56ImagePaths]
const batch56ProductRecord = products.products.find(
  (product) => product.slug === 'manila-folder-story-clue-trail-card-pack',
)
if (batch56ProductRecord) {
  batch56GeneratedOutputPaths.push(resolve(root, 'public', batch56ProductRecord.slug, 'index.html'))
}
const batch56ProductArtifactPathForGeneration = resolve(root, 'content', 'product-artifacts', 'manila-folder-story-clue-trail-card-pack.json')
if (existsSync(batch56ProductArtifactPathForGeneration)) {
  const artifactSourceForGeneration = readJson(batch56ProductArtifactPathForGeneration)
  batch56GeneratedOutputPaths.push(
    ...Object.values(artifactSourceForGeneration.artifact ?? {}).map((relativePath) => resolve(root, relativePath)),
  )
}
const batch56GenerationStarted = anyPathExists(batch56GeneratedOutputPaths)
let batch57GeneratedOutputPaths = [...batch57ImagePaths]
const batch57ProductRecord = products.products.find(
  (product) => product.slug === 'pocket-folder-story-goal-path-card-pack',
)
if (batch57ProductRecord) {
  batch57GeneratedOutputPaths.push(resolve(root, 'public', batch57ProductRecord.slug, 'index.html'))
}
const batch57ProductArtifactPathForGeneration = resolve(root, 'content', 'product-artifacts', 'pocket-folder-story-goal-path-card-pack.json')
if (existsSync(batch57ProductArtifactPathForGeneration)) {
  const artifactSourceForGeneration = readJson(batch57ProductArtifactPathForGeneration)
  batch57GeneratedOutputPaths.push(
    ...Object.values(artifactSourceForGeneration.artifact ?? {}).map((relativePath) => resolve(root, relativePath)),
  )
}
const batch57GenerationStarted = anyPathExists(batch57GeneratedOutputPaths)
let batch58GeneratedOutputPaths = [...batch58ImagePaths]
const batch58ProductRecord = products.products.find(
  (product) => product.slug === 'hanging-file-story-decision-point-card-pack',
)
if (batch58ProductRecord) {
  batch58GeneratedOutputPaths.push(resolve(root, 'public', batch58ProductRecord.slug, 'index.html'))
}
const batch58ProductArtifactPathForGeneration = resolve(
  root,
  'content',
  'product-artifacts',
  'hanging-file-story-decision-point-card-pack.json',
)
if (existsSync(batch58ProductArtifactPathForGeneration)) {
  const artifactSourceForGeneration = readJson(batch58ProductArtifactPathForGeneration)
  batch58GeneratedOutputPaths.push(
    ...Object.values(artifactSourceForGeneration.artifact ?? {}).map((relativePath) => resolve(root, relativePath)),
  )
}
const batch58GenerationStarted = anyPathExists(batch58GeneratedOutputPaths)
let batch59GeneratedOutputPaths = [...batch59ImagePaths]
const batch59ProductRecord = products.products.find(
  (product) => product.slug === 'file-box-story-turning-point-card-pack',
)
if (batch59ProductRecord) {
  batch59GeneratedOutputPaths.push(resolve(root, 'public', batch59ProductRecord.slug, 'index.html'))
}
const batch59ProductArtifactPathForGeneration = resolve(
  root,
  'content',
  'product-artifacts',
  'file-box-story-turning-point-card-pack.json',
)
if (existsSync(batch59ProductArtifactPathForGeneration)) {
  const artifactSourceForGeneration = readJson(batch59ProductArtifactPathForGeneration)
  batch59GeneratedOutputPaths.push(
    ...Object.values(artifactSourceForGeneration.artifact ?? {}).map((relativePath) => resolve(root, relativePath)),
  )
}
const batch59GenerationStarted = anyPathExists(batch59GeneratedOutputPaths)
let batch60GeneratedOutputPaths = [...batch60ImagePaths]
const batch60ProductRecord = products.products.find(
  (product) => product.slug === 'archive-drawer-story-resolution-card-pack',
)
if (batch60ProductRecord) {
  batch60GeneratedOutputPaths.push(resolve(root, 'public', batch60ProductRecord.slug, 'index.html'))
}
const batch60ProductArtifactPathForGeneration = resolve(
  root,
  'content',
  'product-artifacts',
  'archive-drawer-story-resolution-card-pack.json',
)
if (existsSync(batch60ProductArtifactPathForGeneration)) {
  const artifactSourceForGeneration = readJson(batch60ProductArtifactPathForGeneration)
  batch60GeneratedOutputPaths.push(
    ...Object.values(artifactSourceForGeneration.artifact ?? {}).map((relativePath) => resolve(root, relativePath)),
  )
}
const batch60GenerationStarted = anyPathExists(batch60GeneratedOutputPaths)
if (batch60GenerationStarted) {
  for (const imagePath of batch60ImagePaths) {
    expect(
      existsSync(imagePath),
      `Batch 60 generated image output is missing after Batch 60 generated outputs started: ${imagePath}`,
    )
  }
}
let batch61GeneratedOutputPaths = [...batch61ImagePaths]
const batch61ProductRecord = products.products.find(
  (product) => product.slug === 'card-catalog-story-retell-card-pack',
)
if (batch61ProductRecord) {
  batch61GeneratedOutputPaths.push(resolve(root, 'public', batch61ProductRecord.slug, 'index.html'))
}
const batch61ProductArtifactPathForGeneration = resolve(
  root,
  'content',
  'product-artifacts',
  'card-catalog-story-retell-card-pack.json',
)
if (existsSync(batch61ProductArtifactPathForGeneration)) {
  const artifactSourceForGeneration = readJson(batch61ProductArtifactPathForGeneration)
  batch61GeneratedOutputPaths.push(
    ...Object.values(artifactSourceForGeneration.artifact ?? {}).map((relativePath) => resolve(root, relativePath)),
  )
}
const batch61GenerationStarted = anyPathExists(batch61GeneratedOutputPaths)
if (batch61GenerationStarted) {
  for (const imagePath of batch61ImagePaths) {
    expect(
      existsSync(imagePath),
      `Batch 61 generated image output is missing after Batch 61 generated outputs started: ${imagePath}`,
    )
  }
}
let batch62GeneratedOutputPaths = [...batch62ImagePaths]
const batch62ProductRecord = products.products.find(
  (product) => product.slug === 'library-pocket-story-summary-card-pack',
)
if (batch62ProductRecord) {
  batch62GeneratedOutputPaths.push(resolve(root, 'public', batch62ProductRecord.slug, 'index.html'))
}
const batch62ProductArtifactPathForGeneration = resolve(
  root,
  'content',
  'product-artifacts',
  'library-pocket-story-summary-card-pack.json',
)
if (existsSync(batch62ProductArtifactPathForGeneration)) {
  const artifactSourceForGeneration = readJson(batch62ProductArtifactPathForGeneration)
  batch62GeneratedOutputPaths.push(
    ...Object.values(artifactSourceForGeneration.artifact ?? {}).map((relativePath) => resolve(root, relativePath)),
  )
}
const batch62GenerationStarted = anyPathExists(batch62GeneratedOutputPaths)
if (batch62GenerationStarted) {
  for (const imagePath of batch62ImagePaths) {
    expect(
      existsSync(imagePath),
      `Batch 62 generated image output is missing after Batch 62 generated outputs started: ${imagePath}`,
    )
  }
}
products.products.forEach((product) =>
  validateProduct(product, productSlugs, worldSlugs, {
    batch55GenerationStarted,
    batch56GenerationStarted,
    batch57GenerationStarted,
    batch58GenerationStarted,
    batch59GenerationStarted,
    batch60GenerationStarted,
    batch61GenerationStarted,
    batch62GenerationStarted,
  }),
)
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

expect(existsSync(grandparentVisitSourceFile), `Missing Batch 21 Grandparent Story Visit source file: ${grandparentVisitSourceFile}`)
const grandparentVisitSource = readJson(grandparentVisitSourceFile)
expect(
  grandparentVisitSource.batchId === grandparentVisitBatchId,
  `Grandparent Story Visit source batchId must be ${grandparentVisitBatchId}.`,
)
const grandparentVisitProduct = products.products.find((product) => product.slug === 'grandparent-story-visit-kit')
expect(grandparentVisitProduct, 'Missing Grandparent Story Visit product record for Batch 21 artifact validation.')
const grandparentVisitSourceErrors = validateGrandparentStoryVisitKitSource(
  grandparentVisitSource,
  grandparentVisitProduct,
  worldAgeBands,
)
expect(
  grandparentVisitSourceErrors.length === 0,
  `Grandparent Story Visit Kit source failed validation:\n${grandparentVisitSourceErrors.join('\n')}`,
)
const grandparentVisitSourceFileErrors = validateGrandparentStoryVisitKitSourceFiles(grandparentVisitSource, root)
expect(
  grandparentVisitSourceFileErrors.length === 0,
  `Grandparent Story Visit Kit sourceFiles failed validation:\n${grandparentVisitSourceFileErrors.join('\n')}`,
)
const grandparentVisitExpectedPdfPages = grandparentVisitSource.visitQuests.length + 5
const grandparentVisitArtifactStatus = inspectArtifactFiles(root, grandparentVisitSource.artifact, {
  expectedPdfPages: grandparentVisitExpectedPdfPages,
})
expect(
  grandparentVisitArtifactStatus.valid,
  `Grandparent Story Visit Kit artifacts failed validation:\n${grandparentVisitArtifactStatus.errors.join('\n')}`,
)
expect(
  grandparentVisitArtifactStatus.files.pdf.size > 100_000,
  `Grandparent Story Visit Kit PDF artifact is unexpectedly small: ${grandparentVisitArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  grandparentVisitArtifactStatus.files.pdf.pageCount === grandparentVisitExpectedPdfPages,
  `Grandparent Story Visit Kit PDF artifact must have ${grandparentVisitExpectedPdfPages} pages.`,
)
expect(
  grandparentVisitArtifactStatus.files.zip.size > grandparentVisitArtifactStatus.files.pdf.size,
  'Grandparent Story Visit Kit ZIP artifact should include the PDF plus source HTML and image assets.',
)
const grandparentVisitCheckoutErrors = validateCheckoutReadiness(grandparentVisitProduct, grandparentVisitArtifactStatus)
expect(
  grandparentVisitCheckoutErrors.length === 0,
  `Grandparent Story Visit Kit checkout readiness failed validation:\n${grandparentVisitCheckoutErrors.join('\n')}`,
)
const grandparentVisitArtifactManifest = readJson(resolve(root, grandparentVisitSource.artifact.manifestPath))
expect(
  grandparentVisitArtifactManifest.sourcePageCount === grandparentVisitSource.visitQuests.length,
  'Grandparent Story Visit Kit artifact manifest sourcePageCount must match source visit quests.',
)
expect(
  Array.isArray(grandparentVisitArtifactManifest.files.assets),
  'Grandparent Story Visit Kit artifact manifest files.assets must be an array.',
)
expect(
  grandparentVisitArtifactManifest.files.assets.length === grandparentVisitSource.worldSlugs.length,
  'Grandparent Story Visit Kit artifact manifest must include one copied local image per source world.',
)
const grandparentVisitManifestAssetErrors = validateManifestWorldAssets(
  grandparentVisitSource,
  grandparentVisitArtifactManifest,
)
expect(
  grandparentVisitManifestAssetErrors.length === 0,
  `Grandparent Story Visit Kit artifact manifest image coverage failed validation:\n${grandparentVisitManifestAssetErrors.join('\n')}`,
)
for (const asset of grandparentVisitArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Grandparent Story Visit Kit copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(thankYouSourceFile), `Missing Batch 22 Thank-You Note Story Postcard source file: ${thankYouSourceFile}`)
const thankYouSource = readJson(thankYouSourceFile)
expect(
  thankYouSource.batchId === thankYouBatchId,
  `Thank-You Note Story Postcard Pack source batchId must be ${thankYouBatchId}.`,
)
const thankYouProduct = products.products.find((product) => product.slug === 'thank-you-note-story-postcard-pack')
expect(thankYouProduct, 'Missing Thank-You Note Story Postcard Pack product record for Batch 22 artifact validation.')
const thankYouSourceErrors = validateThankYouNoteStoryPostcardPackSource(
  thankYouSource,
  thankYouProduct,
  worldAgeBands,
)
expect(
  thankYouSourceErrors.length === 0,
  `Thank-You Note Story Postcard Pack source failed validation:\n${thankYouSourceErrors.join('\n')}`,
)
const thankYouSourceFileErrors = validateThankYouNoteStoryPostcardPackSourceFiles(thankYouSource, root)
expect(
  thankYouSourceFileErrors.length === 0,
  `Thank-You Note Story Postcard Pack sourceFiles failed validation:\n${thankYouSourceFileErrors.join('\n')}`,
)
const thankYouExpectedPdfPages = thankYouSource.postcards.length + 5
const thankYouArtifactStatus = inspectArtifactFiles(root, thankYouSource.artifact, {
  expectedPdfPages: thankYouExpectedPdfPages,
})
expect(
  thankYouArtifactStatus.valid,
  `Thank-You Note Story Postcard Pack artifacts failed validation:\n${thankYouArtifactStatus.errors.join('\n')}`,
)
expect(
  thankYouArtifactStatus.files.pdf.size > 100_000,
  `Thank-You Note Story Postcard Pack PDF artifact is unexpectedly small: ${thankYouArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  thankYouArtifactStatus.files.pdf.pageCount === thankYouExpectedPdfPages,
  `Thank-You Note Story Postcard Pack PDF artifact must have ${thankYouExpectedPdfPages} pages.`,
)
expect(
  thankYouArtifactStatus.files.zip.size > thankYouArtifactStatus.files.pdf.size,
  'Thank-You Note Story Postcard Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const thankYouCheckoutErrors = validateCheckoutReadiness(thankYouProduct, thankYouArtifactStatus)
expect(
  thankYouCheckoutErrors.length === 0,
  `Thank-You Note Story Postcard Pack checkout readiness failed validation:\n${thankYouCheckoutErrors.join('\n')}`,
)
const thankYouArtifactManifest = readJson(resolve(root, thankYouSource.artifact.manifestPath))
expect(
  thankYouArtifactManifest.sourcePageCount === thankYouSource.postcards.length,
  'Thank-You Note Story Postcard Pack artifact manifest sourcePageCount must match source postcards.',
)
expect(
  Array.isArray(thankYouArtifactManifest.files.assets),
  'Thank-You Note Story Postcard Pack artifact manifest files.assets must be an array.',
)
expect(
  thankYouArtifactManifest.files.assets.length === thankYouSource.worldSlugs.length,
  'Thank-You Note Story Postcard Pack artifact manifest must include one copied local image per source world.',
)
const thankYouManifestAssetErrors = validateManifestWorldAssets(thankYouSource, thankYouArtifactManifest)
expect(
  thankYouManifestAssetErrors.length === 0,
  `Thank-You Note Story Postcard Pack artifact manifest image coverage failed validation:\n${thankYouManifestAssetErrors.join('\n')}`,
)
for (const asset of thankYouArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Thank-You Note Story Postcard Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(natureWalkSourceFile), `Missing Batch 23 Nature Walk Story Field Notes source file: ${natureWalkSourceFile}`)
const natureWalkSource = readJson(natureWalkSourceFile)
expect(
  natureWalkSource.batchId === natureWalkBatchId,
  `Nature Walk Story Field Notes Kit source batchId must be ${natureWalkBatchId}.`,
)
const natureWalkProduct = products.products.find((product) => product.slug === 'nature-walk-story-field-notes-kit')
expect(natureWalkProduct, 'Missing Nature Walk Story Field Notes Kit product record for Batch 23 artifact validation.')
const natureWalkSourceErrors = validateNatureWalkStoryFieldNotesKitSource(
  natureWalkSource,
  natureWalkProduct,
  worldAgeBands,
)
expect(
  natureWalkSourceErrors.length === 0,
  `Nature Walk Story Field Notes Kit source failed validation:\n${natureWalkSourceErrors.join('\n')}`,
)
const natureWalkSourceFileErrors = validateNatureWalkStoryFieldNotesKitSourceFiles(natureWalkSource, root)
expect(
  natureWalkSourceFileErrors.length === 0,
  `Nature Walk Story Field Notes Kit sourceFiles failed validation:\n${natureWalkSourceFileErrors.join('\n')}`,
)
const natureWalkExpectedPdfPages = natureWalkSource.fieldNotes.length + 5
const natureWalkArtifactStatus = inspectArtifactFiles(root, natureWalkSource.artifact, {
  expectedPdfPages: natureWalkExpectedPdfPages,
})
expect(
  natureWalkArtifactStatus.valid,
  `Nature Walk Story Field Notes Kit artifacts failed validation:\n${natureWalkArtifactStatus.errors.join('\n')}`,
)
expect(
  natureWalkArtifactStatus.files.pdf.size > 100_000,
  `Nature Walk Story Field Notes Kit PDF artifact is unexpectedly small: ${natureWalkArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  natureWalkArtifactStatus.files.pdf.pageCount === natureWalkExpectedPdfPages,
  `Nature Walk Story Field Notes Kit PDF artifact must have ${natureWalkExpectedPdfPages} pages.`,
)
expect(
  natureWalkArtifactStatus.files.zip.size > natureWalkArtifactStatus.files.pdf.size,
  'Nature Walk Story Field Notes Kit ZIP artifact should include the PDF plus source HTML and image assets.',
)
const natureWalkCheckoutErrors = validateCheckoutReadiness(natureWalkProduct, natureWalkArtifactStatus)
expect(
  natureWalkCheckoutErrors.length === 0,
  `Nature Walk Story Field Notes Kit checkout readiness failed validation:\n${natureWalkCheckoutErrors.join('\n')}`,
)
const natureWalkArtifactManifest = readJson(resolve(root, natureWalkSource.artifact.manifestPath))
expect(
  natureWalkArtifactManifest.sourcePageCount === natureWalkSource.fieldNotes.length,
  'Nature Walk Story Field Notes Kit artifact manifest sourcePageCount must match source fieldNotes.',
)
expect(
  Array.isArray(natureWalkArtifactManifest.files.assets),
  'Nature Walk Story Field Notes Kit artifact manifest files.assets must be an array.',
)
expect(
  natureWalkArtifactManifest.files.assets.length === natureWalkSource.worldSlugs.length,
  'Nature Walk Story Field Notes Kit artifact manifest must include one copied local image per source world.',
)
const natureWalkManifestAssetErrors = validateManifestWorldAssets(natureWalkSource, natureWalkArtifactManifest)
expect(
  natureWalkManifestAssetErrors.length === 0,
  `Nature Walk Story Field Notes Kit artifact manifest image coverage failed validation:\n${natureWalkManifestAssetErrors.join('\n')}`,
)
for (const asset of natureWalkArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Nature Walk Story Field Notes Kit copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(backyardSeedSourceFile), `Missing Batch 24 Backyard Story Seed Packet Kit source file: ${backyardSeedSourceFile}`)
const backyardSeedSource = readJson(backyardSeedSourceFile)
expect(
  backyardSeedSource.batchId === backyardSeedBatchId,
  `Backyard Story Seed Packet Kit source batchId must be ${backyardSeedBatchId}.`,
)
const backyardSeedProduct = products.products.find((product) => product.slug === 'backyard-story-seed-packet-kit')
expect(backyardSeedProduct, 'Missing Backyard Story Seed Packet Kit product record for Batch 24 artifact validation.')
const backyardSeedSourceErrors = validateBackyardStorySeedPacketKitSource(
  backyardSeedSource,
  backyardSeedProduct,
  worldAgeBands,
)
expect(
  backyardSeedSourceErrors.length === 0,
  `Backyard Story Seed Packet Kit source failed validation:\n${backyardSeedSourceErrors.join('\n')}`,
)
const backyardSeedSourceFileErrors = validateBackyardStorySeedPacketKitSourceFiles(backyardSeedSource, root)
expect(
  backyardSeedSourceFileErrors.length === 0,
  `Backyard Story Seed Packet Kit sourceFiles failed validation:\n${backyardSeedSourceFileErrors.join('\n')}`,
)
const backyardSeedExpectedPdfPages = backyardSeedSource.seedPackets.length + 5
const backyardSeedArtifactStatus = inspectArtifactFiles(root, backyardSeedSource.artifact, {
  expectedPdfPages: backyardSeedExpectedPdfPages,
})
expect(
  backyardSeedArtifactStatus.valid,
  `Backyard Story Seed Packet Kit artifacts failed validation:\n${backyardSeedArtifactStatus.errors.join('\n')}`,
)
expect(
  backyardSeedArtifactStatus.files.pdf.size > 100_000,
  `Backyard Story Seed Packet Kit PDF artifact is unexpectedly small: ${backyardSeedArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  backyardSeedArtifactStatus.files.pdf.pageCount === backyardSeedExpectedPdfPages,
  `Backyard Story Seed Packet Kit PDF artifact must have ${backyardSeedExpectedPdfPages} pages.`,
)
expect(
  backyardSeedArtifactStatus.files.zip.size > backyardSeedArtifactStatus.files.pdf.size,
  'Backyard Story Seed Packet Kit ZIP artifact should include the PDF plus source HTML and image assets.',
)
const backyardSeedCheckoutErrors = validateCheckoutReadiness(backyardSeedProduct, backyardSeedArtifactStatus)
expect(
  backyardSeedCheckoutErrors.length === 0,
  `Backyard Story Seed Packet Kit checkout readiness failed validation:\n${backyardSeedCheckoutErrors.join('\n')}`,
)
const backyardSeedArtifactManifest = readJson(resolve(root, backyardSeedSource.artifact.manifestPath))
expect(
  backyardSeedArtifactManifest.sourcePageCount === backyardSeedSource.seedPackets.length,
  'Backyard Story Seed Packet Kit artifact manifest sourcePageCount must match source seedPackets.',
)
expect(
  Array.isArray(backyardSeedArtifactManifest.files.assets),
  'Backyard Story Seed Packet Kit artifact manifest files.assets must be an array.',
)
expect(
  backyardSeedArtifactManifest.files.assets.length === backyardSeedSource.worldSlugs.length,
  'Backyard Story Seed Packet Kit artifact manifest must include one copied local image per source world.',
)
const backyardSeedManifestAssetErrors = validateManifestWorldAssets(backyardSeedSource, backyardSeedArtifactManifest)
expect(
  backyardSeedManifestAssetErrors.length === 0,
  `Backyard Story Seed Packet Kit artifact manifest image coverage failed validation:\n${backyardSeedManifestAssetErrors.join('\n')}`,
)
for (const asset of backyardSeedArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Backyard Story Seed Packet Kit copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(kitchenRecipeSourceFile), `Missing Batch 25 Kitchen Table Story Recipe Card Deck source file: ${kitchenRecipeSourceFile}`)
const kitchenRecipeSource = readJson(kitchenRecipeSourceFile)
expect(
  kitchenRecipeSource.batchId === kitchenRecipeBatchId,
  `Kitchen Table Story Recipe Card Deck source batchId must be ${kitchenRecipeBatchId}.`,
)
const kitchenRecipeProduct = products.products.find((product) => product.slug === 'kitchen-table-story-recipe-card-deck')
expect(kitchenRecipeProduct, 'Missing Kitchen Table Story Recipe Card Deck product record for Batch 25 artifact validation.')
const kitchenRecipeSourceErrors = validateKitchenTableStoryRecipeCardDeckSource(
  kitchenRecipeSource,
  kitchenRecipeProduct,
  worldAgeBands,
)
expect(
  kitchenRecipeSourceErrors.length === 0,
  `Kitchen Table Story Recipe Card Deck source failed validation:\n${kitchenRecipeSourceErrors.join('\n')}`,
)
const kitchenRecipeSourceFileErrors = validateKitchenTableStoryRecipeCardDeckSourceFiles(kitchenRecipeSource, root)
expect(
  kitchenRecipeSourceFileErrors.length === 0,
  `Kitchen Table Story Recipe Card Deck sourceFiles failed validation:\n${kitchenRecipeSourceFileErrors.join('\n')}`,
)
const kitchenRecipeExpectedPdfPages = kitchenRecipeSource.recipeCards.length + 5
const kitchenRecipeArtifactStatus = inspectArtifactFiles(root, kitchenRecipeSource.artifact, {
  expectedPdfPages: kitchenRecipeExpectedPdfPages,
})
expect(
  kitchenRecipeArtifactStatus.valid,
  `Kitchen Table Story Recipe Card Deck artifacts failed validation:\n${kitchenRecipeArtifactStatus.errors.join('\n')}`,
)
expect(
  kitchenRecipeArtifactStatus.files.pdf.size > 100_000,
  `Kitchen Table Story Recipe Card Deck PDF artifact is unexpectedly small: ${kitchenRecipeArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  kitchenRecipeArtifactStatus.files.pdf.pageCount === kitchenRecipeExpectedPdfPages,
  `Kitchen Table Story Recipe Card Deck PDF artifact must have ${kitchenRecipeExpectedPdfPages} pages.`,
)
expect(
  kitchenRecipeArtifactStatus.files.zip.size > kitchenRecipeArtifactStatus.files.pdf.size,
  'Kitchen Table Story Recipe Card Deck ZIP artifact should include the PDF plus source HTML and image assets.',
)
const kitchenRecipeCheckoutErrors = validateCheckoutReadiness(kitchenRecipeProduct, kitchenRecipeArtifactStatus)
expect(
  kitchenRecipeCheckoutErrors.length === 0,
  `Kitchen Table Story Recipe Card Deck checkout readiness failed validation:\n${kitchenRecipeCheckoutErrors.join('\n')}`,
)
const kitchenRecipeArtifactManifest = readJson(resolve(root, kitchenRecipeSource.artifact.manifestPath))
expect(
  kitchenRecipeArtifactManifest.sourcePageCount === kitchenRecipeSource.recipeCards.length,
  'Kitchen Table Story Recipe Card Deck artifact manifest sourcePageCount must match source recipeCards.',
)
expect(
  Array.isArray(kitchenRecipeArtifactManifest.files.assets),
  'Kitchen Table Story Recipe Card Deck artifact manifest files.assets must be an array.',
)
expect(
  kitchenRecipeArtifactManifest.files.assets.length === kitchenRecipeSource.worldSlugs.length,
  'Kitchen Table Story Recipe Card Deck artifact manifest must include one copied local image per source world.',
)
const kitchenRecipeManifestAssetErrors = validateManifestWorldAssets(kitchenRecipeSource, kitchenRecipeArtifactManifest)
expect(
  kitchenRecipeManifestAssetErrors.length === 0,
  `Kitchen Table Story Recipe Card Deck artifact manifest image coverage failed validation:\n${kitchenRecipeManifestAssetErrors.join('\n')}`,
)
for (const asset of kitchenRecipeArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Kitchen Table Story Recipe Card Deck copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(bookshopBookmarkSourceFile), `Missing Batch 26 Bookshop Story Bookmark Pack source file: ${bookshopBookmarkSourceFile}`)
const bookshopBookmarkSource = readJson(bookshopBookmarkSourceFile)
expect(
  bookshopBookmarkSource.batchId === bookshopBookmarkBatchId,
  `Bookshop Story Bookmark Pack source batchId must be ${bookshopBookmarkBatchId}.`,
)
const bookshopBookmarkProduct = products.products.find((product) => product.slug === 'bookshop-story-bookmark-pack')
expect(bookshopBookmarkProduct, 'Missing Bookshop Story Bookmark Pack product record for Batch 26 artifact validation.')
const bookshopBookmarkSourceErrors = validateBookshopStoryBookmarkPackSource(
  bookshopBookmarkSource,
  bookshopBookmarkProduct,
  worldAgeBands,
)
expect(
  bookshopBookmarkSourceErrors.length === 0,
  `Bookshop Story Bookmark Pack source failed validation:\n${bookshopBookmarkSourceErrors.join('\n')}`,
)
const bookshopBookmarkSourceFileErrors = validateBookshopStoryBookmarkPackSourceFiles(bookshopBookmarkSource, root)
expect(
  bookshopBookmarkSourceFileErrors.length === 0,
  `Bookshop Story Bookmark Pack sourceFiles failed validation:\n${bookshopBookmarkSourceFileErrors.join('\n')}`,
)
const bookshopBookmarkExpectedPdfPages = bookshopBookmarkSource.bookmarks.length + 5
const bookshopBookmarkArtifactStatus = inspectArtifactFiles(root, bookshopBookmarkSource.artifact, {
  expectedPdfPages: bookshopBookmarkExpectedPdfPages,
})
expect(
  bookshopBookmarkArtifactStatus.valid,
  `Bookshop Story Bookmark Pack artifacts failed validation:\n${bookshopBookmarkArtifactStatus.errors.join('\n')}`,
)
expect(
  bookshopBookmarkArtifactStatus.files.pdf.size > 100_000,
  `Bookshop Story Bookmark Pack PDF artifact is unexpectedly small: ${bookshopBookmarkArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  bookshopBookmarkArtifactStatus.files.pdf.pageCount === bookshopBookmarkExpectedPdfPages,
  `Bookshop Story Bookmark Pack PDF artifact must have ${bookshopBookmarkExpectedPdfPages} pages.`,
)
expect(
  bookshopBookmarkArtifactStatus.files.zip.size > bookshopBookmarkArtifactStatus.files.pdf.size,
  'Bookshop Story Bookmark Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const bookshopBookmarkCheckoutErrors = validateCheckoutReadiness(bookshopBookmarkProduct, bookshopBookmarkArtifactStatus)
expect(
  bookshopBookmarkCheckoutErrors.length === 0,
  `Bookshop Story Bookmark Pack checkout readiness failed validation:\n${bookshopBookmarkCheckoutErrors.join('\n')}`,
)
const bookshopBookmarkArtifactManifest = readJson(resolve(root, bookshopBookmarkSource.artifact.manifestPath))
expect(
  bookshopBookmarkArtifactManifest.sourcePageCount === bookshopBookmarkSource.bookmarks.length,
  'Bookshop Story Bookmark Pack artifact manifest sourcePageCount must match source bookmarks.',
)
expect(
  Array.isArray(bookshopBookmarkArtifactManifest.files.assets),
  'Bookshop Story Bookmark Pack artifact manifest files.assets must be an array.',
)
expect(
  bookshopBookmarkArtifactManifest.files.assets.length === bookshopBookmarkSource.worldSlugs.length,
  'Bookshop Story Bookmark Pack artifact manifest must include one copied local image per source world.',
)
const bookshopBookmarkManifestAssetErrors = validateManifestWorldAssets(
  bookshopBookmarkSource,
  bookshopBookmarkArtifactManifest,
)
expect(
  bookshopBookmarkManifestAssetErrors.length === 0,
  `Bookshop Story Bookmark Pack artifact manifest image coverage failed validation:\n${bookshopBookmarkManifestAssetErrors.join('\n')}`,
)
for (const asset of bookshopBookmarkArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Bookshop Story Bookmark Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(writingDeskStripSourceFile), `Missing Batch 27 Writing Desk Story Prompt Strip Pack source file: ${writingDeskStripSourceFile}`)
const writingDeskStripSource = readJson(writingDeskStripSourceFile)
expect(
  writingDeskStripSource.batchId === writingDeskStripBatchId,
  `Writing Desk Story Prompt Strip Pack source batchId must be ${writingDeskStripBatchId}.`,
)
const writingDeskStripProduct = products.products.find((product) => product.slug === 'writing-desk-story-prompt-strip-pack')
expect(writingDeskStripProduct, 'Missing Writing Desk Story Prompt Strip Pack product record for Batch 27 artifact validation.')
const writingDeskStripSourceErrors = validateWritingDeskStoryPromptStripPackSource(
  writingDeskStripSource,
  writingDeskStripProduct,
  worldAgeBands,
)
expect(
  writingDeskStripSourceErrors.length === 0,
  `Writing Desk Story Prompt Strip Pack source failed validation:\n${writingDeskStripSourceErrors.join('\n')}`,
)
const writingDeskStripSourceFileErrors = validateWritingDeskStoryPromptStripPackSourceFiles(writingDeskStripSource, root)
expect(
  writingDeskStripSourceFileErrors.length === 0,
  `Writing Desk Story Prompt Strip Pack sourceFiles failed validation:\n${writingDeskStripSourceFileErrors.join('\n')}`,
)
const writingDeskStripExpectedPdfPages = writingDeskStripSource.strips.length + 5
const writingDeskStripArtifactStatus = inspectArtifactFiles(root, writingDeskStripSource.artifact, {
  expectedPdfPages: writingDeskStripExpectedPdfPages,
})
expect(
  writingDeskStripArtifactStatus.valid,
  `Writing Desk Story Prompt Strip Pack artifacts failed validation:\n${writingDeskStripArtifactStatus.errors.join('\n')}`,
)
expect(
  writingDeskStripArtifactStatus.files.pdf.size > 100_000,
  `Writing Desk Story Prompt Strip Pack PDF artifact is unexpectedly small: ${writingDeskStripArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  writingDeskStripArtifactStatus.files.pdf.pageCount === writingDeskStripExpectedPdfPages,
  `Writing Desk Story Prompt Strip Pack PDF artifact must have ${writingDeskStripExpectedPdfPages} pages.`,
)
expect(
  writingDeskStripArtifactStatus.files.zip.size > writingDeskStripArtifactStatus.files.pdf.size,
  'Writing Desk Story Prompt Strip Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const writingDeskStripCheckoutErrors = validateCheckoutReadiness(writingDeskStripProduct, writingDeskStripArtifactStatus)
expect(
  writingDeskStripCheckoutErrors.length === 0,
  `Writing Desk Story Prompt Strip Pack checkout readiness failed validation:\n${writingDeskStripCheckoutErrors.join('\n')}`,
)
const writingDeskStripArtifactManifest = readJson(resolve(root, writingDeskStripSource.artifact.manifestPath))
expect(
  writingDeskStripArtifactManifest.sourcePageCount === writingDeskStripSource.strips.length,
  'Writing Desk Story Prompt Strip Pack artifact manifest sourcePageCount must match source strips.',
)
expect(
  Array.isArray(writingDeskStripArtifactManifest.files.assets),
  'Writing Desk Story Prompt Strip Pack artifact manifest files.assets must be an array.',
)
expect(
  writingDeskStripArtifactManifest.files.assets.length === writingDeskStripSource.worldSlugs.length,
  'Writing Desk Story Prompt Strip Pack artifact manifest must include one copied local image per source world.',
)
const writingDeskStripManifestAssetErrors = validateManifestWorldAssets(
  writingDeskStripSource,
  writingDeskStripArtifactManifest,
)
expect(
  writingDeskStripManifestAssetErrors.length === 0,
  `Writing Desk Story Prompt Strip Pack artifact manifest image coverage failed validation:\n${writingDeskStripManifestAssetErrors.join('\n')}`,
)
for (const asset of writingDeskStripArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Writing Desk Story Prompt Strip Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(windowSeatSceneSourceFile), `Missing Batch 28 Window Seat Story Scene Card Pack source file: ${windowSeatSceneSourceFile}`)
const windowSeatSceneSource = readJson(windowSeatSceneSourceFile)
expect(
  windowSeatSceneSource.batchId === windowSeatSceneBatchId,
  `Window Seat Story Scene Card Pack source batchId must be ${windowSeatSceneBatchId}.`,
)
const windowSeatSceneProduct = products.products.find((product) => product.slug === 'window-seat-story-scene-card-pack')
expect(windowSeatSceneProduct, 'Missing Window Seat Story Scene Card Pack product record for Batch 28 artifact validation.')
const windowSeatSceneSourceErrors = validateWindowSeatStorySceneCardPackSource(
  windowSeatSceneSource,
  windowSeatSceneProduct,
  worldAgeBands,
)
expect(
  windowSeatSceneSourceErrors.length === 0,
  `Window Seat Story Scene Card Pack source failed validation:\n${windowSeatSceneSourceErrors.join('\n')}`,
)
const windowSeatSceneSourceFileErrors = validateWindowSeatStorySceneCardPackSourceFiles(windowSeatSceneSource, root)
expect(
  windowSeatSceneSourceFileErrors.length === 0,
  `Window Seat Story Scene Card Pack sourceFiles failed validation:\n${windowSeatSceneSourceFileErrors.join('\n')}`,
)
const windowSeatSceneExpectedPdfPages = windowSeatSceneSource.cards.length + 5
const windowSeatSceneArtifactStatus = inspectArtifactFiles(root, windowSeatSceneSource.artifact, {
  expectedPdfPages: windowSeatSceneExpectedPdfPages,
})
expect(
  windowSeatSceneArtifactStatus.valid,
  `Window Seat Story Scene Card Pack artifacts failed validation:\n${windowSeatSceneArtifactStatus.errors.join('\n')}`,
)
expect(
  windowSeatSceneArtifactStatus.files.pdf.size > 100_000,
  `Window Seat Story Scene Card Pack PDF artifact is unexpectedly small: ${windowSeatSceneArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  windowSeatSceneArtifactStatus.files.pdf.pageCount === windowSeatSceneExpectedPdfPages,
  `Window Seat Story Scene Card Pack PDF artifact must have ${windowSeatSceneExpectedPdfPages} pages.`,
)
expect(
  windowSeatSceneArtifactStatus.files.zip.size > windowSeatSceneArtifactStatus.files.pdf.size,
  'Window Seat Story Scene Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const windowSeatSceneCheckoutErrors = validateCheckoutReadiness(windowSeatSceneProduct, windowSeatSceneArtifactStatus)
expect(
  windowSeatSceneCheckoutErrors.length === 0,
  `Window Seat Story Scene Card Pack checkout readiness failed validation:\n${windowSeatSceneCheckoutErrors.join('\n')}`,
)
const windowSeatSceneArtifactManifest = readJson(resolve(root, windowSeatSceneSource.artifact.manifestPath))
expect(
  windowSeatSceneArtifactManifest.sourcePageCount === windowSeatSceneSource.cards.length,
  'Window Seat Story Scene Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(windowSeatSceneArtifactManifest.files.assets),
  'Window Seat Story Scene Card Pack artifact manifest files.assets must be an array.',
)
expect(
  windowSeatSceneArtifactManifest.files.assets.length === windowSeatSceneSource.worldSlugs.length,
  'Window Seat Story Scene Card Pack artifact manifest must include one copied local image per source world.',
)
const windowSeatSceneManifestAssetErrors = validateManifestWorldAssets(
  windowSeatSceneSource,
  windowSeatSceneArtifactManifest,
)
expect(
  windowSeatSceneManifestAssetErrors.length === 0,
  `Window Seat Story Scene Card Pack artifact manifest image coverage failed validation:\n${windowSeatSceneManifestAssetErrors.join('\n')}`,
)
for (const asset of windowSeatSceneArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Window Seat Story Scene Card Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(quietCornerMapSourceFile), `Missing Batch 29 Quiet Corner Story Map Card Pack source file: ${quietCornerMapSourceFile}`)
const quietCornerMapSource = readJson(quietCornerMapSourceFile)
expect(
  quietCornerMapSource.batchId === quietCornerMapBatchId,
  `Quiet Corner Story Map Card Pack source batchId must be ${quietCornerMapBatchId}.`,
)
const quietCornerMapProduct = products.products.find((product) => product.slug === 'quiet-corner-story-map-card-pack')
expect(quietCornerMapProduct, 'Missing Quiet Corner Story Map Card Pack product record for Batch 29 artifact validation.')
const quietCornerMapSourceErrors = validateQuietCornerStoryMapCardPackSource(
  quietCornerMapSource,
  quietCornerMapProduct,
  worldAgeBands,
)
expect(
  quietCornerMapSourceErrors.length === 0,
  `Quiet Corner Story Map Card Pack source failed validation:\n${quietCornerMapSourceErrors.join('\n')}`,
)
const quietCornerMapSourceFileErrors = validateQuietCornerStoryMapCardPackSourceFiles(quietCornerMapSource, root)
expect(
  quietCornerMapSourceFileErrors.length === 0,
  `Quiet Corner Story Map Card Pack sourceFiles failed validation:\n${quietCornerMapSourceFileErrors.join('\n')}`,
)
const quietCornerMapExpectedPdfPages = quietCornerMapSource.cards.length + 5
const quietCornerMapArtifactStatus = inspectArtifactFiles(root, quietCornerMapSource.artifact, {
  expectedPdfPages: quietCornerMapExpectedPdfPages,
})
expect(
  quietCornerMapArtifactStatus.valid,
  `Quiet Corner Story Map Card Pack artifacts failed validation:\n${quietCornerMapArtifactStatus.errors.join('\n')}`,
)
expect(
  quietCornerMapArtifactStatus.files.pdf.size > 100_000,
  `Quiet Corner Story Map Card Pack PDF artifact is unexpectedly small: ${quietCornerMapArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  quietCornerMapArtifactStatus.files.pdf.pageCount === quietCornerMapExpectedPdfPages,
  `Quiet Corner Story Map Card Pack PDF artifact must have ${quietCornerMapExpectedPdfPages} pages.`,
)
expect(
  quietCornerMapArtifactStatus.files.zip.size > quietCornerMapArtifactStatus.files.pdf.size,
  'Quiet Corner Story Map Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const quietCornerMapCheckoutErrors = validateCheckoutReadiness(quietCornerMapProduct, quietCornerMapArtifactStatus)
expect(
  quietCornerMapCheckoutErrors.length === 0,
  `Quiet Corner Story Map Card Pack checkout readiness failed validation:\n${quietCornerMapCheckoutErrors.join('\n')}`,
)
const quietCornerMapArtifactManifest = readJson(resolve(root, quietCornerMapSource.artifact.manifestPath))
expect(
  quietCornerMapArtifactManifest.sourcePageCount === quietCornerMapSource.cards.length,
  'Quiet Corner Story Map Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(quietCornerMapArtifactManifest.files.assets),
  'Quiet Corner Story Map Card Pack artifact manifest files.assets must be an array.',
)
expect(
  quietCornerMapArtifactManifest.files.assets.length === quietCornerMapSource.worldSlugs.length,
  'Quiet Corner Story Map Card Pack artifact manifest must include one copied local image per source world.',
)
const quietCornerMapManifestAssetErrors = validateManifestWorldAssets(
  quietCornerMapSource,
  quietCornerMapArtifactManifest,
)
expect(
  quietCornerMapManifestAssetErrors.length === 0,
  `Quiet Corner Story Map Card Pack artifact manifest image coverage failed validation:\n${quietCornerMapManifestAssetErrors.join('\n')}`,
)
for (const asset of quietCornerMapArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Quiet Corner Story Map Card Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(porchLightSignalSourceFile), `Missing Batch 30 Porch Light Story Signal Card Pack source file: ${porchLightSignalSourceFile}`)
const porchLightSignalSource = readJson(porchLightSignalSourceFile)
expect(
  porchLightSignalSource.batchId === porchLightSignalBatchId,
  `Porch Light Story Signal Card Pack source batchId must be ${porchLightSignalBatchId}.`,
)
const porchLightSignalProduct = products.products.find((product) => product.slug === 'porch-light-story-signal-card-pack')
expect(porchLightSignalProduct, 'Missing Porch Light Story Signal Card Pack product record for Batch 30 artifact validation.')
const porchLightSignalSourceErrors = validatePorchLightStorySignalCardPackSource(
  porchLightSignalSource,
  porchLightSignalProduct,
  worldAgeBands,
)
expect(
  porchLightSignalSourceErrors.length === 0,
  `Porch Light Story Signal Card Pack source failed validation:\n${porchLightSignalSourceErrors.join('\n')}`,
)
const porchLightSignalSourceFileErrors = validatePorchLightStorySignalCardPackSourceFiles(porchLightSignalSource, root)
expect(
  porchLightSignalSourceFileErrors.length === 0,
  `Porch Light Story Signal Card Pack sourceFiles failed validation:\n${porchLightSignalSourceFileErrors.join('\n')}`,
)
const porchLightSignalExpectedPdfPages = porchLightSignalSource.cards.length + 5
const porchLightSignalArtifactStatus = inspectArtifactFiles(root, porchLightSignalSource.artifact, {
  expectedPdfPages: porchLightSignalExpectedPdfPages,
})
expect(
  porchLightSignalArtifactStatus.valid,
  `Porch Light Story Signal Card Pack artifacts failed validation:\n${porchLightSignalArtifactStatus.errors.join('\n')}`,
)
expect(
  porchLightSignalArtifactStatus.files.pdf.size > 100_000,
  `Porch Light Story Signal Card Pack PDF artifact is unexpectedly small: ${porchLightSignalArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  porchLightSignalArtifactStatus.files.pdf.pageCount === porchLightSignalExpectedPdfPages,
  `Porch Light Story Signal Card Pack PDF artifact must have ${porchLightSignalExpectedPdfPages} pages.`,
)
expect(
  porchLightSignalArtifactStatus.files.zip.size > porchLightSignalArtifactStatus.files.pdf.size,
  'Porch Light Story Signal Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const porchLightSignalCheckoutErrors = validateCheckoutReadiness(porchLightSignalProduct, porchLightSignalArtifactStatus)
expect(
  porchLightSignalCheckoutErrors.length === 0,
  `Porch Light Story Signal Card Pack checkout readiness failed validation:\n${porchLightSignalCheckoutErrors.join('\n')}`,
)
const porchLightSignalArtifactManifest = readJson(resolve(root, porchLightSignalSource.artifact.manifestPath))
expect(
  porchLightSignalArtifactManifest.sourcePageCount === porchLightSignalSource.cards.length,
  'Porch Light Story Signal Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(porchLightSignalArtifactManifest.files.assets),
  'Porch Light Story Signal Card Pack artifact manifest files.assets must be an array.',
)
expect(
  porchLightSignalArtifactManifest.files.assets.length === porchLightSignalSource.worldSlugs.length,
  'Porch Light Story Signal Card Pack artifact manifest must include one copied local image per source world.',
)
const porchLightSignalManifestAssetErrors = validateManifestWorldAssets(
  porchLightSignalSource,
  porchLightSignalArtifactManifest,
)
expect(
  porchLightSignalManifestAssetErrors.length === 0,
  `Porch Light Story Signal Card Pack artifact manifest image coverage failed validation:\n${porchLightSignalManifestAssetErrors.join('\n')}`,
)
for (const asset of porchLightSignalArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Porch Light Story Signal Card Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(pencilCaseSwitchSourceFile), `Missing Batch 31 Pencil Case Story Switch Card Pack source file: ${pencilCaseSwitchSourceFile}`)
const pencilCaseSwitchSource = readJson(pencilCaseSwitchSourceFile)
expect(
  pencilCaseSwitchSource.batchId === pencilCaseSwitchBatchId,
  `Pencil Case Story Switch Card Pack source batchId must be ${pencilCaseSwitchBatchId}.`,
)
const pencilCaseSwitchProduct = products.products.find((product) => product.slug === 'pencil-case-story-switch-card-pack')
expect(pencilCaseSwitchProduct, 'Missing Pencil Case Story Switch Card Pack product record for Batch 31 artifact validation.')
const pencilCaseSwitchSourceErrors = validatePencilCaseStorySwitchCardPackSource(
  pencilCaseSwitchSource,
  pencilCaseSwitchProduct,
  worldAgeBands,
)
expect(
  pencilCaseSwitchSourceErrors.length === 0,
  `Pencil Case Story Switch Card Pack source failed validation:\n${pencilCaseSwitchSourceErrors.join('\n')}`,
)
const pencilCaseSwitchSourceFileErrors = validatePencilCaseStorySwitchCardPackSourceFiles(pencilCaseSwitchSource, root)
expect(
  pencilCaseSwitchSourceFileErrors.length === 0,
  `Pencil Case Story Switch Card Pack sourceFiles failed validation:\n${pencilCaseSwitchSourceFileErrors.join('\n')}`,
)
const pencilCaseSwitchExpectedPdfPages = pencilCaseSwitchSource.cards.length + 5
const pencilCaseSwitchArtifactStatus = inspectArtifactFiles(root, pencilCaseSwitchSource.artifact, {
  expectedPdfPages: pencilCaseSwitchExpectedPdfPages,
})
expect(
  pencilCaseSwitchArtifactStatus.valid,
  `Pencil Case Story Switch Card Pack artifacts failed validation:\n${pencilCaseSwitchArtifactStatus.errors.join('\n')}`,
)
expect(
  pencilCaseSwitchArtifactStatus.files.pdf.size > 100_000,
  `Pencil Case Story Switch Card Pack PDF artifact is unexpectedly small: ${pencilCaseSwitchArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  pencilCaseSwitchArtifactStatus.files.pdf.pageCount === pencilCaseSwitchExpectedPdfPages,
  `Pencil Case Story Switch Card Pack PDF artifact must have ${pencilCaseSwitchExpectedPdfPages} pages.`,
)
expect(
  pencilCaseSwitchArtifactStatus.files.zip.size > pencilCaseSwitchArtifactStatus.files.pdf.size,
  'Pencil Case Story Switch Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const pencilCaseSwitchCheckoutErrors = validateCheckoutReadiness(pencilCaseSwitchProduct, pencilCaseSwitchArtifactStatus)
expect(
  pencilCaseSwitchCheckoutErrors.length === 0,
  `Pencil Case Story Switch Card Pack checkout readiness failed validation:\n${pencilCaseSwitchCheckoutErrors.join('\n')}`,
)
const pencilCaseSwitchArtifactManifest = readJson(resolve(root, pencilCaseSwitchSource.artifact.manifestPath))
expect(
  pencilCaseSwitchArtifactManifest.sourcePageCount === pencilCaseSwitchSource.cards.length,
  'Pencil Case Story Switch Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(pencilCaseSwitchArtifactManifest.files.assets),
  'Pencil Case Story Switch Card Pack artifact manifest files.assets must be an array.',
)
expect(
  pencilCaseSwitchArtifactManifest.files.assets.length === pencilCaseSwitchSource.worldSlugs.length,
  'Pencil Case Story Switch Card Pack artifact manifest must include one copied local image per source world.',
)
const pencilCaseSwitchManifestAssetErrors = validateManifestWorldAssets(
  pencilCaseSwitchSource,
  pencilCaseSwitchArtifactManifest,
)
expect(
  pencilCaseSwitchManifestAssetErrors.length === 0,
  `Pencil Case Story Switch Card Pack artifact manifest image coverage failed validation:\n${pencilCaseSwitchManifestAssetErrors.join('\n')}`,
)
for (const asset of pencilCaseSwitchArtifactManifest.files.assets) {
  validateImageFile(resolve(root, asset.path), `Pencil Case Story Switch Card Pack copied artifact image ${asset.path}`, 'jpeg')
}

expect(existsSync(notebookMarginRevisionSourceFile), `Missing Batch 32 Notebook Margin Story Revision Card Pack source file: ${notebookMarginRevisionSourceFile}`)
const notebookMarginRevisionSource = readJson(notebookMarginRevisionSourceFile)
expect(
  notebookMarginRevisionSource.batchId === notebookMarginRevisionBatchId,
  `Notebook Margin Story Revision Card Pack source batchId must be ${notebookMarginRevisionBatchId}.`,
)
const notebookMarginRevisionProduct = products.products.find(
  (product) => product.slug === 'notebook-margin-story-revision-card-pack',
)
expect(
  notebookMarginRevisionProduct,
  'Missing Notebook Margin Story Revision Card Pack product record for Batch 32 artifact validation.',
)
const notebookMarginRevisionSourceErrors = validateNotebookMarginStoryRevisionCardPackSource(
  notebookMarginRevisionSource,
  notebookMarginRevisionProduct,
  worldAgeBands,
)
expect(
  notebookMarginRevisionSourceErrors.length === 0,
  `Notebook Margin Story Revision Card Pack source failed validation:\n${notebookMarginRevisionSourceErrors.join('\n')}`,
)
const notebookMarginRevisionSourceFileErrors = validateNotebookMarginStoryRevisionCardPackSourceFiles(
  notebookMarginRevisionSource,
  root,
)
expect(
  notebookMarginRevisionSourceFileErrors.length === 0,
  `Notebook Margin Story Revision Card Pack sourceFiles failed validation:\n${notebookMarginRevisionSourceFileErrors.join('\n')}`,
)
const notebookMarginRevisionExpectedPdfPages = notebookMarginRevisionSource.cards.length + 5
const notebookMarginRevisionArtifactStatus = inspectArtifactFiles(root, notebookMarginRevisionSource.artifact, {
  expectedPdfPages: notebookMarginRevisionExpectedPdfPages,
})
expect(
  notebookMarginRevisionArtifactStatus.valid,
  `Notebook Margin Story Revision Card Pack artifacts failed validation:\n${notebookMarginRevisionArtifactStatus.errors.join('\n')}`,
)
expect(
  notebookMarginRevisionArtifactStatus.files.pdf.size > 100_000,
  `Notebook Margin Story Revision Card Pack PDF artifact is unexpectedly small: ${notebookMarginRevisionArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  notebookMarginRevisionArtifactStatus.files.pdf.pageCount === notebookMarginRevisionExpectedPdfPages,
  `Notebook Margin Story Revision Card Pack PDF artifact must have ${notebookMarginRevisionExpectedPdfPages} pages.`,
)
expect(
  notebookMarginRevisionArtifactStatus.files.zip.size > notebookMarginRevisionArtifactStatus.files.pdf.size,
  'Notebook Margin Story Revision Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const notebookMarginRevisionCheckoutErrors = validateCheckoutReadiness(
  notebookMarginRevisionProduct,
  notebookMarginRevisionArtifactStatus,
)
expect(
  notebookMarginRevisionCheckoutErrors.length === 0,
  `Notebook Margin Story Revision Card Pack checkout readiness failed validation:\n${notebookMarginRevisionCheckoutErrors.join('\n')}`,
)
const notebookMarginRevisionArtifactManifest = readJson(resolve(root, notebookMarginRevisionSource.artifact.manifestPath))
expect(
  notebookMarginRevisionArtifactManifest.sourcePageCount === notebookMarginRevisionSource.cards.length,
  'Notebook Margin Story Revision Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(notebookMarginRevisionArtifactManifest.files.assets),
  'Notebook Margin Story Revision Card Pack artifact manifest files.assets must be an array.',
)
expect(
  notebookMarginRevisionArtifactManifest.files.assets.length === notebookMarginRevisionSource.worldSlugs.length,
  'Notebook Margin Story Revision Card Pack artifact manifest must include one copied local image per source world.',
)
const notebookMarginRevisionManifestAssetErrors = validateManifestWorldAssets(
  notebookMarginRevisionSource,
  notebookMarginRevisionArtifactManifest,
)
expect(
  notebookMarginRevisionManifestAssetErrors.length === 0,
  `Notebook Margin Story Revision Card Pack artifact manifest image coverage failed validation:\n${notebookMarginRevisionManifestAssetErrors.join('\n')}`,
)
for (const asset of notebookMarginRevisionArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Notebook Margin Story Revision Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(deskDrawerSequenceSourceFile), `Missing Batch 33 Desk Drawer Story Sequence Card Pack source file: ${deskDrawerSequenceSourceFile}`)
const deskDrawerSequenceSource = readJson(deskDrawerSequenceSourceFile)
expect(
  deskDrawerSequenceSource.batchId === deskDrawerSequenceBatchId,
  `Desk Drawer Story Sequence Card Pack source batchId must be ${deskDrawerSequenceBatchId}.`,
)
const deskDrawerSequenceProduct = products.products.find(
  (product) => product.slug === 'desk-drawer-story-sequence-card-pack',
)
expect(
  deskDrawerSequenceProduct,
  'Missing Desk Drawer Story Sequence Card Pack product record for Batch 33 artifact validation.',
)
const deskDrawerSequenceSourceErrors = validateDeskDrawerStorySequenceCardPackSource(
  deskDrawerSequenceSource,
  deskDrawerSequenceProduct,
  worldAgeBands,
)
expect(
  deskDrawerSequenceSourceErrors.length === 0,
  `Desk Drawer Story Sequence Card Pack source failed validation:\n${deskDrawerSequenceSourceErrors.join('\n')}`,
)
const deskDrawerSequenceSourceFileErrors = validateDeskDrawerStorySequenceCardPackSourceFiles(
  deskDrawerSequenceSource,
  root,
)
expect(
  deskDrawerSequenceSourceFileErrors.length === 0,
  `Desk Drawer Story Sequence Card Pack sourceFiles failed validation:\n${deskDrawerSequenceSourceFileErrors.join('\n')}`,
)
const deskDrawerSequenceExpectedPdfPages = deskDrawerSequenceSource.cards.length + 5
const deskDrawerSequenceArtifactStatus = inspectArtifactFiles(root, deskDrawerSequenceSource.artifact, {
  expectedPdfPages: deskDrawerSequenceExpectedPdfPages,
})
expect(
  deskDrawerSequenceArtifactStatus.valid,
  `Desk Drawer Story Sequence Card Pack artifacts failed validation:\n${deskDrawerSequenceArtifactStatus.errors.join('\n')}`,
)
expect(
  deskDrawerSequenceArtifactStatus.files.pdf.size > 100_000,
  `Desk Drawer Story Sequence Card Pack PDF artifact is unexpectedly small: ${deskDrawerSequenceArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  deskDrawerSequenceArtifactStatus.files.pdf.pageCount === deskDrawerSequenceExpectedPdfPages,
  `Desk Drawer Story Sequence Card Pack PDF artifact must have ${deskDrawerSequenceExpectedPdfPages} pages.`,
)
expect(
  deskDrawerSequenceArtifactStatus.files.zip.size > deskDrawerSequenceArtifactStatus.files.pdf.size,
  'Desk Drawer Story Sequence Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const deskDrawerSequenceCheckoutErrors = validateCheckoutReadiness(
  deskDrawerSequenceProduct,
  deskDrawerSequenceArtifactStatus,
)
expect(
  deskDrawerSequenceCheckoutErrors.length === 0,
  `Desk Drawer Story Sequence Card Pack checkout readiness failed validation:\n${deskDrawerSequenceCheckoutErrors.join('\n')}`,
)
const deskDrawerSequenceArtifactManifest = readJson(resolve(root, deskDrawerSequenceSource.artifact.manifestPath))
expect(
  deskDrawerSequenceArtifactManifest.sourcePageCount === deskDrawerSequenceSource.cards.length,
  'Desk Drawer Story Sequence Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(deskDrawerSequenceArtifactManifest.files.assets),
  'Desk Drawer Story Sequence Card Pack artifact manifest files.assets must be an array.',
)
expect(
  deskDrawerSequenceArtifactManifest.files.assets.length === deskDrawerSequenceSource.worldSlugs.length,
  'Desk Drawer Story Sequence Card Pack artifact manifest must include one copied local image per source world.',
)
const deskDrawerSequenceManifestAssetErrors = validateManifestWorldAssets(
  deskDrawerSequenceSource,
  deskDrawerSequenceArtifactManifest,
)
expect(
  deskDrawerSequenceManifestAssetErrors.length === 0,
  `Desk Drawer Story Sequence Card Pack artifact manifest image coverage failed validation:\n${deskDrawerSequenceManifestAssetErrors.join('\n')}`,
)
for (const asset of deskDrawerSequenceArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Desk Drawer Story Sequence Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(readingNookCauseEffectSourceFile), `Missing Batch 34 Reading Nook Story Cause-and-Effect Card Pack source file: ${readingNookCauseEffectSourceFile}`)
const readingNookCauseEffectSource = readJson(readingNookCauseEffectSourceFile)
expect(
  readingNookCauseEffectSource.batchId === readingNookCauseEffectBatchId,
  `Reading Nook Story Cause-and-Effect Card Pack source batchId must be ${readingNookCauseEffectBatchId}.`,
)
const readingNookCauseEffectProduct = products.products.find(
  (product) => product.slug === 'reading-nook-story-cause-effect-card-pack',
)
expect(
  readingNookCauseEffectProduct,
  'Missing Reading Nook Story Cause-and-Effect Card Pack product record for Batch 34 artifact validation.',
)
const readingNookCauseEffectSourceErrors = validateReadingNookStoryCauseEffectCardPackSource(
  readingNookCauseEffectSource,
  readingNookCauseEffectProduct,
  worldAgeBands,
)
expect(
  readingNookCauseEffectSourceErrors.length === 0,
  `Reading Nook Story Cause-and-Effect Card Pack source failed validation:\n${readingNookCauseEffectSourceErrors.join('\n')}`,
)
const readingNookCauseEffectSourceFileErrors = validateReadingNookStoryCauseEffectCardPackSourceFiles(
  readingNookCauseEffectSource,
  root,
)
expect(
  readingNookCauseEffectSourceFileErrors.length === 0,
  `Reading Nook Story Cause-and-Effect Card Pack sourceFiles failed validation:\n${readingNookCauseEffectSourceFileErrors.join('\n')}`,
)
const readingNookCauseEffectExpectedPdfPages = readingNookCauseEffectSource.cards.length + 5
const readingNookCauseEffectArtifactStatus = inspectArtifactFiles(root, readingNookCauseEffectSource.artifact, {
  expectedPdfPages: readingNookCauseEffectExpectedPdfPages,
})
expect(
  readingNookCauseEffectArtifactStatus.valid,
  `Reading Nook Story Cause-and-Effect Card Pack artifacts failed validation:\n${readingNookCauseEffectArtifactStatus.errors.join('\n')}`,
)
expect(
  readingNookCauseEffectArtifactStatus.files.pdf.size > 100_000,
  `Reading Nook Story Cause-and-Effect Card Pack PDF artifact is unexpectedly small: ${readingNookCauseEffectArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  readingNookCauseEffectArtifactStatus.files.pdf.pageCount === readingNookCauseEffectExpectedPdfPages,
  `Reading Nook Story Cause-and-Effect Card Pack PDF artifact must have ${readingNookCauseEffectExpectedPdfPages} pages.`,
)
expect(
  readingNookCauseEffectArtifactStatus.files.zip.size > readingNookCauseEffectArtifactStatus.files.pdf.size,
  'Reading Nook Story Cause-and-Effect Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const readingNookCauseEffectCheckoutErrors = validateCheckoutReadiness(
  readingNookCauseEffectProduct,
  readingNookCauseEffectArtifactStatus,
)
expect(
  readingNookCauseEffectCheckoutErrors.length === 0,
  `Reading Nook Story Cause-and-Effect Card Pack checkout readiness failed validation:\n${readingNookCauseEffectCheckoutErrors.join('\n')}`,
)
const readingNookCauseEffectArtifactManifest = readJson(resolve(root, readingNookCauseEffectSource.artifact.manifestPath))
expect(
  readingNookCauseEffectArtifactManifest.sourcePageCount === readingNookCauseEffectSource.cards.length,
  'Reading Nook Story Cause-and-Effect Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(readingNookCauseEffectArtifactManifest.files.assets),
  'Reading Nook Story Cause-and-Effect Card Pack artifact manifest files.assets must be an array.',
)
expect(
  readingNookCauseEffectArtifactManifest.files.assets.length === readingNookCauseEffectSource.worldSlugs.length,
  'Reading Nook Story Cause-and-Effect Card Pack artifact manifest must include one copied local image per source world.',
)
const readingNookCauseEffectManifestAssetErrors = validateManifestWorldAssets(
  readingNookCauseEffectSource,
  readingNookCauseEffectArtifactManifest,
)
expect(
  readingNookCauseEffectManifestAssetErrors.length === 0,
  `Reading Nook Story Cause-and-Effect Card Pack artifact manifest image coverage failed validation:\n${readingNookCauseEffectManifestAssetErrors.join('\n')}`,
)
for (const asset of readingNookCauseEffectArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Reading Nook Story Cause-and-Effect Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(blanketFortDialogueSourceFile), `Missing Batch 35 Blanket Fort Story Dialogue Card Pack source file: ${blanketFortDialogueSourceFile}`)
const blanketFortDialogueSource = readJson(blanketFortDialogueSourceFile)
expect(
  blanketFortDialogueSource.batchId === blanketFortDialogueBatchId,
  `Blanket Fort Story Dialogue Card Pack source batchId must be ${blanketFortDialogueBatchId}.`,
)
const blanketFortDialogueProduct = products.products.find(
  (product) => product.slug === 'blanket-fort-story-dialogue-card-pack',
)
expect(
  blanketFortDialogueProduct,
  'Missing Blanket Fort Story Dialogue Card Pack product record for Batch 35 artifact validation.',
)
const blanketFortDialogueSourceErrors = validateBlanketFortStoryDialogueCardPackSource(
  blanketFortDialogueSource,
  blanketFortDialogueProduct,
  worldAgeBands,
)
expect(
  blanketFortDialogueSourceErrors.length === 0,
  `Blanket Fort Story Dialogue Card Pack source failed validation:\n${blanketFortDialogueSourceErrors.join('\n')}`,
)
const blanketFortDialogueSourceFileErrors = validateBlanketFortStoryDialogueCardPackSourceFiles(
  blanketFortDialogueSource,
  root,
)
expect(
  blanketFortDialogueSourceFileErrors.length === 0,
  `Blanket Fort Story Dialogue Card Pack sourceFiles failed validation:\n${blanketFortDialogueSourceFileErrors.join('\n')}`,
)
const blanketFortDialogueExpectedPdfPages = blanketFortDialogueSource.cards.length + 5
const blanketFortDialogueArtifactStatus = inspectArtifactFiles(root, blanketFortDialogueSource.artifact, {
  expectedPdfPages: blanketFortDialogueExpectedPdfPages,
})
expect(
  blanketFortDialogueArtifactStatus.valid,
  `Blanket Fort Story Dialogue Card Pack artifacts failed validation:\n${blanketFortDialogueArtifactStatus.errors.join('\n')}`,
)
expect(
  blanketFortDialogueArtifactStatus.files.pdf.size > 100_000,
  `Blanket Fort Story Dialogue Card Pack PDF artifact is unexpectedly small: ${blanketFortDialogueArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  blanketFortDialogueArtifactStatus.files.pdf.pageCount === blanketFortDialogueExpectedPdfPages,
  `Blanket Fort Story Dialogue Card Pack PDF artifact must have ${blanketFortDialogueExpectedPdfPages} pages.`,
)
expect(
  blanketFortDialogueArtifactStatus.files.zip.size > blanketFortDialogueArtifactStatus.files.pdf.size,
  'Blanket Fort Story Dialogue Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const blanketFortDialogueCheckoutErrors = validateCheckoutReadiness(
  blanketFortDialogueProduct,
  blanketFortDialogueArtifactStatus,
)
expect(
  blanketFortDialogueCheckoutErrors.length === 0,
  `Blanket Fort Story Dialogue Card Pack checkout readiness failed validation:\n${blanketFortDialogueCheckoutErrors.join('\n')}`,
)
const blanketFortDialogueArtifactManifest = readJson(resolve(root, blanketFortDialogueSource.artifact.manifestPath))
expect(
  blanketFortDialogueArtifactManifest.sourcePageCount === blanketFortDialogueSource.cards.length,
  'Blanket Fort Story Dialogue Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(blanketFortDialogueArtifactManifest.files.assets),
  'Blanket Fort Story Dialogue Card Pack artifact manifest files.assets must be an array.',
)
expect(
  blanketFortDialogueArtifactManifest.files.assets.length === blanketFortDialogueSource.worldSlugs.length,
  'Blanket Fort Story Dialogue Card Pack artifact manifest must include one copied local image per source world.',
)
const blanketFortDialogueManifestAssetErrors = validateManifestWorldAssets(
  blanketFortDialogueSource,
  blanketFortDialogueArtifactManifest,
)
expect(
  blanketFortDialogueManifestAssetErrors.length === 0,
  `Blanket Fort Story Dialogue Card Pack artifact manifest image coverage failed validation:\n${blanketFortDialogueManifestAssetErrors.join('\n')}`,
)
for (const asset of blanketFortDialogueArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Blanket Fort Story Dialogue Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(kitchenWindowPovSourceFile), `Missing Batch 36 Kitchen Window Story Point-of-View Card Pack source file: ${kitchenWindowPovSourceFile}`)
const kitchenWindowPovSource = readJson(kitchenWindowPovSourceFile)
expect(
  kitchenWindowPovSource.batchId === kitchenWindowPovBatchId,
  `Kitchen Window Story Point-of-View Card Pack source batchId must be ${kitchenWindowPovBatchId}.`,
)
const kitchenWindowPovProduct = products.products.find(
  (product) => product.slug === 'kitchen-window-story-pov-card-pack',
)
expect(
  kitchenWindowPovProduct,
  'Missing Kitchen Window Story Point-of-View Card Pack product record for Batch 36 artifact validation.',
)
const kitchenWindowPovSourceErrors = validateKitchenWindowStoryPovCardPackSource(
  kitchenWindowPovSource,
  kitchenWindowPovProduct,
  worldAgeBands,
)
expect(
  kitchenWindowPovSourceErrors.length === 0,
  `Kitchen Window Story Point-of-View Card Pack source failed validation:\n${kitchenWindowPovSourceErrors.join('\n')}`,
)
const kitchenWindowPovSourceFileErrors = validateKitchenWindowStoryPovCardPackSourceFiles(
  kitchenWindowPovSource,
  root,
)
expect(
  kitchenWindowPovSourceFileErrors.length === 0,
  `Kitchen Window Story Point-of-View Card Pack sourceFiles failed validation:\n${kitchenWindowPovSourceFileErrors.join('\n')}`,
)
const kitchenWindowPovExpectedPdfPages = kitchenWindowPovSource.cards.length + 5
const kitchenWindowPovArtifactStatus = inspectArtifactFiles(root, kitchenWindowPovSource.artifact, {
  expectedPdfPages: kitchenWindowPovExpectedPdfPages,
})
expect(
  kitchenWindowPovArtifactStatus.valid,
  `Kitchen Window Story Point-of-View Card Pack artifacts failed validation:\n${kitchenWindowPovArtifactStatus.errors.join('\n')}`,
)
expect(
  kitchenWindowPovArtifactStatus.files.pdf.size > 100_000,
  `Kitchen Window Story Point-of-View Card Pack PDF artifact is unexpectedly small: ${kitchenWindowPovArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  kitchenWindowPovArtifactStatus.files.pdf.pageCount === kitchenWindowPovExpectedPdfPages,
  `Kitchen Window Story Point-of-View Card Pack PDF artifact must have ${kitchenWindowPovExpectedPdfPages} pages.`,
)
expect(
  kitchenWindowPovArtifactStatus.files.zip.size > kitchenWindowPovArtifactStatus.files.pdf.size,
  'Kitchen Window Story Point-of-View Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const kitchenWindowPovCheckoutErrors = validateCheckoutReadiness(
  kitchenWindowPovProduct,
  kitchenWindowPovArtifactStatus,
)
expect(
  kitchenWindowPovCheckoutErrors.length === 0,
  `Kitchen Window Story Point-of-View Card Pack checkout readiness failed validation:\n${kitchenWindowPovCheckoutErrors.join('\n')}`,
)
const kitchenWindowPovArtifactManifest = readJson(resolve(root, kitchenWindowPovSource.artifact.manifestPath))
expect(
  kitchenWindowPovArtifactManifest.sourcePageCount === kitchenWindowPovSource.cards.length,
  'Kitchen Window Story Point-of-View Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(kitchenWindowPovArtifactManifest.files.assets),
  'Kitchen Window Story Point-of-View Card Pack artifact manifest files.assets must be an array.',
)
expect(
  kitchenWindowPovArtifactManifest.files.assets.length === kitchenWindowPovSource.worldSlugs.length,
  'Kitchen Window Story Point-of-View Card Pack artifact manifest must include one copied local image per source world.',
)
const kitchenWindowPovManifestAssetErrors = validateManifestWorldAssets(
  kitchenWindowPovSource,
  kitchenWindowPovArtifactManifest,
)
expect(
  kitchenWindowPovManifestAssetErrors.length === 0,
  `Kitchen Window Story Point-of-View Card Pack artifact manifest image coverage failed validation:\n${kitchenWindowPovManifestAssetErrors.join('\n')}`,
)
for (const asset of kitchenWindowPovArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Kitchen Window Story Point-of-View Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(coatPocketCharacterSourceFile), `Missing Batch 37 Coat Pocket Story Character Card Pack source file: ${coatPocketCharacterSourceFile}`)
const coatPocketCharacterSource = readJson(coatPocketCharacterSourceFile)
expect(
  coatPocketCharacterSource.batchId === coatPocketCharacterBatchId,
  `Coat Pocket Story Character Card Pack source batchId must be ${coatPocketCharacterBatchId}.`,
)
const coatPocketCharacterProduct = products.products.find(
  (product) => product.slug === 'coat-pocket-story-character-card-pack',
)
expect(
  coatPocketCharacterProduct,
  'Missing Coat Pocket Story Character Card Pack product record for Batch 37 artifact validation.',
)
const coatPocketCharacterSourceErrors = validateCoatPocketStoryCharacterCardPackSource(
  coatPocketCharacterSource,
  coatPocketCharacterProduct,
  worldAgeBands,
)
expect(
  coatPocketCharacterSourceErrors.length === 0,
  `Coat Pocket Story Character Card Pack source failed validation:\n${coatPocketCharacterSourceErrors.join('\n')}`,
)
const coatPocketCharacterSourceFileErrors = validateCoatPocketStoryCharacterCardPackSourceFiles(
  coatPocketCharacterSource,
  root,
)
expect(
  coatPocketCharacterSourceFileErrors.length === 0,
  `Coat Pocket Story Character Card Pack sourceFiles failed validation:\n${coatPocketCharacterSourceFileErrors.join('\n')}`,
)
const coatPocketCharacterExpectedPdfPages = coatPocketCharacterSource.cards.length + 5
const coatPocketCharacterArtifactStatus = inspectArtifactFiles(root, coatPocketCharacterSource.artifact, {
  expectedPdfPages: coatPocketCharacterExpectedPdfPages,
})
expect(
  coatPocketCharacterArtifactStatus.valid,
  `Coat Pocket Story Character Card Pack artifacts failed validation:\n${coatPocketCharacterArtifactStatus.errors.join('\n')}`,
)
expect(
  coatPocketCharacterArtifactStatus.files.pdf.size > 100_000,
  `Coat Pocket Story Character Card Pack PDF artifact is unexpectedly small: ${coatPocketCharacterArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  coatPocketCharacterArtifactStatus.files.pdf.pageCount === coatPocketCharacterExpectedPdfPages,
  `Coat Pocket Story Character Card Pack PDF artifact must have ${coatPocketCharacterExpectedPdfPages} pages.`,
)
expect(
  coatPocketCharacterArtifactStatus.files.zip.size > coatPocketCharacterArtifactStatus.files.pdf.size,
  'Coat Pocket Story Character Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const coatPocketCharacterCheckoutErrors = validateCheckoutReadiness(
  coatPocketCharacterProduct,
  coatPocketCharacterArtifactStatus,
)
expect(
  coatPocketCharacterCheckoutErrors.length === 0,
  `Coat Pocket Story Character Card Pack checkout readiness failed validation:\n${coatPocketCharacterCheckoutErrors.join('\n')}`,
)
const coatPocketCharacterArtifactManifest = readJson(resolve(root, coatPocketCharacterSource.artifact.manifestPath))
expect(
  coatPocketCharacterArtifactManifest.sourcePageCount === coatPocketCharacterSource.cards.length,
  'Coat Pocket Story Character Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(coatPocketCharacterArtifactManifest.files.assets),
  'Coat Pocket Story Character Card Pack artifact manifest files.assets must be an array.',
)
expect(
  coatPocketCharacterArtifactManifest.files.assets.length === coatPocketCharacterSource.worldSlugs.length,
  'Coat Pocket Story Character Card Pack artifact manifest must include one copied local image per source world.',
)
const coatPocketCharacterManifestAssetErrors = validateManifestWorldAssets(
  coatPocketCharacterSource,
  coatPocketCharacterArtifactManifest,
)
expect(
  coatPocketCharacterManifestAssetErrors.length === 0,
  `Coat Pocket Story Character Card Pack artifact manifest image coverage failed validation:\n${coatPocketCharacterManifestAssetErrors.join('\n')}`,
)
for (const asset of coatPocketCharacterArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Coat Pocket Story Character Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(paperTraySettingSourceFile), `Missing Batch 38 Paper Tray Story Setting Card Pack source file: ${paperTraySettingSourceFile}`)
const paperTraySettingSource = readJson(paperTraySettingSourceFile)
expect(
  paperTraySettingSource.batchId === paperTraySettingBatchId,
  `Paper Tray Story Setting Card Pack source batchId must be ${paperTraySettingBatchId}.`,
)
const paperTraySettingProduct = products.products.find(
  (product) => product.slug === 'paper-tray-story-setting-card-pack',
)
expect(
  paperTraySettingProduct,
  'Missing Paper Tray Story Setting Card Pack product record for Batch 38 artifact validation.',
)
const paperTraySettingSourceErrors = validatePaperTrayStorySettingCardPackSource(
  paperTraySettingSource,
  paperTraySettingProduct,
  worldAgeBands,
)
expect(
  paperTraySettingSourceErrors.length === 0,
  `Paper Tray Story Setting Card Pack source failed validation:\n${paperTraySettingSourceErrors.join('\n')}`,
)
const paperTraySettingSourceFileErrors = validatePaperTrayStorySettingCardPackSourceFiles(
  paperTraySettingSource,
  root,
)
expect(
  paperTraySettingSourceFileErrors.length === 0,
  `Paper Tray Story Setting Card Pack sourceFiles failed validation:\n${paperTraySettingSourceFileErrors.join('\n')}`,
)
const paperTraySettingExpectedPdfPages = paperTraySettingSource.cards.length + 5
const paperTraySettingArtifactStatus = inspectArtifactFiles(root, paperTraySettingSource.artifact, {
  expectedPdfPages: paperTraySettingExpectedPdfPages,
})
expect(
  paperTraySettingArtifactStatus.valid,
  `Paper Tray Story Setting Card Pack artifacts failed validation:\n${paperTraySettingArtifactStatus.errors.join('\n')}`,
)
expect(
  paperTraySettingArtifactStatus.files.pdf.size > 100_000,
  `Paper Tray Story Setting Card Pack PDF artifact is unexpectedly small: ${paperTraySettingArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  paperTraySettingArtifactStatus.files.pdf.pageCount === paperTraySettingExpectedPdfPages,
  `Paper Tray Story Setting Card Pack PDF artifact must have ${paperTraySettingExpectedPdfPages} pages.`,
)
expect(
  paperTraySettingArtifactStatus.files.zip.size > paperTraySettingArtifactStatus.files.pdf.size,
  'Paper Tray Story Setting Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const paperTraySettingCheckoutErrors = validateCheckoutReadiness(
  paperTraySettingProduct,
  paperTraySettingArtifactStatus,
)
expect(
  paperTraySettingCheckoutErrors.length === 0,
  `Paper Tray Story Setting Card Pack checkout readiness failed validation:\n${paperTraySettingCheckoutErrors.join('\n')}`,
)
const paperTraySettingArtifactManifest = readJson(resolve(root, paperTraySettingSource.artifact.manifestPath))
expect(
  paperTraySettingArtifactManifest.sourcePageCount === paperTraySettingSource.cards.length,
  'Paper Tray Story Setting Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(paperTraySettingArtifactManifest.files.assets),
  'Paper Tray Story Setting Card Pack artifact manifest files.assets must be an array.',
)
expect(
  paperTraySettingArtifactManifest.files.assets.length === paperTraySettingSource.worldSlugs.length,
  'Paper Tray Story Setting Card Pack artifact manifest must include one copied local image per source world.',
)
const paperTraySettingManifestAssetErrors = validateManifestWorldAssets(
  paperTraySettingSource,
  paperTraySettingArtifactManifest,
)
expect(
  paperTraySettingManifestAssetErrors.length === 0,
  `Paper Tray Story Setting Card Pack artifact manifest image coverage failed validation:\n${paperTraySettingManifestAssetErrors.join('\n')}`,
)
for (const asset of paperTraySettingArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Paper Tray Story Setting Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(backpackEndingSourceFile), `Missing Batch 39 Backpack Story Ending Card Pack source file: ${backpackEndingSourceFile}`)
const backpackEndingSource = readJson(backpackEndingSourceFile)
expect(
  backpackEndingSource.batchId === backpackEndingBatchId,
  `Backpack Story Ending Card Pack source batchId must be ${backpackEndingBatchId}.`,
)
const backpackEndingProduct = products.products.find(
  (product) => product.slug === 'backpack-story-ending-card-pack',
)
expect(
  backpackEndingProduct,
  'Missing Backpack Story Ending Card Pack product record for Batch 39 artifact validation.',
)
const backpackEndingSourceErrors = validateBackpackStoryEndingCardPackSource(
  backpackEndingSource,
  backpackEndingProduct,
  worldAgeBands,
)
expect(
  backpackEndingSourceErrors.length === 0,
  `Backpack Story Ending Card Pack source failed validation:\n${backpackEndingSourceErrors.join('\n')}`,
)
const backpackEndingSourceFileErrors = validateBackpackStoryEndingCardPackSourceFiles(
  backpackEndingSource,
  root,
)
expect(
  backpackEndingSourceFileErrors.length === 0,
  `Backpack Story Ending Card Pack sourceFiles failed validation:\n${backpackEndingSourceFileErrors.join('\n')}`,
)
const backpackEndingExpectedPdfPages = backpackEndingSource.cards.length + 5
const backpackEndingArtifactStatus = inspectArtifactFiles(root, backpackEndingSource.artifact, {
  expectedPdfPages: backpackEndingExpectedPdfPages,
})
expect(
  backpackEndingArtifactStatus.valid,
  `Backpack Story Ending Card Pack artifacts failed validation:\n${backpackEndingArtifactStatus.errors.join('\n')}`,
)
expect(
  backpackEndingArtifactStatus.files.pdf.size > 100_000,
  `Backpack Story Ending Card Pack PDF artifact is unexpectedly small: ${backpackEndingArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  backpackEndingArtifactStatus.files.pdf.pageCount === backpackEndingExpectedPdfPages,
  `Backpack Story Ending Card Pack PDF artifact must have ${backpackEndingExpectedPdfPages} pages.`,
)
expect(
  backpackEndingArtifactStatus.files.zip.size > backpackEndingArtifactStatus.files.pdf.size,
  'Backpack Story Ending Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const backpackEndingCheckoutErrors = validateCheckoutReadiness(
  backpackEndingProduct,
  backpackEndingArtifactStatus,
)
expect(
  backpackEndingCheckoutErrors.length === 0,
  `Backpack Story Ending Card Pack checkout readiness failed validation:\n${backpackEndingCheckoutErrors.join('\n')}`,
)
const backpackEndingArtifactManifest = readJson(resolve(root, backpackEndingSource.artifact.manifestPath))
expect(
  backpackEndingArtifactManifest.sourcePageCount === backpackEndingSource.cards.length,
  'Backpack Story Ending Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(backpackEndingArtifactManifest.files.assets),
  'Backpack Story Ending Card Pack artifact manifest files.assets must be an array.',
)
expect(
  backpackEndingArtifactManifest.files.assets.length === backpackEndingSource.worldSlugs.length,
  'Backpack Story Ending Card Pack artifact manifest must include one copied local image per source world.',
)
const backpackEndingManifestAssetErrors = validateManifestWorldAssets(
  backpackEndingSource,
  backpackEndingArtifactManifest,
)
expect(
  backpackEndingManifestAssetErrors.length === 0,
  `Backpack Story Ending Card Pack artifact manifest image coverage failed validation:\n${backpackEndingManifestAssetErrors.join('\n')}`,
)
for (const asset of backpackEndingArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Backpack Story Ending Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(pencilCupOpeningSourceFile), `Missing Batch 40 Pencil Cup Story Opening Card Pack source file: ${pencilCupOpeningSourceFile}`)
const pencilCupOpeningSource = readJson(pencilCupOpeningSourceFile)
expect(
  pencilCupOpeningSource.batchId === pencilCupOpeningBatchId,
  `Pencil Cup Story Opening Card Pack source batchId must be ${pencilCupOpeningBatchId}.`,
)
const pencilCupOpeningProduct = products.products.find(
  (product) => product.slug === 'pencil-cup-story-opening-card-pack',
)
expect(
  pencilCupOpeningProduct,
  'Missing Pencil Cup Story Opening Card Pack product record for Batch 40 artifact validation.',
)
const pencilCupOpeningSourceErrors = validatePencilCupStoryOpeningCardPackSource(
  pencilCupOpeningSource,
  pencilCupOpeningProduct,
  worldAgeBands,
)
expect(
  pencilCupOpeningSourceErrors.length === 0,
  `Pencil Cup Story Opening Card Pack source failed validation:\n${pencilCupOpeningSourceErrors.join('\n')}`,
)
const pencilCupOpeningSourceFileErrors = validatePencilCupStoryOpeningCardPackSourceFiles(
  pencilCupOpeningSource,
  root,
)
expect(
  pencilCupOpeningSourceFileErrors.length === 0,
  `Pencil Cup Story Opening Card Pack sourceFiles failed validation:\n${pencilCupOpeningSourceFileErrors.join('\n')}`,
)
const pencilCupOpeningExpectedPdfPages = pencilCupOpeningSource.cards.length + 5
const pencilCupOpeningArtifactStatus = inspectArtifactFiles(root, pencilCupOpeningSource.artifact, {
  expectedPdfPages: pencilCupOpeningExpectedPdfPages,
})
expect(
  pencilCupOpeningArtifactStatus.valid,
  `Pencil Cup Story Opening Card Pack artifacts failed validation:\n${pencilCupOpeningArtifactStatus.errors.join('\n')}`,
)
expect(
  pencilCupOpeningArtifactStatus.files.pdf.size > 100_000,
  `Pencil Cup Story Opening Card Pack PDF artifact is unexpectedly small: ${pencilCupOpeningArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  pencilCupOpeningArtifactStatus.files.pdf.pageCount === pencilCupOpeningExpectedPdfPages,
  `Pencil Cup Story Opening Card Pack PDF artifact must have ${pencilCupOpeningExpectedPdfPages} pages.`,
)
expect(
  pencilCupOpeningArtifactStatus.files.zip.size > pencilCupOpeningArtifactStatus.files.pdf.size,
  'Pencil Cup Story Opening Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const pencilCupOpeningCheckoutErrors = validateCheckoutReadiness(
  pencilCupOpeningProduct,
  pencilCupOpeningArtifactStatus,
)
expect(
  pencilCupOpeningCheckoutErrors.length === 0,
  `Pencil Cup Story Opening Card Pack checkout readiness failed validation:\n${pencilCupOpeningCheckoutErrors.join('\n')}`,
)
const pencilCupOpeningArtifactManifest = readJson(resolve(root, pencilCupOpeningSource.artifact.manifestPath))
expect(
  pencilCupOpeningArtifactManifest.sourcePageCount === pencilCupOpeningSource.cards.length,
  'Pencil Cup Story Opening Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(pencilCupOpeningArtifactManifest.files.assets),
  'Pencil Cup Story Opening Card Pack artifact manifest files.assets must be an array.',
)
expect(
  pencilCupOpeningArtifactManifest.files.assets.length === pencilCupOpeningSource.worldSlugs.length,
  'Pencil Cup Story Opening Card Pack artifact manifest must include one copied local image per source world.',
)
const pencilCupOpeningManifestAssetErrors = validateManifestWorldAssets(
  pencilCupOpeningSource,
  pencilCupOpeningArtifactManifest,
)
expect(
  pencilCupOpeningManifestAssetErrors.length === 0,
  `Pencil Cup Story Opening Card Pack artifact manifest image coverage failed validation:\n${pencilCupOpeningManifestAssetErrors.join('\n')}`,
)
for (const asset of pencilCupOpeningArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Pencil Cup Story Opening Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(deskLampProblemSourceFile), `Missing Batch 41 Desk Lamp Story Problem Card Pack source file: ${deskLampProblemSourceFile}`)
const deskLampProblemSource = readJson(deskLampProblemSourceFile)
expect(
  deskLampProblemSource.batchId === deskLampProblemBatchId,
  `Desk Lamp Story Problem Card Pack source batchId must be ${deskLampProblemBatchId}.`,
)
const deskLampProblemProduct = products.products.find(
  (product) => product.slug === 'desk-lamp-story-problem-card-pack',
)
expect(
  deskLampProblemProduct,
  'Missing Desk Lamp Story Problem Card Pack product record for Batch 41 artifact validation.',
)
const deskLampProblemSourceErrors = validateDeskLampStoryProblemCardPackSource(
  deskLampProblemSource,
  deskLampProblemProduct,
  worldAgeBands,
)
expect(
  deskLampProblemSourceErrors.length === 0,
  `Desk Lamp Story Problem Card Pack source failed validation:\n${deskLampProblemSourceErrors.join('\n')}`,
)
const deskLampProblemSourceFileErrors = validateDeskLampStoryProblemCardPackSourceFiles(
  deskLampProblemSource,
  root,
)
expect(
  deskLampProblemSourceFileErrors.length === 0,
  `Desk Lamp Story Problem Card Pack sourceFiles failed validation:\n${deskLampProblemSourceFileErrors.join('\n')}`,
)
const deskLampProblemExpectedPdfPages = deskLampProblemSource.cards.length + 5
const deskLampProblemArtifactStatus = inspectArtifactFiles(root, deskLampProblemSource.artifact, {
  expectedPdfPages: deskLampProblemExpectedPdfPages,
})
expect(
  deskLampProblemArtifactStatus.valid,
  `Desk Lamp Story Problem Card Pack artifacts failed validation:\n${deskLampProblemArtifactStatus.errors.join('\n')}`,
)
expect(
  deskLampProblemArtifactStatus.files.pdf.size > 100_000,
  `Desk Lamp Story Problem Card Pack PDF artifact is unexpectedly small: ${deskLampProblemArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  deskLampProblemArtifactStatus.files.pdf.pageCount === deskLampProblemExpectedPdfPages,
  `Desk Lamp Story Problem Card Pack PDF artifact must have ${deskLampProblemExpectedPdfPages} pages.`,
)
expect(
  deskLampProblemArtifactStatus.files.zip.size > deskLampProblemArtifactStatus.files.pdf.size,
  'Desk Lamp Story Problem Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const deskLampProblemCheckoutErrors = validateCheckoutReadiness(
  deskLampProblemProduct,
  deskLampProblemArtifactStatus,
)
expect(
  deskLampProblemCheckoutErrors.length === 0,
  `Desk Lamp Story Problem Card Pack checkout readiness failed validation:\n${deskLampProblemCheckoutErrors.join('\n')}`,
)
const deskLampProblemArtifactManifest = readJson(resolve(root, deskLampProblemSource.artifact.manifestPath))
expect(
  deskLampProblemArtifactManifest.sourcePageCount === deskLampProblemSource.cards.length,
  'Desk Lamp Story Problem Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(deskLampProblemArtifactManifest.files.assets),
  'Desk Lamp Story Problem Card Pack artifact manifest files.assets must be an array.',
)
expect(
  deskLampProblemArtifactManifest.files.assets.length === deskLampProblemSource.worldSlugs.length,
  'Desk Lamp Story Problem Card Pack artifact manifest must include one copied local image per source world.',
)
const deskLampProblemManifestAssetErrors = validateManifestWorldAssets(
  deskLampProblemSource,
  deskLampProblemArtifactManifest,
)
expect(
  deskLampProblemManifestAssetErrors.length === 0,
  `Desk Lamp Story Problem Card Pack artifact manifest image coverage failed validation:\n${deskLampProblemManifestAssetErrors.join('\n')}`,
)
for (const asset of deskLampProblemArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Desk Lamp Story Problem Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(paperClipSolutionSourceFile), `Missing Batch 42 Paper Clip Story Solution Card Pack source file: ${paperClipSolutionSourceFile}`)
const paperClipSolutionSource = readJson(paperClipSolutionSourceFile)
expect(
  paperClipSolutionSource.batchId === paperClipSolutionBatchId,
  `Paper Clip Story Solution Card Pack source batchId must be ${paperClipSolutionBatchId}.`,
)
const paperClipSolutionProduct = products.products.find(
  (product) => product.slug === 'paper-clip-story-solution-card-pack',
)
expect(
  paperClipSolutionProduct,
  'Missing Paper Clip Story Solution Card Pack product record for Batch 42 artifact validation.',
)
const paperClipSolutionSourceErrors = validatePaperClipStorySolutionCardPackSource(
  paperClipSolutionSource,
  paperClipSolutionProduct,
  worldAgeBands,
)
expect(
  paperClipSolutionSourceErrors.length === 0,
  `Paper Clip Story Solution Card Pack source failed validation:\n${paperClipSolutionSourceErrors.join('\n')}`,
)
const paperClipSolutionSourceFileErrors = validatePaperClipStorySolutionCardPackSourceFiles(
  paperClipSolutionSource,
  root,
)
expect(
  paperClipSolutionSourceFileErrors.length === 0,
  `Paper Clip Story Solution Card Pack sourceFiles failed validation:\n${paperClipSolutionSourceFileErrors.join('\n')}`,
)
const paperClipSolutionExpectedPdfPages = paperClipSolutionSource.cards.length + 5
const paperClipSolutionArtifactStatus = inspectArtifactFiles(root, paperClipSolutionSource.artifact, {
  expectedPdfPages: paperClipSolutionExpectedPdfPages,
})
expect(
  paperClipSolutionArtifactStatus.valid,
  `Paper Clip Story Solution Card Pack artifacts failed validation:\n${paperClipSolutionArtifactStatus.errors.join('\n')}`,
)
expect(
  paperClipSolutionArtifactStatus.files.pdf.size > 100_000,
  `Paper Clip Story Solution Card Pack PDF artifact is unexpectedly small: ${paperClipSolutionArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  paperClipSolutionArtifactStatus.files.pdf.pageCount === paperClipSolutionExpectedPdfPages,
  `Paper Clip Story Solution Card Pack PDF artifact must have ${paperClipSolutionExpectedPdfPages} pages.`,
)
expect(
  paperClipSolutionArtifactStatus.files.zip.size > paperClipSolutionArtifactStatus.files.pdf.size,
  'Paper Clip Story Solution Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const paperClipSolutionCheckoutErrors = validateCheckoutReadiness(
  paperClipSolutionProduct,
  paperClipSolutionArtifactStatus,
)
expect(
  paperClipSolutionCheckoutErrors.length === 0,
  `Paper Clip Story Solution Card Pack checkout readiness failed validation:\n${paperClipSolutionCheckoutErrors.join('\n')}`,
)
const paperClipSolutionArtifactManifest = readJson(resolve(root, paperClipSolutionSource.artifact.manifestPath))
expect(
  paperClipSolutionArtifactManifest.sourcePageCount === paperClipSolutionSource.cards.length,
  'Paper Clip Story Solution Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(paperClipSolutionArtifactManifest.files.assets),
  'Paper Clip Story Solution Card Pack artifact manifest files.assets must be an array.',
)
expect(
  paperClipSolutionArtifactManifest.files.assets.length === paperClipSolutionSource.worldSlugs.length,
  'Paper Clip Story Solution Card Pack artifact manifest must include one copied local image per source world.',
)
const paperClipSolutionManifestAssetErrors = validateManifestWorldAssets(
  paperClipSolutionSource,
  paperClipSolutionArtifactManifest,
)
expect(
  paperClipSolutionManifestAssetErrors.length === 0,
  `Paper Clip Story Solution Card Pack artifact manifest image coverage failed validation:\n${paperClipSolutionManifestAssetErrors.join('\n')}`,
)
for (const asset of paperClipSolutionArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Paper Clip Story Solution Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(binderClipTransitionSourceFile), `Missing Batch 43 Binder Clip Story Transition Card Pack source file: ${binderClipTransitionSourceFile}`)
const binderClipTransitionSource = readJson(binderClipTransitionSourceFile)
expect(
  binderClipTransitionSource.batchId === binderClipTransitionBatchId,
  `Binder Clip Story Transition Card Pack source batchId must be ${binderClipTransitionBatchId}.`,
)
const binderClipTransitionProduct = products.products.find(
  (product) => product.slug === 'binder-clip-story-transition-card-pack',
)
expect(
  binderClipTransitionProduct,
  'Missing Binder Clip Story Transition Card Pack product record for Batch 43 artifact validation.',
)
const binderClipTransitionSourceErrors = validateBinderClipStoryTransitionCardPackSource(
  binderClipTransitionSource,
  binderClipTransitionProduct,
  worldAgeBands,
)
expect(
  binderClipTransitionSourceErrors.length === 0,
  `Binder Clip Story Transition Card Pack source failed validation:\n${binderClipTransitionSourceErrors.join('\n')}`,
)
const binderClipTransitionSourceFileErrors = validateBinderClipStoryTransitionCardPackSourceFiles(
  binderClipTransitionSource,
  root,
)
expect(
  binderClipTransitionSourceFileErrors.length === 0,
  `Binder Clip Story Transition Card Pack sourceFiles failed validation:\n${binderClipTransitionSourceFileErrors.join('\n')}`,
)
const binderClipTransitionExpectedPdfPages = binderClipTransitionSource.cards.length + 5
const binderClipTransitionArtifactStatus = inspectArtifactFiles(root, binderClipTransitionSource.artifact, {
  expectedPdfPages: binderClipTransitionExpectedPdfPages,
})
expect(
  binderClipTransitionArtifactStatus.valid,
  `Binder Clip Story Transition Card Pack artifacts failed validation:\n${binderClipTransitionArtifactStatus.errors.join('\n')}`,
)
expect(
  binderClipTransitionArtifactStatus.files.pdf.size > 100_000,
  `Binder Clip Story Transition Card Pack PDF artifact is unexpectedly small: ${binderClipTransitionArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  binderClipTransitionArtifactStatus.files.pdf.pageCount === binderClipTransitionExpectedPdfPages,
  `Binder Clip Story Transition Card Pack PDF artifact must have ${binderClipTransitionExpectedPdfPages} pages.`,
)
expect(
  binderClipTransitionArtifactStatus.files.zip.size > binderClipTransitionArtifactStatus.files.pdf.size,
  'Binder Clip Story Transition Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const binderClipTransitionCheckoutErrors = validateCheckoutReadiness(
  binderClipTransitionProduct,
  binderClipTransitionArtifactStatus,
)
expect(
  binderClipTransitionCheckoutErrors.length === 0,
  `Binder Clip Story Transition Card Pack checkout readiness failed validation:\n${binderClipTransitionCheckoutErrors.join('\n')}`,
)
const binderClipTransitionArtifactManifest = readJson(resolve(root, binderClipTransitionSource.artifact.manifestPath))
expect(
  binderClipTransitionArtifactManifest.sourcePageCount === binderClipTransitionSource.cards.length,
  'Binder Clip Story Transition Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(binderClipTransitionArtifactManifest.files.assets),
  'Binder Clip Story Transition Card Pack artifact manifest files.assets must be an array.',
)
expect(
  binderClipTransitionArtifactManifest.files.assets.length === binderClipTransitionSource.worldSlugs.length,
  'Binder Clip Story Transition Card Pack artifact manifest must include one copied local image per source world.',
)
const binderClipTransitionManifestAssetErrors = validateManifestWorldAssets(
  binderClipTransitionSource,
  binderClipTransitionArtifactManifest,
)
expect(
  binderClipTransitionManifestAssetErrors.length === 0,
  `Binder Clip Story Transition Card Pack artifact manifest image coverage failed validation:\n${binderClipTransitionManifestAssetErrors.join('\n')}`,
)
for (const asset of binderClipTransitionArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Binder Clip Story Transition Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(folderTabDetailSourceFile), `Missing Batch 44 Folder Tab Story Detail Card Pack source file: ${folderTabDetailSourceFile}`)
const folderTabDetailSource = readJson(folderTabDetailSourceFile)
expect(
  folderTabDetailSource.batchId === folderTabDetailBatchId,
  `Folder Tab Story Detail Card Pack source batchId must be ${folderTabDetailBatchId}.`,
)
const folderTabDetailProduct = products.products.find(
  (product) => product.slug === 'folder-tab-story-detail-card-pack',
)
expect(
  folderTabDetailProduct,
  'Missing Folder Tab Story Detail Card Pack product record for Batch 44 artifact validation.',
)
const folderTabDetailSourceErrors = validateFolderTabStoryDetailCardPackSource(
  folderTabDetailSource,
  folderTabDetailProduct,
  worldAgeBands,
)
expect(
  folderTabDetailSourceErrors.length === 0,
  `Folder Tab Story Detail Card Pack source failed validation:\n${folderTabDetailSourceErrors.join('\n')}`,
)
const folderTabDetailSourceFileErrors = validateFolderTabStoryDetailCardPackSourceFiles(
  folderTabDetailSource,
  root,
)
expect(
  folderTabDetailSourceFileErrors.length === 0,
  `Folder Tab Story Detail Card Pack sourceFiles failed validation:\n${folderTabDetailSourceFileErrors.join('\n')}`,
)
const folderTabDetailExpectedPdfPages = folderTabDetailSource.cards.length + 5
const folderTabDetailArtifactStatus = inspectArtifactFiles(root, folderTabDetailSource.artifact, {
  expectedPdfPages: folderTabDetailExpectedPdfPages,
})
expect(
  folderTabDetailArtifactStatus.valid,
  `Folder Tab Story Detail Card Pack artifacts failed validation:\n${folderTabDetailArtifactStatus.errors.join('\n')}`,
)
expect(
  folderTabDetailArtifactStatus.files.pdf.size > 100_000,
  `Folder Tab Story Detail Card Pack PDF artifact is unexpectedly small: ${folderTabDetailArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  folderTabDetailArtifactStatus.files.pdf.pageCount === folderTabDetailExpectedPdfPages,
  `Folder Tab Story Detail Card Pack PDF artifact must have ${folderTabDetailExpectedPdfPages} pages.`,
)
expect(
  folderTabDetailArtifactStatus.files.zip.size > folderTabDetailArtifactStatus.files.pdf.size,
  'Folder Tab Story Detail Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const folderTabDetailCheckoutErrors = validateCheckoutReadiness(
  folderTabDetailProduct,
  folderTabDetailArtifactStatus,
)
expect(
  folderTabDetailCheckoutErrors.length === 0,
  `Folder Tab Story Detail Card Pack checkout readiness failed validation:\n${folderTabDetailCheckoutErrors.join('\n')}`,
)
const folderTabDetailArtifactManifest = readJson(resolve(root, folderTabDetailSource.artifact.manifestPath))
expect(
  folderTabDetailArtifactManifest.sourcePageCount === folderTabDetailSource.cards.length,
  'Folder Tab Story Detail Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(folderTabDetailArtifactManifest.files.assets),
  'Folder Tab Story Detail Card Pack artifact manifest files.assets must be an array.',
)
expect(
  folderTabDetailArtifactManifest.files.assets.length === folderTabDetailSource.worldSlugs.length,
  'Folder Tab Story Detail Card Pack artifact manifest must include one copied local image per source world.',
)
const folderTabDetailManifestAssetErrors = validateManifestWorldAssets(
  folderTabDetailSource,
  folderTabDetailArtifactManifest,
)
expect(
  folderTabDetailManifestAssetErrors.length === 0,
  `Folder Tab Story Detail Card Pack artifact manifest image coverage failed validation:\n${folderTabDetailManifestAssetErrors.join('\n')}`,
)
for (const asset of folderTabDetailArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Folder Tab Story Detail Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(indexCardShowNotTellSourceFile), `Missing Batch 45 Index Card Story Show-Not-Tell Card Pack source file: ${indexCardShowNotTellSourceFile}`)
const indexCardShowNotTellSource = readJson(indexCardShowNotTellSourceFile)
expect(
  indexCardShowNotTellSource.batchId === indexCardShowNotTellBatchId,
  `Index Card Story Show-Not-Tell Card Pack source batchId must be ${indexCardShowNotTellBatchId}.`,
)
const indexCardShowNotTellProduct = products.products.find(
  (product) => product.slug === 'index-card-story-show-not-tell-card-pack',
)
expect(
  indexCardShowNotTellProduct,
  'Missing Index Card Story Show-Not-Tell Card Pack product record for Batch 45 artifact validation.',
)
const indexCardShowNotTellSourceErrors = validateIndexCardStoryShowNotTellCardPackSource(
  indexCardShowNotTellSource,
  indexCardShowNotTellProduct,
  worldAgeBands,
)
expect(
  indexCardShowNotTellSourceErrors.length === 0,
  `Index Card Story Show-Not-Tell Card Pack source failed validation:\n${indexCardShowNotTellSourceErrors.join('\n')}`,
)
const indexCardShowNotTellSourceFileErrors = validateIndexCardStoryShowNotTellCardPackSourceFiles(
  indexCardShowNotTellSource,
  root,
)
expect(
  indexCardShowNotTellSourceFileErrors.length === 0,
  `Index Card Story Show-Not-Tell Card Pack sourceFiles failed validation:\n${indexCardShowNotTellSourceFileErrors.join('\n')}`,
)
const indexCardShowNotTellExpectedPdfPages = indexCardShowNotTellSource.cards.length + 5
const indexCardShowNotTellArtifactStatus = inspectArtifactFiles(root, indexCardShowNotTellSource.artifact, {
  expectedPdfPages: indexCardShowNotTellExpectedPdfPages,
})
expect(
  indexCardShowNotTellArtifactStatus.valid,
  `Index Card Story Show-Not-Tell Card Pack artifacts failed validation:\n${indexCardShowNotTellArtifactStatus.errors.join('\n')}`,
)
expect(
  indexCardShowNotTellArtifactStatus.files.pdf.size > 100_000,
  `Index Card Story Show-Not-Tell Card Pack PDF artifact is unexpectedly small: ${indexCardShowNotTellArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  indexCardShowNotTellArtifactStatus.files.pdf.pageCount === indexCardShowNotTellExpectedPdfPages,
  `Index Card Story Show-Not-Tell Card Pack PDF artifact must have ${indexCardShowNotTellExpectedPdfPages} pages.`,
)
expect(
  indexCardShowNotTellArtifactStatus.files.zip.size > indexCardShowNotTellArtifactStatus.files.pdf.size,
  'Index Card Story Show-Not-Tell Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const indexCardShowNotTellCheckoutErrors = validateCheckoutReadiness(
  indexCardShowNotTellProduct,
  indexCardShowNotTellArtifactStatus,
)
expect(
  indexCardShowNotTellCheckoutErrors.length === 0,
  `Index Card Story Show-Not-Tell Card Pack checkout readiness failed validation:\n${indexCardShowNotTellCheckoutErrors.join('\n')}`,
)
const indexCardShowNotTellArtifactManifest = readJson(resolve(root, indexCardShowNotTellSource.artifact.manifestPath))
expect(
  indexCardShowNotTellArtifactManifest.sourcePageCount === indexCardShowNotTellSource.cards.length,
  'Index Card Story Show-Not-Tell Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(indexCardShowNotTellArtifactManifest.files.assets),
  'Index Card Story Show-Not-Tell Card Pack artifact manifest files.assets must be an array.',
)
expect(
  indexCardShowNotTellArtifactManifest.files.assets.length === indexCardShowNotTellSource.worldSlugs.length,
  'Index Card Story Show-Not-Tell Card Pack artifact manifest must include one copied local image per source world.',
)
const indexCardShowNotTellManifestAssetErrors = validateManifestWorldAssets(
  indexCardShowNotTellSource,
  indexCardShowNotTellArtifactManifest,
)
expect(
  indexCardShowNotTellManifestAssetErrors.length === 0,
  `Index Card Story Show-Not-Tell Card Pack artifact manifest image coverage failed validation:\n${indexCardShowNotTellManifestAssetErrors.join('\n')}`,
)
for (const asset of indexCardShowNotTellArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Index Card Story Show-Not-Tell Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(stickyNoteToneSourceFile), `Missing Batch 46 Sticky Note Story Tone Card Pack source file: ${stickyNoteToneSourceFile}`)
const stickyNoteToneSource = readJson(stickyNoteToneSourceFile)
expect(
  stickyNoteToneSource.batchId === stickyNoteToneBatchId,
  `Sticky Note Story Tone Card Pack source batchId must be ${stickyNoteToneBatchId}.`,
)
const stickyNoteToneProduct = products.products.find(
  (product) => product.slug === 'sticky-note-story-tone-card-pack',
)
expect(
  stickyNoteToneProduct,
  'Missing Sticky Note Story Tone Card Pack product record for Batch 46 artifact validation.',
)
const stickyNoteToneSourceErrors = validateStickyNoteStoryToneCardPackSource(
  stickyNoteToneSource,
  stickyNoteToneProduct,
  worldAgeBands,
)
expect(
  stickyNoteToneSourceErrors.length === 0,
  `Sticky Note Story Tone Card Pack source failed validation:\n${stickyNoteToneSourceErrors.join('\n')}`,
)
const stickyNoteToneSourceFileErrors = validateStickyNoteStoryToneCardPackSourceFiles(
  stickyNoteToneSource,
  root,
)
expect(
  stickyNoteToneSourceFileErrors.length === 0,
  `Sticky Note Story Tone Card Pack sourceFiles failed validation:\n${stickyNoteToneSourceFileErrors.join('\n')}`,
)
const stickyNoteToneExpectedPdfPages = stickyNoteToneSource.cards.length + 5
const stickyNoteToneArtifactStatus = inspectArtifactFiles(root, stickyNoteToneSource.artifact, {
  expectedPdfPages: stickyNoteToneExpectedPdfPages,
})
expect(
  stickyNoteToneArtifactStatus.valid,
  `Sticky Note Story Tone Card Pack artifacts failed validation:\n${stickyNoteToneArtifactStatus.errors.join('\n')}`,
)
expect(
  stickyNoteToneArtifactStatus.files.pdf.size > 100_000,
  `Sticky Note Story Tone Card Pack PDF artifact is unexpectedly small: ${stickyNoteToneArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  stickyNoteToneArtifactStatus.files.pdf.pageCount === stickyNoteToneExpectedPdfPages,
  `Sticky Note Story Tone Card Pack PDF artifact must have ${stickyNoteToneExpectedPdfPages} pages.`,
)
expect(
  stickyNoteToneArtifactStatus.files.zip.size > stickyNoteToneArtifactStatus.files.pdf.size,
  'Sticky Note Story Tone Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const stickyNoteToneCheckoutErrors = validateCheckoutReadiness(
  stickyNoteToneProduct,
  stickyNoteToneArtifactStatus,
)
expect(
  stickyNoteToneCheckoutErrors.length === 0,
  `Sticky Note Story Tone Card Pack checkout readiness failed validation:\n${stickyNoteToneCheckoutErrors.join('\n')}`,
)
const stickyNoteToneArtifactManifest = readJson(resolve(root, stickyNoteToneSource.artifact.manifestPath))
expect(
  stickyNoteToneArtifactManifest.sourcePageCount === stickyNoteToneSource.cards.length,
  'Sticky Note Story Tone Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(stickyNoteToneArtifactManifest.files.assets),
  'Sticky Note Story Tone Card Pack artifact manifest files.assets must be an array.',
)
expect(
  stickyNoteToneArtifactManifest.files.assets.length === stickyNoteToneSource.worldSlugs.length,
  'Sticky Note Story Tone Card Pack artifact manifest must include one copied local image per source world.',
)
const stickyNoteToneManifestAssetErrors = validateManifestWorldAssets(
  stickyNoteToneSource,
  stickyNoteToneArtifactManifest,
)
expect(
  stickyNoteToneManifestAssetErrors.length === 0,
  `Sticky Note Story Tone Card Pack artifact manifest image coverage failed validation:\n${stickyNoteToneManifestAssetErrors.join('\n')}`,
)
for (const asset of stickyNoteToneArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Sticky Note Story Tone Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(washiTapeWordChoiceSourceFile), `Missing Batch 47 Washi Tape Story Word Choice Card Pack source file: ${washiTapeWordChoiceSourceFile}`)
const washiTapeWordChoiceSource = readJson(washiTapeWordChoiceSourceFile)
expect(
  washiTapeWordChoiceSource.batchId === washiTapeWordChoiceBatchId,
  `Washi Tape Story Word Choice Card Pack source batchId must be ${washiTapeWordChoiceBatchId}.`,
)
const washiTapeWordChoiceProduct = products.products.find(
  (product) => product.slug === 'washi-tape-story-word-choice-card-pack',
)
expect(
  washiTapeWordChoiceProduct,
  'Missing Washi Tape Story Word Choice Card Pack product record for Batch 47 artifact validation.',
)
const washiTapeWordChoiceSourceErrors = validateWashiTapeStoryWordChoiceCardPackSource(
  washiTapeWordChoiceSource,
  washiTapeWordChoiceProduct,
  worldAgeBands,
)
expect(
  washiTapeWordChoiceSourceErrors.length === 0,
  `Washi Tape Story Word Choice Card Pack source failed validation:\n${washiTapeWordChoiceSourceErrors.join('\n')}`,
)
const washiTapeWordChoiceSourceFileErrors = validateWashiTapeStoryWordChoiceCardPackSourceFiles(
  washiTapeWordChoiceSource,
  root,
)
expect(
  washiTapeWordChoiceSourceFileErrors.length === 0,
  `Washi Tape Story Word Choice Card Pack sourceFiles failed validation:\n${washiTapeWordChoiceSourceFileErrors.join('\n')}`,
)
const washiTapeWordChoiceExpectedPdfPages = washiTapeWordChoiceSource.cards.length + 5
const washiTapeWordChoiceArtifactStatus = inspectArtifactFiles(root, washiTapeWordChoiceSource.artifact, {
  expectedPdfPages: washiTapeWordChoiceExpectedPdfPages,
})
expect(
  washiTapeWordChoiceArtifactStatus.valid,
  `Washi Tape Story Word Choice Card Pack artifacts failed validation:\n${washiTapeWordChoiceArtifactStatus.errors.join('\n')}`,
)
expect(
  washiTapeWordChoiceArtifactStatus.files.pdf.size > 100_000,
  `Washi Tape Story Word Choice Card Pack PDF artifact is unexpectedly small: ${washiTapeWordChoiceArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  washiTapeWordChoiceArtifactStatus.files.pdf.pageCount === washiTapeWordChoiceExpectedPdfPages,
  `Washi Tape Story Word Choice Card Pack PDF artifact must have ${washiTapeWordChoiceExpectedPdfPages} pages.`,
)
expect(
  washiTapeWordChoiceArtifactStatus.files.zip.size > washiTapeWordChoiceArtifactStatus.files.pdf.size,
  'Washi Tape Story Word Choice Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const washiTapeWordChoiceCheckoutErrors = validateCheckoutReadiness(
  washiTapeWordChoiceProduct,
  washiTapeWordChoiceArtifactStatus,
)
expect(
  washiTapeWordChoiceCheckoutErrors.length === 0,
  `Washi Tape Story Word Choice Card Pack checkout readiness failed validation:\n${washiTapeWordChoiceCheckoutErrors.join('\n')}`,
)
const washiTapeWordChoiceArtifactManifest = readJson(resolve(root, washiTapeWordChoiceSource.artifact.manifestPath))
expect(
  washiTapeWordChoiceArtifactManifest.sourcePageCount === washiTapeWordChoiceSource.cards.length,
  'Washi Tape Story Word Choice Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(washiTapeWordChoiceArtifactManifest.files.assets),
  'Washi Tape Story Word Choice Card Pack artifact manifest files.assets must be an array.',
)
expect(
  washiTapeWordChoiceArtifactManifest.files.assets.length === washiTapeWordChoiceSource.worldSlugs.length,
  'Washi Tape Story Word Choice Card Pack artifact manifest must include one copied local image per source world.',
)
const washiTapeWordChoiceManifestAssetErrors = validateManifestWorldAssets(
  washiTapeWordChoiceSource,
  washiTapeWordChoiceArtifactManifest,
)
expect(
  washiTapeWordChoiceManifestAssetErrors.length === 0,
  `Washi Tape Story Word Choice Card Pack artifact manifest image coverage failed validation:\n${washiTapeWordChoiceManifestAssetErrors.join('\n')}`,
)
for (const asset of washiTapeWordChoiceArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Washi Tape Story Word Choice Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(paperSleeveSentenceVarietySourceFile), `Missing Batch 48 Paper Sleeve Story Sentence Variety Card Pack source file: ${paperSleeveSentenceVarietySourceFile}`)
const paperSleeveSentenceVarietySource = readJson(paperSleeveSentenceVarietySourceFile)
expect(
  paperSleeveSentenceVarietySource.batchId === paperSleeveSentenceVarietyBatchId,
  `Paper Sleeve Story Sentence Variety Card Pack source batchId must be ${paperSleeveSentenceVarietyBatchId}.`,
)
const paperSleeveSentenceVarietyProduct = products.products.find(
  (product) => product.slug === 'paper-sleeve-story-sentence-variety-card-pack',
)
expect(
  paperSleeveSentenceVarietyProduct,
  'Missing Paper Sleeve Story Sentence Variety Card Pack product record for Batch 48 artifact validation.',
)
const paperSleeveSentenceVarietySourceErrors = validatePaperSleeveStorySentenceVarietyCardPackSource(
  paperSleeveSentenceVarietySource,
  paperSleeveSentenceVarietyProduct,
  worldAgeBands,
)
expect(
  paperSleeveSentenceVarietySourceErrors.length === 0,
  `Paper Sleeve Story Sentence Variety Card Pack source failed validation:\n${paperSleeveSentenceVarietySourceErrors.join('\n')}`,
)
const paperSleeveSentenceVarietySourceFileErrors = validatePaperSleeveStorySentenceVarietyCardPackSourceFiles(
  paperSleeveSentenceVarietySource,
  root,
)
expect(
  paperSleeveSentenceVarietySourceFileErrors.length === 0,
  `Paper Sleeve Story Sentence Variety Card Pack sourceFiles failed validation:\n${paperSleeveSentenceVarietySourceFileErrors.join('\n')}`,
)
const paperSleeveSentenceVarietyExpectedPdfPages = paperSleeveSentenceVarietySource.cards.length + 5
const paperSleeveSentenceVarietyArtifactStatus = inspectArtifactFiles(root, paperSleeveSentenceVarietySource.artifact, {
  expectedPdfPages: paperSleeveSentenceVarietyExpectedPdfPages,
})
expect(
  paperSleeveSentenceVarietyArtifactStatus.valid,
  `Paper Sleeve Story Sentence Variety Card Pack artifacts failed validation:\n${paperSleeveSentenceVarietyArtifactStatus.errors.join('\n')}`,
)
expect(
  paperSleeveSentenceVarietyArtifactStatus.files.pdf.size > 100_000,
  `Paper Sleeve Story Sentence Variety Card Pack PDF artifact is unexpectedly small: ${paperSleeveSentenceVarietyArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  paperSleeveSentenceVarietyArtifactStatus.files.pdf.pageCount === paperSleeveSentenceVarietyExpectedPdfPages,
  `Paper Sleeve Story Sentence Variety Card Pack PDF artifact must have ${paperSleeveSentenceVarietyExpectedPdfPages} pages.`,
)
expect(
  paperSleeveSentenceVarietyArtifactStatus.files.zip.size > paperSleeveSentenceVarietyArtifactStatus.files.pdf.size,
  'Paper Sleeve Story Sentence Variety Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const paperSleeveSentenceVarietyCheckoutErrors = validateCheckoutReadiness(
  paperSleeveSentenceVarietyProduct,
  paperSleeveSentenceVarietyArtifactStatus,
)
expect(
  paperSleeveSentenceVarietyCheckoutErrors.length === 0,
  `Paper Sleeve Story Sentence Variety Card Pack checkout readiness failed validation:\n${paperSleeveSentenceVarietyCheckoutErrors.join('\n')}`,
)
const paperSleeveSentenceVarietyArtifactManifest = readJson(resolve(root, paperSleeveSentenceVarietySource.artifact.manifestPath))
expect(
  paperSleeveSentenceVarietyArtifactManifest.sourcePageCount === paperSleeveSentenceVarietySource.cards.length,
  'Paper Sleeve Story Sentence Variety Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(paperSleeveSentenceVarietyArtifactManifest.files.assets),
  'Paper Sleeve Story Sentence Variety Card Pack artifact manifest files.assets must be an array.',
)
expect(
  paperSleeveSentenceVarietyArtifactManifest.files.assets.length === paperSleeveSentenceVarietySource.worldSlugs.length,
  'Paper Sleeve Story Sentence Variety Card Pack artifact manifest must include one copied local image per source world.',
)
const paperSleeveSentenceVarietyManifestAssetErrors = validateManifestWorldAssets(
  paperSleeveSentenceVarietySource,
  paperSleeveSentenceVarietyArtifactManifest,
)
expect(
  paperSleeveSentenceVarietyManifestAssetErrors.length === 0,
  `Paper Sleeve Story Sentence Variety Card Pack artifact manifest image coverage failed validation:\n${paperSleeveSentenceVarietyManifestAssetErrors.join('\n')}`,
)
for (const asset of paperSleeveSentenceVarietyArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Paper Sleeve Story Sentence Variety Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(clipboardParagraphFocusSourceFile), `Missing Batch 49 Clipboard Story Paragraph Focus Card Pack source file: ${clipboardParagraphFocusSourceFile}`)
const clipboardParagraphFocusSource = readJson(clipboardParagraphFocusSourceFile)
expect(
  clipboardParagraphFocusSource.batchId === clipboardParagraphFocusBatchId,
  `Clipboard Story Paragraph Focus Card Pack source batchId must be ${clipboardParagraphFocusBatchId}.`,
)
const clipboardParagraphFocusProduct = products.products.find(
  (product) => product.slug === 'clipboard-story-paragraph-focus-card-pack',
)
expect(
  clipboardParagraphFocusProduct,
  'Missing Clipboard Story Paragraph Focus Card Pack product record for Batch 49 artifact validation.',
)
const clipboardParagraphFocusSourceErrors = validateClipboardStoryParagraphFocusCardPackSource(
  clipboardParagraphFocusSource,
  clipboardParagraphFocusProduct,
  worldAgeBands,
)
expect(
  clipboardParagraphFocusSourceErrors.length === 0,
  `Clipboard Story Paragraph Focus Card Pack source failed validation:\n${clipboardParagraphFocusSourceErrors.join('\n')}`,
)
const clipboardParagraphFocusSourceFileErrors = validateClipboardStoryParagraphFocusCardPackSourceFiles(
  clipboardParagraphFocusSource,
  root,
)
expect(
  clipboardParagraphFocusSourceFileErrors.length === 0,
  `Clipboard Story Paragraph Focus Card Pack sourceFiles failed validation:\n${clipboardParagraphFocusSourceFileErrors.join('\n')}`,
)
const clipboardParagraphFocusExpectedPdfPages = clipboardParagraphFocusSource.cards.length + 5
const clipboardParagraphFocusArtifactStatus = inspectArtifactFiles(root, clipboardParagraphFocusSource.artifact, {
  expectedPdfPages: clipboardParagraphFocusExpectedPdfPages,
  expectedZipEntries: [
    'Clipboard-Story-Paragraph-Focus-Card-Pack.pdf',
    'README.txt',
    'source/clipboard-story-paragraph-focus-card-pack.html',
    ...clipboardParagraphFocusSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ],
})
expect(
  clipboardParagraphFocusArtifactStatus.valid,
  `Clipboard Story Paragraph Focus Card Pack artifacts failed validation:\n${clipboardParagraphFocusArtifactStatus.errors.join('\n')}`,
)
expect(
  clipboardParagraphFocusArtifactStatus.files.pdf.size > 100_000,
  `Clipboard Story Paragraph Focus Card Pack PDF artifact is unexpectedly small: ${clipboardParagraphFocusArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  clipboardParagraphFocusArtifactStatus.files.pdf.pageCount === clipboardParagraphFocusExpectedPdfPages,
  `Clipboard Story Paragraph Focus Card Pack PDF artifact must have ${clipboardParagraphFocusExpectedPdfPages} pages.`,
)
expect(
  clipboardParagraphFocusArtifactStatus.files.zip.size > clipboardParagraphFocusArtifactStatus.files.pdf.size,
  'Clipboard Story Paragraph Focus Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const clipboardParagraphFocusCheckoutErrors = validateCheckoutReadiness(
  clipboardParagraphFocusProduct,
  clipboardParagraphFocusArtifactStatus,
)
expect(
  clipboardParagraphFocusCheckoutErrors.length === 0,
  `Clipboard Story Paragraph Focus Card Pack checkout readiness failed validation:\n${clipboardParagraphFocusCheckoutErrors.join('\n')}`,
)
const clipboardParagraphFocusArtifactManifest = readJson(resolve(root, clipboardParagraphFocusSource.artifact.manifestPath))
expect(
  clipboardParagraphFocusArtifactManifest.sourcePageCount === clipboardParagraphFocusSource.cards.length,
  'Clipboard Story Paragraph Focus Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(clipboardParagraphFocusArtifactManifest.files.assets),
  'Clipboard Story Paragraph Focus Card Pack artifact manifest files.assets must be an array.',
)
expect(
  clipboardParagraphFocusArtifactManifest.files.assets.length === clipboardParagraphFocusSource.worldSlugs.length,
  'Clipboard Story Paragraph Focus Card Pack artifact manifest must include one copied local image per source world.',
)
const clipboardParagraphFocusManifestAssetErrors = validateManifestWorldAssets(
  clipboardParagraphFocusSource,
  clipboardParagraphFocusArtifactManifest,
)
expect(
  clipboardParagraphFocusManifestAssetErrors.length === 0,
  `Clipboard Story Paragraph Focus Card Pack artifact manifest image coverage failed validation:\n${clipboardParagraphFocusManifestAssetErrors.join('\n')}`,
)
for (const asset of clipboardParagraphFocusArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Clipboard Story Paragraph Focus Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(existsSync(linedPaperParagraphRevisionSourceFile), `Missing Batch 50 Lined Paper Story Paragraph Revision Card Pack source file: ${linedPaperParagraphRevisionSourceFile}`)
const linedPaperParagraphRevisionSource = readJson(linedPaperParagraphRevisionSourceFile)
expect(
  linedPaperParagraphRevisionSource.batchId === linedPaperParagraphRevisionBatchId,
  `Lined Paper Story Paragraph Revision Card Pack source batchId must be ${linedPaperParagraphRevisionBatchId}.`,
)
const linedPaperParagraphRevisionProduct = products.products.find(
  (product) => product.slug === 'lined-paper-story-paragraph-revision-card-pack',
)
expect(
  linedPaperParagraphRevisionProduct,
  'Missing Lined Paper Story Paragraph Revision Card Pack product record for Batch 50 artifact validation.',
)
const linedPaperParagraphRevisionSourceErrors = validateLinedPaperStoryParagraphRevisionCardPackSource(
  linedPaperParagraphRevisionSource,
  linedPaperParagraphRevisionProduct,
  worldAgeBands,
)
expect(
  linedPaperParagraphRevisionSourceErrors.length === 0,
  `Lined Paper Story Paragraph Revision Card Pack source failed validation:\n${linedPaperParagraphRevisionSourceErrors.join('\n')}`,
)
const linedPaperParagraphRevisionSourceFileErrors = validateLinedPaperStoryParagraphRevisionCardPackSourceFiles(
  linedPaperParagraphRevisionSource,
  root,
)
expect(
  linedPaperParagraphRevisionSourceFileErrors.length === 0,
  `Lined Paper Story Paragraph Revision Card Pack sourceFiles failed validation:\n${linedPaperParagraphRevisionSourceFileErrors.join('\n')}`,
)
const linedPaperParagraphRevisionExpectedPdfPages = linedPaperParagraphRevisionSource.cards.length + 5
const linedPaperParagraphRevisionArtifactStatus = inspectArtifactFiles(root, linedPaperParagraphRevisionSource.artifact, {
  expectedPdfPages: linedPaperParagraphRevisionExpectedPdfPages,
  expectedZipEntries: [
    'Lined-Paper-Story-Paragraph-Revision-Card-Pack.pdf',
    'README.txt',
    'source/lined-paper-story-paragraph-revision-card-pack.html',
    ...linedPaperParagraphRevisionSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ],
})
expect(
  linedPaperParagraphRevisionArtifactStatus.valid,
  `Lined Paper Story Paragraph Revision Card Pack artifacts failed validation:\n${linedPaperParagraphRevisionArtifactStatus.errors.join('\n')}`,
)
expect(
  linedPaperParagraphRevisionArtifactStatus.files.pdf.size > 100_000,
  `Lined Paper Story Paragraph Revision Card Pack PDF artifact is unexpectedly small: ${linedPaperParagraphRevisionArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  linedPaperParagraphRevisionArtifactStatus.files.pdf.pageCount === linedPaperParagraphRevisionExpectedPdfPages,
  `Lined Paper Story Paragraph Revision Card Pack PDF artifact must have ${linedPaperParagraphRevisionExpectedPdfPages} pages.`,
)
expect(
  linedPaperParagraphRevisionArtifactStatus.files.zip.size > linedPaperParagraphRevisionArtifactStatus.files.pdf.size,
  'Lined Paper Story Paragraph Revision Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const linedPaperParagraphRevisionCheckoutErrors = validateCheckoutReadiness(
  linedPaperParagraphRevisionProduct,
  linedPaperParagraphRevisionArtifactStatus,
)
expect(
  linedPaperParagraphRevisionCheckoutErrors.length === 0,
  `Lined Paper Story Paragraph Revision Card Pack checkout readiness failed validation:\n${linedPaperParagraphRevisionCheckoutErrors.join('\n')}`,
)
const linedPaperParagraphRevisionArtifactManifest = readJson(resolve(root, linedPaperParagraphRevisionSource.artifact.manifestPath))
expect(
  linedPaperParagraphRevisionArtifactManifest.sourcePageCount === linedPaperParagraphRevisionSource.cards.length,
  'Lined Paper Story Paragraph Revision Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(linedPaperParagraphRevisionArtifactManifest.files.assets),
  'Lined Paper Story Paragraph Revision Card Pack artifact manifest files.assets must be an array.',
)
expect(
  linedPaperParagraphRevisionArtifactManifest.files.assets.length === linedPaperParagraphRevisionSource.worldSlugs.length,
  'Lined Paper Story Paragraph Revision Card Pack artifact manifest must include one copied local image per source world.',
)
const linedPaperParagraphRevisionManifestAssetErrors = validateManifestWorldAssets(
  linedPaperParagraphRevisionSource,
  linedPaperParagraphRevisionArtifactManifest,
)
expect(
  linedPaperParagraphRevisionManifestAssetErrors.length === 0,
  `Lined Paper Story Paragraph Revision Card Pack artifact manifest image coverage failed validation:\n${linedPaperParagraphRevisionManifestAssetErrors.join('\n')}`,
)
for (const asset of linedPaperParagraphRevisionArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Lined Paper Story Paragraph Revision Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(
  existsSync(compositionNotebookDraftChecklistSourceFile),
  `Missing Batch 51 Composition Notebook Story Draft Checklist Card Pack source file: ${compositionNotebookDraftChecklistSourceFile}`,
)
const compositionNotebookDraftChecklistSource = readJson(compositionNotebookDraftChecklistSourceFile)
expect(
  compositionNotebookDraftChecklistSource.batchId === compositionNotebookDraftChecklistBatchId,
  `Composition Notebook Story Draft Checklist Card Pack source batchId must be ${compositionNotebookDraftChecklistBatchId}.`,
)
const compositionNotebookDraftChecklistProduct = products.products.find(
  (product) => product.slug === 'composition-notebook-story-draft-checklist-card-pack',
)
expect(
  compositionNotebookDraftChecklistProduct,
  'Missing Composition Notebook Story Draft Checklist Card Pack product record for Batch 51 artifact validation.',
)
const compositionNotebookDraftChecklistSourceErrors = validateCompositionNotebookStoryDraftChecklistCardPackSource(
  compositionNotebookDraftChecklistSource,
  compositionNotebookDraftChecklistProduct,
  worldAgeBands,
)
expect(
  compositionNotebookDraftChecklistSourceErrors.length === 0,
  `Composition Notebook Story Draft Checklist Card Pack source failed validation:\n${compositionNotebookDraftChecklistSourceErrors.join('\n')}`,
)
const compositionNotebookDraftChecklistSourceFileErrors = validateCompositionNotebookStoryDraftChecklistCardPackSourceFiles(
  compositionNotebookDraftChecklistSource,
  root,
)
expect(
  compositionNotebookDraftChecklistSourceFileErrors.length === 0,
  `Composition Notebook Story Draft Checklist Card Pack sourceFiles failed validation:\n${compositionNotebookDraftChecklistSourceFileErrors.join('\n')}`,
)
const compositionNotebookDraftChecklistExpectedPdfPages = compositionNotebookDraftChecklistSource.cards.length + 5
const compositionNotebookDraftChecklistArtifactStatus = inspectArtifactFiles(root, compositionNotebookDraftChecklistSource.artifact, {
  expectedPdfPages: compositionNotebookDraftChecklistExpectedPdfPages,
  expectedZipEntries: [
    'Composition-Notebook-Story-Draft-Checklist-Card-Pack.pdf',
    'README.txt',
    'source/composition-notebook-story-draft-checklist-card-pack.html',
    ...compositionNotebookDraftChecklistSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ],
})
expect(
  compositionNotebookDraftChecklistArtifactStatus.valid,
  `Composition Notebook Story Draft Checklist Card Pack artifacts failed validation:\n${compositionNotebookDraftChecklistArtifactStatus.errors.join('\n')}`,
)
expect(
  compositionNotebookDraftChecklistArtifactStatus.files.pdf.size > 100_000,
  `Composition Notebook Story Draft Checklist Card Pack PDF artifact is unexpectedly small: ${compositionNotebookDraftChecklistArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  compositionNotebookDraftChecklistArtifactStatus.files.pdf.pageCount === compositionNotebookDraftChecklistExpectedPdfPages,
  `Composition Notebook Story Draft Checklist Card Pack PDF artifact must have ${compositionNotebookDraftChecklistExpectedPdfPages} pages.`,
)
expect(
  compositionNotebookDraftChecklistArtifactStatus.files.zip.size > compositionNotebookDraftChecklistArtifactStatus.files.pdf.size,
  'Composition Notebook Story Draft Checklist Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const compositionNotebookDraftChecklistCheckoutErrors = validateCheckoutReadiness(
  compositionNotebookDraftChecklistProduct,
  compositionNotebookDraftChecklistArtifactStatus,
)
expect(
  compositionNotebookDraftChecklistCheckoutErrors.length === 0,
  `Composition Notebook Story Draft Checklist Card Pack checkout readiness failed validation:\n${compositionNotebookDraftChecklistCheckoutErrors.join('\n')}`,
)
const compositionNotebookDraftChecklistArtifactManifest = readJson(
  resolve(root, compositionNotebookDraftChecklistSource.artifact.manifestPath),
)
expect(
  compositionNotebookDraftChecklistArtifactManifest.sourcePageCount === compositionNotebookDraftChecklistSource.cards.length,
  'Composition Notebook Story Draft Checklist Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(compositionNotebookDraftChecklistArtifactManifest.files.assets),
  'Composition Notebook Story Draft Checklist Card Pack artifact manifest files.assets must be an array.',
)
expect(
  compositionNotebookDraftChecklistArtifactManifest.files.assets.length === compositionNotebookDraftChecklistSource.worldSlugs.length,
  'Composition Notebook Story Draft Checklist Card Pack artifact manifest must include one copied local image per source world.',
)
const compositionNotebookDraftChecklistManifestAssetErrors = validateManifestWorldAssets(
  compositionNotebookDraftChecklistSource,
  compositionNotebookDraftChecklistArtifactManifest,
)
expect(
  compositionNotebookDraftChecklistManifestAssetErrors.length === 0,
  `Composition Notebook Story Draft Checklist Card Pack artifact manifest image coverage failed validation:\n${compositionNotebookDraftChecklistManifestAssetErrors.join('\n')}`,
)
for (const asset of compositionNotebookDraftChecklistArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Composition Notebook Story Draft Checklist Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(
  existsSync(spiralNotebookFinalCopySourceFile),
  `Missing Batch 52 Spiral Notebook Story Final Copy Card Pack source file: ${spiralNotebookFinalCopySourceFile}`,
)
const spiralNotebookFinalCopySource = readJson(spiralNotebookFinalCopySourceFile)
expect(
  spiralNotebookFinalCopySource.batchId === spiralNotebookFinalCopyBatchId,
  `Spiral Notebook Story Final Copy Card Pack source batchId must be ${spiralNotebookFinalCopyBatchId}.`,
)
const spiralNotebookFinalCopyProduct = products.products.find(
  (product) => product.slug === 'spiral-notebook-story-final-copy-card-pack',
)
expect(
  spiralNotebookFinalCopyProduct,
  'Missing Spiral Notebook Story Final Copy Card Pack product record for Batch 52 artifact validation.',
)
const spiralNotebookFinalCopySourceErrors = validateSpiralNotebookStoryFinalCopyCardPackSource(
  spiralNotebookFinalCopySource,
  spiralNotebookFinalCopyProduct,
  worldAgeBands,
)
expect(
  spiralNotebookFinalCopySourceErrors.length === 0,
  `Spiral Notebook Story Final Copy Card Pack source failed validation:\n${spiralNotebookFinalCopySourceErrors.join('\n')}`,
)
const spiralNotebookFinalCopySourceFileErrors = validateSpiralNotebookStoryFinalCopyCardPackSourceFiles(
  spiralNotebookFinalCopySource,
  root,
)
expect(
  spiralNotebookFinalCopySourceFileErrors.length === 0,
  `Spiral Notebook Story Final Copy Card Pack sourceFiles failed validation:\n${spiralNotebookFinalCopySourceFileErrors.join('\n')}`,
)
const spiralNotebookFinalCopyExpectedPdfPages = spiralNotebookFinalCopySource.cards.length + 5
const spiralNotebookFinalCopyArtifactStatus = inspectArtifactFiles(root, spiralNotebookFinalCopySource.artifact, {
  expectedPdfPages: spiralNotebookFinalCopyExpectedPdfPages,
  expectedZipEntries: [
    'Spiral-Notebook-Story-Final-Copy-Card-Pack.pdf',
    'README.txt',
    'source/spiral-notebook-story-final-copy-card-pack.html',
    ...spiralNotebookFinalCopySource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ],
})
expect(
  spiralNotebookFinalCopyArtifactStatus.valid,
  `Spiral Notebook Story Final Copy Card Pack artifacts failed validation:\n${spiralNotebookFinalCopyArtifactStatus.errors.join('\n')}`,
)
expect(
  spiralNotebookFinalCopyArtifactStatus.files.pdf.size > 100_000,
  `Spiral Notebook Story Final Copy Card Pack PDF artifact is unexpectedly small: ${spiralNotebookFinalCopyArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  spiralNotebookFinalCopyArtifactStatus.files.pdf.pageCount === spiralNotebookFinalCopyExpectedPdfPages,
  `Spiral Notebook Story Final Copy Card Pack PDF artifact must have ${spiralNotebookFinalCopyExpectedPdfPages} pages.`,
)
expect(
  spiralNotebookFinalCopyArtifactStatus.files.zip.size > spiralNotebookFinalCopyArtifactStatus.files.pdf.size,
  'Spiral Notebook Story Final Copy Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const spiralNotebookFinalCopyCheckoutErrors = validateCheckoutReadiness(
  spiralNotebookFinalCopyProduct,
  spiralNotebookFinalCopyArtifactStatus,
)
expect(
  spiralNotebookFinalCopyCheckoutErrors.length === 0,
  `Spiral Notebook Story Final Copy Card Pack checkout readiness failed validation:\n${spiralNotebookFinalCopyCheckoutErrors.join('\n')}`,
)
const spiralNotebookFinalCopyArtifactManifest = readJson(resolve(root, spiralNotebookFinalCopySource.artifact.manifestPath))
expect(
  spiralNotebookFinalCopyArtifactManifest.sourcePageCount === spiralNotebookFinalCopySource.cards.length,
  'Spiral Notebook Story Final Copy Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(spiralNotebookFinalCopyArtifactManifest.files.assets),
  'Spiral Notebook Story Final Copy Card Pack artifact manifest files.assets must be an array.',
)
expect(
  spiralNotebookFinalCopyArtifactManifest.files.assets.length === spiralNotebookFinalCopySource.worldSlugs.length,
  'Spiral Notebook Story Final Copy Card Pack artifact manifest must include one copied local image per source world.',
)
const spiralNotebookFinalCopyManifestAssetErrors = validateManifestWorldAssets(
  spiralNotebookFinalCopySource,
  spiralNotebookFinalCopyArtifactManifest,
)
expect(
  spiralNotebookFinalCopyManifestAssetErrors.length === 0,
  `Spiral Notebook Story Final Copy Card Pack artifact manifest image coverage failed validation:\n${spiralNotebookFinalCopyManifestAssetErrors.join('\n')}`,
)
for (const asset of spiralNotebookFinalCopyArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Spiral Notebook Story Final Copy Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(
  existsSync(tabbedFolderStorySeriesSourceFile),
  `Missing Batch 53 Tabbed Folder Story Series Card Pack source file: ${tabbedFolderStorySeriesSourceFile}`,
)
const tabbedFolderStorySeriesSource = readJson(tabbedFolderStorySeriesSourceFile)
expect(
  tabbedFolderStorySeriesSource.batchId === tabbedFolderStorySeriesBatchId,
  `Tabbed Folder Story Series Card Pack source batchId must be ${tabbedFolderStorySeriesBatchId}.`,
)
const tabbedFolderStorySeriesProduct = products.products.find(
  (product) => product.slug === 'tabbed-folder-story-series-card-pack',
)
expect(
  tabbedFolderStorySeriesProduct,
  'Missing Tabbed Folder Story Series Card Pack product record for Batch 53 artifact validation.',
)
const tabbedFolderStorySeriesSourceErrors = validateTabbedFolderStorySeriesCardPackSource(
  tabbedFolderStorySeriesSource,
  tabbedFolderStorySeriesProduct,
  worldAgeBands,
)
expect(
  tabbedFolderStorySeriesSourceErrors.length === 0,
  `Tabbed Folder Story Series Card Pack source failed validation:\n${tabbedFolderStorySeriesSourceErrors.join('\n')}`,
)
const tabbedFolderStorySeriesSourceFileErrors = validateTabbedFolderStorySeriesCardPackSourceFiles(
  tabbedFolderStorySeriesSource,
  root,
)
expect(
  tabbedFolderStorySeriesSourceFileErrors.length === 0,
  `Tabbed Folder Story Series Card Pack sourceFiles failed validation:\n${tabbedFolderStorySeriesSourceFileErrors.join('\n')}`,
)
const tabbedFolderStorySeriesExpectedPdfPages = tabbedFolderStorySeriesSource.cards.length + 5
const tabbedFolderStorySeriesArtifactStatus = inspectArtifactFiles(root, tabbedFolderStorySeriesSource.artifact, {
  expectedPdfPages: tabbedFolderStorySeriesExpectedPdfPages,
  expectedZipEntries: [
    'Tabbed-Folder-Story-Series-Card-Pack.pdf',
    'README.txt',
    'source/tabbed-folder-story-series-card-pack.html',
    ...tabbedFolderStorySeriesSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ],
})
expect(
  tabbedFolderStorySeriesArtifactStatus.valid,
  `Tabbed Folder Story Series Card Pack artifacts failed validation:\n${tabbedFolderStorySeriesArtifactStatus.errors.join('\n')}`,
)
expect(
  tabbedFolderStorySeriesArtifactStatus.files.pdf.size > 100_000,
  `Tabbed Folder Story Series Card Pack PDF artifact is unexpectedly small: ${tabbedFolderStorySeriesArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  tabbedFolderStorySeriesArtifactStatus.files.pdf.pageCount === tabbedFolderStorySeriesExpectedPdfPages,
  `Tabbed Folder Story Series Card Pack PDF artifact must have ${tabbedFolderStorySeriesExpectedPdfPages} pages.`,
)
expect(
  tabbedFolderStorySeriesArtifactStatus.files.zip.size > tabbedFolderStorySeriesArtifactStatus.files.pdf.size,
  'Tabbed Folder Story Series Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const tabbedFolderStorySeriesCheckoutErrors = validateCheckoutReadiness(
  tabbedFolderStorySeriesProduct,
  tabbedFolderStorySeriesArtifactStatus,
)
expect(
  tabbedFolderStorySeriesCheckoutErrors.length === 0,
  `Tabbed Folder Story Series Card Pack checkout readiness failed validation:\n${tabbedFolderStorySeriesCheckoutErrors.join('\n')}`,
)
const tabbedFolderStorySeriesArtifactManifest = readJson(resolve(root, tabbedFolderStorySeriesSource.artifact.manifestPath))
expect(
  tabbedFolderStorySeriesArtifactManifest.sourcePageCount === tabbedFolderStorySeriesSource.cards.length,
  'Tabbed Folder Story Series Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(tabbedFolderStorySeriesArtifactManifest.files.assets),
  'Tabbed Folder Story Series Card Pack artifact manifest files.assets must be an array.',
)
expect(
  tabbedFolderStorySeriesArtifactManifest.files.assets.length === tabbedFolderStorySeriesSource.worldSlugs.length,
  'Tabbed Folder Story Series Card Pack artifact manifest must include one copied local image per source world.',
)
const tabbedFolderStorySeriesManifestAssetErrors = validateManifestWorldAssets(
  tabbedFolderStorySeriesSource,
  tabbedFolderStorySeriesArtifactManifest,
)
expect(
  tabbedFolderStorySeriesManifestAssetErrors.length === 0,
  `Tabbed Folder Story Series Card Pack artifact manifest image coverage failed validation:\n${tabbedFolderStorySeriesManifestAssetErrors.join('\n')}`,
)
for (const asset of tabbedFolderStorySeriesArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Tabbed Folder Story Series Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(
  existsSync(accordionFolderStoryArcSourceFile),
  `Missing Batch 54 Accordion Folder Story Arc Card Pack source file: ${accordionFolderStoryArcSourceFile}`,
)
const accordionFolderStoryArcSource = readJson(accordionFolderStoryArcSourceFile)
expect(
  accordionFolderStoryArcSource.batchId === accordionFolderStoryArcBatchId,
  `Accordion Folder Story Arc Card Pack source batchId must be ${accordionFolderStoryArcBatchId}.`,
)
const accordionFolderStoryArcProduct = products.products.find(
  (product) => product.slug === 'accordion-folder-story-arc-card-pack',
)
expect(
  accordionFolderStoryArcProduct,
  'Missing Accordion Folder Story Arc Card Pack product record for Batch 54 artifact validation.',
)
const accordionFolderStoryArcSourceErrors = validateAccordionFolderStoryArcCardPackSource(
  accordionFolderStoryArcSource,
  accordionFolderStoryArcProduct,
  worldAgeBands,
)
expect(
  accordionFolderStoryArcSourceErrors.length === 0,
  `Accordion Folder Story Arc Card Pack source failed validation:\n${accordionFolderStoryArcSourceErrors.join('\n')}`,
)
const accordionFolderStoryArcSourceFileErrors = validateAccordionFolderStoryArcCardPackSourceFiles(
  accordionFolderStoryArcSource,
  root,
)
expect(
  accordionFolderStoryArcSourceFileErrors.length === 0,
  `Accordion Folder Story Arc Card Pack sourceFiles failed validation:\n${accordionFolderStoryArcSourceFileErrors.join('\n')}`,
)
const accordionFolderStoryArcExpectedPdfPages = accordionFolderStoryArcSource.cards.length + 5
const accordionFolderStoryArcArtifactStatus = inspectArtifactFiles(root, accordionFolderStoryArcSource.artifact, {
  expectedPdfPages: accordionFolderStoryArcExpectedPdfPages,
  expectedZipEntries: [
    'Accordion-Folder-Story-Arc-Card-Pack.pdf',
    'README.txt',
    'source/accordion-folder-story-arc-card-pack.html',
    ...accordionFolderStoryArcSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
  ],
})
expect(
  accordionFolderStoryArcArtifactStatus.valid,
  `Accordion Folder Story Arc Card Pack artifacts failed validation:\n${accordionFolderStoryArcArtifactStatus.errors.join('\n')}`,
)
expect(
  accordionFolderStoryArcArtifactStatus.files.pdf.size > 100_000,
  `Accordion Folder Story Arc Card Pack PDF artifact is unexpectedly small: ${accordionFolderStoryArcArtifactStatus.files.pdf.size} bytes.`,
)
expect(
  accordionFolderStoryArcArtifactStatus.files.pdf.pageCount === accordionFolderStoryArcExpectedPdfPages,
  `Accordion Folder Story Arc Card Pack PDF artifact must have ${accordionFolderStoryArcExpectedPdfPages} pages.`,
)
expect(
  accordionFolderStoryArcArtifactStatus.files.zip.size > accordionFolderStoryArcArtifactStatus.files.pdf.size,
  'Accordion Folder Story Arc Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
)
const accordionFolderStoryArcCheckoutErrors = validateCheckoutReadiness(
  accordionFolderStoryArcProduct,
  accordionFolderStoryArcArtifactStatus,
)
expect(
  accordionFolderStoryArcCheckoutErrors.length === 0,
  `Accordion Folder Story Arc Card Pack checkout readiness failed validation:\n${accordionFolderStoryArcCheckoutErrors.join('\n')}`,
)
const accordionFolderStoryArcArtifactManifest = readJson(resolve(root, accordionFolderStoryArcSource.artifact.manifestPath))
expect(
  accordionFolderStoryArcArtifactManifest.sourcePageCount === accordionFolderStoryArcSource.cards.length,
  'Accordion Folder Story Arc Card Pack artifact manifest sourcePageCount must match source cards.',
)
expect(
  Array.isArray(accordionFolderStoryArcArtifactManifest.files.assets),
  'Accordion Folder Story Arc Card Pack artifact manifest files.assets must be an array.',
)
expect(
  accordionFolderStoryArcArtifactManifest.files.assets.length === accordionFolderStoryArcSource.worldSlugs.length,
  'Accordion Folder Story Arc Card Pack artifact manifest must include one copied local image per source world.',
)
const accordionFolderStoryArcManifestAssetErrors = validateManifestWorldAssets(
  accordionFolderStoryArcSource,
  accordionFolderStoryArcArtifactManifest,
)
expect(
  accordionFolderStoryArcManifestAssetErrors.length === 0,
  `Accordion Folder Story Arc Card Pack artifact manifest image coverage failed validation:\n${accordionFolderStoryArcManifestAssetErrors.join('\n')}`,
)
for (const asset of accordionFolderStoryArcArtifactManifest.files.assets) {
  validateImageFile(
    resolve(root, asset.path),
    `Accordion Folder Story Arc Card Pack copied artifact image ${asset.path}`,
    'jpeg',
  )
}

expect(
  existsSync(expandingFileStorySceneChainSourceFile),
  `Missing Batch 55 Expanding File Story Scene Chain Card Pack source file: ${expandingFileStorySceneChainSourceFile}`,
)
const expandingFileStorySceneChainSource = readJson(expandingFileStorySceneChainSourceFile)
expect(
  expandingFileStorySceneChainSource.batchId === '2026-06-03-batch55',
  'Expanding File Story Scene Chain Card Pack source batchId must be 2026-06-03-batch55.',
)
const expandingFileStorySceneChainProduct = products.products.find(
  (product) => product.slug === 'expanding-file-story-scene-chain-card-pack',
)
expect(
  expandingFileStorySceneChainProduct,
  'Missing Expanding File Story Scene Chain Card Pack product record for Batch 55 artifact validation.',
)
const expandingFileStorySceneChainSourceErrors = validateExpandingFileStorySceneChainCardPackSource(
  expandingFileStorySceneChainSource,
  expandingFileStorySceneChainProduct,
  worldAgeBands,
)
expect(
  expandingFileStorySceneChainSourceErrors.length === 0,
  `Expanding File Story Scene Chain Card Pack source failed validation:\n${expandingFileStorySceneChainSourceErrors.join('\n')}`,
)
const expandingFileStorySceneChainSourceFileErrors = validateExpandingFileStorySceneChainCardPackSourceFiles(
  expandingFileStorySceneChainSource,
  root,
)
expect(
  expandingFileStorySceneChainSourceFileErrors.length === 0,
  `Expanding File Story Scene Chain Card Pack sourceFiles failed validation:\n${expandingFileStorySceneChainSourceFileErrors.join('\n')}`,
)
const expandingFileStorySceneChainArtifactPaths = Object.values(expandingFileStorySceneChainSource.artifact).map((relativePath) =>
  resolve(root, relativePath),
)
const expandingFileStorySceneChainAnyArtifactFilesExist = anyPathExists(expandingFileStorySceneChainArtifactPaths)
if (expandingFileStorySceneChainAnyArtifactFilesExist) {
  for (const artifactPath of expandingFileStorySceneChainArtifactPaths) {
    expect(
      existsSync(artifactPath),
      `Expanding File Story Scene Chain Card Pack artifact set is incomplete after artifact generation started: ${artifactPath}`,
    )
  }
  const expandingFileStorySceneChainExpectedPdfPages = expandingFileStorySceneChainSource.cards.length + 5
  const expandingFileStorySceneChainArtifactStatus = inspectArtifactFiles(root, expandingFileStorySceneChainSource.artifact, {
    expectedPdfPages: expandingFileStorySceneChainExpectedPdfPages,
    expectedZipEntries: [
      'Expanding-File-Story-Scene-Chain-Card-Pack.pdf',
      'README.txt',
      'source/expanding-file-story-scene-chain-card-pack.html',
      ...expandingFileStorySceneChainSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
    ],
  })
  expect(
    expandingFileStorySceneChainArtifactStatus.valid,
    `Expanding File Story Scene Chain Card Pack artifacts failed validation:\n${expandingFileStorySceneChainArtifactStatus.errors.join('\n')}`,
  )
  expect(
    expandingFileStorySceneChainArtifactStatus.files.pdf.size > 100_000,
    `Expanding File Story Scene Chain Card Pack PDF artifact is unexpectedly small: ${expandingFileStorySceneChainArtifactStatus.files.pdf.size} bytes.`,
  )
  expect(
    expandingFileStorySceneChainArtifactStatus.files.pdf.pageCount === expandingFileStorySceneChainExpectedPdfPages,
    `Expanding File Story Scene Chain Card Pack PDF artifact must have ${expandingFileStorySceneChainExpectedPdfPages} pages.`,
  )
  expect(
    expandingFileStorySceneChainArtifactStatus.files.zip.size > expandingFileStorySceneChainArtifactStatus.files.pdf.size,
    'Expanding File Story Scene Chain Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
  )
  const expandingFileStorySceneChainCheckoutErrors = validateCheckoutReadiness(
    expandingFileStorySceneChainProduct,
    expandingFileStorySceneChainArtifactStatus,
  )
  expect(
    expandingFileStorySceneChainCheckoutErrors.length === 0,
    `Expanding File Story Scene Chain Card Pack checkout readiness failed validation:\n${expandingFileStorySceneChainCheckoutErrors.join('\n')}`,
  )
  const expandingFileStorySceneChainArtifactManifest = readJson(resolve(root, expandingFileStorySceneChainSource.artifact.manifestPath))
  expect(
    expandingFileStorySceneChainArtifactManifest.sourcePageCount === expandingFileStorySceneChainSource.cards.length,
    'Expanding File Story Scene Chain Card Pack artifact manifest sourcePageCount must match source cards.',
  )
  expect(
    Array.isArray(expandingFileStorySceneChainArtifactManifest.files.assets),
    'Expanding File Story Scene Chain Card Pack artifact manifest files.assets must be an array.',
  )
  expect(
    expandingFileStorySceneChainArtifactManifest.files.assets.length === expandingFileStorySceneChainSource.worldSlugs.length,
    'Expanding File Story Scene Chain Card Pack artifact manifest must include one copied local image per source world.',
  )
  const expandingFileStorySceneChainManifestAssetErrors = validateManifestWorldAssets(
    expandingFileStorySceneChainSource,
    expandingFileStorySceneChainArtifactManifest,
  )
  expect(
    expandingFileStorySceneChainManifestAssetErrors.length === 0,
    `Expanding File Story Scene Chain Card Pack artifact manifest image coverage failed validation:\n${expandingFileStorySceneChainManifestAssetErrors.join('\n')}`,
  )
  for (const asset of expandingFileStorySceneChainArtifactManifest.files.assets) {
    validateImageFile(
      resolve(root, asset.path),
      `Expanding File Story Scene Chain Card Pack copied artifact image ${asset.path}`,
      'jpeg',
    )
  }
}

expect(
  existsSync(manilaFolderStoryClueTrailSourceFile),
  `Missing Batch 56 Manila Folder Story Clue Trail Card Pack source file: ${manilaFolderStoryClueTrailSourceFile}`,
)
const manilaFolderStoryClueTrailSource = readJson(manilaFolderStoryClueTrailSourceFile)
expect(
  manilaFolderStoryClueTrailSource.batchId === '2026-06-03-batch56',
  'Manila Folder Story Clue Trail Card Pack source batchId must be 2026-06-03-batch56.',
)
const manilaFolderStoryClueTrailProduct = products.products.find(
  (product) => product.slug === 'manila-folder-story-clue-trail-card-pack',
)
expect(
  manilaFolderStoryClueTrailProduct,
  'Missing Manila Folder Story Clue Trail Card Pack product record for Batch 56 artifact validation.',
)
const manilaFolderStoryClueTrailSourceErrors = validateManilaFolderStoryClueTrailCardPackSource(
  manilaFolderStoryClueTrailSource,
  manilaFolderStoryClueTrailProduct,
  worldAgeBands,
)
expect(
  manilaFolderStoryClueTrailSourceErrors.length === 0,
  `Manila Folder Story Clue Trail Card Pack source failed validation:\n${manilaFolderStoryClueTrailSourceErrors.join('\n')}`,
)
const manilaFolderStoryClueTrailSourceFileErrors = validateManilaFolderStoryClueTrailCardPackSourceFiles(
  manilaFolderStoryClueTrailSource,
  root,
)
expect(
  manilaFolderStoryClueTrailSourceFileErrors.length === 0,
  `Manila Folder Story Clue Trail Card Pack sourceFiles failed validation:\n${manilaFolderStoryClueTrailSourceFileErrors.join('\n')}`,
)
const manilaFolderStoryClueTrailArtifactPaths = Object.values(manilaFolderStoryClueTrailSource.artifact).map((relativePath) =>
  resolve(root, relativePath),
)
const manilaFolderStoryClueTrailAnyArtifactFilesExist = anyPathExists(manilaFolderStoryClueTrailArtifactPaths)
if (manilaFolderStoryClueTrailAnyArtifactFilesExist) {
  for (const artifactPath of manilaFolderStoryClueTrailArtifactPaths) {
    expect(
      existsSync(artifactPath),
      `Manila Folder Story Clue Trail Card Pack artifact set is incomplete after artifact generation started: ${artifactPath}`,
    )
  }
  const manilaFolderStoryClueTrailExpectedPdfPages = manilaFolderStoryClueTrailSource.cards.length + 5
  const manilaFolderStoryClueTrailArtifactStatus = inspectArtifactFiles(root, manilaFolderStoryClueTrailSource.artifact, {
    expectedPdfPages: manilaFolderStoryClueTrailExpectedPdfPages,
    expectedZipEntries: [
      'Manila-Folder-Story-Clue-Trail-Card-Pack.pdf',
      'README.txt',
      'source/manila-folder-story-clue-trail-card-pack.html',
      ...manilaFolderStoryClueTrailSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
    ],
  })
  expect(
    manilaFolderStoryClueTrailArtifactStatus.valid,
    `Manila Folder Story Clue Trail Card Pack artifacts failed validation:\n${manilaFolderStoryClueTrailArtifactStatus.errors.join('\n')}`,
  )
  expect(
    manilaFolderStoryClueTrailArtifactStatus.files.pdf.size > 100_000,
    `Manila Folder Story Clue Trail Card Pack PDF artifact is unexpectedly small: ${manilaFolderStoryClueTrailArtifactStatus.files.pdf.size} bytes.`,
  )
  expect(
    manilaFolderStoryClueTrailArtifactStatus.files.pdf.pageCount === manilaFolderStoryClueTrailExpectedPdfPages,
    `Manila Folder Story Clue Trail Card Pack PDF artifact must have ${manilaFolderStoryClueTrailExpectedPdfPages} pages.`,
  )
  expect(
    manilaFolderStoryClueTrailArtifactStatus.files.zip.size > manilaFolderStoryClueTrailArtifactStatus.files.pdf.size,
    'Manila Folder Story Clue Trail Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
  )
  const manilaFolderStoryClueTrailCheckoutErrors = validateCheckoutReadiness(
    manilaFolderStoryClueTrailProduct,
    manilaFolderStoryClueTrailArtifactStatus,
  )
  expect(
    manilaFolderStoryClueTrailCheckoutErrors.length === 0,
    `Manila Folder Story Clue Trail Card Pack checkout readiness failed validation:\n${manilaFolderStoryClueTrailCheckoutErrors.join('\n')}`,
  )
  const manilaFolderStoryClueTrailArtifactManifest = readJson(resolve(root, manilaFolderStoryClueTrailSource.artifact.manifestPath))
  expect(
    manilaFolderStoryClueTrailArtifactManifest.sourcePageCount === manilaFolderStoryClueTrailSource.cards.length,
    'Manila Folder Story Clue Trail Card Pack artifact manifest sourcePageCount must match source cards.',
  )
  expect(
    Array.isArray(manilaFolderStoryClueTrailArtifactManifest.files.assets),
    'Manila Folder Story Clue Trail Card Pack artifact manifest files.assets must be an array.',
  )
  expect(
    manilaFolderStoryClueTrailArtifactManifest.files.assets.length === manilaFolderStoryClueTrailSource.worldSlugs.length,
    'Manila Folder Story Clue Trail Card Pack artifact manifest must include one copied local image per source world.',
  )
  const manilaFolderStoryClueTrailManifestAssetErrors = validateManifestWorldAssets(
    manilaFolderStoryClueTrailSource,
    manilaFolderStoryClueTrailArtifactManifest,
  )
  expect(
    manilaFolderStoryClueTrailManifestAssetErrors.length === 0,
    `Manila Folder Story Clue Trail Card Pack artifact manifest image coverage failed validation:\n${manilaFolderStoryClueTrailManifestAssetErrors.join('\n')}`,
  )
  for (const asset of manilaFolderStoryClueTrailArtifactManifest.files.assets) {
    validateImageFile(
      resolve(root, asset.path),
      `Manila Folder Story Clue Trail Card Pack copied artifact image ${asset.path}`,
      'jpeg',
    )
  }
}

expect(
  existsSync(pocketFolderStoryGoalPathSourceFile),
  `Missing Batch 57 Pocket Folder Story Goal Path Card Pack source file: ${pocketFolderStoryGoalPathSourceFile}`,
)
const pocketFolderStoryGoalPathSource = readJson(pocketFolderStoryGoalPathSourceFile)
expect(
  pocketFolderStoryGoalPathSource.batchId === '2026-06-03-batch57',
  'Pocket Folder Story Goal Path Card Pack source batchId must be 2026-06-03-batch57.',
)
const pocketFolderStoryGoalPathProduct = products.products.find(
  (product) => product.slug === 'pocket-folder-story-goal-path-card-pack',
)
expect(
  pocketFolderStoryGoalPathProduct,
  'Missing Pocket Folder Story Goal Path Card Pack product record for Batch 57 artifact validation.',
)
const pocketFolderStoryGoalPathSourceErrors = validatePocketFolderStoryGoalPathCardPackSource(
  pocketFolderStoryGoalPathSource,
  pocketFolderStoryGoalPathProduct,
  worldAgeBands,
)
expect(
  pocketFolderStoryGoalPathSourceErrors.length === 0,
  `Pocket Folder Story Goal Path Card Pack source failed validation:\n${pocketFolderStoryGoalPathSourceErrors.join('\n')}`,
)
const pocketFolderStoryGoalPathSourceFileErrors = validatePocketFolderStoryGoalPathCardPackSourceFiles(
  pocketFolderStoryGoalPathSource,
  root,
)
expect(
  pocketFolderStoryGoalPathSourceFileErrors.length === 0,
  `Pocket Folder Story Goal Path Card Pack sourceFiles failed validation:\n${pocketFolderStoryGoalPathSourceFileErrors.join('\n')}`,
)
const pocketFolderStoryGoalPathSummaryErrors = validateProductWorldSummaries(
  pocketFolderStoryGoalPathProduct,
  'Pocket Folder Story Goal Path Card Pack',
)
expect(
  pocketFolderStoryGoalPathSummaryErrors.length === 0,
  `Pocket Folder Story Goal Path Card Pack world summaries failed validation:\n${pocketFolderStoryGoalPathSummaryErrors.join('\n')}`,
)
const pocketFolderStoryGoalPathArtifactPaths = Object.values(pocketFolderStoryGoalPathSource.artifact).map((relativePath) =>
  resolve(root, relativePath),
)
const pocketFolderStoryGoalPathAnyArtifactFilesExist = anyPathExists(pocketFolderStoryGoalPathArtifactPaths)
if (pocketFolderStoryGoalPathAnyArtifactFilesExist) {
  for (const artifactPath of pocketFolderStoryGoalPathArtifactPaths) {
    expect(
      existsSync(artifactPath),
      `Pocket Folder Story Goal Path Card Pack artifact set is incomplete after artifact generation started: ${artifactPath}`,
    )
  }
  const pocketFolderStoryGoalPathExpectedPdfPages = pocketFolderStoryGoalPathSource.cards.length + 5
  const pocketFolderStoryGoalPathArtifactStatus = inspectArtifactFiles(root, pocketFolderStoryGoalPathSource.artifact, {
    expectedPdfPages: pocketFolderStoryGoalPathExpectedPdfPages,
    expectedZipEntries: [
      'Pocket-Folder-Story-Goal-Path-Card-Pack.pdf',
      'README.txt',
      'source/pocket-folder-story-goal-path-card-pack.html',
      ...pocketFolderStoryGoalPathSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
    ],
  })
  expect(
    pocketFolderStoryGoalPathArtifactStatus.valid,
    `Pocket Folder Story Goal Path Card Pack artifacts failed validation:\n${pocketFolderStoryGoalPathArtifactStatus.errors.join('\n')}`,
  )
  expect(
    pocketFolderStoryGoalPathArtifactStatus.files.pdf.size > 100_000,
    `Pocket Folder Story Goal Path Card Pack PDF artifact is unexpectedly small: ${pocketFolderStoryGoalPathArtifactStatus.files.pdf.size} bytes.`,
  )
  expect(
    pocketFolderStoryGoalPathArtifactStatus.files.pdf.pageCount === pocketFolderStoryGoalPathExpectedPdfPages,
    `Pocket Folder Story Goal Path Card Pack PDF artifact must have ${pocketFolderStoryGoalPathExpectedPdfPages} pages.`,
  )
  expect(
    pocketFolderStoryGoalPathArtifactStatus.files.zip.size > pocketFolderStoryGoalPathArtifactStatus.files.pdf.size,
    'Pocket Folder Story Goal Path Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
  )
  const pocketFolderStoryGoalPathCheckoutErrors = validateCheckoutReadiness(
    pocketFolderStoryGoalPathProduct,
    pocketFolderStoryGoalPathArtifactStatus,
  )
  expect(
    pocketFolderStoryGoalPathCheckoutErrors.length === 0,
    `Pocket Folder Story Goal Path Card Pack checkout readiness failed validation:\n${pocketFolderStoryGoalPathCheckoutErrors.join('\n')}`,
  )
  const pocketFolderStoryGoalPathArtifactManifest = readJson(resolve(root, pocketFolderStoryGoalPathSource.artifact.manifestPath))
  expect(
    pocketFolderStoryGoalPathArtifactManifest.sourcePageCount === pocketFolderStoryGoalPathSource.cards.length,
    'Pocket Folder Story Goal Path Card Pack artifact manifest sourcePageCount must match source cards.',
  )
  expect(
    Array.isArray(pocketFolderStoryGoalPathArtifactManifest.files.assets),
    'Pocket Folder Story Goal Path Card Pack artifact manifest files.assets must be an array.',
  )
  expect(
    pocketFolderStoryGoalPathArtifactManifest.files.assets.length === pocketFolderStoryGoalPathSource.worldSlugs.length,
    'Pocket Folder Story Goal Path Card Pack artifact manifest must include one copied local image per source world.',
  )
  const pocketFolderStoryGoalPathManifestAssetErrors = validateManifestWorldAssets(
    pocketFolderStoryGoalPathSource,
    pocketFolderStoryGoalPathArtifactManifest,
  )
  expect(
    pocketFolderStoryGoalPathManifestAssetErrors.length === 0,
    `Pocket Folder Story Goal Path Card Pack artifact manifest image coverage failed validation:\n${pocketFolderStoryGoalPathManifestAssetErrors.join('\n')}`,
  )
  for (const asset of pocketFolderStoryGoalPathArtifactManifest.files.assets) {
    validateImageFile(
      resolve(root, asset.path),
      `Pocket Folder Story Goal Path Card Pack copied artifact image ${asset.path}`,
      'jpeg',
    )
  }
}

expect(
  existsSync(hangingFileStoryDecisionPointSourceFile),
  `Missing Batch 58 Hanging File Story Decision Point Card Pack source file: ${hangingFileStoryDecisionPointSourceFile}`,
)
const hangingFileStoryDecisionPointSource = readJson(hangingFileStoryDecisionPointSourceFile)
expect(
  hangingFileStoryDecisionPointSource.batchId === '2026-06-03-batch58',
  'Hanging File Story Decision Point Card Pack source batchId must be 2026-06-03-batch58.',
)
const hangingFileStoryDecisionPointProduct = products.products.find(
  (product) => product.slug === 'hanging-file-story-decision-point-card-pack',
)
expect(
  hangingFileStoryDecisionPointProduct,
  'Missing Hanging File Story Decision Point Card Pack product record for Batch 58 artifact validation.',
)
const hangingFileStoryDecisionPointSourceErrors = validateHangingFileStoryDecisionPointCardPackSource(
  hangingFileStoryDecisionPointSource,
  hangingFileStoryDecisionPointProduct,
  worldAgeBands,
)
expect(
  hangingFileStoryDecisionPointSourceErrors.length === 0,
  `Hanging File Story Decision Point Card Pack source failed validation:\n${hangingFileStoryDecisionPointSourceErrors.join('\n')}`,
)
const hangingFileStoryDecisionPointSourceFileErrors = validateHangingFileStoryDecisionPointCardPackSourceFiles(
  hangingFileStoryDecisionPointSource,
  root,
)
expect(
  hangingFileStoryDecisionPointSourceFileErrors.length === 0,
  `Hanging File Story Decision Point Card Pack sourceFiles failed validation:\n${hangingFileStoryDecisionPointSourceFileErrors.join('\n')}`,
)
const hangingFileStoryDecisionPointSummaryErrors = validateProductWorldSummaries(
  hangingFileStoryDecisionPointProduct,
  'Hanging File Story Decision Point Card Pack',
)
expect(
  hangingFileStoryDecisionPointSummaryErrors.length === 0,
  `Hanging File Story Decision Point Card Pack world summaries failed validation:\n${hangingFileStoryDecisionPointSummaryErrors.join('\n')}`,
)
const hangingFileStoryDecisionPointArtifactPaths = Object.values(hangingFileStoryDecisionPointSource.artifact).map(
  (relativePath) => resolve(root, relativePath),
)
const hangingFileStoryDecisionPointAnyArtifactFilesExist = anyPathExists(hangingFileStoryDecisionPointArtifactPaths)
if (hangingFileStoryDecisionPointAnyArtifactFilesExist) {
  for (const artifactPath of hangingFileStoryDecisionPointArtifactPaths) {
    expect(
      existsSync(artifactPath),
      `Hanging File Story Decision Point Card Pack artifact set is incomplete after artifact generation started: ${artifactPath}`,
    )
  }
  const hangingFileStoryDecisionPointExpectedPdfPages = hangingFileStoryDecisionPointSource.cards.length + 5
  const hangingFileStoryDecisionPointArtifactStatus = inspectArtifactFiles(
    root,
    hangingFileStoryDecisionPointSource.artifact,
    {
      expectedPdfPages: hangingFileStoryDecisionPointExpectedPdfPages,
      expectedZipEntries: [
        'Hanging-File-Story-Decision-Point-Card-Pack.pdf',
        'README.txt',
        'source/hanging-file-story-decision-point-card-pack.html',
        ...hangingFileStoryDecisionPointSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
      ],
    },
  )
  expect(
    hangingFileStoryDecisionPointArtifactStatus.valid,
    `Hanging File Story Decision Point Card Pack artifacts failed validation:\n${hangingFileStoryDecisionPointArtifactStatus.errors.join('\n')}`,
  )
  expect(
    hangingFileStoryDecisionPointArtifactStatus.files.pdf.size > 100_000,
    `Hanging File Story Decision Point Card Pack PDF artifact is unexpectedly small: ${hangingFileStoryDecisionPointArtifactStatus.files.pdf.size} bytes.`,
  )
  expect(
    hangingFileStoryDecisionPointArtifactStatus.files.pdf.pageCount === hangingFileStoryDecisionPointExpectedPdfPages,
    `Hanging File Story Decision Point Card Pack PDF artifact must have ${hangingFileStoryDecisionPointExpectedPdfPages} pages.`,
  )
  expect(
    hangingFileStoryDecisionPointArtifactStatus.files.zip.size > hangingFileStoryDecisionPointArtifactStatus.files.pdf.size,
    'Hanging File Story Decision Point Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
  )
  const hangingFileStoryDecisionPointCheckoutErrors = validateCheckoutReadiness(
    hangingFileStoryDecisionPointProduct,
    hangingFileStoryDecisionPointArtifactStatus,
  )
  expect(
    hangingFileStoryDecisionPointCheckoutErrors.length === 0,
    `Hanging File Story Decision Point Card Pack checkout readiness failed validation:\n${hangingFileStoryDecisionPointCheckoutErrors.join('\n')}`,
  )
  const hangingFileStoryDecisionPointArtifactManifest = readJson(
    resolve(root, hangingFileStoryDecisionPointSource.artifact.manifestPath),
  )
  expect(
    hangingFileStoryDecisionPointArtifactManifest.sourcePageCount === hangingFileStoryDecisionPointSource.cards.length,
    'Hanging File Story Decision Point Card Pack artifact manifest sourcePageCount must match source cards.',
  )
  expect(
    Array.isArray(hangingFileStoryDecisionPointArtifactManifest.files?.assets),
    'Hanging File Story Decision Point Card Pack artifact manifest files.assets must be an array.',
  )
  expect(
    hangingFileStoryDecisionPointArtifactManifest.files.assets.length ===
      hangingFileStoryDecisionPointSource.worldSlugs.length,
    'Hanging File Story Decision Point Card Pack artifact manifest must include one copied local image per source world.',
  )
  const hangingFileStoryDecisionPointManifestAssetErrors = validateManifestWorldAssets(
    hangingFileStoryDecisionPointSource,
    hangingFileStoryDecisionPointArtifactManifest,
  )
  expect(
    hangingFileStoryDecisionPointManifestAssetErrors.length === 0,
    `Hanging File Story Decision Point Card Pack artifact manifest image coverage failed validation:\n${hangingFileStoryDecisionPointManifestAssetErrors.join('\n')}`,
  )
  for (const asset of hangingFileStoryDecisionPointArtifactManifest.files.assets) {
    validateImageFile(
      resolve(root, asset.path),
      `Hanging File Story Decision Point Card Pack copied artifact image ${asset.path}`,
      'jpeg',
    )
  }
}

expect(
  existsSync(fileBoxStoryTurningPointSourceFile),
  `Missing Batch 59 File Box Story Turning Point Card Pack source file: ${fileBoxStoryTurningPointSourceFile}`,
)
const fileBoxStoryTurningPointSource = readJson(fileBoxStoryTurningPointSourceFile)
expect(
  fileBoxStoryTurningPointSource.batchId === '2026-06-04-batch59',
  'File Box Story Turning Point Card Pack source batchId must be 2026-06-04-batch59.',
)
const fileBoxStoryTurningPointProduct = products.products.find(
  (product) => product.slug === 'file-box-story-turning-point-card-pack',
)
expect(
  fileBoxStoryTurningPointProduct,
  'Missing File Box Story Turning Point Card Pack product record for Batch 59 artifact validation.',
)
const fileBoxStoryTurningPointSourceErrors = validateFileBoxStoryTurningPointCardPackSource(
  fileBoxStoryTurningPointSource,
  fileBoxStoryTurningPointProduct,
  worldAgeBands,
)
expect(
  fileBoxStoryTurningPointSourceErrors.length === 0,
  `File Box Story Turning Point Card Pack source failed validation:\n${fileBoxStoryTurningPointSourceErrors.join('\n')}`,
)
const fileBoxStoryTurningPointSourceFileErrors = validateFileBoxStoryTurningPointCardPackSourceFiles(
  fileBoxStoryTurningPointSource,
  root,
)
expect(
  fileBoxStoryTurningPointSourceFileErrors.length === 0,
  `File Box Story Turning Point Card Pack sourceFiles failed validation:\n${fileBoxStoryTurningPointSourceFileErrors.join('\n')}`,
)
const fileBoxStoryTurningPointSummaryErrors = validateProductWorldSummaries(
  fileBoxStoryTurningPointProduct,
  'File Box Story Turning Point Card Pack',
)
expect(
  fileBoxStoryTurningPointSummaryErrors.length === 0,
  `File Box Story Turning Point Card Pack world summaries failed validation:\n${fileBoxStoryTurningPointSummaryErrors.join('\n')}`,
)
const fileBoxStoryTurningPointArtifactPaths = Object.values(fileBoxStoryTurningPointSource.artifact).map((relativePath) =>
  resolve(root, relativePath),
)
const fileBoxStoryTurningPointAnyArtifactFilesExist = anyPathExists(fileBoxStoryTurningPointArtifactPaths)
if (fileBoxStoryTurningPointAnyArtifactFilesExist) {
  for (const artifactPath of fileBoxStoryTurningPointArtifactPaths) {
    expect(
      existsSync(artifactPath),
      `File Box Story Turning Point Card Pack artifact set is incomplete after artifact generation started: ${artifactPath}`,
    )
  }
  const fileBoxStoryTurningPointExpectedPdfPages = fileBoxStoryTurningPointSource.cards.length + 5
  const fileBoxStoryTurningPointArtifactStatus = inspectArtifactFiles(root, fileBoxStoryTurningPointSource.artifact, {
    expectedPdfPages: fileBoxStoryTurningPointExpectedPdfPages,
    expectedZipEntries: [
      'File-Box-Story-Turning-Point-Card-Pack.pdf',
      'README.txt',
      'source/file-box-story-turning-point-card-pack.html',
      ...fileBoxStoryTurningPointSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
    ],
  })
  expect(
    fileBoxStoryTurningPointArtifactStatus.valid,
    `File Box Story Turning Point Card Pack artifacts failed validation:\n${fileBoxStoryTurningPointArtifactStatus.errors.join('\n')}`,
  )
  expect(
    fileBoxStoryTurningPointArtifactStatus.files.pdf.size > 100_000,
    `File Box Story Turning Point Card Pack PDF artifact is unexpectedly small: ${fileBoxStoryTurningPointArtifactStatus.files.pdf.size} bytes.`,
  )
  expect(
    fileBoxStoryTurningPointArtifactStatus.files.pdf.pageCount === fileBoxStoryTurningPointExpectedPdfPages,
    `File Box Story Turning Point Card Pack PDF artifact must have ${fileBoxStoryTurningPointExpectedPdfPages} pages.`,
  )
  expect(
    fileBoxStoryTurningPointArtifactStatus.files.zip.size > fileBoxStoryTurningPointArtifactStatus.files.pdf.size,
    'File Box Story Turning Point Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
  )
  const fileBoxStoryTurningPointCheckoutErrors = validateCheckoutReadiness(
    fileBoxStoryTurningPointProduct,
    fileBoxStoryTurningPointArtifactStatus,
  )
  expect(
    fileBoxStoryTurningPointCheckoutErrors.length === 0,
    `File Box Story Turning Point Card Pack checkout readiness failed validation:\n${fileBoxStoryTurningPointCheckoutErrors.join('\n')}`,
  )
  const fileBoxStoryTurningPointArtifactManifest = readJson(
    resolve(root, fileBoxStoryTurningPointSource.artifact.manifestPath),
  )
  expect(
    fileBoxStoryTurningPointArtifactManifest.sourcePageCount === fileBoxStoryTurningPointSource.cards.length,
    'File Box Story Turning Point Card Pack artifact manifest sourcePageCount must match source cards.',
  )
  expect(
    Array.isArray(fileBoxStoryTurningPointArtifactManifest.files?.assets),
    'File Box Story Turning Point Card Pack artifact manifest files.assets must be an array.',
  )
  expect(
    fileBoxStoryTurningPointArtifactManifest.files.assets.length === fileBoxStoryTurningPointSource.worldSlugs.length,
    'File Box Story Turning Point Card Pack artifact manifest must include one copied local image per source world.',
  )
  const fileBoxStoryTurningPointManifestAssetErrors = validateManifestWorldAssets(
    fileBoxStoryTurningPointSource,
    fileBoxStoryTurningPointArtifactManifest,
  )
  expect(
    fileBoxStoryTurningPointManifestAssetErrors.length === 0,
    `File Box Story Turning Point Card Pack artifact manifest image coverage failed validation:\n${fileBoxStoryTurningPointManifestAssetErrors.join('\n')}`,
  )
  for (const asset of fileBoxStoryTurningPointArtifactManifest.files.assets) {
    validateImageFile(
      resolve(root, asset.path),
      `File Box Story Turning Point Card Pack copied artifact image ${asset.path}`,
      'jpeg',
    )
  }
}

expect(
  existsSync(archiveDrawerStoryResolutionSourceFile),
  `Missing Batch 60 Archive Drawer Story Resolution Card Pack source file: ${archiveDrawerStoryResolutionSourceFile}`,
)
const archiveDrawerStoryResolutionSource = readJson(archiveDrawerStoryResolutionSourceFile)
expect(
  archiveDrawerStoryResolutionSource.batchId === '2026-06-04-batch60',
  'Archive Drawer Story Resolution Card Pack source batchId must be 2026-06-04-batch60.',
)
const archiveDrawerStoryResolutionProduct = products.products.find(
  (product) => product.slug === 'archive-drawer-story-resolution-card-pack',
)
expect(
  archiveDrawerStoryResolutionProduct,
  'Missing Archive Drawer Story Resolution Card Pack product record for Batch 60 artifact validation.',
)
const archiveDrawerStoryResolutionSourceErrors = validateArchiveDrawerStoryResolutionCardPackSource(
  archiveDrawerStoryResolutionSource,
  archiveDrawerStoryResolutionProduct,
  worldAgeBands,
)
expect(
  archiveDrawerStoryResolutionSourceErrors.length === 0,
  `Archive Drawer Story Resolution Card Pack source failed validation:\n${archiveDrawerStoryResolutionSourceErrors.join('\n')}`,
)
const archiveDrawerStoryResolutionSourceFileErrors = validateArchiveDrawerStoryResolutionCardPackSourceFiles(
  archiveDrawerStoryResolutionSource,
  root,
)
expect(
  archiveDrawerStoryResolutionSourceFileErrors.length === 0,
  `Archive Drawer Story Resolution Card Pack sourceFiles failed validation:\n${archiveDrawerStoryResolutionSourceFileErrors.join('\n')}`,
)
const archiveDrawerStoryResolutionSummaryErrors = validateProductWorldSummaries(
  archiveDrawerStoryResolutionProduct,
  'Archive Drawer Story Resolution Card Pack',
)
expect(
  archiveDrawerStoryResolutionSummaryErrors.length === 0,
  `Archive Drawer Story Resolution Card Pack world summaries failed validation:\n${archiveDrawerStoryResolutionSummaryErrors.join('\n')}`,
)
const archiveDrawerStoryResolutionArtifactPaths = Object.values(archiveDrawerStoryResolutionSource.artifact).map(
  (relativePath) => resolve(root, relativePath),
)
const archiveDrawerStoryResolutionAnyArtifactFilesExist = anyPathExists(archiveDrawerStoryResolutionArtifactPaths)
if (archiveDrawerStoryResolutionAnyArtifactFilesExist) {
  for (const artifactPath of archiveDrawerStoryResolutionArtifactPaths) {
    expect(
      existsSync(artifactPath),
      `Archive Drawer Story Resolution Card Pack artifact set is incomplete after artifact generation started: ${artifactPath}`,
    )
  }
  const archiveDrawerStoryResolutionExpectedPdfPages = archiveDrawerStoryResolutionSource.cards.length + 5
  const archiveDrawerStoryResolutionArtifactStatus = inspectArtifactFiles(root, archiveDrawerStoryResolutionSource.artifact, {
    expectedPdfPages: archiveDrawerStoryResolutionExpectedPdfPages,
    expectedZipEntries: [
      'Archive-Drawer-Story-Resolution-Card-Pack.pdf',
      'README.txt',
      'source/archive-drawer-story-resolution-card-pack.html',
      ...archiveDrawerStoryResolutionSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
    ],
  })
  expect(
    archiveDrawerStoryResolutionArtifactStatus.valid,
    `Archive Drawer Story Resolution Card Pack artifacts failed validation:\n${archiveDrawerStoryResolutionArtifactStatus.errors.join('\n')}`,
  )
  expect(
    archiveDrawerStoryResolutionArtifactStatus.files.pdf.size > 100_000,
    `Archive Drawer Story Resolution Card Pack PDF artifact is unexpectedly small: ${archiveDrawerStoryResolutionArtifactStatus.files.pdf.size} bytes.`,
  )
  expect(
    archiveDrawerStoryResolutionArtifactStatus.files.pdf.pageCount === archiveDrawerStoryResolutionExpectedPdfPages,
    `Archive Drawer Story Resolution Card Pack PDF artifact must have ${archiveDrawerStoryResolutionExpectedPdfPages} pages.`,
  )
  expect(
    archiveDrawerStoryResolutionArtifactStatus.files.zip.size > archiveDrawerStoryResolutionArtifactStatus.files.pdf.size,
    'Archive Drawer Story Resolution Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
  )
  const archiveDrawerStoryResolutionCheckoutErrors = validateCheckoutReadiness(
    archiveDrawerStoryResolutionProduct,
    archiveDrawerStoryResolutionArtifactStatus,
  )
  expect(
    archiveDrawerStoryResolutionCheckoutErrors.length === 0,
    `Archive Drawer Story Resolution Card Pack checkout readiness failed validation:\n${archiveDrawerStoryResolutionCheckoutErrors.join('\n')}`,
  )
  const archiveDrawerStoryResolutionArtifactManifest = readJson(
    resolve(root, archiveDrawerStoryResolutionSource.artifact.manifestPath),
  )
  expect(
    archiveDrawerStoryResolutionArtifactManifest.sourcePageCount === archiveDrawerStoryResolutionSource.cards.length,
    'Archive Drawer Story Resolution Card Pack artifact manifest sourcePageCount must match source cards.',
  )
  expect(
    Array.isArray(archiveDrawerStoryResolutionArtifactManifest.files?.assets),
    'Archive Drawer Story Resolution Card Pack artifact manifest files.assets must be an array.',
  )
  expect(
    archiveDrawerStoryResolutionArtifactManifest.files.assets.length ===
      archiveDrawerStoryResolutionSource.worldSlugs.length,
    'Archive Drawer Story Resolution Card Pack artifact manifest must include one copied local image per source world.',
  )
  const archiveDrawerStoryResolutionManifestAssetErrors = validateManifestWorldAssets(
    archiveDrawerStoryResolutionSource,
    archiveDrawerStoryResolutionArtifactManifest,
  )
  expect(
    archiveDrawerStoryResolutionManifestAssetErrors.length === 0,
    `Archive Drawer Story Resolution Card Pack artifact manifest image coverage failed validation:\n${archiveDrawerStoryResolutionManifestAssetErrors.join('\n')}`,
  )
  for (const asset of archiveDrawerStoryResolutionArtifactManifest.files.assets) {
    validateImageFile(
      resolve(root, asset.path),
      `Archive Drawer Story Resolution Card Pack copied artifact image ${asset.path}`,
      'jpeg',
    )
  }
}

expect(
  existsSync(cardCatalogStoryRetellSourceFile),
  `Missing Batch 61 Card Catalog Story Retell Card Pack source file: ${cardCatalogStoryRetellSourceFile}`,
)
const cardCatalogStoryRetellSource = readJson(cardCatalogStoryRetellSourceFile)
expect(
  cardCatalogStoryRetellSource.batchId === '2026-06-04-batch61',
  'Card Catalog Story Retell Card Pack source batchId must be 2026-06-04-batch61.',
)
const cardCatalogStoryRetellProduct = products.products.find(
  (product) => product.slug === 'card-catalog-story-retell-card-pack',
)
expect(
  cardCatalogStoryRetellProduct,
  'Missing Card Catalog Story Retell Card Pack product record for Batch 61 artifact validation.',
)
const cardCatalogStoryRetellSourceErrors = validateCardCatalogStoryRetellCardPackSource(
  cardCatalogStoryRetellSource,
  cardCatalogStoryRetellProduct,
  worldAgeBands,
)
expect(
  cardCatalogStoryRetellSourceErrors.length === 0,
  `Card Catalog Story Retell Card Pack source failed validation:\n${cardCatalogStoryRetellSourceErrors.join('\n')}`,
)
const cardCatalogStoryRetellSourceFileErrors = validateCardCatalogStoryRetellCardPackSourceFiles(
  cardCatalogStoryRetellSource,
  root,
)
expect(
  cardCatalogStoryRetellSourceFileErrors.length === 0,
  `Card Catalog Story Retell Card Pack sourceFiles failed validation:\n${cardCatalogStoryRetellSourceFileErrors.join('\n')}`,
)
const cardCatalogStoryRetellSummaryErrors = validateProductWorldSummaries(
  cardCatalogStoryRetellProduct,
  'Card Catalog Story Retell Card Pack',
)
expect(
  cardCatalogStoryRetellSummaryErrors.length === 0,
  `Card Catalog Story Retell Card Pack world summaries failed validation:\n${cardCatalogStoryRetellSummaryErrors.join('\n')}`,
)
const cardCatalogStoryRetellArtifactPaths = Object.values(cardCatalogStoryRetellSource.artifact).map((relativePath) =>
  resolve(root, relativePath),
)
const cardCatalogStoryRetellAnyArtifactFilesExist = anyPathExists(cardCatalogStoryRetellArtifactPaths)
if (cardCatalogStoryRetellAnyArtifactFilesExist) {
  for (const artifactPath of cardCatalogStoryRetellArtifactPaths) {
    expect(
      existsSync(artifactPath),
      `Card Catalog Story Retell Card Pack artifact set is incomplete after artifact generation started: ${artifactPath}`,
    )
  }
  const cardCatalogStoryRetellExpectedPdfPages = cardCatalogStoryRetellSource.cards.length + 5
  const cardCatalogStoryRetellArtifactStatus = inspectArtifactFiles(root, cardCatalogStoryRetellSource.artifact, {
    expectedPdfPages: cardCatalogStoryRetellExpectedPdfPages,
    expectedZipEntries: [
      'Card-Catalog-Story-Retell-Card-Pack.pdf',
      'README.txt',
      'source/card-catalog-story-retell-card-pack.html',
      ...cardCatalogStoryRetellSource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
    ],
  })
  expect(
    cardCatalogStoryRetellArtifactStatus.valid,
    `Card Catalog Story Retell Card Pack artifacts failed validation:\n${cardCatalogStoryRetellArtifactStatus.errors.join('\n')}`,
  )
  expect(
    cardCatalogStoryRetellArtifactStatus.files.pdf.size > 100_000,
    `Card Catalog Story Retell Card Pack PDF artifact is unexpectedly small: ${cardCatalogStoryRetellArtifactStatus.files.pdf.size} bytes.`,
  )
  expect(
    cardCatalogStoryRetellArtifactStatus.files.pdf.pageCount === cardCatalogStoryRetellExpectedPdfPages,
    `Card Catalog Story Retell Card Pack PDF artifact must have ${cardCatalogStoryRetellExpectedPdfPages} pages.`,
  )
  expect(
    cardCatalogStoryRetellArtifactStatus.files.zip.size > cardCatalogStoryRetellArtifactStatus.files.pdf.size,
    'Card Catalog Story Retell Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
  )
  const cardCatalogStoryRetellCheckoutErrors = validateCheckoutReadiness(
    cardCatalogStoryRetellProduct,
    cardCatalogStoryRetellArtifactStatus,
  )
  expect(
    cardCatalogStoryRetellCheckoutErrors.length === 0,
    `Card Catalog Story Retell Card Pack checkout readiness failed validation:\n${cardCatalogStoryRetellCheckoutErrors.join('\n')}`,
  )
  const cardCatalogStoryRetellArtifactManifest = readJson(
    resolve(root, cardCatalogStoryRetellSource.artifact.manifestPath),
  )
  expect(
    cardCatalogStoryRetellArtifactManifest.sourcePageCount === cardCatalogStoryRetellSource.cards.length,
    'Card Catalog Story Retell Card Pack artifact manifest sourcePageCount must match source cards.',
  )
  expect(
    Array.isArray(cardCatalogStoryRetellArtifactManifest.files?.assets),
    'Card Catalog Story Retell Card Pack artifact manifest files.assets must be an array.',
  )
  expect(
    cardCatalogStoryRetellArtifactManifest.files.assets.length === cardCatalogStoryRetellSource.worldSlugs.length,
    'Card Catalog Story Retell Card Pack artifact manifest must include one copied local image per source world.',
  )
  const cardCatalogStoryRetellManifestAssetErrors = validateManifestWorldAssets(
    cardCatalogStoryRetellSource,
    cardCatalogStoryRetellArtifactManifest,
  )
  expect(
    cardCatalogStoryRetellManifestAssetErrors.length === 0,
    `Card Catalog Story Retell Card Pack artifact manifest image coverage failed validation:\n${cardCatalogStoryRetellManifestAssetErrors.join('\n')}`,
  )
  for (const asset of cardCatalogStoryRetellArtifactManifest.files.assets) {
    validateImageFile(
      resolve(root, asset.path),
      `Card Catalog Story Retell Card Pack copied artifact image ${asset.path}`,
      'jpeg',
    )
  }
}

expect(
  existsSync(libraryPocketStorySummarySourceFile),
  `Missing Batch 62 Library Pocket Story Summary Card Pack source file: ${libraryPocketStorySummarySourceFile}`,
)
const libraryPocketStorySummarySource = readJson(libraryPocketStorySummarySourceFile)
expect(
  libraryPocketStorySummarySource.batchId === '2026-06-04-batch62',
  'Library Pocket Story Summary Card Pack source batchId must be 2026-06-04-batch62.',
)
const libraryPocketStorySummaryProduct = products.products.find(
  (product) => product.slug === 'library-pocket-story-summary-card-pack',
)
expect(
  libraryPocketStorySummaryProduct,
  'Missing Library Pocket Story Summary Card Pack product record for Batch 62 artifact validation.',
)
const libraryPocketStorySummarySourceErrors = validateLibraryPocketStorySummaryCardPackSource(
  libraryPocketStorySummarySource,
  libraryPocketStorySummaryProduct,
  worldAgeBands,
)
expect(
  libraryPocketStorySummarySourceErrors.length === 0,
  `Library Pocket Story Summary Card Pack source failed validation:\n${libraryPocketStorySummarySourceErrors.join('\n')}`,
)
const libraryPocketStorySummarySourceFileErrors = validateLibraryPocketStorySummaryCardPackSourceFiles(
  libraryPocketStorySummarySource,
  root,
)
expect(
  libraryPocketStorySummarySourceFileErrors.length === 0,
  `Library Pocket Story Summary Card Pack sourceFiles failed validation:\n${libraryPocketStorySummarySourceFileErrors.join('\n')}`,
)
const libraryPocketStorySummarySummaryErrors = validateProductWorldSummaries(
  libraryPocketStorySummaryProduct,
  'Library Pocket Story Summary Card Pack',
)
expect(
  libraryPocketStorySummarySummaryErrors.length === 0,
  `Library Pocket Story Summary Card Pack world summaries failed validation:\n${libraryPocketStorySummarySummaryErrors.join('\n')}`,
)
const libraryPocketStorySummaryArtifactPaths = Object.values(libraryPocketStorySummarySource.artifact).map((relativePath) =>
  resolve(root, relativePath),
)
const libraryPocketStorySummaryAnyArtifactFilesExist = anyPathExists(libraryPocketStorySummaryArtifactPaths)
if (libraryPocketStorySummaryAnyArtifactFilesExist) {
  for (const artifactPath of libraryPocketStorySummaryArtifactPaths) {
    expect(
      existsSync(artifactPath),
      `Library Pocket Story Summary Card Pack artifact set is incomplete after artifact generation started: ${artifactPath}`,
    )
  }
  const libraryPocketStorySummaryExpectedPdfPages = libraryPocketStorySummarySource.cards.length + 5
  const libraryPocketStorySummaryArtifactStatus = inspectArtifactFiles(root, libraryPocketStorySummarySource.artifact, {
    expectedPdfPages: libraryPocketStorySummaryExpectedPdfPages,
    expectedZipEntries: [
      'Library-Pocket-Story-Summary-Card-Pack.pdf',
      'README.txt',
      'source/library-pocket-story-summary-card-pack.html',
      ...libraryPocketStorySummarySource.worldSlugs.map((slug) => `source/assets/${slug}.jpg`),
    ],
  })
  expect(
    libraryPocketStorySummaryArtifactStatus.valid,
    `Library Pocket Story Summary Card Pack artifacts failed validation:\n${libraryPocketStorySummaryArtifactStatus.errors.join('\n')}`,
  )
  expect(
    libraryPocketStorySummaryArtifactStatus.files.pdf.size > 100_000,
    `Library Pocket Story Summary Card Pack PDF artifact is unexpectedly small: ${libraryPocketStorySummaryArtifactStatus.files.pdf.size} bytes.`,
  )
  expect(
    libraryPocketStorySummaryArtifactStatus.files.pdf.pageCount === libraryPocketStorySummaryExpectedPdfPages,
    `Library Pocket Story Summary Card Pack PDF artifact must have ${libraryPocketStorySummaryExpectedPdfPages} pages.`,
  )
  expect(
    libraryPocketStorySummaryArtifactStatus.files.zip.size > libraryPocketStorySummaryArtifactStatus.files.pdf.size,
    'Library Pocket Story Summary Card Pack ZIP artifact should include the PDF plus source HTML and image assets.',
  )
  const libraryPocketStorySummaryCheckoutErrors = validateCheckoutReadiness(
    libraryPocketStorySummaryProduct,
    libraryPocketStorySummaryArtifactStatus,
  )
  expect(
    libraryPocketStorySummaryCheckoutErrors.length === 0,
    `Library Pocket Story Summary Card Pack checkout readiness failed validation:\n${libraryPocketStorySummaryCheckoutErrors.join('\n')}`,
  )
  const libraryPocketStorySummaryArtifactManifest = readJson(
    resolve(root, libraryPocketStorySummarySource.artifact.manifestPath),
  )
  expect(
    libraryPocketStorySummaryArtifactManifest.sourcePageCount === libraryPocketStorySummarySource.cards.length,
    'Library Pocket Story Summary Card Pack artifact manifest sourcePageCount must match source cards.',
  )
  expect(
    Array.isArray(libraryPocketStorySummaryArtifactManifest.files?.assets),
    'Library Pocket Story Summary Card Pack artifact manifest files.assets must be an array.',
  )
  expect(
    libraryPocketStorySummaryArtifactManifest.files.assets.length === libraryPocketStorySummarySource.worldSlugs.length,
    'Library Pocket Story Summary Card Pack artifact manifest must include one copied local image per source world.',
  )
  const libraryPocketStorySummaryManifestAssetErrors = validateManifestWorldAssets(
    libraryPocketStorySummarySource,
    libraryPocketStorySummaryArtifactManifest,
  )
  expect(
    libraryPocketStorySummaryManifestAssetErrors.length === 0,
    `Library Pocket Story Summary Card Pack artifact manifest image coverage failed validation:\n${libraryPocketStorySummaryManifestAssetErrors.join('\n')}`,
  )
  for (const asset of libraryPocketStorySummaryArtifactManifest.files.assets) {
    validateImageFile(
      resolve(root, asset.path),
      `Library Pocket Story Summary Card Pack copied artifact image ${asset.path}`,
      'jpeg',
    )
  }
}

const productImageManifests = [
  batch7ProductImages,
  batch10ProductImages,
  batch11ProductImages,
  batch13ProductImages,
  batch14ProductImages,
  batch15ProductImages,
  batch16ProductImages,
  batch17ProductImages,
  batch18ProductImages,
  batch19ProductImages,
  batch20ProductImages,
  batch21ProductImages,
  batch22ProductImages,
  batch23ProductImages,
  batch24ProductImages,
  batch25ProductImages,
  batch26ProductImages,
  batch27ProductImages,
  batch28ProductImages,
  batch29ProductImages,
  batch30ProductImages,
  batch31ProductImages,
  batch32ProductImages,
  batch33ProductImages,
  batch34ProductImages,
  batch35ProductImages,
  batch36ProductImages,
  batch37ProductImages,
  batch38ProductImages,
  batch39ProductImages,
  batch40ProductImages,
  batch41ProductImages,
  batch42ProductImages,
  batch43ProductImages,
  batch44ProductImages,
  batch45ProductImages,
  batch46ProductImages,
  batch47ProductImages,
  batch48ProductImages,
  batch49ProductImages,
  batch50ProductImages,
  batch51ProductImages,
  batch52Images,
  batch53Images,
  batch54Images,
  batch55Images,
  batch56Images,
  batch57Images,
  batch58Images,
  batch59Images,
  batch60Images,
  batch61Images,
  batch62Images,
]
const localWorldProductImageCount =
  batch4ImageSlugs.size +
  batch50WorldImageSlugs.size +
  productImageManifests.reduce((count, imageManifest) => count + imageManifest.images.length, 0)
const productArtifactCount = readdirSync(resolve(root, 'content', 'product-artifacts')).filter((entry) =>
  entry.endsWith('.json'),
).length

console.log(
  `Content batch verified: ${worldCount} worlds, ${worldCount * 3} prompts, ${worldCount} image prompts, ${kitCount} kit outlines, ${collectionSlugs.size} SEO collections, ${miniUnitSlugs.size} mini-units, ${localWorldProductImageCount} local world/product images, ${productSlugs.size} static product pages, ${productArtifactCount} product artifacts.`,
)
