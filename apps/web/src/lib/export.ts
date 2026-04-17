export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | null | undefined>>) {
  const escapeCell = (value: string | number | null | undefined) => {
    const normalized = String(value ?? '');
    const escaped = normalized.replaceAll('"', '""');
    return /[",\n]/.test(normalized) ? `"${escaped}"` : escaped;
  };

  const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}
