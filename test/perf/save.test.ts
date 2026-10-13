import { expect, it } from 'vitest'
import { serializeBoardFile } from '../../src/core/io/boardFile.ts'
import { generateBoard } from '../generate.ts'
import { fastest } from '../timing.ts'

// PRD budget "Save (serialize, index, write)": 150 ms at 2,000 nodes, 400 ms at 5,000. Write is Obsidian's.
it.each([[2000, 150], [5000, 400]])('serializes %i nodes within budget', async (count, budget) => {
  const board = generateBoard(count, count, 10)
  expect(await fastest(() => serializeBoardFile(board), budget)).toBeLessThan(budget)
})
