import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let event = await prisma.event.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      },
      include: {
        photos: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    // Protect the original photo URLs (s3Key) against client-side sniffing/scraping
    // Unless the logged-in user is an administrator
    const userRole = req.cookies.get("user_role")?.value;
    const isAdmin = userRole === "ADMIN";

    if (!isAdmin && event.photos && event.photos.length > 0) {
      event = {
        ...event,
        photos: event.photos.map((p) => ({
          ...p,
          s3Key: "", // Masking the high-resolution source URL for security
        })),
      };
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return NextResponse.json({ error: "Erro ao buscar evento" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, slug, date, category, coverImage, isPrivate, password, bulkPhotoPrice } = body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        name,
        slug,
        date: date ? new Date(date) : undefined,
        category,
        coverImage,
        isPrivate: isPrivate !== undefined ? !!isPrivate : undefined,
        password: password !== undefined ? (password || null) : undefined,
      }
    });

    if (bulkPhotoPrice !== undefined && bulkPhotoPrice !== null) {
      await prisma.photo.updateMany({
        where: { eventId: id },
        data: { price: parseFloat(bulkPhotoPrice) }
      });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Evento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    return NextResponse.json({ error: "Erro ao excluir evento" }, { status: 500 });
  }
}
