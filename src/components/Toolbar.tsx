import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  categories: string[];
  active: string;
  onCategory: (c: string) => void;
  query: string;
  onQuery: (q: string) => void;
};

export function Toolbar({ categories, active, onCategory, query, onQuery }: Props) {
  const chips = ["All", ...categories];

  return (
    <header className="sticky top-0 z-30 hidden bg-[rgba(246,244,240,0.94)] px-3 py-2 backdrop-blur-md sm:px-5 lg:block">
      <nav className="mx-auto grid max-w-[1560px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 rounded-[14px] bg-[#e8e8e8] px-4 py-2 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
        <div className="col-start-1 row-start-1 flex min-w-0 items-center">
          <img
            src={`${import.meta.env.BASE_URL}dd-craigslist-logo-white.png`}
            alt="DD-Craigslist"
            className="h-7 w-auto max-w-[150px] object-contain object-left sm:h-8 sm:max-w-[180px]"
          />
        </div>

        <div className="col-span-2 row-start-2 max-w-full overflow-x-auto no-scrollbar lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:justify-self-center">
          <FilterTabs chips={chips} active={active} onSelect={onCategory} />
        </div>

        <div className="relative col-start-2 row-start-1 h-7 w-[96px] justify-self-end sm:h-8 lg:col-start-3 lg:w-[112px]">
          <Search className="pointer-events-none absolute left-0 top-1/2 size-[17px] -translate-y-1/2 text-[#111]" strokeWidth={1.8} />
          <Input
            aria-label="Search listings"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search"
            className="h-7 rounded-none border-0 bg-transparent px-0 pl-6 text-[15px] font-semibold text-[#111] shadow-none placeholder:text-[#111] focus-visible:border-0 focus-visible:ring-0 sm:h-8"
          />
        </div>
      </nav>
    </header>
  );
}

function FilterTabs({ chips, active, onSelect }: { chips: string[]; active: string; onSelect: (c: string) => void }) {
  return (
    <div className="flex w-max items-center gap-3 px-1 sm:gap-6 lg:gap-8">
      {chips.map((c) => {
        const on = c === active;
        return (
          <button
            key={c}
            onClick={() => onSelect(c)}
            aria-pressed={on}
            className={cn(
              "relative cursor-pointer whitespace-nowrap py-0.5 text-[12px] font-semibold tracking-[-0.02em] text-[#111] outline-none transition-opacity duration-150 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-[#111] after:transition-transform after:duration-200 after:ease-out hover:opacity-65 motion-reduce:transition-none motion-reduce:after:transition-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-black/25 sm:py-1 sm:text-[14px]",
              on ? "after:scale-x-100" : "after:scale-x-0"
            )}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
