import type { ProductInput } from "@repo/db/client";

function asObject(body: unknown) {
  return typeof body === "object" && body !== null
    ? (body as Record<string, unknown>)
    : null;
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : null;
}

function readInteger(value: unknown) {
  const numberValue = typeof value === "string" ? Number(value) : value;
  return typeof numberValue === "number" && Number.isInteger(numberValue)
    ? numberValue
    : null;
}

function readPriceCents(body: Record<string, unknown>) {
  const cents = readInteger(body.priceCents);

  if (cents !== null) {
    return cents >= 0 ? cents : null;
  }

  const price =
    typeof body.price === "string" ? Number(body.price) : body.price;

  if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
    return null;
  }

  return Math.round(price * 100);
}

export function parseProductInput(body: unknown, partial = false) {
  const object = asObject(body);

  if (!object) {
    return null;
  }

  const input: Partial<ProductInput> = {};

  const textFields = [
    "name",
    "description",
    "imageUrl",
    "categorySlug",
    "slug",
  ] as const;

  for (const field of textFields) {
    const value = readText(object[field]);

    if (value) {
      input[field] = value;
    } else if (!partial && field !== "categorySlug" && field !== "slug") {
      return null;
    }
  }

  if (object.price !== undefined || object.priceCents !== undefined) {
    const priceCents = readPriceCents(object);

    if (priceCents === null) {
      return null;
    }

    input.priceCents = priceCents;
  } else if (!partial) {
    return null;
  }

  if (object.stockQuantity !== undefined) {
    const stockQuantity = readInteger(object.stockQuantity);

    if (stockQuantity === null || stockQuantity < 0) {
      return null;
    }

    input.stockQuantity = stockQuantity;
  } else if (!partial) {
    return null;
  }

  if (object.categoryId !== undefined) {
    const categoryId = readInteger(object.categoryId);

    if (categoryId === null || categoryId <= 0) {
      return null;
    }

    input.categoryId = categoryId;
  }

  if (!partial && !input.categoryId && !input.categorySlug) {
    return null;
  }

  if (object.active !== undefined) {
    if (typeof object.active !== "boolean") {
      return null;
    }

    input.active = object.active;
  }

  return input;
}
