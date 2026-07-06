import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[3px] font-semibold uppercase tracking-wide backdrop-blur-sm",
  {
    variants: {
      variant: {
        light: "bg-white/90 text-[var(--color-ink)]",
        dark: "bg-[var(--color-ink)] text-white",
        counter: "bg-black/70 text-white normal-case tracking-normal font-medium",
      },
      size: {
        default: "px-2.5 py-1 text-[11px]",
        sm: "px-2 py-0.5 text-[9px]",
      },
    },
    defaultVariants: { variant: "light", size: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
