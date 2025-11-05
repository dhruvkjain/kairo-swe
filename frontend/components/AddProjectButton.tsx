"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AddProjectButton({ userId, initialProjects }: { userId: string; initialProjects?: any[] }) {
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", link: "", skills: "" })
  const [error, setError] = useState("")

  const handleAdd = async () => {
    if (!formData.title.trim()) {
      setError("Project title is required")
      return
    }

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/add-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      })

      if (!response.ok) throw new Error("Failed to add project")

      setFormData({ title: "", description: "", link: "", skills: "" })
      setIsAdding(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding project")
    } finally {
      setLoading(false)
    }
  }

  if (!isAdding) {
    return (
      <Button onClick={() => setIsAdding(true)} className="gap-2">
        <span>+</span>
        Add Project
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
        <Button size="sm" onClick={handleAdd} disabled={loading}>
          Add Project
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
