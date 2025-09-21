"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, TrendingUp, Users, Award } from "lucide-react"
import { RevealAnimation } from "./reveal-animation"
import { MagneticButton } from "./magnetic-button"

export function BentoGrid() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealAnimation>
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6 text-balance">
              Why Choose
              <span className="text-primary block">InternExplore?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Experience the future of internship discovery with our innovative platform
            </p>
          </div>
        </RevealAnimation>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto lg:h-[600px]">
          {/* Large feature card */}
          <RevealAnimation delay={200}>
            <Card className="lg:col-span-2 lg:row-span-2 p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl lg:text-3xl mb-4 text-balance">AI-Powered Matching</h3>
                  <p className="text-muted-foreground text-lg mb-6 text-pretty">
                    Our advanced algorithm analyzes your skills, interests, and career goals to find the perfect
                    internship matches.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-background"
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">2,500+ successful matches</span>
                </div>
              </div>
            </Card>
          </RevealAnimation>

          {/* Stats card */}
          <RevealAnimation delay={400}>
            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Users className="w-8 h-8 text-secondary mb-4" />
                <div className="text-3xl font-heading font-bold text-foreground mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Partner Companies</p>
              </div>
            </Card>
          </RevealAnimation>

          {/* Success rate card */}
          <RevealAnimation delay={600}>
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20 relative overflow-hidden group">
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Award className="w-8 h-8 text-accent mb-4" />
                <div className="text-3xl font-heading font-bold text-foreground mb-2">95%</div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </Card>
          </RevealAnimation>

          {/* Featured internship preview */}
          <RevealAnimation delay={800}>
            <Card className="lg:col-span-2 p-6 bg-gradient-to-r from-background to-muted/50 border-border relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xl">
                    🚀
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-lg">Software Engineering Intern</h4>
                    <p className="text-sm text-muted-foreground">TechCorp • San Francisco</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>4.8</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {["React", "Node.js", "AWS"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Remote</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>3 months</span>
                </div>
              </div>
            </Card>
          </RevealAnimation>

          {/* CTA card */}
          <RevealAnimation delay={1000}>
            <Card className="lg:col-span-2 p-8 bg-gradient-to-br from-foreground to-muted-foreground text-background relative overflow-hidden group">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-center text-center">
                <h3 className="font-heading font-bold text-2xl mb-4">Ready to Get Started?</h3>
                <p className="text-background/80 mb-6">Join thousands of students finding their dream internships</p>
                <MagneticButton className="bg-background text-foreground hover:bg-background/90 mx-auto">
                  Create Your Profile
                </MagneticButton>
              </div>
            </Card>
          </RevealAnimation>
        </div>
      </div>
    </section>
  )
}
