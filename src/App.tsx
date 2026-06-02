import {
  ArrowRight,
  BookOpen,
  Compass,
  Download,
  Image,
  PenLine,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import './App.css'
import {
  buildQuestPack,
  miniUnitHubLink,
  productLinks,
  questWorlds,
  seoCollectionLinks,
  worldGalleryLink,
} from './storyData'

const pagePath = (slug: string) => `${import.meta.env.BASE_URL}${slug}/`

function App() {
  const [ageBand, setAgeBand] = useState('6-8')
  const [selectedSlug, setSelectedSlug] = useState('moon-muffin-market')
  const [seed, setSeed] = useState(1)

  const filteredWorlds = useMemo(
    () => questWorlds.filter((world) => world.ageBand === ageBand),
    [ageBand],
  )

  const visibleWorlds = filteredWorlds.length > 0 ? filteredWorlds : questWorlds
  const selectedWorld = questWorlds.find((world) => world.slug === selectedSlug) ?? visibleWorlds[0]
  const pack = buildQuestPack(selectedWorld.slug, seed)

  function chooseAge(nextAgeBand: string) {
    setAgeBand(nextAgeBand)
    const firstWorld = questWorlds.find((world) => world.ageBand === nextAgeBand)
    if (firstWorld) {
      setSelectedSlug(firstWorld.slug)
      setSeed(1)
    }
  }

  return (
    <main className="app-shell">
      <section className="workbench" aria-labelledby="page-title">
        <div className="title-block">
          <div className="mark" aria-hidden="true">
            <Compass size={28} />
          </div>
          <div>
            <p className="eyebrow">Family writing quest workbench</p>
            <h1 id="page-title">Plot Sprout Explorer</h1>
          </div>
        </div>

        <div className="control-strip" aria-label="Age band">
          {['6-8', '7-9', '8-10', '10-11'].map((band) => (
            <button
              key={band}
              type="button"
              className={band === ageBand ? 'chip active' : 'chip'}
              onClick={() => chooseAge(band)}
            >
              Ages {band}
            </button>
          ))}
        </div>

        <div className="layout-grid">
          <section className="world-list" aria-label="Quest worlds">
            {visibleWorlds.map((world) => (
              <button
                key={world.slug}
                type="button"
                className={world.slug === selectedWorld.slug ? 'world-card selected' : 'world-card'}
                style={{ '--accent': world.accent } as CSSProperties}
                onClick={() => setSelectedSlug(world.slug)}
              >
                <span className="world-age">Ages {world.ageBand}</span>
                <strong>{world.title}</strong>
                <span>{world.premise}</span>
              </button>
            ))}
          </section>

          <section className="quest-panel" aria-live="polite">
            <div className="quest-visual">
              <img src={pack.world.image} alt="" />
              <div>
                <p className="eyebrow">Tonight's kit</p>
                <h2>{pack.printableTitle}</h2>
              </div>
            </div>

            <ol className="quest-steps">
              {pack.steps.map((step) => (
                <li key={step.label}>
                  <span>{step.label}</span>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="button-row">
              <button type="button" className="primary" onClick={() => setSeed((value) => value + 1)}>
                <WandSparkles size={18} />
                Build tonight's quest
              </button>
              <button type="button" className="secondary">
                <Download size={18} />
                Printable pack
              </button>
            </div>
          </section>
        </div>
      </section>

      <section className="lane-section" aria-labelledby="lane-title">
        <div>
          <p className="eyebrow">Crawlable parent and teacher pages</p>
          <h2 id="lane-title">Writing lanes</h2>
        </div>
        <div className="lane-grid">
          {seoCollectionLinks.map((collection) => (
            <a key={collection.slug} className="lane-card" href={pagePath(collection.slug)}>
              <span>{collection.lane}</span>
              <strong>{collection.title}</strong>
              <p>{collection.description}</p>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="mini-unit-section" aria-labelledby="mini-unit-title">
        <div>
          <p className="eyebrow">Three-lesson printable units</p>
          <h2 id="mini-unit-title">{miniUnitHubLink.title}</h2>
        </div>
        <p>{miniUnitHubLink.description}</p>
        <p className="unit-note">{miniUnitHubLink.note}</p>
        <a className="unit-link" href={pagePath(miniUnitHubLink.slug)}>
          Browse mini-units
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div>
          <p className="eyebrow">Local RTX 4090 art batch</p>
          <h2 id="gallery-title">{worldGalleryLink.title}</h2>
        </div>
        <p>{worldGalleryLink.description}</p>
        <p className="gallery-note">{worldGalleryLink.note}</p>
        <a className="gallery-link" href={pagePath(worldGalleryLink.slug)}>
          Browse local art
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </section>

      <section className="product-section" aria-labelledby="product-title">
        <div>
          <p className="eyebrow">Checkout-pending printable offers</p>
          <h2 id="product-title">Paid bundle shelf</h2>
        </div>
        <div className="product-grid">
          {productLinks.map((product) => (
            <article key={product.slug} className="product-card">
              <div>
                <p className="product-price">{product.pricePoint}</p>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
              <a className="product-link" href={pagePath(product.slug)}>
                Preview {product.title}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <p className="product-note">{product.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="project-engine" className="ops-grid" aria-label="Project engine">
        <article>
          <Sparkles size={22} />
          <h2>Codex content flywheel</h2>
          <p>
            Subagents generate worlds, prompts, printable-kit outlines, SEO pages, and review notes in
            disjoint batches. The app can grow without manual page-by-page writing.
          </p>
        </article>
        <article>
          <Image size={22} />
          <h2>Local GPU image lane</h2>
          <p>
            Image prompts are saved with every world. Production art is generated locally on the RTX 4090
            with SDXL or FLUX, then committed with prompt sidecars.
          </p>
        </article>
        <article>
          <ShieldCheck size={22} />
          <h2>Family safety first</h2>
          <p>
            No child accounts, no public story publishing, no branded characters, no scary harm, and no
            unauthenticated mutation endpoints.
          </p>
        </article>
        <article>
          <BookOpen size={22} />
          <h2>Monetizable kits</h2>
          <p>{pack.paidUpsell}</p>
        </article>
        <article className="wide">
          <PenLine size={22} />
          <h2>Image prompt for this world</h2>
          <p>{pack.imagePrompt}</p>
        </article>
      </section>
    </main>
  )
}

export default App
