"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DeleteSkill({
  userId,
  initialSkills,
  isOwner,
}: { userId: string; initialSkills: string[]; isOwner: boolean }) {
  const [skills, setSkills] = useState<string[]>(initialSkills || [])
  const [loading, setLoading] = useState(false)

  const handleDelete = async (skillToDelete: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/profile/delete-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, skillName: skillToDelete }),
      })

      if (!response.ok) throw new Error("Failed to delete skill")

      setSkills(skills.filter((s) => s !== skillToDelete))
      window.location.reload()
    } catch (err) {
      console.error("Error deleting skill:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!initialSkills || initialSkills.length === 0) {
    return <p className="text-muted-foreground text-center text-sm">No skills added yet.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <div
          key={skill}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
        >
          <span>{skill}</span>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(skill)}
              disabled={loading}
              className="h-4 w-4 p-0 hover:bg-primary/20"
            >
              ✕
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
