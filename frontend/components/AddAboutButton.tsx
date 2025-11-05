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
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {about ? "Edit About" : "Add About"}
      </button>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 items-center w-full">
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        rows={5}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        placeholder="Write about yourself..."
      />
      <p className="text-sm text-gray-500">
        {about.trim() === ""
          ? 0
          : about.trim().split(/\s+/).length}
        /{wordLimit} words
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
