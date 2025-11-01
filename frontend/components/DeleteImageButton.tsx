"use client";

import { useState } from "react";

export default function DeleteImageButton({ imageUrl }: { imageUrl: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/profile/RemovePic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      if (res.ok) {
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

  return (
    <div className="mt-4">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete Image"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
