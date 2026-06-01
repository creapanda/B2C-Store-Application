import { getActiveProducts } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const products = await getActiveProducts({ query: q?.trim() ?? "" });

  return (
    <AppLayout query={q}>
      <Main products={products} />
    </AppLayout>
  );
}
