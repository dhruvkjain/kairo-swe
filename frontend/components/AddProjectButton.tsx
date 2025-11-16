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

  return (
    <>
      {/* Add Button */}
      <Button onClick={() => setIsAdding(true)} className="gap-2">
        <span>+</span>
        Add Project
      </Button>

      {/* Popup Modal */}
      {isAdding && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setIsAdding(false)} // click outside to close
        >
          <div
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 space-y-4 border border-gray-300 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()} // prevent close on modal click
          >
            <h2 className="text-lg font-semibold text-center">Add New Project</h2>

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
              placeholder="Skills (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white/80 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" onClick={handleAdd} disabled={loading}>
                {loading ? "Adding..." : "Add Project"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAdding(false)}
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
