import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the Plot Sprout Explorer product surface', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /Plot Sprout Explorer/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Codex content flywheel/i)).toBeInTheDocument()
    expect(screen.getByText(/Local GPU image lane/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Build tonight's quest/i })).toBeInTheDocument()
  })
})
