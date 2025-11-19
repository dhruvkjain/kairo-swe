"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", industry: "", website: "", description: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/auth/registerCompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult({ ok: res.ok, data });
      if (res.ok) {
        // keep the user on this page and show the loginId; optionally navigate elsewhere
        // router.push(`/company-login`);
      }
    } catch (err) {
      setResult({ ok: false, data: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Register Company</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Industry</label>
          <input
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Software"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Short description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password (for company login)</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="Choose a password for company login"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            {loading ? "Registering..." : "Register Company"}
          </button>
          <button type="button" onClick={() => router.push("/company-login")} className="text-sm text-gray-600">
            Have an account? Login
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold">{result.ok ? "Success" : "Error"}</h3>
          <pre className="text-sm mt-2">{JSON.stringify(result.data, null, 2)}</pre>
          {result.ok && result.data?.loginId && (
            <p className="mt-2">Company ID (share with recruiters): <strong>{result.data.loginId}</strong></p>
          )}
        </div>
      )}
    </main>
  );
}
