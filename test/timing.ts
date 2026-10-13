// Timing for the perf budgets. One run is at the mercy of the scheduler and of other test files running in parallel, so a
// budget is judged on the fastest of a few runs: a real slowdown makes every run slow, a hiccup only spoils one.

/** Runs `fn` once to warm up, then up to `attempts` timed runs, stopping early once one is under `budgetMs`.
 *  Returns the fastest time in milliseconds. */
export function fastest(fn: () => unknown, budgetMs: number, attempts = 5): number {
  fn()
  let best = Infinity
  for (let i = 0; i < attempts && best >= budgetMs; i++) {
    const t = performance.now()
    fn()
    best = Math.min(best, performance.now() - t)
  }
  return best
}
