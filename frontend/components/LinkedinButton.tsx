"use client";

import { useState } from "react";

export default function LinkedinButton() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setError("");
    setUserData(null);

    if (!username.trim()) {
      setError("Please enter a LinkedIn username or link");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/profile/LinkedinAttach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedin: username }), // ✅ fixed key
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save LinkedIn link");

      setUserData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm max-w-md mx-auto space-y-3 bg-white">
      <h2 className="text-xl font-serif font-semibold text-slate-900">Attach LinkedIn Profile</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter LinkedIn username or link..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 border border-gray-300 px-3 py-2 rounded-md"
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          className="px-4 py-2 rounded-md border border-gray-300 bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Attach"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {userData && (
        <div className="mt-4 border-t pt-4">
          <p className="text-slate-700 font-semibold">LinkedIn profile saved successfully!</p>
          <a
            href={userData.linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-800 hover:underline break-all"
          >
            {userData.linkedinLink}
          </a>
        </div>
      )}
    </div>
  );
}
