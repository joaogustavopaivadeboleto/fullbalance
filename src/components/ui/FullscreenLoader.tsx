// src/components/ui/FullscreenLoader.tsx
"use client";

import React from "react";

// Este componente não precisa de nenhuma lógica, apenas de estilos.
// Os estilos serão aplicados pela classe 'fullscreen-loader' que já temos no globals.css.
export default function FullscreenLoader() {
  return (
    <div className="fullscreen-loader">
      {/* Você pode adicionar um spinner ou uma animação aqui se quiser */}
      <p>Carregando...</p>
    </div>
  );
}
