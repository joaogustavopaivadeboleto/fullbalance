// src/app/(auth)/login/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Importa o hook de roteamento do Next.js

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const { signIn, user } = useAuth();
  const router = useRouter();

  // Efeito para redirecionar o usuário se ele já estiver logado
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    setLoginError(""); // Limpa erros anteriores

    try {
      await signIn(email, password);
      // O redirecionamento após o login bem-sucedido será tratado pelo efeito acima
    } catch (error) {
      console.error(error);
      setLoginError("Falha no login. Verifique seu e-mail e senha.");
    }
  };

  // Se o usuário já estiver logado, não renderiza nada enquanto redireciona
  if (user) {
    return null;
  }

  return (
    <div className="auth-container">
      {/* Adicionar logo aqui depois */}
      <h2>Login</h2>
      <p>Preencha o formulário abaixo para fazer login no sistema</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="primary-button">
          Entrar
        </button>
        {loginError && <p className="error-message">{loginError}</p>}
      </form>
      <p className="link-text">
        Não tem conta? <a href="/register">Cadastre-se</a>
      </p>
    </div>
  );
}
