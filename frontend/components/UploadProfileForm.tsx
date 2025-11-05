"use client"

import { useState, FormEvent } from "react"

export default function UploadProfileForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setLoading(true)
    try {
      const res = await fetch("/api/auth/profile/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.imageUrl) {
          // refresh to show updated profile picture
          window.location.reload()
        } else {
          throw new Error("No image URL returned")
        }
      } else {
        const error = await res.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(error.message || "Failed to upload picture")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload picture")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center space-y-4"
    >
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 object-cover rounded-full border border-gray-200 shadow-sm"
        />
      )}

      <input
        type="file"
        name="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-700"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full px-4 py-2 bg-white text-slate-800 border border-gray-300 rounded-md hover:bg-slate-50 disabled:opacity-50 shadow-sm"
      >
        {loading ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  )
}
