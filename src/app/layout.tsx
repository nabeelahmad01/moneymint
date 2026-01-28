import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoneyMint - Complete Tasks & Earn Rewards",
  description: "Complete simple tasks, watch videos, take surveys, and earn real money. Withdraw instantly via Binance.",
  keywords: "earn money, tasks, surveys, rewards, binance, crypto",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MoneyMint",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d4ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import ServiceWorkerRegister from "./ServiceWorkerRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
