export type Item = {
  id: number;
  name: string;
  category: string;
  condition?: string;
  retail?: number;
  price: number;
  status?: "available" | "sold";
  visible?: boolean;
  order?: number;
  cardDescription?: string;
  size?: string;
  link?: string;
  photos: string[];
};

export type Shop = {
  title: string;
  currency: string;
  footer: string;
  categories?: string[];
};

export type Catalog = { shop: Shop; items: Item[] };
