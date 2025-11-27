// src/components/Transactions/AddTransactionForm.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { Timestamp } from "firebase/firestore";
import FormField from "../forms/FormField";
import CustomDatePicker from "../ui/datepicker/CustomDatePicker";

interface AddTransactionFormProps {
  onFormSubmit: () => void;
  transactionToEdit?: Transaction | null;
  transactions: Transaction[]; // Recebe a lista de transações para verificar o saldo inicial
}

export default function AddTransactionForm({
  onFormSubmit,
  transactionToEdit,
  transactions,
}: AddTransactionFormProps) {
  const { addTransaction, updateTransaction } = useTransactions();
  const { accounts } = useAccounts();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isInitialBalance, setIsInitialBalance] = useState(false); // Estado para o checkbox
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verifica se já existe uma transação de "Saldo Inicial"
  const hasInitialBalance = useMemo(
    () => (transactions || []).some((t) => t.category === "initial_balance"),
    [transactions]
  );

  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount);
      setDate(new Date(transactionToEdit.date.toDate()));
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
      setAccountId(transactionToEdit.accountId);
      setIsInitialBalance(transactionToEdit.category === "initial_balance");
    } else {
      // Reseta para nova transação
      setTitle("");
      setAmount("");
      setDate(new Date());
      setType("expense");
      setCategory("");
      setAccountId(accounts.length > 0 ? accounts[0].id : "");
      setIsInitialBalance(false);
    }
  }, [transactionToEdit, accounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount === "" || Number(amount) <= 0) {
      setError("O valor da transação deve ser maior que zero.");
      return;
    }
    if (!accountId) {
      setError("Por favor, selecione uma conta.");
      return;
    }
    if (!date) {
      setError("Por favor, selecione uma data.");
      return;
    }
    if (!isInitialBalance && !title) {
      setError("O título da transação é obrigatório.");
      return;
    }

    setIsSubmitting(true);

    const transactionData = {
      title: isInitialBalance ? "Saldo Inicial" : title,
      amount: Number(amount),
      date: Timestamp.fromDate(date),
      type: isInitialBalance ? "income" : type, // Saldo inicial é sempre uma entrada
      category: isInitialBalance ? "initial_balance" : category,
      accountId,
    };

    try {
      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      onFormSubmit();
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      setError("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-layout">
      {/* Checkbox para Saldo Inicial (só aparece se não houver um e não for edição) */}
      {!transactionToEdit && !hasInitialBalance && (
        <div className="form-field full-width">
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isInitialBalance}
              onChange={(e) => setIsInitialBalance(e.target.checked)}
            />
            Definir como Saldo Inicial da Carteira
          </label>
        </div>
      )}

      {/* Esconde Título e Tipo se for Saldo Inicial */}
      {!isInitialBalance && (
        <>
          <div className="full-width">
            <FormField label="Título da Transação" htmlFor="title">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Salário, Aluguel"
              />
            </FormField>
          </div>
          <FormField label="Tipo" htmlFor="type">
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as "income" | "expense")}
            >
              <option value="expense">Saída</option>
              <option value="income">Entrada</option>
            </select>
          </FormField>
        </>
      )}

      <FormField label="Valor" htmlFor="amount">
        <input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="0,00"
        />
      </FormField>

      <FormField label="Conta" htmlFor="accountId">
        <select
          id="accountId"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          <option value="" disabled>Selecione uma conta</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
      </FormField>

      {!isInitialBalance && (
        <FormField label="Categoria" htmlFor="category">
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Moradia, Transporte"
          />
        </FormField>
      )}

      <div className="datepicker-wrapper">
        <label>Data da Transação</label>
        <CustomDatePicker date={date} setDate={setDate} />
      </div>

      {error && <p className="form-error full-width">{error}</p>}

      <div className="form-actions full-width">
        <button type="button" onClick={onFormSubmit} className="secondary-button">
          Cancelar
        </button>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : transactionToEdit ? "Salvar Alterações" : "Adicionar"}
        </button>
      </div>
    </form>
  );
}
