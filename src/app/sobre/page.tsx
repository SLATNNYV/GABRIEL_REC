import { Camera, Eye, Award, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 bg-black text-white min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Profile Intro Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 group">
            {/* Using wedding cover as profile mock placeholder */}
            <img 
              src="/mock/wedding.jpg" 
              alt="Gabriel Luiz - Fotógrafo" 
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <p className="text-xs text-gold-500 font-black tracking-widest uppercase">Fundador & Fotógrafo Principal</p>
              <h2 className="text-2xl font-bold">Gabriel Luiz</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-600/10 border border-gold-600/20 text-gold-500 rounded-full text-xs font-semibold">
              <Camera className="w-3.5 h-3.5" /> O Olhar por trás da Lente
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Eternizando momentos <br />
              <span className="text-gold-500">com Alma e Técnica.</span>
            </h1>

            <p className="text-white/60 leading-relaxed">
              Olá! Sou o Gabriel Luiz, fotógrafo idealizador da **Gabriel Rec**. Há mais de 7 anos venho me dedicando à arte de registrar momentos que contam histórias. Acredito que a fotografia vai além do clique técnico; ela capta a emoção espontânea, o detalhe silencioso e a atmosfera de comemoração.
            </p>

            <p className="text-white/60 leading-relaxed">
              Especializado em casamentos, formaturas de prestígio e ensaios corporativos de posicionamento, meu compromisso é entregar não apenas imagens de altíssima qualidade técnica, mas memórias prontas para durar gerações.
            </p>

            <div className="pt-4 flex gap-4">
              <Link href="/servicos" className="btn-gold">
                Nossos Serviços
              </Link>
              <a href="https://wa.me/5544998348208" target="_blank" className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all text-sm font-semibold flex items-center justify-center">
                Fale Comigo
              </a>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="py-16 border-t border-white/5 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nossos Pilares</h2>
            <p className="text-white/40 max-w-md mx-auto">O que nos move e garante a excelência em cada evento que cobrimos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Eye className="w-6 h-6 text-gold-500" />}
              title="Olhar Artístico"
              description="Buscamos a espontaneidade e a emoção pura. Cada ângulo é planejado para captar a essência do momento."
            />
            <ValueCard 
              icon={<Award className="w-6 h-6 text-gold-500" />}
              title="Equipamento de Ponta"
              description="Câmeras mirrorless Full Frame de altíssima resolução, lentes premium e iluminação controlada para máxima fidelidade."
            />
            <ValueCard 
              icon={<Heart className="w-6 h-6 text-gold-500" />}
              title="Entrega de Excelência"
              description="Nossa plataforma exclusiva de seleção e download garante que você receba suas imagens com a máxima resolução com segurança."
            />
          </div>
        </div>

        {/* Equipment & Workflow Section */}
        <div className="glass-card p-10 border-white/5 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Equipamentos e Tecnologia</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Para entregar o melhor resultado em ambientes desafiadores (como salões de festas e cerimônias noturnas), investimos constantemente em tecnologia. Trabalhamos com corpos Sony Alpha Full Frame, lentes das linhas G-Master de alta abertura (f/1.4 e f/2.8) e sistemas de backup duplo de cartões em tempo real.
              </p>
              <ul className="space-y-3 text-xs text-white/50">
                <li className="flex items-center gap-2">✔ Sensores Full Frame Sony Mirrorless</li>
                <li className="flex items-center gap-2">✔ Lentes Prime G-Master de Alta Resolução</li>
                <li className="flex items-center gap-2">✔ Iluminação de Flash TTL Avançada</li>
                <li className="flex items-center gap-2">✔ Processamento de Cor Calibrado em Lightroom & Photoshop</li>
              </ul>
            </div>
            
            <div className="p-8 bg-white/5 rounded-2xl border border-white/5 text-center">
              <h4 className="text-sm font-bold text-gold-500 mb-2 uppercase">Quer agendar seu evento?</h4>
              <p className="text-xs text-white/40 mb-6">Entre em contato para solicitar orçamentos de coberturas de casamentos, formaturas ou ensaios.</p>
              <a 
                href="https://wa.me/5544998348208" 
                target="_blank"
                className="btn-gold inline-flex items-center gap-2 text-sm justify-center w-full"
              >
                Conversar pelo WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold-600/5 blur-[120px] rounded-full"></div>
        </div>

      </div>
    </div>
  );
}

function ValueCard({ icon, title, description }: any) {
  return (
    <div className="glass-card p-8 border-white/5 hover:border-gold-600/30 transition-all duration-300">
      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-gold-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-white/40 text-xs leading-relaxed">{description}</p>
    </div>
  );
}
