import { getActiveProducts } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const products = await getActiveProducts();
  const selectedCategory = products.find(
    (product) => toUrlPath(product.category) === name,
  )?.category;
  const filteredProducts = selectedCategory
    ? await getActiveProducts({ category: selectedCategory })
    : [];

  return (
    <AppLayout selectedCategory={name}>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
