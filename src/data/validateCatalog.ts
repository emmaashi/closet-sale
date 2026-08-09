import type { Catalog } from "@/data/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function invalid(message: string): never {
  throw new Error(`Invalid catalog: ${message}`);
}

export function validateCatalog(value: unknown): asserts value is Catalog {
  if (!isRecord(value)) invalid("expected an object");

  const { shop, items } = value;
  if (!isRecord(shop)) invalid("shop must be an object");
  if (typeof shop.title !== "string") invalid("shop.title must be a string");
  if (typeof shop.currency !== "string") invalid("shop.currency must be a currency code such as USD");
  if (typeof shop.footer !== "string") invalid("shop.footer must be a string");
  if (shop.categories !== undefined && !isStringArray(shop.categories)) {
    invalid("shop.categories must be a list of strings");
  }
  if (!Array.isArray(items)) invalid("items must be a list");

  const ids = new Set<number>();
  items.forEach((item, index) => {
    if (!isRecord(item)) invalid(`items[${index}] must be an object`);
    if (typeof item.id !== "number" || !Number.isInteger(item.id)) invalid(`items[${index}].id must be an integer`);
    if (ids.has(item.id)) invalid(`item id ${item.id} is duplicated`);
    ids.add(item.id);

    if (typeof item.name !== "string" || !item.name.trim()) invalid(`items[${index}].name is required`);
    if (typeof item.category !== "string" || !item.category.trim()) invalid(`items[${index}].category is required`);
    if (typeof item.price !== "number" || !Number.isFinite(item.price) || item.price < 0) {
      invalid(`items[${index}].price must be a non-negative number`);
    }
    if (!isStringArray(item.photos) || item.photos.length === 0) {
      invalid(`items[${index}].photos must contain at least one filename`);
    }
  });
}
