export function toDateInputValue(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

export function toIsoDateString(value: string) {
  if (!value) {
    return value;
  }

  const normalized = value.includes('T') ? value : `${value}T00:00:00.000Z`;
  return new Date(normalized).toISOString();
}
