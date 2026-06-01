import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
  title,
  description,
}: {
  posts: Post[];
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <main className={className}>
      <BlogList posts={posts} />
    </main>
  );
}
