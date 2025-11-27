// src/components/dashboard/MonthlyExpensesChart.tsx
"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Transaction } from "@/hooks/useTransactions";

// 1. ATUALIZAR A INTERFACE DE PROPS
interface MonthlyExpensesChartProps {
  transactions: Transaction[];
  startDate?: Date; // Data de início do filtro (opcional)
  endDate?: Date;   // Data de fim do filtro (opcional)
}

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function MonthlyExpensesChart({
  transactions,
  startDate,
  endDate,
}: MonthlyExpensesChartProps) {
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { name: string; entradas: number; saidas: number } } = {};
    const today = new Date();

    // 2. LÓGICA PARA DETERMINAR O PERÍODO A SER EXIBIDO
    if (startDate || endDate) {
      // Se houver filtro de data, define o período com base nele
      const start = startDate || new Date(Math.min(...transactions.map(t => t.date.toDate().getTime())));
      const end = endDate || new Date();

      let current = new Date(start.getFullYear(), start.getMonth(), 1);
      while (current <= end) {
        const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
        monthlyData[monthKey] = {
          name: monthNames[current.getMonth()],
          entradas: 0,
          saidas: 0,
        };
        current.setMonth(current.getMonth() + 1);
      }
    } else {
      // Se NÃO houver filtro, mostra os últimos 5 meses
      for (let i = 4; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
        monthlyData[monthKey] = {
          name: monthNames[d.getMonth()],
          entradas: 0,
          saidas: 0,
        };
      }
    }

    // 3. AGRUPA AS TRANSAÇÕES (LÓGICA EXISTENTE)
    transactions.forEach((t) => {
      const date = t.date.toDate();
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyData[monthKey]) {
        if (t.type === "income") {
          monthlyData[monthKey].entradas += t.amount;
        } else {
          monthlyData[monthKey].saidas += t.amount;
        }
      }
    });

    return Object.values(monthlyData);
  }, [transactions, startDate, endDate]);

  return (
    <div className="monthly-expenses-chart-card">
      <h2>Gastos por Mês</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} />
            <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
            <Tooltip
              cursor={{ fill: 'var(--color-border)' }}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
              formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            />
            <Bar dataKey="entradas" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="saidas" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
