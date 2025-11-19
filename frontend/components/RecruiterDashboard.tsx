"use client";

import React, { useEffect, useState } from "react";
import Recruiter_PostInternshipModel from "./Recruiter_PostInternshipModel";
import UpdateInternshipModal from "./UpdateInternship";
import InterviewSchedule from "./interview"; 
import * as XLSX from "xlsx"; 

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
import { InternshipApplication, ApplicationStatus, InterviewMode, Gender } from "@prisma/client";

// --- INTERFACES ---

// 1. ApplicantResumeData
interface ApplicantResumeData {
  name: string;
  email: string;
  phone: string;
  appliedFor: string;
  appliedDate: string; 
  college: string; 
  cgpa: number; 
  course: string; 
  year: number; 
  experience: string; 
  skills: string[]; 
  resumeUrl: string; 
  status: string;
  university: string; 
  [key: string]: any; // Added index signature for compatibility with Json type in Prisma
}

// 2. Application
type ApplicationBase = Omit<InternshipApplication, 'resumeData' | 'gender' | 'status'>;

interface Application extends ApplicationBase {
    resumeData: ApplicantResumeData; 
    gender: Gender; 
    status: ApplicationStatus; 
}

// 3. InterviewItem
interface InterviewItem extends Application {
    interviewMode: InterviewMode | null; 
    interviewLocation: string | null;
    interviewDate: string | null;
    interviewTime: string | null;
}

// 4. DashboardStat: Added 'icon' property to fix errors 2353/2339.
interface DashboardStat {
    value: number;
    change: string;
    trend: "up" | "down";
    label: string; 
    icon: any; // Added icon property
}

// 5. DashboardStats: Uses Omit since the 'label' is added manually in the cards array.
interface DashboardStats {
    activeInternships: Omit<DashboardStat, 'label' | 'icon'>; 
    totalApplicants: Omit<DashboardStat, 'label' | 'icon'>;
    acceptedApplicants: Omit<DashboardStat, 'label' | 'icon'>;
    rejectedApplicants: Omit<DashboardStat, 'label' | 'icon'>;
}

// 6. InternshipSummary: No change.
interface InternshipSummary {
  id: string;
  title: string;
  category: string;
  location: string;
  stipend: string;
  duration: string;
  type: string;
  status: string; 
  applicationsCount: number;
  applicants: number;
  applicationDeadline: string; 
}

// 7. MonthlyStat: No change.
interface MonthlyStat {
  month: string;
  applications: number;
  shortlisted: number;
  hired: number;
  interviews: number;
}

// 8. StageData: No change.
interface StageData {
  stage: string;
  count: number;
}

// 9. ApplicantModalProps: No change.
interface ApplicantModalProps {
    applicant: Application;
    onClose: () => void;
}

type InternshipStatusFilter = "All" | "Active" | "Closed";


const RecruiterDashboard = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<InternshipSummary[]>([]);
  const [allInternships, setAllInternships] = useState<InternshipSummary[]>([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [stagesData, setStagesData] = useState<StageData[]>([]);
  const [schedule, setSchedule] = useState<string | null>(null);
  const [showinterviewModal, setShowInterviewModal] = useState(false);
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [statusViewFilter, setStatusViewFilter] = useState<InternshipStatusFilter>("All");
  const [internshipFilter, setInternshipFilter] = useState<string>("All Category");
  const [applicants, setApplicants] = useState<Application[]>([]);
  
  const recruiterId: string = id;

  // --- Data Fetching Effects ---

  // 1. Fetch Dashboard Stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res1 = await fetch(
          `/api/auth/recruiter/internshipData?recruiterId=${recruiterId}`
        );
        const data1: DashboardStats = await res1.json();
        setStats(data1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [recruiterId]);

  // 2. Fetch Interviews
  useEffect(() => {
    if (!recruiterId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/auth/recruiter/interviewSchedule?recruiterId=${recruiterId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch");
        }
        const result: { data: InterviewItem[] } = await response.json();
        setInterviews(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [recruiterId]);

  // 3. Fetch Monthly Analytics
  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/auth/recruiter/analytics`);
      if (res.ok) {
        const data: MonthlyStat[] = await res.json();
        setMonthlyStats(data);
      } else {
        console.error("Failed to fetch monthly stats");
      }
    };
    fetchStats();
  }, []);

  // 4. Fetch Hiring Funnel Data
  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/auth/recruiter/hiringFunnel`);
      if (res.ok) {
        const data: StageData[] = await res.json();
        setStagesData(data);
      } else {
        console.error("Failed to fetch monthly stats");
      }
    };
    fetchStats();
  }, []);

  // 5. Fetch Active Internships List
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
        const internshipsData: InternshipSummary[] = await response.json();
        setInternships(internshipsData);
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    loadInternships();
  }, [recruiterId]);

  // 6. Fetch Applicants List
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(
          `/api/auth/recruiter/recentApplicant?recruiterId=${recruiterId}`
        );
        const data: Application[] = await res.json();
        setApplicants(data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, [recruiterId]);

  // 7. Fetch All Internships List
  useEffect(() => {
    if (!recruiterId) return;

    const loadInternships = async () => {
      try {
        const response = await fetch(
          `/api/auth/recruiter/myAllInternship?recruiterId=${recruiterId}`
        );
        if (!response.ok) {
          console.error("Fetch error:", await response.text());
          return;
        }
        const internshipsData: InternshipSummary[] = await response.json();
        setAllInternships(internshipsData);
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    loadInternships();
  }, [recruiterId]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>No data found</p>;

  // --- Derived State & Logic ---

  // Filter Applicants for the Applicants pane based on selected Internship AND Status
  const filteredApplicants = applicants
    .filter(
      (applicant) =>
        !selectedInternship || applicant.internshipId === selectedInternship
    )
    .filter(
      (applicant) =>
        statusFilter === "All Status" || applicant.status === statusFilter
    );

  // Filter Internships for the main table
  const filteredInternships = internships.filter(
    (internship) =>
      internshipFilter === "All Category" ||
      internship.category === internshipFilter
  );
  
  // Corrected cards type and structure
  const cards: DashboardStat[] = [
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

  const deleteHandle = async (id: string) => {
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
      
      // Update UI state directly
      setInternships((prev) => prev.filter((i) => i.id !== id));
      if (selectedInternship === id) {
        setSelectedInternship(null);
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const currentDate = new Date(); 

  const isInternshipActive = (internship: InternshipSummary) => {
    const deadline = new Date(internship.applicationDeadline); 
  return deadline >= currentDate; 
  };

  const filteredInternshipsByStatus = allInternships.filter((internship) => {
      const categoryMatch =
      internshipFilter === "All Category" ||
      internship.category === internshipFilter;
    const isActive = isInternshipActive(internship);
    let statusMatch = true;

    if (statusViewFilter === "Active") {
      statusMatch = isActive;
    } else if (statusViewFilter === "Closed") {
      statusMatch = !isActive;
    }

    return categoryMatch && statusMatch;
  });

  // --- Export Logic ---

  const exportData = filteredInternships.map((i) => ({
    Internship: i.title,
    Category: i.category,
    Location: i.location,
    Stipend: i.stipend,
    Applicants: `${i.applicationsCount} applied`,
    Status: i.status,
  }));

  const handleExport = () => {
    const worksheetData = [
      ["Internship", "Category", "Location", "Stipend", "Applicants", "Status"],
      ...exportData.map((item) => [
        item.Internship,
        item.Category,
        item.Location,
        item.Stipend,
        item.Applicants,
        item.Status,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const columnWidths = worksheetData[0].map((_, colIndex) => ({
      wch: Math.max(
        ...worksheetData.map((row) =>
          row[colIndex] ? row[colIndex].toString().length : 10
        )
      ),
    }));
    worksheet["!cols"] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Internships");
    XLSX.writeFile(workbook, `${internshipFilter}_internships.xlsx`);
  };

  const exportApplicant = filteredApplicants.map((i) => ({
    name: i.resumeData.name || "",
    email: i.resumeData.email || "",
    status: i.status || "",
    cgpa: i.resumeData.cgpa || "",
    university: i.resumeData.university || "",
    appliedDate: i.resumeData.appliedDate || ""
  }));

  const handleApplicantExport = () => {
    const worksheetData = [
      ["Name", "Email", "Status", "CGPA", "University", "Applied Date"],
      ...exportApplicant.map((item) => [
        item.name,
        item.email,
        item.status,
        item.cgpa,
        item.university,
        item.appliedDate,
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

    const internshipName =
      internships.find((i) => i.id === selectedInternship)?.title ||
      "Internship";

    XLSX.writeFile(workbook, `${internshipName}_applicants.xlsx`);
  };

  // --- Status Update Logic ---

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
      
      // Update UI state directly
      setApplicants(prevApplicants => prevApplicants.map(app => 
          app.id === id ? { ...app, status: status as ApplicationStatus } : app
      ));
      setSelectedApplicant(null);
      
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

  // Demographics calculation
  const genderCounts = applicants.reduce((acc, a) => {
    const g = (a.gender || Gender.OTHER).toLowerCase();
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalApplicants = applicants.length;
  const genderPieData = [
    { name: "Male", value: genderCounts.male || 0 },
    { name: "Female", value: genderCounts.female || 0 },
    { name: "Other", value: genderCounts.other || 0 },
  ];

  // --- Components ---

  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="text-sm text-gray-600">
          Overview of key recruiting metrics
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Applicants by Gender Pie Chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700">
            Applicants by Gender
          </h4>
          <div className="mt-3 flex items-center gap-4">
            <div style={{ width: 120, height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
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
        
        {/* Gender Ratio Bar */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-1 md:col-span-2">
          <h4 className="text-sm font-medium text-gray-700">Gender Ratio Progress</h4>
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

      <div className="grid grid-cols-1 gap-6">
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
      </div>

      {/* Bar chart: Funnel / Stages (full width) */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
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
            {/* 💡 NEW STATUS FILTER: All, Active, Closed (uses statusViewFilter state) */}
            <select
              value={statusViewFilter}
              // Cast the value to the defined type for TypeScript
              onChange={(e) => setStatusViewFilter(e.target.value as InternshipStatusFilter)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value={"All"}>All Internship</option>
              <option value={"Active"}>Active Internship</option>
              <option value={"Closed"}>Closed Internship</option>
            </select>
            
            {/* Existing Category Filter */}
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

            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">
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
              {/* 💡 Use the new filtered array */}
              {filteredInternshipsByStatus.map((internship) => {
                const isActive = isInternshipActive(internship);
                const statusLabel = isActive ? "ACTIVE" : "CLOSED";
                const statusColorClass = isActive 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"; 
                
                return (
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
                          {internship.applicationsCount}
                        </span>
                        <span className="text-xs text-gray-500">
                          (applied)
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorClass}`}>
                        {statusLabel}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDE — APPLICANTS (Unchanged) */}
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

                <button
                  onClick={handleApplicantExport}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
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
                                  applicant.status === "Shortlisted"
                                    ? "bg-blue-100 text-blue-700"
                                    : applicant.status === "Interview"
                                    ? "bg-purple-100 text-purple-700"
                                    : applicant.status === "Applied"
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

                              {data.skills && data.skills.length > 4 && (
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

  const ApplicantModal = ({ applicant, onClose }: ApplicantModalProps) => {
    if (!applicant) return null;

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
                  applicant.status === "Shortlisted"
                    ? "bg-blue-100 text-blue-700"
                    : applicant.status === "Interview"
                    ? "bg-purple-100 text-purple-700"
                    : applicant.status === "Applied"
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
                      rows={4}
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

      {showinterviewModal && schedule && (
        <InterviewSchedule
          id={schedule}
          onClose={() => {
            setShowInterviewModal(false);
            setSchedule(null);
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