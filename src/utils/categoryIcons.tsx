// src/utils/categoryIcons.tsx
import React from 'react';
import {
  FiShoppingCart,
  FiHeart,
  FiHome,
  FiFilm,
  FiBookOpen,
  FiGift,
  FiBriefcase,
  FiDollarSign,
  FiCoffee,
  FiTruck,
  FiPlusCircle,
} from 'react-icons/fi';

// Mapeamento de palavras-chave para ícones
const iconMap: { [key: string]: React.ReactNode } = {
  compra: <FiShoppingCart />,
  mercado: <FiShoppingCart />,
  supermercado: <FiShoppingCart />,
  saúde: <FiHeart />,
  farmácia: <FiHeart />,
  moradia: <FiHome />,
  aluguel: <FiHome />,
  lazer: <FiFilm />,
  restaurante: <FiCoffee />,
  educação: <FiBookOpen />,
  presente: <FiGift />,
  salário: <FiBriefcase />,
  transporte: <FiTruck />,
  uber: <FiTruck />,
  // Adicione mais mapeamentos conforme necessário
};

// Ícone padrão caso nenhuma palavra-chave seja encontrada
const defaultIcon = <FiDollarSign />;

export const getCategoryIcon = (category: string): React.ReactNode => {
  if (!category) return defaultIcon;

  const lowerCaseCategory = category.toLowerCase();

  // Procura por uma correspondência exata primeiro
  if (iconMap[lowerCaseCategory]) {
    return iconMap[lowerCaseCategory];
  }

  // Se não encontrar, procura por palavras-chave dentro da categoria
  for (const key in iconMap) {
    if (lowerCaseCategory.includes(key)) {
      return iconMap[key];
    }
  }

  return defaultIcon;
};
