import { useLayoutEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  categories: string[];
  active: string;
  onCategory: (c: string) => void;
  query: string;
  onQuery: (q: string) => void;
  count: number;
};

export function Toolbar({ categories, active, onCategory, query, onQuery, count }: Props) {
  const chips = ["All", ...categories];
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[rgba(246,244,240,0.9)] backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex max-w-[1560px] flex-col gap-2.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        <div className="-mx-4 order-2 overflow-x-auto px-4 no-scrollbar sm:order-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <FilterTabs chips={chips} active={active} onSelect={onCategory} />
        </div>

        <div className="order-1 flex items-center gap-4 sm:order-2">
          <div className="relative w-full sm:w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search" className="pl-10" />
          </div>
          <span className="hidden whitespace-nowrap text-[13px] text-[var(--color-muted)] sm:inline">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </div>
  );
}

function FilterTabs({ chips, active, onSelect }: { chips: string[]; active: string; onSelect: (c: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = btnRefs.current[active];
      if (!el) return;
      setPill({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active, chips.join("|")]);

  return (
    <div ref={containerRef} className="relative flex w-max items-center gap-1">
      {pill && (
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-md bg-[var(--color-ink)] transition-all duration-[250ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }}
        />
      )}
      {chips.map((c) => {
        const on = c === active;
        return (
          <button
            key={c}
            ref={(el) => {
              btnRefs.current[c] = el;
            }}
            onClick={() => onSelect(c)}
            className={cn(
              "relative z-10 cursor-pointer whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors duration-[250ms]",
              on ? "text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            )}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
