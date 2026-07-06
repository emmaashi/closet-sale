import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (i: number) => void;
  selectedIndex: number;
  count: number;
  canPrev: boolean;
  canNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within <Carousel>");
  return ctx;
}

function Carousel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [carouselRef, api] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);
  const scrollTo = React.useCallback((i: number) => api?.scrollTo(i), [api]);

  React.useEffect(() => {
    if (!api) return;
    const update = () => {
      setCount(api.scrollSnapList().length);
      setSelectedIndex(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollPrev, scrollNext]);

  return (
    <CarouselContext.Provider
      value={{ carouselRef, scrollPrev, scrollNext, scrollTo, selectedIndex, count, canPrev, canNext }}
    >
      <div className={className} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="h-full overflow-hidden">
      <div className={cn("flex h-full", className)} {...props} />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0 shrink-0 grow-0 basis-full", className)} {...props} />;
}

const navBtn =
  "absolute top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 disabled:pointer-events-none disabled:opacity-25 cursor-pointer";

function CarouselPrevious() {
  const { scrollPrev, canPrev, count } = useCarousel();
  if (count <= 1) return null;
  return (
    <button className={cn(navBtn, "left-3")} onClick={scrollPrev} disabled={!canPrev} aria-label="Previous">
      <ChevronLeft className="size-5" />
    </button>
  );
}

function CarouselNext() {
  const { scrollNext, canNext, count } = useCarousel();
  if (count <= 1) return null;
  return (
    <button className={cn(navBtn, "right-3")} onClick={scrollNext} disabled={!canNext} aria-label="Next">
      <ChevronRight className="size-5" />
    </button>
  );
}

function CarouselCounter() {
  const { selectedIndex, count } = useCarousel();
  if (count <= 1) return null;
  return (
    <div className="flex-none pt-3 text-center text-xs tracking-wide text-white/70">
      {selectedIndex + 1} / {count}
    </div>
  );
}

function CarouselThumbs({ photos }: { photos: string[] }) {
  const { selectedIndex, scrollTo, count } = useCarousel();
  if (count <= 1) return null;
  return (
    <div className="flex-none flex justify-center gap-2 overflow-x-auto px-1 pt-2.5 no-scrollbar">
      {photos.map((p, i) => (
        <button
          key={i}
          onClick={() => scrollTo(i)}
          className={cn(
            "h-16 w-[52px] flex-none overflow-hidden rounded-[3px] outline outline-2 transition-opacity",
            i === selectedIndex ? "opacity-100 outline-white" : "opacity-50 outline-transparent hover:opacity-80"
          )}
        >
          <img src={p} alt="" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselCounter,
  CarouselThumbs,
  useCarousel,
};
