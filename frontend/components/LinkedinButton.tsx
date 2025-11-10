"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function LinkedinButton({ userId, currentLink }: { userId: string; currentLink?: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [linkedinLink, setLinkedinLink] = useState(currentLink || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!linkedinLink.trim()) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/LinkedinAttach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, linkedinLink }),
      })

      if (!response.ok) throw new Error("Failed to update LinkedIn link")

      setIsEditing(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating LinkedIn link")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} className="gap-2">
        <span>in</span>
        {currentLink ? "Edit LinkedIn" : "Add LinkedIn Profile"}
      </Button>
    )
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
      <input
        type="url"
        value={linkedinLink}
        onChange={(e) => setLinkedinLink(e.target.value)}
        placeholder="https://linkedin.com/in/username"
        className="w-full px-3 py-2 border rounded-md text-sm"
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
            setLinkedinLink(currentLink || "")
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
