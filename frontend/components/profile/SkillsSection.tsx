import AddSkillButton from "@/components/AddSkillButton"
import DeleteSkill from "@/components/DeleteSkill"

interface SkillsSectionProps {
  isApplicant: boolean
  applicant: any
  profileUser: any
  isOwner: boolean
}

export default function SkillsSection({ isApplicant, applicant, profileUser, isOwner }: SkillsSectionProps) {
  return (
    <section className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Skills</h2>
        {isOwner && isApplicant && applicant && (
          <AddSkillButton userId={profileUser.id} initialSkills={applicant.skills || []} />
        )}
      </div>

      {isApplicant && applicant ? (
        <DeleteSkill userId={profileUser.id} initialSkills={applicant.skills || []} isOwner={isOwner} />
      ) : (
        <p className="text-muted-foreground text-center py-8">Skills are only for applicants.</p>
      )}
    </section>
  )
}
