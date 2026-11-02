import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#3b1443",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Cashflow: Corrida dos Ratos - Assistente Digital",
  description:
    "Ficha digital de balanço econômico para o jogo Cashflow 101/202 (Pai Rico, Pai Pobre). Gerenciamento 100% client-side e offline.",
  applicationName: "Cashflow",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cashflow",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-background text-foreground"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
