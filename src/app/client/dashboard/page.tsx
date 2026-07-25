"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Heart, ShieldCheck, Download, Settings, Clock, Lock, ArrowRight, Camera } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const [purchasedPhotos, setPurchasedPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("purchasedItems");
    if (stored) {
      try {
        setPurchasedPhotos(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
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

  const totalSpent = purchasedPhotos.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold">Área do Cliente</h1>
            <p className="text-white/40">Gerencie suas compras e faça o download seguro das suas memórias.</p>
          </div>
          <Link href="/events" className="btn-gold flex items-center gap-2 !py-2 !px-5 text-sm">
            <Camera className="w-4 h-4" /> Escolher mais fotos
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/50">Carregando painel...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - History & Photos */}
            <div className="lg:col-span-2 space-y-8">
              <section className="glass-card p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gold-500" /> Minhas Compras
                </h2>
                
                {purchasedPhotos.length === 0 ? (
                  <div className="text-center py-10 text-white/30 text-xs border border-dashed border-white/10 rounded-xl p-6">
                    Você ainda não possui fotos compradas.
                    <br />
                    <Link href="/events" className="text-gold-500 hover:underline mt-2 inline-block">
                      Ir para a galeria de eventos →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <OrderItem 
                      eventName="Fotos Adquiridas" 
                      date={new Date().toLocaleDateString("pt-BR")} 
                      items={purchasedPhotos.length} 
                      total={totalSpent.toFixed(2)} 
                      status="Concluído / Pendente Pix"
                    />
                  </div>
                )}
              </section>

              {/* Dynamic Purchased Photos Grid */}
              {purchasedPhotos.length > 0 && (
                <section className="glass-card p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Camera className="w-5 h-5 text-gold-500" /> Suas Imagens em Alta Resolução
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {purchasedPhotos.map((photo) => (
                      <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                        <img src={photo.downloadUrl || photo.url} alt="Foto comprada" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <button 
                            onClick={() => handleDownloadSingle(photo.downloadUrl || photo.url, photo.id)}
                            className="p-2 bg-gold-600 text-black rounded-full hover:scale-110 transition-transform"
                            title="Baixar Foto Original"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className="px-1.5 py-0.5 bg-black/60 text-white/80 text-[8px] font-mono rounded">
                            {photo.id.substring(0, 8)}...
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Stats & Security */}
            <div className="space-y-8">
              <div className="bg-gold-600 rounded-2xl p-8 text-black shadow-xl shadow-gold-600/10">
                <h3 className="text-lg font-bold mb-4">Fotos Adquiridas</h3>
                <p className="text-4xl font-black mb-2">{purchasedPhotos.length}</p>
                <p className="text-sm font-medium opacity-70">
                  {purchasedPhotos.length > 0 ? "Prontas para download" : "Nenhum arquivo liberado"}
                </p>
                
                {purchasedPhotos.length > 0 && (
                  <button 
                    onClick={handleDownloadAll}
                    className="w-full bg-black text-white mt-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Baixar Tudo (.zip)
                  </button>
                )}
              </div>

              <div className="glass-card p-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Segurança</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-xs text-white/60 leading-relaxed">
                      Seus downloads são seguros e as fotos adquiridas podem ser baixadas a qualquer momento nesta área.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="w-5 h-5 text-gold-500 shrink-0" />
                    <p className="text-xs text-white/60 leading-relaxed">
                      Garantimos o armazenamento seguro dos seus arquivos em nuvem por até 1 ano após a data de compra.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderItem({ eventName, date, items, total, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-white/20">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold group-hover:text-gold-400 transition-colors">{eventName}</h4>
          <p className="text-xs text-white/40">{date} • {items} foto(s)</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-white">R$ {total}</p>
        <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">{status}</span>
      </div>
    </div>
  );
}
