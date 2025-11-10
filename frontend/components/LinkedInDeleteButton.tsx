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
     <button
      onClick={handleDelete}
      className="flex items-center justify-center gap-2 w-28 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-md shadow-sm transition-all"
    >
      <span>🗑</span> Delete
    </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </>
  )
}