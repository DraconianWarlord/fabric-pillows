import { useMemo, useState } from 'react'
import { CalculatorNav, MobileMoreCalculators } from './CalculatorNav'
import { PILLOW_TYPES } from './calculators'
import { SHOP, shopFabricYardsLabel } from './shopLinks'
import {
  DEFAULT_FABRIC_WIDTH_IN,
  FORM_TO_FINISHED_REDUCTION_IN,
  MAX_QUANTITY,
  MIN_QUANTITY,
  SEAM_ALLOWANCE_IN,
  calculateThrowPillows,
  fromInches,
  toInches,
  type PatternDirection,
  type Unit,
} from './lib/throwPillows'
import './App.css'

function formatDim(inches: number, unit: Unit): string {
  const v = fromInches(inches, unit)
  if (unit === 'in') return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, '')
  return v.toFixed(0)
}

function PillowDiagram({
  formW,
  formL,
  cutW,
  cutL,
  finishedW,
  finishedL,
  unit,
}: {
  formW: number
  formL: number
  cutW: number
  cutL: number
  finishedW: number
  finishedL: number
  unit: Unit
}) {
  // Cut = form size (Sailrite); show finished (snug) dashed inside cut.
  const max = Math.max(cutW, cutL, finishedW, finishedL, 1)
  const scale = 140 / max
  const cw = cutW * scale
  const cl = cutL * scale
  const finW = Math.max(4, finishedW * scale)
  const finL = Math.max(4, finishedL * scale)
  const pad = 28
  const svgW = cw + pad * 2 + 120
  const svgH = cl + pad * 2 + 8

  return (
    <svg
      className="pillow-diagram"
      viewBox={`0 0 ${svgW} ${svgH}`}
      role="img"
      aria-label="Form, cut, and finished cover diagram"
    >
      <rect
        x={pad}
        y={pad}
        width={cw}
        height={cl}
        fill="#e8eaf6"
        stroke="#24285e"
        strokeWidth={2}
        rx={2}
      />
      <text x={pad + cw / 2} y={pad - 10} textAnchor="middle" className="diag-label">
        cut (= form) {formatDim(cutW, unit)} × {formatDim(cutL, unit)} {unit}
      </text>
      <rect
        x={pad + (cw - finW) / 2}
        y={pad + (cl - finL) / 2}
        width={finW}
        height={finL}
        fill="none"
        stroke="#e75053"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        rx={2}
      />
      <text
        x={pad + cw / 2}
        y={pad + cl / 2 + 4}
        textAnchor="middle"
        className="diag-label diag-label-inner"
      >
        finished
      </text>
      <g transform={`translate(${pad + cw + 16}, ${pad + 8})`}>
        <line x1={0} y1={0} x2={14} y2={0} stroke="#24285e" strokeWidth={2} />
        <text x={20} y={4} className="diag-legend">
          cut / form {formatDim(formW, unit)}×{formatDim(formL, unit)}
        </text>
        <line
          x1={0}
          y1={18}
          x2={14}
          y2={18}
          stroke="#e75053"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <text x={20} y={22} className="diag-legend">
          finished (−{FORM_TO_FINISHED_REDUCTION_IN}")
        </text>
      </g>
    </svg>
  )
}

export default function App() {
  const [unit, setUnit] = useState<Unit>('in')
  const [widthDraft, setWidthDraft] = useState('18')
  const [lengthDraft, setLengthDraft] = useState('18')
  const [fabricDraft, setFabricDraft] = useState(String(DEFAULT_FABRIC_WIDTH_IN))
  const [quantity, setQuantity] = useState(1)
  const [pattern, setPattern] = useState<PatternDirection>('none')
  const [pillowTypeId, setPillowTypeId] = useState('throw')

  const formWidthIn = Math.max(0.1, toInches(Number(widthDraft) || 0, unit))
  const formLengthIn = Math.max(0.1, toInches(Number(lengthDraft) || 0, unit))
  const fabricWidthIn = Math.max(1, toInches(Number(fabricDraft) || 0, unit))

  const result = useMemo(
    () =>
      calculateThrowPillows({
        formWidthIn,
        formLengthIn,
        quantity,
        fabricWidthIn,
        pattern,
      }),
    [formWidthIn, formLengthIn, quantity, fabricWidthIn, pattern],
  )

  const exact = result.pack.exactYards
  const order = result.pack.orderYards
  const unitLabel = unit === 'in' ? 'in' : 'mm'
  const activeType = PILLOW_TYPES.find((t) => t.id === pillowTypeId) ?? PILLOW_TYPES[0]!

  function switchUnit(next: Unit) {
    if (next === unit) return
    const w = Number(widthDraft)
    const l = Number(lengthDraft)
    const f = Number(fabricDraft)
    if (Number.isFinite(w) && w > 0) {
      setWidthDraft(
        String(
          Number(
            fromInches(toInches(w, unit), next).toFixed(next === 'in' ? 3 : 0),
          ),
        ),
      )
    }
    if (Number.isFinite(l) && l > 0) {
      setLengthDraft(
        String(
          Number(
            fromInches(toInches(l, unit), next).toFixed(next === 'in' ? 3 : 0),
          ),
        ),
      )
    }
    if (Number.isFinite(f) && f > 0) {
      setFabricDraft(
        String(
          Number(
            fromInches(toInches(f, unit), next).toFixed(next === 'in' ? 3 : 0),
          ),
        ),
      )
    }
    setUnit(next)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-bar">
          <div className="app-header-identity">
            <img src="/sailrite-logo.png" alt="Sailrite" className="brand-logo" />
            <span className="current-tool" aria-current="page">
              Pillows
            </span>
            <MobileMoreCalculators />
          </div>

          <CalculatorNav />

          <div className="app-header-status">
            <div className="yards" aria-label="Yardage summary">
              <span className="yards-exact">{exact.toFixed(2)} yd</span>
              <span className="yards-order">Order {order} yd</span>
            </div>
            <a
              className="shop-sailrite"
              href={SHOP.home}
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop Sailrite
            </a>
          </div>
        </div>
      </header>

      <p className="disclaimer" role="note">
        Estimate only — double-check all results thoroughly. Sailrite is not responsible for
        miscalculations, cut fabric, or purchased fabric from this tool.
      </p>

      <div className="layout">
        <aside className="sidebar left">
          <section className="card">
            <h2 className="card-title">pillow type</h2>
            <div className="type-grid" role="list">
              {PILLOW_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="listitem"
                  className={`type-card${t.id === activeType.id ? ' active' : ''}${
                    t.status === 'soon' ? ' soon' : ''
                  }`}
                  disabled={t.status === 'soon'}
                  onClick={() => t.status === 'active' && setPillowTypeId(t.id)}
                  title={t.status === 'soon' ? 'Coming soon' : t.blurb}
                >
                  <span className="type-label">{t.label}</span>
                  {t.status === 'soon' ? (
                    <span className="type-soon">Coming soon</span>
                  ) : (
                    <span className="type-blurb">{t.blurb}</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">units</h2>
            <div className="unit-toggle" role="group" aria-label="Unit of measurement">
              <button
                type="button"
                className={unit === 'in' ? 'active' : ''}
                aria-pressed={unit === 'in'}
                onClick={() => switchUnit('in')}
              >
                inches
              </button>
              <button
                type="button"
                className={unit === 'mm' ? 'active' : ''}
                aria-pressed={unit === 'mm'}
                onClick={() => switchUnit('mm')}
              >
                mm
              </button>
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">throw pillow inputs</h2>
            <label>
              A. width (form)
              <input
                type="number"
                min={1}
                step={1}
                value={widthDraft}
                onChange={(e) => setWidthDraft(e.target.value)}
              />
              <span className="hint">
                finished cover ≈ form − {FORM_TO_FINISHED_REDUCTION_IN}" ({SEAM_ALLOWANCE_IN}"
                seams; cut = form)
              </span>
            </label>
            <label>
              B. length (form)
              <input
                type="number"
                min={1}
                step={1}
                value={lengthDraft}
                onChange={(e) => setLengthDraft(e.target.value)}
              />
            </label>
            <label>
              quantity
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {Array.from({ length: MAX_QUANTITY - MIN_QUANTITY + 1 }, (_, i) => {
                  const n = MIN_QUANTITY + i
                  return (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                })}
              </select>
            </label>
            <label>
              fabric width
              <input
                type="number"
                min={1}
                step={1}
                value={fabricDraft}
                onChange={(e) => setFabricDraft(e.target.value)}
              />
              <span className="hint">often 46, 54, or 60 {unitLabel}</span>
            </label>
            <fieldset className="pattern-fieldset">
              <legend>pattern direction</legend>
              {(
                [
                  ['none', 'none'],
                  ['horizontal', 'horizontal'],
                  ['vertical', 'vertical'],
                ] as const
              ).map(([val, label]) => (
                <label key={val} className="radio-label">
                  <input
                    type="radio"
                    name="pattern"
                    value={val}
                    checked={pattern === val}
                    onChange={() => setPattern(val)}
                  />
                  {label}
                </label>
              ))}
              <span className="hint">
                horizontal = pattern on pillow length (length along bolt). vertical = pattern on
                width. none = best packing.
              </span>
            </fieldset>
          </section>
        </aside>

        <main className="results" data-mobile-pane="results">
          <section className="card results-hero">
            <h2 className="card-title">yardage</h2>
            <div className="results-yards">
              <div>
                <div className="big-exact">{exact.toFixed(2)} yd</div>
                <div className="big-meta">{formatDim(result.pack.lengthInches, unit)} {unitLabel} along bolt</div>
              </div>
              <div>
                <div className="big-order">Order {order} yd</div>
                <div className="big-meta">rounded up to whole yards</div>
              </div>
            </div>
            <a
              className="shop-fabric"
              href={SHOP.fabric}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shopFabricYardsLabel(order)}
            </a>
          </section>

          <section className="card">
            <h2 className="card-title">cut list</h2>
            <ul className="cut-list">
              {result.cutList.map((c) => (
                <li key={c.label}>
                  <strong>
                    {c.qty}× {formatDim(c.widthIn, unit)} × {formatDim(c.lengthIn, unit)}{' '}
                    {unitLabel}
                  </strong>
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>
            <p className="hint">
              packing: {result.pack.acrossCount} across × {result.pack.rows} row
              {result.pack.rows === 1 ? '' : 's'} (
              {result.pack.orientation.label === 'width-across'
                ? 'width across bolt'
                : 'length across bolt'}
              )
              {result.pack.leftoverAcrossIn > 0.05
                ? ` · leftover strip ≈ ${formatDim(result.pack.leftoverAcrossIn, unit)} ${unitLabel}`
                : ''}
            </p>
          </section>

          <section className="card">
            <h2 className="card-title">form vs cut</h2>
            <PillowDiagram
              formW={formWidthIn}
              formL={formLengthIn}
              cutW={result.cutWidthIn}
              cutL={result.cutLengthIn}
              finishedW={result.finishedWidthIn}
              finishedL={result.finishedLengthIn}
              unit={unit}
            />
            <p className="hint">
              finished ≈ {formatDim(result.finishedWidthIn, unit)} ×{' '}
              {formatDim(result.finishedLengthIn, unit)} {unitLabel}
            </p>
          </section>

          <section className="card">
            <h2 className="card-title">materials summary</h2>
            <ul className="materials">
              {result.materials.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  )
}
