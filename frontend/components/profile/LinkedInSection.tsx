"use client"
import LinkedinButton from "@/components/LinkedinButton"
import LinkedInDeleteButton from "@/components/LinkedInDeleteButton"

interface LinkedInSectionProps {
  hasLinkedIn: boolean
  applicant: any
  isOwner: boolean
}

export default function LinkedInSection({ hasLinkedIn, applicant, isOwner }: LinkedInSectionProps) {
  const handleDelete = () => {
    window.location.reload();
  }
  return (
    <section className="group bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
      <h2 className="text-2xl font-bold text-foreground mb-6">LinkedIn Integration</h2>

      {hasLinkedIn ? (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href={applicant.linkedInLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View LinkedIn Profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {isOwner && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <LinkedInDeleteButton userId={applicant.userId} onDelete={handleDelete}/>
            </div>
          )}
        </div>
      ) : (
        isOwner && <LinkedinButton userId={applicant.userId} />
      )}
    </section>
  )
}
