"use client";

import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS_KEYS = [
  { keys: "Ctrl + K", key: "commandPalette" },
  { keys: "Alt + 1-8", key: "switchViews" },
  { keys: "Alt + D", key: "demoMode" },
  { keys: "?", key: "showShortcuts" },
  { keys: "Esc", key: "closeDialog" },
  { keys: "Ctrl + Enter", key: "executeQuery" },
] as const;

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-background mx-4 w-full max-w-sm rounded-2xl border p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <Keyboard className="h-5 w-5 text-amber-500" />
            {t("common.shortcutsTitle")}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {SHORTCUTS_KEYS.map((shortcut) => (
            <div key={shortcut.keys} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t(`shortcuts.${shortcut.key}`)}</span>
              <div className="flex gap-1">
                {shortcut.keys.split(" + ").map((key, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
                    <kbd className="bg-muted rounded border px-2 py-0.5 font-mono text-xs">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
