"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        error: "bg-red-500/10 text-red-600 dark:text-red-400",
        info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        petrol: "bg-chart-1/10 text-chart-1",
        diesel: "bg-chart-2/10 text-chart-2",
        premium: "bg-chart-4/10 text-chart-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, dot, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(statusBadgeVariants({ variant }), className)} {...props}>
        {dot && (
          <span
            className={cn(
              "mr-1.5 h-1.5 w-1.5 rounded-full",
              variant === "success" && "bg-emerald-500",
              variant === "warning" && "bg-amber-500",
              variant === "error" && "bg-red-500",
              variant === "info" && "bg-blue-500",
              variant === "petrol" && "bg-chart-1",
              variant === "diesel" && "bg-chart-2",
              variant === "premium" && "bg-chart-4",
              (!variant || variant === "default") && "bg-muted-foreground",
            )}
          />
        )}
        {children}
      </span>
    )
  },
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }
