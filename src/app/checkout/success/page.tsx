"use client";

import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, Download, ArrowRight, Home, Sparkles, Clock, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CheckoutSuccessContent() {
  const [purchasedPhotos, setPurchasedPhotos] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const isPix = searchParams.get("method") === "pix";

  useEffect(() => {
    const stored = localStorage.getItem("purchasedItems");
    if (stored) {
      try {
        setPurchasedPhotos(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

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

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] blur-[150px] rounded-full ${isPix ? "bg-gold-500/5" : "bg-green-500/5"}`}></div>
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
        {/* Animated Icon */}
        {isPix ? (
          <div className="inline-flex items-center justify-center p-4 bg-gold-600/10 border border-gold-500/30 rounded-full mb-8 animate-pulse">
            <Clock className="w-16 h-16 text-gold-500" />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center p-4 bg-green-500/10 border border-green-500/30 rounded-full mb-8 animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          {isPix ? (
            <>
              <Clock className="w-6 h-6 text-gold-500 animate-spin-slow" />
              Pedido Registrado!
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-gold-500 animate-pulse" />
              Pagamento Aprovado!
            </>
          )}
        </h1>
        <p className="text-white/60 max-w-lg mx-auto mb-12">
          {isPix ? (
            "Seu pedido foi enviado com sucesso para o WhatsApp! Para concluir a compra, realize a transferência Pix com o fotógrafo Gabriel Rec na conversa. Assim que confirmado, as fotos serão liberadas na sua Área do Cliente."
          ) : (
            "Obrigado pela sua compra! Suas fotos de alta resolução já foram liberadas abaixo. Um recibo e cópia das fotos foram enviados para seu e-mail."
          )}
        </p>

        {/* Action summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
          <div className="glass-card p-6 border-white/5">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Resumo do Pedido</h3>
            <p className="text-2xl font-bold text-gold-500">{purchasedPhotos.length} Fotos</p>
            <p className="text-xs text-white/40 mt-1">
              {isPix ? "Status: Aguardando Pix" : "Status: Aprovado e liberado"}
            </p>
          </div>
          <div className="glass-card p-6 border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Acesso e Download</h3>
              <p className="text-xs text-white/60">
                {isPix 
                  ? "Após confirmação do pagamento, as fotos originais serão liberadas para você na Área do Cliente." 
                  : "As fotos estão disponíveis para download na sua Área do Cliente a qualquer momento."}
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
              <h3 className="text-xl font-bold">{isPix ? "Fotos do Pedido" : "Suas Fotos"}</h3>
              {!isPix ? (
                <button 
                  onClick={handleDownloadAll}
                  className="bg-gold-600 text-black text-xs font-bold py-2 px-5 rounded-full hover:bg-gold-500 transition-colors flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" /> Baixar Todas (.zip)
                </button>
              ) : (
                <div className="text-xs text-gold-500 font-bold flex items-center gap-1.5 bg-gold-500/10 px-3 py-1.5 rounded-full border border-gold-500/20">
                  <Lock className="w-3.5 h-3.5" /> Liberação pendente do Pix
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {purchasedPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                  {/* Show watermarked image if Pix is pending, otherwise show unwatermarked */}
                  <img src={photo.url} alt="Foto adquirida" className="w-full h-full object-cover" />
                  
                  {!isPix ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-center">
                        <Lock className="w-5 h-5 text-white/50 mb-1" />
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                          Aguardando Pix
                        </span>
                      </div>
                    </>
                  )}
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
