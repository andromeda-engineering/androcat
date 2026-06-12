// smoke.mjs — headless functional smoke test for the androcat engine.
// Run from the androcat repo after `pnpm install && pnpm build`:
//   pnpm smoke      (or: node packages/androcat-react/smoke.mjs)
import React from 'react'
import { Box, Text, renderToString } from './dist/index.js'
import { LayoutNode } from './dist/layout.js'
import { AndrocatReconciler } from './dist/reconciler.js'
import { renderTreeToBuffer } from './dist/renderer.js'
import { Cell } from '@andromeda-eng/androcat-core'

const cols = 60, rows = 7
const ui = React.createElement(Box,
  { flexDirection: 'column', borderStyle: 'round', padding: 1 },
  React.createElement(Text, { color: 'green', bold: true }, 'Androcat OK'),
  React.createElement(Text, {}, 'native diff + reconciler + flexbox layout'),
)

// ── Part A: layout + padding, plain glyphs ──────────────────────────────────
// renderToString defaults to a plain string (char plane only), so colour/bold
// won't show here — by design. Widened + padded so nothing truncates.
const plain = renderToString(ui, { columns: cols, rows })
console.log('── renderToString() — plain glyphs, padded ──')
console.log(plain)

if (!plain.includes('flexbox layout')) { console.error('FAIL: text truncated'); process.exit(1) }
if (!/[╭─╮│╰╯]/.test(plain))           { console.error('FAIL: border not laid out'); process.exit(1) }

// ── Part B: same render with ansi:true — styled, paste-to-terminal ──────────
const styled = renderToString(ui, { columns: cols, rows, ansi: true })
console.log('\n── renderToString({ ansi: true }) — SGR escapes, colour/bold visible ──')
console.log(styled)

if (!styled.includes('\x1b[38;5;2m')) { console.error('FAIL: green fg not emitted'); process.exit(1) }
if (!styled.includes('\x1b[1m'))      { console.error('FAIL: bold not emitted'); process.exit(1) }

// ── Part C: prove styling is computed in the buffer (attribute plane, i*2+1) ─
const root = new LayoutNode()
const container = AndrocatReconciler.createContainer(root, 0, null, false, null, '', () => {}, null)
AndrocatReconciler.updateContainerSync(
  React.createElement(Text, { color: 'green', bold: true }, 'Hi'),
  container, null, () => {},
)
AndrocatReconciler.flushSyncWork()
root.calculateLayout(cols, rows)
const buf = new Uint32Array(cols * rows * 2)
renderTreeToBuffer(root, buf, cols, rows)
const attr = buf[1] // cell (0,0) attribute plane
const fg = Cell.getFg(attr)
const bold = Cell.getStyles(attr) & 1
console.log('\n── attribute plane @ (0,0) ──')
console.log(`fg=${fg} (green=2 expected) · bold=${bold} (1 expected)`)

if (fg !== 2)   { console.error('FAIL: green not applied in buffer'); process.exit(1) }
if (bold !== 1) { console.error('FAIL: bold not applied in buffer'); process.exit(1) }

console.log('\n✅ smoke passed — layout, ansi output, and computed styling all verified')
