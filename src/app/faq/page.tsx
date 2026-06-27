import { Search, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="pt-32 pb-20 bg-black text-white min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Dúvidas Frequentes</h1>
          <p className="text-white/40 max-w-md mx-auto">
            Encontre respostas rápidas para as principais dúvidas sobre nossa plataforma, compra de fotos e entrega.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-6 mb-20">
          <FAQItem 
            question="Como funciona a compra de fotos da galeria?"
            answer="É muito simples! Acesse a Galeria de Eventos, clique nas fotos que deseja adquirir (elas serão marcadas com uma borda dourada) e use a barra inferior para ir para o Checkout. Lá você preenche suas informações, efetua o pagamento (por Pix ou Cartão) e as fotos originais em alta resolução são liberadas para download imediatamente na tela de sucesso e na sua área exclusiva."
          />
          <FAQItem 
            question="As fotos vêm com marca d'água após o pagamento?"
            answer="Não! A marca d'água serve apenas para proteção de pré-visualização das fotos não adquiridas. Assim que o pagamento é aprovado, o sistema libera a versão original tratada de alta resolução totalmente limpa e sem nenhuma marca d'água."
          />
          <FAQItem 
            question="Qual é o formato e resolução das fotos que irei baixar?"
            answer="Todas as fotos adquiridas são fornecidas no formato JPEG de alta resolução (geralmente entre 20 a 24 megapixels), perfeitas tanto para compartilhamento em redes sociais de alta fidelidade quanto para impressão física em álbuns, quadros e banners."
          />
          <FAQItem 
            question="Qual o prazo para receber as fotos após o pagamento?"
            answer="Se o pagamento for feito via Pix, a liberação é instantânea. Se for por cartão de crédito, a liberação ocorre assim que a administradora do cartão aprovar a transação (normalmente em poucos segundos)."
          />
          <FAQItem 
            question="Por quanto tempo minhas fotos ficam disponíveis na nuvem?"
            answer="Garantimos o armazenamento seguro das fotos adquiridas na plataforma por até 1 ano após a data de compra. Recomendamos que você faça o download de todas as fotos e armazene backups em seus dispositivos pessoais."
          />
          <FAQItem 
            question="Consigo comprar todas as fotos de um evento de uma vez?"
            answer="Sim! Disponibilizamos a opção de 'Comprar Pacote Completo' diretamente na página do evento por um preço fixo promocional. Ao clicar nesta opção, você adquire todas as fotos da galeria daquele evento de uma única vez."
          />
        </div>

        {/* Contact CTA */}
        <div className="glass-card p-10 border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-950/40">
          <div>
            <h3 className="text-lg font-bold mb-2">Não encontrou sua dúvida?</h3>
            <p className="text-xs text-white/40">Fale diretamente com o suporte para receber ajuda com sua compra.</p>
          </div>
          <a 
            href="https://wa.me/5544998348208" 
            target="_blank"
            className="btn-gold flex items-center gap-2 whitespace-nowrap"
          >
            Falar com Suporte <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}

function FAQItem({ question, answer }: any) {
  return (
    <div className="glass-card p-6 border-white/5 hover:border-gold-600/20 transition-all duration-300">
      <h3 className="text-md font-bold mb-3 flex items-start gap-2.5 text-white/90">
        <HelpCircle className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
        {question}
      </h3>
      <p className="text-white/50 text-xs leading-relaxed pl-7">{answer}</p>
    </div>
  );
}
