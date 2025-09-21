import { Search, MapPin, ArrowRight, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AnimatedCounter } from "@/components/animated-counter"
import { FloatingElements } from "@/components/floating-elements"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealAnimation } from "@/components/reveal-animation"
import { CreativeNavigation } from "@/components/creative-navigation"
import { BentoGrid } from "@/components/bento-grid"
import { DiagonalSections } from "@/components/diagonal-sections"

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
                  <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 text-sm font-medium text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span>Now with AI-powered matching</span>
                  </div>

                  <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground text-balance leading-tight">
                    Find Your
                    <span className="text-primary block transform -rotate-2 inline-block">Dream</span>
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

              {/* Stats with creative layout */}
              <RevealAnimation delay={600}>
                <div className="flex items-center space-x-8">
                  {[
                    { value: 2500, suffix: "+", label: "Active Internships" },
                    { value: 500, suffix: "+", label: "Companies" },
                    { value: 95, suffix: "%", label: "Success Rate" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="text-3xl font-heading font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </RevealAnimation>
            </div>

            {/* Right side - Visual Element */}
            <RevealAnimation delay={800}>
              <div className="relative">
                {/* Creative card stack */}
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

                {/* Floating cards */}
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
            </RevealAnimation>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <BentoGrid />

      {/* Diagonal Featured Internships */}
      <DiagonalSections />

      {/* Creative Categories Section */}
      <section className="py-32 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,182,193,0.1),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealAnimation>
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
                Explore by
                <span className="text-primary block transform rotate-1 inline-block">Category</span>
              </h2>
              <p className="text-xl text-muted-foreground">Find your perfect match in any field</p>
            </div>
          </RevealAnimation>

          {/* Hexagonal grid layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Technology", icon: "💻", count: "850+", color: "from-primary/20 to-secondary/20" },
              { name: "Design", icon: "🎨", count: "320+", color: "from-secondary/20 to-accent/20" },
              { name: "Marketing", icon: "📈", count: "450+", color: "from-accent/20 to-primary/20" },
              { name: "Finance", icon: "💰", count: "280+", color: "from-primary/20 to-accent/20" },
              { name: "Healthcare", icon: "🏥", count: "190+", color: "from-secondary/20 to-primary/20" },
              { name: "Engineering", icon: "⚙️", count: "380+", color: "from-accent/20 to-secondary/20" },
            ].map((category, index) => (
              <RevealAnimation key={index} delay={index * 100}>
                <div className="group cursor-pointer">
                  <div
                    className={`aspect-square bg-gradient-to-br ${category.color} rounded-3xl p-6 border border-border/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-rotate-6 flex flex-col items-center justify-center text-center relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="text-4xl mb-4 group-hover:scale-125 transition-all duration-500 group-hover:rotate-12">
                        {category.icon}
                      </div>
                      <h3 className="font-heading font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">{category.count}</p>
                    </div>
                  </div>
                </div>
              </RevealAnimation>
            ))}
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
                <span className="text-primary block transform -rotate-1 inline-block">Career?</span>
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
                  className="border-background/30 text-background hover:bg-background/10 px-8 py-4 text-lg rounded-2xl"
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
