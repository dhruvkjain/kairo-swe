"use client";

import { useState } from "react";

interface EditProjectButtonProps {
  userId: string;
  project: {
    id: string;
    title: string;
    description: string;
    skills: string[];
  };
  onProjectEdited?: () => void;
}

export default function EditProjectButton({
  userId,
  project,
  onProjectEdited,
}: EditProjectButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [skills, setSkills] = useState(project.skills.join(", "));
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!title.trim() || !description.trim() || !skills.trim()) {
      return alert("Please fill all fields before saving.");
    }

    setLoading(true);
    try {
      const skillArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const res = await fetch("/api/auth/profile/edit-project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          projectId: project.id,
          title,
          description,
          skills: skillArray,
        }),
      });

      if (!res.ok) throw new Error("Failed to edit project");

      onProjectEdited?.();
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error editing project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-slate-800 hover:text-slate-900 ml-2"
        >
          ✏ Edit
        </button>
      ) : (
        <div className="border p-3 rounded-md bg-white mt-2 flex flex-col gap-2 text-slate-800">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            className="border border-gray-300 p-2 rounded text-sm"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            className="border border-gray-300 p-2 rounded resize-none h-20 text-sm"
          />
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills Used (comma separated, e.g. React, Next.js, Prisma)"
            className="border border-gray-300 p-2 rounded text-sm"
          />

          <div className="flex gap-2 mt-1">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="bg-slate-800 text-white text-sm px-3 py-1 rounded hover:bg-slate-900 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-white text-slate-800 border border-gray-300 text-sm px-3 py-1 rounded hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
