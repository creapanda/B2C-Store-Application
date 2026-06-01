export function categories(
  products: { category: string; active: boolean }[],
): { name: string; count: number }[] {
  return products
    .filter((product) => product.active)
    .sort((a, b) => a.category.localeCompare(b.category))
    .reduce(
      (acc, product) => {
        const category = acc.find((item) => item.name === product.category);

        if (category) {
          category.count++;
        } else {
          acc.push({ name: product.category, count: 1 });
        }

        return acc;
      },
      [] as { name: string; count: number }[],
    );
}
