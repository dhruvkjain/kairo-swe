"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, User as UserIcon, AlertCircle } from "lucide-react";

// 1. Define Data Interface
interface Recruiter {
  id: string;
  position: string | null;
  contactEmail: string | null;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface CompanyRecruitersProps {
  companyId: string;
}

export default function CompanyRecruiters({ companyId }: CompanyRecruitersProps) {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State to track which specific row is being deleted (to show spinner on that button)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchRecruiters = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/auth/company?companyId=${companyId}`, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setRecruiters(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load recruiting team.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, [companyId]);

  // --- Handle Delete ---
  const handleDelete = async (recruiterId: string) => {
    if (!confirm("Are you sure you want to remove this recruiter?")) return;

    setDeletingId(recruiterId);

    try {
      const res = await fetch(`/api/auth/recruiter/controllCompany?id=${recruiterId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Remove from UI immediately (Optimistic update)
      setRecruiters((prev) => prev.filter((r) => r.id !== recruiterId));
      
    } catch (err) {
      alert("Failed to delete recruiter. Please try again.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading team data...</span>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">Recruiting Team</h3>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
          {recruiters.length} Members
        </span>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Contact Email</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recruiters.length > 0 ? (
              recruiters.map((recruiter) => (
                <tr key={recruiter.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Name Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 text-slate-400">
                        {recruiter.user.image ? (
                          <img src={recruiter.user.image} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{recruiter.user.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{recruiter.user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Position Column */}
                  <td className="px-6 py-4 text-slate-600">
                    {recruiter.position || "Recruiter"}
                  </td>

                  {/* Email Column */}
                  <td className="px-6 py-4 text-slate-600">
                    {recruiter.contactEmail || recruiter.user.email}
                  </td>

                  {/* Action Column */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(recruiter.id)}
                      disabled={deletingId === recruiter.id}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove Recruiter"
                    >
                      {deletingId === recruiter.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No recruiters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}