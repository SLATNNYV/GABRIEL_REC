export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID ausente" }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ isPaid: false, error: "Pagamento não confirmado ou pendente no Stripe" });
    }

    // Retrieve photo IDs from metadata
    const photoIdsStr = session.metadata?.photoIds || "";
    const photoIds = photoIdsStr.split(",").filter(Boolean);

    // Fetch the purchased photos from the database
    const photos = await prisma.photo.findMany({
      where: {
        id: { in: photoIds },
      },
    });

    return NextResponse.json({
      isPaid: true,
      photos: photos.map((p) => ({
        id: p.id,
        url: `/api/photos/${p.id}`,
        downloadUrl: p.s3Key,
        price: p.price,
      })),
    });
  } catch (error: any) {
    console.error("Erro ao verificar status da sessão:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
