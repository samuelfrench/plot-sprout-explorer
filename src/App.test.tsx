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

  it('links to static product pages without active checkout', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /Rainy Day Story Quest Pack/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Homeschool Season Story Bundle/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Classroom Story License Pack/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Birthday Party Story Quest Kit/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Preview Rainy Day Story Quest Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('rainy-day-story-quest-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Homeschool Season Story Bundle/i })).toHaveAttribute(
      'href',
      expect.stringContaining('homeschool-season-story-bundle'),
    )
    expect(screen.getByRole('link', { name: /Preview Classroom Story License Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('classroom-story-license-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Birthday Party Story Quest Kit/i })).toHaveAttribute(
      'href',
      expect.stringContaining('birthday-party-story-quest-kit'),
    )
    expect(screen.getByRole('link', { name: /Preview Clipboard Story Paragraph Focus Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('clipboard-story-paragraph-focus-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Lined Paper Story Paragraph Revision Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('lined-paper-story-paragraph-revision-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Composition Notebook Story Draft Checklist Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('composition-notebook-story-draft-checklist-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Spiral Notebook Story Final Copy Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('spiral-notebook-story-final-copy-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Tabbed Folder Story Series Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('tabbed-folder-story-series-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Accordion Folder Story Arc Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('accordion-folder-story-arc-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Expanding File Story Scene Chain Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('expanding-file-story-scene-chain-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Manila Folder Story Clue Trail Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('manila-folder-story-clue-trail-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Pocket Folder Story Goal Path Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('pocket-folder-story-goal-path-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Hanging File Story Decision Point Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('hanging-file-story-decision-point-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview File Box Story Turning Point Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('file-box-story-turning-point-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Archive Drawer Story Resolution Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('archive-drawer-story-resolution-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Card Catalog Story Retell Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('card-catalog-story-retell-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Library Pocket Story Summary Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('library-pocket-story-summary-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Shelf Marker Story Theme Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('shelf-marker-story-theme-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Bookend Story Evidence Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('bookend-story-evidence-card-pack'),
    )
    expect(screen.getByRole('link', { name: /Preview Page Flag Story Reason Chain Card Pack/i })).toHaveAttribute(
      'href',
      expect.stringContaining('page-flag-story-reason-chain-card-pack'),
    )
  })
})
