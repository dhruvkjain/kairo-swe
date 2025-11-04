import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "@/app/actions/profile";

interface ProfileFormProps {
  user: {
    id: string;
    role: "APPLICANT" | "RECRUITER";
  };
  initialData: {
    about?: string | null;
    linkedInLink?: string | null;
    githubLink?: string | null;
    portfolioLink?: string | null;
    skills?: string[];
    experience?: string | null;
    phoneNumber?: string | null;
    companyName?: string | null;
    companyWebsite?: string | null;
    industry?: string | null;
  };
}

export function ProfileForm({ user, initialData }: ProfileFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateUserProfile(user.id, formData);
    if (result.success) {
      setIsOpen(false);
    } else {
      // Handle error
      console.error(result.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          ✏️ Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.about || ""}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedIn">LinkedIn Profile</Label>
            <Input
              id="linkedIn"
              type="url"
              value={formData.linkedInLink || ""}
              onChange={(e) => setFormData({ ...formData, linkedInLink: e.target.value })}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          {user.role === "APPLICANT" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.githubLink || ""}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio Website</Label>
                <Input
                  id="portfolio"
                  type="url"
                  value={formData.portfolioLink || ""}
                  onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={formData.skills?.join(", ") || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    skills: e.target.value.split(",").map(skill => skill.trim()).filter(Boolean)
                  })}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName || ""}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={formData.companyWebsite || ""}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  placeholder="https://company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry || ""}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Technology, Finance, etc."
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              value={formData.experience || ""}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder={user.role === "APPLICANT" ? "List your work experience" : "Company description and requirements"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phoneNumber || ""}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+1234567890"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}