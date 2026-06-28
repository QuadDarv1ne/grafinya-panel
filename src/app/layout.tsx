import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers";
import { ServiceWorkerRegistration } from "@/components/sw-registration";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Графиня — Панель управления",
    template: "%s | Графиня",
  },
  description:
    "Система визуализации и мониторинга данных. Панель управления Графинёй для работы с дашбордами, источниками данных, плагинами и модулями.",
  keywords: [
    "Графиня",
    "Пульт",
    "мониторинг",
    "дашборды",
    "визуализация данных",
    "Лаборатория Числитель",
  ],
  authors: [{ name: "Лаборатория Числитель" }],
  icons: {
    icon: "/logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Графиня",
    title: "Графиня — Панель управления",
    description: "Система визуализации и мониторинга данных от Лаборатории Числитель",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Графиня",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Графиня — Панель управления",
    description: "Система визуализации и мониторинга данных от Лаборатории Числитель",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Графиня",
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
            >
              Перейти к основному содержимому
            </a>
            <div id="main-content">{children}</div>
            <Toaster />
            <ServiceWorkerRegistration />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
