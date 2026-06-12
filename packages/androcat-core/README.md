# @andromeda-eng/androcat-core

Androcat is the Andromeda suite's **TUI render engine** — _Core defines · Chronicle
remembers · Foldspace navigates · **Androcat renders**_.

`androcat-core` is the framework-agnostic terminal runtime: a TypeScript API
(`Renderer`, `TerminalGuard`, `terminalSize`, input parsing, inline loops)
backed by a **native Rust diff engine** (napi-rs + crossterm). It paints a
double-buffered `Uint32Array` and emits only the minimal ANSI to update the
terminal, driven by a game-engine-style render loop.

> Vendored from [`geoffmiller/ratatat`](https://github.com/geoffmiller/ratatat)
> (MIT). See `ATTRIBUTION.md`.

## Build (from source)

```bash
# Rust toolchain + Node required (napi build)
npm install
npm run build   # napi build --release  +  tsc
npm test        # ava
```

Produces `androcat.<target>.node` and `dist/`.

## Status

Standalone-building; **not yet wired into the root Andromeda pnpm/turbo/cargo
pipelines or CI** (a napi hybrid needs Rust+Node in one CI job). Integration is
tracked separately.
