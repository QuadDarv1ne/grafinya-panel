"use client";

import { useState, useEffect } from "react";
import { useGraphinyaStore } from "@/lib/store";
import type { AppView } from "@/lib/store";
import { ConnectionSetup } from "@/components/connection-setup";
import { DashboardsView } from "@/components/dashboards-view";
import { DashboardDetailView } from "@/components/dashboard-detail-view";
import { DataSourcesView } from "@/components/datasources-view";
import { PluginsView } from "@/components/plugins-view";
import { ModulesView } from "@/components/modules-view";
import { SettingsView } from "@/components/settings-view";
import { ExplorerView } from "@/components/explorer-view";
import { ConstructorView } from "@/components/constructor-view";
import { WelcomeScreen } from "@/components/welcome-screen";
import { CommandPalette } from "@/components/command-palette";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { HelpDialog } from "@/components/help-dialog";
import { ErrorBoundary } from "@/components/error-boundary";
import { RecentItemsList } from "@/components/recent-items";
import { ActivityLog } from "@/components/activity-log";
import { OnboardingTour } from "@/components/onboarding-tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Database,
  Plug,
  Blocks,
  Settings,
  Menu,
  X,
  Activity,
  Search,
  Moon,
  Sun,
  Sparkles,
  LogOut,
  Zap,
  ChevronRight,
  Keyboard,
  Container,
  Command as CommandIcon,
  History,
} from "lucide-react";
import { useTheme } from "next-themes";

const NAV_ITEMS: { id: AppView; label: string; icon: React.ReactNode; shortcut?: string }[] = [
  { id: "dashboards", label: "Дашборды", icon: <LayoutDashboard className="h-4 w-4" />, shortcut: "1" },
  { id: "explorer", label: "Исследование", icon: <Search className="h-4 w-4" />, shortcut: "2" },
  { id: "datasources", label: "Источники данных", icon: <Database className="h-4 w-4" />, shortcut: "3" },
  { id: "plugins", label: "Плагины", icon: <Plug className="h-4 w-4" />, shortcut: "4" },
  { id: "modules", label: "Модули", icon: <Blocks className="h-4 w-4" />, shortcut: "5" },
  { id: "constructor", label: "Конструктор", icon: <Container className="h-4 w-4" />, shortcut: "7" },
  { id: "activity", label: "Активность", icon: <History className="h-4 w-4" />, shortcut: "8" },
  { id: "settings", label: "Настройки", icon: <Settings className="h-4 w-4" />, shortcut: "6" },
];

const VIEW_TITLES: Record<AppView, string> = {
  dashboards: "Дашборды",
  "dashboard-detail": "Дашборд",
  explorer: "Исследование данных",
  datasources: "Источники данных",
  plugins: "Плагины",
  modules: "Модули",
  settings: "Настройки",
  constructor: "Конструктор",
  activity: "Журнал активности",
};

export default function Home() {
  const { currentView, connectionStatus, isDemoMode, selectedDashboardId, dashboards } = useGraphinyaStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { theme, setTheme } = useTheme();

  const isConnected = connectionStatus === "connected" || connectionStatus === "demo";

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.altKey && e.key >= "1" && e.key <= "8") {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (NAV_ITEMS[idx]) {
          useGraphinyaStore.getState().setCurrentView(NAV_ITEMS[idx].id);
        }
      }
      if (e.altKey && e.key === "d") {
        e.preventDefault();
        useGraphinyaStore.getState().enableDemoMode();
      }
      if (e.key === "?" && !e.altKey && !e.ctrlKey && !e.metaKey) {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          setShowShortcuts((prev) => !prev);
        }
      }
      if (e.key === "Escape") {
        setShowShortcuts(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderView = () => {
    // Show welcome screen when disconnected and on dashboards
    if (!isConnected && currentView === "dashboards") {
      return <WelcomeScreen />;
    }

    switch (currentView) {
      case "dashboards":
        return <DashboardsView />;
      case "dashboard-detail":
        return <DashboardDetailView />;
      case "explorer":
        return <ExplorerView />;
      case "datasources":
        return <DataSourcesView />;
      case "plugins":
        return <PluginsView />;
      case "modules":
        return <ModulesView />;
      case "settings":
        return <SettingsView />;
      case "constructor":
        return <ConstructorView />;
      case "activity":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Журнал активности</h1>
              <p className="text-sm text-muted-foreground mt-1">
                История ваших действий в системе. Записи сохраняются локально и не передаются на сервер.
              </p>
            </div>
            <ActivityLog showFilters />
          </div>
        );
      default:
        return <DashboardsView />;
    }
  };

  const renderViewWithBoundary = () => (
    <ErrorBoundary key={currentView}>{renderView()}</ErrorBoundary>
  );

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs: { label: string; view: AppView }[] = [];
    if (currentView === "dashboard-detail") {
      crumbs.push({ label: "Дашборды", view: "dashboards" });
      const dashboard = dashboards.find((d) => d._id === selectedDashboardId);
      crumbs.push({ label: dashboard?.title || "Дашборд", view: "dashboard-detail" });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Logo */}
            <button
              onClick={() => useGraphinyaStore.getState().setCurrentView("dashboards")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm shadow-amber-500/20">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold leading-none">Графиня</h1>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  Панель управления
                </p>
              </div>
            </button>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <div className="hidden md:flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    <button
                      onClick={() => {
                        if (crumb.view !== currentView) {
                          useGraphinyaStore.getState().setCurrentView(crumb.view);
                        }
                      }}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        idx === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""
                      }`}
                    >
                      {crumb.label}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Demo mode indicator */}
            {isDemoMode && (
              <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs border-violet-500/20 hidden sm:flex">
                <Sparkles className="h-3 w-3 mr-1" />
                Демо
              </Badge>
            )}

            {/* Online indicator */}
            {isConnected && !isDemoMode && (
              <Badge variant="outline" className="hidden sm:flex text-xs border-emerald-500/30 text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Онлайн
              </Badge>
            )}

            {/* Command palette trigger */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 hidden md:flex text-muted-foreground"
              onClick={() => {
                // Trigger Cmd+K via simulated event
                const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: navigator.platform.includes("Mac") });
                window.dispatchEvent(event);
              }}
              title="Командная палитра (Ctrl+K)"
            >
              <CommandIcon className="h-4 w-4" />
              <span className="text-xs">Поиск</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border">⌘K</kbd>
            </Button>

            {/* Keyboard shortcuts hint */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden md:flex"
              onClick={() => setShowShortcuts(!showShortcuts)}
              title="Горячие клавиши (?)"
            >
              <Keyboard className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Help dialog */}
            <HelpDialog />

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Connection / User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    connectionStatus === "connected"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                      : connectionStatus === "demo"
                      ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20"
                      : connectionStatus === "connecting"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : connectionStatus === "error"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {connectionStatus === "connected" ? (
                    <Zap className="h-4 w-4" />
                  ) : connectionStatus === "demo" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {connectionStatus === "connected"
                      ? "Подключено"
                      : connectionStatus === "demo"
                      ? "Демо-режим"
                      : connectionStatus === "connecting"
                      ? "Подключение..."
                      : connectionStatus === "error"
                      ? "Ошибка"
                      : "Не подключено"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => useGraphinyaStore.getState().enableDemoMode()}>
                  <Sparkles className="h-4 w-4 mr-2 text-violet-500" />
                  Включить демо-режим
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <span className="cursor-pointer" data-connection-trigger>
                    <ConnectionSetup />
                  </span>
                </DropdownMenuItem>
                {isConnected && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => useGraphinyaStore.getState().logout()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Отключиться
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col border-r bg-muted/30 w-56 shrink-0">
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {NAV_ITEMS.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => useGraphinyaStore.getState().setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group ${
                      isActive
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.shortcut && (
                      <span className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? "text-amber-500/60" : "text-muted-foreground/60"
                      }`}>
                        Alt+{item.shortcut}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Recent items section */}
            <div className="mt-4 border-t pt-2">
              <RecentItemsList />
            </div>
          </ScrollArea>

          {/* Sidebar footer */}
          <div className="p-3 border-t">
            <div className="p-3 rounded-lg bg-background/50 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Activity className="h-3.5 w-3.5 text-amber-500" />
                Графиня 2026H1
              </div>
              <p className="text-muted-foreground">
                Система визуализации данных
              </p>
              <p className="text-muted-foreground">
                Лаборатория Числитель
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setShowShortcuts(true)}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Keyboard className="h-2.5 w-2.5" />
                  Горячие клавиши
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r shadow-xl">
              <div className="flex items-center justify-between h-14 px-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <Activity className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold">Графиня</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-1 p-3">
                {NAV_ITEMS.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        useGraphinyaStore.getState().setCurrentView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-amber-500/10 text-amber-600"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
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
                    setMobileMenuOpen(false);
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-2 text-violet-500" />
                  Демо-режим
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {renderViewWithBoundary()}
          </div>
        </main>
      </div>

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-background rounded-2xl shadow-2xl border p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-amber-500" />
                Горячие клавиши
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowShortcuts(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { keys: "Ctrl + K", desc: "Командная палитра" },
                { keys: "Alt + 1-8", desc: "Переключение видов" },
                { keys: "Alt + D", desc: "Демо-режим" },
                { keys: "?", desc: "Показать горячие клавиши" },
                { keys: "Esc", desc: "Закрыть диалог" },
                { keys: "Ctrl + Enter", desc: "Выполнить запрос (в Explorer)" },
              ].map((shortcut) => (
                <div key={shortcut.keys} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{shortcut.desc}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.split(" + ").map((key, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
                        <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono border">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette />

      {/* Onboarding tour for first-time users */}
      <OnboardingTour />
    </div>
  );
}
