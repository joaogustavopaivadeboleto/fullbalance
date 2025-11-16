// src/app/(main)/dashboard/page.tsx - VERSÃO FINAL COM FILTRO DE PERÍODO

"use client";

import React, { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import CustomDatePicker from "@/components/ui/datepicker/CustomDatePicker";
import { FiXCircle } from "react-icons/fi";
import StatCard from "@/components/dashboard/StatCard";
import AccountBalanceCard from "@/components/dashboard/AccountBalanceCard";

export default function DashboardPage() {
  // --- INÍCIO DA MUDANÇA 1: ATUALIZAR ESTADOS DE FILTRO ---
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterAccountId, setFilterAccountId] = useState<string>("all");
  // Substituímos filterDate por startDate e endDate
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  // --- FIM DA MUDANÇA 1 ---

  // Hooks para buscar dados (não muda)
  const { accounts, loading: accountsLoading } = useAccounts();
  const {
    transactions,
    loading: transactionsLoading,
    error,
  } = useTransactions({
    accountId: filterAccountId === "all" ? undefined : filterAccountId,
    type: filterType === "all" ? undefined : filterType,
  });

  // --- INÍCIO DA MUDANÇA 2: ATUALIZAR LIMPEZA DE FILTROS ---
  const handleClearFilters = () => {
    setFilterType("all");
    setFilterAccountId("all");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const isAnyFilterActive =
    filterType !== "all" ||
    filterAccountId !== "all" ||
    startDate !== undefined ||
    endDate !== undefined;
  // --- FIM DA MUDANÇA 2 ---

  // --- INÍCIO DA MUDANÇA 3: ATUALIZAR LÓGICA DE FILTRAGEM DE DATA ---
  const filteredTransactions = useMemo(() => {
    // Ajusta a data final para incluir o dia inteiro
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    return transactions.filter((transaction) => {
      const transactionDate = transaction.date.toDate();
      // Compara se a data da transação está dentro do período
      if (startDate && transactionDate < startDate) return false;
      if (end && transactionDate > end) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);
  // --- FIM DA MUDANÇA 3 ---

  // O resto da lógica (cálculo de stats, accountBalances) não precisa de mudanças,
  // pois já dependem de `filteredTransactions`, que acabamos de corrigir.
  const stats = useMemo(() => {
    // ... (código sem alterações)
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

  const accountBalances = useMemo(() => {
    // ... (código sem alterações)
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
      const balance = accountTransactions.reduce(
        (acc, t) => (t.type === "income" ? acc + t.amount : acc - t.amount),
        0
      );
      const accountDetails = accounts.find((acc) => acc.id === accountId);
      return {
        accountId,
        balance,
        name: accountDetails?.name || "Conta Desconhecida",
        color: accountDetails?.color || "#888",
      };
    });
  }, [filteredTransactions, accounts]);

  const isLoading = accountsLoading || transactionsLoading;
  const latestTransactions = filteredTransactions.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      {/* --- INÍCIO DA MUDANÇA 4: ATUALIZAR JSX DOS FILTROS --- */}
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

        {/* Adiciona os dois seletores de data */}
        <div className="filter-datepicker">
          <CustomDatePicker
            date={startDate}
            setDate={setStartDate}
            placeholder="Data de Início"
          />
        </div>
        <div className="filter-datepicker">
          <CustomDatePicker
            date={endDate}
            setDate={setEndDate}
            placeholder="Data de Fim"
          />
        </div>

        {isAnyFilterActive && (
          <button onClick={handleClearFilters} className="clear-filters-button">
            <FiXCircle />
            Limpar Filtros
          </button>
        )}
      </div>
      {/* --- FIM DA MUDANÇA 4 --- */}

      {isLoading ? (
        <p>Carregando estatísticas...</p>
      ) : error ? (
        <p>Erro: {error}</p>
      ) : (
        <>
          {/* O resto do JSX não precisa de alterações */}
          <div className="stats-grid">
            <StatCard
              title="Saldo Atual (Filtrado)"
              value={stats.balance}
              isCurrency
            />
            {(filterType === "all" || filterType === "income") && (
              <StatCard
                title="Receita Total (Filtrada)"
                value={stats.totalIncome}
                isCurrency
              />
            )}
            {(filterType === "all" || filterType === "expense") && (
              <StatCard
                title="Despesa Total (Filtrada)"
                value={stats.totalExpense}
                isCurrency
              />
            )}
            <StatCard
              title="Nº de Transações (Filtradas)"
              value={stats.count}
            />
          </div>

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
