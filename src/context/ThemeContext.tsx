// src/context/ThemeContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "./AuthContext";

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => Promise<void>;
  loadingTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultColor = "#4ade80"; // Nossa cor verde padrão

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [primaryColor, setPrimaryColorState] = useState(defaultColor);
  const [loadingTheme, setLoadingTheme] = useState(true);

  // Efeito para buscar a cor salva do usuário quando ele loga
  useEffect(() => {
    const fetchTheme = async () => {
      if (user) {
        setLoadingTheme(true);
        const userThemeRef = doc(db, "userThemes", user.uid);
        const docSnap = await getDoc(userThemeRef);

        if (docSnap.exists()) {
          setPrimaryColorState(docSnap.data().primaryColor);
        } else {
          setPrimaryColorState(defaultColor); // Usa a cor padrão se não houver tema salvo
        }
        setLoadingTheme(false);
      } else {
        // Reseta para a cor padrão se o usuário deslogar
        setPrimaryColorState(defaultColor);
        setLoadingTheme(false);
      }
    };

    fetchTheme();
  }, [user]);

  // Função para atualizar a cor no estado e no Firestore
  const setPrimaryColor = async (color: string) => {
    if (!user) return;
    setPrimaryColorState(color); // Atualiza o estado local imediatamente para uma UI reativa
    const userThemeRef = doc(db, "userThemes", user.uid);
    await setDoc(userThemeRef, { primaryColor: color });
  };

  return (
    <ThemeContext.Provider
      value={{ primaryColor, setPrimaryColor, loadingTheme }}
    >
      {/* Injeta a cor primária dinamicamente no CSS */}
      <style jsx global>{`
        :root {
          --color-primary: ${primaryColor};
          --color-primary-darker: ${darkenColor(
            primaryColor,
            20
          )}; /* Escurece a cor para o hover */
        }
      `}</style>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook customizado para usar o contexto de tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Função utilitária para escurecer a cor (pode ser colocada em um arquivo utils)
function darkenColor(hex: string, percent: number): string {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  r = Math.floor((r * (100 - percent)) / 100);
  g = Math.floor((g * (100 - percent)) / 100);
  b = Math.floor((b * (100 - percent)) / 100);

  const toHex = (c: number) => ("0" + c.toString(16)).slice(-2);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
