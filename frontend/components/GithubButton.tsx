"use client";

import { useState } from "react";

export default function GithubButton() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setError("");
    setUserData(null);

    if (!username.trim()) {
      setError("Please enter a GitHub username or link");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/profile/GitHubAttach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user");

      setUserData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm max-w-md mx-auto space-y-3 bg-white">
      <h2 className="text-xl font-serif font-semibold text-slate-900">GitHub User Lookup</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter GitHub username or link..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 border border-gray-300 px-3 py-2 rounded-md"
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          className="px-4 py-2 rounded-md border border-gray-300 bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {userData && (
        <div className="mt-4 flex items-center gap-4 border-t pt-4">
          <img
            src={userData.avatar_url}
            alt={userData.login}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-serif font-semibold text-lg text-slate-900">{userData.name || userData.login}</p>
            <p className="text-sm text-slate-500">{userData.location || "—"}</p>
            <p className="text-sm">Followers: {userData.followers} | Repos: {userData.public_repos}</p>
          </div>
        </div>
      )}
    </div>
  );
}
