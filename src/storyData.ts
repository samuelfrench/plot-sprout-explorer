export type QuestWorld = {
  slug: string
  title: string
  ageBand: string
  premise: string
  prompts: string[]
  heroChoices: string[]
  settingDetails: string[]
  conflict: string
  safety: string
  productAngle: string
  image: string
  accent: string
}

export type QuestStep = {
  label: string
  text: string
}

export type QuestPack = {
  world: QuestWorld
  printableTitle: string
  steps: QuestStep[]
  paidUpsell: string
  imagePrompt: string
}

export type SeoCollectionLink = {
  slug: string
  title: string
  description: string
  lane: string
}

export type MiniUnitHubLink = {
  slug: string
  title: string
  description: string
  note: string
}

export type WorldGalleryLink = {
  slug: string
  title: string
  description: string
  note: string
}

export type FeaturedProductLink = {
  slug: string
  title: string
  pricePoint: string
  description: string
  note: string
}

const defaultSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

export const questWorlds: QuestWorld[] = [
  {
    slug: 'moon-muffin-market',
    title: 'Moon Muffin Market',
    ageBand: '6-8',
    premise:
      'A tiny night market opens whenever the moon smells cinnamon, and every stall sells a pastry with a secret job.',
    prompts: [
      'Write three smells your hero notices before the market appears.',
      'Invent a muffin that solves one small problem but creates a sillier one.',
      'Describe the market bell without using the word loud.',
    ],
    heroChoices: ['Map keeper', 'Apron detective', 'Sleepy taste tester'],
    settingDetails: ['Lantern strings shaped like commas', 'Cloud carts', 'A clock that ticks in crumbs'],
    conflict: 'The recipe cards have floated into the wrong stalls.',
    safety: defaultSafety,
    productAngle: '$9 printable pack: moon market map, pastry cards, ending-choice page, parent guide.',
    image: assetPath('images/plotsprout/moon-muffin-market.jpg'),
    accent: '#ec6f3f',
  },
  {
    slug: 'puddle-planet-post-office',
    title: 'Puddle Planet Post Office',
    ageBand: '6-8',
    premise:
      'After rain, sidewalk puddles become tiny planets where cheerful mail carriers deliver messages in bottle caps.',
    prompts: [
      'Choose a bottle-cap stamp and explain what it means.',
      'Write a letter from one puddle planet to another.',
      'Give the mail route one funny obstacle that is solved kindly.',
    ],
    heroChoices: ['Bottle-cap pilot', 'Umbrella cartographer', 'Stamp inventor'],
    settingDetails: ['Ripples that act like doors', 'Pebble islands', 'Leaf boats with ribbon flags'],
    conflict: 'A splash mixed up the delivery routes.',
    safety: defaultSafety,
    productAngle: '$9 printable pack: puddle map, letter templates, stamp sheet, family writing night guide.',
    image: assetPath('images/plotsprout/puddle-planet-post-office.jpg'),
    accent: '#1d9db2',
  },
  {
    slug: 'buttonwood-library-train',
    title: 'Buttonwood Library Train',
    ageBand: '7-9',
    premise:
      'A pocket-sized train circles a library tree and stops at shelves that grow new questions overnight.',
    prompts: [
      'Write the ticket rule for boarding the train.',
      'Invent a shelf that changes when someone asks a brave question.',
      'Give the conductor one tiny problem that needs a thoughtful answer.',
    ],
    heroChoices: ['Ticket poet', 'Shelf cartographer', 'Question conductor'],
    settingDetails: ['Acorn lamps', 'Book tunnels', 'Branch platforms with brass bells'],
    conflict: 'The train has too many questions and not enough stops.',
    safety: defaultSafety,
    productAngle: '$79 classroom license candidate: question-driven narrative unit and rubric.',
    image: assetPath('images/plotsprout/buttonwood-library-train.jpg'),
    accent: '#8067c9',
  },
  {
    slug: 'cloudberry-clocktower',
    title: 'Cloudberry Clocktower',
    ageBand: '8-10',
    premise:
      'A clocktower above the town grows berries that keep time, but the breakfast hour has gone missing.',
    prompts: [
      'Describe how a minute berry tastes without saying sweet.',
      'Write a repair note for a clock hand that wants a day off.',
      'Choose what the town does while breakfast hour is missing.',
    ],
    heroChoices: ['Minute gardener', 'Bell apprentice', 'Breakfast-hour detective'],
    settingDetails: ['Clock vines', 'Teacup weather vanes', 'A stairwell that counts politely'],
    conflict: 'The clocktower is growing tomorrow berries too early.',
    safety: defaultSafety,
    productAngle: '$29 printable homeschool bundle candidate: time, sequence, and revision writing pack.',
    image: assetPath('images/plotsprout/cloudberry-clocktower.jpg'),
    accent: '#c64c7a',
  },
  {
    slug: 'tiny-lantern-reef',
    title: 'Tiny Lantern Reef',
    ageBand: '8-10',
    premise:
      'Under a dock, tiny lanterns guide paper boats through a reef made of lost buttons and sea glass.',
    prompts: [
      'Name the reef rule every boat must follow.',
      'Write a message found inside a sea-glass bottle.',
      'Give the lantern keeper one gentle mystery to solve.',
    ],
    heroChoices: ['Paper-boat pilot', 'Lantern keeper', 'Sea-glass translator'],
    settingDetails: ['Button coral', 'Ribbon currents', 'Glow-worm signal lamps'],
    conflict: 'The reef lights are blinking in the wrong order.',
    safety: defaultSafety,
    productAngle: '$9 printable pack: reef map, boat log, message cards, ending choices.',
    image: assetPath('images/plotsprout/tiny-lantern-reef.jpg'),
    accent: '#2d7d5f',
  },
  {
    slug: 'pencil-dragon-academy',
    title: 'Pencil Dragon Academy',
    ageBand: '10-11',
    premise:
      'Young pencil dragons learn to sketch doors, revise maps, and erase mistakes without erasing the lesson.',
    prompts: [
      'Write the academy pledge in one funny sentence.',
      'Create a map mistake that becomes useful later.',
      'Finish with a choice: redraw the door or ask where it wants to go.',
    ],
    heroChoices: ['Map reviser', 'Door sketcher', 'Eraser coach'],
    settingDetails: ['Graph-paper hills', 'Compass nests', 'A chalkboard cave'],
    conflict: 'A sketched door opens to the wrong classroom.',
    safety: defaultSafety,
    productAngle: '$29 printable homeschool bundle candidate: revision skills through fantasy quests.',
    image: assetPath('images/plotsprout/pencil-dragon-academy.jpg'),
    accent: '#f2b84b',
  },
]

export function getQuestBySlug(slug: string): QuestWorld {
  const world = questWorlds.find((candidate) => candidate.slug === slug)
  if (!world) {
    throw new Error(`Unknown quest world: ${slug}`)
  }
  return world
}

function pick(items: string[], seed: number): string {
  return items[Math.abs(seed) % items.length]
}

export function buildQuestPack(slug: string, seed = 0): QuestPack {
  const world = getQuestBySlug(slug)
  const hero = pick(world.heroChoices, seed)
  const detail = pick(world.settingDetails, seed + 1)
  const prompt = pick(world.prompts, seed + 2)

  return {
    world,
    printableTitle: `${world.title} Mini Quest`,
    paidUpsell: world.productAngle,
    imagePrompt: buildImagePrompt(world),
    steps: [
      { label: 'Pick a hero', text: `Your hero is the ${hero}. Give them one ordinary pocket item.` },
      { label: 'Open the world', text: `${world.premise} Start with ${detail.toLowerCase()}.` },
      { label: 'Add the problem', text: `${world.conflict} ${prompt}` },
      {
        label: 'Finish with a choice',
        text: 'End with two kind choices: one clever, one surprising. Pick the choice your hero makes.',
      },
    ],
  }
}

export function buildImagePrompt(world: QuestWorld): string {
  return [
    `family-friendly ${world.title} scene`,
    world.premise,
    'storybook illustration for kids ages 6-12',
    "rich handmade detail, warm practical lighting, expressive setting, polished children's publishing quality",
    'No text, no letters, no logos, no watermark, no branded characters, no scary harm, no weapons',
  ].join(', ')
}

export const seoCollectionLinks: SeoCollectionLink[] = [
  {
    slug: 'creative-writing-prompts-for-kids',
    title: 'Creative writing prompts for kids',
    lane: 'Prompt bank',
    description:
      'Whimsical quest starts that help kids choose a setting, a tiny problem, and a kind ending.',
  },
  {
    slug: 'story-writing-worksheets',
    title: 'Story writing worksheets',
    lane: 'Worksheet lane',
    description:
      'Printable-friendly planning pages for characters, scenes, revision, and finished-story steps.',
  },
  {
    slug: 'reluctant-writer-activities',
    title: 'Reluctant writer activities',
    lane: 'Low-pressure starts',
    description:
      'Short, choice-based writing activities for kids who need a smaller first step onto the page.',
  },
  {
    slug: 'homeschool-writing-prompts',
    title: 'Homeschool writing prompts',
    lane: 'Homeschool pack',
    description:
      'Flexible writing quests that pair story practice with observation, mapping, and simple projects.',
  },
]

export const miniUnitHubLink: MiniUnitHubLink = {
  slug: 'mini-units',
  title: 'Teacher mini-units',
  description:
    'Ten low-prep homeschool and classroom units with lesson flow, teacher notes, and printable kit angles.',
  note: 'No student accounts, uploads, or public story sharing required.',
}

export const worldGalleryLink: WorldGalleryLink = {
  slug: 'world-gallery',
  title: 'World art gallery',
  description:
    'Twenty local RTX 4090 world images for printable quests, classroom packets, and static SEO pages.',
  note: 'Images are generated locally and committed with prompt sidecars.',
}

export const productLinks: FeaturedProductLink[] = [
  {
    slug: 'rainy-day-story-quest-pack',
    title: 'Rainy Day Story Quest Pack',
    pricePoint: '$9',
    description:
      'A static product page for a rainy-day printable quest pack, ready for checkout wiring after a provider is selected.',
    note: 'No checkout, accounts, uploads, or public publishing are enabled.',
  },
  {
    slug: 'homeschool-season-story-bundle',
    title: 'Homeschool Season Story Bundle',
    pricePoint: '$29',
    description:
      'Twelve seasonal printable quests for homeschool families building a year of short story practice.',
    note: 'No checkout, accounts, uploads, or public publishing are enabled.',
  },
  {
    slug: 'classroom-story-license-pack',
    title: 'Classroom Story License Pack',
    pricePoint: '$79',
    description:
      'Thirty classroom prompt cards with teacher routines, extension activities, and a four-criterion writing rubric.',
    note: 'No checkout, accounts, uploads, or public publishing are enabled.',
  },
  {
    slug: 'birthday-party-story-quest-kit',
    title: 'Birthday Party Story Quest Kit',
    pricePoint: '$19',
    description:
      'Eight party-table writing quests with adult setup tools, routines, extensions, and take-home folder steps.',
    note: 'No checkout, accounts, uploads, or public publishing are enabled.',
  },
  {
    slug: 'road-trip-story-quest-pack',
    title: 'Road Trip Story Quest Pack',
    pricePoint: '$17',
    description:
      'Eight travel-friendly writing quests for car passengers, rest stops, hotel desks, and visit-day tables.',
    note: 'No checkout, accounts, uploads, or public publishing are enabled.',
  },
  {
    slug: 'waiting-room-story-quest-pack',
    title: 'Waiting Room Story Quest Pack',
    pricePoint: '$11',
    description:
      'Eight quiet, low-mess writing quests for restaurants, lobbies, sibling activities, pickup lines, and gates.',
    note: 'No checkout, accounts, uploads, or public publishing are enabled.',
  },
  {
    slug: 'library-story-club-kit',
    title: 'Library Story Club Kit',
    pricePoint: '$23',
    description:
      'Ten adult-led story club sessions with facilitator tools for libraries, co-ops, tutoring groups, and classrooms.',
    note: 'No checkout, accounts, uploads, or public publishing are enabled.',
  },
  {
    slug: 'substitute-teacher-story-station-pack',
    title: 'Substitute Teacher Story Station Pack',
    pricePoint: '$39',
    description:
      'Twelve substitute-ready story stations with setup tools, routines, early finisher cards, and handoff notes.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'tutoring-center-story-sprint-pack',
    title: 'Tutoring Center Story Sprint Pack',
    pricePoint: '$49',
    description:
      'Twenty tutor-led 10-minute story sprints with routines, coaching notes, and take-home practice slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'summer-camp-story-circle-kit',
    title: 'Summer Camp Story Circle Kit',
    pricePoint: '$59',
    description:
      'Sixteen counselor-led story circles with camp-safe routines, quiet options, and take-home trail cards.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'after-school-story-club-starter-kit',
    title: 'After-School Story Club Starter Kit',
    pricePoint: '$69',
    description:
      'Eighteen adult-led after-school club sessions with director tools, quiet options, and take-home prompt cards.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'museum-day-story-notebook-kit',
    title: 'Museum Day Story Notebook Kit',
    pricePoint: '$37',
    description:
      'Fifteen adult-led museum-day notebook pages with visit tools, observation cards, and family handoff prompts.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'family-game-night-story-card-deck',
    title: 'Family Game Night Story Card Deck',
    pricePoint: '$27',
    description:
      'Fifteen cooperative family-table story cards with host tools, quiet options, and take-home starters.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'grandparent-story-visit-kit',
    title: 'Grandparent Story Visit Kit',
    pricePoint: '$31',
    description:
      'Twelve adult-led visit quests with host tools, quiet options, and take-home story postcards.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'thank-you-note-story-postcard-pack',
    title: 'Thank-You Note Story Postcard Pack',
    pricePoint: '$21',
    description:
      'Sixteen printable thank-you story postcards with adult guide tools, revision prompts, and optional share prompts.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'nature-walk-story-field-notes-kit',
    title: 'Nature Walk Story Field Notes Kit',
    pricePoint: '$33',
    description:
      'Twelve printable nature-walk field notes with adult guide tools, walk formats, and take-home field cards.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'backyard-story-seed-packet-kit',
    title: 'Backyard Story Seed Packet Kit',
    pricePoint: '$35',
    description:
      'Fourteen paper story seed packet pages with adult guide tools, packet formats, and take-home seed slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'kitchen-table-story-recipe-card-deck',
    title: 'Kitchen Table Story Recipe Card Deck',
    pricePoint: '$29',
    description:
      'Sixteen paper story recipe cards with adult guide tools, card formats, and take-home recipe slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'bookshop-story-bookmark-pack',
    title: 'Bookshop Story Bookmark Pack',
    pricePoint: '$25',
    description:
      'Sixteen printable story bookmarks with adult guide tools, bookmark formats, and take-home bookmark slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'writing-desk-story-prompt-strip-pack',
    title: 'Writing Desk Story Prompt Strip Pack',
    pricePoint: '$27',
    description:
      'Eighteen printable desk prompt strips with adult guide tools, strip routines, and take-home desk strips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'window-seat-story-scene-card-pack',
    title: 'Window Seat Story Scene Card Pack',
    pricePoint: '$29',
    description:
      'Sixteen printable window-seat scene cards with adult guide tools, scene routines, and take-home scene slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'quiet-corner-story-map-card-pack',
    title: 'Quiet Corner Story Map Card Pack',
    pricePoint: '$31',
    description:
      'Sixteen printable quiet-corner story map cards with adult guide tools, map routines, and take-home map slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'porch-light-story-signal-card-pack',
    title: 'Porch Light Story Signal Card Pack',
    pricePoint: '$33',
    description:
      'Sixteen printable porch-light story signal cards with adult guide tools, signal routines, and take-home signal slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'pencil-case-story-switch-card-pack',
    title: 'Pencil Case Story Switch Card Pack',
    pricePoint: '$35',
    description:
      'Sixteen printable pencil-case story switch cards with adult guide tools, switch routines, and take-home switch slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'notebook-margin-story-revision-card-pack',
    title: 'Notebook Margin Story Revision Card Pack',
    pricePoint: '$37',
    description:
      'Sixteen printable notebook-margin story revision cards with adult guide tools, revision routines, and take-home revision slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'desk-drawer-story-sequence-card-pack',
    title: 'Desk Drawer Story Sequence Card Pack',
    pricePoint: '$39',
    description:
      'Sixteen printable desk-drawer story sequence cards with adult guide tools, sequence routines, and take-home sequence slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'reading-nook-story-cause-effect-card-pack',
    title: 'Reading Nook Story Cause-and-Effect Card Pack',
    pricePoint: '$41',
    description:
      'Sixteen printable reading-nook story cause/effect cards with adult guide tools, cause/effect routines, and take-home cause/effect slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'blanket-fort-story-dialogue-card-pack',
    title: 'Blanket Fort Story Dialogue Card Pack',
    pricePoint: '$43',
    description:
      'Sixteen printable blanket-fort story dialogue cards with adult guide tools, dialogue routines, and take-home dialogue slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'kitchen-window-story-pov-card-pack',
    title: 'Kitchen Window Story Point-of-View Card Pack',
    pricePoint: '$45',
    description:
      'Sixteen printable kitchen-window story point-of-view cards with adult guide tools, viewpoint routines, and take-home POV slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'coat-pocket-story-character-card-pack',
    title: 'Coat Pocket Story Character Card Pack',
    pricePoint: '$47',
    description:
      'Sixteen printable coat-pocket story character cards with adult guide tools, character routines, and take-home character slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'paper-tray-story-setting-card-pack',
    title: 'Paper Tray Story Setting Card Pack',
    pricePoint: '$49',
    description:
      'Sixteen printable paper-tray story setting cards with adult guide tools, setting routines, and take-home setting slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'backpack-story-ending-card-pack',
    title: 'Backpack Story Ending Card Pack',
    pricePoint: '$51',
    description:
      'Sixteen printable backpack story ending cards with adult guide tools, ending routines, and take-home ending slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'pencil-cup-story-opening-card-pack',
    title: 'Pencil Cup Story Opening Card Pack',
    pricePoint: '$53',
    description:
      'Sixteen printable pencil cup story opening cards with adult guide tools, opening routines, and take-home opening slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'desk-lamp-story-problem-card-pack',
    title: 'Desk Lamp Story Problem Card Pack',
    pricePoint: '$55',
    description:
      'Sixteen printable desk lamp story problem cards with adult guide tools, problem routines, and take-home problem slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'paper-clip-story-solution-card-pack',
    title: 'Paper Clip Story Solution Card Pack',
    pricePoint: '$57',
    description:
      'Sixteen printable paper clip story solution cards with adult guide tools, solution routines, and take-home solution slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'binder-clip-story-transition-card-pack',
    title: 'Binder Clip Story Transition Card Pack',
    pricePoint: '$59',
    description:
      'Sixteen printable binder clip story transition cards with adult guide tools, transition routines, and take-home transition slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'folder-tab-story-detail-card-pack',
    title: 'Folder Tab Story Detail Card Pack',
    pricePoint: '$61',
    description:
      'Sixteen printable folder tab story detail cards with adult guide tools, detail routines, and take-home detail slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'index-card-story-show-not-tell-card-pack',
    title: 'Index Card Story Show-Not-Tell Card Pack',
    pricePoint: '$63',
    description:
      'Sixteen printable index card story show-not-tell cards with adult guide tools, show routines, and take-home show slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'sticky-note-story-tone-card-pack',
    title: 'Sticky Note Story Tone Card Pack',
    pricePoint: '$65',
    description:
      'Sixteen printable sticky note story tone cards with adult guide tools, tone routines, and take-home tone slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'washi-tape-story-word-choice-card-pack',
    title: 'Washi Tape Story Word Choice Card Pack',
    pricePoint: '$67',
    description:
      'Sixteen printable washi tape story word choice cards with adult guide tools, word choice routines, and take-home word slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'paper-sleeve-story-sentence-variety-card-pack',
    title: 'Paper Sleeve Story Sentence Variety Card Pack',
    pricePoint: '$69',
    description:
      'Sixteen printable paper sleeve story sentence variety cards with adult guide tools, sentence variety routines, and take-home sentence slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'clipboard-story-paragraph-focus-card-pack',
    title: 'Clipboard Story Paragraph Focus Card Pack',
    pricePoint: '$71',
    description:
      'Sixteen printable clipboard story paragraph focus cards with adult guide tools, paragraph focus routines, and take-home paragraph slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'lined-paper-story-paragraph-revision-card-pack',
    title: 'Lined Paper Story Paragraph Revision Card Pack',
    pricePoint: '$73',
    description:
      'Sixteen printable lined paper story paragraph revision cards with adult guide tools, paragraph revision routines, and take-home paragraph revision slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'composition-notebook-story-draft-checklist-card-pack',
    title: 'Composition Notebook Story Draft Checklist Card Pack',
    pricePoint: '$75',
    description:
      'Sixteen printable composition notebook story draft checklist cards with adult guide tools, draft checklist routines, and take-home draft checklist slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'spiral-notebook-story-final-copy-card-pack',
    title: 'Spiral Notebook Story Final Copy Card Pack',
    pricePoint: '$77',
    description:
      'Sixteen printable spiral notebook story final-copy cards with adult guide tools, final-copy routines, and take-home final-copy slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'tabbed-folder-story-series-card-pack',
    title: 'Tabbed Folder Story Series Card Pack',
    pricePoint: '$79',
    description:
      'Sixteen printable tabbed folder story-series cards with adult guide tools, series routines, and take-home series slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'accordion-folder-story-arc-card-pack',
    title: 'Accordion Folder Story Arc Card Pack',
    pricePoint: '$81',
    description:
      'Sixteen printable accordion folder story-arc cards with adult guide tools, arc routines, and take-home arc slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'expanding-file-story-scene-chain-card-pack',
    title: 'Expanding File Story Scene Chain Card Pack',
    pricePoint: '$83',
    description:
      'Sixteen printable expanding file story scene-chain cards with adult guide tools, scene-chain routines, and take-home scene slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'manila-folder-story-clue-trail-card-pack',
    title: 'Manila Folder Story Clue Trail Card Pack',
    pricePoint: '$85',
    description:
      'Sixteen printable manila folder story clue-trail cards with adult guide tools, clue-trail routines, and take-home clue slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
  {
    slug: 'pocket-folder-story-goal-path-card-pack',
    title: 'Pocket Folder Story Goal Path Card Pack',
    pricePoint: '$87',
    description:
      'Sixteen printable pocket folder story goal-path cards with adult guide tools, goal-path routines, and take-home goal slips.',
    note: 'No checkout is enabled; request the launch notice by email.',
  },
]

export const featuredProductLink: FeaturedProductLink = productLinks[0]
