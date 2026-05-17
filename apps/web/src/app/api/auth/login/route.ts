import { authenticateStoreUser, createStoreSession } from "@repo/db/client";
import { NextResponse } from "next/server";
import { setStoreSessionCookie } from "../../../../utils/storeAuth";

function validateBody(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const email = String((body as { email?: unknown }).email ?? "")
    .trim()
    .toLowerCase();
  const password = String((body as { password?: unknown }).password ?? "");

  if (!email || !password) {
    return null;
  }

  return {
    email,
    password,
  };
}

export async function POST(request: Request) {
  const input = validateBody(await request.json());

  if (!input) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const user = await authenticateStoreUser(input.email, input.password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const session = await createStoreSession(user.id);
  const response = NextResponse.json({ user });
  setStoreSessionCookie(response, session);
  return response;
}
