"use client";

import { DollarSign, ArrowUpRight, TrendingUp, CreditCard, Calendar, Users, ShoppingBag } from "lucide-react";

export default function AdminSalesPage() {
  // Mock sales data
  const mockSales = [
    { id: "tx_812a839f", email: "carla.souza@gmail.com", date: "24/07/2026", photos: 5, total: 75.00, method: "Pix", status: "Aprovado" },
    { id: "tx_1a2b3c4d", email: "rodrigo.m@hotmail.com", date: "23/07/2026", photos: 12, total: 144.00, method: "Cartão", status: "Aprovado" },
    { id: "tx_9y8x7w6v", email: "patricia.lima@outlook.com", date: "23/07/2026", photos: 3, total: 45.00, method: "Pix", status: "Aprovado" },
    { id: "tx_4e5f6g7h", email: "marcos.antonio@gmail.com", date: "22/07/2026", photos: 8, total: 96.00, method: "Pix", status: "Aprovado" },
    { id: "tx_0a9b8c7d", email: "luciana.s@gmail.com", date: "20/07/2026", photos: 15, total: 180.00, method: "Cartão", status: "Aprovado" },
  ];

  return (
    <div className="pt-8 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Vendas e Relatórios</h1>
        <p className="text-white/40 text-sm mt-1">Monitore seu faturamento e transações da plataforma.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all flex justify-between items-start">
          <div>
            <p className="text-xs text-white/40 mb-1">Faturamento Total</p>
            <p className="text-2xl font-bold">R$ 4.250,00</p>
            <p className="text-[10px] text-green-500 mt-2 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.4% este mês
            </p>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gold-500">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all flex justify-between items-start">
          <div>
            <p className="text-xs text-white/40 mb-1">Vendas Concluídas</p>
            <p className="text-2xl font-bold">142</p>
            <p className="text-[10px] text-white/30 mt-2 font-medium">Média de R$ 30,00 por compra</p>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gold-500">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all flex justify-between items-start">
          <div>
            <p className="text-xs text-white/40 mb-1">Fotos Vendidas</p>
            <p className="text-2xl font-bold">384</p>
            <p className="text-[10px] text-green-500 mt-2 font-medium">Alta demanda em Casamentos</p>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gold-500">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all flex justify-between items-start">
          <div>
            <p className="text-xs text-white/40 mb-1">Taxa de Conversão</p>
            <p className="text-2xl font-bold">24.8%</p>
            <p className="text-[10px] text-white/30 mt-2 font-medium">De carrinho para compra</p>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gold-500">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="glass-card p-6 border-white/5">
        <h3 className="text-lg font-bold mb-6">Transações Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5">
              <tr className="text-white/30">
                <th className="pb-4 font-medium">ID Transação</th>
                <th className="pb-4 font-medium">Cliente</th>
                <th className="pb-4 font-medium">Data</th>
                <th className="pb-4 font-medium">Fotos</th>
                <th className="pb-4 font-medium">Método</th>
                <th className="pb-4 font-medium">Valor</th>
                <th className="pb-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockSales.map((sale) => (
                <tr key={sale.id} className="group">
                  <td className="py-4 font-mono text-xs text-white/60">
                    {sale.id}
                  </td>
                  <td className="py-4 font-medium text-white/80 group-hover:text-white">
                    {sale.email}
                  </td>
                  <td className="py-4 text-white/40">
                    {sale.date}
                  </td>
                  <td className="py-4 text-white/40">
                    {sale.photos}
                  </td>
                  <td className="py-4 text-white/40">
                    {sale.method}
                  </td>
                  <td className="py-4 text-gold-500 font-bold font-mono">
                    R$ {sale.total.toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold rounded">
                      {sale.status}
                    </span>
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
