// src/components/dashboard/RecentTransactionsList.tsx
import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Transaction } from "@/hooks/useTransactions";
import { Account } from "@/hooks/useAccounts";
import { getCategoryIcon } from "@/utils/categoryIcons"; // 1. IMPORTE O UTILITÁRIO

// Função para formatar a data de forma relativa (Hoje, Ontem, X dias atrás)
const formatRelativeDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

interface RecentTransactionsListProps {
  transactions: Transaction[];
  accounts: Account[];
}

export default function RecentTransactionsList({
  transactions,
  accounts,
}: RecentTransactionsListProps) {
  const accountsMap = new Map(accounts.map((acc) => [acc.id, acc.name]));

  return (
    <div className="recent-transactions-card">
      <div className="card-header">
        <h2>Transações Recentes</h2>
        <Link href="/transactions" className="view-all-link">
          Ver todas <FiArrowRight size={14} />
        </Link>
      </div>

      {transactions.length > 0 ? (
        <ul className="transactions-list">
          {transactions.map((t) => {
            const accountName = accountsMap.get(t.accountId) || "N/A";
            const transactionDate = t.date.toDate();

            return (
              <li key={t.id} className="transaction-item">
                {/* 1. Ícone primeiro */}
                <div className="transaction-icon">
                  {getCategoryIcon(t.category || t.title)}
                </div>

                {/* 2. Detalhes no meio (este vai crescer) */}
                <div className="transaction-details">
                  <span className="transaction-title">{t.title}</span>
                  <span className="transaction-meta">
                    {t.category || "Sem categoria"} • {accountName} •{" "}
                    {formatRelativeDate(transactionDate)}
                  </span>
                </div>

                {/* 3. Valor por último */}
                <span className={`transaction-amount ${t.type}`}>
                  {t.type === "income" ? "+ " : "- "}
                  {t.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty-state-text">
          Nenhuma transação recente para exibir.
        </p>
      )}
    </div>
  );
}
