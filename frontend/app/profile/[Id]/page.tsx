import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import UploadProfileForm from '@/components/UploadProfileForm'
import DeleteImageButton from "@/components/DeleteImageButton";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const sessionToken = cookies().get("sessionToken")?.value;

  // If no session, redirect to login
  if (!sessionToken) {
    redirect("/login");
  }

  // Verify session and user
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session) {
    console.log("No session found for token:", sessionToken);
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-4">{user.email}</p>
        <p className="text-sm text-green-600">Your email has been verified ✅</p>

        {user.image ? (
          <div className="mb-6">
            <img
              src={user.image}
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full object-cover border"
            /> 
            <DeleteImageButton imageUrl={user.image} />
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No profile image uploaded.</p>
        )}
        
        <UploadProfileForm></UploadProfileForm>
      </div>
    </div>
  );
}
