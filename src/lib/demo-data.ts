/**
 * Demo data for Graphinya when no server is connected.
 * Provides realistic Russian-language mock data for all views.
 */

import type { Dashboard, DataSource, Plugin, Module, Palette } from "./grafinya-api";

// ---- Demo Dashboards ----
export const DEMO_DASHBOARDS: Dashboard[] = [
  {
    _id: "demo-dash-1",
    title: "Инфраструктура — Прод",
    description: "Мониторинг серверов, сетей и сервисов production-окружения",
    tags: ["production", "infrastructure", "мониторинг"],
    isFavorite: true,
    createdBy: "admin",
    createdAt: "2026-03-15T10:30:00Z",
    updatedAt: "2026-06-10T14:22:00Z",
    refreshTime: 30000,
    variables: [
      {
        name: "env",
        type: "select",
        current: "production",
        values: ["production", "staging", "dev"],
      },
      {
        name: "region",
        type: "select",
        current: "ru-central1",
        values: ["ru-central1", "ru-west1", "eu-west1"],
      },
    ],
    widgets: [
      {
        id: "w1",
        title: "CPU Utilization",
        type: "line",
        cols: 2,
        rows: 2,
        dataSourceId: "demo-ds-1",
      },
      {
        id: "w2",
        title: "Memory Usage",
        type: "line",
        cols: 2,
        rows: 2,
        dataSourceId: "demo-ds-1",
      },
      { id: "w3", title: "Disk I/O", type: "bar", cols: 1, rows: 2, dataSourceId: "demo-ds-1" },
      {
        id: "w4",
        title: "Network Traffic",
        type: "line",
        cols: 1,
        rows: 2,
        dataSourceId: "demo-ds-2",
      },
      {
        id: "w5",
        title: "Active Alerts",
        type: "table",
        cols: 3,
        rows: 1,
        dataSourceId: "demo-ds-2",
      },
      {
        id: "w6",
        title: "Service Status",
        type: "pie",
        cols: 1,
        rows: 1,
        dataSourceId: "demo-ds-1",
      },
    ],
  },
  {
    _id: "demo-dash-2",
    title: "CI/CD Pipeline",
    description: "Статистика сборок, деплоев и качества кода",
    tags: ["ci-cd", "gitlab", "devops"],
    isFavorite: true,
    createdBy: "admin",
    createdAt: "2026-04-01T08:00:00Z",
    updatedAt: "2026-06-12T09:15:00Z",
    refreshTime: 60000,
    variables: [
      {
        name: "project",
        type: "select",
        current: "grafinya-frontend",
        values: ["grafinya-frontend", "grafinya-backend", "pult-core"],
      },
    ],
    widgets: [
      {
        id: "w7",
        title: "Build Success Rate",
        type: "line",
        cols: 2,
        rows: 2,
        dataSourceId: "demo-ds-5",
      },
      {
        id: "w8",
        title: "Deploy Frequency",
        type: "bar",
        cols: 1,
        rows: 2,
        dataSourceId: "demo-ds-5",
      },
      {
        id: "w9",
        title: "Pipeline Duration",
        type: "table",
        cols: 2,
        rows: 1,
        dataSourceId: "demo-ds-5",
      },
      { id: "w10", title: "Open MRs", type: "pie", cols: 1, rows: 1, dataSourceId: "demo-ds-5" },
    ],
  },
  {
    _id: "demo-dash-3",
    title: "База данных — Аналитика",
    description: "Метрики PostgreSQL и ClickHouse для аналитических запросов",
    tags: ["database", "analytics", "clickhouse"],
    isFavorite: false,
    createdBy: "analyst",
    createdAt: "2026-05-10T12:00:00Z",
    updatedAt: "2026-06-11T16:45:00Z",
    refreshTime: 120000,
    widgets: [
      {
        id: "w11",
        title: "Query Performance",
        type: "line",
        cols: 2,
        rows: 2,
        dataSourceId: "demo-ds-3",
      },
      { id: "w12", title: "Connections", type: "bar", cols: 1, rows: 2, dataSourceId: "demo-ds-3" },
      { id: "w13", title: "Table Sizes", type: "pie", cols: 1, rows: 1, dataSourceId: "demo-ds-3" },
      {
        id: "w14",
        title: "Slow Queries",
        type: "table",
        cols: 3,
        rows: 1,
        dataSourceId: "demo-ds-4",
      },
    ],
  },
  {
    _id: "demo-dash-4",
    title: "Логи и поиск",
    description: "Агрегации Elasticsearch, логи ошибок и трейсинг",
    tags: ["logs", "elasticsearch", "errors"],
    isFavorite: false,
    createdBy: "admin",
    createdAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-06-13T11:30:00Z",
    widgets: [
      { id: "w15", title: "Error Rate", type: "line", cols: 2, rows: 2, dataSourceId: "demo-ds-6" },
      { id: "w16", title: "Log Levels", type: "pie", cols: 1, rows: 1, dataSourceId: "demo-ds-6" },
      {
        id: "w17",
        title: "Top Errors",
        type: "table",
        cols: 2,
        rows: 1,
        dataSourceId: "demo-ds-6",
      },
    ],
  },
  {
    _id: "demo-dash-5",
    title: "Обзор системы",
    description: "Сводный дашборд с ключевыми метриками всех компонентов",
    tags: ["overview", "summary"],
    isFavorite: true,
    createdBy: "admin",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-06-14T08:00:00Z",
    refreshTime: 15000,
    variables: [
      { name: "period", type: "select", current: "1h", values: ["15m", "1h", "6h", "24h", "7d"] },
    ],
    widgets: [
      {
        id: "w18",
        title: "Total Requests",
        type: "line",
        cols: 2,
        rows: 2,
        dataSourceId: "demo-ds-1",
      },
      {
        id: "w19",
        title: "Response Time P99",
        type: "line",
        cols: 2,
        rows: 2,
        dataSourceId: "demo-ds-1",
      },
      {
        id: "w20",
        title: "Error Budget",
        type: "pie",
        cols: 1,
        rows: 1,
        dataSourceId: "demo-ds-2",
      },
      { id: "w21", title: "Uptime", type: "table", cols: 1, rows: 1, dataSourceId: "demo-ds-1" },
      {
        id: "w22",
        title: "Resource Usage",
        type: "bar",
        cols: 2,
        rows: 2,
        dataSourceId: "demo-ds-1",
      },
    ],
  },
];

// ---- Demo Data Sources ----
export const DEMO_DATASOURCES: DataSource[] = [
  {
    _id: "demo-ds-1",
    name: "Prometheus Production",
    pluginId: "prometheus",
    pluginName: "Prometheus / Victoria Metrics",
    type: "prometheus",
    fields: [
      { code: "url", name: "URL", type: "text", value: "http://prometheus:9090", required: true },
      { code: "timeout", name: "Таймаут", type: "number", value: "30" },
    ],
    isDefault: true,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    _id: "demo-ds-2",
    name: "Пульт Мониторинг",
    pluginId: "pult",
    pluginName: "Пульт / Zabbix",
    type: "pult",
    fields: [
      { code: "url", name: "URL", type: "text", value: "http://pult:8081", required: true },
      { code: "apiToken", name: "API Token", type: "password", value: "••••••••" },
    ],
    createdAt: "2026-02-05T12:00:00Z",
    updatedAt: "2026-05-20T14:00:00Z",
  },
  {
    _id: "demo-ds-3",
    name: "PostgreSQL Analytics",
    pluginId: "postgres",
    pluginName: "PostgreSQL / Postgres Pro",
    type: "postgres",
    fields: [
      { code: "host", name: "Хост", type: "text", value: "db.analytics.local", required: true },
      { code: "port", name: "Порт", type: "number", value: "5432" },
      { code: "database", name: "БД", type: "text", value: "analytics" },
    ],
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-06-05T11:00:00Z",
  },
  {
    _id: "demo-ds-4",
    name: "ClickHouse Logs",
    pluginId: "clickhouse",
    pluginName: "ClickHouse",
    type: "clickhouse",
    fields: [
      { code: "url", name: "URL", type: "text", value: "http://clickhouse:8123", required: true },
      { code: "database", name: "БД", type: "text", value: "logs" },
    ],
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-06-10T15:00:00Z",
  },
  {
    _id: "demo-ds-5",
    name: "GitLab Projects",
    pluginId: "gitlab",
    pluginName: "GitLab",
    type: "gitlab",
    fields: [
      {
        code: "url",
        name: "URL",
        type: "text",
        value: "https://gitlab.company.ru",
        required: true,
      },
      { code: "token", name: "Personal Access Token", type: "password", value: "••••••••" },
    ],
    createdAt: "2026-04-01T08:00:00Z",
    updatedAt: "2026-06-12T09:00:00Z",
  },
  {
    _id: "demo-ds-6",
    name: "Elasticsearch Logs",
    pluginId: "elasticsearch",
    pluginName: "Elasticsearch",
    type: "elasticsearch",
    fields: [
      { code: "url", name: "URL", type: "text", value: "http://elastic:9200", required: true },
      { code: "index", name: "Индекс", type: "text", value: "app-logs-*" },
    ],
    createdAt: "2026-05-01T07:00:00Z",
    updatedAt: "2026-06-08T13:00:00Z",
  },
];

// ---- Demo Plugins ----
export const DEMO_PLUGINS: Plugin[] = [
  {
    _id: "plugin-prometheus",
    name: "prometheus",
    title: "Prometheus / Victoria Metrics",
    version: "1.3.0",
    description:
      "Open-source мониторинг сервисов и хранение временных рядов. Поддерживает PromQL-запросы.",
    baseUrl: "http://prometheus-plugin:8080",
    status: "active",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    _id: "plugin-pult",
    name: "pult",
    title: "Пульт / Zabbix",
    version: "1.3.0",
    description:
      "Отечественная система мониторинга на основе Zabbix, дополненная новым функционалом.",
    baseUrl: "http://pult-plugin:8081",
    status: "active",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    _id: "plugin-postgres",
    name: "postgres",
    title: "PostgreSQL / Postgres Pro",
    version: "1.3.0",
    description: "Подключение к PostgreSQL, Postgres Pro и Pangolin, выполнение SQL-запросов.",
    baseUrl: "http://postgres-plugin:8083",
    status: "active",
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-05-15T12:00:00Z",
  },
  {
    _id: "plugin-clickhouse",
    name: "clickhouse",
    title: "ClickHouse",
    version: "1.3.0",
    description: "Подключение к ClickHouse и выполнение SQL-запросов для аналитики.",
    baseUrl: "http://clickhouse-plugin:8087",
    status: "active",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-05-20T14:00:00Z",
  },
  {
    _id: "plugin-csv",
    name: "csv",
    title: "CSV",
    version: "1.3.0",
    description: "Импорт и визуализация данных из CSV-файлов.",
    baseUrl: "http://csv-plugin:8082",
    status: "active",
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: "2026-05-25T09:00:00Z",
  },
  {
    _id: "plugin-json",
    name: "json",
    title: "JSON",
    version: "1.3.0",
    description: "Подключение к JSON-эндпоинтам и парсинг данных по JSONPath.",
    baseUrl: "http://json-plugin:8084",
    status: "active",
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: "2026-05-25T09:00:00Z",
  },
  {
    _id: "plugin-gitlab",
    name: "gitlab",
    title: "GitLab",
    version: "1.3.0",
    description: "Сбор метрик и событий из GitLab API: проекты, pipelines, merge requests.",
    baseUrl: "http://gitlab-plugin:8085",
    status: "active",
    createdAt: "2026-04-01T08:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
  {
    _id: "plugin-elasticsearch",
    name: "elasticsearch",
    title: "Elasticsearch",
    version: "1.3.0",
    description: "Запросы к индексам Elasticsearch: поиск, агрегации и временные ряды.",
    baseUrl: "http://elasticsearch-plugin:8086",
    status: "active",
    createdAt: "2026-05-01T07:00:00Z",
    updatedAt: "2026-06-08T13:00:00Z",
  },
];

// ---- Demo Modules ----
export const DEMO_MODULES: Module[] = [
  {
    id: "module-rsm",
    name: "rsm-module",
    version: "1.3.0",
    title: [
      { lang: "ru-RU", value: "РСМ — Расширенный мониторинг" },
      { lang: "en-US", value: "RSM — Advanced Monitoring" },
    ],
    description: [
      {
        lang: "ru-RU",
        value: "Модуль расширенного мониторинга с кастомными виджетами и аналитикой",
      },
      { lang: "en-US", value: "Advanced monitoring module with custom widgets and analytics" },
    ],
    baseUrl: "http://rsm-module-api:8080",
    frontendHost: "http://192.168.0.1:8202",
    scope: "rsmModule",
    entryPoint: "/assets/remoteEntry.js",
    components: ["Widget", "WidgetEditor", "Settings"],
    isActive: true,
    canAddToDashboard: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-06-10T15:00:00Z",
  },
];

// ---- Demo Palettes ----
export const DEMO_PALETTES: Palette[] = [
  {
    _id: "pal-1",
    name: "Графиня Classic",
    colors: ["#ffb900", "#ffd866", "#ff8c00", "#ff6347", "#ff4848"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    _id: "pal-2",
    name: "Ocean",
    colors: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    _id: "pal-3",
    name: "Forest",
    colors: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

// ---- Demo Time Series Data for Charts ----
export function generateTimeSeriesData(points: number = 24) {
  const now = Date.now();
  const hour = 3600000;
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * hour).toISOString().slice(11, 16),
    timestamp: now - (points - i) * hour,
    cpu: 30 + Math.random() * 50 + Math.sin(i / 3) * 15,
    memory: 45 + Math.random() * 30 + Math.cos(i / 4) * 10,
    requests: Math.floor(800 + Math.random() * 400 + Math.sin(i / 2) * 200),
    errors: Math.floor(Math.random() * 20),
    latency: Math.floor(50 + Math.random() * 100 + Math.sin(i / 5) * 30),
    disk_read: Math.floor(100 + Math.random() * 300),
    disk_write: Math.floor(50 + Math.random() * 200),
    network_in: Math.floor(500 + Math.random() * 500),
    network_out: Math.floor(300 + Math.random() * 400),
  }));
}

export function generatePieData() {
  return [
    { name: "Healthy", value: 42, color: "#10b981" },
    { name: "Warning", value: 8, color: "#f59e0b" },
    { name: "Critical", value: 3, color: "#ef4444" },
    { name: "Unknown", value: 2, color: "#6b7280" },
  ];
}

export function generateTableData() {
  return [
    {
      name: "api-gateway",
      status: "healthy",
      uptime: "99.98%",
      latency: "12ms",
      region: "ru-central1",
    },
    {
      name: "auth-service",
      status: "healthy",
      uptime: "99.95%",
      latency: "8ms",
      region: "ru-central1",
    },
    {
      name: "data-processor",
      status: "warning",
      uptime: "99.72%",
      latency: "145ms",
      region: "ru-west1",
    },
    {
      name: "notification-svc",
      status: "healthy",
      uptime: "99.99%",
      latency: "5ms",
      region: "ru-central1",
    },
    {
      name: "search-engine",
      status: "critical",
      uptime: "98.50%",
      latency: "520ms",
      region: "eu-west1",
    },
    {
      name: "cache-layer",
      status: "healthy",
      uptime: "99.97%",
      latency: "2ms",
      region: "ru-central1",
    },
  ];
}
