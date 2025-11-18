"use client";

import React, { useEffect, useState } from "react";
import Recruiter_PostInternshipModel from "./Recruiter_PostInternshipModel";
import UpdateInternshipModal from "./UpdateInternship";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Search,
  Plus,
  Filter,
  Download,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  DollarSign,
  X,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  User,
  Building2,
  GraduationCap,
  Award,
} from "lucide-react";

// new imports for charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import type { InternshipApplication } from "@prisma/client";
import InterviewSchedule from "./internview";
 import * as XLSX from "xlsx";

const RecruiterDashboard = (id: { id: string }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [Delete, setDelete] = useState(false);
  const [filteredApplicants, setFilteredApplicants] = useState<
    InternshipApplication[]
  >([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [stagesData, setStagesData] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [showinterviewModal, setShowInterviewModal] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [internshipFilter, setInternshipFilter] =
    useState<string>("All Category");
  const [applicants, setApplicants] = useState<InternshipApplication[]>([]);

  const recruiterId: string = id.id;

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res1 = await fetch(
          `/api/auth/recruiter/internshipData?recruiterId=${recruiterId}`
        );
        const data1 = await res1.json();
        setStats(data1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [recruiterId]);

  useEffect(() => {
    if (!recruiterId) return; // Do nothing if no applicantId

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/auth/recruiter/interviewSchedule?recruiterId=${recruiterId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch");
        }
        const result = await response.json();
        setInterviews(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [recruiterId]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/auth/recruiter/analytics`);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setMonthlyStats(data);
      } else {
        console.error("Failed to fetch monthly stats");
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/auth/recruiter/hiringFunnel`);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setStagesData(data);
      } else {
        console.error("Failed to fetch monthly stats");
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!recruiterId) return;

    const loadInternships = async () => {
      try {
        const response = await fetch(
          `/api/auth/recruiter/myInternship?recruiterId=${recruiterId}`
        );
        if (!response.ok) {
          console.error("Fetch error:", await response.text());
          return;
        }
        const internshipsData = await response.json();
        setInternships(internshipsData);
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    loadInternships();
  }, [recruiterId]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(
          `/api/auth/recruiter/recentApplicant?recruiterId=${recruiterId}`
        );
        const data = await res.json();
        setApplicants(data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, [recruiterId]);

  useEffect(() => {
    if (!selectedInternship) {
      setFilteredApplicants([]);
      return;
    }
    let apps = applicants;

    if (selectedInternship) {
      apps = apps.filter(
        (applicant) => applicant.internshipId === selectedInternship
      );
    }

    if (statusFilter !== "All Status") {
      apps = apps.filter((applicant) => applicant.status === statusFilter);
    }

    setFilteredApplicants(apps);
  }, [applicants, selectedInternship, statusFilter]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>No data found</p>;

  const cards = [
    {
      label: "Active Internships",
      ...stats.activeInternships,
      icon: Briefcase,
    },
    { label: "Total Applicants", ...stats.totalApplicants, icon: Users },
    {
      label: "Accepted Applicants",
      ...stats.acceptedApplicants,
      icon: CheckCircle,
    },
    {
      label: "Rejected Applicants",
      ...stats.rejectedApplicants,
      icon: XCircle,
    },
  ];

  const deleteHandle = async (id: String) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/auth/uploadInternship?internshipId=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Deleted Successfully!");
      setDelete(false);
      // If needed, refresh page or data
      // router.refresh();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const filteredInternships = internships.filter(
    (internship) =>
      internshipFilter === "All Category" ||
      internship.category === internshipFilter 
  );

  const exportData = filteredInternships.map((i) => ({
    Internship: i.title,
    Category: i.category,
    Location: i.location,
    Stipend: i.stipend,
    Applicants: `${i.applicationsCount} applied`,
    Status: i.status,
  }));

  const handleExport = () => {
  // Create worksheet data (header + rows)
  const worksheetData = [
    ["Internship", "Category", "Location", "Stipend", "Applicants", "Status"], // header
    ...exportData.map((item) => [
      item.Internship,
      item.Category,
      item.Location,
      item.Stipend,
      item.Applicants,
      item.Status,
    ]),
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto column width
  const columnWidths = worksheetData[0].map((_, colIndex) => ({
    wch: Math.max(
      ...worksheetData.map((row) =>
        row[colIndex] ? row[colIndex].toString().length : 10
      )
    ),
  }));
  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Internships");

  // Save file
  XLSX.writeFile(workbook, `${internshipFilter}_internships.xlsx`);
};


  const filteredApplicant = applicants.filter(
  (applicant) =>
    statusFilter === "All Status" ||
    applicant.status === statusFilter
);

const exportApplicant = filteredApplicant.map((i) => ({
  name: i.resumeData.name || "",
  email: i.resumeData.email || "",
  status: i.status || "",      // normalized
  cgpa: i.resumeData.cgpa || "",
  university: i.resumeData.university || "",
  appliedDate: i.resumeData.appliedDate || ""  // NEW FIELD
}));

const handleApplicantExport = () => {
  // Create worksheet data (header + rows)
  const worksheetData = [
    ["Name", "Email", "Status", "CGPA", "University", "Applied Date"], // header
    ...exportApplicant.map((item) => [
      item.name,
      item.email,
      item.status,
      item.cgpa,
      item.university,
      item.appliedDate,
    ]),
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

  // File name (same as PDF logic)
  const internshipName =
    internships.find((i) => i.id === selectedInternship)?.title ||
    "Internship";

  // Export to .xlsx
  XLSX.writeFile(workbook, `${internshipName}_applicants.xlsx`);
};


  const updateStatus = async (id: string, status: string) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/auth/recruiter/applicant`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId: id, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert(`${status} Successfully`);
      // Optionally refresh data or UI here
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const uniqueCategories = internships
    .filter(
      (internship, index, self) =>
        index === self.findIndex((i) => i.category === internship.category)
    )
    .map((i) => i.category);
  // Demographics & hires-from-kairo calculations
  const genderCounts = applicants.reduce((acc, a) => {
    const g = (a.gender || "other").toLowerCase();
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalApplicants = applicants.length;
  const genderPieData = [
    { name: "Male", value: genderCounts.male || 0 },
    { name: "Female", value: genderCounts.female || 0 },
    { name: "Other", value: genderCounts.other || 0 },
  ];

  // Analytics view component
  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="text-sm text-gray-600">
          Overview of key recruiting metrics
        </div>
      </div>

      {/* Demographics + hires-from-kairo summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700">
            Applicants by Gender
          </h4>
          <div className="mt-3 flex items-center gap-4">
            <div style={{ width: 120, height: 120 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={genderPieData}
                    dataKey="value"
                    innerRadius={32}
                    outerRadius={48}
                  >
                    {genderPieData.map((entry, idx) => (
                      <Cell
                        key={`g-${idx}`}
                        fill={["#60a5fa", "#f472b6", "#a78bfa"][idx % 3]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              {genderPieData.map((g) => {
                const pct = totalApplicants
                  ? Math.round((g.value / totalApplicants) * 100)
                  : 0;
                return (
                  <div key={g.name} className="text-sm text-gray-700">
                    <span className="font-semibold">{g.name}:</span> {g.value} (
                    {pct}%)
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700">Gender Ratio</h4>
          <div className="mt-3">
            {genderPieData.map((g, idx) => {
              const pct = totalApplicants
                ? Math.round((g.value / totalApplicants) * 100)
                : 0;
              return (
                <div key={g.name} className="mb-3">
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                    <span>{g.name}</span>
                    <span className="font-semibold">
                      {g.value} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full`}
                      style={{
                        width: `${pct}%`,
                        background: ["#60a5fa", "#f472b6", "#a78bfa"][idx % 3],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols gap-6">
        {/* Line chart: Applications vs Hired */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Applications vs Hires (Monthly)
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={monthlyStats}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#6b8cff"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="shortlisted"
                  stroke="#6ee7b7"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="hired"
                  stroke="#10b981"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: Source of hires */}
      </div>

      {/* Bar chart: Funnel / Stages (full width) */}
      <div className="col-span-1 lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Hiring Funnel (counts)
        </h3>
        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer>
            <BarChart
              data={stagesData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#6b8cff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kairo</h1>
            <p className="text-xs text-gray-500">Recruiter Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "internships", label: "Internships", icon: Briefcase },
          { id: "interviews", label: "Interviews", icon: Calendar },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Tech Corp Inc.
            </p>
            <p className="text-xs text-gray-500 truncate">
              recruiter@techcorp.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const TopBar = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-3 ml-64 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search internships, applicants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-4">
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Post Internship</span>
          </button>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-lg ${
                  stat.trend === "up" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <stat.icon
                  className={`w-5 h-5 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Applicants
          </h3>

          <div className="space-y-3">
            {applicants.slice(0, 3).map((applicant) => {
              const resume = applicant.resumeData || {};

              return (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedApplicant(applicant)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {resume.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {resume.appliedFor}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      applicant.status === "Shortlisted"
                        ? "bg-blue-100 text-blue-700"
                        : applicant.status === "Interview"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {applicant.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active Internships
          </h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Active Internships
              </h3>

              <div className="space-y-3">
                {internships.map((internship) => (
                  <div
                    key={internship.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {internship.title}
                      </h4>

                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {internship.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{internship.applicationsCount} applicants</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InternshipsView = () => (
    <div className="grid grid-cols-2 gap-4">
      {/* LEFT SIDE — INTERNSHIPS TABLE */}
      <div className="space-y-4 col-span-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Internships
          </h2>

          <div className="flex items-center space-x-2">
            <select
              value={internshipFilter}
              onChange={(e) => setInternshipFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value={"All Category"}>All Category</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span onClick={handleExport} className="text-sm">
                Export
              </span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Internship
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Stipend
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Applicants
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {internships
                .filter((internship) => {
                  if (internshipFilter === "All Category") {
                    return true;
                  }
                  return internship.category === internshipFilter;
                })
                .map((internship) => (
                  <tr
                    key={internship.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedInternship(internship.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">
                        {internship.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {internship.duration} • {internship.type}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{internship.location}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{internship.stipend}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {internship.applicants}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({internship.applicationsCount} applied)
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          internship.status === "DRAFT"
                            ? "bg-green-100 text-green-700"
                            : internship.status === "Paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {internship.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(internship.id);
                            setOpenUpdate(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 className="w-5 h-5 text-blue-600" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHandle(internship.id);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDE — APPLICANTS */}
      <div className="col-span-1 bg-white border border-gray-200 rounded-lg p-4 h-full overflow-y-auto">
        {selectedInternship ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Applicants for{" "}
                {internships.find((i) => i.id === selectedInternship)?.title ||
                  "Internship"}
              </h3>

              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option>All Status</option>
                  <option>Applied</option>
                  <option>Shortlisted</option>
                  <option>Interview</option>
                  <option>Hire</option>
                  <option>Reject</option>
                </select>

                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  <span 
                  onClick={handleApplicantExport}
                  className="text-sm">Export</span>
                </button>
              </div>
            </div>

            {filteredApplicants.length === 0 ? (
              <p className="text-gray-600 text-sm">No applicants found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredApplicants.map((applicant) => {
                  const data = applicant.resumeData || {};

                  return (
                    <div
                      key={applicant.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      <div className="flex items-start justify-between">
                        {/* Left Section */}
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Name + Status */}
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {data.name}
                              </h3>

                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  data.status === "Shortlisted"
                                    ? "bg-blue-100 text-blue-700"
                                    : data.status === "Interview"
                                    ? "bg-purple-100 text-purple-700"
                                    : data.status === "Applied"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {applicant.status}
                              </span>
                            </div>

                            {/* Applied For */}
                            <p className="text-sm text-gray-600 mb-2">
                              {data.appliedFor}
                            </p>

                            {/* College, CGPA, Email, Date */}
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                                <GraduationCap className="w-3.5 h-3.5" />
                                <span>{data.college}</span>
                              </div>

                              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                                <Award className="w-3.5 h-3.5" />
                                <span>CGPA: {data.cgpa}</span>
                              </div>

                              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="truncate">{data.email}</span>
                              </div>

                              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Applied {data.appliedDate || "N/A"}</span>
                              </div>
                            </div>

                            {/* Skills Badges */}
                            <div className="flex flex-wrap gap-1.5">
                              {data.skills?.slice(0, 4).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              ))}

                              {data.skills?.length > 4 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                  +{data.skills.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Buttons */}
                        <div className="flex flex-col space-y-2 ml-4">
                          <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800">
                            View Profile
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(data.resumeUrl, "_blank");
                            }}
                            className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50"
                          >
                            Download Resume
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-sm flex items-center justify-center h-full">
            Select an internship to view applicants
          </div>
        )}
      </div>
    </div>
  );

  const ApplicantModal = ({ applicant, onClose }) => {
    if (!applicant) return null;

    // Extract resumeData safely
    const data = applicant.resumeData || {};

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Applicant Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Summary */}
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-gray-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {data.name}
                </h3>

                <p className="text-gray-600 mb-2">
                  {data.course} • {data.year}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center space-x-1 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{data.college}</span>
                  </span>

                  <span className="flex items-center space-x-1 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>CGPA: {data.cgpa}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  {data.email && (
                    <a
                      href={`mailto:${data.email}`}
                      className="flex items-center space-x-1 text-blue-600 hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{data.email}</span>
                    </a>
                  )}

                  {data.phone && (
                    <a
                      href={`tel:${data.phone}`}
                      className="flex items-center space-x-1 text-blue-600 hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{data.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Applied For Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Applied For</h4>
              <p className="text-gray-700">{data.appliedFor}</p>
              <p className="text-sm text-gray-500 mt-1">
                Applied on {data.appliedDate || "Not Provided"}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
              <p className="text-gray-700">{data.experience}</p>
            </div>

            {/* Status */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Current Status
              </h4>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  data.status === "Shortlisted"
                    ? "bg-blue-100 text-blue-700"
                    : data.status === "Interview"
                    ? "bg-purple-100 text-purple-700"
                    : data.status === "Applied"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {applicant.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
              <button
                onClick={(e) => {
                  updateStatus(applicant.id, "Shortlisted");
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Shortlist</span>
              </button>

              <button
                onClick={() => {
                  setShowInterviewModal(true);
                  setSchedule(applicant.id);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Interview</span>
              </button>

              <button
                onClick={(e) => {
                  updateStatus(applicant.id, "Hire");
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Hire</span>
              </button>

              <button
                onClick={(e) => {
                  updateStatus(applicant.id, "Reject");
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>

            {/* Resume Download */}
            <button
              onClick={() => window.open(data.resumeUrl, "_blank")}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Download Resume</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <TopBar />
        <main className="p-6">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "internships" && <InternshipsView />}
          {activeTab === "interviews" && (
            <div className="overflow-x-auto bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Interviews
              </h3>
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {interviews.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.resumeData.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.interviewMode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.interviewLocation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.interviewDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.interviewTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={(e) => {
                            updateStatus(item.id, "Hire");
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Hire
                        </button>
                        <button
                          onClick={(e) => {
                            updateStatus(item.id, "Reject");
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "analytics" && <AnalyticsView />}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Company Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Tech Corp Inc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      defaultValue="recruiter@techcorp.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Website
                    </label>
                    <input
                      id="url"
                      type="url"
                      defaultValue="https://techcorp.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      About Company
                    </label>
                    <textarea
                      id="about"
                      rows="4"
                      defaultValue="Tech Corp Inc. is a leading technology company..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    ></textarea>
                  </div>
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
        />
      )}

      {openUpdate && (
        <UpdateInternshipModal
          id={selectedId}
          onClose={() => setOpenUpdate(false)}
        />
      )}

      {schedule && (
        <InterviewSchedule
          id={schedule}
          onClose={() => {
            setShowInterviewModal(false), setSchedule(null);
          }}
        />
      )}

      {showPostModal && (
        <Recruiter_PostInternshipModel
          id={id}
          onClose={() => setShowPostModal(false)}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;
