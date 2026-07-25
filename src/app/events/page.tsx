export const dynamic = "force-dynamic";

import { Search, Filter, Calendar as CalendarIcon, Camera, ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categoryFilter = searchParams.category;

  const whereClause: any = {};
  if (categoryFilter) {
    let categoryDbName = categoryFilter;
    const lowerCategory = categoryFilter.toLowerCase();
    if (lowerCategory.startsWith("casamento")) {
      categoryDbName = "Casamento";
    } else if (lowerCategory.startsWith("formatura")) {
      categoryDbName = "Formatura";
    } else if (lowerCategory.startsWith("corporativo")) {
      categoryDbName = "Corporativo";
    } else if (lowerCategory.startsWith("ensaio")) {
      categoryDbName = "Ensaio";
    }

    whereClause.category = {
      equals: categoryDbName,
      mode: "insensitive"
    };
  }

  const events = await prisma.event.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { photos: true }
      }
    },
    orderBy: {
      date: "desc"
    }
  });

  // Helper for title display
  const getCategoryTitle = () => {
    if (!categoryFilter) return "";
    const lower = categoryFilter.toLowerCase();
    if (lower.startsWith("casamento")) return " - Casamentos";
    if (lower.startsWith("formatura")) return " - Formaturas";
    if (lower.startsWith("corporativo")) return " - Eventos Corporativos";
    if (lower.startsWith("ensaio")) return " - Ensaios";
    return ` - ${categoryFilter}`;
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Galeria de Eventos{getCategoryTitle()}</h1>
            <p className="text-white/40">Selecione seu evento para visualizar e adquirir suas fotos.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Buscar por nome ou data..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" /> Categorias
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 max-w-lg mx-auto">
            <Camera className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Nenhum evento no momento</h3>
            <p className="text-sm text-white/40 mb-6">Estamos preparando as próximas galerias. Volte em breve!</p>
            <Link href="/" className="btn-gold !py-2.5 !px-6 text-sm">Voltar para o Início</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const formattedDate = new Date(event.date).toLocaleDateString("pt-BR");
  const photoCount = event._count?.photos ?? 0;

  return (
    <div className="glass-card overflow-hidden group">
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-all duration-500"></div>
        {/* Event cover image */}
        <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
          <img 
            src={event.coverImage || "/mock/wedding.jpg"} 
            alt={event.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-gold-600 text-black text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
            {event.category}
          </span>
        </div>
        
        <div className="absolute bottom-4 left-4 z-20 right-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
           <Link href={`/events/${event.slug}`} className="w-full btn-gold !py-2 text-sm flex items-center justify-center gap-2">
             Visualizar Fotos <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold group-hover:text-gold-400 transition-colors">{event.name}</h3>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-white/40">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>{photoCount} fotos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
