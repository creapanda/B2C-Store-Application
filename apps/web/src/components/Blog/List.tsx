import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <div className="py-6 text-lg font-semibold text-primary">0 Posts</div>;
  }

  return (
    <div className="space-y-8 py-6">
      <div className="text-lg font-semibold text-primary">{posts.length} Posts</div>
      <div className="space-y-8">
        {posts.map((post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default BlogList;
