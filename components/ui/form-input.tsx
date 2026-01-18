"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, hint, icon, rightIcon, id, ...props }, ref) => {
    const inputId = React.useId() // Moved useId call to top level
    const resolvedId = id || inputId

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={resolvedId} className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
          <Input
            id={resolvedId}
            ref={ref}
            className={cn(
              icon && "pl-10",
              rightIcon && "pr-10",
              error && "border-destructive focus-visible:ring-destructive/20",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${resolvedId}-error` : hint ? `${resolvedId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{rightIcon}</div>
          )}
        </div>
        {error && (
          <p id={`${resolvedId}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${resolvedId}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
FormInput.displayName = "FormInput"

export { FormInput }
