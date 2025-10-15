"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // redirect to home
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null; // nothing while redirecting

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Profile</h1>
      <p>Name: {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
