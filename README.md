# Sailrite Pillows

> **Suite monorepo:** active development continues in [DraconianWarlord/fabric-calculators](https://github.com/DraconianWarlord/fabric-calculators) (`packages/calculators/`). This standalone repo is kept for history.


Fabric yardage calculator for pillows, aligned with [Sailrite’s Fabric Calculator](https://www.fabric-calculator.com/pillows.aspx).

## Pillow types
- **Throw Pillows** — knife-edge cover (front + back panels), optional piping + leftover strip.
- **Bolster Pillows** — cylinder / neck-roll (end circles + barrel), Regular/Tight fit, optional piping.

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
- Enter pillow **form** dimensions. Throw cut panels = form size (no SA on cut). Bolster Regular adds ½″; Tight does not.
- Quantity 1–20. Pattern defaults to **Horizontal** (Sailrite default).
- Order yards round **up to whole yards** (same convention as nesting).
- Estimate only — verify before cutting or ordering.

See `docs/SPEC.md` for formulas, live parity examples, and the 2″ vs 2¼″ Velcro note.
