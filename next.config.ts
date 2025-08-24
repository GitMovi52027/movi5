import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "randomuser.me"],
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true  // Esto ignorará errores de ESLint durante el build
  },
  // @ts-ignore - La propiedad missingSuspenseWithCSRBailout existe en tiempo de ejecución pero no en el tipo
  experimental: {
    missingSuspenseWithCSRBailout: false  // Deshabilita la comprobación de useSearchParams con Suspense
  }
};

export default nextConfig;
