"use client";

import { useGraphinyaStore } from "@/lib/store";
import ru from "../../messages/ru.json";
import en from "../../messages/en.json";

type Messages = typeof ru;
type NestedKeyOf<T> = T extends object
  ? { [K in keyof T & string]: T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K }[keyof T & string]
  : never;

type TranslationKey = NestedKeyOf<Messages>;

const messages: Record<string, Messages> = { ru, en };

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as string | undefined;
}

export function useTranslation() {
  const language = useGraphinyaStore((s) => s.language);

  function t(key: TranslationKey, params?: Record<string, string>): string {
    const value = getNestedValue(messages[language] || messages.ru, key);
    if (!value) return key;
    if (!params) return value;
    return Object.entries(params).reduce(
      (result, [k, v]) => result.replace(new RegExp(`\\{${k}\\}`, "g"), v),
      value
    );
  }

  return { t, language };
}
