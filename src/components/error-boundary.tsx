"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for debugging
    console.error("[Графиня Error Boundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "Неизвестная ошибка";
      const errorStack = this.state.error?.stack || "";

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <div className="space-y-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-foreground text-lg font-bold">Что-то пошло не так</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Произошла ошибка при отображении этого раздела. Попробуйте обновить страницу или
                    вернуться на главную.
                  </p>
                </div>
              </div>

              <div className="bg-background space-y-2 rounded-lg border p-3">
                <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                  <Bug className="h-3.5 w-3.5" />
                  <span>Детали ошибки</span>
                </div>
                <p className="font-mono text-xs break-words text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
                {errorStack && (
                  <details className="text-xs">
                    <summary className="text-muted-foreground hover:text-foreground cursor-pointer">
                      Показать стек
                    </summary>
                    <pre className="bg-muted mt-2 max-h-32 overflow-x-auto rounded p-2 text-[10px]">
                      {errorStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={this.handleReset} variant="default" size="sm">
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Попробовать снова
                </Button>
                <Button onClick={this.handleReload} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Обновить страницу
                </Button>
                <Button onClick={this.handleHome} variant="ghost" size="sm">
                  <Home className="mr-2 h-3.5 w-3.5" />
                  На главную
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
