import { Shield, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 bg-black text-white min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-gold-500" />
          <h1 className="text-3xl font-bold">Termos de Uso e Privacidade</h1>
        </div>
        
        <p className="text-xs text-white/40 mb-10">Última atualização: 10 de Junho de 2026</p>

        <div className="space-y-8 text-xs text-white/60 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Propriedade Intelectual e Direitos Autorais</h2>
            <p>
              Todas as fotografias disponibilizadas para pré-visualização nesta galeria são de propriedade intelectual exclusiva do fotógrafo **Gabriel Luiz (Gabriel Rec)**, protegidas pela Lei de Direitos Autorais (Lei nº 9.610/98).
            </p>
            <p>
              A captura de tela (screenshot), gravação de tela, compartilhamento ou uso de imagens com marcas d'água sem a devida autorização/pagamento constitui infração de direitos autorais e está sujeita às penalidades da lei.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Uso das Imagens Adquiridas</h2>
            <p>
              Ao realizar a compra de uma foto, o cliente adquire uma **Licença de Uso Pessoal** não exclusiva. Isso lhe confere o direito de:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Compartilhar as imagens em suas redes sociais pessoais.</li>
              <li>Realizar impressões físicas (álbuns, quadros, banners) para uso próprio.</li>
              <li>Armazenar os arquivos em seus dispositivos pessoais de forma privada.</li>
            </ul>
            <p>
              Não é permitida a venda comercial das imagens, o sublicenciamento para marcas de terceiros, ou a alteração digital que descaracterize o trabalho artístico original sem consulta prévia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Política de Reembolso</h2>
            <p>
              Devido à natureza digital do produto (envio imediato do arquivo eletrônico original em alta resolução após o pagamento), **não realizamos devoluções ou reembolsos** após o download das fotos originais ter sido iniciado ou concluído. O cliente visualiza as prévias exatas antes de finalizar a transação.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Privacidade e Proteção de Dados (LGPD)</h2>
            <p>
              Coletamos apenas as informações necessárias para faturamento e entrega segura das fotos (nome completo, e-mail e dados básicos de transação financeira). Seus dados não são vendidos ou compartilhados com terceiros para fins de marketing.
            </p>
            <p>
              Utilizamos cookies estritamente necessários para manter a integridade do seu carrinho de compras e sua sessão na plataforma de seleção de fotos.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
