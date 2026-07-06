"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Settings, Calendar, Camera, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o evento "${name}"? Todas as fotos deste evento serão apagadas permanentemente.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        alert("Evento excluído com sucesso!");
      } else {
        alert("Erro ao excluir evento.");
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="pt-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Eventos</h1>
          <p className="text-white/40 text-sm mt-1">Crie, gerencie as fotos e edite as informações das galerias.</p>
        </div>
        <Link href="/admin/events/new" className="btn-gold flex items-center gap-2 !py-2 !px-5 text-sm">
          <Plus className="w-4 h-4" /> Criar Novo Evento
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/50">Carregando eventos...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 max-w-lg mx-auto">
          <Camera className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum evento criado</h3>
          <p className="text-sm text-white/40 mb-6">Crie seu primeiro evento para começar a publicar fotos.</p>
          <Link href="/admin/events/new" className="btn-gold !py-2.5 !px-6 text-sm">Criar Primeiro Evento</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const formattedDate = new Date(event.date).toLocaleDateString("pt-BR");
            const photoCount = event._count?.photos ?? 0;

            return (
              <div key={event.id} className="glass-card overflow-hidden border-white/5 hover:border-gold-500/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
                    <img 
                      src={event.coverImage || "/mock/wedding.jpg"} 
                      alt={event.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-gold-600 text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{event.name}</h3>
                    <div className="flex gap-4 text-xs text-white/40 mb-4">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
                      <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> {photoCount} fotos</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 pb-5 pt-0 flex gap-2">
                  <Link 
                    href={`/admin/events/${event.id}`}
                    className="flex-grow bg-white/5 border border-white/10 hover:bg-gold-600 hover:text-black hover:border-gold-500 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" /> Gerenciar
                  </Link>
                  <a 
                    href={`/events/${event.slug}`} 
                    target="_blank"
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-lg transition-all flex items-center justify-center"
                    title="Ver página pública"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => handleDelete(event.id, event.name)}
                    className="p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white rounded-lg transition-all flex items-center justify-center"
                    title="Excluir Evento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
