import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ImageManager from "@/components/ImageManager";
import UploadProfileForm from "@/components/UploadProfileForm";
import FileUpload from "@/components/FileUpload";
import DeleteResumeButton from "@/components/DeleteResumeButton";
import GithubButton from "@/components/GithubButton"; 


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

  const applicant = await prisma.applicant.findUnique({
    where: { userId: user.id },
    select: { resumeLink: true },
  });

  const isApplicant = !!applicant;
  const hasResume = applicant && applicant.resumeLink !== null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-4">{user.email}</p>
        <p className="text-sm text-green-600">Your email has been verified ✅</p>

        {user.image ? (
          <div className="mb-6">
            <ImageManager imageUrl={user.image} />
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4">No profile image uploaded.</p>
            <UploadProfileForm />
          </>
        )}

        {isApplicant ? (
          <div className="mt-6">
            {hasResume === false? (
              <FileUpload userId={user.id} />
            ) : (
              <div className="flex flex-col gap-3 items-center">
                <a
                  href={applicant!.resumeLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Download / View Resume
                </a>

                <DeleteResumeButton userId={user.id} fileUrl={applicant!.resumeLink!} />
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">You are registered as a recruiter. Resume upload is disabled.</p>
        )}
      </div>
      <GithubButton />
    </div>
  );
}
