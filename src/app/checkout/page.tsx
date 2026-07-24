"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Shield, Check, Trash2, CreditCard, Send, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
        setIsProcessing(false);
        // Redirect client to Stripe Checkout (handles Pix + Credit Card securely)
        window.location.href = data.url;
      } else {
        throw new Error("URL de pagamento não retornada pelo servidor.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao processar pagamento.");
      setIsProcessing(false);
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

              {/* Payment and Auto Release Info */}
              <div className="glass-card p-8 border-gold-500/20 bg-gradient-to-b from-zinc-950 to-black">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold-600/10 text-gold-500 rounded-full flex items-center justify-center text-xs font-black">2</span>
                  Pagamento Seguro
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start bg-gold-600/5 border border-gold-500/20 p-5 rounded-xl">
                    <Shield className="w-6 h-6 text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Como funciona a liberação automática?</h4>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Ao clicar no botão abaixo, você será redirecionado para a página segura do Stripe.
                      </p>
                      <ul className="text-xs text-white/50 list-disc pl-4 mt-2 space-y-1">
                        <li>Você pode efetuar o pagamento via **Pix** ou **Cartão de Crédito**.</li>
                        <li>Assim que o pagamento for aprovado pelo Stripe, o site liberará instantaneamente o download das fotos originais em alta resolução (sem marcas d'água) e as salvará no seu histórico.</li>
                      </ul>
                    </div>
                  </div>

                  <form onSubmit={handleCheckoutSubmit}>
                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full btn-gold !py-4 text-md font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        "Redirecionando..."
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Ir para Pagamento Seguro (R$ {total.toFixed(2)})
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

              {/* Support / WhatsApp CTA */}
              <div className="glass-card p-6 border-white/5 bg-zinc-950/40">
                <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-gold-500" />
                  Dúvidas sobre o pedido?
                </h4>
                <p className="text-[10px] text-white/40 leading-relaxed mb-4">
                  Se você tiver qualquer dúvida ou quiser solicitar um orçamento, fale diretamente conosco.
                </p>
                <a 
                  href="https://wa.me/5544998348208" 
                  target="_blank" 
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
