"use client"

import { useState } from "react"
import AddExperienceButton from "@/components/AddExperienceButton"
import { Button } from "@/components/ui/button"

interface ExperienceSectionProps {
  isApplicant: boolean
  applicant: any
}

export default function ExperienceSection({ isApplicant, applicant }: ExperienceSectionProps) {
  const parsedExperiences =
    applicant?.experience?.map((exp: string) => {
      try {
        return typeof exp === "string" ? JSON.parse(exp) : exp
      } catch {
        return { role: exp }
      }
    }) || []

  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Experience</h2>

        {isApplicant && applicant && (
          <AddExperienceButton
            userId={applicant.userId}
            initialExperiences={parsedExperiences}
          />
        )}
      </div>

      {isApplicant && applicant ? (
        parsedExperiences.length > 0 ? (
          <ul className="space-y-3">
            {parsedExperiences.map((exp: any, idx: number) => {
              const isExpanded = expanded === idx
              return (
                <li
                  key={idx}
                  className="border border-border p-4 rounded-lg bg-background/50"
                >
                  <p className="font-semibold text-foreground">
                    {exp.role} @ {exp.company}
                  </p>
                  <p className="text-sm text-muted-foreground">{exp.duration}</p>

                  {exp.description && (
                    <p
                      className={`text-sm text-foreground mt-2 ${
                        !isExpanded ? "line-clamp-2" : ""
                      }`}
                    >
                      {exp.description}
                    </p>
                  )}

                  {exp.referenceEmails && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      <span className="font-medium">References:</span>{" "}
                      {exp.referenceEmails}
                    </p>
                  )}

                  {exp.description && exp.description.length > 100 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary mt-1 p-0 h-auto"
                      onClick={() =>
                        setExpanded(isExpanded ? null : idx)
                      }
                    >
                      {isExpanded ? "See less" : "See more"}
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No experience data available yet.
          </div>
        )
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Experience section is only for applicants.
        </p>
      )}
    </section>
  )
}
