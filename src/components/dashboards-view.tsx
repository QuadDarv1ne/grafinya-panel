"use client";

import { useEffect, useState, useCallback } from "react";
import { useGraphinyaStore } from "@/lib/store";
import { useGraphinyaApi } from "@/hooks/use-grafinya-api";
import type { Dashboard } from "@/lib/grafinya-api";
import { DEMO_DASHBOARDS } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Plus,
  Star,
  Search,
  Loader2,
  Trash2,
  ExternalLink,
  Calendar,
  Tag,
  Sparkles,
  Clock,
  Copy,
  Download,
  Upload,
  LayoutTemplate,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardTemplates } from "@/components/dashboard-templates";
import {
  BulkActionsBar,
  SelectionModeButton,
} from "@/components/bulk-actions";

export function DashboardsView() {
  const {
    dashboards,
    setDashboards,
    setSelectedDashboardId,
    setCurrentView,
    connectionStatus,
    isLoading,
    setIsLoading,
    isDemoMode,
    toggleDashboardFavorite,
    addWidgetToDashboard,
  } = useGraphinyaStore();
  const { call } = useGraphinyaApi();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isConnected = connectionStatus === "connected" || connectionStatus === "demo";

  const fetchDashboards = useCallback(async () => {
    if (connectionStatus === "demo") {
      setDashboards(DEMO_DASHBOARDS);
      return;
    }
    if (connectionStatus !== "connected") return;
    setIsLoading(true);
    try {
      const data = await call<Dashboard[]>({ path: "/dashboards" });
      setDashboards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch dashboards:", err);
      setDashboards([]);
    } finally {
      setIsLoading(false);
    }
  }, [connectionStatus, call, setDashboards, setIsLoading]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const tags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (isDemoMode) {
      const newDashboard: Dashboard = {
        _id: `dash-${Date.now()}`,
        title: newTitle,
        description: newDesc || undefined,
        tags: tags.length > 0 ? tags : undefined,
        isFavorite: false,
        createdBy: "demo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        widgets: [],
        variables: [],
        refreshTime: 30000,
      };
      setDashboards([...dashboards, newDashboard]);
      toast({ title: "Дашборд создан", description: newTitle });
    } else {
      try {
        await call({
          path: "/dashboards",
          method: "POST",
          body: { title: newTitle, description: newDesc, tags },
        });
        toast({ title: "Дашборд создан", description: newTitle });
        fetchDashboards();
      } catch (err) {
        toast({ title: "Ошибка", description: "Не удалось создать дашборд", variant: "destructive" });
      }
    }
    setShowCreate(false);
    setNewTitle("");
    setNewDesc("");
    setNewTags("");
  };

  const handleDelete = async (id: string) => {
    if (isDemoMode) {
      setDashboards(dashboards.filter((d) => d._id !== id));
      toast({ title: "Дашборд удалён" });
      return;
    }
    try {
      await call({ path: `/dashboards/${id}`, method: "DELETE" });
      toast({ title: "Дашборд удалён" });
      fetchDashboards();
    } catch (err) {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const handleDuplicate = (dashboard: Dashboard) => {
    if (isDemoMode) {
      const dup: Dashboard = {
        ...dashboard,
        _id: `dash-${Date.now()}`,
        title: `${dashboard.title} (копия)`,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDashboards([...dashboards, dup]);
      toast({ title: "Дашборд дублирован", description: dup.title });
    }
  };

  const handleExport = (dashboard: Dashboard) => {
    const json = JSON.stringify(dashboard, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashboard.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Дашборд экспортирован", description: dashboard.title });
  };

  const handleOpen = (id: string) => {
    setSelectedDashboardId(id);
    setCurrentView("dashboard-detail");
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleDashboardFavorite(id);
    const dashboard = dashboards.find((d) => d._id === id);
    toast({
      title: dashboard?.isFavorite ? "Убрано из избранного" : "Добавлено в избранное",
      description: dashboard?.title,
    });
  };

  const filtered = dashboards.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase()) ||
      d.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const favorites = filtered.filter((d) => d.isFavorite);
  const regular = filtered.filter((d) => !d.isFavorite);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.length > 0 && ids.every((id) => prev.has(id));
      if (allSelected) {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      }
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Дашборды</h2>
          <p className="text-muted-foreground">
            {isConnected
              ? `${dashboards.length} дашборд${dashboards.length === 1 ? "" : dashboards.length < 5 ? "а" : "ов"}`
              : "Визуализация данных в реальном времени"
            }
          </p>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            <SelectionModeButton
              active={selectionMode}
              onClick={() => {
                setSelectionMode(!selectionMode);
                if (selectionMode) setSelectedIds(new Set());
              }}
              count={selectedIds.size}
            />
            <Button
              variant="outline"
              onClick={() => setShowTemplates(true)}
            >
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Шаблоны
            </Button>
            <Button
              onClick={() => setShowCreate(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Новый дашборд
            </Button>
          </div>
        )}
      </div>

      {/* Disconnected banner */}
      {!isConnected && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
          <LayoutDashboard className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Подключитесь к серверу или включите демо-режим для просмотра дашбордов.
          </p>
        </div>
      )}

      {/* Demo mode badge */}
      {isDemoMode && (
        <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-violet-500 shrink-0" />
          <p className="text-sm text-violet-600 dark:text-violet-400">
            Демо-режим — данные сгенерированы для демонстрации возможностей
          </p>
        </div>
      )}

      {/* Search */}
      {isConnected && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск дашбордов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      )}

      {/* Favorites */}
      {!isLoading && favorites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            Избранные
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((dashboard) => (
              <DashboardCard
                key={dashboard._id}
                dashboard={dashboard}
                onOpen={handleOpen}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onDuplicate={handleDuplicate}
                onExport={handleExport}
                isDemo={isDemoMode}
                selectionMode={selectionMode}
                selected={selectedIds.has(dashboard._id)}
                onToggleSelection={toggleSelection}
              />
            ))}
          </div>
        </div>
      )}

      {/* All dashboards */}
      {!isLoading && regular.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Все дашборды
            </h3>
            {selectionMode && regular.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => toggleAll(regular.map((d) => d._id))}
              >
                {regular.every((d) => selectedIds.has(d._id))
                  ? "Снять выделение"
                  : "Выбрать все"}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regular.map((dashboard) => (
              <DashboardCard
                key={dashboard._id}
                dashboard={dashboard}
                onOpen={handleOpen}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onDuplicate={handleDuplicate}
                onExport={handleExport}
                isDemo={isDemoMode}
                selectionMode={selectionMode}
                selected={selectedIds.has(dashboard._id)}
                onToggleSelection={toggleSelection}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && dashboards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <LayoutDashboard className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">Дашбордов пока нет</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Создайте первый дашборд для начала работы
          </p>
          {isConnected && (
            <Button
              onClick={() => setShowCreate(true)}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Новый дашборд
            </Button>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый дашборд</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Название дашборда"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Input
              placeholder="Описание (необязательно)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <Input
              placeholder="Теги через запятую (необязательно)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newTitle.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <DashboardTemplates open={showTemplates} onOpenChange={setShowTemplates} />

      {/* Bulk actions bar (shown when selection mode is active) */}
      {selectionMode && selectedIds.size > 0 && (
        <BulkActionsBar
          selectedIds={selectedIds}
          dashboards={dashboards}
          onClearSelection={clearSelection}
          onRefresh={fetchDashboards}
        />
      )}
    </div>
  );
}

function DashboardCard({
  dashboard,
  onOpen,
  onDelete,
  onToggleFavorite,
  onDuplicate,
  onExport,
  isDemo,
  selectionMode,
  selected,
  onToggleSelection,
}: {
  dashboard: Dashboard;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDuplicate: (dashboard: Dashboard) => void;
  onExport: (dashboard: Dashboard) => void;
  isDemo?: boolean;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelection?: (id: string) => void;
}) {
  return (
    <Card
      className={`group hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border-border/60 ${
        selected ? "ring-2 ring-amber-500 border-amber-500/30" : ""
      }`}
      onClick={selectionMode && onToggleSelection ? () => onToggleSelection(dashboard._id) : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle
            className="text-base font-semibold line-clamp-1 flex-1 flex items-center gap-2"
            onClick={selectionMode ? undefined : () => onOpen(dashboard._id)}
          >
            {selectionMode && (
              <Checkbox
                checked={selected}
                onCheckedChange={() => onToggleSelection?.(dashboard._id)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {dashboard.title}
          </CardTitle>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => onToggleFavorite(dashboard._id, e)}
            >
              <Star
                className={`h-3.5 w-3.5 ${
                  dashboard.isFavorite
                    ? "text-amber-500 fill-amber-500"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onOpen(dashboard._id)}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onExport(dashboard)}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(dashboard._id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={() => onOpen(dashboard._id)}>
        {dashboard.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {dashboard.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(dashboard.updatedAt).toLocaleDateString("ru-RU")}
          </span>
          {dashboard.widgets && dashboard.widgets.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {dashboard.widgets.length} виджет{dashboard.widgets.length === 1 ? "" : dashboard.widgets.length < 5 ? "а" : "ов"}
            </Badge>
          )}
          {dashboard.refreshTime && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-2.5 w-2.5 mr-1" />
              {(dashboard.refreshTime / 1000).toFixed(0)}с
            </Badge>
          )}
          {dashboard.tags && dashboard.tags.length > 0 && (
            <div className="flex gap-1">
              {dashboard.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-2.5 w-2.5 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
