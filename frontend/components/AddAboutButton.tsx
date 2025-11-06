"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AddAboutButtonProps {
  userId: string
  initialAbout?: string
  role: string
}

export default function AddAboutButton({ userId, initialAbout, role }: AddAboutButtonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [about, setAbout] = useState(initialAbout || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, about , role}),
      })

      if (!response.ok) throw new Error("Failed to update about")

      setIsEditing(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating about")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
        {initialAbout ? (
          <>
            <span>✎</span>
            Edit About
          </>
        ) : (
          <>
            <span>+</span>
            Add About
          </>
        )}
      </Button>
    )
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        placeholder={`Add an about section for your ${role}...`}
        className="w-full px-3 py-2 border rounded-md text-sm resize-none h-24"
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
            setAbout(initialAbout || "")
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
