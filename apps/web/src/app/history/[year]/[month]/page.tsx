import { getActivePosts } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const posts = await getActivePosts();
  const filteredPosts = posts.filter(
    (post) =>
      post.date.getFullYear() === Number(year) &&
      post.date.getMonth() + 1 === Number(month),
  );

  return (
    <AppLayout selectedMonth={month} selectedYear={year}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
