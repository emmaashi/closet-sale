import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpDown, ChevronDown, ListFilter } from "lucide-react";
import type { SortMode } from "@/data/catalog";

type Option<T extends string> = { value: T; label: string };

const sortOptions: Option<SortMode>[] = [
  { value: "featured", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type CatalogControlsProps = {
  categories: string[];
  category: string;
  sort: SortMode;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortMode) => void;
};

export function CatalogControls({
  categories,
  category,
  sort,
  onCategoryChange,
  onSortChange,
}: CatalogControlsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-x-5 gap-y-2">
      <SelectMenu
        label="Filter"
        ariaLabel="Filter listings by category"
        icon={<ListFilter className="size-3.5" strokeWidth={1.8} aria-hidden="true" />}
        value={category}
        options={categories.map((value) => ({ value, label: value }))}
        onChange={onCategoryChange}
      />
      <SelectMenu
        label="Sort by"
        ariaLabel="Sort listings"
        icon={<ArrowUpDown className="size-3.5" strokeWidth={1.8} aria-hidden="true" />}
        value={sort}
        options={sortOptions}
        onChange={onSortChange}
      />
    </div>
  );
}

type SelectMenuProps<T extends string> = {
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

function SelectMenu<T extends string>({ label, ariaLabel, icon, value, options, onChange }: SelectMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

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
        onClick={() => setOpen((current) => !current)}
        className="inline-flex cursor-pointer items-center gap-1.5 py-1 text-sm font-medium text-[var(--color-ink)] outline-none hover:opacity-65 focus-visible:ring-2 focus-visible:ring-black/20"
      >
        {icon}
        <span>{label}:</span>
        <span className="underline decoration-1 underline-offset-4">{selectedLabel}</span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute right-0 top-full z-20 mt-1.5 min-w-[210px] overflow-hidden border border-black/10 bg-white shadow-[0_12px_35px_rgba(20,18,16,0.14)] animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right motion-reduce:animate-none"
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="relative block w-full cursor-pointer px-6 py-3 text-left text-[15px] leading-none text-[var(--color-ink)] outline-none transition-colors duration-100 hover:bg-black/[0.055] focus-visible:bg-black/[0.055] motion-reduce:transition-none"
              >
                {selected && (
                  <span className="absolute left-3" aria-hidden="true">
                    •
                  </span>
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
