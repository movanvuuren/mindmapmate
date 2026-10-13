// Timing for the perf budgets. One run is at the mercy of the scheduler and of other test files running in parallel, so a
// budget is judged on the fastest of a few runs: a real slowdown makes every run slow, a hiccup only spoils one.
// A whole process can also stall for a second or more (a busy machine, a paused VM), which would spoil runs made back to
// back, so a slow attempt is followed by a short pause. A healthy run is under budget on the first attempt and never waits.

const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

/** Runs `fn` once to warm up, then up to `attempts` timed runs, stopping early once one is under `budgetMs` and pausing
 *  after each slow one. Returns the fastest time in milliseconds. */
export async function fastest(fn: () => unknown, budgetMs: number, attempts = 8): Promise<number> {
  fn()
  let best = Infinity
  for (let i = 0; i < attempts && best >= budgetMs; i++) {
    if (i) await pause(250)
    const t = performance.now()
    fn()
    best = Math.min(best, performance.now() - t)
  }
  return best
}
