import Link from "next/link";
import { cx } from "@repo/utils/classes";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li>
      <Link
        href={link}
        className={cx(
          "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-secondary hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800",
          {
            selected: isSelected,
            "bg-gray-100 text-primary dark:bg-gray-800": isSelected,
          },
        )}
        title={title || name}
      >
        <span>{name}</span>
        <span
          className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          data-test-id="post-count"
        >
          {count}
        </span>
      </Link>
    </li>
  );
}
