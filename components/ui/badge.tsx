import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        cashflow:
          "border-purple-300 bg-purple-900/20 text-purple-900 dark:border-purple-600 dark:bg-purple-900/60 dark:text-purple-200",
        gold:
          "border-amber-400 bg-amber-500/20 text-amber-800 dark:border-amber-500 dark:text-amber-300 font-bold",
        cyan:
          "border-cyan-400 bg-cyan-500/15 text-cyan-800 dark:border-cyan-500 dark:text-cyan-300",
        success:
          "border-emerald-400 bg-emerald-500/15 text-emerald-800 dark:border-emerald-500 dark:text-emerald-300 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

