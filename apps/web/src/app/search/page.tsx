import { getActiveProducts } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products = await getActiveProducts({ query });

  return (
    <AppLayout query={q}>
      <Main products={products} />
    </AppLayout>
  );
}
