"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface EditGitHubLinkButtonProps {
  userId: string
  currentLink?: string
}

export default function EditGitHubLinkButton({
  userId,
  currentLink = "",
}: EditGitHubLinkButtonProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [githubLink, setGithubLink] = useState(currentLink)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async () => {
    if (!githubLink.trim()) {
      setMessage("❌ Please enter a valid GitHub link")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/auth/profile/GitHubAttach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, githubLink }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update GitHub link")

      setMessage("GitHub link updated successfully")

      // Delay to show success message, then refresh
      setTimeout(() => {
        router.refresh()
        setEditing(false)
      }, 1000)
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Main Edit Button */}
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all w-fit"
      >
        <span>✎</span> Edit Link
      </button>

      {/* Modal Popup */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center">
              Edit Link
            </h2>

            <input
              type="url"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="Enter new GitHub link"
              className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-60"
              disabled={loading}
            />

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg shadow-sm transition-all disabled:opacity-60 w-24"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg shadow-sm transition-all w-24 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>

            {message && (
              <p
                className={`text-sm mt-3 text-center transition-all ${
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
