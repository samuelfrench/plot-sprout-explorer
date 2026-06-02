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
]

export const featuredProductLink: FeaturedProductLink = productLinks[0]
