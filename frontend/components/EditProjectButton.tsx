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
        body: JSON.stringify({
          userId,
          projectId: project.id,
          title: formData.title,
          description: formData.description,
          link: formData.link,
          skills: skillsArray,
        }),
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

  return (
    <>
      {/* Edit Button */}
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

      {/* Popup Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 space-y-4 border border-gray-300 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-center">Edit Project</h2>

            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Project title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white/80 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />

            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Project description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm resize-none h-20 bg-white/80 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />

            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="Project link (optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white/80 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />

            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="Skills (comma separated, optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white/80 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" onClick={handleEdit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
