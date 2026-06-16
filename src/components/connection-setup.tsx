"use client";

import { useState } from "react";
import { useGraphinyaStore } from "@/lib/store";
import { useGraphinyaApi } from "@/hooks/use-grafinya-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Server,
  User,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  Wifi,
  Sparkles,
  Info,
  Key,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ConnectionSetup() {
  const {
    config,
    setConfig,
    connectionStatus,
    setConnectionStatus,
    setTokens,
    setCurrentUser,
    enableDemoMode,
    isDemoMode,
  } = useGraphinyaStore();
  const { call } = useGraphinyaApi();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [host, setHost] = useState(config.baseUrl.replace(/:\d+$/, "").replace(/^https?:\/\//, ""));
  const [port, setPort] = useState(
    config.baseUrl.match(/:(\d+)/)?.[1] || "5000"
  );
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"unchecked" | "ok" | "fail">("unchecked");

  const isConnected = connectionStatus === "connected";

  const handleHealthCheck = async () => {
    const baseUrl = `http://${host}:${port}`;
    try {
      const response = await fetch(`${baseUrl}/healthz`, { signal: AbortSignal.timeout(5000) });
      if (response.ok) {
        setHealthStatus("ok");
      } else {
        setHealthStatus("fail");
      }
    } catch {
      setHealthStatus("fail");
    }
  };

  const handleConnect = async () => {
    setError(null);
    setHealthStatus("unchecked");
    setIsConnecting(true);
    setConnectionStatus("connecting");

    const baseUrl = `http://${host}:${port}`;

    try {
      // First test health
      const healthResponse = await fetch(`${baseUrl}/healthz`, { signal: AbortSignal.timeout(8000) });
      if (!healthResponse.ok) {
        throw new Error("Сервер недоступен. Проверьте адрес и порт.");
      }
      setHealthStatus("ok");

      // Update config
      setConfig({ baseUrl, frontendUrl: `http://${host}` });

      // Then login
      const loginResult = await call<{ accessToken: string; refreshToken: string }>({
        path: "/auth/login",
        method: "POST",
        body: { username, password },
      });

      setTokens({
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken,
      });

      // Get user info
      const user = await call({
        path: "/auth/me",
      });
      setCurrentUser(user as any);

      setConnectionStatus("connected");
      setOpen(false);
      toast({
        title: "Подключено к Графине",
        description: `Вы вошли как ${(user as any)?.username || username}`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Не удалось подключиться";
      setError(msg);
      setConnectionStatus("error", msg);
      toast({ title: "Ошибка подключения", description: msg, variant: "destructive" });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    useGraphinyaStore.getState().logout();
    setHealthStatus("unchecked");
    toast({ title: "Отключено", description: "Вы отключены от сервера Графини" });
  };

  const handleDemoMode = () => {
    enableDemoMode();
    setOpen(false);
    toast({ title: "Демо-режим активирован", description: "Данные сгенерированы для демонстрации" });
  };

  return (
    <>
      {/* Connection status indicator */}
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
          isConnected
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
            : connectionStatus === "demo"
            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20"
            : connectionStatus === "connecting"
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : connectionStatus === "error"
            ? "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        {isConnected ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : connectionStatus === "demo" ? (
          <Sparkles className="h-4 w-4" />
        ) : connectionStatus === "connecting" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : connectionStatus === "error" ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <Wifi className="h-4 w-4" />
        )}
        <span>
          {isConnected
            ? "Подключено"
            : connectionStatus === "demo"
            ? "Демо"
            : connectionStatus === "connecting"
            ? "Подключение..."
            : connectionStatus === "error"
            ? "Ошибка"
            : "Не подключено"}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-500" />
              Подключение к Графине
            </DialogTitle>
            <DialogDescription>
              Укажите адрес сервера Графини и учётные данные для входа,
              или используйте демо-режим для ознакомления.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="connect" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="connect" className="flex-1">
                <Wifi className="h-3.5 w-3.5 mr-1.5" />
                Подключение
              </TabsTrigger>
              <TabsTrigger value="demo" className="flex-1">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Демо-режим
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connect" className="space-y-4 pt-4">
              {/* Server URL */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Адрес сервера</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="192.168.0.1"
                    value={host}
                    onChange={(e) => { setHost(e.target.value); setHealthStatus("unchecked"); }}
                    className="flex-1"
                  />
                  <Input
                    placeholder="5000"
                    value={port}
                    onChange={(e) => { setPort(e.target.value); setHealthStatus("unchecked"); }}
                    className="w-24"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleHealthCheck}
                    disabled={!host}
                    title="Проверить доступность"
                  >
                    {healthStatus === "ok" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : healthStatus === "fail" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Server className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  IP или домен сервера Графини и порт backend API (по умолчанию 5000)
                </p>
              </div>

              {/* Credentials */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Учётные данные</Label>
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Логин"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                    />
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2.5 flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground">
                    По умолчанию: <code className="font-mono bg-muted px-1 rounded">admin</code> / <code className="font-mono bg-muted px-1 rounded">123456</code>
                  </p>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg flex items-start gap-2">
                  <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <DialogFooter className="flex gap-2">
                {isConnected && (
                  <Button variant="destructive" onClick={handleDisconnect}>
                    Отключить
                  </Button>
                )}
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting || !host || !username}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Подключение...
                    </>
                  ) : (
                    <>
                      <Wifi className="h-4 w-4 mr-2" />
                      {isConnected ? "Переподключить" : "Подключить"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="demo" className="space-y-4 pt-4">
              <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-6 text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto">
                  <Sparkles className="h-7 w-7 text-violet-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Демо-режим</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Попробуйте все функции приложения без подключения к реальному серверу.
                    Данные генерируются автоматически для демонстрации возможностей.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">5 дашбордов</Badge>
                  <Badge variant="secondary">6 источников</Badge>
                  <Badge variant="secondary">8 плагинов</Badge>
                  <Badge variant="secondary">1 модуль</Badge>
                </div>
                <Button
                  onClick={handleDemoMode}
                  size="lg"
                  className="bg-violet-500 hover:bg-violet-600 text-white"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Включить демо-режим
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
