// This provides mock user data for development/preview purposes
import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma

export interface MockUser {
  id: string
  name: string
  email: string
  role: "APPLICANT" | "RECRUITER"
  image?: string
  applicant?: {
    about?: string
    skills?: string[]
    projects?: string[]
    experience?: string
    phoneNumber?: string[]
    portfolioLink?: string
    resumeLink?: string
    githubLink?: string
    linkedInLink?: string
  }
  recruiter?: {
    about?: string
    company?: string
  }
}

export function getMockUser(userId: string): MockUser {
  // Return mock data based on user ID
  const mockUsers: Record<string, MockUser> = {
    test: {
      id: "test",
      name: "John Developer",
      email: "john@example.com",
      role: "APPLICANT",
      image: "/abstract-profile.png",
      applicant: {
        about: "Full-stack developer with 5 years of experience building web applications.",
        skills: ["React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS"],
        projects: [
          JSON.stringify({
            id: "1",
            title: "Project Management App",
            description: "A collaborative project management tool built with Next.js and TypeScript",
            skills: ["React", "Next.js", "TypeScript"],
          }),
          JSON.stringify({
            id: "2",
            title: "E-Commerce Platform",
            description: "Full-stack e-commerce solution with payment integration",
            skills: ["Node.js", "React", "Stripe"],
          }),
        ],
        experience: JSON.stringify([
          { company: "Tech Corp", role: "Senior Developer", years: "2021-Present" },
          { company: "StartUp Inc", role: "Full Stack Developer", years: "2019-2021" },
        ]),
        phoneNumber: ["555-0123", "555-0124"],
        portfolioLink: "https://johndeveloper.dev",
        resumeLink: "https://example.com/resume.pdf",
        githubLink: "https://github.com/johndeveloper",
        linkedInLink: "https://linkedin.com/in/johndeveloper",
      },
    },
  }

  return mockUsers[userId] || mockUsers.test
}

export { prisma }
export default prisma
