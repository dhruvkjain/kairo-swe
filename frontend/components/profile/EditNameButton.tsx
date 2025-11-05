"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";

type Props = Readonly<{
  userId: string;
  initialName?: string;
  className?: string;
}>;

export default function EditNameButton({
  userId,
  initialName = "",
  className = "",
}: Props) {
  const [name, setName] = useState(initialName);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("Name cannot be empty");
      return;
    }
    if (trimmed === initialName) {
      setOpen(false);
      return; // no change
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile/editname", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to update name");

      alert("✅ Name updated successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white text-slate-800 hover:bg-slate-50 transition disabled:opacity-50 shadow-sm ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Pencil className="w-4 h-4" /> Edit Name
          </>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 border border-gray-200">
            <h2 className="text-lg font-serif font-semibold mb-3 text-slate-900">Edit Your Name</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              placeholder="Enter new name"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-1.5 text-sm rounded border border-gray-300 bg-white hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-1.5 text-sm rounded bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}