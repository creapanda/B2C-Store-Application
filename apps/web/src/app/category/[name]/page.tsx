import { getActiveProducts } from "@repo/db/client";
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
  const products = await getActiveProducts();
  const selectedCategory = products.find(
    (product) => toUrlPath(product.category) === name,
  )?.category;
  const filteredProducts = selectedCategory
    ? await getActiveProducts({ category: selectedCategory })
    : [];

  return (
    <AppLayout selectedCategory={name}>
      <Main
        products={filteredProducts}
        title={selectedCategory ? `${selectedCategory} Products` : "Category"}
        description={categoryDetails[name]}
      />
    </AppLayout>
  );
}
