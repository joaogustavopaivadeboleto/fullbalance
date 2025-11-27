// src/components/ui/forms/CurrencyInput.tsx
"use client";

import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface CurrencyInputProps extends Omit<NumericFormatProps, "onValueChange"> {
  onValueChange: (value: number | undefined) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (props, ref) => {
    const { onValueChange, ...otherProps } = props;

    return (
      <NumericFormat
        getInputRef={ref}
        {...otherProps}
        onValueChange={(values) => {
          onValueChange(values.floatValue);
        }}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        className="form-input" // Reutiliza nossa classe de input padrão
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export default CurrencyInput;
