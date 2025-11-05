import ContactButton from "@/components/ContactButton"

interface ContactSectionProps {
  profileUser: any
  isApplicant: boolean
  applicant: any
  isOwner: boolean
}

export default function ContactSection({ profileUser, isApplicant, applicant, isOwner }: ContactSectionProps) {
  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>

      <div className="space-y-6">
        {/* Email */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">Email Address</p>
          <p className="text-foreground">{profileUser.email}</p>
        </div>

        {/* Portfolio */}
        {isApplicant && applicant?.portfolioLink && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Portfolio</p>
            <a
              href={applicant.portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              {applicant.portfolioLink}
            </a>
          </div>
        )}

        {/* Phone Numbers */}
        {isApplicant && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">Phone Numbers</p>
            {applicant?.phoneNumber && applicant.phoneNumber.length > 0 ? (
              <div className="space-y-2">
                {applicant.phoneNumber[0] && (
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Primary: </span>
                    {applicant.phoneNumber[0]}
                  </p>
                )}
                {applicant.phoneNumber[1] && (
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Secondary: </span>
                    {applicant.phoneNumber[1]}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No phone numbers added yet.</p>
            )}
            {isOwner && (
              <div className="mt-4">
                <ContactButton userId={profileUser.id} currentPhone={applicant?.phoneNumber || []} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
