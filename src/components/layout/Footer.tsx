import Link from "next/link";
import { Camera, Instagram, Facebook, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-gold-950/20 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <img 
                src="/logo-white.png" 
                alt="Gabriel Rec" 
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
              />
              <span className="text-xl font-bold tracking-tighter text-white">GABRIEL REC</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Capturando momentos únicos e transformando emoções em memórias eternas através de lentes profissionais e olhar artístico.
            </p>
            <div className="flex gap-4">
              <Link href="https://instagram.com/gabrielluiz.rec" target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-gold-500 hover:text-black transition-all">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-gold-500 hover:text-black transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Navegação</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/events" className="hover:text-gold-500 transition-colors">Ver Eventos</Link></li>
              <li><Link href="/servicos" className="hover:text-gold-500 transition-colors">Serviços</Link></li>
              <li><Link href="/faq" className="hover:text-gold-500 transition-colors">Dúvidas Frequentes</Link></li>
              <li><Link href="/termos" className="hover:text-gold-500 transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Categorias</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/events?category=casamentos" className="hover:text-gold-500 transition-colors">Casamentos</Link></li>
              <li><Link href="/events?category=formaturas" className="hover:text-gold-500 transition-colors">Formaturas</Link></li>
              <li><Link href="/events?category=corporativo" className="hover:text-gold-500 transition-colors">Eventos Corporativos</Link></li>
              <li><Link href="/events?category=ensaios" className="hover:text-gold-500 transition-colors">Ensaios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contato</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500" />
                <span>ogabrielrec@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500" />
                <span>(44) 99834-8208</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© 2026 Gabriel Luiz (Gabriel Rec). Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="#">Privacidade</Link>
            <Link href="#">LGPD</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
