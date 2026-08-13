import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Item } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { ImageSkeleton } from "@/components/ui/image-skeleton";
import { cn, money, photoUrl } from "@/lib/utils";

type Props = { item: Item; currency: string; onOpen: () => void };
const MINIMUM_SKELETON_TIME_MS = 500;

export function ItemCard({ item, currency, onOpen }: Props) {
  const sold = item.status === "sold";
  const n = item.photos.length;
  const [pi, setPi] = useState(0);
  const [contain, setContain] = useState(false);
  const [loadedPhotos, setLoadedPhotos] = useState<Set<string>>(() => new Set());
  const [minimumSkeletonTimeElapsed, setMinimumSkeletonTimeElapsed] = useState(false);
  const currentPhoto = item.photos[pi];
  const photoLoaded = minimumSkeletonTimeElapsed && loadedPhotos.has(currentPhoto);
  const cardLoaded = minimumSkeletonTimeElapsed && loadedPhotos.size > 0;

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumSkeletonTimeElapsed(true), MINIMUM_SKELETON_TIME_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const markPhotoLoaded = () => {
    setLoadedPhotos((loaded) => {
      if (loaded.has(currentPhoto)) return loaded;
      const next = new Set(loaded);
      next.add(currentPhoto);
      return next;
    });
  };

  const go = (e: React.MouseEvent, d: number) => {
    e.stopPropagation();
    setPi((p) => (p + d + n) % n);
  };

  const navBtn =
    "absolute top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-[opacity,background-color] duration-150 ease-out hover:bg-black/65 group-hover:opacity-100 motion-reduce:transition-none cursor-pointer";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-busy={!cardLoaded}
      aria-label={`View ${item.name}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn("group flex cursor-pointer flex-col text-left", sold && "opacity-95")}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-frame)] shadow-[0_1px_2px_rgba(27,26,23,.04),0_6px_18px_rgba(27,26,23,.05)]">
        {!photoLoaded && <ImageSkeleton className="absolute inset-0" />}
        <img
          src={photoUrl(currentPhoto)}
          alt={item.name}
          loading="lazy"
          onLoad={(e) => {
            setContain(e.currentTarget.naturalWidth > e.currentTarget.naturalHeight);
            markPhotoLoaded();
          }}
          onError={markPhotoLoaded}
          className={cn(
            "h-full w-full transform-gpu transition-[opacity,transform] duration-[1200ms] ease-in-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none",
            contain ? "object-contain" : "object-cover",
            sold && "grayscale brightness-95",
            photoLoaded ? (sold ? "opacity-80" : "opacity-100") : "opacity-0"
          )}
        />
        {cardLoaded && (
          <>
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
          </>
        )}
      </div>

      {cardLoaded ? (
        <div className="pt-3.5">
          <p className={`${item.cardDescription ? "mb-0.5" : "mb-2.5"} text-sm font-medium leading-snug text-[var(--color-ink)]`}>
            {item.name}
          </p>
          {item.cardDescription && (
            <p className="mb-2.5 text-xs leading-snug text-[var(--color-muted)]">{item.cardDescription}</p>
          )}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-2">
            <p className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 text-base font-bold tracking-[-0.02em] sm:gap-x-2 sm:text-[18px]">
              {item.retail && (
                <span className="text-xs font-normal tracking-normal text-[var(--color-muted)] line-through sm:text-sm">
                  {money(item.retail, currency)}
                </span>
              )}
              <span>{money(item.price, currency)}</span>
            </p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-[11px] font-medium text-[var(--color-link)] underline underline-offset-2 hover:text-[#1749b5] sm:text-xs"
              >
                View original
                <ArrowUpRight className="size-3.5" strokeWidth={2.25} />
              </a>
            )}
          </div>
        </div>
      ) : (
        <ItemDetailsSkeleton item={item} />
      )}
    </div>
  );
}

function ItemDetailsSkeleton({ item }: { item: Item }) {
  return (
    <div className="pt-3.5" aria-hidden="true">
      <ImageSkeleton className="h-4 w-4/5 rounded-sm" />
      {item.cardDescription && <ImageSkeleton className="mt-2 h-3 w-1/2 rounded-sm" />}
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {item.retail && <ImageSkeleton className="h-3 w-10 rounded-sm" />}
          <ImageSkeleton className="h-5 w-12 rounded-sm" />
        </div>
        {item.link && <ImageSkeleton className="h-3 w-20 rounded-sm" />}
      </div>
    </div>
  );
}
