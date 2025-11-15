// src/app/(main)/reports/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { FiDownload } from "react-icons/fi";
import CustomDatePicker from "@/components/ui/datepicker/CustomDatePicker"; // Importa o componente de data

export default function ReportsPage() {
  // Hooks para buscar os dados
  const { transactions: allTransactions, loading: transactionsLoading } =
    useTransactions();
  const { accounts, loading: accountsLoading } = useAccounts();
  const accountsMap = new Map(accounts.map((acc) => [acc.id, acc]));

  // Estados para os filtros do relatório (com datas ajustadas)
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterAccountId, setFilterAccountId] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  // Lógica para filtrar as transações com base nos seletores (ajustada para objetos Date)
  const filteredTransactions = useMemo(() => {
    // Define o final do dia para a data final para incluir todas as transações daquele dia
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    return allTransactions.filter((transaction) => {
      const transactionDate = transaction.date.toDate();
      if (filterType !== "all" && transaction.type !== filterType) return false;
      if (
        filterAccountId !== "all" &&
        transaction.accountId !== filterAccountId
      )
        return false;
      // Compara diretamente os objetos Date
      if (startDate && transactionDate < startDate) return false;
      if (end && transactionDate > end) return false;
      return true;
    });
  }, [allTransactions, filterType, filterAccountId, startDate, endDate]);

  // Função para gerar e baixar o relatório CSV
  const handleGenerateReport = () => {
    if (filteredTransactions.length === 0) {
      alert(
        "Nenhuma transação encontrada para os filtros selecionados. Nenhum relatório foi gerado."
      );
      return;
    }

    setIsGenerating(true);

    const headers = [
      "ID da Transação",
      "Título",
      "Valor",
      "Tipo",
      "Categoria",
      "Data",
      "ID da Conta",
      "Nome da Conta",
    ];

    const rows = filteredTransactions.map((t) => {
      const account = accountsMap.get(t.accountId);
      return [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount.toFixed(2).replace(".", ","),
        t.type === "income" ? "Receita" : "Despesa",
        `"${t.category.replace(/"/g, '""')}"`,
        t.date.toDate().toLocaleDateString("pt-BR"),
        t.accountId,
        `"${account?.name.replace(/"/g, '""') || "N/A"}"`,
      ].join(";");
    });

    const csvContent = [headers.join(";"), ...rows].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_fullbalance_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  const isLoading = transactionsLoading || accountsLoading;

  return (
    <div>
      <div className="page-header">
        <h1>Relatórios</h1>
      </div>

      <section className="settings-section">
        <h2>Gerar Relatório de Transações</h2>
        <p>
          Selecione os filtros desejados e clique em "Gerar Relatório" para
          baixar um arquivo CSV com os dados.
        </p>

        {isLoading ? (
          <p>Carregando dados para os filtros...</p>
        ) : (
          <div className="report-filters">
            {/* Filtros com o CustomDatePicker */}
            <div className="form-field">
              <label>Período (Início)</label>
              <CustomDatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="form-field">
              <label>Período (Fim)</label>
              <CustomDatePicker date={endDate} setDate={setEndDate} />
            </div>
            <div className="form-field">
              <label>Tipo de Transação</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="all">Todos os Tipos</option>
                <option value="income">Apenas Receitas</option>
                <option value="expense">Apenas Despesas</option>
              </select>
            </div>
            <div className="form-field">
              <label>Conta</label>
              <select
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
            </div>
          </div>
        )}

        <div className="report-actions">
          <p>
            {filteredTransactions.length} transação(ões) encontrada(s) para os
            filtros selecionados.
          </p>
          <button
            onClick={handleGenerateReport}
            className="primary-button"
            disabled={isGenerating || isLoading}
          >
            <FiDownload />
            {isGenerating ? "Gerando..." : "Gerar Relatório"}
          </button>
        </div>
      </section>
    </div>
  );
}
