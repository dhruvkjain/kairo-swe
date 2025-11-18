import React, { useState } from "react";
import { X } from "lucide-react";

interface interviewProps {
  id: string;
  onClose: () => void;
}
export default function InterviewSchedule({ id, onClose }: interviewProps) {
  const [scheduleForm, setScheduleForm] = useState({
    mode: "online",
    location: "",
    date: "",
    time: "",
  });

  async function handleSubmit() {
    try {
      const res = await fetch(`/api/auth/recruiter/interviewSchedule?applicantId=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewMode: scheduleForm.mode,
          interviewLocation:
            scheduleForm.mode === "offline" ? scheduleForm.location : "",
          interviewDate: scheduleForm.date,
          interviewTime: scheduleForm.time,
        }),
      });

      if (!res.ok) throw new Error("Failed to update schedule");

      alert("Schedule updated successfully");
      onClose();
    } catch (e) {
      console.error("Error updating schedule", e);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>

        <div className="space-y-4">
          {/* Mode */}
          <div>
            <label className="block font-medium mb-1">Interview Mode</label>
            <select
              value={scheduleForm.mode}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, mode: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Location */}
          {scheduleForm.mode === "offline" && (
            <div>
              <label className="block font-medium mb-1">Location</label>
              <input
                type="text"
                value={scheduleForm.location}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, location: e.target.value })
                }
                placeholder="Enter offline interview location"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              value={scheduleForm.date}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, date: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block font-medium mb-1">Time</label>
            <input
              type="time"
              value={scheduleForm.time}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, time: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white rounded py-2 text-center hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
