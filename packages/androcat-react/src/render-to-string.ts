// @ts-nocheck — reconciler createContainer arity varies between React versions
import React from 'react'
import { LayoutNode } from './layout.js'
import { AndrocatReconciler } from './reconciler.js'
import { renderTreeToBuffer } from './renderer.js'
import { AndrocatContext } from './hooks.js'
import { FocusProvider } from './focus.js'
import { fgAnsi, bgAnsi, styleBitsAnsi } from './styles.js'
import { Cell } from '@andromeda-eng/androcat-core'

const RESET = '\x1b[0m'

export interface RenderToStringOptions {
  /** Width of the virtual terminal in columns. @default 80 */
  columns?: number
  /** Height of the virtual terminal in rows. @default 24 */
  rows?: number
  /**
   * Emit ANSI SGR escapes (colour, bold, background, …) instead of plain
   * glyphs. The escapes match what the live `Renderer` writes to a terminal,
   * so the result can be printed for a styled preview or snapshot-tested.
   * @default false
   */
  ansi?: boolean
}

// Read one painted row back as a styled string: minimal SGR (emitted only when
// the cell attribute changes), trailing default-blank cells dropped, reset at
// the end. A fully-default row returns '' so trailing-row trimming still works.
function readAnsiRow(buffer: Uint32Array, row: number, cols: number): string {
  let last = -1
  for (let col = cols - 1; col >= 0; col--) {
    const i = (row * cols + col) * 2
    const attr = buffer[i + 1]!
    const blank =
      Cell.getChar(buffer[i]!) === ' ' &&
      Cell.getFg(attr) === 255 &&
      Cell.getBg(attr) === 255 &&
      Cell.getStyles(attr) === 0
    if (!blank) {
      last = col
      break
    }
  }
  if (last < 0) return ''

  let line = ''
  let prevAttr = -1
  for (let col = 0; col <= last; col++) {
    const i = (row * cols + col) * 2
    const attr = buffer[i + 1]!
    if (attr !== prevAttr) {
      line += RESET + fgAnsi(Cell.getFg(attr)) + bgAnsi(Cell.getBg(attr)) + styleBitsAnsi(Cell.getStyles(attr))
      prevAttr = attr
    }
    line += Cell.getChar(buffer[i]!)
  }
  return line + RESET
}

/**
 * Render a React element to a plain string synchronously.
 * No TTY, no stdin, no alternate screen — pure layout + buffer read-back.
 *
 * Useful for testing, documentation generation, and any scenario where
 * you need rendered output as a string without a live terminal.
 *
 * Notes:
 * - Terminal hooks (useInput, useApp, useStdin, useStdout, useStderr,
 *   useFocus, useFocusManager) return safe no-op defaults — they do not throw.
 * - useEffect callbacks run but state updates they trigger do not affect output.
 * - useLayoutEffect callbacks fire synchronously and DO affect output.
 */
export function renderToString(element: React.ReactElement, options?: RenderToStringOptions): string {
  const cols = options?.columns ?? 80
  const rows = options?.rows ?? 24

  const rootNode = new LayoutNode()
  rootNode.yogaNode.setWidth(cols)
  rootNode.yogaNode.setHeight(rows)

  // No-op app/input stubs — hooks need a context but nothing should actually run
  const noopContext = {
    app: null as any,
    input: null as any,
    writeStdout: (_t: string) => {},
    writeStderr: (_t: string) => {},
  }

  const wrapped = React.createElement(
    AndrocatContext.Provider,
    { value: noopContext },
    React.createElement(FocusProvider, null, element),
  )

  // Create container in legacy (synchronous) mode
  const container = AndrocatReconciler.createContainer(
    rootNode,
    0, // LegacyRoot
    null,
    false,
    null,
    'renderToString',
    () => {},
    null,
  )

  // Render synchronously
  AndrocatReconciler.updateContainerSync(wrapped as any, container, null, () => {})
  AndrocatReconciler.flushSyncWork()

  // Layout and paint into a buffer
  rootNode.calculateLayout(cols, rows)
  const buffer = new Uint32Array(cols * rows * 2)
  renderTreeToBuffer(rootNode, buffer, cols, rows)

  // Read buffer back to string — trim trailing spaces from each row,
  // then strip empty trailing rows. In ansi mode emit SGR escapes per row.
  const lines: string[] = []
  for (let row = 0; row < rows; row++) {
    if (options?.ansi) {
      lines.push(readAnsiRow(buffer, row, cols))
      continue
    }
    let line = ''
    for (let col = 0; col < cols; col++) {
      const ch = buffer[(row * cols + col) * 2]
      line += Cell.getChar(ch)
    }
    lines.push(line.trimEnd())
  }

  // Remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop()
  }

  // Teardown: unmount the tree so reconciler cleans up
  AndrocatReconciler.updateContainerSync(null as any, container, null, () => {})
  AndrocatReconciler.flushSyncWork()
  rootNode.destroy()

  return lines.join('\n')
}
