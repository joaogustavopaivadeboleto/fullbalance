// src/app/(main)/dashboard/page.tsx - VERSÃO FINAL COM NAVEGAÇÃO

"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // <<< PASSO 1: IMPORTAR O ROUTER
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import CustomDatePicker from "@/components/ui/datepicker/CustomDatePicker";
import StatCard from "@/components/dashboard/StatCard";
import AccountBalanceCard from "@/components/dashboard/AccountBalanceCard";
import RecentTransactionsList from "@/components/dashboard/RecentTransactionsList";
import MonthlySummaryCard from "@/components/dashboard/MonthlySummaryCard";
import ActiveFilterBadge from "@/components/ui/ActiveFilterBadge";
import MonthlyExpensesChart from "@/components/dashboard/MonthlyExpensesChart";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiHash,
  FiXCircle,
  FiDownload,
  FiPlus,
} from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter(); // <<< PASSO 2: CRIAR A INSTÂNCIA DO ROUTER

  // --- ESTADOS E HOOKS (sem mudanças) ---
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterAccountId, setFilterAccountId] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { accounts, loading: accountsLoading } = useAccounts();
  const {
    transactions,
    loading: transactionsLoading,
    error,
  } = useTransactions();

  // --- LÓGICA DE FILTRAGEM (sem mudanças) ---
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

  const filteredTransactions = useMemo(() => {
    const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;
    return transactions.filter((transaction) => {
      const transactionDate = transaction.date.toDate();
      if (filterType !== "all" && transaction.type !== filterType) return false;
      if (filterAccountId !== "all" && transaction.accountId !== filterAccountId) return false;
      if (startDate && transactionDate < startDate) return false;
      if (end && transactionDate > end) return false;
      return true;
    });
  }, [transactions, filterType, filterAccountId, startDate, endDate]);

  // --- CÁLCULOS (sem mudanças) ---
  const stats = useMemo(() => {
    const initialBalanceTransaction = transactions.find(t => t.category === 'saldo inicial');
    const initialBalanceValue = initialBalanceTransaction ? initialBalanceTransaction.amount : 0;

    const flowTransactionsInPeriod = filteredTransactions.filter(t => t.category !== 'saldo inicial');
    const totalIncomeInPeriod = flowTransactionsInPeriod.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const totalExpenseInPeriod = flowTransactionsInPeriod.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);

    const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : new Date();
    const transactionsUntilEndDate = transactions.filter(t => t.date.toDate() <= end);
    const accumulatedBalance = transactionsUntilEndDate.reduce((acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount), 0);

    return {
      balance: accumulatedBalance,
      totalIncome: totalIncomeInPeriod,
      totalExpense: totalExpenseInPeriod,
      count: flowTransactionsInPeriod.length,
      initialBalance: initialBalanceValue,
    };
  }, [filteredTransactions, transactions, endDate]);

  const percentageChanges = useMemo(() => {
    const initialBalance = stats.initialBalance;
    if (initialBalance === 0) return { balanceChange: 0, incomeChange: 0, expenseChange: 0 };
    const balanceChange = ((stats.balance - initialBalance) / initialBalance) * 100;
    const incomeChange = (stats.totalIncome / initialBalance) * 100;
    const expenseChange = (stats.totalExpense / initialBalance) * -100;
    return {
      balanceChange: Math.round(balanceChange),
      incomeChange: Math.round(incomeChange),
      expenseChange: Math.round(expenseChange),
    };
  }, [stats]);

  const accountBalances = useMemo(() => {
    const transactionsByAccount = filteredTransactions.reduce((acc, transaction) => {
        const { accountId } = transaction;
        if (!acc[accountId]) acc[accountId] = [];
        acc[accountId].push(transaction);
        return acc;
      }, {} as Record<string, typeof filteredTransactions>);
    return Object.keys(transactionsByAccount).map((accountId) => {
      const accountTransactions = transactionsByAccount[accountId];
      const balance = accountTransactions.reduce((acc, t) => (t.type === "income" ? acc + t.amount : acc - t.amount), 0);
      const accountDetails = accounts.find((acc) => acc.id === accountId);
      return { accountId, balance, name: accountDetails?.name || "Conta Desconhecida", color: accountDetails?.color || "#888" };
    });
  }, [filteredTransactions, accounts]);

  const accountsMap = useMemo(() => new Map(accounts.map((acc) => [acc.id, acc.name])), [accounts]);
  const isLoading = accountsLoading || transactionsLoading;
  const latestTransactions = filteredTransactions.filter(t => t.category !== 'saldo inicial').slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        {/* --- INÍCIO DA CORREÇÃO --- */}
        <div className="page-header-actions">
          <button
            onClick={() => router.push('/reports')} // Navega para a página de relatórios
            className="secondary-button"
          >
            <FiDownload />
            Exportar
          </button>
          <button
            onClick={() => router.push('/transactions')} // Navega para a página de transações
            className="primary-button"
          >
            <FiPlus />
            Nova Transação
          </button>
        </div>
        {/* --- FIM DA CORREÇÃO --- */}
      </div>

      {/* O resto do JSX permanece o mesmo */}
      <div className="filter-bar">
        <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
          <option value="all">Todos os Tipos</option>
          <option value="income">Entradas</option>
          <option value="expense">Saídas</option>
        </select>
        <select className="filter-select" value={filterAccountId} onChange={(e) => setFilterAccountId(e.target.value)}>
          <option value="all">Todas as Contas</option>
          {accounts.map((acc) => (<option key={acc.id} value={acc.id}>{acc.name}</option>))}
        </select>
        <div className="filter-datepicker"><CustomDatePicker date={startDate} setDate={setStartDate} placeholder="Data de Início" /></div>
        <div className="filter-datepicker"><CustomDatePicker date={endDate} setDate={setEndDate} placeholder="Data de Fim" /></div>
        {isAnyFilterActive && (<button onClick={handleClearFilters} className="clear-filters-button"><FiXCircle /> Limpar Filtros</button>)}
      </div>

      {isAnyFilterActive && (
        <div className="active-filters-container">
          <p>Filtros ativos:</p>
          {filterType !== "all" && (<ActiveFilterBadge label={`Tipo: ${filterType === "income" ? "Entrada" : "Saída"}`} onRemove={() => setFilterType("all")} />)}
          {filterAccountId !== "all" && (<ActiveFilterBadge label={`Conta: ${accountsMap.get(filterAccountId) || "Desconhecida"}`} onRemove={() => setFilterAccountId("all")} />)}
          {startDate && (<ActiveFilterBadge label={`Desde: ${startDate.toLocaleDateString("pt-BR")}`} onRemove={() => setStartDate(undefined)} />)}
          {endDate && (<ActiveFilterBadge label={`Até: ${endDate.toLocaleDateString("pt-BR")}`} onRemove={() => setEndDate(undefined)} />)}
        </div>
      )}

      {isLoading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>Erro: {error}</p>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              title="Saldo Atual"
              value={stats.balance}
              icon={<FiDollarSign />}
              change={percentageChanges.balanceChange}
            />
            <StatCard
              title="Total de Entradas"
              value={stats.totalIncome}
              icon={<FiTrendingUp />}
              change={percentageChanges.incomeChange}
            />
            <StatCard
              title="Total de Saídas"
              value={stats.totalExpense}
              icon={<FiTrendingDown />}
              change={percentageChanges.expenseChange}
            />
            <StatCard
              title="Transações"
              value={stats.count}
              icon={<FiHash />}
            />
          </div>

          <div className="dashboard-main-layout">
            <div className="dashboard-left-column vertical-card-layout">
              <MonthlyExpensesChart
                transactions={filteredTransactions}
                startDate={startDate}
                endDate={endDate}
              />
              <RecentTransactionsList
                transactions={latestTransactions}
                accounts={accounts}
              />
            </div>
            <div className="dashboard-right-column">
              <div className="account-balances-section">
                <h2>Saldos por Conta</h2>
                {accountBalances.length > 0 ? (
                  accountBalances.map((acc) => (
                    <AccountBalanceCard key={acc.accountId} name={acc.name} balance={acc.balance} color={acc.color} />
                  ))
                ) : (
                  <p className="empty-state-text">Nenhuma transação encontrada.</p>
                )}
              </div>
              <MonthlySummaryCard transactions={transactions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
