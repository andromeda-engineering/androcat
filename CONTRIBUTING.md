# Contributing to Androcat

Androcat is the render engine of the [Andromeda](https://github.com/andromeda-engineering) suite. Contributions are welcome.

## Setup

Requires **Node ≥ 20**, **pnpm**, and a **Rust** toolchain (the core package is a napi hybrid).

```bash
pnpm install
pnpm build      # native napi engine + TypeScript
pnpm test       # ava
pnpm lint       # oxlint
```

The React adapter (`@andromeda-eng/androcat-react`) depends on the core package via the pnpm workspace (`workspace:*`), so one `pnpm install` wires everything together.

## Ground rules

- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, …), optionally scoped (`feat(react): …`).
- Every package must **build, test, and lint** before a PR is merged. CI runs the same `Build & Test` job.
- Open a PR against `main`.
- **Preserve upstream attribution.** Androcat is vendored from [`geoffmiller/ratatat`](https://github.com/geoffmiller/ratatat) (MIT); keep the notices in each package's `ATTRIBUTION.md` / `LICENSE` and the root `LICENSE`.

## Adding a package

Mirror an existing one (same `package.json` / `tsconfig.json` shape). The pnpm workspace picks up new packages under `packages/*` automatically.
