// src/components/ui/Modal.tsx
"use client";

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi"; // Ícone para o botão de fechar

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  // Efeito para fechar o modal com a tecla "Esc"
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Limpa o listener quando o componente é desmontado
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Se o modal não estiver aberto, não renderiza nada.
  if (!isOpen) {
    return null;
  }

  // Se estiver aberto, renderiza a estrutura completa do modal.
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="modal-close-button"
            title="Fechar"
          >
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
