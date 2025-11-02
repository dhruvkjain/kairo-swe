"use client";

import React, { useState, useRef } from "react";
import {
  Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Link2, Github,
  Linkedin, Globe, Edit2, X, Upload, Calendar, Code, Star, FileText,
  ArrowLeft, Plus, Trash2, Check,
} from "lucide-react";

const ProfileSection = () => {
  const countryCodes = [
    { code: "+1", country: "US/CA" }, { code: "+7", country: "RU" }, { code: "+20", country: "EG" },
    { code: "+27", country: "ZA" }, { code: "+30", country: "GR" }, { code: "+31", country: "NL" },
    { code: "+32", country: "BE" }, { code: "+33", country: "FR" }, { code: "+34", country: "ES" },
    { code: "+36", country: "HU" }, { code: "+39", country: "IT" }, { code: "+40", country: "RO" },
    { code: "+41", country: "CH" }, { code: "+43", country: "AT" }, { code: "+44", country: "UK" },
    { code: "+45", country: "DK" }, { code: "+46", country: "SE" }, { code: "+47", country: "NO" },
    { code: "+48", country: "PL" }, { code: "+49", country: "DE" }, { code: "+51", country: "PE" },
    { code: "+52", country: "MX" }, { code: "+53", country: "CU" }, { code: "+54", country: "AR" },
    { code: "+55", country: "BR" }, { code: "+56", country: "CL" }, { code: "+57", country: "CO" },
    { code: "+58", country: "VE" }, { code: "+60", country: "MY" }, { code: "+61", country: "AU" },
    { code: "+62", country: "ID" }, { code: "+63", country: "PH" }, { code: "+64", country: "NZ" },
    { code: "+65", country: "SG" }, { code: "+66", country: "TH" }, { code: "+81", country: "JP" },
    { code: "+82", country: "KR" }, { code: "+84", country: "VN" }, { code: "+86", country: "CN" },
    { code: "+90", country: "TR" }, { code: "+91", country: "IN" }, { code: "+92", country: "PK" },
    { code: "+93", country: "AF" }, { code: "+94", country: "LK" }, { code: "+95", country: "MM" },
    { code: "+98", country: "IR" }, { code: "+212", country: "MA" }, { code: "+213", country: "DZ" },
    { code: "+216", country: "TN" }, { code: "+218", country: "LY" }, { code: "+220", country: "GM" },
    { code: "+221", country: "SN" }, { code: "+234", country: "NG" }, { code: "+254", country: "KE" },
    { code: "+255", country: "TZ" }, { code: "+256", country: "UG" }, { code: "+351", country: "PT" },
    { code: "+353", country: "IE" }, { code: "+354", country: "IS" }, { code: "+356", country: "MT" },
    { code: "+358", country: "FI" }, { code: "+370", country: "LT" }, { code: "+371", country: "LV" },
    { code: "+372", country: "EE" }, { code: "+374", country: "AM" }, { code: "+380", country: "UA" },
    { code: "+381", country: "RS" }, { code: "+420", country: "CZ" }, { code: "+421", country: "SK" },
    { code: "+880", country: "BD" }, { code: "+886", country: "TW" }, { code: "+960", country: "MV" },
    { code: "+961", country: "LB" }, { code: "+962", country: "JO" }, { code: "+963", country: "SY" },
    { code: "+964", country: "IQ" }, { code: "+965", country: "KW" }, { code: "+966", country: "SA" },
    { code: "+967", country: "YE" }, { code: "+968", country: "OM" }, { code: "+971", country: "AE" },
    { code: "+972", country: "IL" }, { code: "+973", country: "BH" }, { code: "+974", country: "QA" },
    { code: "+977", country: "NP" },
  ];

  const qualifications = ["PhD", "Post Graduation", "Graduation", "Intermediate (12th)", "High School (10th)"];

  const courses = [
    "B.Tech", "M.Tech", "B.E", "M.E", "BCA", "MCA", "BSc", "MSc",
    "BA", "MA", "B.Com", "M.Com", "BBA", "MBA", "B.Arch", "M.Arch",
    "MBBS", "MD", "BDS", "MDS", "B.Pharm", "M.Pharm", "LLB", "LLM",
    "B.Ed", "M.Ed", "Diploma", "Other"
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=John");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    countryCode: "+91",
    phone: "98765 43210",
    location: "Bangalore, India",
    bio: "Passionate computer science student seeking opportunities in web development and AI/ML",
    education: [{
      id: 1,
      qualification: "Graduation",
      course: "B.Tech",
      specialization: "Computer Science",
      university: "Indian Institute of Technology",
      startYear: "2022",
      endYear: "2026",
      gradeType: "cgpa", // or "percentage"
      cgpa: "8.5",
      percentage: "",
    }],
    skills: ["React", "JavaScript", "Python", "Node.js", "Machine Learning", "MongoDB"],
    experience: [{
      id: 1, title: "Frontend Developer Intern", company: "Tech Startup",
      duration: "Jun 2024 - Aug 2024",
      description: "Developed responsive web applications using React and TypeScript",
    }],
    projects: [{
      id: 1, name: "E-commerce Platform",
      description: "Full-stack web application with payment integration",
      technologies: ["React", "Node.js", "MongoDB"], link: "",
    }],
    links: { github: "github.com/johndoe", linkedin: "linkedin.com/in/johndoe", portfolio: "johndoe.dev" },
  });

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleNestedInputChange = (parent, field, value) => {
    setProfileData({ ...profileData, [parent]: { ...profileData[parent], [field]: value } });
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      qualification: "",
      course: "",
      specialization: "",
      university: "",
      startYear: "",
      endYear: "",
      gradeType: "cgpa",
      cgpa: "",
      percentage: "",
    };
    setProfileData({ ...profileData, education: [...profileData.education, newEducation] });
  };

  const updateEducation = (id, field, value) => {
    setProfileData({
      ...profileData,
      education: profileData.education.map((edu) => edu.id === id ? { ...edu, [field]: value } : edu),
    });
  };

  const removeEducation = (id) => {
    setProfileData({ ...profileData, education: profileData.education.filter((edu) => edu.id !== id) });
  };

  const addExperience = () => {
    const newExperience = { id: Date.now(), title: "", company: "", duration: "", description: "" };
    setProfileData({ ...profileData, experience: [...profileData.experience, newExperience] });
  };

  const updateExperience = (id, field, value) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.map((exp) => exp.id === id ? { ...exp, [field]: value } : exp),
    });
  };

  const removeExperience = (id) => {
    setProfileData({ ...profileData, experience: profileData.experience.filter((exp) => exp.id !== id) });
  };

  const addProject = () => {
    const newProject = { id: Date.now(), name: "", description: "", technologies: [], link: "" };
    setProfileData({ ...profileData, projects: [...profileData.projects, newProject] });
  };

  const updateProject = (id, field, value) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.map((proj) => proj.id === id ? { ...proj, [field]: value } : proj),
    });
  };

  const removeProject = (id) => {
    setProfileData({ ...profileData, projects: profileData.projects.filter((proj) => proj.id !== id) });
  };

  const addProjectTech = (projectId) => {
    const tech = prompt("Enter technology name:");
    if (tech) {
      setProfileData({
        ...profileData,
        projects: profileData.projects.map((proj) =>
          proj.id === projectId ? { ...proj, technologies: [...proj.technologies, tech] } : proj
        ),
      });
    }
  };

  const removeProjectTech = (projectId, techIndex) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.map((proj) =>
        proj.id === projectId ? { ...proj, technologies: proj.technologies.filter((_, i) => i !== techIndex) } : proj
      ),
    });
  };

  const addSkill = () => {
    const newSkill = prompt("Enter a new skill:");
    if (newSkill && newSkill.trim()) {
      setProfileData({ ...profileData, skills: [...profileData.skills, newSkill.trim()] });
    }
  };

  const removeSkill = (index) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter((_, i) => i !== index) });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => { setProfileImage(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => { setBackgroundImage(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) { setResumeFile(file); }
  };

  const extractResumeDetails = () => {
    if (!resumeFile) return;
    setIsExtracting(true);
    setTimeout(() => {
      const extractedData = {
        name: "Sarah Johnson", email: "sarah.johnson@email.com",
        countryCode: "+91", phone: "99887 76655", location: "Mumbai, India",
        bio: "Results-driven software engineer with 2+ years of experience in full-stack development",
        education: [{
          id: Date.now(),
          qualification: "Graduation",
          course: "B.E",
          specialization: "Information Technology",
          university: "Mumbai University",
          startYear: "2020",
          endYear: "2024",
          gradeType: "cgpa",
          cgpa: "9.2",
          percentage: "",
        }],
        skills: ["Java", "Spring Boot", "React", "PostgreSQL", "AWS", "Docker", "Git"],
        experience: [{
          id: Date.now() + 1, title: "Software Engineer Intern",
          company: "Tech Solutions Pvt Ltd", duration: "Jan 2024 - Jun 2024",
          description: "Built RESTful APIs and optimized database queries improving performance by 40%"
        }],
        projects: [{
          id: Date.now() + 2, name: "Task Management System",
          description: "Collaborative project management tool with real-time updates",
          technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
          link: "github.com/sarah/task-manager"
        }],
      };
      setProfileData(extractedData);
      setIsExtracting(false);
      alert("Resume details extracted successfully! Please review and edit as needed.");
    }, 2000);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving profile data:", profileData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <input ref={profileImageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      <input ref={backgroundImageInputRef} type="file" accept="image/*" onChange={handleBackgroundImageUpload} className="hidden" />
      <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />

      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Kairo</h1>
              </div>
            </div>
            <button onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isEditing ? "bg-gray-900 text-white hover:bg-gray-800" : "border border-gray-300 hover:bg-gray-50"}`}>
              {isEditing ? (<><Check className="w-4 h-4" /><span className="text-sm font-medium">Save</span></>) :
                (<><Edit2 className="w-4 h-4" /><span className="text-sm font-medium">Edit</span></>)}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-4">
          <div className="relative h-24 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900">
            {backgroundImage && <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />}
            {isEditing && (
              <button onClick={() => backgroundImageInputRef.current?.click()}
                className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg transition-all shadow-lg flex items-center space-x-1">
                <Upload className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Background</span>
              </button>
            )}
          </div>
          <div className="px-5 pb-4">
            <div className="flex items-end justify-between -mt-12 mb-3">
              <div className="relative group">
                <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                {isEditing && (
                  <button onClick={() => profileImageInputRef.current?.click()}
                    className="absolute bottom-1 right-1 p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-lg">
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="mb-3">
                <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
              </div>
            </div>

            <div className="space-y-2">
              {isEditing ? (
                <input type="text" value={profileData.name} onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-2xl font-bold text-gray-900 w-full border-b-2 border-gray-300 focus:border-gray-900 outline-none pb-1"
                  placeholder="Your Name" />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
              )}

              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-4 h-4" />
                  {isEditing ? (
                    <input type="email" value={profileData.email} onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-b border-gray-300 focus:border-gray-900 outline-none" placeholder="email@example.com" />
                  ) : (<span>{profileData.email}</span>)}
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-4 h-4" />
                  {isEditing ? (
                    <div className="flex items-center space-x-1">
                      <select value={profileData.countryCode} onChange={(e) => handleInputChange("countryCode", e.target.value)}
                        className="border-b border-gray-300 focus:border-gray-900 outline-none text-sm pr-1">
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>{item.code} {item.country}</option>
                        ))}
                      </select>
                      <input type="tel" value={profileData.phone} onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-b border-gray-300 focus:border-gray-900 outline-none" placeholder="98765 43210" />
                    </div>
                  ) : (<span>{profileData.countryCode} {profileData.phone}</span>)}
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input type="text" value={profileData.location} onChange={(e) => handleInputChange("location", e.target.value)}
                      className="border-b border-gray-300 focus:border-gray-900 outline-none" placeholder="City, Country" />
                  ) : (<span>{profileData.location}</span>)}
                </div>
              </div>

              {isEditing ? (
                <textarea value={profileData.bio} onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  rows="2" placeholder="Tell us about yourself..." />
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-gray-900" />
                  <h3 className="text-lg font-semibold">Education</h3>
                </div>
                {isEditing && (
                  <button onClick={addEducation}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs">
                    <Plus className="w-3.5 h-3.5" /><span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {profileData.education.map((edu) => (
                  <div key={edu.id} className="relative border-l-2 border-gray-200 pl-3 pb-3 last:pb-0">
                    {isEditing && profileData.education.length > 1 && (
                      <button onClick={() => removeEducation(edu.id)}
                        className="absolute -left-1.5 top-0 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {isEditing ? (
                      <div className="space-y-2">
                        <select value={edu.qualification}
                          onChange={(e) => updateEducation(edu.id, "qualification", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none">
                          <option value="">Select Qualification</option>
                          {qualifications.map((qual) => (
                            <option key={qual} value={qual}>{qual}</option>
                          ))}
                        </select>
                        <select value={edu.course}
                          onChange={(e) => updateEducation(edu.id, "course", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none">
                          <option value="">Select Course</option>
                          {courses.map((course) => (
                            <option key={course} value={course}>{course}</option>
                          ))}
                        </select>
                        <input type="text" placeholder="Specialization (Optional)" value={edu.specialization}
                          onChange={(e) => updateEducation(edu.id, "specialization", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                        <input type="text" placeholder="University/Institution" value={edu.university}
                          onChange={(e) => updateEducation(edu.id, "university", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" placeholder="Start Year" value={edu.startYear}
                            onChange={(e) => updateEducation(edu.id, "startYear", e.target.value)}
                            className="p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                          <input type="text" placeholder="End Year" value={edu.endYear}
                            onChange={(e) => updateEducation(edu.id, "endYear", e.target.value)}
                            className="p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <label className="flex items-center space-x-1 cursor-pointer">
                              <input type="radio" name={`gradeType-${edu.id}`} value="cgpa"
                                checked={edu.gradeType === "cgpa"}
                                onChange={(e) => updateEducation(edu.id, "gradeType", e.target.value)}
                                className="w-4 h-4" />
                              <span className="text-sm">CGPA</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                              <input type="radio" name={`gradeType-${edu.id}`} value="percentage"
                                checked={edu.gradeType === "percentage"}
                                onChange={(e) => updateEducation(edu.id, "gradeType", e.target.value)}
                                className="w-4 h-4" />
                              <span className="text-sm">Percentage</span>
                            </label>
                          </div>
                          {edu.gradeType === "cgpa" ? (
                            <input type="text" placeholder="CGPA" value={edu.cgpa}
                              onChange={(e) => updateEducation(edu.id, "cgpa", e.target.value)}
                              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                          ) : (
                            <input type="text" placeholder="Percentage" value={edu.percentage}
                              onChange={(e) => updateEducation(edu.id, "percentage", e.target.value)}
                              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {edu.qualification} - {edu.course}
                          {edu.specialization && ` (${edu.specialization})`}
                        </h4>
                        <p className="text-gray-600 text-sm">{edu.university}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{edu.startYear} - {edu.endYear}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3.5 h-3.5" />
                            <span>
                              {edu.gradeType === "cgpa" ? `CGPA: ${edu.cgpa}` : `${edu.percentage}%`}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-gray-900" />
                  <h3 className="text-lg font-semibold">Experience</h3>
                </div>
                {isEditing && (
                  <button onClick={addExperience}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs">
                    <Plus className="w-3.5 h-3.5" /><span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {profileData.experience.map((exp) => (
                  <div key={exp.id} className="relative border-l-2 border-gray-200 pl-3 pb-3 last:pb-0">
                    {isEditing && (
                      <button onClick={() => removeExperience(exp.id)}
                        className="absolute -left-1.5 top-0 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    {isEditing ? (
                      <div className="space-y-2">
                        <input type="text" placeholder="Job Title" value={exp.title}
                          onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                        <input type="text" placeholder="Company" value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                        <input type="text" placeholder="Duration" value={exp.duration}
                          onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                        <textarea placeholder="Description" value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" rows="2" />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900 text-sm">{exp.title}</h4>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-xs mb-1">{exp.duration}</p>
                        <p className="text-gray-700 text-sm">{exp.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-gray-900" />
                  <h3 className="text-lg font-semibold">Projects</h3>
                </div>
                {isEditing && (
                  <button onClick={addProject}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs">
                    <Plus className="w-3.5 h-3.5" /><span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {profileData.projects.map((project) => (
                  <div key={project.id} className="relative p-3 border border-gray-200 rounded-lg">
                    {isEditing && (
                      <button onClick={() => removeProject(project.id)}
                        className="absolute top-2 right-2 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    {isEditing ? (
                      <div className="space-y-2">
                        <input type="text" placeholder="Project Name" value={project.name}
                          onChange={(e) => updateProject(project.id, "name", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                        <textarea placeholder="Description" value={project.description}
                          onChange={(e) => updateProject(project.id, "description", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" rows="2" />
                        <input type="text" placeholder="Link (optional)" value={project.link}
                          onChange={(e) => updateProject(project.id, "link", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-gray-700">Technologies</label>
                            <button onClick={() => addProjectTech(project.id)}
                              className="text-xs px-2 py-0.5 bg-gray-900 text-white rounded hover:bg-gray-800">+ Add</button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded flex items-center space-x-1">
                                <span>{tech}</span>
                                <button onClick={() => removeProjectTech(project.id, i)} className="hover:text-red-600">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{project.name}</h4>
                        <p className="text-gray-700 text-sm mb-1">{project.description}</p>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mb-1 inline-block">View Project →</a>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{tech}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-gray-900" />
                <h3 className="text-lg font-semibold">Resume</h3>
              </div>
              {resumeFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700 truncate">{resumeFile.name}</span>
                    </div>
                    <button onClick={() => setResumeFile(null)} className="p-1 hover:bg-gray-200 rounded">
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={extractResumeDetails} disabled={isExtracting}
                      className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:bg-gray-400">
                      {isExtracting ? "Extracting..." : "Extract Details"}
                    </button>
                    <button onClick={() => resumeInputRef.current?.click()}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => resumeInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload Resume</span>
                </button>
              )}
              <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX supported</p>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-gray-900" />
                  <h3 className="text-lg font-semibold">Skills</h3>
                </div>
                {isEditing && (
                  <button onClick={addSkill} className="text-xs px-2 py-0.5 bg-gray-900 text-white rounded hover:bg-gray-800">
                    + Add
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profileData.skills.map((skill, index) => (
                  <span key={index}
                    className="px-2.5 py-1 bg-gray-100 text-gray-900 rounded-full text-xs font-medium flex items-center space-x-1">
                    <span>{skill}</span>
                    {isEditing && (
                      <button onClick={() => removeSkill(index)} className="ml-0.5 hover:text-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Link2 className="w-5 h-5 text-gray-900" />
                <h3 className="text-lg font-semibold">Links</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4 text-gray-600" />
                  {isEditing ? (
                    <input type="text" value={profileData.links.github}
                      onChange={(e) => handleNestedInputChange("links", "github", e.target.value)}
                      className="flex-1 text-sm p-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 outline-none"
                      placeholder="github.com/username" />
                  ) : (
                    <a href={`https://${profileData.links.github}`} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 hover:underline">{profileData.links.github}</a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-4 h-4 text-gray-600" />
                  {isEditing ? (
                    <input type="text" value={profileData.links.linkedin}
                      onChange={(e) => handleNestedInputChange("links", "linkedin", e.target.value)}
                      className="flex-1 text-sm p-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 outline-none"
                      placeholder="linkedin.com/in/username" />
                  ) : (
                    <a href={`https://${profileData.links.linkedin}`} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 hover:underline">{profileData.links.linkedin}</a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  {isEditing ? (
                    <input type="text" value={profileData.links.portfolio}
                      onChange={(e) => handleNestedInputChange("links", "portfolio", e.target.value)}
                      className="flex-1 text-sm p-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 outline-none"
                      placeholder="yourportfolio.com" />
                  ) : (
                    <a href={`https://${profileData.links.portfolio}`} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 hover:underline">{profileData.links.portfolio}</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSection;