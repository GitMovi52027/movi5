import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // tus opciones existentes
  images: {
    domains: ["images.unsplash.com", "randomuser.me"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ignora errores de ESLint en el build
  },
  // 👇 clave: activar la lectura de paths del tsconfig
  experimental: {
    tsconfigPaths: true,
  },
};

export default nextConfig;
