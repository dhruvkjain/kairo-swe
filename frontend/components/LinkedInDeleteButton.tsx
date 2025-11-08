"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { set } from "date-fns"

interface LinkedInDeleteButtonProps {
  userId: string
  onDelete: () => void
}

export default function LinkedInDeleteButton({ userId, onDelete }: LinkedInDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your LinkedIn integration?")) return

    setIsDeleting(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/delete-linkedin-link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          field: "linkedInLink",
          value: null,
        }),
      })

      if (response.ok) {
        onDelete()
      } else {
        alert("Failed to remove LinkedIn link")
      }
    } catch (error) {
      console.error("Error deleting LinkedIn link:", error)
      alert("An error occurred while removing LinkedIn link")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
     <>
      <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting} className="gap-2">
        <span>🗑</span>
        Delete
      </Button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </>
  )
}