// src/context/Providers.tsx

"use client"; // <<< ESSA É A LINHA MAIS IMPORTANTE!

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MobileMenuProvider } from '@/context/MobileMenuContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MobileMenuProvider>
          {children}
          {/* O Toaster também é um client component, então ele fica bem aqui */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                border: '1px solid #555',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
            }}
          />
        </MobileMenuProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
