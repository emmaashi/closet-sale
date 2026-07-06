import type { Shop } from "@/data/types";

export function Footer({ shop }: { shop: Shop }) {
  return (
    <footer className="mx-auto max-w-[1560px] px-5 pb-16 text-center text-[12.5px] tracking-wide text-[var(--color-muted)]">
      Message <b className="font-medium text-[var(--color-ink)]">{shop.handle}</b> if interested in anything!
      Everything OBO!
    </footer>
  );
}
