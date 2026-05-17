import { createProduct, getProducts } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";
import { parseProductInput } from "../../../utils/storeProducts";

function prismaErrorCode(error: unknown) {
  return typeof error === "object" && error !== null
    ? (error as { code?: unknown }).code
    : null;
}

export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getProducts({ includeInactive: true });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = parseProductInput(await request.json());

  if (!input) {
    return NextResponse.json(
      { error: "Missing or invalid product fields" },
      { status: 400 },
    );
  }

  try {
    const product = await createProduct({
      name: input.name ?? "",
      description: input.description ?? "",
      imageUrl: input.imageUrl ?? "",
      priceCents: input.priceCents ?? 0,
      stockQuantity: input.stockQuantity ?? 0,
      categoryId: input.categoryId,
      categorySlug: input.categorySlug,
      active: input.active,
      slug: input.slug,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (prismaErrorCode(error) === "P2002") {
      return NextResponse.json(
        { error: "Product slug already exists" },
        { status: 409 },
      );
    }

    if (prismaErrorCode(error) === "P2025") {
      return NextResponse.json(
        { error: "Product category not found" },
        { status: 400 },
      );
    }

    throw error;
  }
}
