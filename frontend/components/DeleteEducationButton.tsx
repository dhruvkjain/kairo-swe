"use client"

import { useState } from "react"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DeleteEducationButton({
  educationId,
  applicantId,
  onDeleted,
}: {
  educationId: string
  applicantId: string
  onDeleted?: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/profile/delete-education`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, educationId }),
      })
      if (res.ok) onDeleted?.()
      else console.error("Failed to delete education:", await res.text())
    } catch (err) {
      console.error("Error deleting education:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Delete"
      className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
    >
      <Trash className="w-3.5 h-3.5" />
    </button>
  )
}
