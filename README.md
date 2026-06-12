# Androcat

> A TUI render engine: **TypeScript/React (Ink-compatible) authoring on a native Rust diff engine**, in-process via [napi](https://napi.rs/) — no cross-language seam.

Androcat is the render layer of the [Andromeda](https://github.com/andromeda-engineering) suite. It pairs an Ink-compatible React reconciler with a native Rust terminal diff engine so you can author terminal UIs in React while the hot path (cell diffing, ANSI emission) runs in Rust.

## Packages

| Package | What |
| --- | --- |
| [`@andromeda-eng/androcat-core`](packages/androcat-core) | Framework-agnostic terminal runtime + the native Rust diff engine (napi). Crate: `andromeda-androcat-engine`, binary `androcat`. |
| [`@andromeda-eng/androcat-react`](packages/androcat-react) | React reconciler, Yoga layout, and Ink-compatible components/hooks over the core runtime. |

Both are currently `private` (source-available; not yet published to npm).

## Develop

Requires **Node ≥ 20**, **pnpm**, and a **Rust** toolchain (for the napi build).

```bash
pnpm install
pnpm build        # builds the native engine (napi) + TypeScript across packages
pnpm test         # ava test suites for core + react
pnpm lint         # oxlint
```

The React adapter depends on the core package via the pnpm workspace
(`workspace:*`), so a single `pnpm install` wires everything up.

## Attribution

Androcat is **vendored and renamed** from [`geoffmiller/ratatat`](https://github.com/geoffmiller/ratatat) by Geoff Miller, used under the MIT License. See each package's `ATTRIBUTION.md` and `LICENSE`, and the root [LICENSE](LICENSE), for the full notice.

## License

[MIT](LICENSE).
