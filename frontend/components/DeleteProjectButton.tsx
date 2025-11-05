"use client";

import { useState } from "react";

export default function DeleteProjectButton({
  userId,
  projectId,
  onProjectDeleted,
}: {
  userId: string;
  projectId: string;
  onProjectDeleted?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile/delete-project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, projectId }),
      });

      if (!res.ok) throw new Error("Failed to delete project");

      onProjectDeleted?.();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 rounded-md border border-gray-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
