// src/components/ui/PaginationControls.tsx

"use client";

import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  totalItems: number;
  itemsOnCurrentPage: number;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50];

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  itemsOnCurrentPage,
}: PaginationControlsProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = startItem + itemsOnCurrentPage - 1;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Mostrando {startItem} a {endItem} de {totalItems} item(s).
      </div>
      <div className="pagination-controls">
        <div className="items-per-page-selector">
          <label htmlFor="items-per-page">Linhas por página:</label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            {ITEMS_PER_PAGE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="page-info">
          Página {currentPage} de {totalPages}
        </div>
        <div className="navigation-buttons">
          <button onClick={() => onPageChange(1)} disabled={currentPage === 1} title="Primeira Página">
            <FiChevronsLeft />
          </button>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} title="Página Anterior">
            <FiChevronLeft />
          </button>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} title="Próxima Página">
            <FiChevronRight />
          </button>
          <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} title="Última Página">
            <FiChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}
