import { incrementPostViews } from "@repo/db/client";
import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const post = await incrementPostViews(urlId);

  if (!post || !post.active) {
    return <AppLayout>Article not found</AppLayout>;
  }

  return (
    <AppLayout>
      <BlogDetail post={post} views={post.views} />
    </AppLayout>
  );
}
