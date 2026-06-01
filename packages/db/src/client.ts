import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";
import type { Product, PurchaseRecord, StoreUser } from "./data.js";

declare global {
  var prisma: PrismaClient | undefined;
}

type DbProduct = {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type DbStoreUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
};

type DbPurchaseItem = {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  productName: string;
};

type DbPurchase = {
  id: number;
  userId: number;
  totalAmount: number;
  paymentStatus: string;
  paymentRef: string;
  createdAt: Date;
  user?: DbStoreUser;
  items?: DbPurchaseItem[];
};

type EditableProductInput = Pick<
  Product,
  "sku" | "name" | "description" | "price" | "imageUrl" | "category" | "stock"
> & {
  active?: boolean;
};

type CheckoutItemInput = {
  productId: number;
  quantity: number;
};

function getDatabaseUrl() {
  const url = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }

  return url;
}

export function hashStorePassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function mapProduct(product: DbProduct): Product {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
    stock: product.stock,
    active: product.active,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function mapStoreUser(user: DbStoreUser): StoreUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function mapPurchase(purchase: DbPurchase): PurchaseRecord {
  return {
    id: purchase.id,
    userId: purchase.userId,
    userName: purchase.user?.name ?? "Customer",
    userEmail: purchase.user?.email ?? "",
    totalAmount: purchase.totalAmount,
    paymentStatus: purchase.paymentStatus,
    paymentRef: purchase.paymentRef,
    createdAt: purchase.createdAt,
    items:
      purchase.items?.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productName: item.productName,
      })) ?? [],
  };
}

export const createClient = () => {
  if (global.prisma) {
    return global.prisma;
  }

  const prisma = new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
  });

  global.prisma = prisma;
  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};

export async function getAllProducts() {
  return getProducts();
}

export async function getProducts(filters?: {
  active?: boolean;
  category?: string;
  query?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.active !== undefined) {
    where.active = filters.active;
  }

  if (filters?.category?.trim()) {
    where.category = filters.category.trim();
  }

  if (filters?.query?.trim()) {
    where.OR = [
      { name: { contains: filters.query.trim(), mode: "insensitive" } },
      { description: { contains: filters.query.trim(), mode: "insensitive" } },
    ];
  }

  const records = (await ((client.db as any).product).findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: [{ active: "desc" }, { name: "asc" }],
  })) as DbProduct[];

  return records.map(mapProduct);
}

export async function getActiveProducts(filters?: {
  category?: string;
  query?: string;
}) {
  return getProducts({ ...filters, active: true });
}

export async function getProductBySku(sku: string) {
  const record = (await ((client.db as any).product).findUnique({
    where: { sku },
  })) as DbProduct | null;

  return record ? mapProduct(record) : null;
}

export async function createProduct(input: EditableProductInput) {
  const record = (await ((client.db as any).product).create({
    data: {
      sku: input.sku.trim().toUpperCase(),
      name: input.name,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      category: input.category,
      stock: input.stock,
      active: input.active ?? true,
    },
  })) as DbProduct;

  return mapProduct(record);
}

export async function updateProduct(sku: string, input: EditableProductInput) {
  const record = (await ((client.db as any).product).update({
    where: { sku },
    data: {
      sku: input.sku.trim().toUpperCase(),
      name: input.name,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      category: input.category,
      stock: input.stock,
      active: input.active,
    },
  })) as DbProduct;

  return mapProduct(record);
}

export async function deleteProduct(sku: string) {
  try {
    await ((client.db as any).product).delete({
      where: { sku },
    });
  } catch {
    await ((client.db as any).product).update({
      where: { sku },
      data: {
        active: false,
        stock: 0,
      },
    });
  }
}

export async function registerStoreUser(input: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}) {
  const record = (await ((client.db as any).storeUser).create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      password: hashStorePassword(input.password),
      role: input.role ?? "user",
    },
  })) as DbStoreUser;

  return mapStoreUser(record);
}

export async function loginStoreUser(email: string, password: string) {
  const record = (await ((client.db as any).storeUser).findUnique({
    where: { email: email.toLowerCase() },
  })) as DbStoreUser | null;

  if (!record || record.password !== hashStorePassword(password)) {
    return null;
  }

  return mapStoreUser(record);
}

export async function getStoreUserByEmail(email: string) {
  const record = (await ((client.db as any).storeUser).findUnique({
    where: { email: email.toLowerCase() },
  })) as DbStoreUser | null;

  return record ? mapStoreUser(record) : null;
}

export async function createPurchase(input: {
  userId: number;
  items: CheckoutItemInput[];
}) {
  const requestedItems = input.items.filter((item) => item.quantity > 0);

  if (requestedItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const productIds = requestedItems.map((item) => item.productId);
  const products = (await ((client.db as any).product).findMany({
    where: {
      id: { in: productIds },
      active: true,
    },
  })) as DbProduct[];

  const purchaseItems = requestedItems.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} does not have enough stock`);
    }

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.price,
      productName: product.name,
    };
  });

  const totalAmount = purchaseItems.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );

  const record = (await ((client.db as any).$transaction)(async (tx: any) => {
    for (const item of purchaseItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.purchase.create({
      data: {
        userId: input.userId,
        totalAmount,
        paymentStatus: "paid",
        paymentRef: `MOCK-${Date.now()}`,
        items: {
          create: purchaseItems,
        },
      },
      include: {
        user: true,
        items: true,
      },
    });
  })) as DbPurchase;

  return mapPurchase(record);
}

export async function getPurchases(userId?: number) {
  const records = (await ((client.db as any).purchase).findMany({
    where: userId ? { userId } : undefined,
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  })) as DbPurchase[];

  return records.map(mapPurchase);
}
