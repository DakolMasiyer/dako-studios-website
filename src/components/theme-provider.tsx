"use client"

import * as React from "react"
import { ThemeProviderContext } from "@/contexts/theme-context"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  // Toggle atomically — no remove-then-add gap that causes the flash
  root.classList.toggle("dark", isDark)
  root.classList.toggle("light", !isDark)
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "dako-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () =>
      (typeof window !== "undefined" &&
        (localStorage.getItem(storageKey) as Theme)) ||
      defaultTheme
  )

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Keep in sync if OS preference changes while page is open
  React.useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme("system")
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme)
      }
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
