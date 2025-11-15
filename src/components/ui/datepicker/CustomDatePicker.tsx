// src/components/ui/datepicker/CustomDatePicker.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FiCalendar } from "react-icons/fi";

interface CustomDatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export default function CustomDatePicker({
  date,
  setDate,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 1. Estado para controlar a direção do pop-up
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    // 2. Lógica para decidir a posição ao abrir
    if (!isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Se não houver espaço suficiente abaixo (ex: 300px), abre para cima
      if (spaceBelow < 300) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
    setIsOpen(!isOpen);
  };

  const handleDayClick = (selectedDay: Date | undefined) => {
    setDate(selectedDay);
    setIsOpen(false);
  };

  // 3. Fecha o pop-up se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // 4. Adiciona a referência ao wrapper
    <div className="datepicker-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className="datepicker-trigger"
        onClick={handleToggle}
      >
        <span>{date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}</span>
        <FiCalendar className="datepicker-icon" />
      </button>

      {isOpen && (
        // 5. Adiciona a classe de posição dinamicamente
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
