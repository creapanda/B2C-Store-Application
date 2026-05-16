import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
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
}
