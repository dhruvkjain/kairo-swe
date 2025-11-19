"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Loader2, 
  Briefcase,
  ExternalLink
} from "lucide-react";
import logoImage from "@/components/Kairo_logo.jpg"; // Adjust path as needed

interface AppliedPageProps {
  params: { id: string };
}

// Helper to get color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case "Applied": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Shortlisted": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Interview": return "bg-orange-100 text-orange-700 border-orange-200";
    case "Hire": return "bg-green-100 text-green-700 border-green-200";
    case "Reject": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700";
  }
};

const AppliedInternships = ({ params }: AppliedPageProps) => {
  const router = useRouter();
  const userId = params.id;
  
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const res = await fetch(`/api/auth/applied?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setApplications(data);
        }
      } catch (error) {
        console.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchApplied();
  }, [userId]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-4">
            <Link href={`/student_dashboard/${userId}`}>
                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
            </Link>
            <div className="flex items-center gap-3">
               {/* Replace with your Image component logic if needed */}
               <span className="font-bold text-xl tracking-tight text-gray-800">Your Applications</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Application History</h1>
            <p className="text-gray-500 mt-2">Track the status of all your internship applications here.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : applications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                <p className="text-gray-500 mb-6">Start applying to internships to see them here.</p>
                <Link href={`/student_dashboard/${userId}`}>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                        Browse Internships
                    </button>
                </Link>
            </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                {/* Left Side: Info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{app.internship.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{app.internship.company.name}</span>
                  </div>

                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {app.internship.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex flex-col items-end gap-2">
                    {app.resumeUrl && (
                        <a 
                            href={app.resumeUrl} 
                            target="_blank" 
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                            View Submitted Resume <ExternalLink className="w-3 h-3"/>
                        </a>
                    )}
                    {/* You can add more buttons here like "Withdraw Application" if you add that logic later */}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AppliedInternships;