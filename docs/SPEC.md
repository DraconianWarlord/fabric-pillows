# Sailrite Pillows — SPEC

## References
- Type picker: https://www.fabric-calculator.com/pillows.aspx
- Throw pillows: https://www.fabric-calculator.com/throw-pillows.aspx
- Bolster pillows: https://www.fabric-calculator.com/bolster-pillows.aspx
- Tips (throw + bolster): https://www.fabric-calculator.com/tips.aspx#throwPillows
- Nesting sibling (live): https://fabric-nesting-woad.vercel.app/

## Scope
- **Active pillow types:** Throw Pillows (knife-edge) and Bolster Pillows (cylinder / neck-roll).
- Single-page UI: type toggle, form inputs, live results (yardage, cut list, piping, leftover, diagram, materials).
- B/W chrome + Sailrite Blue `#24285e` actions; alert red `#e75053` for finished-outline / errors.
- Header: logo | Pillows pill + More (Nesting = live link; others Coming soon) | yardage + Shop Sailrite.
- Units: inches / mm.

---

## Throw Pillows

### Inputs
- A width, B length (form), quantity 1–20, fabric width, pattern Horizontal | Vertical | none/best pack.
- **UI default pattern = Horizontal** (Sailrite default). `none` remains as an efficiency option labeled “none / best pack”.

### Cut / packing
Constants (`src/lib/throwPillows.ts`):
- `SEAM_ALLOWANCE_IN = 0.5`
- `FORM_TO_FINISHED_REDUCTION_IN = 1` (= 2 × seam)
- **Cut panel = form size** (no SA added to cut; ½″ seams → snug finished ≈ form − 1″).
- Panels needed = `quantity × 2` (front + back).

Orientation:
- **horizontal:** width across bolt, length along bolt.
- **vertical:** length across bolt, width along bolt.
- **none:** evaluate both; pick fewer inches along bolt (ties → horizontal).

Packing:
- `acrossCount = max(1, floor(fabricWidth / acrossDim))`
- `rows = ceil(panelsNeeded / acrossCount)`
- `lengthInches = rows × alongDim`
- `exactYards = lengthInches / 36`
- `orderYards = ceil(exactYards)` (whole yards).

### Optional piping (always shown)
Constants (single source in `throwPillows.ts`):
- `PIPING_JOIN_EASE_IN = 10`
- `MATCHING_PIPING_STRIP_WIDTH_IN = 3`
- `MATCHING_PIPING_WIDTH_JOIN_LOSS_IN = 1`
- `BIAS_PIPING_WIDTH_ADJUST_IN = 3`
- `BIAS_PIPING_PREF_COEFF = 2`

Formulas (live-locked):
- **Prefabricated piping (in)** = `quantity × 2 × (W + L) + 10`  
  Example: 18×18 qty2 → `2 × 72 + 10 = 154` in / **12.83** ft.
- **Matching (straight) fabric add-on (in)** = `ceil(prefIn × 3 / (fabricWidth − 1))`  
  Example @54″ → **9** in / **0.25** yd.
- **Bias-cut fabric add-on (in)** = `fabricWidth + round(2 × prefIn / (fabricWidth − 3))`  
  Example @54″ → **60** in / **1.67** yd.

### Leftover strip
- `sideStrip = fabricWidth − acrossCount × acrossDim`
- `unusedInLastRow = (acrossCount − lastRowPanels) × acrossDim`
- `width = sideStrip + unusedInLastRow`
- `length = alongDim` when `sideStrip ≈ 0`; else full used `lengthInches`
- Example: 18×18 qty2 @54 → **36 × 18** leftover.

Verified against live Sailrite samples (18×18, 20×16, qty/fabric-width variants, H vs V, piping, leftover).

---

## Bolster Pillows

### Inputs
- A diameter (Width), B length, quantity 1–20, fabric width, pattern Horizontal | Vertical, fit Tight | **Regular (default)**. Units in/mm.

### Cut formulas
Constants (`src/lib/bolsterPillows.ts`):
- `CLOSURE_OVERLAP_IN = 2` — used by live calculator and on-page note.
- `CLOSURE_OVERLAP_TIPS_VELCRO_IN = 2.25` — tips page (1″ Velcro fold each side). **We follow live 2″**; tips value documented for discrepancy.
- `REGULAR_SEAM_ALLOWANCE_IN = 0.5`
- `TIGHT_FINISHED_REDUCTION_IN = 1`
- `ZIPPER_EASE_IN = 2`
- `BOLSTER_PIPING_EASE_PER_PILLOW_IN = 8`

**Regular Fit** (live-locked):
- End cut diameter = `D + 0.5`
- Barrel along = `L + 0.5`
- Barrel circ = `π × (D − 0.5) + 2`  
  Example D=8 → `π×7.5 + 2 ≈ 25.56`

**Tight Fit** (documented + live-checked):
- End cut diameter = `D` (no SA)
- Barrel along = `L`
- Barrel circ = `π × (D − 1) + 2`  
  Cover finishes ~1″ smaller in diameter and length.

### Nesting / yardage
- Horizontal (pattern around): barrel **along** across bolt, **circ** along bolt.
- Vertical (pattern across): barrel **circ** across bolt, **along** along bolt.
- Pack `quantity` barrels; place end circles (`2 × qty`) into leftover width beside barrel rows when they fit; remainder in dedicated end rows of height = end diameter.
- `lengthInches = barrelUsedAlong + endsUsedAlong`
- `orderYards = ceil(exactYards)`

Live example (D=8, L=20, qty=2, fabW=54, Horizontal, Regular):
- End ⌀ **8.5**, barrel **20.5 × 25.56**, length **34.06 in / 0.95 yd**, order **1 yd**
- Optional piping **123 in / 10.25 ft** (order 11 ft)
- Materials: fabric 1 yd, piping 11 ft, Seamstick 1 roll, #4.5 zipper chain 45 in, 2 sliders, 1 cone thread, 2 forms

### Piping / zipper
- Prefabricated piping (in) = `round(qty × (2π × endDiameter + 8))`
- Order piping feet = `ceil(pipingIn / 12)`
- Zipper chain (in) = `qty × (barrelAlong + 2)` (along bolster length; physical zipper direction)

### Uncertainty / notes
- Tips vs live **2″ vs 2¼″** closure: implemented **2″** to hit 25.56 circ.
- Tight Fit derived from live + tip text; unit-tested against live 8×20 qty2 Horizontal Tight (~31.99 in, piping 117).
- Vertical live cut-list text sometimes shows circ+0.5 in labels; nesting uses the Regular circ formula consistently.

---

## Video-brief TBD
- Confirm any video / sewing-guide overrides for bolster zipper placement, Velcro vs zipper closure ease, and piping cord diameter assumptions.
- Capture additional live samples (non-square throws, railroaded fabric, mm units) if Sailrite updates the calculator.

## Extension points
- `PILLOW_TYPES` / `PillowType` in `src/calculators.ts`
- Pure math under `src/lib/<type>.ts` + vitest; wire UI when ready.
- `CALCULATORS` for cross-app More menu (`live` + `href` or `soon`).
