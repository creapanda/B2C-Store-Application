import { getAllPurchases } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const purchases = await getAllPurchases();
  return NextResponse.json(purchases);
}
