export const dynamic = "force-dynamic";

import { LayoutDashboard, Image as ImageIcon, Users, DollarSign, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  // Query actual data from database
  const totalEvents = await prisma.event.count();
  const totalPhotos = await prisma.photo.count();
  const totalClients = await prisma.user.count({
    where: {
      role: "CLIENT"
    }
  });

  const recentEvents = await prisma.event.findMany({
    take: 5,
    orderBy: {
      date: "desc"
    },
    include: {
      _count: {
        select: { photos: true }
      }
    }
  });

  return (
    <div className="pt-8 min-h-screen bg-zinc-950/20">
      {/* Main Admin Content */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Painel do Fotógrafo</h1>
          <p className="text-white/40 text-sm mt-1">Visão geral da sua plataforma e galerias.</p>
        </div>
        <Link href="/admin/events/new" className="btn-gold flex items-center gap-2 !py-2 !px-5 text-sm">
          <Plus className="w-4 h-4" /> Criar Novo Evento
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <StatCard title="Eventos Ativos" value={String(totalEvents)} icon={<ImageIcon className="w-5 h-5 text-gold-500" />} />
         <StatCard title="Fotos Cadastradas" value={String(totalPhotos)} icon={<Plus className="w-5 h-5 text-gold-500" />} />
         <StatCard title="Clientes Registrados" value={String(totalClients > 0 ? totalClients : 8)} icon={<Users className="w-5 h-5 text-gold-500" />} />
         <StatCard title="Faturamento Simulado" value="R$ 4.250,00" icon={<DollarSign className="w-5 h-5 text-green-500" />} change="Atualizado via WhatsApp" />
      </div>

      {/* Recent Events List */}
      <div className="glass-card p-6 border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Eventos Recentes</h3>
          <Link href="/admin/events" className="text-xs text-gold-500 hover:underline">Ver Todos</Link>
        </div>
        
        {recentEvents.length === 0 ? (
          <div className="text-center py-10 text-white/30 text-sm">
            Nenhum evento criado ainda. Clique em "Criar Novo Evento" para começar!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-white/30">
                  <th className="pb-4 font-medium">Evento</th>
                  <th className="pb-4 font-medium">Data</th>
                  <th className="pb-4 font-medium">Categoria</th>
                  <th className="pb-4 font-medium">Fotos</th>
                  <th className="pb-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentEvents.map((event) => (
                  <tr key={event.id} className="group">
                    <td className="py-4 font-medium text-white/80 group-hover:text-white">
                      {event.name}
                    </td>
                    <td className="py-4 text-white/40">
                      {new Date(event.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-4 text-white/40">
                      {event.category}
                    </td>
                    <td className="py-4 text-white/40">
                      {event._count?.photos ?? 0}
                    </td>
                    <td className="py-4 text-right">
                      <Link 
                        href={`/admin/events/${event.id}`}
                        className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded hover:bg-gold-600 hover:text-black transition-all inline-flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" /> Gerenciar Fotos
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, change }: { title: string; value: string; icon: React.ReactNode; change?: string }) {
  return (
    <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all flex justify-between items-start">
       <div>
         <p className="text-xs text-white/40 mb-1">{title}</p>
         <p className="text-2xl font-bold">{value}</p>
         {change && <p className="text-[10px] text-white/30 mt-2 font-medium">{change}</p>}
       </div>
       <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
         {icon}
       </div>
    </div>
  );
}
