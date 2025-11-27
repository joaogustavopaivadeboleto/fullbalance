// src/app/(main)/settings/page.tsx - VERSÃO FINAL COMPLETA

"use client";

import React, { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { useTheme } from "@/context/ThemeContext"; // Importa o hook do tema
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function SettingsPage() {
  // --- Hooks para buscar e gerenciar dados ---
  const {
    accounts,
    addAccount,
    deleteAccount,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const { primaryColor, setPrimaryColor, loadingTheme } = useTheme();

  // --- Estados para o formulário de nova conta ---
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountColor, setNewAccountColor] = useState("#4ade80"); // Cor padrão para novas contas
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Funções ---
  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) {
      alert("Por favor, insira um nome para a conta.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addAccount({ name: newAccountName, color: newAccountColor });
      // Limpa os campos após o sucesso
      setNewAccountName("");
      setNewAccountColor("#4ade80");
    } catch (err) {
      alert("Erro ao adicionar conta.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = accountsLoading || loadingTheme;

  return (
    <div>
      <div className="page-header">
        <h1>Configurações</h1>
      </div>

      {/* Seção para Personalizar o Tema */}
      <section className="settings-section">
        <h2>Personalizar Tema</h2>
        <p>Escolha a cor de destaque principal para a aplicação.</p>
        <div className="inline-form">
          <label htmlFor="theme-color-picker">Cor Primária:</label>
          <input
            id="theme-color-picker"
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="color-input-field"
            disabled={loadingTheme}
            title="Selecionar cor primária do tema"
          />
          {loadingTheme && (
            <span
              style={{
                fontSize: "0.9em",
                color: "var(--color-text-secondary)",
              }}
            >
              Carregando tema...
            </span>
          )}
        </div>
      </section>

      {/* Seção para Gerenciar Contas */}
      <section
        className="settings-section"
        style={{ marginTop: "var(--spacing-xl)" }}
      >
        <h2>Gerenciar Contas</h2>
        <p>Adicione ou remova as contas bancárias que você utiliza.</p>

        {/* Formulário para adicionar nova conta */}
        <form onSubmit={handleAddAccount} className="inline-form">
          <input
            type="text"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            placeholder="Nome da nova conta (ex: Nubank, Itaú)"
            required
            className="form-input-field"
          />
          <input
            type="color"
            value={newAccountColor}
            onChange={(e) => setNewAccountColor(e.target.value)}
            title="Selecionar cor da conta"
            className="color-input-field"
          />
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            <FiPlus />
            {isSubmitting ? "Adicionando..." : "Adicionar"}
          </button>
        </form>

        {/* Tabela com a lista de contas existentes */}
        <div className="table-container">
          {isLoading ? (
            <p>Carregando contas...</p>
          ) : accountsError ? (
            <p>Erro ao carregar contas.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cor</th>
                  <th>Nome da Conta</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <tr key={account.id}>
                      <td>
                        <span
                          className="color-dot"
                          style={{ backgroundColor: account.color }}
                        ></span>
                      </td>
                      <td>{account.name}</td>
                      <td className="transaction-actions">
                        <button
                          onClick={() => deleteAccount(account.id)}
                          className="trash"
                          title="Excluir Conta"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      Nenhuma conta cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
