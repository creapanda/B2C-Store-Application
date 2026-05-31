import Link from "next/link";
import { getActiveProducts } from "@repo/db/client";
import { CategoryList } from "./CategoryList";

export async function LeftMenu({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const products = await getActiveProducts();

  return (
    <aside className="w-full max-w-sm space-y-8 border-b border-gray-200 p-6 md:max-w-xs md:border-b-0 md:border-r">
      <div className="space-y-2">
        <Link href="/" className="text-2xl font-bold text-primary">
          B2C Store
        </Link>
        <p className="text-sm text-secondary">
          Products, categories, and simple checkout APIs.
        </p>
      </div>
      <nav>
        <ul role="list" className="flex flex-col gap-y-7">
          <li>
            <CategoryList
              products={products}
              selectedCategory={selectedCategory}
            />
          </li>
          <li>
            <Link
              href="http://localhost:3002"
              className="text-sm font-medium text-secondary hover:text-primary"
            >
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
