import { getProducts } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const products = await getProducts({
    category: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  });

  return NextResponse.json(products);
}
