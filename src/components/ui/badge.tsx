import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Small technical label — mono font per the design system. */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-mono text-xs transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-transparent text-muted-foreground",
        solid: "border-transparent bg-foreground text-background",
        muted: "border-transparent bg-muted text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.68rem]",
        md: "px-2.5 py-0.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />;
}

export { badgeVariants };
