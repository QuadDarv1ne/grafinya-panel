import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTranslation } from "@/hooks/use-translation";
import { useGraphinyaStore } from "@/lib/store";

beforeEach(() => {
  useGraphinyaStore.setState({ language: "ru" });
});

describe("useTranslation", () => {
  it("returns Russian translations by default", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t("common.appName")).toBe("Графиня");
    expect(result.current.t("nav.dashboards")).toBe("Дашборды");
    expect(result.current.language).toBe("ru");
  });

  it("returns English translations when language is en", () => {
    useGraphinyaStore.setState({ language: "en" });
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t("common.appName")).toBe("Graphinya");
    expect(result.current.t("nav.dashboards")).toBe("Dashboards");
    expect(result.current.language).toBe("en");
  });

  it("supports parameter interpolation", () => {
    useGraphinyaStore.setState({ language: "en" });
    const { result } = renderHook(() => useTranslation());
    const text = result.current.t("welcome.desc", { lab: "Test Lab" });
    expect(text).toBe("Data visualization and monitoring system by Test Lab");
  });

  it("returns key for missing translation", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t("nonexistent.key" as never)).toBe("nonexistent.key");
  });
});
