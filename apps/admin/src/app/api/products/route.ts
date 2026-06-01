import { createProduct, getAllProducts } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

const productCategories = ["Keyboard", "Mouse", "Headset"];

function validateProductBody(body: unknown) {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as { sku?: unknown }).sku === "string" &&
    typeof (body as { name?: unknown }).name === "string" &&
    typeof (body as { description?: unknown }).description === "string" &&
    typeof (body as { price?: unknown }).price === "number" &&
    Number.isFinite((body as { price: number }).price) &&
    (body as { price: number }).price >= 0 &&
    typeof (body as { category?: unknown }).category === "string" &&
    productCategories.includes((body as { category: string }).category) &&
    typeof (body as { imageUrl?: unknown }).imageUrl === "string" &&
    typeof (body as { stock?: unknown }).stock === "number" &&
    Number.isInteger((body as { stock: number }).stock) &&
    (body as { stock: number }).stock >= 0
  );
}

export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getAllProducts());
}

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!validateProductBody(body)) {
    return NextResponse.json(
      { error: "Missing or invalid product fields" },
      { status: 400 },
    );
  }

  try {
    const product = await createProduct({
      sku: body.sku,
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      imageUrl: body.imageUrl,
      stock: body.stock,
      active: body.active !== undefined ? Boolean(body.active) : true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create product" },
      { status: 400 },
    );
  }
}
