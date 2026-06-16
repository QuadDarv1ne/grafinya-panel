"use client";

import { useEffect, useState, useCallback } from "react";
import { useGraphinyaStore } from "@/lib/store";
import type { Dashboard, Widget } from "@/lib/grafinya-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  History,
  Undo2,
  Redo2,
  RotateCcw,
  Trash2,
  Clock,
  ChevronRight,
  Save,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * In-memory snapshot of a dashboard at a point in time.
 * Used for undo/redo within the dashboard editor.
 */
export interface DashboardSnapshot {
  id: string;
  dashboardId: string;
  timestamp: number;
  label: string;
  /** Snapshot of widget array at this point */
  widgets: Widget[];
  /** Snapshot of variables */
  variables: Dashboard["variables"];
  /** Snapshot of title (in case user renames) */
  title: string;
  /** Was this snapshot created by user action or auto-saved? */
  source: "user" | "auto";
}

interface DashboardHistoryProps {
  dashboardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore: (snapshot: DashboardSnapshot) => void;
}

const HISTORY_STORAGE_KEY = "graphinya-dashboard-history";
const MAX_SNAPSHOTS = 50;

/**
 * Persisted history store for dashboard edits.
 *
 * Snapshots are kept in localStorage so they survive page reloads.
 * Each dashboard has its own append-only list of snapshots, capped
 * at MAX_SNAPSHOTS to prevent unbounded growth.
 */
export function loadHistoryFromStorage(): Record<string, DashboardSnapshot[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, DashboardSnapshot[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveHistoryToStorage(history: Record<string, DashboardSnapshot[]>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    /* quota exceeded — silently drop */
  }
}

/**
 * Helper: push a new snapshot into the history map for a given dashboard.
 * Returns the updated history map.
 */
export function pushSnapshot(
  history: Record<string, DashboardSnapshot[]>,
  dashboard: Dashboard,
  label: string,
  source: "user" | "auto" = "user"
): Record<string, DashboardSnapshot[]> {
  const snapshot: DashboardSnapshot = {
    id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    dashboardId: dashboard._id,
    timestamp: Date.now(),
    label,
    source,
    widgets: (dashboard.widgets ?? []).map((w) => ({ ...w })),
    variables: (dashboard.variables ?? []).map((v) => ({ ...v })),
    title: dashboard.title,
  };

  const list = history[dashboard._id] ?? [];
  const newList = [snapshot, ...list].slice(0, MAX_SNAPSHOTS);
  return { ...history, [dashboard._id]: newList };
}

/**
 * Dialog showing the version history of a dashboard.
 * Users can preview, restore, or delete snapshots.
 */
export function DashboardHistory({
  dashboardId,
  open,
  onOpenChange,
  onRestore,
}: DashboardHistoryProps) {
  const { dashboards, updateDashboard } = useGraphinyaStore();
  const { toast } = useToast();
  const [history, setHistory] = useState<Record<string, DashboardSnapshot[]>>({});
  const [previewId, setPreviewId] = useState<string | null>(null);

  // Load history from localStorage on mount and when dialog opens
  useEffect(() => {
    if (!open) return;
    // Use a microtask to avoid synchronous setState in effect body
    const id = window.setTimeout(() => {
      setHistory(loadHistoryFromStorage());
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  const dashboard = dashboards.find((d) => d._id === dashboardId);
  const snapshots = history[dashboardId] ?? [];
  const previewSnapshot = snapshots.find((s) => s.id === previewId) ?? null;

  const handleRestore = useCallback(
    (snapshot: DashboardSnapshot) => {
      if (!dashboard) return;
      updateDashboard(dashboardId, {
        widgets: snapshot.widgets.map((w) => ({ ...w })),
        variables: snapshot.variables.map((v) => ({ ...v })),
        title: snapshot.title,
      });
      onRestore(snapshot);
      toast({
        title: "Версия восстановлена",
        description: `Состояние «${snapshot.label}» от ${formatTime(snapshot.timestamp)} применено.`,
      });
      onOpenChange(false);
    },
    [dashboard, dashboardId, updateDashboard, onRestore, onOpenChange, toast]
  );

  const handleDelete = useCallback(
    (snapshotId: string) => {
      setHistory((prev) => {
        const list = prev[dashboardId] ?? [];
        const newList = list.filter((s) => s.id !== snapshotId);
        const updated = { ...prev, [dashboardId]: newList };
        saveHistoryToStorage(updated);
        return updated;
      });
      if (previewId === snapshotId) setPreviewId(null);
    },
    [dashboardId, previewId]
  );

  const handleClearAll = useCallback(() => {
    setHistory((prev) => {
      const updated = { ...prev, [dashboardId]: [] };
      saveHistoryToStorage(updated);
      return updated;
    });
    setPreviewId(null);
    toast({
      title: "История очищена",
      description: "Все снимки состояния для этого дашборда удалены.",
    });
  }, [dashboardId, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-amber-500" />
            История изменений дашборда
          </DialogTitle>
          <DialogDescription>
            Просмотр и восстановление предыдущих версий дашборда «{dashboard?.title}».
            Снимки создаются автоматически при изменении виджетов и переменных.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[50vh]">
          {/* Snapshot list */}
          <div className="border rounded-lg flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">
                Снимки состояния ({snapshots.length})
              </span>
              {snapshots.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                  onClick={handleClearAll}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Очистить
                </Button>
              )}
            </div>
            <ScrollArea className="flex-1">
              {snapshots.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground space-y-2">
                  <History className="h-8 w-8 mx-auto opacity-40" />
                  <p>История пуста</p>
                  <p className="text-xs">
                    Изменения, внесённые в дашборд, будут автоматически сохраняться здесь.
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {snapshots.map((snap, idx) => (
                    <button
                      key={snap.id}
                      onClick={() => setPreviewId(snap.id)}
                      className={`w-full text-left p-2 rounded-md border transition-colors ${
                        previewId === snap.id
                          ? "border-amber-500/40 bg-amber-500/5"
                          : "border-transparent hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {idx === 0 ? (
                              <Badge variant="outline" className="text-[10px] py-0 h-4 border-emerald-500/30 text-emerald-600">
                                Текущая
                              </Badge>
                            ) : null}
                            <span className="text-sm font-medium truncate">
                              {snap.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(snap.timestamp)}
                            <span>·</span>
                            <span>{snap.widgets.length} виджетов</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Preview panel */}
          <div className="border rounded-lg flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">
                Предпросмотр
              </span>
            </div>
            <ScrollArea className="flex-1">
              {previewSnapshot ? (
                <div className="p-3 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Заголовок</p>
                    <p className="text-sm font-medium">{previewSnapshot.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Время создания</p>
                    <p className="text-sm">{formatTime(previewSnapshot.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Описание</p>
                    <p className="text-sm">{previewSnapshot.label}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Виджеты ({previewSnapshot.widgets.length})
                    </p>
                    <div className="space-y-1">
                      {previewSnapshot.widgets.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Нет виджетов</p>
                      ) : (
                        previewSnapshot.widgets.map((w) => (
                          <div
                            key={w.id}
                            className="flex items-center gap-2 text-xs p-1.5 rounded border bg-muted/30"
                          >
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium truncate flex-1">{w.title}</span>
                            <Badge variant="outline" className="text-[10px] py-0 h-4">
                              {w.type}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {previewSnapshot.variables.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Переменные ({previewSnapshot.variables.length})
                      </p>
                      <div className="space-y-1">
                        {previewSnapshot.variables.map((v) => (
                          <div
                            key={v.name}
                            className="flex items-center gap-2 text-xs p-1.5 rounded border bg-muted/30"
                          >
                            <span className="font-mono font-medium">{v.name}</span>
                            <span className="text-muted-foreground">=</span>
                            <span className="truncate">{v.current ?? "(не задано)"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground space-y-2">
                  <Eye className="h-8 w-8 mx-auto opacity-40" />
                  <p>Выберите снимок для предпросмотра</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
          <Button
            disabled={!previewSnapshot}
            onClick={() => previewSnapshot && handleRestore(previewSnapshot)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Восстановить версию
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- Toolbar button (compact trigger) ----
interface HistoryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  count?: number;
}

export function HistoryButton({ onClick, disabled, count }: HistoryButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="gap-1.5"
      title="История изменений"
    >
      <History className="h-4 w-4" />
      История
      {count !== undefined && count > 0 && (
        <Badge variant="secondary" className="ml-1 text-[10px] py-0 h-4 min-w-[16px] justify-center">
          {count}
        </Badge>
      )}
    </Button>
  );
}

// ---- Undo / Redo toolbar (compact) ----
interface UndoRedoToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
}

export function UndoRedoToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
}: UndoRedoToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        className="h-8 w-8"
        title="Отменить (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        className="h-8 w-8"
        title="Повторить (Ctrl+Shift+Z)"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onSave}
        className="h-8 w-8"
        title="Сохранить снимок"
      >
        <Save className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ---- Helpers ----
function formatTime(ts: number): string {
  const date = new Date(ts);
  const now = Date.now();
  const diff = now - ts;

  if (diff < 60_000) return "только что";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} мин назад`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} ч назад`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} дн назад`;

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
