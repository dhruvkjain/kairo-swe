"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DeleteResumeButton({ userId, fileUrl }: { userId: string; fileUrl: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/delete-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, fileUrl }),
      })

      if (!response.ok) throw new Error("Failed to delete resume")

      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting resume")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading} className="gap-2">
        <span>🗑</span>
        Delete
      </Button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </>
  )
}
