"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface GitHubDeleteButtonProps {
  userId: string
  onDelete: () => void
}

export default function GitHubDeleteButton({ userId, onDelete }: GitHubDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your GitHub integration?")) return

    setIsDeleting(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/delete-github-link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          field: "githubLink",
          value: null,
        }),
      })

      if (response.ok) {
        onDelete()
      } else {
        alert("Failed to remove GitHub link")
      }
    } catch (error) {
      console.error("Error deleting GitHub link:", error)
      alert("An error occurred while removing GitHub link")
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