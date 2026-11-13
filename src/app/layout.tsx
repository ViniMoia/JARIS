import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "./fonts/GeneralSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/GeneralSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

const mulish = localFont({
  src: [
    {
      path: "./fonts/mulish-latin.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/mulish-latin.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mulish",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JARIS — Gestão Empresarial com Inteligência Artificial",
  description:
    "Sistema de gestão empresarial integrado com agentes de inteligência artificial.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${generalSans.variable} ${mulish.variable} font-sans antialiased`}
    >
      <body className="min-h-screen bg-[#ffffff] text-[#111827] font-sans selection:bg-[#111827] selection:text-white">
        {children}
      </body>
    </html>
  );
}
