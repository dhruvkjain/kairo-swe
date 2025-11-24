import { getCurrentUser } from "@/lib/auth"
import { getGitHubUser } from "@/lib/github_api"
import { fetchLeetCodeStats } from "@/lib/leetcode_api"
import { fetchCodeforcesStats } from "@/lib/codeforces_api"
import prisma from "@/lib/prisma"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProjectsSection from "@/components/profile/ProjectsSection"
import SkillsSection from "@/components/profile/SkillsSection"
import ExperienceSection from "@/components/profile/ExperienceSection"
import ContactSection from "@/components/profile/ContactSection"
import GitHubSection from "@/components/profile/GitHubSection"
import LeetCodeSection from "@/components/profile/LeetCodeSection"
import CodeforcesSection from "@/components/profile/CodeforcesSection"
import LinkedInSection from "@/components/profile/LinkedInSection"
import ResumeSection from "@/components/profile/ResumeSection"
import RecruiterDashboard from "@/components/RecruiterDashboard"
import { Briefcase, LogOut } from "lucide-react"
import Link from "next/link"
import crypto from "crypto"
import GoBackButton from "@/components/GoBackButton"
import logoImage from "@/components/Kairo_logo.jpg";

export default async function ProfilePage({ params }: { params: { Id: string } }) {
  const loggedInUser = await getCurrentUser()

  const profileUser = await prisma.user.findUnique({
    where: { id: params.Id },
    include: {
      applicant: true,
      recruiter: true,
    },
  })

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">User not found</p>
          <p className="text-muted-foreground text-sm">This profile doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const isOwner = loggedInUser?.id === profileUser.id
  const isApplicant = profileUser.role === "APPLICANT"

  // Show applicant profile for everyone; edit/delete logic inside child components uses isOwner && isApplicant
  if (isApplicant) {
    const applicant = profileUser.applicant

    const hasResume = !!applicant?.resumeLink
    const hasGitHub = !!applicant?.githubLink
    const hasLeetCode = !!applicant?.leetcodeLink
    const hasCF = !!applicant?.codeforcesLink
    const hasLinkedIn = !!applicant?.linkedInLink

    let githubData = null
    if (hasGitHub && applicant?.githubLink) {
      try {
        const username = applicant.githubLink.split("/").pop()
        if (username) githubData = await getGitHubUser(username)
      } catch (e) {
        console.error("Error fetching GitHub data:", e)
      }
    }

    let leetCodeData = null
    if (hasLeetCode && applicant?.leetcodeLink) {
      try {
        const parts = applicant.leetcodeLink.split("/")
        const username = parts[parts.length - 1] || parts[parts.length - 2]
        if (username) {
          leetCodeData = await fetchLeetCodeStats(username)
        }
      } catch (e) {
        console.error("Error fetching LeetCode data:", e)
      }
    }

    let cfData = null
    if (hasCF && applicant?.codeforcesLink) {
      try {
        const parts = applicant.codeforcesLink.split("/")
        const handle = parts[parts.length - 1] || parts[parts.length - 2]
        if (handle) {
          cfData = await fetchCodeforcesStats(handle)
        }
      } catch (e) {
        console.error("Error fetching Codeforces data:", e)
      }
    }

    const parsedProjects =
      applicant?.projects?.map((p: string) => {
        try {
          const project = JSON.parse(p)
          return {
            id: project.id || crypto.randomUUID(),
            title: project.title || "Untitled Project",
            description: project.description || "",
            skills: Array.isArray(project.skills) ? project.skills : project.skills ? [project.skills] : [],
          }
        } catch {
          return { id: crypto.randomUUID(), title: p, description: "", skills: [] }
        }
      }) || []

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
            <Link href="/">
              <div className="flex items-center gap-3">
                <img
                  src={logoImage.src}
                  alt="Kairo Internships Logo"
                  className="h-10 w-auto rounded-xl"
                />
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight"></h1>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <GoBackButton />
              {isOwner && (
                <Link
                  href={`/student_dashboard/${params.Id}/appliedInternship`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition"
                >
                  <Briefcase className="w-4 h-4" />
                  Applied Internships
                </Link>
              )}
              <Link
                href={`/student_dashboard/${params.Id}`}
                className="relative"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${params.Id}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-800 hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </Link>
              {isOwner && (
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <ProfileHeader
            profileUser={profileUser}
            isOwner={isOwner}
            isApplicant={isApplicant}
            applicant={applicant}
            hasResume={hasResume}
            hasGitHub={hasGitHub}
            hasLinkedIn={hasLinkedIn}
          />

          <div className="mt-12">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3 bg-muted/50 border border-border rounded-lg p-1">
                <TabsTrigger value="projects" className="text-sm font-medium">
                  Projects & Skills
                </TabsTrigger>
                <TabsTrigger value="experience" className="text-sm font-medium">
                  Experience & Contact
                </TabsTrigger>
                <TabsTrigger value="integrations" className="text-sm font-medium">
                  Integrations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-6 mt-8">
                <ProjectsSection
                  isApplicant={isApplicant}
                  applicant={applicant}
                  parsedProjects={parsedProjects}
                  profileUser={profileUser}
                  isOwner={isOwner}
                />
                <SkillsSection
                  isApplicant={isApplicant}
                  applicant={applicant}
                  profileUser={profileUser}
                  isOwner={isOwner}
                />
              </TabsContent>

              <TabsContent value="experience" className="space-y-6 mt-8">
                <ExperienceSection
                  isApplicant={isApplicant}
                  applicant={applicant}
                  isOwner={isOwner}
                />
                <ContactSection
                  profileUser={profileUser}
                  isApplicant={isApplicant}
                  applicant={applicant}
                  isOwner={isOwner}
                />
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6 mt-8">
                <GitHubSection
                  hasGitHub={hasGitHub}
                  githubData={githubData}
                  applicant={applicant}
                  isOwner={isOwner}
                />
                <LeetCodeSection
                  hasLeetCode={hasLeetCode}
                  leetCodeData={leetCodeData}
                  applicant={applicant}
                  isOwner={isOwner}
                />
                <CodeforcesSection
                  hasCF={hasCF}
                  cfData={cfData}
                  applicant={applicant}
                  isOwner={isOwner}
                />
                <LinkedInSection
                  hasLinkedIn={hasLinkedIn}
                  applicant={applicant}
                  isOwner={isOwner}
                />
                <ResumeSection
                  isApplicant={isApplicant}
                  hasResume={hasResume}
                  applicant={applicant}
                  profileUser={profileUser}
                  isOwner={isOwner}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  return <RecruiterDashboard />
}