"use client"

import { useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { Button } from "@/components/ui/button"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB limit

interface FileUploadProps {
  onSuccess?: (fileUrl: string) => void
  onError?: (error: string) => void
}

export default function FileUpload({ onSuccess, onError }: FileUploadProps) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      onError?.("File size must be less than 5MB")
      return
    }

    setLoading(true)

    try {
      // Convert file to base64
      // Validate file type
      if (!file.type.match(/application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)/)) {
        onError?.("Please upload a PDF or Word document")
        return
      }

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          if (!reader.result || typeof reader.result !== 'string') {
            reject(new Error('Failed to read file'))
            return
          }
          const base64 = reader.result
          const base64Data = base64.substring(base64.indexOf(',') + 1)
          if (!base64Data) {
            reject(new Error('Invalid file data'))
            return
          }
          resolve(base64Data)
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
      })

      const response = await fetch("/api/auth/uploadFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileBase64: base64,
          fileName: file.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Upload failed")

      onSuccess?.(data.fileUrl)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
      <Button onClick={handleClick} disabled={loading} className="gap-2">
        {loading ? (
          "Uploading..."
        ) : (
          <>
            <span>⬆</span>
            Upload Resume (PDF)
          </>
        )}
      </Button>
    </>
  )
}
