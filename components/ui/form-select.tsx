"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface SelectOption {
  value: string
  label: string
}

export interface FormSelectProps {
  label?: string
  error?: string
  hint?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  id?: string
}

const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ label, error, hint, placeholder, options, value, onValueChange, disabled, className, id }, ref) => {
    const selectId = React.useId()
    const finalId = id || selectId

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={finalId} className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            id={finalId}
            className={cn(error && "border-destructive focus:ring-destructive/20", className)}
            aria-invalid={!!error}
            aria-describedby={error ? `${finalId}-error` : hint ? `${finalId}-hint` : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p id={`${finalId}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${finalId}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
FormSelect.displayName = "FormSelect"

export { FormSelect }
