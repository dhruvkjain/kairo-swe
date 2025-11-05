"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FileUpload({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const router = useRouter();

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
        router.refresh();
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
    <div className="mt-4 text-slate-800">
      <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} className="" />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="mt-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-50 shadow-sm"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {fileUrl && (
        <p className="mt-3 text-slate-700">File uploaded successfully!</p>
      )}
    </div>
  );
}
