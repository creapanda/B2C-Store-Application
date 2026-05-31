import { deleteProduct, getProductBySku, updateProduct } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

const productCategories = ["Keyboard", "Mouse", "Headset"];

function parseProductBody(body: unknown, fallbackSku: string) {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const values = body as {
    sku?: unknown;
    name?: unknown;
    description?: unknown;
    price?: unknown;
    category?: unknown;
    imageUrl?: unknown;
    stock?: unknown;
    active?: unknown;
  };
  const price = Number(values.price);
  const stock = Number(values.stock);

  if (
    typeof values.name !== "string" ||
    typeof values.description !== "string" ||
    typeof values.category !== "string" ||
    !productCategories.includes(values.category) ||
    typeof values.imageUrl !== "string" ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return null;
  }

  return {
    sku: typeof values.sku === "string" ? values.sku : fallbackSku,
    name: values.name,
    description: values.description,
    price,
    category: values.category,
    imageUrl: values.imageUrl,
    stock,
    active: typeof values.active === "boolean" ? values.active : true,
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ sku: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;

  if (typeof params.sku !== "string") {
    return NextResponse.json({ error: "Invalid SKU" }, { status: 400 });
  }

  const product = await getProductBySku(params.sku);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ sku: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;

  if (typeof params.sku !== "string") {
    return NextResponse.json({ error: "Invalid SKU" }, { status: 400 });
  }

  const body = await request.json();
  const productInput = parseProductBody(body, params.sku);

  if (!productInput) {
    return NextResponse.json(
      { error: "Missing or invalid product fields" },
      { status: 400 },
    );
  }

  try {
    const product = await updateProduct(params.sku, productInput);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Unable to update product" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ sku: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;

  if (typeof params.sku !== "string") {
    return NextResponse.json({ error: "Invalid SKU" }, { status: 400 });
  }

  try {
    await deleteProduct(params.sku);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete product" },
      { status: 400 },
    );
  }
}
