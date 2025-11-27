// src/components/dashboard/StatCard.tsx

import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

// 1. ATUALIZAR A INTERFACE DE PROPS
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number; // <-- OPCIONAL
}

// Função para formatar valores como moeda
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function StatCard({ title, value, icon, change }: StatCardProps) {
  // 2. DETERMINAR SE A VARIAÇÃO É POSITIVA
  const isPositive = change !== undefined && change >= 0;

  return (
    // 3. NOVA ESTRUTURA JSX
    <div className="stat-card">
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        <p className="card-value">
          {/* O card de "Transações" não é moeda */}
          {title === "Transações" ? value : formatCurrency(value)}
        </p>
        {/* Renderiza o badge de porcentagem apenas se 'change' for fornecido */}
        {change !== undefined && (
          <div
            className={`percentage-badge ${
              isPositive ? "positive" : "negative"
            }`}
          >
            {isPositive ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
