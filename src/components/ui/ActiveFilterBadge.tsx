// src/components/ui/ActiveFilterBadge.tsx
import React from "react";
import { FiX } from "react-icons/fi";

interface ActiveFilterBadgeProps {
  label: string;
  onRemove: () => void;
}

export default function ActiveFilterBadge({
  label,
  onRemove,
}: ActiveFilterBadgeProps) {
  return (
    <div className="active-filter-badge">
      <span>{label}</span>
      <button onClick={onRemove} title="Remover filtro">
        <FiX size={14} />
      </button>
    </div>
  );
}
