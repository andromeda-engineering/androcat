import test from 'ava'
import Yoga from 'yoga-layout-prebuilt'
import { applyStyles, fgAnsi, bgAnsi, styleBitsAnsi } from '../dist/styles.js'

// ─── SGR encoding — parity with androcat-core/src/ansi.rs ───────────────────────

test('fgAnsi: 255 → terminal default (\\x1b[39m)', (t) => t.is(fgAnsi(255), '\x1b[39m'))
test('fgAnsi: 2 → 256-color green', (t) => t.is(fgAnsi(2), '\x1b[38;5;2m'))
test('fgAnsi: 0 → 256-color black', (t) => t.is(fgAnsi(0), '\x1b[38;5;0m'))
test('bgAnsi: 255 → terminal default (\\x1b[49m)', (t) => t.is(bgAnsi(255), '\x1b[49m'))
test('bgAnsi: 1 → 256-color red', (t) => t.is(bgAnsi(1), '\x1b[48;5;1m'))
test('styleBitsAnsi: 0 → empty (no bits, no reset)', (t) => t.is(styleBitsAnsi(0), ''))
test('styleBitsAnsi: 1 → bold', (t) => t.is(styleBitsAnsi(1), '\x1b[1m'))
test('styleBitsAnsi: 5 → bold then italic, in bit order', (t) => t.is(styleBitsAnsi(5), '\x1b[1m\x1b[3m'))
test('styleBitsAnsi: 0xff → all eight bits present', (t) => {
  const out = styleBitsAnsi(0xff)
  for (const esc of ['\x1b[1m', '\x1b[2m', '\x1b[3m', '\x1b[4m', '\x1b[5m', '\x1b[7m', '\x1b[8m', '\x1b[9m']) {
    t.true(out.includes(esc), esc)
  }
})

// ─── T7: justifyContent 'space-evenly' maps to Yoga.JUSTIFY_SPACE_EVENLY ─────

test('applyStyles justifyContent: space-evenly calls setJustifyContent with JUSTIFY_SPACE_EVENLY', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { justifyContent: 'space-evenly' })
  // Yoga.Node.getJustifyContent() returns the current value set on the node
  t.is(node.getJustifyContent(), Yoga.JUSTIFY_SPACE_EVENLY)
  node.free()
})

test('applyStyles justifyContent: flex-start maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { justifyContent: 'flex-start' })
  t.is(node.getJustifyContent(), Yoga.JUSTIFY_FLEX_START)
  node.free()
})

test('applyStyles justifyContent: center maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { justifyContent: 'center' })
  t.is(node.getJustifyContent(), Yoga.JUSTIFY_CENTER)
  node.free()
})

test('applyStyles justifyContent: flex-end maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { justifyContent: 'flex-end' })
  t.is(node.getJustifyContent(), Yoga.JUSTIFY_FLEX_END)
  node.free()
})

test('applyStyles justifyContent: space-between maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { justifyContent: 'space-between' })
  t.is(node.getJustifyContent(), Yoga.JUSTIFY_SPACE_BETWEEN)
  node.free()
})

test('applyStyles justifyContent: space-around maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { justifyContent: 'space-around' })
  t.is(node.getJustifyContent(), Yoga.JUSTIFY_SPACE_AROUND)
  node.free()
})

// ─── B6: alignContent map is complete for supported values ───────────────────

test('applyStyles alignContent: flex-start maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { alignContent: 'flex-start' })
  t.is(node.getAlignContent(), Yoga.ALIGN_FLEX_START)
  node.free()
})

test('applyStyles alignContent: center maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { alignContent: 'center' })
  t.is(node.getAlignContent(), Yoga.ALIGN_CENTER)
  node.free()
})

test('applyStyles alignContent: stretch maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { alignContent: 'stretch' })
  t.is(node.getAlignContent(), Yoga.ALIGN_STRETCH)
  node.free()
})

test('applyStyles alignContent: space-between maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { alignContent: 'space-between' })
  t.is(node.getAlignContent(), Yoga.ALIGN_SPACE_BETWEEN)
  node.free()
})

test('applyStyles alignContent: space-around maps correctly', (t) => {
  const node = Yoga.Node.create()
  applyStyles(node, { alignContent: 'space-around' })
  t.is(node.getAlignContent(), Yoga.ALIGN_SPACE_AROUND)
  node.free()
})
