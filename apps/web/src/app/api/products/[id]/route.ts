import { getProductById } from "@repo/db/client";
import { NextResponse } from "next/server";

function parseId(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string | string[] | undefined }> },
) {
  const params = await context.params;
  const id = parseId(params?.id);

  if (!id) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const product = await getProductById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
