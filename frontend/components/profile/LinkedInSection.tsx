"use client"

import LinkedinButton from "@/components/LinkedinButton"
import LinkedInDeleteButton from "@/components/LinkedInDeleteButton"
import EditLinkedInLinkButton from "@/components/EditLinkedInLink"

interface LinkedInSectionProps {
  hasLinkedIn: boolean
  applicant: any
  isOwner: boolean
}

export default function LinkedInSection({ hasLinkedIn, applicant, isOwner }: LinkedInSectionProps) {
  const handleDelete = () => {
    window.location.reload()
  }

  return (
    <section className="group bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
      <h2 className="text-2xl font-bold text-foreground mb-6">LinkedIn Integration</h2>

      {hasLinkedIn ? (
        <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
          {/* LinkedIn link */}
          <a
            href={applicant.linkedInLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm w-full sm:w-auto"
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

          {/* Buttons in vertical stack */}
          {isOwner && (
            <div className="flex flex-col items-stretch gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <EditLinkedInLinkButton
                userId={applicant.userId}
                currentLink={applicant.linkedInLink}
              />
              <LinkedInDeleteButton userId={applicant.userId} onDelete={handleDelete} />
            </div>
          )}
        </div>
      ) : (
        isOwner && (
          <div className="flex flex-col gap-4">
            <LinkedinButton userId={applicant.userId} />
          </div>
        )
      )}
    </section>
  )
}
