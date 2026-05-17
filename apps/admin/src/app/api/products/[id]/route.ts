import { deleteProduct, getProductById, updateProduct } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";
import { parseProductInput } from "../../../../utils/storeProducts";

function prismaErrorCode(error: unknown) {
  return typeof error === "object" && error !== null
    ? (error as { code?: unknown }).code
    : null;
}

function parseId(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function getProductId(context: {
  params: Promise<{ id: string | string[] | undefined }>;
}) {
  const params = await context.params;
  return parseId(params?.id);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = await getProductId(context);

  if (!id) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const product = await getProductById(id, true);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = await getProductId(context);

  if (!id) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const input = parseProductInput(await request.json(), true);

  if (!input || Object.keys(input).length === 0) {
    return NextResponse.json(
      { error: "Missing or invalid product fields" },
      { status: 400 },
    );
  }

  try {
    const product = await updateProduct(id, input);
    return NextResponse.json(product);
  } catch (error) {
    if (prismaErrorCode(error) === "P2002") {
      return NextResponse.json(
        { error: "Product slug already exists" },
        { status: 409 },
      );
    }

    if (prismaErrorCode(error) === "P2025") {
      return NextResponse.json(
        { error: "Product or category not found" },
        { status: 404 },
      );
    }

    throw error;
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string | string[] | undefined }> },
) {
  return PUT(request, context);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string | string[] | undefined }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = await getProductId(context);

  if (!id) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const product = await deleteProduct(id);
    return NextResponse.json(product);
  } catch (error) {
    if (prismaErrorCode(error) === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    throw error;
  }
}
