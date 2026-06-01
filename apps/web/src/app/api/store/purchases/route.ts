import { getPurchases } from "@repo/db/client";
import { NextResponse } from "next/server";
import { getStoreAuthUser } from "@/utils/store-auth";

export async function GET() {
  const user = await getStoreAuthUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const purchases = await getPurchases(user.id);
  return NextResponse.json(purchases);
}
