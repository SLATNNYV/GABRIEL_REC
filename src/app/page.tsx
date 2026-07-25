import Link from "next/link";
import { ArrowRight, Star, Heart, Camera, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(180,83,9,0.1),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>
          {/* Static decoration for now, would be a background image */}
          <div className="w-full h-full bg-[url('/hero-bg.png')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-600/10 border border-gold-600/20 text-gold-500 text-sm font-semibold mb-8 backdrop-blur-sm">
              <Star className="w-4 h-4" />
              <span>Referência em Fotografia de Eventos</span>
            </div>
            
            <h1 className="heading-hero mb-8">
              Momentos que <br />
              <span className="text-gold-500">Duram para Sempre.</span>
            </h1>
            
            <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-2xl">
              Somos especialistas em eternizar os grandes momentos da sua vida. Casamentos, formaturas e eventos corporativos com a qualidade que você merece.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/events" className="btn-gold flex items-center justify-center gap-2">
                Ver Eventos <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/login" className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all flex items-center justify-center font-semibold">
                Entrar na Minha Área
              </Link>
            </div>
          </div>
        </div>

        {/* Floating cards simulation */}
        <div className="absolute right-0 bottom-20 hidden lg:block translate-x-12">
            <div className="glass-card p-4 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                <div>
                   <p className="text-xs text-white/40">Visualizações Hoje</p>
                   <p className="text-xl font-bold">1.240+</p>
                </div>
            </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Nossa Especialidade</h2>
            <p className="text-white/40 max-w-xl mx-auto">Oferecemos uma experiência completa, desde o clique inicial até a entrega digital segura das suas memórias.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Heart className="w-6 h-6 text-pink-500" />}
              title="Casamentos"
              description="Cobertura cinematográfica para o dia mais importante da sua jornada a dois."
            />
            <ServiceCard 
              icon={<Zap className="w-6 h-6 text-gold-500" />}
              title="Formaturas"
              description="A celebração da sua conquista, capturada com intensidade e alegria."
            />
            <ServiceCard 
              icon={<Camera className="w-6 h-6 text-cyan-500" />}
              title="Ensaios & Corporativo"
              description="Posicionamento de marca ou ensaios pessoais com foco em expressão e elegância."
            />
          </div>
        </div>
      </section>

      {/* Simple CTA for the Store */}
      <section className="py-20 bg-gradient-to-b from-black to-gold-950/20">
        <div className="container mx-auto px-6">
          <div className="glass-card p-12 text-center overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 text-white">Pronto para encontrar suas fotos?</h2>
              <p className="text-white/60 mb-10 max-w-2xl mx-auto">Acesse seu evento agora mesmo, selecione suas favoritas e receba as versões originais sem marcas d'água instantaneamente após o pagamento.</p>
              <Link href="/events" className="btn-gold inline-flex items-center gap-3">
                Explorar Galeria de Eventos <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gold-600/10 blur-[100px] rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-8 hover:border-gold-600/30 transition-all duration-300 group">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-gold-600/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-gold-500 transition-colors">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
