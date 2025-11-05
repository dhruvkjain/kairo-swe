"use client";

import { useRouter } from "next/navigation";

export default function DeleteResumeButton({
  userId,
  fileUrl,
}: {
  userId: string;
  fileUrl: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;

    const res = await fetch("/api/auth/profile/DeleteResume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, fileUrl }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Resume deleted successfully!");
      router.refresh();
    } else {
      alert(data.error || "Failed to delete resume");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 rounded-md border border-gray-300 bg-white text-slate-800 hover:bg-slate-50 transition shadow-sm"
    >
      Delete Resume
    </button>
  );
}
