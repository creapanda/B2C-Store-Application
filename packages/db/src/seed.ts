import { client, hashPassword } from "./client.js";
import { posts, storeCategories, storeProducts, storeUsers } from "./data.js";

export async function seed() {
  await (client.db.storeSession as any).deleteMany();
  await (client.db.purchaseItem as any).deleteMany();
  await (client.db.purchase as any).deleteMany();
  await (client.db.product as any).deleteMany();
  await (client.db.productCategory as any).deleteMany();
  await (client.db.storeUser as any).deleteMany();
  await (client.db.like as any).deleteMany();
  await (client.db.post as any).deleteMany();

  for (const product of products) {
    await ((client.db as any).product).create({
      data: {
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
      },
    });
  }

  for (const category of storeCategories) {
    await (client.db.productCategory as any).create({
      data: category,
    });
  }

  const categoriesBySlug = new Map(
    storeCategories.map((category) => [category.slug, category]),
  );

  for (const product of storeProducts) {
    const category = categoriesBySlug.get(product.categorySlug);

    if (!category) {
      throw new Error(`Missing category: ${product.categorySlug}`);
    }

    await (client.db.product as any).create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        imageUrl: product.imageUrl,
        priceCents: product.priceCents,
        stockQuantity: product.stockQuantity,
        active: product.active,
        categoryId: category.id,
      },
    });
  }

  for (const user of storeUsers) {
    await (client.db.storeUser as any).create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: hashPassword(user.password),
        role: user.role,
      },
    });
  }
}
