// src/app/(main)/dashboard/page.tsx - VERSÃO FINAL COMPLETA E AJUSTADA

"use client";

import React, { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import CustomDatePicker from "@/components/ui/datepicker/CustomDatePicker";
import { FiXCircle } from "react-icons/fi";
import StatCard from "@/components/dashboard/StatCard";
import AccountBalanceCard from "@/components/dashboard/AccountBalanceCard"; // Importa o novo card

export default function DashboardPage() {
  // Estados para os filtros
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterAccountId, setFilterAccountId] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  // Hooks para buscar dados
  const { accounts, loading: accountsLoading } = useAccounts();
  const {
    transactions,
    loading: transactionsLoading,
    error,
  } = useTransactions({
    // Passa os filtros para o hook, exceto a data que é tratada no cliente
    accountId: filterAccountId === "all" ? undefined : filterAccountId,
    type: filterType === "all" ? undefined : filterType,
  });

  // Função para limpar os filtros
  const handleClearFilters = () => {
    setFilterType("all");
    setFilterAccountId("all");
    setFilterDate(undefined);
  };

  const isAnyFilterActive =
    filterType !== "all" ||
    filterAccountId !== "all" ||
    filterDate !== undefined;

  // Lógica de filtragem final no cliente (para a data)
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (!filterDate) return true;
      const transactionDate = transaction.date.toDate();
      return (
        transactionDate.getFullYear() === filterDate.getFullYear() &&
        transactionDate.getMonth() === filterDate.getMonth() &&
        transactionDate.getDate() === filterDate.getDate()
      );
    });
  }, [transactions, filterDate]);

  // Cálculo das estatísticas gerais
  const stats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return {
      balance,
      totalIncome,
      totalExpense,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // --- INÍCIO DA NOVA LÓGICA: CALCULAR SALDOS POR CONTA ---
  const accountBalances = useMemo(() => {
    const transactionsByAccount = filteredTransactions.reduce(
      (acc, transaction) => {
        const { accountId } = transaction;
        if (!acc[accountId]) {
          acc[accountId] = [];
        }
        acc[accountId].push(transaction);
        return acc;
      },
      {} as Record<string, typeof filteredTransactions>
    );

    return Object.keys(transactionsByAccount).map((accountId) => {
      const accountTransactions = transactionsByAccount[accountId];
      const balance = accountTransactions.reduce((acc, t) => {
        return t.type === "income" ? acc + t.amount : acc - t.amount;
      }, 0);

      const accountDetails = accounts.find((acc) => acc.id === accountId);

      return {
        accountId,
        balance,
        name: accountDetails?.name || "Conta Desconhecida",
        color: accountDetails?.color || "#888",
      };
    });
  }, [filteredTransactions, accounts]);
  // --- FIM DA NOVA LÓGICA ---

  const isLoading = accountsLoading || transactionsLoading;
  const latestTransactions = filteredTransactions.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="all">Todos os Tipos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
        <select
          className="filter-select"
          value={filterAccountId}
          onChange={(e) => setFilterAccountId(e.target.value)}
        >
          <option value="all">Todas as Contas</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
        <div className="filter-datepicker">
          <CustomDatePicker date={filterDate} setDate={setFilterDate} />
        </div>
        {isAnyFilterActive && (
          <button onClick={handleClearFilters} className="clear-filters-button">
            <FiXCircle />
            Limpar Filtros
          </button>
        )}
      </div>

      {isLoading ? (
        <p>Carregando estatísticas...</p>
      ) : error ? (
        <p>Erro: {error}</p>
      ) : (
        <>
          {/* Estatísticas Gerais */}
          <div className="stats-grid">
            <StatCard
              title="Saldo Atual (Filtrado)"
              value={stats.balance}
              isCurrency
            />
            <StatCard
              title="Receita Total (Filtrada)"
              value={stats.totalIncome}
              isCurrency
            />
            <StatCard
              title="Despesa Total (Filtrada)"
              value={stats.totalExpense}
              isCurrency
            />
            <StatCard
              title="Nº de Transações (Filtradas)"
              value={stats.count}
            />
          </div>

          {/* --- INÍCIO DA NOVA SEÇÃO RENDERIZADA --- */}
          <div className="account-balances-section">
            <h2>Saldos por Conta</h2>
            {accountBalances.length > 0 ? (
              <div className="stats-grid">
                {accountBalances.map((acc) => (
                  <AccountBalanceCard
                    key={acc.accountId}
                    name={acc.name}
                    balance={acc.balance}
                    color={acc.color}
                  />
                ))}
              </div>
            ) : (
              <p className="empty-state-text">
                Nenhuma transação encontrada para exibir os saldos das contas.
              </p>
            )}
          </div>
          {/* --- FIM DA NOVA SEÇÃO RENDERIZADA --- */}

          {/* Últimas Transações */}
          <div className="latest-transactions">
            <h2>Últimas Transações (Filtradas)</h2>
            {latestTransactions.length > 0 ? (
              <ul>
                {latestTransactions.map((t) => (
                  <li key={t.id}>
                    <span>{t.title}</span>
                    <span
                      style={{
                        color:
                          t.type === "income"
                            ? "var(--color-success)"
                            : "var(--color-danger)",
                      }}
                    >
                      {t.type === "income" ? "+ " : "- "}
                      R$ {t.amount.toFixed(2).replace(".", ",")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state-text">
                Nenhuma transação encontrada para os filtros selecionados.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
