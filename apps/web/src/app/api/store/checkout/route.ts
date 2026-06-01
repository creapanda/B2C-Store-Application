import { createPurchase } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (
    typeof body.userId !== "number" ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json(
      { error: "A user and at least one cart item are required" },
      { status: 400 },
    );
  }

  try {
    const purchase = await createPurchase({
      userId: body.userId,
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
