// src/components/Transactions/AddTransactionForm.tsx - VERSÃO FINAL COM LAYOUT ORGANIZADO

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import FormField from "@/components/forms/FormField";
import CustomDatePicker from "@/components/ui/datepicker/CustomDatePicker";
import CurrencyInput from "@/components/forms/CurrencyInput";

const defaultCategories = [
  "Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Educação", "Salário", "Outros"
];

interface AddTransactionFormProps {
  onFormSubmit: () => void;
  transactionToEdit?: Transaction | null;
}

export default function AddTransactionForm({
  onFormSubmit,
  transactionToEdit,
}: AddTransactionFormProps) {
  const { transactions, addTransaction, updateTransaction, loading } = useTransactions();
  const { accounts } = useAccounts();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isInitialBalance, setIsInitialBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasInitialBalanceForCurrentMonth = useMemo(() => {
    if (!transactions) return false;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions.some(t => {
      if (t.category === 'saldo inicial') {
        const transactionDate = t.date.toDate();
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      }
      return false;
    });
  }, [transactions]);

  useEffect(() => {
    if (transactionToEdit) {
      const isInitial = transactionToEdit.category === "saldo inicial";
      setTitle(isInitial ? "Saldo Inicial" : transactionToEdit.title);
      setAmount(transactionToEdit.amount);
      setType(transactionToEdit.type);
      setCategory(isInitial ? "saldo inicial" : transactionToEdit.category);
      setAccountId(transactionToEdit.accountId);
      setDate(transactionToEdit.date.toDate());
      setIsInitialBalance(isInitial);
    } else {
      setTitle("");
      setAmount(undefined);
      setType("expense");
      setCategory("");
      setAccountId(accounts.length > 0 ? accounts[0].id : "");
      setDate(new Date());
      setIsInitialBalance(false);
    }
  }, [transactionToEdit, accounts]);

  const handleInitialBalanceToggle = () => {
    const nextValue = !isInitialBalance;
    setIsInitialBalance(nextValue);
    if (nextValue) {
      setTitle("Saldo Inicial");
      setType("income");
      setCategory("saldo inicial");
    } else {
      setTitle("");
      setCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !amount || amount <= 0 || !accountId || !date) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const transactionPayload = {
      title,
      amount,
      type,
      category: isInitialBalance ? "saldo inicial" : category,
      accountId,
      date: Timestamp.fromDate(date),
    };

    try {
      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, transactionPayload);
      } else {
        await addTransaction(transactionPayload);
      }
      onFormSubmit();
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      setError("Ocorreu um erro ao salvar a transação.");
    }
  };

  return (
    // --- 1. USAR O NOVO CONTAINER DE GRID ---
    <form onSubmit={handleSubmit} className="advanced-form-grid">
      {!transactionToEdit && !hasInitialBalanceForCurrentMonth && (
        // Ocupa a linha inteira
        <div className="initial-balance-toggle col-span-4">
          <label className="switch">
            <input type="checkbox" checked={isInitialBalance} onChange={handleInitialBalanceToggle} />
            <span className="slider"></span>
          </label>
          <span onClick={handleInitialBalanceToggle} className="switch-label">
            Definir como Saldo Inicial da Carteira
          </span>
        </div>
      )}

      {/* --- 2. APLICAR AS CLASSES DE SPAN --- */}
      
      {/* Linha 1: Título (2 colunas) e Valor (2 colunas) */}
      <div className="col-span-2">
        <FormField label="Título da Transação" htmlFor="title">
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Salário, Aluguel" required disabled={isInitialBalance} />
        </FormField>
      </div>
      <div className="col-span-2">
        <FormField label="Valor" htmlFor="amount">
          <CurrencyInput id="amount" value={amount} onValueChange={(value) => setAmount(value)} required />
        </FormField>
      </div>

      {/* Linha 2: Tipo (2 colunas) e Data (2 colunas) */}
      
      <div className="col-span-2">
        <FormField label="Tipo" htmlFor="type">
          <select id="type" value={type} onChange={(e) => setType(e.target.value as any)} required disabled={isInitialBalance}>
            <option value="expense">Saída</option>
            <option value="income">Entrada</option>
          </select>
        </FormField>
      </div>
      

      {/* Linha 3: Conta (2 colunas) e Categoria (2 colunas) */}
      <div className="col-span-2">
        <FormField label="Conta" htmlFor="accountId">
          <select id="accountId" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            <option value="" disabled>Selecione uma conta</option>
            {accounts.map((acc) => (<option key={acc.id} value={acc.id}>{acc.name}</option>))}
          </select>
        </FormField>
      </div>
      <div className="col-span-2">
        <FormField label="Data da Transação" htmlFor="date-picker">
          <CustomDatePicker date={date} setDate={setDate} position="top" />
        </FormField>
      </div>
      <div className="col-span-2">
        <FormField label="Categoria" htmlFor="category">
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required disabled={isInitialBalance}>
            <option value="" disabled>Selecione uma categoria</option>
            {isInitialBalance ? (
              <option value="saldo inicial">Saldo Inicial</option>
            ) : (
              defaultCategories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))
            )}
          </select>
        </FormField>
      </div>

      {error && <p className="form-error col-span-4">{error}</p>}

      <div className="form-actions col-span-4">
        <button type="button" onClick={onFormSubmit} className="secondary-button">Cancelar</button>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Salvando..." : (transactionToEdit ? "Salvar Alterações" : "Adicionar")}
        </button>
      </div>
    </form>
  );
}
