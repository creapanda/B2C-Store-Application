import { createStoreSession, createStoreUser } from "@repo/db/client";
import { NextResponse } from "next/server";
import { setStoreSessionCookie } from "../../../../utils/storeAuth";

function isUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function validateBody(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const name = String((body as { name?: unknown }).name ?? "").trim();
  const email = String((body as { email?: unknown }).email ?? "")
    .trim()
    .toLowerCase();
  const password = String((body as { password?: unknown }).password ?? "");

  if (!name || !email.includes("@") || password.length < 8) {
    return null;
  }

  return {
    name,
    email,
    password,
  };
}

export async function POST(request: Request) {
  const input = validateBody(await request.json());

  if (!input) {
    return NextResponse.json(
      { error: "Name, valid email, and 8 character password are required" },
      { status: 400 },
    );
  }

  try {
    const user = await createStoreUser(input);
    const session = await createStoreSession(user.id);
    const response = NextResponse.json({ user }, { status: 201 });
    setStoreSessionCookie(response, session);
    return response;
  } catch (error) {
    if (isUniqueError(error)) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 },
      );
    }

    throw error;
  }
}
