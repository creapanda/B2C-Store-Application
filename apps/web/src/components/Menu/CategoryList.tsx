import { categories } from "@/functions/categories";
import type { Product } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

const productCategories = ["Keyboard", "Mouse", "Headset"];

export function CategoryList({
  products,
  selectedCategory,
}: {
  products: Product[];
  selectedCategory?: string;
}) {
  const categoryCounts = categories(products);
  const items = productCategories.map((name) => {
    const existing = categoryCounts.find((item) => item.name === name);

    return { name, count: existing?.count ?? 0 };
  });

  return (
    <LinkList title="Categories">
      {items.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={selectedCategory === toUrlPath(item.name)}
          link={`/category/${toUrlPath(item.name)}`}
          title={`Category / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}
