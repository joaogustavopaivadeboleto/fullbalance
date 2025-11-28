// src/app/(main)/transactions/page.tsx - VERSÃO FINAL COM PAGINAÇÃO

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import AddTransactionForm from "@/components/Transactions/AddTransactionForm";
import AddAccountForm from "@/components/Accounts/AddAccountForm";
import Modal from "@/components/ui/Modal";
import ClientOnly from "@/components/ui/ClientOnly";
import CustomDatePicker from "@/components/ui/datepicker/CustomDatePicker";
import ActiveFilterBadge from "@/components/ui/ActiveFilterBadge";
import PaginationControls from "@/components/ui/PaginationControls"; // <<< 1. Importar o componente de paginação
import {
  FiEdit,
  FiPlus,
  FiTrash2,
  FiXCircle,
  FiHome,
  FiDownload,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
export default function TransactionsPage() {
  // Hooks para buscar dados
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

  // Estados dos Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterAccountId, setFilterAccountId] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // <<< 2. ADICIONAR ESTADOS DE PAGINAÇÃO >>>
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Lógica de Filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterAccountId("all");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const isAnyFilterActive =
    searchTerm !== "" ||
    filterType !== "all" ||
    filterAccountId !== "all" ||
    startDate !== undefined ||
    endDate !== undefined;

  const filteredTransactions = useMemo(() => {
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;
    return allTransactions.filter((transaction) => {
      const transactionDate = transaction.date.toDate();
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
      if (startDate && transactionDate < startDate) return false;
      if (end && transactionDate > end) return false;
      return true;
    });
  }, [
    allTransactions,
    searchTerm,
    filterType,
    filterAccountId,
    startDate,
    endDate,
  ]);

  // <<< 3. LÓGICA PARA CALCULAR A PÁGINA ATUAL >>>
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Efeito para resetar a página para 1 sempre que os filtros ou itens por página mudarem
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    itemsPerPage,
    searchTerm,
    filterType,
    filterAccountId,
    startDate,
    endDate,
  ]);

  const router = useRouter();
  // Handlers para Modais
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

  const accountsMap = useMemo(
    () => new Map(accounts.map((acc) => [acc.id, acc.name])),
    [accounts]
  );
  const isLoading = transactionsLoading || accountsLoading;
  const error = transactionsError || accountsError;

  if (isLoading)
    return <div className="fullscreen-loader">Carregando transações...</div>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Minhas Transações</h1>
        <div className="page-header-actions">
          <button
            onClick={() => router.push("/reports")} // Navega para a página de relatórios
            className="secondary-button"
          >
            <FiDownload />
            Exportar
          </button>
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="secondary-button"
          >
            <FiHome /> Adicionar Conta
          </button>
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
          <CustomDatePicker
            date={startDate}
            setDate={setStartDate}
            placeholder="Data de Início"
          />
        </div>
        <div className="filter-datepicker">
          <CustomDatePicker
            date={endDate}
            setDate={setEndDate}
            placeholder="Data de Fim"
          />
        </div>
        {isAnyFilterActive && (
          <button onClick={handleClearFilters} className="clear-filters-button">
            <FiXCircle /> Limpar Filtros
          </button>
        )}
      </div>

      {isAnyFilterActive && (
        <div className="active-filters-container">
          <p>Filtros ativos:</p>
          {searchTerm && (
            <ActiveFilterBadge
              label={`Busca: "${searchTerm}"`}
              onRemove={() => setSearchTerm("")}
            />
          )}
          {filterType !== "all" && (
            <ActiveFilterBadge
              label={`Tipo: ${filterType === "income" ? "Entrada" : "Saída"}`}
              onRemove={() => setFilterType("all")}
            />
          )}
          {filterAccountId !== "all" && (
            <ActiveFilterBadge
              label={`Conta: ${
                accountsMap.get(filterAccountId) || "Desconhecida"
              }`}
              onRemove={() => setFilterAccountId("all")}
            />
          )}
          {startDate && (
            <ActiveFilterBadge
              label={`Desde: ${startDate.toLocaleDateString("pt-BR")}`}
              onRemove={() => setStartDate(undefined)}
            />
          )}
          {endDate && (
            <ActiveFilterBadge
              label={`Até: ${endDate.toLocaleDateString("pt-BR")}`}
              onRemove={() => setEndDate(undefined)}
            />
          )}
        </div>
      )}

      <div className="table-container">
        <ClientOnly>
          {paginatedTransactions.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                  <th>Conta</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => {
                  const account = accounts.find(
                    (acc) => acc.id === transaction.accountId
                  );
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
                      <td>
                        <span className={`type-badge ${transaction.type}`}>
                          {transaction.type === "income" ? "Entrada" : "Saída"}
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
                      <td>
                        {transaction.category === "initial_balance"
                          ? "Saldo Inicial"
                          : transaction.category || "N/A"}
                      </td>
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

      {filteredTransactions.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={filteredTransactions.length}
          itemsOnCurrentPage={paginatedTransactions.length}
        />
      )}

      <Modal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        title="Adicionar Nova Conta"
      >
        <AddAccountForm onFormSubmit={() => setIsAccountModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={selectedTransaction ? "Editar Transação" : "Adicionar Transação"}
      >
        <AddTransactionForm
          onFormSubmit={closeFormModal}
          transactionToEdit={selectedTransaction}
          // A prop 'transactions' foi removida daqui, o que agora está correto.
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div>
          <p>
            Você tem certeza que deseja excluir a transação "
            <strong>{selectedTransaction?.title}</strong>"?
          </p>
          <p>Esta ação não pode ser desfeita.</p>
          <div className="modal-actions">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="secondary-button"
            >
              Cancelar
            </button>
            <button onClick={handleConfirmDelete} className="danger-button">
              Sim, Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
