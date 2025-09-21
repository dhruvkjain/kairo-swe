"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-float-slow" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-secondary/15 rounded-full animate-float-medium" />
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-accent/25 rounded-full animate-float-fast" />
      <div className="absolute top-60 right-40 w-2.5 h-2.5 bg-primary/10 rounded-full animate-float-slow" />
      <div className="absolute bottom-60 right-10 w-2 h-2 bg-secondary/20 rounded-full animate-float-medium" />
    </div>
  )
}
