// src/components/layout/MobileHeader.tsx
"use client";

import React from "react";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { FiMenu, FiX } from "react-icons/fi";

export default function MobileHeader() {
  const { isMenuOpen, toggleMenu } = useMobileMenu();

  return (
    <header className="mobile-header">
      <h1 className="logo">FullBalance</h1>
      <button onClick={toggleMenu} className="mobile-menu-button">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
    </header>
  );
}
