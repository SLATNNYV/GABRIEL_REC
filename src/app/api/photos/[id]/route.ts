import { NextRequest, NextResponse } from "next/server";
import { generateWatermarkedBuffer } from "@/lib/watermark";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

// robust implementation to fetch files locally or from remote URLs
async function fetchFromS3(key: string): Promise<Buffer> {
  // If it's a base64 data URL, decode it directly
  if (key.startsWith("data:")) {
    console.log("Processando imagem em formato base64");
    const base64Data = key.split(",")[1];
    return Buffer.from(base64Data, "base64");
  }

  // If it's a full remote URL (e.g. S3/R2 public URL), fetch it via http
  if (key.startsWith("http://") || key.startsWith("https://")) {
    console.log(`Buscando arquivo remoto: ${key}`);
    const res = await fetch(key);
    if (!res.ok) {
      throw new Error(`Erro ao baixar imagem da URL: ${key}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // Otherwise, treat it as a local filepath relative to 'public'
  console.log(`Buscando arquivo local: ${key}`);
  let localPath = key;
  if (key.startsWith("/")) {
    localPath = path.join(process.cwd(), "public", key);
  } else {
    localPath = path.join(process.cwd(), "public", "mock", key); // fallback mock folder
  }

  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath);
  }

  // Fallback to a default mock image if file is not found to prevent crashes
  const fallbackPath = path.join(process.cwd(), "public", "mock", "photo-0.jpg");
  if (fs.existsSync(fallbackPath)) {
    console.log(`Arquivo local não encontrado. Utilizando fallback: ${fallbackPath}`);
    return fs.readFileSync(fallbackPath);
  }

  throw new Error(`Arquivo não encontrado e fallback indisponível: ${key}`);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;
    
    // Find photo in DB
    const photo = await prisma.photo.findUnique({
      where: { id: photoId }
    });

    if (!photo) {
      return NextResponse.json({ error: "Foto não encontrada" }, { status: 404 });
    }

    // Try to get user's name from session cookies
    const userId = req.cookies.get("user_id")?.value;
    let clientName = "VISITANTE";
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true }
      });
      if (user?.name) {
        clientName = user.name.toUpperCase();
      }
    }

    // 1. Get original from S3 / local path
    const originalBuffer = await fetchFromS3(photo.s3Key);

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
