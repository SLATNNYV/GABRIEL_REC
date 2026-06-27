import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json();

    // 1. Calculate total server-side
    // const total = items.length * 15.00;

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // For Brazil, also add 'oxxo' or similar if needed, or use Mercado Pago for PIX
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: `Foto de Evento - ID ${item.id}`,
            images: [item.url], // watermarked thumbnail
          },
          unit_amount: 1500, // R$ 15.00 in cents
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: email,
      metadata: {
        photoIds: items.map((i: any) => i.id).join(","),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro Checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
