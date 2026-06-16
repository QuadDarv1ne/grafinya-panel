/**
 * Chart color palettes for Graphinya
 *
 * Each palette is a curated set of 10 distinct colors suitable for
 * data visualization. Palettes are designed to be color-blind friendly
 * where possible and to maintain good contrast in both light and dark themes.
 */

export interface ChartPalette {
  id: string;
  name: string;
  description: string;
  colors: string[];
  /** Primary accent color (used for single-series charts, axes highlights) */
  primary: string;
}

export const CHART_PALETTES: ChartPalette[] = [
  {
    id: "amber",
    name: "Янтарь",
    description: "Тёплая янтарная гамма по умолчанию",
    primary: "#f59e0b",
    colors: [
      "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6",
      "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1",
    ],
  },
  {
    id: "ocean",
    name: "Океан",
    description: "Холодные сине-зелёные оттенки",
    primary: "#0ea5e9",
    colors: [
      "#0ea5e9", "#06b6d4", "#14b8a6", "#22c55e", "#84cc16",
      "#eab308", "#f97316", "#ef4444", "#ec4899", "#8b5cf6",
    ],
  },
  {
    id: "sunset",
    name: "Закат",
    description: "Тёплые оранжево-розовые тона",
    primary: "#f97316",
    colors: [
      "#f97316", "#ef4444", "#ec4899", "#d946ef", "#8b5cf6",
      "#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#84cc16",
    ],
  },
  {
    id: "forest",
    name: "Лес",
    description: "Натуральные зелёные и земляные тона",
    primary: "#16a34a",
    colors: [
      "#16a34a", "#65a30d", "#ca8a04", "#d97706", "#b45309",
      "#92400e", "#78350f", "#451a03", "#10b981", "#059669",
    ],
  },
  {
    id: "mono",
    name: "Монохром",
    description: "Оттенки серого для строгих отчётов",
    primary: "#475569",
    colors: [
      "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8",
      "#cbd5e1", "#e2e8f0", "#0f172a", "#64748b", "#94a3b8",
    ],
  },
  {
    id: "vibrant",
    name: "Контраст",
    description: "Яркие насыщенные цвета для демонстраций",
    primary: "#8b5cf6",
    colors: [
      "#8b5cf6", "#ec4899", "#ef4444", "#f97316", "#eab308",
      "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#6366f1",
    ],
  },
  {
    id: "pastel",
    name: "Пастель",
    description: "Мягкие пастельные оттенки",
    primary: "#a78bfa",
    colors: [
      "#a78bfa", "#f9a8d4", "#fca5a5", "#fdba74", "#fde68a",
      "#bef264", "#86efac", "#67e8f9", "#93c5fd", "#c4b5fd",
    ],
  },
  {
    id: "traffic",
    name: "Светофор",
    description: "Цвета статусов: зелёный, жёлтый, красный",
    primary: "#22c55e",
    colors: [
      "#22c55e", "#84cc16", "#eab308", "#f59e0b", "#f97316",
      "#ef4444", "#dc2626", "#991b1b", "#16a34a", "#65a30d",
    ],
  },
];

/** Default palette (kept in sync with the legacy CHART_COLORS constant) */
export const DEFAULT_PALETTE = CHART_PALETTES[0];

/** Storage key for the user-selected palette preference */
export const PALETTE_STORAGE_KEY = "graphinya-chart-palette";

/**
 * Resolve a palette by id with safe fallback to the default palette.
 * Useful when reading from localStorage where the value might be corrupted.
 */
export function getPaletteById(id: string | null | undefined): ChartPalette {
  if (!id) return DEFAULT_PALETTE;
  return CHART_PALETTES.find((p) => p.id === id) ?? DEFAULT_PALETTE;
}

/**
 * Return a color from the palette by index, wrapping around when the
 * index exceeds the palette length. This matches Recharts' behavior
 * of assigning colors by series index.
 */
export function colorAt(palette: ChartPalette, index: number): string {
  if (palette.colors.length === 0) return palette.primary;
  return palette.colors[index % palette.colors.length];
}

/**
 * Build an array of N colors from a palette, suitable for passing
 * directly to Recharts Cell components.
 */
export function colorsFor(palette: ChartPalette, count: number): string[] {
  if (count <= 0) return [];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(colorAt(palette, i));
  }
  return out;
}

/**
 * Read the user's preferred palette id from localStorage.
 * Safe to call on the client only.
 */
export function loadPreferredPaletteId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PALETTE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Persist the user's preferred palette id to localStorage.
 * Safe to call on the client only.
 */
export function savePreferredPaletteId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PALETTE_STORAGE_KEY, id);
  } catch {
    /* ignore quota / privacy mode errors */
  }
}
