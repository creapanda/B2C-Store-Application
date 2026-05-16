import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import { NextResponse } from "next/server";

async function parseRequestData(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    return { password: String(body.password ?? "") };
  }

  const formData = await request.formData();
  return { password: String(formData.get("password") ?? "") };
}

export async function POST(request: Request) {
  const { password } = await parseRequestData(request);

  if (password !== env.PASSWORD) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const token = jwt.sign({ admin: true }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete("auth_token");
  return response;
}
