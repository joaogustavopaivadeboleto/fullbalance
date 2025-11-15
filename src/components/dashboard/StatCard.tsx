// src/components/dashboard/StatCard.tsx
"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  isCurrency?: boolean;
}

export default function StatCard({
  title,
  value,
  isCurrency = false,
}: StatCardProps) {
  const formattedValue = isCurrency
    ? `R$ ${value.toFixed(2).replace(".", ",")}`
    : value;

  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p>{formattedValue}</p>
    </div>
  );
}
