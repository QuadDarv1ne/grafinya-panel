"use client";

import { useGraphinyaStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Trash2,
  Navigation,
  LayoutDashboard,
  Database,
  Plug,
  Blocks,
  Shield,
  Server,
  Filter,
} from "lucide-react";
import { useState, useMemo } from "react";

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  navigation: {
    icon: <Navigation className="h-3.5 w-3.5" />,
    color: "text-blue-500",
    label: "Навигация",
  },
  dashboard: {
    icon: <LayoutDashboard className="h-3.5 w-3.5" />,
    color: "text-amber-500",
    label: "Дашборд",
  },
  datasource: {
    icon: <Database className="h-3.5 w-3.5" />,
    color: "text-emerald-500",
    label: "Источник",
  },
  plugin: { icon: <Plug className="h-3.5 w-3.5" />, color: "text-purple-500", label: "Плагин" },
  module: { icon: <Blocks className="h-3.5 w-3.5" />, color: "text-cyan-500", label: "Модуль" },
  auth: { icon: <Shield className="h-3.5 w-3.5" />, color: "text-red-500", label: "Авторизация" },
  system: {
    icon: <Server className="h-3.5 w-3.5" />,
    color: "text-muted-foreground",
    label: "Система",
  },
};

function formatTime(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(ts: number): string {
  const date = new Date(ts);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Сегодня";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Вчера";
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export function ActivityLog({
  limit,
  showFilters = false,
}: {
  limit?: number;
  showFilters?: boolean;
}) {
  const { activityLog, clearActivityLog } = useGraphinyaStore();
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = filter ? activityLog.filter((e) => e.category === filter) : activityLog;
    return limit ? list.slice(0, limit) : list;
  }, [activityLog, filter, limit]);

  // Group entries by date
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((entry) => {
      const key = formatDate(entry.timestamp);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(entry);
    });
    return Array.from(map.entries());
  }, [filtered]);

  if (activityLog.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-amber-500" />
            Журнал активности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="text-muted-foreground/30 mb-3 h-10 w-10" />
            <p className="text-muted-foreground text-sm">Журнал пуст</p>
            <p className="text-muted-foreground/70 mt-1 text-xs">
              Ваши действия будут отображаться здесь
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-amber-500" />
            Журнал активности
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {filtered.length}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive h-7 text-xs"
            onClick={clearActivityLog}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Очистить
          </Button>
        </div>
        {showFilters && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <Filter className="text-muted-foreground h-3 w-3" />
            <Button
              variant={filter === null ? "secondary" : "ghost"}
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => setFilter(null)}
            >
              Все
            </Button>
            {Object.entries(categoryConfig).map(([key, cfg]) => {
              const count = activityLog.filter((e) => e.category === key).length;
              if (count === 0) return null;
              return (
                <Button
                  key={key}
                  variant={filter === key ? "secondary" : "ghost"}
                  size="sm"
                  className="h-6 px-2 text-[10px]"
                  onClick={() => setFilter(filter === key ? null : key)}
                >
                  <span className={cfg.color}>{cfg.icon}</span>
                  <span className="ml-1">{cfg.label}</span>
                  <span className="text-muted-foreground ml-1">{count}</span>
                </Button>
              );
            })}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className={limit ? "h-72" : "h-96"}>
          <div className="space-y-4">
            {grouped.map(([dateLabel, entries]) => (
              <div key={dateLabel}>
                <div className="bg-background/80 sticky top-0 z-10 py-1 backdrop-blur">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {dateLabel}
                  </p>
                </div>
                <Separator className="mb-2" />
                <div className="space-y-1">
                  {entries.map((entry) => {
                    const cfg = categoryConfig[entry.category] || categoryConfig.system;
                    return (
                      <div
                        key={entry.id}
                        className="hover:bg-muted/40 flex items-start gap-3 rounded-md p-2 transition-colors"
                      >
                        <div className={`mt-0.5 ${cfg.color}`}>{cfg.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-foreground truncate text-sm font-medium">
                              {entry.action}
                            </p>
                            <span className="text-muted-foreground shrink-0 font-mono text-[10px]">
                              {formatTime(entry.timestamp)}
                            </span>
                          </div>
                          {entry.details && (
                            <p className="text-muted-foreground mt-0.5 truncate text-xs">
                              {entry.details}
                            </p>
                          )}
                          {entry.targetType && (
                            <Badge variant="outline" className="mt-1 h-4 px-1 text-[9px]">
                              {entry.targetType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
