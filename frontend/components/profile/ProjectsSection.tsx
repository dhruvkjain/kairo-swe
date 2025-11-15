import AddProjectButton from "@/components/AddProjectButton"
import EditProjectButton from "@/components/EditProjectButton"
import DeleteProjectButton from "@/components/DeleteProjectButton"
import GitHubProjectButton from "@/components/GitHubProjectButton"

interface ProjectProps {
  id: string
  title: string
  description: string
  link?: string
  skills: string[]
}

interface ProjectsSectionProps {
  isApplicant: boolean
  applicant: any
  parsedProjects: ProjectProps[]
  profileUser: any
  isOwner: boolean
}

export default function ProjectsSection({
  isApplicant,
  applicant,
  parsedProjects,
  profileUser,
  isOwner,
}: ProjectsSectionProps) {

  // Prefer the original applicant.projects (may contain per-item JSON strings with full data)
  const source = applicant?.projects ? applicant.projects : parsedProjects ?? []

  // Robust parser: unwrap JSON strings until we get objects/arrays/primitives
  const parseRecursive = (v: any) => {
    let val = v
    while (typeof val === "string") {
      try {
        const parsed = JSON.parse(val)
        if (parsed === val) break
        val = parsed
      } catch {
        break
      }
    }
    return val
  }

  // Normalize common alternate link keys (link/url/repo)
  const normalizeLinkKey = (obj: any) => {
    if (!obj || typeof obj !== "object") return obj
    if (obj.link && typeof obj.link === "string") return obj
    const keys = Object.keys(obj)
    for (const k of keys) {
      const lk = k.toLowerCase()
      if ((lk.includes("link") || lk.includes("url") || lk.includes("repo")) && typeof obj[k] === "string") {
        obj.link = obj[k]
        break
      }
    }
    return obj
  }

  const projects = (() => {
    const data = parseRecursive(source)
    if (!Array.isArray(data)) return []
    return data
      .map((item) => parseRecursive(item))
      .map((item) => (typeof item === "object" ? normalizeLinkKey(item) : item))
      .filter(Boolean) as ProjectProps[]
  })()

  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Projects</h2>
        {isOwner && isApplicant && applicant && (
          <AddProjectButton userId={profileUser.id} initialProjects={applicant.projects || []} />
        )}
      </div>

      {isApplicant && applicant ? (
        <>
          {projects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {projects.map((project: ProjectProps) => (
                <div
                  key={project.id}
                  className="group border border-border rounded-lg p-5 bg-muted/30 hover:shadow-md hover:border-primary/50 transition-all"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors flex-1">
                      {project.title}
                    </h3>
                    
                    <div className="flex gap-2 items-center">
                      {project.link && <GitHubProjectButton link={project.link} />}

                      {isOwner && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <EditProjectButton userId={profileUser.id} project={project} />
                          <DeleteProjectButton userId={profileUser.id} projectId={project.id} />
                        </div>
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-foreground/70 text-sm mb-4 leading-relaxed">{project.description}</p>
                  )}

                  {project.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects yet.</p>
              {isOwner && <AddProjectButton userId={profileUser.id} initialProjects={applicant.projects || []} />}
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground text-center py-8">Projects are only for applicants.</p>
      )}
    </section>
  )
}
