"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, Menu, X } from "lucide-react";

export default function Navigation({ 
  showBackButton = false, 
  title = "", 
  currentStep = 0, 
  totalSteps = 0 
}: { 
  showBackButton?: boolean, 
  title?: string, 
  currentStep?: number,
  totalSteps?: number
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-[#27665f] text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton && (
              <button 
                onClick={() => window.history.back()}
                className="mr-3 hover:text-white/80 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo-movi.png" 
                alt="Movi5 Logo" 
                width={40} 
                height={40} 
                className="rounded-md"
              />
              <span className="text-2xl font-bold">Movi5</span>
            </Link>
            {title && (
              <div className="hidden md:flex items-center ml-6">
                <span className="text-lg font-medium">{title}</span>
                {totalSteps > 0 && (
                  <span className="ml-2 text-sm opacity-80">
                    Paso {currentStep} de {totalSteps}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="hover:text-white/80 font-medium transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/80 font-medium transition-colors">
                  Destinos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/80 font-medium transition-colors">
                  Promociones
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/80 font-medium transition-colors">
                  Horarios
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/80 font-medium transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="flex items-center">
            <Link href="#" className="text-sm hover:text-white/80 transition-colors hidden md:block mr-4">
              Iniciar sesión
            </Link>
            <Link 
              href="#" 
              className="bg-white text-[#27665f] px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors hidden md:block"
            >
              Registrarse
            </Link>
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="py-3 px-4 space-y-3 border-t border-white/10">
            <Link 
              href="/" 
              className="block py-2 hover:bg-white/10 px-3 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="#" 
              className="block py-2 hover:bg-white/10 px-3 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Destinos
            </Link>
            <Link 
              href="#" 
              className="block py-2 hover:bg-white/10 px-3 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Promociones
            </Link>
            <Link 
              href="#" 
              className="block py-2 hover:bg-white/10 px-3 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Horarios
            </Link>
            <Link 
              href="#" 
              className="block py-2 hover:bg-white/10 px-3 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            <div className="pt-2 flex space-x-3">
              <Link 
                href="#" 
                className="flex-1 text-center py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link 
                href="#" 
                className="flex-1 text-center py-2 bg-white text-[#27665f] rounded-lg font-medium hover:bg-white/90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
} 