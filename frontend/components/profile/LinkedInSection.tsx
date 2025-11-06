import LinkedinButton from "@/components/LinkedinButton"

interface LinkedInSectionProps {
  hasLinkedIn: boolean
  applicant: any
  isOwner: boolean
}

export default function LinkedInSection({ hasLinkedIn, applicant, isOwner }: LinkedInSectionProps) {
  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">LinkedIn Integration</h2>

      {hasLinkedIn ? (
        <a
          href={applicant.linkedInLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
      ) : (
        isOwner && <LinkedinButton />
      )}
    </section>
  )
}
