// src/app/(main)/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ClientOnly from "@/components/ui/ClientOnly";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const { accounts, loading: accountsLoading } = useAccounts();

  const {
    transactions,
    loading: transactionsLoading,
    error,
  } = useTransactions(
    selectedAccountId === "all" ? undefined : { accountId: selectedAccountId }
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { balance, totalIncome, totalExpense };
  }, [transactions]);

  const isLoading = authLoading || transactionsLoading || accountsLoading;

  // Mostra a mensagem de carregamento enquanto busca os dados
  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="account-filter"
        >
          <option value="all">Todas as Contas</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      {/* --- CÓDIGO CORRIGIDO AQUI --- */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Saldo Atual</h3>
          <p>R$ {stats.balance.toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="stat-card">
          <h3>Receita Total</h3>
          <p>R$ {stats.totalIncome.toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="stat-card">
          <h3>Despesa Total</h3>
          <p>R$ {stats.totalExpense.toFixed(2).replace(".", ",")}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Transações</h3>
          <p>{transactions.length}</p>
        </div>
      </div>

      {/* --- E AQUI --- */}
      <div className="transactions-list-container">
        <h2>Últimas Transações</h2>
        <ClientOnly>
          {transactions.length > 0 ? (
            <ul>
              {transactions.slice(0, 5).map((t) => (
                <li key={t.id} className={`transaction-item ${t.type}`}>
                  <span>{t.title}</span>
                  <span
                    style={{
                      color:
                        t.type === "income"
                          ? "var(--color-success)"
                          : "var(--color-danger)",
                    }}
                  >
                    {t.type === "income" ? "+" : "-"} R${" "}
                    {t.amount.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma transação encontrada para o filtro selecionado.</p>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}
