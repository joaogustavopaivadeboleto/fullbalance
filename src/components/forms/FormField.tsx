// src/components/forms/FormField.tsx
"use client";

import React from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  helpText?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  helpText,
  children,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {helpText && <p className="help-text">{helpText}</p>}
    </div>
  );
}
