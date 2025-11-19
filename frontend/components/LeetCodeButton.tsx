"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function LeetCodeButton({ userId, currentLink }: { userId: string; currentLink?: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [leetcodeLink, setLeetCodeLink] = useState(currentLink || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!leetcodeLink.trim()) return
    setLoading(true)
    try {
      const response = await fetch("/api/auth/profile/LeetCodeAttach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, leetcodeLink }),
      })
      if (!response.ok) throw new Error("Failed to link LeetCode")
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} className="gap-2 bg-yellow-600 hover:bg-yellow-700">
        <span>⚡</span>
        {currentLink ? "Edit LeetCode" : "Add LeetCode"}
      </Button>
    )
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
      <input
        type="url"
        value={leetcodeLink}
        onChange={(e) => setLeetCodeLink(e.target.value)}
        placeholder="https://leetcode.com/u/username"
        className="w-full px-3 py-2 border rounded-md text-sm"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading}>Save</Button>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    </div>
  )
}