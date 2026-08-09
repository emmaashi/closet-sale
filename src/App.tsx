import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { CatalogControls } from "@/components/CatalogControls";
import { Footer } from "@/components/Footer";
import { ItemCard } from "@/components/ItemCard";
import { Lightbox } from "@/components/Lightbox";
import {
  ALL_CATEGORIES,
  catalog,
  getCatalogCategories,
  getCatalogItems,
  type SortMode,
} from "@/data/catalog";
import type { Item } from "@/data/types";

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => void };

function updateCatalogView(update: () => void) {
  const page = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && page.startViewTransition) {
    page.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}

export default function App() {
  const { shop, items } = catalog;
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [sort, setSort] = useState<SortMode>("featured");
  const [openItem, setOpenItem] = useState<Item | null>(null);

  const categories = useMemo(() => getCatalogCategories(items, shop.categories), [items, shop.categories]);
  const displayedItems = useMemo(() => getCatalogItems(items, { category, sort }), [items, category, sort]);

  const changeCategory = (nextCategory: string) => {
    if (nextCategory !== category) updateCatalogView(() => setCategory(nextCategory));
  };
  const changeSort = (nextSort: SortMode) => {
    if (nextSort !== sort) updateCatalogView(() => setSort(nextSort));
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[1560px] px-5 pb-8 pt-3 sm:pt-4">
        <div className="mb-3">
          <CatalogControls
            categories={categories}
            category={category}
            sort={sort}
            onCategoryChange={changeCategory}
            onSortChange={changeSort}
          />
        </div>

        <section className="listings-transition">
          {displayedItems.length === 0 ? (
            <div className="py-24 text-center text-[var(--color-muted)]">
              <h3 className="mb-1.5 text-xl font-medium text-[var(--color-ink)]">Nothing here</h3>
              <p>Try a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {displayedItems.map((item) => (
                <ItemCard key={item.id} item={item} onOpen={() => setOpenItem(item)} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer shop={shop} />
      <Lightbox item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  );
}
