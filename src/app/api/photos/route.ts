import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, s3Key, price } = body;

    if (!eventId || !s3Key) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const photo = await prisma.photo.create({
      data: {
        eventId,
        s3Key,
        price: price !== undefined ? parseFloat(price) : 0.0,
      }
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar foto:", error);
    return NextResponse.json({ error: "Erro ao adicionar foto" }, { status: 500 });
  }
}
