import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ImageManager from "@/components/ImageManager";
import UploadProfileForm from "@/components/UploadProfileForm";
import FileUpload from "@/components/FileUpload";
import DeleteResumeButton from "@/components/DeleteResumeButton";
import GithubButton from "@/components/GithubButton";
import { getGitHubUser } from "@/lib/GithubAPI";
import LinkedinButton from "@/components/LinkedinButton";
import { Link } from "lucide-react";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const sessionToken = cookies().get("sessionToken")?.value;

  // Redirect to login if no session token
  if (!sessionToken) {
    redirect("/login");
  }

  // Find the session and associated user
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session) {
    console.log("No session found for token:", sessionToken);
    redirect("/login");
  }

  const user = session.user;

  if (!user) {
    redirect("/login");
  }

  // Fetch applicant data (resume + GitHub link)
  const applicant = await prisma.applicant.findUnique({
    where: { userId: user.id },
    select: {
      resumeLink: true,
      githubLink: true,
    },
  });

  const isApplicant = !!applicant;
  const hasResume = !!applicant?.resumeLink;

  let githubData = null;

  if (applicant?.githubLink) {
    try {
      const username = applicant.githubLink.split("/").pop();
      if (username) {
        githubData = await getGitHubUser(username);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  }
  // Page layout
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md text-center">
        {/* User Info */}
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-4">{user.email}</p>
        <p className="text-sm text-green-600">Your email has been verified ✅</p>

        {/* Profile Image */}
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

        {/* Applicant Resume Section */}
        {isApplicant ? (
          <div className="mt-6">
            {hasResume === false ? (
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
          <p className="text-gray-500 mt-4">
            You are registered as a recruiter. Resume upload is disabled.
          </p>
        )}

        {/* GitHub Section */}
        {/* GitHub Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">GitHub Profile</h2>
          {applicant?.githubLink ? (
            <div className="flex flex-col gap-3 items-center">
              <a
                href={applicant.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {applicant.githubLink}
              </a>

              {githubData ? (
                <div className="text-sm text-gray-700 bg-gray-100 rounded-lg px-4 py-2 w-full max-w-xs">
                  <p><strong>Public Repositories:</strong> {githubData.public_repos}</p>
                  <p><strong>Followers:</strong> {githubData.followers}</p>
                  <p><strong>Following:</strong> {githubData.following}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Unable to fetch GitHub data.</p>
              )}

              <p className="text-sm text-gray-500">GitHub link saved in your profile ✅</p>
            </div>
          ) : (
            <GithubButton />
          )}
        </div>

      </div>
      <GithubButton />
      <LinkedinButton />
    </div>
  );
}
