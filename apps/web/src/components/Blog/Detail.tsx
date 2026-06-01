import Link from "next/link";
import type { Post } from "@repo/db/data";
import { marked } from "marked";
import { LikeButton } from "./LikeButton";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export async function BlogDetail({
  post,
  views,
}: {
  post: Post;
  views: number;
}) {
  const content = await marked.parse(post.content);
  const tagList = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <article
      className="space-y-6 rounded-xl border border-gray-200 p-6"
      data-test-id={`blog-post-${post.id}`}
    >
      <img
        alt={post.title}
        className="h-72 w-full rounded-lg object-cover"
        src={post.imageUrl}
      />
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
          <span>{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span>{views} views</span>
          <LikeButton urlId={post.urlId} initialLikes={post.likes} />
        </div>
        <Link
          className="text-3xl font-bold text-primary hover:text-primaryHover"
          href={`/post/${post.urlId}`}
        >
          {post.title}
        </Link>
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
      <div
        className="prose max-w-none text-primary prose-headings:text-primary prose-p:text-primary"
        data-test-id="content-markdown"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
