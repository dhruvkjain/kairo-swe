import { Search, MapPin, ArrowRight, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FloatingElements } from "@/components/floating-elements"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealAnimation } from "@/components/reveal-animation"
import { CreativeNavigation } from "@/components/creative-navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Creative Navigation */}
      <CreativeNavigation />

      {/* Hero Section with Asymmetric Layout */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <FloatingElements />

        {/* Background with creative shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-accent/10 to-primary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <RevealAnimation delay={200}>
                <div className="space-y-6">
                  <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground text-balance leading-tight">
                    Find Your
                    <span className="text-primary transform -rotate-2 inline-block">Dream</span>
                    Internship
                  </h1>

                  <p className="text-xl text-muted-foreground max-w-lg text-pretty leading-relaxed">
                    Connect with top companies and discover opportunities that match your passion, skills, and career
                    goals.
                  </p>
                </div>
              </RevealAnimation>

              {/* Creative Search Bar */}
              <RevealAnimation delay={400}>
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-xl">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="Search internships, companies, or roles..."
                        className="pl-12 h-14 text-lg border-0 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          placeholder="Location"
                          className="pl-12 h-12 border-0 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
                        />
                      </div>
                      <MagneticButton
                        size="lg"
                        className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl"
                      >
                        Search
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </RevealAnimation>
            </div>

            {/* Right side - Visual Element */}
            {/* <RevealAnimation delay={800}>
              <div className="relative">
                <div className="relative transform rotate-6 hover:rotate-3 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-sm border border-border/50 shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-xl">
                          🚀
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-lg">Software Engineering</h3>
                          <p className="text-muted-foreground">TechCorp • Remote</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full w-4/5 animate-pulse"></div>
                        </div>
                        <p className="text-sm text-muted-foreground">Match Score: 95%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 transform -rotate-12 hover:-rotate-6 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-6 backdrop-blur-sm border border-border/50 shadow-xl">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎨</div>
                      <p className="text-sm font-medium">UX Design</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 transform rotate-12 hover:rotate-6 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl p-6 backdrop-blur-sm border border-border/50 shadow-xl">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-sm font-medium">Data Science</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealAnimation> */}
          </div>
        </div>
      </section>

      {/* Creative CTA Section */}
      <section className="py-32 bg-gradient-to-br from-foreground via-muted-foreground to-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <RevealAnimation>
            <div className="space-y-8">
              <h2 className="font-heading font-bold text-4xl lg:text-5xl text-balance">
                Ready to Launch Your
                <span className="text-primary transform -rotate-1 inline-block">Career?</span>
              </h2>
              <p className="text-xl text-background/80 max-w-2xl mx-auto text-pretty">
                Join thousands of ambitious students who have found their dream internships and kickstarted their
                careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <MagneticButton
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 px-8 py-4 text-lg rounded-2xl"
                >
                  Create Your Profile
                  <Users className="ml-2 w-5 h-5" />
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="outline"
                  className="border-foreground/30 text-foreground hover:bg-foreground/10 px-8 py-4 text-lg rounded-2xl"
>
                  Browse Internships
                  <ArrowRight className="ml-2 w-5 h-5" />
                </MagneticButton>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </section>
    </div>
  )
}
