import { describe, expect, it } from 'vitest'

import { verifyWorkflowPolicy } from './verify-workflows.mjs'

function safeDeploy(extraStep = '') {
  return `name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: [self-hosted, Linux, X64]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run verify
${extraStep}`
}

describe('workflow policy verifier', () => {
  it('accepts the push-only self-hosted deploy workflow shape', () => {
    expect(() => verifyWorkflowPolicy(['deploy.yml'], safeDeploy())).not.toThrow()
  })

  it('rejects image generation commands generically', () => {
    for (const command of ['npm run image:batch7', 'npm run image:batch10', 'npm run image:starter']) {
      expect(() => verifyWorkflowPolicy(['deploy.yml'], safeDeploy(`      - run: ${command}\n`))).toThrow(
        /blocked content-generation automation/,
      )
    }
  })

  it('rejects extra workflow files and scheduled automation', () => {
    expect(() => verifyWorkflowPolicy(['deploy.yml', 'content.yml'], safeDeploy())).toThrow(/Expected only deploy.yml/)
    expect(() => verifyWorkflowPolicy(['deploy.yml'], `${safeDeploy()}schedule:\n  - cron: '0 0 * * *'\n`)).toThrow(
      /blocked content-generation automation/,
    )
  })
})
