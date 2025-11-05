"use client";

import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Briefcase,
  LogOut,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface StudentDashboardProps {
  params: { id: string };
}

const StudentDashboard = ({ params }: StudentDashboardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.id;

  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(
    searchParams.get("location") || "all"
  );
  const [mode, setMode] = useState(searchParams.get("mode") || "all");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [skills, setSkills] = useState(searchParams.get("skills") || "");
  const [minPay, setMinPay] = useState(searchParams.get("minStipend") || "");
  const [maxPay, setMaxPay] = useState(searchParams.get("maxStipend") || "");

  // 🔹 Fetch internships
  const fetchInternships = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (location !== "all") params.append("location", location);
      if (mode !== "all") params.append("mode", mode);
      if (type !== "all") params.append("type", type);
      if (category !== "all") params.append("category", category);
      if (skills) params.append("skills", skills);
      if (minPay) params.append("minStipend", minPay);
      if (maxPay) params.append("maxStipend", maxPay);

      const res = await fetch(`/api/auth/findInternship?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok) {
        setInternships(data);
        router.replace(`/student_dashboard/${userId}?${params.toString()}`);
      } else {
        setInternships([]);
        setMessage({
          type: "error",
          text: data.message || "No internships found.",
        });
      }
    } catch (err) {
      console.error("Error fetching internships:", err);
      setMessage({ type: "error", text: "Failed to fetch internships." });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Apply to internship
  const applyToInternship = async (internshipId: string) => {
    if (!userId) {
      setMessage({ type: "error", text: "You must be logged in to apply." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/auth/findInternship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId,
          userId,
          coverLetter: "Excited to apply for this opportunity!",
          resumeUrl: "https://example.com/resume.pdf",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Applied successfully!" });
      } else {
        setMessage({
          type: "error",
          text: data.message || data.error || "Failed to apply.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial fetch
  useEffect(() => {
    fetchInternships();
  }, []);

  // 🔹 Real-time updates when any filter changes (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchInternships();
    }, 500); // debounce 0.5s after user stops typing/changing

    return () => clearTimeout(delay);
  }, [search, location, mode, type, category, skills, minPay, maxPay]);

  // 🔹 Clear filters
  const clearFilters = () => {
    setSearch("");
    setLocation("all");
    setMode("all");
    setType("all");
    setCategory("all");
    setSkills("");
    setMinPay("");
    setMaxPay("");
    fetchInternships();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-2 rounded-xl">
              <Briefcase className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              Kairo Internships
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/student_dashboard/Profile_section")}
              className="relative"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-800 hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {message.text}
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Left Sidebar - Filters */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:w-1/4 bg-white rounded-2xl shadow-md border border-gray-200 p-6 sticky top-20 h-fit"
          >
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-800">
                Find Your Dream Internship
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="🔍 Search role or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 outline-none"
              />

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Types</option>
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">Onsite</option>
                <option value="HYBRID">Hybrid</option>
              </select>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Modes</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Categories</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="MARKETING">Marketing</option>
                <option value="DESIGN">Design</option>
                <option value="SALES">Sales</option>
              </select>

              <input
                type="text"
                placeholder="💡 Skills (e.g. React, Figma)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 outline-none"
              />

              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPay}
                  onChange={(e) => setMinPay(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-gray-900"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPay}
                  onChange={(e) => setMaxPay(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-600 text-sm">
                  {loading
                    ? "Loading internships..."
                    : `${internships.length} internship${
                        internships.length !== 1 ? "s" : ""
                      } found`}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.section>

          {/* Right Content - Internships */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-3/4 grid gap-6 md:grid-cols-2 lg:grid-cols-2"
          >
            {loading && (
              <div className="col-span-full text-center py-20">
                <Loader2 className="w-8 h-8 text-gray-500 mx-auto animate-spin mb-3" />
                <p className="text-gray-500">Fetching internships...</p>
              </div>
            )}

            {!loading &&
              internships.map((internship) => (
                <motion.div
                  key={internship.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all hover:shadow-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {internship.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {internship.company}
                  </p>

                  <div className="flex flex-wrap gap-3 text-gray-500 text-sm mb-5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {internship.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {internship.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {internship.type}
                    </span>
                    {internship.stipend && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> ₹{internship.stipend}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => applyToInternship(internship.id)}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Applying..." : "Apply Now"}
                  </button>
                </motion.div>
              ))}
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
