"use client";

import { useState } from "react";

export default function AddSkillButton({
  userId,
  initialSkills = [],
  onSkillAdded,
}: {
  userId: string;
  initialSkills?: string[];
  onSkillAdded?: (newSkills: string[]) => void;
}) {
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/profile/addskills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, skill: newSkill }),
      });

      if (!res.ok) throw new Error("Failed to add skill");

      const data = await res.json();

      // Notify parent
      onSkillAdded?.(data.skills);

      setNewSkill("");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error adding skill!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        placeholder="Enter new skill"
        className="border border-gray-300 px-3 py-1 rounded-md flex-1 text-slate-800"
      />
      <button
        onClick={handleAddSkill}
        disabled={loading}
        className="px-4 py-1 rounded-md border border-gray-300 bg-slate-800 text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add"}
      </button>
    </div>
  );
}
