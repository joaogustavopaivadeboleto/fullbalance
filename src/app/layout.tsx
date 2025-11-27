// src/app/layout.tsx - VERSÃO FINAL E CORRIGIDA

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers"; // <<< 1. Importe o novo componente Providers

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FullBalance",
  description: "Seu sistema financeiro pessoal",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={inter.className}>
        {/* 2. Envolva os children apenas com o componente Providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
