"use client";
import React, { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  UserCircle,
  Users,
  Briefcase,
  Search,
  Calendar,
  Download,
} from "lucide-react";
import Link from "next/link";

// ---------------- TYPES ----------------
interface BarData {
  month: string;
  applications: number;
  hired: number;
}
interface PieData {
  name: string;
  value: number;
}
interface SourceData {
  name: string;
  value: number;
}
interface RadialData {
  name: string;
  uv: number;
}

// ---------------- DATA ----------------
const appliedVsHired: BarData[] = [
  { month: "Jan", applications: 120, hired: 10 },
  { month: "Feb", applications: 100, hired: 8 },
  { month: "Mar", applications: 140, hired: 12 },
  { month: "Apr", applications: 110, hired: 9 },
  { month: "May", applications: 150, hired: 20 },
  { month: "Jun", applications: 170, hired: 18 },
  { month: "Jul", applications: 160, hired: 16 },
  { month: "Aug", applications: 140, hired: 14 },
  { month: "Sep", applications: 130, hired: 11 },
  { month: "Oct", applications: 150, hired: 15 },
  { month: "Nov", applications: 165, hired: 17 },
  { month: "Dec", applications: 180, hired: 19 },
];

const donutData: PieData[] = [
  { name: "Applied", value: 400 },
  { name: "Round1 Shortlisted", value: 120 },
  { name: "Round2 Shortlisted", value: 80 },
];

const donutColors = ["#6b8cff", "#a3b3ff", "#dbe1ff"];

const sourceOfHire: SourceData[] = [
  { name: "Company Website", value: 100 },
  { name: "Job Boards", value: 50 },
  { name: "Social Media", value: 80 },
  { name: "Career Fair", value: 100 },
  { name: "Referrals", value: 70 },
];

const radialData: RadialData[] = [
  { name: "Applied", uv: 60 },
  { name: "Interviewed", uv: 25 },
  { name: "Hired", uv: 15 },
];

// ---------------- COMPONENT ----------------
const RecruiterDashboard: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-2 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-6 sticky top-6 h-[80vh]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              K
            </div>
            <div>
              <div className="text-sm font-semibold">KAIRO</div>
              <div className="text-xs text-gray-400">Recruiter Portal</div>
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-medium flex items-center gap-3">
                <Users size={16} /> Dashboard
              </li>
              <li className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                <UserCircle size={16} /> Employees
              </li>
              <li className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                <Briefcase size={16} /> Openings
              </li>
              <li className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                <Calendar size={16} /> Schedules
              </li>
            </ul>
          </nav>

          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} KAIRO
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-semibold">Recruiters Dashboard</div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Search size={16} />
                <input
                  className="outline-none text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                01Jan2022 - 31Dec2022
              </div>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg shadow hover:bg-indigo-700">
                <Download size={16} /> Export
              </button>

              {/* Avatar linked to Profile Page */}
              <Link href="/profile" aria-label="Profile">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden hover:opacity-80 transition">
                  <img
                    src="https://i.pravatar.cc/40?u=kairo"
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-xs text-gray-400">Applied Candidates</div>
              <div className="text-2xl font-semibold text-indigo-700">400</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-xs text-gray-400">Hired Candidates</div>
              <div className="text-2xl font-semibold text-green-600">200</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-xs text-gray-400">Open Positions</div>
              <div className="text-2xl font-semibold text-indigo-600">240</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Avg Cost Per Hire</div>
                <div className="text-2xl font-semibold">$12</div>
              </div>
              <div className="text-sm text-gray-300">⚡</div>
            </div>
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7 bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium mb-2">Job Applied vs Hired</div>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={appliedVsHired}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="applications"
                      stackId="a"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="hired"
                      stackId="a"
                      radius={[6, 6, 0, 0]}
                      fill="#22c55e"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-5 bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium mb-2">
                Application Progression
              </div>
              <div
                style={{ width: "100%", height: 260 }}
                className="flex items-center justify-center"
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {donutData.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={donutColors[idx % donutColors.length]}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-4 bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium mb-2">
                Offer letter Acceptance
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-xl">
                  75%
                </div>
                <div className="text-gray-500 text-sm">
                  Acceptance: 75%
                  <br />
                  Rejection: 15%
                </div>
              </div>
            </div>

            <div className="col-span-4 bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium mb-2">LGBTQIA+ Inclusion</div>
              <div style={{ width: "100%", height: 150 }}>
                <ResponsiveContainer>
                  <RadialBarChart
                    innerRadius="10%"
                    outerRadius="80%"
                    data={radialData}
                    startAngle={180}
                    endAngle={-180}
                  >
                    <RadialBar
                      minAngle={15}
                      label
                      background
                      clockWise
                      dataKey="uv"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-4 bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-medium mb-2">Source of Hire</div>
              <div className="space-y-2">
                {sourceOfHire.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between"
                  >
                    <div className="text-sm">{s.name}</div>
                    <div className="text-sm font-semibold">
                      {s.value}{" "}
                      <span className="text-xs text-gray-400">
                        ({Math.round((s.value / 400) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 bg-white rounded-lg p-4 shadow-sm mt-2">
              <div className="text-sm font-medium mb-2">Recent Activity</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-gray-400">New Applications</div>
                  <div className="text-lg font-semibold">120</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-gray-400">
                    Interviews Scheduled
                  </div>
                  <div className="text-lg font-semibold">32</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-gray-400">Offers Sent</div>
                  <div className="text-lg font-semibold">24</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
