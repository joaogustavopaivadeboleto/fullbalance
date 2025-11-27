// src/components/layout/Sidebar.tsx
"use client";

import React from "react"; // Removido useState, useEffect, useRef
import Link from "next/link";

import Image from 'next/image'
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMobileMenu } from "@/context/MobileMenuContext";
import {
  FiGrid,
  FiRepeat,
  FiBarChart2,
  FiSettings,
  FiLogOut, // Ícone de Sair
} from "react-icons/fi";

// Array com os itens de navegação
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/transactions", label: "Transações", icon: FiRepeat },
  { href: "/reports", label: "Relatórios", icon: FiBarChart2 },
  { href: "/settings", label: "Configurações", icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isMenuOpen, closeMenu } = useMobileMenu(); // Hook para o menu mobile

  // Função para fechar o menu mobile ao navegar
  const handleLinkClick = () => {
    closeMenu();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    // Adiciona a classe 'open' condicionalmente para o menu mobile
    <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
      <div className="sidebar-header">
  <Link href="/dashboard" className="logo-link">
    <Image
      src="/Preto.png" // Certifique-se que este arquivo está na pasta /public
      alt="Logo FullBalance"
      width={40} // Ajuste a largura conforme necessário
      height={57} // Ajuste a altura conforme necessário
      className="logo-image"
    />
    <span className="logo-text">FullBalance</span>
  </Link>
</div>
       

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
            onClick={handleLinkClick}
          >
            <item.icon />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* --- INÍCIO DA PARTE AJUSTADA --- */}
      {user && (
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user.displayName || "Usuário"}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          {/* Botão de Sair separado e estilizado */}
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut />
            <span>Sair</span>
          </button>
        </div>
      )}
      {/* --- FIM DA PARTE AJUSTADA --- */}
    </aside>
  );
}
