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
      className="flex flex-col items-center space-y-4 mt-6"
    >
      {/* Preview image */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 object-cover rounded-full border"
        />
      )}

      {/* File input */}
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}