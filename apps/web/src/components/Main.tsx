import type { Product } from "@repo/db/data";
import { ProductList } from "./Product/List";

export function Main({
  products,
  className,
  title,
  description,
}: {
  products: Product[];
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <main className={className}>
      <ProductList
        products={products}
        title={title}
        description={description}
      />
    </main>
  );
}
