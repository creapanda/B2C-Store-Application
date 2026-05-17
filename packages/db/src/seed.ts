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

  for (const post of posts) {
    await (client.db.post as any).create({
      data: {
        id: post.id,
        urlId: post.urlId,
        title: post.title,
        description: post.description,
        content: post.content,
        imageUrl: post.imageUrl,
        category: post.category,
        tags: post.tags,
        date: post.date,
        views: post.views,
        active: post.active,
      },
    });

    for (let index = 0; index < post.likes; index += 1) {
      await (client.db.like as any).create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${index}`,
        },
      });
    }
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
