import { getStoreUserByEmail, registerStoreUser } from "@repo/db/client";
import { NextResponse } from "next/server";
import { setStoreAuthCookie } from "@/utils/store-auth";

export async function POST(request: Request) {
  const body = await request.json();

  if (
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    !body.name.trim() ||
    !body.email.trim() ||
    body.password.length < 6
  ) {
    return NextResponse.json(
      { error: "Name, email, and a 6 character password are required" },
      { status: 400 },
    );
  }

  const existingUser = await getStoreUserByEmail(body.email);

  if (existingUser) {
    return NextResponse.json(
      { error: "An account already exists for this email" },
      { status: 409 },
    );
  }

  const user = await registerStoreUser({
    name: body.name,
    email: body.email,
    password: body.password,
  });

  const response = NextResponse.json(user, { status: 201 });
  setStoreAuthCookie(response, user);
  return response;
}
