interface ExperienceSectionProps {
  isApplicant: boolean
  applicant: any
}

export default function ExperienceSection({ isApplicant, applicant }: ExperienceSectionProps) {
  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Experience</h2>

      {isApplicant && applicant ? (
        applicant.experience && applicant.experience.length > 0 ? (
          <ul className="space-y-3">
            {applicant.experience.map((exp: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-foreground/80">
                <span className="text-primary font-semibold shrink-0 mt-1">•</span>
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No experience data available yet.</p>
          </div>
        )
      ) : (
        <p className="text-muted-foreground text-center py-8">Experience is for applicants only.</p>
      )}
    </section>
  )
}
