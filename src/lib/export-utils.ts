/**
 * Export utilities for CSV and JSON formats
 */

export interface ExportableRow {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Convert an array of objects to CSV string.
 * Handles commas, quotes, and newlines in values.
 */
export function toCSV(rows: ExportableRow[], delimiter = ","): string {
  if (rows.length === 0) return "";

  const headers = Array.from(
    rows.reduce<Set<string>>((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  const escapeValue = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(delimiter) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeValue).join(delimiter);
  const dataLines = rows.map((row) => headers.map((h) => escapeValue(row[h])).join(delimiter));

  return [headerLine, ...dataLines].join("\n");
}

/**
 * Trigger a file download in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Export data as CSV
 */
export function exportCSV(rows: ExportableRow[], filename: string) {
  const csv = toCSV(rows);
  // Add BOM for Excel UTF-8 compatibility
  const csvWithBom = "\uFEFF" + csv;
  downloadFile(
    csvWithBom,
    filename.endsWith(".csv") ? filename : `${filename}.csv`,
    "text/csv;charset=utf-8"
  );
}

/**
 * Export data as JSON
 */
export function exportJSON(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(
    json,
    filename.endsWith(".json") ? filename : `${filename}.json`,
    "application/json"
  );
}

/**
 * Flatten time series data for CSV export
 */
export function flattenTimeSeries(
  data: { name: string; [seriesName: string]: string | number }[]
): ExportableRow[] {
  return data.map((point) => ({ ...point }));
}
