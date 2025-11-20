"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function CompanyLoginPage() {
  const router = useRouter();
  
  // Form State
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/companyLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials. Please try again.");
      }

      // Success: Redirect
      const companyId = data.company?.id || loginId;
      router.push(`/company/${companyId}`);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-gray-900 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Access your company dashboard</p>
        </div>

        <div className="p-8">
          <form onSubmit={submit} className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md flex items-center animate-in fade-in slide-in-from-top-2">
                 {error}
              </div>
            )}

            {/* Company ID Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Company ID</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Building2 size={18} />
                </div>
                <input
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g., COMP-88329"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-xs text-gray-500 hover:text-gray-900">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer / Register Link */}
          <div className="mt-6 text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              New to the platform?{" "}
              <button
                onClick={() => router.push("/register-company")}
                className="text-gray-900 font-semibold hover:underline"
              >
                Register your company
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}