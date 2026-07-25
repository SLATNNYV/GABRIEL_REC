"use client";

import Link from "next/link";
import { Camera, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "E-mail ou senha incorretos.");
      }

      // Save user to localStorage for client-side state
      localStorage.setItem("user", JSON.stringify(data.user));

      // Successful login redirect based on role
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/client/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestClientLogin = async () => {
    setIsLoading(true);
    setError("");

    const testEmail = "cliente@gmail.com";
    const testPassword = "testpassword123";

    try {
      // 1. Try to register the test client (silently fails if already registered)
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Cliente de Teste", email: testEmail, password: testPassword }),
      });

      // 2. Perform login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, password: testPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao logar como cliente de teste.");
      }

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/client/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de conexão no login de teste.");
    } finally {
      setIsLoading(false);
    }
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

          {error && (
            <div className="flex gap-2 items-center bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
              <p className="text-[10px] text-white/30 mt-1.5">Use o email <b>admin@gabrielrec.com</b> para acessar o painel de admin.</p>
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

            <button 
              type="button"
              disabled={isLoading}
              onClick={handleTestClientLogin} 
              className="w-full bg-white/5 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-colors text-white text-sm disabled:opacity-50"
            >
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
