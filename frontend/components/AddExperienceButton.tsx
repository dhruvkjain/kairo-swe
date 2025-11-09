"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddExperienceButton({
  userId,
  initialExperiences = [],
}: {
  userId: string
  initialExperiences?: any[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [experiences, setExperiences] = useState(initialExperiences)

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
    referenceEmails: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.role || !formData.company || !formData.duration || !formData.description) {
      alert("Please fill all required fields.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/auth/profile/add-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      })

      if (!res.ok) throw new Error("Failed to add experience")

      const newExp = await res.json()
      setExperiences([...experiences, newExp])

      // Reset form
      setFormData({
        role: "",
        company: "",
        duration: "",
        description: "",
        referenceEmails: "",
      })
      setOpen(false)

      // 🔄 Reload after success
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert("Error adding experience.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Button to open popup */}
      <Button
        variant="secondary"
        size="sm"
        className="text-sm"
        onClick={() => setOpen(true)}
      >
        + Add New Experience
      </Button>

      {/* Popup Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl p-6 w-full max-w-md relative border border-border">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Add New Experience
            </h2>

            <div className="space-y-3">
              <Input
                name="role"
                placeholder="Role / Position"
                value={formData.role}
                onChange={handleChange}
              />
              <Input
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
              />
              <Input
                name="duration"
                placeholder="Duration (e.g. Jan 2023 - Dec 2023)"
                value={formData.duration}
                onChange={handleChange}
              />

              {/* Description textarea */}
              <textarea
                name="description"
                placeholder="Describe your role and work briefly"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-24 border border-border rounded-md p-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <Input
                name="referenceEmails"
                placeholder="Reference Emails (comma-separated)"
                value={formData.referenceEmails}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>

            {/* Close button in corner */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
