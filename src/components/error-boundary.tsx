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
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-foreground">
                    Что-то пошло не так
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Произошла ошибка при отображении этого раздела. Попробуйте обновить страницу или вернуться на главную.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-background border p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Bug className="h-3.5 w-3.5" />
                  <span>Детали ошибки</span>
                </div>
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words">
                  {errorMessage}
                </p>
                {errorStack && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Показать стек
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-x-auto max-h-32">
                      {errorStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={this.handleReset} variant="default" size="sm">
                  <RefreshCw className="h-3.5 w-3.5 mr-2" />
                  Попробовать снова
                </Button>
                <Button onClick={this.handleReload} variant="outline" size="sm">
                  <RefreshCw className="h-3.5 w-3.5 mr-2" />
                  Обновить страницу
                </Button>
                <Button onClick={this.handleHome} variant="ghost" size="sm">
                  <Home className="h-3.5 w-3.5 mr-2" />
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
