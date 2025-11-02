"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Link2,
  Github,
  Linkedin,
  Globe,
  Edit2,
  Save,
  X,
  Upload,
  Calendar,
  Code,
  Star,
  FileText,
  ArrowLeft,
} from "lucide-react";

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    bio: "Passionate computer science student seeking opportunities in web development and AI/ML",
    education: {
      degree: "Bachelor of Technology",
      major: "Computer Science",
      university: "Indian Institute of Technology",
      year: "2022 - 2026",
      cgpa: "8.5",
    },
    skills: ["React", "JavaScript", "Python", "Node.js", "Machine Learning", "MongoDB"],
    experience: [
      {
        title: "Frontend Developer Intern",
        company: "Tech Startup",
        duration: "Jun 2024 - Aug 2024",
        description: "Developed responsive web applications using React and TypeScript",
      },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Full-stack web application with payment integration",
        technologies: ["React", "Node.js", "MongoDB"],
      },
    ],
    links: {
      github: "github.com/johndoe",
      linkedin: "linkedin.com/in/johndoe",
      portfolio: "johndoe.dev",
    },
  });

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleNestedInputChange = (parent, field, value) => {
    setProfileData({
      ...profileData,
      [parent]: { ...profileData[parent], [field]: value },
    });
  };

  const addSkill = () => {
    const newSkill = prompt("Enter a new skill:");
    if (newSkill) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill],
      });
    }
  };

  const removeSkill = (index) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Kairo</h1>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isEditing
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span className="text-sm font-medium">Save Changes</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-4">
              <div className="relative group">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-3xl font-bold text-gray-900 w-full border-b-2 border-gray-300 focus:border-gray-900 outline-none pb-1"
                />
              ) : (
                <h2 className="text-3xl font-bold text-gray-900">{profileData.name}</h2>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-b border-gray-300 focus:border-gray-900 outline-none"
                    />
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-b border-gray-300 focus:border-gray-900 outline-none"
                    />
                  ) : (
                    <span>{profileData.phone}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="border-b border-gray-300 focus:border-gray-900 outline-none"
                    />
                  ) : (
                    <span>{profileData.location}</span>
                  )}
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  rows="3"
                />
              ) : (
                <p className="text-gray-700">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Education */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <div className="space-y-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={profileData.education.degree}
                      onChange={(e) =>
                        handleNestedInputChange("education", "degree", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Major"
                      value={profileData.education.major}
                      onChange={(e) =>
                        handleNestedInputChange("education", "major", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="University"
                      value={profileData.education.university}
                      onChange={(e) =>
                        handleNestedInputChange("education", "university", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Year"
                        value={profileData.education.year}
                        onChange={(e) =>
                          handleNestedInputChange("education", "year", e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="CGPA"
                        value={profileData.education.cgpa}
                        onChange={(e) =>
                          handleNestedInputChange("education", "cgpa", e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-semibold text-gray-900">
                      {profileData.education.degree} - {profileData.education.major}
                    </h4>
                    <p className="text-gray-600">{profileData.education.university}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{profileData.education.year}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>CGPA: {profileData.education.cgpa}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold">Experience</h3>
              </div>
              {profileData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4 last:pb-0">
                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                  <p className="text-gray-600 text-sm">{exp.company}</p>
                  <p className="text-gray-500 text-xs mb-2">{exp.duration}</p>
                  <p className="text-gray-700 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold">Projects</h3>
              </div>
              {profileData.projects.map((project, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-gray-900" />
                  <h3 className="text-xl font-semibold">Skills</h3>
                </div>
                {isEditing && (
                  <button
                    onClick={addSkill}
                    className="text-xs px-2 py-1 bg-gray-900 text-white rounded hover:bg-gray-800"
                  >
                    + Add
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Link2 className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold">Links</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4 text-gray-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.links.github}
                      onChange={(e) =>
                        handleNestedInputChange("links", "github", e.target.value)
                      }
                      className="flex-1 text-sm border-b border-gray-300 focus:border-gray-900 outline-none"
                    />
                  ) : (
                    <a
                      href={`https://${profileData.links.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {profileData.links.github}
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-4 h-4 text-gray-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.links.linkedin}
                      onChange={(e) =>
                        handleNestedInputChange("links", "linkedin", e.target.value)
                      }
                      className="flex-1 text-sm border-b border-gray-300 focus:border-gray-900 outline-none"
                    />
                  ) : (
                    <a
                      href={`https://${profileData.links.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {profileData.links.linkedin}
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.links.portfolio}
                      onChange={(e) =>
                        handleNestedInputChange("links", "portfolio", e.target.value)
                      }
                      className="flex-1 text-sm border-b border-gray-300 focus:border-gray-900 outline-none"
                    />
                  ) : (
                    <a
                      href={`https://${profileData.links.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {profileData.links.portfolio}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold">Resume</h3>
              </div>
              <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Resume</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSection;
