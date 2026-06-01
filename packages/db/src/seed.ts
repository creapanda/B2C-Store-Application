import { client, hashStorePassword } from "./client.js";
import { posts, products } from "./data.js";

export async function seed() {
  await ((client.db as any).purchaseItem).deleteMany();
  await ((client.db as any).purchase).deleteMany();
  await ((client.db as any).product).deleteMany();
  await ((client.db as any).storeUser).deleteMany();
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

  const user = await ((client.db as any).storeUser).create({
    data: {
      name: "Demo Customer",
      email: "customer@example.com",
      password: hashStorePassword("password123"),
      role: "user",
    },
  });

  await ((client.db as any).purchase).create({
    data: {
      userId: user.id,
      totalAmount: 187,
      paymentStatus: "paid",
      paymentRef: "MOCK-SEED-1001",
      items: {
        create: [
          {
            productId: 1,
            quantity: 1,
            unitPrice: 129,
            productName: "Pulse Wireless Headset",
          },
          {
            productId: 2,
            quantity: 1,
            unitPrice: 58,
            productName: "Tactile Mechanical Keyboard",
          },
        ],
      },
    },
  });
}
