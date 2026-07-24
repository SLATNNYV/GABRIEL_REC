"use client";

import { Users, Mail, Calendar, Camera, UserCheck, UserX, Award } from "lucide-react";

export default function AdminClientsPage() {
  // Mock clients data
  const mockClients = [
    { id: "cl_1", name: "Carla Souza", email: "carla.souza@gmail.com", date: "15/06/2026", purchases: 2, totalSpent: 125.00 },
    { id: "cl_2", name: "Rodrigo Mendonça", email: "rodrigo.m@hotmail.com", date: "18/06/2026", purchases: 4, totalSpent: 320.00 },
    { id: "cl_3", name: "Patricia Lima", email: "patricia.lima@outlook.com", date: "22/06/2026", purchases: 1, totalSpent: 45.00 },
    { id: "cl_4", name: "Marcos Antônio", email: "marcos.antonio@gmail.com", date: "05/07/2026", purchases: 3, totalSpent: 196.00 },
    { id: "cl_5", name: "Luciana Silva", email: "luciana.s@gmail.com", date: "10/07/2026", purchases: 1, totalSpent: 180.00 },
  ];

  return (
    <div className="pt-8 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Clientes Registrados</h1>
        <p className="text-white/40 text-sm mt-1">Gerencie os clientes que acessam e adquirem fotos em sua plataforma.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all flex justify-between items-start">
          <div>
            <p className="text-xs text-white/40 mb-1">Total de Clientes</p>
            <p className="text-2xl font-bold">8</p>
            <p className="text-[10px] text-white/30 mt-2 font-medium">Registrados via login/checkout</p>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gold-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all flex justify-between items-start">
          <div>
            <p className="text-xs text-white/40 mb-1">Clientes Ativos</p>
            <p className="text-2xl font-bold">5</p>
            <p className="text-[10px] text-green-500 mt-2 font-medium flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Fizeram compras recentemente
            </p>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gold-500">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all flex justify-between items-start">
          <div>
            <p className="text-xs text-white/40 mb-1">Taxa de Fidelidade</p>
            <p className="text-2xl font-bold">37.5%</p>
            <p className="text-[10px] text-white/30 mt-2 font-medium">Clientes com mais de 1 compra</p>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gold-500">
            <Camera className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-card p-6 border-white/5">
        <h3 className="text-lg font-bold mb-6">Lista de Clientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5">
              <tr className="text-white/30">
                <th className="pb-4 font-medium">Nome</th>
                <th className="pb-4 font-medium">E-mail</th>
                <th className="pb-4 font-medium">Data de Cadastro</th>
                <th className="pb-4 font-medium">Compras Realizadas</th>
                <th className="pb-4 font-medium">Total Investido</th>
                <th className="pb-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockClients.map((client) => (
                <tr key={client.id} className="group">
                  <td className="py-4 font-medium text-white/85 group-hover:text-white">
                    {client.name}
                  </td>
                  <td className="py-4 text-white/60">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-white/30" /> {client.email}</span>
                  </td>
                  <td className="py-4 text-white/40">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/30" /> {client.date}</span>
                  </td>
                  <td className="py-4 text-white/40 text-center md:text-left">
                    {client.purchases} pedido(s)
                  </td>
                  <td className="py-4 text-gold-500 font-bold font-mono">
                    R$ {client.totalSpent.toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => alert(`Visualizando detalhes de ${client.name} (Simulado)`)}
                      className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded hover:bg-gold-600 hover:text-black transition-all"
                    >
                      Ver Histórico
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
