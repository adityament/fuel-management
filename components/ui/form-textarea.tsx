"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  error?: string
  hint?: string
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = React.useId() // Moved React.useId call to the top level
    const effectiveId = id || textareaId

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={effectiveId} className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        <Textarea
          id={effectiveId}
          ref={ref}
          className={cn(error && "border-destructive focus-visible:ring-destructive/20", className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${effectiveId}-error` : hint ? `${effectiveId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${effectiveId}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${effectiveId}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
FormTextarea.displayName = "FormTextarea"

export { FormTextarea }
