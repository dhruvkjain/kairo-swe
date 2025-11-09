"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddEducationButton({ applicantId }: { applicantId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [degree, setDegree] = useState("")
  const [customDegree, setCustomDegree] = useState("") // For "Other"
  const [fieldOfStudy, setFieldOfStudy] = useState("")
  const [institution, setInstitution] = useState("")
  const [board, setBoard] = useState("")
  const [year, setYear] = useState("")
  const [grade, setGrade] = useState("") // 🆕 Grade (optional)
  const [description, setDescription] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Improved and sorted degree options
  const degreeOptions = [
    "10th Standard (SSC)",
    "12th Standard (HSC)",
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Engineering (B.E.)",
    "Bachelor of Science (B.Sc)",
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Arts (B.A.)",
    "Bachelor of Computer Applications (BCA)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Architecture (B.Arch)",
    "Bachelor of Design (B.Des)",
    "Bachelor of Pharmacy (B.Pharm)",
    "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    "Bachelor of Dental Surgery (BDS)",
    "Bachelor of Nursing (B.Sc Nursing)",
    "Diploma in Engineering",
    "Diploma in Computer Applications",
    "Diploma in Business Management",
    "Master of Technology (M.Tech)",
    "Master of Engineering (M.E.)",
    "Master of Science (M.Sc)",
    "Master of Commerce (M.Com)",
    "Master of Arts (M.A.)",
    "Master of Computer Applications (MCA)",
    "Master of Business Administration (MBA)",
    "Master of Pharmacy (M.Pharm)",
    "Master of Design (M.Des)",
    "Doctor of Philosophy (Ph.D)",
    "Doctor of Medicine (MD)",
    "Doctor of Dental Surgery (DDS)",
    "Chartered Accountancy (CA)",
    "Company Secretary (CS)",
    "Cost and Management Accountant (CMA)",
    "Certified Public Accountant (CPA)",
    "Project Management Professional (PMP)",
    "AWS Certified Solutions Architect",
    "Google Cloud Professional",
    "Cisco Certified Network Associate (CCNA)",
    "Other",
  ]

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setDegree("")
      setCustomDegree("")
      setFieldOfStudy("")
      setInstitution("")
      setBoard("")
      setYear("")
      setGrade("")
      setDescription("")
      setErrors({})
    }
  }, [open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const finalDegree = degree === "Other" ? customDegree : degree

    if (!finalDegree?.trim()) newErrors.degree = "Degree is required."
    if (!institution.trim()) newErrors.institution = "Institution is required."
    if (!year.trim()) newErrors.year = "Year is required."

    const yearRegex = /^\d{4}(\s*-\s*\d{4})?$/
    if (year && !yearRegex.test(year.trim())) {
      newErrors.year = "Use format: 2024 or 2020 - 2024"
    }

    if ((degree === "10th Standard (SSC)" || degree === "12th Standard (HSC)") && !board.trim()) {
      newErrors.board = "Board is required."
    }

    const isSecondary = ["10th Standard (SSC)", "12th Standard (HSC)"].includes(degree)
    if (!isSecondary && !fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = "Field of study is required."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setLoading(true)

    const finalDegree = degree === "Other" ? customDegree.trim() : degree

    const education = {
      id: crypto.randomUUID(),
      degree: finalDegree,
      fieldOfStudy: ["10th Standard (SSC)", "12th Standard (HSC)"].includes(degree) ? undefined : fieldOfStudy.trim(),
      institution: institution.trim(),
      board: ["10th Standard (SSC)", "12th Standard (HSC)"].includes(degree) ? board.trim() : undefined,
      year: year.trim(),
      grade: grade.trim() || undefined, // 🆕 Optional grade field
      description: description.trim() || undefined,
    }

    try {
      const res = await fetch("/api/auth/profile/add-education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, education }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to save")
      }

      router.refresh()
      setOpen(false)
    } catch (err: any) {
      alert(err.message || "Failed to save education")
    } finally {
      setLoading(false)
    }
  }

  const isSecondary = degree === "10th Standard (SSC)" || degree === "12th Standard (HSC)"
  const showFieldOfStudy = degree && !isSecondary
  const showBoard = isSecondary

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        Add Education
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Degree */}
            <div className="space-y-1">
              <Label htmlFor="degree">Degree</Label>
              <Select value={degree} onValueChange={setDegree} disabled={loading}>
                <SelectTrigger id="degree">
                  <SelectValue placeholder="Select your degree" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {degreeOptions.map((deg) => (
                    <SelectItem key={deg} value={deg}>
                      {deg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.degree && <p className="text-sm text-destructive">{errors.degree}</p>}
            </div>

            {/* Custom Degree */}
            {degree === "Other" && (
              <div className="space-y-1">
                <Label htmlFor="customDegree">Specify Degree</Label>
                <Input
                  id="customDegree"
                  value={customDegree}
                  onChange={(e) => setCustomDegree(e.target.value)}
                  placeholder="e.g., Certified Scrum Master"
                  disabled={loading}
                />
                {errors.degree && <p className="text-sm text-destructive">{errors.degree}</p>}
              </div>
            )}

            {/* Field of Study */}
            {showFieldOfStudy && (
              <div className="space-y-1">
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g., Computer Science, Finance"
                  disabled={loading}
                />
                {errors.fieldOfStudy && <p className="text-sm text-destructive">{errors.fieldOfStudy}</p>}
              </div>
            )}

            {/* Institution */}
            <div className="space-y-1">
              <Label htmlFor="institution">
                {showBoard ? "School Name" : "College / University"}
              </Label>
              <Input
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder={showBoard ? "e.g., St. Xavier's High School" : "e.g., Delhi University"}
                disabled={loading}
              />
              {errors.institution && <p className="text-sm text-destructive">{errors.institution}</p>}
            </div>

            {/* Board */}
            {showBoard && (
              <div className="space-y-1">
                <Label htmlFor="board">Board</Label>
                <Input
                  id="board"
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  placeholder="e.g., CBSE, ICSE"
                  disabled={loading}
                />
                {errors.board && <p className="text-sm text-destructive">{errors.board}</p>}
              </div>
            )}

            {/* Year */}
            <div className="space-y-1">
              <Label htmlFor="year">Year of Completion</Label>
              <Input
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., 2024 or 2020 - 2024"
                disabled={loading}
              />
              {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
            </div>

            {/* Grade (optional) */}
            <div className="space-y-1">
              <Label htmlFor="grade">Grade / CGPA (Optional)</Label>
              <Input
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g., 9.2 CGPA, 85%, A+"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Grades, achievements, projects, specialization..."
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Education"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
