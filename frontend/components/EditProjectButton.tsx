"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function EditProjectButton({ userId, project }: { userId: string; project: any }) {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    link: project.link || "",
    skills: Array.isArray(project.skills) ? project.skills.join(", ") : (project.skills || "")
  })
  const [error, setError] = useState("")

  const handleEdit = async () => {
    setLoading(true)
    setError("")
    try {
      const skillsArray = formData.skills
        ? formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : []

      const response = await fetch("/api/auth/profile/update-project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, projectId: project.id, title: formData.title, description: formData.description, skills: skillsArray }),
      })

      if (!response.ok) throw new Error("Failed to update project")

      setIsEditing(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating project")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditing(true)}
        disabled={loading}
        className="gap-2 bg-transparent"
      >
        <span>✎</span>
        Edit
      </Button>
    )
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Project title"
        className="w-full px-3 py-2 border rounded-md text-sm"
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Project description"
        className="w-full px-3 py-2 border rounded-md text-sm resize-none h-20"
      />
      <input
        type="url"
        value={formData.link}
        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        placeholder="Project link (optional)"
        className="w-full px-3 py-2 border rounded-md text-sm"
      />
      <input
        type="text"
        value={formData.skills}
        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
        placeholder="Skills (comma separated, optional)"
        className="w-full px-3 py-2 border rounded-md text-sm"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleEdit} disabled={loading}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
