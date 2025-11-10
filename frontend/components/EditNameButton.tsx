"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface EditNameButtonProps {
  userId: string
  initialName: string
}

export default function EditNameButton({ userId, initialName }: EditNameButtonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name }),
      })

      if (!response.ok) throw new Error("Failed to update name")

      setIsEditing(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating name")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="gap-2"
        aria-label="Edit profile name"
      >
        <span>✎</span>
      </Button>
    )
  }

  return (
    <div className="flex gap-2 flex-col">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-2 py-1 border rounded-md text-sm"
        placeholder="Enter new name"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading}>
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsEditing(false)
            setName(initialName)
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
