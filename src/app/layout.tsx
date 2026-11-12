import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#ffffff] text-[#111827] selection:bg-[#111827] selection:text-white">
        {children}
      </body>
    </html>
  );
}
