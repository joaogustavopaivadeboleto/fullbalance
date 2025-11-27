// src/components/dashboard/MonthlySummaryCard.tsx
import React, { useMemo } from 'react';
import { Transaction } from '@/hooks/useTransactions';

interface MonthlySummaryCardProps {
  transactions: Transaction[];
}

export default function MonthlySummaryCard({ transactions }: MonthlySummaryCardProps) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const data = transactions.reduce((acc, t) => {
      const date = t.date.toDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      // Considera apenas transações dos últimos 12 meses
      const monthDiff = (currentYear - year) * 12 + (currentMonth - month);
      if (monthDiff < 0 || monthDiff >= 12) {
        return acc;
      }

      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        acc[monthKey].income += t.amount;
      } else {
        acc[monthKey].expense += t.amount;
      }

      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    // Ordena e formata os dados
    return Object.entries(data)
      .sort(([keyA], [keyB]) => keyB.localeCompare(keyA)) // Mais recente primeiro
      .slice(0, 6) // Pega os últimos 6 meses com atividade
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        const date = new Date(Number(year), Number(month) - 1);
        const monthName = date.toLocaleString('pt-BR', { month: 'long' });
        return {
          monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          ...value,
        };
      });
  }, [transactions]);

  return (
    <div className="monthly-summary-card">
      <h2>Resumo Mensal</h2>
      {monthlyData.length > 0 ? (
        <ul>
          {monthlyData.map(data => (
            <li key={data.monthName}>
              <span className="month-name">{data.monthName}</span>
              <div className="monthly-values">
                <span className="income">
                  + R$ {data.income.toFixed(2).replace('.', ',')}
                </span>
                <span className="expense">
                  - R$ {data.expense.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state-text">Sem dados para exibir.</p>
      )}
    </div>
  );
}
