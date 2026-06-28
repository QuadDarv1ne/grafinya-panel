"use client";

import { useGraphinyaStore } from "@/lib/store";
import type { AppView } from "@/lib/store";
import { useTranslation } from "@/hooks/use-translation";
import { RecentItemsList } from "@/components/recent-items";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Database,
  Plug,
  Blocks,
  Settings,
  Activity,
  Search,
  Keyboard,
  Container,
  History,
  X,
  Sparkles,
} from "lucide-react";

const NAV_ICONS: Record<AppView, React.ReactNode> = {
  dashboards: <LayoutDashboard className="h-4 w-4" />,
  explorer: <Search className="h-4 w-4" />,
  datasources: <Database className="h-4 w-4" />,
  plugins: <Plug className="h-4 w-4" />,
  modules: <Blocks className="h-4 w-4" />,
  constructor: <Container className="h-4 w-4" />,
  activity: <History className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  "dashboard-detail": <LayoutDashboard className="h-4 w-4" />,
};

const NAV_SHORTCUTS: Partial<Record<AppView, string>> = {
  dashboards: "1",
  explorer: "2",
  datasources: "3",
  plugins: "4",
  modules: "5",
  settings: "6",
  constructor: "7",
  activity: "8",
};

const NAV_ORDER: AppView[] = ["dashboards", "explorer", "datasources", "plugins", "modules", "constructor", "activity", "settings"];

export function AppSidebar({
  showShortcuts,
  setShowShortcuts,
}: {
  showShortcuts: boolean;
  setShowShortcuts: (v: boolean) => void;
}) {
  const { currentView } = useGraphinyaStore();
  const { t } = useTranslation();

  const navLabels: Record<AppView, string> = {
    dashboards: t("nav.dashboards"),
    explorer: t("nav.explorer"),
    datasources: t("nav.datasources"),
    plugins: t("nav.plugins"),
    modules: t("nav.modules"),
    constructor: t("nav.constructor"),
    activity: t("nav.activity"),
    settings: t("nav.settings"),
    "dashboard-detail": t("views.dashboardDetail"),
  };

  return (
    <aside className="hidden md:flex flex-col border-r bg-muted/30 w-56 shrink-0">
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {NAV_ORDER.map((id) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                onClick={() => useGraphinyaStore.getState().setCurrentView(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group ${
                  isActive
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {NAV_ICONS[id]}
                <span className="flex-1 text-left">{navLabels[id]}</span>
                {NAV_SHORTCUTS[id] && (
                  <span className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive ? "text-amber-500/60" : "text-muted-foreground/60"
                  }`}>
                    Alt+{NAV_SHORTCUTS[id]}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 border-t pt-2">
          <RecentItemsList />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="p-3 rounded-lg bg-background/50 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Activity className="h-3.5 w-3.5 text-amber-500" />
            {t("sidebar.footerVersion")}
          </div>
          <p className="text-muted-foreground">{t("sidebar.footerDesc")}</p>
          <p className="text-muted-foreground">{t("sidebar.footerLab")}</p>
          <div className="pt-1">
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Keyboard className="h-2.5 w-2.5" />
              {t("common.keyboardHint")}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { currentView } = useGraphinyaStore();
  const { t } = useTranslation();

  const navLabels: Record<AppView, string> = {
    dashboards: t("nav.dashboards"),
    explorer: t("nav.explorer"),
    datasources: t("nav.datasources"),
    plugins: t("nav.plugins"),
    modules: t("nav.modules"),
    constructor: t("nav.constructor"),
    activity: t("nav.activity"),
    settings: t("nav.settings"),
    "dashboard-detail": t("views.dashboardDetail"),
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r shadow-xl">
        <div className="flex items-center justify-between h-14 px-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold">{t("common.appName")}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1 p-3">
          {NAV_ORDER.map((id) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                onClick={() => {
                  useGraphinyaStore.getState().setCurrentView(id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive ? "bg-amber-500/10 text-amber-600" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {NAV_ICONS[id]}
                <span>{navLabels[id]}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t mt-4">
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={() => {
              useGraphinyaStore.getState().enableDemoMode();
              onClose();
            }}
          >
            <Sparkles className="h-3.5 w-3.5 mr-2 text-violet-500" />
            {t("common.demoMode")}
          </Button>
        </div>
      </aside>
    </div>
  );
}
