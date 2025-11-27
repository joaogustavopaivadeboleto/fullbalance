// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  // --- INÍCIO DA MUDANÇA 1: IMPORTAR AS FUNÇÕES DE PERSISTÊNCIA ---
  setPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import FullscreenLoader from "@/components/ui/FullscreenLoader"; // Adicionado para uma melhor experiência de carregamento

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // --- INÍCIO DA MUDANÇA 2: DEFINIR A PERSISTÊNCIA ANTES DO LOGIN ---
    // Esta linha faz com que o login seja "lembrado" no dispositivo.
    await setPersistence(auth, indexedDBLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // --- INÍCIO DA MUDANÇA 3: DEFINIR A PERSISTÊNCIA TAMBÉM NO CADASTRO ---
    await setPersistence(auth, indexedDBLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Usar um loader em tela cheia evita "flashes" de conteúdo */}
      {loading ? <FullscreenLoader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
