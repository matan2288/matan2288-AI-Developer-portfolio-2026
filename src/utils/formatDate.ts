/**
 * Helper to display periods or formats consistently
 */
export function formatPeriod(startYear: string, endYear?: string): string {
  if (!endYear) return `${startYear} — Present`;
  return `${startYear} — ${endYear}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
