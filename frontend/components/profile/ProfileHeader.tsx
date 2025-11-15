"use client"

import ImageManager from "@/components/ImageManager"
import UploadProfileForm from "@/components/UploadProfileForm"
import EditNameButton from "@/components/EditNameButton"
import AddAboutButton from "@/components/AddAboutButton"
import AddEducationButton from "@/components/AddEducationButton"
import DeleteEducationButton from "../DeleteEducationButton"
import { useState } from "react"

interface ProfileHeaderProps {
  profileUser: any
  isOwner: boolean
  isApplicant: boolean
  applicant: any
  hasResume: boolean
  hasGitHub: boolean
  hasLinkedIn: boolean
}

export default function ProfileHeader({
  profileUser,
  isOwner,
  isApplicant,
  applicant,
  hasResume,
  hasGitHub,
  hasLinkedIn,
}: ProfileHeaderProps) {
  const [educationList, setEducationList] = useState(applicant?.education || [])

  const handleEducationDeleted = (deletedId: string) => {
    setEducationList((prev: any[]) => prev.filter((edu) => edu.id !== deletedId))
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header background */}
      <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>

      <div className="px-6 sm:px-8 pb-8 -mt-16 relative">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar + Gender */}
          <div className="flex flex-col items-center shrink-0 relative z-10">
            {profileUser.image ? (
              <ImageManager imageUrl={profileUser.image} userId={profileUser.id} isOwner={isOwner} />
            ) : (
              isOwner && <UploadProfileForm />
            )}

            {/* Gender emoji under avatar */}
            {profileUser.gender && (
              <p className="text-xl mt-3">
                {profileUser.gender === "MALE" && "♂️"}
                {profileUser.gender === "FEMALE" && "♀️"}
                {profileUser.gender === "OTHER" && "⚧"}
              </p>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 pt-4">
            {/* Name + Edit */}
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{profileUser.name}</h1>
              {isOwner && <EditNameButton userId={profileUser.id} initialName={profileUser.name || ""} />}
            </div>

            {/* 🧑‍🎓 Education Section */}
            {isApplicant && (
              <div className="mb-3 bg-muted/30 rounded-lg p-3 border border-border/50">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-sm text-foreground uppercase tracking-wide">
                    Education
                  </h2>
                  {isOwner && applicant && <AddEducationButton applicantId={applicant.id} />}
                </div>

                {Array.isArray(educationList) && educationList.length > 0 ? (
                  <ul className="space-y-2">
                    {educationList.map((edu: any, i: number) => {
                      let parsedEdu = edu
                      if (typeof edu === "string") {
                        try {
                          parsedEdu = JSON.parse(edu)
                        } catch {
                          parsedEdu = { institution: edu }
                        }
                      }

                      const educationId = parsedEdu.id || `${i}`

                      return (
                        <li
                          key={educationId}
                          className="text-sm border-b border-border/30 pb-2 last:border-none"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between">
                                <div className="font-medium text-foreground">
                                  {parsedEdu.degree || "—"}
                                </div>
                                {parsedEdu.grade && (
                                  <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                                    Grade: {parsedEdu.grade}
                                  </span>
                                )}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {parsedEdu.institution}
                                {parsedEdu.year && ` • ${parsedEdu.year}`}
                                {parsedEdu.board && ` • ${parsedEdu.board}`}
                              </div>
                              {parsedEdu.description && (
                                <p className="text-xs mt-1 text-muted-foreground/80 leading-snug">
                                  {parsedEdu.description}
                                </p>
                              )}
                            </div>

                            {/* 🗑 Delete Button (Owner only) */}
                            {isOwner && (
                              <div className="ml-2 mt-1">
                                <DeleteEducationButton
                                  educationId={educationId}
                                  applicantId={applicant.id}
                                  onDeleted={() => handleEducationDeleted(educationId)}
                                />
                              </div>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic text-sm mt-1">
                    No education added yet.
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <p className="text-muted-foreground text-sm mb-4">{profileUser.email}</p>

            {/* Social Links */}
            {(hasResume || hasGitHub || hasLinkedIn) && (
              <div className="flex flex-wrap gap-3 mb-6">
                {hasResume && (
                  <a
                    href={applicant?.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Resume
                  </a>
                )}

                {hasGitHub && (
                  <a
                    href={applicant?.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.563 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
                    </svg>
                    GitHub
                  </a>
                )}

                {hasLinkedIn && (
                  <a
                    href={applicant?.linkedInLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            )}

            {/* About */}
            <div className="space-y-3">
              {isApplicant ? (
                applicant?.about ? (
                  <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                    {applicant.about}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic text-sm">No "About" provided yet.</p>
                )
              ) : profileUser.recruiter?.about ? (
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  {profileUser.recruiter.about}
                </p>
              ) : (
                <p className="text-muted-foreground italic text-sm">
                  No "About" information available.
                </p>
              )}

              {isOwner && (
                <AddAboutButton
                  userId={profileUser.id}
                  initialAbout={isApplicant ? applicant?.about : profileUser.recruiter?.about}
                  role={profileUser.role}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
