import { Heart, Zap, Camera, ShieldCheck, Download, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-20 bg-black text-white min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Nossos Serviços</h1>
          <p className="text-white/40 max-w-xl mx-auto">
            Oferecemos soluções completas em fotografia profissional, desde a captura até a seleção e entrega digital.
          </p>
        </div>

        {/* Services Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <ServiceBlock 
            icon={<Heart className="w-6 h-6 text-pink-500" />}
            title="Casamentos"
            tagline="Para o grande dia da sua vida"
            features={[
              "Cobertura completa (making of, cerimônia e recepção)",
              "Dois fotógrafos profissionais experientes",
              "Ensaios pré-wedding (pré-casamento) incluídos",
              "Galeria digital exclusiva com download liberado para os noivos",
              "Entrega física de álbum de luxo encadernado opcional"
            ]}
            highlight
          />
          <ServiceBlock 
            icon={<Zap className="w-6 h-6 text-gold-500" />}
            title="Formaturas"
            tagline="Sua grande conquista registrada"
            features={[
              "Cobertura do culto ecumênico e colação de grau",
              "Sessões individuais em estúdio ou locação externa",
              "Fotógrafo exclusivo no baile de formatura",
              "Plataforma online para os convidados comprarem fotos extras",
              "Arquivos digitais em alta resolução sem marcas d'água"
            ]}
          />
          <ServiceBlock 
            icon={<Camera className="w-6 h-6 text-cyan-500" />}
            title="Ensaios & Corporativo"
            tagline="Sua imagem pessoal e posicionamento"
            features={[
              "Ensaios individuais femininos e masculinos",
              "Retratos corporativos de posicionamento de marca",
              "Fotografia candid de palestras, seminários e convenções",
              "Iluminação profissional móvel de estúdio",
              "Tratamento de pele e pós-processamento premium incluídos"
            ]}
          />
          <ServiceBlock 
            icon={<Users className="w-6 h-6 text-green-500" />}
            title="Eventos Sociais"
            tagline="Aniversários, festas e batizados"
            features={[
              "Cobertura profissional com foco em momentos espontâneos",
              "Fotografias de decoração e detalhes da festa",
              "Fotos de família e posadas na mesa do bolo",
              "Entrega ágil de prévias em até 48 horas",
              "Armazenamento em nuvem seguro por até 1 ano"
            ]}
          />
        </div>

        {/* Workflow Info Section */}
        <div className="py-16 border-t border-white/5 text-center">
          <h2 className="text-3xl font-bold mb-12">Como Funciona Nosso Processo?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepItem 
              number="1"
              title="Planejamento & Briefing"
              description="Reunimos para alinhar o cronograma do evento, momentos-chave que não podem faltar e o estilo visual."
            />
            <StepItem 
              number="2"
              title="O Dia do Evento"
              description="Capturamos com alta técnica e de forma discreta, priorizando momentos espontâneos e sorrisos reais."
            />
            <StepItem 
              number="3"
              title="Galeria & Entrega"
              description="Subimos as fotos tratadas em nossa plataforma segura para você selecionar, comprar e baixar em alta resolução."
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-card p-12 text-center bg-gradient-to-r from-zinc-950 to-gold-950/20 border-white/5 mt-12 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Tem um projeto ou evento em mente?</h3>
            <p className="text-white/60 mb-8 max-w-xl mx-auto text-sm">
              Fale diretamente comigo pelo WhatsApp para tirar suas dúvidas, conferir datas disponíveis na agenda e solicitar um orçamento personalizado.
            </p>
            <a 
              href="https://wa.me/5544998348208" 
              target="_blank"
              className="btn-gold inline-flex items-center gap-2"
            >
              Falar Conosco no WhatsApp <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-gold-600/5 blur-[100px] rounded-full"></div>
        </div>

      </div>
    </div>
  );
}

function ServiceBlock({ icon, title, tagline, features, highlight = false }: any) {
  return (
    <div className={`glass-card p-8 flex flex-col justify-between transition-all duration-300 border ${highlight ? "border-gold-500/40 shadow-xl shadow-gold-500/5 bg-zinc-950/40" : "border-white/5 hover:border-white/20"}`}>
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">
            {icon}
          </div>
          {highlight && (
            <span className="text-[10px] bg-gold-600 text-black font-black uppercase tracking-wider py-1 px-3 rounded-full">
              Mais Solicitado
            </span>
          )}
        </div>
        
        <h3 className="text-2xl font-bold mb-1 text-white">{title}</h3>
        <p className="text-xs text-white/40 mb-6">{tagline}</p>
        
        <ul className="space-y-3.5 text-xs text-white/70">
          {features.map((feature: string, i: number) => (
            <li key={i} className="flex gap-3 items-start">
              <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-8 mt-8 border-t border-white/5">
        <a 
          href="https://wa.me/5544998348208" 
          target="_blank" 
          className={`w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all ${highlight ? "bg-gold-600 text-black hover:bg-gold-500" : "bg-white/5 text-white hover:bg-white/10"}`}
        >
          Solicitar Orçamento
        </a>
      </div>
    </div>
  );
}

function StepItem({ number, title, description }: any) {
  return (
    <div className="glass-card p-8 border-white/5 relative">
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gold-600 text-black flex items-center justify-center text-lg font-black border-4 border-black shadow-lg">
        {number}
      </span>
      <h4 className="text-lg font-bold mt-4 mb-3 text-white">{title}</h4>
      <p className="text-white/40 text-xs leading-relaxed">{description}</p>
    </div>
  );
}
