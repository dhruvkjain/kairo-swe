"use client";

import { useState } from "react";

interface AddProjectButtonProps {
  userId: string;
  initialProjects?: string[];
  onProjectAdded?: (projects: string[]) => void;
}

export default function AddProjectButton({
  userId,
  initialProjects = [],
  onProjectAdded,
}: AddProjectButtonProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProject = async () => {
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!title.trim() || !description.trim() || skills.length === 0) {
      return alert("Please fill all fields (title, description, skills)");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile/add-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, description, skills }),
      });

      if (!res.ok) throw new Error("Failed to add project");

      const data = await res.json();
      onProjectAdded?.(data.projects);
      setTitle("");
      setDescription("");
      setSkillsInput("");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error adding project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2 border p-3 rounded-md bg-white text-slate-800">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project Title"
        className="border border-gray-300 p-2 rounded-md"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
        className="border border-gray-300 p-2 rounded-md resize-none h-24"
      />
      <input
        type="text"
        value={skillsInput}
        onChange={(e) => setSkillsInput(e.target.value)}
        placeholder="Skills Used (comma separated, e.g. React, Next.js, Prisma)"
        className="border border-gray-300 p-2 rounded-md"
      />
      <button
        onClick={handleAddProject}
        disabled={loading}
        className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Project"}
      </button>
    </div>
  );
}
