import { createPurchase } from "@repo/db/client";
import { NextResponse } from "next/server";
import { getStoreAuthUser } from "@/utils/store-auth";

export async function POST(request: Request) {
  const user = await getStoreAuthUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "At least one cart item is required" },
      { status: 400 },
    );
  }

  try {
    const purchase = await createPurchase({
      userId: user.id,
      items: body.items.map((item: { productId?: unknown; quantity?: unknown }) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      })),
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 400 },
    );
  }
}
