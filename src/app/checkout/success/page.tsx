"use client";

import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, Download, ArrowRight, Home, Sparkles, Clock, Lock, ShieldAlert, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CheckoutSuccessContent() {
  const [purchasedPhotos, setPurchasedPhotos] = useState<any[]>([]);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    async function verifyPayment() {
      if (sessionId) {
        try {
          setVerifying(true);
          const res = await fetch(`/api/checkout/stripe/status?session_id=${sessionId}`);
          if (!res.ok) {
            throw new Error("Erro na comunicação com o servidor de validação.");
          }
          const data = await res.json();
          
          if (data.isPaid && data.photos) {
            // 1. Save purchased photos to local storage (for dashboard history)
            localStorage.setItem("purchasedItems", JSON.stringify(data.photos));
            
            // 2. Empty the shopping cart
            localStorage.removeItem("cartItems");
            
            setPurchasedPhotos(data.photos);
            setError(null);
          } else {
            setError(data.error || "O pagamento ainda está sendo processado ou não foi aprovado.");
          }
        } catch (err: any) {
          console.error("Erro ao validar pagamento:", err);
          setError(err.message || "Ocorreu um erro ao validar sua transação.");
        } finally {
          setVerifying(false);
        }
      } else {
        // Fallback: if no session_id is in url, check if they already have purchased items stored in browser
        const stored = localStorage.getItem("purchasedItems");
        if (stored) {
          try {
            setPurchasedPhotos(JSON.parse(stored));
            setError(null);
          } catch (e) {
            console.error(e);
            setError("Erro ao ler compras anteriores.");
          }
        } else {
          setError("Acesso inválido. Nenhum identificador de pagamento foi fornecido.");
        }
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  const handleDownloadSingle = (url: string, id: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `gabriel-rec-${id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    purchasedPhotos.forEach((item, index) => {
      setTimeout(() => {
        handleDownloadSingle(item.downloadUrl || item.url, item.id);
      }, index * 400);
    });
  };

  if (verifying) {
    return (
      <div className="pt-40 pb-20 bg-black min-h-screen text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold">Verificando seu pagamento...</h2>
        <p className="text-white/40 text-xs mt-2">Estamos confirmando a transação via Pix/Cartão no Stripe.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-40 pb-20 bg-black min-h-screen text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full mb-6 text-red-500">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-red-400">Falha na Liberação das Fotos</h2>
        <p className="text-white/60 text-sm max-w-md mt-4 leading-relaxed">{error}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <Link href="/checkout" className="btn-gold !py-3 !px-8 text-sm">
            Voltar para o Checkout
          </Link>
          <a 
            href="https://wa.me/5544998348208" 
            target="_blank" 
            className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all text-sm font-semibold flex items-center justify-center gap-2"
          >
            Falar com Suporte
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] blur-[150px] rounded-full bg-green-500/5"></div>
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
        {/* Animated Check */}
        <div className="inline-flex items-center justify-center p-4 bg-green-500/10 border border-green-500/30 rounded-full mb-8 animate-bounce">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-gold-500 animate-pulse" />
          Pagamento Aprovado!
        </h1>
        <p className="text-white/60 max-w-lg mx-auto mb-12">
          Obrigado pela sua compra! Suas fotos de alta resolução já foram liberadas abaixo. Um recibo e cópia das fotos foram enviados para seu e-mail.
        </p>

        {/* Action summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
          <div className="glass-card p-6 border-white/5">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Resumo da Compra</h3>
            <p className="text-2xl font-bold text-gold-500">{purchasedPhotos.length} Fotos</p>
            <p className="text-xs text-white/45 mt-1">Transação validada com sucesso pelo Stripe.</p>
          </div>
          <div className="glass-card p-6 border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Acesso e Download</h3>
              <p className="text-xs text-white/60">
                As fotos estão disponíveis para download na sua Área do Cliente a qualquer momento.
              </p>
            </div>
            <Link href="/client/dashboard" className="text-xs text-gold-500 hover:underline inline-flex items-center gap-1.5 mt-4">
              Ver Minha Área <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Gallery grid of purchased items */}
        {purchasedPhotos.length > 0 && (
          <div className="glass-card p-8 border-white/5 text-left mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Suas Fotos</h3>
              <button 
                onClick={handleDownloadAll}
                className="bg-gold-600 text-black text-xs font-bold py-2 px-5 rounded-full hover:bg-gold-500 transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Baixar Todas (.zip)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {purchasedPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                  <img src={photo.downloadUrl || photo.url} alt="Foto adquirida" className="w-full h-full object-cover" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button 
                      onClick={() => handleDownloadSingle(photo.downloadUrl || photo.url, photo.id)}
                      className="p-3 bg-gold-600 text-black rounded-full hover:scale-110 transition-transform"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-green-500 text-black text-[9px] font-bold rounded">
                      ORIGINAL
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-semibold">
            <Home className="w-4 h-4" /> Ir para Home
          </Link>
          <Link href="/events" className="btn-gold px-8 py-3 rounded-full flex items-center justify-center gap-2">
            Ver Outros Eventos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-white">Carregando informações do pedido...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
