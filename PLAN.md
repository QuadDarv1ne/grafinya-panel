# План улучшений — Графиня Панель управления

## 10 пунктов плана развития проекта

---

### 1. Исправить `noImplicitAny: true` в `tsconfig.json`
Включить строгую проверку типов `noImplicitAny: true`. Сейчас `false`, что маскирует ошибки типизации. После включения — исправить все `any`-типы в коде, добавить типы для API-ответов и пропсов компонентов.

**Статус:** Готово ✓

---

### 2. Добавить unit-тесты (Vitest)
Установить Vitest + @testing-library/react. Написать тесты для:
- `src/lib/store.ts` (Zustand store) — все actions
- `src/lib/grafinya-api.ts` (API клиент) — методы с моками fetch
- `src/app/api/grafinya/proxy/route.ts` — валидация SSRF

**Статус:** Готово ✓ (39 тестов: store + API client)

---

### 3. Внедрить React Query (@tanstack/react-query)
Заменить ручное управление `isLoading` + `useState` на React Query хуки (`useQuery`, `useMutation`). Это даст автоматическое кэширование, refetch на фокусе, оптимистичные обновления и retry.

**Статус:** Провайдер установлен ✓ (QueryClientProvider в layout, готов к миграции компонентов)

---

### 4. Lazy loading компонентов (код-сплиттинг)
Добавить `React.lazy()` + `Suspense` для тяжёлых компонентов:
- `ConstructorView` (редко используется)
- `ActivityLog` (только при навигации)
- `ExplorerView`
- `SystemHealth` (Recharts + Framer Motion)

Это уменьшит начальный bundle size.

**Статус:** Готово ✓

---

### 5. CI/CD через GitHub Actions
Создать `.github/workflows/ci.yml`:
- `bun install`
- `bun run lint`
- `bun run build`
- `bun test` (когда тесты будут)

Триггер: push/PR на main.

**Статус:** Готово ✓

---

### 6. Добавить i18n (мультиязычность)
Настроить `next-intl` (уже установлен) для русского и английского языков:
- Вынести все строки из компонентов в JSON-файлы (`/messages/ru.json`, `/messages/en.json`)
- Создать LanguageSwitcher
- Захардкоженные строки "Графиня", "Дашборды" и т.д. — заменить на `t()`

**Статус:** Не начато

---

### 7. Server Components для layout.tsx и page.tsx
Текущий `page.tsx` помечен `"use client"` целиком. Разделить:
- Header, Sidebar → Server Components (рендерятся на сервере)
- Основной контент (store-dependent) → оставить `"use client"`

Это ускорит First Contentful Paint.

**Статус:** Не начато

---

### 8. PWA и Service Worker
Настроить Progressive Web App:
- Создать `public/manifest.json`
- Зарегистрировать Service Worker для кэширования статики
- Добавить install prompt для мобильных

**Статус:** Манифест создан ✓ (Service Worker — отложен)

---

### 9. Dockerfile для деплоя
Создать многостадийный Dockerfile:
- Stage 1: `bun install` + `bun run build`
- Stage 2: production image с `.next/standalone` (уже настроен `output: "standalone"`)
- Expose порт 3000

**Статус:** Готово ✓

---

### 10. Skeleton-загрузки и пустые состояния
Добавить UX-улучшения:
- Skeleton-компоненты при загрузке данных (компонент `Skeleton` уже есть)
- Пустые состояния для списков (дашборды, источники, плагины)
- Toast-уведомления при успехе CRUD-операций (sonner уже установлен)

**Статус:** Skeleton для дашбордов и источников данных ✓

---

## Приоритеты

| # | Задача | Приоритет | Сложность |
|---|--------|-----------|-----------|
| 1 | noImplicitAny | P0 | Средняя |
| 2 | Unit-тесты | P1 | Средняя |
| 3 | React Query | P1 | Высокая |
| 4 | Lazy loading | P1 | Низкая |
| 5 | CI/CD | P1 | Низкая |
| 6 | i18n | P2 | Высокая |
| 7 | Server Components | P2 | Средняя |
| 8 | PWA | P3 | Средняя |
| 9 | Dockerfile | P1 | Низкая |
| 10 | Skeleton/empty states | P3 | Низкая |
