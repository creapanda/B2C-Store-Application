import { loginStoreUser } from "@repo/db/client";
import { NextResponse } from "next/server";
import { setStoreAuthCookie } from "@/utils/store-auth";

export async function POST(request: Request) {
  const body = await request.json();

  if (
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    !body.email.trim() ||
    !body.password.trim()
  ) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const user = await loginStoreUser(body.email, body.password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json(user);
  setStoreAuthCookie(response, user);
  return response;
}
