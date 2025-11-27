// src/components/ui/datepicker/CustomDatePicker.tsx - VERSÃO CORRIGIDA

"use client";

import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiCalendar } from "react-icons/fi";

// --- CORREÇÃO 1: Remover a propriedade que não existe ---
interface CustomDatePickerProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  placeholder?: string;
  position?: 'top' | 'bottom'; // Usaremos isso para controlar a posição via CSS
}

export default function CustomDatePicker({
  date,
  setDate,
  placeholder = "Selecione uma data",
  position = 'bottom', // Posição padrão é para baixo
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDayClick = (selectedDay: Date | undefined) => {
    setDate(selectedDay);
    setIsOpen(false);
  };

  return (
    <div className="datepicker-wrapper" ref={popoverRef}>
      <button
        type="button"
        className="datepicker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{date ? format(date, "dd/MM/yyyy") : placeholder}</span>
        <FiCalendar className="datepicker-icon" />
      </button>

      {isOpen && (
        // --- CORREÇÃO 2: Usar a classe de posição ---
        <div className={`datepicker-popover ${position}`}>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleDayClick}
            locale={ptBR}
            showOutsideDays
            fixedWeeks
          />
        </div>
      )}
    </div>
  );
}
