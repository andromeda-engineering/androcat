# Attribution

Androcat is **vendored** from [`geoffmiller/ratatat`](https://github.com/geoffmiller/ratatat)
(MIT License), via the fork [`MyNameReallySux/ratatat`](https://github.com/MyNameReallySux/ratatat).

- **Upstream commit:** `7215cd4bc7bea1e1bcbd0c813d7326f49b26e14b` (2026-04-25)
- **Vendored on:** 2026-06-12

## What changed during vendoring

- Package names: `@ratatat/core` → `@andromeda-eng/androcat-core`,
  `@ratatat/react` → `@andromeda-eng/androcat-react`.
- napi crate: `ratatat` → `andromeda-androcat-engine`; native `binaryName`
  `ratatat` → `androcat` (output `androcat.<target>.node`).
- The crate is a standalone cargo workspace, excluded from the root Andromeda
  workspace, and the packages are excluded from the pnpm workspace, pending
  house-tooling + CI integration.
- Internal symbol names (e.g. `RatatatApp`) are retained for now; renaming is
  tracked as part of the integration follow-up.

The `@ratatat/ink` research fork was **not** vendored.

## Why ratatat

It resolves the Foldspace TUI dilemma: TypeScript/React (Ink-compatible)
authoring on top of an in-process native Rust diff engine — no cross-language
schema seam. See the evaluation in the fork's `EVALUATION.md`.
