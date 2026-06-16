"use client";

import { useGraphinyaStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Sparkles,
  Wifi,
  LayoutDashboard,
  Database,
  Plug,
  Blocks,
  Search,
  ChevronRight,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    title: "Дашборды",
    desc: "Визуализация данных в реальном времени с виджетами и переменными",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: "Исследование",
    desc: "Выполнение произвольных запросов к источникам данных",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "8 типов источников",
    desc: "Prometheus, PostgreSQL, ClickHouse, Elasticsearch и другие",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: <Plug className="h-5 w-5" />,
    title: "Плагины",
    desc: "Расширяемая архитектура с контрактом для новых источников",
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: <Blocks className="h-5 w-5" />,
    title: "Модули",
    desc: "Кастомные виджеты и настройки через Module Federation",
    color: "text-cyan-500 bg-cyan-500/10",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "JWT + Refresh",
    desc: "Безопасная аутентификация с автоматическим обновлением токенов",
    color: "text-red-500 bg-red-500/10",
  },
];

const STATS = [
  { icon: <BarChart3 className="h-4 w-4 text-amber-500" />, label: "5 дашбордов", sub: "в демо-режиме" },
  { icon: <Database className="h-4 w-4 text-emerald-500" />, label: "6 источников", sub: "данных" },
  { icon: <Plug className="h-4 w-4 text-violet-500" />, label: "8 плагинов", sub: "подключено" },
  { icon: <Clock className="h-4 w-4 text-blue-500" />, label: "15с — 2мин", sub: "интервал обновления" },
];

export function WelcomeScreen() {
  const { enableDemoMode, setConnectionStatus } = useGraphinyaStore();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Activity className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Графиня
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-lg mx-auto">
              Система визуализации и мониторинга данных от{" "}
              <span className="text-foreground font-medium">Лаборатории Числитель</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 text-base"
            onClick={() => {
              // Open connection dialog
              document.querySelector<HTMLElement>('[data-connection-trigger]')?.click();
            }}
          >
            <Wifi className="h-5 w-5 mr-2" />
            Подключиться к серверу
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base border-violet-500/30 text-violet-600 hover:bg-violet-500/5"
            onClick={enableDemoMode}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Демо-режим
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((stat) => (
            <Card key={stat.label} className="bg-muted/30 border-border/50">
              <CardContent className="p-3 flex items-center gap-3">
                {stat.icon}
                <div>
                  <p className="text-sm font-semibold">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default border-border/50"
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-xl ${feature.color} shrink-0`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick start hint */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Нажмите <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono border">Alt+D</kbd> для
            быстрого перехода в демо-режим или{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono border">?</kbd> для горячих клавиш
          </p>
        </div>
      </div>
    </div>
  );
}
