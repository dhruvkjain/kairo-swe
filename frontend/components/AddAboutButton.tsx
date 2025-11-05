"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAboutButton({
  userId,
  initialAbout,
  role,
}: {
  userId: string;
  initialAbout?: string | null;
  role: "APPLICANT" | "RECRUITER";
}) {
  const [about, setAbout] = useState(initialAbout ?? ""); // handles null safely
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const wordLimit = 200;

  const router = useRouter();

  const handleSubmit = async () => {
    if (about.trim().split(/\s+/).length > wordLimit) {
      alert(`About section cannot exceed ${wordLimit} words.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, about, role }),
      });

      if (res.ok) {
        alert("About section updated successfully!");
        setIsEditing(false);
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating about section.");
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 px-4 py-2 rounded-md border border-gray-300 bg-white text-slate-800 hover:bg-slate-50 transition shadow-sm"
      >
        {about ? "Edit About" : "Add About"}
      </button>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 items-center w-full text-slate-800">
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        rows={5}
        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-slate-400"
        placeholder="Write about yourself..."
      />
      <p className="text-sm text-slate-500">
        {about.trim() === "" ? 0 : about.trim().split(/\s+/).length}/{wordLimit} words
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-md border border-gray-300 bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 rounded-md border border-gray-200 bg-white hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
