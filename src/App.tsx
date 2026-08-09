import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ChevronDown, ListFilter } from "lucide-react";
import catalog from "@/data/items.json";
import type { Catalog, Item } from "@/data/types";
import { ItemCard } from "@/components/ItemCard";
import { Lightbox } from "@/components/Lightbox";
import { Footer } from "@/components/Footer";

const { shop, items } = catalog as Catalog;
const filterCategories = ["All", "Clothes", "Beauty", "Tech", "Miscellaneous"];
type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => void };

export default function App() {
  const [activeCat, setActiveCat] = useState("All");
  const [openItem, setOpenItem] = useState<Item | null>(null);

  const changeCategory = (category: string) => {
    if (category === activeCat) return;

    const update = () => setActiveCat(category);
    const page = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion && page.startViewTransition) {
      page.startViewTransition(() => flushSync(update));
    } else {
      update();
    }
  };

  const filtered = useMemo(() => {
    return items
      .filter((it) => {
        if (it.visible === false) return false;
        if (activeCat !== "All" && it.category !== activeCat) return false;
        return true;
      })
      .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
  }, [activeCat]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[1560px] px-5 pb-8 pt-3 sm:pt-4">
        <div className="mb-3 flex justify-end">
          <CategoryFilter active={activeCat} onChange={changeCategory} />
        </div>

        <section className="listings-transition">
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-[var(--color-muted)]">
              <h3 className="mb-1.5 text-xl font-medium text-[var(--color-ink)]">Nothing here</h3>
              <p>Try a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {filtered.map((it, i) => (
                <ItemCard key={it.id} item={it} index={i} onOpen={() => setOpenItem(it)} />
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

function CategoryFilter({ active, onChange }: { active: string; onChange: (category: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex cursor-pointer items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-ink)] outline-none hover:opacity-65 focus-visible:ring-2 focus-visible:ring-black/20"
      >
        <ListFilter className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
        <span>Sort by:</span>
        <span className="underline decoration-1 underline-offset-4">{active}</span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Filter listings by category"
          className="absolute right-0 top-full z-20 mt-1.5 min-w-[190px] overflow-hidden border border-black/10 bg-white shadow-[0_12px_35px_rgba(20,18,16,0.14)] animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right motion-reduce:animate-none"
        >
          {filterCategories.map((category) => {
            const selected = category === active;
            return (
              <button
                key={category}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(category);
                  setOpen(false);
                }}
                className="relative block w-full cursor-pointer px-6 py-3 text-left text-[15px] leading-none text-[var(--color-ink)] outline-none transition-colors duration-100 hover:bg-black/[0.055] motion-reduce:transition-none focus-visible:bg-black/[0.055]"
              >
                {selected && (
                  <span className="absolute left-3" aria-hidden="true">
                    •
                  </span>
                )}
                {category}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
