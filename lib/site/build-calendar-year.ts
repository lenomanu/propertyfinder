/**
 * Calendar year fixed at production build time (see `next.config.mjs`).
 * Avoids `new Date()` during prerender when Cache Components is enabled.
 */
export function buildCalendarYear(): number {
  const fromEnv = process.env.NEXT_PUBLIC_BUILD_YEAR;
  const parsed = fromEnv ? Number.parseInt(fromEnv, 10) : NaN;
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  return 2025;
}