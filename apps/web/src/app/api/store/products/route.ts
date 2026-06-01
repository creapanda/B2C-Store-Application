import { getActiveProducts } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getActiveProducts());
}
