import AddProjectButton from "@/components/AddProjectButton"
import EditProjectButton from "@/components/EditProjectButton"
import DeleteProjectButton from "@/components/DeleteProjectButton"

interface ProjectProps {
  id: string
  title: string
  description: string
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
          {parsedProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {parsedProjects.map((project: ProjectProps) => (
                <div
                  key={project.id}
                  className="group border border-border rounded-lg p-5 bg-muted/30 hover:shadow-md hover:border-primary/50 transition-all"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors flex-1">
                      {project.title}
                    </h3>
                    {isOwner && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditProjectButton userId={profileUser.id} project={project} />
                        <DeleteProjectButton userId={profileUser.id} projectId={project.id} />
                      </div>
                    )}
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
