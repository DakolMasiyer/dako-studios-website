import { cn } from "@/lib/utils"

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right"

const positionClasses: Record<Position, string> = {
  "top-left":     "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-right":    "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-left":  "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
}

export function DecorIcon({
  position = "top-left",
  className,
}: {
  position?: Position
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute text-border", positionClasses[position], className)}
      aria-hidden="true"
    >
      <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
