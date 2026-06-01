import Link from "next/link";
import type { Post } from "@repo/db/data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function displayTitle(title: string) {
  return title.replace(/[!?]+$/g, "");
}

export function BlogListItem({ post }: { post: Post }) {
  const tagList = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <article
      className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 md:flex-row"
      data-test-id={`blog-post-${post.id}`}
    >
      <img
        alt={post.title}
        className="h-48 w-full rounded-lg object-cover md:w-64"
        src={post.imageUrl}
      />
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
          <span>{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>
        <Link
          className="text-2xl font-semibold text-primary hover:text-primaryHover"
          href={`/post/${post.urlId}`}
        >
          {displayTitle(post.title)}
        </Link>
        <p className="text-secondary">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          {tagList.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-secondary dark:bg-gray-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
