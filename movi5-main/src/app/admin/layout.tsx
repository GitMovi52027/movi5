"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Providers from "../providers";
import "../globals.css"; // Importar los estilos globales
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redireccionar si no está autenticado, excepto en la página de login
  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  // No mostrar el layout de admin en la página de login
  if (pathname === "/admin/login") {
    return (
      <html lang="es">
        <head>
          <title>Movi5 Admin - Login</title>
        </head>
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading") {
    return (
      <html lang="es">
        <head>
          <title>Movi5 Admin - Cargando...</title>
        </head>
        <body className={inter.className}>
          <Providers>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="h-8 w-8 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
            </div>
          </Providers>
        </body>
      </html>
    );
  }

  // Si no está autenticado, no mostrar nada (la redirección se hará en el useEffect)
  if (status === "unauthenticated") {
    return (
      <html lang="es">
        <head>
          <title>Movi5 Admin - Acceso no autorizado</title>
        </head>
        <body className={inter.className}>
          <Providers>{null}</Providers>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <head>
        <title>Movi5 Admin - Panel de administración</title>
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar para móvil */}
            <div
              className={`fixed inset-0 z-20 transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => setSidebarOpen(false)}
              ></div>
            </div>

            {/* Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-30 w-64 bg-teal text-white transform transition-transform duration-300 h-screen overflow-y-auto ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:translate-x-0`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center p-4 border-b border-white/10">
                  <Image
                    src="/logo-movi.png"
                    alt="Movi5 Logo"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <span className="ml-3 text-xl font-bold">Movi5 Admin</span>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/admin/dashboard"
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          pathname.includes("/admin/dashboard")
                            ? "bg-white/10 font-medium"
                            : "hover:bg-white/5"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <svg
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          ></path>
                        </svg>
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/rutas"
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          pathname.includes("/admin/rutas")
                            ? "bg-white/10 font-medium"
                            : "hover:bg-white/5"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <svg
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          ></path>
                        </svg>
                        <span>Rutas y Precios</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/solicitudes"
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          pathname.includes("/admin/solicitudes")
                            ? "bg-white/10 font-medium"
                            : "hover:bg-white/5"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <svg
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          ></path>
                        </svg>
                        <span>Solicitudes</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/configuracion"
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          pathname.includes("/admin/configuracion")
                            ? "bg-white/10 font-medium"
                            : "hover:bg-white/5"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <svg
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        <span>Configuración</span>
                      </Link>
                    </li>
                  </ul>
                </nav>

                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center w-full px-4 py-2 text-sm rounded-lg hover:bg-white/5"
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
              {/* Barra superior */}
              <header className="bg-white shadow z-10 sticky top-0">
                <div className="px-4 py-3 flex items-center justify-between">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 rounded-md md:hidden focus:outline-none"
                  >
                    <svg
                      className="h-6 w-6 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </button>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      {session?.user?.name || "Administrador"}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-teal flex items-center justify-center text-white font-medium text-sm">
                      {(session?.user?.name || "A").charAt(0)}
                    </div>
                  </div>
                </div>
              </header>

              {/* Contenido */}
              <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 