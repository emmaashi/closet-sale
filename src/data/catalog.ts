import catalogData from "@/data/items.json";
import type { Catalog, Item } from "@/data/types";
import { validateCatalog } from "@/data/validateCatalog";

export const ALL_CATEGORIES = "All";

export type SortMode = "featured" | "price-asc" | "price-desc";

const rawCatalog: unknown = catalogData;
validateCatalog(rawCatalog);

export const catalog: Catalog = rawCatalog;

export function getCatalogCategories(items: Item[], preferred: string[] = []) {
  const available = new Set(
    items.filter((item) => item.visible !== false).map((item) => item.category)
  );
  const preferredCategories = preferred.filter((category) => available.has(category));
  const remainingCategories = [...available].filter((category) => !preferredCategories.includes(category));

  return [ALL_CATEGORIES, ...preferredCategories, ...remainingCategories];
}

export function getCatalogItems(
  items: Item[],
  { category = ALL_CATEGORIES, sort = "featured" }: { category?: string; sort?: SortMode } = {}
) {
  const featuredOrder = (a: Item, b: Item) =>
    (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id;

  return items
    .filter((item) => item.visible !== false)
    .filter((item) => category === ALL_CATEGORIES || item.category === category)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price || featuredOrder(a, b);
      if (sort === "price-desc") return b.price - a.price || featuredOrder(a, b);
      return featuredOrder(a, b);
    });
}
