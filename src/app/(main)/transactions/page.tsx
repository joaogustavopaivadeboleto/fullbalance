// src/app/(main)/transactions/page.tsx
"use client";

import React, { useState } from "react"; // Importe useState
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import AddTransactionForm from "@/components/Transactions/AddTransactionForm";
import Modal from "@/components/ui/Modal";
import ClientOnly from "@/components/ui/ClientOnly";
// Importe o Modal

export default function TransactionsPage() {
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    deleteTransaction,
  } = useTransactions();
  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();

  // 1. Estados para controlar os modais e a seleção
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const accountsMap = new Map(accounts.map((acc) => [acc.id, acc]));
  const isLoading = transactionsLoading || accountsLoading;
  const error = transactionsError || accountsError;

  // 2. Funções para abrir os modais
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
      try {
        await deleteTransaction(selectedTransaction.id);
        setIsDeleteModalOpen(false);
        setSelectedTransaction(null);
      } catch (e) {
        alert("Erro ao excluir transação.");
      }
    }
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedTransaction(null); // Limpa a seleção ao fechar
  };

  if (isLoading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Minhas Transações</h1>
        {/* Botão para abrir o modal de ADIÇÃO */}
        <button
          onClick={() => {
            setSelectedTransaction(null);
            setIsFormModalOpen(true);
          }}
          className="primary-button"
        >
          Adicionar Nova
        </button>
      </div>

      {/* A lista de transações agora tem os botões de ação */}
      <div className="transactions-list-container">
        <h2>Histórico Completo</h2>
        <ClientOnly>
          <ul>
            {transactions.map((transaction) => {
              const account = accountsMap.get(transaction.accountId);
              return (
                <li
                  key={transaction.id}
                  className={`transaction-item ${transaction.type}`}
                >
                  {account && (
                    <span
                      className="color-dot"
                      style={{ backgroundColor: account.color }}
                      title={account.name}
                    ></span>
                  )}
                  <div className="transaction-details">
                    <strong>{transaction.title}</strong>
                    <small>
                      {new Date(transaction.date.toDate()).toLocaleDateString(
                        "pt-BR"
                      )}{" "}
                      • {account?.name}
                    </small>
                  </div>
                  <span className="transaction-amount">
                    {transaction.type === "income" ? "+" : "-"} R${" "}
                    {transaction.amount.toFixed(2).replace(".", ",")}
                  </span>

                  {/* 3. Botões de Ação */}
                  <div className="transaction-actions">
                    <button onClick={() => handleOpenEditModal(transaction)}>
                      Editar
                    </button>
                    <button onClick={() => handleOpenDeleteModal(transaction)}>
                      Excluir
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {transactions.length === 0 && <p>Nenhuma transação encontrada.</p>}
        </ClientOnly>
      </div>

      {/* 4. Modal para o Formulário (Adicionar/Editar) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={selectedTransaction ? "Editar Transação" : "Adicionar Transação"}
      >
        <AddTransactionForm
          onFormSubmit={closeFormModal}
          transactionToEdit={selectedTransaction}
        />
      </Modal>

      {/* 5. Modal para Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <p>
          Você tem certeza que deseja excluir a transação "
          {selectedTransaction?.title}"?
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
      </Modal>
    </div>
  );
}
