"use client";

import Link from "next/link";
import { Camera, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simulating login route based on email
      if (email.toLowerCase() === "admin@gabrielrec.com") {
        router.push("/admin");
      } else {
        router.push("/client/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-600/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="glass-card p-10 border-white/5">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
               <Camera className="w-8 h-8 text-gold-500" />
               <span className="text-2xl font-bold tracking-tighter">GABRIEL REC</span>
            </Link>
            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
            <p className="text-white/40 text-sm mt-2">Acesse suas fotos e histórico de compras.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                  placeholder="seu@email.com"
                />
              </div>
              <p className="text-[10px] text-white/30 mt-1.5">Use <b>admin@gabrielrec.com</b> para acessar o painel de admin.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-gold !py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? "Entrando..." : "Entrar"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-white/20">Ou continue com</span>
              </div>
            </div>

            <button onClick={() => {
              setEmail("cliente@gmail.com");
              setPassword("123456");
            }} className="w-full bg-white/5 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-colors text-white text-sm">
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.34-2.1 4.5-.88.88-2.22 1.6-4.5 1.6-3.86 0-7-3.14-7-7s3.14-7 7-7c2.16 0 3.74.84 4.9 1.94l2.32-2.32C18.86 3.12 16.02 2 12.48 2c-5.5 0-10 4.5-10 10s4.5 10 10 10c3 0 5.2-.94 7-2.78 1.84-1.84 2.52-4.52 2.52-6.72 0-.48-.04-.92-.12-1.36h-9.4z"/>
               </svg>
               Entrar como Cliente de Teste
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-white/40">
            Ainda não tem conta? <Link href="/auth/signup" className="text-gold-500 hover:underline">Crie sua conta agora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

