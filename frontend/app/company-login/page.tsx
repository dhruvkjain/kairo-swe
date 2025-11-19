"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyLoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
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
        setError(data.error || "Login failed");
        return;
      }

      // On success, redirect to recruiter dashboard for this company
      const companyId = data.company?.id || loginId;
      router.push(`/recruiter_dashboard/${companyId}`);
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Company Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company ID</label>
          <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="COMP-XXXXXX" className="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-gray-900 text-white rounded">
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <button type="button" onClick={() => router.push("/register-company")} className="text-sm text-gray-600">
            Register a company
          </button>
        </div>
      </form>
    </main>
  );
}
