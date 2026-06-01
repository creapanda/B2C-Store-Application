import { client } from "./client.js";
import { seed } from "./seed.js";

try {
  await seed();
  console.log("Seeded database");
} finally {
  await client.db.$disconnect();
}
