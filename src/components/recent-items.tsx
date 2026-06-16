"use client";

import { useGraphinyaStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  LayoutDashboard,
  Database,
  Trash2,
  X,
} from "lucide-react";

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "сейчас";
  if (minutes < 60) return `${minutes}м`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}ч`;
  const days = Math.floor(hours / 24);
  return `${days}д`;
}

export function RecentItemsList({ compact = false }: { compact?: boolean }) {
  const { recentItems, clearRecentItems, setSelectedDashboardId, setCurrentView } = useGraphinyaStore();

  if (recentItems.length === 0) {
    if (compact) return null;
    return (
      <div className="px-3 py-2 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          Недавних элементов нет
        </p>
      </div>
    );
  }

  const handleOpen = (item: typeof recentItems[number]) => {
    if (item.type === "dashboard") {
      setSelectedDashboardId(item.id);
      setCurrentView("dashboard-detail");
    } else if (item.type === "datasource") {
      setCurrentView("datasources");
    }
  };

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          Недавние
        </span>
        <button
          onClick={clearRecentItems}
          className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
          title="Очистить недавние"
        >
          <Trash2 className="h-2.5 w-2.5" />
        </button>
      </div>
      <div className="space-y-0.5">
        {recentItems.slice(0, 5).map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            onClick={() => handleOpen(item)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-muted transition-colors group text-left"
          >
            {item.type === "dashboard" ? (
              <LayoutDashboard className="h-3 w-3 text-amber-500 shrink-0" />
            ) : (
              <Database className="h-3 w-3 text-blue-500 shrink-0" />
            )}
            <span className="flex-1 truncate text-muted-foreground group-hover:text-foreground transition-colors">
              {item.title}
            </span>
            <span className="text-[9px] text-muted-foreground/70 shrink-0">
              {formatRelativeTime(item.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
