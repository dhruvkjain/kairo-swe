"use client";
import { useState } from "react";

export default function FileUpload({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // Convert file to Base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/auth/uploadFile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBase64: base64,
          fileName: file.name,
          userId,
        }),
      });

      const data = await res.json();
      if (data.fileUrl) {
        setFileUrl(data.fileUrl);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {fileUrl && (
        <p className="mt-3 text-green-600">
          Uploaded Successfully:{" "}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline">
            View File
          </a>
        </p>
      )}
    </div>
  );
}
