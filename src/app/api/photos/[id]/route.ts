import { NextRequest, NextResponse } from "next/server";
import { generateWatermarkedBuffer } from "@/lib/watermark";
import { prisma } from "@/lib/db";

// Mock for S3 fetch
async function fetchFromS3(key: string): Promise<Buffer> {
  // In a real app, use @aws-sdk/client-s3 to get object
  console.log(`Buscando ${key} do S3...`);
  return Buffer.from([]); // Semi-empty for code structure
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;
    // In production, check session for individual client dynamic watermark
    // const session = await getServerSession();
    const clientName = "Visitante";

    // 1. Get original from S3
    const originalBuffer = await fetchFromS3(`photos/${photoId}.jpg`);

    // 2. Generate watermarked version
    const watermarked = await generateWatermarkedBuffer(originalBuffer, clientName);

    // 3. Return as image
    const body = new Uint8Array(watermarked);

    return new NextResponse(body, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    console.error("Erro ao processar foto:", error);
    return NextResponse.json({ error: "Erro ao carregar imagem" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;
    const body = await req.json();
    const { price } = body;

    if (price === undefined) {
      return NextResponse.json({ error: "Preço não informado" }, { status: 400 });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: {
        price: parseFloat(price)
      }
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error("Erro ao atualizar preço da foto:", error);
    return NextResponse.json({ error: "Erro ao atualizar preço da foto" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;

    await prisma.photo.delete({
      where: { id: photoId }
    });

    return NextResponse.json({ message: "Foto excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    return NextResponse.json({ error: "Erro ao excluir foto" }, { status: 500 });
  }
}
