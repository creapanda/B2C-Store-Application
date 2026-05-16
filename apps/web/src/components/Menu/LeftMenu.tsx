import Link from "next/link";
import { getActivePosts } from "@repo/db/client";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export async function LeftMenu({
  selectedCategory,
  selectedYear,
  selectedMonth,
  selectedTag,
}: {
  selectedCategory?: string;
  selectedYear?: string;
  selectedMonth?: string;
  selectedTag?: string;
}) {
  const activePosts = await getActivePosts();

  return (
    <aside className="w-full max-w-sm space-y-8 border-b border-gray-200 p-6 md:max-w-xs md:border-b-0 md:border-r">
      <div className="space-y-2">
        <Link href="/" className="text-2xl font-bold text-primary">
          Full-Stack Blog
        </Link>
        <p className="text-sm text-secondary">
          Articles, categories, tags, and archive navigation.
        </p>
      </div>
      <nav>
        <ul role="list" className="flex flex-col gap-y-7">
          <li>
            <CategoryList
              posts={activePosts}
              selectedCategory={selectedCategory}
            />
          </li>
          <li>
            <HistoryList
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              posts={activePosts}
            />
          </li>
          <li>
            <TagList selectedTag={selectedTag} posts={activePosts} />
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
