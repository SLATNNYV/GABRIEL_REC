"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, Users, DollarSign, Menu, X, LogOut, Camera } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { href: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { href: "/admin/events", icon: <ImageIcon className="w-5 h-5" />, label: "Gerenciar Eventos" },
    { href: "/admin/sales", icon: <DollarSign className="w-5 h-5" />, label: "Vendas e Relatórios" },
    { href: "/admin/clients", icon: <Users className="w-5 h-5" />, label: "Clientes" },
  ];

  const handleLogout = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col md:flex-row relative">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 z-40 sticky top-0">
        <Link href="/admin" className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-gold-500" />
          <span className="font-bold tracking-tighter text-lg">GABRIEL REC</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-white/80 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-zinc-950/95 backdrop-blur-lg border-r border-white/5 p-6 flex flex-col justify-between z-50
        transition-transform duration-300 md:relative md:translate-x-0 md:bg-zinc-950/40
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Camera className="w-7 h-7 text-gold-500" />
              <div className="flex flex-col">
                <span className="font-bold tracking-tighter text-md uppercase leading-none">Gabriel</span>
                <span className="text-[9px] tracking-[0.4em] text-gold-500 font-black leading-none">REC</span>
              </div>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="md:hidden p-1 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Navigation */}
          <div>
            <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-6">Navegação</h2>
            <nav className="space-y-1.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                      isActive 
                        ? "bg-gold-600 text-black shadow-lg shadow-gold-600/10 font-bold" 
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className={isActive ? "text-black" : "text-gold-500/80 group-hover:text-gold-400"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Area with Profile & Logout */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gold-600/10 border border-gold-500/20 flex items-center justify-center font-bold text-gold-500">
              GR
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Gabriel Rec</p>
              <p className="text-[10px] text-white/40">Fotógrafo Admin</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5 text-red-400/80" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-[calc(100vh-73px)] md:min-h-screen">
        <main className="flex-grow p-6 md:p-10 z-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
