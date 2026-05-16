import { type Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = await tags(posts);

  return (
    <LinkList title="Tags">
      {postTags.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          isSelected={selectedTag === toUrlPath(item.name)}
          link={`/tags/${toUrlPath(item.name)}`}
          name={item.name}
          title={`Tag / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}
