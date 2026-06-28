# CONTRIBUTING — Графиня Панель управления

## Быстрый старт

```bash
# Клонировать и установить зависимости
git clone https://github.com/QuadDarv1ne/grafinya-panel.git
cd grafinya-panel
bun install

# Запустить в режиме разработки
bun run dev
```

## Структура проекта

```
src/
  app/            # Next.js App Router (маршруты, API)
  components/     # React-компоненты
    ui/           # shadcn/ui компоненты
    app-header.tsx, app-sidebar.tsx  # Layout-компоненты
  hooks/          # Кастомные хуки
  lib/            # Утилиты, store, API-клиент
  __tests__/      # Unit-тесты (Vitest)
messages/         # Файлы переводов (i18n)
public/           # Статические файлы, SW
```

## Команды

| Команда | Описание |
|---------|----------|
| `bun run dev` | Запуск dev-сервера |
| `bun run build` | Продакшн-сборка |
| `bun run lint` | Проверка ESLint |
| `bun run typecheck` | Проверка типов TypeScript |
| `bun run test` | Запуск unit-тестов |
| `bun run test:watch` | Тесты в watch-режиме |
| `bun run format` | Форматирование Prettier |
| `bun run format:check` | Проверка форматирования |

## Тесты

Проект использует Vitest + @testing-library/react. Тесты находятся в `src/__tests__/`.

```bash
# Запустить все тесты
bun run test

# Запустить конкретный файл
bunx vitest run src/__tests__/store.test.ts
```

## Стиль кода

- **TypeScript** — строгая типизация (`noImplicitAny: true`)
- **ESLint** — линтинг с предупреждениями для `any`, unused vars
- **Prettier** — единый формат (prettier-plugin-tailwindcss)
- **Компоненты** — functional components, хуки
- **Состояние** — Zustand store (`src/lib/store.ts`)
- **Переводы** — `useTranslation()` хук, JSON-файлы в `messages/`

## PR (Pull Request)

1. Создайте ветку из `main`: `git checkout -b feature/my-feature`
2. Внесите изменения
3. Запустите проверки: `bun run lint && bun run typecheck && bun run test`
4. Отправьте PR с описанием изменений

## Вопросы?

Откройте Issue в репозитории на GitHub.
