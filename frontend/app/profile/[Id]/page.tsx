import { redirect } from "next/navigation";
import ImageManager from "@/components/ImageManager";
import UploadProfileForm from "@/components/UploadProfileForm";
import FileUpload from "@/components/FileUpload";
import DeleteResumeButton from "@/components/DeleteResumeButton";
import GithubButton from "@/components/GithubButton";
import LinkedinButton from "@/components/LinkedinButton";
import { getGitHubUser } from "@/lib/GithubAPI";
import AddAboutButton from "@/components/AddAboutButton";
import AddSkillButton from "@/components/AddSkillButton";
import DeleteSkill from "@/components/DeleteSkill";
import EditNameButton from "@/components/profile/EditNameButton";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import AddProjectButton from "@/components/AddProjectButton";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import EditProjectButton from "@/components/EditProjectButton";
import ContactButton from "@/components/ContactButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default async function ProfilePage({ params }: { params: { Id: string } }) {
  const sessionToken = cookies().get("sessionToken")?.value;
  if (!sessionToken) redirect("/login");

  // Get current session user
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });
  if (!session) redirect("/login");

  const loggedInUser = session.user;

  // Fetch the profile being viewed by ID
  const profileUser = await prisma.user.findUnique({
    where: { id: params.Id },
    include: {
      applicant: true,
      recruiter: true,
    },
  });

  if (!profileUser) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        User not found.
      </div>
    );
  }

  // Determine ownership and roles
  const isOwner = loggedInUser.id === profileUser.id;
  const isApplicant = profileUser.role === "APPLICANT";
  const applicant = profileUser.applicant;

  const hasResume = !!applicant?.resumeLink;
  const hasGitHub = !!applicant?.githubLink;
  const hasLinkedIn = !!applicant?.linkedInLink;

  let githubData = null;
  if (hasGitHub && applicant?.githubLink) {
    try {
      const username = applicant.githubLink.split("/").pop();
      if (username) githubData = await getGitHubUser(username);
    } catch (e) {
      console.error("Error fetching GitHub data:", e);
    }
  }

  const parsedProjects =
    applicant?.projects?.map((p) => {
      try {
        const project = JSON.parse(p);
        return {
          id: project.id || crypto.randomUUID(),
          title: project.title || "Untitled Project",
          description: project.description || "",
          skills: Array.isArray(project.skills)
            ? project.skills
            : project.skills
              ? [project.skills]
              : [],
        };
      } catch {
        return { id: crypto.randomUUID(), title: p, description: "", skills: [] };
      }
    }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* ---------- Profile Header ---------- */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-200 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex flex-col items-center">
            {profileUser.image ? (
              <ImageManager imageUrl={profileUser.image} isOwner={isOwner} />
            ) : (
              isOwner && <UploadProfileForm />
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900">{profileUser.name}</h1>
              {isOwner && (
                <EditNameButton
                  userId={profileUser.id}
                  initialName={profileUser.name || ""}
                  className="ml-2"
                />
              )}
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-slate-500">{profileUser.email}</p>
              <div className="flex flex-wrap gap-4">
                {isApplicant && hasResume && (
                  <a
                    href={applicant!.resumeLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Resume
                  </a>
                )}
                {isApplicant && hasGitHub && (
                  <a
                    href={applicant!.githubLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.755-1.332-1.755-1.087-.744.084-.729.084-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                    </svg>
                    GitHub Profile
                  </a>
                )}
                {isApplicant && hasLinkedIn && (
                  <a
                    href={applicant!.linkedInLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-3">
              {isApplicant ? (
                applicant?.about ? (
                  <p className="text-slate-700 whitespace-pre-line">{applicant.about}</p>
                ) : (
                  <p className="text-slate-500 italic">No "About" provided yet.</p>
                )
              ) : profileUser.recruiter?.about ? (
                <p className="text-slate-700 whitespace-pre-line">
                  {profileUser.recruiter.about}
                </p>
              ) : (
                <p className="text-slate-500 italic">No "About" information available.</p>
              )}

              {isOwner && (
                <AddAboutButton
                  userId={profileUser.id}
                  initialAbout={isApplicant ? applicant?.about : profileUser.recruiter?.about}
                  role={profileUser.role}
                />
              )}
            </div>
          </div>
        </div>

        {/* ---------- Tabs ---------- */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-50">
            <TabsTrigger value="projects">Projects & Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience & Contact Info</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* ---------- Projects & Skills Tab ---------- */}
          <TabsContent value="projects" className="space-y-6 mt-4">
            {/* Projects */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Projects</h2>
              {isApplicant && applicant ? (
                <>
                  {parsedProjects.length > 0 ? (
                    <div className="space-y-4">
                      {parsedProjects.map((project: any) => (
                        <div key={project.id} className="border rounded-lg p-4 bg-white hover:shadow-lg transition">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-800">{project.title}</h3>
                            {isOwner && (
                              <div className="flex gap-2">
                                <EditProjectButton userId={profileUser.id} project={project} />
                                <DeleteProjectButton
                                  userId={profileUser.id}
                                  projectId={project.id}
                                />
                              </div>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-slate-600 mt-2">{project.description}</p>
                          )}
                          {project.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {project.skills.map((skill: string) => (
                                <span key={skill} className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic mb-4">No projects yet.</p>
                  )}
                  {isOwner && (
                    <AddProjectButton
                      userId={profileUser.id}
                      initialProjects={applicant.projects || []}
                    />
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">Projects are only for applicants.</p>
              )}
            </div>

            {/* Skills */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              {isApplicant && applicant ? (
                <>
                  <div className="flex items-center gap-3">
                    <DeleteSkill userId={profileUser.id} initialSkills={applicant.skills || []} isOwner={isOwner} />
                    {isOwner && (
                      <AddSkillButton userId={profileUser.id} initialSkills={applicant.skills || []} />
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">Skills are only for applicants.</p>
              )}
            </div>
          </TabsContent>

          {/* ---------- Experience & Contact Info Tab ---------- */}
          <TabsContent value="experience" className="space-y-6 mt-4">
            {/* Experience */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Experience</h2>
              {isApplicant && applicant ? (
                applicant.experience && applicant.experience.length > 0 ? (
                  <ul className="list-disc ml-6 space-y-1 text-slate-700">
                    {applicant.experience.map((exp: string) => (
                      <li key={exp}>{exp}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No experience data available yet.</p>
                )
              ) : (
                <p className="text-gray-500 italic">Experience is for applicants only.</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
              <h2 className="text-lg font-semibold">Contact Information</h2>

              {/* Email */}
              <p>
                <span className="font-medium">Email:</span> {profileUser.email}
              </p>

              {/* Portfolio */}
              {isApplicant && applicant?.portfolioLink && (
                <p>
                  <span className="font-medium">Portfolio:</span>{" "}
                  <a
                    href={applicant.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {applicant.portfolioLink}
                  </a>
                </p>
              )}

              {/* Phone Numbers */}
              {isApplicant && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Phone Numbers</h3>
                  {applicant?.phoneNumber && applicant.phoneNumber.length > 0 ? (
                    <div className="space-y-1 text-gray-700">
                      <p>
                        <span className="font-medium">Primary:</span>{" "}
                        {applicant.phoneNumber[0] || "Not added"}
                      </p>
                      <p>
                        <span className="font-medium">Secondary:</span>{" "}
                        {applicant.phoneNumber[1] || "Not added"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No phone numbers added yet.</p>
                  )}
                  {isOwner && (
                    <div className="mt-3">
                      <ContactButton
                        userId={profileUser.id}
                        currentPhone={applicant?.phoneNumber || []}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ---------- Integrations Tab ---------- */}
          <TabsContent value="integrations" className="space-y-6 mt-4">
            {/* GitHub */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">GitHub Integration</h2>
              {hasGitHub ? (
                <div className="space-y-6">
                  {githubData ? (
                    <>
                      {/* GitHub Profile Header */}
                      <div className="flex items-start gap-4">
                        <img
                          src={githubData.avatar_url}
                          alt={`${githubData.login}'s avatar`}
                          className="w-16 h-16 rounded-full border border-slate-200"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">
                            {githubData.name || githubData.login}
                          </h3>
                          <a
                            href={applicant.githubLink!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-500 hover:text-slate-700"
                          >
                            @{githubData.login}
                          </a>
                          {githubData.company && (
                            <p className="text-sm text-slate-600 mt-1">
                              <svg className="inline-block w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              {githubData.company}
                            </p>
                          )}
                          {githubData.location && (
                            <p className="text-sm text-slate-600">
                              <svg className="inline-block w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              {githubData.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* GitHub Stats */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-700">{githubData.public_repos}</div>
                          <div className="text-sm text-slate-600">Repositories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-700">{githubData.followers}</div>
                          <div className="text-sm text-slate-600">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-700">{githubData.following}</div>
                          <div className="text-sm text-slate-600">Following</div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 text-sm text-slate-600">
                        {githubData.blog && (
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            <a href={githubData.blog} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {githubData.blog}
                            </a>
                          </p>
                        )}
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Joined {new Date(githubData.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* View Profile Button */}
                      <a
                        href={applicant.githubLink!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                        </svg>
                        View Full GitHub Profile
                      </a>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">Unable to fetch GitHub data.</p>
                  )}
                </div>
              ) : (
                isOwner && <GithubButton />
              )}
            </div>

            {/* LinkedIn */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">LinkedIn Integration</h2>
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

            {/* Resume */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Resume</h2>
              {isApplicant ? (
                hasResume ? (
                  <div className="flex flex-col items-center gap-3">
                    <a
                      href={applicant!.resumeLink!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View / Download Resume
                    </a>
                    {isOwner && (
                      <DeleteResumeButton userId={profileUser.id} fileUrl={applicant!.resumeLink!} />
                    )}
                  </div>
                ) : (
                  isOwner && <FileUpload userId={profileUser.id} />
                )
              ) : (
                <p className="text-gray-500 italic">Resume upload is only for applicants.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}