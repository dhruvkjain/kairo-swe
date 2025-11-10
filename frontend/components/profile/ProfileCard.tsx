import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { ProfileForm } from "./ProfileForm";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: "APPLICANT" | "RECRUITER";
  };
  profile: {
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
  isOwnProfile: boolean;
}

export function ProfileCard({ user, profile, isOwnProfile }: ProfileCardProps) {
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-32">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Profile"}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                    {user.name?.[0].toUpperCase() || "U"}
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <span className="sr-only">Edit profile picture</span>
                  📷
                </Button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-gray-500">
                    {user.role === "APPLICANT"
                      ? "Computer Science Student | Aspiring Software Engineer"
                      : `Recruiter at ${profile.companyName || "Company"}`}
                  </p>
                </div>
                {isOwnProfile && (
                  <ProfileForm 
                    user={{
                      id: user.id,
                      role: user.role,
                    }}
                    initialData={profile}
                  />
                )}
              </div>

              <div className="flex gap-4 mt-4">
                {profile.linkedInLink && (
                  <Link href={profile.linkedInLink} target="_blank">
                    <Button variant="outline">LinkedIn</Button>
                  </Link>
                )}
                {user.role === "APPLICANT" && profile.githubLink && (
                  <Link href={profile.githubLink} target="_blank">
                    <Button variant="outline">GitHub</Button>
                  </Link>
                )}
                {user.role === "RECRUITER" && profile.companyWebsite && (
                  <Link href={profile.companyWebsite} target="_blank">
                    <Button variant="outline">Company Website</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="mt-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="experience">Experience & Skills</TabsTrigger>
              {user.role === "APPLICANT" && (
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">About</h3>
                  <p className="text-gray-600">{profile.about || "No description provided."}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <p className="text-gray-600">Email: {user.email}</p>
                  {profile.phoneNumber && (
                    <p className="text-gray-600">Phone: {profile.phoneNumber}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience">
              <div className="space-y-4">
                {user.role === "APPLICANT" && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Experience</h3>
                      <p className="text-gray-600">
                        {profile.experience || "No experience listed."}
                      </p>
                    </div>
                  </>
                )}
                {user.role === "RECRUITER" && (
                  <div>
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    <p className="text-gray-600">
                      Industry: {profile.industry || "Not specified"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {user.role === "APPLICANT" && (
              <TabsContent value="integrations">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Connected Platforms</h3>
                    <div className="grid gap-4 mt-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">GitHub</h4>
                          <p className="text-sm text-gray-500">
                            {profile.githubLink ? "Connected" : "Not connected"}
                          </p>
                        </div>
                        {isOwnProfile && (
                          <Button variant="outline">
                            {profile.githubLink ? "Disconnect" : "Connect"}
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">LinkedIn</h4>
                          <p className="text-sm text-gray-500">
                            {profile.linkedInLink ? "Connected" : "Not connected"}
                          </p>
                        </div>
                        {isOwnProfile && (
                          <Button variant="outline">
                            {profile.linkedInLink ? "Disconnect" : "Connect"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </Card>
    </div>
  );
}