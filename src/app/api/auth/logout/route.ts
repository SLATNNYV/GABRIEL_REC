import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout efetuado com sucesso!" });
  
  // Clear HttpOnly session cookies
  response.cookies.set("user_id", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  
  response.cookies.set("user_role", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
