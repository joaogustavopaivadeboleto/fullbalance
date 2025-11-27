// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // 1. Importe o AuthProvider
import { ThemeProvider } from "@/context/ThemeContext";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
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
        {/* 2. Envolva TODOS os children com o AuthProvider */}
        <AuthProvider>
          <ThemeProvider>
            <MobileMenuProvider>{children}</MobileMenuProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
