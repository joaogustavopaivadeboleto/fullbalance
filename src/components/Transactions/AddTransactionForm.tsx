// src/components/Transactions/AddTransactionForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { Timestamp } from "firebase/firestore";
import FormField from "../forms/FormField";
// --- INÍCIO DA MUDANÇA 1 ---
import CustomDatePicker from "../ui/datepicker/CustomDatePicker"; // Importe o novo componente
// --- FIM DA MUDANÇA 1 ---

interface AddTransactionFormProps {
  onFormSubmit: () => void;
  transactionToEdit?: Transaction | null;
}

export default function AddTransactionForm({
  onFormSubmit,
  transactionToEdit,
}: AddTransactionFormProps) {
  const { addTransaction, updateTransaction } = useTransactions();
  const { accounts } = useAccounts();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  // --- INÍCIO DA MUDANÇA 2 ---
  // O estado 'date' agora armazena um objeto Date, não uma string
  const [date, setDate] = useState<Date | undefined>(new Date());
  // --- FIM DA MUDANÇA 2 ---
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount);
      // --- INÍCIO DA MUDANÇA 3 ---
      // Converte o Timestamp do Firebase para um objeto Date
      setDate(new Date(transactionToEdit.date.toDate()));
      // --- FIM DA MUDANÇA 3 ---
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
      setAccountId(transactionToEdit.accountId);
    } else {
      // Reseta os campos para o estado inicial
      setTitle("");
      setAmount(0);
      setDate(new Date()); // A data inicial é a data de hoje
      setType("expense");
      setCategory("");
      setAccountId(accounts.length > 0 ? accounts[0].id : "");
    }
  }, [transactionToEdit, accounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // --- INÍCIO DA MUDANÇA 4 ---
    // Verifica se a conta E a data foram selecionadas
    if (!accountId || !date) {
      alert("Por favor, selecione uma conta e uma data.");
      return;
    }
    // --- FIM DA MUDANÇA 4 ---
    setIsSubmitting(true);

    const transactionData = {
      title,
      amount: Number(amount),
      // --- INÍCIO DA MUDANÇA 5 ---
      // Converte o objeto Date do estado para um Timestamp do Firebase
      date: Timestamp.fromDate(date),
      // --- FIM DA MUDANÇA 5 ---
      type,
      category,
      accountId,
    };

    try {
      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      onFormSubmit();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      alert("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-layout">
      {/* Título (sem alteração) */}
      <div className="full-width">
        <FormField label="Título da Transação" htmlFor="title">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Salário, Aluguel, Supermercado"
            required
          />
        </FormField>
      </div>

      {/* Valor, Tipo, Conta, Categoria (sem alteração) */}
      <FormField label="Valor" htmlFor="amount">
        <input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </FormField>
      <FormField label="Tipo" htmlFor="type">
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
      </FormField>
      <FormField label="Conta" htmlFor="accountId">
        <select
          id="accountId"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecione uma conta
          </option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Categoria" htmlFor="category">
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ex: Moradia, Transporte"
        />
      </FormField>

      {/* --- INÍCIO DA MUDANÇA 6 --- */}
      {/* Substituição do input de data pelo componente customizado */}
      <div className="datepicker-wrapper">
        <label htmlFor="date-picker-trigger">Data da Transação</label>{" "}
        {/* Adicionamos um label manual */}
        <CustomDatePicker date={date} setDate={setDate} />
      </div>
      {/* --- FIM DA MUDANÇA 6 --- */}

      {/* Botões de ação (sem alteração) */}
      <div className="form-actions full-width">
        <button
          type="button"
          onClick={onFormSubmit}
          className="secondary-button"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Salvando..."
            : transactionToEdit
            ? "Salvar Alterações"
            : "Adicionar"}
        </button>
      </div>
    </form>
  );
}
