# Sailrite Pillows — v1 SPEC

## References
- Type picker: https://www.fabric-calculator.com/pillows.aspx
- Throw pillows: https://www.fabric-calculator.com/throw-pillows.aspx
- Tips: https://www.fabric-calculator.com/tips.aspx#throwPillows
- Nesting sibling (live): https://fabric-nesting-woad.vercel.app/

## v1 scope
- **Active pillow type:** Throw Pillows (knife-edge cover).
- **Stubbed:** Bolster Pillows (`src/calculators.ts` → `PILLOW_TYPES`). Add more types there when browser capture arrives.
- Single-page UI: type selector, throw form, live results (yards exact + order, cut list, SVG form vs cut, materials).
- B/W chrome + Sailrite Blue `#24285e` actions; alert red `#e75053` for diagram form outline / errors.
- Header: logo | Pillows pill + More (Nesting = live link; others Coming soon) | yardage + Shop Sailrite.
- Units: inches / mm.

## Formulas (throw)
Constants (single source: `src/lib/throwPillows.ts`):
- `SEAM_ALLOWANCE_IN = 0.5`
- `FORM_TO_FINISHED_REDUCTION_IN = 1` (= 2 × seam)
- **Cut panel = form size** (Sailrite tip: no SA added to cut; ½″ seams → snug finished ≈ form − 1″).
- Panels needed = `quantity × 2` (front + back).

Orientation:
- **horizontal:** width across bolt, length along bolt (pattern on pillow length).
- **vertical:** length across bolt, width along bolt.
- **none:** evaluate both; pick fewer inches along bolt.

Packing:
- `acrossCount = max(1, floor(fabricWidth / acrossDim))`
- `rows = ceil(panelsNeeded / acrossCount)`
- `lengthInches = rows × alongDim`
- `exactYards = lengthInches / 36`
- `orderYards = ceil(exactYards)` to whole yards (matches nesting `orderYards`).

Verified against live Sailrite samples (18×18, 20×16, qty/fabric-width variants, H vs V).

## Extension points
- `PILLOW_TYPES` / `PillowType` in `src/calculators.ts` — add ids, labels, `referenceUrl`, status.
- Pure math modules under `src/lib/<type>.ts` + vitest; wire UI when ready.
- `CALCULATORS` for cross-app More menu (`live` + `href` or `soon`).
