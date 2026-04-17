export const DEFAULT_REPORT_FROM = '2026-04-01';
export const DEFAULT_REPORT_TO = '2026-04-30';
export const DEFAULT_REPORT_MONTH = '2026-04';

export function toDateRangeParams(range: { from: string; to: string }) {
  return {
    from: `${range.from}T00:00:00.000Z`,
    to: `${range.to}T23:59:59.999Z`,
  };
}

export function getMonthParts(monthValue: string) {
  const [yearString, monthString] = monthValue.split('-');

  return {
    year: Number(yearString),
    month: Number(monthString),
  };
}
