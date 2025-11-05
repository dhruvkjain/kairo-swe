"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AddSkillButton({ userId, initialSkills }: { userId: string; initialSkills: string[] }) {
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [error, setError] = useState("")

  const handleAdd = async () => {
    if (!newSkill.trim()) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/addskill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, skill: newSkill }),
      })

      if (!response.ok) throw new Error("Failed to add skill")

      setNewSkill("")
      setIsAdding(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding skill")
    } finally {
      setLoading(false)
    }
  }

  if (!isAdding) {
    return (
      <Button onClick={() => setIsAdding(true)} className="gap-2">
        <span>+</span>
        Add Skill
      </Button>
    )
  }

  return (
    <div className="flex gap-2 flex-col">
      <input
        type="text"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        placeholder="Enter skill name"
        className="px-3 py-2 border rounded-md text-sm"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAdd} disabled={loading}>
          Add
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
