import { createPurchase, getUserPurchases } from "@repo/db/client";
import { NextResponse } from "next/server";
import { getCurrentStoreUser } from "../../../utils/storeAuth";

function validateItems(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const items = (body as { items?: unknown }).items;

  if (!Array.isArray(items)) {
    return null;
  }

  return items.map((item) => ({
    productId: Number((item as { productId?: unknown }).productId),
    quantity: Number((item as { quantity?: unknown }).quantity),
  }));
}

export async function GET() {
  const user = await getCurrentStoreUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const purchases = await getUserPurchases(user.id);
  return NextResponse.json(purchases);
}

export async function POST(request: Request) {
  const user = await getCurrentStoreUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = validateItems(await request.json());

  if (!items) {
    return NextResponse.json(
      { error: "A checkout request requires cart items" },
      { status: 400 },
    );
  }

  try {
    const purchase = await createPurchase(user.id, items);
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 400 },
    );
  }
}
