// src/components/layout/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FiGrid,
  FiRepeat,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
// Ícones são placeholders por enquanto
// import { RxDashboard, RxBarChart, RxGear } from 'react-icons/rx';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // 1. Links de navegação atualizados para um app financeiro
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { href: "/transactions", label: "Transações", icon: <FiRepeat /> },
    { href: "/reports", label: "Relatórios", icon: <FiBarChart2 /> },
    { href: "/settings", label: "Configurações", icon: <FiSettings /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* 2. Logo atualizado */}
        <div className="logo">FullBalance</div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? "active" : ""}
              >
                {/* 2. Adicione o ícone antes do texto */}
                <span className="icon">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{user?.displayName?.charAt(0)}</div>
          <div className="user-info">
            <span className="user-name">{user?.displayName}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={logout} className="logout-icon" title="Sair">
            ...
          </button>
        </div>
      </div>
    </aside>
  );
}
