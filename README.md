# Sailrite Pillows (prototype)

Fabric yardage calculator for pillows. v1 implements **Throw Pillows** (knife-edge cover), aligned with [Sailrite’s Throw Pillows calculator](https://www.fabric-calculator.com/throw-pillows.aspx).

## Run
```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## Notes
- Enter pillow **form** width (A) and length (B). Cut panels = form size (Sailrite does not add seam allowance to the cut). With ½″ seams the finished cover is ~1″ smaller per side.
- Quantity 1–20 → 2 cut panels per pillow (front + back).
- Pattern: none (best pack) | horizontal | vertical.
- Order yards round **up to whole yards** (same convention as nesting).
- Estimate only — verify before cutting or ordering.

See `docs/SPEC.md` for scope and extension points.
