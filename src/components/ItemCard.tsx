import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Item } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { cn, money, fmtDate, photoUrl } from "@/lib/utils";

type Props = { item: Item; index?: number; onOpen: () => void };

export function ItemCard({ item, onOpen }: Props) {
  const sold = item.status === "sold";
  const n = item.photos.length;
  const [pi, setPi] = useState(0);
  const [contain, setContain] = useState(false);

  const go = (e: React.MouseEvent, d: number) => {
    e.stopPropagation();
    setPi((p) => (p + d + n) % n);
  };

  const navBtn =
    "absolute top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/65 group-hover:opacity-100 cursor-pointer";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "group flex cursor-pointer flex-col text-left",
        "animate-in fade-in-0 duration-[450ms] ease-out",
        sold && "opacity-95"
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-frame)] shadow-[0_1px_2px_rgba(27,26,23,.04),0_6px_18px_rgba(27,26,23,.05)]">
        <img
          src={photoUrl(item.photos[pi])}
          alt={item.name}
          loading="lazy"
          onLoad={(e) => setContain(e.currentTarget.naturalWidth > e.currentTarget.naturalHeight)}
          className={cn(
            "h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]",
            contain ? "object-contain" : "object-cover",
            sold && "grayscale brightness-95 opacity-80"
          )}
        />
        {item.condition && (
          <Badge variant="light" className="absolute left-2.5 top-2.5">
            {item.condition}
          </Badge>
        )}
        {item.size && (
          <Badge variant="dark" className="absolute right-2.5 top-2.5">
            {item.size}
          </Badge>
        )}
        {n > 1 && (
          <>
            <button className={cn(navBtn, "left-2")} onClick={(e) => go(e, -1)} aria-label="Previous photo">
              <ChevronLeft className="size-4" />
            </button>
            <button className={cn(navBtn, "right-2")} onClick={(e) => go(e, 1)} aria-label="Next photo">
              <ChevronRight className="size-4" />
            </button>
            <Badge variant="counter" size="sm" className="absolute bottom-2.5 right-2.5">
              {pi + 1} / {n}
            </Badge>
          </>
        )}
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-md bg-[var(--color-sold)] p-[3px] shadow-lg">
              <span className="block rounded-[5px] border-2 border-white px-4 py-1 text-base font-extrabold uppercase tracking-wider text-white">
                Sold
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3.5">
        <p className="mb-0.5 text-sm font-semibold text-[var(--color-ink)]">{item.name}</p>
        {item.brand && <p className="mb-2 text-xs leading-snug text-[var(--color-muted)]">{item.brand}</p>}
        <p className="flex items-baseline gap-2 text-[17px]">
          {item.retail && (
            <span className="text-sm font-normal text-[var(--color-muted)] line-through">{money(item.retail)}</span>
          )}
          <span className={cn("font-semibold", sold && "text-[var(--color-sold)]")}>
            {sold ? "Sold" : money(item.price)}
          </span>
        </p>
        {(item.posted || item.link) && (
          <p className="mt-1.5 flex flex-wrap items-baseline gap-2.5">
            {item.posted && (
              <span className="text-[11.5px] text-[var(--color-muted)]">Posted {fmtDate(item.posted)}</span>
            )}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-link)] underline underline-offset-2 hover:text-[#1749b5]"
              >
                View original
                <ArrowUpRight className="size-3.5" strokeWidth={2.25} />
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
