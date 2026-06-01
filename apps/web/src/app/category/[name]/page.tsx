import { getActivePosts } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";

const categoryDetails: Record<string, string> = {
  keyboard:
    "Browse keyboards for study, office work, and gaming setups, including compact mechanical boards and quiet low-profile options.",
  mouse:
    "Find mice for comfort and accuracy, from ergonomic everyday options to lightweight gaming models with precise tracking.",
  headset:
    "Shop headsets for calls, classes, music, and gaming, with wireless and wired choices built for clear sound.",
};

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
