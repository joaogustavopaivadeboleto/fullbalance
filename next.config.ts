/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Habilita a exportação estática
  images: {
    unoptimized: true, // Desabilita a otimização de imagens do Next.js
  },
};

module.exports = nextConfig;
