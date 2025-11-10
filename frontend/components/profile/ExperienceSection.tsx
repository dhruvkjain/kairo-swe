"use client"

import { useState } from "react"
import AddExperienceButton from "@/components/AddExperienceButton"
import { Button } from "@/components/ui/button"
import DeleteExperienceButton from "@/components/DeleteExperienceButton"

interface Experience {
  id: string
  role: string
  company: string
  duration: string
  description: string
  referenceEmails?: string
}

interface ExperienceSectionProps {
  isApplicant: boolean
  applicant: any
}

export default function ExperienceSection({ isApplicant, applicant }: ExperienceSectionProps) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const parsedExperiences: Experience[] =
    applicant?.experience?.map((exp: string | Experience) => {
      try {
        return typeof exp === "string" ? JSON.parse(exp) : exp
      } catch {
        return { id: "", role: exp as string, company: "", duration: "", description: "" }
      }
    }) || []

  const [experiences, setExperiences] = useState<Experience[]>(parsedExperiences)

  const handleDelete = (deletedId: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== deletedId))
  }

  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Experience</h2>

        {isApplicant && applicant && (
          <AddExperienceButton
            userId={applicant.userId}
            initialExperiences={experiences}
          />
        )}
      </div>

      {isApplicant && applicant ? (
        experiences.length > 0 ? (
          <ul className="space-y-3">
            {experiences.map((exp, idx) => {
              const isExpanded = expanded === idx
              return (
                <li
                  key={exp.id || idx}
                  className="group border border-border p-4 rounded-lg bg-background/50 relative hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteExperienceButton
                      userId={applicant.userId}
                      experienceId={exp.id}
                      onDelete={() => handleDelete(exp.id)}
                    />
                  </div>

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
                      onClick={() => setExpanded(isExpanded ? null : idx)}
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
