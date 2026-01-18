"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface SummaryCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  ({ title, value, subtitle, icon: Icon, trend, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm", className)}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <p className={cn("text-xs font-medium", trend.isPositive ? "text-emerald-600" : "text-red-600")}>
                {trend.isPositive ? "+" : ""}
                {trend.value}% from last period
              </p>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    )
  },
)
SummaryCard.displayName = "SummaryCard"

export { SummaryCard }
