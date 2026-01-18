"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { VariantProps } from "class-variance-authority"

export interface IconButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  tooltip?: string
  icon: React.ReactNode
  asChild?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size = "icon", tooltip, icon, ...props }, ref) => {
    const button = (
      <Button ref={ref} variant={variant} size={size} className={cn("shrink-0", className)} {...props}>
        {icon}
      </Button>
    )

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  },
)
IconButton.displayName = "IconButton"

export { IconButton }
