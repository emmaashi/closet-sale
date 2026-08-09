import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  dark?: boolean;
};

export function ImageSkeleton({ className, dark = false }: Props) {
  return <div aria-hidden="true" className={cn("image-skeleton pointer-events-none", dark && "image-skeleton-dark", className)} />;
}
