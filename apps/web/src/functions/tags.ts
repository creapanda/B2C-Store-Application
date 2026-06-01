// import { posts, type Post } from "../components/data";

export async function tags(posts: { tags: string; active: boolean }[]) {
  // TODO: Implement per specification
  return posts
    .filter((post) => post.active)
    .flatMap((post) =>
      post.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    )
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (acc, tag) => {
        const existing = acc.find((item) => item.name === tag);

        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ name: tag, count: 1 });
        }

        return acc;
      },
      [] as { name: string; count: number }[],
    );
}
