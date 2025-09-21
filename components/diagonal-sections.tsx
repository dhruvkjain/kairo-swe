"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, MapPin, Clock } from "lucide-react"
import { RevealAnimation } from "./reveal-animation"
import { MagneticButton } from "./magnetic-button"

export function DiagonalSections() {
  const internships = [
    {
      company: "TechCorp",
      role: "Software Engineering Intern",
      location: "San Francisco, CA",
      type: "Full-time",
      duration: "3 months",
      rating: 4.8,
      logo: "🚀",
      tags: ["React", "Node.js", "AWS"],
      gradient: "from-primary/20 to-secondary/20",
    },
    {
      company: "DesignStudio",
      role: "UX Design Intern",
      location: "New York, NY",
      type: "Remote",
      duration: "4 months",
      rating: 4.9,
      logo: "🎨",
      tags: ["Figma", "User Research", "Prototyping"],
      gradient: "from-secondary/20 to-accent/20",
    },
    {
      company: "DataFlow",
      role: "Data Science Intern",
      location: "Austin, TX",
      type: "Hybrid",
      duration: "6 months",
      rating: 4.7,
      logo: "📊",
      tags: ["Python", "Machine Learning", "SQL"],
      gradient: "from-accent/20 to-primary/20",
    },
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Diagonal background sections */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background transform -skew-y-2 origin-top-left"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-secondary/5 transform skew-y-1 origin-bottom-right"></div>
      </div>

      <div className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealAnimation>
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6 text-balance">
                Featured
                <span className="text-primary block transform -rotate-2 inline-block">Opportunities</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Hand-picked internships from leading companies across various industries
              </p>
            </div>
          </RevealAnimation>

          {/* Staggered card layout */}
          <div className="space-y-8">
            {internships.map((internship, index) => (
              <RevealAnimation key={index} delay={index * 200}>
                <div className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <Card
                    className={`w-full max-w-2xl p-8 bg-gradient-to-br ${internship.gradient} border-border/50 backdrop-blur-sm relative overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ${index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"}`}
                  >
                    {/* Floating decoration */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:rotate-12 transition-transform duration-500">
                            {internship.logo}
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-2xl text-foreground group-hover:text-primary transition-colors">
                              {internship.role}
                            </h3>
                            <p className="text-lg text-muted-foreground">{internship.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-sm bg-background/50 rounded-full px-3 py-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="font-semibold">{internship.rating}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="w-5 h-5" />
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Clock className="w-5 h-5" />
                            <span>{internship.duration}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {internship.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="bg-background/50 hover:scale-110 transition-transform duration-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-background/50">
                          {internship.type}
                        </Badge>
                        <MagneticButton className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                          Apply Now
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </MagneticButton>
                      </div>
                    </div>
                  </Card>
                </div>
              </RevealAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
