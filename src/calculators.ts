/** Fabric Calculator roadmap + pillow-type extension points. */

export type CalculatorStatus = 'active' | 'soon' | 'live'

export type Calculator = {
  id: string
  label: string
  status: CalculatorStatus
  /** External URL when status === 'live' */
  href?: string
  primary?: boolean
}

/** Sibling Sailrite calculators shown in header More dropdown. */
export const CALCULATORS: Calculator[] = [
  {
    id: 'nesting',
    label: 'Nesting',
    status: 'live',
    href: 'https://fabric-nesting-woad.vercel.app/',
    primary: true,
  },
  { id: 'pillows', label: 'Pillows', status: 'active', primary: true },
  { id: 'foam-nesting', label: 'Foam Nesting', status: 'soon', primary: true },
  { id: 'cushions', label: 'Cushions', status: 'soon', primary: true },
  { id: 'awnings', label: 'Awnings', status: 'soon', primary: true },
  { id: 'tarps', label: 'Tarps', status: 'soon', primary: true },
  { id: 'sail-shades', label: 'Sail Shades', status: 'soon' },
  { id: 'window-treatments', label: 'Window Treatments', status: 'soon' },
  { id: 'upholstery', label: 'Upholstery', status: 'soon' },
  { id: 'boat-covers', label: 'Boat Covers', status: 'soon' },
  { id: 'wire-hung-canopies', label: 'Wire Hung Canopies', status: 'soon' },
  { id: 'sling-chairs', label: 'Sling Chairs', status: 'soon' },
  { id: 'umbrellas', label: 'Umbrellas', status: 'soon' },
  { id: 'porch-panels', label: 'Porch Panels', status: 'soon' },
  { id: 'slip-covers', label: 'Slip Covers', status: 'soon' },
  { id: 'flat-cone', label: 'Flat Cone', status: 'soon' },
]

export const ACTIVE_CALCULATOR = CALCULATORS.find((c) => c.status === 'active')!

/** Every calculator except the one currently open. */
export const OTHER_CALCULATORS = CALCULATORS.filter((c) => c.id !== ACTIVE_CALCULATOR.id)

/** Pillow subtypes — Throw + Bolster active. */
export type PillowTypeStatus = 'active' | 'soon'

export type PillowType = {
  id: string
  label: string
  status: PillowTypeStatus
  /** Sailrite reference URL when known */
  referenceUrl?: string
  /** Short blurb for Coming soon cards */
  blurb?: string
}

export const PILLOW_TYPES: PillowType[] = [
  {
    id: 'throw',
    label: 'Throw Pillows',
    status: 'active',
    referenceUrl: 'https://www.fabric-calculator.com/throw-pillows.aspx',
    blurb: 'Knife-edge cover (front + back panels)',
  },
  {
    id: 'bolster',
    label: 'Bolster Pillows',
    status: 'active',
    referenceUrl: 'https://www.fabric-calculator.com/bolster-pillows.aspx',
    blurb: 'Cylinder / neck-roll cover (ends + barrel)',
  },
]

export const ACTIVE_PILLOW_TYPE = PILLOW_TYPES.find((t) => t.status === 'active')!
