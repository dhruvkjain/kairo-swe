"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { LogOut, Upload } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // redirect to home
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null; // nothing while redirecting

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 text-white">
        {/* Profile Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/90 hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Image
              src={
                preview ||
                session.user?.image ||
                "https://avatar.iran.liara.run/public/50"
              }
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-white/20"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg transition"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Click the icon to change profile picture
          </p>
        </div>

        {/* Profile Info */}
        <div className="space-y-3">
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Name</p>
            <p className="font-medium">{session.user?.name}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium">{session.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
