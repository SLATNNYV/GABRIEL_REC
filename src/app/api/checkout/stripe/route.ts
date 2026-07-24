import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { items, email, coupon } = await req.json();

    // 1. Calculate discount rate
    let discount = 0;
    if (coupon) {
      const couponUpper = coupon.toUpperCase().trim();
      
      // Try to find the coupon in the database
      const dbCoupon = await prisma.coupon.findUnique({
        where: { code: couponUpper },
      });

      if (dbCoupon) {
        const now = new Date();
        const isNotExpired = !dbCoupon.expiresAt || dbCoupon.expiresAt > now;
        const isUnderLimit = !dbCoupon.usageLimit || dbCoupon.usedCount < dbCoupon.usageLimit;

        if (isNotExpired && isUnderLimit) {
          discount = dbCoupon.discount;
          
          // Increment used count
          await prisma.coupon.update({
            where: { id: dbCoupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      } else if (couponUpper === "GABRIEL10") {
        discount = 0.10;
      } else if (couponUpper === "VISIONARY") {
        discount = 0.20;
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://gabriel-rec.vercel.app";

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"],
      payment_method_options: {
        pix: {
          expires_after_seconds: 3600, // Expires in 1 hour
        },
      },
      line_items: items.map((item: any) => {
        const discountedPrice = item.price * (1 - discount);
        const imageUrl = item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`;
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Foto de Evento - ID ${item.id}`,
              images: [imageUrl], // Absolute URL required by Stripe
            },
            unit_amount: Math.round(discountedPrice * 100), // Dynamic discounted price in cents
          },
          quantity: 1,
        };
      }),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
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
