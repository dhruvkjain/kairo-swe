"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ContactButton({ userId, currentPhone }: { userId: string; currentPhone: string[]}) {
  const [isEditing, setIsEditing] = useState(false)
  const [phones, setPhones] = useState<string[]>(currentPhone || ["", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setLoading(true)
    setError("")
    try {
      const validPhones = phones.map(p => p.trim()).filter(p => p)
      const primaryPhone = validPhones[0] ?? ""
      const secondaryPhone = validPhones[1]

      const response = await fetch("/api/auth/profile/update-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, primaryPhone, secondaryPhone }),
      })

      if (!response.ok) throw new Error("Failed to update phone numbers")

      setIsEditing(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating contact")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} className="gap-2">
        <span>☎</span>
        Edit Phone Numbers
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      {[0, 1].map((idx) => (
        <input
          key={idx}
          type="tel"
          value={phones[idx] || ""}
          onChange={(e) => {
            const newPhones = [...phones]
            newPhones[idx] = e.target.value
            setPhones(newPhones)
          }}
          placeholder={idx === 0 ? "Primary phone" : "Secondary phone"}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      ))}
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
            setPhones(currentPhone || ["", ""])
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
