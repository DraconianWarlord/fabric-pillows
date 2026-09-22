/**
 * Throw pillow (knife-edge cover) yardage math.
 *
 * Aligned with Sailrite Fabric Calculator:
 * https://www.fabric-calculator.com/throw-pillows.aspx
 * Tips: https://www.fabric-calculator.com/tips.aspx#throwPillows
 *
 * Units are inches internally.
 */

export type Unit = 'in' | 'mm'
export type PatternDirection = 'none' | 'horizontal' | 'vertical'

export const MM_PER_IN = 25.4

/**
 * Sailrite tip: cut panels use form measurements with no added seam allowance.
 * Prefabricated forms sewn with ½″ seams yield a snug finished cover
 * (finished ≈ form − 1″ per dimension).
 */
export const SEAM_ALLOWANCE_IN = 0.5

/** Effective finished reduction vs form when using SEAM_ALLOWANCE_IN seams. */
export const FORM_TO_FINISHED_REDUCTION_IN = 2 * SEAM_ALLOWANCE_IN // 1″

/** Knife-edge: front + back panels per pillow. */
export const PANELS_PER_PILLOW = 2

export const DEFAULT_FABRIC_WIDTH_IN = 54
export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 20

export function toInches(value: number, unit: Unit): number {
  return unit === 'in' ? value : value / MM_PER_IN
}

export function fromInches(inches: number, unit: Unit): number {
  return unit === 'in' ? inches : inches * MM_PER_IN
}

/**
 * Cut panel size = form size (Sailrite does not add SA to cut).
 * Documented snug: finished ≈ form − FORM_TO_FINISHED_REDUCTION_IN.
 */
export function cutPanelSize(formInches: number): number {
  return formInches
}

export function finishedSize(formInches: number): number {
  return formInches - FORM_TO_FINISHED_REDUCTION_IN
}

export function exactYards(usedInches: number): number {
  return usedInches / 36
}

/** Match nesting: Sailrite sells full yards — ceil to whole yards. */
export function orderYards(exact: number, step = 1): number {
  if (exact <= 0) return 0
  return Math.ceil(exact / step - 1e-9) * step
}

export type ThrowPillowInput = {
  /** A — pillow form width (inches) */
  formWidthIn: number
  /** B — pillow form length (inches) */
  formLengthIn: number
  quantity: number
  fabricWidthIn: number
  pattern: PatternDirection
}

export type Orientation = {
  /** Panel edge placed across the bolt (fabric width direction). */
  acrossIn: number
  /** Panel edge placed along the bolt (yardage direction). */
  alongIn: number
  label: 'width-across' | 'length-across'
}

export type PackResult = {
  orientation: Orientation
  panelsNeeded: number
  acrossCount: number
  rows: number
  lengthInches: number
  exactYards: number
  orderYards: number
  leftoverAcrossIn: number
}

export type ThrowPillowResult = {
  cutWidthIn: number
  cutLengthIn: number
  finishedWidthIn: number
  finishedLengthIn: number
  panelsNeeded: number
  pack: PackResult
  /** Alternate orientation pack when pattern allows rotation (none). */
  alternatePack: PackResult | null
  cutList: { label: string; widthIn: number; lengthIn: number; qty: number }[]
  materials: string[]
}

/**
 * Horizontal: pattern runs on pillow length → length along bolt, width across.
 * Vertical: pattern runs on pillow width → width along bolt, length across.
 * None: try both; pick lower yardage (ties prefer horizontal).
 */
export function orientationsForPattern(
  formWidthIn: number,
  formLengthIn: number,
  pattern: PatternDirection,
): Orientation[] {
  const widthAcross: Orientation = {
    acrossIn: formWidthIn,
    alongIn: formLengthIn,
    label: 'width-across',
  }
  const lengthAcross: Orientation = {
    acrossIn: formLengthIn,
    alongIn: formWidthIn,
    label: 'length-across',
  }
  if (pattern === 'horizontal') return [widthAcross]
  if (pattern === 'vertical') return [lengthAcross]
  return [widthAcross, lengthAcross]
}

export function packPanels(
  orientation: Orientation,
  panelsNeeded: number,
  fabricWidthIn: number,
): PackResult {
  const acrossCount = Math.max(1, Math.floor(fabricWidthIn / orientation.acrossIn + 1e-9))
  const rows = Math.ceil(panelsNeeded / acrossCount)
  const lengthInches = rows * orientation.alongIn
  const exact = exactYards(lengthInches)
  // Scrap strip width from the last (possibly partial) row — matches Sailrite leftovers.
  const lastRowPanels = panelsNeeded - (rows - 1) * acrossCount
  const leftoverAcrossIn = Math.max(
    0,
    fabricWidthIn - lastRowPanels * orientation.acrossIn,
  )
  return {
    orientation,
    panelsNeeded,
    acrossCount,
    rows,
    lengthInches,
    exactYards: exact,
    orderYards: orderYards(exact),
    leftoverAcrossIn,
  }
}

export function calculateThrowPillows(input: ThrowPillowInput): ThrowPillowResult {
  const {
    formWidthIn,
    formLengthIn,
    quantity,
    fabricWidthIn,
    pattern,
  } = input

  const cutWidthIn = cutPanelSize(formWidthIn)
  const cutLengthIn = cutPanelSize(formLengthIn)
  const panelsNeeded = quantity * PANELS_PER_PILLOW

  const orients = orientationsForPattern(cutWidthIn, cutLengthIn, pattern)
  const packs = orients.map((o) => packPanels(o, panelsNeeded, fabricWidthIn))

  // Prefer fewer inches; stable tie-break keeps first (horizontal / width-across).
  let best = packs[0]!
  for (const p of packs.slice(1)) {
    if (p.lengthInches + 1e-9 < best.lengthInches) best = p
  }
  const alternatePack =
    packs.length > 1 ? packs.find((p) => p !== best) ?? null : null

  const cutList = [
    {
      label: 'front / back panel',
      widthIn: cutWidthIn,
      lengthIn: cutLengthIn,
      qty: panelsNeeded,
    },
  ]

  const materials = [
    `${best.orderYards} yd fabric (${best.exactYards.toFixed(2)} yd exact; ${best.lengthInches} in along bolt)`,
    `${panelsNeeded} cut panels @ ${cutWidthIn} × ${cutLengthIn} in (knife-edge front + back)`,
    `finished cover ≈ ${finishedSize(formWidthIn)} × ${finishedSize(formLengthIn)} in (form − ${FORM_TO_FINISHED_REDUCTION_IN}" with ${SEAM_ALLOWANCE_IN}" seams)`,
  ]

  return {
    cutWidthIn,
    cutLengthIn,
    finishedWidthIn: finishedSize(formWidthIn),
    finishedLengthIn: finishedSize(formLengthIn),
    panelsNeeded,
    pack: best,
    alternatePack,
    cutList,
    materials,
  }
}
