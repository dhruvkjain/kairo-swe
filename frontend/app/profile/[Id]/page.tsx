import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ImageManager from "@/components/ImageManager";
import UploadProfileForm from "@/components/UploadProfileForm";
import FileUpload from "@/components/FileUpload";
import DeleteResumeButton from "@/components/DeleteResumeButton";
import GithubButton from "@/components/GithubButton";
import LinkedinButton from "@/components/LinkedinButton";
import { getGitHubUser } from "@/lib/GithubAPI";
import AddAboutButton from "@/components/AddAboutButton";

export default async function ProfilePage({ params }: { params: { Id: string } }) {
  const sessionToken = cookies().get("sessionToken")?.value;
  if (!sessionToken) redirect("/login");

  // Include applicant & recruiter for full user info
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        include: {
          applicant: true,
          recruiter: true,
        },
      },
    },
  });

  if (!session) redirect("/login");

  const user = session.user;
  if (!user) redirect("/login");

  // Owner check
  const isOwner = user.id === params.Id;

  // Determine if applicant or recruiter
  const isApplicant = user.role === "APPLICANT";
  const applicant = user.applicant;

  // Resume, GitHub, LinkedIn status
  const hasResume = !!applicant?.resumeLink;
  const hasGitHub = !!applicant?.githubLink;
  const hasLinkedIn = !!applicant?.linkedInLink;

  // Fetch GitHub user data if applicable
  let githubData = null;
  if (hasGitHub && applicant?.githubLink) {
    try {
      const username = applicant.githubLink.split("/").pop();
      if (username) githubData = await getGitHubUser(username);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-4">{user.email}</p>
        <p className="text-sm text-green-600 mb-4">Your email has been verified ✅</p>

        {/* Profile Image */}
        {user.image ? (
          <div className="mb-6">
            <ImageManager imageUrl={user.image} />
          </div>
        ) : (
          isOwner && (
            <>
              <p className="text-gray-500 mb-4">No profile image uploaded.</p>
              <UploadProfileForm />
            </>
          )
        )}

        {/* Resume Section */}
        {isApplicant ? (
          <div className="mt-6">
            {hasResume ? (
              <div className="flex flex-col gap-3 items-center">
                <a
                  href={applicant!.resumeLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View / Download Resume
                </a>
                {isOwner && (
                  <DeleteResumeButton userId={user.id} fileUrl={applicant!.resumeLink!} />
                )}
              </div>
            ) : (
              isOwner && <FileUpload userId={user.id} />
            )}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">
            You are registered as a recruiter. Resume upload is disabled.
          </p>
        )}

        {/* GitHub Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">GitHub Profile</h2>
          {hasGitHub ? (
            <div className="flex flex-col gap-3 items-center">
              <a
                href={applicant.githubLink!}
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
            isOwner && <GithubButton />
          )}
        </div>

        {/* LinkedIn Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">LinkedIn Profile</h2>
          {hasLinkedIn ? (
            <a
              href={applicant.linkedInLink!}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View LinkedIn Profile
            </a>
          ) : (
            isOwner && <LinkedinButton />
          )}
        </div>

        {/* About Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>

          {isApplicant ? (
            applicant?.about ? (
              <p className="text-gray-700 mb-4 whitespace-pre-line">{applicant.about}</p>
            ) : (
              <p className="text-gray-500 mb-4 italic">
                No "About" information provided yet. Tell us something about yourself!
              </p>
            )
          ) : user.recruiter?.about ? (
            <p className="text-gray-700 mb-4 whitespace-pre-line">{user.recruiter.about}</p>
          ) : (
            <p className="text-gray-500 mb-4 italic">
              No "About" section available. Add details about your company or role!
            </p>
          )}

          {/* Only owner can add or edit About */}
          {isOwner && (
            <AddAboutButton
              userId={user.id}
              initialAbout={isApplicant ? applicant?.about : user.recruiter?.about}
              role={user.role}
            />
          )}
        </div>
      </div>
    </div>
  );
}
