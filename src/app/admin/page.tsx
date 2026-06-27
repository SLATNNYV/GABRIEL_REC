import { LayoutDashboard, Image as ImageIcon, Users, DollarSign, Plus, Download } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="pt-24 min-h-screen bg-zinc-950 flex">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-white/5 p-6 hidden md:block">
        <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-8">Administração</h2>
        <nav className="space-y-2">
          <AdminNavLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active />
          <AdminNavLink href="/admin/events" icon={<ImageIcon className="w-4 h-4" />} label="Gerenciar Eventos" />
          <AdminNavLink href="/admin/sales" icon={<DollarSign className="w-4 h-4" />} label="Vendas e Relatórios" />
          <AdminNavLink href="/admin/clients" icon={<Users className="w-4 h-4" />} label="Clientes" />
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-grow p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Painel do Fotógrafo</h1>
            <p className="text-white/40">Visão geral da sua plataforma e vendas.</p>
          </div>
          <Link href="/admin/events/new" className="btn-gold flex items-center gap-2 !py-2 !px-5 text-sm">
            <Plus className="w-4 h-4" /> Criar Novo Evento
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           <StatCard title="Vendas Totais" value="R$ 12.450,00" change="+12% este mês" />
           <StatCard title="Fotos Vendidas" value="842" change="+45 hoje" />
           <StatCard title="Eventos Ativos" value="12" />
           <StatCard title="Novos Clientes" value="28" change="+5% vs semana passada" />
        </div>

        {/* Recent Events List */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6">Eventos Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-white/30">
                  <th className="pb-4 font-medium">Evento</th>
                  <th className="pb-4 font-medium">Data</th>
                  <th className="pb-4 font-medium">Fotos</th>
                  <th className="pb-4 font-medium">Vendas</th>
                  <th className="pb-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AdminEventRow name="Casamento João e Maria" date="15/05/2026" photos={450} sales="R$ 2.450" />
                <AdminEventRow name="Formatura Direito UNESPAR" date="22/11/2026" photos={1200} sales="R$ 5.820" />
                <AdminEventRow name="Aniversário Pedro 15 anos" date="10/08/2026" photos={380} sales="R$ 1.100" />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, change }: { title: string; value: string; change?: string }) {
  return (
    <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all">
       <p className="text-xs text-white/40 mb-1">{title}</p>
       <p className="text-2xl font-bold">{value}</p>
       {change && <p className="text-[10px] text-green-500 mt-2 font-medium">{change}</p>}
    </div>
  );
}

function AdminNavLink({ href, icon, label, active = false }: { href: string; icon: any; label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? "bg-gold-600 text-black" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
      {icon}
      {label}
    </Link>
  );
}

function AdminEventRow({ name, date, photos, sales }: any) {
  return (
    <tr className="group">
      <td className="py-4 font-medium text-white/80 group-hover:text-white">{name}</td>
      <td className="py-4 text-white/40">{date}</td>
      <td className="py-4 text-white/40">{photos}</td>
      <td className="py-4 text-gold-500 font-bold">{sales}</td>
      <td className="py-4 text-right">
        <button className="text-xs bg-white/5 px-3 py-1 rounded hover:bg-white/10 transition-colors">Editar</button>
      </td>
    </tr>
  );
}
