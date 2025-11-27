// src/app/(auth)/register/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const { signUp, user } = useAuth();
  const router = useRouter();

  // Efeito para redirecionar o usuário se ele já estiver logado
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    try {
      await signUp(name, email, password);
      // Após o cadastro bem-sucedido, o onAuthStateChanged no AuthContext
      // atualizará o 'user' e o useEffect acima fará o redirecionamento.
    } catch (error: any) {
      console.error(error);
      // Personaliza a mensagem de erro com base no código do erro do Firebase
      if (error.code === "auth/email-already-in-use") {
        setRegisterError("Este e-mail já está em uso.");
      } else if (error.code === "auth/weak-password") {
        setRegisterError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setRegisterError("Falha ao criar a conta. Tente novamente.");
      }
    }
  };

  // Se o usuário já estiver logado, não renderiza nada enquanto redireciona
  if (user) {
    return null;
  }

  return (
    <div className="auth-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="primary-button">
          Criar Conta
        </button>
        {registerError && <p className="error-message">{registerError}</p>}
      </form>
      <p>
        Já tem uma conta? <a href="/login">Faça login</a>
      </p>
    </div>
  );
}
