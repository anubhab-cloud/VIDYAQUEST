"use client"

import { useCallback, useMemo, useState, useSyncExternalStore } from "react"
import { getActivityYear, localActivityDate } from "@/lib/student-activity"

const activityChanged = "vidyaquest:activity-changed"
const serverSnapshot = () => null
const datePattern = /^\d{4}-\d{2}-\d{2}$/

function subscribeToActivity(onChange: () => void) {
  window.addEventListener(activityChanged, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(activityChanged, onChange)
    window.removeEventListener("storage", onChange)
  }
}

function subscribeToDate(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000)
  window.addEventListener("focus", onChange)
  document.addEventListener("visibilitychange", onChange)
  return () => {
    window.clearInterval(timer)
    window.removeEventListener("focus", onChange)
    document.removeEventListener("visibilitychange", onChange)
  }
}

export function useStudentActivity(studentId: string) {
  const prefix = `vidyaquest:activity:v1:${encodeURIComponent(studentId)}:`
  const [unsaved, setUnsaved] = useState<Record<string, string>>({})
  const getSnapshot = useCallback(() => {
    const entries: [string, string | null][] = []
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index)
        if (!key?.startsWith(prefix)) continue
        const value = localStorage.getItem(key)
        if (value === "unchecked" || (value && datePattern.test(value))) {
          entries.push([
            key.slice(prefix.length),
            value === "unchecked" ? null : value,
          ])
        }
      }
    } catch {
      // The session can still track actions when browser storage is blocked.
    }
    return JSON.stringify(entries)
  }, [prefix])
  const snapshot = useSyncExternalStore(
    subscribeToActivity,
    getSnapshot,
    serverSnapshot
  )
  const today = useSyncExternalStore(
    subscribeToDate,
    localActivityDate,
    serverSnapshot
  )
  const completions = useMemo(() => {
    const entries: [string, string | null][] = snapshot
      ? JSON.parse(snapshot)
      : []
    const result = new Map(entries)
    for (const [key, value] of Object.entries(unsaved)) {
      if (key.startsWith(prefix)) {
        result.set(
          key.slice(prefix.length),
          value === "unchecked" ? null : value
        )
      }
    }
    return result
  }, [prefix, snapshot, unsaved])

  function setCompletion(id: string, date: string | null) {
    const key = prefix + id
    const value = date ?? "unchecked"
    try {
      localStorage.setItem(key, value)
      if (Object.hasOwn(unsaved, key)) {
        setUnsaved((current) => {
          const next = { ...current }
          delete next[key]
          return next
        })
      }
      window.dispatchEvent(new Event(activityChanged))
    } catch {
      setUnsaved((current) => ({ ...current, [key]: value }))
    }
  }

  const year = useMemo(
    () =>
      today && snapshot ? getActivityYear(today, completions.values()) : null,
    [today, snapshot, completions]
  )

  return {
    completions,
    setCompletion,
    today,
    year,
    hasUnsaved: Object.keys(unsaved).some((key) => key.startsWith(prefix)),
  }
}
