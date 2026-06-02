import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'

import { containsActiveCheckoutLanguage } from './content-policy.mjs'

export const rainyDayProductSlug = 'rainy-day-story-quest-pack'
export const seasonBundleProductSlug = 'homeschool-season-story-bundle'

const requiredSafety =
  'No scary harm, no bullying, no romance, no weapons, no branded characters, no real child profiles.'

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

const allowedPageTypes = new Set(['map', 'prompt', 'worksheet', 'cards', 'reflection', 'adult-guide'])

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
    const sourceWorldSet = new Set(source.worldSlugs ?? [])
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
        errors.push(`Rainy Day PDF artifact must have exactly ${options.expectedPdfPages} pages; found ${pageCount}.`)
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
    artifact?.pdfPath === requiredSeasonBundleArtifactPaths.pdfPath
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
