"use client";

import { useState, useRef } from "react";

export default function ImageManager({ imageUrl }: { imageUrl: string | null }) {
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload or replace image
  const handleUpload = async (file: File) => {
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/auth/profile/EditPic", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentImage(data.imageUrl); // assuming backend returns { imageUrl }
        setMessage("Image uploaded successfully.");
        window.location.reload();
      } else {
        setMessage("Failed to upload image.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const handleDelete = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/profile/RemovePic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: currentImage }),
      });

      if (res.ok) {
        setCurrentImage(null);
        setMessage("Image deleted successfully.");
        window.location.reload();
      } else {
        setMessage("Failed to delete image.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      {currentImage ? (
        <>
          <img
            src={currentImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full shadow-md mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={handleEditClick}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Edit Image"}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Image"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-2 text-gray-600">No profile picture uploaded.</p>
          <button
            onClick={handleEditClick}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
