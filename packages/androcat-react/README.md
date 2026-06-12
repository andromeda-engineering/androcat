# @andromeda-eng/androcat-react

React adapter for **Androcat**, the Andromeda TUI render engine. Provides the
React reconciler, Yoga layout, and an **Ink-compatible** component/hook surface
(`Box`, `Text`, `useInput`, `useFocus`, `useFocusManager`, `render`, …) over
[`@andromeda-eng/androcat-core`](../androcat-core/README.md).

Foldspace consumes this layer to render web pages as AVML: the Ink-compatible
`useFocus`/`useFocusManager`/`useInput` hooks map directly onto Foldspace's
hotkeys to cycle links and interactable elements.

> Vendored from [`geoffmiller/ratatat`](https://github.com/geoffmiller/ratatat)
> (MIT). See `ATTRIBUTION.md`.

## Build (from source)

```bash
npm install
npm run build   # tsc (depends on androcat-core being built)
npm test        # ava
```

## Status

Standalone-building; **not yet wired into root Andromeda CI** (tracked).
