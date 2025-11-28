// src/context/AuthContext.tsx - VERSÃO FINAL COM REDIRECIONAMENTO

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
  setPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import FullscreenLoader from "@/components/ui/FullscreenLoader";
import { useRouter } from 'next/navigation'; // <<< 1. IMPORTAR O ROUTER

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
  const router = useRouter(); // <<< 2. INICIALIZAR O ROUTER

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await setPersistence(auth, indexedDBLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (name: string, email: string, password: string) => {
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

  // --- INÍCIO DA CORREÇÃO ---
  const logout = async () => {
    try {
      await signOut(auth); // Desloga do Firebase
      router.push('/login'); // <<< 3. REDIRECIONA PARA A PÁGINA DE LOGIN
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Garante o redirecionamento mesmo em caso de erro
      router.push('/login');
    }
  };
  // --- FIM DA CORREÇÃO ---

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout, // Fornece a nova função de logout corrigida
  };

  return (
    <AuthContext.Provider value={value}>
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
