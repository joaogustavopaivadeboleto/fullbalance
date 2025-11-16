// src/components/ui/datepicker/CustomDatePicker.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiCalendar } from "react-icons/fi";

// --- INÍCIO DA MUDANÇA 1: ATUALIZAR A INTERFACE DE PROPS ---
interface CustomDatePickerProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  placeholder?: string; // Adiciona a propriedade placeholder como opcional
}
// --- FIM DA MUDANÇA 1 ---

export default function CustomDatePicker({
  date,
  setDate,
  placeholder = "Selecione uma data", // Define um valor padrão para o placeholder
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Lógica para fechar o popover ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
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
    setIsOpen(false); // Fecha o popover após selecionar uma data
  };

  return (
    <div className="datepicker-wrapper" ref={popoverRef}>
      <button
        type="button"
        className="datepicker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* --- INÍCIO DA MUDANÇA 2: USAR O PLACEHOLDER --- */}
        <span>{date ? format(date, "dd/MM/yyyy") : placeholder}</span>
        {/* --- FIM DA MUDANÇA 2 --- */}
        <FiCalendar className="datepicker-icon" />
      </button>

      {isOpen && (
        <div className="datepicker-popover bottom">
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
