"use client";

import { useGraphinyaStore } from "@/lib/store";
import type { Language } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useGraphinyaStore();

  return (
    <div className="flex items-center gap-0.5">
      {LANGUAGES.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          className={`h-7 px-2 text-[10px] font-bold ${
            language === lang.code
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "text-muted-foreground"
          }`}
          onClick={() => setLanguage(lang.code)}
          title={lang.code === "ru" ? "Русский" : "English"}
        >
          <Globe className="mr-1 h-3 w-3" />
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
