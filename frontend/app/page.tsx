"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Briefcase, Users, Zap } from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      
      {/* Hero Section */}
      <div className="max-w-3xl space-y-6 animate-fadeInUp">
        {/* Logo */}
        <div className="flex justify-center mb-6 animate-bounce-slow">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center shadow-xl">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Welcome to <span className="text-gray-900">Kairo</span>
        </h1>

        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          The smart platform connecting <strong>Applicants</strong> and <strong>Recruiters</strong> seamlessly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/login">
            <Button className="px-8 py-5 text-lg shadow-md hover:scale-110 transition-all duration-300">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outline"
              className="px-8 py-5 text-lg border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white hover:scale-110 transition-all duration-300"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl px-4 animate-fadeInUp delay-200">
        {[
          {
            icon: <Users className="w-10 h-10 text-gray-900 mb-3" />,
            title: "For Applicants",
            text: "Build your professional profile and get matched with recruiters who value your skills.",
          },
          {
            icon: <Briefcase className="w-10 h-10 text-gray-900 mb-3" />,
            title: "For Recruiters",
            text: "Discover top talent effortlessly with AI-powered insights into projects and skills to hire smarter.",
          },
          {
            icon: <ArrowRight className="w-10 h-10 text-gray-900 mb-3" />,
            title: "Get Started",
            text: "Join Kairo today and experience the next generation of hiring and career growth.",
          },
        ].map((feature, index) => (
          <Card
            key={index}
            className="border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-2xl bg-white/80 backdrop-blur-sm"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-3">
              <div className="animate-fadeIn">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-24 text-gray-500 text-sm pb-8 animate-fadeInUp delay-300">
        © {new Date().getFullYear()} <span className="font-semibold text-gray-700">Kairo</span> — All rights reserved.
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2.5s infinite ease-in-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
