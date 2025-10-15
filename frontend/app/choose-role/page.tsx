"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChooseRolePage() {
  const [role, setRole] = useState("DEVELOPER");
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await fetch("/api/auth/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      router.push("/dashboard"); // or `/developer` vs `/recruiter`
    } else {
      alert("Error setting role");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
        <h1 className="text-xl font-bold">Choose Your Role</h1>

        <div className="flex space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="DEVELOPER"
              checked={role === "DEVELOPER"}
              onChange={(e) => setRole(e.target.value)}
              className="w-4 h-4"
            />
            <span>Developer</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="RECRUITER"
              checked={role === "RECRUITER"}
              onChange={(e) => setRole(e.target.value)}
              className="w-4 h-4"
            />
            <span>Recruiter</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white px-4 py-2 rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
