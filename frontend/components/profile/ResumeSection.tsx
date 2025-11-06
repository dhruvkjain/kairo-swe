"use client"
import FileUpload from "@/components/FileUpload"
import DeleteResumeButton from "@/components/DeleteResumeButton"

interface ResumeSectionProps {
  isApplicant: boolean
  hasResume: boolean
  applicant: any
  profileUser: any
  isOwner: boolean
}

export default function ResumeSection({ isApplicant, hasResume, applicant, profileUser, isOwner }: ResumeSectionProps) {
  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Resume</h2>

      {isApplicant ? (
        hasResume ? (
          <div className="space-y-4">
            <a
              href={applicant.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View / Download Resume
            </a>
            {isOwner && <DeleteResumeButton userId={profileUser.id} fileUrl={applicant.resumeLink} />}
          </div>
        ) : (
          isOwner && (
            <FileUpload
              onSuccess={() => {
                // Refresh the page to show the newly uploaded resume
                window.location.reload()
              }}
              onError={(error) => {
                alert(error)
              }}
            />
          )
        )
      ) : (
        <p className="text-muted-foreground text-center py-8">Resume upload is only for applicants.</p>
      )}
    </section>
  )
}
