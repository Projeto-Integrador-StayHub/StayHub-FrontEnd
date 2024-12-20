import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'app/styles')],  // Caminho para a pasta de estilos
  },
  webpack(config) {
    // Configuração do Webpack para permitir o uso de aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@styles": path.join(__dirname, "app/styles"),  // Definindo o alias @styles
    };
    return config;
  },
  reactStrictMode: true,  // Habilitando o modo estrito, se necessário
};

export default nextConfig;
