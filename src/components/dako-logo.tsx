"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

interface DakoLogoProps {
  size?: number
  className?: string
}

export function DakoLogo({ size = 28, className }: DakoLogoProps) {
  const pathname = usePathname()
  const isLabs = pathname === '/labs' || pathname?.startsWith('/labs')

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <svg
        width={size}
        height={(size * 200) / 205}
        viewBox="0 0 205 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary shrink-0"
      >
        {/* Official V-notch Semicircle D-mark */}
        <path
          d="M 0 0 L 108 0 Q 205 0 205 100 Q 205 200 108 200 L 0 200 L 0 132 L 70 100 L 0 68 Z"
          fill="currentColor"
        />
      </svg>
      <div className="flex flex-col justify-center select-none">
        <div className="font-display font-extrabold text-[18px] tracking-tight text-foreground leading-none">
          DAKO
        </div>
        <div className={`font-sans text-[9px] tracking-[0.15em] uppercase leading-none mt-1 ${
          isLabs ? 'text-primary font-bold' : 'text-muted-foreground font-semibold'
        }`}>
          {isLabs ? 'LABS' : 'STUDIOS'}
        </div>
      </div>
    </div>
  )
}
