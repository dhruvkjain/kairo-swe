"use client"; // client-side component

import React, { useState, ChangeEvent } from "react";

// single experience structure
interface Experience {
  id: number;
  role: string;
  company: string;
  type: string;
  duration: string;
  location: string;
  description: string;
}

const ExperienceSection: React.FC = () => {
  // all experiences
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      role: "Rural Intern",
      company: "GHCL Foundation Trust",
      type: "Internship",
      duration: "Dec 2024 – Dec 2024 · 1 mo",
      location: "Sutrapada, Gir-Somnath, Gujarat, India · On-site",
      description:
        'Part of a 12-member DA-IICT team for the "Sustainable Rural Development" project. Conducted digital literacy workshops for village students.',
    },
  ]);

  // edit/add toggle
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // form input data
  const [formData, setFormData] = useState<Experience>({
    id: 0,
    role: "",
    company: "",
    type: "",
    duration: "",
    location: "",
    description: "",
  });

  // handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // add or update experience
  const handleSubmit = () => {
    if (isEditing) {
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === formData.id ? formData : exp))
      );
      setIsEditing(false);
    } else {
      setExperiences((prev) => [...prev, { ...formData, id: Date.now() }]);
    }

    // reset form
    setFormData({
      id: 0,
      role: "",
      company: "",
      type: "",
      duration: "",
      location: "",
      description: "",
    });
  };

  // edit handler
  const handleEdit = (exp: Experience) => {
    setFormData(exp);
    setIsEditing(true);
  };

  // delete handler
  const handleDelete = (id: number) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* add new button */}
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData({
              id: 0,
              role: "",
              company: "",
              type: "",
              duration: "",
              location: "",
              description: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Experience
        </button>
      </div>

      {/* form section */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          {isEditing ? "Edit Experience" : "Add New Experience"}
        </h2>

        {/* input fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={formData.type}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="border p-2 rounded-md w-full col-span-2"
          />
        </div>

        {/* textarea */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded-md w-full mt-4"
          rows={3}
        ></textarea>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {isEditing ? "Update Experience" : "Add Experience"}
        </button>
      </div>

      {/* list of experiences */}
      <div className="w-full max-w-2xl space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {exp.role}
                </h2>
                <p className="text-sm text-gray-600">
                  {exp.company} · {exp.type}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {exp.duration} <br />
                  {exp.location}
                </p>
              </div>

              {/* action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-red-600 hover:underline text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* description */}
            <p className="mt-3 text-gray-700 text-sm">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection; // export main component
