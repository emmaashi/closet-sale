import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-full border border-[rgba(27,26,23,0.35)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-ink)] focus-visible:ring-4 focus-visible:ring-[rgba(27,26,23,0.06)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
