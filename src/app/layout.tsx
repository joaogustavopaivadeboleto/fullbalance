// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // 1. Importe o AuthProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FullBalance",
  description: "Seu sistema financeiro pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={inter.className}>
        {/* 2. Envolva TODOS os children com o AuthProvider */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
