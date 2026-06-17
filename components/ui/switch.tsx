"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SwitchProps = Omit<React.ComponentProps<"button">, "onChange"> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isControlled = checked !== undefined
  const currentChecked = isControlled ? checked : internalChecked

  const handleToggle = () => {
    if (disabled) {
      return
    }
    const nextChecked = !currentChecked
    if (!isControlled) {
      setInternalChecked(nextChecked)
    }
    onCheckedChange?.(nextChecked)
  }

  return (
    <button
      type="button"
      role="switch"
      data-slot="switch"
      aria-checked={currentChecked}
      data-state={currentChecked ? "checked" : "unchecked"}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center border border-transparent bg-input/70 p-0.5 transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
        className,
      )}
      disabled={disabled}
      onClick={handleToggle}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "block size-4 bg-background shadow-sm transition-transform data-[state=checked]:translate-x-4",
        )}
        data-state={currentChecked ? "checked" : "unchecked"}
      />
    </button>
  )
}

export { Switch }
