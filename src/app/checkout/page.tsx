"use client";

import { useState, useEffect } from "react";
import { CreditCard, ArrowLeft, Shield, Check, Trash2, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

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

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!email || !name) {
      alert("Por favor, preencha os dados do cliente.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      // Store purchased items to localStorage
      localStorage.setItem("purchasedItems", JSON.stringify(cartItems));
      // Clear cart
      localStorage.removeItem("cartItems");
      // Redirect
      router.push("/checkout/success");
    }, 2500);
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
            {/* Left Panel: Customer and Payment details */}
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

              {/* Payment Methods */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold-600/10 text-gold-500 rounded-full flex items-center justify-center text-xs font-black">2</span>
                  Forma de Pagamento
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={() => setPaymentMethod("pix")}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === "pix" ? "border-gold-500 bg-gold-600/5" : "border-white/5 bg-white/5 hover:border-white/20"}`}
                  >
                    <Smartphone className="w-6 h-6 text-gold-500" />
                    <span className="text-sm font-semibold">PIX (Aprovação Instantânea)</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === "card" ? "border-gold-500 bg-gold-600/5" : "border-white/5 bg-white/5 hover:border-white/20"}`}
                  >
                    <CreditCard className="w-6 h-6 text-gold-500" />
                    <span className="text-sm font-semibold">Cartão de Crédito</span>
                  </button>
                </div>

                <form onSubmit={handlePaymentSubmit}>
                  {paymentMethod === "pix" ? (
                    <div className="text-center py-6 border border-white/5 rounded-2xl bg-zinc-950/40 p-6 space-y-6">
                      <div className="w-40 h-40 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                        {/* Mock QR Code representation */}
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,black_50%,transparent_52%)] bg-[size:10px_10px] opacity-80"></div>
                      </div>
                      
                      <div className="max-w-md mx-auto">
                        <p className="text-xs text-white/50 mb-3">Escaneie o código Pix acima ou copie a chave abaixo:</p>
                        <div className="flex bg-white/5 border border-white/10 rounded-xl p-2 pl-4 items-center justify-between">
                          <span className="text-xs font-mono text-white/70 overflow-hidden text-ellipsis whitespace-nowrap mr-4">
                            00020126580014br.gov.bcb.pix0136gabrielrec.photo-payment-id-1234
                          </span>
                          <button 
                            type="button" 
                            onClick={() => alert("Código Pix copiado!")} 
                            className="bg-gold-600 text-black text-xs font-bold py-2 px-4 rounded-lg hover:bg-gold-500 transition-colors"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Número do Cartão</label>
                        <input 
                          type="text" 
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Vencimento (MM/AA)</label>
                          <input 
                            type="text" 
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Código CVV</label>
                          <input 
                            type="text" 
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold-500/50 transition-colors text-white"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full btn-gold !py-4 text-md font-bold mt-8 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? "Processando Pagamento..." : `Confirmar e Pagar R$ ${total.toFixed(2)}`}
                  </button>
                </form>
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
                        <div className="w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden relative border border-white/10">
                          <img src={item.url} alt="Foto preview" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white/80">Foto</p>
                          <p className="text-[10px] text-white/40">ID: {item.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gold-500">R$ {item.price.toFixed(2)}</span>
                        <button onClick={() => removeItem(item.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cupom */}
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
                  <h4 className="text-xs font-bold text-white mb-1">Compra 100% Segura</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Suas fotos serão enviadas automaticamente e as marcas d'água serão retiradas após o processamento.
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
