import { useMemo, useState } from "react";
import catalog from "@/data/items.json";
import type { Catalog, Item } from "@/data/types";
import { Toolbar } from "@/components/Toolbar";
import { ItemCard } from "@/components/ItemCard";
import { Lightbox } from "@/components/Lightbox";
import { Footer } from "@/components/Footer";

const { shop, items } = catalog as Catalog;

export default function App() {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const [openItem, setOpenItem] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((it) => {
      if (activeCat !== "All" && it.category !== activeCat) return false;
      if (q) {
        const hay = [it.name, it.brand, it.category, it.condition, it.size, it.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activeCat, query]);

  return (
    <div className="min-h-screen">
      <Toolbar
        categories={shop.categories}
        active={activeCat}
        onCategory={setActiveCat}
        query={query}
        onQuery={setQuery}
        count={filtered.length}
      />

      <main className="mx-auto max-w-[1560px] px-5 pb-24 pt-8">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-[var(--color-muted)]">
            <h3 className="mb-1.5 text-xl font-medium text-[var(--color-ink)]">Nothing here</h3>
            <p>Try a different category or clear your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {filtered.map((it, i) => (
              <ItemCard key={`${activeCat}:${it.id}`} item={it} index={i} onOpen={() => setOpenItem(it)} />
            ))}
          </div>
        )}
      </main>

      <Footer shop={shop} />
      <Lightbox item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  );
}
