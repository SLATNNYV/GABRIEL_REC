"use client";

import Link from "next/link";
import { Camera, User, ShoppingCart, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md py-3 border-b border-white/10" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 transition-transform group-hover:scale-110 duration-500">
            <img 
              src="/logo-white.png" 
              alt="Gabriel Rec Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-white uppercase leading-none">Gabriel</span>
            <span className="text-[10px] tracking-[0.4em] text-gold-500 font-black">REC</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/events" className="nav-link">Eventos</Link>
          <Link href="/servicos" className="nav-link">Serviços</Link>
          <Link href="/sobre" className="nav-link">Sobre</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5 text-white/80" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold-600 rounded-full"></span>
          </Link>
          <Link href="/auth/login" className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
            <User className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-white">Entrar</span>
          </Link>
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
