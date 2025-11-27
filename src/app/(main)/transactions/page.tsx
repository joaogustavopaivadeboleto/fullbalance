// src/app/(main)/transactions/page.tsx - VERSÃO FINAL COM TERMINOLOGIA AJUSTADA
"use client";

import React, { useState, useMemo } from "react";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import AddTransactionForm from "@/components/Transactions/AddTransactionForm";
import Modal from "@/components/ui/Modal";
import ClientOnly from "@/components/ui/ClientOnly";
import CustomDatePicker from "@/components/ui/datepicker/CustomDatePicker";
import { FiEdit, FiPlus, FiTrash2, FiXCircle } from "react-icons/fi";

export default function TransactionsPage() {
  const {
    transactions: allTransactions,
    loading: transactionsLoading,
    error: transactionsError,
    deleteTransaction,
  } = useTransactions();
  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterAccountId, setFilterAccountId] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  const isAnyFilterActive =
    searchTerm !== "" ||
    filterType !== "all" ||
    filterAccountId !== "all" ||
    filterDate !== undefined;
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterAccountId("all");
    setFilterDate(undefined);
  };

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date.toDate());

      if (
        searchTerm &&
        !transaction.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      if (filterType !== "all" && transaction.type !== filterType) return false;
      if (
        filterAccountId !== "all" &&
        transaction.accountId !== filterAccountId
      )
        return false;

      if (filterDate) {
        if (
          transactionDate.getUTCFullYear() !== filterDate.getUTCFullYear() ||
          transactionDate.getUTCMonth() !== filterDate.getUTCMonth() ||
          transactionDate.getUTCDate() !== filterDate.getUTCDate()
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allTransactions, searchTerm, filterType, filterAccountId, filterDate]);

  const handleOpenEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormModalOpen(true);
  };
  const handleOpenDeleteModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (selectedTransaction) {
      await deleteTransaction(selectedTransaction.id);
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    }
  };
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedTransaction(null);
  };

  const accountsMap = new Map(accounts.map((acc) => [acc.id, acc]));
  const isLoading = transactionsLoading || accountsLoading;
  const error = transactionsError || accountsError;

  if (isLoading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Minhas Transações</h1>
        <button
          onClick={() => {
            setSelectedTransaction(null);
            setIsFormModalOpen(true);
          }}
          className="primary-button"
        >
          <FiPlus /> Adicionar Nova
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Pesquisar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-field"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="filter-select"
        >
          <option value="all">Todos os Tipos</option>
          {/* --- MUDANÇA AQUI --- */}
          <option value="income">Entradas</option>
          <option value="expense">Saídas</option>
        </select>
        <select
          value={filterAccountId}
          onChange={(e) => setFilterAccountId(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todas as Contas</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        <div className="filter-datepicker">
          <CustomDatePicker date={filterDate} setDate={setFilterDate} placeholder="Filtrar por data" />
        </div>

        {isAnyFilterActive && (
          <button onClick={handleClearFilters} className="clear-filters-button">
            <FiXCircle style={{ marginRight: "4px" }} />
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="table-container">
        <ClientOnly>
          {filteredTransactions.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Valor</th>
                  <th>Tipo</th> {/* Adicionando a coluna Tipo */}
                  <th>Conta</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const account = accountsMap.get(transaction.accountId);
                  return (
                    <tr key={transaction.id}>
                      <td>{transaction.title}</td>
                      <td
                        className="transaction-amount"
                        style={{
                          color:
                            transaction.type === "income"
                              ? "var(--color-success)"
                              : "var(--color-danger)",
                        }}
                      >
                        {transaction.type === "income" ? "+ " : "- "}
                        R$ {transaction.amount.toFixed(2).replace(".", ",")}
                      </td>
                      {/* --- MUDANÇA AQUI --- */}
                      <td>
                        <span className={`type-badge ${transaction.type}`}>
                          {transaction.type === 'income' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td>
                        {account && (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span
                              className="status-indicator"
                              style={{ backgroundColor: account.color }}
                            ></span>
                            {account.name}
                          </div>
                        )}
                      </td>
                      <td>{transaction.category || "N/A"}</td>
                      <td>
                        {new Date(transaction.date.toDate()).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="transaction-actions">
                        <button
                          className="edit"
                          onClick={() => handleOpenEditModal(transaction)}
                          title="Editar"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="trash"
                          onClick={() => handleOpenDeleteModal(transaction)}
                          title="Excluir"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>Nenhuma transação encontrada para os filtros selecionados.</p>
            </div>
          )}
        </ClientOnly>
      </div>

      <Modal
  isOpen={isFormModalOpen}
  onClose={closeFormModal}
  title={selectedTransaction ? "Editar Transação" : "Adicionar Transação"}
>
  {/* 
    Renderiza um loader simples enquanto as transações carregam, 
    ou o formulário quando estiverem prontas.
  */}
  {transactionsLoading ? (
    <p>Carregando formulário...</p>
  ) : (
    <AddTransactionForm
      onFormSubmit={closeFormModal}
      transactionToEdit={selectedTransaction}
      transactions={allTransactions}
    />
  )}
</Modal>
    </div>
  );
}
