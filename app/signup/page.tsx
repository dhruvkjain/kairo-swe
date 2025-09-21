"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Building2, Check, Github } from "lucide-react"
import { MagneticButton } from "@/components/magnetic-button"
import { RevealAnimation } from "@/components/reveal-animation"
import { signIn } from "next-auth/react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        // After successful signup, sign in the user
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.ok) {
          router.push("/")
        }
      } else {
        const error = await response.json()
        console.error("Signup failed:", error)
      }
    } catch (error) {
      console.error("Signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" })
  }

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-32 right-10 w-28 h-28 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-60 left-20 w-36 h-36 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-lg animate-float-slow"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Signup form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <RevealAnimation>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Create Account</h2>
                <p className="text-muted-foreground">Start your internship journey today</p>
              </div>
            </RevealAnimation>

            <RevealAnimation delay={0.05}>
              <div className="space-y-3 mb-6">
                <MagneticButton
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </MagneticButton>

                <MagneticButton
                  type="button"
                  onClick={handleGitHubSignIn}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Github className="w-5 h-5" />
                  <span>Continue with GitHub</span>
                </MagneticButton>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or create account with email</span>
                </div>
              </div>
            </RevealAnimation>

            <RevealAnimation delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="w-5 h-5 text-primary bg-muted border-border rounded focus:ring-primary/50 cursor-pointer"
                    />
                    {formData.agreeToTerms && (
                      <Check className="absolute top-0.5 left-0.5 w-4 h-4 text-primary pointer-events-none" />
                    )}
                  </div>
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit button */}
                <MagneticButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                  {!isLoading && (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </MagneticButton>
              </form>
            </RevealAnimation>

            <RevealAnimation delay={0.2}>
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </RevealAnimation>

            <RevealAnimation delay={0.3}>
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center space-x-1"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back to home</span>
                </Link>
              </div>
            </RevealAnimation>
          </div>
        </div>

        {/* Right side - Creative branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-secondary/10 via-accent/5 to-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div
              className="w-full h-full bg-repeat"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2306b6d4' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 py-20">
            <RevealAnimation>
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <span className="font-heading font-bold text-3xl bg-gradient-to-r from-foreground to-secondary bg-clip-text text-transparent">
                    InternExplore
                  </span>
                </div>
                <h1 className="text-4xl font-heading font-bold text-foreground mb-4 leading-tight">
                  Start your journey to
                  <span className="block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    amazing opportunities
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Join thousands of students who have found their dream internships through our platform.
                </p>
              </div>
            </RevealAnimation>

            <RevealAnimation delay={0.2}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Discover 10,000+ internship opportunities</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Get matched with top companies</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Build your professional network</span>
                </div>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </div>
  )
}
