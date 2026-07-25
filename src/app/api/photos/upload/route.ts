import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Clean and normalize the filename
    const cleanFilename = file.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9.\s-]/g, "") // remove special characters except dot, spaces, hyphens
      .trim()
      .replace(/\s+/g, "-"); // replace spaces with hyphens

    // Create a unique filename
    const uniqueFilename = `${Date.now()}-${cleanFilename}`;

    try {
      // Setup public/uploads directory path
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Create the directory if it does not exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueFilename);

      // Save the file to the local directory
      fs.writeFileSync(filePath, buffer);

      // Return the absolute public URL of the uploaded image
      const fileUrl = `/uploads/${uniqueFilename}`;
      console.log(`Upload completo local: ${fileUrl}`);
      return NextResponse.json({ url: fileUrl }, { status: 201 });
    } catch (fsError) {
      console.warn("Ambiente de produção somente leitura (Vercel). Salvando como base64 no banco:", fsError);
      
      // Fallback: Convert file buffer to base64 data URL
      const base64String = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const fileUrl = `data:${mimeType};base64,${base64String}`;
      
      return NextResponse.json({ url: fileUrl }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Erro ao realizar o upload do arquivo:", error);
    return NextResponse.json({ error: "Falha interna no upload do arquivo." }, { status: 500 });
  }
}
