// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import FullscreenLoader from "@/components/ui/FullscreenLoader"; // Usaremos nosso loader

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só executa a lógica depois que a autenticação for verificada
    if (!loading) {
      if (user) {
        // Se há um usuário, redireciona para o dashboard
        router.replace("/dashboard");
      } else {
        // Se não há usuário, redireciona para o login
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  // Enquanto a verificação acontece, mostramos uma tela de carregamento
  // para evitar um "flash" de conteúdo ou uma tela em branco.
  return <FullscreenLoader />;
}
