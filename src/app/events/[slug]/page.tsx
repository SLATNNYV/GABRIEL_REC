"use client";

import { useState, useEffect } from "react";
import { Camera, Shield, ShoppingCart, Heart, Download, Info } from "lucide-react";
import Link from "next/link";

export default function GalleryPage({ params }: { params: { slug: string } }) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/${params.slug}`);
        if (!res.ok) {
          throw new Error("Galeria não encontrada ou erro no servidor");
        }
        const data = await res.json();
        
        // Map event and photos to expected structure
        const formattedEvent = {
          ...data,
          name: data.name,
          date: new Date(data.date).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }),
          photos: data.photos.map((p: any) => ({
            id: p.id,
            url: `/api/photos/${p.id}`,
            downloadUrl: p.s3Key || `/mock/photo-0.jpg`,
            price: p.price
          }))
        };
        
        setEventData(formattedEvent);
      } catch (err: any) {
        console.error("Erro ao carregar evento:", err);
        setError(err.message || "Erro ao carregar a galeria.");
      } finally {
        setLoading(false);
      }
    }
    
    loadEvent();
  }, [params.slug]);

  // Load cart on mount
  useEffect(() => {
    if (eventData) {
      const stored = localStorage.getItem("cartItems");
      if (stored) {
        try {
          const items = JSON.parse(stored);
          const ids = items.map((i: any) => i.id);
          // Keep only items that belong to current event for checkout if desired
          // or just load all selected items.
          setSelectedPhotos(ids);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [eventData]);

  // Protect screen from screenshots and blurs the page when window loses focus
  useEffect(() => {
    const handleBlur = () => {
      document.body.classList.add("blur-screenshots");
    };

    const handleFocus = () => {
      document.body.classList.remove("blur-screenshots");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common keys for inspect/devtools and screenshot
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        try {
          navigator.clipboard.writeText("PREVIA PROTEGIDA - GABRIEL LUIZ (REC)");
        } catch (err) {
          console.warn("Could not write to clipboard:", err);
        }
        alert("Capturas de tela são proibidas. Compre a foto para tê-la em alta resolução sem marca d'água.");
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedPhotos(prev => {
      const updated = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      const selectedObjects = eventData.photos.filter((p: any) => updated.includes(p.id));
      localStorage.setItem("cartItems", JSON.stringify(selectedObjects));
      return updated;
    });
  };

  const buyAllPhotos = () => {
    if (!eventData) return;
    const allIds = eventData.photos.map((p: any) => p.id);
    setSelectedPhotos(allIds);
    localStorage.setItem("cartItems", JSON.stringify(eventData.photos));
    window.location.href = "/checkout";
  };

  const clearSelection = () => {
    setSelectedPhotos([]);
    localStorage.removeItem("cartItems");
  };

  if (loading) return <div className="pt-40 text-center text-white">Carregando galeria...</div>;
  if (error || !eventData) return <div className="pt-40 text-center text-red-500">Erro: {error || "Galeria não encontrada"}</div>;

  const totalPhotosPrice = eventData.photos.reduce((acc: number, p: any) => acc + p.price, 0);
  // Calculate package price with a 30% discount
  const packagePrice = totalPhotosPrice * 0.7;

  return (
    <div className="pt-28 min-h-screen bg-black">
      {/* Header Galeria */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-white/30 mb-2">
               <Link href="/events" className="hover:text-gold-500 transition-colors">Eventos</Link>
               <span>/</span>
               <span className="text-white/60">{eventData.name}</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">{eventData.name}</h1>
            <p className="text-white/40 text-sm mt-1">{eventData.date} • {eventData.photos.length} Fotos</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] text-white/30 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 unselectable">
                <Shield className="w-3 h-3" /> Proteção Ativa
             </div>
             {eventData.photos.length > 0 && (
               <button onClick={buyAllPhotos} className="btn-gold !py-2 !px-6 text-sm flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Comprar Pacote (R$ {packagePrice.toFixed(2)})
               </button>
             )}
          </div>
        </div>
      </div>

      {/* Grid de Fotos */}
      <div className="container mx-auto px-4 sm:px-6 mb-32">
        {eventData.photos.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            Nenhuma foto disponível neste evento ainda.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {eventData.photos.map((photo: any) => (
              <PhotoThumb 
                 key={photo.id} 
                 photo={photo} 
                 isSelected={selectedPhotos.includes(photo.id)}
                 onToggle={() => toggleSelection(photo.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Barra de Seleção Flutuante */}
      {selectedPhotos.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
          <div className="glass-card p-4 flex items-center justify-between shadow-2xl shadow-gold-900/20 border-gold-500/30 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-600 text-black flex items-center justify-center rounded-lg font-bold">
                  {selectedPhotos.length}
                </div>
                <div>
                   <p className="text-sm font-bold text-white">Fotos Selecionadas</p>
                   <p className="text-xs text-white/50">
                     Total estimado: R$ {eventData.photos.filter((p: any) => selectedPhotos.includes(p.id)).reduce((acc: number, p: any) => acc + p.price, 0).toFixed(2)}
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button onClick={clearSelection} className="text-xs text-white/40 hover:text-white transition-colors">Limpar</button>
                <Link href="/checkout" className="btn-gold !py-2 !px-6 text-sm">
                   Finalizar Compra
                </Link>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoThumb({ photo, isSelected, onToggle }: { photo: any; isSelected: boolean; onToggle: () => void }) {
  return (
    <div 
      className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${isSelected ? "border-gold-500 ring-4 ring-gold-500/20" : "border-white/5 hover:border-white/20"}`}
      onClick={onToggle}
      onContextMenu={(e) => e.preventDefault()} // Block right-click
    >
      {/* Imagem com Placeholder cinza pra simular carregamento */}
      <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
        <Camera className="w-8 h-8 text-white/5" />
      </div>

      {/* Exibição da Imagem com segurança */}
      <img 
        src={photo.url} 
        alt="Preview" 
        className="w-full h-full object-cover relative z-0 transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Overlay de Marca d'Água Dinâmica (Visual) */}
      <div className="absolute inset-0 z-10 pointer-events-none unselectable flex items-center justify-center">
         <div className="rotate-[-30deg] opacity-[0.25] text-white text-center space-y-2 select-none" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
           {Array.from({ length: 5 }).map((_, i) => (
             <p key={i} className="text-xs font-black whitespace-nowrap tracking-wider">
               GABRIEL LUIZ (REC) • PREVIA PROTEGIDA • PROIBIDO PRINT
             </p>
           ))}
         </div>
      </div>

      {/* Overlay de Seleção */}
      <div className={`absolute inset-0 bg-gold-600/10 z-20 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}></div>

      {/* Botões de Ação na Foto */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
         <button className={`p-2 rounded-full backdrop-blur-md transition-all ${isSelected ? "bg-gold-500 text-black" : "bg-black/40 text-white hover:bg-gold-600 hover:text-black"}`}>
            {isSelected ? <ShoppingCart className="w-4 h-4 fill-current" /> : <PlusIcon className="w-4 h-4" />}
         </button>
         <button className="p-2 rounded-full bg-black/40 text-white hover:bg-red-500 transition-all backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            <Heart className="w-4 h-4" />
         </button>
      </div>

      {/* Info de Preço */}
      <div className="absolute bottom-3 left-3 z-30">
        <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded backdrop-blur-md border border-white/10">
          R$ {photo.price.toFixed(2)}
        </span>
      </div>

      {/* Security Block Layer */}
      <div 
        className="absolute inset-0 z-40" 
        draggable="false"
        onDragStart={(e) => e.preventDefault()}
      ></div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 5v14m-7-7h14"/>
    </svg>
  );
}
