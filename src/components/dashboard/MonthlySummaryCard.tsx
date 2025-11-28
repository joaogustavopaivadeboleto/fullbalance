// src/components/dashboard/MonthlySummaryCard.tsx

"use client";

import React, { useMemo } from "react";
import { Transaction } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Interface para definir a estrutura do nosso resumo mensal
interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

interface MonthlySummaryCardProps {
  transactions: Transaction[];
  isFilterActive: boolean;
}

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function MonthlySummaryCard({
  transactions,
  isFilterActive,
}: MonthlySummaryCardProps) {
  const monthlySummaries = useMemo(() => {
    // 1. Agrupa as transações por mês/ano
    const summaryMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((transaction) => {
      // Cria uma chave única para cada mês/ano (ex: "2025-11")
      const monthKey = format(transaction.date.toDate(), "yyyy-MM");

      if (!summaryMap.has(monthKey)) {
        summaryMap.set(monthKey, { income: 0, expense: 0 });
      }

      const currentMonth = summaryMap.get(monthKey)!;

      if (transaction.type === "income") {
        currentMonth.income += transaction.amount;
      } else {
        currentMonth.expense += transaction.amount;
      }
    });

    // 2. Converte o mapa em um array de objetos e formata o nome do mês
    const summaries: MonthlySummary[] = Array.from(summaryMap.entries()).map(
      ([monthKey, values]) => {
        const date = new Date(`${monthKey}-02`); // Usamos dia 02 para evitar bugs de fuso horário
        const monthName = format(date, "MMMM", { locale: ptBR });
        // Capitaliza a primeira letra do mês
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

        return {
          month: `${capitalizedMonth} ${format(date, "yyyy")}`,
          ...values,
        };
      }
    );

    // 3. Ordena os meses do mais recente para o mais antigo
    return summaries.sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

  }, [transactions]);

  // 4. Lógica para decidir quais resumos mostrar
  const displayedSummaries = useMemo(() => {
    if (isFilterActive) {
      return monthlySummaries; // Se houver filtro, mostra todos os meses do período
    }
    // Se não houver filtro, encontra o resumo do mês atual
    const now = new Date();
    const currentMonthKey = `${format(now, "MMMM", { locale: ptBR })} ${now.getFullYear()}`;
    const capitalizedCurrentMonth = currentMonthKey.charAt(0).toUpperCase() + currentMonthKey.slice(1);
    
    return monthlySummaries.filter(summary => summary.month === capitalizedCurrentMonth);

  }, [monthlySummaries, isFilterActive]);

  return (
    <div className="monthly-summary-card">
      <h2>Resumo Mensal</h2>
      {displayedSummaries.length > 0 ? (
        <ul>
          {displayedSummaries.map((summary) => (
            <li key={summary.month}>
              <span className="month-name">{summary.month.split(' ')[0]}</span>
              <div className="monthly-values">
                <span className="income">
                  + {formatCurrency(summary.income)}
                </span>
                <span className="expense">
                  - {formatCurrency(summary.expense)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state-text">
          Nenhuma transação encontrada para o período.
        </p>
      )}
    </div>
  );
}
