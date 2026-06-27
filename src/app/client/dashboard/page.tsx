import { ShoppingBag, Heart, ShieldCheck, Download, Settings, Clock } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold">Olá, Gabriel!</h1>
            <p className="text-white/40">Bem-vindo à sua área exclusiva.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors">
            <Settings className="w-4 h-4" /> Editar Perfil
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - History */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold-500" /> Minhas Compras
              </h2>
              
              <div className="space-y-4">
                <OrderItem 
                  eventName="Casamento João e Maria" 
                  date="02/06/2026" 
                  items={12} 
                  total="180,00" 
                  status="Concluído"
                />
                <OrderItem 
                  eventName="Aniversário Pedro 15 anos" 
                  date="15/05/2026" 
                  items={5} 
                  total="75,00" 
                  status="Concluído"
                />
              </div>
            </section>

            <section className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" /> Meus Favoritos
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/10 hover:border-gold-500/50 transition-colors cursor-pointer"></div>
                ))}
              </div>
              <p className="text-center text-xs text-white/30 mt-6">Você tem 14 fotos favoritadas.</p>
            </section>
          </div>

          {/* Right Column - Stats & Security */}
          <div className="space-y-8">
            <div className="bg-gold-600 rounded-2xl p-8 text-black shadow-xl shadow-gold-600/10">
               <h3 className="text-lg font-bold mb-4">Fotos Adquiridas</h3>
               <p className="text-4xl font-black mb-2">17</p>
               <p className="text-sm font-medium opacity-70">Todas liberadas em alta resolução.</p>
               
               <button className="w-full bg-black text-white mt-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors">
                  <Download className="w-4 h-4" /> Baixar Tudo (.zip)
               </button>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Segurança</h3>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-xs text-white/60 leading-relaxed">Seus downloads são monitorados e as URLs são geradas de forma segura e temporária.</p>
                 </div>
                 <div className="flex gap-4">
                    <Clock className="w-5 h-5 text-gold-500 shrink-0" />
                    <p className="text-xs text-white/60 leading-relaxed">O link de download expira em 24h para sua segurança. Você pode gerar um novo a qualquer momento.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
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
             <p className="text-xs text-white/40">{date} • {items} fotos</p>
          </div>
       </div>
       <div className="text-right">
          <p className="font-bold text-white">R$ {total}</p>
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">{status}</span>
       </div>
    </div>
  );
}
