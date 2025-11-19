import { getCurrentUser } from "@/lib/auth"
import { getGitHubUser } from "@/lib/github_api"
import { fetchLeetCodeStats } from "@/lib/leetcode_api" 
import { fetchCodeforcesStats } from "@/lib/codeforces_api" // ✅ NEW: Import API
import prisma from "@/lib/prisma"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProjectsSection from "@/components/profile/ProjectsSection"
import SkillsSection from "@/components/profile/SkillsSection"
import ExperienceSection from "@/components/profile/ExperienceSection"
import ContactSection from "@/components/profile/ContactSection"
import GitHubSection from "@/components/profile/GitHubSection"
import LeetCodeSection from "@/components/profile/LeetCodeSection" 
import CodeforcesSection from "@/components/profile/CodeforcesSection" // ✅ NEW: Import Component
import LinkedInSection from "@/components/profile/LinkedInSection"
import ResumeSection from "@/components/profile/ResumeSection"
import RecruiterDashboard from "@/components/RecruiterDashboard"

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
  
  if (isApplicant && isOwner) {
    const applicant = profileUser.applicant

    const hasResume = !!applicant?.resumeLink
    const hasGitHub = !!applicant?.githubLink
    const hasLeetCode = !!applicant?.leetcodeLink
    const hasCF = !!applicant?.codeforcesLink // ✅ NEW: Check Existence
    const hasLinkedIn = !!applicant?.linkedInLink

    // --- GitHub Fetching ---
    let githubData = null
    if (hasGitHub && applicant?.githubLink) {
      try {
        const username = applicant.githubLink.split("/").pop()
        if (username) githubData = await getGitHubUser(username)
      } catch (e) {
        console.error("Error fetching GitHub data:", e)
      }
    }

    // --- LeetCode Fetching ---
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

    // --- ✅ NEW: Codeforces Fetching ---
    let cfData = null
    if (hasCF && applicant?.codeforcesLink) {
      try {
        // Extract username handles: "codeforces.com/profile/tourist" or just "tourist"
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Profile Header */}
          <ProfileHeader
            profileUser={profileUser}
            isOwner={isOwner}
            isApplicant={isApplicant}
            applicant={applicant}
            hasResume={hasResume}
            hasGitHub={hasGitHub}
            hasLinkedIn={hasLinkedIn}
          />

          {/* Main Content */}
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

              {/* Projects & Skills Tab */}
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

              {/* Experience & Contact Tab */}
              <TabsContent value="experience" className="space-y-6 mt-8">
                <ExperienceSection isApplicant={isApplicant} applicant={applicant} />
                <ContactSection
                  profileUser={profileUser}
                  isApplicant={isApplicant}
                  applicant={applicant}
                  isOwner={isOwner}
                />
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="space-y-6 mt-8">
                <GitHubSection hasGitHub={hasGitHub} githubData={githubData} applicant={applicant} isOwner={isOwner} />
                
                <LeetCodeSection 
                  hasLeetCode={hasLeetCode} 
                  leetCodeData={leetCodeData} 
                  applicant={applicant} 
                  isOwner={isOwner} 
                />

                {/* ✅ NEW: Add Codeforces Section Here */}
                <CodeforcesSection
                  hasCF={hasCF}
                  cfData={cfData}
                  applicant={applicant}
                  isOwner={isOwner}
                />

                <LinkedInSection hasLinkedIn={hasLinkedIn} applicant={applicant} isOwner={isOwner} />
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
  } else {
    return (
      <RecruiterDashboard />
    )
  }
}