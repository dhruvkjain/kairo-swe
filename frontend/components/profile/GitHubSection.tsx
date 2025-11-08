import GithubButton from "@/components/GithubButton"

interface GitHubSectionProps {
  hasGitHub: boolean
  githubData: any
  applicant: any
  isOwner: boolean
}

export default function GitHubSection({ hasGitHub, githubData, applicant, isOwner }: GitHubSectionProps) {
  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">GitHub Integration</h2>

      {hasGitHub ? (
        <div className="space-y-6">
          {githubData ? (
            <>
              {/* GitHub Profile Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-border">
                <img
                  src={githubData.avatar_url || "/placeholder.svg"}
                  alt={`${githubData.login}'s avatar`}
                  className="w-16 h-16 rounded-lg border border-border shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{githubData.name || githubData.login}</h3>
                  <a
                    href={applicant.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    @{githubData.login}
                  </a>
                  {githubData.company && <p className="text-sm text-foreground/70 mt-1">{githubData.company}</p>}
                  {githubData.location && <p className="text-sm text-foreground/70">{githubData.location}</p>}
                </div>
              </div>

              {/* GitHub Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground">{githubData.public_repos}</div>
                  <div className="text-xs text-muted-foreground mt-1">Repositories</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground">{githubData.followers}</div>
                  <div className="text-xs text-muted-foreground mt-1">Followers</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground">{githubData.following}</div>
                  <div className="text-xs text-muted-foreground mt-1">Following</div>
                </div>
              </div>

              {/* Additional Info */}
              {(githubData.blog || githubData.created_at) && (
                <div className="space-y-2 text-sm">
                  {githubData.blog && (
                    <p className="text-foreground/70">
                      <span className="text-muted-foreground">Blog: </span>
                      <a
                        href={githubData.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {githubData.blog}
                      </a>
                    </p>
                  )}
                  {githubData.created_at && (
                    <p className="text-foreground/70">
                      <span className="text-muted-foreground">Joined: </span>
                      {new Date(githubData.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              )}

              {/* View Profile Button */}
              <a
                href={applicant.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View Full GitHub Profile
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">Unable to fetch GitHub data.</p>
          )}
        </div>
      ) : (
        isOwner && <GithubButton userId={applicant.userId}/>
      )}
    </section>
  )
}
