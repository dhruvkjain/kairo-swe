"use client";

import React, { useState, useRef } from "react";
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
  X,
  Upload,
  Calendar,
  Code,
  Star,
  FileText,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
} from "lucide-react";

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=John");
  const [resumeFile, setResumeFile] = useState(null);
  const profileImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    bio: "Passionate computer science student seeking opportunities in web development and AI/ML",
    education: [
      {
        id: 1,
        degree: "Bachelor of Technology",
        major: "Computer Science",
        university: "Indian Institute of Technology",
        year: "2022 - 2026",
        cgpa: "8.5",
      },
    ],
    skills: ["React", "JavaScript", "Python", "Node.js", "Machine Learning", "MongoDB"],
    experience: [
      {
        id: 1,
        title: "Frontend Developer Intern",
        company: "Tech Startup",
        duration: "Jun 2024 - Aug 2024",
        description: "Developed responsive web applications using React and TypeScript",
      },
    ],
    projects: [
      {
        id: 1,
        name: "E-commerce Platform",
        description: "Full-stack web application with payment integration",
        technologies: ["React", "Node.js", "MongoDB"],
        link: "",
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

  // Education handlers
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "",
      major: "",
      university: "",
      year: "",
      cgpa: "",
    };
    setProfileData({
      ...profileData,
      education: [...profileData.education, newEducation],
    });
  };

  const updateEducation = (id, field, value) => {
    setProfileData({
      ...profileData,
      education: profileData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id) => {
    setProfileData({
      ...profileData,
      education: profileData.education.filter((edu) => edu.id !== id),
    });
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: "",
      company: "",
      duration: "",
      description: "",
    };
    setProfileData({
      ...profileData,
      experience: [...profileData.experience, newExperience],
    });
  };

  const updateExperience = (id, field, value) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.filter((exp) => exp.id !== id),
    });
  };

  // Project handlers
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: "",
      description: "",
      technologies: [],
      link: "",
    };
    setProfileData({
      ...profileData,
      projects: [...profileData.projects, newProject],
    });
  };

  const updateProject = (id, field, value) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const removeProject = (id) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.filter((proj) => proj.id !== id),
    });
  };

  const addProjectTech = (projectId) => {
    const tech = prompt("Enter technology name:");
    if (tech) {
      setProfileData({
        ...profileData,
        projects: profileData.projects.map((proj) =>
          proj.id === projectId
            ? { ...proj, technologies: [...proj.technologies, tech] }
            : proj
        ),
      });
    }
  };

  const removeProjectTech = (projectId, techIndex) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.map((proj) =>
        proj.id === projectId
          ? {
              ...proj,
              technologies: proj.technologies.filter((_, i) => i !== techIndex),
            }
          : proj
      ),
    });
  };

  // Skill handlers
  const addSkill = () => {
    const newSkill = prompt("Enter a new skill:");
    if (newSkill && newSkill.trim()) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
    }
  };

  const removeSkill = (index) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((_, i) => i !== index),
    });
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Resume upload handler
  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log("Saving profile data:", profileData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hidden file inputs */}
      <input
        ref={profileImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={resumeInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleResumeUpload}
        className="hidden"
      />

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
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Kairo</h1>
              </div>
            </div>

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isEditing
                  ? "bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4" />
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-4">
              <div className="relative group">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() => profileImageInputRef.current?.click()}
                    className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-lg hover:scale-110"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
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
                  className="text-3xl font-bold text-gray-900 w-full border-b-2 border-gray-300 focus:border-gray-900 outline-none pb-1 transition-colors"
                  placeholder="Your Name"
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
                      className="border-b border-gray-300 focus:border-gray-900 outline-none transition-colors"
                      placeholder="email@example.com"
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
                      className="border-b border-gray-300 focus:border-gray-900 outline-none transition-colors"
                      placeholder="+91 98765 43210"
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
                      className="border-b border-gray-300 focus:border-gray-900 outline-none transition-colors"
                      placeholder="City, Country"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Education */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-gray-900" />
                  <h3 className="text-xl font-semibold">Education</h3>
                </div>
                {isEditing && (
                  <button
                    onClick={addEducation}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="relative border-l-2 border-gray-200 pl-4 pb-4 last:pb-0"
                  >
                    {isEditing && profileData.education.length > 1 && (
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="absolute -left-2 top-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(edu.id, "degree", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Major / Field of Study"
                          value={edu.major}
                          onChange={(e) =>
                            updateEducation(edu.id, "major", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="University / Institution"
                          value={edu.university}
                          onChange={(e) =>
                            updateEducation(edu.id, "university", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Year (e.g., 2022-2026)"
                            value={edu.year}
                            onChange={(e) =>
                              updateEducation(edu.id, "year", e.target.value)
                            }
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="CGPA / Percentage"
                            value={edu.cgpa}
                            onChange={(e) =>
                              updateEducation(edu.id, "cgpa", e.target.value)
                            }
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900">
                          {edu.degree} - {edu.major}
                        </h4>
                        <p className="text-gray-600">{edu.university}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{edu.year}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>CGPA: {edu.cgpa}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-gray-900" />
                  <h3 className="text-xl font-semibold">Experience</h3>
                </div>
                {isEditing && (
                  <button
                    onClick={addExperience}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profileData.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative border-l-2 border-gray-200 pl-4 pb-4 last:pb-0"
                  >
                    {isEditing && (
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="absolute -left-2 top-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) =>
                            updateExperience(exp.id, "title", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, "company", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., Jun 2024 - Aug 2024)"
                          value={exp.duration}
                          onChange={(e) =>
                            updateExperience(exp.id, "duration", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                        <textarea
                          placeholder="Description of your role and achievements"
                          value={exp.description}
                          onChange={(e) =>
                            updateExperience(exp.id, "description", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                          rows="3"
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-xs mb-2">{exp.duration}</p>
                        <p className="text-gray-700 text-sm">{exp.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-gray-900" />
                  <h3 className="text-xl font-semibold">Projects</h3>
                </div>
                {isEditing && (
                  <button
                    onClick={addProject}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profileData.projects.map((project) => (
                  <div
                    key={project.id}
                    className="relative p-4 border border-gray-200 rounded-lg"
                  >
                    {isEditing && (
                      <button
                        onClick={() => removeProject(project.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Project Name"
                          value={project.name}
                          onChange={(e) =>
                            updateProject(project.id, "name", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                        <textarea
                          placeholder="Project Description"
                          value={project.description}
                          onChange={(e) =>
                            updateProject(project.id, "description", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                          rows="2"
                        />
                        <input
                          type="text"
                          placeholder="Project Link (optional)"
                          value={project.link}
                          onChange={(e) =>
                            updateProject(project.id, "link", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                              Technologies
                            </label>
                            <button
                              onClick={() => addProjectTech(project.id)}
                              className="text-xs px-2 py-1 bg-gray-900 text-white rounded hover:bg-gray-800"
                            >
                              + Add Tech
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center space-x-1"
                              >
                                <span>{tech}</span>
                                <button
                                  onClick={() => removeProjectTech(project.id, i)}
                                  className="hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {project.name}
                        </h4>
                        <p className="text-gray-700 text-sm mb-2">
                          {project.description}
                        </p>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mb-2 inline-block"
                          >
                            View Project →
                          </a>
                        )}
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
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
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
                    className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-full text-sm font-medium flex items-center space-x-1"
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
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
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
                      className="flex-1 text-sm p-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 outline-none"
                      placeholder="github.com/username"
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
                      className="flex-1 text-sm p-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 outline-none"
                      placeholder="linkedin.com/in/username"
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
                      className="flex-1 text-sm p-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 outline-none"
                      placeholder="yourportfolio.com"
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
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-semibold">Resume</h3>
              </div>
              {resumeFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 truncate">
                        {resumeFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setResumeFile(null)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Replace Resume</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload Resume</span>
                </button>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSection;