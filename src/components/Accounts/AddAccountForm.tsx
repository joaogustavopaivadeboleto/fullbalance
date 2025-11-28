// src/components/Accounts/AddAccountForm.tsx - VERSÃO FINAL CORRIGIDA

"use client";

import React, { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import FormField from "../forms/FormField";
import ColorPalettePicker from "../ui/ColorPalettePicker";

interface AddAccountFormProps {
  onFormSubmit: () => void;
}

export default function AddAccountForm({ onFormSubmit }: AddAccountFormProps) {
  const { addAccount, loading } = useAccounts();
  const [name, setName] = useState("");
  // Define uma cor inicial da nossa paleta
  const [color, setColor] = useState("#3F51B5");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name) {
      setError("O nome da conta é obrigatório.");
      return;
    }

    try {
      // A cor a ser salva é a do estado 'color'
      await addAccount({ name, color });
      onFormSubmit();
    } catch (err) {
      console.error("Erro ao adicionar conta:", err);
      setError("Ocorreu um erro ao criar a conta.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-layout"
      style={{ gridTemplateColumns: "1fr" }}
    >
      <div className="account-name-preview-wrapper">
        <FormField label="Nome da Conta" htmlFor="accountName">
          <input
            id="accountName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Carteira, Nubank"
            required
          />
        </FormField>
        {/* --- INÍCIO DA CORREÇÃO --- */}
        {/* A prévia da cor usa o estado 'color' diretamente */}
        <span
          className="color-preview-dot"
          style={{ backgroundColor: color }}
        />
        {/* --- FIM DA CORREÇÃO --- */}
      </div>

      <FormField label="Cor de Identificação" htmlFor="accountColor">
        <ColorPalettePicker selectedColor={color} onColorChange={setColor} />
      </FormField>

      {error && <p className="form-error full-width">{error}</p>}

      <div className="form-actions full-width">
        <button
          type="button"
          onClick={onFormSubmit}
          className="secondary-button"
        >
          Cancelar
        </button>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Adicionando..." : "Adicionar Conta"}
        </button>
      </div>
    </form>
  );
}
