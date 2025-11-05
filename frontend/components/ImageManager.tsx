"use client"

import { useState, useRef, type ChangeEvent, useEffect } from "react"

interface ImageManagerProps {
  imageUrl: string
  userId: string
  isOwner: boolean
}

export default function ImageManager({ imageUrl, userId, isOwner }: ImageManagerProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
  const response = await fetch("/api/auth/profile/delete-profilepicture", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId , imageUrl }),
      })
      if (!response.ok) throw new Error("Failed to delete picture")
      
      // on success reload
      window.location.reload()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete profile picture")
    } finally {
      setIsDeleting(false)
    }

  }


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("userId", userId)

      const response = await fetch("/api/auth/profile/upload", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Upload failed")
      setSelectedFile(null)
      setPreviewUrl(null)
      window.location.reload()
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload profile picture")
      setIsUploading(false)
    }
  }

  const handleCancelSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSelectedFile(null)
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Image Container with Overlay */}
      <div className="relative group">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
          <img
            src={previewUrl || imageUrl || "/placeholder.svg?height=160&width=160"}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>

        {isOwner && imageUrl && !previewUrl && (
          <>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
              aria-label="Delete profile picture"
              title="Delete picture"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>

            {showDeleteConfirm && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-4 shadow-xl">
                  <p className="text-sm font-medium text-gray-900 mb-3">Delete picture?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="px-3 py-1 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isOwner && (
        <div className="w-full flex flex-col gap-3">
          {/* Hidden input */}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          {/* Choose/Upload Buttons */}
          <div className="flex gap-2 justify-center flex-wrap">
            {(!imageUrl || selectedFile) && (
              <button
                onClick={() => inputRef.current?.click()}
                disabled={isUploading || isDeleting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition font-medium"
              >
                {isUploading ? "Uploading..." : "Choose Photo"}
              </button>
            )}

            {selectedFile && (
              <>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg transition font-medium"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={handleCancelSelection}
                  disabled={isUploading}
                  className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition font-medium"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
