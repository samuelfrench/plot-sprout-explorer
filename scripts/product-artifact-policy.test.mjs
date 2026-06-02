import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  countPdfPages,
  inspectConfiguredArtifactFiles,
  inspectArtifactFiles,
  validateBirthdayPartyKitSource,
  validateCheckoutReadiness,
  validateClassroomLicenseSource,
  validateManifestWorldAssets,
  validatePackSource,
  validateLibraryStoryClubKitSource,
  validateRoadTripPackSource,
  validateSeasonBundleSource,
  validateSubstituteTeacherStationPackSource,
  validateTutoringCenterSprintPackSource,
  validateWaitingRoomPackSource,
  writeStoredZip,
} from './product-artifact-policy.mjs'

const safety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

function validSource() {
  return {
    batchId: '2026-06-02-batch7',
    generatedAt: '2026-06-02',
    productSlug: 'rainy-day-story-quest-pack',
    title: 'Rainy Day Story Quest Pack',
    pricePoint: '$9',
    audience: 'Parents, homeschool families, tutors, and elementary teachers working with reluctant writers ages 7-11.',
    sessionLength: '35-45 minutes',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf',
      zipPath: 'product-build/rainy-day-story-quest-pack/rainy-day-story-quest-pack.zip',
      sourceHtmlPath: 'product-build/rainy-day-story-quest-pack/source/rainy-day-story-quest-pack.html',
      manifestPath: 'product-build/rainy-day-story-quest-pack/manifest.json',
    },
    worldSlugs: [
      'teacup-town-weather-window',
      'rain-gauge-railway',
      'spoon-ferry-lunchbox-harbor',
      'rain-boot-route-rangers',
    ],
    cover: {
      kicker: 'Rainy day writing kit',
      headline: 'Four tiny weather errands for one finished story',
      subhead: 'A printable pack for short, parent-guided story writing.',
      included: [
        'Route map',
        'Forecast cards',
        'Reflection sheet',
        'Dialogue page',
        'Sentence builder',
        'Ending cards',
        'Parent guide',
      ],
    },
    adultGuide: {
      setup: ['Print the pack.', 'Pick one world.', 'Set out a pencil.', 'Read the first page aloud.'],
      sessionFlow: [
        { minutes: '5', title: 'Choose', instruction: 'Choose one world and circle a path.' },
        { minutes: '8', title: 'Collect', instruction: 'Collect three details before writing.' },
        { minutes: '10', title: 'Build', instruction: 'Build three useful sentences.' },
        { minutes: '12', title: 'Draft', instruction: 'Write the short story.' },
        { minutes: '5', title: 'Finish', instruction: 'Choose a kind ending.' },
      ],
      supportMoves: ['Point before writing.', 'Offer two choices.', 'Read back one sentence.', 'Pause after each page.', 'Stop while it is still easy.'],
      extensionIdeas: ['Make a cover.', 'Read it aloud.', 'Add a weather log.', 'Write a new errand.'],
    },
    pages: [
      page('cover-overview', 'overview', 'adult-guide'),
      page('adult-session-plan', 'overview', 'adult-guide'),
      page('teacup-route-map', 'teacup-town-weather-window', 'map'),
      page('forecast-card-sort', 'teacup-town-weather-window', 'cards'),
      page('rain-gauge-railway-log', 'rain-gauge-railway', 'worksheet'),
      page('railway-weather-report', 'rain-gauge-railway', 'prompt'),
      page('lunchbox-dialogue-sheet', 'spoon-ferry-lunchbox-harbor', 'worksheet'),
      page('snack-order-revision', 'spoon-ferry-lunchbox-harbor', 'prompt'),
      page('rain-boot-route-map', 'rain-boot-route-rangers', 'map'),
      page('puddle-reflection-ending', 'rain-boot-route-rangers', 'reflection'),
      page('final-story-page', 'overview', 'worksheet'),
    ],
  }
}

function page(id, worldSlug, type) {
  return {
    id,
    title: id.split('-').join(' '),
    worldSlug,
    type,
    kidDirection: 'Circle one detail and write one short sentence.',
    adultNote: 'Keep this page light and let pointing count as planning.',
    sections: [
      {
        heading: 'Write',
        lines: ['First detail: ____________________________', 'Useful sentence: ____________________________'],
      },
    ],
  }
}

function validSeasonBundleSource() {
  const worldSlugs = [
    'moon-muffin-market',
    'puddle-planet-post-office',
    'buttonwood-library-train',
    'cloudberry-clocktower',
    'tiny-lantern-reef',
    'pencil-dragon-academy',
    'teacup-town-weather-window',
    'rain-gauge-railway',
    'spoon-ferry-lunchbox-harbor',
    'rain-boot-route-rangers',
    'seed-library-map-room',
    'greenhouse-gear-garden',
  ]

  return {
    batchId: '2026-06-02-batch8',
    generatedAt: '2026-06-02',
    productSlug: 'homeschool-season-story-bundle',
    title: 'Homeschool Season Story Bundle',
    pricePoint: '$29',
    audience: 'Homeschool families, tutors, and elementary co-ops planning a year of short writing sessions.',
    sessionLength: '12 printable quests across four seasons',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf',
      zipPath: 'product-build/homeschool-season-story-bundle/homeschool-season-story-bundle.zip',
      sourceHtmlPath: 'product-build/homeschool-season-story-bundle/source/homeschool-season-story-bundle.html',
      manifestPath: 'product-build/homeschool-season-story-bundle/manifest.json',
    },
    worldSlugs,
    cover: {
      kicker: 'Printable homeschool writing bundle',
      headline: 'A year of small story quests',
      subhead: 'Twelve seasonal writing sessions for short narrative practice.',
      included: [
        'Twelve quest pages',
        'Four seasonal planning pages',
        'Parent guide',
        'Revision checklist',
        'Story bank tracker',
        'Read-aloud reflection',
        'Portfolio cover',
        'Extension menu',
        'Co-op use notes',
        'Materials checklist',
      ],
    },
    adultGuide: {
      setup: ['Print one season at a time.', 'Pick a weekly rhythm.', 'Keep sessions offline.', 'Save finished pages in a folder.'],
      seasonPlan: [
        { season: 'fall', focus: 'setting and useful details' },
        { season: 'winter', focus: 'sequence and dialogue' },
        { season: 'spring', focus: 'revision and clearer verbs' },
        { season: 'summer', focus: 'finished stories and read-aloud sharing' },
      ],
      supportMoves: ['Point before writing.', 'Offer two choices.', 'Read a strong sentence aloud.', 'Circle one detail.', 'Stop with one clear ending.'],
      extensionIdeas: ['Make a cover.', 'Pair two quests.', 'Read one page aloud.', 'Build a portfolio.', 'Turn one quest into a co-op station.'],
    },
    pages: worldSlugs.map((worldSlug, index) => ({
      id: `season-quest-${index + 1}`,
      title: `Season Quest ${index + 1}`,
      worldSlug,
      season: ['fall', 'winter', 'spring', 'summer'][index % 4],
      type: 'worksheet',
      kidDirection: 'Choose one detail, one helper, and one kind ending before writing.',
      adultNote: 'Keep the page short and let pointing count as planning.',
      sections: [
        {
          heading: 'Plan',
          lines: ['Detail I choose: ____________________________', 'Helper I choose: ____________________________'],
        },
        {
          heading: 'Write',
          lines: ['Beginning: ____________________________', 'Ending choice: ____________________________'],
        },
      ],
    })),
  }
}

function classroomPromptCard(id, worldSlug, skillFocus = 'setting detail') {
  return {
    id,
    worldSlug,
    title: id.split('-').join(' '),
    skillFocus,
    teacherSetup: 'Place the prompt card beside a partner talk mat and read the first choice aloud.',
    studentPrompt: 'Choose one tiny place detail, one helpful character choice, and one clear ending before you draft.',
    choiceSet: ['quiet clue', 'helpful map', 'surprise note'],
    writingLines: [
      'Setting detail: ____________________________',
      'Character choice: ____________________________',
      'Problem step: ____________________________',
      'Ending sentence: ____________________________',
    ],
    shareMove: 'Ask partners to read only the sentence with the clearest detail.',
    extension: 'Turn the card into a two-scene comic plan before drafting again.',
    rubricLookFor: 'Student includes one concrete setting detail and one clear character choice.',
  }
}

function validClassroomLicenseSource() {
  const worldSlugs = [
    'acorn-avenue-errand-office',
    'button-bakery-map-mixup',
    'teacup-town-weather-window',
    'pocket-park-notice-board',
    'penny-path-compass-shop',
    'rain-boot-route-rangers',
    'seed-library-map-room',
    'solar-oven-picnic-station',
    'moss-message-observatory',
    'spoon-ferry-lunchbox-harbor',
    'clue-label-tower-museum',
    'compass-craft-academy',
  ]
  const skillFocuses = [
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
  ]

  return {
    batchId: '2026-06-02-batch9',
    generatedAt: '2026-06-02',
    productSlug: 'classroom-story-license-pack',
    title: 'Classroom Story License Pack',
    pricePoint: '$79',
    audience: 'Elementary teachers, homeschool co-ops, and tutors running repeatable writing stations for ages 7-11.',
    sessionLength: '30 prompt cards, teacher routines, extension activities, and a four-criterion rubric',
    safetyNote: safety,
    artifact: {
      pdfPath: 'product-build/classroom-story-license-pack/Classroom-Story-License-Pack.pdf',
      zipPath: 'product-build/classroom-story-license-pack/classroom-story-license-pack.zip',
      sourceHtmlPath: 'product-build/classroom-story-license-pack/source/classroom-story-license-pack.html',
      manifestPath: 'product-build/classroom-story-license-pack/manifest.json',
    },
    worldSlugs,
    cover: {
      kicker: 'Printable classroom writing license',
      headline: 'Thirty story stations for one busy classroom',
      subhead: 'Prompt cards, teacher routines, extension activities, and a practical rubric.',
      included: [
        '30 prompt cards',
        'Teacher setup guide',
        'Station rotation routine',
        'Four-criterion rubric',
        'Extension activity menu',
        'Partner share moves',
        'Printable source pages',
        'Local image-backed world menu',
        'Substitute folder directions',
        'Co-op license note',
        'Portfolio tracker',
        'Revision mini-lessons',
      ],
    },
    classroomRoutines: ['Station rotation', 'Partner talk', 'Quiet draft', 'Teacher conference', 'Share circle'],
    teacherSetup: ['Print cards.', 'Cut card sheets.', 'Set station bins.', 'Pick four focus cards.', 'Save samples.'],
    extensionActivities: Array.from({ length: 10 }, (_, index) => ({
      id: `extension-${index + 1}`,
      title: `Extension ${index + 1}`,
      minutes: 20,
      teacherMove: 'Model one concrete detail before students try the extension.',
      studentOutput: 'One revised paragraph with a clearer setting detail.',
      usesPromptCards: index % 2 === 0,
    })),
    rubric: {
      levels: ['Beginning', 'Developing', 'Secure', 'Extending'],
      criteria: ['Concrete details', 'Clear sequence', 'Character choice', 'Revision move'].map((name) => ({
        id: name.toLowerCase().replaceAll(' ', '-'),
        name,
        lookFor: `Teacher can point to the student's ${name.toLowerCase()} on the draft.`,
        levels: {
          Beginning: 'The draft names the skill but needs a teacher prompt to show it clearly.',
          Developing: 'The draft shows the skill once with partial clarity.',
          Secure: 'The draft shows the skill clearly in the story.',
          Extending: 'The draft uses the skill clearly and improves one connected sentence.',
        },
      })),
    },
    promptCards: Array.from({ length: 30 }, (_, index) =>
      classroomPromptCard(`card-${String(index + 1).padStart(2, '0')}`, worldSlugs[index % worldSlugs.length], skillFocuses[index % skillFocuses.length]),
    ),
  }
}

function birthdayQuest(id, worldSlug, ageBand) {
  return {
    id,
    title: id.split('-').join(' '),
    worldSlug,
    ageBand,
    partyUse: 'Birthday party writing table with a short take-home page.',
    setupMinutes: '5 minutes',
    groupMode: 'small table',
    kidDirection: 'Choose one place detail and write one sentence for the folder.',
    adultNote: 'Read choices aloud and let children point before writing.',
    materials: ['printed quest page', 'pencils', 'crayons', 'timer'],
    pageSections: ['Place', 'Helper', 'Ending'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    takeHomeLine: 'Take this page home as a finished party quest start.',
  }
}

function validBirthdayPartySource() {
  const worldSlugs = [
    'teacup-town-weather-window',
    'button-bakery-map-mixup',
    'rain-gauge-railway',
    'compass-craft-academy',
    'seed-library-map-room',
    'binding-day-boardwalk',
  ]
  const worldAges = new Map([
    ['teacup-town-weather-window', '7-8'],
    ['button-bakery-map-mixup', '7-9'],
    ['rain-gauge-railway', '8-10'],
    ['compass-craft-academy', '10-11'],
    ['seed-library-map-room', '8-10'],
    ['binding-day-boardwalk', '10-11'],
  ])
  const quests = [
    birthdayQuest('teacup-party-forecast', 'teacup-town-weather-window', '7-8'),
    birthdayQuest('button-bakery-map', 'button-bakery-map-mixup', '7-9'),
    birthdayQuest('railway-gift-route', 'rain-gauge-railway', '8-10'),
    birthdayQuest('compass-map-relay', 'compass-craft-academy', '10-11'),
    birthdayQuest('seed-wish-catalog', 'seed-library-map-room', '8-10'),
    birthdayQuest('binding-day-booklet', 'binding-day-boardwalk', '10-11'),
    birthdayQuest('button-bakery-parade', 'button-bakery-map-mixup', '7-9'),
    birthdayQuest('rain-gauge-relay', 'rain-gauge-railway', '8-10'),
  ]

  return {
    source: {
      batchId: '2026-06-02-batch10',
      generatedAt: '2026-06-02',
      productSlug: 'birthday-party-story-quest-kit',
      title: 'Birthday Party Story Quest Kit',
      pricePoint: '$19',
      audience: 'Parents and teachers hosting adult-led writing celebrations for ages 7-11.',
      sessionLength: '8 printable party quests plus adult setup tools',
      safetyNote: safety,
      artifact: {
        pdfPath: 'product-build/birthday-party-story-quest-kit/Birthday-Party-Story-Quest-Kit.pdf',
        zipPath: 'product-build/birthday-party-story-quest-kit/birthday-party-story-quest-kit.zip',
        sourceHtmlPath: 'product-build/birthday-party-story-quest-kit/source/birthday-party-story-quest-kit.html',
        manifestPath: 'product-build/birthday-party-story-quest-kit/manifest.json',
      },
      worldSlugs,
      cover: {
        kicker: 'Printable party writing kit',
        headline: 'Birthday Party Story Quest Kit',
        subhead: 'Eight low-pressure writing quests for party tables.',
        included: [
          '8 party quests',
          'Adult setup guide',
          'Timing menu',
          'Table setup list',
          'Five party routines',
          'Eight extension activities',
          'Six share cards',
          'World menu',
          'Source HTML',
          'ZIP artifact',
        ],
      },
      setupGuide: {
        timing: ['Arrival.', 'Launch.', 'Draft.', 'Decorate.', 'Share.'],
        tableSetup: ['Folders.', 'Pencils.', 'Cards.', 'Timer.', 'Snack surface.'],
        adultScript: ['Safety.', 'Point first.', 'One place.', 'Two choices.', 'Optional share.'],
        takeHomePrep: ['Print packets.', 'Fold covers.', 'Add note.', 'Pack cards.'],
      },
      partyRoutines: Array.from({ length: 5 }, (_, index) => ({
        name: `Routine ${index + 1}`,
        bestFor: 'Birthday writing table.',
        steps: ['Set page.', 'Pick card.', 'Write line.', 'Folder page.'],
      })),
      extensionActivities: Array.from({ length: 8 }, (_, index) => ({
        title: `Extension ${index + 1}`,
        time: '10 minutes',
        direction: 'Add one concrete detail to the quest page.',
        writingSkill: 'setting detail',
      })),
      groupShareCards: ['Read one line.', 'Show a map.', 'Ask an adult.', 'Name a card.', 'Pick a detail.', 'Pass and listen.'],
      quests,
    },
    worldAges,
  }
}

function roadTripQuest(id, worldSlug, ageBand) {
  return {
    id,
    title: id.split('-').join(' '),
    worldSlug,
    ageBand,
    travelUse: 'Rest stop table writing station with a short folder page.',
    setupMinutes: '5 minutes',
    travelMode: 'Rest stop table',
    kidDirection: 'Choose one travel detail and write one sentence for the folder.',
    adultNote: 'Read choices aloud after stopping and let children point before writing.',
    materials: ['printed quest page', 'pencils', 'folder', 'route card'],
    pageSections: ['Place', 'Route', 'Ending'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    takeHomeLine: 'Save this page in the travel folder as a finished quest start.',
  }
}

function validRoadTripSource() {
  const worldSlugs = [
    'acorn-avenue-errand-office',
    'button-bakery-map-mixup',
    'spoon-ferry-lunchbox-harbor',
    'rain-boot-route-rangers',
    'rain-gauge-railway',
    'tidepool-timekeepers-lab',
    'seed-library-map-room',
    'compass-craft-academy',
  ]
  const worldAges = new Map([
    ['acorn-avenue-errand-office', '7-9'],
    ['button-bakery-map-mixup', '7-9'],
    ['spoon-ferry-lunchbox-harbor', '7-9'],
    ['rain-boot-route-rangers', '7-9'],
    ['rain-gauge-railway', '8-10'],
    ['tidepool-timekeepers-lab', '8-10'],
    ['seed-library-map-room', '8-10'],
    ['compass-craft-academy', '10-11'],
  ])

  return {
    source: {
      batchId: '2026-06-02-batch11',
      generatedAt: '2026-06-02',
      productSlug: 'road-trip-story-quest-pack',
      title: 'Road Trip Story Quest Pack',
      pricePoint: '$17',
      audience: 'Parents and homeschool families planning adult-guided travel writing for ages 7-11.',
      sessionLength: '8 printable travel quests plus adult setup tools',
      safetyNote: safety,
      artifact: {
        pdfPath: 'product-build/road-trip-story-quest-pack/Road-Trip-Story-Quest-Pack.pdf',
        zipPath: 'product-build/road-trip-story-quest-pack/road-trip-story-quest-pack.zip',
        sourceHtmlPath: 'product-build/road-trip-story-quest-pack/source/road-trip-story-quest-pack.html',
        manifestPath: 'product-build/road-trip-story-quest-pack/manifest.json',
      },
      worldSlugs,
      cover: {
        kicker: 'Printable road trip writing kit',
        headline: 'Road Trip Story Quest Pack',
        subhead: 'Eight short quests for travel stops, hotel desks, and visit days.',
        included: [
          '8 travel quests',
          'Adult setup guide',
          'Before-you-go checklist',
          'Passenger prompt routine',
          'Rest stop routine',
          'Hotel desk routine',
          'Visit-day routine',
          'Share cards',
          'Source HTML',
          'ZIP artifact',
        ],
      },
      setupGuide: {
        beforeYouGo: ['Print packets.', 'Clip pages.', 'Pack pencils.', 'Choose first quest.', 'Store finished pages.'],
        inTheCar: ['Use passenger prompts.', 'Circle before writing.', 'Pause for turns.', 'Save loose pages.', 'Finish at a stop.'],
        restStopHotel: ['Pick a table.', 'Read choices aloud.', 'Write three lines.', 'Add one color.', 'Pack the folder.'],
        visitDay: ['Choose one card.', 'Read one line.', 'Invite a listener.', 'Save the page.'],
      },
      travelRoutines: Array.from({ length: 5 }, (_, index) => ({
        name: `Routine ${index + 1}`,
        bestFor: 'Rest stop or hotel table.',
        steps: ['Set page.', 'Pick card.', 'Write line.', 'Folder page.'],
      })),
      extensionActivities: Array.from({ length: 8 }, (_, index) => ({
        title: `Extension ${index + 1}`,
        time: '10 minutes',
        direction: 'Add one concrete detail to the travel quest page.',
        writingSkill: 'setting detail',
      })),
      groupShareCards: ['Read one line.', 'Show a map.', 'Ask an adult.', 'Name a card.', 'Pick a detail.', 'Pass and listen.'],
      quests: worldSlugs.map((worldSlug, index) => roadTripQuest(`travel-quest-${index + 1}`, worldSlug, worldAges.get(worldSlug))),
    },
    worldAges,
  }
}

function waitingRoomQuest(id, worldSlug, ageBand) {
  return {
    id,
    title: id.split('-').join(' '),
    worldSlug,
    ageBand,
    waitingUse: 'Quiet table or lobby writing station with one printed page.',
    setupMinutes: '4 minutes',
    waitingMode: 'Appointment lobby',
    kidDirection: 'Choose one quiet detail and write one sentence before the next page.',
    adultNote: 'Read choices softly and let pointing count as planning.',
    materials: ['printed quest page', 'pencil', 'folder', 'small clipboard'],
    pageSections: ['Notice', 'Choose', 'Finish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    takeHomeLine: 'Save this page in the waiting folder as one finished quiet quest.',
  }
}

function validWaitingRoomSource() {
  const worldSlugs = [
    'acorn-avenue-errand-office',
    'button-bakery-map-mixup',
    'spoon-ferry-lunchbox-harbor',
    'pocket-park-notice-board',
    'penny-path-compass-shop',
    'margin-note-market',
    'clue-label-tower-museum',
    'index-card-theater-club',
  ]
  const worldAges = new Map([
    ['acorn-avenue-errand-office', '7-9'],
    ['button-bakery-map-mixup', '7-9'],
    ['spoon-ferry-lunchbox-harbor', '7-9'],
    ['pocket-park-notice-board', '7-9'],
    ['penny-path-compass-shop', '7-9'],
    ['margin-note-market', '10-11'],
    ['clue-label-tower-museum', '10-11'],
    ['index-card-theater-club', '10-11'],
  ])

  return {
    source: {
      batchId: '2026-06-02-batch13',
      generatedAt: '2026-06-02',
      productSlug: 'waiting-room-story-quest-pack',
      title: 'Waiting Room Story Quest Pack',
      pricePoint: '$11',
      audience: 'Parents, grandparents, tutors, and homeschool families planning quiet adult-guided writing for ages 7-11.',
      sessionLength: '8 printable quiet waiting quests plus adult setup tools',
      safetyNote: safety,
      artifact: {
        pdfPath: 'product-build/waiting-room-story-quest-pack/Waiting-Room-Story-Quest-Pack.pdf',
        zipPath: 'product-build/waiting-room-story-quest-pack/waiting-room-story-quest-pack.zip',
        sourceHtmlPath: 'product-build/waiting-room-story-quest-pack/source/waiting-room-story-quest-pack.html',
        manifestPath: 'product-build/waiting-room-story-quest-pack/manifest.json',
      },
      worldSlugs,
      cover: {
        kicker: 'Printable waiting-room writing kit',
        headline: 'Waiting Room Story Quest Pack',
        subhead: 'Eight quiet quests for restaurant tables, lobbies, sibling activities, and pickup lines.',
        included: [
          '8 quiet waiting quests',
          'Adult setup guide',
          'Before-you-wait checklist',
          'Restaurant table routine',
          'Lobby routine',
          'Sibling activity routine',
          'Pickup-line routine',
          'Share cards',
          'Source HTML',
          'ZIP artifact',
        ],
      },
      setupGuide: {
        beforeYouWait: ['Print packets.', 'Clip pages.', 'Pack pencils.', 'Choose first page.', 'Store finished pages.'],
        restaurantTable: ['Pick one page.', 'Keep voices low.', 'Circle first.', 'Write one line.', 'Folder the page.'],
        appointmentLobby: ['Use a clipboard.', 'Read choices softly.', 'Skip hard lines.', 'Mark one detail.', 'Close the folder.'],
        siblingEvent: ['Choose a page.', 'Trade a pencil.', 'Set a timer.', 'Write quietly.', 'Share later.'],
        pickupLine: ['Keep page ready.', 'Circle a detail.', 'Write one line.', 'Save the page.'],
      },
      waitingRoutines: Array.from({ length: 5 }, (_, index) => ({
        name: `Routine ${index + 1}`,
        bestFor: 'Quiet table or lobby wait.',
        steps: ['Set page.', 'Pick card.', 'Write line.', 'Folder page.'],
      })),
      extensionActivities: Array.from({ length: 8 }, (_, index) => ({
        title: `Extension ${index + 1}`,
        time: '8 minutes',
        direction: 'Add one concrete detail to the quiet quest page.',
        writingSkill: 'setting detail',
      })),
      groupShareCards: ['Read one line.', 'Point to a detail.', 'Name a helper.', 'Pick a card.', 'Add one color.', 'Pass and listen.'],
      quests: worldSlugs.map((worldSlug, index) => waitingRoomQuest(`quiet-quest-${index + 1}`, worldSlug, worldAges.get(worldSlug))),
    },
    worldAges,
  }
}

function libraryClubSession(id, worldSlug, ageBand) {
  return {
    id,
    title: id.split('-').join(' '),
    worldSlug,
    ageBand,
    clubUse: 'Adult-led printable story club session for a library table, homeschool co-op, tutoring group, or classroom writing club.',
    setupMinutes: '6 minutes',
    groupMode: 'Small group table',
    kidDirection: 'Choose one setting detail, one helper choice, and one sentence to draft before optional sharing.',
    facilitatorNote: 'Keep the session offline, use first names only if spoken, and let pointing or drawing count as planning.',
    materials: ['printed club page', 'pencil', 'folder', 'small choice cards'],
    pageSections: ['Club Setup', 'Story Choice', 'Take-Home Line'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    takeHomeLine: 'Save this club page in the folder and finish one sentence at home.',
  }
}

function validLibraryStoryClubSource() {
  const worldSlugs = [
    'buttonwood-library-train',
    'pocket-park-notice-board',
    'penny-path-compass-shop',
    'acorn-avenue-errand-office',
    'seed-library-map-room',
    'index-card-theater-club',
    'margin-note-market',
    'clue-label-tower-museum',
    'revision-river-ferry',
    'compass-craft-academy',
  ]
  const worldAges = new Map([
    ['buttonwood-library-train', '7-9'],
    ['pocket-park-notice-board', '7-9'],
    ['penny-path-compass-shop', '7-9'],
    ['acorn-avenue-errand-office', '7-9'],
    ['seed-library-map-room', '8-10'],
    ['index-card-theater-club', '10-11'],
    ['margin-note-market', '10-11'],
    ['clue-label-tower-museum', '10-11'],
    ['revision-river-ferry', '10-11'],
    ['compass-craft-academy', '10-11'],
  ])

  return {
    source: {
      batchId: '2026-06-02-batch14',
      generatedAt: '2026-06-02',
      productSlug: 'library-story-club-kit',
      title: 'Library Story Club Kit',
      pricePoint: '$23',
      audience: "Children's librarians, homeschool co-op leaders, tutors, and elementary teachers running adult-led writing clubs for ages 7-11.",
      sessionLength: '10 printable club sessions plus adult facilitation tools',
      safetyNote: safety,
      artifact: {
        pdfPath: 'product-build/library-story-club-kit/Library-Story-Club-Kit.pdf',
        zipPath: 'product-build/library-story-club-kit/library-story-club-kit.zip',
        sourceHtmlPath: 'product-build/library-story-club-kit/source/library-story-club-kit.html',
        manifestPath: 'product-build/library-story-club-kit/manifest.json',
      },
      worldSlugs,
      cover: {
        kicker: 'Printable library writing club kit',
        headline: 'Library Story Club Kit',
        subhead: 'Ten adult-led story club sessions for library tables, homeschool co-ops, tutoring groups, and classroom writing clubs.',
        included: [
          '10 printable club sessions',
          'Facilitator setup guide',
          'Group norms',
          'Materials checklist',
          'Timing menu',
          'Take-home routine',
          'Five club routines',
          'Eight extension activities',
          'Six optional share prompts',
          'Provider-ready ZIP artifact',
        ],
      },
      facilitatorGuide: {
        setup: ['Print one packet per child.', 'Choose two session pages.', 'Set out pencils.', 'Keep folders private.', 'Explain optional sharing.'],
        groupNorms: ['Use quiet voices.', 'Share only made-up details.', 'Pass when needed.', 'Listen kindly.', 'Keep pages in folders.'],
        materials: ['Printed session pages.', 'Pencils.', 'Folders.', 'Choice cards.', 'Timer.'],
        timing: ['5 minutes to choose.', '8 minutes to plan.', '12 minutes to draft.', '5 minutes to revise.', '5 minutes for optional sharing.'],
        takeHome: ['Folder unfinished pages.', 'Mark one blank.', 'Send one finish prompt.', 'Skip online sharing.'],
      },
      clubRoutines: Array.from({ length: 5 }, (_, index) => ({
        name: `Club Routine ${index + 1}`,
        bestFor: 'Adult-led story club table.',
        steps: ['Set one page.', 'Pick one detail.', 'Write one line.', 'Save the folder.'],
      })),
      extensionActivities: Array.from({ length: 8 }, (_, index) => ({
        title: `Club Extension ${index + 1}`,
        time: '10 minutes',
        direction: 'Add one concrete detail to the club session draft.',
        writingSkill: 'setting detail',
      })),
      sharePrompts: ['Read one invented line.', 'Point to a setting detail.', 'Name a helper choice.', 'Share one revised word.', 'Pass and listen.', 'Choose one take-home blank.'],
      sessions: worldSlugs.map((worldSlug, index) => libraryClubSession(`library-session-${index + 1}`, worldSlug, worldAges.get(worldSlug))),
    },
    worldAges,
  }
}

function substituteStation(id, worldSlug, ageBand) {
  return {
    id,
    title: id.split('-').join(' '),
    worldSlug,
    ageBand,
    stationUse: 'Printable substitute-day story station for a calm desk, early finisher, tutoring, or co-op table.',
    setupMinutes: '5 minutes',
    stationMode: 'Independent desk',
    kidDirection: 'Choose one invented place detail, one helper choice, and one sentence to draft before the station closes.',
    subNote: 'Keep this station light, collect pages in the folder, and let pointing or drawing count as planning.',
    materials: ['printed station page', 'pencil', 'folder', 'small choice cards'],
    pageSections: ['Station Start', 'Story Choice', 'Quiet Finish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    exitTicketLine: 'One detail I can use tomorrow: ____________________________',
  }
}

function validSubstituteTeacherStationPackSource() {
  const worldSlugs = [
    'buttonwood-library-train',
    'pocket-park-notice-board',
    'penny-path-compass-shop',
    'acorn-avenue-errand-office',
    'rain-boot-route-rangers',
    'rain-gauge-railway',
    'seed-library-map-room',
    'index-card-theater-club',
    'margin-note-market',
    'clue-label-tower-museum',
    'revision-river-ferry',
    'compass-craft-academy',
  ]
  const worldAges = new Map([
    ['buttonwood-library-train', '7-9'],
    ['pocket-park-notice-board', '7-9'],
    ['penny-path-compass-shop', '7-9'],
    ['acorn-avenue-errand-office', '7-9'],
    ['rain-boot-route-rangers', '7-9'],
    ['rain-gauge-railway', '8-10'],
    ['seed-library-map-room', '8-10'],
    ['index-card-theater-club', '10-11'],
    ['margin-note-market', '10-11'],
    ['clue-label-tower-museum', '10-11'],
    ['revision-river-ferry', '10-11'],
    ['compass-craft-academy', '10-11'],
  ])

  return {
    source: {
      batchId: '2026-06-02-batch15',
      generatedAt: '2026-06-02',
      productSlug: 'substitute-teacher-story-station-pack',
      title: 'Substitute Teacher Story Station Pack',
      pricePoint: '$39',
      audience: 'Elementary teachers, homeschool co-op leaders, tutors, and substitute folders for ages 7-11.',
      sessionLength: '12 printable substitute stations plus adult setup tools',
      safetyNote: safety,
      artifact: {
        pdfPath: 'product-build/substitute-teacher-story-station-pack/Substitute-Teacher-Story-Station-Pack.pdf',
        zipPath: 'product-build/substitute-teacher-story-station-pack/substitute-teacher-story-station-pack.zip',
        sourceHtmlPath: 'product-build/substitute-teacher-story-station-pack/source/substitute-teacher-story-station-pack.html',
        manifestPath: 'product-build/substitute-teacher-story-station-pack/manifest.json',
      },
      worldSlugs,
      cover: {
        kicker: 'Printable substitute writing station pack',
        headline: 'Substitute Teacher Story Station Pack',
        subhead: 'Twelve calm writing stations for substitute folders, co-op tables, tutoring groups, and early finishers.',
        included: [
          '12 printable station pages',
          'Before-the-day prep guide',
          'Morning setup checklist',
          'During-stations notes',
          'End-of-day collection plan',
          'Handoff note routine',
          'Five station routines',
          'Eight early finisher cards',
          'Six optional share prompts',
          'Provider-ready ZIP artifact',
        ],
      },
      substituteGuide: {
        beforeTheDay: ['Print station pages.', 'Choose three starter stations.', 'Set folders aside.', 'Clip pencils together.', 'Leave one simple note.'],
        morningSetup: ['Place packets on desks.', 'Put pencils in the tray.', 'Pick the first station.', 'Read one direction aloud.', 'Keep pages in folders.'],
        duringStations: ['Use quiet voices.', 'Let pointing count.', 'Circle one useful detail.', 'Move finished pages to folders.', 'Offer the early finisher card.'],
        endOfDay: ['Stack finished pages.', 'Clip unfinished pages.', 'Return pencils.', 'Save unused stations.', 'Leave one short note.'],
        handoff: ['List stations used.', 'Mark pages collected.', 'Name the next easy station.', 'Leave folders on the desk.'],
      },
      stationRoutines: Array.from({ length: 5 }, (_, index) => ({
        name: `Station Routine ${index + 1}`,
        bestFor: 'Substitute-day story station.',
        steps: ['Set one page.', 'Read one direction.', 'Write one line.', 'Folder the page.'],
      })),
      earlyFinisherCards: Array.from({ length: 8 }, (_, index) => ({
        title: `Early Finisher ${index + 1}`,
        time: '8 minutes',
        direction: 'Add one concrete detail to the station draft.',
        writingSkill: 'setting detail',
      })),
      sharePrompts: ['Read one invented line.', 'Point to a setting detail.', 'Name a helper choice.', 'Share one revised word.', 'Pass and listen.', 'Choose one folder page.'],
      stations: worldSlugs.map((worldSlug, index) =>
        substituteStation(`substitute-station-${index + 1}`, worldSlug, worldAges.get(worldSlug)),
      ),
    },
    worldAges,
  }
}

function tutoringSprint(id, worldSlug, ageBand) {
  return {
    id,
    title: id
      .split('-')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' '),
    worldSlug,
    ageBand,
    sprintSkill: 'setting detail',
    sessionFit: '10-minute tutoring warmup for a reluctant writer or small table.',
    tutorSetup: 'Print one sprint page, set out pencils, and pick one world image.',
    kidDirection: 'Choose one tiny detail, write one short draft line, and circle one word to keep.',
    coachingPrompt: 'Ask for one concrete place detail before asking for a sentence.',
    pageSections: ['Plan', 'Draft', 'Polish'].map((heading) => ({
      heading,
      lines: [
        `${heading} detail: ____________________________`,
        `${heading} choice: ____________________________`,
        `${heading} sentence: ____________________________`,
      ],
    })),
    wrapUpLine: 'One line I can keep: ____________________________',
    extensionLine: 'At home I can add: ____________________________',
  }
}

function validTutoringCenterSprintPackSource() {
  const worldSlugs = [
    'moon-muffin-market',
    'puddle-planet-post-office',
    'buttonwood-library-train',
    'cloudberry-clocktower',
    'tiny-lantern-reef',
    'pencil-dragon-academy',
    'acorn-avenue-errand-office',
    'button-bakery-map-mixup',
    'rain-gauge-railway',
    'rain-boot-route-rangers',
    'pocket-park-notice-board',
    'penny-path-compass-shop',
      'seed-library-map-room',
      'greenhouse-gear-garden',
      'index-card-theater-club',
      'margin-note-market',
      'clue-label-tower-museum',
      'revision-river-ferry',
      'compass-craft-academy',
      'almost-invention-workshop',
  ]
  const worldAges = new Map([
    ['moon-muffin-market', '6-8'],
    ['puddle-planet-post-office', '6-8'],
    ['buttonwood-library-train', '7-9'],
    ['cloudberry-clocktower', '8-10'],
    ['tiny-lantern-reef', '8-10'],
    ['pencil-dragon-academy', '10-11'],
    ['acorn-avenue-errand-office', '7-9'],
    ['button-bakery-map-mixup', '7-9'],
    ['rain-gauge-railway', '8-10'],
    ['rain-boot-route-rangers', '7-9'],
    ['pocket-park-notice-board', '7-9'],
    ['penny-path-compass-shop', '7-9'],
    ['seed-library-map-room', '8-10'],
    ['greenhouse-gear-garden', '8-10'],
    ['index-card-theater-club', '10-11'],
    ['margin-note-market', '10-11'],
    ['clue-label-tower-museum', '10-11'],
    ['revision-river-ferry', '10-11'],
    ['compass-craft-academy', '10-11'],
    ['almost-invention-workshop', '10-11'],
  ])

  return {
    source: {
      batchId: '2026-06-02-batch16',
      generatedAt: '2026-06-02',
      productSlug: 'tutoring-center-story-sprint-pack',
      title: 'Tutoring Center Story Sprint Pack',
      pricePoint: '$49',
      audience: 'Literacy tutors, tutoring centers, after-school programs, and homeschool co-op tutors for ages 7-11.',
      sessionLength: '20 printable 10-minute story sprints plus tutor setup tools',
      safetyNote: safety,
      artifact: {
        pdfPath: 'product-build/tutoring-center-story-sprint-pack/Tutoring-Center-Story-Sprint-Pack.pdf',
        zipPath: 'product-build/tutoring-center-story-sprint-pack/tutoring-center-story-sprint-pack.zip',
        sourceHtmlPath: 'product-build/tutoring-center-story-sprint-pack/source/tutoring-center-story-sprint-pack.html',
        manifestPath: 'product-build/tutoring-center-story-sprint-pack/manifest.json',
      },
      worldSlugs,
      cover: {
        kicker: 'Printable tutoring writing sprint pack',
        headline: 'Tutoring Center Story Sprint Pack',
        subhead: 'Twenty 10-minute writing sprints for tutoring centers, small groups, and after-school tables.',
        included: [
          '20 printable sprint pages',
          'Before-session prep guide',
          'Tutor setup checklist',
          'During-sprint coaching notes',
          'Wrap-up routine',
          'No-data center use notes',
          'Five sprint routines',
          'Eight take-home slips',
          'Six optional share prompts',
          'Provider-ready ZIP artifact',
        ],
      },
      tutorGuide: {
        beforeSession: ['Choose two sprint pages.', 'Print one packet per table.', 'Clip pencils together.', 'Set a timer nearby.', 'Pick one finish slip.'],
        setup: ['Place one sprint page on the table.', 'Set out a pencil tray.', 'Choose one world image.', 'Read the tiny goal aloud.', 'Keep extra pages in a folder.'],
        duringSprint: ['Ask for one concrete detail.', 'Offer two choices.', 'Read back one useful line.', 'Circle one strong word.', 'Stop while the page still feels light.'],
        wrapUp: ['Choose one kept line.', 'Mark the next tiny choice.', 'Stack unused pages.', 'Send one slip home.', 'Reset the table for the next writer.'],
        noDataUse: ['Use color folders for packets.', 'Avoid personal labels on pages.', 'Keep pages offline.', 'Share only invented story choices.'],
      },
      sprintRoutines: Array.from({ length: 5 }, (_, index) => ({
        name: `Sprint Routine ${index + 1}`,
        bestFor: 'Short tutoring writing block.',
        steps: ['Pick one page.', 'Name one goal.', 'Write one line.', 'Choose one next step.'],
      })),
      takeHomeSlips: Array.from({ length: 8 }, (_, index) => ({
        title: `Take-Home Slip ${index + 1}`,
        time: '5 minutes',
        skill: 'small detail',
        direction: 'Add one detail to the story line: ____________________________',
        familyLine: 'A grown-up can ask about: ____________________________',
      })),
      sharePrompts: ['Point to one invented place.', 'Read one kept line.', 'Name one detail.', 'Share one revised word.', 'Pass and listen.', 'Choose one page to save.'],
      sprints: Array.from({ length: 20 }, (_, index) => {
        const worldSlug = worldSlugs[index % worldSlugs.length]
        return tutoringSprint(`tutoring-sprint-${index + 1}`, worldSlug, worldAges.get(worldSlug))
      }),
    },
    worldAges,
  }
}

describe('product artifact policy', () => {
  it('validates the Rainy Day pack source against the product record and required world coverage', () => {
    const product = {
      slug: 'rainy-day-story-quest-pack',
      title: 'Rainy Day Story Quest Pack',
      pricePoint: '$9',
      status: 'checkout_pending',
      worldSlugs: [
        'teacup-town-weather-window',
        'rain-gauge-railway',
        'spoon-ferry-lunchbox-harbor',
        'rain-boot-route-rangers',
      ],
    }

    expect(validatePackSource(validSource(), product, new Set(product.worldSlugs))).toEqual([])
  })

  it('rejects checkout-ready products when the PDF, ZIP, source HTML, or manifest is missing', () => {
    const artifactStatus = {
      valid: false,
      errors: ['missing PDF artifact'],
    }

    expect(validateCheckoutReadiness({ status: 'checkout_ready' }, artifactStatus)).toContain(
      'checkout_ready cannot be used until the product artifact validates.',
    )
    expect(validateCheckoutReadiness({ status: 'checkout_pending' }, artifactStatus)).toEqual([])
  })

  it('inspects required artifact files and checks PDF and ZIP signatures', () => {
    const root = mkdtempSync(join(tmpdir(), 'plot-sprout-artifact-'))
    try {
      mkdirSync(join(root, 'product-build/rainy-day-story-quest-pack/source'), { recursive: true })
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf'), '%PDF-1.7\n')
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/source/rainy-day-story-quest-pack.html'), '<!doctype html><h1>Rainy Day Story Quest Pack</h1>')
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/manifest.json'), '{"productSlug":"rainy-day-story-quest-pack"}\n')
      writeStoredZip(join(root, 'product-build/rainy-day-story-quest-pack/rainy-day-story-quest-pack.zip'), [
        {
          name: 'README.txt',
          data: 'Rainy Day Story Quest Pack',
        },
      ])

      const status = inspectArtifactFiles(root, validSource().artifact)

      expect(status.errors).toEqual([])
      expect(status.valid).toBe(true)
      expect(status.files.zip.size).toBeGreaterThan(40)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('counts PDF page objects and rejects unexpected artifact page counts', () => {
    const fakePdf = Buffer.from(
      '%PDF-1.7\n1 0 obj << /Type /Pages /Count 2 >> endobj\n2 0 obj << /Type /Page >> endobj\n3 0 obj << /Type /Page >> endobj\n%%EOF\n',
    )

    expect(countPdfPages(fakePdf)).toBe(2)

    const root = mkdtempSync(join(tmpdir(), 'plot-sprout-artifact-pages-'))
    try {
      mkdirSync(join(root, 'product-build/rainy-day-story-quest-pack/source'), { recursive: true })
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf'), fakePdf)
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/source/rainy-day-story-quest-pack.html'), '<!doctype html><h1>Rainy Day Story Quest Pack</h1>')
      writeFileSync(join(root, 'product-build/rainy-day-story-quest-pack/manifest.json'), '{"productSlug":"rainy-day-story-quest-pack"}\n')
      writeStoredZip(join(root, 'product-build/rainy-day-story-quest-pack/rainy-day-story-quest-pack.zip'), [
        {
          name: 'README.txt',
          data: 'Rainy Day Story Quest Pack',
        },
      ])

      const status = inspectArtifactFiles(root, validSource().artifact, { expectedPdfPages: 15 })

      expect(status.valid).toBe(false)
      expect(status.errors).toContain(
        'product-build/rainy-day-story-quest-pack/Rainy-Day-Story-Quest-Pack.pdf must have exactly 15 pages; found 2.',
      )
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('validates the Homeschool Season bundle source with 12 seasonal quests and checkout-pending artifact paths', () => {
    const source = validSeasonBundleSource()
    const product = {
      slug: 'homeschool-season-story-bundle',
      title: 'Homeschool Season Story Bundle',
      pricePoint: '$29',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateSeasonBundleSource(source, product, new Set(source.worldSlugs))).toEqual([])
  })

  it('rejects Homeschool Season adult guide plans that duplicate a season and omit another', () => {
    const source = validSeasonBundleSource()
    source.adultGuide.seasonPlan = [
      { season: 'fall', focus: 'details' },
      { season: 'fall', focus: 'maps' },
      { season: 'winter', focus: 'sequence' },
      { season: 'spring', focus: 'revision' },
    ]
    const product = {
      slug: 'homeschool-season-story-bundle',
      title: 'Homeschool Season Story Bundle',
      pricePoint: '$29',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateSeasonBundleSource(source, product, new Set(source.worldSlugs))).toContain(
      'adultGuide.seasonPlan must cover fall, winter, spring, and summer.',
    )
  })

  it('inspects configured artifact files for product-specific paths', () => {
    const root = mkdtempSync(join(tmpdir(), 'plot-sprout-season-artifact-'))
    const expectedPaths = {
      pdfPath: 'product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf',
      zipPath: 'product-build/homeschool-season-story-bundle/homeschool-season-story-bundle.zip',
      sourceHtmlPath: 'product-build/homeschool-season-story-bundle/source/homeschool-season-story-bundle.html',
      manifestPath: 'product-build/homeschool-season-story-bundle/manifest.json',
    }
    try {
      mkdirSync(join(root, 'product-build/homeschool-season-story-bundle/source'), { recursive: true })
      writeFileSync(join(root, expectedPaths.pdfPath), '%PDF-1.7\n1 0 obj << /Type /Page >> endobj\n')
      writeFileSync(join(root, expectedPaths.sourceHtmlPath), '<!doctype html><h1>Homeschool Season Story Bundle</h1>')
      writeFileSync(join(root, expectedPaths.manifestPath), '{"productSlug":"homeschool-season-story-bundle"}\n')
      writeStoredZip(join(root, expectedPaths.zipPath), [
        {
          name: 'README.txt',
          data: 'Homeschool Season Story Bundle',
        },
      ])

      const status = inspectConfiguredArtifactFiles(root, expectedPaths, expectedPaths, { expectedPdfPages: 1 })

      expect(status.errors).toEqual([])
      expect(status.valid).toBe(true)
      expect(status.files.pdf.pageCount).toBe(1)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('rejects stale manifest file hashes and sizes when artifact files changed', () => {
    const root = mkdtempSync(join(tmpdir(), 'plot-sprout-season-manifest-'))
    const expectedPaths = {
      pdfPath: 'product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf',
      zipPath: 'product-build/homeschool-season-story-bundle/homeschool-season-story-bundle.zip',
      sourceHtmlPath: 'product-build/homeschool-season-story-bundle/source/homeschool-season-story-bundle.html',
      manifestPath: 'product-build/homeschool-season-story-bundle/manifest.json',
    }
    try {
      mkdirSync(join(root, 'product-build/homeschool-season-story-bundle/source'), { recursive: true })
      writeFileSync(join(root, expectedPaths.pdfPath), '%PDF-1.7\n1 0 obj << /Type /Page >> endobj\n')
      writeFileSync(join(root, expectedPaths.sourceHtmlPath), '<!doctype html><h1>Homeschool Season Story Bundle</h1>')
      writeStoredZip(join(root, expectedPaths.zipPath), [
        {
          name: 'README.txt',
          data: 'Homeschool Season Story Bundle',
        },
      ])
      writeFileSync(
        join(root, expectedPaths.manifestPath),
        `${JSON.stringify({
          productSlug: 'homeschool-season-story-bundle',
          files: {
            pdf: {
              path: expectedPaths.pdfPath,
              sha256: '0'.repeat(64),
              size: 1,
            },
          },
        })}\n`,
      )

      const status = inspectConfiguredArtifactFiles(root, expectedPaths, expectedPaths, { expectedPdfPages: 1 })

      expect(status.valid).toBe(false)
      expect(status.errors).toContain(
        'manifest files.pdf sha256 does not match product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf.',
      )
      expect(status.errors).toContain(
        'manifest files.pdf size does not match product-build/homeschool-season-story-bundle/Homeschool-Season-Story-Bundle.pdf.',
      )
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('requires one copied manifest image asset for every product world slug', () => {
    const errors = validateManifestWorldAssets(
      {
        title: 'Homeschool Season Story Bundle',
        worldSlugs: ['seed-library-map-room', 'greenhouse-gear-garden'],
      },
      {
        files: {
          assets: [
            {
              path: 'product-build/homeschool-season-story-bundle/source/assets/seed-library-map-room.jpg',
            },
          ],
        },
      },
    )

    expect(errors).toContain('Homeschool Season Story Bundle artifact manifest missing copied image for greenhouse-gear-garden.')
  })

  it('validates the Classroom Story License Pack source with 30 prompt cards, rubric, extensions, and checkout-pending artifact paths', () => {
    const source = validClassroomLicenseSource()
    const product = {
      slug: 'classroom-story-license-pack',
      title: 'Classroom Story License Pack',
      pricePoint: '$79',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateClassroomLicenseSource(source, product, new Set(source.worldSlugs))).toEqual([])
  })

  it('rejects Classroom Story License prompt-card duplicates and incomplete teacher tools', () => {
    const source = validClassroomLicenseSource()
    source.promptCards[1].id = source.promptCards[0].id
    source.extensionActivities = source.extensionActivities.slice(0, 9)
    source.rubric.criteria = source.rubric.criteria.slice(0, 3)
    const product = {
      slug: 'classroom-story-license-pack',
      title: 'Classroom Story License Pack',
      pricePoint: '$79',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateClassroomLicenseSource(source, product, new Set(source.worldSlugs))).toEqual(
      expect.arrayContaining([
        'promptCards[1].id is duplicated.',
        'extensionActivities must have exactly 10 entries.',
        'rubric.criteria must have exactly 4 entries.',
      ]),
    )
  })

  it('validates the Birthday Party Story Quest Kit source with matching world age bands and writable quest blanks', () => {
    const { source, worldAges } = validBirthdayPartySource()
    const product = {
      slug: 'birthday-party-story-quest-kit',
      title: 'Birthday Party Story Quest Kit',
      pricePoint: '$19',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateBirthdayPartyKitSource(source, product, worldAges)).toEqual([])
  })

  it('rejects Birthday Party quests whose age band does not match the referenced world', () => {
    const { source, worldAges } = validBirthdayPartySource()
    source.quests[3].ageBand = '9-11'
    const product = {
      slug: 'birthday-party-story-quest-kit',
      title: 'Birthday Party Story Quest Kit',
      pricePoint: '$19',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateBirthdayPartyKitSource(source, product, worldAges)).toContain(
      'quests[3].ageBand must match compass-craft-academy ageBand 10-11.',
    )
  })

  it('rejects Birthday Party quest lines that do not provide writable blanks', () => {
    const { source, worldAges } = validBirthdayPartySource()
    source.quests[0].pageSections[0].lines[0] = 'The party table has a map.'
    const product = {
      slug: 'birthday-party-story-quest-kit',
      title: 'Birthday Party Story Quest Kit',
      pricePoint: '$19',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateBirthdayPartyKitSource(source, product, worldAges)).toContain(
      'quests[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('validates the Road Trip Story Quest Pack source with matching world age bands and writable quest blanks', () => {
    const { source, worldAges } = validRoadTripSource()
    const product = {
      slug: 'road-trip-story-quest-pack',
      title: 'Road Trip Story Quest Pack',
      pricePoint: '$17',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateRoadTripPackSource(source, product, worldAges)).toEqual([])
  })

  it('returns Road Trip validation errors instead of throwing when worldSlugs is not an array', () => {
    const { source, worldAges } = validRoadTripSource()
    source.worldSlugs = { bad: 'shape' }
    const product = {
      slug: 'road-trip-story-quest-pack',
      title: 'Road Trip Story Quest Pack',
      pricePoint: '$17',
      status: 'checkout_pending',
      worldSlugs: [],
    }

    expect(() => validateRoadTripPackSource(source, product, worldAges)).not.toThrow()
    expect(validateRoadTripPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining(['worldSlugs must be an array.']),
    )
  })

  it('rejects Road Trip quests whose age band does not match the referenced world', () => {
    const { source, worldAges } = validRoadTripSource()
    source.quests[7].ageBand = '9-11'
    const product = {
      slug: 'road-trip-story-quest-pack',
      title: 'Road Trip Story Quest Pack',
      pricePoint: '$17',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateRoadTripPackSource(source, product, worldAges)).toContain(
      'quests[7].ageBand must match compass-craft-academy ageBand 10-11.',
    )
  })

  it('rejects Road Trip quest lines that do not provide writable blanks', () => {
    const { source, worldAges } = validRoadTripSource()
    source.quests[0].pageSections[0].lines[0] = 'The route card starts at the window.'
    const product = {
      slug: 'road-trip-story-quest-pack',
      title: 'Road Trip Story Quest Pack',
      pricePoint: '$17',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateRoadTripPackSource(source, product, worldAges)).toContain(
      'quests[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('rejects Road Trip adult tools that ask a driver to facilitate', () => {
    const { source, worldAges } = validRoadTripSource()
    source.setupGuide.inTheCar[0] = 'Ask the driver to read the first prompt while driving.'
    const product = {
      slug: 'road-trip-story-quest-pack',
      title: 'Road Trip Story Quest Pack',
      pricePoint: '$17',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateRoadTripPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'setupGuide includes driver-facing facilitation language.',
        'Road Trip Story Quest Pack source includes driver-facing facilitation language.',
      ]),
    )
  })

  it('validates the Waiting Room Story Quest Pack source with matching world age bands and writable quest blanks', () => {
    const { source, worldAges } = validWaitingRoomSource()
    const product = {
      slug: 'waiting-room-story-quest-pack',
      title: 'Waiting Room Story Quest Pack',
      pricePoint: '$11',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateWaitingRoomPackSource(source, product, worldAges)).toEqual([])
  })

  it('rejects Waiting Room quest lines that do not provide writable blanks', () => {
    const { source, worldAges } = validWaitingRoomSource()
    source.quests[0].pageSections[0].lines[0] = 'The waiting page starts with a quiet detail.'
    const product = {
      slug: 'waiting-room-story-quest-pack',
      title: 'Waiting Room Story Quest Pack',
      pricePoint: '$11',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateWaitingRoomPackSource(source, product, worldAges)).toContain(
      'quests[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('rejects Waiting Room source that drifts into medical, emergency, or treatment advice', () => {
    const { source, worldAges } = validWaitingRoomSource()
    source.setupGuide.appointmentLobby[0] = 'Write down symptoms and ask for treatment advice.'
    const product = {
      slug: 'waiting-room-story-quest-pack',
      title: 'Waiting Room Story Quest Pack',
      pricePoint: '$11',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateWaitingRoomPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'setupGuide includes medical, emergency, legal, diagnosis, therapy, or treatment language.',
        'Waiting Room Story Quest Pack source includes medical, emergency, legal, diagnosis, therapy, or treatment language.',
      ]),
    )
  })

  it('validates the Library Story Club Kit source with matching world age bands and writable session blanks', () => {
    const { source, worldAges } = validLibraryStoryClubSource()
    const product = {
      slug: 'library-story-club-kit',
      title: 'Library Story Club Kit',
      pricePoint: '$23',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateLibraryStoryClubKitSource(source, product, worldAges)).toEqual([])
  })

  it('rejects Library Story Club session lines that do not provide writable blanks', () => {
    const { source, worldAges } = validLibraryStoryClubSource()
    source.sessions[0].pageSections[0].lines[0] = 'The club table starts with one quiet detail.'
    const product = {
      slug: 'library-story-club-kit',
      title: 'Library Story Club Kit',
      pricePoint: '$23',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateLibraryStoryClubKitSource(source, product, worldAges)).toContain(
      'sessions[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('rejects Library Story Club source that drifts into patron records, uploads, or public publishing', () => {
    const { source, worldAges } = validLibraryStoryClubSource()
    source.facilitatorGuide.setup[0] = 'Collect library-card numbers on a sign-in sheet and upload story photos for public publishing.'
    const product = {
      slug: 'library-story-club-kit',
      title: 'Library Story Club Kit',
      pricePoint: '$23',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateLibraryStoryClubKitSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'facilitatorGuide includes patron records, library-card data, sign-in sheet, photo, upload, account, or public publishing language.',
        'Library Story Club Kit source includes account, login, upload, or public publishing language.',
        'Library Story Club Kit source includes patron records, library-card data, sign-in sheet, photo, upload, account, or public publishing language.',
      ]),
    )
  })

  it('validates the Substitute Teacher Story Station Pack source with matching world age bands and writable station blanks', () => {
    const { source, worldAges } = validSubstituteTeacherStationPackSource()
    const product = {
      slug: 'substitute-teacher-story-station-pack',
      title: 'Substitute Teacher Story Station Pack',
      pricePoint: '$39',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateSubstituteTeacherStationPackSource(source, product, worldAges)).toEqual([])
  })

  it('rejects Substitute Teacher station lines that do not provide writable blanks', () => {
    const { source, worldAges } = validSubstituteTeacherStationPackSource()
    source.stations[0].pageSections[0].lines[0] = 'The station starts with one quiet detail.'
    const product = {
      slug: 'substitute-teacher-story-station-pack',
      title: 'Substitute Teacher Story Station Pack',
      pricePoint: '$39',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateSubstituteTeacherStationPackSource(source, product, worldAges)).toContain(
      'stations[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('rejects Substitute Teacher source that drifts into roster, attendance, student-name, upload, or public publishing language', () => {
    const { source, worldAges } = validSubstituteTeacherStationPackSource()
    source.substituteGuide.morningSetup[0] =
      'Collect the class roster, attendance sheet, student names, and story photos, then upload them for public publishing.'
    const product = {
      slug: 'substitute-teacher-story-station-pack',
      title: 'Substitute Teacher Story Station Pack',
      pricePoint: '$39',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateSubstituteTeacherStationPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'substituteGuide includes roster, attendance, sign-in, student-name, school-data, photo, behavior-report, upload, account, or public publishing language.',
        'Substitute Teacher Story Station Pack source includes account, login, upload, or public publishing language.',
        'Substitute Teacher Story Station Pack source includes roster, attendance, sign-in, student-name, school-data, photo, behavior-report, upload, account, or public publishing language.',
      ]),
    )
  })

  it('validates the Tutoring Center Story Sprint Pack source with matching world age bands and writable sprint blanks', () => {
    const { source, worldAges } = validTutoringCenterSprintPackSource()
    const product = {
      slug: 'tutoring-center-story-sprint-pack',
      title: 'Tutoring Center Story Sprint Pack',
      pricePoint: '$49',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateTutoringCenterSprintPackSource(source, product, worldAges)).toEqual([])
  })

  it('rejects Tutoring Center sprint lines that do not provide writable blanks', () => {
    const { source, worldAges } = validTutoringCenterSprintPackSource()
    source.sprints[0].pageSections[0].lines[0] = 'The sprint starts with one quiet detail.'
    const product = {
      slug: 'tutoring-center-story-sprint-pack',
      title: 'Tutoring Center Story Sprint Pack',
      pricePoint: '$49',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateTutoringCenterSprintPackSource(source, product, worldAges)).toContain(
      'sprints[0].pageSections[0].lines[0] must include a writable blank.',
    )
  })

  it('rejects Tutoring Center sprints that are not included in the source and product world list', () => {
    const { source, worldAges } = validTutoringCenterSprintPackSource()
    source.worldSlugs = source.worldSlugs.filter((slug) => slug !== 'clue-label-tower-museum')
    const product = {
      slug: 'tutoring-center-story-sprint-pack',
      title: 'Tutoring Center Story Sprint Pack',
      pricePoint: '$49',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateTutoringCenterSprintPackSource(source, product, worldAges)).toContain(
      'sprints[16].worldSlug must be listed in worldSlugs.',
    )
  })

  it('rejects Tutoring Center take-home slips that use snake_case instead of printable blanks', () => {
    const { source, worldAges } = validTutoringCenterSprintPackSource()
    source.takeHomeSlips[0].direction = 'add_one_setting_detail_to_the_place_from_today'
    const product = {
      slug: 'tutoring-center-story-sprint-pack',
      title: 'Tutoring Center Story Sprint Pack',
      pricePoint: '$49',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateTutoringCenterSprintPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'takeHomeSlips[0].direction must include a writable blank.',
        'takeHomeSlips[0].direction must use human-readable text, not snake_case placeholders.',
      ]),
    )
  })

  it('rejects Tutoring Center no-data guidance that uses initials as a page marker', () => {
    const { source, worldAges } = validTutoringCenterSprintPackSource()
    source.tutorGuide.noDataUse[0] = 'Use initials on each page if pages need a simple mark.'
    const product = {
      slug: 'tutoring-center-story-sprint-pack',
      title: 'Tutoring Center Story Sprint Pack',
      pricePoint: '$49',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateTutoringCenterSprintPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'tutorGuide includes roster, attendance, sign-in, student-name, school-data, photo, behavior-report, upload, account, or public publishing language.',
        'Tutoring Center Story Sprint Pack source includes roster, attendance, sign-in, student-name, school-data, photo, behavior-report, upload, account, or public publishing language.',
      ]),
    )
  })

  it('rejects Tutoring Center source that drifts into records, uploads, diagnosis, or guaranteed-outcome language', () => {
    const { source, worldAges } = validTutoringCenterSprintPackSource()
    source.tutorGuide.setup[0] =
      'Collect attendance, student names, diagnostic notes, and photos, then upload them for public publishing with a guaranteed result.'
    const product = {
      slug: 'tutoring-center-story-sprint-pack',
      title: 'Tutoring Center Story Sprint Pack',
      pricePoint: '$49',
      status: 'checkout_pending',
      worldSlugs: source.worldSlugs,
    }

    expect(validateTutoringCenterSprintPackSource(source, product, worldAges)).toEqual(
      expect.arrayContaining([
        'tutorGuide includes roster, attendance, sign-in, student-name, school-data, photo, behavior-report, upload, account, or public publishing language.',
        'tutorGuide includes diagnosis, medical, legal, formal scoring, or guaranteed-outcome language.',
        'Tutoring Center Story Sprint Pack source includes account, login, upload, or public publishing language.',
        'Tutoring Center Story Sprint Pack source includes roster, attendance, sign-in, student-name, school-data, photo, behavior-report, upload, account, or public publishing language.',
        'Tutoring Center Story Sprint Pack source includes diagnosis, medical, legal, formal scoring, or guaranteed-outcome language.',
      ]),
    )
  })
})
