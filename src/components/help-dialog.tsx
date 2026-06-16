"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HelpCircle,
  Book,
  Code,
  Activity,
  Database,
  Plug,
  Blocks,
  ExternalLink,
  Keyboard,
  Sparkles,
  Server,
  Shield,
} from "lucide-react";

const SECTIONS = [
  {
    id: "overview",
    title: "О системе",
    icon: <Activity className="h-4 w-4" />,
    content: (
      <div className="space-y-3 text-sm">
        <p>
          <strong>Графиня</strong> — это open-source система визуализации и мониторинга данных,
          разработанная Лабораторией Числитель. Платформа позволяет создавать интерактивные
          дашборды, подключаться к различным источникам данных и расширять функциональность
          через плагины и модули.
        </p>
        <p className="text-muted-foreground">
          Система построена на микросервисной архитектуре и состоит из четырёх основных
          компонентов: backend (Express.js), frontend (React + Vite), базы данных MongoDB
          и кэша Tarantool. Восемь плагинов обеспечивают совместимость с популярными
          источниками данных.
        </p>
      </div>
    ),
  },
  {
    id: "architecture",
    title: "Архитектура",
    icon: <Server className="h-4 w-4" />,
    content: (
      <div className="space-y-3 text-sm">
        <p>Четыре основных компонента системы:</p>
        <ul className="space-y-2 ml-1">
          <li className="flex items-start gap-2">
            <Badge variant="outline" className="text-xs shrink-0">:5000</Badge>
            <div>
              <strong>Backend (Express.js)</strong> — REST API, аутентификация, бизнес-логика
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="outline" className="text-xs shrink-0">:80</Badge>
            <div>
              <strong>Frontend (React + Vite)</strong> — пользовательский интерфейс
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="outline" className="text-xs shrink-0">:27017</Badge>
            <div>
              <strong>MongoDB</strong> — хранение дашбордов, пользователей, конфигураций
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="outline" className="text-xs shrink-0">:3301</Badge>
            <div>
              <strong>Tarantool</strong> — кэш сессий и горячих данных
            </div>
          </li>
        </ul>
        <Separator />
        <p className="text-muted-foreground">Восемь плагинов источников данных:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2"><Badge variant="outline">:8080</Badge><span>Prometheus</span></div>
          <div className="flex items-center gap-2"><Badge variant="outline">:8081</Badge><span>Пульт / Zabbix</span></div>
          <div className="flex items-center gap-2"><Badge variant="outline">:8082</Badge><span>CSV</span></div>
          <div className="flex items-center gap-2"><Badge variant="outline">:8083</Badge><span>PostgreSQL</span></div>
          <div className="flex items-center gap-2"><Badge variant="outline">:8084</Badge><span>JSON</span></div>
          <div className="flex items-center gap-2"><Badge variant="outline">:8085</Badge><span>GitLab</span></div>
          <div className="flex items-center gap-2"><Badge variant="outline">:8086</Badge><span>Elasticsearch</span></div>
          <div className="flex items-center gap-2"><Badge variant="outline">:8087</Badge><span>ClickHouse</span></div>
        </div>
      </div>
    ),
  },
  {
    id: "plugins",
    title: "Плагины",
    icon: <Plug className="h-4 w-4" />,
    content: (
      <div className="space-y-3 text-sm">
        <p>
          Плагины — это отдельные контейнеры, которые предоставляют единый контракт для
          взаимодействия с источниками данных. Каждый плагин реализует четыре endpoints:
        </p>
        <ul className="space-y-2">
          <li>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/well-known</code>
            <p className="text-muted-foreground text-xs mt-1">
              Метаданные плагина: тип, поддерживаемые функции, версия
            </p>
          </li>
          <li>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/datasource/health-check</code>
            <p className="text-muted-foreground text-xs mt-1">
              Проверка состояния конкретного источника данных
            </p>
          </li>
          <li>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/query/get-result</code>
            <p className="text-muted-foreground text-xs mt-1">
              Выполнение запроса и получение результата (временной ряд, таблица)
            </p>
          </li>
          <li>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/variable/values</code>
            <p className="text-muted-foreground text-xs mt-1">
              Получение значений переменных для дашбордов
            </p>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "modules",
    title: "Модули",
    icon: <Blocks className="h-4 w-4" />,
    content: (
      <div className="space-y-3 text-sm">
        <p>
          Модули — это bundles JavaScript, которые расширяют фронтенд. Они регистрируются
          через глобальный объект:
        </p>
        <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto"><code>{`window["my-module"].registry = {
  Widget: { /* компонент виджета */ },
  WidgetEditor: { /* редактор виджета */ },
  Settings: { /* настройки модуля */ }
}`}</code></pre>
        <p className="text-muted-foreground">
          Backend проксирует запросы к модулю через эндпоинт{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
            /api/v1/modules/&#123;id&#125;/proxy/&#123;path&#125;
          </code>
          , что позволяет модулям иметь собственный API.
        </p>
      </div>
    ),
  },
  {
    id: "auth",
    title: "Аутентификация",
    icon: <Shield className="h-4 w-4" />,
    content: (
      <div className="space-y-3 text-sm">
        <p>
          Графиня использует JWT-токены для аутентификации. После входа выдаётся пара:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Access token</strong> — короткоживущий (15 минут), передаётся в заголовке{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">Authorization: Bearer ...</code>
          </li>
          <li>
            <strong>Refresh token</strong> — долгоживущий (7 дней), используется для обновления access token
          </li>
        </ul>
        <p className="text-muted-foreground">
          Учётные данные по умолчанию: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">admin</code> /{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">123456</code>. Рекомендуется сменить
          пароль после первого входа в настройках.
        </p>
      </div>
    ),
  },
  {
    id: "shortcuts",
    title: "Горячие клавиши",
    icon: <Keyboard className="h-4 w-4" />,
    content: (
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Открыть командную палитру</span>
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono border">Ctrl+K</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span>Переключение видов</span>
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono border">Alt+1-7</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span>Демо-режим</span>
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono border">Alt+D</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span>Показать горячие клавиши</span>
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono border">?</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span>Закрыть диалог</span>
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono border">Esc</kbd>
        </div>
        <div className="flex items-center justify-between">
          <span>Выполнить запрос (в Explorer)</span>
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono border">Ctrl+Enter</kbd>
        </div>
      </div>
    ),
  },
];

export function HelpDialog() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const active = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hidden md:flex"
          title="Справка"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Справка по Графине
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-[60vh]">
          {/* Sidebar */}
          <div className="w-56 border-r bg-muted/30 p-2">
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                    activeSection === section.id
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
              {active.icon}
              {active.title}
            </h3>
            {active.content}

            <Separator className="my-5" />

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Полезные ссылки
              </h4>
              <div className="grid gap-2">
                <a
                  href="https://docs.pult.tech/constructor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Документация</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                </a>
                <a
                  href="https://docs.pult.tech/constructor/development/plugin-development"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Разработка плагинов</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                </a>
                <a
                  href="https://docs.pult.tech/constructor/development/module-development"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Разработка модулей</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
