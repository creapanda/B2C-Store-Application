import type { Product } from "@repo/db/data";
import { ProductList } from "./Product/List";

export function Main({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <main className={className}>
      <ProductList products={products} />
    </main>
  );
}
