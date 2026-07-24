import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Preencha o e-mail e a senha." }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const hashedPassword = hashPassword(password);

    // Auto-seeding for Admin account
    if (emailLower === "admin@gabrielrec.com") {
      const adminExists = await prisma.user.findUnique({
        where: { email: "admin@gabrielrec.com" },
      });

      if (!adminExists) {
        console.log("Auto-seeding: Criando conta do administrador padrão...");
        await prisma.user.create({
          data: {
            name: "Gabriel Luiz (Admin)",
            email: "admin@gabrielrec.com",
            password: hashedPassword,
            role: "ADMIN",
          },
        });
      }
    }

    // Lookup user in DB
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }

    // Verify password
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }

    // Create a response and optionally set a mock cookie for middleware/session check
    const response = NextResponse.json({
      message: "Login efetuado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set dynamic session cookies (HttpOnly for security)
    response.cookies.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    response.cookies.set("user_role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Erro no login de usuário:", error);
    return NextResponse.json({ error: `Erro interno no servidor de login: ${error.message || String(error)}` }, { status: 500 });
  }
}
