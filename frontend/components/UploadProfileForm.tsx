"use client"

import { useState, FormEvent } from "react";

export default function UploadProfileForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    const res = await fetch("/api/auth/profile/upload", {
      method: "POST",
      body: formData,
    });
    setLoading(false);

    if (res.ok) {
      alert("Profile picture updated!");
      window.location.reload();
    } else {
      alert("Failed to upload picture.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 mt-6 text-slate-800"
    >
      {/* Preview image */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 object-cover rounded-full border border-gray-200 shadow-sm"
        />
      )}

      {/* File input */}
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-700"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-md border border-gray-300 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-50 shadow-sm"
      >
        {loading ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}
