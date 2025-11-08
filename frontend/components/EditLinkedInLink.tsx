"use client"

import { useState } from "react"
import { Button } from "./ui/button"

interface EditLinkedInLinkButtonProps {
  userId: string
  currentLink?: string
}

export default function EditLinkedInLinkButton({
  userId,
  currentLink = "",
}: EditLinkedInLinkButtonProps) {
  const [editing, setEditing] = useState(false)
  const [linkedInLink, setLinkedInLink] = useState(currentLink)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/auth/profile/edit-linkedin-link", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, linkedinLink: linkedInLink }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update LinkedIn link")
      setMessage("✅ LinkedIn link updated successfully")
      setTimeout(() => {
        setEditing(false)
        setMessage("")
      }, 1200)
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Button always visible */}
      <Button
        onClick={() => setEditing(true)}
        className="flex items-center justify-center gap-2 w-28 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md shadow-sm transition-all"
      >
        <span>✎</span> Edit
      </Button>

      {/* Popup modal when editing */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg p-5 w-[90%] sm:w-96 space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-2">Edit LinkedIn Link</h3>
            <input
              type="url"
              value={linkedInLink}
              onChange={(e) => setLinkedInLink(e.target.value)}
              placeholder="Enter new LinkedIn link"
              className="border border-border rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-4 py-2 text-sm rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
            {message && (
              <p
                className={`text-xs text-center font-medium ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
