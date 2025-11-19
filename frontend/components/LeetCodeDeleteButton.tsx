"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LeetCodeDeleteButton({ userId, onDelete }: { userId: string, onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Remove LeetCode?")) return
    setIsDeleting(true)
    try {
      const res = await fetch("/api/auth/profile/delete-leetcode-link", {
        method: "DELETE",
        body: JSON.stringify({ userId, field: "leetcodeLink" }),
      })
      if (res.ok) onDelete()
    } catch (error) {
      alert("Error removing link")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      🗑 Delete
    </Button>
  )
}