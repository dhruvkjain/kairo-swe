"use client";

import React, { useEffect, useState } from "react";

type ExperienceSectionProps = {
  userId: string; // The current applicant's userId
};

export default function ExperienceSection({ userId }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<string[]>([]);
  const [newExp, setNewExp] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    const res = await fetch(`/profile/experience?userId=${userId}`);
    const data = await res.json();
    setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, [userId]);

  const handleAddOrUpdate = async () => {
    if (!newExp.trim()) return;

    const method = editIndex !== null ? "PUT" : "POST";
    const body =
      editIndex !== null
        ? { userId, index: editIndex, experience: newExp }
        : { userId, experience: newExp };

    await fetch("/profile/experience", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setNewExp("");
    setEditIndex(null);
    fetchExperiences();
  };

  const handleDelete = async (index: number) => {
    await fetch("/profile/experience", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, index }),
    });
    fetchExperiences();
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setNewExp(experiences[index]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editIndex !== null ? "Edit Experience" : "Add New Experience"}
        </h2>

        <textarea
          value={newExp}
          onChange={(e) => setNewExp(e.target.value)}
          placeholder="Describe your experience..."
          className="w-full border rounded-md p-3 text-sm"
          rows={3}
        ></textarea>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAddOrUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
          <button
            onClick={() => {
              setEditIndex(null);
              setNewExp("");
            }}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : experiences.length === 0 ? (
          <p className="text-center text-gray-500">No experiences yet.</p>
        ) : (
          experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-4 mb-3 flex justify-between items-start"
            >
              <p className="text-sm text-gray-800 w-3/4">{exp}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
