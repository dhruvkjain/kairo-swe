"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DeleteExperienceButton({
  experienceId,
  userId,
  onDelete,
}: {
  experienceId: string
  userId: string
  onDelete?: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this experience?")) return

    setLoading(true)
    try {
      const res = await fetch("/api/auth/profile/delete-experience", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, experienceId }),
      })

      if (res.ok) {
        alert("Experience deleted successfully!")
        onDelete?.()
      } else {
        const err = await res.json()
        alert(err.message || "Failed to delete experience")
      }
    } catch (error) {
      console.error(error)
      alert("Error deleting experience.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  )
}
