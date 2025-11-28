// src/components/layout/Sidebar.tsx - VERSÃO FINAL E SIMPLIFICADA

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { FiGrid, FiRepeat, FiPieChart, FiSettings } from "react-icons/fi";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", icon: <FiGrid className="icon" />, label: "Dashboard" },
  { href: "/transactions", icon: <FiRepeat className="icon" />, label: "Transações" },
  { href: "/reports", icon: <FiPieChart className="icon" />, label: "Relatórios" },
  { href: "/settings", icon: <FiSettings className="icon" />, label: "Configurações" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isMinimized } = useSidebar();

  return (
    <aside className={`sidebar ${isMinimized ? "minimized" : ""}`}>
      {/* --- INÍCIO DA CORREÇÃO NO JSX --- */}
      {/* O div extra foi removido. Agora o header e a nav são filhos diretos da sidebar. */}
      
      <div className="sidebar-header">
        <Link href="/dashboard" className="logo-link">
          <Image
            src="/Preto.png"
            alt="FullBalance Logo"
            width={40}
            height={57} // Mantive a altura que você definiu
            className="logo-icon"
          />
          {!isMinimized && <h1 className="logo-text">FullBalance</h1>}
        </Link>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                {item.icon}
                {!isMinimized && (
                  <span className="nav-label">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* --- FIM DA CORREÇÃO NO JSX --- */}
    </aside>
  );
}
