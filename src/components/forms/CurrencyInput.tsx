// src/components/forms/CurrencyInput.tsx
"use client";

import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface CurrencyInputProps extends Omit<NumericFormatProps, 'onValueChange'> {
  onValueChange: (value: number | undefined) => void;
  value: number | string | null | undefined;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>((props, ref) => {
  const { onValueChange, ...otherProps } = props;

  return (
    <NumericFormat
      {...otherProps}
      getInputRef={ref}
      onValueChange={(values) => {
        onValueChange(values.floatValue);
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      placeholder="R$ 0,00"
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
