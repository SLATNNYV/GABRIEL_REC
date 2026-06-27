import { NextRequest, NextResponse } from "next/server";
import { generateWatermarkedBuffer } from "@/lib/watermark";

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
