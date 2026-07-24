"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Shield, Check, Trash2, MessageSquare, Send, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "stripe">("whatsapp");
  
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "GABRIEL10") {
      setDiscount(0.10); // 10% discount
      setCouponApplied(true);
    } else if (coupon.toUpperCase() === "VISIONARY") {
      setDiscount(0.20); // 20% discount
      setCouponApplied(true);
    } else {
      alert("Cupom inválido!");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!email || !name) {
      alert("Por favor, preencha seus dados de identificação.");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === "whatsapp") {
      const whatsappNumber = "5544998348208";

      // Build the photo list formatted for WhatsApp text
      const itemsList = cartItems.map((item, idx) => {
        return `   - Foto ID: ${item.id} (${item.price ? `R$ ${item.price.toFixed(2)}` : "Sob consulta"})`;
      }).join("\n");

      const message = `Olá Gabriel Rec! Gostaria de finalizar meu pedido de fotos.

*DADOS DO CLIENTE:*
- Nome: ${name}
- E-mail: ${email}

*FOTOS ADQUIRIDAS:*
${itemsList}

*RESUMO DO PEDIDO:*
- Quantidade: ${cartItems.length} foto(s)
- Desconto: R$ ${discountAmount.toFixed(2)}
- Valor Total: *R$ ${total.toFixed(2)}*

Por favor, me envie os dados para pagamento Pix e liberação do link de download em alta resolução.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Store purchased items list and clear cart
      localStorage.setItem("purchasedItems", JSON.stringify(cartItems));
      localStorage.removeItem("cartItems");

      setTimeout(() => {
        setIsProcessing(false);
        // Open WhatsApp in a new tab and redirect current window to success page
        window.open(whatsappUrl, "_blank");
        router.push("/checkout/success?method=pix");
      }, 1500);
    } else {
      // Stripe payment route
      try {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems,
            email: email,
          }),
        });

        if (!res.ok) {
          throw new Error("Erro ao criar sessão de pagamento no Stripe.");
        }

        const data = await res.json();
        if (data.url) {
          // Store purchased items list before redirecting
          localStorage.setItem("purchasedItems", JSON.stringify(cartItems));
          localStorage.removeItem("cartItems");
          
          setIsProcessing(false);
          window.location.href = data.url;
        } else {
          throw new Error("URL de pagamento não retornada.");
        }
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Erro ao processar pagamento com cartão.");
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen text-white">
      <div className="container mx-auto px-6">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para a Galeria
        </Link>

        <h1 className="text-3xl font-bold mb-10">Finalizar Compra</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-white/40 mb-6">Seu carrinho está vazio.</p>
            <Link href="/events" className="btn-gold !py-2.5 !px-6 text-sm">Ver Eventos</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Identification and Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Info */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold-600/10 text-gold-500 rounded-full flex items-center justify-center text-xs font-black">1</span>
                  Identificação do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                      placeholder="Nome do Comprador"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">E-mail para receber as fotos</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Selector and Info */}
              <div className="glass-card p-8 border-gold-500/20 bg-gradient-to-b from-zinc-950 to-black">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold-600/10 text-gold-500 rounded-full flex items-center justify-center text-xs font-black">2</span>
                  Forma de Pagamento
                </h3>

                {/* Payment Methods Tabs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "whatsapp" ? "border-gold-500 bg-gold-500/5 text-white" : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"}`}
                  >
                    <MessageSquare className="w-6 h-6 text-gold-500" />
                    <span className="text-xs font-bold">WhatsApp (Pix)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === "stripe" ? "border-gold-500 bg-gold-500/5 text-white" : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"}`}
                  >
                    <CreditCard className="w-6 h-6 text-cyan-500" />
                    <span className="text-xs font-bold">Cartão de Crédito</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {paymentMethod === "whatsapp" ? (
                    <div className="flex gap-4 items-start bg-gold-600/5 border border-gold-500/20 p-5 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-gold-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Como funciona o Pix via WhatsApp?</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Ao finalizar, abriremos o WhatsApp do fotógrafo *Gabriel Rec* com seu pedido detalhado.
                        </p>
                        <ul className="text-xs text-white/50 list-disc pl-4 mt-2 space-y-1">
                          <li>Você realiza a transferência via Pix informada na conversa.</li>
                          <li>Após a comprovação, o fotógrafo libera suas fotos na Área de Cliente.</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-start bg-cyan-600/5 border border-cyan-500/20 p-5 rounded-xl">
                      <CreditCard className="w-6 h-6 text-cyan-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Como funciona o pagamento automático?</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Você será redirecionado para a plataforma de pagamento seguro do Stripe.
                        </p>
                        <ul className="text-xs text-white/50 list-disc pl-4 mt-2 space-y-1">
                          <li>Pague no cartão de crédito em ambiente criptografado e seguro.</li>
                          <li>Suas fotos em alta resolução sem marcas d'água são **liberadas instantaneamente** para download após a aprovação!</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleCheckoutSubmit}>
                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full btn-gold !py-4 text-md font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        "Processando..."
                      ) : paymentMethod === "whatsapp" ? (
                        <>
                          <Send className="w-5 h-5" />
                          Finalizar e Ir para WhatsApp (R$ {total.toFixed(2)})
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Pagar com Cartão (R$ {total.toFixed(2)})
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Panel: Order Summary */}
            <div className="space-y-6">
              <div className="glass-card p-6 border-white/5">
                <h3 className="text-lg font-bold mb-6 border-b border-white/5 pb-4">Resumo do Pedido</h3>
                
                {/* Items list */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden relative border border-white/10 shrink-0">
                          <img src={item.url} alt="Foto preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white/80 truncate">Foto</p>
                          <p className="text-[10px] text-white/45 truncate">ID: {item.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-gold-500">R$ {item.price.toFixed(2)}</span>
                        <button onClick={() => removeItem(item.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Cupom de Desconto</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      disabled={couponApplied}
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-gold-500/50 transition-colors text-white flex-grow uppercase"
                      placeholder="Código"
                    />
                    <button 
                      onClick={applyCoupon}
                      disabled={couponApplied}
                      className="bg-white/10 border border-white/10 text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-white/20 transition-all disabled:bg-green-500 disabled:text-black flex items-center justify-center gap-1.5"
                    >
                      {couponApplied ? <Check className="w-3.5 h-3.5" /> : "Aplicar"}
                    </button>
                  </div>
                  <p className="text-[9px] text-white/30 mt-1.5">Dica: Use o cupom <b>VISIONARY</b> para 20% de desconto.</p>
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-white/5 text-sm">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal ({cartItems.length} itens)</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Desconto</span>
                      <span>- R$ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-md font-bold pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span className="text-gold-500">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security info */}
              <div className="glass-card p-6 border-white/5 flex gap-4 items-start bg-zinc-950/20">
                <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Contato Direto e Seguro</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Você falará diretamente com o fotógrafo autorizado. Suas fotos originais de alta resolução serão enviadas com segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
