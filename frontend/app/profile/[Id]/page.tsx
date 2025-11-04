import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | KAIRO",
  description: "View and manage your profile",
};

interface ProfilePageProps {
  params: { Id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);

  // If no session, redirect to login
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get the current user's database record
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    redirect("/login");
  }

  // Get the profile owner's data
  const profileUser = await prisma.user.findUnique({
    where: { id: params.Id },
  });

  if (!profileUser) {
    redirect("/404");
  }

  // Get detailed profile data based on user role
  const profileData = await (async () => {
    if (profileUser.role === "APPLICANT") {
      return await prisma.applicant.findUnique({
        where: { userId: profileUser.id },
      });
    } else {
      return await prisma.recruiter.findUnique({
        where: { userId: profileUser.id },
      });
    }
  })();

  // Check if this is the logged-in user's own profile
  const isOwnProfile = currentUser.id === profileUser.id;

  return (
    <main className="min-h-screen bg-gray-50">
      <ProfileCard
        user={{
          id: profileUser.id,
          name: profileUser.name || "",
          email: profileUser.email || "",
          image: profileUser.image,
          role: profileUser.role,
        }}
        profile={{
          about: profileData?.about || null,
          linkedInLink: profileData?.linkedInLink || null,
          githubLink: 
            profileUser.role === "APPLICANT" 
              ? (profileData as any)?.githubLink || null 
              : null,
          portfolioLink: 
            profileUser.role === "APPLICANT"
              ? (profileData as any)?.portfolioLink || null
              : null,
          skills: 
            profileUser.role === "APPLICANT"
              ? (profileData as any)?.skills || []
              : [],
          experience: profileData?.experience || null,
          phoneNumber: profileData?.phoneNumber || null,
          companyName: 
            profileUser.role === "RECRUITER"
              ? (profileData as any)?.companyName || null
              : null,
          companyWebsite:
            profileUser.role === "RECRUITER"
              ? (profileData as any)?.companyWebsite || null
              : null,
          industry:
            profileUser.role === "RECRUITER"
              ? (profileData as any)?.industry || null
              : null,
        }}
        isOwnProfile={isOwnProfile}
      />
    </main>
  );
}

  if (!session) {
    console.log("No session found for token:", sessionToken);
    redirect("/login");
  }

  // Get the profile owner's data
  const profileUser = await prisma.user.findUnique({
    where: { id: params.Id },
  });

  if (!profileUser) {
    redirect("/404");
  }

  // Get detailed profile data based on user role
  const profileData = await (async () => {
    if (profileUser.role === "APPLICANT") {
      return await prisma.applicant.findUnique({
        where: { userId: profileUser.id },
      });
    } else {
      return await prisma.recruiter.findUnique({
        where: { userId: profileUser.id },
      });
    }
  })();

  // Check if this is the logged-in user's own profile
  const isOwnProfile = session.user.id === profileUser.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileCard
        user={{
          id: profileUser.id,
          name: profileUser.name || "",
          email: profileUser.email || "",
          image: profileUser.image,
          role: profileUser.role,
        }}
        profile={{
          about: profileData?.about || null,
          linkedInLink: profileData?.linkedInLink || null,
          githubLink: 
            profileUser.role === "APPLICANT" 
              ? (profileData as any)?.githubLink || null 
              : null,
          portfolioLink: 
            profileUser.role === "APPLICANT"
              ? (profileData as any)?.portfolioLink || null
              : null,
          skills: 
            profileUser.role === "APPLICANT"
              ? (profileData as any)?.skills || []
              : [],
          experience: profileData?.experience || null,
          phoneNumber: profileData?.phoneNumber || null,
          companyName: 
            profileUser.role === "RECRUITER"
              ? (profileData as any)?.companyName || null
              : null,
          companyWebsite:
            profileUser.role === "RECRUITER"
              ? (profileData as any)?.companyWebsite || null
              : null,
          industry:
            profileUser.role === "RECRUITER"
              ? (profileData as any)?.industry || null
              : null,
        }}
        isOwnProfile={isOwnProfile}
      />

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
    </div>
  );
}