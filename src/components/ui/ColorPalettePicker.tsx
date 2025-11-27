// src/components/ui/ColorPalettePicker.tsx - VERSÃO COM AJUSTE DE INTENSIDADE

"use client";

import React, { useState, useEffect } from "react";
import tinycolor from "tinycolor2";

const defaultColors = [
  "#f71000ff",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#607D8B",
];

interface ColorPalettePickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPalettePicker({
  selectedColor,
  onColorChange,
}: ColorPalettePickerProps) {
  // Estado para a cor base selecionada na paleta
  const [baseColor, setBaseColor] = useState(() => {
    // Tenta encontrar a cor base inicial a partir da cor selecionada
    const colorObj = tinycolor(selectedColor);
    return colorObj.toHexString();
  });

  // Estado para a intensidade (luminosidade), de 0 a 100
  const [lightness, setLightness] = useState(50);

  // Efeito que calcula e emite a cor final sempre que a base ou a intensidade mudam
  useEffect(() => {
    const newColor = tinycolor(baseColor)
      .lighten(lightness - 50)
      .toHexString();
    onColorChange(newColor);
  }, [baseColor, lightness, onColorChange]);

  const handleBaseColorSelect = (color: string) => {
    setBaseColor(color);
    // Opcional: resetar a intensidade ao trocar a cor base
    // setLightness(50);
  };

  return (
    <div className="advanced-color-picker">
      <div className="color-palette-container">
        {defaultColors.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-swatch ${baseColor === color ? "selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handleBaseColorSelect(color)}
            title={color}
          />
        ))}
      </div>

      <div
        className="intensity-slider-container"
        // --- INÍCIO DA MUDANÇA ---
        style={{ "--base-color": baseColor } as React.CSSProperties}
        // --- FIM DA MUDANÇA ---
      >
        <label htmlFor="intensity">Intensidade</label>
        <input
          id="intensity"
          type="range"
          min="0"
          max="100"
          value={lightness}
          onChange={(e) => setLightness(Number(e.target.value))}
          className="intensity-slider"
        />
      </div>
    </div>
  );
}
