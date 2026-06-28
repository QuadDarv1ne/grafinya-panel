"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { useGraphinyaStore } from "@/lib/store";
import type { AppView } from "@/lib/store";
import { useTranslation } from "@/hooks/use-translation";
import { DashboardsView } from "@/components/dashboards-view";
import { DashboardDetailView } from "@/components/dashboard-detail-view";
import { DataSourcesView } from "@/components/datasources-view";
import { PluginsView } from "@/components/plugins-view";
import { ModulesView } from "@/components/modules-view";
import { SettingsView } from "@/components/settings-view";
import { WelcomeScreen } from "@/components/welcome-screen";
import { CommandPalette } from "@/components/command-palette";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { HelpDialog } from "@/components/help-dialog";
import { ErrorBoundary } from "@/components/error-boundary";
import { OnboardingTour } from "@/components/onboarding-tour";
import { Header } from "@/components/app-header";
import { AppSidebar, MobileSidebar } from "@/components/app-sidebar";
import { ShortcutsDialog } from "@/components/shortcuts-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const ExplorerView = lazy(() => import("@/components/explorer-view").then(m => ({ default: m.ExplorerView })));
const ConstructorView = lazy(() => import("@/components/constructor-view").then(m => ({ default: m.ConstructorView })));
const ActivityLog = lazy(() => import("@/components/activity-log").then(m => ({ default: m.ActivityLog })));

function ViewSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { currentView, connectionStatus, selectedDashboardId, dashboards } = useGraphinyaStore();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const isConnected = connectionStatus === "connected" || connectionStatus === "demo";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const NAV_IDS: AppView[] = ["dashboards", "explorer", "datasources", "plugins", "modules", "constructor", "activity", "settings"];

      if (e.altKey && e.key >= "1" && e.key <= "8") {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (NAV_IDS[idx]) {
          useGraphinyaStore.getState().setCurrentView(NAV_IDS[idx]);
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
    if (!isConnected && currentView === "dashboards") {
      return <WelcomeScreen />;
    }

    switch (currentView) {
      case "dashboards":
        return <DashboardsView />;
      case "dashboard-detail":
        return <DashboardDetailView />;
      case "explorer":
        return <Suspense fallback={<ViewSkeleton />}><ExplorerView /></Suspense>;
      case "datasources":
        return <DataSourcesView />;
      case "plugins":
        return <PluginsView />;
      case "modules":
        return <ModulesView />;
      case "settings":
        return <SettingsView />;
      case "constructor":
        return <Suspense fallback={<ViewSkeleton />}><ConstructorView /></Suspense>;
      case "activity":
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t("views.activity")}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t("views.activityDesc")}</p>
              </div>
              <ActivityLog showFilters />
            </div>
          </Suspense>
        );
      default:
        return <DashboardsView />;
    }
  };

  const getBreadcrumbs = () => {
    const crumbs: { label: string; view: AppView }[] = [];
    if (currentView === "dashboard-detail") {
      crumbs.push({ label: t("nav.dashboards"), view: "dashboards" });
      const dashboard = dashboards.find((d) => d._id === selectedDashboardId);
      crumbs.push({ label: dashboard?.title || t("views.dashboardDetail"), view: "dashboard-detail" });
    }
    return crumbs;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        showShortcuts={showShortcuts}
        setShowShortcuts={setShowShortcuts}
        breadcrumbs={getBreadcrumbs()}
      />

      <div className="flex flex-1">
        <AppSidebar showShortcuts={showShortcuts} setShowShortcuts={setShowShortcuts} />
        <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <ErrorBoundary key={currentView}>{renderView()}</ErrorBoundary>
          </div>
        </main>
      </div>

      <ShortcutsDialog open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <CommandPalette />
      <NotificationsDropdown />
      <HelpDialog />
      <OnboardingTour />
    </div>
  );
}
