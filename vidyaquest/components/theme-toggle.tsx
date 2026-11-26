"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
  const dark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      aria-label="Dark mode"
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <svg className="theme-toggle-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.9 13.4A9 9 0 0 1 10.6 3.1 9 9 0 1 0 20.9 13.4Z" />
      </svg>
      <svg className="theme-toggle-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </svg>
    </button>
  )
}
