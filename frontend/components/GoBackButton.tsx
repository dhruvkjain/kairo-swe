"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function GoBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition"
    >
      <ArrowLeft className="w-4 h-4" />
      Go Back
    </button>
  );
}