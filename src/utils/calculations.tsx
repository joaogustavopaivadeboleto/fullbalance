// src/utils/calculations.ts

/**
 * Calcula a variação percentual entre um valor antigo e um novo.
 * @param previousValue - O valor do período anterior.
 * @param currentValue - O valor do período atual.
 * @returns A variação percentual, com uma casa decimal.
 */
export const calculatePercentageChange = (previousValue: number, currentValue: number): number => {
  // Caso 1: Ambos são zero, não houve mudança.
  if (previousValue === 0 && currentValue === 0) {
    return 0;
  }

  // Caso 2: O valor anterior era zero e o atual não é.
  // Isso é um aumento "infinito", então retornamos 100%.
  if (previousValue === 0) {
    return 100;
  }

  // Caso 3: Cálculo padrão.
  const change = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;

  // Arredonda para uma casa decimal
  const roundedChange = Math.round(change * 10) / 10;

  return roundedChange;
};
