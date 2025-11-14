// src/components/Transactions/AddTransactionForm.tsx
"use client";

import React, { useState, useEffect } from "react"; // Importe useEffect
import { useTransactions, Transaction } from "@/hooks/useTransactions"; // Importe a tipagem Transaction
import { Timestamp } from "firebase/firestore";
import { useAccounts } from "@/hooks/useAccounts";

// 1. Adicione a nova propriedade opcional
interface AddTransactionFormProps {
  onFormSubmit?: () => void;
  transactionToEdit?: Transaction | null;
}

export default function AddTransactionForm({
  onFormSubmit,
  transactionToEdit,
}: AddTransactionFormProps) {
  // 2. Adicione a função 'updateTransaction' do hook
  const { addTransaction, updateTransaction } = useTransactions();
  const { accounts, loading: accountsLoading } = useAccounts();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [accountId, setAccountId] = useState("");
  const [category, setCategory] = useState("");

  // 3. Efeito para preencher o formulário no modo de edição
  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmount(String(transactionToEdit.amount));
      setType(transactionToEdit.type);
      setAccountId(transactionToEdit.accountId);
      setCategory(transactionToEdit.category);
    } else {
      // Limpa o formulário se não houver transação para editar (ex: ao fechar o modal)
      setTitle("");
      setAmount("");
      setType("expense");
      setAccountId("");
      setCategory("");
    }
  }, [transactionToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !accountId) {
      alert("Por favor, preencha todos os campos, incluindo a conta.");
      return;
    }

    const transactionData = {
      title,
      amount: parseFloat(amount),
      type,
      category,
      accountId,
      date: transactionToEdit ? transactionToEdit.date : Timestamp.now(), // Mantém a data original na edição
    };

    try {
      if (transactionToEdit) {
        // 4. Se estiver editando, chama a função de atualização
        await updateTransaction(transactionToEdit.id, transactionData);
      } else {
        // Se não, chama a função de adição
        await addTransaction(transactionData);
      }

      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error) {
      alert("Ocorreu um erro.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {/* O título do formulário agora é dinâmico */}
      <h3>
        {transactionToEdit ? "Editar Transação" : "Adicionar Nova Transação"}
      </h3>
      {/* ... O resto do JSX do formulário continua exatamente o mesmo ... */}
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
      >
        <option value="expense">Despesa</option>
        <option value="income">Receita</option>
      </select>
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
        disabled={accountsLoading}
      >
        <option value="" disabled>
          {accountsLoading ? "Carregando..." : "Selecione uma conta"}
        </option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit" className="primary-button">
        {transactionToEdit ? "Salvar Alterações" : "Adicionar"}
      </button>
    </form>
  );
}
