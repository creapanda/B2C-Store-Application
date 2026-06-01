import { getActivePosts } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const posts = await getActivePosts();
  const filteredPosts = posts.filter(
    (post) =>
      query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query),
  );

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
