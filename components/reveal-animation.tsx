"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface RevealAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function RevealAnimation({ children, className, delay = 0, direction = "up" }: RevealAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getTransform = () => {
    if (isVisible) return "translate(0, 0)"

    switch (direction) {
      case "up":
        return "translate(0, 40px)"
      case "down":
        return "translate(0, -40px)"
      case "left":
        return "translate(40px, 0)"
      case "right":
        return "translate(-40px, 0)"
      default:
        return "translate(0, 40px)"
    }
  }

  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", isVisible ? "opacity-100" : "opacity-0", className)}
      style={{
        transform: getTransform(),
      }}
    >
      {children}
    </div>
  )
}
