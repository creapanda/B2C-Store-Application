import { NextResponse } from "next/server";
import { clearStoreAuthCookie } from "@/utils/store-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearStoreAuthCookie(response);
  return response;
}
