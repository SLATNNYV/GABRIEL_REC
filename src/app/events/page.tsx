import { Search, Filter, Calendar as CalendarIcon, Camera, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data for initial visualization
const MOCK_EVENTS = [
  {
    id: "1",
    name: "Casamento João e Maria",
    date: "15/05/2026",
    cover: "/mock/wedding.jpg",
    photoCount: 450,
    category: "Casamento",
    slug: "casamento-joao-maria"
  },
  {
    id: "2",
    name: "Formatura Direito UNESPAR",
    date: "22/11/2026",
    cover: "/mock/grad.jpg",
    photoCount: 1200,
    category: "Formatura",
    slug: "formatura-direito-unespar"
  },
  {
    id: "3",
    name: "Aniversário Pedro 15 anos",
    date: "10/08/2026",
    cover: "/mock/party.jpg",
    photoCount: 380,
    category: "Aniversário",
    slug: "aniversario-pedro"
  },
  {
    id: "4",
    name: "Evento Corporativo InovaHub",
    date: "05/01/2026",
    cover: "/mock/corp.jpg",
    photoCount: 150,
    category: "Corporativo",
    slug: "inovahub-2026"
  }
];

export default function EventsPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Galeria de Eventos</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <div className="glass-card overflow-hidden group">
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-all duration-500"></div>
        {/* Placeholder for cover image */}
        <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white/10 group-hover:scale-110 transition-transform duration-700">
           <Camera className="w-12 h-12" />
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
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>{event.photoCount} fotos</span>
          </div>
        </div>
      </div>
    </div>
  );
}

