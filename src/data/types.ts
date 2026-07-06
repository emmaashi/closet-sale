export type Item = {
  id: number;
  name: string;
  brand?: string;
  category: string;
  condition?: string;
  retail?: number;
  price: number;
  status: "available" | "sold";
  posted?: string;
  description?: string;
  size?: string;
  link?: string;
  photos: string[];
};

export type Shop = {
  title: string;
  tagline: string;
  channel: string;
  handle: string;
  categories: string[];
};

export type Catalog = { shop: Shop; items: Item[] };
