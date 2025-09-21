"use client"

import { useState, useEffect } from "react"
import { Building2, Menu, X, User, LogOut } from "lucide-react"
import { MagneticButton } from "./magnetic-button"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export function CreativeNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with creative animation */}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            </div>
            <span className="font-heading font-bold text-2xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              InternExplore
            </span>
          </Link>

          {/* Creative navigation links */}
          <div className="hidden lg:flex items-center space-x-1">
            {["Discover", "Companies", "Resources", "Stories"].map((item, index) => (
              <div key={item} className="relative group">
                <a
                  href="#"
                  className="px-6 py-3 text-muted-foreground hover:text-foreground transition-all duration-300 relative overflow-hidden rounded-full"
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
                </a>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {session.user?.name || session.user?.email?.split("@")[0]}
                  </span>
                </div>
                <MagneticButton onClick={handleSignOut} variant="ghost" className="rounded-full p-2" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </MagneticButton>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <MagneticButton variant="ghost" className="rounded-full">
                    Sign In
                  </MagneticButton>
                </Link>
                <Link href="/signup">
                  <MagneticButton className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    Get Started
                  </MagneticButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-background/95 backdrop-blur-md border-b border-border`}
      >
        <div className="px-4 py-6 space-y-4">
          {["Discover", "Companies", "Resources", "Stories"].map((item) => (
            <a
              key={item}
              href="#"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col space-y-2 pt-4 border-t border-border">
            {session ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {session.user?.name || session.user?.email?.split("@")[0]}
                  </span>
                </div>
                <MagneticButton onClick={handleSignOut} variant="ghost" className="w-full justify-start">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </MagneticButton>
              </>
            ) : (
              <>
                <Link href="/login">
                  <MagneticButton variant="ghost" className="w-full">
                    Sign In
                  </MagneticButton>
                </Link>
                <Link href="/signup">
                  <MagneticButton className="w-full bg-gradient-to-r from-primary to-secondary">
                    Get Started
                  </MagneticButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
