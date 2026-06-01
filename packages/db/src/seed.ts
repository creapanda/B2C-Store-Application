import { client, hashStorePassword } from "./client.js";
import { products } from "./data.js";

export async function seed() {
  await ((client.db as any).purchaseItem).deleteMany();
  await ((client.db as any).purchase).deleteMany();
  await ((client.db as any).product).deleteMany();
  await ((client.db as any).storeUser).deleteMany();

  const createdProducts = [];

  for (const product of products) {
    const createdProduct = await ((client.db as any).product).create({
      data: {
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

    createdProducts.push(createdProduct);
  }

  const user = await ((client.db as any).storeUser).create({
    data: {
      name: "Demo Customer",
      email: "customer@example.com",
      password: hashStorePassword("password123"),
      role: "user",
    },
  });

  const headset = createdProducts.find(
    (product) => product.sku === "HEADSET-PULSE-01",
  );
  const keyboard = createdProducts.find(
    (product) => product.sku === "KEYBOARD-MECH-02",
  );

  if (!headset || !keyboard) {
    throw new Error("Seed products were not created");
  }

  await ((client.db as any).purchase).create({
    data: {
      userId: user.id,
      totalAmount: 187,
      paymentStatus: "paid",
      paymentRef: "MOCK-SEED-1001",
      items: {
        create: [
          {
            productId: headset.id,
            quantity: 1,
            unitPrice: 129,
            productName: "Pulse Wireless Headset",
          },
          {
            productId: keyboard.id,
            quantity: 1,
            unitPrice: 58,
            productName: "Tactile Mechanical Keyboard",
          },
        ],
      },
    },
  });
}
