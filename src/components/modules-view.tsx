"use client";

import { useEffect, useState, useCallback } from "react";
import { useGraphinyaStore } from "@/lib/store";
import { useGraphinyaApi } from "@/hooks/use-grafinya-api";
import type { Module } from "@/lib/grafinya-api";
import { DEMO_MODULES } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Blocks,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Settings2,
  LayoutGrid,
} from "lucide-react";

export function ModulesView() {
  const { modules, setModules, connectionStatus, isLoading, setIsLoading } =
    useGraphinyaStore();
  const { call } = useGraphinyaApi();

  const fetchModules = useCallback(async () => {
    if (connectionStatus === "demo") {
      setModules(DEMO_MODULES);
      return;
    }
    if (connectionStatus !== "connected") return;
    setIsLoading(true);
    try {
      const data = await call<Module[]>({ path: "/modules" });
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  }, [connectionStatus, call, setModules, setIsLoading]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const isConnected = connectionStatus === "connected" || connectionStatus === "demo";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Модули</h2>
        <p className="text-muted-foreground">
          {isConnected
            ? `${modules.length} модул${modules.length === 1 ? "ь" : modules.length < 5 ? "я" : "ей"} подключено`
            : "Расширения платформы с кастомными виджетами"
          }
        </p>
      </div>

      {/* Disconnected banner */}
      {!isConnected && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
          <Blocks className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Подключитесь к серверу Графини для просмотра установленных модулей.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {/* Modules grid */}
      {!isLoading && modules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <Card key={mod.id} className="hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-500/10">
                      <Blocks className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {mod.title?.find((t) => t.lang === "ru-RU")?.value ||
                          mod.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          v{mod.version}
                        </Badge>
                        {mod.isActive ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span className="text-xs text-emerald-500">Активен</span>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Неактивен
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {mod.canAddToDashboard && (
                    <Badge className="bg-amber-500/10 text-amber-600 text-xs">
                      <LayoutGrid className="h-3 w-3 mr-1" />
                      Дашборд
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mod.description && (
                  <p className="text-sm text-muted-foreground">
                    {mod.description.find((d) => d.lang === "ru-RU")?.value || ""}
                  </p>
                )}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Компоненты</span>
                    <div className="flex gap-1">
                      {mod.components.map((c) => (
                        <Badge key={c} variant="secondary" className="text-[10px]">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scope</span>
                    <span className="font-mono">{mod.scope}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backend</span>
                    <span className="font-mono truncate ml-2 max-w-[60%]">
                      {mod.baseUrl}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frontend</span>
                    <span className="font-mono truncate ml-2 max-w-[60%]">
                      {mod.frontendHost}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && modules.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Blocks className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">Модули не найдены</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Подключите модули через настройки Графини
          </p>
        </div>
      )}

      {/* Module development info */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Разработка модулей
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Модули — это расширения платформы Графиня с собственным frontend и backend.
            Они позволяют добавлять кастомные виджеты на дашборды.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-foreground">Widget</p>
              <p className="text-xs mt-1">Отображение виджета на дашборде (обязательный)</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-foreground">WidgetEditor</p>
              <p className="text-xs mt-1">Редактор настроек виджета (опциональный)</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-foreground">Settings</p>
              <p className="text-xs mt-1">Настройки модуля (опциональный)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
