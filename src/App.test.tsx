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

  it('links to crawlable writing lane collection pages', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /Writing lanes/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Creative writing prompts for kids/i })).toHaveAttribute(
      'href',
      expect.stringContaining('creative-writing-prompts-for-kids'),
    )
    expect(screen.getByRole('link', { name: /Story writing worksheets/i })).toHaveAttribute(
      'href',
      expect.stringContaining('story-writing-worksheets'),
    )
    expect(screen.getByRole('link', { name: /Reluctant writer activities/i })).toHaveAttribute(
      'href',
      expect.stringContaining('reluctant-writer-activities'),
    )
    expect(screen.getByRole('link', { name: /Homeschool writing prompts/i })).toHaveAttribute(
      'href',
      expect.stringContaining('homeschool-writing-prompts'),
    )
  })

  it('links to teacher mini-units without requiring student accounts', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /Teacher mini-units/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Browse mini-units/i })).toHaveAttribute(
      'href',
      expect.stringContaining('mini-units'),
    )
    expect(screen.getByText(/No student accounts/i)).toBeInTheDocument()
  })

  it('links to the static world art gallery without loading image data into React', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /World art gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Browse local art/i })).toHaveAttribute(
      'href',
      expect.stringContaining('world-gallery'),
    )
  })
})
