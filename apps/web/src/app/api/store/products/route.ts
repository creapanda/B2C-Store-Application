import { getActiveProducts } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? undefined;
  const category = url.searchParams.get("category") ?? undefined;

  return NextResponse.json(
    await getActiveProducts({
      query,
      category,
    }),
  );
}
