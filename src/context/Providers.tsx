// src/context/Providers.tsx

"use client";

import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { MobileMenuProvider } from "./MobileMenuContext";
import { SidebarProvider } from "./SidebarContext"; // Importe o SidebarProvider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MobileMenuProvider>
          <SidebarProvider> {/* Envolva os children com ele */}
            {children}
          </SidebarProvider>
        </MobileMenuProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
