// src/components/dashboard/AccountBalanceCard.tsx
"use client";

import React from "react";

interface AccountBalanceCardProps {
  name: string;
  balance: number;
  color: string;
}

export default function AccountBalanceCard({
  name,
  balance,
  color,
}: AccountBalanceCardProps) {
  return (
    // Usamos a classe 'stat-card' que já existe e adicionamos uma nova
    <div className="stat-card account-balance-card">
      <div className="account-header">
        <span className="color-dot" style={{ backgroundColor: color }}></span>
        <h3>{name}</h3>
      </div>
      <p>R$ {balance.toFixed(2).replace(".", ",")}</p>
    </div>
  );
}
