// src/components/layout/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Ícones são placeholders por enquanto
// import { RxDashboard, RxBarChart, RxGear } from 'react-icons/rx';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // 1. Links de navegação atualizados para um app financeiro
  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "D" },
    { name: "Transações", href: "/transactions", icon: "T" },
    { name: "Relatórios", href: "/reports", icon: "R" },
    { name: "Configurações", href: "/settings", icon: "C" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* 2. Logo atualizado */}
        <div className="logo">FullBalance</div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.name}>
                <Link href={link.href} className={isActive ? "active" : ""}>
                  <span className="icon">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            );
          })}
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
