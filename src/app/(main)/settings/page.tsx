// src/app/(main)/settings/page.tsx
"use client";

import React, { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";

export default function SettingsPage() {
  const { accounts, loading, addAccount, deleteAccount, updateAccount } =
    useAccounts();
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountColor, setNewAccountColor] = useState("#CCCCCC"); // Cor padrão

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName) return;
    try {
      await addAccount({ name: newAccountName, color: newAccountColor });
      setNewAccountName("");
      setNewAccountColor("#CCCCCC");
    } catch (error) {
      alert("Erro ao adicionar conta.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Configurações</h1>
      </div>

      <div className="settings-section">
        <h2>Gerenciar Contas Bancárias</h2>

        {/* Formulário para adicionar nova conta */}
        <form onSubmit={handleAddAccount} className="inline-form">
          <input
            type="text"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            placeholder="Nome da Conta (ex: Nubank)"
          />
          <input
            type="color"
            value={newAccountColor}
            onChange={(e) => setNewAccountColor(e.target.value)}
            title="Escolha uma cor"
          />
          <button type="submit" className="primary-button">
            Adicionar
          </button>
        </form>

        {/* Lista de contas existentes */}
        <ul className="accounts-list">
          {loading && <p>Carregando contas...</p>}
          {accounts.map((account) => (
            <li key={account.id}>
              <span
                className="color-dot"
                style={{ backgroundColor: account.color }}
              ></span>
              {account.name}
              <button
                onClick={() => deleteAccount(account.id)}
                className="delete-button"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
