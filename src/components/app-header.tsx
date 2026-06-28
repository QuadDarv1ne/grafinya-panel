"use client";

import { useGraphinyaStore } from "@/lib/store";
import type { AppView } from "@/lib/store";
import { useTranslation } from "@/hooks/use-translation";
import { ConnectionSetup } from "@/components/connection-setup";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  Search,
  Moon,
  Sun,
  Sparkles,
  LogOut,
  Zap,
  ChevronRight,
  Keyboard,
  Command as CommandIcon,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

export function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
  showShortcuts,
  setShowShortcuts,
  breadcrumbs,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (v: boolean) => void;
  breadcrumbs: { label: string; view: AppView }[];
}) {
  const { connectionStatus, isDemoMode, currentView } = useGraphinyaStore();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isConnected = connectionStatus === "connected" || connectionStatus === "demo";

  const connectionLabel =
    connectionStatus === "connected" ? t("common.connected") :
    connectionStatus === "demo" ? t("common.demoMode") :
    connectionStatus === "connecting" ? t("common.connecting") :
    connectionStatus === "error" ? t("common.error") :
    t("common.disconnected");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <button
            onClick={() => useGraphinyaStore.getState().setCurrentView("dashboards")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm shadow-amber-500/20">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold leading-none">{t("common.appName")}</h1>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{t("common.subtitle")}</p>
            </div>
          </button>

          {breadcrumbs.length > 0 && (
            <div className="hidden md:flex items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <button
                    onClick={() => {
                      if (crumb.view !== currentView) useGraphinyaStore.getState().setCurrentView(crumb.view);
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
          {isDemoMode && (
            <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs border-violet-500/20 hidden sm:flex">
              <Sparkles className="h-3 w-3 mr-1" />
              {t("common.demo")}
            </Badge>
          )}

          {isConnected && !isDemoMode && (
            <Badge variant="outline" className="hidden sm:flex text-xs border-emerald-500/30 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              {t("common.online")}
            </Badge>
          )}

          <LanguageSwitcher />

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 hidden md:flex text-muted-foreground"
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: navigator.platform.includes("Mac") });
              window.dispatchEvent(event);
            }}
            title={t("common.commandPalette")}
          >
            <CommandIcon className="h-4 w-4" />
            <span className="text-xs">{t("common.search")}</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border">⌘K</kbd>
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex" onClick={() => setShowShortcuts(!showShortcuts)} title={t("common.keyboardHint")}>
            <Keyboard className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

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
                {connectionStatus === "connected" ? <Zap className="h-4 w-4" /> : connectionStatus === "demo" ? <Sparkles className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                <span className="hidden sm:inline">{connectionLabel}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => useGraphinyaStore.getState().enableDemoMode()}>
                <Sparkles className="h-4 w-4 mr-2 text-violet-500" />
                {t("common.enableDemo")}
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
                    {t("common.logout")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
