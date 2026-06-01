import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Post } from "./data.js";

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

type DbProductCategory = {
  id: number;
  name: string;
  slug: string;
};

type DbProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  stockQuantity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  category?: DbProductCategory;
};

type DbStoreUser = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
};

type DbStoreSession = {
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
  user?: DbStoreUser;
};

type DbPurchaseItem = {
  id: number;
  purchaseId: number;
  productId: number;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  product?: DbProduct;
};

type DbPurchase = {
  id: number;
  userId: number;
  totalCents: number;
  status: string;
  paymentReference: string;
  createdAt: Date;
  user?: DbStoreUser;
  items?: DbPurchaseItem[];
};

export type StoreUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export type ProductCategory = DbProductCategory;

export type StoreProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  price: number;
  stockQuantity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: ProductCategory | null;
};

export type StoreProductFilters = {
  category?: string;
  search?: string;
  includeInactive?: boolean;
};

export type ProductInput = {
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  stockQuantity: number;
  categoryId?: number;
  categorySlug?: string;
  active?: boolean;
  slug?: string;
};

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type PurchaseInputItem = {
  productId: number;
  quantity: number;
};

export type StorePurchaseItem = {
  id: number;
  productId: number;
  quantity: number;
  unitPriceCents: number;
  unitPrice: number;
  lineTotalCents: number;
  lineTotal: number;
  product: StoreProduct | null;
};

export type StorePurchase = {
  id: number;
  userId: number;
  user: StoreUser | null;
  totalCents: number;
  total: number;
  status: string;
  paymentReference: string;
  createdAt: Date;
  items: StorePurchaseItem[];
};

const PASSWORD_KEY_LENGTH = 64;

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

function normaliseEmail(email: string) {
  return email.trim().toLowerCase();
}

function moneyFromCents(cents: number) {
  return cents / 100;
}

function mapCategory(category: DbProductCategory): ProductCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

function mapProduct(product: DbProduct): StoreProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    imageUrl: product.imageUrl,
    priceCents: product.priceCents,
    price: moneyFromCents(product.priceCents),
    stockQuantity: product.stockQuantity,
    active: product.active,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: product.category ? mapCategory(product.category) : null,
  };
}

function mapUser(user: DbStoreUser): StoreUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function mapPurchaseItem(item: DbPurchaseItem): StorePurchaseItem {
  return {
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    unitPrice: moneyFromCents(item.unitPriceCents),
    lineTotalCents: item.lineTotalCents,
    lineTotal: moneyFromCents(item.lineTotalCents),
    product: item.product ? mapProduct(item.product) : null,
  };
}

function mapPurchase(purchase: DbPurchase): StorePurchase {
  return {
    id: purchase.id,
    userId: purchase.userId,
    user: purchase.user ? mapUser(purchase.user) : null,
    totalCents: purchase.totalCents,
    total: moneyFromCents(purchase.totalCents),
    status: purchase.status,
    paymentReference: purchase.paymentReference,
    createdAt: purchase.createdAt,
    items: purchase.items?.map(mapPurchaseItem) ?? [],
  };
}

function mapPost(post: DbPost): Post {
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

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split(":");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const storedBuffer = Buffer.from(hash, "hex");
  const passwordBuffer = scryptSync(
    password,
    salt,
    PASSWORD_KEY_LENGTH,
  ) as Buffer;

  return (
    storedBuffer.length === passwordBuffer.length &&
    timingSafeEqual(storedBuffer, passwordBuffer)
  );
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

export async function getProductCategories() {
  const records = (await (client.db.productCategory as any).findMany({
    orderBy: {
      name: "asc",
    },
  })) as DbProductCategory[];

  return records.map(mapCategory);
}

export async function getProducts(filters: StoreProductFilters = {}) {
  const where: Record<string, unknown> = {};

  if (!filters.includeInactive) {
    where.active = true;
  }

  if (filters.category) {
    where.category = {
      slug: filters.category,
    };
  }

  const search = filters.search?.trim();

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ];
  }

  const records = (await (client.db.product as any).findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  })) as DbProduct[];

  return records.map(mapProduct);
}

export async function getProductById(id: number, includeInactive = false) {
  const record = (await (client.db.product as any).findFirst({
    where: {
      id,
      ...(includeInactive ? {} : { active: true }),
    },
    include: {
      category: true,
    },
  })) as DbProduct | null;

  return record ? mapProduct(record) : null;
}

export async function getProductBySlug(slug: string, includeInactive = false) {
  const record = (await (client.db.product as any).findFirst({
    where: {
      slug,
      ...(includeInactive ? {} : { active: true }),
    },
    include: {
      category: true,
    },
  })) as DbProduct | null;

  return record ? mapProduct(record) : null;
}

function productCategoryConnection(input: ProductInput) {
  if (input.categoryId) {
    return {
      connect: {
        id: input.categoryId,
      },
    };
  }

  if (input.categorySlug) {
    return {
      connect: {
        slug: input.categorySlug,
      },
    };
  }

  throw new Error("A product category is required");
}

export async function createProduct(input: ProductInput) {
  const record = (await (client.db.product as any).create({
    data: {
      name: input.name.trim(),
      slug: input.slug?.trim() || toUrlPath(input.name),
      description: input.description.trim(),
      imageUrl: input.imageUrl.trim(),
      priceCents: input.priceCents,
      stockQuantity: input.stockQuantity,
      active: input.active ?? true,
      category: productCategoryConnection(input),
    },
    include: {
      category: true,
    },
  })) as DbProduct;

  return mapProduct(record);
}

export async function updateProduct(id: number, input: Partial<ProductInput>) {
  const data: Record<string, unknown> = {};

  if (input.name !== undefined) {
    data.name = input.name.trim();
    data.slug = input.slug?.trim() || toUrlPath(input.name);
  } else if (input.slug !== undefined) {
    data.slug = input.slug.trim();
  }

  if (input.description !== undefined) {
    data.description = input.description.trim();
  }

  if (input.imageUrl !== undefined) {
    data.imageUrl = input.imageUrl.trim();
  }

  if (input.priceCents !== undefined) {
    data.priceCents = input.priceCents;
  }

  if (input.stockQuantity !== undefined) {
    data.stockQuantity = input.stockQuantity;
  }

  if (input.active !== undefined) {
    data.active = input.active;
  }

  if (input.categoryId || input.categorySlug) {
    data.category = productCategoryConnection({
      name: input.name ?? "",
      description: input.description ?? "",
      imageUrl: input.imageUrl ?? "",
      priceCents: input.priceCents ?? 0,
      stockQuantity: input.stockQuantity ?? 0,
      categoryId: input.categoryId,
      categorySlug: input.categorySlug,
    });
  }

  const record = (await (client.db.product as any).update({
    where: {
      id,
    },
    data,
    include: {
      category: true,
    },
  })) as DbProduct;

  return mapProduct(record);
}

export async function deleteProduct(id: number) {
  const record = (await (client.db.product as any).update({
    where: {
      id,
    },
    data: {
      active: false,
    },
    include: {
      category: true,
    },
  })) as DbProduct;

  return mapProduct(record);
}

export async function createStoreUser(input: RegisterUserInput) {
  const record = (await (client.db.storeUser as any).create({
    data: {
      name: input.name.trim(),
      email: normaliseEmail(input.email),
      passwordHash: hashPassword(input.password),
      role: "USER",
    },
  })) as DbStoreUser;

  return mapUser(record);
}

export async function authenticateStoreUser(email: string, password: string) {
  const record = (await (client.db.storeUser as any).findUnique({
    where: {
      email: normaliseEmail(email),
    },
  })) as DbStoreUser | null;

  if (!record || !verifyPassword(password, record.passwordHash)) {
    return null;
  }

  return mapUser(record);
}

export async function createStoreSession(userId: number) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const record = (await (client.db.storeSession as any).create({
    data: {
      token: randomBytes(32).toString("hex"),
      userId,
      expiresAt,
    },
    include: {
      user: true,
    },
  })) as DbStoreSession;

  return {
    token: record.token,
    expiresAt: record.expiresAt,
    user: record.user ? mapUser(record.user) : null,
  };
}

export async function getStoreUserBySessionToken(token: string) {
  const record = (await (client.db.storeSession as any).findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  })) as DbStoreSession | null;

  if (!record) {
    return null;
  }

  if (record.expiresAt.getTime() <= Date.now()) {
    await (client.db.storeSession as any).delete({
      where: {
        token,
      },
    });
    return null;
  }

  return record.user ? mapUser(record.user) : null;
}

export async function deleteStoreSession(token: string) {
  await (client.db.storeSession as any).deleteMany({
    where: {
      token,
    },
  });
}

const purchaseInclude = {
  user: true,
  items: {
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  },
};

function normalisePurchaseItems(items: PurchaseInputItem[]) {
  const quantitiesByProduct = new Map<number, number>();

  for (const item of items) {
    if (
      !Number.isInteger(item.productId) ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error("Invalid purchase item");
    }

    quantitiesByProduct.set(
      item.productId,
      (quantitiesByProduct.get(item.productId) ?? 0) + item.quantity,
    );
  }

  return Array.from(quantitiesByProduct, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export async function createPurchase(
  userId: number,
  items: PurchaseInputItem[],
) {
  const normalisedItems = normalisePurchaseItems(items);

  if (normalisedItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const record = (await client.db.$transaction(async (tx) => {
    const db = tx as any;
    const products = (await db.product.findMany({
      where: {
        id: {
          in: normalisedItems.map((item) => item.productId),
        },
        active: true,
      },
      include: {
        category: true,
      },
    })) as DbProduct[];

    if (products.length !== normalisedItems.length) {
      throw new Error("Product not found");
    }

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const purchaseItems = normalisedItems.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`${product.name} does not have enough stock`);
      }

      const lineTotalCents = product.priceCents * item.quantity;

      return {
        product,
        quantity: item.quantity,
        lineTotalCents,
      };
    });

    for (const item of purchaseItems) {
      await db.product.update({
        where: {
          id: item.product.id,
        },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return db.purchase.create({
      data: {
        userId,
        totalCents: purchaseItems.reduce(
          (total, item) => total + item.lineTotalCents,
          0,
        ),
        status: "PAID",
        paymentReference: `mock_${randomBytes(8).toString("hex")}`,
        items: {
          create: purchaseItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPriceCents: item.product.priceCents,
            lineTotalCents: item.lineTotalCents,
          })),
        },
      },
      include: purchaseInclude,
    });
  })) as DbPurchase;

  return mapPurchase(record);
}

export async function getUserPurchases(userId: number) {
  const records = (await (client.db.purchase as any).findMany({
    where: {
      userId,
    },
    include: purchaseInclude,
    orderBy: {
      createdAt: "desc",
    },
  })) as DbPurchase[];

  return records.map(mapPurchase);
}

export async function getAllPurchases() {
  const records = (await (client.db.purchase as any).findMany({
    include: purchaseInclude,
    orderBy: {
      createdAt: "desc",
    },
  })) as DbPurchase[];

  return records.map(mapPurchase);
}

async function findManyPosts(where?: unknown) {
  const records = (await (client.db.post as any).findMany({
    where,
    include: {
      Likes: true,
    },
    orderBy: {
      date: "desc",
    },
  })) as DbPost[];

  return records.map(mapPost);
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
      {
        name: {
          contains: filters.query.trim(),
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: filters.query.trim(),
          mode: "insensitive",
        },
      },
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
