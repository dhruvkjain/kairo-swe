"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DeleteProjectButton({ userId, projectId }: { userId: string; projectId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/delete-project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, projectId }),
      })

      if (!response.ok) throw new Error("Failed to delete project")

      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting project")
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
