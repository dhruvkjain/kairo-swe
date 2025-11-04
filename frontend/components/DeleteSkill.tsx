"use client";

import { useState } from "react";

export default function DeleteSkill({ userId, initialSkills = [] }: { userId: string; initialSkills?: string[] }) {
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
    <div className="p-4 border rounded-2xl shadow-sm max-w-md">
      <h2 className="text-xl font-semibold mb-3">Skills</h2>

      <ul className="mb-3 flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-sm rounded-full"
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
