import { getProductCategories } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getProductCategories();
  return NextResponse.json(categories);
}
