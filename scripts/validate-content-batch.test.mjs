import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'))
}

function currentLocalImageCount() {
  const batch4Images = readJson('content/image-queue/2026-06-02-batch4-world-images.json').images.length
  const productImages = readdirSync(resolve(root, 'content', 'image-queue'))
    .filter((fileName) => fileName.endsWith('-product-images.json'))
    .reduce((count, fileName) => count + readJson(`content/image-queue/${fileName}`).images.length, 0)

  return batch4Images + productImages
}

function currentProductArtifactCount() {
  return readdirSync(resolve(root, 'content', 'product-artifacts'), { withFileTypes: true }).filter(
    (entry) => entry.isFile() && entry.name.endsWith('.json'),
  ).length
}

describe('content batch verifier summary', () => {
  it('reports image and artifact totals from the current manifests', () => {
    const output = execFileSync('node', ['scripts/validate-content-batch.mjs'], {
      cwd: root,
      encoding: 'utf8',
    })

    expect(output).toContain(`${currentLocalImageCount()} local world/product images`)
    expect(output).toContain(`${currentProductArtifactCount()} product artifacts`)
  })
})
