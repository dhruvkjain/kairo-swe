"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Globe, 
  FileText, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Check, 
  Loader2,
  Eye,
  EyeOff,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterCompanyPage() {
  const router = useRouter();
  
  // Form State
  const [form, setForm] = useState({ 
    name: "", 
    industry: "", 
    website: "", 
    description: "", 
    password: "" 
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Success State (stores the generated ID)
  const [successData, setSuccessData] = useState<{ loginId: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // clear error on typing
  };

  // Copy ID to Clipboard
  const handleCopy = () => {
    if (successData?.loginId) {
      navigator.clipboard.writeText(successData.loginId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Submit Handler
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/registerCompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      // On success, switch to success view
      setSuccessData({ 
        loginId: data.loginId, // Ensure your API returns this field
        name: form.name 
      });

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Header Logo/Icon */}
        <div className="mx-auto h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6">
          <Building2 className="h-8 w-8 text-white" />
        </div>

        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
          {successData ? "Registration Successful!" : "Register your Company"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {successData 
            ? "Your account has been created" 
            : "Create an account to start hiring top talent."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[550px]">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-100">
          <CardContent className="p-8">
            
            {/* --- SUCCESS VIEW --- */}
            {successData ? (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-slate-900">Welcome, {successData.name}!</h3>
                    <p className="text-slate-500">Your company profile is active.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Your Company Login ID</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-lg font-mono font-bold text-slate-900 break-all">
                      {successData.loginId}
                    </code>
                    <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0">
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    Important: Save this ID. You will need it to log in.
                  </p>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={() => router.push("/company-login")} 
                    className="w-full text-lg py-6 bg-slate-900 hover:bg-slate-800"
                  >
                    Proceed to Login
                  </Button>
                </div>
              </div>
            ) : (
              
              /* --- FORM VIEW --- */
              <form onSubmit={submit} className="space-y-5">
                
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent sm:text-sm transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                {/* Industry & Website Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:text-sm transition-all"
                        placeholder="SaaS, Fintech..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:text-sm transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                      className="block w-full p-3 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:text-sm transition-all resize-none"
                      placeholder="Tell us briefly about what you do..."
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Create Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 sm:text-sm transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Use at least 8 characters.</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-6 text-lg bg-slate-900 hover:bg-slate-800 shadow-lg hover:scale-[1.01] transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        {!successData && (
           <p className="text-center text-xs text-slate-400 mt-8">
             By registering, you agree to Kairo's Terms of Service and Privacy Policy.
           </p>
        )}
      </div>
    </div>
  );
}