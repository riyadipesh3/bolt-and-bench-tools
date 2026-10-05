import { useEffect, useRef, useState, type ReactNode } from 'react'

/* IntersectionObserver reveal. No scroll listeners anywhere on this page. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function QuoteMark() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
      <path
        d="M0 26V14.6C0 6.2 4.4 1 12.4 0l1.4 4.2c-4.4 1.2-6.6 3.8-6.8 7.6h6.4V26H0zm20.2 0V14.6C20.2 6.2 24.6 1 32.6 0L34 4.2c-4.4 1.2-6.6 3.8-6.8 7.6h6.4V26H20.2z"
        fill="currentColor"
      />
    </svg>
  )
}

function ArrowGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2 11L11 2M11 2H4.2M11 2v6.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ data */

const BENCH = [
  {
    ref: 'BB-2214',
    name: 'Ratchet ring spanner set',
    spec: '8 to 19 mm, metric fine series',
    body: 'Thin-wall box ends on a 72-tooth ratchet head. Six of the eight sizes sit inside the shadow of a 19 mm spanner, so the whole tray still folds flat.',
    img: 'https://picsum.photos/seed/boltbench-spanner-set-tray/800/600',
    alt: 'Combination spanners laid out in order on a steel bench tray',
  },
  {
    ref: 'BB-0408',
    name: 'Torque wrench, 40 to 200 Nm',
    spec: 'DIN 3122, scale marked every 2 Nm',
    body: 'Sealed head, so the calibration sticker stays legible for as long as the setting does. Third-party verified each December at the Kirkcaldy depot.',
    img: 'https://picsum.photos/seed/boltbench-torque-wrench-scale/800/600',
    alt: 'Torque wrench scale with the setting cursor set part way along the range',
  },
  {
    ref: 'BB-1712',
    name: 'Impact socket set',
    spec: '1/2 in drive, 13 to 19 mm six point',
    body: 'Chrome vanadium, with a retaining ring that has not snapped since the Stornoway service truck was built.',
    img: 'https://picsum.photos/seed/boltbench-impact-sockets-rack/800/600',
    alt: 'Impact sockets racked in order on a shadow board in a workshop',
  },
  {
    ref: 'BB-0930',
    name: 'Feeler gauge, 0.02 to 1.00 mm',
    spec: 'ISO 3175 blade set, 32 leaves',
    body: 'Blades pivoted on a rivet rather than a spring so a leaf stays where you left it. Every tenth blade is etch-marked with the year it was last checked.',
    img: 'https://picsum.photos/seed/boltbench-feeler-gauge-blades/800/600',
    alt: 'Feeler gauge blades fanned open on a dark work surface',
  },
  {
    ref: 'BB-5502',
    name: 'Knurled knurling handle pair',
    spec: 'ASME B18.3 style, cut at 30 degrees',
    body: 'Sold loose because half the people who order them already have a good one. Two to a set, which is the useful number.',
    img: 'https://picsum.photos/seed/boltbench-knurled-handle-closeup/800/600',
    alt: 'Knurled steel handle turned on a lathe with the tool marks still visible',
  },
  {
    ref: 'BB-1127',
    name: 'Caliper reading caliper',
    spec: 'ISO 1429-1, 0.02 mm resolution',
    body: 'A workshop instrument rather than a shop one. It is the tool we verify our own press work against, so it stays on the bench and not in a drawer.',
    img: 'https://picsum.photos/seed/boltbench-caliper-metal-gauges/800/600',
    alt: 'Vernier caliper measuring a steel bar with the scale in focus',
  },
]

const STANDARD_SIZES = ['8', '10', '12', '13', '17', '19']

const STANDARD_META = [
  { k: 'Series', v: 'Metric fine, 8 to 19 mm, thin wall' },
  { k: 'Drive', v: '1/2 in square, 36 mm overall length' },
  { k: 'Angle', v: '15 degree offset, both ends' },
]

const DRIVES = [
  { v: 'quarter', label: '1/4 in' },
  { v: 'three-eighth', label: '3/8 in' },
  { v: 'half', label: '1/2 in' },
]

const STOCK = [
  { ref: 'BB-2214', item: 'Ratchet ring spanner set', on: true },
  { ref: 'BB-0408', item: 'Torque wrench 40 to 200 Nm', on: false },
  { ref: 'BB-1712', item: 'Impact socket set, six point', on: true },
  { ref: 'BB-1127', item: 'Caliper reading caliper', on: true },
]

/* ------------------------------------------------------------------- app */

export default function App() {
  const [energised, setEnergised] = useState(false)
  const [thumb, setThumb] = useState(false)
  const [size, setSize] = useState('13')
  const [name, setName] = useState('')
  const [sockets, setSockets] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Enter the name the order should sit under.')
      return
    }
    if (!sockets) {
      setError('Choose a socket drive so we pick the right stock.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <>
      <header className="plate sticky top-0 z-30">
        <div className="seam" />
        <div className="shell flex h-18 max-h-20 items-center justify-between py-3">
          <a href="#top" className="flex items-center gap-3">
            <span className="knurl grid h-9 w-9 place-items-center">
              <span className="font-display text-sm font-bold text-fog">B&amp;B</span>
            </span>
            <span className="font-display text-[1.3rem] font-semibold tracking-[-0.03em] text-fog">
              Bolt and Bench
            </span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            <a href="#bench" className="link-underline text-sm text-fog-dim hover:text-fog">
              Bench stock
            </a>
            <a href="#press" className="link-underline text-sm text-fog-dim hover:text-fog">
              Test panel
            </a>
            <a href="#workshop" className="link-underline text-sm text-fog-dim hover:text-fog">
              Workshop
            </a>
            <a href="#order" className="link-underline text-sm text-fog-dim hover:text-fog">
              Orders
            </a>
          </nav>
          <a href="#order" className="btn btn-primary press !py-2 !text-sm">
            Order tools
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero: split, copy left, a knurled control stack right. */}
        <section className="shell flex min-h-[100dvh] items-center pt-24 pb-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <Reveal>
              <p className="micro mb-6">Hand tools, cut and finished in Oban</p>
              <h1 className="text-[clamp(2.3rem,4.4vw,3.8rem)] leading-[1.02] text-fog">
                Steel that holds a setting.
              </h1>
              <p className="mt-7 max-w-[44ch] text-[1.0625rem] leading-[1.65] text-fog-dim">
                Chrome vanadium spanners, torque wrenches and gauges, made in batches and
                recalibrated on a schedule we publish.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3.5">
                <a href="#bench" className="btn btn-primary press">
                  See bench stock
                  <span className="btn-icon">
                    <ArrowGlyph />
                  </span>
                </a>
                <a href="#order" className="btn btn-ghost press">
                  Order from the bench
                </a>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="plate p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="readout-k">Bench plate</span>
                  <span className="readout-k text-signal">OBN</span>
                </div>
                <div className="my-5 flex items-center gap-4">
                  <span className="knurl h-16 w-3 shrink-0" aria-hidden="true" />
                  <p className="engrave font-display text-[2.6rem] font-bold leading-none text-fog">
                    Oban
                  </p>
                </div>
                <div className="seam my-5" />
                <div className="readout grid grid-cols-3 gap-px p-4">
                  <div>
                    <p className="readout-k">Range</p>
                    <p className="readout-v mt-1.5">8 to 19</p>
                  </div>
                  <div>
                    <p className="readout-k">Steel</p>
                    <p className="readout-v mt-1.5">Cr-V</p>
                  </div>
                  <div>
                    <p className="readout-k">Grade</p>
                    <p className="readout-v mt-1.5">620</p>
                  </div>
                </div>
                <div className="seam my-5" />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="ridge px-3 py-1.5 font-mono text-[0.6875rem] text-fog-dim">
                    DIN 3122
                  </span>
                  <span className="ridge px-3 py-1.5 font-mono text-[0.6875rem] text-fog-dim">
                    ISO 3175
                  </span>
                  <span className="ridge px-3 py-1.5 font-mono text-[0.6875rem] text-fog-dim">
                    ASME B18.3
                  </span>
                </div>
                <p className="mt-5 font-mono text-[0.6875rem] leading-[1.6] text-fog-dim">
                  Struck at 12 tons on a 1977 arbor press, then the batch number cut in by hand.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Bench stock: 3x2 card grid, six items, every cell real. */}
        <section id="bench" className="shell py-24 md:py-32">
          <Reveal>
            <h2 className="max-w-[17ch] text-[clamp(2rem,3.9vw,3.1rem)] text-fog">
              Six things that live on our own bench.
            </h2>
            <p className="mt-5 max-w-[58ch] leading-[1.65] text-fog-dim">
              These are the tools we cut and fit ourselves. Same stock as the trade range, same
              tolerance checks, just the sizes we reach for every day.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {BENCH.map((b, i) => (
              <Reveal key={b.ref} delay={(i % 3) * 70}>
                <article className="plate flex h-full flex-col overflow-hidden">
                  <img
                    src={b.img}
                    alt={b.alt}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="h-44 w-full border-b border-rail object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[0.6875rem] text-signal">{b.ref}</span>
                      <span className="ridge px-2 py-1 font-mono text-[0.625rem] text-fog-dim">
                        stock
                      </span>
                    </div>
                    <h3 className="text-[1.3125rem] text-fog">{b.name}</h3>
                    <p className="font-mono text-[0.8125rem] text-fog-dim">{b.spec}</p>
                    <p className="flex-1 text-[0.9375rem] leading-[1.65] text-fog-dim">{b.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Test panel: the control bench. Every state persists. */}
        <section id="press" className="plate border-x-0 py-24 md:py-32">
          <div className="shell">
            <Reveal>
              <h2 className="max-w-[15ch] text-[clamp(2rem,3.9vw,3.1rem)] text-fog">
                Push one of these. They stay where you leave them.
              </h2>
              <p className="mt-5 max-w-[56ch] leading-[1.65] text-fog-dim">
                The bench panel from the fitting shop. Push the actuator, flick the latch, set the
                spanner size. Nothing springs back on its own.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <Reveal>
                <div className="plate flex h-full flex-col p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="readout-k">Bench panel</span>
                    <span className="readout-k text-signal">OBN-4</span>
                  </div>

                  <div className="my-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="actuator w-full sm:w-auto"
                      data-on={energised}
                      aria-pressed={energised}
                      onClick={() => setEnergised((v) => !v)}
                    >
                      <span className="actuator-face">
                        <span className="lamp" aria-hidden="true" />
                        {energised ? 'Bench energised' : 'Energise bench'}
                      </span>
                    </button>
                    <span className="readout px-3 py-2">
                      <span className="readout-v" data-on={energised}>
                        {energised ? '220 V live' : '0 V idle'}
                      </span>
                    </span>
                  </div>

                  <div className="seam my-2" />

                  <button
                    type="button"
                    className="toggle press mt-6"
                    aria-pressed={thumb}
                    onClick={() => setThumb((v) => !v)}
                  >
                    <span className="toggle-track" aria-hidden="true">
                      <span className="toggle-cap" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-semibold text-fog">
                        Quarter-turn latch
                      </span>
                      <span className="mt-1 block font-mono text-[0.6875rem] text-fog-dim">
                        {thumb ? 'Milled cap seated, spindle free' : 'Cap raised, spindle locked'}
                      </span>
                    </span>
                    <span className="readout shrink-0 px-2.5 py-1.5">
                      <span className="readout-v" data-on={thumb}>
                        {thumb ? 'OPEN' : 'SHUT'}
                      </span>
                    </span>
                  </button>

                  <div className="seam my-6" />

                  <div>
                    <span className="readout-k" id="size-label">
                      Spanner size, millimetres
                    </span>
                    <div className="stepper mt-3" role="group" aria-labelledby="size-label">
                      {STANDARD_SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`step-key press ${size === s ? 'is-set' : ''}`}
                          aria-pressed={size === s}
                          onClick={() => setSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 font-mono text-[0.6875rem] leading-[1.6] text-fog-dim">
                      Set on a {size} mm ring gauge, closes on the flats within 0.02 mm.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <figure className="plate flex h-full flex-col overflow-hidden">
                  <img
                    src="https://picsum.photos/seed/boltbench-workbench-fitter-hands/1000/760"
                    alt="A fitter at a workbench with a steel rule and a clamped part"
                    width={1000}
                    height={760}
                    loading="lazy"
                    className="h-56 w-full border-b border-rail object-cover md:h-72 lg:h-64"
                  />
                  <div className="seam" />
                  <figcaption className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-8">
                    <QuoteMark />
                    <blockquote className="text-[1.1875rem] leading-[1.4] tracking-[-0.02em] text-fog">
                      We stopped buying these in. The 13 mm sits on the same gauge it left the shop
                      on, two years later.
                    </blockquote>
                    <p className="text-sm text-fog-dim">
                      Callum Shearer, service technician, Fort William
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Sizes and stock: stacked key/value groups plus a numbered row list. */}
        <section id="workshop" className="shell py-24 md:py-32">
          <Reveal>
            <h2 className="max-w-[14ch] text-[clamp(2rem,3.9vw,3.1rem)] text-fog">
              Every size we cut, and what sits behind it.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <Reveal>
              <div className="plate h-full p-6 md:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="readout-k">Metric fine series</span>
                  <span className="font-display text-2xl text-signal">mm</span>
                </div>
                <div className="my-6 flex flex-wrap gap-2">
                  {STANDARD_SIZES.map((s) => (
                    <span key={s} className="ridge engrave px-3 py-2 text-sm text-fog">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="seam mb-6" />
                <dl className="flex flex-col gap-5">
                  {STANDARD_META.map((m) => (
                    <div key={m.k} className="flex flex-wrap items-baseline justify-between gap-3">
                      <dt className="readout-k">{m.k}</dt>
                      <dd className="text-sm text-fog-dim">{m.v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-[0.9375rem] leading-[1.65] text-fog-dim">
                  Thin wall throughout, so a 19 mm ring clears a nut that a 21 mm box end would
                  only just reach.
                </p>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <div className="flex h-full flex-col gap-8">
                <ul className="flex flex-col">
                  {STOCK.map((r) => (
                    <li
                      key={r.ref}
                      className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-rail py-4 first:border-t"
                    >
                      <span className="font-mono text-[0.8125rem] text-signal">{r.ref}</span>
                      <span className="flex-1 text-[0.9375rem] text-fog">{r.item}</span>
                      <span
                        className={`px-2.5 py-1 font-mono text-[0.6875rem] ${
                          r.on ? 'bg-signal text-ink' : 'ridge text-fog-dim'
                        }`}
                      >
                        {r.on ? 'on the shelf' : 'nine weeks'}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="seam mb-8" />
                <p className="max-w-[52ch] text-[0.9375rem] leading-[1.7] text-fog-dim">
                  Small batches means short runs and long waits. Anything not on the shelf is cut to
                  order, which is three weeks for a spanner and nine for a torque head.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Order: stacked single column, form panel only. */}
        <section id="order" className="shell pb-24 md:pb-32">
          <Reveal>
            <div className="plate p-7 md:p-12">
              <h2 className="max-w-[13ch] text-[clamp(2rem,3.9vw,3.1rem)] text-fog">
                Order from the bench.
              </h2>
              <p className="mt-6 max-w-[52ch] leading-[1.7] text-fog-dim">
                We ship from Oban on Tuesdays and Fridays. Payment is taken when the run is
                scheduled, not when it leaves.
              </p>

              <form
                className="mt-10 grid gap-5 md:grid-cols-2 md:items-start"
                onSubmit={submit}
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm text-fog">
                    Name on the order
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="field"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setSent(false)
                    }}
                    placeholder="Callum Shearer"
                    aria-describedby="name-hint"
                    aria-invalid={error && name.trim().length < 2 ? 'true' : undefined}
                  />
                  <p id="name-hint" className="font-mono text-[0.6875rem] text-fog-dim">
                    Only used to name the run sheet
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="sockets" className="text-sm text-fog">
                    Socket drive
                  </label>
                  <select
                    id="sockets"
                    name="sockets"
                    className="field appearance-none"
                    value={sockets}
                    onChange={(e) => {
                      setSockets(e.target.value)
                      setSent(false)
                    }}
                    aria-describedby="sockets-hint"
                    aria-invalid={error && !sockets ? 'true' : undefined}
                  >
                    <option value="">Select a drive</option>
                    <option value="quarter">1/4 in square drive</option>
                    <option value="three-eighth">3/8 in square drive</option>
                    <option value="half">1/2 in square drive</option>
                  </select>
                  <p id="sockets-hint" className="font-mono text-[0.6875rem] text-fog-dim">
                    Sets are built around one drive only
                  </p>
                </div>

                <div className="md:col-span-2">
                  {error && (
                    <p role="alert" className="text-sm text-fault">
                      {error}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  {sent ? (
                    <div className="readout flex flex-col gap-1.5 p-4" role="status">
                      <span className="readout-v" data-on="true">
                        Run scheduled
                      </span>
                      <span className="text-sm text-fog-dim">
                        We have emailed {name.trim()} the Tuesday slot for the{' '}
                        {DRIVES.find((d) => d.v === sockets)?.label} set.
                      </span>
                    </div>
                  ) : (
                    <button type="submit" className="actuator max-w-sm">
                      <span className="actuator-face">
                        Schedule this run
                        <span className="btn-icon">
                          <ArrowGlyph />
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </Reveal>
        </section>

        <section className="shell pb-24 md:pb-32">
          <Reveal>
            <div className="plate grid gap-8 px-7 py-10 md:grid-cols-[1.3fr_1fr] md:items-center md:px-12 md:py-12">
              <div>
                <h2 className="max-w-[16ch] text-[clamp(1.75rem,3.2vw,2.5rem)] text-fog">
                  Come and hold them before you order.
                </h2>
                <p className="mt-5 max-w-[46ch] leading-[1.7] text-fog-dim">
                  The bench is open on Thursdays. Bring the fastener you keep replacing and we will
                  put the right spanner against it.
                </p>
              </div>
              <div className="md:justify-self-end">
                <a href="#bench" className="btn btn-ghost press">
                  See bench stock
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="plate border-x-0 border-b-0">
        <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
          <div>
            <p className="font-display text-lg font-semibold text-fog">Bolt and Bench</p>
            <p className="mt-3 max-w-[40ch] text-sm leading-[1.65] text-fog-dim">
              Cut and fitted in Oban since 1994. Small batches, published calibration dates, and a
              telephone that a person answers.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <a href="#bench" className="link-underline text-fog-dim hover:text-fog">
              Bench stock
            </a>
            <a href="#press" className="link-underline text-fog-dim hover:text-fog">
              Test panel
            </a>
            <a href="#workshop" className="link-underline text-fog-dim hover:text-fog">
              Workshop
            </a>
          </nav>
          <div className="text-sm text-fog-dim">
            <p>Unit 4, North Quay</p>
            <p className="mt-1">Oban PA34 4DH</p>
            <a href="#order" className="link-underline mt-4 inline-block hover:text-fog">
              Order tools
            </a>
          </div>
        </div>
        <div className="shell border-t border-rail py-7">
          <p className="font-mono text-[0.6875rem] text-fog-dim">
            Developed by{' '}
            <a href="https://thediyadevelopers.com" className="link-underline text-fog">
              Diya Developers
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
