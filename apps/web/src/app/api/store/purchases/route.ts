import { getPurchases } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = Number(url.searchParams.get("userId"));

  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ error: "A valid user id is required" }, { status: 400 });
  }

  const purchases = await getPurchases(userId);
  return NextResponse.json(purchases);
}
