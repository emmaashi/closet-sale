import { useState } from "react";
import { X } from "lucide-react";
import type { Item } from "@/data/types";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselCounter,
  CarouselThumbs,
} from "@/components/ui/carousel";
import { photoUrl } from "@/lib/utils";

type Props = { item: Item | null; onClose: () => void };

export function Lightbox({ item, onClose }: Props) {
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      {item && (
        <DialogContent aria-describedby={undefined}>
          <DialogTitle className="sr-only">{item.name}</DialogTitle>

          <DialogClose
            className="fixed right-5 top-5 z-50 flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
            aria-label="Close"
          >
            <X className="size-5" />
          </DialogClose>

          <Carousel className="flex h-[88vh] w-full max-w-[1100px] flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative min-h-0 flex-1">
              <CarouselContent>
                {item.photos.map((p, i) => (
                  <CarouselItem key={i} className="flex items-center justify-center">
                    <ZoomImage src={photoUrl(p)} alt={item.name} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </div>
            <CarouselCounter />
            <CarouselThumbs photos={item.photos.map(photoUrl)} />
          </Carousel>
        </DialogContent>
      )}
    </Dialog>
  );
}

function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("center center");
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onClick={(e) => {
        e.stopPropagation();
        setZoomed((z) => !z);
        if (zoomed) setOrigin("center center");
      }}
      onMouseMove={(e) => {
        if (!zoomed) return;
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      style={{ transformOrigin: origin }}
      className={
        "max-h-full max-w-full select-none object-contain transition-transform duration-150 " +
        (zoomed ? "scale-[2.6] cursor-zoom-out" : "cursor-zoom-in")
      }
    />
  );
}
