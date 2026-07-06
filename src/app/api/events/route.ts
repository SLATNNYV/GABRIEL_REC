import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { photos: true }
        }
      },
      orderBy: {
        date: "desc"
      }
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    return NextResponse.json({ error: "Erro ao carregar eventos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, date, category, coverImage, isPrivate, password } = body;

    if (!name || !slug || !date || !category) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        name,
        slug,
        date: new Date(date),
        category,
        coverImage: coverImage || "/mock/wedding.jpg",
        isPrivate: !!isPrivate,
        password: password || null,
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar evento:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Já existe um evento com este slug/link" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
  }
}
