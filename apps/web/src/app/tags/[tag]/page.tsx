import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getActivePosts } from "@repo/db/client";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await getActivePosts();
  const filteredPosts = posts.filter(
    (post) =>
      post.tags
        .split(",")
        .map((item) => item.trim())
        .some((item) => toUrlPath(item) === tag),
  );

  return (
    <AppLayout selectedTag={tag}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
