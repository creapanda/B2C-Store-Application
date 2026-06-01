import { client, hashStorePassword } from "./client.js";
import { products } from "./data.js";

export async function seed() {
  await ((client.db as any).purchaseItem).deleteMany();
  await ((client.db as any).purchase).deleteMany();
  await ((client.db as any).product).deleteMany();
  await ((client.db as any).storeUser).deleteMany();

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
