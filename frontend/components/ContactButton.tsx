"use client";

import React, { useState } from "react";
import { Phone, Loader2 } from "lucide-react";

export default function ContactButton({
  userId,
  currentPhone,
}: {
  userId: string;
  currentPhone?: string[];
}) {
  const [primaryPhone, setPrimaryPhone] = useState(currentPhone?.[0] || "");
  const [secondaryPhone, setSecondaryPhone] = useState(currentPhone?.[1] || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    if (!primaryPhone.trim()) {
      alert("Primary phone number is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/profile/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, primaryPhone, secondaryPhone }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Contact numbers updated successfully!");
        setIsEditing(false);
      } else {
        setMessage(`❌ ${data.error || "Failed to update contact info"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm p-4 border rounded-lg shadow-sm bg-white text-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <Phone className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-serif font-semibold">Contact Info</h3>
      </div>

      <div className="space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Primary Phone *</label>
              <input
                type="tel"
                placeholder="Enter primary phone number"
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Secondary Phone (optional)</label>
              <input
                type="tel"
                placeholder="Enter secondary phone number"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleUpdate} disabled={loading} className="px-4 py-2 rounded-md bg-slate-800 text-white">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="px-4 py-2 rounded-md border border-gray-300 bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Primary:</strong>{" "}
              {primaryPhone || <span className="text-slate-400">Not added</span>}
            </p>
            <p>
              <strong>Secondary:</strong>{" "}
              {secondaryPhone || <span className="text-slate-400">Not added</span>}
            </p>
            <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 rounded-md border border-gray-300 bg-white">
              Edit
            </button>
          </div>
        )}
        {message && <p className="text-sm text-slate-700 mt-2">{message}</p>}
      </div>
    </div>
  );
}
