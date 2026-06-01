export function history(posts: { date: Date; active: boolean }[]): {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts
  month: number;
  year: number;
  count: number;
}[] {
  return posts
    .filter((post) => post.active)
    .reduce(
      (acc, post) => {
        const month = post.date.getMonth() + 1;
        const year = post.date.getFullYear();
        const existing = acc.find(
          (item) => item.month === month && item.year === year,
        );

        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ month, year, count: 1 });
        }

        return acc;
      },
      [] as { month: number; year: number; count: number }[],
    )
    .sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }

      return b.month - a.month;
    });
}
