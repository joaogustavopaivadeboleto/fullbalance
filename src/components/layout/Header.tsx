// src/components/layout/Header.tsx - VERSÃO COMPLETA E FINAL

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { FiMenu, FiLogOut } from "react-icons/fi";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const getInitials = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <header className="main-header">
      {/* Botão para abrir/fechar a sidebar */}
      <button onClick={toggleSidebar} className="header-toggle-button">
        <FiMenu />
      </button>

      {/* Menu de usuário na direita */}
      <div className="header-user-menu" ref={dropdownRef}>
        <button
          className="user-avatar-button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <span>{getInitials()}</span>
        </button>

        {isDropdownOpen && (
          <div className="user-dropdown-menu">
            <div className="dropdown-header">
              <span className="user-name">{user?.displayName || "Usuário"}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button onClick={logout} className="dropdown-logout-button">
              <FiLogOut />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
