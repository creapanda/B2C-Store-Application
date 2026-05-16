import { getActivePosts } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const posts = await getActivePosts();
  const filteredPosts = posts.filter(
    (post) => toUrlPath(post.category) === name,
  );

  return (
    <AppLayout selectedCategory={name}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
