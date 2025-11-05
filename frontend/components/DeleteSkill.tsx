"use client";

import { useState } from "react";

export default function DeleteSkill({ userId, initialSkills = [], isOwner = false }: { userId: string; initialSkills?: string[]; isOwner?: boolean }) {
  const [skills, setSkills] = useState(initialSkills);

  const handleRemoveSkill = async (skill: string) => {
    try {
      const res = await fetch("/api/auth/profile/Removeskill", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, skill }),
      });

      if (!res.ok) throw new Error("Failed to remove skill");

      const data = await res.json();
      setSkills(data.skills);
    } catch (err) {
      console.error(err);
      alert("Error removing skill!");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm max-w-md bg-white text-slate-800">
      <h2 className="text-xl font-serif font-semibold mb-3">Skills</h2>

      <ul className="mb-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill} className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-sm rounded-full">
            <span className="text-slate-800">{skill}</span>
            {isOwner && (
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-700 hover:text-slate-900 font-medium"
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
